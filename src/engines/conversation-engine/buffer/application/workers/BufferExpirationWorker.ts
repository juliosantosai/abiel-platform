import { MessageBufferRepository } from "../../domain/repositories/MessageBufferRepository";
import { CerrarBufferUseCase } from "../use-cases/CerrarBufferUseCase";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class BufferExpirationWorker {
  repository: MessageBufferRepository;
  useCase: CerrarBufferUseCase;

  constructor({ repository, eventPublisher }: { repository: MessageBufferRepository; eventPublisher?: EventPublisherLike }) {
    this.repository = repository;
    this.useCase = new CerrarBufferUseCase({ repository, eventPublisher });
  }

  async run(ahora: Date = new Date()): Promise<Array<{ id: string; estado?: string; error?: boolean }>> {
    const expirados = await this.repository.buscarExpirados(ahora);
    const resultados: Array<{ id: string; estado?: string; error?: boolean }> = [];

    for (const buffer of expirados) {
      try {
        const resultado = await this.useCase.execute({ bufferId: buffer.id });
        resultados.push({ id: buffer.id, estado: resultado.estado });
      } catch {
        resultados.push({ id: buffer.id, error: true });
      }
    }

    return resultados;
  }
}
