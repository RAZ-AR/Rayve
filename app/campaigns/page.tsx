import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { getCampaignsByBusiness } from '@/lib/db/campaigns'
import { CampaignList } from '@/components/campaigns/CampaignList'
import type { Database } from '@/lib/types/database'

type Campaign = Database['public']['Tables']['campaigns']['Row']

export default async function CampaignsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) redirect('/onboarding')

  const campaigns = await getCampaignsByBusiness(business.id).catch(() => [] as Campaign[])

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-label mb-2">Overview</p>
          <h1 className="text-page-title">Campaigns</h1>
        </div>
        <Link
          href="/chat"
          className="mt-2 flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2v8M2 6h8" />
          </svg>
          New campaign
        </Link>
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  )
}
