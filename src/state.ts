import { BaseMessage } from "@langchain/core/messages";

export const agentState = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  numberOfIterations: {
    value: null,
  },
  topic: {
    value: null,
  },
};
