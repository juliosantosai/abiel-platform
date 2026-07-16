const ErrorClassifier = require("./ErrorClassifier");

describe("ErrorClassifier", () => {
    test("clasifica timeout", () => {
        const classifier = new ErrorClassifier();
        const error = new Error("timeout");
        error.code = "TIMEOUT";
        expect(classifier.classify(error)).toBe("timeout_error");
    });

    test("clasifica permission error", () => {
        const classifier = new ErrorClassifier();
        const error = new Error("denied");
        error.code = "PERMISSION_DENIED";
        expect(classifier.classify(error)).toBe("permission_error");
    });

    test("clasifica cancellation error", () => {
        const classifier = new ErrorClassifier();
        const error = new Error("cancelled");
        error.code = "CANCELLED";
        expect(classifier.classify(error)).toBe("cancellation_error");
    });

    test("clasifica validation error", () => {
        const classifier = new ErrorClassifier();
        const error = new Error("invalid input");
        error.code = "VALIDATION_ERROR";
        expect(classifier.classify(error)).toBe("validation_error");
    });

    test("clasifica capability error", () => {
        const classifier = new ErrorClassifier();
        const error = new Error("missing capability");
        error.code = "CAPABILITY_UNAVAILABLE";
        expect(classifier.classify(error)).toBe("capability_error");
    });
});