-- Migration: 20260917010000_add_results_visible_to_game_sessions.sql
-- Description: Add results_visible to game_sessions for authoritative classroom results reveal

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'game_sessions' 
      AND column_name = 'results_visible'
  ) THEN
    ALTER TABLE public.game_sessions ADD COLUMN results_visible BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;
