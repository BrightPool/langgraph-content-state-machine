"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parserEventsStream = void 0;
const types_1 = require("../types");
const resetStateForNewRun = (event, resetBriefs, resetBlogPosts) => {
    if (event.event === "on_llm_start") {
        if (event.metadata.step === types_1.MetadataState.briefGeneration) {
            resetBriefs();
        }
        else if (event.metadata.step === types_1.MetadataState.blogPostGeneration) {
            resetBlogPosts();
        }
    }
};
const parserEventsStream = (events, resetBriefs, resetBlogPosts, setBriefs, setBlogPosts) => {
    var _a;
    for (const event of events) {
        resetStateForNewRun(event, resetBriefs, resetBlogPosts);
        // Event parsing and updating the state:
        if (event.metadata && event.metadata.step && ((_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.chunk)) {
            switch (event.metadata.step) {
                case "briefGeneration":
                    setBriefs((prevBriefs) => {
                        return prevBriefs + event.data.chunk;
                    });
                    break;
                case "blogPostGeneration":
                    setBlogPosts((prevBlogPosts) => {
                        return prevBlogPosts + event.data.chunk;
                    });
                    break;
                default:
                    // Handle other steps or ignore
                    break;
            }
        }
    }
};
exports.parserEventsStream = parserEventsStream;
