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
  return isAllowedForKey(getClientIp(request), { windowMs, maxRequests, keyPrefix });
}

// Same bucket logic, keyed on any identifier rather than the requester's
// IP — used to throttle by phone number, since one person can submit from
// several IPs (mobile data switching towers, shared office wifi) but not
// several phone numbers.
export function isAllowedForKey(
  identifier: string,
  { windowMs, maxRequests, keyPrefix }: { windowMs: number; maxRequests: number; keyPrefix: string }
): boolean {
  const key = `${keyPrefix}:${identifier}`;
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

// A real customer submits one reservation at a time, occasionally two if
// they're booking a flight and a hotel separately. This is generous enough
// for that and tight enough to blunt a scripted flood.
export const reservationRateLimit = {
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 8,
  keyPrefix: "reservation",
};

// Tighter, per-phone-number ceiling on top of the per-IP one above — one
// customer legitimately submits a handful of requests (a flight, a hotel,
// a car) in one sitting, never dozens.
export const reservationPhoneRateLimit = {
  windowMs: 30 * 60 * 1000, // 30 minutes
  maxRequests: 5,
  keyPrefix: "reservation-phone",
};

// The live-quote endpoint gets called on every form keystroke/blur — much
// higher ceiling than actual submission, still bounded.
export const quoteRateLimit = {
  windowMs: 60 * 1000,
  maxRequests: 30,
  keyPrefix: "quote",
};
