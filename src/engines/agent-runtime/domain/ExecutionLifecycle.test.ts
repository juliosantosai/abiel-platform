export {};

const ExecutionLifecycle = require("./ExecutionLifecycle");

describe("ExecutionLifecycle", () => {
    test("permite transiciones validas hasta completed", () => {
        const lifecycle = new ExecutionLifecycle();
        lifecycle.transitionTo("context_built");
        lifecycle.transitionTo("policy_checked");
        lifecycle.transitionTo("pipeline_selected");
        lifecycle.transitionTo("running");
        lifecycle.transitionTo("capability_executed");
        lifecycle.transitionTo("completed");

        expect(lifecycle.state).toBe("completed");
        expect(lifecycle.isTerminal()).toBe(true);
        expect(lifecycle.history).toHaveLength(7);
    });

    test("permite transicion running a cancelled", () => {
        const lifecycle = new ExecutionLifecycle();
        lifecycle.transitionTo("context_built");
        lifecycle.transitionTo("policy_checked");
        lifecycle.transitionTo("pipeline_selected");
        lifecycle.transitionTo("running");
        lifecycle.transitionTo("cancelled");

        expect(lifecycle.state).toBe("cancelled");
        expect(lifecycle.isTerminal()).toBe(true);
    });

    test("evita cancelar ejecuciones terminales", () => {
        const lifecycle = new ExecutionLifecycle();
        lifecycle.transitionTo("context_built");
        lifecycle.transitionTo("policy_checked");
        lifecycle.transitionTo("pipeline_selected");
        lifecycle.transitionTo("running");
        lifecycle.transitionTo("completed");

        expect(() => lifecycle.transitionTo("cancelled")).toThrow("Invalid transition");
    });

    test("rechaza transicion invalida", () => {
        const lifecycle = new ExecutionLifecycle();
        expect(() => lifecycle.transitionTo("completed")).toThrow("Invalid transition");
    });
});