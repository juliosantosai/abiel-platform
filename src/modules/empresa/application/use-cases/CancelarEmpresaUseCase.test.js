jest.mock("../../domain/events/EmpresaCancelada", () => {
    return class EmpresaCancelada {
        constructor(data) {
            this.data = data;
        }
        static eventName = "EmpresaCancelada";
    };
});

const CancelarEmpresaUseCase = require("./CancelarEmpresaUseCase");
const EmpresaCancelada = require("../../domain/events/EmpresaCancelada");
const Empresa = require("../../domain/entities/Empresa");
const NotFoundError = require("../../../../shared/errors/NotFoundError");

describe("CancelarEmpresaUseCase", () => {
    test("debe cancelar la empresa y publicar el evento EmpresaCancelada", async () => {
        const empresaExistente = new Empresa({
            id: "empresa-5",
            nombre: "Empresa Cinco"
        });

        const fakeRepository = {
            buscarPorId: jest.fn(async () => empresaExistente),
            actualizar: jest.fn(async (empresa) => empresa)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new CancelarEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const empresa = await useCase.execute({ id: "empresa-5" });

        expect(fakeRepository.buscarPorId).toHaveBeenCalledWith("empresa-5");
        expect(fakeRepository.actualizar).toHaveBeenCalledWith(empresaExistente);
        expect(empresa.estado).toBe("CANCELADA");

        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(EmpresaCancelada);
        expect(publishedEvent.data).toEqual({
            empresaId: "empresa-5",
            estado: "CANCELADA"
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

        const useCase = new CancelarEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        await expect(useCase.execute({ id: "empresa-no-existe" }))
            .rejects
            .toThrow(NotFoundError);

        expect(fakeRepository.actualizar).not.toHaveBeenCalled();
        expect(fakePublisher.publish).not.toHaveBeenCalled();
    });
});
