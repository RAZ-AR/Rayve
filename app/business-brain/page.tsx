import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { SEGMENT_CONFIGS } from '@/lib/segments/config'
import type { BusinessType } from '@/lib/segments/types'

export default async function BusinessBrainPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) redirect('/onboarding')

  const cfg = SEGMENT_CONFIGS[business.business_type as BusinessType]
  const data = business.segment_data as Record<string, unknown>

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 animate-fade-in">

      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-label mb-2">Business Brain</p>
          <h1 className="text-page-title">
            {business.name || 'Your business profile'}
          </h1>
        </div>
        <Link
          href={`/onboarding?step=2&segment=${business.business_type}&edit=true`}
          className="mt-2 flex h-9 items-center rounded-lg px-4 text-sm font-medium transition-all hover:bg-[var(--elevated)]"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
          }}
        >
          Edit profile
        </Link>
      </div>

      {/* Profile header */}
      <div
        className="mb-4 flex items-center gap-3 rounded-xl p-5"
        style={{ border: '1px solid var(--border)', background: 'var(--accent-light)' }}
      >
        <span className="text-3xl">{cfg.iconEmoji}</span>
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--accent-text)' }}>{cfg.label}</p>
          <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{business.name}</p>
        </div>
      </div>

      {/* Data grid */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: '1px solid var(--border)' }}
      >
        {Object.entries(data)
          .filter(([, v]) => v && !(Array.isArray(v) && (v as unknown[]).length === 0))
          .map(([key, value], i, arr) => (
            <div
              key={key}
              className="flex items-start gap-4 px-5 py-3.5"
              style={{
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : undefined,
                background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
              }}
            >
              <span
                className="w-36 shrink-0 text-xs font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                {key.replace(/_/g, ' ')}
              </span>
              <span className="text-xs" style={{ color: 'var(--text)' }}>
                {Array.isArray(value) ? (value as string[]).join(', ') : String(value)}
              </span>
            </div>
          ))}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        This context is used by Rayve&apos;s AI to write campaigns specific to your business.
      </p>
    </div>
  )
}
