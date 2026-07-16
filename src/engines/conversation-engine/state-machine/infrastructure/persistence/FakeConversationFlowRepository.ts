import { ConversationFlow } from "../../domain/entities/ConversationFlow";
import { ConversationFlowRepository } from "../../domain/repositories/ConversationFlowRepository";

export class FakeConversationFlowRepository extends ConversationFlowRepository {
  private storage: Map<string, ConversationFlow> = new Map();

  async guardar(flow: ConversationFlow): Promise<ConversationFlow> {
    this.storage.set(flow.id, flow);
    return flow;
  }

  async buscarPorId(id: string): Promise<ConversationFlow | null> {
    return this.storage.get(id) || null;
  }

  async buscarPorConversacion(conversationId: string, empresaId: string): Promise<ConversationFlow | null> {
    for (const f of this.storage.values()) {
      if (f.conversationId === conversationId && f.empresaId === empresaId) return f;
    }
    return null;
  }

  async actualizar(flow: ConversationFlow): Promise<ConversationFlow> {
    if (!this.storage.has(flow.id)) throw new Error(`Flow ${flow.id} no encontrado.`);
    this.storage.set(flow.id, flow);
    return flow;
  }
}
