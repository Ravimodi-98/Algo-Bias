import { supabase } from '../supabase/client';
import { generateGameCode } from '../../shared/utils/idGenerator';
import type { 
  DbGameSession, 
  DbPlayer, 
  DbResponse, 
  RoundAggregate,
  DbFairnessResponse,
  FairnessResponseData,
  FairnessClassroomAggregates,
  PriorityLevel
} from '../../shared/types';

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
          current_round: 0,
          round_started_at: new Date().toISOString(),
          results_visible: false
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
        return { session: null, error: 'This game has already ended.' };
      }

      if (data.status === 'active') {
        return { session: null, error: 'GAME ALREADY STARTED. Please wait for the next game.' };
      }

      return { session: data as DbGameSession, error: null };
    } catch (err) {
      console.error('Unexpected error in getGameByCode:', err);
      return { session: null, error: 'Network error. Please try again.' };
    }
  },

  /**
   * Retrieves a game session by its UUID.
   */
  async getSessionById(sessionId: string): Promise<DbGameSession | null> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data as DbGameSession;
    } catch {
      return null;
    }
  },

  /**
   * Creates an anonymous player record in Supabase when joining a session,
   * or restores an existing player record to prevent duplicate player rows.
   */
  async joinPlayer(
    sessionId: string, 
    anonymousName: string, 
    existingPlayerId?: string
  ): Promise<{ player: DbPlayer | null; error: string | null }> {
    try {
      // Prevent duplicate player records if player already has an ID in this session
      if (existingPlayerId) {
        const { data: existingPlayer } = await supabase
          .from('players')
          .select('*')
          .eq('id', existingPlayerId)
          .eq('session_id', sessionId)
          .maybeSingle();

        if (existingPlayer) {
          const finalName = anonymousName || existingPlayer.anonymous_name;
          await supabase
            .from('players')
            .update({
              anonymous_name: finalName,
              last_seen: new Date().toISOString()
            })
            .eq('id', existingPlayer.id);

          return { 
            player: { ...existingPlayer, anonymous_name: finalName } as DbPlayer, 
            error: null 
          };
        }
      }

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
   * Submits a player's decision for a specific round.
   * Enforces single submission per player per round via unique constraint.
   */
  async submitResponse(
    sessionId: string,
    playerId: string,
    roundNumber: number,
    selectedCandidate: 'A' | 'B'
  ): Promise<{ response: DbResponse | null; error: string | null; isDuplicate?: boolean }> {
    try {
      const { data, error } = await supabase
        .from('responses')
        .insert({
          session_id: sessionId,
          player_id: playerId,
          round_number: roundNumber,
          selected_candidate: selectedCandidate
        })
        .select()
        .single();

      if (error) {
        // If unique constraint violation (code 23505), fetch existing response
        if (error.code === '23505') {
          const existing = await this.getPlayerResponse(sessionId, playerId, roundNumber);
          return { response: existing, error: null, isDuplicate: true };
        }
        console.error('Error submitting response:', error);
        return { response: null, error: 'Could not record decision.' };
      }

      return { response: data as DbResponse, error: null };
    } catch (err) {
      console.error('Unexpected error in submitResponse:', err);
      return { response: null, error: 'System error while recording response.' };
    }
  },

  /**
   * Retrieves a player's submitted decision for a given round.
   */
  async getPlayerResponse(
    sessionId: string,
    playerId: string,
    roundNumber: number
  ): Promise<DbResponse | null> {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('player_id', playerId)
        .eq('round_number', roundNumber)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data as DbResponse;
    } catch {
      return null;
    }
  },

  /**
   * Retrieves all responses for a specific round in a session (for Host response count).
   */
  async getSessionRoundResponses(sessionId: string, roundNumber: number): Promise<DbResponse[]> {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('round_number', roundNumber);

      if (error || !data) {
        return [];
      }

      return data as DbResponse[];
    } catch {
      return [];
    }
  },

  /**
   * Host updates game state (status or round).
   * Strictly verifies that the caller owns this game session before updating.
   * Updates round_started_at so countdown timers synchronize across all student devices.
   */
  async updateGameState(
    sessionId: string, 
    hostId: string,
    status: 'waiting' | 'active' | 'completed', 
    currentRound?: number
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Enforce host ownership authorization
      const { data: session, error: fetchErr } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr || !session) {
        return { success: false, error: 'Game session not found.' };
      }

      if (session.host_id !== hostId) {
        return { success: false, error: 'Unauthorized: You do not own this game session.' };
      }

      const payload: Partial<DbGameSession> = {
        status,
        updated_at: new Date().toISOString()
      };
      if (typeof currentRound === 'number') {
        payload.current_round = currentRound;
        payload.round_started_at = new Date().toISOString();
        payload.results_visible = false;
      } else if (status === 'active') {
        payload.round_started_at = new Date().toISOString();
        payload.results_visible = false;
      }

      const { error } = await supabase
        .from('game_sessions')
        .update(payload)
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating game state:', error);
        return { success: false, error: 'Failed to update game state.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in updateGameState:', err);
      return { success: false, error: 'Unexpected system error updating game state.' };
    }
  },

  /**
   * Aggregates classroom responses for a specific round.
   * Returns anonymized vote counts and percentages without individual identities.
   */
  async getRoundAggregates(sessionId: string, roundNumber: number): Promise<RoundAggregate> {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('selected_candidate')
        .eq('session_id', sessionId)
        .eq('round_number', roundNumber);

      if (error || !data) {
        return {
          roundNumber,
          totalResponses: 0,
          candidateA: { count: 0, percentage: 0 },
          candidateB: { count: 0, percentage: 0 }
        };
      }

      let countA = 0;
      let countB = 0;
      data.forEach((r) => {
        if (r.selected_candidate === 'A') countA++;
        else if (r.selected_candidate === 'B') countB++;
      });

      const total = countA + countB;
      const percentageA = total > 0 ? Math.round((countA / total) * 100) : 0;
      const percentageB = total > 0 ? 100 - percentageA : 0;

      return {
        roundNumber,
        totalResponses: total,
        candidateA: {
          count: countA,
          percentage: percentageA
        },
        candidateB: {
          count: countB,
          percentage: percentageB
        }
      };
    } catch (err) {
      console.error('Error fetching round aggregates:', err);
      return {
        roundNumber,
        totalResponses: 0,
        candidateA: { count: 0, percentage: 0 },
        candidateB: { count: 0, percentage: 0 }
      };
    }
  },

  /**
   * Host reveals aggregate results for the current round.
   * Authoritatively updates results_visible in Supabase, triggering Realtime updates to all connected players.
   */
  async showRoundResults(sessionId: string, hostId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: session, error: fetchErr } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr || !session) {
        return { success: false, error: 'Game session not found.' };
      }

      if (session.host_id !== hostId) {
        return { success: false, error: 'Unauthorized: You do not own this game session.' };
      }

      const { error } = await supabase
        .from('game_sessions')
        .update({
          results_visible: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error revealing results:', error);
        return { success: false, error: 'Failed to reveal results.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in showRoundResults:', err);
      return { success: false, error: 'Unexpected system error revealing results.' };
    }
  },

  /**
   * Host starts the Bias Reveal stage authoritatively.
   * Sets game_stage = 'reveal' and reveal_step = 1.
   */
  async startBiasReveal(sessionId: string, hostId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: session, error: fetchErr } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr || !session) {
        return { success: false, error: 'Game session not found.' };
      }

      if (session.host_id !== hostId) {
        return { success: false, error: 'Unauthorized: You do not own this game session.' };
      }

      const { error } = await supabase
        .from('game_sessions')
        .update({
          game_stage: 'reveal',
          reveal_step: 1,
          results_visible: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error starting bias reveal:', error);
        return { success: false, error: 'Failed to start bias reveal.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in startBiasReveal:', err);
      return { success: false, error: 'Unexpected system error starting bias reveal.' };
    }
  },

  /**
   * Host advances or navigates reveal steps authoritatively (1 to 9).
   */
  async setRevealStep(sessionId: string, hostId: string, step: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: session, error: fetchErr } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr || !session) {
        return { success: false, error: 'Game session not found.' };
      }

      if (session.host_id !== hostId) {
        return { success: false, error: 'Unauthorized: You do not own this game session.' };
      }

      const clampedStep = Math.max(1, Math.min(step, 9));
      const { error } = await supabase
        .from('game_sessions')
        .update({
          game_stage: 'reveal',
          reveal_step: clampedStep,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating reveal step:', error);
        return { success: false, error: 'Failed to update reveal step.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in setRevealStep:', err);
      return { success: false, error: 'Unexpected system error updating reveal step.' };
    }
  },

  /**
   * Host transitions session from reveal to fairness challenge (Case 9).
   */
  async transitionToFairnessStage(sessionId: string, hostId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: session, error: fetchErr } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr || !session) {
        return { success: false, error: 'Game session not found.' };
      }

      if (session.host_id !== hostId) {
        return { success: false, error: 'Unauthorized: You do not own this game session.' };
      }

      const { error } = await supabase
        .from('game_sessions')
        .update({
          game_stage: 'fairness',
          fairness_step: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error transitioning to fairness stage:', error);
        return { success: false, error: 'Failed to transition to fairness challenge.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in transitionToFairnessStage:', err);
      return { success: false, error: 'Unexpected system error transitioning stage.' };
    }
  },

  /**
   * Host sets the fairness challenge step authoritatively (0 to 9).
   */
  async setFairnessStep(sessionId: string, hostId: string, step: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: session, error: fetchErr } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr || !session) {
        return { success: false, error: 'Game session not found.' };
      }

      if (session.host_id !== hostId) {
        return { success: false, error: 'Unauthorized: You do not own this game session.' };
      }

      const clampedStep = Math.max(0, Math.min(step, 9));
      const { error } = await supabase
        .from('game_sessions')
        .update({
          game_stage: 'fairness',
          fairness_step: clampedStep,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating fairness step:', error);
        return { success: false, error: 'Failed to update fairness step.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in setFairnessStep:', err);
      return { success: false, error: 'Unexpected system error updating fairness step.' };
    }
  },

  /**
   * Submits or updates a player's response for a fairness challenge stage.
   */
  async submitFairnessResponse(
    sessionId: string,
    playerId: string,
    stage: string,
    responseData: FairnessResponseData
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('fairness_responses')
        .upsert(
          {
            session_id: sessionId,
            player_id: playerId,
            stage,
            response: responseData,
            submitted_at: new Date().toISOString()
          },
          { onConflict: 'session_id,player_id,stage' }
        );

      if (error) {
        console.error('Error submitting fairness response:', error);
        return { success: false, error: 'Failed to submit response.' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in submitFairnessResponse:', err);
      return { success: false, error: 'Unexpected system error.' };
    }
  },

  /**
   * Fetches a specific player's prior response for a fairness stage (for reloads/reconnection).
   */
  async getPlayerFairnessResponse(
    sessionId: string,
    playerId: string,
    stage: string
  ): Promise<DbFairnessResponse | null> {
    try {
      const { data, error } = await supabase
        .from('fairness_responses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('player_id', playerId)
        .eq('stage', stage)
        .maybeSingle();

      if (error || !data) return null;
      return data as DbFairnessResponse;
    } catch (err) {
      console.error('Error fetching fairness response:', err);
      return null;
    }
  },

  /**
   * Counts the number of players who submitted a response for a specific fairness stage.
   */
  async getFairnessStageResponseCount(
    sessionId: string,
    stage: string
  ): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('fairness_responses')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .eq('stage', stage);

      if (error) return 0;
      return count || 0;
    } catch (err) {
      console.error('Error counting fairness responses:', err);
      return 0;
    }
  },

  /**
   * Computes aggregate classroom design choices and test statistics anonymously.
   */
  async getFairnessClassroomAggregates(
    sessionId: string
  ): Promise<FairnessClassroomAggregates> {
    const defaultAggregates: FairnessClassroomAggregates = {
      totalParticipants: 0,
      factorsCount: {
        skills: 0,
        experience: 0,
        projects: 0,
        education: 0,
        location: 0,
        name: 0,
        presentation_style: 0
      },
      rulesCount: {
        skills: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
        experience: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
        projects: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
        education: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
        location: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
        name: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
        presentation_style: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 }
      },
      applyDecisions: { candidateA: 0, candidateB: 0 },
      fairnessTestAnswers: { YES: 0, NO: 0, DEPENDS: 0 },
      consistencyTestAnswers: { YES: 0, NO: 0, DEPENDS: 0 },
      transparencyTestAnswers: { YES: 0, NO: 0 },
      humanOversightAnswers: { YES: 0, NO: 0 }
    };

    try {
      const { data, error } = await supabase
        .from('fairness_responses')
        .select('*')
        .eq('session_id', sessionId);

      if (error || !data) return defaultAggregates;

      const participantIds = new Set<string>();

      data.forEach((row) => {
        participantIds.add(row.player_id);
        const resp = row.response as FairnessResponseData;
        if (!resp) return;

        if (row.stage === 'factors' && Array.isArray(resp.selectedFactors)) {
          resp.selectedFactors.forEach((factorKey: string) => {
            if (defaultAggregates.factorsCount[factorKey] !== undefined) {
              defaultAggregates.factorsCount[factorKey]++;
            } else {
              defaultAggregates.factorsCount[factorKey] = 1;
            }
          });
        }

        if (row.stage === 'rule' && resp.priorities) {
          Object.entries(resp.priorities).forEach(([factorKey, priority]) => {
            if (
              defaultAggregates.rulesCount[factorKey] && 
              defaultAggregates.rulesCount[factorKey][priority as PriorityLevel] !== undefined
            ) {
              defaultAggregates.rulesCount[factorKey][priority as PriorityLevel]++;
            }
          });
        }

        if (row.stage === 'apply') {
          if (resp.selectedCandidate === 'A') defaultAggregates.applyDecisions.candidateA++;
          if (resp.selectedCandidate === 'B') defaultAggregates.applyDecisions.candidateB++;
        }

        if (row.stage === 'fairness_test' && resp.testAnswer) {
          if (defaultAggregates.fairnessTestAnswers[resp.testAnswer] !== undefined) {
            defaultAggregates.fairnessTestAnswers[resp.testAnswer]++;
          }
        }

        if (row.stage === 'consistency_test' && resp.testAnswer) {
          if (defaultAggregates.consistencyTestAnswers[resp.testAnswer] !== undefined) {
            defaultAggregates.consistencyTestAnswers[resp.testAnswer]++;
          }
        }

        if (row.stage === 'transparency_test' && resp.testAnswer) {
          if (resp.testAnswer === 'YES') defaultAggregates.transparencyTestAnswers.YES++;
          if (resp.testAnswer === 'NO') defaultAggregates.transparencyTestAnswers.NO++;
        }

        if (row.stage === 'human_oversight' && (resp.humanOversightAnswer || resp.testAnswer)) {
          const ans = resp.humanOversightAnswer || (resp.testAnswer as any);
          if (ans === 'YES') defaultAggregates.humanOversightAnswers.YES++;
          if (ans === 'NO') defaultAggregates.humanOversightAnswers.NO++;
        }
      });

      defaultAggregates.totalParticipants = participantIds.size;
      return defaultAggregates;
    } catch (err) {
      console.error('Error computing fairness aggregates:', err);
      return defaultAggregates;
    }
  },

  /**
   * Retrieves classroom aggregates across all completed rounds (1 to 7) using actual session response data.
   */
  async getSessionAllRoundsAggregates(sessionId: string): Promise<Record<number, RoundAggregate>> {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('round_number, selected_candidate')
        .eq('session_id', sessionId);

      const result: Record<number, RoundAggregate> = {};
      for (let r = 1; r <= 7; r++) {
        result[r] = {
          roundNumber: r,
          totalResponses: 0,
          candidateA: { count: 0, percentage: 0 },
          candidateB: { count: 0, percentage: 0 }
        };
      }

      if (error || !data) {
        return result;
      }

      data.forEach((row) => {
        const r = row.round_number;
        if (result[r]) {
          if (row.selected_candidate === 'A') {
            result[r].candidateA.count++;
          } else if (row.selected_candidate === 'B') {
            result[r].candidateB.count++;
          }
        }
      });

      for (let r = 1; r <= 7; r++) {
        const total = result[r].candidateA.count + result[r].candidateB.count;
        result[r].totalResponses = total;
        if (total > 0) {
          const pctA = Math.round((result[r].candidateA.count / total) * 100);
          result[r].candidateA.percentage = pctA;
          result[r].candidateB.percentage = 100 - pctA;
        }
      }

      return result;
    } catch (err) {
      console.error('Error fetching all rounds aggregates:', err);
      const fallback: Record<number, RoundAggregate> = {};
      for (let r = 1; r <= 7; r++) {
        fallback[r] = {
          roundNumber: r,
          totalResponses: 0,
          candidateA: { count: 0, percentage: 0 },
          candidateB: { count: 0, percentage: 0 }
        };
      }
      return fallback;
    }
  },

  /**
   * Closes a game session safely.
   */
  async closeGameSession(sessionId: string, hostId: string): Promise<{ success: boolean; error: string | null }> {
    return this.updateGameState(sessionId, hostId, 'completed');
  }
};
