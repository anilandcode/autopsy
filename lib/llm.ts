import OpenAI from "openai";

const BASE_URL = process.env.LLM_BASE_URL ?? "https://api.fireworks.ai/inference/v1";
const API_KEY = process.env.LLM_API_KEY ?? "";
const MODEL_NAME = process.env.LLM_MODEL ?? "accounts/fireworks/models/deepseek-v4-pro";

console.log("[LLM] baseURL:", BASE_URL);
console.log("[LLM] model:", MODEL_NAME);
console.log("[LLM] key prefix:", API_KEY.slice(0, 8));

export const MODEL = MODEL_NAME;

export const llm = new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
});

export async function complete(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await llm.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1500,
    stream: false,
  });
  return response.choices[0]?.message?.content ?? "";
}

export async function* streamCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
) {
  const stream = await llm.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1500,
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}
