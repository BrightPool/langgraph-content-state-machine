import { BaseMessage } from "@langchain/core/messages";

export const agentState = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
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
