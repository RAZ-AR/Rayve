'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',       label: 'Dashboard',       emoji: '🏠' },
  { href: '/chat',            label: 'New Campaign',    emoji: '✨' },
  { href: '/campaigns',       label: 'Campaigns',       emoji: '📢' },
  { href: '/creative-studio', label: 'Creative Studio', emoji: '🎨' },
  { href: '/business-brain',  label: 'Business Brain',  emoji: '🧠' },
  { href: '/settings',        label: 'Settings',        emoji: '⚙️' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
        style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--sidebar-text)' }}
        aria-label="Menu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3.5h10M2 7h10M2 10.5h10" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Logo in mobile bar */}
      <Link href="/dashboard" className="absolute left-1/2 -translate-x-1/2">
        <Image src="/logo.svg" alt="Rayve" width={80} height={20} style={{ height: 20, width: 'auto' }} />
      </Link>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
      >
        <div
          className="flex h-14 items-center justify-between px-5"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <Image src="/logo.svg" alt="Rayve" width={88} height={22} style={{ height: 22, width: 'auto' }} />
          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
            style={{ color: 'var(--sidebar-text)', background: 'rgba(0,0,0,0.06)' }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {NAV.map(({ href, label, emoji }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all"
                style={active ? {
                  background: 'var(--sidebar-active-bg)',
                  color: 'var(--sidebar-active-text)',
                } : {
                  color: 'var(--sidebar-text)',
                }}
              >
                <span>{emoji}</span>
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
