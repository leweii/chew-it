import { App, Modal, Notice, PluginSettingTab, Setting, setIcon, setTooltip } from "obsidian";
import type ChewItPlugin from "./main";
import { completeText, type LLMConfig, type Provider } from "./llm";
import type { OutputFormat } from "./output";
import { t, type Lang } from "./i18n";

export interface PromptPreset {
  id: string;
  label: string;
  prompt: string;
  // Per-function role / system prompt. Blank (or undefined) sends no role.
  system?: string;
  // When false, the function is kept but excluded from analysis runs.
  // Undefined is treated as enabled (back-compat with pre-toggle settings).
  enabled?: boolean;
}

export interface OutputPreset {
  id: string;
  label: string;
  format: OutputFormat;
  folder: string;
  filename: string;
}

export interface ChewItSettings {
  provider: Provider;
  claudeApiKey: string;
  claudeModel: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  openaiModel: string;
  geminiApiKey: string;
  geminiModel: string;
  // Legacy global role, kept only to migrate into per-function roles.
  systemPrompt?: string;
  prompts: PromptPreset[];
  outputs: OutputPreset[];
}

// The default role seeded into the built-in functions.
export const DEFAULT_ROLE =
  "你是一位善于讲解的导师，擅长把复杂材料拆解成清晰、准确、易懂的中文说明。回答使用 Markdown 排版。";

export function newPresetId(): string {
  return "fn-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Quick-fill presets for popular OpenAI-compatible endpoints, mainly
// domestic open-weight model providers. Picking one just fills in the Base
// URL and model fields below; the API key still has to be entered by hand.
interface OpenAIPreset {
  id: string;
  label: string;
  baseUrl: string;
  model: string;
}

export const OPENAI_PRESETS: OpenAIPreset[] = [
  { id: "deepseek", label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" },
  {
    id: "qwen",
    label: "阿里云百炼 / 通义千问 (Qwen)",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
  },
  { id: "glm", label: "智谱 GLM", baseUrl: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4-plus" },
  { id: "kimi", label: "月之暗面 Kimi (Moonshot AI)", baseUrl: "https://api.moonshot.cn/v1", model: "moonshot-v1-8k" },
  {
    id: "siliconflow",
    label: "硅基流动 SiliconFlow",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "deepseek-ai/DeepSeek-V3",
  },
  { id: "minimax", label: "MiniMax", baseUrl: "https://api.minimax.chat/v1", model: "abab6.5s-chat" },
  { id: "ollama", label: "本地 Ollama", baseUrl: "http://localhost:11434/v1", model: "qwen2.5" },
];

// Shared with the panel view, which streams analyses using the same config.
export function buildLLMConfig(s: ChewItSettings): LLMConfig | null {
  const config: LLMConfig =
    s.provider === "claude"
      ? { provider: "claude", apiKey: s.claudeApiKey, model: s.claudeModel, baseUrl: "" }
      : s.provider === "gemini"
        ? { provider: "gemini", apiKey: s.geminiApiKey, model: s.geminiModel, baseUrl: "" }
        : {
            provider: "openai",
            apiKey: s.openaiApiKey,
            model: s.openaiModel,
            baseUrl: s.openaiBaseUrl,
          };
  return config.apiKey ? config : null;
}

export const DEFAULT_SETTINGS: ChewItSettings = {
  provider: "claude",
  claudeApiKey: "",
  claudeModel: "claude-opus-4-8",
  openaiApiKey: "",
  openaiBaseUrl: "https://api.openai.com/v1",
  openaiModel: "gpt-4o",
  geminiApiKey: "",
  geminiModel: "gemini-2.5-flash",
  prompts: [
    {
      id: "outline",
      label: "提炼大纲",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt: "",
    },
    {
      id: "concepts",
      label: "概念解析",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt: "",
    },
    {
      id: "distill",
      label: "原文精炼",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt: "",
    },
    {
      id: "translate",
      label: "翻译",
      enabled: false,
      system: DEFAULT_ROLE,
      prompt: "",
    },
  ],
  outputs: [
    {
      id: "out-md",
      label: "导出 Markdown",
      format: "markdown",
      folder: "Chew It Output",
      filename: "{note} - {label}",
    },
    {
      id: "out-canvas",
      label: "导出 Canvas",
      format: "canvas",
      folder: "Chew It Output",
      filename: "{note} - {label}",
    },
  ],
};

// Best-effort parse of the JSON the model is asked to return when generating
// a preset. Returns null on any mismatch so the caller can fall back to
// treating the raw text as the prompt.
function parseGeneratedPreset(raw: string): { system: string; prompt: string } | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\n?/, "")
    .replace(/```$/, "")
    .trim();
  try {
    const obj = JSON.parse(cleaned) as { system?: unknown; prompt?: unknown };
    if (typeof obj.prompt === "string") {
      return { system: typeof obj.system === "string" ? obj.system : "", prompt: obj.prompt };
    }
  } catch {
    /* fall through */
  }
  return null;
}

// Small yes/no dialog used to confirm overwriting an existing prompt/role
// before generating a fresh one.
class ConfirmModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private message: string,
    private confirmText: string,
    private cancelText: string,
    private onResult: (v: boolean) => void
  ) {
    super(app);
  }

  onOpen(): void {
    this.contentEl.createEl("p", { text: this.message });
    new Setting(this.contentEl)
      .addButton((b) => b.setButtonText(this.cancelText).onClick(() => this.finish(false)))
      .addButton((b) => b.setButtonText(this.confirmText).setCta().onClick(() => this.finish(true)));
  }

  onClose(): void {
    this.contentEl.empty();
    // Dismissing without clicking a button (Escape, click-outside) counts as cancel.
    if (!this.resolved) this.onResult(false);
  }

  private finish(v: boolean): void {
    this.resolved = true;
    this.onResult(v);
    this.close();
  }
}

function confirmDialog(app: App, message: string, confirmText: string, cancelText: string): Promise<boolean> {
  return new Promise((resolve) => {
    new ConfirmModal(app, message, confirmText, cancelText, resolve).open();
  });
}

export class ChewItSettingTab extends PluginSettingTab {
  plugin: ChewItPlugin;

  // Which collapsible cards are expanded, by preset id. Persists across the
  // display() rebuilds that fire when a control inside a card changes.
  private openGroups = new Set<string>();

  constructor(app: App, plugin: ChewItPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  // Restore a card's open state and keep tracking it as the user toggles.
  private bindGroupOpenState(block: HTMLDetailsElement, id: string): void {
    block.open = this.openGroups.has(id);
    block.addEventListener("toggle", () => {
      if (block.open) this.openGroups.add(id);
      else this.openGroups.delete(id);
    });
  }

  // Ask the LLM to fill in a preset's role + prompt from its name alone.
  private async generatePreset(p: PromptPreset, lang: Lang): Promise<void> {
    const name = p.label.trim();
    if (!name) {
      new Notice(t(lang, "notice.genPromptNeedName"));
      return;
    }
    const config = buildLLMConfig(this.plugin.settings);
    if (!config) {
      new Notice(t(lang, "notice.needKey"));
      return;
    }
    const hasContent = p.prompt.trim().length > 0 || (p.system ?? "").trim().length > 0;
    if (hasContent) {
      const ok = await confirmDialog(
        this.app,
        t(lang, "notice.genPromptConfirm"),
        t(lang, "ui.confirm"),
        t(lang, "ui.cancel")
      );
      if (!ok) return;
    }
    try {
      const raw = await completeText(config, {
        system: t(lang, "prompt.genSystem"),
        user: t(lang, "prompt.genUser", { name }),
        signal: new AbortController().signal,
      });
      const parsed = parseGeneratedPreset(raw);
      if (parsed) {
        p.system = parsed.system;
        p.prompt = parsed.prompt;
      } else {
        p.prompt = raw.trim();
      }
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
      this.display();
    } catch (e) {
      new Notice(t(lang, "notice.error", { msg: String((e as Error).message ?? e) }));
    }
  }

  display(): void {
    const { containerEl } = this;
    // Re-rendering empties and rebuilds the whole tab, which otherwise snaps the
    // scroll back to the top. Capture the scroll position and restore it at the
    // end so adding/removing a card doesn't make the page jump.
    const scroller = containerEl.closest<HTMLElement>(".vertical-tab-content") ?? containerEl;
    const prevScroll = scroller.scrollTop;
    containerEl.empty();
    const s = this.plugin.settings;
    const lang = this.plugin.currentLang();
    const save = () => this.plugin.saveSettings();

    // ---- Provider ----------------------------------------------------------
    new Setting(containerEl).setName(t(lang, "set.providerHeading")).setHeading();

    new Setting(containerEl)
      .setName(t(lang, "set.provider"))
      .addDropdown((d) =>
        d
          .addOption("claude", "Claude (Anthropic)")
          .addOption("openai", "OpenAI")
          .addOption("gemini", "Gemini (Google)")
          .setValue(s.provider)
          .onChange(async (v) => {
            s.provider = v as Provider;
            await save();
            this.display();
          })
      );

    if (s.provider === "claude") {
      new Setting(containerEl).setName(t(lang, "set.claudeKey")).addText((tx) => {
        tx.inputEl.type = "password";
        tx.setPlaceholder("sk-ant-...")
          .setValue(s.claudeApiKey)
          .onChange(async (v) => {
            s.claudeApiKey = v.trim();
            await save();
          });
      });
      new Setting(containerEl)
        .setName(t(lang, "set.model"))
        .setDesc(t(lang, "set.modelClaudeDesc"))
        .addText((tx) =>
          tx.setValue(s.claudeModel).onChange(async (v) => {
            s.claudeModel = v.trim() || "claude-opus-4-8";
            await save();
          })
        );
    } else if (s.provider === "gemini") {
      new Setting(containerEl).setName(t(lang, "set.geminiKey")).addText((tx) => {
        tx.inputEl.type = "password";
        tx.setPlaceholder("AIza...")
          .setValue(s.geminiApiKey)
          .onChange(async (v) => {
            s.geminiApiKey = v.trim();
            await save();
          });
      });
      new Setting(containerEl)
        .setName(t(lang, "set.model"))
        .setDesc(t(lang, "set.modelGeminiDesc"))
        .addText((tx) =>
          tx.setValue(s.geminiModel).onChange(async (v) => {
            s.geminiModel = v.trim() || "gemini-2.5-flash";
            await save();
          })
        );
    } else {
      new Setting(containerEl).setName(t(lang, "set.openaiKey")).addText((tx) => {
        tx.inputEl.type = "password";
        tx.setPlaceholder("sk-...")
          .setValue(s.openaiApiKey)
          .onChange(async (v) => {
            s.openaiApiKey = v.trim();
            await save();
          });
      });
      new Setting(containerEl)
        .setName(t(lang, "set.openaiPreset"))
        .setDesc(t(lang, "set.openaiPresetDesc"))
        .addDropdown((d) => {
          d.addOption("", t(lang, "set.openaiPresetPlaceholder"));
          for (const p of OPENAI_PRESETS) d.addOption(p.id, p.label);
          d.setValue("").onChange(async (v) => {
            const preset = OPENAI_PRESETS.find((p) => p.id === v);
            if (!preset) return;
            s.openaiBaseUrl = preset.baseUrl;
            s.openaiModel = preset.model;
            await save();
            this.display();
          });
        });
      new Setting(containerEl)
        .setName(t(lang, "set.baseUrl"))
        .setDesc(t(lang, "set.baseUrlDesc"))
        .addText((tx) =>
          tx.setValue(s.openaiBaseUrl).onChange(async (v) => {
            s.openaiBaseUrl = v.trim().replace(/\/$/, "") || "https://api.openai.com/v1";
            await save();
          })
        );
      new Setting(containerEl)
        .setName(t(lang, "set.model"))
        .addText((tx) =>
          tx.setValue(s.openaiModel).onChange(async (v) => {
            s.openaiModel = v.trim() || "gpt-4o";
            await save();
          })
        );
    }

    // ---- Functions (tabs) --------------------------------------------------
    new Setting(containerEl)
      .setName(t(lang, "set.fnHeading"))
      .setHeading()
      .addButton((b) =>
        b
          .setButtonText(t(lang, "set.addFn"))
          .setCta()
          .onClick(async () => {
            const id = newPresetId();
            s.prompts.push({ id, label: t(lang, "set.newFn"), prompt: "", enabled: true });
            this.openGroups.add(id);
            await save();
            this.plugin.refreshViews();
            this.display();
          })
      );

    s.prompts.forEach((p, i) => {
      const block = containerEl.createEl("details", { cls: "chew-it-group" });
      this.bindGroupOpenState(block, p.id);
      block.toggleClass("is-disabled", p.enabled === false);

      // Title row: label on the left, delete on the right.
      const summary = block.createEl("summary", { cls: "chew-it-group-summary" });
      const sumLabel = summary.createSpan({
        cls: "chew-it-group-title",
        text: `${i + 1}. ${p.label || t(lang, "ui.untitled")}`,
      });
      const gen = summary.createEl("button", { cls: "chew-it-group-gen" });
      setIcon(gen, "sparkles");
      setTooltip(gen, t(lang, "set.genPrompt"));
      gen.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        gen.disabled = true;
        gen.addClass("is-generating");
        setIcon(gen, "loader-2");
        setTooltip(gen, t(lang, "set.genPromptGenerating"));
        try {
          await this.generatePreset(p, lang);
        } finally {
          gen.disabled = false;
          gen.removeClass("is-generating");
          setIcon(gen, "sparkles");
          setTooltip(gen, t(lang, "set.genPrompt"));
        }
      };

      const del = summary.createEl("button", { cls: "chew-it-group-del" });
      setIcon(del, "trash");
      del.setAttribute("aria-label", t(lang, "set.delFn"));
      del.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        s.prompts.splice(i, 1);
        await save();
        this.plugin.refreshViews();
        this.display();
      };

      new Setting(block)
        .setName(t(lang, "set.outName"))
        .addText((tx) =>
          tx
            .setPlaceholder(t(lang, "set.tabNamePlaceholder"))
            .setValue(p.label)
            .onChange(async (v) => {
              p.label = v;
              sumLabel.setText(`${i + 1}. ${v || t(lang, "ui.untitled")}`);
              await save();
              this.plugin.refreshViews();
            })
        )
        .addToggle((tg) =>
          tg
            .setTooltip(t(lang, "set.fnEnabled"))
            .setValue(p.enabled !== false)
            .onChange(async (v) => {
              p.enabled = v;
              await save();
              this.plugin.refreshViews();
              this.display();
            })
        );

      new Setting(block).setName(t(lang, "set.fnSystem")).addTextArea((tx) => {
        tx.setPlaceholder(t(lang, "set.fnSystemPlaceholder"))
          .setValue(p.system ?? "")
          .onChange(async (v) => {
            p.system = v;
            await save();
          });
        tx.inputEl.rows = 2;
        tx.inputEl.addClass("chew-it-textarea");
      });

      new Setting(block).setName(t(lang, "set.prompt")).addTextArea((tx) => {
        tx.setValue(p.prompt).onChange(async (v) => {
          p.prompt = v;
          await save();
        });
        tx.inputEl.rows = 4;
        tx.inputEl.addClass("chew-it-textarea");
      });
    });

    // ---- Outputs -----------------------------------------------------------
    new Setting(containerEl)
      .setName(t(lang, "set.outHeading"))
      .setHeading()
      .addButton((b) =>
        b
          .setButtonText(t(lang, "set.addOut"))
          .setCta()
          .onClick(async () => {
            const id = newPresetId();
            s.outputs.push({
              id,
              label: t(lang, "set.newOut"),
              format: "markdown",
              folder: "Chew It Output",
              filename: "{note} - {label}",
            });
            this.openGroups.add(id);
            await save();
            this.plugin.refreshViews();
            this.display();
          })
      );

    s.outputs.forEach((o, i) => {
      const block = containerEl.createEl("details", { cls: "chew-it-group" });
      this.bindGroupOpenState(block, o.id);

      // Title row: label on the left, delete on the right.
      const summary = block.createEl("summary", { cls: "chew-it-group-summary" });
      const sumLabel = summary.createSpan({
        cls: "chew-it-group-title",
        text: `${i + 1}. ${o.label || t(lang, "ui.untitled")}`,
      });
      const del = summary.createEl("button", { cls: "chew-it-group-del" });
      setIcon(del, "trash");
      del.setAttribute("aria-label", t(lang, "set.delOut"));
      del.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        s.outputs.splice(i, 1);
        await save();
        this.plugin.refreshViews();
        this.display();
      };

      new Setting(block)
        .setName(t(lang, "set.outName"))
        .addText((tx) =>
          tx
            .setPlaceholder(t(lang, "set.outNamePlaceholder"))
            .setValue(o.label)
            .onChange(async (v) => {
              o.label = v;
              sumLabel.setText(`${i + 1}. ${v || t(lang, "ui.untitled")}`);
              await save();
              this.plugin.refreshViews();
            })
        );

      new Setting(block).setName(t(lang, "set.outFormat")).addDropdown((d) =>
        d
          .addOption("markdown", "Markdown")
          .addOption("canvas", "Canvas")
          .setValue(o.format)
          .onChange(async (v) => {
            o.format = v as OutputFormat;
            await save();
          })
      );

      new Setting(block)
        .setName(t(lang, "set.outFolder"))
        .setDesc(t(lang, "set.outFolderDesc"))
        .addText((tx) =>
          tx.setValue(o.folder).onChange(async (v) => {
            o.folder = v.trim();
            await save();
          })
        );

      new Setting(block)
        .setName(t(lang, "set.outFilename"))
        .setDesc(t(lang, "set.outFilenameDesc"))
        .addText((tx) =>
          tx.setValue(o.filename).onChange(async (v) => {
            o.filename = v;
            await save();
          })
        );
    });

    scroller.scrollTop = prevScroll;
  }
}
