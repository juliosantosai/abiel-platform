const { EventPublisher } = require("./EventPublisher");
const { EventBus } = require("./EventBus");
const DomainEvent = require("./DomainEvent");

class TestEvent extends DomainEvent {
    static eventName = "TestEvent";
}

describe("EventPublisher", () => {
    let bus;
    let publisher;

    beforeEach(() => {
        bus = new EventBus();
        publisher = new EventPublisher({ bus });
    });

    test("publica un DomainEvent correctamente", async () => {
        let received = null;
        bus.subscribe("TestEvent", e => { received = e; });

        const event = new TestEvent();
        await publisher.publish(event);

        expect(received).toBe(event);
        expect(received.name).toBe("TestEvent");
        expect(received.id).toBeDefined();
    });

    test("lanza error si el evento no tiene nombre", async () => {
        await expect(publisher.publish({})).rejects.toThrow("name");
        await expect(publisher.publish(null)).rejects.toThrow();
    });

    test("dos publishers con buses distintos no interfieren", async () => {
        const bus2 = new EventBus();
        const pub2 = new EventPublisher({ bus: bus2 });

        let received1 = false;
        let received2 = false;

        bus.subscribe("TestEvent", () => { received1 = true; });
        bus2.subscribe("TestEvent", () => { received2 = true; });

        await publisher.publish(new TestEvent());

        expect(received1).toBe(true);
        expect(received2).toBe(false);
    });
});
