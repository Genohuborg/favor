import type { ChatModel } from "./models";
import { getModelById, getDefaultModel } from "./models";

export interface ChatConfig {
  maxMessages: number;
  retryAttempts: number;
  timeout: number;
  streamingEnabled: boolean;
  reasoningEnabled: boolean;
}

export interface UserPreferences {
  selectedModelId: string;
  visibilityType: "private" | "public";
  attachmentsEnabled: boolean;
  notificationsEnabled: boolean;
  autoScrollEnabled: boolean;
}

export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  maxMessages: 100,
  retryAttempts: 3,
  timeout: 30000, // 30 seconds
  streamingEnabled: true,
  reasoningEnabled: true,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  selectedModelId: "gpt-4o-mini",
  visibilityType: "private",
  attachmentsEnabled: true,
  notificationsEnabled: true,
  autoScrollEnabled: true,
};

export class ChatConfigManager {
  private config: ChatConfig;
  private preferences: UserPreferences;

  constructor(
    config: Partial<ChatConfig> = {},
    preferences: Partial<UserPreferences> = {},
  ) {
    this.config = { ...DEFAULT_CHAT_CONFIG, ...config };
    this.preferences = { ...DEFAULT_USER_PREFERENCES, ...preferences };
  }

  // Config getters
  getConfig(): ChatConfig {
    return { ...this.config };
  }

  getMaxMessages(): number {
    return this.config.maxMessages;
  }

  getRetryAttempts(): number {
    return this.config.retryAttempts;
  }

  isStreamingEnabled(): boolean {
    return this.config.streamingEnabled;
  }

  // Preferences getters
  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  getSelectedModel(): ChatModel {
    return getModelById(this.preferences.selectedModelId) || getDefaultModel();
  }

  getVisibilityType(): "private" | "public" {
    return this.preferences.visibilityType;
  }

  // Setters
  updateConfig(updates: Partial<ChatConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
  }

  setSelectedModel(modelId: string): void {
    const model = getModelById(modelId);
    if (model) {
      this.preferences.selectedModelId = modelId;
    } else {
      throw new Error(`Model ${modelId} not found`);
    }
  }

  // Model-specific configurations
  getModelConfig(modelId?: string): Partial<ChatConfig> {
    const model = modelId ? getModelById(modelId) : this.getSelectedModel();

    if (!model) return this.config;

    // Adjust config based on model capabilities
    const modelConfig: Partial<ChatConfig> = { ...this.config };

    // Reasoning models might need different settings
    if (model.reasoning) {
      modelConfig.reasoningEnabled = true;
      modelConfig.timeout = 60000; // Longer timeout for reasoning
    }

    return modelConfig;
  }

  // Cookie/localStorage integration
  saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "favor-chat-preferences",
        JSON.stringify(this.preferences),
      );
      localStorage.setItem("favor-chat-config", JSON.stringify(this.config));
    }
  }

  loadFromStorage(): void {
    if (typeof window !== "undefined") {
      try {
        const savedPreferences = localStorage.getItem("favor-chat-preferences");
        const savedConfig = localStorage.getItem("favor-chat-config");

        if (savedPreferences) {
          this.preferences = {
            ...this.preferences,
            ...JSON.parse(savedPreferences),
          };
        }

        if (savedConfig) {
          this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
      } catch (error) {
        console.warn("Failed to load chat configuration from storage:", error);
      }
    }
  }

  // Reset to defaults
  reset(): void {
    this.config = { ...DEFAULT_CHAT_CONFIG };
    this.preferences = { ...DEFAULT_USER_PREFERENCES };
  }
}

// Global instance
export const chatConfig = new ChatConfigManager();

// Utility functions
export function createChatConfig(
  modelId?: string,
  options: Partial<ChatConfig & UserPreferences> = {},
): ChatConfigManager {
  const preferences: Partial<UserPreferences> = {
    selectedModelId: modelId,
    ...options,
  };

  return new ChatConfigManager(options, preferences);
}

export function getModelCapabilities(modelId: string): {
  reasoning: boolean;
  multimodal: boolean;
  contextLength: number;
} {
  const model = getModelById(modelId);

  return {
    reasoning: model?.reasoning || false,
    multimodal: false, // Future feature
    contextLength: model?.context || 4096,
  };
}
