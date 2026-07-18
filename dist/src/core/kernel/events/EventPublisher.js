"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPublisher = exports.EventPublisher = void 0;
const EventBus_1 = require("./EventBus");
const Logger_1 = __importDefault(require("../../../shared/logger/Logger"));
class EventPublisher {
    bus;
    constructor({ bus } = {}) {
        this.bus = bus || EventBus_1.globalEventBus;
    }
    async publish(event) {
        if (!event || !event.name) {
            throw new Error("EventPublisher.publish requiere un evento con propiedad 'name'.");
        }
        Logger_1.default.info(`Evento publicado: ${event.name}`, { eventId: event.id });
        await this.bus.publish(event);
    }
}
exports.EventPublisher = EventPublisher;
exports.globalPublisher = new EventPublisher();
exports.default = exports.globalPublisher;
//# sourceMappingURL=EventPublisher.js.map