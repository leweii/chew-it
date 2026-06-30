import { App, PluginSettingTab, Setting, setIcon } from "obsidian";
import type ChewItPlugin from "./main";
import type { Provider } from "./llm";
import type { OutputFormat } from "./output";
import { t } from "./i18n";

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
  maxTokens: number;
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

export const DEFAULT_SETTINGS: ChewItSettings = {
  provider: "claude",
  claudeApiKey: "",
  claudeModel: "claude-opus-4-8",
  openaiApiKey: "",
  openaiBaseUrl: "https://api.openai.com/v1",
  openaiModel: "gpt-4o",
  maxTokens: 4096,
  prompts: [
    {
      id: "outline",
      label: "提炼大纲",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt:
        "请阅读下面的文档，提炼出清晰的层级大纲，用 Markdown 标题和列表组织，覆盖主要论点与整体结构。",
    },
    {
      id: "concepts",
      label: "概念解析",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt:
        "请阅读下面的文档，找出其中关键且可能难以理解的概念，逐一用通俗的语言解释清楚，必要时举例说明。",
    },
    {
      id: "distill",
      label: "原文精炼",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt:
        "请阅读下面的文档，输出精炼后的核心内容：用简洁准确的语言概括要点，去除冗余，保留关键信息与结论。",
    },
    {
      id: "translate",
      label: "翻译",
      enabled: false,
      system: DEFAULT_ROLE,
      prompt:
        "请翻译下面的文档：中文翻成英文，其他语言翻成中文。保持原意、术语与语气，输出通顺自然。",
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

  display(): void {
    const { containerEl } = this;
    // Re-rendering empties and rebuilds the whole tab, which otherwise snaps the
    // scroll back to the top. Capture the scroll position and restore it at the
    // end so adding/removing a card doesn't make the page jump.
    const scroller =
      (containerEl.closest(".vertical-tab-content") as HTMLElement | null) ?? containerEl;
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

    new Setting(containerEl)
      .setName(t(lang, "set.maxTokens"))
      .setDesc(t(lang, "set.maxTokensDesc"))
      .addText((tx) =>
        tx.setValue(String(s.maxTokens)).onChange(async (v) => {
          const n = parseInt(v, 10);
          if (!isNaN(n) && n > 0) {
            s.maxTokens = n;
            await save();
          }
        })
      );

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
