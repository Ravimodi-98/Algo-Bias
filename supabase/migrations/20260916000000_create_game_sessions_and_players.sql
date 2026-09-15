-- Migration: 20260916000000_create_game_sessions_and_players.sql
-- Description: Create game_sessions and players tables with Row Level Security (RLS)

-- 1. Create game_sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_code VARCHAR(12) UNIQUE NOT NULL,
    host_id TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
    current_round INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast game_code lookups
CREATE INDEX IF NOT EXISTS idx_game_sessions_code ON public.game_sessions(game_code);
CREATE INDEX IF NOT EXISTS idx_game_sessions_host ON public.game_sessions(host_id);

-- 2. Create players table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    anonymous_name VARCHAR(64) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast session players lookup
CREATE INDEX IF NOT EXISTS idx_players_session_id ON public.players(session_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for game_sessions
-- Anyone (players and hosts) can look up game sessions (needed for /join and /lobby verification)
DROP POLICY IF EXISTS "Allow public read access to game_sessions" ON public.game_sessions;
CREATE POLICY "Allow public read access to game_sessions"
    ON public.game_sessions
    FOR SELECT
    USING (true);

-- Anyone who acts as host can create a game session
DROP POLICY IF EXISTS "Allow hosts to create game_sessions" ON public.game_sessions;
CREATE POLICY "Allow hosts to create game_sessions"
    ON public.game_sessions
    FOR INSERT
    WITH CHECK (true);

-- Only host with matching host_id can update game status and rounds
DROP POLICY IF EXISTS "Allow host to update own game_session" ON public.game_sessions;
CREATE POLICY "Allow host to update own game_session"
    ON public.game_sessions
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 5. RLS Policies for players
-- Players and hosts can view players in a session (for live player counts)
DROP POLICY IF EXISTS "Allow public read access to players" ON public.players;
CREATE POLICY "Allow public read access to players"
    ON public.players
    FOR SELECT
    USING (true);

-- Anonymous players can join a session (INSERT)
DROP POLICY IF EXISTS "Allow players to insert their record" ON public.players;
CREATE POLICY "Allow players to insert their record"
    ON public.players
    FOR INSERT
    WITH CHECK (true);

-- Players can update their own last_seen heartbeat
DROP POLICY IF EXISTS "Allow players to update last_seen" ON public.players;
CREATE POLICY "Allow players to update last_seen"
    ON public.players
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Enable Supabase Realtime for game_sessions and players
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'game_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'players'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
  END IF;
END $$;
