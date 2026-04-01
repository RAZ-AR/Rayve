# Rayve — State

## Current Phase
**Phase 2** — Complete

## Last Completed
Phase 2 AI + Chat workspace. Streaming Claude chat, campaign proposal tool, campaigns list, dashboard goal suggestions.

## What Was Built (Phase 1)

### Infrastructure
- [x] Next.js 15 + TypeScript + Tailwind CSS monorepo
- [x] Middleware: domain → `x-segment-hint` header mapping (5 domains)
- [x] Supabase SSR auth (email + Google OAuth)
- [x] Database schema: `businesses`, `goals`, `campaigns`, `chat_messages` tables with RLS
- [x] `segment_data` as JSONB — no separate tables per segment

### Pages
- [x] `/` — Segment-aware landing page (5 variants: retail, influencer, horeca, info, generic)
- [x] `/signup` — Email + Google OAuth signup
- [x] `/login` — Email + Google OAuth login
- [x] `/auth/callback` — OAuth code exchange
- [x] `/onboarding` — Step 1: segment selector (with domain hint); Step 2: Retail + Influencer fields
- [x] `/dashboard` — Welcome, quick actions, getting started checklist
- [x] `/chat` — Streaming AI chat workspace with campaign proposal tool
- [x] `/campaigns` — Campaign list with status badges
- [x] `/creative-studio` — Placeholder (Phase 2)
- [x] `/business-brain` — Shows saved segment data
- [x] `/settings` — Account info + Meta Ads connection (Phase 3)

### Segments Supported
- [x] Retail (full onboarding)
- [x] Influencer (full onboarding)
- [ ] HoReCa (coming soon screen)
- [ ] Info Business (coming soon screen)

## What Was Built (Phase 2)

### AI + Chat
- [x] `ANTHROPIC_API_KEY` env var (required)
- [x] `lib/ai/prompts.ts` — segment-aware system prompt builder
- [x] `app/api/chat/route.ts` — streaming endpoint (`streamText` + `propose_campaign` tool)
- [x] `app/api/campaigns/route.ts` — save campaign draft API
- [x] `components/chat/ChatWorkspace.tsx` — two-column chat UI with `useChat`
- [x] `components/chat/MessageList.tsx` — user/assistant message bubbles
- [x] `components/chat/MessageInput.tsx` — textarea + segment suggestion chips
- [x] `components/chat/CampaignProposal.tsx` — structured proposal card with save/regenerate
- [x] `/chat` — full chat page with auth guard + `?prompt=` pre-fill
- [x] `/campaigns` — campaign list with status badges
- [x] `/dashboard` — segment-native goal suggestion chips
- [x] `/business-brain` — "Edit profile" links to onboarding with `?edit=true`

## What Is Next

### Phase 3 — Meta Ads Integration
- Facebook OAuth (Meta app)
- Ad Account connect/create flow
- Campaign creation via Meta Marketing API v19.0
- Budget confirmation modal (never skippable)
- Campaign activation (PAUSED → ACTIVE after confirmation)
- Meta API error handling + logging

### Phase 4 — Analytics
- Meta Insights API polling (on load + every 6h background job)
- Campaign detail page with live metrics
- AI recommendations from real performance data

### Phase 5 — Polish + Segments
- HoReCa full onboarding
- Info Business full onboarding
- Empty states, error boundaries, loading skeletons
- Mobile refinement pass

## Setup Required Before Running

1. Create Supabase project at https://supabase.com
2. Copy `.env.local.example` → `.env.local` and fill values
3. Run migration: paste `supabase/migrations/0001_init.sql` in Supabase SQL editor
4. Enable Google OAuth provider in Supabase Dashboard (Authentication → Providers)
5. Add redirect URLs in Supabase:
   - `http://localhost:3000/auth/callback`
   - `https://shops.rayve.io/auth/callback`
   - `https://creators.rayve.io/auth/callback`
   - `https://restaurants.rayve.io/auth/callback`
   - `https://courses.rayve.io/auth/callback`
   - `https://rayve.io/auth/callback`
6. For local multi-domain testing, add to `/etc/hosts`:
   ```
   127.0.0.1  shops.localhost
   127.0.0.1  creators.localhost
   127.0.0.1  restaurants.localhost
   127.0.0.1  courses.localhost
   ```
7. Run `npm run dev`
