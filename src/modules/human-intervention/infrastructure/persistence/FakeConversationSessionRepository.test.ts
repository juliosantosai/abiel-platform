export {};

const FakeConversationSessionRepository = require("./FakeConversationSessionRepository");
const ConversationSession = require("../../domain/entities/ConversationSession");

const makeSession = (extra = {}) => new ConversationSession({
    id: "c-1", empresaId: "e-1", clienteId: "cl-1", ...extra
});

describe("FakeConversationSessionRepository", () => {
    let repo;

    beforeEach(() => {
        repo = new FakeConversationSessionRepository();
    });

    test("guardar() y buscarPorId() devuelven la misma entidad", async () => {
        const session = makeSession();
        await repo.guardar(session);

        const found = await repo.buscarPorId("c-1");
        expect(found).toBe(session);
    });

    test("buscarPorId() devuelve null si no existe", async () => {
        const result = await repo.buscarPorId("no-existe");
        expect(result).toBeNull();
    });

    test("actualizar() persiste los cambios de estado", async () => {
        const session = makeSession();
        await repo.guardar(session);
        session.detectarIntervencionHumana();
        await repo.actualizar(session);

        const found = await repo.buscarPorId("c-1");
        expect(found.estado).toBe("HUMAN_ACTIVE");
    });

    test("actualizar() lanza error si no existe", async () => {
        const session = makeSession();
        await expect(repo.actualizar(session)).rejects.toThrow();
    });

    test("eliminar() elimina y devuelve la sesión", async () => {
        const session = makeSession();
        await repo.guardar(session);

        const deleted = await repo.eliminar("c-1");
        expect(deleted).toBe(session);
        expect(await repo.buscarPorId("c-1")).toBeNull();
    });

    test("buscarPorEmpresaId() devuelve solo las sesiones del tenant", async () => {
        await repo.guardar(makeSession({ id: "c-1", empresaId: "e-1" }));
        await repo.guardar(new ConversationSession({ id: "c-2", empresaId: "e-2", clienteId: "cl-2" }));
        await repo.guardar(new ConversationSession({ id: "c-3", empresaId: "e-1", clienteId: "cl-3" }));

        const results = await repo.buscarPorEmpresaId("e-1");
        expect(results).toHaveLength(2);
        expect(results.every(s => s.empresaId === "e-1")).toBe(true);
    });

    test("buscarPorClienteYEmpresa() devuelve la sesión correcta", async () => {
        await repo.guardar(makeSession());
        await repo.guardar(new ConversationSession({ id: "c-2", empresaId: "e-1", clienteId: "cl-2" }));

        const found = await repo.buscarPorClienteYEmpresa("cl-1", "e-1");
        expect(found.id).toBe("c-1");
    });

    test("buscarPorClienteYEmpresa() devuelve null si no existe", async () => {
        const result = await repo.buscarPorClienteYEmpresa("no-existe", "e-1");
        expect(result).toBeNull();
    });
});
