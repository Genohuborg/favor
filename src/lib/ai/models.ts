// FAVOR-GPT runs on the Anthropic API. The OpenAI models were removed on
// 2026-09-05; the key `ANTHROPIC_API_KEY` is read server-side by
// @ai-sdk/anthropic (see ./index.ts) and never reaches the browser.
//
// The ids below are Anthropic API model ids and are used verbatim as the
// languageModel keys in ./index.ts, so the two lists must stay in step.
export const DEFAULT_MODEL_NAME: string = "claude-opus-5";

export interface ChatModel {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  disabled?: boolean;
  reasoning?: boolean;
  context?: number;
}

export const models: Array<ChatModel> = [
  {
    id: "claude-opus-5",
    label: "Claude Opus 5",
    apiIdentifier: "claude-opus-5",
    description: "Anthropic's most capable model",
    context: 200000,
  },
  {
    id: "claude-sonnet-5",
    label: "Claude Sonnet 5",
    apiIdentifier: "claude-sonnet-5",
    description: "Balanced capability and speed",
    context: 200000,
  },
  {
    id: "claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    apiIdentifier: "claude-haiku-4-5-20251001",
    description: "Fastest and most affordable model",
    context: 200000,
  },
  {
    id: "deepseek-chat",
    label: "DeepSeek R1",
    apiIdentifier: "deepseek-chat",
    description: "Advanced reasoning & multilingual model",
    reasoning: true,
    context: 128000,
  },
] as const;

// Legacy interface for backwards compatibility
export interface Models extends ChatModel {}

// Helper functions
export function getModelById(id: string): ChatModel | undefined {
  return models.find((model) => model.id === id);
}

export function getDefaultModel(): ChatModel {
  return getModelById(DEFAULT_MODEL_NAME) || models[0];
}

export function getReasoningModels(): ChatModel[] {
  return models.filter((model) => model.reasoning);
}

export function getStandardModels(): ChatModel[] {
  return models.filter((model) => !model.reasoning);
}

export function isReasoningModel(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.reasoning || false;
}
