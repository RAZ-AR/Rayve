'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/app/onboarding/actions'
import { Field, ChipGroup, inputCls, selectCls, textareaCls } from './FormField'

const VENUE_TYPES = [
  { id: 'restaurant',    label: 'Restaurant' },
  { id: 'cafe',          label: 'Café / Coffee' },
  { id: 'bar',           label: 'Bar / Pub' },
  { id: 'dark_kitchen',  label: 'Dark kitchen' },
  { id: 'catering',      label: 'Catering' },
  { id: 'bakery',        label: 'Bakery' },
]

const CUISINES = [
  'Italian', 'Asian Fusion', 'Belgian', 'American', 'Mediterranean',
  'Sushi', 'Pizza', 'Burgers', 'Vegan / Vegetarian', 'Other',
]

const ORDER_CHANNELS = [
  { id: 'dine_in',     label: 'Dine-in' },
  { id: 'takeaway',    label: 'Takeaway' },
  { id: 'uber_eats',   label: 'Uber Eats' },
  { id: 'deliveroo',   label: 'Deliveroo' },
  { id: 'own_website', label: 'Own website' },
  { id: 'phone',       label: 'Phone order' },
]

export function HoReCaFields({ sourceDomain }: { sourceDomain: string }) {
  const [venueTypes, setVenueTypes]   = useState<string[]>([])
  const [orderChannels, setChannels]  = useState<string[]>([])
  const [dishes, setDishes]           = useState(['', '', '', '', ''])
  const [error, setError]             = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('segment', 'horeca')
    fd.set('source_domain', sourceDomain)
    fd.set('venue_types', JSON.stringify(venueTypes))
    fd.set('order_channels', JSON.stringify(orderChannels))
    fd.set('top_dishes', JSON.stringify(dishes.filter(Boolean)))
    startTransition(async () => {
      const res = await saveOnboarding(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-8">
        <p className="text-label mb-3">Onboarding · Step 2 of 2</p>
        <h1 className="text-headline text-white">Tell us about your venue</h1>
        <p className="mt-2 text-sm text-[#888]">
          Rayve uses this to build ads that bring in the right customers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Venue / brand name" required>
          <input name="venue_name" type="text" required placeholder="e.g. Bella Piazza" className={inputCls} />
        </Field>

        <Field label="Type of venue" hint="Select all that apply">
          <ChipGroup options={VENUE_TYPES} selected={venueTypes} onChange={setVenueTypes} />
        </Field>

        <Field label="Cuisine type">
          <select name="cuisine" className={selectCls}>
            <option value="">Select cuisine</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Order channels" hint="Where customers can order from you">
          <ChipGroup options={ORDER_CHANNELS} selected={orderChannels} onChange={setChannels} />
        </Field>

        <Field label="City / neighbourhood" required>
          <input name="location" type="text" required placeholder="e.g. Brussels, Ixelles" className={inputCls} />
        </Field>

        <Field label="Signature dishes" hint="Up to 5 — helps write mouth-watering copy">
          <div className="space-y-2">
            {dishes.map((val, i) => (
              <input
                key={i} type="text" value={val}
                onChange={(e) => {
                  const u = [...dishes]; u[i] = e.target.value; setDishes(u)
                }}
                placeholder={`Dish ${i + 1}`}
                className={inputCls}
              />
            ))}
          </div>
        </Field>

        <Field label="Current promotion or special">
          <input name="current_promo" type="text" placeholder="e.g. Lunch menu €12, Happy Hour 4–6pm" className={inputCls} />
        </Field>

        <Field label="Average order / table value">
          <input name="avg_order_value" type="text" placeholder="e.g. €18 per person" className={inputCls} />
        </Field>

        <Field label="Who are your ideal customers?">
          <textarea name="target_customer" rows={2} placeholder="e.g. Families, office workers nearby, tourists" className={textareaCls} />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Website">
            <input name="website_url" type="url" placeholder="https://bellapiazza.be" className={inputCls} />
          </Field>
          <Field label="Instagram handle">
            <input name="instagram_handle" type="text" placeholder="@bellapiazza" className={inputCls} />
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
