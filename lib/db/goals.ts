import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'

type Goal = Database['public']['Tables']['goals']['Row']

export async function createGoal(businessId: string, rawPrompt: string): Promise<Goal> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('goals')
    .insert({
      business_id: businessId,
      raw_prompt: rawPrompt,
      title: rawPrompt.slice(0, 120),
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw error
  return data as Goal
}

export async function getGoalsByBusiness(businessId: string): Promise<Goal[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('goals')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Goal[]
}
