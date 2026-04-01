'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/app/onboarding/actions'
import { Field, ChipGroup, inputCls, selectCls } from './FormField'

const NICHES = ['Lifestyle','Fitness & Health','Beauty & Fashion','Food & Cooking','Finance & Business','Travel','Gaming','Tech','Other']

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok',    label: 'TikTok' },
  { id: 'youtube',   label: 'YouTube' },
  { id: 'telegram',  label: 'Telegram' },
  { id: 'twitter',   label: 'X / Twitter' },
]

const MONETIZATION = [
  { id: 'merch',        label: 'Merch / products' },
  { id: 'brand_deals',  label: 'Brand deals' },
  { id: 'paid_content', label: 'Paid content' },
  { id: 'events',       label: 'Events' },
  { id: 'courses',      label: 'Courses / coaching' },
]

const VOICES = ['Casual & friendly','Educational','Entertaining & fun','Premium & aspirational','Raw & authentic']

export function InfluencerFields({ sourceDomain }: { sourceDomain: string }) {
  const [platforms,    setPlatforms]    = useState<string[]>([])
  const [monetization, setMonetization] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('segment', 'influencer')
    fd.set('source_domain', sourceDomain)
    fd.set('platforms', JSON.stringify(platforms))
    fd.set('monetization', JSON.stringify(monetization))
    startTransition(async () => {
      const res = await saveOnboarding(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-8">
        <p className="text-label mb-3">Onboarding · Step 2 of 2</p>
        <h1 className="text-headline text-white">Tell us about your brand</h1>
        <p className="mt-2 text-sm text-[#888]">
          Rayve will match your voice and target your ideal audience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Creator / brand name" required>
            <input name="creator_name" type="text" required placeholder="e.g. Maya Creates" className={inputCls} />
          </Field>
          <Field label="Primary handle" required>
            <input name="handle" type="text" required placeholder="@yourusername" className={inputCls} />
          </Field>
        </div>

        <Field label="Your niche" required>
          <select name="niche" required className={selectCls}>
            <option value="">Select your niche</option>
            {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>

        <Field label="Primary platforms" hint="Select all">
          <ChipGroup options={PLATFORMS} selected={platforms} onChange={setPlatforms} color="pink" />
        </Field>

        <Field label="Approximate audience size">
          <select name="audience_size" className={selectCls}>
            <option value="">Select range</option>
            <option value="under_1k">Under 1K</option>
            <option value="1k_10k">1K – 10K</option>
            <option value="10k_100k">10K – 100K</option>
            <option value="100k_1m">100K – 1M</option>
            <option value="over_1m">Over 1M</option>
          </select>
        </Field>

        <Field label="How do you monetize?" hint="Select all">
          <ChipGroup options={MONETIZATION} selected={monetization} onChange={setMonetization} color="pink" />
        </Field>

        <Field label="Current offer or drop">
          <input name="current_offer" type="text" placeholder="e.g. New merch drop this Friday" className={inputCls} />
        </Field>

        <Field label="Your brand voice" required>
          <select name="brand_voice" required className={selectCls}>
            <option value="">Select your tone</option>
            {VOICES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>

        <Field label="Link-in-bio URL">
          <input name="link_in_bio_url" type="url" placeholder="https://linktr.ee/you" className={inputCls} />
        </Field>

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
