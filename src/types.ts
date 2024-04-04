import { BaseMessage } from "@langchain/core/messages";

export enum GraphType {
  BriefGeneration = "briefGeneration",
  ArticleGeneration = "articleGeneration",
}

export enum MetadataState {
  briefGeneration = "briefGeneration",
  blogPostGeneration = "blogPostGeneration",
}

export interface AgentState {
  messages: BaseMessage[];
  numberOfIterations: number;
  topic: string;
  finalContentBrief: string;
  latestBlogPost: string | null;
  latestFeedback: string;
  latestBrief: string;
}
