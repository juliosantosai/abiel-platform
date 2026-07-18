export {};

const FakeEmpresaRepository = require("./FakeEmpresaRepository");
const Empresa = require("../../domain/entities/Empresa");

describe("FakeEmpresaRepository", () => {
    let repository;

    beforeEach(() => {
        repository = new FakeEmpresaRepository();
    });

    test("guardar() debe almacenar y devolver la empresa", async () => {
        const empresa = new Empresa({
            id: "empresa-10",
            nombre: "Empresa Diez"
        });

        const result = await repository.guardar(empresa);

        expect(result).toBe(empresa);
        expect(await repository.buscarPorId("empresa-10")).toBe(empresa);
    });

    test("buscarPorId() debe devolver null cuando no existe", async () => {
        const result = await repository.buscarPorId("empresa-no-existe");
        expect(result).toBeNull();
    });

    test("actualizar() debe reemplazar la empresa existente", async () => {
        const empresa = new Empresa({
            id: "empresa-11",
            nombre: "Empresa Once"
        });

        await repository.guardar(empresa);
        empresa.actualizarNombre("Empresa Once Actualizada");

        const updated = await repository.actualizar(empresa);

        expect(updated).toBe(empresa);
        expect((await repository.buscarPorId("empresa-11")).nombre).toBe("Empresa Once Actualizada");
    });

    test("actualizar() debe lanzar error cuando la empresa no existe", async () => {
        const empresa = new Empresa({
            id: "empresa-999",
            nombre: "Empresa No Existente"
        });

        await expect(repository.actualizar(empresa)).rejects.toThrow("Empresa con id empresa-999 no encontrada.");
    });
});
