import { NextRequest, NextResponse } from 'next/server'
import { createHmac, createHash } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/auth/telegram?id=...&first_name=...&hash=...&auth_date=...
 *
 * Called by Telegram Login Widget (data-auth-url).
 * 1. Verifies HMAC-SHA256 signature from Telegram
 * 2. Finds or creates a Supabase user via synthetic email tg_{id}@tg.rayve.app
 * 3. Issues a magic-link and redirects the browser through Supabase's token flow
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    return NextResponse.redirect(`${origin}/login?error=telegram_not_configured`)
  }

  // ── Collect auth fields from Telegram ─────────────────────────────────────
  const hash = searchParams.get('hash')
  if (!hash) {
    return NextResponse.redirect(`${origin}/login?error=telegram_missing_hash`)
  }

  const authDate = Number(searchParams.get('auth_date') ?? 0)
  // Reject tokens older than 24 hours
  if (Date.now() / 1000 - authDate > 86_400) {
    return NextResponse.redirect(`${origin}/login?error=telegram_expired`)
  }

  // Build check string: sorted key=value pairs (excluding hash)
  const fields: Record<string, string> = {}
  for (const [key, value] of searchParams.entries()) {
    if (key !== 'hash') fields[key] = value
  }
  const checkString = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join('\n')

  // Secret key = SHA-256 of bot token
  const secretKey = createHash('sha256').update(botToken).digest()
  const expectedHash = createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex')

  if (expectedHash !== hash) {
    return NextResponse.redirect(`${origin}/login?error=telegram_invalid_hash`)
  }

  // ── Find or create Supabase user ──────────────────────────────────────────
  const telegramId = searchParams.get('id')!
  const firstName = searchParams.get('first_name') ?? ''
  const lastName = searchParams.get('last_name') ?? ''
  const username = searchParams.get('username') ?? ''
  const photoUrl = searchParams.get('photo_url') ?? ''

  const syntheticEmail = `tg_${telegramId}@tg.rayve.app`
  const admin = createAdminClient()

  // Try creating — if already exists, error is thrown but we proceed to generateLink
  await (admin.auth.admin as any).createUser({
    email: syntheticEmail,
    email_confirm: true,
    user_metadata: {
      full_name: [firstName, lastName].filter(Boolean).join(' '),
      telegram_id: telegramId,
      telegram_username: username,
      avatar_url: photoUrl,
      provider: 'telegram',
    },
  }).catch(() => {
    // User already exists — that's fine
  })

  // Generate a one-time magic link for this email
  const { data: linkData, error: linkError } = await (admin.auth.admin as any).generateLink({
    type: 'magiclink',
    email: syntheticEmail,
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  })

  if (linkError || !linkData?.properties?.action_link) {
    console.error('[telegram auth] generateLink failed', linkError)
    return NextResponse.redirect(`${origin}/login?error=telegram_session_failed`)
  }

  // Redirect through Supabase magic link → sets session cookie → /dashboard
  return NextResponse.redirect(linkData.properties.action_link)
}
