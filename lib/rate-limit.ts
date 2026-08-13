const windows = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 90;

export function allowRequest(key: string, now = Date.now()) {
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  current.count += 1;
  return current.count <= MAX_REQUESTS;
}
