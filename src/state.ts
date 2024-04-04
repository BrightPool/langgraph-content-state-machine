import { BaseMessage } from "@langchain/core/messages";

export const agentState = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
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
