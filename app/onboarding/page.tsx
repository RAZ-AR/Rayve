import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Segment } from '@/lib/segments/types'
import { SegmentSelector } from '@/components/onboarding/SegmentSelector'
import { RetailFields } from '@/components/onboarding/RetailFields'
import { InfluencerFields } from '@/components/onboarding/InfluencerFields'
import { HoReCaFields } from '@/components/onboarding/HoReCaFields'
import { InfoBusinessFields } from '@/components/onboarding/InfoBusinessFields'

interface PageProps {
  searchParams: Promise<{ step?: string; segment?: string }>
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const step = params.step ?? '1'
  const segmentParam = params.segment as Segment | undefined

  const headersList = await headers()
  const hint = (headersList.get('x-segment-hint') ?? 'generic') as Segment
  const sourceDomain = hint !== 'generic' ? hint : 'generic'

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-100"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-violet-600 ring-1 ring-violet-500/50">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">Rayve</span>
          </Link>

          {/* Steps */}
          <div className="flex items-center gap-2">
            <StepIndicator current={step === '1' ? 1 : 2} total={2} />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 py-12">
        {step === '1' || !segmentParam ? (
          <SegmentSelector hint={hint} />
        ) : (
          <>
            {segmentParam === 'retail'     && <RetailFields sourceDomain={sourceDomain} />}
            {segmentParam === 'influencer' && <InfluencerFields sourceDomain={sourceDomain} />}
            {segmentParam === 'horeca'     && <HoReCaFields sourceDomain={sourceDomain} />}
            {segmentParam === 'info'       && <InfoBusinessFields sourceDomain={sourceDomain} />}
          </>
        )}
      </div>
    </main>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-all ${
              n < current
                ? 'bg-violet-600 text-white'
                : n === current
                ? 'border border-violet-500 text-violet-400'
                : 'border border-white/[0.12] text-[#505050]'
            }`}
          >
            {n < current ? '✓' : n}
          </div>
          {n < total && (
            <div className={`h-px w-8 ${n < current ? 'bg-violet-600/40' : 'bg-white/[0.08]'}`} />
          )}
        </div>
      ))}
      <span className="ml-1 text-xs text-[#505050]">Step {current} of {total}</span>
    </div>
  )
}
