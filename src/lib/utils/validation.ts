// Validation utilities

export function isValidDiscordId(id: string | null | undefined): boolean {
  if (!id) return false;
  return /^\d{17,19}$/.test(id);
}

export function sanitizeExternalURL(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return url;
  } catch {
    return '';
  }
}

export function escapeHtml(text: string): string {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.textContent || ''; // Use textContent instead of innerHTML for clarity
}

