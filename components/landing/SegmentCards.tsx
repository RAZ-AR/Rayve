import Link from 'next/link'
import { SEGMENT_CONFIGS, SEGMENT_ORDER } from '@/lib/segments/config'

const SEGMENT_HREFS: Record<string, string> = {
  retail:     'http://shops.localhost:3000/signup',
  influencer: 'http://creators.localhost:3000/signup',
  horeca:     'http://restaurants.localhost:3000/signup',
  info:       'http://courses.localhost:3000/signup',
}

export function SegmentCards() {
  return (
    <section className="py-20 px-5" style={{ background: 'var(--bg-warm)' }}>
      <div className="mx-auto max-w-5xl">

        <div className="mb-14">
          <p className="text-label mb-2">Segments</p>
          <h2
            className="font-black tracking-tight"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
            }}
          >
            Which type of business are you?
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENT_ORDER.map((segment) => {
            const config = SEGMENT_CONFIGS[segment]
            return (
              <Link
                key={segment}
                href={SEGMENT_HREFS[segment] ?? '/signup'}
                className="group flex flex-col rounded-xl p-5 transition-all hover:bg-[var(--elevated)]"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              >
                <span className="mb-3 text-2xl">{config.iconEmoji}</span>
                <h3
                  className="mb-1.5 text-[15px] font-bold tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  {config.label}
                </h3>
                <p
                  className="mb-4 flex-1 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {config.description}
                </p>
                <span
                  className="text-xs font-semibold transition-colors group-hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Get started →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
