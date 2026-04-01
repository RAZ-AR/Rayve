'use client'

import { useRouter } from 'next/navigation'
import type { Segment } from '@/lib/segments/types'
import { SEGMENT_CONFIGS } from '@/lib/segments/config'

export function ComingSoonFields({ segment }: { segment: Exclude<Segment, 'generic'> }) {
  const router = useRouter()
  const config = SEGMENT_CONFIGS[segment]

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-10 text-center">
        <span className="mb-3 block text-4xl">{config.iconEmoji}</span>
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-white">
          {config.label} is coming soon
        </h2>
        <p className="mb-6 text-sm text-[#888]">
          We're finishing {config.label} onboarding — you'll be first to know when ready.
        </p>
        <button
          onClick={() => router.push('/onboarding?step=1')}
          className="flex h-8 items-center rounded-md border border-white/[0.08] bg-white/[0.03] px-4 text-xs text-[#888] transition-all hover:border-white/[0.14] hover:text-white mx-auto"
        >
          ← Choose a different segment
        </button>
      </div>
    </div>
  )
}
