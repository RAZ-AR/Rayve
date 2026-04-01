-- ============================================================
-- Rayve Phase 1 — Initial Schema
-- ============================================================

-- businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type   TEXT NOT NULL CHECK (business_type IN ('retail', 'influencer', 'horeca', 'info')),
  name            TEXT NOT NULL DEFAULT '',
  segment_data    JSONB NOT NULL DEFAULT '{}',
  brand_tone      TEXT,
  source_domain   TEXT,

  -- Meta Ads connection (populated in Phase 3)
  meta_access_token   TEXT,         -- stored encrypted via pgcrypto in Phase 3
  meta_user_id        TEXT,
  meta_business_id    TEXT,
  meta_ad_account_id  TEXT,
  meta_page_id        TEXT,
  meta_instagram_id   TEXT,
  meta_connected_at   TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT businesses_user_id_unique UNIQUE (user_id)
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS businesses_type_idx    ON public.businesses(business_type);
CREATE INDEX IF NOT EXISTS businesses_domain_idx  ON public.businesses(source_domain);

-- Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business"
  ON public.businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own business"
  ON public.businesses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Placeholder tables for Phase 2–4 (created empty now so
-- foreign keys work when we add data later)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.goals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL DEFAULT '',
  raw_prompt    TEXT NOT NULL DEFAULT '',
  goal_type     TEXT,
  meta_objective TEXT,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owner can manage goals"
  ON public.goals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  goal_id         UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  name            TEXT NOT NULL DEFAULT '',
  objective       TEXT,
  audience_summary TEXT,
  targeting_spec  JSONB NOT NULL DEFAULT '{}',
  budget_type     TEXT DEFAULT 'daily',
  daily_budget    INTEGER,          -- in cents
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','pending_review','active','paused','completed')),
  meta_campaign_id TEXT,
  meta_adset_id    TEXT,
  meta_ad_id       TEXT,
  launched_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owner can manage campaigns"
  ON public.campaigns FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  goal_id     UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owner can manage chat messages"
  ON public.chat_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
  );
