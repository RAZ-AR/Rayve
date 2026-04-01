import { streamText, convertToModelMessages } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import { saveMessages } from '@/lib/db/chat'

const proposeCampaignSchema = z.object({
  name: z.string().describe('Short campaign name, e.g. "Summer Sale — Conversions"'),
  objective: z
    .enum(['CONVERSIONS', 'REACH', 'TRAFFIC', 'LEAD_GENERATION', 'BRAND_AWARENESS', 'VIDEO_VIEWS'])
    .describe('Meta Ads campaign objective'),
  target_audience: z.string().describe('Human-readable audience description'),
  creative_direction: z.string().describe('Ad format and visual/copy style guidance'),
  suggested_headline: z.string().max(40).describe('Primary ad headline, max 40 characters'),
  suggested_body: z.string().max(125).describe('Ad body text, max 125 characters'),
  budget_suggestion: z.number().positive().describe('Total campaign budget in EUR'),
  duration_days: z.number().int().min(1).describe('Campaign duration in days'),
  rationale: z.string().describe('1–2 sentence explanation of the strategy'),
})

export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Check API key
  if (!process.env.GOOGLE_AI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'AI not configured. Add GOOGLE_AI_API_KEY to your environment.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const body = await req.json()
  const { messages: uiMessages, businessId } = body

  // Convert UIMessages → ModelMessages for streamText
  const modelMessages = await convertToModelMessages(uiMessages ?? [])

  // Load business for context
  let business = null
  try {
    business = await getBusinessByUserId(user.id)
  } catch {
    // Non-fatal
  }

  const system = business ? buildSystemPrompt(business) : defaultSystemPrompt()

  const gemini = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY })

  const result = streamText({
    model: gemini('gemini-2.5-flash'),
    system,
    messages: modelMessages,
    tools: {
      propose_campaign: {
        description:
          'Generate a structured Meta Ads campaign brief once you have gathered sufficient information from the user. Call this after asking your clarifying questions.',
        inputSchema: proposeCampaignSchema,
        // No execute — client renders the tool result
      },
    },
    onFinish: async ({ response }) => {
      if (!business) return
      try {
        const toSave: { role: 'user' | 'assistant'; content: string }[] = []

        // Save the last user message from the incoming UIMessages
        const lastUser = [...(uiMessages ?? [])].reverse().find(
          (m: { role: string }) => m.role === 'user',
        )
        if (lastUser) {
          const text = extractTextFromUIMessage(lastUser)
          if (text) toSave.push({ role: 'user', content: text })
        }

        // Save assistant response messages
        for (const m of response.messages) {
          if (m.role === 'assistant') {
            const content =
              typeof m.content === 'string'
                ? m.content
                : Array.isArray(m.content)
                  ? m.content
                      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                      .map((p) => p.text)
                      .join('')
                  : ''
            if (content) toSave.push({ role: 'assistant', content })
          }
        }

        if (toSave.length > 0) await saveMessages(business.id, toSave)
      } catch {
        // Ignore persistence errors
      }
    },
  })

  return result.toUIMessageStreamResponse()
}

function defaultSystemPrompt(): string {
  return `You are Rayve — an AI marketing strategist specialised in Meta Ads.
Help the user create a campaign brief. Ask 2–3 clarifying questions, then call propose_campaign.`
}

function extractTextFromUIMessage(m: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!m.parts) return ''
  return m.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
}
