"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostReflectionChain = exports.blogPostGenerationChain = exports.seoBriefReflectionChain = exports.briefGenerationChain = void 0;
const prompts_1 = require("@langchain/core/prompts");
const messages_1 = require("@langchain/core/messages");
const models_1 = require("./models");
const briefGeneration = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an SEO marketing professional. You are responsible for creating an amazing SEO blog post. Generate a really good hierarchical structure for the blog post. Make sure that the brief is clear and concise.
    The blog post should be on {topic}. Use any of the feedback above in the chat history to further improve the next brief.
    Only respond with the raw .md content, never with backticks or any other formatting. The content should be in markdown format as this will be rendered directly within a NextJS application.
    `,
    ],
    new prompts_1.MessagesPlaceholder("messages"),
    new messages_1.HumanMessage("I want you to improve the brief, please use any of the feedback from above in our current chat history. You must output a full, improved content brief. Don't reply with certainly or anything. Just give me the updated brief. You must produce the brief within .md format, as this will be rendered within a NextJS application. Never include the target audience or SEO keywords as separate sections."),
]);
const seoBriefReflectionPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an SEO specialist tasked with critically evaluating a blog post brief for SEO effectiveness. Provide detailed critique on key SEO aspects such as keyword usage, content structure, readability, and potential user engagement. 
    After your critique, rate the brief's SEO effectiveness on a scale of 1 to 10, where 10 is most effective. Offer specific suggestions for improvement to increase this rating. Ensure that your feedback is actionable, targeting direct enhancements rather than general advice.
    Assume responsibility for refining the brief based on your critique to elevate its SEO value. Your goal is to enhance the brief's quality, making it more SEO-friendly and engaging for its intended audience.`,
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
exports.briefGenerationChain = briefGeneration.pipe(models_1.briefGenerationModel);
exports.seoBriefReflectionChain = seoBriefReflectionPrompt.pipe(models_1.model);
exports.blogPostGenerationChain = blogPostPrompt.pipe(models_1.blogPostGenerationModel);
exports.blogPostReflectionChain = blogReflectionPrompt.pipe(models_1.model);
