import { EventDispatcher } from "./EventDispatcher";

const publish = async (_event: { name: string; payload: Record<string, unknown>; occurredAt: Date }) => {};
const dispatcher = new EventDispatcher({ publish });

void dispatcher.dispatch("ResultEvent", { status: "success" });
