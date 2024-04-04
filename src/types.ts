import { BaseMessage } from "@langchain/core/messages";

export enum GraphType {
  BriefGeneration = "briefGeneration",
  BlogGeneration = "BlogGeneration",
}

export enum MetadataState {
  briefGeneration = "briefGeneration",
  blogPostGeneration = "blogPostGeneration",
}

export interface AgentState {
  messages: BaseMessage[];
  numberOfBriefIterations: number;
  numberOfBlogIterations: number;
  topic: string;
  finalContentBrief: string;
  latestBrief: string;
  latestBriefFeedback: string;
  latestBlogPost: string | null;
  latestBlogPostFeedback: string | null;
}
