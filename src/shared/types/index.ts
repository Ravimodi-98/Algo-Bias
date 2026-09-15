export type GameStatus = 
  | 'WAITING' 
  | 'ACTIVE' 
  | 'PAUSED' 
  | 'REVEAL' 
  | 'FAIRNESS' 
  | 'COMPLETED';

export interface PlayerSession {
  playerId: string;
  anonymousName: string;
  gameCode: string;
  joinedAt: string;
}

export interface HostSession {
  isAuthenticated: boolean;
  authenticatedAt?: string;
  role: 'host';
}

export interface GameMetrics {
  status: GameStatus;
  playersJoined: number;
  currentRoundNumber: number;
  totalRounds: number;
  responsesReceived: number;
}
