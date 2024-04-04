import { StateGraph, END } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

// Custom state machine and agent chains:
import { agentState } from "./state";
import { AgentState } from "./types";
import { GraphType } from "./types";
import {
  briefGenerationChain,
  seoBriefReflectionChain,
  blogPostGenerationChain,
  blogPostReflectionChain,
} from "./chains";

const briefGenerationNode = async (state: AgentState) => {
  const contextMessages = [];
  if (state.latestBrief) {
    contextMessages.push(
      new HumanMessage(`Latest Brief: ${state.latestBrief}`)
    );
  }
  if (state.latestBriefFeedback) {
    contextMessages.push(
      new HumanMessage(`Feedback: ${state.latestBriefFeedback}`)
    );
  }

  const briefGenerated = await briefGenerationChain.invoke({
    messages: contextMessages,
    topic: state.topic,
  });

  state.latestBrief = briefGenerated.content as string;

  return {
    ...state,
    numberOfBriefIterations: state.numberOfBriefIterations + 1,
  };
};

const blogBriefReflectionNode = async (state: AgentState) => {
  const feedbackResult = await seoBriefReflectionChain.invoke({
    messages: [new HumanMessage(state.latestBrief)],
  });

  state.latestBriefFeedback = feedbackResult.content as string;
  return {
    ...state,
  };
};

const blogPostGenerationNode = async (state: AgentState) => {
  const contextMessages = [];
  if (!state.finalContentBrief) throw new Error("No final content brief found");
  contextMessages.push(
    new HumanMessage(`Final Brief: ${state.finalContentBrief}`)
  );

  if (state.latestBlogPostFeedback) {
    contextMessages.push(
      new HumanMessage(
        `Latest Blog Post Feedback: ${state.latestBlogPostFeedback} Re-write the entire blog post.`
      )
    );
  }

  const contentGenerated = await blogPostGenerationChain.invoke({
    messages: contextMessages,
    topic: state.topic,
  });

  state.numberOfBlogIterations = state.numberOfBlogIterations + 1;
  state.latestBlogPost = contentGenerated.content as string;
  return {
    ...state,
  };
};

const blogPostReflectionNode = async (state: AgentState) => {
  const feedbackResult = await blogPostReflectionChain.invoke({
    topic: state.topic,
    messages: [new HumanMessage(state.latestBlogPost as string)],
  });
  state.latestBlogPostFeedback = feedbackResult.content as string;
  return {
    ...state,
  };
};

// Conditional Nodes:
const shouldContinueWithBriefReflectionEndOnBrief = (state: AgentState) => {
  if (state.numberOfBriefIterations < 3) {
    return "blog_brief_reflection";
  } else {
    state.finalContentBrief = state.latestBrief;
    return END;
  }
};

const shouldContinueWithBriefReflectionEndOnBlogPost = (state: AgentState) => {
  if (state.numberOfBriefIterations < 3) {
    return "blog_brief_reflection";
  } else {
    state.finalContentBrief = state.latestBrief;
    return "generate_blog_post";
  }
};

const shouldContinueWithBlogPostReflectionEnd = (state: AgentState) => {
  if (state.numberOfBlogIterations < 3) {
    return "blog_post_reflection";
  } else {
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

  workflow.addNode("blog_brief", briefGenerationNode);
  workflow.addNode("blog_brief_reflection", blogBriefReflectionNode);

  // Add extra nodes/edges for blog generation:
  if (graphType === GraphType.BlogGeneration) {
    workflow.addNode("generate_blog_post", blogPostGenerationNode);
    workflow.addNode("blog_post_reflection", blogPostReflectionNode);
    workflow.addConditionalEdges(
      "blog_brief",
      shouldContinueWithBriefReflectionEndOnBlogPost
    );
    workflow.addConditionalEdges(
      "generate_blog_post",
      shouldContinueWithBlogPostReflectionEnd
    );
    workflow.addEdge("blog_post_reflection", "generate_blog_post");
  } else {
    workflow.addConditionalEdges(
      "blog_brief",
      shouldContinueWithBriefReflectionEndOnBrief
    );
  }

  // Define the edges within the state machine:
  workflow.addEdge("blog_brief_reflection", "blog_brief");

  // Set the entry point of the state machine:
  workflow.setEntryPoint("blog_brief");

  // Compile the state machine:
  const runnable = workflow.compile();
  return runnable;
};
