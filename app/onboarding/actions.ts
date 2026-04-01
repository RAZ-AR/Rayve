'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { upsertBusiness } from '@/lib/db/businesses'
import type { BusinessType, RetailSegmentData, InfluencerSegmentData } from '@/lib/segments/types'

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated. Please sign in again.' }

  const segment = formData.get('segment') as BusinessType
  const sourceDomain = formData.get('source_domain') as string | null

  if (!['retail', 'influencer', 'horeca', 'info'].includes(segment)) {
    return { error: 'Invalid segment selected.' }
  }

  let name = ''
  let segmentData: RetailSegmentData | InfluencerSegmentData

  if (segment === 'retail') {
    name = (formData.get('store_name') as string) ?? ''
    segmentData = {
      store_name: name,
      category: (formData.get('category') as string) ?? '',
      sales_channels: safeParseArray(formData.get('sales_channels') as string),
      avg_order_value: (formData.get('avg_order_value') as string) ?? '',
      key_products: safeParseArray(formData.get('key_products') as string),
      current_promo: (formData.get('current_promo') as string) ?? '',
      target_customer: (formData.get('target_customer') as string) ?? '',
      website_url: (formData.get('website_url') as string) ?? '',
      instagram_handle: (formData.get('instagram_handle') as string) ?? '',
    } satisfies RetailSegmentData
  } else if (segment === 'influencer') {
    name = (formData.get('creator_name') as string) ?? ''
    segmentData = {
      creator_name: name,
      handle: (formData.get('handle') as string) ?? '',
      niche: (formData.get('niche') as string) ?? '',
      platforms: safeParseArray(formData.get('platforms') as string),
      audience_size: (formData.get('audience_size') as string) ?? '',
      monetization: safeParseArray(formData.get('monetization') as string),
      current_offer: (formData.get('current_offer') as string) ?? '',
      brand_voice: (formData.get('brand_voice') as string) ?? '',
      link_in_bio_url: (formData.get('link_in_bio_url') as string) ?? '',
    } satisfies InfluencerSegmentData
  } else {
    return { error: 'This segment is not available yet.' }
  }

  try {
    await upsertBusiness({
      userId: user.id,
      businessType: segment,
      name,
      segmentData,
      sourceDomain: sourceDomain ?? undefined,
    })
  } catch (err) {
    console.error('Failed to save business:', err)
    return { error: 'Failed to save your profile. Please try again.' }
  }

  redirect('/dashboard')
}

function safeParseArray(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
