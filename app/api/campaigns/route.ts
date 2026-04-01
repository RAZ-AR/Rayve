import { createClient } from '@/lib/supabase/server'
import { saveCampaignDraft } from '@/lib/db/campaigns'

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { proposal, businessId, goalId } = await req.json()

  if (!proposal || !businessId) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const campaign = await saveCampaignDraft(businessId, proposal, goalId)
    return Response.json({ campaignId: campaign.id })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to save campaign'
    return Response.json({ error: msg }, { status: 500 })
  }
}
