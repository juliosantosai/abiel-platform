/**
 * Simple in-memory rate limiter middleware
 * Tracks requests per client (by IP address) within time windows
 */
declare const ApiHttpException: any;
declare class RateLimiter {
    constructor(maxRequests?: number, windowMs?: number);
    middleware(): (req: any, res: any, next: any) => any;
    reset(): void;
}
declare function crearRateLimiter(maxRequests?: number, windowMs?: number): RateLimiter;
//# sourceMappingURL=rateLimit.d.ts.map