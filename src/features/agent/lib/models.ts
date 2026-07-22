import {
  type OpenAILanguageModelResponsesOptions,
  openai,
} from "@ai-sdk/openai";

// Matches SharedV3ProviderOptions from ai SDK
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue | undefined };
type ProviderOptions = Record<string, Record<string, JSONValue | undefined>>;

// Tool-calling model (routing, planning, tool selection).
// gpt-5.4-mini: 400K context, 128K output, faster than gpt-5.4, good
// at function-calling / subagent dispatch.
export const nanoModel = openai("gpt-5.4-mini");

// Provider options for the tool-calling model (used in prepareStep)
export const NANO_PROVIDER_OPTIONS: ProviderOptions = {
  openai: {
    reasoningEffort: "low",
  } satisfies OpenAILanguageModelResponsesOptions,
};

// Synthesis models (user-selectable).
// fast = gpt-5.4-mini (faster, 400K context, $0.75/$4.50 per MTok)
// thinking = gpt-5.4 (1M context, 128K output, $2.50/$15 per MTok)
const SYNTHESIS_MODES = {
  fast: {
    label: "Fast",
    description: "GPT-5.4 mini",
    factory: () => openai("gpt-5.4-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
      } satisfies OpenAILanguageModelResponsesOptions,
    } as ProviderOptions,
  },
  thinking: {
    label: "Thinking",
    description: "GPT-5.4",
    factory: () => openai("gpt-5.4"),
    providerOptions: undefined as ProviderOptions | undefined,
  },
};

export type SynthesisModelId = keyof typeof SYNTHESIS_MODES;

export const DEFAULT_SYNTHESIS_MODEL: SynthesisModelId = "fast";

export function getSynthesisModel(id?: string) {
  const key = (id ?? DEFAULT_SYNTHESIS_MODEL) as SynthesisModelId;
  const mode = SYNTHESIS_MODES[key];
  if (!mode) return SYNTHESIS_MODES[DEFAULT_SYNTHESIS_MODEL].factory();
  return mode.factory();
}

export function getSynthesisProviderOptions(
  id?: string,
): ProviderOptions | undefined {
  const key = (id ?? DEFAULT_SYNTHESIS_MODEL) as SynthesisModelId;
  const mode = SYNTHESIS_MODES[key];
  if (!mode) return SYNTHESIS_MODES[DEFAULT_SYNTHESIS_MODEL].providerOptions;
  return mode.providerOptions;
}

export const AVAILABLE_SYNTHESIS_MODELS = Object.entries(SYNTHESIS_MODES).map(
  ([id, mode]) => ({
    id: id as SynthesisModelId,
    label: mode.label,
    description: mode.description,
  }),
);
