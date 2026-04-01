import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { CampaignDetail } from '@/components/campaigns/CampaignDetail'
import type { Database } from '@/lib/types/database'

type Campaign = Database['public']['Tables']['campaigns']['Row']

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)
  if (!business) redirect('/onboarding')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: campaign, error } = await (supabase as any)
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('business_id', business.id)
    .single()

  if (error || !campaign) notFound()

  const metaConnected = !!business.meta_access_token

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 animate-fade-in">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Link href="/campaigns" className="hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>
          Campaigns
        </Link>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 2l4 3-4 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="truncate max-w-xs" style={{ color: 'var(--text)' }}>
          {(campaign as Campaign).name}
        </span>
      </div>

      <CampaignDetail campaign={campaign as Campaign} metaConnected={metaConnected} />
    </div>
  )
}
