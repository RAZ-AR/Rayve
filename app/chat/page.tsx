import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { ChatWorkspace } from '@/components/chat/ChatWorkspace'

interface Props {
  searchParams: Promise<{ prompt?: string }>
}

export default async function ChatPage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) redirect('/onboarding')

  const { prompt } = await searchParams
  const initialInput = prompt ? decodeURIComponent(prompt) : ''

  // Surface clear error instead of runtime crash
  if (!process.env.GOOGLE_AI_API_KEY) {
    return (
      <div
        className="flex h-[calc(100vh-48px)] items-center justify-center p-8"
        style={{ background: 'var(--bg-muted)' }}
      >
        <div
          className="max-w-sm rounded-xl px-6 py-8 text-center"
          style={{
            border: '1px solid rgba(220,38,38,0.2)',
            background: 'rgba(220,38,38,0.04)',
          }}
        >
          <p className="mb-2 text-sm font-semibold" style={{ color: '#DC2626' }}>AI not configured</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Add{' '}
            <code
              className="rounded px-1 py-0.5 font-mono text-[11px]"
              style={{ background: 'var(--surface)', color: 'var(--text)' }}
            >
              GOOGLE_AI_API_KEY
            </code>{' '}
            to{' '}
            <code
              className="rounded px-1 py-0.5 font-mono text-[11px]"
              style={{ background: 'var(--surface)', color: 'var(--text)' }}
            >
              .env.local
            </code>{' '}
            and restart the server.
          </p>
        </div>
      </div>
    )
  }

  return <ChatWorkspace business={business} initialInput={initialInput} />
}
