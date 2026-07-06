// Token estimation and note chunking for long documents.
// When a note exceeds the model's context window, it is split into parts at
// paragraph boundaries and sent to the model in sequential calls; the view
// stitches the outputs back together.

// Rough token estimate without a real tokenizer: CJK characters run ~1 token
// each (slightly over-counted to stay safe), everything else ~3.5 chars/token.
const CJK_RE = /[\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/;

export function estimateTokens(text: string): number {
  let cjk = 0;
  let total = 0;
  for (const ch of text) {
    total++;
    if (CJK_RE.test(ch)) cjk++;
  }
  return Math.ceil(cjk * 1.2 + (total - cjk) / 3.5);
}

// Split `text` into pieces that each estimate to at most `maxTokens`.
// Prefers paragraph boundaries, falls back to line boundaries, and only
// hard-slices when a single line alone exceeds the budget.
export function splitIntoChunks(text: string, maxTokens: number): string[] {
  if (estimateTokens(text) <= maxTokens) return [text];

  const chunks: string[] = [];
  let current = "";

  const push = () => {
    if (current.trim()) chunks.push(current);
    current = "";
  };

  const add = (piece: string) => {
    if (current && estimateTokens(current + piece) > maxTokens) push();
    current += piece;
  };

  // Paragraphs, keeping their trailing blank lines attached.
  for (const para of text.split(/(?<=\n\s*\n)/)) {
    if (estimateTokens(para) <= maxTokens) {
      add(para);
      continue;
    }
    // A single paragraph over budget: fall back to lines.
    for (const line of para.split(/(?<=\n)/)) {
      if (estimateTokens(line) <= maxTokens) {
        add(line);
        continue;
      }
      // A single line over budget: hard-slice. Worst case (pure CJK) our
      // estimate is 1.2 tokens per char, so this slice always fits.
      push();
      const step = Math.max(200, Math.floor(maxTokens / 1.2));
      const cps = Array.from(line);
      for (let i = 0; i < cps.length; i += step) {
        chunks.push(cps.slice(i, i + step).join(""));
      }
    }
  }
  push();
  return chunks;
}

// The tail of the already-generated output, passed to the next call so the
// model can continue seamlessly (heading levels, numbering, tone).
export function outputTail(raw: string, maxChars = 1500): string {
  const trimmed = raw.trimEnd();
  if (trimmed.length <= maxChars) return trimmed;
  return "…" + trimmed.slice(-maxChars);
}
