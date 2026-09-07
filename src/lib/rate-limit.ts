import type { NextRequest } from "next/server";

// Small in-memory limiter — no Redis dependency, matches elleza's pattern.
// Fine for a single-instance deployment; revisit if this ever runs on
// multiple server instances behind a load balancer without sticky sessions.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

setInterval(
  () => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  },
  5 * 60 * 1000
).unref?.();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if the request is allowed, false if it should be rejected.
 * Used to throttle login attempts (brute-force protection, NFR Segurança).
 */
export function isAllowed(
  request: NextRequest,
  { windowMs, maxRequests, keyPrefix }: { windowMs: number; maxRequests: number; keyPrefix: string }
): boolean {
  const key = `${keyPrefix}:${getClientIp(request)}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= maxRequests) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export const loginRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  keyPrefix: "login",
};
