import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// Custom state machine and agent chains:
import { agentState } from "./state";
import { AgentState } from "./types";
import { GraphType } from "./types";
import {
  briefGenerationChain,
  seoBriefReflectionChain,
  blogPostGenerationChain,
} from "./chains";

const briefGenerationNode = async (state: AgentState) => {
  const contextMessages = [];
  if (state.latestBrief) {
    contextMessages.push(
      new HumanMessage(`Latest Brief: ${state.latestBrief}`)
    );
  }
  if (state.latestFeedback) {
    contextMessages.push(new HumanMessage(`Feedback: ${state.latestFeedback}`));
  }

  const briefGenerated = await briefGenerationChain.invoke({
    messages: contextMessages,
    topic: state.topic,
  });

  state.latestBrief = briefGenerated.content as string;

  return {
    ...state,
    numberOfIterations: state.numberOfIterations + 1,
  };
};

const articleBriefReflectionNode = async (state: AgentState) => {
  const feedbackResult = await seoBriefReflectionChain.invoke({
    messages: [new HumanMessage(state.latestBrief)],
  });

  state.latestFeedback = feedbackResult.content as string;
  return {
    ...state,
  };
};

const blogPostGenerationNode = async (state: AgentState) => {
  const contextMessages = [];
  if (state.finalContentBrief)
    throw new Error("A final content brief must exist!");
  contextMessages.push(
    new HumanMessage(`Final Brief: ${state.finalContentBrief}`)
  );

  const contentGenerated = await blogPostGenerationChain.invoke({
    messages: contextMessages,
    topic: state.topic,
  });

  state.latestBlogPost = contentGenerated.content as string;
  return {
    ...state,
  };
};

const shouldContinueWithBriefReflection = (state: AgentState) => {
  if (state.numberOfIterations < 3) {
    return "article_brief_reflection";
  } else {
    state.finalContentBrief = state.latestBrief;
    return END;
  }
};

export const createGraph = async (
  graphType: GraphType = GraphType.BriefGeneration
) => {
  const workflow = new StateGraph({
    // @ts-ignore
    channels: agentState,
  });

  workflow.addNode("article_brief", briefGenerationNode);
  workflow.addNode("article_brief_reflection", articleBriefReflectionNode);

  // Add extra nodes/edges for article generation:
  if (graphType === GraphType.ArticleGeneration) {
    workflow.addNode("generate_blog_post", blogPostGenerationNode);
  }

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
