import { DomainError } from "../../../../../shared/errors/DomainError";
import { ValidationError } from "../../../../../shared/errors/ValidationError";
import { BufferState, BufferStateValue } from "../valueObjects/BufferState";

export interface BufferedMessage {
  id?: string;
  texto?: string;
  tipo?: string;
  timestamp?: Date;
}

export interface MessageBufferProps {
  id: string;
  empresaId: string;
  conversationId: string;
  mensajes?: BufferedMessage[];
  estado?: BufferStateValue;
  ventanaMs?: number;
  maxMensajes?: number;
  creadoEn?: Date;
  expiraEn?: Date | null;
  actualizadoEn?: Date;
}

export class MessageBuffer {
  id: string;
  empresaId: string;
  conversationId: string;
  mensajes: BufferedMessage[];
  estado: BufferStateValue;
  ventanaMs: number;
  maxMensajes: number;
  creadoEn: Date;
  expiraEn: Date;
  actualizadoEn: Date;

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
    actualizadoEn = new Date(),
  }: MessageBufferProps) {
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

  agregarMensaje({ id, texto, tipo = "TEXT", timestamp = new Date() }: BufferedMessage): void {
    if (this.estado !== "COLLECTING") {
      throw new DomainError("No se puede agregar mensajes a un buffer que no esta en estado COLLECTING.");
    }
    if (!texto && tipo === "TEXT") {
      throw new ValidationError("El texto del mensaje es obligatorio.", { texto: "required" });
    }

    this.mensajes.push({ id, texto, tipo, timestamp });
    this.expiraEn = new Date(Date.now() + this.ventanaMs);
    this.actualizadoEn = new Date();

    if (this.mensajes.length >= this.maxMensajes) {
      this.marcarListo();
    }
  }

  cerrar(): void {
    if (this.estado !== "COLLECTING") {
      throw new DomainError("Solo se puede cerrar un buffer en estado COLLECTING.");
    }
    this.marcarListo();
  }

  marcarProcesado(): void {
    if (this.estado !== "READY") {
      throw new DomainError("Solo se puede procesar un buffer en estado READY.");
    }
    this.estado = "FLUSHED";
    this.actualizadoEn = new Date();
  }

  estaExpirado(ahora: Date = new Date()): boolean {
    return this.estado === "COLLECTING" && ahora >= this.expiraEn;
  }

  marcarListo(): void {
    this.estado = "READY";
    this.actualizadoEn = new Date();
  }

  textoConsolidado(): string {
    return this.mensajes
      .filter((m) => m.tipo === "TEXT" && m.texto)
      .map((m) => (m.texto || "").trim())
      .join("\n");
  }
}
