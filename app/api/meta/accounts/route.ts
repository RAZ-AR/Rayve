import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'

export interface AdAccount {
  id: string
  name: string
  account_status: number
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const token = business.meta_access_token
  if (!token) {
    return NextResponse.json({ error: 'Meta account not connected' }, { status: 400 })
  }

  const url = new URL('https://graph.facebook.com/v20.0/me/adaccounts')
  url.searchParams.set('fields', 'id,name,account_status')
  url.searchParams.set('access_token', token)
  url.searchParams.set('limit', '50')

  const res = await fetch(url.toString())
  const json = await res.json()

  if (!res.ok) {
    console.error('[meta/accounts] Graph API error', json)
    return NextResponse.json(
      { error: json.error?.message ?? 'Failed to fetch ad accounts' },
      { status: 502 }
    )
  }

  const accounts: AdAccount[] = (json.data ?? []).map((a: AdAccount) => ({
    id: a.id,
    name: a.name,
    account_status: a.account_status,
  }))

  return NextResponse.json({ accounts })
}
