-- Migration: 20260917040000_add_case10_final_results_and_reflections.sql
-- Description: Add final_step to game_sessions and create reflections table with RLS and Realtime publication

DO $$
BEGIN
  -- 1. Add final_step column to game_sessions if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'game_sessions' 
      AND column_name = 'final_step'
  ) THEN
    ALTER TABLE public.game_sessions ADD COLUMN final_step INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- 2. Create reflections table
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    selected_themes TEXT[] NOT NULL DEFAULT '{}',
    optional_response TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_player_reflection UNIQUE (session_id, player_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reflections_session ON public.reflections(session_id);
CREATE INDEX IF NOT EXISTS idx_reflections_player ON public.reflections(player_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Allow public read access to reflections" ON public.reflections;
CREATE POLICY "Allow public read access to reflections"
    ON public.reflections
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow player to insert reflection" ON public.reflections;
CREATE POLICY "Allow player to insert reflection"
    ON public.reflections
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow player to update reflection" ON public.reflections;
CREATE POLICY "Allow player to update reflection"
    ON public.reflections
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 5. Add reflections to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'reflections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reflections;
  END IF;
END $$;
