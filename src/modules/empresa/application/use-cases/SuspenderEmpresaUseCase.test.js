const SuspenderEmpresaUseCase = require("./SuspenderEmpresaUseCase");
const EmpresaSuspendida = require("../../domain/events/EmpresaSuspendida");
const Empresa = require("../../domain/entities/Empresa");
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const TenantError = require("../../../../shared/tenant/TenantError");

describe("SuspenderEmpresaUseCase", () => {
    test("debe suspender la empresa y publicar el evento EmpresaSuspendida", async () => {
        const empresaExistente = new Empresa({
            id: "empresa-4",
            nombre: "Empresa Cuatro"
        });
        empresaExistente.activar();

        const fakeRepository = {
            buscarPorId: jest.fn(async () => empresaExistente),
            actualizar: jest.fn(async (empresa) => empresa)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new SuspenderEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const empresa = await useCase.execute({ id: "empresa-4" });

        expect(fakeRepository.buscarPorId).toHaveBeenCalledWith("empresa-4");
        expect(fakeRepository.actualizar).toHaveBeenCalledWith(empresaExistente);
        expect(empresa.estado).toBe("SUSPENDIDA");

        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(EmpresaSuspendida);
        expect(publishedEvent.data).toEqual({
            empresaId: "empresa-4",
            estado: "SUSPENDIDA"
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

        const useCase = new SuspenderEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        await expect(useCase.execute({ id: "empresa-no-existe" }))
            .rejects
            .toThrow(NotFoundError);

        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
        expect(fakePublisher.publish).not.toHaveBeenCalled();
    });

    test("debe rechazar si el tenant no coincide con la empresa", async () => {
        const empresa = new Empresa({ id: "empresa-A", nombre: "Empresa A" });
        empresa.activar();
        const fakeRepository = {
            buscarPorId: jest.fn(async () => empresa),
            actualizar: jest.fn()
        };
        const tenantGuard = new TenantGuard({ tenantContext: "empresa-B" });
        const useCase = new SuspenderEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: { publish: jest.fn() },
            tenantGuard
        });

        await expect(useCase.execute({ id: "empresa-A", tenantContext: "empresa-B" }))
            .rejects.toThrow(TenantError);
        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
    });
});
