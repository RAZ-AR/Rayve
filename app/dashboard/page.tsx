import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { SEGMENT_CONFIGS } from '@/lib/segments/config'
import type { BusinessType } from '@/lib/segments/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) redirect('/onboarding')

  const cfg = SEGMENT_CONFIGS[business.business_type as BusinessType]

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 animate-fade-in">

      {/* Page header — HEY-style bold */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-label mb-2">{cfg.iconEmoji} {cfg.label}</p>
          <h1 className="text-page-title">{business.name || 'Your dashboard'}</h1>
        </div>
        <Link
          href="/chat"
          className="mt-2 flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2v8M2 6h8" strokeLinecap="round"/>
          </svg>
          New campaign
        </Link>
      </div>

      {/* Goal suggestions */}
      <GoalSuggestions segment={business.business_type as BusinessType} />

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Campaigns',  value: '0',  sub: 'total' },
          { label: 'Spend',      value: '€0', sub: 'lifetime' },
          { label: 'Clicks',     value: '0',  sub: 'total' },
          { label: 'ROAS',       value: '—',  sub: 'avg' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-label mb-2">{s.label}</p>
            <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{s.value}</p>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Campaigns table — spans 2 cols */}
        <div
          className="overflow-hidden rounded-xl lg:col-span-2"
          style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Campaigns</span>
            <Link
              href="/campaigns"
              className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              View all →
            </Link>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--text-muted)' }}>
                <path d="M2 4h12v2H2zM2 8h12v2H2zM2 12h8v2H2z" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>No campaigns yet</p>
            <p className="mb-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Create your first campaign with a simple goal description.
            </p>
            <Link
              href="/chat"
              className="flex h-7 items-center rounded-lg px-3.5 text-xs font-medium transition-all"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
              }}
            >
              Create campaign →
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Getting started */}
          <div
            className="rounded-xl p-5"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <p className="text-label mb-4">Setup checklist</p>
            <div className="space-y-3">
              <CheckRow done label="Create account" />
              <CheckRow done label="Set up business profile" />
              <CheckRow label="Connect Meta Ads" href="/settings" />
              <CheckRow label="Launch first campaign" href="/chat" />
            </div>
          </div>

          {/* Quick actions */}
          <div
            className="rounded-xl p-5"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <p className="text-label mb-3">Quick actions</p>
            <div className="space-y-0.5">
              {[
                { label: 'Edit business profile', href: '/business-brain' },
                { label: 'Connect Meta Ads',      href: '/settings' },
                { label: 'Browse campaigns',       href: '/campaigns' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex h-8 items-center justify-between rounded-md px-2.5 text-xs font-medium transition-all hover:bg-[var(--surface)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Segment context bar */}
      <div
        className="mt-4 flex items-center gap-3 rounded-xl px-5 py-3.5"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--accent-light)',
        }}
      >
        <span className="text-base">{cfg.iconEmoji}</span>
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: 'var(--accent-text)' }}>{cfg.headline}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cfg.label} segment · AI campaigns ready when you are</p>
        </div>
        <Link
          href="/chat"
          className="flex h-7 shrink-0 items-center rounded-lg px-3 text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          Get started →
        </Link>
      </div>

    </div>
  )
}

const GOAL_SUGGESTIONS: Record<string, string[]> = {
  retail: [
    'Promote my best-selling products',
    'Run a flash sale this weekend',
    'Get more online orders',
  ],
  influencer: [
    'Grow my Instagram followers',
    'Drive traffic to my link in bio',
    'Promote my new drop',
  ],
  horeca: [
    'Get more reservations this week',
    'Promote our lunch special',
    'Drive weekend orders',
  ],
  info: [
    'Fill my next cohort',
    'Get sign-ups for my free webinar',
    'Promote my flagship course',
  ],
}

function GoalSuggestions({ segment }: { segment: string }) {
  const suggestions = GOAL_SUGGESTIONS[segment] ?? GOAL_SUGGESTIONS.retail
  return (
    <div
      className="mb-6 overflow-hidden rounded-xl"
      style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
    >
      <div
        className="px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p className="text-label">Start a campaign</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {suggestions.map((s, i) => (
          <Link
            key={s}
            href={`/chat?prompt=${encodeURIComponent(s)}`}
            className="flex items-center justify-between px-5 py-4 text-sm font-medium transition-all hover:bg-[var(--surface)]"
            style={{
              color: 'var(--text-secondary)',
              borderRight: i < 2 ? '1px solid var(--border)' : undefined,
            }}
          >
            {s}
            <span className="ml-3 shrink-0 text-lg" style={{ color: 'var(--accent)' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CheckRow({ done, label, href }: { done?: boolean; label: string; href?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold transition-all"
        style={done ? {
          background: 'var(--accent)',
          border: '1px solid var(--accent)',
          color: '#fff',
        } : {
          border: '1px solid var(--border-strong)',
          background: 'transparent',
        }}
      >
        {done && '✓'}
      </div>
      {href && !done ? (
        <Link
          href={href}
          className="text-xs underline-offset-2 hover:underline"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </Link>
      ) : (
        <span
          className="text-xs"
          style={{ color: done ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: done ? 'line-through' : undefined }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
