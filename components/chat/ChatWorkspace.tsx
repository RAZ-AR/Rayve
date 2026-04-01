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
    setInput(text)
  }

  function handleRegenerate() {
    setMessages([])
    setInput('')
    setSavedCampaignId(null)
  }

  const handleSaved = useCallback((id: string) => {
    setSavedCampaignId(id)
  }, [])

  return (
    <div
      className="flex h-[calc(100vh-48px)] gap-4 p-4"
      style={{ background: 'var(--bg-warm)' }}
    >
      {/* Chat column */}
      <div
        className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
      >
        {/* Chat header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>New campaign</p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business.name}</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleRegenerate}
              className="text-xs transition-colors hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              Start over
            </button>
          )}
        </div>

        {/* Messages */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input */}
        <MessageInput
          input={input}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
          segment={business.business_type as BusinessType}
          onInputChange={(e) => setInput(e.target.value)}
          onSend={handleSend}
          onSuggestion={handleSuggestion}
        />
      </div>

      {/* Proposal panel */}
      <div className="hidden w-[340px] shrink-0 lg:block">
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
            className="mt-3 rounded-xl px-4 py-3"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Campaign saved as draft.</p>
            <Link
              href="/campaigns"
              className="flex h-8 items-center justify-center rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
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

function ProposalEmptyState() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center rounded-xl px-6 text-center"
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
      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Campaign proposal</p>
      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Describe your goal and answer a few questions — your campaign brief will appear here.
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
      // In AI SDK v6, tool parts have type `tool-${toolName}`
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
