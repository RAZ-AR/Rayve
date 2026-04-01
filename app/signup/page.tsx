import Link from 'next/link'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Left — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-[340px]">

          {/* Logo */}
          <Link href="/" className="group mb-8 flex items-center gap-2.5">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg shadow-inner"
              style={{ background: 'var(--accent)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text)' }}>Rayve</span>
          </Link>

          <div className="mb-6">
            <h1
              className="mb-1 text-2xl font-black tracking-tight"
              style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
            >
              Create your account
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Free to start · No credit card required
            </p>
          </div>

          <SignupForm />
        </div>
      </div>

      {/* Right — decorative (hidden on mobile) */}
      <div
        className="relative hidden flex-1 overflow-hidden lg:block"
        style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-warm)' }}
      >
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(109,40,217,0.06), transparent)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-sm text-center">
            <p className="text-label mb-4">Join Rayve</p>
            <p
              className="text-2xl font-black tracking-tight"
              style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
            >
              Launch real Meta Ads in minutes, not days
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Segment-native AI campaigns, connected directly to your Meta Ad Account.
            </p>
          </div>
        </div>
      </div>

    </main>
  )
}
