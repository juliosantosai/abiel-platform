const { RateLimiter, crearRateLimiter } = require("./rateLimit");

describe("RateLimiter", () => {
    let limiter;

    beforeEach(() => {
        limiter = crearRateLimiter(3, 1000); // 3 requests per second
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("debe permitir requests dentro del límite", async () => {
        const middleware = limiter.middleware();
        const req = { ip: "192.168.1.1" };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Primer request
        middleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();

        // Segundo request
        middleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(2);

        // Tercer request
        middleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(3);
    });

    test("debe rechazar requests que exceden el límite", async () => {
        const middleware = limiter.middleware();
        const req = { ip: "192.168.1.1" };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Hacer 4 requests (límite es 3)
        middleware(req, res, next);
        middleware(req, res, next);
        middleware(req, res, next);
        middleware(req, res, next); // Este debe ser rechazado

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: expect.stringContaining("Too many requests"),
        });
    });

    test("debe diferenciar entre diferentes IPs", async () => {
        const middleware = limiter.middleware();
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Cliente 1 hace 3 requests
        const req1 = { ip: "192.168.1.1" };
        middleware(req1, res, next);
        middleware(req1, res, next);
        middleware(req1, res, next);

        // Cliente 2 hace 1 request (debe pasar porque es diferente IP)
        const req2 = { ip: "192.168.1.2" };
        middleware(req2, res, next);

        expect(next).toHaveBeenCalledTimes(4); // Todos los requests fueron permitidos
    });

    test("debe resetear el contador después de la ventana", async () => {
        jest.useFakeTimers();
        const limiter2 = crearRateLimiter(2, 1000); // 2 requests per second
        const middleware = limiter2.middleware();
        const req = { ip: "192.168.1.1" };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Hacer 2 requests en tiempo 0
        middleware(req, res, next);
        middleware(req, res, next);

        // Avanzar tiempo 1100ms (más de la ventana)
        jest.advanceTimersByTime(1100);

        // Ahora debería permitir más requests
        middleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(3);

        jest.useRealTimers();
    });

    test("debe manejar requests sin IP", () => {
        const middleware = limiter.middleware();
        const req = { connection: { remoteAddress: "127.0.0.1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
