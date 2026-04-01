import Link from 'next/link'

export function LandingNav() {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 h-14 backdrop-blur-xl"
      style={{
        background: 'rgba(255,254,249,0.88)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-5">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg shadow-inner"
            style={{ background: 'var(--accent)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-black tracking-tight" style={{ color: 'var(--text)' }}>Rayve</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--surface)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="ml-1 flex h-8 items-center rounded-lg px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  )
}
