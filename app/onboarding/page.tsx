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

  const currentStep = step === '1' || !segmentParam ? 1 : 2

  return (
    <main className="min-h-screen" style={{ background: '#FAFAFA' }}>

      {/* Top bar — dark Daybreak */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: 'var(--sidebar-bg)',
          borderBottom: '1px solid var(--sidebar-border)',
        }}
      >
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight text-white">Rayve</span>
          </Link>

          <StepIndicator current={currentStep} total={2} />
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto flex max-w-lg flex-col px-5 py-10 pb-20">
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
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all"
            style={
              n < current
                ? { background: 'var(--accent)', color: '#fff' }
                : n === current
                ? { border: '1.5px solid var(--accent)', color: 'rgba(196,181,253,0.9)', background: 'rgba(124,58,237,0.12)' }
                : { border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.25)' }
            }
          >
            {n < current ? '✓' : n}
          </div>
          {n < total && (
            <div
              className="h-px w-8 transition-all"
              style={{ background: n < current ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)' }}
            />
          )}
        </div>
      ))}
      <span className="ml-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Step {current} of {total}
      </span>
    </div>
  )
}
