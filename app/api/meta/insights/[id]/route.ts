import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { fetchCampaignInsights } from '@/lib/meta/insights'

const CACHE_TTL_SECONDS = 6 * 60 * 60 // 6 hours

/**
 * GET /api/meta/insights/:id
 *
 * Returns Meta Insights for a campaign. Caches result in DB for 6h.
 * If campaign has no meta_campaign_id → returns { insights: null, reason: 'not_linked' }
 * If business has no token → returns { insights: null, reason: 'not_connected' }
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  // Load campaign (ownership via business_id check)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: campaign, error: campErr } = await (supabase as any)
    .from('campaigns')
    .select('id, meta_campaign_id, insights_json, insights_fetched_at, business_id')
    .eq('id', id)
    .eq('business_id', business.id)
    .single()

  if (campErr || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  if (!campaign.meta_campaign_id) {
    return NextResponse.json({ insights: null, reason: 'not_linked' })
  }

  if (!business.meta_access_token) {
    return NextResponse.json({ insights: null, reason: 'not_connected' })
  }

  // Check cache freshness
  const fetchedAt = campaign.insights_fetched_at
    ? new Date(campaign.insights_fetched_at).getTime()
    : 0
  const ageSeconds = (Date.now() - fetchedAt) / 1000

  if (campaign.insights_json && ageSeconds < CACHE_TTL_SECONDS) {
    return NextResponse.json({ insights: campaign.insights_json, cached: true })
  }

  // Fetch fresh from Meta
  const insights = await fetchCampaignInsights(
    campaign.meta_campaign_id,
    business.meta_access_token,
  )

  // Persist to cache (even if null — so we don't hammer the API)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('campaigns')
    .update({
      insights_json: insights ?? null,
      insights_fetched_at: new Date().toISOString(),
    })
    .eq('id', id)

  return NextResponse.json({ insights, cached: false })
}
