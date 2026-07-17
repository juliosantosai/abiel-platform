const SuspenderUsuarioUseCase = require("./SuspenderUsuarioUseCase");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../core/security/TenantError");
const Usuario = require("../../domain/entities/Usuario");
const UsuarioSuspendido = require("../../domain/events/UsuarioSuspendido");

describe("SuspenderUsuarioUseCase", () => {
    test("debe suspender un usuario y publicar evento", async () => {
        const usuario = new Usuario({
            id: "usuario-1",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });
        usuario.activar();

        const fakeRepository = {
            buscarPorId: jest.fn(async () => usuario),
            actualizar: jest.fn(async (u) => u)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new SuspenderUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const resultado = await useCase.execute({ id: "usuario-1" });

        expect(resultado.estado).toBe("SUSPENDIDO");
        expect(fakeRepository.actualizar).toHaveBeenCalledWith(expect.any(Usuario));
        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(UsuarioSuspendido);
        expect(publishedEvent.data).toEqual({
            usuarioId: "usuario-1",
            empresaId: "empresa-1",
            estado: "SUSPENDIDO"
        });
    });

    test("debe lanzar NotFoundError si el usuario no existe", async () => {
        const fakeRepository = {
            buscarPorId: jest.fn(async () => null),
            actualizar: jest.fn()
        };

        const useCase = new SuspenderUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() }
        });

        await expect(useCase.execute({ id: "missing" })).rejects.toThrow(NotFoundError);
    });

    test("debe rechazar la suspensión si el usuario pertenece a otro tenant", async () => {
        const usuario = new Usuario({
            id: "usuario-4",
            empresaId: "empresa-a",
            nombre: "Carlos",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });
        usuario.activar();

        const fakeRepository = {
            buscarPorId: jest.fn(async () => usuario),
            actualizar: jest.fn(async (u) => u)
        };

        const tenantGuard = new TenantGuard({ tenantContext: "empresa-b" });
        const useCase = new SuspenderUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() },
            tenantGuard
        });

        await expect(useCase.execute({ id: "usuario-4", tenantContext: "empresa-b" })).rejects.toThrow(TenantError);
        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
    });
});
