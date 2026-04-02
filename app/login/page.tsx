import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">

      {/* Left — dark hero panel */}
      <div
        className="relative hidden flex-1 flex-col overflow-hidden lg:flex"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 50%, #3B0764 100%)' }}
      >
        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(196,181,253,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(124,58,237,0.2), transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex h-16 items-center px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'var(--accent)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight text-white">Rayve</span>
          </Link>
        </div>

        {/* Center copy */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-10 pb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(196,181,253,0.6)' }}>
            Welcome back
          </p>
          <h2 className="text-hero-title mb-4">
            Your campaigns<br />are waiting
          </h2>
          <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.5)' }}>
            Check live metrics, launch new campaigns, and review AI recommendations.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-col gap-2">
            {[
              'AI campaign briefs in seconds',
              'Live Meta Ads metrics',
              'One-click campaign activation',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#7C3AED' }} />
                <span className="text-sm" style={{ color: 'rgba(248,250,252,0.6)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12" style={{ background: '#FAFAFA' }}>
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: 'var(--accent)' }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text)' }}>Rayve</span>
          </Link>

          <div className="mb-7">
            <h1 className="mb-1.5 text-2xl font-black tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
              Sign in
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium underline-offset-2 hover:underline" style={{ color: 'var(--accent)' }}>
                Sign up free
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

    </main>
  )
}
