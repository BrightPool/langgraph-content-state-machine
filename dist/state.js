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
        value: null,
    },
    latestBrief: {
        value: null,
    },
    latestBlogPost: {
        value: null,
    },
};
