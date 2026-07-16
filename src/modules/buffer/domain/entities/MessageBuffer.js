module.exports = require("../../../../engines/conversation-engine/buffer/domain/entities/MessageBuffer");const BufferState = require("../valueObjects/BufferState");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");

class MessageBuffer {
    constructor({
        id,
        empresaId,
        conversationId,
        mensajes = [],
        estado = "COLLECTING",
        ventanaMs = 3000,
        maxMensajes = 10,
        creadoEn = new Date(),
        expiraEn = null,
        actualizadoEn = new Date()
    }) {
        if (!id) throw new ValidationError("El id es obligatorio.", { id: "required" });
        if (!empresaId) throw new ValidationError("El empresaId es obligatorio.", { empresaId: "required" });
        if (!conversationId) throw new ValidationError("El conversationId es obligatorio.", { conversationId: "required" });

        this.id = id;
        this.empresaId = empresaId;
        this.conversationId = conversationId;
        this.mensajes = Array.isArray(mensajes) ? [...mensajes] : [];
        this.estado = new BufferState(estado).value;
        this.ventanaMs = ventanaMs;
        this.maxMensajes = maxMensajes;
        this.creadoEn = creadoEn;
        this.expiraEn = expiraEn || new Date(creadoEn.getTime() + ventanaMs);
        this.actualizadoEn = actualizadoEn;
    }

    agregarMensaje({ id, texto, tipo = "TEXT", timestamp = new Date() }) {
        if (this.estado !== "COLLECTING") {
            throw new DomainError("No se puede agregar mensajes a un buffer que no está en estado COLLECTING.");
        }
        if (!texto && tipo === "TEXT") {
            throw new ValidationError("El texto del mensaje es obligatorio.", { texto: "required" });
        }

        this.mensajes.push({ id, texto, tipo, timestamp });
        // Resetear ventana de expiración
        this.expiraEn = new Date(Date.now() + this.ventanaMs);
        this.actualizadoEn = new Date();

        if (this.mensajes.length >= this.maxMensajes) {
            this._marcarListo();
        }
    }

    cerrar() {
        if (this.estado !== "COLLECTING") {
            throw new DomainError("Solo se puede cerrar un buffer en estado COLLECTING.");
        }
        this._marcarListo();
    }

    marcarProcesado() {
        if (this.estado !== "READY") {
            throw new DomainError("Solo se puede procesar un buffer en estado READY.");
        }
        this.estado = "FLUSHED";
        this.actualizadoEn = new Date();
    }

    estaExpirado(ahora = new Date()) {
        return this.estado === "COLLECTING" && ahora >= this.expiraEn;
    }

    _marcarListo() {
        this.estado = "READY";
        this.actualizadoEn = new Date();
    }

    textoConsolidado() {
        return this.mensajes
            .filter(m => m.tipo === "TEXT" && m.texto)
            .map(m => m.texto.trim())
            .join("\n");
    }
}

module.exports = MessageBuffer;
