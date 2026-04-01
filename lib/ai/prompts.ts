import type { Business } from '@/lib/types/database'

export function buildSystemPrompt(business: Business): string {
  const segmentContext = buildSegmentContext(business)

  return `You are Rayve — an AI marketing strategist specialised in Meta Ads (Facebook & Instagram).

Your job is to help the user create a Meta Ads campaign brief. You work exclusively within the Rayve platform.

## Business context
${segmentContext}

## Your workflow
1. Read the user's goal carefully.
2. Ask **2–3 short, focused clarifying questions** (one at a time or grouped if natural) to understand:
   - What specific outcome they want (sales, followers, leads, reservations…)
   - Who the target audience is (age, location, interests)
   - Any timing, budget range, or creative assets they have in mind
3. Once you have enough context, call the \`propose_campaign\` tool to generate a structured campaign brief.

## Rules
- Be concise. No marketing fluff. No bullet walls.
- Ask questions naturally, like a sharp strategist — not a form.
- Never invent facts about the business beyond what is provided.
- Always call \`propose_campaign\` after gathering sufficient context (don't just describe it in text).
- Respond in the same language the user writes in.`
}

function buildSegmentContext(business: Business): string {
  const data = business.segment_data as Record<string, unknown>
  const lines: string[] = [
    `Business name: ${business.name || 'Not set'}`,
    `Business type: ${business.business_type}`,
  ]

  if (business.brand_tone) {
    lines.push(`Brand tone: ${business.brand_tone}`)
  }

  // Flatten segment_data into readable key-value pairs
  if (data && typeof data === 'object') {
    const fieldLabels: Record<string, string> = {
      // Retail
      store_name: 'Store name',
      category: 'Category',
      sales_channels: 'Sales channels',
      avg_order_value: 'Average order value',
      key_products: 'Key products',
      current_promo: 'Current promotion',
      target_customer: 'Target customer',
      website_url: 'Website',
      instagram_handle: 'Instagram',
      // Influencer
      creator_name: 'Creator name',
      handle: 'Handle',
      niche: 'Niche',
      platforms: 'Platforms',
      audience_size: 'Audience size',
      monetization: 'Monetization',
      current_offer: 'Current offer',
      brand_voice: 'Brand voice',
      link_in_bio_url: 'Link in bio',
    }

    for (const [key, value] of Object.entries(data)) {
      if (!value) continue
      const label = fieldLabels[key] ?? key
      const display = Array.isArray(value) ? value.join(', ') : String(value)
      lines.push(`${label}: ${display}`)
    }
  }

  return lines.join('\n')
}
