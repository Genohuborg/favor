import { anthropic } from "@ai-sdk/anthropic";

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
// claude-opus-4-8: 1M context, 128K output, Anthropic's most capable Opus model.
export const nanoModel = anthropic("claude-opus-4-8");

// Provider options for the tool-calling model (used in prepareStep).
// Claude Opus 4.8 uses adaptive thinking; no OpenAI-style reasoningEffort knob.
export const NANO_PROVIDER_OPTIONS: ProviderOptions | undefined = undefined;

// Synthesis models (user-selectable). Claude Opus 4.8 is the default provider.
// fast     = Claude Opus 4.8
// thinking = Claude Opus 4.8 (extended output headroom)
const SYNTHESIS_MODES = {
  fast: {
    label: "Fast",
    description: "Claude Opus 4.8",
    factory: () => anthropic("claude-opus-4-8"),
    providerOptions: undefined as ProviderOptions | undefined,
  },
  thinking: {
    label: "Thinking",
    description: "Claude Opus 4.8",
    factory: () => anthropic("claude-opus-4-8"),
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
