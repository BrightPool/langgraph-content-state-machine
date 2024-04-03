import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const briefGeneration = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an SEO marketing professional. You are responsible for creating an amazing SEO blog post. Generate a really good hierarchical structure for the blog post. Make sure that the brief is clear and concise.
    The blog post should be on {topic}. Use any of the feedback above in the chat history to further improve the next brief.`,
  ],
  new MessagesPlaceholder("messages"),
]);

const seoBriefReflectionPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an SEO specialist and are responsible for evaluating and improving a blog post brief for SEO. You must always produce a new blog post brief for the piece of content that is better than the original.
    You must improve the brief and improve it every time, otherwise I might loose my job if it is not good enough...
    Also you should never give general guidance such as include FAQs or improve the structure. You should always implement the required changes and assume that you'll be producing the blog post.`,
  ],
  new MessagesPlaceholder("messages"),
]);

const blogPostPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a marketing genius, responsible for creating an amazing SEO blog post. You are an SEO marketing professional.
Generate the best essay possible for the user's request. If the user provides critique, respond with a revised version of your previous attempts.
You must render the output as markdown format as this will be rendered directly within a NextJS application.`,
  ],
  new MessagesPlaceholder("messages"),
]);

const blogReflectionPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an SEO specialist and are grading a blog post for SEO.
Generate critique and recommendations for the user's submission.
Provide detailed recommendations, including requests for length, depth, style, etc.`,
  ],
  new MessagesPlaceholder("messages"),
]);

const llm = new ChatOpenAI({
  temperature: 0.5,
  modelName: "gpt-4-turbo-preview",
});

export const seoBriefReflectionChain = seoBriefReflectionPrompt.pipe(llm);
export const briefGenerationChain = briefGeneration.pipe(llm);
export const reflectChain = blogReflectionPrompt.pipe(llm);
export const essayGenerationChain = blogPostPrompt.pipe(llm);
