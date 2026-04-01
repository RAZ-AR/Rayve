import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { MetaConnect } from '@/components/settings/MetaConnect'
import { AdAccountPicker } from '@/components/settings/AdAccountPicker'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)

  const metaConnected = !!business?.meta_access_token
  const hasAppConfigured = !!(
    process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
  )

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 animate-fade-in">

      <div className="mb-8">
        <p className="text-label mb-2">Settings</p>
        <h1 className="text-page-title">Account &amp; integrations</h1>
      </div>

      {/* Account */}
      <Section title="Account">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: 'var(--accent)' }}
          >
            {user.email?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{user.email}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Free plan · Phase 1 Beta</p>
          </div>
        </div>
      </Section>

      {/* Meta Ads — connect */}
      <Section title="Meta Ads — connect account">
        <MetaConnect
          connected={metaConnected}
          metaUserId={business?.meta_user_id ?? null}
          hasAppConfigured={hasAppConfigured}
        />
      </Section>

      {/* Meta Ads — ad account picker (only shown when connected) */}
      {metaConnected && (
        <Section title="Meta Ads — ad account">
          <AdAccountPicker currentAccountId={business?.meta_ad_account_id ?? null} />
        </Section>
      )}

    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="mb-4 overflow-hidden rounded-xl"
      style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
    >
      <div
        className="px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}
