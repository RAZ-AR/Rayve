import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const errorParam = searchParams.get('error')

  // User denied OAuth
  if (errorParam) {
    return NextResponse.redirect(new URL('/settings?meta_error=denied', req.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/settings?meta_error=missing_params', req.url))
  }

  // Validate CSRF state
  const cookieStore = await cookies()
  const savedState = cookieStore.get('meta_oauth_state')?.value
  cookieStore.delete('meta_oauth_state')

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(new URL('/settings?meta_error=invalid_state', req.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.redirect(new URL('/settings?meta_error=not_configured', req.url))
  }

  // Exchange code for short-lived token
  const tokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token')
  tokenUrl.searchParams.set('client_id', appId)
  tokenUrl.searchParams.set('client_secret', appSecret)
  tokenUrl.searchParams.set('redirect_uri', redirectUri)
  tokenUrl.searchParams.set('code', code)

  const tokenRes = await fetch(tokenUrl.toString())
  const tokenJson = await tokenRes.json()

  if (!tokenRes.ok || !tokenJson.access_token) {
    console.error('[meta/callback] token exchange failed', tokenJson)
    return NextResponse.redirect(new URL('/settings?meta_error=token_exchange', req.url))
  }

  // Exchange for long-lived token (60 days)
  const longTokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token')
  longTokenUrl.searchParams.set('grant_type', 'fb_exchange_token')
  longTokenUrl.searchParams.set('client_id', appId)
  longTokenUrl.searchParams.set('client_secret', appSecret)
  longTokenUrl.searchParams.set('fb_exchange_token', tokenJson.access_token)

  const longTokenRes = await fetch(longTokenUrl.toString())
  const longTokenJson = await longTokenRes.json()

  const accessToken: string = longTokenJson.access_token ?? tokenJson.access_token

  // Fetch Meta user ID
  const meRes = await fetch(
    `https://graph.facebook.com/v20.0/me?fields=id,name&access_token=${accessToken}`
  )
  const meJson = await meRes.json()
  const metaUserId: string | null = meJson.id ?? null

  // Save to businesses table
  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('businesses')
    .update({
      meta_access_token: accessToken,
      meta_user_id: metaUserId,
      meta_connected_at: new Date().toISOString(),
    })
    .eq('id', business.id)

  if (error) {
    console.error('[meta/callback] DB update failed', error)
    return NextResponse.redirect(new URL('/settings?meta_error=db', req.url))
  }

  return NextResponse.redirect(new URL('/settings?meta_connected=1', req.url))
}
