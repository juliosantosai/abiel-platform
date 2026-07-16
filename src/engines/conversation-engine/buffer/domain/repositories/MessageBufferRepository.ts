import { MessageBuffer } from "../entities/MessageBuffer";

export abstract class MessageBufferRepository {
  abstract guardar(buffer: MessageBuffer): Promise<MessageBuffer>;
  abstract buscarPorId(id: string): Promise<MessageBuffer | null>;
  abstract buscarActivo(conversationId: string, empresaId: string): Promise<MessageBuffer | null>;
  abstract buscarExpirados(ahora: Date): Promise<MessageBuffer[]>;
  abstract actualizar(buffer: MessageBuffer): Promise<MessageBuffer>;
}
