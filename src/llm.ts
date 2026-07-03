// Streaming LLM client for Chew It.
// Supports the Anthropic Messages API, the Google Gemini API, and any
// OpenAI-compatible /chat/completions endpoint.
// Uses the browser `fetch` (Obsidian runs in Electron) so we can stream token-by-token.

export type Provider = "claude" | "openai" | "gemini";

export interface LLMConfig {
  provider: Provider;
  apiKey: string;
  model: string;
  baseUrl: string; // OpenAI-compatible only; ignored for Claude and Gemini
  maxTokens: number;
}

export interface LLMRequest {
  system: string;
  user: string;
  signal: AbortSignal;
  onToken: (text: string) => void;
}

// Minimal shapes of the streaming JSON events we read from each provider.
interface ClaudeStreamEvent {
  type?: string;
  delta?: { type?: string; text?: string };
  error?: { message?: string };
}

interface OpenAIStreamEvent {
  choices?: { delta?: { content?: string } }[];
}

interface GeminiStreamEvent {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
}

export async function streamCompletion(config: LLMConfig, req: LLMRequest): Promise<void> {
  if (config.provider === "claude") {
    await streamClaude(config, req);
  } else if (config.provider === "gemini") {
    await streamGemini(config, req);
  } else {
    await streamOpenAI(config, req);
  }
}

// Non-streaming convenience wrapper for one-off calls (e.g. generating a
// preset's prompt) that just need the full text, not token-by-token updates.
export async function completeText(
  config: LLMConfig,
  req: { system: string; user: string; signal: AbortSignal }
): Promise<string> {
  let out = "";
  await streamCompletion(config, { ...req, onToken: (tk) => (out += tk) });
  return out;
}

async function streamClaude(config: LLMConfig, req: LLMRequest): Promise<void> {
  // requestUrl buffers the whole response; fetch is required to stream the
  // result token by token, which is the core of the panel's UX.
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      // Required to allow the request from a browser/Electron origin (CORS).
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      // Omit an empty role so a blank per-function setting sends no system.
      ...(req.system ? { system: req.system } : {}),
      stream: true,
      messages: [{ role: "user", content: req.user }],
    }),
    signal: req.signal,
  });

  await ensureOk(resp);
  await readSSE(resp, (data) => {
    if (data === "[DONE]") return;
    let evt: ClaudeStreamEvent;
    try {
      evt = JSON.parse(data) as ClaudeStreamEvent;
    } catch {
      return;
    }
    if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
      if (typeof evt.delta.text === "string") req.onToken(evt.delta.text);
    } else if (evt.type === "error") {
      throw new Error(evt.error?.message ?? "Anthropic streaming error");
    }
  });
}

async function streamOpenAI(config: LLMConfig, req: LLMRequest): Promise<void> {
  const url = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  // See streamClaude: fetch is required for token-by-token streaming.
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      stream: true,
      messages: [
        ...(req.system ? [{ role: "system", content: req.system }] : []),
        { role: "user", content: req.user },
      ],
    }),
    signal: req.signal,
  });

  await ensureOk(resp);
  await readSSE(resp, (data) => {
    if (data === "[DONE]") return;
    let evt: OpenAIStreamEvent;
    try {
      evt = JSON.parse(data) as OpenAIStreamEvent;
    } catch {
      return;
    }
    const delta = evt.choices?.[0]?.delta?.content;
    if (typeof delta === "string" && delta) req.onToken(delta);
  });
}

async function streamGemini(config: LLMConfig, req: LLMRequest): Promise<void> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}` +
    `:streamGenerateContent?alt=sse&key=${encodeURIComponent(config.apiKey)}`;
  // See streamClaude: fetch is required for token-by-token streaming.
  const resp = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      // Omit an empty role so a blank per-function setting sends no system.
      ...(req.system ? { systemInstruction: { parts: [{ text: req.system }] } } : {}),
      contents: [{ role: "user", parts: [{ text: req.user }] }],
      generationConfig: { maxOutputTokens: config.maxTokens },
    }),
    signal: req.signal,
  });

  await ensureOk(resp);
  await readSSE(resp, (data) => {
    if (data === "[DONE]") return;
    let evt: GeminiStreamEvent;
    try {
      evt = JSON.parse(data) as GeminiStreamEvent;
    } catch {
      return;
    }
    if (evt.error) throw new Error(evt.error.message ?? "Gemini streaming error");
    const text = evt.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("");
    if (text) req.onToken(text);
  });
}

async function ensureOk(resp: Response): Promise<void> {
  if (resp.ok && resp.body) return;
  let detail = "";
  try {
    detail = await resp.text();
  } catch {
    /* ignore */
  }
  throw new Error(`HTTP ${resp.status}${detail ? ": " + detail.slice(0, 600) : ""}`);
}

// Minimal Server-Sent-Events line reader shared by both providers.
// Both Anthropic and OpenAI emit `data: <json>` lines.
async function readSSE(resp: Response, onData: (data: string) => void): Promise<void> {
  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).replace(/\r$/, "").trim();
      buffer = buffer.slice(nl + 1);
      if (line.startsWith("data:")) {
        onData(line.slice(5).trim());
      }
    }
  }
}
