const ConversationFlow = require("../../domain/entities/ConversationFlow");
const ValidationError = require("../../../../../shared/errors/ValidationError");
const DomainError = require("../../../../../shared/errors/DomainError");
const FlujoIniciado = require("../../domain/events/FlujoIniciado");
const EtapaAvanzada = require("../../domain/events/EtapaAvanzada");
const FlujoFinalizado = require("../../domain/events/FlujoFinalizado");
const FakeConversationFlowRepository = require("../../infrastructure/persistence/FakeConversationFlowRepository");
const IniciarFlujoUseCase = require("../../application/use-cases/IniciarFlujoUseCase");
const AvanzarEtapaUseCase = require("../../application/use-cases/AvanzarEtapaUseCase");
const FinalizarFlujoUseCase = require("../../application/use-cases/FinalizarFlujoUseCase");
const NotFoundError = require("../../../../../shared/errors/NotFoundError");

const base = (extra = {}) => ({ id: "f-1", empresaId: "e-1", conversationId: "c-1", ...extra });

describe("ConversationFlow — dominio", () => {
    test("crea con etapa SALUDO por defecto", () => {
        const flow = new ConversationFlow(base());
        expect(flow.etapa).toBe("SALUDO");
        expect(flow.estaFinalizado()).toBe(false);
    });

    test("avanzarEtapa() cambia la etapa y guarda la anterior", () => {
        const flow = new ConversationFlow(base());
        flow.avanzarEtapa("CALIFICACION");
        expect(flow.etapa).toBe("CALIFICACION");
        expect(flow.etapaAnterior).toBe("SALUDO");
    });

    test("avanzarEtapa() desde FINALIZADO lanza DomainError", () => {
        const flow = new ConversationFlow(base({ etapa: "FINALIZADO" }));
        expect(() => flow.avanzarEtapa("SALUDO")).toThrow(DomainError);
    });

    test("finalizar() marca FINALIZADO", () => {
        const flow = new ConversationFlow(base());
        flow.finalizar();
        expect(flow.estaFinalizado()).toBe(true);
    });

    test("rechaza etapas inválidas", () => {
        expect(() => new ConversationFlow(base({ etapa: "INVALIDA" }))).toThrow(ValidationError);
    });
});

describe("State Machine — use cases", () => {
    let repo, publisher;
    beforeEach(() => {
        repo = new FakeConversationFlowRepository();
        publisher = { publish: jest.fn() };
    });

    test("IniciarFlujoUseCase crea flujo y publica FlujoIniciado", async () => {
        const flow = await new IniciarFlujoUseCase({ repository: repo, eventPublisher: publisher }).execute(base());
        expect(flow.etapa).toBe("SALUDO");
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(FlujoIniciado);
    });

    test("AvanzarEtapaUseCase avanza y publica EtapaAvanzada", async () => {
        await repo.guardar(new ConversationFlow(base()));
        const flow = await new AvanzarEtapaUseCase({ repository: repo, eventPublisher: publisher }).execute({ flowId: "f-1", nuevaEtapa: "CALIFICACION" });
        expect(flow.etapa).toBe("CALIFICACION");
        const evt = publisher.publish.mock.calls[0][0];
        expect(evt).toBeInstanceOf(EtapaAvanzada);
        expect(evt.data.etapaAnterior).toBe("SALUDO");
    });

    test("AvanzarEtapaUseCase lanza NotFoundError si no existe", async () => {
        await expect(new AvanzarEtapaUseCase({ repository: repo }).execute({ flowId: "no-existe", nuevaEtapa: "CIERRE" })).rejects.toThrow(NotFoundError);
    });

    test("FinalizarFlujoUseCase finaliza y publica FlujoFinalizado", async () => {
        await repo.guardar(new ConversationFlow(base()));
        const flow = await new FinalizarFlujoUseCase({ repository: repo, eventPublisher: publisher }).execute({ flowId: "f-1" });
        expect(flow.estaFinalizado()).toBe(true);
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(FlujoFinalizado);
    });
});
