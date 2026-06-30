import { MarkdownView, Plugin, TFile, WorkspaceLeaf, normalizePath } from "obsidian";
import {
  ChewItSettings,
  ChewItSettingTab,
  DEFAULT_SETTINGS,
} from "./settings";
import { ChewItView, VIEW_TYPE_CHEW_IT, type ChewItResultCache } from "./view";
import { t, type Lang } from "./i18n";

// What we persist to data.json: user settings plus per-note analysis results,
// keyed by vault path, so results survive a restart and follow each document.
interface ChewItData {
  settings?: Partial<ChewItSettings>;
  results?: Record<string, ChewItResultCache>;
  // Legacy single-result field from before results were per-note; dropped.
  resultCache?: ChewItResultCache | null;
}

// Cap on how many notes' results we keep cached, evicting the oldest.
const MAX_CACHED_NOTES = 30;

export default class ChewItPlugin extends Plugin {
  settings!: ChewItSettings;

  // Analysis results keyed by note path, restored into the panel on open and
  // when switching documents.
  noteResults: Record<string, ChewItResultCache> = {};

  // The most recently focused Markdown note — used as the analysis target even
  // when the Chew It panel itself holds focus.
  private lastMarkdownView: MarkdownView | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();

    const lang = this.currentLang();

    this.registerView(VIEW_TYPE_CHEW_IT, (leaf) => new ChewItView(leaf, this));

    this.addRibbonIcon("sparkles", t(lang, "ribbon.tooltip"), () =>
      this.activateAndAnalyze()
    );

    this.addCommand({
      id: "analyze-current-note",
      name: t(lang, "cmd.analyze"),
      callback: () => this.activateAndAnalyze(),
    });

    this.addCommand({
      id: "open-panel",
      name: t(lang, "cmd.openPanel"),
      callback: () => {
        void this.activateView();
      },
    });

    this.addSettingTab(new ChewItSettingTab(this.app, this));

    // Track the active Markdown note so the panel always knows what to chew on.
    this.app.workspace.onLayoutReady(() => {
      const mv = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (mv) this.lastMarkdownView = mv;
    });
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf?.view instanceof MarkdownView) {
          this.lastMarkdownView = leaf.view;
          // Navigate every open panel to this document's results.
          const path = leaf.view.file?.path ?? null;
          for (const l of this.app.workspace.getLeavesOfType(VIEW_TYPE_CHEW_IT)) {
            const v = l.view;
            if (v instanceof ChewItView) v.showNoteResults(path);
          }
        }
      })
    );
  }

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as ChewItData | Partial<ChewItSettings> | null;
    // New format nests settings under `settings`; older data.json stored the
    // settings object flat at the top level. Support both.
    const hasEnvelope = !!data && typeof data === "object" && "settings" in data;
    const raw = hasEnvelope ? (data as ChewItData).settings : (data as Partial<ChewItSettings> | null);
    this.settings = Object.assign({}, DEFAULT_SETTINGS, raw ?? {});
    // Migrate the old global role into any function that has none of its own.
    const legacyRole = this.settings.systemPrompt;
    if (legacyRole) {
      for (const p of this.settings.prompts) {
        if (p.system === undefined) p.system = legacyRole;
      }
    }
    delete this.settings.systemPrompt;
    const stored = hasEnvelope ? (data as ChewItData).results : undefined;
    // Ignore the legacy single-result shape (an object with a `runs` array).
    this.noteResults =
      stored && typeof stored === "object" && !Array.isArray((stored as { runs?: unknown }).runs)
        ? stored
        : {};
  }

  async saveSettings(): Promise<void> {
    await this.persist();
  }

  getNoteResult(path: string): ChewItResultCache | null {
    return this.noteResults[path] ?? null;
  }

  // Store (or clear) one note's results without touching settings.
  async saveNoteResult(path: string, cache: ChewItResultCache | null): Promise<void> {
    if (cache) this.noteResults[path] = cache;
    else delete this.noteResults[path];
    this.trimResults();
    await this.persist();
  }

  // Keep only the most recently updated notes' results.
  private trimResults(): void {
    const keys = Object.keys(this.noteResults);
    if (keys.length <= MAX_CACHED_NOTES) return;
    keys
      .sort((a, b) => (this.noteResults[a].updatedAt ?? 0) - (this.noteResults[b].updatedAt ?? 0))
      .slice(0, keys.length - MAX_CACHED_NOTES)
      .forEach((k) => delete this.noteResults[k]);
  }

  currentLang(): Lang {
    const locale = (window as any).moment?.locale?.() ?? "";
    return locale.startsWith("zh") ? "zh" : "en";
  }

  // Path of the note the panel should currently target.
  currentNotePath(): string | null {
    const mv = this.lastMarkdownView;
    if (mv?.file) return mv.file.path;
    const f = this.app.workspace.getActiveFile();
    return f && f.extension === "md" ? f.path : null;
  }

  private async persist(): Promise<void> {
    await this.saveData({ settings: this.settings, results: this.noteResults });
  }

  // Rebuild the tab bar in any open Chew It panel after the function list changes.
  refreshViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_CHEW_IT)) {
      const view = leaf.view;
      if (view instanceof ChewItView) view.refreshTabs();
    }
  }

  async activateView(): Promise<ChewItView | null> {
    const { workspace } = this.app;
    let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(VIEW_TYPE_CHEW_IT)[0] ?? null;
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) return null;
      await leaf.setViewState({ type: VIEW_TYPE_CHEW_IT, active: true });
    }
    await workspace.revealLeaf(leaf);
    return leaf.view as ChewItView;
  }

  async activateAndAnalyze(): Promise<void> {
    const view = await this.activateView();
    if (!view) return;
    // The panel restores any saved results on open; only kick off a fresh
    // analysis when this note has none yet. The in-panel "Chew It" button is
    // the way to (re)generate when results already exist.
    const path = this.currentNotePath();
    if (path && this.getNoteResult(path)) return;
    void view.runAnalysis();
  }

  async getActiveNoteContent(): Promise<{ title: string; content: string; path: string } | null> {
    const mv = this.lastMarkdownView;
    if (mv?.file) {
      try {
        return { title: mv.file.basename, content: mv.editor.getValue(), path: mv.file.path };
      } catch {
        /* view was detached; fall through */
      }
    }
    const file = this.app.workspace.getActiveFile();
    if (file && file.extension === "md") {
      return { title: file.basename, content: await this.app.vault.read(file), path: file.path };
    }
    return null;
  }

  // Write `content` to `<folder>/<filename>` inside the vault, creating the
  // folder if needed and overwriting an existing file. Returns the final path.
  async writeOutput(folder: string, filename: string, content: string): Promise<string> {
    const cleanFolder = normalizePath(folder.replace(/^\/+|\/+$/g, ""));
    const hasFolder = cleanFolder !== "" && cleanFolder !== ".";
    if (hasFolder && !this.app.vault.getAbstractFileByPath(cleanFolder)) {
      try {
        await this.app.vault.createFolder(cleanFolder);
      } catch {
        /* already exists or created concurrently */
      }
    }
    const path = normalizePath(hasFolder ? `${cleanFolder}/${filename}` : filename);
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) {
      await this.app.vault.modify(existing, content);
    } else {
      await this.app.vault.create(path, content);
    }
    return path;
  }

  // Resolve `<folder>/<filename>` to a normalized vault path, creating the
  // folder if it doesn't exist yet. Does not write anything.
  async prepareOutputPath(folder: string, filename: string): Promise<string> {
    const cleanFolder = normalizePath(folder.replace(/^\/+|\/+$/g, ""));
    const hasFolder = cleanFolder !== "" && cleanFolder !== ".";
    if (hasFolder && !this.app.vault.getAbstractFileByPath(cleanFolder)) {
      try {
        await this.app.vault.createFolder(cleanFolder);
      } catch {
        /* already exists or created concurrently */
      }
    }
    return normalizePath(hasFolder ? `${cleanFolder}/${filename}` : filename);
  }

  // Return the text of an existing file, or null if it doesn't exist.
  async readIfExists(path: string): Promise<string | null> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) return await this.app.vault.read(file);
    return null;
  }

  // Create or overwrite a file at the given path.
  async writeFile(path: string, content: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.vault.modify(file, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }

  async openPath(path: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.workspace.getLeaf(true).openFile(file);
    }
  }

  // Jump back to a note: focus an already-open pane showing it, else open it in
  // the main editor area. Returns false if the file is gone.
  async revealNote(path: string): Promise<boolean> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return false;
    const open = this.app.workspace
      .getLeavesOfType("markdown")
      .find((l) => l.view instanceof MarkdownView && l.view.file?.path === path);
    if (open) {
      this.app.workspace.setActiveLeaf(open, { focus: true });
      await this.app.workspace.revealLeaf(open);
    } else {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
    return true;
  }
}
