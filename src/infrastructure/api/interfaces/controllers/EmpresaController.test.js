const EmpresaController = require("./EmpresaController");
const path = require("path");
const ValidationError = require(path.resolve(__dirname, "../../../../shared/errors/ValidationError"));
const DomainError = require(path.resolve(__dirname, "../../../../shared/errors/DomainError"));
const NotFoundError = require(path.resolve(__dirname, "../../../../shared/errors/NotFoundError"));

describe("EmpresaController", () => {
    let controller;
    let mockUseCases;

    beforeEach(() => {
        mockUseCases = {
            crearEmpresaUseCase: { execute: jest.fn() },
            actualizarEmpresaUseCase: { execute: jest.fn() },
            activarEmpresaUseCase: { execute: jest.fn() },
            suspenderEmpresaUseCase: { execute: jest.fn() },
            cancelarEmpresaUseCase: { execute: jest.fn() },
        };
        controller = new EmpresaController(mockUseCases);
    });

    describe("crear", () => {
        test("debe crear empresa y retornar 201", async () => {
            const empresa = { id: "e1", nombre: "Acme", email: "contact@acme.com", estado: "PENDIENTE" };
            mockUseCases.crearEmpresaUseCase.execute.mockResolvedValue(empresa);

            const req = { body: { nombre: "Acme", email: "contact@acme.com", telefono: "555-1234" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            await controller.crear(req, res, next);

            expect(mockUseCases.crearEmpresaUseCase.execute).toHaveBeenCalledWith({
                nombre: "Acme",
                email: "contact@acme.com",
                telefono: "555-1234",
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: "e1" }),
                })
            );
        });

        test("debe propagar ValidationError", async () => {
            const error = new ValidationError("Email inválido");
            mockUseCases.crearEmpresaUseCase.execute.mockRejectedValue(error);

            const req = { body: { nombre: "Acme", email: "contact@acme.com", telefono: "555-1234" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            await controller.crear(req, res, next);

            expect(mockUseCases.crearEmpresaUseCase.execute).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("actualizar", () => {
        test("debe actualizar empresa", async () => {
            const empresa = { id: "e1", nombre: "Acme Corp", email: "new@acme.com", estado: "PENDIENTE" };
            mockUseCases.actualizarEmpresaUseCase.execute.mockResolvedValue(empresa);

            const req = {
                params: { id: "e1" },
                body: { nombre: "Acme Corp", email: "new@acme.com" },
                tenantContext: { tenantId: "e1" },
            };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.actualizar(req, res, next);

            expect(mockUseCases.actualizarEmpresaUseCase.execute).toHaveBeenCalledWith({
                id: "e1",
                nombre: "Acme Corp",
                email: "new@acme.com",
                tenantContext: { tenantId: "e1" },
            });
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: "e1" }),
                })
            );
        });

        test("debe propagar NotFoundError", async () => {
            const error = new NotFoundError("Empresa", "invalid");
            mockUseCases.actualizarEmpresaUseCase.execute.mockRejectedValue(error);

            const req = { params: { id: "invalid" }, body: { nombre: "Updated" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.actualizar(req, res, next);

            expect(mockUseCases.actualizarEmpresaUseCase.execute).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("activar", () => {
        test("debe activar empresa", async () => {
            const empresa = { id: "e1", estado: "ACTIVA" };
            mockUseCases.activarEmpresaUseCase.execute.mockResolvedValue(empresa);

            const req = { params: { id: "e1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.activar(req, res, next);

            expect(mockUseCases.activarEmpresaUseCase.execute).toHaveBeenCalledWith({
                id: "e1",
                tenantContext: { tenantId: "e1" },
            });
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: "e1" }),
                })
            );
        });

        test("debe propagar DomainError si la transición es inválida", async () => {
            const error = new DomainError("No se puede activar: estado inválido");
            mockUseCases.activarEmpresaUseCase.execute.mockRejectedValue(error);

            const req = { params: { id: "e1" }, tenantContext: { tenantId: "e1" } };
            const res = {};
            const next = jest.fn();

            await controller.activar(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("suspender", () => {
        test("debe suspender empresa", async () => {
            const empresa = { id: "e1", estado: "SUSPENDIDA" };
            mockUseCases.suspenderEmpresaUseCase.execute.mockResolvedValue(empresa);

            const req = { params: { id: "e1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.suspender(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: "e1" }),
                })
            );
        });
    });

    describe("cancelar", () => {
        test("debe cancelar empresa", async () => {
            const empresa = { id: "e1", estado: "CANCELADA" };
            mockUseCases.cancelarEmpresaUseCase.execute.mockResolvedValue(empresa);

            const req = { params: { id: "e1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.cancelar(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: "e1" }),
                })
            );
        });
    });
});
