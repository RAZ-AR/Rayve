'use client'

import { useState, useRef, useEffect } from 'react'
import { inputCls } from './FormField'

interface NominatimResult {
  name: string
  display_name: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    country_code?: string
  }
}

interface Props {
  name: string
  placeholder?: string
  required?: boolean
}

export function CityAutocomplete({ name, placeholder = 'e.g. Brussels, Ixelles', required }: Props) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=6&featuretype=settlement`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data: NominatimResult[] = await res.json()
        setSuggestions(data.slice(0, 6))
        setOpen(data.length > 0)
      } catch {
        // silently fail — user can still type manually
      }
    }, 350)

    return () => clearTimeout(timer.current)
  }, [value])

  function select(item: NominatimResult) {
    const city = item.address?.city || item.address?.town || item.address?.village || item.name || item.display_name.split(',')[0].trim()
    const region = item.address?.state || ''
    const country = item.address?.country || ''
    const label = [city, region, country].filter(Boolean).join(', ')
    setValue(label)
    setOpen(false)
  }

  return (
    <div className="relative">
      <input
        name={name}
        type="text"
        value={value}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className={inputCls}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl bg-white shadow-card-md"
          style={{ border: '1px solid var(--border)' }}
        >
          {suggestions.map((item, i) => {
            const city = item.address?.city || item.address?.town || item.address?.village || item.name || item.display_name.split(',')[0].trim()
            const region = item.address?.state || ''
            const country = item.address?.country || ''
            return (
              <button
                key={i}
                type="button"
                onMouseDown={() => select(item)}
                className="flex w-full items-baseline gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface)]"
              >
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{city}</span>
                {(region || country) && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {[region, country].filter(Boolean).join(', ')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
