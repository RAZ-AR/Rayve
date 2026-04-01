'use client'

import { useRouter } from 'next/navigation'
import { SEGMENT_CONFIGS, SEGMENT_ORDER } from '@/lib/segments/config'
import type { Segment } from '@/lib/segments/types'
import { cn } from '@/lib/utils'

interface SegmentSelectorProps {
  hint: Segment
}

export function SegmentSelector({ hint }: SegmentSelectorProps) {
  const router = useRouter()

  function handleSelect(segment: Exclude<Segment, 'generic'>) {
    router.push(`/onboarding?step=2&segment=${segment}`)
  }

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-8">
        <p className="text-label mb-3">Onboarding · Step 1 of 2</p>
        <h1 className="text-headline text-white">
          What kind of business are you?
        </h1>
        <p className="mt-2 text-sm text-[#888]">
          Rayve adapts everything — copy, strategy, and campaigns — to your segment.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {SEGMENT_ORDER.map((segment) => {
          const config = SEGMENT_CONFIGS[segment]
          const isHinted = segment === hint

          return (
            <button
              key={segment}
              onClick={() => handleSelect(segment)}
              className={cn(
                'group relative flex flex-col items-start rounded-xl border p-5 text-left transition-all hover:border-white/[0.14] hover:bg-white/[0.04]',
                isHinted
                  ? 'border-violet-600/40 bg-violet-600/[0.06]'
                  : 'border-white/[0.08] bg-white/[0.02]'
              )}
            >
              {isHinted && (
                <span className="absolute right-3 top-3 rounded-full bg-violet-600/20 px-2 py-0.5 text-[10px] font-medium text-violet-400">
                  Suggested
                </span>
              )}
              <span className="mb-3 text-2xl">{config.iconEmoji}</span>
              <p className="mb-1 text-sm font-semibold tracking-tight text-white">
                {config.label}
              </p>
              <p className="text-xs leading-relaxed text-[#888]">{config.description}</p>
              <span className="mt-4 text-xs font-medium text-[#505050] transition-colors group-hover:text-violet-400">
                Select →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
