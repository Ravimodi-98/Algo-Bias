-- Migration: 20260917020000_add_reveal_state_to_game_sessions.sql
-- Description: Add game_stage and reveal_step to game_sessions for authoritative Bias Reveal synchronization

DO $$
BEGIN
  -- 1. Add game_stage column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'game_sessions' 
      AND column_name = 'game_stage'
  ) THEN
    ALTER TABLE public.game_sessions ADD COLUMN game_stage VARCHAR(32) NOT NULL DEFAULT 'round';
  END IF;

  -- 2. Add reveal_step column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'game_sessions' 
      AND column_name = 'reveal_step'
  ) THEN
    ALTER TABLE public.game_sessions ADD COLUMN reveal_step INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;
