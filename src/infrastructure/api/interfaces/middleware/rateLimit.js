/**
 * Simple in-memory rate limiter middleware
 * Tracks requests per client (by IP address) within time windows
 */

class RateLimiter {
    constructor(maxRequests = 100, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = new Map();
    }

    middleware() {
        return (req, res, next) => {
            const key = req.ip || req.connection.remoteAddress || "unknown";
            const now = Date.now();

            if (!this.requests.has(key)) {
                this.requests.set(key, []);
            }

            const clientRequests = this.requests.get(key);

            // Limpiar requests antiguos fuera de la ventana
            const recentRequests = clientRequests.filter((timestamp) => now - timestamp < this.windowMs);
            this.requests.set(key, recentRequests);

            if (recentRequests.length >= this.maxRequests) {
                return res.status(429).json({
                    success: false,
                    error: `Too many requests. Maximum ${this.maxRequests} requests per ${this.windowMs / 1000} seconds.`,
                });
            }

            recentRequests.push(now);
            next();
        };
    }

    reset() {
        this.requests.clear();
    }
}

function crearRateLimiter(maxRequests = 100, windowMs = 60000) {
    return new RateLimiter(maxRequests, windowMs);
}

module.exports = { RateLimiter, crearRateLimiter };
