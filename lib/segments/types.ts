export type Segment = 'retail' | 'influencer' | 'horeca' | 'info' | 'generic'

export type BusinessType = 'retail' | 'influencer' | 'horeca' | 'info'

export interface SegmentConfig {
  label: string
  description: string
  headline: string
  subheadline: string
  ctaText: string
  accentClass: string        // Tailwind ring/bg color
  iconEmoji: string
  features: { title: string; description: string }[]
  businessType: BusinessType | null
}

// Retail segment_data shape
export interface RetailSegmentData {
  store_name: string
  category: string
  sales_channels: string[]
  avg_order_value: string
  key_products: string[]
  current_promo: string
  target_customer: string
  website_url: string
  instagram_handle: string
}

// Influencer segment_data shape
export interface InfluencerSegmentData {
  creator_name: string
  handle: string
  niche: string
  platforms: string[]
  audience_size: string
  monetization: string[]
  current_offer: string
  brand_voice: string
  link_in_bio_url: string
}

export type SegmentData = RetailSegmentData | InfluencerSegmentData | Record<string, unknown>
