const MessageBuffer = require("./MessageBuffer");
const ValidationError = require("../../../../../shared/errors/ValidationError");
const DomainError = require("../../../../../shared/errors/DomainError");

const base = (extra = {}) => ({
    id: "buf-1", empresaId: "e-1", conversationId: "c-1", ...extra
});

describe("MessageBuffer — construcción", () => {
    test("crea con estado COLLECTING por defecto", () => {
        const buf = new MessageBuffer(base());
        expect(buf.estado).toBe("COLLECTING");
        expect(buf.mensajes).toHaveLength(0);
        expect(buf.expiraEn).toBeInstanceOf(Date);
    });

    test("requiere id, empresaId y conversationId", () => {
        expect(() => new MessageBuffer({ ...base(), id: undefined })).toThrow(ValidationError);
        expect(() => new MessageBuffer({ ...base(), empresaId: undefined })).toThrow(ValidationError);
        expect(() => new MessageBuffer({ ...base(), conversationId: undefined })).toThrow(ValidationError);
    });

    test("rechaza estados inválidos", () => {
        expect(() => new MessageBuffer(base({ estado: "INVALIDO" }))).toThrow(ValidationError);
    });
});

describe("MessageBuffer — agregarMensaje", () => {
    test("agrega mensajes y resetea la ventana", () => {
        const buf = new MessageBuffer(base());
        const antes = buf.expiraEn.getTime();
        buf.agregarMensaje({ id: "m-1", texto: "Hola", tipo: "TEXT" });
        expect(buf.mensajes).toHaveLength(1);
        expect(buf.expiraEn.getTime()).toBeGreaterThanOrEqual(antes);
    });

    test("cierra automáticamente al llegar a maxMensajes", () => {
        const buf = new MessageBuffer(base({ maxMensajes: 2 }));
        buf.agregarMensaje({ id: "m-1", texto: "A" });
        buf.agregarMensaje({ id: "m-2", texto: "B" });
        expect(buf.estado).toBe("READY");
    });

    test("no acepta mensajes si no está en COLLECTING", () => {
        const buf = new MessageBuffer(base({ estado: "READY" }));
        expect(() => buf.agregarMensaje({ id: "m-1", texto: "X" })).toThrow(DomainError);
    });
});

describe("MessageBuffer — cerrar y procesar", () => {
    test("cerrar() COLLECTING → READY", () => {
        const buf = new MessageBuffer(base());
        buf.cerrar();
        expect(buf.estado).toBe("READY");
    });

    test("cerrar() desde READY lanza DomainError", () => {
        const buf = new MessageBuffer(base({ estado: "READY" }));
        expect(() => buf.cerrar()).toThrow(DomainError);
    });

    test("marcarProcesado() READY → FLUSHED", () => {
        const buf = new MessageBuffer(base({ estado: "READY" }));
        buf.marcarProcesado();
        expect(buf.estado).toBe("FLUSHED");
    });

    test("marcarProcesado() desde COLLECTING lanza DomainError", () => {
        const buf = new MessageBuffer(base());
        expect(() => buf.marcarProcesado()).toThrow(DomainError);
    });
});

describe("MessageBuffer — helpers", () => {
    test("estaExpirado() retorna true si la ventana pasó", () => {
        const buf = new MessageBuffer(base({ ventanaMs: 100 }));
        const futuro = new Date(Date.now() + 5000);
        expect(buf.estaExpirado(futuro)).toBe(true);
    });

    test("textoConsolidado() une los textos en orden", () => {
        const buf = new MessageBuffer(base());
        buf.agregarMensaje({ id: "m-1", texto: "Hola" });
        buf.agregarMensaje({ id: "m-2", texto: "quiero info" });
        expect(buf.textoConsolidado()).toBe("Hola\nquiero info");
    });
});
