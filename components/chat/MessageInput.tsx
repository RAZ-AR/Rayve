'use client'

import { useRef, useEffect, type KeyboardEvent } from 'react'

interface Props {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSend: (text: string) => void
}

export function MessageInput({ input, isLoading, onInputChange, onSend }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
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
    <form
      onSubmit={handleFormSubmit}
      className="flex items-end gap-2 rounded-2xl px-3 py-2.5"
      style={{
        border: '1.5px solid var(--border)',
        background: 'var(--bg)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask Rayve anything…"
        rows={1}
        disabled={isLoading}
        className="flex-1 resize-none bg-transparent py-1 text-sm outline-none transition-all disabled:opacity-50"
        style={{
          minHeight: '28px',
          maxHeight: '160px',
          color: 'var(--text)',
          lineHeight: '1.5',
        }}
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-30"
        style={{ background: 'var(--accent)' }}
        aria-label="Send"
      >
        {isLoading ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="7" cy="7" r="5" strokeDasharray="20" strokeDashoffset="20" className="animate-spin" style={{ transformOrigin: 'center' }}/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11V3M3 7l4-4 4 4"/>
          </svg>
        )}
      </button>
    </form>
  )
}
