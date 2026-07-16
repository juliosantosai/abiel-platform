const TimeoutPolicy = require("./TimeoutPolicy");

describe("TimeoutPolicy", () => {
    test("retorna resultado si termina antes del timeout", async () => {
        const policy = new TimeoutPolicy({ timeoutMs: 50 });
        const result = await policy.execute(async () => "ok");
        expect(result).toBe("ok");
    });

    test("lanza timeout cuando excede limite", async () => {
        const policy = new TimeoutPolicy({ timeoutMs: 10 });
        await expect(policy.execute(async () => new Promise(resolve => {
            setTimeout(() => resolve("late"), 30);
        }))).rejects.toMatchObject({ code: "TIMEOUT" });
    });
});