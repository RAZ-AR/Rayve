'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',       label: 'Dashboard',       icon: DashIcon },
  { href: '/chat',            label: 'New Campaign',    icon: PlusIcon },
  { href: '/campaigns',       label: 'Campaigns',       icon: GridIcon },
  { href: '/creative-studio', label: 'Creative Studio', icon: SparkIcon },
  { href: '/business-brain',  label: 'Brain',           icon: BrainIcon },
]

const NAV_BOTTOM = [
  { href: '/settings', label: 'Settings', icon: GearIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-16 flex-col items-center py-3"
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-4 flex h-9 w-9 shrink-0 items-center justify-center transition-all hover:opacity-85"
      >
        <Image src="/logo-icon.svg" alt="Rayve" width={36} height={36} />
      </Link>

      {/* Divider */}
      <div className="mb-3 h-px w-8" style={{ background: 'var(--sidebar-border)' }} />

      {/* Main nav */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <SidebarItem key={href} href={href} label={label} active={active}>
              <Icon active={active} />
            </SidebarItem>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        {NAV_BOTTOM.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <SidebarItem key={href} href={href} label={label} active={active}>
              <Icon active={active} />
            </SidebarItem>
          )
        })}
      </div>
    </aside>
  )
}

function SidebarItem({
  href,
  label,
  active,
  children,
}: {
  href: string
  label: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="sidebar-item relative flex h-9 w-9 items-center justify-center rounded-xl transition-all"
      style={{
        background: active ? 'var(--sidebar-active-bg)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {children}
      <span className="sidebar-tooltip">{label}</span>
    </Link>
  )
}

/* ── Icons ── */
function DashIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)'
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.5">
      <rect x="1" y="1" width="5" height="5" rx="1.5"/>
      <rect x="8" y="1" width="5" height="5" rx="1.5"/>
      <rect x="1" y="8" width="5" height="5" rx="1.5"/>
      <rect x="8" y="8" width="5" height="5" rx="1.5"/>
    </svg>
  )
}
function PlusIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)'
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.5">
      <circle cx="7" cy="7" r="6"/>
      <path d="M7 4v6M4 7h6" strokeLinecap="round"/>
    </svg>
  )
}
function GridIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)'
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M1 3h12M1 7h12M1 11h12" strokeLinecap="round"/>
      <path d="M5 1v12M9 1v12" strokeLinecap="round"/>
    </svg>
  )
}
function SparkIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)'
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13 5.5 8.5 1 7l4.5-1.5z" strokeLinejoin="round"/>
    </svg>
  )
}
function BrainIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)'
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M5 2C3 2 1.5 3.5 1.5 5.5c0 1 .5 1.8 1.2 2.3C2.3 9.5 3.5 11 5 11.5" strokeLinecap="round"/>
      <path d="M9 2c2 0 3.5 1.5 3.5 3.5 0 1-.5 1.8-1.2 2.3C11.7 9.5 10.5 11 9 11.5" strokeLinecap="round"/>
      <path d="M5 11.5C5.5 12 6 12.5 7 12.5s1.5-.5 2-1" strokeLinecap="round"/>
      <path d="M7 2v10.5" strokeLinecap="round"/>
      <path d="M4 5.5h6" strokeLinecap="round"/>
      <path d="M4.5 8h5" strokeLinecap="round"/>
    </svg>
  )
}
function GearIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)'
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.5">
      <circle cx="7" cy="7" r="2"/>
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.05 3.05l1.41 1.41M9.54 9.54l1.41 1.41M3.05 10.95l1.41-1.41M9.54 4.46l1.41-1.41" strokeLinecap="round"/>
    </svg>
  )
}
