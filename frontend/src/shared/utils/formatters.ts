/**
 * Formats a user's name for consistent display.
 * Falls back to username if no first/last name exists.
 */
export function formatDisplayName(user: { firstName?: string; lastName?: string; username: string; userName?: string }): string {
  const uname = user.username || user.userName || '';
  const first = user.firstName || '';
  const last = user.lastName || '';
  const full = `${first} ${last}`.trim();
  return full || uname;
}

/**
 * Truncates text with trailing ellipsis.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

/**
 * Formats external links cleanly.
 */
export function formatWebsiteUrl(url?: string): string {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `https://${url}`;
}

/**
 * Formats standard readable dates.
 */
export function formatJoinedDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
