import { DomainError } from "../../../../../shared/errors/DomainError";
import { ValidationError } from "../../../../../shared/errors/ValidationError";
import { FlowStage } from "../valueObjects/FlowStage";

export interface ConversationFlowProps {
  id: string;
  empresaId: string;
  conversationId: string;
  etapa?: string;
  etapaAnterior?: string | null;
  contexto?: Record<string, unknown>;
  etapasValidas?: readonly string[];
  creadoEn?: Date;
  actualizadoEn?: Date;
}

export class ConversationFlow {
  id: string;
  empresaId: string;
  conversationId: string;
  etapasValidas: readonly string[];
  etapa: string;
  etapaAnterior: string | null;
  contexto: Record<string, unknown>;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor({
    id,
    empresaId,
    conversationId,
    etapa = "SALUDO",
    etapaAnterior = null,
    contexto = {},
    etapasValidas = FlowStage.DEFAULT_STAGES,
    creadoEn = new Date(),
    actualizadoEn = new Date(),
  }: ConversationFlowProps) {
    if (!id) throw new ValidationError("El id es obligatorio.", { id: "required" });
    if (!empresaId) throw new ValidationError("El empresaId es obligatorio.", { empresaId: "required" });
    if (!conversationId) throw new ValidationError("El conversationId es obligatorio.", { conversationId: "required" });

    this.id = id;
    this.empresaId = empresaId;
    this.conversationId = conversationId;
    this.etapasValidas = etapasValidas;
    this.etapa = new FlowStage(etapa, etapasValidas).value;
    this.etapaAnterior = etapaAnterior;
    this.contexto = { ...contexto };
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
  }

  avanzarEtapa(nuevaEtapa: string): void {
    if (this.etapa === "FINALIZADO") {
      throw new DomainError("Un flujo finalizado no puede avanzar de etapa.");
    }
    const validada = new FlowStage(nuevaEtapa, this.etapasValidas).value;
    this.etapaAnterior = this.etapa;
    this.etapa = validada;
    this.actualizadoEn = new Date();
  }

  finalizar(): void {
    if (this.etapa === "FINALIZADO") return;
    this.etapaAnterior = this.etapa;
    this.etapa = "FINALIZADO";
    this.actualizadoEn = new Date();
  }

  actualizarContexto(datos: Record<string, unknown>): void {
    this.contexto = { ...this.contexto, ...datos };
    this.actualizadoEn = new Date();
  }

  estaFinalizado(): boolean {
    return this.etapa === "FINALIZADO";
  }
}
