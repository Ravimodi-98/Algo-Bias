/**
 * Generates an anonymous player identifier (e.g. PLAYER-4821).
 * Avoids any personal or identifiable information per Digital Ethics requirements.
 */
export function generateAnonymousPlayerId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PLAYER-${randomSuffix}`;
}

/**
 * Generates an unambiguous, easy-to-read 6-character game room code (e.g. A7K92B).
 * Omits ambiguous characters like 0, O, 1, I to prevent confusion on projector displays.
 */
export function generateGameCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

/**
 * Formats or normalizes a game code entered by a user.
 */
export function normalizeGameCode(code: string): string {
  return code.trim().toUpperCase();
}

