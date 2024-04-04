"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostGenerationModel = exports.briefGenerationModel = exports.model = void 0;
const openai_1 = require("@langchain/openai");
const types_1 = require("./types");
// Runnable configs:
const briefGenerationConfig = {
    metadata: {
        step: types_1.MetadataState.briefGeneration,
    },
};
const blogPostGenerationConfig = {
    metadata: {
        step: types_1.MetadataState.blogPostGeneration,
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
