const STEPS = [
  {
    step: '01',
    title: 'Tell us your goal',
    description: 'Describe what you want in plain language — more sales, followers, or orders.',
  },
  {
    step: '02',
    title: 'Review the campaign',
    description: 'Rayve generates ad copy, creative concepts, audience, and budget for review.',
  },
  {
    step: '03',
    title: 'Launch and track',
    description: 'One click sends your campaign to Meta. Live metrics appear on your dashboard.',
  },
]

export function HowItWorks() {
  return (
    <section
      className="py-20 px-5"
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-warm)',
      }}
    >
      <div className="mx-auto max-w-5xl">

        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="text-label mb-2">Process</p>
            <h2
              className="font-black tracking-tight"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                letterSpacing: '-0.03em',
                color: 'var(--text)',
              }}
            >
              From goal to live campaign in minutes
            </h2>
          </div>
          <p
            className="hidden max-w-xs text-right text-sm sm:block"
            style={{ color: 'var(--text-secondary)' }}
          >
            No marketing degree required. No agency needed.
          </p>
        </div>

        <div className="grid gap-0 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="relative py-8 pr-8 sm:first:pl-0"
              style={{
                borderTop: '1px solid var(--border)',
                ...(i > 0 ? { borderLeft: '1px solid var(--border)' } : {}),
              }}
            >
              <div className="pl-0 sm:pl-8">
                <span
                  className="mb-4 block font-mono text-sm font-bold"
                  style={{ color: 'var(--border-strong)' }}
                >
                  {s.step}
                </span>
                <h3
                  className="mb-2 text-[15px] font-bold tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
