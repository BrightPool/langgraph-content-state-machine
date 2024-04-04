"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentState = void 0;
exports.agentState = {
    messages: {
        value: (x, y) => x.concat(y),
        default: () => [],
    },
    finalContentBrief: {
        value: null,
    },
    numberOfIterations: {
        value: null,
    },
    topic: {
        value: null,
    },
    latestFeedback: {
        value: null, // Stores the latest feedback to refine the brief
    },
    latestBrief: {
        value: null, // Stores the latest version of the content brief
    },
};
