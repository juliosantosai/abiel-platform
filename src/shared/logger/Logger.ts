export class Logger {
  private silent: boolean;

  constructor({ silent = false } = {}) {
    this.silent = silent || process.env.NODE_ENV === "test";
  }

  info(message: string, data: Record<string, unknown> = {}) {
    if (this.silent) return;
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  }

  error(message: string, error: Record<string, unknown> = {}) {
    if (this.silent) return;
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  warn(message: string, data: Record<string, unknown> = {}) {
    if (this.silent) return;
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  }
}

export const logger = new Logger();
export default logger;

// CommonJS compatibility
try {
  // @ts-ignore
  module.exports = logger;
  // @ts-ignore
  module.exports.Logger = Logger;
  // @ts-ignore
  module.exports.logger = logger;
} catch (e) {}
