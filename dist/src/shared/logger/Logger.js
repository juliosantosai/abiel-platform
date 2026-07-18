"use strict";
// src/shared/logger/Logger.js
class Logger {
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
module.exports = new Logger();
module.exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map