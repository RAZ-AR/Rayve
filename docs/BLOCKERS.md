# Rayve — Blockers & Open Questions

## Active Blockers

None for Phase 1.

## Resolved

_(none yet — Phase 1 clean)_

## Open Questions

### OQ-001: Meta App ID and Business Manager
- Need: Meta App ID + Secret for OAuth in Phase 3
- Where to create: https://developers.facebook.com → Create App → Business type
- Required scopes: `ads_management`, `ads_read`, `business_management`, `pages_read_engagement`, `instagram_basic`
- Note: Meta app review required for `ads_management` in production. Dev testing works without review.

### OQ-002: Supabase Project Setup
- Requires: Supabase project URL + anon key (see `.env.local.example`)
- Migration: `supabase/migrations/0001_init.sql` must be applied before any user signups
- Google OAuth: must be enabled in Supabase Auth → Providers → Google

### OQ-003: Vercel Custom Domains
- All 5 subdomains need to be added to the Vercel project as custom domains
- DNS: CNAME each subdomain to `cname.vercel-dns.com`
- One Next.js project, 5 domains — all handled by middleware

### OQ-004: AI Provider Selection (Phase 2)
- Candidate: Claude API (Anthropic) — preferred for segment-aware prompting
- Alternative: OpenAI GPT-4o
- Decision pending until Phase 2 starts
