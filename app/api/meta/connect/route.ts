import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const SCOPES = [
  'ads_management',
  'ads_read',
  'business_management',
  'pages_read_engagement',
].join(',')

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appId = process.env.FACEBOOK_APP_ID
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: 'Meta app not configured. Set FACEBOOK_APP_ID and FACEBOOK_REDIRECT_URI.' },
      { status: 503 }
    )
  }

  // Generate CSRF state nonce
  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('meta_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600, // 10 min
    path: '/',
  })

  const oauthUrl = new URL('https://www.facebook.com/dialog/oauth')
  oauthUrl.searchParams.set('client_id', appId)
  oauthUrl.searchParams.set('redirect_uri', redirectUri)
  oauthUrl.searchParams.set('scope', SCOPES)
  oauthUrl.searchParams.set('state', state)
  oauthUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(oauthUrl.toString())
}
