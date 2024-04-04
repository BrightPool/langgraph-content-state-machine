import { ChatOpenAI } from "@langchain/openai";
import { RunnableConfig } from "@langchain/core/runnables";
import { MetadataState } from "./types";

// Runnable configs:
const briefGenerationConfig: RunnableConfig = {
  metadata: {
    step: MetadataState.briefGeneration,
  },
};

const blogPostGenerationConfig: RunnableConfig = {
  metadata: {
    step: MetadataState.blogPostGeneration,
  },
};

export const model = new ChatOpenAI({
  temperature: 0.5,
  streaming: true,
  modelName: "gpt-3.5-turbo",
});

export const briefGenerationModel = new ChatOpenAI({
  temperature: 0.5,
  streaming: true,
  modelName: "gpt-3.5-turbo",
  maxTokens: 4000,
}).withConfig(briefGenerationConfig);

export const blogPostGenerationModel = new ChatOpenAI({
  temperature: 0.5,
  streaming: true,
  modelName: "gpt-3.5-turbo",
}).withConfig(blogPostGenerationConfig);
