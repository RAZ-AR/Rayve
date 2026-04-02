import Link from 'next/link'
import Image from 'next/image'

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
        <Link href="/">
          <Image src="/logo-dark.svg" alt="Rayve" width={96} height={24} style={{ height: 24, width: 'auto' }} />
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
