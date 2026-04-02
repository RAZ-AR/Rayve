import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'

export interface AccountInsights {
  spend: number
  clicks: number
  impressions: number
  reach: number
  campaigns: number
  roas: number | null
}

/**
 * GET /api/meta/account-insights
 * Returns lifetime aggregated stats for the connected Meta ad account.
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const token = business.meta_access_token
  const adAccountId = business.meta_ad_account_id

  if (!token || !adAccountId) {
    return NextResponse.json({ insights: null, reason: 'not_connected' })
  }

  try {
    // Fetch account-level insights (lifetime)
    const fields = 'spend,clicks,impressions,reach,purchase_roas'
    const url = new URL(`https://graph.facebook.com/v20.0/${adAccountId}/insights`)
    url.searchParams.set('fields', fields)
    url.searchParams.set('date_preset', 'lifetime')
    url.searchParams.set('level', 'account')
    url.searchParams.set('access_token', token)

    const [insightsRes, campaignsRes] = await Promise.all([
      fetch(url.toString(), { next: { revalidate: 3600 } }),
      fetch(
        `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?fields=id&limit=200&access_token=${token}`,
        { next: { revalidate: 3600 } },
      ),
    ])

    const insightsJson = await insightsRes.json()
    const campaignsJson = await campaignsRes.json()

    const row = insightsJson.data?.[0]
    const campaignCount = campaignsJson.data?.length ?? 0

    // Parse ROAS (purchase_roas is an array of action objects)
    let roas: number | null = null
    if (row?.purchase_roas?.length) {
      const roasVal = parseFloat(row.purchase_roas[0]?.value ?? '0')
      if (roasVal > 0) roas = Math.round(roasVal * 100) / 100
    }

    const insights: AccountInsights = {
      spend:       Math.round(Number(row?.spend       ?? 0) * 100) / 100,
      clicks:      Number(row?.clicks      ?? 0),
      impressions: Number(row?.impressions ?? 0),
      reach:       Number(row?.reach       ?? 0),
      campaigns:   campaignCount,
      roas,
    }

    return NextResponse.json({ insights })
  } catch (err) {
    console.error('[meta/account-insights] error', err)
    return NextResponse.json({ insights: null, reason: 'api_error' })
  }
}
