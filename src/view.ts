import { ItemView, MarkdownRenderer, Menu, Notice, setIcon, WorkspaceLeaf } from "obsidian";
import type ChewItPlugin from "./main";
import { streamCompletion, type LLMConfig } from "./llm";
import { t } from "./i18n";
import type { PromptPreset } from "./settings";
import { appendToCanvas, applyFilenameTemplate, extFor, toCanvas } from "./output";

export const VIEW_TYPE_CHEW_IT = "chew-it-view";

// Claude Code-style anthropomorphic "waiting" verbs, shown while a run streams.
const WAITING_WORDS = [
  "Accomplishing", "Actualizing", "Baking", "Beaming", "Beboppin", "Befuddling",
  "Billowing", "Bloviating", "Boogieing", "Boondoggling", "Bootstrapping", "Booping",
  "Brewing", "Burrowing", "Calculating", "Caramelizing", "Cascading", "Cerebrating",
  "Channelling", "Choreographing", "Churning", "Clauding", "Coalescing", "Cogitating",
  "Composing", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting",
  "Creating", "Crunching", "Crystallizing", "Cultivating", "Deciphering", "Deliberating",
  "Determining", "Discombobulating", "Distilling", "Doodling", "Effecting", "Elucidating",
  "Embellishing", "Enchanting", "Envisioning", "Fermenting", "Finagling", "Flambéing",
  "Flowing", "Forging", "Forming", "Frosting", "Frolicking", "Gallivanting", "Generating",
  "Germinating", "Grooving", "Hatching", "Herding", "Hyperspacing", "Ideating", "Imagining",
  "Incubating", "Inferring", "Infusing", "Julienning", "Kneading", "Leavening", "Levitating",
  "Lollygagging", "Manifesting", "Marinating", "Meandering", "Moseying", "Mulling", "Mustering",
  "Musing", "Noodling", "Nucleating", "Orbiting", "Percolating", "Perusing", "Philosophising",
  "Photosynthesizing", "Pondering", "Pollinating", "Precipitating", "Processing", "Proofing",
  "Propagating", "Puttering", "Puzzling", "Quantumizing", "Recombobulating", "Reticulating",
  "Ruminating", "Scheming", "Scurrying", "Scampering", "Seasoning", "Shimmying", "Simmering",
  "Sketching", "Slithering", "Spelunking", "Spinning", "Sprouting", "Stewing", "Sublimating",
  "Sussing", "Swooping", "Swirling", "Synthesizing", "Tempering", "Thinking", "Tinkering",
  "Transfiguring", "Transmuting", "Unfurling", "Unravelling", "Vibing", "Wandering", "Whirring",
  "Whisking", "Working", "Wrangling", "Zesting", "Zigzagging",
];

// One concurrent analysis stream: its own abort handle, result tab and body.
interface Run {
  id: string;
  label: string;
  prompt: string; // the prompt this tab was generated from, so it can re-run itself
  system: string; // the role/system prompt this tab used (may be empty)
  controller: AbortController;
  raw: string;
  state: string; // "" | "is-done" | "is-error" — the tab's final css state
  tabEl: HTMLElement;
  containerEl: HTMLElement;
  statusEl: HTMLElement;
  bodyEl: HTMLElement;
  renderQueued: boolean;
}

// The last generation, persisted so results survive an app restart.
export interface ChewItResultCache {
  noteTitle: string;
  status: string;
  presetIds: string[];
  updatedAt?: number;
  runs: { id: string; label: string; prompt: string; system: string; raw: string; state: string; status: string }[];
}

export class ChewItView extends ItemView {
  plugin: ChewItPlugin;

  private tabsEl!: HTMLElement;
  private runBtn!: HTMLButtonElement;
  private stopBtn!: HTMLButtonElement;
  private statusIconEl!: HTMLElement;
  private statusEl!: HTMLElement;
  private resultsHeader!: HTMLElement;
  private locateBtn!: HTMLButtonElement;
  private resultTabsEl!: HTMLElement;
  private menuBtn!: HTMLButtonElement;
  private resultEl!: HTMLElement;

  private runs: Run[] = [];
  private running = false;

  // The tab the "···" menu acts on (regenerate / export).
  private activeRun: Run | null = null;
  // Abort handle for an export-mode LLM call (which has no result tab).
  private extraAbort: AbortController | null = null;

  // Function ids the user has unchecked; everything else is selected by
  // default. "Chew It" analyzes only the currently selected functions.
  private deselected = new Set<string>();

  // The presets / note behind the currently shown results, so "Regenerate"
  // can reproduce them (and so we can persist them across restarts).
  private lastPresetIds: string[] = [];
  private lastNoteTitle = "";

  // Path of the note whose results the panel is currently showing.
  private currentPath: string | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: ChewItPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_CHEW_IT;
  }

  getDisplayText(): string {
    return "Chew It";
  }

  getIcon(): string {
    return "sparkles";
  }

  async onOpen(): Promise<void> {
    const root = this.contentEl;
    root.empty();
    root.addClass("chew-it-view");

    // Header row: the clickable "Chew It" brand is the primary action (run
    // every function); each enabled function sits beside it as a chip you can
    // run on its own.
    const header = root.createDiv("chew-it-header");
    this.runBtn = header.createEl("button", { cls: "chew-it-brand" });
    const brandIcon = this.runBtn.createSpan({ cls: "chew-it-brand-icon" });
    setIcon(brandIcon, "sparkles");
    this.runBtn.createSpan({ cls: "chew-it-brand-text", text: "Chew It" });
    this.runBtn.onclick = () => this.runAnalysis();

    // Function checkboxes share the brand's row.
    this.tabsEl = header.createDiv("chew-it-tabs");

    // Results header: a browser-style tab strip plus a "···" menu that acts on
    // the active tab — regenerate just that function, or export just its result.
    this.resultsHeader = root.createDiv("chew-it-results-header");
    // A target button on the left jumps back to the analyzed note.
    this.locateBtn = this.resultsHeader.createEl("button", { cls: "chew-it-locate-btn" });
    setIcon(this.locateBtn, "target");
    this.locateBtn.onclick = () => this.locateNote();
    this.resultTabsEl = this.resultsHeader.createDiv("chew-it-result-tabs");
    this.menuBtn = this.resultsHeader.createEl("button", { cls: "chew-it-menu-btn" });
    setIcon(this.menuBtn, "more-horizontal");
    this.menuBtn.onclick = (e) => this.showActionsMenu(e);
    this.resultsHeader.hide();

    this.resultEl = root.createDiv("chew-it-result");

    // Status bar pinned to the bottom-left; stop tucks to its right mid-run.
    const statusBar = root.createDiv("chew-it-statusbar");
    this.statusIconEl = statusBar.createSpan({ cls: "chew-it-status-icon" });
    setIcon(this.statusIconEl, "loader-2");
    this.statusIconEl.hide();
    this.statusEl = statusBar.createDiv("chew-it-status");
    this.stopBtn = statusBar.createEl("button", { cls: "chew-it-stop" });
    this.stopBtn.onclick = () => this.stopAll();
    this.stopBtn.hide();

    this.localize();

    // Show the active document's saved results so reopening isn't a blank slate.
    this.showNoteResults(this.plugin.currentNotePath(), true);
  }

  async onClose(): Promise<void> {
    this.stopAll();
  }

  private lang() {
    return this.plugin.currentLang();
  }

  // A random Claude Code-style waiting verb for the status bar while running.
  private waitingWord(): string {
    return WAITING_WORDS[Math.floor(Math.random() * WAITING_WORDS.length)] + "…";
  }

  // Re-apply language to static UI and rebuild the function chips.
  localize(): void {
    if (!this.tabsEl) return;
    const lang = this.lang();
    this.runBtn.setAttribute("aria-label", t(lang, "ui.analyze"));
    this.runBtn.title = t(lang, "ui.analyze");
    this.stopBtn.setText(t(lang, "ui.stop"));
    this.menuBtn.setAttribute("aria-label", t(lang, "ui.actions"));
    this.menuBtn.title = t(lang, "ui.actions");
    this.locateBtn.setAttribute("aria-label", t(lang, "ui.locate"));
    this.locateBtn.title = t(lang, "ui.locate");
    if (!this.running && this.runs.length === 0) this.statusEl.setText(t(lang, "ui.ready"));
    this.buildTabs();
    this.updateMenuBtn();
  }

  // Backwards-compatible alias used by the plugin's refreshViews().
  refreshTabs(): void {
    this.localize();
  }

  // Functions that participate in a run: enabled (undefined = enabled).
  private enabledPrompts(): PromptPreset[] {
    return this.plugin.settings.prompts.filter((p) => p.enabled !== false);
  }

  // The enabled functions the user currently has checked.
  private selectedPresets(): PromptPreset[] {
    return this.enabledPrompts().filter((p) => !this.deselected.has(p.id));
  }

  private buildTabs(): void {
    this.tabsEl.empty();
    const prompts = this.enabledPrompts();
    const lang = this.lang();

    if (prompts.length === 0) {
      this.runBtn.disabled = true;
      this.tabsEl.createSpan({ cls: "chew-it-tabs-empty", text: t(lang, "ui.tabsEmpty") });
      return;
    }

    // Each function is a checkbox, selected by default; "Chew It" runs the set.
    for (const p of prompts) {
      const label = p.label || t(lang, "ui.untitled");
      const on = !this.deselected.has(p.id);
      const chip = this.tabsEl.createEl("button", { cls: "chew-it-chip" });
      chip.toggleClass("is-selected", on);
      chip.setAttribute("role", "checkbox");
      chip.setAttribute("aria-checked", String(on));
      chip.setAttribute("aria-label", label);
      const box = chip.createSpan({ cls: "chew-it-chip-check" });
      setIcon(box, "check");
      chip.createSpan({ cls: "chew-it-chip-label", text: label });
      chip.onclick = () => this.toggleSelection(p.id, chip);
    }
    this.updateRunBtn();
  }

  private toggleSelection(id: string, chip: HTMLElement): void {
    if (this.deselected.has(id)) this.deselected.delete(id);
    else this.deselected.add(id);
    const on = !this.deselected.has(id);
    chip.toggleClass("is-selected", on);
    chip.setAttribute("aria-checked", String(on));
    this.updateRunBtn();
  }

  // "Chew It" is live only when idle and at least one function is checked.
  private updateRunBtn(): void {
    this.runBtn.disabled = this.running || this.selectedPresets().length === 0;
  }

  // The actions button only matters once there's a result to act on.
  private updateMenuBtn(): void {
    this.menuBtn.toggle(!this.running && this.runs.length > 0);
  }

  // Jump back to the note these results belong to.
  private async locateNote(): Promise<void> {
    if (!this.currentPath) return;
    const ok = await this.plugin.revealNote(this.currentPath);
    if (!ok) new Notice(t(this.lang(), "notice.noteGone"));
  }

  // Tab-level "···" dropdown: every action targets the active tab — regenerate
  // just that function, or export just its result via an output template.
  private showActionsMenu(evt: MouseEvent): void {
    const lang = this.lang();
    const menu = new Menu();

    menu.addItem((item) =>
      item
        .setTitle(t(lang, "ui.regenerate"))
        .setIcon("refresh-cw")
        .onClick(() => void this.regenerateActive())
    );

    const outs = this.plugin.settings.outputs;
    if (outs.length > 0) {
      menu.addSeparator();
      menu.addItem((item) => {
        item.setTitle(t(lang, "ui.output"));
        // setIsLabel is a newer API; degrade to a plain disabled item if absent.
        if (typeof item.setIsLabel === "function") item.setIsLabel(true);
        else item.setDisabled(true);
      });
      for (const o of outs) {
        menu.addItem((item) =>
          item
            .setTitle(o.label || t(lang, "ui.untitled"))
            .setIcon(o.format === "canvas" ? "layout-dashboard" : "download")
            .onClick(() => void this.runOutput(o.id))
        );
      }
    }

    menu.showAtMouseEvent(evt);
  }

  // Re-run the active tab's function in place, leaving the other tabs untouched.
  private async regenerateActive(): Promise<void> {
    if (this.running) return;
    const run = this.activeRun;
    if (!run) return;

    const lang = this.lang();
    // The tab carries its own prompt + role; only fall back to the settings
    // lookup for results cached before they were stored on the tab.
    let prompt = run.prompt;
    let system = run.system;
    if (!prompt) {
      const preset = this.plugin.settings.prompts.find((p) => p.id === run.id || p.label === run.label);
      prompt = preset?.prompt ?? "";
      system = preset?.system ?? "";
    }
    if (!prompt) {
      new Notice(t(lang, "notice.cannotRegen"));
      return;
    }
    const config = this.buildConfig();
    if (!config) {
      new Notice(t(lang, "notice.needKey"));
      return;
    }
    const note = await this.plugin.getActiveNoteContent();
    if (!note) {
      new Notice(t(lang, "notice.noNote"));
      return;
    }
    if (!note.content.trim()) {
      new Notice(t(lang, "notice.empty"));
      return;
    }

    run.prompt = prompt;
    run.system = system;
    this.currentPath = note.path;
    this.lastNoteTitle = note.title;
    this.setActiveRun(run);
    this.setRunning(true);
    this.statusEl.setText(this.waitingWord());
    await this.runPresetInto(run, prompt, system, config, note, lang);
    this.setRunning(false);
    this.snapshotResults();
  }

  private stopAll(): void {
    for (const r of this.runs) r.controller.abort();
    this.extraAbort?.abort();
  }

  private buildConfig(): LLMConfig | null {
    const s = this.plugin.settings;
    const config: LLMConfig =
      s.provider === "claude"
        ? {
            provider: "claude",
            apiKey: s.claudeApiKey,
            model: s.claudeModel,
            baseUrl: "",
            maxTokens: s.maxTokens,
          }
        : {
            provider: "openai",
            apiKey: s.openaiApiKey,
            model: s.openaiModel,
            baseUrl: s.openaiBaseUrl,
            maxTokens: s.maxTokens,
          };
    return config.apiKey ? config : null;
  }

  // Reset the result area for a fresh generation.
  private beginGeneration(): void {
    this.resultEl.empty();
    this.resultTabsEl.empty();
    this.runs = [];
    this.activeRun = null;
    this.resultsHeader.show();
    this.resultEl.addClass("is-tabbed");
  }

  // The primary "Chew It" action. If results for this note are already shown,
  // only generate the perspectives that don't have a tab yet (e.g. a newly
  // added one); otherwise generate the whole selected set.
  async runAnalysis(): Promise<void> {
    if (this.running) return;
    const selected = this.selectedPresets();
    const sameNote = this.currentPath !== null && this.currentPath === this.plugin.currentNotePath();
    if (sameNote && this.runs.length > 0) {
      const have = new Set(this.runs.map((r) => r.id));
      const missing = selected.filter((p) => !have.has(p.id));
      if (missing.length > 0) {
        await this.runPresets(missing, true);
        return;
      }
    }
    await this.runPresets(selected);
  }

  // Run a set of functions in parallel, each into its own result tab. With
  // `append`, existing tabs are kept and the new ones are added beside them;
  // otherwise the result area is cleared first.
  async runPresets(presets: PromptPreset[], append = false): Promise<void> {
    if (this.running) return;

    const lang = this.plugin.currentLang();

    if (presets.length === 0) {
      new Notice(t(lang, "notice.needFn"));
      return;
    }

    const config = this.buildConfig();
    if (!config) {
      new Notice(t(lang, "notice.needKey"));
      return;
    }

    const note = await this.plugin.getActiveNoteContent();
    if (!note) {
      new Notice(t(lang, "notice.noNote"));
      return;
    }
    if (!note.content.trim()) {
      new Notice(t(lang, "notice.empty"));
      return;
    }

    if (append) {
      this.resultsHeader.show();
      this.resultEl.addClass("is-tabbed");
    } else {
      this.beginGeneration();
    }
    this.lastNoteTitle = note.title;
    this.currentPath = note.path;
    this.setRunning(true);
    this.statusEl.setText(this.waitingWord());

    const firstNew = this.runs.length;
    const jobs = presets.map((p) => this.startRun(p, config, note, lang));
    // Focus the first newly added tab so the user sees it generate.
    if (append && this.runs[firstNew]) this.setActiveRun(this.runs[firstNew]);
    await Promise.allSettled(jobs);

    this.lastPresetIds = this.runs.map((r) => r.id);
    this.setRunning(false);
    this.snapshotResults();
  }

  // Export the ACTIVE tab's result via an output template. Operates only on
  // that tab's content and never disturbs the result tabs.
  async runOutput(outputId: string): Promise<void> {
    if (this.running) return;

    const s = this.plugin.settings;
    const lang = this.plugin.currentLang();

    const run = this.activeRun;
    if (!run) return;

    const out = s.outputs.find((o) => o.id === outputId);
    if (!out) {
      new Notice(t(lang, "notice.needOutput"));
      return;
    }

    const source = run.raw.trim();
    if (!source) {
      new Notice(t(lang, "notice.empty"));
      return;
    }

    const baseName = this.lastNoteTitle || run.label || "chew";
    const filename =
      applyFilenameTemplate(out.filename, {
        note: baseName,
        label: out.label || run.label,
      }) + extFor(out.format);
    const isCanvas = out.format === "canvas";

    // Export the chewed result as-is — no LLM. Append if the file already
    // exists: markdown to the end of the file, canvas as new cards.
    try {
      const path = await this.plugin.prepareOutputPath(out.folder, filename);
      const existing = await this.plugin.readIfExists(path);
      let content: string;
      if (existing === null) content = isCanvas ? toCanvas(source) : source;
      else if (isCanvas) content = appendToCanvas(existing, source);
      else content = existing.replace(/\s+$/, "") + "\n\n" + source;
      await this.plugin.writeFile(path, content);
      new Notice(t(lang, existing === null ? "notice.saved" : "notice.appended", { path }));
    } catch (e) {
      new Notice(t(lang, "notice.saveError", { msg: String((e as Error).message ?? e) }));
    }
  }

  private async startRun(
    preset: PromptPreset,
    config: LLMConfig,
    note: { title: string; content: string },
    lang: ReturnType<ChewItView["lang"]>
  ): Promise<void> {
    const run = this.createRunBlock(preset.label || t(lang, "ui.untitled"), lang);
    run.id = preset.id;
    run.prompt = preset.prompt;
    run.system = preset.system ?? "";
    await this.runPresetInto(run, preset.prompt, run.system, config, note, lang);
  }

  // Stream a prompt's result into a run block — used both for a fresh run and
  // for regenerating an existing tab in place.
  private async runPresetInto(
    run: Run,
    prompt: string,
    system: string,
    config: LLMConfig,
    note: { title: string; content: string },
    lang: ReturnType<ChewItView["lang"]>
  ): Promise<void> {
    run.controller = new AbortController();
    run.raw = "";
    run.state = "";
    run.renderQueued = false;
    run.bodyEl.empty();
    run.tabEl.removeClass("is-done");
    run.tabEl.removeClass("is-error");
    run.tabEl.addClass("is-running");
    run.statusEl.setText(t(lang, "run.analyzing"));

    const userPrompt =
      `${prompt}\n\n---\n${t(lang, "prompt.docTitle")}：${note.title}\n\n${note.content}`;

    try {
      await streamCompletion(config, {
        system,
        user: userPrompt,
        signal: run.controller.signal,
        onToken: (tk) => this.appendChunk(run, tk),
      });
      this.finishRun(run, t(lang, "run.done"), "is-done");
    } catch (e) {
      const err = e as Error;
      if (err.name === "AbortError") {
        this.finishRun(run, t(lang, "run.stopped"), "");
      } else {
        this.finishRun(run, t(lang, "run.error"), "is-error");
        run.bodyEl.createEl("pre", { cls: "chew-it-error", text: String(err.message ?? err) });
        new Notice(t(lang, "notice.error", { msg: String(err.message ?? err) }));
      }
    } finally {
      await this.flushRender(run);
    }
  }

  // Create a result tab + its (hidden unless active) content panel.
  private createRunBlock(title: string, lang: ReturnType<ChewItView["lang"]>): Run {
    const tabEl = this.resultTabsEl.createEl("button", {
      cls: "chew-it-result-tab is-running",
      text: title,
    });
    const containerEl = this.resultEl.createDiv("chew-it-run");
    const statusEl = containerEl.createDiv("chew-it-run-status");
    statusEl.setText(t(lang, "run.analyzing"));
    const bodyEl = containerEl.createDiv("chew-it-run-body markdown-rendered");

    const run: Run = {
      id: title,
      label: title,
      prompt: "",
      system: "",
      controller: new AbortController(),
      raw: "",
      state: "",
      tabEl,
      containerEl,
      statusEl,
      bodyEl,
      renderQueued: false,
    };
    this.runs.push(run);

    tabEl.onclick = () => this.setActiveRun(run);
    if (this.runs.length === 1) this.setActiveRun(run);
    else containerEl.hide();

    return run;
  }

  private setActiveRun(run: Run): void {
    this.activeRun = run;
    for (const r of this.runs) {
      const active = r === run;
      r.containerEl.toggle(active);
      r.tabEl.toggleClass("is-active", active);
    }
  }

  private finishRun(run: Run, status: string, cssState: string): void {
    run.statusEl.setText(status);
    run.state = cssState;
    run.tabEl.removeClass("is-running");
    if (cssState) run.tabEl.addClass(cssState);
  }

  private setRunning(running: boolean): void {
    this.running = running;
    // Keep the brand in place but spin it and block re-triggering while busy.
    this.runBtn.toggleClass("is-running", running);
    this.updateRunBtn();
    // Live "thinking" indicator: spinner + pulsing status text while busy.
    this.statusIconEl.toggle(running);
    this.statusEl.toggleClass("is-working", running);
    this.stopBtn.toggle(running);
    this.tabsEl.toggleClass("chew-it-tabs--disabled", running);
    this.updateMenuBtn();
  }

  private appendChunk(run: Run, text: string): void {
    run.raw += text;
    this.scheduleRender(run);
  }

  private scheduleRender(run: Run): void {
    if (run.renderQueued) return;
    run.renderQueued = true;
    window.setTimeout(() => {
      run.renderQueued = false;
      void this.renderRun(run);
    }, 120);
  }

  private async flushRender(run: Run): Promise<void> {
    run.renderQueued = false;
    await this.renderRun(run);
  }

  private async renderRun(run: Run): Promise<void> {
    run.bodyEl.empty();
    await MarkdownRenderer.render(this.app, run.raw, run.bodyEl, "", this);
  }

  // Persist the current note's results so they reappear after a restart and
  // when navigating back to this document.
  private snapshotResults(): void {
    const path = this.currentPath;
    if (!path) return;
    if (this.runs.length === 0) {
      void this.plugin.saveNoteResult(path, null);
      return;
    }
    const cache: ChewItResultCache = {
      noteTitle: this.lastNoteTitle,
      status: this.statusEl.textContent ?? "",
      presetIds: this.lastPresetIds,
      updatedAt: Date.now(),
      runs: this.runs.map((r) => ({
        id: r.id,
        label: r.label,
        prompt: r.prompt,
        system: r.system,
        raw: r.raw,
        state: r.state,
        status: r.statusEl.textContent ?? "",
      })),
    };
    void this.plugin.saveNoteResult(path, cache);
  }

  // Rebuild result tabs and bodies from a saved snapshot — no LLM calls.
  private restoreCache(cache: ChewItResultCache): void {
    if (!cache.runs?.length) return;
    const lang = this.lang();
    this.resultEl.empty();
    this.resultTabsEl.empty();
    this.runs = [];
    this.activeRun = null;
    this.resultsHeader.show();
    this.resultEl.addClass("is-tabbed");
    this.lastPresetIds = cache.presetIds ?? [];
    this.lastNoteTitle = cache.noteTitle ?? "";

    for (const item of cache.runs) {
      const run = this.createRunBlock(item.label, lang);
      run.id = item.id ?? item.label;
      run.prompt = item.prompt ?? "";
      run.system = item.system ?? "";
      run.raw = item.raw;
      run.state = item.state;
      run.tabEl.removeClass("is-running");
      if (item.state) run.tabEl.addClass(item.state);
      run.statusEl.setText(item.status);
      void this.renderRun(run);
    }

    if (cache.status) this.statusEl.setText(cache.status);
    this.updateMenuBtn();
  }

  // Navigate the panel to a note's saved results (or an empty state). Called on
  // open and whenever the active document changes.
  showNoteResults(path: string | null, force = false): void {
    if (!this.resultEl) return; // not built yet
    // Never yank the view out from under a running analysis.
    if (this.running) return;
    if (!force && path === this.currentPath) return;
    this.currentPath = path;

    const cache = path ? this.plugin.getNoteResult(path) : null;
    if (cache) this.restoreCache(cache);
    else this.clearResults();
  }

  // Reset the result area to its empty state.
  private clearResults(): void {
    this.runs = [];
    this.activeRun = null;
    this.resultEl.empty();
    this.resultEl.removeClass("is-tabbed");
    this.resultTabsEl.empty();
    this.resultsHeader.hide();
    this.lastPresetIds = [];
    this.lastNoteTitle = "";
    this.statusEl.setText(t(this.lang(), "ui.ready"));
    this.updateMenuBtn();
  }
}
