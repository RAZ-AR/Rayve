# Rayve — Architecture Decisions

## ADR-001: One Next.js App, Multi-Domain via Middleware

**Decision**: One Next.js 15 App Router project serves all 5 domains.

**Rationale**: All segments share auth, onboarding shell, dashboard, and AI infrastructure. A monorepo with one Vercel deployment is simpler to maintain than 5 separate apps, and avoids code duplication for all shared flows.

**Implementation**: Middleware reads `Host` header → maps to segment → injects `x-segment-hint` request header → Server Components read it via `next/headers`.

---

## ADR-002: `x-segment-hint` Is Pre-populate Only

**Decision**: The domain hint pre-highlights the matching segment card in onboarding but does not commit the segment.

**Rationale**: A retail shop owner might visit `creators.rayve.io` out of curiosity. The segment is only real when the user explicitly clicks a tile in Step 1 of onboarding. This prevents writing incorrect data to the DB.

---

## ADR-003: `segment_data` as JSONB

**Decision**: All segment-specific profile fields stored in a single `segment_data JSONB` column on `businesses`.

**Rationale**: Each segment has a completely different field shape. A wide table with many NULLs would be messy. Separate tables per segment would require complex JOINs and make adding Phase 5 segments harder. JSONB is flexible and Postgres can index into it if needed.

---

## ADR-004: Server Actions for Auth and Mutations

**Decision**: Auth (signup, login, OAuth) and onboarding save use Next.js Server Actions, not API routes.

**Rationale**: Colocates mutation logic with the form, eliminates a round-trip through an API route, and integrates cleanly with `useTransition` for pending states. The Supabase SSR client works identically in Server Actions.

---

## ADR-005: `source_domain` Tracked at Onboarding Submission

**Decision**: `source_domain` is passed as a hidden field, populated server-side from the `x-segment-hint` header on the onboarding page load.

**Rationale**: By the time the user submits onboarding, they've confirmed their segment. Capturing domain at submission (not signup) gives clean attribution even when users switch domains during the flow.

---

## ADR-006: Budget Modal Is Never Skippable (Future)

**Decision**: When Meta campaign activation is implemented (Phase 3), the budget confirmation modal will be required. No auto-activation.

**Rationale**: Real money is being spent via the Meta API. Users must explicitly confirm the daily budget and the Ad Account being charged. This also protects Rayve from charge disputes.

---

## ADR-007: Campaigns Start PAUSED (Future)

**Decision**: All Meta campaigns will be created with `status: 'PAUSED'` and only activated after the user confirms the budget modal.

**Rationale**: Prevents accidental launches. Allows the user to review the campaign in Meta Business Manager before money is spent.
