const UsuarioController = require("./UsuarioController");

describe("UsuarioController", () => {
    let controller;
    let mockUseCases;

    beforeEach(() => {
        mockUseCases = {
            crearUsuarioUseCase: { execute: jest.fn() },
            actualizarUsuarioUseCase: { execute: jest.fn() },
            activarUsuarioUseCase: { execute: jest.fn() },
            suspenderUsuarioUseCase: { execute: jest.fn() },
            cancelarUsuarioUseCase: { execute: jest.fn() },
        };
        controller = new UsuarioController(mockUseCases);
    });

    describe("crear", () => {
        test("debe crear usuario y retornar 201", async () => {
            const usuario = { id: "u1", empresaId: "e1", nombre: "Juan", email: "juan@acme.com", rol: "OPERADOR", estado: "ACTIVO" };
            mockUseCases.crearUsuarioUseCase.execute.mockResolvedValue(usuario);

            const req = { body: { empresaId: "e1", nombre: "Juan", email: "juan@acme.com", rol: "OPERADOR" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            await controller.crear(req, res, next);

            expect(mockUseCases.crearUsuarioUseCase.execute).toHaveBeenCalledWith({
                empresaId: "e1",
                nombre: "Juan",
                email: "juan@acme.com",
                rol: "OPERADOR",
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: usuario });
        });
    });

    describe("actualizar", () => {
        test("debe actualizar usuario", async () => {
            const usuario = { id: "u1", nombre: "Juan Actualizado", email: "new@acme.com", rol: "ADMIN", estado: "ACTIVO" };
            mockUseCases.actualizarUsuarioUseCase.execute.mockResolvedValue(usuario);

            const req = {
                params: { id: "u1" },
                body: { nombre: "Juan Actualizado", email: "new@acme.com", rol: "ADMIN" },
                tenantContext: { tenantId: "e1" },
            };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.actualizar(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: usuario });
        });
    });

    describe("activar", () => {
        test("debe activar usuario", async () => {
            const usuario = { id: "u1", estado: "ACTIVO" };
            mockUseCases.activarUsuarioUseCase.execute.mockResolvedValue(usuario);

            const req = { params: { id: "u1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.activar(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: usuario });
        });
    });

    describe("suspender", () => {
        test("debe suspender usuario", async () => {
            const usuario = { id: "u1", estado: "SUSPENDIDO" };
            mockUseCases.suspenderUsuarioUseCase.execute.mockResolvedValue(usuario);

            const req = { params: { id: "u1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.suspender(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: usuario });
        });
    });

    describe("cancelar", () => {
        test("debe cancelar usuario", async () => {
            const usuario = { id: "u1", estado: "CANCELADO" };
            mockUseCases.cancelarUsuarioUseCase.execute.mockResolvedValue(usuario);

            const req = { params: { id: "u1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.cancelar(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ success: true, data: usuario });
        });
    });
});
