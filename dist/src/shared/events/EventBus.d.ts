declare class EventBus {
    constructor();
    subscribe(eventName: any, handler: any): void;
    unsubscribe(eventName: any, handler: any): void;
    publish(event: any): Promise<void>;
    clear(): void;
}
declare const globalBus: EventBus;
//# sourceMappingURL=EventBus.d.ts.map