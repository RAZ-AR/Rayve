'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/app/onboarding/actions'
import { Field, ChipGroup, inputCls, selectCls } from './FormField'
import { StepHeader, FormError, FormActions } from './RetailFields'
import { UrlInput } from './UrlInput'

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
  const [error,        setError]        = useState<string | null>(null)
  const [isPending,    startTransition] = useTransition()

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
    <div className="w-full animate-fade-in">
      <StepHeader
        step="Step 2 of 2"
        title="Tell us about your brand"
        subtitle="Rayve will match your voice and target your ideal audience."
      />

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
          <UrlInput name="link_in_bio_url" placeholder="linktr.ee/you" />
        </Field>

        <FormError error={error} />
        <FormActions isPending={isPending} />
      </form>
    </div>
  )
}
