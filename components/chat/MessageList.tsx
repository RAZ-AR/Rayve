'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'

interface Props {
  messages: UIMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Describe your goal to get started</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
      {messages.map((m) => {
        if (m.role === 'user') {
          const text = extractText(m)
          return (
            <div key={m.id} className="flex justify-end">
              <div
                className="max-w-[75%] rounded-xl rounded-tr-sm px-4 py-2.5"
                style={{
                  background: 'var(--accent-light)',
                  border: '1px solid rgba(109,40,217,0.15)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--accent-text)' }}>{text}</p>
              </div>
            </div>
          )
        }

        // Assistant message
        const text = extractText(m)
        const hasToolCall = m.parts.some((p) => p.type.startsWith('tool-'))

        return (
          <div key={m.id} className="flex justify-start">
            <div className="max-w-[80%]">
              {/* Avatar */}
              <div className="mb-1.5 flex items-center gap-1.5">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-md"
                  style={{ background: 'var(--accent)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
                >
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.5 7.5H8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Rayve</span>
              </div>
              {text && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{text}</p>
              )}
              {hasToolCall && !text && (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>Generating campaign proposal…</p>
              )}
            </div>
          </div>
        )
      })}

      {isLoading && (
        <div className="flex justify-start">
          <div className="ml-6 flex items-center gap-1.5 py-1">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: 'var(--accent)', animationDelay: '0ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: 'var(--accent)', animationDelay: '150ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: 'var(--accent)', animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function extractText(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}
