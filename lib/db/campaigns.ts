import { createClient } from '@/lib/supabase/server'
import type { Database, Json } from '@/lib/types/database'

type Campaign = Database['public']['Tables']['campaigns']['Row']

export interface CampaignProposalData {
  name: string
  objective: string
  target_audience: string
  creative_direction: string
  suggested_headline: string
  suggested_body: string
  budget_suggestion: number
  duration_days: number
  rationale: string
}

export async function saveCampaignDraft(
  businessId: string,
  proposal: CampaignProposalData,
  goalId?: string,
): Promise<Campaign> {
  const supabase = await createClient()

  // Budget stored in cents in DB (proposal is in EUR)
  const dailyBudget = Math.round((proposal.budget_suggestion / proposal.duration_days) * 100)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('campaigns')
    .insert({
      business_id: businessId,
      goal_id: goalId ?? null,
      name: proposal.name,
      objective: proposal.objective,
      audience_summary: proposal.target_audience,
      targeting_spec: {
        creative_direction: proposal.creative_direction,
        suggested_headline: proposal.suggested_headline,
        suggested_body: proposal.suggested_body,
        rationale: proposal.rationale,
        duration_days: proposal.duration_days,
        total_budget_eur: proposal.budget_suggestion,
      } as unknown as Json,
      budget_type: 'daily',
      daily_budget: dailyBudget,
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw error
  return data as Campaign
}

export async function getCampaignsByBusiness(businessId: string): Promise<Campaign[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('campaigns')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Campaign[]
}

export async function updateCampaignStatus(
  campaignId: string,
  status: Campaign['status'],
): Promise<void> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('campaigns')
    .update({ status })
    .eq('id', campaignId)

  if (error) throw error
}
