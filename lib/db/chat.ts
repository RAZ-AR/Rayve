import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'

type ChatMessage = Database['public']['Tables']['chat_messages']['Row']

interface MessageToSave {
  role: 'user' | 'assistant'
  content: string
}

export async function saveMessages(
  businessId: string,
  messages: MessageToSave[],
  goalId?: string,
): Promise<void> {
  if (messages.length === 0) return
  const supabase = await createClient()

  const rows = messages.map((m) => ({
    business_id: businessId,
    goal_id: goalId ?? null,
    role: m.role,
    content: m.content,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('chat_messages').insert(rows)
  if (error) throw error
}

export async function getMessagesByGoal(goalId: string): Promise<ChatMessage[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('chat_messages')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ChatMessage[]
}
