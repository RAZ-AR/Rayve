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
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-8">
        <p className="text-label mb-3">Onboarding · Step 2 of 2</p>
        <h1 className="text-headline text-white">Tell us about your shop</h1>
        <p className="mt-2 text-sm text-[#888]">
          Rayve uses this to write ads that speak to your actual customers.
        </p>
      </div>

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
                onChange={(e) => {
                  const u = [...products]; u[i] = e.target.value; setProducts(u)
                }}
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

        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <a href="/onboarding?step=1" className="flex h-9 items-center rounded-md border border-white/[0.08] px-4 text-sm text-[#888] transition-all hover:border-white/[0.14] hover:text-white">
            ← Back
          </a>
          <button
            type="submit" disabled={isPending}
            className="flex h-9 flex-1 items-center justify-center rounded-md bg-violet-600 text-sm font-medium text-white ring-1 ring-violet-500/50 transition-all hover:bg-violet-500 disabled:opacity-40"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30 border-t-white" />
                Saving…
              </span>
            ) : 'Continue to dashboard →'}
          </button>
        </div>
      </form>
    </div>
  )
}
