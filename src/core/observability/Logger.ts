export interface Logger {
  info(event: string, context?: Record<string, unknown>): void;
  error(event: string, error: unknown, context?: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  info(event: string, context: Record<string, unknown> = {}): void {
    console.info(`[abiel-core] ${event}`, context);
  }

  error(event: string, error: unknown, context: Record<string, unknown> = {}): void {
    console.error(`[abiel-core] ${event}`, { error, ...context });
  }
}
