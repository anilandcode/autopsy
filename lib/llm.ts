import OpenAI from "openai";

const baseURL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const apiKey = process.env.LLM_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "gpt-4o-mini";

// Lazy client — avoids crashing the dev server at boot when keys are empty
function getClient(): OpenAI {
  return new OpenAI({ apiKey, baseURL });
}

export const llm = new Proxy({} as OpenAI, {
  get(_, prop) {
    return Reflect.get(getClient(), prop);
  },
});

export { MODEL };

type CompletionOptions = {
  temperature?: number;
  maxTokens?: number;
};

export async function* streamCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: CompletionOptions
): AsyncGenerator<string> {
  const stream = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}

export async function complete(
  systemPrompt: string,
  userPrompt: string,
  options?: CompletionOptions
): Promise<string> {
  const res = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}
