'use client'

import { useRouter } from 'next/navigation'

interface Props {
  connected: boolean
  metaUserId: string | null
  hasAppConfigured: boolean
}

export function MetaConnect({ connected, metaUserId, hasAppConfigured }: Props) {
  const router = useRouter()

  if (!hasAppConfigured) {
    return (
      <div>
        <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Meta app credentials are not configured. Add{' '}
          <code
            className="rounded px-1 py-0.5 font-mono text-[11px]"
            style={{ background: 'var(--surface)', color: 'var(--text)' }}
          >
            FACEBOOK_APP_ID
          </code>{' '}
          and{' '}
          <code
            className="rounded px-1 py-0.5 font-mono text-[11px]"
            style={{ background: 'var(--surface)', color: 'var(--text)' }}
          >
            FACEBOOK_APP_SECRET
          </code>{' '}
          to{' '}
          <code
            className="rounded px-1 py-0.5 font-mono text-[11px]"
            style={{ background: 'var(--surface)', color: 'var(--text)' }}
          >
            .env.local
          </code>{' '}
          to enable this.
        </p>
        <button
          disabled
          className="flex h-8 cursor-not-allowed items-center rounded-lg px-4 text-xs"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
          }}
        >
          Meta connection unavailable
        </button>
      </div>
    )
  }

  if (connected) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Connected
            </p>
            {metaUserId && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Meta user ID: {metaUserId}
              </p>
            )}
          </div>
        </div>
        <a
          href="/api/meta/connect"
          className="text-xs underline-offset-2 hover:underline"
          style={{ color: 'var(--text-muted)' }}
        >
          Reconnect
        </a>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Connect your Meta Ads account to launch real campaigns on Facebook and Instagram.
      </p>
      <a
        href="/api/meta/connect"
        className="inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: 'var(--accent)' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M7 1v12M1 7h12"/>
        </svg>
        Connect Meta Account
      </a>
    </div>
  )
}
