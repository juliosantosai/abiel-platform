export {};

const ActualizarEmpresaUseCase = require("./ActualizarEmpresaUseCase");
const EmpresaActualizada = require("../../domain/events/EmpresaActualizada");
const Empresa = require("../../domain/entities/Empresa");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../core/security/TenantError");

describe("ActualizarEmpresaUseCase", () => {
    test("debe actualizar el nombre de la empresa y publicar el evento EmpresaActualizada", async () => {
        const empresaExistente = new Empresa({
            id: "empresa-2",
            nombre: "Empresa Vieja"
        });

        const fakeRepository = {
            buscarPorId: jest.fn(async () => empresaExistente),
            actualizar: jest.fn(async (empresa) => empresa)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new ActualizarEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const empresa = await useCase.execute({
            id: "empresa-2",
            nombre: "Empresa Nueva"
        });

        expect(fakeRepository.buscarPorId).toHaveBeenCalledTimes(1);
        expect(fakeRepository.buscarPorId).toHaveBeenCalledWith("empresa-2");
        expect(fakeRepository.actualizar).toHaveBeenCalledTimes(1);
        expect(fakeRepository.actualizar).toHaveBeenCalledWith(empresaExistente);

        expect(empresa.nombre).toBe("Empresa Nueva");
        expect(empresa.estado).toBe("PENDIENTE");

        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(EmpresaActualizada);
        expect(publishedEvent.data).toEqual({
            empresaId: "empresa-2",
            nombre: "Empresa Nueva"
        });
    });

    test("debe lanzar NotFoundError cuando la empresa no existe", async () => {
        const fakeRepository = {
            buscarPorId: jest.fn(async () => null),
            actualizar: jest.fn()
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new ActualizarEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        await expect(useCase.execute({ id: "empresa-no-existe", nombre: "Nombre" }))
            .rejects
            .toThrow(NotFoundError);

        expect(fakeRepository.buscarPorId).toHaveBeenCalledWith("empresa-no-existe");
        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
        expect(fakePublisher.publish).not.toHaveBeenCalled();
    });

    test("debe rechazar si el tenant no coincide con la empresa", async () => {
        const empresa = new Empresa({ id: "empresa-A", nombre: "Empresa A" });
        const fakeRepository = {
            buscarPorId: jest.fn(async () => empresa),
            actualizar: jest.fn()
        };
        const tenantGuard = new TenantGuard({ tenantContext: "empresa-B" });
        const useCase = new ActualizarEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() },
            tenantGuard
        });

        await expect(useCase.execute({ id: "empresa-A", nombre: "Nuevo", tenantContext: "empresa-B" }))
            .rejects.toThrow(TenantError);
        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
    });
});
