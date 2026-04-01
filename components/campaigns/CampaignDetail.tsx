'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Database } from '@/lib/types/database'
import type { MetaInsights } from '@/lib/meta/insights'

type Campaign = Database['public']['Tables']['campaigns']['Row']

interface TargetingSpec {
  creative_direction?: string
  suggested_headline?: string
  suggested_body?: string
  rationale?: string
  duration_days?: number
  total_budget_eur?: number
}

const STATUS_CONFIG: Record<
  Campaign['status'],
  { label: string; bg: string; color: string; border: string }
> = {
  draft:          { label: 'Draft',          bg: 'var(--surface)',            color: 'var(--text-muted)',   border: 'var(--border)' },
  pending_review: { label: 'Pending review', bg: 'rgba(180,83,9,0.08)',      color: '#B45309',             border: 'rgba(180,83,9,0.25)' },
  active:         { label: 'Active',         bg: 'rgba(16,122,62,0.08)',     color: '#107A3E',             border: 'rgba(16,122,62,0.25)' },
  paused:         { label: 'Paused',         bg: 'rgba(234,88,12,0.08)',     color: '#EA580C',             border: 'rgba(234,88,12,0.25)' },
  completed:      { label: 'Completed',      bg: 'var(--surface)',            color: 'var(--text-muted)',   border: 'var(--border)' },
}

interface Props {
  campaign: Campaign
  metaConnected: boolean
}

export function CampaignDetail({ campaign, metaConnected }: Props) {
  const spec = (campaign.targeting_spec ?? {}) as TargetingSpec
  const status = STATUS_CONFIG[campaign.status]

  const [insights, setInsights] = useState<MetaInsights | null>(null)
  const [insightsReason, setInsightsReason] = useState<string | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    if (!campaign.meta_campaign_id) {
      setInsightsReason('not_linked')
      return
    }
    if (!metaConnected) {
      setInsightsReason('not_connected')
      return
    }

    setLoadingInsights(true)
    fetch(`/api/meta/insights/${campaign.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.insights) setInsights(data.insights)
        else setInsightsReason(data.reason ?? 'no_data')
      })
      .catch(() => setInsightsReason('error'))
      .finally(() => setLoadingInsights(false))
  }, [campaign.id, campaign.meta_campaign_id, metaConnected])

  const dailyBudgetEur = campaign.daily_budget ? (campaign.daily_budget / 100).toFixed(2) : null
  const totalBudgetEur = spec.total_budget_eur ?? null
  const durationDays   = spec.duration_days ?? null

  const createdAt = new Date(campaign.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-label mb-1">Campaign</p>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
                {campaign.name}
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Created {createdAt}</p>
            </div>
            <span
              className="mt-1 inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Meta info grid */}
        <div className="grid grid-cols-2 divide-x sm:grid-cols-4" style={{ borderBottom: '1px solid var(--border)', '--tw-divide-opacity': '1' } as React.CSSProperties}>
          <MetaCell label="Objective" value={formatObjective(campaign.objective)} />
          <MetaCell label="Total budget" value={totalBudgetEur ? `€${totalBudgetEur}` : dailyBudgetEur ? `€${dailyBudgetEur}/day` : '—'} />
          <MetaCell label="Duration" value={durationDays ? `${durationDays} days` : '—'} />
          <MetaCell label="Meta Campaign ID" value={campaign.meta_campaign_id ?? '—'} mono />
        </div>

        {/* Audience */}
        {campaign.audience_summary && (
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="mb-1.5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>TARGET AUDIENCE</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{campaign.audience_summary}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 px-6 py-4">
          {campaign.status === 'draft' && (
            <Link
              href="/campaigns"
              className="flex h-9 items-center rounded-lg px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Activate campaign
            </Link>
          )}
          {campaign.meta_campaign_id && (
            <a
              href={`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${campaign.meta_campaign_id}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all hover:bg-[var(--elevated)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              View in Ads Manager
            </a>
          )}
        </div>
      </div>

      {/* Insights */}
      <InsightsPanel loading={loadingInsights} insights={insights} reason={insightsReason} />

      {/* Creative copy */}
      {(spec.suggested_headline || spec.suggested_body || spec.creative_direction) && (
        <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Ad copy</p>
          </div>
          <div className="space-y-4 px-6 py-5">
            {spec.suggested_headline && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Headline</p>
                <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{spec.suggested_headline}</p>
              </div>
            )}
            {spec.suggested_body && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Body</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{spec.suggested_body}</p>
              </div>
            )}
            {spec.creative_direction && (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Creative direction</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{spec.creative_direction}</p>
              </div>
            )}
            {spec.rationale && (
              <div className="rounded-lg p-4" style={{ background: 'var(--accent-light)', border: '1px solid rgba(109,40,217,0.15)' }}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-text)' }}>Rayve rationale</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--accent-text)' }}>{spec.rationale}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border)' }}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p
        className={`truncate text-sm font-semibold ${mono ? 'font-mono text-xs' : ''}`}
        style={{ color: 'var(--text)' }}
        title={value}
      >
        {value}
      </p>
    </div>
  )
}

function InsightsPanel({
  loading,
  insights,
  reason,
}: {
  loading: boolean
  insights: MetaInsights | null
  reason: string | null
}) {
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Meta Insights</p>
        {insights && (
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {insights.date_start} – {insights.date_stop}
          </p>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      )}

      {!loading && insights && (
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          <InsightCard label="Impressions" value={fmt(insights.impressions)} />
          <InsightCard label="Reach"       value={fmt(insights.reach)} />
          <InsightCard label="Clicks"      value={fmt(insights.clicks)} />
          <InsightCard label="Spend"       value={`€${insights.spend.toFixed(2)}`} />
          <InsightCard label="CTR"         value={`${insights.ctr.toFixed(2)}%`} />
          <InsightCard label="CPM"         value={`€${insights.cpm.toFixed(2)}`} />
          <InsightCard label="Frequency"   value={insights.frequency.toFixed(2)} />
          <InsightCard label="Cost/result" value={insights.cpp > 0 ? `€${insights.cpp.toFixed(2)}` : '—'} />
        </div>
      )}

      {!loading && !insights && (
        <div className="px-6 py-8 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {reason === 'not_linked'
              ? 'Activate this campaign to see live Meta metrics here.'
              : reason === 'not_connected'
              ? 'Connect your Meta account in Settings to see live metrics.'
              : 'No delivery data yet. Metrics appear once the campaign starts running.'}
          </p>
          {(reason === 'not_connected') && (
            <a
              href="/settings"
              className="mt-3 inline-flex h-8 items-center rounded-lg px-4 text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Go to Settings →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function InsightCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-lg px-4 py-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="text-xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
        {value}
      </p>
    </div>
  )
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function formatObjective(obj: string | null): string {
  if (!obj) return '—'
  const map: Record<string, string> = {
    CONVERSIONS:    'Conversions',
    REACH:          'Reach',
    TRAFFIC:        'Traffic',
    LEAD_GENERATION: 'Lead gen',
    BRAND_AWARENESS: 'Awareness',
    VIDEO_VIEWS:    'Video views',
  }
  return map[obj] ?? obj
}
