import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
          <Link href="/">
            <Image src="/logo.svg" alt="Rayve" width={88} height={22} style={{ height: 22, width: 'auto' }} />
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
                ? { border: '1.5px solid var(--accent)', color: 'var(--accent)', background: 'var(--accent-subtle)' }
                : { border: '1px solid var(--sidebar-border)', color: 'var(--sidebar-text)' }
            }
          >
            {n < current ? '✓' : n}
          </div>
          {n < total && (
            <div
              className="h-px w-8 transition-all"
              style={{ background: n < current ? 'var(--accent)' : 'var(--sidebar-border)' }}
            />
          )}
        </div>
      ))}
      <span className="ml-1 text-xs font-semibold" style={{ color: 'var(--sidebar-text)' }}>
        Step {current} of {total}
      </span>
    </div>
  )
}
