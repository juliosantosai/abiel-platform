const globalBus = require("./EventBus");
const { EventBus } = require("./EventBus");

describe("EventBus — singleton global", () => {
    beforeEach(() => globalBus.clear());

    test("subscribe y publish sincrono", async () => {
        let received = false;
        globalBus.subscribe("TestEvent", () => { received = true; });
        await globalBus.publish({ name: "TestEvent" });
        expect(received).toBe(true);
    });

    test("no dispara handlers de otros eventos", async () => {
        let received = false;
        globalBus.subscribe("OtroEvento", () => { received = true; });
        await globalBus.publish({ name: "TestEvent" });
        expect(received).toBe(false);
    });

    test("unsubscribe elimina el handler", async () => {
        let count = 0;
        const handler = () => { count++; };
        globalBus.subscribe("TestEvent", handler);
        globalBus.unsubscribe("TestEvent", handler);
        await globalBus.publish({ name: "TestEvent" });
        expect(count).toBe(0);
    });
});

describe("EventBus — instancia independiente", () => {
    test("dos instancias no comparten handlers", async () => {
        const bus1 = new EventBus();
        const bus2 = new EventBus();
        let received = false;
        bus1.subscribe("TestEvent", () => { received = true; });
        await bus2.publish({ name: "TestEvent" });
        expect(received).toBe(false);
    });
});
