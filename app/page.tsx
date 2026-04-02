import { headers } from 'next/headers'
import type { Segment } from '@/lib/segments/types'
import { SEGMENT_CONFIGS } from '@/lib/segments/config'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { SegmentCards } from '@/components/landing/SegmentCards'
import { CTASection } from '@/components/landing/CTASection'

export default async function LandingPage() {
  const headersList = await headers()
  const segment = (headersList.get('x-segment-hint') ?? 'generic') as Segment
  const config = SEGMENT_CONFIGS[segment]

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <LandingNav />
      <HeroSection config={config} />
      <HowItWorks />
      <FeatureGrid config={config} />
      {segment === 'generic' && <SegmentCards />}
      <CTASection config={config} />
    </main>
  )
}
