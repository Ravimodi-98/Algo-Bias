-- Migration: 20260917030000_add_fairness_challenge.sql
-- Description: Add fairness_step to game_sessions and create fairness_responses table with RLS and Realtime publication

DO $$
BEGIN
  -- 1. Add fairness_step column to game_sessions if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'game_sessions' 
      AND column_name = 'fairness_step'
  ) THEN
    ALTER TABLE public.game_sessions ADD COLUMN fairness_step INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- 2. Create fairness_responses table
CREATE TABLE IF NOT EXISTS public.fairness_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    stage VARCHAR(64) NOT NULL,
    response JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_player_fairness_stage UNIQUE (session_id, player_id, stage)
);

-- Indexes for rapid lookup and aggregation
CREATE INDEX IF NOT EXISTS idx_fairness_responses_session_stage ON public.fairness_responses(session_id, stage);
CREATE INDEX IF NOT EXISTS idx_fairness_responses_player ON public.fairness_responses(player_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.fairness_responses ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Allow public read access to fairness_responses" ON public.fairness_responses;
CREATE POLICY "Allow public read access to fairness_responses"
    ON public.fairness_responses
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow player to insert fairness_responses" ON public.fairness_responses;
CREATE POLICY "Allow player to insert fairness_responses"
    ON public.fairness_responses
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow player to update fairness_responses" ON public.fairness_responses;
CREATE POLICY "Allow player to update fairness_responses"
    ON public.fairness_responses
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 5. Add fairness_responses to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'fairness_responses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.fairness_responses;
  END IF;
END $$;
