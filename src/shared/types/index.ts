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
  results_visible?: boolean;
  game_stage?: 'lobby' | 'round' | 'results' | 'reveal' | 'fairness' | 'completed';
  reveal_step?: number;
  fairness_step?: number;
}

export type RevealStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface RevealStepData {
  stepNumber: RevealStepNumber;
  title: string;
  subtitle: string;
  section: 'INTRO' | 'DATA_REVIEW' | 'FACTORS' | 'QUESTION' | 'SCALE' | 'ALGORITHM' | 'IMPACT' | 'FAIRNESS_LESSON' | 'NEXT_STEPS';
}

export type FairnessStepNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type FairnessStageKey = 
  | 'ready'
  | 'factors'
  | 'rule'
  | 'apply'
  | 'fairness_test'
  | 'consistency_test'
  | 'transparency_test'
  | 'human_oversight'
  | 'results'
  | 'reflection';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'EXCLUDE';

export interface FairnessResponseData {
  ready?: boolean;
  selectedFactors?: string[];
  priorities?: Record<string, PriorityLevel>;
  selectedCandidate?: 'A' | 'B';
  testAnswer?: 'YES' | 'NO' | 'DEPENDS';
  humanOversightAnswer?: 'YES' | 'NO';
}

export interface DbFairnessResponse {
  id: string;
  session_id: string;
  player_id: string;
  stage: string;
  response: FairnessResponseData;
  submitted_at: string;
}

export interface FairnessClassroomAggregates {
  totalParticipants: number;
  factorsCount: Record<string, number>;
  rulesCount: Record<string, Record<PriorityLevel, number>>;
  applyDecisions: { candidateA: number; candidateB: number };
  fairnessTestAnswers: { YES: number; NO: number; DEPENDS: number };
  consistencyTestAnswers: { YES: number; NO: number; DEPENDS: number };
  transparencyTestAnswers: { YES: number; NO: number };
  humanOversightAnswers: { YES: number; NO: number };
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

export interface RoundAggregate {
  roundNumber: number;
  totalResponses: number;
  candidateA: {
    count: number;
    percentage: number;
  };
  candidateB: {
    count: number;
    percentage: number;
  };
}

export interface GameMetrics {
  status: GameStatus;
  playersJoined: number;
  currentRoundNumber: number;
  totalRounds: number;
  responsesReceived: number;
}

