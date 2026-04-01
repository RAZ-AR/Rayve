'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle, signInWithFacebook } from '@/app/signup/actions'
import { TelegramLoginButton } from './TelegramLoginButton'

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? ''
const TELEGRAM_AUTH_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/auth/telegram`
    : 'http://localhost:3000/api/auth/telegram'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleEmailSignup(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await signUpWithEmail(formData)
      if (result?.error) setError(result.error)
    })
  }

  async function handleGoogleSignup() {
    setError(null)
    startTransition(async () => {
      const result = await signInWithGoogle()
      if (result?.error) setError(result.error)
    })
  }

  async function handleFacebookSignup() {
    setError(null)
    startTransition(async () => {
      const result = await signInWithFacebook()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="w-full">

      {/* OAuth buttons */}
      <div className="space-y-2">
        <OAuthButton onClick={handleGoogleSignup} disabled={isPending}>
          <GoogleIcon />
          Continue with Google
        </OAuthButton>

        <OAuthButton onClick={handleFacebookSignup} disabled={isPending}>
          <FacebookIcon />
          Continue with Facebook
        </OAuthButton>
      </div>

      {/* Telegram */}
      {TELEGRAM_BOT_USERNAME && (
        <div className="mt-2">
          <TelegramLoginButton
            botUsername={TELEGRAM_BOT_USERNAME}
            authUrl={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/auth/telegram`}
          />
        </div>
      )}

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      </div>

      {/* Email form */}
      <form action={handleEmailSignup} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Email
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Password
          </label>
          <input
            id="password" name="password" type="password" required minLength={6}
            autoComplete="new-password"
            placeholder="Minimum 6 characters"
            className={inputCls}
          />
        </div>

        {error && (
          <div className="rounded-lg px-3 py-2.5 text-xs" style={{ border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#DC2626' }}>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={isPending}
          className="mt-1 flex h-9 w-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          {isPending ? <Spinner /> : 'Create free account'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" className="underline-offset-2 hover:underline" style={{ color: 'var(--text-secondary)' }}>
          Log in
        </Link>
      </p>
    </div>
  )
}

function OAuthButton({ onClick, disabled, children }: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-full items-center justify-center gap-2.5 rounded-lg text-sm font-medium transition-all hover:bg-[var(--elevated)] disabled:opacity-40"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
    >
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <span className="flex items-center gap-2">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30" style={{ borderTopColor: 'white' }} />
      Creating account…
    </span>
  )
}

const inputCls =
  'h-9 w-full rounded-lg px-3 text-sm outline-none transition-all' +
  ' border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]' +
  ' focus:border-[var(--accent)] focus:ring-1 focus:ring-[rgba(109,40,217,0.2)]'

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
