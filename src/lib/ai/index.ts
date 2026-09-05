import { anthropic } from "@ai-sdk/anthropic";
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

// The bare `anthropic` provider instance reads ANTHROPIC_API_KEY from the
// environment. Keys map 1:1 to the ids in ./models.ts.
export const myProvider = customProvider({
  languageModels: {
    "claude-opus-5": anthropic("claude-opus-5"),
    "claude-sonnet-5": anthropic("claude-sonnet-5"),
    "claude-haiku-4-5": anthropic("claude-haiku-4-5-20251001"),
    "deepseek-chat": deepseek("deepseek-reasoner"),
  },
});

export { tools };
