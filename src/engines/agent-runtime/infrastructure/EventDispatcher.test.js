const EventDispatcher = require("./EventDispatcher");

describe("EventDispatcher", () => {
    test("despacha eventos al event bus", async () => {
        const publish = jest.fn().mockResolvedValue(undefined);
        const dispatcher = new EventDispatcher({ publish });

        await dispatcher.dispatch("ResultEvent", { status: "success" });

        expect(publish).toHaveBeenCalledTimes(1);
        expect(publish.mock.calls[0][0].name).toBe("ResultEvent");
        expect(publish.mock.calls[0][0].payload).toEqual({ status: "success" });
    });

    test("falla si no recibe bus valido", () => {
        expect(() => new EventDispatcher({})).toThrow("EventDispatcher requires an eventBus");
    });
});