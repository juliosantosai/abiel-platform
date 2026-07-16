const GenerarRespuestaUseCase = require("./GenerarRespuestaUseCase");
const FakeLLMProvider = require("../../infrastructure/adapters/FakeLLMProvider");
const AIRequest = require("../../domain/entities/AIRequest");
const RespuestaGenerada = require("../../domain/events/RespuestaGenerada");
const GeneracionFallida = require("../../domain/events/GeneracionFallida");

const base = () => ({
    id: "req-1", empresaId: "e-1", conversationId: "c-1",
    mensajes: [{ id: "m-1", texto: "Quiero información" }],
    etapa: "CALIFICACION",
    contexto: {}
});

describe("GenerarRespuestaUseCase", () => {
    test("genera respuesta exitosa y publica RespuestaGenerada", async () => {
        const llm = new FakeLLMProvider({ response: "Aquí tienes la info." });
        const publisher = { publish: jest.fn() };
        const useCase = new GenerarRespuestaUseCase({ llmProvider: llm, eventPublisher: publisher });

        const result = await useCase.execute(base());

        expect(result).toBeInstanceOf(AIRequest);
        expect(result.estado).toBe("COMPLETED");
        expect(result.respuesta).toBe("Aquí tienes la info.");
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(RespuestaGenerada);
    });

    test("maneja errores del LLM y publica GeneracionFallida", async () => {
        const llm = { generate: jest.fn().mockRejectedValue(new Error("timeout")) };
        const publisher = { publish: jest.fn() };
        const useCase = new GenerarRespuestaUseCase({ llmProvider: llm, eventPublisher: publisher });

        const result = await useCase.execute(base());

        expect(result.estado).toBe("FAILED");
        expect(publisher.publish.mock.calls[0][0]).toBeInstanceOf(GeneracionFallida);
    });

    test("el prompt incluye la etapa y el historial", async () => {
        const llm = new FakeLLMProvider();
        const useCase = new GenerarRespuestaUseCase({ llmProvider: llm });

        await useCase.execute({ ...base(), systemPrompt: "Eres un asistente." });

        const prompt = llm.calls[0].prompt;
        expect(prompt).toContain("CALIFICACION");
        expect(prompt).toContain("Quiero información");
        expect(prompt).toContain("Eres un asistente.");
    });
});
