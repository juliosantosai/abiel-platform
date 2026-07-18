export declare class EventBus {
    private handlers;
    constructor();
    subscribe(eventName: string, handler: (event: any) => Promise<void> | void): void;
    unsubscribe(eventName: string, handler: (event: any) => Promise<void> | void): void;
    publish(event: {
        name: string;
        [key: string]: unknown;
    }): Promise<void>;
    clear(): void;
}
export declare const globalEventBus: EventBus;
export default globalEventBus;
//# sourceMappingURL=EventBus.d.ts.map