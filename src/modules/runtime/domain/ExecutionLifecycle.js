class ExecutionLifecycle {
    constructor() {
        this.state = "created";
        this.history = [{ state: this.state, at: new Date() }];
    }

    transitionTo(nextState) {
        const allowed = {
            created: ["context_built", "failed", "cancelled"],
            context_built: ["policy_checked", "blocked", "failed", "cancelled"],
            policy_checked: ["pipeline_selected", "blocked", "failed", "cancelled"],
            pipeline_selected: ["running", "failed", "timeout", "cancelled"],
            running: ["completed", "failed", "timeout", "cancelled", "capability_executed"],
            capability_executed: ["completed", "failed", "cancelled"],
            blocked: [],
            completed: [],
            failed: [],
            timeout: [],
            cancelled: []
        };

        const nextAllowed = allowed[this.state] || [];
        if (!nextAllowed.includes(nextState)) {
            throw new Error(`Invalid transition from ${this.state} to ${nextState}`);
        }

        this.state = nextState;
        this.history.push({ state: nextState, at: new Date() });
    }

    isTerminal() {
        return ["blocked", "completed", "failed", "timeout", "cancelled"].includes(this.state);
    }
}

module.exports = ExecutionLifecycle;