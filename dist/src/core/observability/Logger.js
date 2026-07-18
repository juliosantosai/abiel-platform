"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
class ConsoleLogger {
    info(event, context = {}) {
        console.info(`[abiel-core] ${event}`, context);
    }
    error(event, error, context = {}) {
        console.error(`[abiel-core] ${event}`, { error, ...context });
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=Logger.js.map