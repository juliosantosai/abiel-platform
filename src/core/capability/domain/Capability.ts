import { ValidationError } from "../../../shared/errors/ValidationError";

export type CapabilityLifecycle = "active" | "deprecated" | "inactive" | string;

export interface CapabilityExecutionContext {
  [key: string]: unknown;
}

export type CapabilityHandler<TInput = unknown, TOutput = unknown> = (
  input: TInput,
  executionContext: CapabilityExecutionContext,
) => Promise<TOutput> | TOutput;

export interface CapabilityProps<TInput = unknown, TOutput = unknown> {
  name: string;
  version?: string;
  requiredPermissions?: string[];
  lifecycle?: CapabilityLifecycle;
  handler: CapabilityHandler<TInput, TOutput>;
}

export class Capability<TInput = unknown, TOutput = unknown> {
  name: string;
  version: string;
  requiredPermissions: string[];
  lifecycle: CapabilityLifecycle;
  handler: CapabilityHandler<TInput, TOutput>;

  constructor({ name, version = "1.0.0", requiredPermissions = [], lifecycle = "active", handler }: CapabilityProps<TInput, TOutput>) {
    if (!name || typeof name !== "string") {
      throw new ValidationError("Capability name is required", { name: "required" });
    }

    if (typeof handler !== "function") {
      throw new ValidationError("Capability handler must be a function", { handler: "invalid" });
    }

    this.name = name;
    this.version = version;
    this.requiredPermissions = Array.isArray(requiredPermissions) ? requiredPermissions : [];
    this.lifecycle = lifecycle;
    this.handler = handler;
  }

  isExecutable(): boolean {
    return this.lifecycle === "active" || this.lifecycle === "deprecated";
  }

  async execute(input: TInput, executionContext: CapabilityExecutionContext): Promise<TOutput> {
    if (!this.isExecutable()) {
      const error = new Error(`Capability ${this.name} is not executable`) as Error & { code?: string };
      error.code = "CAPABILITY_UNAVAILABLE";
      throw error;
    }

    return this.handler(input, executionContext);
  }
}

export default Capability;