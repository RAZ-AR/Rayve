import Link from 'next/link'
import type { SegmentConfig } from '@/lib/segments/types'

interface HeroSectionProps {
  config: SegmentConfig
}

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-14"
      style={{ background: 'var(--bg)' }}
    >
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />

      {/* Subtle violet glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(109,40,217,0.05), transparent)' }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">

        {/* Status pill */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-emerald-500" />
          <span>Real Meta Ads API · No mock data</span>
        </div>

        {/* Headline */}
        <h1
          className="mb-5 font-black tracking-tight"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: '1.02',
            letterSpacing: '-0.04em',
            color: 'var(--text)',
          }}
        >
          {config.headline}
        </h1>

        {/* Sub */}
        <p
          className="mx-auto mb-10 max-w-xl"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
          }}
        >
          {config.subheadline}
        </p>

        {/* CTA row */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="group flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {config.ctaText}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            href="/login"
            className="flex h-11 items-center rounded-xl px-6 text-sm font-medium transition-all hover:bg-[var(--surface)]"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-secondary)',
            }}
          >
            Already have an account
          </Link>
        </div>

        {/* Microcopy */}
        <p className="mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
          Free to start · Connect your own Meta Ad Account · No lock-in
        </p>
      </div>

      {/* Dashboard preview */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-4xl px-0 sm:px-4">
        <DashboardMockup />
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div
      className="overflow-hidden rounded-2xl shadow-card-lg"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        boxShadow: '0 32px 80px rgba(28,25,23,0.12), 0 0 0 1px var(--border)',
      }}
    >
      {/* Window chrome */}
      <div
        className="flex h-9 items-center gap-1.5 px-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-strong)' }} />
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-strong)' }} />
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-strong)' }} />
        <div
          className="mx-auto flex h-5 w-48 items-center justify-center rounded-sm text-[10px]"
          style={{ background: 'var(--elevated)', color: 'var(--text-muted)' }}
        >
          app.rayve.io/dashboard
        </div>
      </div>

      {/* Mock content */}
      <div className="flex">
        {/* Sidebar */}
        <div
          className="hidden w-44 shrink-0 p-3 sm:block"
          style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-warm)' }}
        >
          <div className="mb-4 flex items-center gap-2 px-2 py-1.5">
            <div className="h-5 w-5 rounded-md" style={{ background: 'var(--accent)' }} />
            <div className="h-3 w-16 rounded-sm" style={{ background: 'var(--elevated)' }} />
          </div>
          {['Dashboard', 'Campaigns', 'Creative', 'Settings'].map((item, i) => (
            <div
              key={item}
              className="mb-0.5 flex h-8 items-center gap-2.5 rounded-lg px-2"
              style={i === 0 ? { background: 'var(--accent-light)' } : {}}
            >
              <div
                className="h-3.5 w-3.5 rounded-sm"
                style={{ background: i === 0 ? 'var(--accent)' : 'var(--elevated)' }}
              />
              <div
                className="h-2.5 rounded-sm"
                style={{
                  width: i === 0 ? '64px' : '48px',
                  background: i === 0 ? 'var(--accent-light)' : 'var(--elevated)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-5">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="mb-1.5 h-5 w-36 rounded" style={{ background: 'var(--elevated)' }} />
              <div className="h-2.5 w-24 rounded-sm" style={{ background: 'var(--surface)' }} />
            </div>
            <div className="h-8 w-28 rounded-lg" style={{ background: 'var(--accent)' }} />
          </div>

          {/* Stat cards */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {['Spend', 'Clicks', 'ROAS'].map((label) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
              >
                <div className="mb-1 h-2 w-10 rounded-sm" style={{ background: 'var(--elevated)' }} />
                <div className="mb-1 h-5 w-16 rounded" style={{ background: 'var(--border-strong)' }} />
                <div className="h-2 w-8 rounded-sm bg-emerald-500/30" />
              </div>
            ))}
          </div>

          {/* Campaign row */}
          <div
            className="rounded-xl"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="h-2.5 w-20 rounded-sm" style={{ background: 'var(--elevated)' }} />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < 3 ? '1px solid var(--border-subtle)' : undefined }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                <div className="h-2.5 flex-1 rounded-sm" style={{ background: 'var(--surface)' }} />
                <div className="h-2.5 w-12 rounded-sm" style={{ background: 'var(--elevated)' }} />
                <div className="h-2.5 w-10 rounded-full" style={{ background: 'var(--accent-light)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
