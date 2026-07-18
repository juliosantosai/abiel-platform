import { ExecutionContext } from "./ExecutionContext";
export interface AICompletionRequest {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    metadata?: Record<string, unknown>;
}
export interface AICompletionChunk {
    text: string;
    done?: boolean;
    metadata?: Record<string, unknown>;
}
export interface AICompletionResponse {
    text: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    metadata?: Record<string, unknown>;
}
export interface AIProvider {
    complete(request: AICompletionRequest, context?: ExecutionContext): Promise<AICompletionResponse>;
    stream(request: AICompletionRequest, context?: ExecutionContext): AsyncIterable<AICompletionChunk>;
}
//# sourceMappingURL=AIProvider.d.ts.map