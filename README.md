# Chew It

> 中文说明见 [README.zh.md](README.zh.md)

An Obsidian plugin that **analyzes the note you're reading with an LLM** and shows the results in a side panel — without touching the original note. Open a dense document, pick the perspectives you want, click once, and get an outline, plain-language explanations of the hard concepts, and a distilled summary.

Works with **Claude (Anthropic)** and any **OpenAI-compatible** endpoint (including local Ollama and third-party proxies). You bring your own API key.

## Features

- **Sidebar panel** that streams the analysis token by token as Markdown. The original note is never modified.
- **Perspectives** shown as checkboxes — select which ones to run, then click **Chew It**. Each runs in parallel into its own browser-style result tab. Three are built in (all editable):
  - **Outline** — hierarchy and main arguments
  - **Key concepts** — finds difficult ideas and explains them simply
  - **Distill** — strips redundancy, keeps the core points and conclusions
- **Per-perspective role** — each perspective has its own optional system prompt (leave it blank to send no role).
- **Results follow the document** — analysis is saved per note and restored when you reopen the app or switch back to a note. A target button jumps back to the analyzed note.
- **Per-tab actions** via the `···` menu — regenerate just the active tab, or export just its result to a file.
- **Export** the active tab's result as a Markdown note or a Canvas (split into cards by heading); appends to an existing file if it already exists.

## Privacy / network use

Chew It sends the **full text of the current note** (including unsaved edits) to the LLM provider you configure, over HTTPS, using the API key you provide. Nothing is sent anywhere else. There is no length cap: a note longer than the model's context window is automatically split into parts, analyzed in sequential calls, and the outputs are stitched into one seamless result — mind billing on very long notes, since they cost several calls.

## Installation

### From the Community Plugins browser (once approved)

Settings → Community plugins → Browse → search **Chew It** → Install → Enable.

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest [release](../../releases).
2. Copy them into `<vault>/.obsidian/plugins/chew-it/`.
3. Reload Obsidian, then enable **Chew It** under Settings → Community plugins.

### From source

```bash
npm install
npm run build      # produces main.js
```

Copy `main.js`, `manifest.json`, and `styles.css` into your vault's `.obsidian/plugins/chew-it/` folder. Use `npm run dev` to watch and rebuild while developing.

## Usage

1. In **Settings → Chew It**, choose a provider and enter your API key (for OpenAI-compatible endpoints, also set the base URL and model name).
2. Open a Markdown note.
3. Click the ✨ ribbon icon, or run the command **Analyze current note**. The panel opens on the right.
4. Tick the perspectives you want and click **Chew It**. Switch result tabs to read each one.
5. Use the `···` menu on a tab to regenerate it or export its result.

## Configuration

Everything is editable in **Settings → Chew It**:

- **Provider** — Claude (Anthropic), default model `claude-opus-4-8`; or an OpenAI-compatible endpoint with a custom base URL and model.
- **Perspectives** — add, rename, enable/disable, and edit each one's role and prompt.
- **Output templates** — configure export targets (Markdown / Canvas), destination folder, and filename template (placeholders: `{note}` `{label}` `{date}` `{datetime}`).

The interface language (English / 中文) follows your Obsidian display language automatically.

Token limits are handled automatically — long notes are split into multiple calls and stitched back together; there is nothing to configure.

## Support

If Chew It saves you time, you can [buy me a coffee on Ko-fi](https://ko-fi.com/jakobhe) ☕

## License

[MIT](LICENSE)
