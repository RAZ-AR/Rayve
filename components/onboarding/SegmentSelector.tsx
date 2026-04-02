'use client'

import { useRouter } from 'next/navigation'
import { SEGMENT_CONFIGS, SEGMENT_ORDER } from '@/lib/segments/config'
import type { Segment } from '@/lib/segments/types'

interface SegmentSelectorProps {
  hint: Segment
}

export function SegmentSelector({ hint }: SegmentSelectorProps) {
  const router = useRouter()

  function handleSelect(segment: Exclude<Segment, 'generic'>) {
    router.push(`/onboarding?step=2&segment=${segment}`)
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Onboarding · Step 1 of 2
        </p>
        <h1 className="mb-2 text-3xl font-black tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          What kind of business are you?
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Rayve adapts everything — copy, strategy, and campaigns — to your segment.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SEGMENT_ORDER.map((segment) => {
          const config = SEGMENT_CONFIGS[segment]
          const isHinted = segment === hint

          return (
            <button
              key={segment}
              onClick={() => handleSelect(segment)}
              className="group relative flex flex-col items-start rounded-2xl p-5 text-left transition-all hover:shadow-md active:scale-[0.99]"
              style={{
                background: isHinted ? 'rgba(124,58,237,0.04)' : 'white',
                border: isHinted ? '1.5px solid rgba(124,58,237,0.3)' : '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                if (!isHinted) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.25)'
              }}
              onMouseLeave={(e) => {
                if (!isHinted) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              }}
            >
              {isHinted && (
                <span
                  className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent)' }}
                >
                  Suggested
                </span>
              )}

              <span className="mb-3 text-2xl">{config.iconEmoji}</span>

              <p className="mb-1 text-sm font-bold" style={{ color: 'var(--text)' }}>
                {config.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {config.description}
              </p>

              <span
                className="mt-4 flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2"
                style={{ color: 'var(--accent)' }}
              >
                Select →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
