import OpenAI from "openai";

const BASE_URL = process.env.LLM_BASE_URL ?? "https://api.fireworks.ai/inference/v1";
const API_KEY = process.env.LLM_API_KEY ?? "";
const MODEL_NAME = process.env.LLM_MODEL ?? "accounts/fireworks/models/kimi-k2p6";

export const MODEL = MODEL_NAME;

// Lazy client — avoids crashing the build when API_KEY is empty
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ baseURL: BASE_URL, apiKey: API_KEY });
  }
  return _client;
}

// Proxy so `llm.chat.completions.create(...)` still works
export const llm = new Proxy({} as OpenAI, {
  get(_, prop) {
    return Reflect.get(getClient(), prop);
  },
});

function stripThinking(content: string): string {
  // Strip <think>...</think> blocks from Kimi/reasoning models
  return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\n?/gm, "")
    .replace(/^```\n?/gm, "")
    .trim();
}

export function extractJSON(text: string): string {
  // Strip thinking blocks first
  text = stripThinking(text);
  // Strip markdown fences
  text = stripMarkdownFences(text);
  // Extract first complete JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text;
}

export async function complete(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const attempt = async (): Promise<string> => {
    const response = await getClient().chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
      stream: false,
    });

    let content = response.choices[0]?.message?.content ?? "";
    content = stripThinking(content);
    content = stripMarkdownFences(content);
    return content;
  };

  try {
    return await attempt();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("LLM attempt 1 failed:", msg);
    await new Promise((r) => setTimeout(r, 2000));
    return await attempt();
  }
}

export async function* streamCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
) {
  const stream = await getClient().chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1000,
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}
