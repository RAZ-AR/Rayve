'use client'

import { useState } from 'react'

export interface ProposalData {
  name: string
  objective: string
  target_audience: string
  creative_direction: string
  suggested_headline: string
  suggested_body: string
  budget_suggestion: number
  duration_days: number
  rationale: string
}

interface Props {
  proposal: ProposalData
  businessId: string
  onSaved: (campaignId: string) => void
  onRegenerate: () => void
}

export function CampaignProposal({ proposal, businessId, onSaved, onRegenerate }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal, businessId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save')
      setSaved(true)
      onSaved(json.campaignId)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const dailyBudget = (proposal.budget_suggestion / proposal.duration_days).toFixed(0)

  return (
    <div
      className="flex h-full flex-col rounded-xl"
      style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Campaign proposal</span>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            background: 'rgba(180,83,9,0.08)',
            color: '#B45309',
            border: '1px solid rgba(180,83,9,0.2)',
          }}
        >
          Draft
        </span>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto">
        <div>
          <ProposalRow label="Name" value={proposal.name} />
          <ProposalRow label="Objective" value={formatObjective(proposal.objective)} />
          <ProposalRow label="Audience" value={proposal.target_audience} />
          <ProposalRow label="Headline" value={`"${proposal.suggested_headline}"`} highlight />
          <ProposalRow label="Body" value={`"${proposal.suggested_body}"`} />
          <ProposalRow label="Creative" value={proposal.creative_direction} />
          <ProposalRow
            label="Budget"
            value={`€${proposal.budget_suggestion} total · €${dailyBudget}/day · ${proposal.duration_days} days`}
          />
        </div>

        {/* Rationale */}
        <div
          className="px-5 py-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-label mb-1.5">Strategy</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {proposal.rationale}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

        {saved ? (
          <div className="flex items-center gap-2 text-xs" style={{ color: '#107A3E' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7l3.5 3.5L12 3" />
            </svg>
            Saved to campaigns
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex h-9 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {saving ? 'Saving…' : 'Save draft'}
            </button>
            <button
              onClick={onRegenerate}
              className="flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-all hover:bg-[var(--elevated)]"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
              }}
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProposalRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className="px-5 py-3"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <p className="text-label mb-0.5">{label}</p>
      <p
        className="text-xs leading-relaxed"
        style={highlight
          ? { color: 'var(--text)', fontWeight: 600 }
          : { color: 'var(--text-secondary)' }
        }
      >
        {value}
      </p>
    </div>
  )
}

function formatObjective(obj: string): string {
  const map: Record<string, string> = {
    CONVERSIONS: 'Conversions',
    REACH: 'Reach',
    TRAFFIC: 'Traffic',
    LEAD_GENERATION: 'Lead generation',
    BRAND_AWARENESS: 'Brand awareness',
    VIDEO_VIEWS: 'Video views',
  }
  return map[obj] ?? obj
}
