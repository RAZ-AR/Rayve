import type { Segment, SegmentConfig } from './types'

export const SEGMENT_CONFIGS: Record<Segment, SegmentConfig> = {
  retail: {
    label: 'Retail Shop',
    description: 'Physical stores, online shops & social commerce',
    headline: 'Turn your products into Meta Ads that sell',
    subheadline:
      'Rayve helps shops create, launch, and optimize Meta campaigns — without a marketing team.',
    ctaText: 'Start for free',
    accentClass: 'ring-violet-500',
    iconEmoji: '🛍️',
    features: [
      {
        title: 'Product-to-ad in minutes',
        description: 'Describe your best sellers and Rayve writes scroll-stopping ad copy instantly.',
      },
      {
        title: 'Multi-channel targeting',
        description: 'Reach shoppers on Instagram, Facebook, and Messenger with one campaign.',
      },
      {
        title: 'Real Meta API integration',
        description: 'Launch real campaigns directly to your Ad Account — no copy-pasting.',
      },
    ],
    businessType: 'retail',
  },
  influencer: {
    label: 'Creator / Influencer',
    description: 'Personal brands, creators & social personalities',
    headline: 'Grow your audience. Monetize your brand. Run real Meta Ads.',
    subheadline:
      'Rayve builds campaigns that speak your voice and reach the right people.',
    ctaText: 'Claim your creator profile',
    accentClass: 'ring-pink-500',
    iconEmoji: '✨',
    features: [
      {
        title: 'Brand-voice matching',
        description: 'Tell us your tone — casual, premium, raw — and every ad sounds like you.',
      },
      {
        title: 'Audience growth campaigns',
        description: 'Build follower campaigns that target your ideal community on Meta.',
      },
      {
        title: 'Monetization-ready ads',
        description: 'Promote drops, merch, paid content, and brand deals with purpose-built copy.',
      },
    ],
    businessType: 'influencer',
  },
  horeca: {
    label: 'Restaurant / HoReCa',
    description: 'Cafes, restaurants & dark kitchens',
    headline: 'More orders, more tables — powered by AI',
    subheadline:
      'Rayve helps restaurants and cafes launch Meta Ads in minutes, not days.',
    ctaText: 'Get started free',
    accentClass: 'ring-amber-500',
    iconEmoji: '🍽️',
    features: [
      {
        title: 'Menu-aware copy',
        description: 'Your top dishes become irresistible ad creative — automatically.',
      },
      {
        title: 'Local radius targeting',
        description: 'Reach hungry customers within your delivery zone or walking distance.',
      },
      {
        title: 'Seasonal promo builder',
        description: 'Launch lunch deals, weekend specials, and holiday campaigns in one click.',
      },
    ],
    businessType: 'horeca',
  },
  info: {
    label: 'Course / Coaching',
    description: 'Coaches, course creators & webinar hosts',
    headline: 'Fill your course. Launch your webinar. Scale with Meta Ads.',
    subheadline:
      'Rayve builds campaigns around your transformation promise and launches them for you.',
    ctaText: 'Launch your first ad',
    accentClass: 'ring-blue-500',
    iconEmoji: '🎓',
    features: [
      {
        title: 'Transformation-first copy',
        description: 'Every ad leads with the outcome your students get — not features.',
      },
      {
        title: 'Lead generation funnels',
        description: 'Capture registrations and leads directly through Meta Lead Ads.',
      },
      {
        title: 'Launch countdown campaigns',
        description: 'Build urgency with deadline-driven ad sequences for courses and webinars.',
      },
    ],
    businessType: 'info',
  },
  generic: {
    label: 'Rayve',
    description: 'AI marketing for businesses that want to grow',
    headline: 'AI marketing for businesses that want to grow',
    subheadline:
      'Rayve creates and launches Meta Ads campaigns — tailored to your type of business.',
    ctaText: 'Get started free',
    accentClass: 'ring-violet-500',
    iconEmoji: '🚀',
    features: [
      {
        title: 'Segment-native campaigns',
        description: 'Rayve speaks retail, creator, restaurant, and coaching — fluently.',
      },
      {
        title: 'Real Meta Ads API',
        description: 'Launch campaigns directly to Meta — no third-party tools needed.',
      },
      {
        title: 'AI recommendations',
        description: 'Get actionable suggestions based on your real campaign performance.',
      },
    ],
    businessType: null,
  },
}

export const SEGMENT_ORDER: Exclude<Segment, 'generic'>[] = [
  'retail',
  'influencer',
  'horeca',
  'info',
]
