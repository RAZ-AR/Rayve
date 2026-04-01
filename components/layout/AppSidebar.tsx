'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',       label: 'Dashboard',       icon: DashIcon },
  { href: '/chat',            label: 'New Campaign',    icon: PlusIcon },
  { href: '/campaigns',       label: 'Campaigns',       icon: GridIcon },
  { href: '/creative-studio', label: 'Creative Studio', icon: SparkIcon },
  { href: '/business-brain',  label: 'Business Brain',  icon: BrainIcon },
]

const NAV_BOTTOM = [
  { href: '/settings', label: 'Settings', icon: GearIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-52 flex-col"
      style={{
        background: 'var(--bg-warm)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex h-12 shrink-0 items-center px-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg shadow-inner"
            style={{ background: 'var(--accent)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span
            className="text-sm font-black tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Rayve
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all',
                active
                  ? 'bg-violet-100 text-violet-800'
                  : 'hover:bg-warm-300 text-warm-700 hover:text-warm-900'
              )}
              style={!active ? {
                color: 'var(--text-secondary)',
              } : undefined}
            >
              <Icon
                className={cn('h-3.5 w-3.5 shrink-0 transition-colors', active ? 'text-violet-700' : '')}
                style={!active ? { color: 'var(--text-muted)' } : undefined}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div
        className="shrink-0 px-2 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {NAV_BOTTOM.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all',
                active ? 'bg-violet-100 text-violet-800' : 'text-warm-700 hover:bg-warm-300'
              )}
              style={!active ? { color: 'var(--text-secondary)' } : undefined}
            >
              <Icon
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: 'var(--text-muted)' }}
              />
              {label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

/* ── Inline icons ── */
function DashIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="5" height="5" rx="1.5"/>
      <rect x="8" y="1" width="5" height="5" rx="1.5"/>
      <rect x="1" y="8" width="5" height="5" rx="1.5"/>
      <rect x="8" y="8" width="5" height="5" rx="1.5"/>
    </svg>
  )
}
function PlusIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="6"/>
      <path d="M7 4v6M4 7h6" strokeLinecap="round"/>
    </svg>
  )
}
function GridIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 2h12v2H1zM1 6h12v2H1zM1 10h12v2H1z" strokeLinejoin="round"/>
    </svg>
  )
}
function SparkIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13 5.5 8.5 1 7l4.5-1.5z" strokeLinejoin="round"/>
    </svg>
  )
}
function BrainIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5.5"/>
      <path d="M7 3.5v3.5l2 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function GearIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="2"/>
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.05 3.05l1.41 1.41M9.54 9.54l1.41 1.41M3.05 10.95l1.41-1.41M9.54 4.46l1.41-1.41" strokeLinecap="round"/>
    </svg>
  )
}
