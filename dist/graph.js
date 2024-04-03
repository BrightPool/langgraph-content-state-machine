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
    const messages = state.messages;
    const briefGenerated = yield chains_1.briefGenerationChain.invoke({
        messages,
        topic: state.topic,
    });
    return {
        messages: [...messages, ...[briefGenerated]],
        numberOfIterations: state.numberOfIterations,
    };
});
const articleBriefReflectionNode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const clsMap = {
        ai: messages_1.HumanMessage,
        human: messages_1.AIMessage,
    };
    // First message is the original user request. We hold it the same for all nodes
    const translated = [
        state.messages[0],
        ...state.messages
            .slice(1)
            .map((msg) => new clsMap[msg._getType()](msg.content)),
    ];
    const res = yield chains_1.seoBriefReflectionChain.invoke({
        messages: translated,
    });
    state.numberOfIterations += 1;
    return {
        messages: [...state.messages, ...[new messages_1.HumanMessage(res)]],
        numberOfIterations: state.numberOfIterations,
    };
});
const shouldContinueWithBriefReflection = (state) => {
    if (state.numberOfIterations < 3) {
        return "article_brief_reflection";
    }
    else {
        return "article_generation";
    }
};
const createContentWorkflow = () => __awaiter(void 0, void 0, void 0, function* () {
    const workflow = new langgraph_1.StateGraph({
        // @ts-ignore
        channels: state_1.agentState,
    });
    workflow.addNode("article_brief", briefGenerationNode);
    workflow.addNode("article_brief_reflection", articleBriefReflectionNode);
    workflow.addNode("article_generation", (state) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Generating the article here!");
        return state;
    }));
    // Conditional nodes for checking:
    workflow.addConditionalEdges("article_brief", shouldContinueWithBriefReflection);
    // Define the edges within the state machine:
    workflow.addEdge("article_brief_reflection", "article_brief");
    workflow.addEdge("article_generation", langgraph_1.END);
    // Set the entry point of the state machine:
    workflow.setEntryPoint("article_brief");
    // Compile the state machine:
    const runnable = workflow.compile();
    return runnable;
});
exports.createContentWorkflow = createContentWorkflow;
