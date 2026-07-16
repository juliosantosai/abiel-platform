const { autenticar, manejarErrores, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const path = require("path");
const TenantContext = require(path.resolve(__dirname, "../../../../shared/tenant/TenantContext"));
const ValidationError = require(path.resolve(__dirname, "../../../../shared/errors/ValidationError"));
const DomainError = require(path.resolve(__dirname, "../../../../shared/errors/DomainError"));
const NotFoundError = require(path.resolve(__dirname, "../../../../shared/errors/NotFoundError"));
const TenantError = require(path.resolve(__dirname, "../../../../shared/tenant/TenantError"));

describe("Middleware: autenticar", () => {
    test("debe rechazar sin token", () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        autenticar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: expect.stringContaining("No se proporcionó") });
        expect(next).not.toHaveBeenCalled();
    });

    test("debe rechazar token inválido", () => {
        const req = { headers: { authorization: "Bearer invalid-token" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        autenticar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: expect.stringContaining("Token inválido") });
        expect(next).not.toHaveBeenCalled();
    });

    test("debe aceptar token válido y extraer tenantContext", () => {
        const token = jwt.sign({ empresaId: "empresa-123" }, JWT_SECRET);
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = {};
        const next = jest.fn();

        autenticar(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.tenantContext).toBeDefined();
        expect(req.usuario.empresaId).toEqual("empresa-123");
        expect(req.usuario.iat).toBeDefined(); // JWT siempre genera iat
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
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: "Datos inválidos",
            fields: { email: "Email requerido" },
        });
    });

    test("debe mapear NotFoundError a 404", () => {
        const err = new NotFoundError("Empresa", "e1");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "Empresa no encontrado" });
    });

    test("debe mapear DomainError a 422", () => {
        const err = new DomainError("No se puede activar: estado inválido");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: expect.stringContaining("No se puede activar") });
    });

    test("debe mapear TenantError a 403", () => {
        const err = new TenantError("Acceso denegado a otro tenant");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: expect.stringContaining("Acceso denegado") });
    });

    test("debe mapear errores genéricos a 500", () => {
        const err = new Error("Error desconocido");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        manejarErrores(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: "Error desconocido" });
    });
});
