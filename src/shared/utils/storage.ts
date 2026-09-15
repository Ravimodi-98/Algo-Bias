import type { PlayerSession, HostSession } from '../types';

const PLAYER_SESSION_KEY = 'the_decision_player_session';
const HOST_SESSION_KEY = 'the_decision_host_session';

export const storage = {
  // Player session methods
  getPlayerSession(): PlayerSession | null {
    try {
      const data = localStorage.getItem(PLAYER_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setPlayerSession(session: PlayerSession): void {
    try {
      localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage write errors
    }
  },

  clearPlayerSession(): void {
    try {
      localStorage.removeItem(PLAYER_SESSION_KEY);
    } catch {
      // Ignore
    }
  },

  // Host session methods (stored in sessionStorage for strict tab/session isolation)
  getHostSession(): HostSession | null {
    try {
      const data = sessionStorage.getItem(HOST_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setHostSession(session: HostSession): void {
    try {
      sessionStorage.setItem(HOST_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore
    }
  },

  clearHostSession(): void {
    try {
      sessionStorage.removeItem(HOST_SESSION_KEY);
    } catch {
      // Ignore
    }
  }
};
