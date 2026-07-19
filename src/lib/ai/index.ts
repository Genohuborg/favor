import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { customProvider } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { AI_CONFIG } from "./constants";
import { getModelById } from "./models";
import { tools } from "./tools";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export function getModelConfig(modelId: string) {
  const model = getModelById(modelId);
  return {
    maxTokens: AI_CONFIG.maxTokens,
    temperature: AI_CONFIG.temperature,
    topP: AI_CONFIG.topP,
    ...(model?.context && { maxInputTokens: model.context }),
  };
}

export const myProvider = customProvider({
  languageModels: {
    "claude-opus-4-8": anthropic("claude-opus-4-8"),
    "gpt-4.1-nano": openai("gpt-4.1-nano"),
    "gpt-5-nano": openai("gpt-5-nano"),
    "gpt-4o-mini": openai("gpt-4o-mini"),
    "deepseek-chat": deepseek("deepseek-reasoner"),
  },
});

export { tools };
