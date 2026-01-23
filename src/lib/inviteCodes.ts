/**
 * Generate a random invite code
 * Format: XXXXXXXXXX (10 random alphanumeric characters)
 * Excludes similar looking characters: 0, O, I, 1, l
 */
export function generateInviteCode(length: number = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Format code for display (adds dashes every 3 chars)
 * Example: XK9P2M7H4R -> XK9-P2M-7H4-R
 */
export function formatCode(code: string): string {
  return code.match(/.{1,3}/g)?.join('-') || code;
}

/**
 * Clean code (remove spaces and dashes for database storage)
 */
export function cleanCode(code: string): string {
  return code.replace(/[\s-]/g, '').toUpperCase();
}
