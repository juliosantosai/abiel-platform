import { EventBus } from "./EventBus";
export declare class EventPublisher {
    private bus;
    constructor({ bus }?: {
        bus?: EventBus;
    });
    publish(event: {
        name: string;
        id?: string;
        [key: string]: unknown;
    }): Promise<void>;
}
export declare const globalPublisher: EventPublisher;
export default globalPublisher;
//# sourceMappingURL=EventPublisher.d.ts.map