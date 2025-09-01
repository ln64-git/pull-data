import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo", // or "gpt-3.5-turbo"
  temperature: 0,
  maxTokens: 4096,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.OPENAI_API_KEY,
});
