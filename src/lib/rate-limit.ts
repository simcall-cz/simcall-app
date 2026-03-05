// ============================================================
// In-memory rate limiter for API routes
// Limits requests per IP address over a sliding window.
// For Vercel serverless: each cold-start resets the map,
// but this still protects against rapid bursts within
// the same instance lifetime.
// ============================================================

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const ipMap = new Map<string, RateLimitEntry>();

// Clean old entries every 5 minutes to prevent memory growth
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of ipMap) {
        if (now > entry.resetAt) ipMap.delete(key);
    }
}

/**
 * Check if a request should be rate-limited.
 *
 * @param ip      Client IP address
 * @param limit   Max requests per window (default: 5)
 * @param windowMs  Window duration in ms (default: 60 000 = 1 minute)
 * @returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`
 */
export function rateLimit(
    ip: string,
    limit = 5,
    windowMs = 60_000,
): { allowed: true } | { allowed: false; retryAfterMs: number } {
    cleanup();

    const now = Date.now();
    const key = ip;
    const entry = ipMap.get(key);

    if (!entry || now > entry.resetAt) {
        // First request in this window
        ipMap.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true };
    }

    if (entry.count < limit) {
        entry.count++;
        return { allowed: true };
    }

    // Over limit
    return { allowed: false, retryAfterMs: entry.resetAt - now };
}

/**
 * Extract client IP from Next.js request headers.
 * Works on Vercel (x-forwarded-for) and locally.
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") || "unknown";
}
