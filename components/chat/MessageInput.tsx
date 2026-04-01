'use client'

import { useRef, useEffect, type KeyboardEvent } from 'react'
import type { BusinessType } from '@/lib/segments/types'

const SEGMENT_SUGGESTIONS: Record<BusinessType, string[]> = {
  retail: [
    'Promote my best-selling products',
    'Run a flash sale this weekend',
    'Get more online orders',
  ],
  influencer: [
    'Grow my Instagram followers',
    'Drive traffic to my link in bio',
    'Promote my new drop',
  ],
  horeca: [
    'Get more reservations this week',
    'Promote our lunch special',
    'Drive weekend orders',
  ],
  info: [
    'Fill my next cohort',
    'Get sign-ups for my free webinar',
    'Promote my flagship course',
  ],
}

interface Props {
  input: string
  isLoading: boolean
  hasMessages: boolean
  segment: BusinessType
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSend: (text: string) => void
  onSuggestion: (text: string) => void
}

export function MessageInput({
  input,
  isLoading,
  hasMessages,
  segment,
  onInputChange,
  onSend,
  onSuggestion,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestions = SEGMENT_SUGGESTIONS[segment] ?? SEGMENT_SUGGESTIONS.retail

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [input])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(input)
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSend(input)
  }

  return (
    <div
      className="px-4 py-4"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Suggestion chips — shown only before first message */}
      {!hasMessages && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestion(s)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:bg-[var(--elevated)]"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe your campaign goal…"
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
          style={{
            minHeight: '44px',
            maxHeight: '180px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-30"
          style={{ background: 'var(--accent)' }}
          aria-label="Send"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2L2 8l4 2 2 4 6-12z" />
          </svg>
        </button>
      </form>
      <p className="mt-2 text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
