'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/app/onboarding/actions'
import { Field, ChipGroup, inputCls, selectCls, textareaCls } from './FormField'
import { StepHeader, FormError, FormActions } from './RetailFields'

const PRODUCT_TYPES = [
  { id: 'online_course', label: 'Online course' },
  { id: 'coaching',      label: '1:1 Coaching' },
  { id: 'group_program', label: 'Group program' },
  { id: 'webinar',       label: 'Webinar / event' },
  { id: 'membership',    label: 'Membership' },
  { id: 'ebook',         label: 'E-book / guide' },
]

const NICHES = [
  'Business & Entrepreneurship',
  'Health & Fitness',
  'Personal Development',
  'Finance & Investing',
  'Parenting & Family',
  'Relationships',
  'Marketing & Sales',
  'Tech / Programming',
  'Creative Skills',
  'Other',
]

const GOALS = [
  { id: 'leads',         label: 'Generate leads' },
  { id: 'registrations', label: 'Webinar sign-ups' },
  { id: 'sales',         label: 'Direct sales' },
  { id: 'awareness',     label: 'Build awareness' },
  { id: 'community',     label: 'Grow community' },
]

export function InfoBusinessFields({ sourceDomain }: { sourceDomain: string }) {
  const [productTypes, setProductTypes] = useState<string[]>([])
  const [adGoals,      setAdGoals]      = useState<string[]>([])
  const [error,        setError]        = useState<string | null>(null)
  const [isPending,    startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('segment', 'info')
    fd.set('source_domain', sourceDomain)
    fd.set('product_types', JSON.stringify(productTypes))
    fd.set('ad_goals', JSON.stringify(adGoals))
    startTransition(async () => {
      const res = await saveOnboarding(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <div className="w-full animate-fade-in">
      <StepHeader
        step="Step 2 of 2"
        title="Tell us about your offer"
        subtitle="Rayve builds campaigns around the transformation you deliver."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Brand / business name" required>
          <input name="brand_name" type="text" required placeholder="e.g. Elevate Coaching" className={inputCls} />
        </Field>

        <Field label="What do you sell?" hint="Select all that apply">
          <ChipGroup options={PRODUCT_TYPES} selected={productTypes} onChange={setProductTypes} />
        </Field>

        <Field label="Niche / topic area" required>
          <select name="niche" required className={selectCls}>
            <option value="">Select your niche</option>
            {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>

        <Field label="Main ad goal" hint="What should the campaign achieve?">
          <ChipGroup options={GOALS} selected={adGoals} onChange={setAdGoals} />
        </Field>

        <Field label="Your flagship offer" required>
          <input name="flagship_offer" type="text" required placeholder="e.g. 8-week business accelerator — €997" className={inputCls} />
        </Field>

        <Field label="Transformation promise" hint="What life change do you deliver?">
          <textarea name="transformation" rows={2} placeholder="e.g. Go from 0 to 5k/month in 90 days without a big audience" className={textareaCls} />
        </Field>

        <Field label="Who is your ideal student / client?">
          <textarea name="target_customer" rows={2} placeholder="e.g. Freelancers 28–45 who want to start an online business" className={textareaCls} />
        </Field>

        <Field label="Price range">
          <input name="price_range" type="text" placeholder="e.g. €97 – €1 997" className={inputCls} />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Landing page or sales page">
            <input name="website_url" type="url" placeholder="https://elevatecoaching.com" className={inputCls} />
          </Field>
          <Field label="Instagram / TikTok handle">
            <input name="instagram_handle" type="text" placeholder="@elevatecoaching" className={inputCls} />
          </Field>
        </div>

        <FormError error={error} />
        <FormActions isPending={isPending} />
      </form>
    </div>
  )
}
