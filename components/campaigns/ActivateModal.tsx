'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types/database'

type Campaign = Database['public']['Tables']['campaigns']['Row']

interface TargetingSpec {
  duration_days?: number
  total_budget_eur?: number
  suggested_headline?: string
  suggested_body?: string
}

interface Props {
  campaign: Campaign
  onClose: () => void
}

export function ActivateModal({ campaign, onClose }: Props) {
  const router = useRouter()
  const [activating, setActivating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const spec = (campaign.targeting_spec ?? {}) as TargetingSpec
  const durationDays = spec.duration_days ?? 7
  const totalBudget = spec.total_budget_eur ?? 0
  const dailyBudget = totalBudget > 0 ? (totalBudget / durationDays).toFixed(2) : '—'

  async function handleConfirm() {
    setActivating(true)
    setError(null)
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/activate`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Activation failed')
      onClose()
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setActivating(false)
    }
  }

  return (
    // Backdrop — not dismissible by clicking outside (ADR-006)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-card-lg"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Confirm activation</p>
          <h2
            className="mt-0.5 text-lg font-black tracking-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            {campaign.name}
          </h2>
        </div>

        {/* Budget breakdown */}
        <div className="px-6 py-5">
          <div
            className="mb-4 rounded-xl p-4"
            style={{ background: 'var(--accent-light)', border: '1px solid rgba(109,40,217,0.15)' }}
          >
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs" style={{ color: 'var(--accent-text)' }}>Total budget</p>
                <p className="mt-0.5 text-lg font-black" style={{ color: 'var(--text)' }}>
                  €{totalBudget}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--accent-text)' }}>Per day</p>
                <p className="mt-0.5 text-lg font-black" style={{ color: 'var(--text)' }}>
                  €{dailyBudget}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--accent-text)' }}>Duration</p>
                <p className="mt-0.5 text-lg font-black" style={{ color: 'var(--text)' }}>
                  {durationDays}d
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <BudgetRow label="Campaign" value={campaign.name} />
            <BudgetRow label="Objective" value={formatObjective(campaign.objective)} />
            {campaign.audience_summary && (
              <BudgetRow label="Audience" value={campaign.audience_summary} />
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            The campaign will be created in your Meta Ads account with status{' '}
            <strong style={{ color: 'var(--text)' }}>Paused</strong>. You can activate it in Meta Ads Manager after reviewing.
          </p>

          {error && (
            <div
              className="mt-3 rounded-lg px-3 py-2 text-xs"
              style={{
                background: 'rgba(220,38,38,0.06)',
                border: '1px solid rgba(220,38,38,0.2)',
                color: '#DC2626',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 px-6 py-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={handleConfirm}
            disabled={activating}
            className="flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {activating ? (
              <span className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30"
                  style={{ borderTopColor: 'white' }}
                />
                Activating…
              </span>
            ) : (
              'Confirm & activate'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={activating}
            className="flex h-10 items-center rounded-xl px-5 text-sm font-medium transition-all hover:bg-[var(--elevated)] disabled:opacity-40"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function BudgetRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 text-xs">
      <span className="w-20 shrink-0 font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  )
}

function formatObjective(obj: string | null): string {
  if (!obj) return '—'
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
