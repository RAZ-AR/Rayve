'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',       label: 'Dashboard' },
  { href: '/chat',            label: 'New Campaign' },
  { href: '/campaigns',       label: 'Campaigns' },
  { href: '/creative-studio', label: 'Creative Studio' },
  { href: '/business-brain',  label: 'Business Brain' },
  { href: '/settings',        label: 'Settings' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-7 w-7 items-center justify-center rounded-md transition-all lg:hidden"
        style={{
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          background: 'transparent',
        }}
        aria-label="Menu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3.5h10M2 7h10M2 10.5h10" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(28,25,23,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-56 flex-col transition-transform duration-200 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: 'var(--bg-warm)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div
          className="flex h-12 items-center justify-between px-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text)' }}>
            Rayve
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ color: 'var(--text-muted)' }}
            className="transition-colors hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex h-8 items-center rounded-lg px-2.5 text-[13px] font-medium transition-all"
                style={active ? {
                  background: 'var(--accent-light)',
                  color: 'var(--accent-text)',
                } : {
                  color: 'var(--text-secondary)',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
