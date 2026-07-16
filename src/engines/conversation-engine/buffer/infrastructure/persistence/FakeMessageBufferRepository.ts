import { MessageBuffer } from "../../domain/entities/MessageBuffer";
import { MessageBufferRepository } from "../../domain/repositories/MessageBufferRepository";

export class FakeMessageBufferRepository extends MessageBufferRepository {
  private storage: Map<string, MessageBuffer> = new Map();

  async guardar(buffer: MessageBuffer): Promise<MessageBuffer> {
    this.storage.set(buffer.id, buffer);
    return buffer;
  }

  async buscarPorId(id: string): Promise<MessageBuffer | null> {
    return this.storage.get(id) || null;
  }

  async buscarActivo(conversationId: string, empresaId: string): Promise<MessageBuffer | null> {
    for (const buf of this.storage.values()) {
      if (buf.conversationId === conversationId && buf.empresaId === empresaId && buf.estado === "COLLECTING") {
        return buf;
      }
    }
    return null;
  }

  async buscarExpirados(ahora: Date): Promise<MessageBuffer[]> {
    return Array.from(this.storage.values()).filter((b) => b.estaExpirado(ahora));
  }

  async actualizar(buffer: MessageBuffer): Promise<MessageBuffer> {
    if (!this.storage.has(buffer.id)) throw new Error(`Buffer ${buffer.id} no encontrado.`);
    this.storage.set(buffer.id, buffer);
    return buffer;
  }

  clear(): void {
    this.storage.clear();
  }
}
