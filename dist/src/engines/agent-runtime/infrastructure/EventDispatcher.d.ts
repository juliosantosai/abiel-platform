export declare class EventDispatcher {
    private eventBus;
    constructor(eventBus: {
        publish: (event: {
            name: string;
            payload?: unknown;
            occurredAt: Date;
        }) => Promise<void> | void;
    });
    dispatch(name: string, payload?: Record<string, unknown>): Promise<void>;
}
export default EventDispatcher;
//# sourceMappingURL=EventDispatcher.d.ts.map