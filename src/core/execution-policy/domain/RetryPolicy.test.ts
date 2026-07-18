export {};

const RetryPolicy = require("./RetryPolicy");

describe("RetryPolicy", () => {
    test("reintenta cuando el error es retryable", async () => {
        const policy = new RetryPolicy({ maxAttempts: 3 });
        let attempts = 0;

        const result = await policy.execute(async () => {
            attempts += 1;
            if (attempts < 3) {
                const error = new Error("temporary");
                error.retryable = true;
                throw error;
            }
            return "ok";
        }, () => "retryable_error");

        expect(result).toBe("ok");
        expect(attempts).toBe(3);
    });

    test("no reintenta cuando el error no es retryable", async () => {
        const policy = new RetryPolicy({ maxAttempts: 3 });

        await expect(policy.execute(async () => {
            throw new Error("fatal");
        }, () => "non_retryable_error")).rejects.toThrow("fatal");
    });
});