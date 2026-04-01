import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const body = await req.json()
  const adAccountId: string | null = body.adAccountId ?? null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('businesses')
    .update({ meta_ad_account_id: adAccountId })
    .eq('id', business.id)

  if (error) {
    console.error('[settings/ad-account] DB update failed', error)
    return NextResponse.json({ error: 'Failed to save ad account' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
