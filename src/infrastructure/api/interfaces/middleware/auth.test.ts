export {};

const { autenticar, manejarErrores } = require("./auth");
const jwt = require("jsonwebtoken");
const path = require("path");
const TenantContext = require(path.resolve(__dirname, "../../../../shared/tenant/TenantContext"));
const ValidationError = require(path.resolve(__dirname, "../../../../shared/errors/ValidationError"));
const DomainError = require(path.resolve(__dirname, "../../../../shared/errors/DomainError"));
const NotFoundError = require(path.resolve(__dirname, "../../../../shared/errors/NotFoundError"));
const TenantError = require(path.resolve(__dirname, "../../../../core/security/TenantError"));

describe("Middleware: autenticar", () => {
    const TEST_JWT_SECRET = "test-secret-key-for-auth";

    beforeEach(() => {
        process.env.JWT_SECRET = TEST_JWT_SECRET;
    });

    test("debe rechazar sin token", () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn((err) => manejarErrores(err, req, res, () => {}));

        autenticar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "AUTH_REQUIRED",
                problem: expect.objectContaining({ status: 401 }),
            })
        );
        expect(next).toHaveBeenCalled();
    });

    test("debe rechazar token inválido", () => {
        const req = { headers: { authorization: "Bearer invalid-token" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn((err) => manejarErrores(err, req, res, () => {}));

        autenticar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "AUTH_INVALID_TOKEN",
                problem: expect.objectContaining({ status: 401 }),
            })
        );
        expect(next).toHaveBeenCalled();
    });

    test("debe aceptar token válido y extraer tenantContext", () => {
        const token = jwt.sign({ empresaId: "empresa-123" }, TEST_JWT_SECRET);
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = {};
        const next = jest.fn();

        autenticar(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.tenantContext).toBeDefined();
        expect(req.usuario.empresaId).toEqual("empresa-123");
        expect(req.usuario.iat).toBeDefined();
    });
});

describe("Middleware: manejarErrores", () => {
    test("debe mapear ValidationError a 400", () => {
        const err = new ValidationError("Datos inválidos", { email: "Email requerido" });
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "VALIDATION_ERROR",
                fields: { email: "Email requerido" },
                problem: expect.objectContaining({ status: 400 }),
            })
        );
    });

    test("debe mapear NotFoundError a 404", () => {
        const err = new NotFoundError("Empresa", "e1");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "NOT_FOUND",
                problem: expect.objectContaining({ status: 404 }),
            })
        );
    });

    test("debe mapear DomainError a 422", () => {
        const err = new DomainError("No se puede activar: estado inválido");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "DOMAIN_ERROR",
                problem: expect.objectContaining({ status: 422 }),
            })
        );
    });

    test("debe mapear TenantError a 403", () => {
        const err = new TenantError("Acceso denegado a otro tenant");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "TENANT_FORBIDDEN",
                problem: expect.objectContaining({ status: 403 }),
            })
        );
    });

    test("debe mapear generic Error a 500", () => {
        const err = new Error("Error inesperado");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                code: "INTERNAL_ERROR",
                problem: expect.objectContaining({ status: 500 }),
            })
        );
    });
});