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
exports.createContentWorkflow = void 0;
const langgraph_1 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
// Custom state machine and agent chains:
const state_1 = require("./state");
const chains_1 = require("./chains");
const briefGenerationNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const contextMessages = [];
    if (state.latestBrief) {
        contextMessages.push(new messages_1.HumanMessage(`Latest Brief: ${state.latestBrief}`));
    }
    if (state.latestFeedback) {
        contextMessages.push(new messages_1.HumanMessage(`Feedback: ${state.latestFeedback}`));
    }
    const briefGenerated = yield chains_1.briefGenerationChain.invoke({
        messages: contextMessages,
        topic: state.topic,
    });
    state.latestBrief = briefGenerated.content;
    return Object.assign(Object.assign({}, state), { numberOfIterations: state.numberOfIterations + 1 });
});
const articleBriefReflectionNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackResult = yield chains_1.seoBriefReflectionChain.invoke({
        messages: [new messages_1.HumanMessage(state.latestBrief)],
    });
    state.latestFeedback = feedbackResult.content;
    return Object.assign({}, state);
});
const shouldContinueWithBriefReflection = (state) => {
    if (state.numberOfIterations < 3) {
        return "article_brief_reflection";
    }
    else {
        // Store the final content brief within the state:
        state.finalContentBrief = state.latestBrief;
        return langgraph_1.END;
    }
};
const createContentWorkflow = () => __awaiter(void 0, void 0, void 0, function* () {
    const workflow = new langgraph_1.StateGraph({
        // @ts-ignore
        channels: state_1.agentState,
    });
    workflow.addNode("article_brief", briefGenerationNode);
    workflow.addNode("article_brief_reflection", articleBriefReflectionNode);
    // Conditional nodes for checking:
    workflow.addConditionalEdges("article_brief", shouldContinueWithBriefReflection);
    // Define the edges within the state machine:
    workflow.addEdge("article_brief_reflection", "article_brief");
    // Set the entry point of the state machine:
    workflow.setEntryPoint("article_brief");
    // Compile the state machine:
    const runnable = workflow.compile();
    return runnable;
});
exports.createContentWorkflow = createContentWorkflow;
