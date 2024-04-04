import { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  messages: BaseMessage[];
  numberOfIterations: number;
  topic: string;
  finalContentBrief: string;
  latestFeedback: string;
  latestBrief: string;
}
