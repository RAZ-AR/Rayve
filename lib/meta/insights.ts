/**
 * Meta Insights API helper
 * Fetches lifetime campaign-level metrics from Graph API v20.0
 */

const GRAPH = 'https://graph.facebook.com/v20.0'

export interface MetaInsights {
  impressions: number
  reach: number
  clicks: number
  spend: number          // EUR / account currency
  ctr: number            // %
  cpm: number            // cost per 1000 impressions
  cpp: number            // cost per result
  frequency: number
  actions: MetaAction[]
  date_start: string
  date_stop: string
}

export interface MetaAction {
  action_type: string
  value: string
}

const FIELDS = [
  'impressions',
  'reach',
  'clicks',
  'spend',
  'ctr',
  'cpm',
  'cpp',
  'frequency',
  'actions',
  'date_start',
  'date_stop',
].join(',')

/**
 * Fetch lifetime insights for a Meta campaign.
 * Returns null if the campaign has no data yet or the token is invalid.
 */
export async function fetchCampaignInsights(
  metaCampaignId: string,
  accessToken: string,
): Promise<MetaInsights | null> {
  const url = new URL(`${GRAPH}/${metaCampaignId}/insights`)
  url.searchParams.set('fields', FIELDS)
  url.searchParams.set('date_preset', 'lifetime')
  url.searchParams.set('level', 'campaign')
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString(), { next: { revalidate: 0 } })
  const json = await res.json()

  if (!res.ok) {
    console.error('[meta/insights] API error', json.error)
    return null
  }

  const row = json.data?.[0]
  if (!row) return null   // campaign has no delivery data yet

  return {
    impressions: Number(row.impressions ?? 0),
    reach:       Number(row.reach       ?? 0),
    clicks:      Number(row.clicks      ?? 0),
    spend:       Number(row.spend       ?? 0),
    ctr:         Number(row.ctr         ?? 0),
    cpm:         Number(row.cpm         ?? 0),
    cpp:         Number(row.cpp         ?? 0),
    frequency:   Number(row.frequency   ?? 0),
    actions:     (row.actions ?? []) as MetaAction[],
    date_start:  row.date_start ?? '',
    date_stop:   row.date_stop  ?? '',
  }
}
