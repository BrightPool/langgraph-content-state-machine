import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// Custom state machine and agent chains:
import { agentState } from "./state";
import { AgentState } from "./types";
import { briefGenerationChain, seoBriefReflectionChain } from "./chains";

const briefGenerationNode = async (state: AgentState) => {
  const messages = state.messages;
  const briefGenerated = await briefGenerationChain.invoke({
    messages,
    topic: state.topic,
  });
  return {
    messages: [...messages, ...[briefGenerated]],
    numberOfIterations: state.numberOfIterations,
  };
};

const articleBriefReflectionNode = async (state: AgentState) => {
  const clsMap: { [key: string]: new (content: string) => BaseMessage } = {
    ai: HumanMessage,
    human: AIMessage,
  };

  // First message is the original user request. We hold it the same for all nodes
  const translated = [
    state.messages[0],
    ...state.messages
      .slice(1)
      .map((msg) => new clsMap[msg._getType()](msg.content as string)),
  ];

  const res = await seoBriefReflectionChain.invoke({
    messages: translated,
  });
  state.numberOfIterations += 1;

  return {
    messages: [...state.messages, ...[new HumanMessage(res)]],
    numberOfIterations: state.numberOfIterations,
  };
};

const shouldContinueWithBriefReflection = (state: AgentState) => {
  if (state.numberOfIterations < 3) {
    return "article_brief_reflection";
  } else {
    return END;
  }
};

export const createContentWorkflow = async () => {
  const workflow = new StateGraph({
    // @ts-ignore
    channels: agentState,
  });

  workflow.addNode("article_brief", briefGenerationNode);
  workflow.addNode("article_brief_reflection", articleBriefReflectionNode);
  // Conditional nodes for checking:
  workflow.addConditionalEdges(
    "article_brief",
    shouldContinueWithBriefReflection
  );

  // Define the edges within the state machine:
  workflow.addEdge("article_brief_reflection", "article_brief");

  // Set the entry point of the state machine:
  workflow.setEntryPoint("article_brief");

  // Compile the state machine:
  const runnable = workflow.compile();
  return runnable;
};
