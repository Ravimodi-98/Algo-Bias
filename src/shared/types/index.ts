export type GameStatus = 
  | 'WAITING' 
  | 'ACTIVE' 
  | 'PAUSED' 
  | 'REVEAL' 
  | 'FAIRNESS' 
  | 'COMPLETED';

export interface PlayerSession {
  playerId: string;
  sessionId: string;
  anonymousName: string;
  gameCode: string;
  joinedAt: string;
}

export interface HostSession {
  isAuthenticated: boolean;
  hostId: string;
  authenticatedAt?: string;
  role: 'host';
}

export interface DbGameSession {
  id: string;
  game_code: string;
  host_id: string;
  status: 'waiting' | 'active' | 'completed';
  current_round: number;
  created_at: string;
  updated_at: string;
  round_started_at?: string;
}

export interface DbPlayer {
  id: string;
  session_id: string;
  anonymous_name: string;
  joined_at: string;
  last_seen: string;
}

export interface DbResponse {
  id: string;
  session_id: string;
  player_id: string;
  round_number: number;
  selected_candidate: 'A' | 'B';
  submitted_at: string;
}

export interface GameMetrics {
  status: GameStatus;
  playersJoined: number;
  currentRoundNumber: number;
  totalRounds: number;
  responsesReceived: number;
}
