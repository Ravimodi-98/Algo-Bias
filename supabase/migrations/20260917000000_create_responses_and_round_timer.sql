-- Migration: 20260917000000_create_responses_and_round_timer.sql
-- Description: Add round_started_at to game_sessions and create responses table with unique constraints and RLS

-- 1. Add round_started_at to game_sessions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'game_sessions' 
      AND column_name = 'round_started_at'
  ) THEN
    ALTER TABLE public.game_sessions ADD COLUMN round_started_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- 2. Create responses table
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    selected_candidate VARCHAR(2) NOT NULL CHECK (selected_candidate IN ('A', 'B')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_player_round_response UNIQUE (session_id, player_id, round_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_session_round ON public.responses(session_id, round_number);
CREATE INDEX IF NOT EXISTS idx_responses_player ON public.responses(player_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Allow public read access to responses" ON public.responses;
CREATE POLICY "Allow public read access to responses"
    ON public.responses
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow player to insert response" ON public.responses;
CREATE POLICY "Allow player to insert response"
    ON public.responses
    FOR INSERT
    WITH CHECK (true);

-- 5. Add responses to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'responses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.responses;
  END IF;
END $$;
