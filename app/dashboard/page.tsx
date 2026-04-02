import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { SEGMENT_CONFIGS } from '@/lib/segments/config'
import type { BusinessType } from '@/lib/segments/types'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) redirect('/onboarding')

  const cfg = SEGMENT_CONFIGS[business.business_type as BusinessType]
  const displayName = business.name || user.email?.split('@')[0] || 'there'
  const greeting = getGreeting()

  return (
    <div className="animate-fade-in">

      {/* ── Hero gradient (Any.do-style) ── */}
      <div className="hero-gradient px-8 py-10 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-1 text-sm font-medium" style={{ color: 'rgba(196,181,253,0.7)' }}>
            {cfg.iconEmoji} {cfg.label}
          </p>
          <h1 className="text-hero-title">
            {greeting}, {displayName}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(248,250,252,0.55)' }}>
            {cfg.subheadline}
          </p>

          {/* Quick-start chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {GOAL_SUGGESTIONS[business.business_type]?.map((s) => (
              <Link
                key={s}
                href={`/chat?prompt=${encodeURIComponent(s)}`}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(248,250,252,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ color: 'rgba(196,181,253,0.8)' }}>→</span>
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-4xl px-8 py-6 lg:px-10">

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Campaigns',  value: '0',  sub: 'total',    color: '#7C3AED' },
            { label: 'Spend',      value: '€0', sub: 'lifetime', color: '#0EA5E9' },
            { label: 'Clicks',     value: '0',  sub: 'total',    color: '#10B981' },
            { label: 'ROAS',       value: '—',  sub: 'avg',      color: '#F59E0B' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 transition-all hover:shadow-sm"
              style={{ background: '#fff', border: '1px solid var(--border)' }}
            >
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${s.color}18` }}>
                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              </div>
              <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{s.value}</p>
              <p className="mt-0.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label} · {s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Campaigns card — 2 cols */}
          <div
            className="overflow-hidden rounded-2xl lg:col-span-2"
            style={{ background: '#fff', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Campaigns</span>
              <Link href="/campaigns" className="text-xs font-medium transition-colors hover:text-violet-600" style={{ color: 'var(--text-muted)' }}>
                View all →
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: 'var(--accent-light)' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h8v2H3z" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>No campaigns yet</p>
              <p className="mb-5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Describe your goal — Rayve creates a complete Meta Ads brief in seconds.
              </p>
              <Link
                href="/chat"
                className="flex h-8 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 2v8M2 6h8"/>
                </svg>
                Create first campaign
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Setup checklist */}
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid var(--border)' }}>
              <p className="text-label mb-4">Setup</p>
              <div className="space-y-3">
                <CheckRow done label="Create account" />
                <CheckRow done label="Business profile" />
                <CheckRow label="Connect Meta Ads" href="/settings" />
                <CheckRow label="First campaign" href="/chat" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid var(--border)' }}>
              <p className="text-label mb-3">Quick actions</p>
              <div className="space-y-0.5">
                {[
                  { label: 'Edit business profile', href: '/business-brain', icon: '🧠' },
                  { label: 'Connect Meta Ads',      href: '/settings',       icon: '⚡' },
                  { label: 'Browse campaigns',       href: '/campaigns',      icon: '📢' },
                ].map(({ label, href, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex h-9 items-center gap-2.5 rounded-xl px-3 text-xs font-medium transition-all hover:bg-[var(--surface)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="text-sm">{icon}</span>
                    {label}
                    <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Goal suggestions per segment ── */
const GOAL_SUGGESTIONS: Record<string, string[]> = {
  retail:     ['Promote my best sellers', 'Run a flash sale', 'Get more online orders'],
  influencer: ['Grow my Instagram', 'Drive traffic to link in bio', 'Promote my new drop'],
  horeca:     ['Get more reservations', 'Promote our lunch special', 'Drive weekend orders'],
  info:       ['Fill my next cohort', 'Free webinar sign-ups', 'Promote my course'],
}

function CheckRow({ done, label, href }: { done?: boolean; label: string; href?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[9px] font-bold transition-all"
        style={done
          ? { background: 'var(--accent)', color: '#fff' }
          : { border: '1.5px solid var(--border-strong)', background: 'transparent' }
        }
      >
        {done && '✓'}
      </div>
      {href && !done ? (
        <Link href={href} className="text-xs hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </Link>
      ) : (
        <span
          className="text-xs"
          style={{
            color: done ? 'var(--text-muted)' : 'var(--text-secondary)',
            textDecoration: done ? 'line-through' : undefined,
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
