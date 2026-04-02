'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/app/onboarding/actions'
import { Field, ChipGroup, inputCls, selectCls, textareaCls } from './FormField'

const CATEGORIES = ['Fashion & Apparel','Beauty & Cosmetics','Electronics','Food & Beverages','Home & Living','Sports & Fitness','Toys & Kids','Other']

const SALES_CHANNELS = [
  { id: 'physical',    label: 'Physical store' },
  { id: 'website',     label: 'Website' },
  { id: 'instagram',   label: 'Instagram' },
  { id: 'telegram',    label: 'Telegram' },
  { id: 'marketplace', label: 'Marketplace' },
]

export function RetailFields({ sourceDomain }: { sourceDomain: string }) {
  const [channels, setChannels] = useState<string[]>([])
  const [products, setProducts] = useState(['', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('segment', 'retail')
    fd.set('source_domain', sourceDomain)
    fd.set('sales_channels', JSON.stringify(channels))
    fd.set('key_products', JSON.stringify(products.filter(Boolean)))
    startTransition(async () => {
      const res = await saveOnboarding(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <div className="w-full animate-fade-in">
      <StepHeader
        step="Step 2 of 2"
        title="Tell us about your shop"
        subtitle="Rayve uses this to write ads that speak to your actual customers."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Store / brand name" required>
          <input name="store_name" type="text" required placeholder="e.g. Nova Studio" className={inputCls} />
        </Field>

        <Field label="Category" required>
          <select name="category" required className={selectCls}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Where do you sell?" hint="Select all that apply">
          <ChipGroup options={SALES_CHANNELS} selected={channels} onChange={setChannels} />
        </Field>

        <Field label="Average order value">
          <input name="avg_order_value" type="text" placeholder="e.g. €45" className={inputCls} />
        </Field>

        <Field label="Key products" hint="Up to 5">
          <div className="space-y-2">
            {products.map((val, i) => (
              <input
                key={i} type="text" value={val}
                onChange={(e) => { const u = [...products]; u[i] = e.target.value; setProducts(u) }}
                placeholder={`Product ${i + 1}`}
                className={inputCls}
              />
            ))}
          </div>
        </Field>

        <Field label="Current promo or sale">
          <input name="current_promo" type="text" placeholder="e.g. 20% off all summer items" className={inputCls} />
        </Field>

        <Field label="Target customer description">
          <textarea name="target_customer" rows={3} placeholder="e.g. Women 25–40 interested in sustainable fashion" className={textareaCls} />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Website URL">
            <input name="website_url" type="url" placeholder="https://yourshop.com" className={inputCls} />
          </Field>
          <Field label="Instagram handle">
            <input name="instagram_handle" type="text" placeholder="@yourshop" className={inputCls} />
          </Field>
        </div>

        <FormError error={error} />

        <FormActions isPending={isPending} />
      </form>
    </div>
  )
}

/* ── Shared sub-components ── */
export function StepHeader({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Onboarding · {step}
      </p>
      <h1 className="mb-2 text-3xl font-black tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
        {title}
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </div>
  )
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs"
      style={{ border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.04)', color: '#DC2626' }}
    >
      {error}
    </div>
  )
}

export function FormActions({ isPending }: { isPending: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <a
        href="/onboarding?step=1"
        className="flex h-10 items-center rounded-xl px-4 text-sm font-medium transition-all hover:opacity-80"
        style={{ border: '1px solid var(--border)', background: 'white', color: 'var(--text-secondary)' }}
      >
        ← Back
      </a>
      <button
        type="submit" disabled={isPending}
        className="flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
        style={{ background: 'var(--accent)' }}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30" style={{ borderTopColor: 'white' }} />
            Saving…
          </span>
        ) : 'Continue to dashboard →'}
      </button>
    </div>
  )
}
