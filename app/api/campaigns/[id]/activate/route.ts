import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { updateCampaignStatus } from '@/lib/db/campaigns'
import { toMetaObjective } from '@/lib/meta/objectives'

const GRAPH = 'https://graph.facebook.com/v20.0'

interface TargetingSpec {
  duration_days?: number
  total_budget_eur?: number
  creative_direction?: string
  suggested_headline?: string
  suggested_body?: string
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Load business (ownership check implicit — getBusinessByUserId only returns user's business)
  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const token = business.meta_access_token
  const adAccountId = business.meta_ad_account_id

  if (!token) {
    return NextResponse.json({ error: 'Meta account not connected. Go to Settings to connect.' }, { status: 400 })
  }
  if (!adAccountId) {
    return NextResponse.json({ error: 'No ad account selected. Go to Settings to choose one.' }, { status: 400 })
  }

  // Load campaign — verify it belongs to this business
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: campaign, error: campErr } = await (supabase as any)
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .single()

  if (campErr || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  if (campaign.status !== 'draft') {
    return NextResponse.json({ error: `Campaign is already ${campaign.status}` }, { status: 409 })
  }

  const spec = (campaign.targeting_spec ?? {}) as TargetingSpec
  const durationDays = spec.duration_days ?? 7
  const totalBudgetEur = spec.total_budget_eur ?? 50
  // Meta daily_budget is in account currency cents
  const dailyBudgetCents = Math.round((totalBudgetEur / durationDays) * 100)

  const now = new Date()
  const startTime = now.toISOString()
  const endDate = new Date(now.getTime() + durationDays * 86_400_000)
  const endTime = endDate.toISOString()

  const metaObjective = toMetaObjective(campaign.objective ?? 'TRAFFIC')
  const actId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`

  // ── Step 1: Create Campaign ───────────────────────────────────────────────
  const campaignBody = new URLSearchParams({
    name: campaign.name,
    objective: metaObjective,
    status: 'PAUSED',
    special_ad_categories: '[]',
    access_token: token,
  })

  const campaignRes = await fetch(`${GRAPH}/${actId}/campaigns`, {
    method: 'POST',
    body: campaignBody,
  })
  const campaignJson = await campaignRes.json()

  if (!campaignRes.ok || !campaignJson.id) {
    console.error('[activate] Campaign creation failed', campaignJson)
    return NextResponse.json(
      { error: campaignJson.error?.message ?? 'Failed to create Meta campaign' },
      { status: 422 }
    )
  }

  const metaCampaignId: string = campaignJson.id

  // ── Step 2: Create Ad Set ─────────────────────────────────────────────────
  const adsetBody = new URLSearchParams({
    name: `${campaign.name} — Ad Set`,
    campaign_id: metaCampaignId,
    daily_budget: String(dailyBudgetCents),
    start_time: startTime,
    end_time: endTime,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'REACH',
    targeting: JSON.stringify({
      geo_locations: { countries: ['BE'] },
      age_min: 18,
      age_max: 65,
    }),
    status: 'PAUSED',
    access_token: token,
  })

  const adsetRes = await fetch(`${GRAPH}/${actId}/adsets`, {
    method: 'POST',
    body: adsetBody,
  })
  const adsetJson = await adsetRes.json()

  if (!adsetRes.ok || !adsetJson.id) {
    console.error('[activate] Ad set creation failed', adsetJson)
    // Attempt to delete the orphaned campaign (best effort)
    await fetch(`${GRAPH}/${metaCampaignId}`, {
      method: 'DELETE',
      body: new URLSearchParams({ access_token: token }),
    }).catch(() => {})
    return NextResponse.json(
      { error: adsetJson.error?.message ?? 'Failed to create Meta ad set' },
      { status: 422 }
    )
  }

  const metaAdsetId: string = adsetJson.id

  // ── Step 3: Save IDs + update status ─────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('campaigns')
    .update({
      meta_campaign_id: metaCampaignId,
      meta_adset_id: metaAdsetId,
      status: 'active',
    })
    .eq('id', id)

  await updateCampaignStatus(id, 'active')

  return NextResponse.json({ metaCampaignId, metaAdsetId })
}
