import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">

      {/* Left — blue hero panel */}
      <div
        className="relative hidden flex-1 flex-col overflow-hidden lg:flex"
        style={{ background: 'linear-gradient(160deg, #004e7c 0%, #006aaa 50%, #009ed3 100%)' }}
      >
        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,158,211,0.35), transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex h-16 items-center px-8">
          <Link href="/">
            <Image src="/logo.svg" alt="Rayve" width={100} height={25} style={{ height: 25, width: 'auto' }} />
          </Link>
        </div>

        {/* Center copy */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-10 pb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Welcome back
          </p>
          <h2 className="text-hero-title mb-4">
            Your campaigns<br />are waiting
          </h2>
          <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
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
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.7)' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12" style={{ background: '#FAFAFA' }}>
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <Link href="/" className="mb-8 block lg:hidden">
            <Image src="/logo-dark.svg" alt="Rayve" width={90} height={22} style={{ height: 22, width: 'auto' }} />
          </Link>

          <div className="mb-7">
            <h1 className="mb-1.5 text-2xl font-black tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>
              Sign in
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold underline-offset-2 hover:underline" style={{ color: 'var(--accent)' }}>
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
