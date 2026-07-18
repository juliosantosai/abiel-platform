export {};

const CrearUsuarioUseCase = require("./CrearUsuarioUseCase");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../core/security/TenantError");
const Usuario = require("../../domain/entities/Usuario");
const UsuarioCreado = require("../../domain/events/UsuarioCreado");

describe("CrearUsuarioUseCase", () => {
    test("debe guardar el usuario y publicar un evento", async () => {
        const fakeRepository = {
            guardar: jest.fn(async (usuario) => usuario)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new CrearUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const usuario = await useCase.execute({
            id: "usuario-1",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        expect(fakeRepository.guardar).toHaveBeenCalledTimes(1);
        expect(fakeRepository.guardar).toHaveBeenCalledWith(expect.any(Usuario));
        expect(usuario).toBeInstanceOf(Usuario);
        expect(usuario.estado).toBe("PENDIENTE");
        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(UsuarioCreado);
        expect(publishedEvent.data).toEqual({
            usuarioId: "usuario-1",
            empresaId: "empresa-1",
            estado: "PENDIENTE"
        });
    });

    test("debe rechazar la creación si el tenant no coincide con la empresa", async () => {
        const fakeRepository = {
            guardar: jest.fn(async (usuario) => usuario)
        };

        const tenantGuard = new TenantGuard({ tenantContext: "empresa-b" });
        const useCase = new CrearUsuarioUseCase({
            usuarioRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() },
            tenantGuard
        });

        await expect(useCase.execute({
            id: "usuario-2",
            empresaId: "empresa-a",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN",
            tenantContext: "empresa-b"
        })).rejects.toThrow(TenantError);

        expect(fakeRepository.guardar).not.toHaveBeenCalled();
    });
});
