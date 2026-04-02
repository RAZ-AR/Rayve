'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/app/onboarding/actions'
import { Field, ChipGroup, inputCls, selectCls, textareaCls } from './FormField'
import { StepHeader, FormError, FormActions } from './RetailFields'
import { CityAutocomplete } from './CityAutocomplete'
import { UrlInput } from './UrlInput'

const VENUE_TYPES = [
  { id: 'restaurant',   label: 'Restaurant' },
  { id: 'cafe',         label: 'Café / Coffee' },
  { id: 'bar',          label: 'Bar / Pub' },
  { id: 'dark_kitchen', label: 'Dark kitchen' },
  { id: 'catering',     label: 'Catering' },
  { id: 'bakery',       label: 'Bakery' },
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

interface HoReCaFieldsProps {
  sourceDomain: string
  initialData?: Record<string, unknown> | null
}

export function HoReCaFields({ sourceDomain, initialData }: HoReCaFieldsProps) {
  const d = initialData ?? {}
  const [venueTypes,    setVenueTypes]  = useState<string[]>((d.venue_types as string[]) ?? [])
  const [orderChannels, setChannels]   = useState<string[]>((d.order_channels as string[]) ?? [])
  const [dishes,        setDishes]     = useState<string[]>(() => {
    const saved = (d.top_dishes as string[]) ?? []
    const arr = [...saved, '', '', '', '', ''].slice(0, 5)
    return arr
  })
  const [error,         setError]      = useState<string | null>(null)
  const [isPending,     startTransition] = useTransition()

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
    <div className="w-full animate-fade-in">
      <StepHeader
        step="Step 2 of 2"
        title="Tell us about your venue"
        subtitle="Rayve uses this to build ads that bring in the right customers."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Venue / brand name" required>
          <input name="venue_name" type="text" required placeholder="e.g. Bella Piazza" className={inputCls}
            defaultValue={(d.venue_name as string) ?? ''} />
        </Field>

        <Field label="Type of venue" hint="Select all that apply">
          <ChipGroup options={VENUE_TYPES} selected={venueTypes} onChange={setVenueTypes} />
        </Field>

        <Field label="Cuisine type">
          <select name="cuisine" className={selectCls} defaultValue={(d.cuisine as string) ?? ''}>
            <option value="">Select cuisine</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Order channels" hint="Where customers can order from you">
          <ChipGroup options={ORDER_CHANNELS} selected={orderChannels} onChange={setChannels} />
        </Field>

        <Field label="City / neighbourhood" required>
          <CityAutocomplete name="location" placeholder="e.g. Brussels, Ixelles" required
            defaultValue={(d.location as string) ?? ''} />
        </Field>

        <Field label="Signature dishes" hint="Up to 5 — helps write mouth-watering copy">
          <div className="space-y-2">
            {dishes.map((val, i) => (
              <input
                key={i} type="text" value={val}
                onChange={(e) => { const u = [...dishes]; u[i] = e.target.value; setDishes(u) }}
                placeholder={`Dish ${i + 1}`}
                className={inputCls}
              />
            ))}
          </div>
        </Field>

        <Field label="Current promotion or special">
          <input name="current_promo" type="text" placeholder="e.g. Lunch menu €12, Happy Hour 4–6pm" className={inputCls}
            defaultValue={(d.current_promo as string) ?? ''} />
        </Field>

        <Field label="Average order / table value">
          <input name="avg_order_value" type="text" placeholder="e.g. €18 per person" className={inputCls}
            defaultValue={(d.avg_order_value as string) ?? ''} />
        </Field>

        <Field label="Who are your ideal customers?">
          <textarea name="target_customer" rows={2} placeholder="e.g. Families, office workers nearby, tourists" className={textareaCls}
            defaultValue={(d.target_customer as string) ?? ''} />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Website">
            <UrlInput name="website_url" placeholder="bellapiazza.be"
              defaultValue={(d.website_url as string) ?? ''} />
          </Field>
          <Field label="Instagram handle">
            <input name="instagram_handle" type="text" placeholder="@bellapiazza" className={inputCls}
              defaultValue={(d.instagram_handle as string) ?? ''} />
          </Field>
        </div>

        <FormError error={error} />
        <FormActions isPending={isPending} />
      </form>
    </div>
  )
}
