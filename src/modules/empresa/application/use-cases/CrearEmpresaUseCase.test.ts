export {};

jest.mock("../../domain/events/EmpresaCreada", () => {
    return class EmpresaCreada {
        constructor(data) {
            this.data = data;
        }
        static eventName = "EmpresaCreada";
    };
});

const CrearEmpresaUseCase = require("./CrearEmpresaUseCase");
const EmpresaCreada = require("../../domain/events/EmpresaCreada");
const Empresa = require("../../domain/entities/Empresa");

describe("CrearEmpresaUseCase", () => {
    test("debe guardar la empresa y publicar el evento EmpresaCreada", async () => {
        const fakeRepository = {
            guardar: jest.fn(async (empresa) => empresa)
        };

        const fakePublisher = {
            publish: jest.fn()
        };

        const useCase = new CrearEmpresaUseCase({
            empresaRepository: fakeRepository,
            eventPublisher: fakePublisher
        });

        const empresa = await useCase.execute({
            id: "empresa-1",
            nombre: "Empresa Uno"
        });

        expect(fakeRepository.guardar).toHaveBeenCalledTimes(1);
        expect(fakeRepository.guardar).toHaveBeenCalledWith(expect.any(Empresa));
        expect(empresa).toBeInstanceOf(Empresa);
        expect(empresa.id).toBe("empresa-1");
        expect(empresa.nombre).toBe("Empresa Uno");
        expect(empresa.estado).toBe("PENDIENTE");

        expect(fakePublisher.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = fakePublisher.publish.mock.calls[0][0];
        expect(publishedEvent).toBeInstanceOf(EmpresaCreada);
        expect(publishedEvent.data).toEqual({
            empresaId: "empresa-1",
            nombre: "Empresa Uno",
            estado: "PENDIENTE"
        });
    });
});
