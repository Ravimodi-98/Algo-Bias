import { supabase } from '../supabase/client';
import { generateGameCode } from '../../shared/utils/idGenerator';
import type { DbGameSession, DbPlayer } from '../../shared/types';

export const gameService = {
  /**
   * Creates a new game session in Supabase for the authenticated host.
   */
  async createGameSession(hostId: string): Promise<{ session: DbGameSession | null; error: string | null }> {
    try {
      let uniqueCode = '';
      let attempts = 0;

      // Ensure game code uniqueness
      while (attempts < 5) {
        const candidateCode = generateGameCode();
        const { data: existing } = await supabase
          .from('game_sessions')
          .select('id')
          .eq('game_code', candidateCode)
          .maybeSingle();

        if (!existing) {
          uniqueCode = candidateCode;
          break;
        }
        attempts++;
      }

      if (!uniqueCode) {
        return { session: null, error: 'Could not generate a unique game code. Please try again.' };
      }

      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          game_code: uniqueCode,
          host_id: hostId,
          status: 'waiting',
          current_round: 0
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating game session:', error);
        return { session: null, error: 'Failed to create game session in database.' };
      }

      return { session: data as DbGameSession, error: null };
    } catch (err) {
      console.error('Unexpected error in createGameSession:', err);
      return { session: null, error: 'Unexpected system error while creating session.' };
    }
  },

  /**
   * Retrieves any existing active or waiting game session for this host.
   */
  async getActiveHostSession(hostId: string): Promise<DbGameSession | null> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('host_id', hostId)
        .in('status', ['waiting', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching active host session:', error);
        return null;
      }

      return data as DbGameSession | null;
    } catch (err) {
      console.error('Unexpected error in getActiveHostSession:', err);
      return null;
    }
  },

  /**
   * Looks up a game session by game code (for player join).
   */
  async getGameByCode(gameCode: string): Promise<{ session: DbGameSession | null; error: string | null }> {
    try {
      const cleanCode = gameCode.trim().toUpperCase();
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('game_code', cleanCode)
        .maybeSingle();

      if (error) {
        console.error('Error looking up game code:', error);
        return { session: null, error: 'Error checking game code.' };
      }

      if (!data) {
        return { session: null, error: 'GAME NOT FOUND. Check the code and try again.' };
      }

      if (data.status === 'completed') {
        return { session: null, error: 'This game has already completed.' };
      }

      return { session: data as DbGameSession, error: null };
    } catch (err) {
      console.error('Unexpected error in getGameByCode:', err);
      return { session: null, error: 'Network error. Please try again.' };
    }
  },

  /**
   * Creates an anonymous player record in Supabase when joining a session.
   */
  async joinPlayer(sessionId: string, anonymousName: string): Promise<{ player: DbPlayer | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert({
          session_id: sessionId,
          anonymous_name: anonymousName
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating player record:', error);
        return { player: null, error: 'Could not register player in session.' };
      }

      return { player: data as DbPlayer, error: null };
    } catch (err) {
      console.error('Unexpected error in joinPlayer:', err);
      return { player: null, error: 'Failed to join game. Please try again.' };
    }
  },

  /**
   * Verifies an existing player by ID and session ID (for reconnect/refresh).
   */
  async verifyPlayer(playerId: string, sessionId: string): Promise<DbPlayer | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      // Update last_seen timestamp
      await supabase
        .from('players')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', playerId);

      return data as DbPlayer;
    } catch {
      return null;
    }
  },

  /**
   * Gets the list of players connected to a session.
   */
  async getSessionPlayers(sessionId: string): Promise<DbPlayer[]> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', sessionId)
        .order('joined_at', { ascending: true });

      if (error || !data) {
        return [];
      }

      return data as DbPlayer[];
    } catch {
      return [];
    }
  },

  /**
   * Host updates game state (status or round).
   */
  async updateGameState(
    sessionId: string, 
    status: 'waiting' | 'active' | 'completed', 
    currentRound?: number
  ): Promise<boolean> {
    try {
      const payload: Partial<DbGameSession> = {
        status,
        updated_at: new Date().toISOString()
      };
      if (typeof currentRound === 'number') {
        payload.current_round = currentRound;
      }

      const { error } = await supabase
        .from('game_sessions')
        .update(payload)
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating game state:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Unexpected error in updateGameState:', err);
      return false;
    }
  }
};
