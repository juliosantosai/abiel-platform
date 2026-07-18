"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    silent;
    constructor({ silent = false } = {}) {
        this.silent = silent || process.env.NODE_ENV === "test";
    }
    info(message, data = {}) {
        if (this.silent)
            return;
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    }
    error(message, error = {}) {
        if (this.silent)
            return;
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }
    warn(message, data = {}) {
        if (this.silent)
            return;
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
exports.default = exports.logger;
// CommonJS compatibility
try {
    // @ts-ignore
    module.exports = exports.logger;
    // @ts-ignore
    module.exports.Logger = Logger;
    // @ts-ignore
    module.exports.logger = exports.logger;
}
catch (e) { }
//# sourceMappingURL=Logger.js.map