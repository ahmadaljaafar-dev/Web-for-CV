import { query } from "./db";

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const windowSeconds = windowMinutes * 60;

  const existing = await query<{ window_start: string; request_count: number }>(
    "SELECT window_start, request_count FROM rate_limits WHERE key = $1",
    [key]
  );

  const now = Date.now();
  if (existing.rows.length === 0) {
    await query(
      "INSERT INTO rate_limits (key, window_start, request_count) VALUES ($1, NOW(), 1) ON CONFLICT (key) DO UPDATE SET window_start = NOW(), request_count = 1",
      [key]
    );
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  const row = existing.rows[0];
  const elapsedSeconds = Math.floor((now - new Date(row.window_start).getTime()) / 1000);

  if (elapsedSeconds >= windowSeconds) {
    await query(
      "UPDATE rate_limits SET window_start = NOW(), request_count = 1 WHERE key = $1",
      [key]
    );
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (row.request_count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, windowSeconds - elapsedSeconds),
    };
  }

  await query(
    "UPDATE rate_limits SET request_count = request_count + 1 WHERE key = $1",
    [key]
  );

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - (row.request_count + 1)),
    retryAfterSeconds: 0,
  };
}
