'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { CampaignProposal, type ProposalData } from './CampaignProposal'
import type { Business } from '@/lib/types/database'
import type { BusinessType } from '@/lib/segments/types'

interface Props {
  business: Business
  initialInput?: string
}

export function ChatWorkspace({ business, initialInput = '' }: Props) {
  const [input, setInput] = useState(initialInput)
  const [savedCampaignId, setSavedCampaignId] = useState<string | null>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: { businessId: business.id },
      }),
    [business.id],
  )

  const { messages, sendMessage, setMessages, status } = useChat({ transport })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Extract the latest propose_campaign tool part from messages
  const proposal = extractProposal(messages)

  function handleSend(text: string) {
    if (!text.trim() || isLoading) return
    sendMessage({ text: text.trim() })
    setInput('')
  }

  function handleSuggestion(text: string) {
    handleSend(text)
  }

  function handleRegenerate() {
    setMessages([])
    setInput('')
    setSavedCampaignId(null)
  }

  const handleSaved = useCallback((id: string) => {
    setSavedCampaignId(id)
  }, [])

  const isEmpty = messages.length === 0

  return (
    <div
      className="flex h-[calc(100vh-48px)] lg:h-screen gap-0 lg:gap-4 lg:p-4"
      style={{ background: 'var(--bg-muted)' }}
    >
      {/* Chat column */}
      <div
        className="relative flex min-w-0 flex-1 flex-col overflow-hidden lg:rounded-2xl"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
      >
        {/* Empty state hero — shown when no messages */}
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-32 text-center">
            {/* Gradient badge */}
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,7,100,0.1) 100%)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13 5.5 8.5 1 7l4.5-1.5z" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-black tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              What&apos;s the goal?
            </h2>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tell Rayve what you want to achieve — a full Meta Ads brief will be ready in seconds.
            </p>

            {/* Quick suggestion chips */}
            <SuggestionChips segment={business.business_type as BusinessType} onSend={handleSend} />
          </div>
        ) : (
          /* Messages */
          <MessageList messages={messages} isLoading={isLoading} />
        )}

        {/* Floating bottom bar */}
        <div
          className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-3"
          style={{
            background: 'linear-gradient(to top, var(--bg) 80%, transparent)',
          }}
        >
          {messages.length > 0 && (
            <div className="mb-2 flex justify-end">
              <button
                onClick={handleRegenerate}
                className="text-[11px] transition-colors hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Start over
              </button>
            </div>
          )}
          <MessageInput
            input={input}
            isLoading={isLoading}
            onInputChange={(e) => setInput(e.target.value)}
            onSend={handleSend}
          />
        </div>
      </div>

      {/* Proposal panel */}
      <div className="hidden w-[340px] shrink-0 lg:flex lg:flex-col gap-3">
        {proposal ? (
          <CampaignProposal
            proposal={proposal}
            businessId={business.id}
            onSaved={handleSaved}
            onRegenerate={handleRegenerate}
          />
        ) : (
          <ProposalEmptyState />
        )}

        {savedCampaignId && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Campaign saved as draft.</p>
            <Link
              href="/campaigns"
              className="flex h-8 items-center justify-center rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              View in campaigns →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Suggestion chips ── */
const SEGMENT_SUGGESTIONS: Record<BusinessType, string[]> = {
  retail:     ['Promote my best sellers', 'Run a flash sale', 'Get more online orders'],
  influencer: ['Grow my Instagram', 'Drive traffic to link in bio', 'Promote my new drop'],
  horeca:     ['Get more reservations', 'Promote our lunch special', 'Drive weekend orders'],
  info:       ['Fill my next cohort', 'Free webinar sign-ups', 'Promote my course'],
}

function SuggestionChips({ segment, onSend }: { segment: BusinessType; onSend: (t: string) => void }) {
  const chips = SEGMENT_SUGGESTIONS[segment] ?? SEGMENT_SUGGESTIONS.retail
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {chips.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSend(s)}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all hover:opacity-80 active:scale-95"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>→</span>
          {s}
        </button>
      ))}
    </div>
  )
}

function ProposalEmptyState() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center rounded-2xl px-6 text-center"
      style={{
        border: '1px dashed var(--border-strong)',
        background: 'var(--bg)',
      }}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--text-muted)' }}>
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <path d="M5 8h6M5 5.5h4M5 10.5h3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Campaign brief</p>
      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Describe your goal — your campaign brief will appear here.
      </p>
    </div>
  )
}

type UIMsg = ReturnType<typeof useChat>['messages'][number]

function extractProposal(messages: UIMsg[]): ProposalData | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role !== 'assistant') continue
    for (const part of m.parts) {
      if (part.type === 'tool-propose_campaign') {
        const p = part as { state: string; input?: unknown; output?: unknown }
        if (p.state === 'output-available') return p.output as ProposalData
        if (p.state === 'input-available' || p.state === 'input-streaming') {
          return p.input as ProposalData
        }
      }
    }
  }
  return null
}
