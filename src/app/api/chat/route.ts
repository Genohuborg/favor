import { myProvider, tools } from "@/lib/ai";
import { systemPrompt } from "@/lib/ai/prompts";
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 600;

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: {
    messages: UIMessage[];
    model: string;
  } = await req.json();

  // No providerOptions: the OpenAI-specific `reasoningEffort` block that used
  // to live here was sent for every model flagged `reasoning`, which since the
  // move to Anthropic means only DeepSeek -- a provider that never read it.
  const result = streamText({
    model: myProvider.languageModel(model),
    messages: convertToModelMessages(messages),
    tools: tools,
    stopWhen: stepCountIs(10),
    system: systemPrompt(model),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
