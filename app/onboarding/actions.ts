'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { upsertBusiness } from '@/lib/db/businesses'
import type { BusinessType } from '@/lib/segments/types'

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
  let segmentData: Record<string, unknown> = {}

  if (segment === 'retail') {
    name = (formData.get('store_name') as string) ?? ''
    segmentData = {
      store_name: name,
      category: formData.get('category') ?? '',
      sales_channels: safeParseArray(formData.get('sales_channels') as string),
      avg_order_value: formData.get('avg_order_value') ?? '',
      key_products: safeParseArray(formData.get('key_products') as string),
      current_promo: formData.get('current_promo') ?? '',
      target_customer: formData.get('target_customer') ?? '',
      website_url: formData.get('website_url') ?? '',
      instagram_handle: formData.get('instagram_handle') ?? '',
    }
  } else if (segment === 'influencer') {
    name = (formData.get('creator_name') as string) ?? ''
    segmentData = {
      creator_name: name,
      handle: formData.get('handle') ?? '',
      niche: formData.get('niche') ?? '',
      platforms: safeParseArray(formData.get('platforms') as string),
      audience_size: formData.get('audience_size') ?? '',
      monetization: safeParseArray(formData.get('monetization') as string),
      current_offer: formData.get('current_offer') ?? '',
      brand_voice: formData.get('brand_voice') ?? '',
      link_in_bio_url: formData.get('link_in_bio_url') ?? '',
    }
  } else if (segment === 'horeca') {
    name = (formData.get('venue_name') as string) ?? ''
    segmentData = {
      venue_name: name,
      venue_types: safeParseArray(formData.get('venue_types') as string),
      cuisine: formData.get('cuisine') ?? '',
      order_channels: safeParseArray(formData.get('order_channels') as string),
      location: formData.get('location') ?? '',
      top_dishes: safeParseArray(formData.get('top_dishes') as string),
      current_promo: formData.get('current_promo') ?? '',
      avg_order_value: formData.get('avg_order_value') ?? '',
      target_customer: formData.get('target_customer') ?? '',
      website_url: formData.get('website_url') ?? '',
      instagram_handle: formData.get('instagram_handle') ?? '',
    }
  } else if (segment === 'info') {
    name = (formData.get('brand_name') as string) ?? ''
    segmentData = {
      brand_name: name,
      product_types: safeParseArray(formData.get('product_types') as string),
      niche: formData.get('niche') ?? '',
      ad_goals: safeParseArray(formData.get('ad_goals') as string),
      flagship_offer: formData.get('flagship_offer') ?? '',
      transformation: formData.get('transformation') ?? '',
      target_customer: formData.get('target_customer') ?? '',
      price_range: formData.get('price_range') ?? '',
      website_url: formData.get('website_url') ?? '',
      instagram_handle: formData.get('instagram_handle') ?? '',
    }
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
