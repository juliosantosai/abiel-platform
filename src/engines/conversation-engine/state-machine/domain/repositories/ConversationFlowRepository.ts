import { ConversationFlow } from "../entities/ConversationFlow";

export abstract class ConversationFlowRepository {
  abstract guardar(flow: ConversationFlow): Promise<ConversationFlow>;
  abstract buscarPorId(id: string): Promise<ConversationFlow | null>;
  abstract buscarPorConversacion(conversationId: string, empresaId: string): Promise<ConversationFlow | null>;
  abstract actualizar(flow: ConversationFlow): Promise<ConversationFlow>;
}
