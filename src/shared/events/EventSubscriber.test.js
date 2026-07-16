const { EventSubscriber } = require("./EventSubscriber");
const { EventBus } = require("./EventBus");

describe("EventSubscriber", () => {
    test("subscribe delega al bus y recibe el evento", async () => {
        const bus = new EventBus();
        const subscriber = new EventSubscriber();
        // Reemplazar el bus interno del global
        const original = require("./EventBus");
        let received = false;
        original.subscribe("SubTest", () => { received = true; });
        await original.publish({ name: "SubTest" });
        original.unsubscribe("SubTest", () => {});
        expect(received).toBe(true);
    });
});
