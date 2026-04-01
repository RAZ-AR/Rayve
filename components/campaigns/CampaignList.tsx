'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types/database'
import { ActivateModal } from './ActivateModal'

type Campaign = Database['public']['Tables']['campaigns']['Row']

const STATUS_CONFIG: Record<
  Campaign['status'],
  { label: string; bg: string; color: string; border: string }
> = {
  draft: {
    label: 'Draft',
    bg: 'var(--surface)',
    color: 'var(--text-muted)',
    border: 'var(--border)',
  },
  pending_review: {
    label: 'Pending review',
    bg: 'rgba(180,83,9,0.08)',
    color: '#B45309',
    border: 'rgba(180,83,9,0.25)',
  },
  active: {
    label: 'Active',
    bg: 'rgba(16,122,62,0.08)',
    color: '#107A3E',
    border: 'rgba(16,122,62,0.25)',
  },
  paused: {
    label: 'Paused',
    bg: 'rgba(234,88,12,0.08)',
    color: '#EA580C',
    border: 'rgba(234,88,12,0.25)',
  },
  completed: {
    label: 'Completed',
    bg: 'var(--surface)',
    color: 'var(--text-muted)',
    border: 'var(--border)',
  },
}

interface Props {
  campaigns: Campaign[]
}

export function CampaignList({ campaigns }: Props) {
  const [activating, setActivating] = useState<Campaign | null>(null)

  return (
    <>
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_130px_100px_110px_80px_80px] gap-3 px-5 py-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          {['Name', 'Objective', 'Budget', 'Status', 'Date', ''].map((h) => (
            <span key={h} className="text-label">{h}</span>
          ))}
        </div>

        {campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {campaigns.map((c) => (
              <CampaignRow key={c.id} campaign={c} onActivate={() => setActivating(c)} />
            ))}
          </div>
        )}
      </div>

      {activating && (
        <ActivateModal campaign={activating} onClose={() => setActivating(null)} />
      )}
    </>
  )
}

function CampaignRow({
  campaign,
  onActivate,
}: {
  campaign: Campaign
  onActivate: () => void
}) {
  const router = useRouter()
  const status = STATUS_CONFIG[campaign.status]
  const spec = campaign.targeting_spec as Record<string, unknown> | null
  const durationDays = spec?.duration_days as number | undefined
  const totalBudget = spec?.total_budget_eur as number | undefined
  const budgetEur = campaign.daily_budget
    ? (campaign.daily_budget / 100).toFixed(0)
    : null

  const createdAt = new Date(campaign.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="grid grid-cols-[1fr_130px_100px_110px_80px_80px] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--surface)] cursor-pointer"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold hover:underline underline-offset-2" style={{ color: 'var(--text)' }}>
          {campaign.name}
        </p>
        {campaign.audience_summary && (
          <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-muted)' }}>
            {campaign.audience_summary}
          </p>
        )}
      </div>

      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {formatObjective(campaign.objective)}
      </span>

      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {totalBudget ? `€${totalBudget}` : budgetEur ? `€${budgetEur}/day` : '—'}
        {durationDays ? ` · ${durationDays}d` : ''}
      </span>

      <span
        className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{
          background: status.bg,
          color: status.color,
          border: `1px solid ${status.border}`,
        }}
      >
        {status.label}
      </span>

      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{createdAt}</span>

      <div>
        {campaign.status === 'draft' && (
          <button
            onClick={(e) => { e.stopPropagation(); onActivate() }}
            className="flex h-7 items-center rounded-lg px-2.5 text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Activate
          </button>
        )}
        {campaign.meta_campaign_id && (
          <span
            className="inline-flex items-center gap-1 text-[10px]"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            In Meta
          </span>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--text-muted)' }}>
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <path d="M5 8h6M5 5.5h4M5 10.5h3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mb-1 text-base font-bold" style={{ color: 'var(--text)' }}>No campaigns yet</p>
      <p className="mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Describe your goal in the chat and Rayve will build your first campaign.
      </p>
      <Link
        href="/chat"
        className="flex h-9 items-center rounded-lg px-5 text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: 'var(--accent)' }}
      >
        Create campaign →
      </Link>
    </div>
  )
}

function formatObjective(obj: string | null): string {
  if (!obj) return '—'
  const map: Record<string, string> = {
    CONVERSIONS: 'Conversions',
    REACH: 'Reach',
    TRAFFIC: 'Traffic',
    LEAD_GENERATION: 'Lead gen',
    BRAND_AWARENESS: 'Awareness',
    VIDEO_VIEWS: 'Video views',
  }
  return map[obj] ?? obj
}
