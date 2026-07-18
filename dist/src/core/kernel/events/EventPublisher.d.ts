declare const EventBus: any;
declare const globalBus: any;
declare const Logger: any;
declare class EventPublisher {
    /**
     * @param {object} [opts]
     * @param {EventBus} [opts.bus] - bus a usar; si se omite usa el singleton global
     */
    constructor({ bus }?: {});
    publish(event: any): Promise<void>;
}
declare const globalPublisher: EventPublisher;
//# sourceMappingURL=EventPublisher.d.ts.map