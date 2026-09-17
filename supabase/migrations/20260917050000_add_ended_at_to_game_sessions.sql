-- Migration: 20260917050000_add_ended_at_to_game_sessions.sql
-- Description: Add ended_at column to game_sessions to timestamp simulation conclusion

ALTER TABLE public.game_sessions 
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;
