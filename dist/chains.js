"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.essayGenerationChain = exports.reflectChain = exports.briefGenerationChain = exports.seoBriefReflectionChain = void 0;
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const messages_1 = require("@langchain/core/messages");
const briefGeneration = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an SEO marketing professional. You are responsible for creating an amazing SEO blog post. Generate a really good hierarchical structure for the blog post. Make sure that the brief is clear and concise.
    The blog post should be on {topic}. Use any of the feedback above in the chat history to further improve the next brief.
    `,
    ],
    new prompts_1.MessagesPlaceholder("messages"),
    new messages_1.HumanMessage("I want you to improve the brief, please use any of the feedback from above in our current chat history. You must output a full, improved content brief. Don't reply with certainly or anything. Just give me the updated brief."),
]);
const seoBriefReflectionPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an SEO specialist and are responsible for evaluating and improving a blog post brief for SEO. You must always produce a new blog post brief for the piece of content that is better than the original.
    You must improve the brief and improve it every time, otherwise I might loose my job if it is not good enough...
    Also you should never give general guidance such as include FAQs or improve the structure. You should always implement the required changes and assume that you'll be producing the blog post.`,
    ],
    new prompts_1.MessagesPlaceholder("messages"),
]);
const blogPostPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a marketing genius, responsible for creating an amazing SEO blog post. You are an SEO marketing professional.
Generate the best essay possible for the user's request. If the user provides critique, respond with a revised version of your previous attempts.
You must render the output as markdown format as this will be rendered directly within a NextJS application.`,
    ],
    new prompts_1.MessagesPlaceholder("messages"),
]);
const blogReflectionPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an SEO specialist and are grading a blog post for SEO.
Generate critique and recommendations for the user's submission.
Provide detailed recommendations, including requests for length, depth, style, etc.`,
    ],
    new prompts_1.MessagesPlaceholder("messages"),
]);
const llm = new openai_1.ChatOpenAI({
    temperature: 0.5,
    modelName: "gpt-4-turbo-preview",
});
exports.seoBriefReflectionChain = seoBriefReflectionPrompt.pipe(llm);
exports.briefGenerationChain = briefGeneration.pipe(llm);
exports.reflectChain = blogReflectionPrompt.pipe(llm);
exports.essayGenerationChain = blogPostPrompt.pipe(llm);
