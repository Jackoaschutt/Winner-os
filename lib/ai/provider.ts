// Clean AI provider abstraction. Swap models by setting AI_PROVIDER and the
// matching API key — nothing else in the app needs to change.
//
//   AI_PROVIDER=anthropic   ANTHROPIC_API_KEY=...
//   AI_PROVIDER=openai      OPENAI_API_KEY=...
//   AI_PROVIDER=gemini      GEMINI_API_KEY=...
//
// With no key set, every feature in lib/ai/features.ts falls back to a
// deterministic, rule-based "demo AI" so the product is fully usable with
// zero configuration — outputs are clearly labeled AI-generated (demo).

export type AIProviderName = "anthropic" | "openai" | "gemini" | "demo";

export interface AIMessage {
  role: "system" | "user";
  content: string;
}

export interface AIProvider {
  name: AIProviderName;
  isLive: boolean;
  complete(messages: AIMessage[]): Promise<string>;
}

class AnthropicProvider implements AIProvider {
  name: AIProviderName = "anthropic";
  isLive = true;
  async complete(messages: AIMessage[]): Promise<string> {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
    const system = messages.find((m) => m.role === "system")?.content;
    const user = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n\n");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 1500,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const json = await res.json();
    return json.content?.[0]?.text ?? "";
  }
}

class OpenAIProvider implements AIProvider {
  name: AIProviderName = "openai";
  isLive = true;
  async complete(messages: AIMessage[]): Promise<string> {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  }
}

class GeminiProvider implements AIProvider {
  name: AIProviderName = "gemini";
  isLive = true;
  async complete(messages: AIMessage[]): Promise<string> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: messages.map((m) => ({ role: m.role === "system" ? "user" : m.role, parts: [{ text: m.content }] })),
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
}

class DemoProvider implements AIProvider {
  name: AIProviderName = "demo";
  isLive = false;
  async complete(): Promise<string> {
    return "";
  }
}

export function getAIProvider(): AIProvider {
  const configured = (process.env.AI_PROVIDER as AIProviderName) || "demo";
  try {
    if (configured === "anthropic" && process.env.ANTHROPIC_API_KEY) return new AnthropicProvider();
    if (configured === "openai" && process.env.OPENAI_API_KEY) return new OpenAIProvider();
    if (configured === "gemini" && process.env.GEMINI_API_KEY) return new GeminiProvider();
  } catch {
    // fall through to demo
  }
  return new DemoProvider();
}
