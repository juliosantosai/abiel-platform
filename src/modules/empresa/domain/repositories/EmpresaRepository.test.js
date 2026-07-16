const EmpresaRepository = require("./EmpresaRepository");

describe("EmpresaRepository", () => {

    let repository;

    beforeEach(() => {
        repository = new EmpresaRepository();
    });

    test("guardar() debe lanzar error", async () => {

        await expect(
            repository.guardar({})
        ).rejects.toThrow("Método guardar() no implementado.");

    });

    test("buscarPorId() debe lanzar error", async () => {

        await expect(
            repository.buscarPorId("1")
        ).rejects.toThrow("Método buscarPorId() no implementado.");

    });

    test("buscarPorWhatsappInstanceId() debe lanzar error", async () => {

        await expect(
            repository.buscarPorWhatsappInstanceId("instance-001")
        ).rejects.toThrow("Método buscarPorWhatsappInstanceId() no implementado.");

    });

    test("obtenerTodas() debe lanzar error", async () => {

        await expect(
            repository.obtenerTodas()
        ).rejects.toThrow("Método obtenerTodas() no implementado.");

    });

    test("actualizar() debe lanzar error", async () => {

        await expect(
            repository.actualizar({})
        ).rejects.toThrow("Método actualizar() no implementado.");

    });

    test("eliminar() debe lanzar error", async () => {

        await expect(
            repository.eliminar("1")
        ).rejects.toThrow("Método eliminar() no implementado.");

    });

});