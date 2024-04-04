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
    numberOfBriefIterations: {
        value: null,
    },
    numberOfBlogIterations: {
        value: null,
    },
    latestBrief: {
        value: null,
    },
    latestBriefFeedback: {
        value: null,
    },
    topic: {
        value: null,
    },
    latestBlogPostFeedback: {
        value: null,
    },
    latestBlogPost: {
        value: null,
    },
};
