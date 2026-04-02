import Link from 'next/link'

export default function CreativeStudioPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 animate-fade-in">

      <div className="mb-8">
        <p className="text-label mb-2">Creative Studio</p>
        <h1 className="text-page-title">Ad creatives</h1>
      </div>

      {/* Coming soon card */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
      >
        <div
          className="px-5 py-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            Creative management
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'var(--accent-light)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
          </div>

          <p className="mb-2 text-base font-semibold" style={{ color: 'var(--text)' }}>
            Coming in Phase 2
          </p>
          <p
            className="mb-6 max-w-sm text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Upload and manage ad images, videos, and copy. AI will suggest creatives based on your campaign goal and audience.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="flex h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Create a campaign instead →
            </Link>
            <Link
              href="/campaigns"
              className="flex h-9 items-center rounded-xl px-4 text-sm font-medium transition-all hover:bg-[var(--surface)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              View campaigns
            </Link>
          </div>
        </div>
      </div>

      {/* Phase 2 feature preview */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { icon: '🖼', title: 'Image library', desc: 'Upload and organize your ad images' },
          { icon: '✍️', title: 'Copy variants', desc: 'AI generates headline & body copy variations' },
          { icon: '📊', title: 'Performance scores', desc: 'See which creatives drive the best ROAS' },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-5 opacity-50"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>{f.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
