import Link from 'next/link'
import type { SegmentConfig } from '@/lib/segments/types'

interface CTASectionProps {
  config: SegmentConfig
}

export function CTASection({ config }: CTASectionProps) {
  return (
    <section
      className="py-24 px-5"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
    >
      <div className="mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden rounded-2xl p-12 text-center"
          style={{
            background: 'var(--accent-light)',
            border: '1px solid rgba(109,40,217,0.2)',
          }}
        >
          {/* Subtle violet glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 120%, rgba(109,40,217,0.12), transparent)' }}
          />

          <p className="text-label relative mb-3" style={{ color: 'var(--accent-text)' }}>
            Get started
          </p>
          <h2
            className="relative mb-4 font-black tracking-tight"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              letterSpacing: '-0.035em',
              color: 'var(--text)',
            }}
          >
            Ready to launch your first campaign?
          </h2>
          <p
            className="relative mx-auto mb-8 max-w-md text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Free to start. Connect your Meta account and go live in minutes.
          </p>

          <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              {config.ctaText} →
            </Link>
          </div>

          <p className="relative mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
