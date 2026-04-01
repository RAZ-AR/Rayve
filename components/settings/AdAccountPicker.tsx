'use client'

import { useState, useEffect } from 'react'
import type { AdAccount } from '@/app/api/meta/accounts/route'

interface Props {
  currentAccountId: string | null
}

export function AdAccountPicker({ currentAccountId }: Props) {
  const [accounts, setAccounts] = useState<AdAccount[]>([])
  const [selected, setSelected] = useState<string>(currentAccountId ?? '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/meta/accounts')
      .then((r) => r.json())
      .then((json) => {
        setAccounts(json.accounts ?? [])
        if (!currentAccountId && json.accounts?.length === 1) {
          setSelected(json.accounts[0].id)
        }
      })
      .catch(() => setError('Failed to load ad accounts'))
      .finally(() => setLoading(false))
  }, [currentAccountId])

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/settings/ad-account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adAccountId: selected }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
    } catch {
      setError('Failed to save ad account')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading ad accounts…</p>
  }

  if (error && accounts.length === 0) {
    return <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
  }

  if (accounts.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        No ad accounts found. Make sure your Meta account has access to at least one ad account.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="ad-account"
          className="mb-1.5 block text-xs font-semibold"
          style={{ color: 'var(--text-secondary)' }}
        >
          Ad account
        </label>
        <select
          id="ad-account"
          value={selected}
          onChange={(e) => { setSelected(e.target.value); setSaved(false) }}
          className="h-9 w-full rounded-lg px-3 text-sm outline-none transition-all"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
          }}
        >
          <option value="" disabled>Select an ad account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.id})
              {a.account_status !== 1 ? ' — inactive' : ''}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!selected || saving}
          className="flex h-8 items-center rounded-lg px-4 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {saved && (
          <span className="text-xs" style={{ color: '#107A3E' }}>
            ✓ Saved
          </span>
        )}
      </div>
    </div>
  )
}
