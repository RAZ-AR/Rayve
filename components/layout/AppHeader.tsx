import { signOut } from '@/app/login/actions'
import { SEGMENT_CONFIGS } from '@/lib/segments/config'
import type { BusinessType } from '@/lib/segments/types'

interface AppHeaderProps {
  userEmail: string | null
  businessType?: BusinessType | null
  businessName?: string | null
}

export function AppHeader({ userEmail, businessType, businessName }: AppHeaderProps) {
  const cfg = businessType ? SEGMENT_CONFIGS[businessType] : null
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : '?'

  return (
    <header
      className="flex h-12 items-center justify-between px-4"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {cfg && (
          <span
            className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-xs sm:flex"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {cfg.iconEmoji}
            <span>{cfg.label}</span>
          </span>
        )}
        {businessName && (
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {businessName}
          </span>
        )}
      </div>

      {/* Right */}
      <form action={signOut}>
        <button
          type="submit"
          title={`${userEmail ?? ''} — Sign out`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--elevated)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          {initials}
        </button>
      </form>
    </header>
  )
}
