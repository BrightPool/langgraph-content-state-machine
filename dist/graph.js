"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraph = void 0;
const langgraph_1 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
// Custom state machine and agent chains:
const state_1 = require("./state");
const types_1 = require("./types");
const chains_1 = require("./chains");
const briefGenerationNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const contextMessages = [];
    if (state.latestBrief) {
        contextMessages.push(new messages_1.HumanMessage(`Latest Brief: ${state.latestBrief}`));
    }
    if (state.latestBriefFeedback) {
        contextMessages.push(new messages_1.HumanMessage(`Feedback: ${state.latestBriefFeedback}`));
    }
    const briefGenerated = yield chains_1.briefGenerationChain.invoke({
        messages: contextMessages,
        topic: state.topic,
    });
    state.latestBrief = briefGenerated.content;
    return Object.assign(Object.assign({}, state), { numberOfBriefIterations: state.numberOfBriefIterations + 1 });
});
const blogBriefReflectionNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackResult = yield chains_1.seoBriefReflectionChain.invoke({
        messages: [new messages_1.HumanMessage(state.latestBrief)],
    });
    state.latestBriefFeedback = feedbackResult.content;
    return Object.assign({}, state);
});
const blogPostGenerationNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const contextMessages = [];
    if (!state.finalContentBrief)
        throw new Error("No final content brief found");
    contextMessages.push(new messages_1.HumanMessage(`Final Brief: ${state.finalContentBrief}`));
    if (state.latestBlogPostFeedback) {
        contextMessages.push(new messages_1.HumanMessage(`Latest Blog Post Feedback: ${state.latestBlogPostFeedback} Re-write the entire blog post.`));
    }
    const contentGenerated = yield chains_1.blogPostGenerationChain.invoke({
        messages: contextMessages,
        topic: state.topic,
    });
    state.numberOfBlogIterations = state.numberOfBlogIterations + 1;
    state.latestBlogPost = contentGenerated.content;
    return Object.assign({}, state);
});
const blogPostReflectionNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackResult = yield chains_1.blogPostReflectionChain.invoke({
        topic: state.topic,
        messages: [new messages_1.HumanMessage(state.latestBlogPost)],
    });
    state.latestBlogPostFeedback = feedbackResult.content;
    return Object.assign({}, state);
});
// Conditional Nodes:
const shouldContinueWithBriefReflectionEndOnBrief = (state) => {
    if (state.numberOfBriefIterations < 3) {
        return "blog_brief_reflection";
    }
    else {
        state.finalContentBrief = state.latestBrief;
        return langgraph_1.END;
    }
};
const shouldContinueWithBriefReflectionEndOnBlogPost = (state) => {
    if (state.numberOfBriefIterations < 3) {
        return "blog_brief_reflection";
    }
    else {
        state.finalContentBrief = state.latestBrief;
        return "generate_blog_post";
    }
};
const shouldContinueWithBlogPostReflectionEnd = (state) => {
    if (state.numberOfBlogIterations < 3) {
        return "blog_post_reflection";
    }
    else {
        return langgraph_1.END;
    }
};
const createGraph = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (graphType = types_1.GraphType.BriefGeneration) {
    const workflow = new langgraph_1.StateGraph({
        // @ts-ignore
        channels: state_1.agentState,
    });
    workflow.addNode("blog_brief", briefGenerationNode);
    workflow.addNode("blog_brief_reflection", blogBriefReflectionNode);
    // Add extra nodes/edges for blog generation:
    if (graphType === types_1.GraphType.BlogGeneration) {
        workflow.addNode("generate_blog_post", blogPostGenerationNode);
        workflow.addNode("blog_post_reflection", blogPostReflectionNode);
        workflow.addConditionalEdges("blog_brief", shouldContinueWithBriefReflectionEndOnBlogPost);
        workflow.addConditionalEdges("generate_blog_post", shouldContinueWithBlogPostReflectionEnd);
        workflow.addEdge("blog_post_reflection", "generate_blog_post");
    }
    else {
        workflow.addConditionalEdges("blog_brief", shouldContinueWithBriefReflectionEndOnBrief);
    }
    // Define the edges within the state machine:
    workflow.addEdge("blog_brief_reflection", "blog_brief");
    workflow.addNode("research", (state) => __awaiter(void 0, void 0, void 0, function* () {
        // TODO - Add some keyword research within this step:
        // Doing some research here
        return Object.assign({}, state);
    }));
    workflow.addEdge("research", "blog_brief");
    // Set the entry point of the state machine:
    workflow.setEntryPoint("research");
    // Compile the state machine:
    const runnable = workflow.compile();
    return runnable;
});
exports.createGraph = createGraph;
