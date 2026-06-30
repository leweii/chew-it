// Pure helpers for the output feature (file naming, Canvas wrapping).

export type OutputFormat = "markdown" | "canvas";
export type OutputMode = "llm" | "raw";

export function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[\\/:*?"<>|#^[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Untitled"
  );
}

function pad(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

export function formatDate(withTime: boolean): string {
  const d = new Date();
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (!withTime) return date;
  return `${date} ${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

export function applyFilenameTemplate(
  tpl: string,
  vars: { note: string; label: string }
): string {
  const out = (tpl && tpl.trim() ? tpl : "{note} - {label}")
    .replace(/\{note\}/g, vars.note)
    .replace(/\{label\}/g, vars.label)
    .replace(/\{datetime\}/g, formatDate(true))
    .replace(/\{date\}/g, formatDate(false));
  return sanitizeFilename(out);
}

export function extFor(format: OutputFormat): string {
  return format === "canvas" ? ".canvas" : ".md";
}

function randomId(): string {
  const chars = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 16; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}

const CARD_WIDTH = 500;
const CARD_GAP = 40;

function nodeHeight(text: string): number {
  return Math.min(2400, Math.max(160, text.split("\n").length * 22 + 40));
}

// Split markdown into card-sized chunks: each top-level (# or ##) heading starts
// a new card and carries its body until the next such heading. Any text before
// the first heading becomes its own card. No headings → a single card.
export function splitIntoCards(md: string): string[] {
  const text = md.trim();
  if (!text) return [];
  const isHeading = (l: string) => /^#{1,2}\s+\S/.test(l);
  const cards: string[] = [];
  let cur: string[] = [];
  const flush = () => {
    const chunk = cur.join("\n").trim();
    if (chunk) cards.push(chunk);
    cur = [];
  };
  for (const line of text.split("\n")) {
    if (isHeading(line) && cur.some((l) => l.trim() !== "")) flush();
    cur.push(line);
  }
  flush();
  return cards.length ? cards : [text];
}

function cardNode(text: string, y: number) {
  return { id: randomId(), type: "text", text, x: 0, y, width: CARD_WIDTH, height: nodeHeight(text) };
}

function stackCards(cards: string[], startY: number): { nodes: ReturnType<typeof cardNode>[]; nextY: number } {
  const nodes: ReturnType<typeof cardNode>[] = [];
  let y = startY;
  for (const c of cards) {
    nodes.push(cardNode(c, y));
    y += nodeHeight(c) + CARD_GAP;
  }
  return { nodes, nextY: y };
}

// Build a Canvas file from markdown, one card per heading section.
export function toCanvas(text: string): string {
  const { nodes } = stackCards(splitIntoCards(text), 0);
  return JSON.stringify({ nodes, edges: [] }, null, 2);
}

// Append new cards (one per heading section) below the existing nodes of a
// Canvas file. Falls back to a fresh canvas if the file isn't parseable canvas.
export function appendToCanvas(existing: string, text: string): string {
  const cards = splitIntoCards(text);
  let data: { nodes?: unknown[]; edges?: unknown[] };
  try {
    data = JSON.parse(existing);
  } catch {
    return toCanvas(text);
  }
  if (!data || !Array.isArray(data.nodes)) return toCanvas(text);

  let maxBottom = 0;
  for (const n of data.nodes as Array<{ y?: number; height?: number }>) {
    const bottom = (typeof n.y === "number" ? n.y : 0) + (typeof n.height === "number" ? n.height : 0);
    if (bottom > maxBottom) maxBottom = bottom;
  }
  const { nodes } = stackCards(cards, maxBottom + CARD_GAP);
  data.nodes.push(...nodes);
  if (!Array.isArray(data.edges)) data.edges = [];
  return JSON.stringify(data, null, 2);
}
