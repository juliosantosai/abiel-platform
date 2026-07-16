const ConversationControlController = require("./ConversationControlController");

describe("ConversationControlController", () => {
    let controller;
    let mockUseCases;

    beforeEach(() => {
        mockUseCases = {
            bloquearConversacionUseCase: { execute: jest.fn() },
            cerrarConversacionUseCase: { execute: jest.fn() },
        };
        controller = new ConversationControlController(mockUseCases);
    });

    describe("bloquear", () => {
        test("debe bloquear conversación", async () => {
            const resultado = { conversacionId: "c1", control: "HUMAN_LOCKED" };
            mockUseCases.bloquearConversacionUseCase.execute.mockResolvedValue(resultado);

            const req = { params: { id: "c1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.bloquear(req, res, next);

            expect(mockUseCases.bloquearConversacionUseCase.execute).toHaveBeenCalledWith({
                id: "c1",
                tenantContext: { tenantId: "e1" },
            });
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ conversacionId: "c1" }),
                })
            );
        });

        test("debe propagar errores", async () => {
            const error = new Error("Conversación no encontrada");
            mockUseCases.bloquearConversacionUseCase.execute.mockRejectedValue(error);

            const req = { params: { id: "invalid" }, tenantContext: { tenantId: "e1" } };
            const res = {};
            const next = jest.fn();

            await controller.bloquear(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("cerrar", () => {
        test("debe cerrar conversación", async () => {
            const resultado = { conversacionId: "c1", control: "CLOSED" };
            mockUseCases.cerrarConversacionUseCase.execute.mockResolvedValue(resultado);

            const req = { params: { id: "c1" }, tenantContext: { tenantId: "e1" } };
            const res = { json: jest.fn() };
            const next = jest.fn();

            await controller.cerrar(req, res, next);

            expect(mockUseCases.cerrarConversacionUseCase.execute).toHaveBeenCalledWith({
                id: "c1",
                tenantContext: { tenantId: "e1" },
            });
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ conversacionId: "c1" }),
                })
            );
        });

        test("debe propagar errores", async () => {
            const error = new Error("Estado inválido");
            mockUseCases.cerrarConversacionUseCase.execute.mockRejectedValue(error);

            const req = { params: { id: "c1" }, tenantContext: { tenantId: "e1" } };
            const res = {};
            const next = jest.fn();

            await controller.cerrar(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
