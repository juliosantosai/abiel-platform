"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventDispatcher_1 = require("./EventDispatcher");
const publish = async (_event) => { };
const dispatcher = new EventDispatcher_1.EventDispatcher({ publish });
void dispatcher.dispatch("ResultEvent", { status: "success" });
//# sourceMappingURL=EventDispatcher.types.js.map