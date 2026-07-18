export {};

const CancelarUsuarioUseCase = require("./CancelarUsuarioUseCase");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../core/security/TenantError");
const Usuario = require("../../domain/entities/Usuario");
const UsuarioCancelado = require("../../domain/events/UsuarioCancelado");

describe("CancelarUsuarioUseCase", () => {
    test("debe cancelar un usuario y publicar evento", async () => {
        const usuario = new Usuario({
            id: "usuario-1",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        const fakeRepository = {
            buscarPorId: jest.fn(async () => usuario),
            actualizar: jest.fn(async (u) => u)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new CancelarUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const resultado = await useCase.execute({ id: "usuario-1" });

        expect(resultado.estado).toBe("CANCELADO");
        expect(fakeRepository.actualizar).toHaveBeenCalledWith(expect.any(Usuario));
        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(UsuarioCancelado);
        expect(publishedEvent.data).toEqual({
            usuarioId: "usuario-1",
            empresaId: "empresa-1",
            estado: "CANCELADO"
        });
    });

    test("debe lanzar NotFoundError si el usuario no existe", async () => {
        const fakeRepository = {
            buscarPorId: jest.fn(async () => null),
            actualizar: jest.fn()
        };

        const useCase = new CancelarUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() }
        });

        await expect(useCase.execute({ id: "missing" })).rejects.toThrow(NotFoundError);
    });

    test("debe rechazar la cancelación si el usuario pertenece a otro tenant", async () => {
        const usuario = new Usuario({
            id: "usuario-5",
            empresaId: "empresa-a",
            nombre: "Carlos",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        const fakeRepository = {
            buscarPorId: jest.fn(async () => usuario),
            actualizar: jest.fn(async (u) => u)
        };

        const tenantGuard = new TenantGuard({ tenantContext: "empresa-b" });
        const useCase = new CancelarUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() },
            tenantGuard
        });

        await expect(useCase.execute({ id: "usuario-5", tenantContext: "empresa-b" })).rejects.toThrow(TenantError);
        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
    });
});
