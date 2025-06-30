// lib/time-utils.ts

// Helper function for time remaining (future date)
export function getTimeRemaining(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'Due now';
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Less than 1 minute remaining';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} remaining`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} remaining`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} remaining`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth} month${diffMonth === 1 ? '' : 's'} remaining`;
}

// Helper function for time difference (past)
export function getTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Less than 1 minute ago';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
}

// Helper to format a date as YYYY-MM-DD HH:mm:ss
export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
