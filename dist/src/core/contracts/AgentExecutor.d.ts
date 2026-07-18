import { ExecutionContext } from "./ExecutionContext";
import { ExecutionResult } from "./ExecutionResult";
export interface AgentExecutor<TInput = unknown, TOutput = unknown> {
    execute(context: ExecutionContext, input?: TInput): Promise<ExecutionResult<TOutput>>;
}
//# sourceMappingURL=AgentExecutor.d.ts.map