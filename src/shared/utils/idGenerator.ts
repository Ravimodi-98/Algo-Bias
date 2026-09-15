/**
 * Generates an anonymous player identifier (e.g. PLAYER-4821).
 * Avoids any personal or identifiable information per Digital Ethics requirements.
 */
export function generateAnonymousPlayerId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PLAYER-${randomSuffix}`;
}

/**
 * Formats or normalizes a game code entered by a user.
 */
export function normalizeGameCode(code: string): string {
  return code.trim().toUpperCase();
}
