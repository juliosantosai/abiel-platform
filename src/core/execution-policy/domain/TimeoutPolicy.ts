export class TimeoutPolicy {
  timeoutMs: number;

  constructor({ timeoutMs = 5000 }: { timeoutMs?: number } = {}) {
    this.timeoutMs = timeoutMs;
  }

  async execute<T>(fn: () => Promise<T> | T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        const timeoutError = new Error(`Execution timed out after ${this.timeoutMs}ms`) as Error & { code?: string };
        timeoutError.code = "TIMEOUT";
        reject(timeoutError);
      }, this.timeoutMs);

      Promise.resolve()
        .then(() => fn())
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
}
