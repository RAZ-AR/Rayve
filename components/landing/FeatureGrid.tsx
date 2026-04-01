import type { SegmentConfig } from '@/lib/segments/types'

interface FeatureGridProps {
  config: SegmentConfig
}

export function FeatureGrid({ config }: FeatureGridProps) {
  if (!config.features.length) return null

  return (
    <section className="py-20 px-5" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-5xl">

        <div className="mb-14">
          <p className="text-label mb-2">Why Rayve</p>
          <h2
            className="font-black tracking-tight"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
            }}
          >
            Built for your type of business
          </h2>
        </div>

        <div
          className="overflow-hidden rounded-2xl sm:grid sm:grid-cols-3"
          style={{ border: '1px solid var(--border)' }}
        >
          {config.features.map((feature: { title: string; description: string }, i: number) => (
            <div
              key={i}
              className="p-7 transition-colors hover:bg-[var(--surface)]"
              style={{
                background: 'var(--bg)',
                borderRight: i < 2 ? '1px solid var(--border)' : undefined,
                borderTop: i >= 3 ? '1px solid var(--border)' : undefined,
              }}
            >
              <div
                className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-mono font-bold"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-muted)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3
                className="mb-2 text-sm font-bold tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
