"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostGenerationModel = exports.briefGenerationModel = exports.model = void 0;
const openai_1 = require("@langchain/openai");
// Runnable configs:
const briefGenerationConfig = {
    metadata: {
        step: "briefGeneration",
    },
};
const blogPostGenerationConfig = {
    metadata: {
        step: "blogPostGeneration",
    },
};
exports.model = new openai_1.ChatOpenAI({
    temperature: 0.5,
    streaming: true,
    modelName: "gpt-3.5-turbo",
});
exports.briefGenerationModel = new openai_1.ChatOpenAI({
    temperature: 0.5,
    streaming: true,
    modelName: "gpt-3.5-turbo",
}).withConfig(briefGenerationConfig);
exports.blogPostGenerationModel = new openai_1.ChatOpenAI({
    temperature: 0.5,
    streaming: true,
    modelName: "gpt-3.5-turbo",
}).withConfig(blogPostGenerationConfig);
