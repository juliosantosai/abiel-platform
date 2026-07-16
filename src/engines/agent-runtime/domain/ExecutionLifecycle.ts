export type ExecutionState =
  | "created"
  | "context_built"
  | "policy_checked"
  | "pipeline_selected"
  | "running"
  | "capability_executed"
  | "blocked"
  | "completed"
  | "failed"
  | "timeout"
  | "cancelled";

export class ExecutionLifecycle {
  state: ExecutionState;
  history: Array<{ state: ExecutionState; at: Date }>;

  constructor() {
    this.state = "created";
    this.history = [{ state: this.state, at: new Date() }];
  }

  transitionTo(nextState: ExecutionState): void {
    const allowed: Record<ExecutionState, ExecutionState[]> = {
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
      cancelled: [],
    };

    const nextAllowed = allowed[this.state] || [];
    if (!nextAllowed.includes(nextState)) {
      throw new Error(`Invalid transition from ${this.state} to ${nextState}`);
    }

    this.state = nextState;
    this.history.push({ state: nextState, at: new Date() });
  }

  isTerminal(): boolean {
    return ["blocked", "completed", "failed", "timeout", "cancelled"].includes(this.state);
  }
}
