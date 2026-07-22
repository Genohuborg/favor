export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";

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
    id: "gpt-4.1-nano",
    label: "GPT-4.1 Nano",
    apiIdentifier: "gpt-4.1-nano",
    description: "Ultra-fast and affordable model",
    context: 1047576,
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Fast and affordable model",
    context: 128000,
  },
  {
    id: "gpt-5-nano",
    label: "GPT-5 Nano",
    apiIdentifier: "gpt-5-nano",
    description: "Fast and cost-efficient reasoning model.",
    context: 400000,
    reasoning: true,
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
