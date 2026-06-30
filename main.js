"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ChewItPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");

// src/i18n.ts
var ZH = {
  "ui.analyze": "\u5206\u6790\u5F53\u524D\u6587\u6863",
  "ui.stop": "\u505C\u6B62",
  "ui.regenerate": "\u91CD\u65B0\u751F\u6210",
  "ui.actions": "\u91CD\u65B0\u751F\u6210 / \u8F93\u51FA",
  "ui.locate": "\u56DE\u5230\u5206\u6790\u7684\u6587\u6863",
  "ui.ready": "\u52FE\u9009\u8981\u5206\u6790\u7684\u89C6\u89D2\uFF0C\u70B9 \u201CChew It\u201D \u5F00\u59CB\u3002",
  "ui.tabsEmpty": "\u5C1A\u672A\u542F\u7528\u4EFB\u4F55\u89C6\u89D2\uFF0C\u8BF7\u5230\u8BBE\u7F6E\u91CC\u6DFB\u52A0\u6216\u542F\u7528\u3002",
  "ui.runOne": "\u5355\u72EC\u751F\u6210\uFF1A{label}",
  "ui.untitled": "\u672A\u547D\u540D",
  "ui.analyzingNote": "\u5206\u6790\uFF1A{title}",
  "run.analyzing": "\u5206\u6790\u4E2D\u2026",
  "run.done": "\u5B8C\u6210",
  "run.stopped": "\u5DF2\u505C\u6B62",
  "run.error": "\u51FA\u9519",
  "prompt.docTitle": "\u6587\u6863\u6807\u9898",
  "notice.noNote": "\u6CA1\u6709\u53EF\u5206\u6790\u7684 Markdown \u6587\u6863\u3002",
  "notice.empty": "\u5F53\u524D\u6587\u6863\u4E3A\u7A7A\u3002",
  "notice.needKey": "\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u586B\u5199 API Key\u3002",
  "notice.needFn": "\u8BF7\u5148\u5728\u8BBE\u7F6E\u91CC\u542F\u7528\u81F3\u5C11\u4E00\u4E2A\u89C6\u89D2\u3002",
  "notice.cannotRegen": "\u65E0\u6CD5\u91CD\u65B0\u751F\u6210\uFF1A\u627E\u4E0D\u5230\u8BE5\u7ED3\u679C\u5BF9\u5E94\u7684\u63D0\u793A\u8BCD\u3002",
  "notice.noteGone": "\u627E\u4E0D\u5230\u8BE5\u6587\u6863\uFF08\u53EF\u80FD\u5DF2\u88AB\u79FB\u52A8\u6216\u5220\u9664\uFF09\u3002",
  "notice.error": "Chew It \u51FA\u9519\uFF1A{msg}",
  "cmd.analyze": "\u5206\u6790\u5F53\u524D\u6587\u6863",
  "cmd.openPanel": "\u6253\u5F00 Chew It \u9762\u677F",
  "ribbon.tooltip": "Chew It\uFF1A\u5206\u6790\u5F53\u524D\u6587\u6863",
  "set.langHeading": "\u754C\u9762",
  "set.language": "\u8BED\u8A00",
  "set.langReloadHint": "\u547D\u4EE4\u540D\u79F0\u5C06\u5728\u91CD\u8F7D Obsidian \u540E\u66F4\u65B0\u3002",
  "set.providerHeading": "LLM \u63D0\u4F9B\u65B9",
  "set.provider": "\u63D0\u4F9B\u65B9",
  "set.providerDesc": "\u9009\u62E9\u8C03\u7528\u54EA\u5BB6\u7684 API",
  "set.claudeKey": "Anthropic API Key",
  "set.model": "\u6A21\u578B",
  "set.modelClaudeDesc": "\u9ED8\u8BA4 claude-opus-4-8",
  "set.openaiKey": "OpenAI API Key",
  "set.baseUrl": "Base URL",
  "set.baseUrlDesc": "\u517C\u5BB9 OpenAI \u7684\u63A5\u53E3\u5730\u5740\uFF0C\u4F8B\u5982\u672C\u5730 Ollama\uFF1Ahttp://localhost:11434/v1",
  "set.maxTokens": "\u6700\u5927\u8F93\u51FA tokens",
  "set.maxTokensDesc": "\u5355\u6B21\u5206\u6790\u5141\u8BB8\u751F\u6210\u7684\u6700\u5927 token \u6570",
  "set.roleHeading": "\u89D2\u8272\u8BBE\u5B9A",
  "set.systemPrompt": "\u7CFB\u7EDF\u63D0\u793A\uFF08\u6240\u6709\u529F\u80FD\u5171\u7528\uFF09",
  "set.systemPromptDesc": "\u5B9A\u4E49\u6A21\u578B\u7EDF\u4E00\u7684\u89D2\u8272\u4E0E\u8BED\u6C14\uFF0C\u5BF9\u4E0B\u9762\u6BCF\u4E2A Tab \u90FD\u751F\u6548\u3002",
  "set.fnHeading": "\u5185\u5BB9\u89E3\u6790\u89C6\u89D2",
  "set.fnDesc": "\u8FD9\u4E9B\u89C6\u89D2\u4F1A\u663E\u793A\u5728\u9762\u677F\u9876\u90E8\u3002\u5DF2\u542F\u7528\u7684\u4F1A\u5728\u70B9\u51FB\u300C\u5206\u6790\u5F53\u524D\u6587\u6863\u300D\u65F6\u5168\u90E8\u751F\u6210\uFF0C\u4E5F\u53EF\u5728\u9762\u677F\u91CC\u5355\u72EC\u70B9\u51FB\u8FD0\u884C\u3002\u7528\u53F3\u4FA7\u5F00\u5173\u542F\u7528\u6216\u505C\u7528\u2014\u2014\u505C\u7528\u7684\u89C6\u89D2\u4F1A\u4FDD\u7559\uFF0C\u4F46\u4E0D\u53C2\u4E0E\u751F\u6210\u3002",
  "set.addFn": "\u65B0\u589E\u89C6\u89D2",
  "set.fnEnabled": "\u542F\u7528\u6B64\u89C6\u89D2\uFF08\u505C\u7528\u540E\u4FDD\u7559\u4F46\u4E0D\u53C2\u4E0E\u751F\u6210\uFF09",
  "set.tab": "\u89C6\u89D2 {n}",
  "set.tabNamePlaceholder": "\u89C6\u89D2\u540D\uFF0C\u5982\uFF1A\u7FFB\u8BD1",
  "set.delFn": "\u5220\u9664\u6B64\u89C6\u89D2",
  "set.newFn": "\u65B0\u589E\u89C6\u89D2",
  "set.fnSystem": "\u89D2\u8272\u8BBE\u5B9A",
  "set.fnSystemPlaceholder": "\u53EF\u7559\u7A7A\uFF1B\u586B\u5199\u5219\u4F5C\u4E3A\u8BE5\u529F\u80FD\u7684\u7CFB\u7EDF\u63D0\u793A\u3002",
  "set.prompt": "\u63D0\u793A\u8BCD",
  "ui.output": "\u8F93\u51FA",
  "ui.outputNone": "\uFF08\u65E0\u8F93\u51FA\u914D\u7F6E\uFF09",
  "run.savedTo": "\u5DF2\u4FDD\u5B58\uFF1A{path}",
  "prompt.sourceDoc": "\u6E90\u6587\u6863",
  "prompt.targetExisting": "\u5DF2\u5B58\u5728\u7684\u76EE\u6807\u6587\u6863",
  "prompt.formatMarkdown": "\u8F93\u51FA\u683C\u5F0F\uFF1A\u4E00\u7BC7 Markdown \u6587\u6863\u3002\u8BF7\u76F4\u63A5\u8F93\u51FA\u6B63\u6587\uFF0C\u4E0D\u8981\u7528\u4EE3\u7801\u5757\u5305\u88F9\u3002",
  "prompt.formatCanvas": "\u8F93\u51FA\u683C\u5F0F\uFF1AObsidian \u753B\u5E03\uFF08Canvas\uFF09\u3002\u5185\u5BB9\u4F1A\u6309\u4E00\u7EA7/\u4E8C\u7EA7\u6807\u9898\uFF08# \u6216 ## \uFF09\u81EA\u52A8\u62C6\u5206\u6210\u591A\u5F20\u5361\u7247\u2014\u2014\u6BCF\u4E2A\u6807\u9898\u53CA\u5176\u4E0B\u65B9\u5185\u5BB9\u6210\u4E3A\u4E00\u5F20\u5361\u7247\u3002\u8BF7\u7528 ## \u6807\u9898\u628A\u5185\u5BB9\u7EC4\u7EC7\u6210\u82E5\u5E72\u81EA\u6210\u4E00\u4F53\u7684\u4E3B\u9898\u5757\uFF0C\u6BCF\u5757\u5C31\u662F\u4E00\u5F20\u5361\u7247\uFF0C\u907F\u514D\u628A\u6240\u6709\u5185\u5BB9\u585E\u8FDB\u4E00\u4E2A\u6807\u9898\u4E0B\u3002\u53EA\u8F93\u51FA Markdown \u6B63\u6587\uFF0C\u4E0D\u8981\u8F93\u51FA JSON \u6216\u5361\u7247\u5750\u6807\u3002",
  "prompt.mergeInstruction": "\u4EE5\u4E0A\u76EE\u6807\u6587\u6863\u5DF2\u5B58\u5728\u3002\u8BF7\u6839\u636E\u8981\u6C42\u51B3\u5B9A\u5982\u4F55\u628A\u6E90\u6587\u6863\u5185\u5BB9\u6574\u5408\u8FDB\u76EE\u6807\u6587\u6863\uFF0C\u5E76\u76F4\u63A5\u8F93\u51FA\u6574\u5408\u540E\u7684\u3010\u5B8C\u6574\u76EE\u6807\u6587\u6863\u3011\u5185\u5BB9\uFF0C\u4E0D\u8981\u9644\u52A0\u89E3\u91CA\u3002",
  "notice.needOutput": "\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u914D\u7F6E\u8F93\u51FA\u6A21\u677F\u3002",
  "notice.saved": "\u5DF2\u4FDD\u5B58\uFF1A{path}",
  "notice.appended": "\u5DF2\u8FFD\u52A0\u5230\uFF1A{path}",
  "notice.saveError": "\u4FDD\u5B58\u5931\u8D25\uFF1A{msg}",
  "set.outHeading": "\u8F93\u51FA\u6A21\u677F",
  "set.outDesc": "\u628A\u5F53\u524D\u7ED3\u679C Tab \u7684\u5185\u5BB9\u539F\u6837\u5BFC\u51FA\u6210\u6587\u4EF6\uFF08\u4E0D\u7ECF LLM\uFF09\u3002\n\u82E5\u76EE\u6807\u6587\u4EF6\u5DF2\u5B58\u5728\uFF1AMarkdown \u8FFD\u52A0\u5230\u6587\u4EF6\u672B\u5C3E\uFF1BCanvas \u6309\u6807\u9898\u8FFD\u52A0\u4E3A\u65B0\u5361\u7247\u3002\n\u53EF\u914D\u7F6E\u591A\u4E2A\u6A21\u677F\uFF1B\u5728\u9762\u677F\u751F\u6210\u7ED3\u679C\u540E\uFF0C\u70B9\u7ED3\u679C\u533A\u7684\u300C\xB7\xB7\xB7\u300D\u83DC\u5355\u9009\u62E9\u6267\u884C\u3002",
  "set.addOut": "\u6DFB\u52A0\u8F93\u51FA\u6A21\u677F",
  "set.newOut": "\u65B0\u8F93\u51FA\u6A21\u677F",
  "set.delOut": "\u5220\u9664\u6B64\u8F93\u51FA\u6A21\u677F",
  "set.out": "\u8F93\u51FA\u6A21\u677F {n}",
  "set.outName": "\u540D\u79F0",
  "set.outNamePlaceholder": "\u5982\uFF1A\u6574\u7406\u6210\u7B14\u8BB0",
  "set.outFormat": "\u683C\u5F0F",
  "set.outMode": "\u5904\u7406\u65B9\u5F0F",
  "set.outModeLlm": "\u7ECF\u8FC7 LLM\uFF08\u7528\u4E0B\u65B9\u63D0\u793A\u8BCD\uFF09",
  "set.outModeRaw": "\u539F\u6837\u8F93\u51FA\uFF08\u4E0D\u7ECF LLM\uFF09",
  "set.outFolder": "\u76EE\u6807\u6587\u4EF6\u5939",
  "set.outFolderDesc": "\u5E93\u5185\u76F8\u5BF9\u8DEF\u5F84\uFF0C\u7559\u7A7A\u5219\u653E\u5230\u5E93\u6839\u76EE\u5F55\u3002",
  "set.outFilename": "\u6587\u4EF6\u540D\u6A21\u677F",
  "set.outFilenameDesc": "\u53EF\u7528\u5360\u4F4D\u7B26\uFF1A{note} {label} {date} {datetime}",
  "set.outOpen": "\u5B8C\u6210\u540E\u6253\u5F00\u6587\u4EF6",
  "set.outPrompt": "\u8F93\u51FA\u63D0\u793A\u8BCD\uFF08\u4EC5 LLM \u6A21\u5F0F\u4F7F\u7528\uFF09"
};
var EN = {
  "ui.analyze": "Analyze note",
  "ui.stop": "Stop",
  "ui.regenerate": "Regenerate",
  "ui.actions": "Regenerate / Output",
  "ui.locate": "Go to the analyzed note",
  "ui.ready": "Pick the perspectives to analyze, then click Chew It.",
  "ui.tabsEmpty": "No enabled perspectives. Add or enable one in Settings.",
  "ui.runOne": "Run only: {label}",
  "ui.untitled": "Untitled",
  "ui.analyzingNote": "Analyzing: {title}",
  "run.analyzing": "Analyzing\u2026",
  "run.done": "Done",
  "run.stopped": "Stopped",
  "run.error": "Error",
  "prompt.docTitle": "Document title",
  "notice.noNote": "No Markdown note to analyze.",
  "notice.empty": "The note is empty.",
  "notice.needKey": "Please set your API key in Settings.",
  "notice.needFn": "Enable at least one perspective in Settings first.",
  "notice.cannotRegen": "Can't regenerate: this result's prompt is missing.",
  "notice.noteGone": "That note can't be found (it may have been moved or deleted).",
  "notice.error": "Chew It error: {msg}",
  "cmd.analyze": "Analyze current note",
  "cmd.openPanel": "Open Chew It panel",
  "ribbon.tooltip": "Chew It: analyze current note",
  "set.langHeading": "Interface",
  "set.language": "Language",
  "set.langReloadHint": "Command names update after reloading Obsidian.",
  "set.providerHeading": "LLM provider",
  "set.provider": "Provider",
  "set.providerDesc": "Which API to call",
  "set.claudeKey": "Anthropic API key",
  "set.model": "Model",
  "set.modelClaudeDesc": "Defaults to claude-opus-4-8",
  "set.openaiKey": "OpenAI API key",
  "set.baseUrl": "Base URL",
  "set.baseUrlDesc": "OpenAI-compatible endpoint, e.g. local Ollama: http://localhost:11434/v1",
  "set.maxTokens": "Max output tokens",
  "set.maxTokensDesc": "Maximum tokens generated per analysis",
  "set.roleHeading": "Role",
  "set.systemPrompt": "System prompt (shared by all functions)",
  "set.systemPromptDesc": "Defines the model's role and tone; applies to every tab below.",
  "set.fnHeading": "Analysis Perspectives",
  "set.fnDesc": "These perspectives appear at the top of the panel. Every enabled one runs when you click Analyze, or you can click one to run it on its own. Use the toggle on the right to enable or disable \u2014 a disabled perspective is kept but never run.",
  "set.addFn": "Add perspective",
  "set.fnEnabled": "Enable this perspective (kept but not run when off)",
  "set.tab": "Perspective {n}",
  "set.tabNamePlaceholder": "Perspective name, e.g. Translate",
  "set.delFn": "Delete this perspective",
  "set.newFn": "New perspective",
  "set.fnSystem": "Role",
  "set.fnSystemPlaceholder": "Optional; used as this function's system prompt.",
  "set.prompt": "Prompt",
  "ui.output": "Output",
  "ui.outputNone": "(no outputs configured)",
  "run.savedTo": "Saved: {path}",
  "prompt.sourceDoc": "Source document",
  "prompt.targetExisting": "Existing target document",
  "prompt.formatMarkdown": "Output format: a Markdown document. Output the body directly; do not wrap it in a code block.",
  "prompt.formatCanvas": "Output format: an Obsidian Canvas. The content is automatically split into multiple cards by level-1/level-2 (# or ## ) headings \u2014 each heading and the text under it becomes one card. Use ## headings to organize the output into several self-contained topical blocks, one card each; don't cram everything under a single heading. Output Markdown only \u2014 no JSON, no card coordinates.",
  "prompt.mergeInstruction": "The target document above already exists. Decide how to integrate the source into it, then output the complete merged target document only \u2014 no explanation.",
  "notice.needOutput": "Configure an output template in Settings first.",
  "notice.saved": "Saved: {path}",
  "notice.appended": "Appended to: {path}",
  "notice.saveError": "Save failed: {msg}",
  "set.outHeading": "Output templates",
  "set.outDesc": `Export the current result tab's content to a file as-is (no LLM).
If the target file already exists: Markdown is appended to the end; Canvas adds new cards split by heading.
Add multiple templates; after generating results, pick one from the result area's "\xB7\xB7\xB7" menu.`,
  "set.addOut": "Add output template",
  "set.newOut": "New output template",
  "set.delOut": "Delete this output template",
  "set.out": "Output template {n}",
  "set.outName": "Name",
  "set.outNamePlaceholder": "e.g. Tidy into a note",
  "set.outFormat": "Format",
  "set.outMode": "Processing",
  "set.outModeLlm": "Through LLM (use prompt below)",
  "set.outModeRaw": "As-is (no LLM)",
  "set.outFolder": "Target folder",
  "set.outFolderDesc": "Vault-relative path; empty = vault root.",
  "set.outFilename": "Filename template",
  "set.outFilenameDesc": "Placeholders: {note} {label} {date} {datetime}",
  "set.outOpen": "Open file when done",
  "set.outPrompt": "Output prompt (LLM mode only)"
};
var TABLE = { zh: ZH, en: EN };
function t(lang, key, vars) {
  var _a, _b, _c;
  let str = (_c = (_b = (_a = TABLE[lang]) == null ? void 0 : _a[key]) != null ? _b : ZH[key]) != null ? _c : key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.replace(`{${k}}`, vars[k]);
    }
  }
  return str;
}

// src/settings.ts
var DEFAULT_ROLE = "\u4F60\u662F\u4E00\u4F4D\u5584\u4E8E\u8BB2\u89E3\u7684\u5BFC\u5E08\uFF0C\u64C5\u957F\u628A\u590D\u6742\u6750\u6599\u62C6\u89E3\u6210\u6E05\u6670\u3001\u51C6\u786E\u3001\u6613\u61C2\u7684\u4E2D\u6587\u8BF4\u660E\u3002\u56DE\u7B54\u4F7F\u7528 Markdown \u6392\u7248\u3002";
function newPresetId() {
  return "fn-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
var DEFAULT_SETTINGS = {
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
      label: "\u63D0\u70BC\u5927\u7EB2",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt: "\u8BF7\u9605\u8BFB\u4E0B\u9762\u7684\u6587\u6863\uFF0C\u63D0\u70BC\u51FA\u6E05\u6670\u7684\u5C42\u7EA7\u5927\u7EB2\uFF0C\u7528 Markdown \u6807\u9898\u548C\u5217\u8868\u7EC4\u7EC7\uFF0C\u8986\u76D6\u4E3B\u8981\u8BBA\u70B9\u4E0E\u6574\u4F53\u7ED3\u6784\u3002"
    },
    {
      id: "concepts",
      label: "\u6982\u5FF5\u89E3\u6790",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt: "\u8BF7\u9605\u8BFB\u4E0B\u9762\u7684\u6587\u6863\uFF0C\u627E\u51FA\u5176\u4E2D\u5173\u952E\u4E14\u53EF\u80FD\u96BE\u4EE5\u7406\u89E3\u7684\u6982\u5FF5\uFF0C\u9010\u4E00\u7528\u901A\u4FD7\u7684\u8BED\u8A00\u89E3\u91CA\u6E05\u695A\uFF0C\u5FC5\u8981\u65F6\u4E3E\u4F8B\u8BF4\u660E\u3002"
    },
    {
      id: "distill",
      label: "\u539F\u6587\u7CBE\u70BC",
      enabled: true,
      system: DEFAULT_ROLE,
      prompt: "\u8BF7\u9605\u8BFB\u4E0B\u9762\u7684\u6587\u6863\uFF0C\u8F93\u51FA\u7CBE\u70BC\u540E\u7684\u6838\u5FC3\u5185\u5BB9\uFF1A\u7528\u7B80\u6D01\u51C6\u786E\u7684\u8BED\u8A00\u6982\u62EC\u8981\u70B9\uFF0C\u53BB\u9664\u5197\u4F59\uFF0C\u4FDD\u7559\u5173\u952E\u4FE1\u606F\u4E0E\u7ED3\u8BBA\u3002"
    },
    {
      id: "translate",
      label: "\u7FFB\u8BD1",
      enabled: false,
      system: DEFAULT_ROLE,
      prompt: "\u8BF7\u7FFB\u8BD1\u4E0B\u9762\u7684\u6587\u6863\uFF1A\u4E2D\u6587\u7FFB\u6210\u82F1\u6587\uFF0C\u5176\u4ED6\u8BED\u8A00\u7FFB\u6210\u4E2D\u6587\u3002\u4FDD\u6301\u539F\u610F\u3001\u672F\u8BED\u4E0E\u8BED\u6C14\uFF0C\u8F93\u51FA\u901A\u987A\u81EA\u7136\u3002"
    }
  ],
  outputs: [
    {
      id: "out-md",
      label: "\u5BFC\u51FA Markdown",
      format: "markdown",
      folder: "Chew It Output",
      filename: "{note} - {label}"
    },
    {
      id: "out-canvas",
      label: "\u5BFC\u51FA Canvas",
      format: "canvas",
      folder: "Chew It Output",
      filename: "{note} - {label}"
    }
  ]
};
var ChewItSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    // Which collapsible cards are expanded, by preset id. Persists across the
    // display() rebuilds that fire when a control inside a card changes.
    this.openGroups = /* @__PURE__ */ new Set();
    this.plugin = plugin;
  }
  // Restore a card's open state and keep tracking it as the user toggles.
  bindGroupOpenState(block, id) {
    block.open = this.openGroups.has(id);
    block.addEventListener("toggle", () => {
      if (block.open) this.openGroups.add(id);
      else this.openGroups.delete(id);
    });
  }
  display() {
    var _a;
    const { containerEl } = this;
    const scroller = (_a = containerEl.closest(".vertical-tab-content")) != null ? _a : containerEl;
    const prevScroll = scroller.scrollTop;
    containerEl.empty();
    const s = this.plugin.settings;
    const lang = this.plugin.currentLang();
    const save = () => this.plugin.saveSettings();
    new import_obsidian.Setting(containerEl).setName(t(lang, "set.providerHeading")).setHeading();
    new import_obsidian.Setting(containerEl).setName(t(lang, "set.provider")).addDropdown(
      (d) => d.addOption("claude", "Claude (Anthropic)").addOption("openai", "OpenAI").setValue(s.provider).onChange(async (v) => {
        s.provider = v;
        await save();
        this.display();
      })
    );
    if (s.provider === "claude") {
      new import_obsidian.Setting(containerEl).setName(t(lang, "set.claudeKey")).addText((tx) => {
        tx.inputEl.type = "password";
        tx.setPlaceholder("sk-ant-...").setValue(s.claudeApiKey).onChange(async (v) => {
          s.claudeApiKey = v.trim();
          await save();
        });
      });
      new import_obsidian.Setting(containerEl).setName(t(lang, "set.model")).setDesc(t(lang, "set.modelClaudeDesc")).addText(
        (tx) => tx.setValue(s.claudeModel).onChange(async (v) => {
          s.claudeModel = v.trim() || "claude-opus-4-8";
          await save();
        })
      );
    } else {
      new import_obsidian.Setting(containerEl).setName(t(lang, "set.openaiKey")).addText((tx) => {
        tx.inputEl.type = "password";
        tx.setPlaceholder("sk-...").setValue(s.openaiApiKey).onChange(async (v) => {
          s.openaiApiKey = v.trim();
          await save();
        });
      });
      new import_obsidian.Setting(containerEl).setName(t(lang, "set.baseUrl")).setDesc(t(lang, "set.baseUrlDesc")).addText(
        (tx) => tx.setValue(s.openaiBaseUrl).onChange(async (v) => {
          s.openaiBaseUrl = v.trim().replace(/\/$/, "") || "https://api.openai.com/v1";
          await save();
        })
      );
      new import_obsidian.Setting(containerEl).setName(t(lang, "set.model")).addText(
        (tx) => tx.setValue(s.openaiModel).onChange(async (v) => {
          s.openaiModel = v.trim() || "gpt-4o";
          await save();
        })
      );
    }
    new import_obsidian.Setting(containerEl).setName(t(lang, "set.maxTokens")).setDesc(t(lang, "set.maxTokensDesc")).addText(
      (tx) => tx.setValue(String(s.maxTokens)).onChange(async (v) => {
        const n = parseInt(v, 10);
        if (!isNaN(n) && n > 0) {
          s.maxTokens = n;
          await save();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName(t(lang, "set.fnHeading")).setHeading().addButton(
      (b) => b.setButtonText(t(lang, "set.addFn")).setCta().onClick(async () => {
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
      const summary = block.createEl("summary", { cls: "chew-it-group-summary" });
      const sumLabel = summary.createSpan({
        cls: "chew-it-group-title",
        text: `${i + 1}. ${p.label || t(lang, "ui.untitled")}`
      });
      const del = summary.createEl("button", { cls: "chew-it-group-del" });
      (0, import_obsidian.setIcon)(del, "trash");
      del.setAttribute("aria-label", t(lang, "set.delFn"));
      del.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        s.prompts.splice(i, 1);
        await save();
        this.plugin.refreshViews();
        this.display();
      };
      new import_obsidian.Setting(block).setName(t(lang, "set.outName")).addText(
        (tx) => tx.setPlaceholder(t(lang, "set.tabNamePlaceholder")).setValue(p.label).onChange(async (v) => {
          p.label = v;
          sumLabel.setText(`${i + 1}. ${v || t(lang, "ui.untitled")}`);
          await save();
          this.plugin.refreshViews();
        })
      ).addToggle(
        (tg) => tg.setTooltip(t(lang, "set.fnEnabled")).setValue(p.enabled !== false).onChange(async (v) => {
          p.enabled = v;
          await save();
          this.plugin.refreshViews();
          this.display();
        })
      );
      new import_obsidian.Setting(block).setName(t(lang, "set.fnSystem")).addTextArea((tx) => {
        var _a2;
        tx.setPlaceholder(t(lang, "set.fnSystemPlaceholder")).setValue((_a2 = p.system) != null ? _a2 : "").onChange(async (v) => {
          p.system = v;
          await save();
        });
        tx.inputEl.rows = 2;
        tx.inputEl.addClass("chew-it-textarea");
      });
      new import_obsidian.Setting(block).setName(t(lang, "set.prompt")).addTextArea((tx) => {
        tx.setValue(p.prompt).onChange(async (v) => {
          p.prompt = v;
          await save();
        });
        tx.inputEl.rows = 4;
        tx.inputEl.addClass("chew-it-textarea");
      });
    });
    new import_obsidian.Setting(containerEl).setName(t(lang, "set.outHeading")).setHeading().addButton(
      (b) => b.setButtonText(t(lang, "set.addOut")).setCta().onClick(async () => {
        const id = newPresetId();
        s.outputs.push({
          id,
          label: t(lang, "set.newOut"),
          format: "markdown",
          folder: "Chew It Output",
          filename: "{note} - {label}"
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
      const summary = block.createEl("summary", { cls: "chew-it-group-summary" });
      const sumLabel = summary.createSpan({
        cls: "chew-it-group-title",
        text: `${i + 1}. ${o.label || t(lang, "ui.untitled")}`
      });
      const del = summary.createEl("button", { cls: "chew-it-group-del" });
      (0, import_obsidian.setIcon)(del, "trash");
      del.setAttribute("aria-label", t(lang, "set.delOut"));
      del.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        s.outputs.splice(i, 1);
        await save();
        this.plugin.refreshViews();
        this.display();
      };
      new import_obsidian.Setting(block).setName(t(lang, "set.outName")).addText(
        (tx) => tx.setPlaceholder(t(lang, "set.outNamePlaceholder")).setValue(o.label).onChange(async (v) => {
          o.label = v;
          sumLabel.setText(`${i + 1}. ${v || t(lang, "ui.untitled")}`);
          await save();
          this.plugin.refreshViews();
        })
      );
      new import_obsidian.Setting(block).setName(t(lang, "set.outFormat")).addDropdown(
        (d) => d.addOption("markdown", "Markdown").addOption("canvas", "Canvas").setValue(o.format).onChange(async (v) => {
          o.format = v;
          await save();
        })
      );
      new import_obsidian.Setting(block).setName(t(lang, "set.outFolder")).setDesc(t(lang, "set.outFolderDesc")).addText(
        (tx) => tx.setValue(o.folder).onChange(async (v) => {
          o.folder = v.trim();
          await save();
        })
      );
      new import_obsidian.Setting(block).setName(t(lang, "set.outFilename")).setDesc(t(lang, "set.outFilenameDesc")).addText(
        (tx) => tx.setValue(o.filename).onChange(async (v) => {
          o.filename = v;
          await save();
        })
      );
    });
    scroller.scrollTop = prevScroll;
  }
};

// src/view.ts
var import_obsidian2 = require("obsidian");

// src/llm.ts
async function streamCompletion(config, req) {
  if (config.provider === "claude") {
    await streamClaude(config, req);
  } else {
    await streamOpenAI(config, req);
  }
}
async function streamClaude(config, req) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      // Required to allow the request from a browser/Electron origin (CORS).
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      // Omit an empty role so a blank per-function setting sends no system.
      ...req.system ? { system: req.system } : {},
      stream: true,
      messages: [{ role: "user", content: req.user }]
    }),
    signal: req.signal
  });
  await ensureOk(resp);
  await readSSE(resp, (data) => {
    var _a, _b, _c;
    if (data === "[DONE]") return;
    let evt;
    try {
      evt = JSON.parse(data);
    } catch (e) {
      return;
    }
    if (evt.type === "content_block_delta" && ((_a = evt.delta) == null ? void 0 : _a.type) === "text_delta") {
      if (typeof evt.delta.text === "string") req.onToken(evt.delta.text);
    } else if (evt.type === "error") {
      throw new Error((_c = (_b = evt.error) == null ? void 0 : _b.message) != null ? _c : "Anthropic streaming error");
    }
  });
}
async function streamOpenAI(config, req) {
  const url = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      stream: true,
      messages: [
        ...req.system ? [{ role: "system", content: req.system }] : [],
        { role: "user", content: req.user }
      ]
    }),
    signal: req.signal
  });
  await ensureOk(resp);
  await readSSE(resp, (data) => {
    var _a, _b, _c;
    if (data === "[DONE]") return;
    let evt;
    try {
      evt = JSON.parse(data);
    } catch (e) {
      return;
    }
    const delta = (_c = (_b = (_a = evt.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.delta) == null ? void 0 : _c.content;
    if (typeof delta === "string" && delta) req.onToken(delta);
  });
}
async function ensureOk(resp) {
  if (resp.ok && resp.body) return;
  let detail = "";
  try {
    detail = await resp.text();
  } catch (e) {
  }
  throw new Error(`HTTP ${resp.status}${detail ? ": " + detail.slice(0, 600) : ""}`);
}
async function readSSE(resp, onData) {
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).replace(/\r$/, "").trim();
      buffer = buffer.slice(nl + 1);
      if (line.startsWith("data:")) {
        onData(line.slice(5).trim());
      }
    }
  }
}

// src/output.ts
function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|#^[\]]/g, " ").replace(/\s+/g, " ").trim() || "Untitled";
}
function pad(n) {
  return n < 10 ? "0" + n : String(n);
}
function formatDate(withTime) {
  const d = /* @__PURE__ */ new Date();
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (!withTime) return date;
  return `${date} ${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}
function applyFilenameTemplate(tpl, vars) {
  const out = (tpl && tpl.trim() ? tpl : "{note} - {label}").replace(/\{note\}/g, vars.note).replace(/\{label\}/g, vars.label).replace(/\{datetime\}/g, formatDate(true)).replace(/\{date\}/g, formatDate(false));
  return sanitizeFilename(out);
}
function extFor(format) {
  return format === "canvas" ? ".canvas" : ".md";
}
function randomId() {
  const chars = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 16; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}
var CARD_WIDTH = 500;
var CARD_GAP = 40;
function nodeHeight(text) {
  return Math.min(2400, Math.max(160, text.split("\n").length * 22 + 40));
}
function splitIntoCards(md) {
  const text = md.trim();
  if (!text) return [];
  const isHeading = (l) => /^#{1,2}\s+\S/.test(l);
  const cards = [];
  let cur = [];
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
function cardNode(text, y) {
  return { id: randomId(), type: "text", text, x: 0, y, width: CARD_WIDTH, height: nodeHeight(text) };
}
function stackCards(cards, startY) {
  const nodes = [];
  let y = startY;
  for (const c of cards) {
    nodes.push(cardNode(c, y));
    y += nodeHeight(c) + CARD_GAP;
  }
  return { nodes, nextY: y };
}
function toCanvas(text) {
  const { nodes } = stackCards(splitIntoCards(text), 0);
  return JSON.stringify({ nodes, edges: [] }, null, 2);
}
function appendToCanvas(existing, text) {
  const cards = splitIntoCards(text);
  let data;
  try {
    data = JSON.parse(existing);
  } catch (e) {
    return toCanvas(text);
  }
  if (!data || !Array.isArray(data.nodes)) return toCanvas(text);
  let maxBottom = 0;
  for (const n of data.nodes) {
    const bottom = (typeof n.y === "number" ? n.y : 0) + (typeof n.height === "number" ? n.height : 0);
    if (bottom > maxBottom) maxBottom = bottom;
  }
  const { nodes } = stackCards(cards, maxBottom + CARD_GAP);
  data.nodes.push(...nodes);
  if (!Array.isArray(data.edges)) data.edges = [];
  return JSON.stringify(data, null, 2);
}

// src/view.ts
var VIEW_TYPE_CHEW_IT = "chew-it-view";
var WAITING_WORDS = [
  "Accomplishing",
  "Actualizing",
  "Baking",
  "Beaming",
  "Beboppin",
  "Befuddling",
  "Billowing",
  "Bloviating",
  "Boogieing",
  "Boondoggling",
  "Bootstrapping",
  "Booping",
  "Brewing",
  "Burrowing",
  "Calculating",
  "Caramelizing",
  "Cascading",
  "Cerebrating",
  "Channelling",
  "Choreographing",
  "Churning",
  "Clauding",
  "Coalescing",
  "Cogitating",
  "Composing",
  "Concocting",
  "Considering",
  "Contemplating",
  "Cooking",
  "Crafting",
  "Creating",
  "Crunching",
  "Crystallizing",
  "Cultivating",
  "Deciphering",
  "Deliberating",
  "Determining",
  "Discombobulating",
  "Distilling",
  "Doodling",
  "Effecting",
  "Elucidating",
  "Embellishing",
  "Enchanting",
  "Envisioning",
  "Fermenting",
  "Finagling",
  "Flamb\xE9ing",
  "Flowing",
  "Forging",
  "Forming",
  "Frosting",
  "Frolicking",
  "Gallivanting",
  "Generating",
  "Germinating",
  "Grooving",
  "Hatching",
  "Herding",
  "Hyperspacing",
  "Ideating",
  "Imagining",
  "Incubating",
  "Inferring",
  "Infusing",
  "Julienning",
  "Kneading",
  "Leavening",
  "Levitating",
  "Lollygagging",
  "Manifesting",
  "Marinating",
  "Meandering",
  "Moseying",
  "Mulling",
  "Mustering",
  "Musing",
  "Noodling",
  "Nucleating",
  "Orbiting",
  "Percolating",
  "Perusing",
  "Philosophising",
  "Photosynthesizing",
  "Pondering",
  "Pollinating",
  "Precipitating",
  "Processing",
  "Proofing",
  "Propagating",
  "Puttering",
  "Puzzling",
  "Quantumizing",
  "Recombobulating",
  "Reticulating",
  "Ruminating",
  "Scheming",
  "Scurrying",
  "Scampering",
  "Seasoning",
  "Shimmying",
  "Simmering",
  "Sketching",
  "Slithering",
  "Spelunking",
  "Spinning",
  "Sprouting",
  "Stewing",
  "Sublimating",
  "Sussing",
  "Swooping",
  "Swirling",
  "Synthesizing",
  "Tempering",
  "Thinking",
  "Tinkering",
  "Transfiguring",
  "Transmuting",
  "Unfurling",
  "Unravelling",
  "Vibing",
  "Wandering",
  "Whirring",
  "Whisking",
  "Working",
  "Wrangling",
  "Zesting",
  "Zigzagging"
];
var ChewItView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.runs = [];
    this.running = false;
    // The tab the "···" menu acts on (regenerate / export).
    this.activeRun = null;
    // Abort handle for an export-mode LLM call (which has no result tab).
    this.extraAbort = null;
    // Function ids the user has unchecked; everything else is selected by
    // default. "Chew It" analyzes only the currently selected functions.
    this.deselected = /* @__PURE__ */ new Set();
    // The presets / note behind the currently shown results, so "Regenerate"
    // can reproduce them (and so we can persist them across restarts).
    this.lastPresetIds = [];
    this.lastNoteTitle = "";
    // Path of the note whose results the panel is currently showing.
    this.currentPath = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_CHEW_IT;
  }
  getDisplayText() {
    return "Chew It";
  }
  getIcon() {
    return "sparkles";
  }
  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass("chew-it-view");
    const header = root.createDiv("chew-it-header");
    this.runBtn = header.createEl("button", { cls: "chew-it-brand" });
    const brandIcon = this.runBtn.createSpan({ cls: "chew-it-brand-icon" });
    (0, import_obsidian2.setIcon)(brandIcon, "sparkles");
    this.runBtn.createSpan({ cls: "chew-it-brand-text", text: "Chew It" });
    this.runBtn.onclick = () => this.runAnalysis();
    this.tabsEl = header.createDiv("chew-it-tabs");
    this.resultsHeader = root.createDiv("chew-it-results-header");
    this.locateBtn = this.resultsHeader.createEl("button", { cls: "chew-it-locate-btn" });
    (0, import_obsidian2.setIcon)(this.locateBtn, "target");
    this.locateBtn.onclick = () => this.locateNote();
    this.resultTabsEl = this.resultsHeader.createDiv("chew-it-result-tabs");
    this.menuBtn = this.resultsHeader.createEl("button", { cls: "chew-it-menu-btn" });
    (0, import_obsidian2.setIcon)(this.menuBtn, "more-horizontal");
    this.menuBtn.onclick = (e) => this.showActionsMenu(e);
    this.resultsHeader.hide();
    this.resultEl = root.createDiv("chew-it-result");
    const statusBar = root.createDiv("chew-it-statusbar");
    this.statusIconEl = statusBar.createSpan({ cls: "chew-it-status-icon" });
    (0, import_obsidian2.setIcon)(this.statusIconEl, "loader-2");
    this.statusIconEl.hide();
    this.statusEl = statusBar.createDiv("chew-it-status");
    this.stopBtn = statusBar.createEl("button", { cls: "chew-it-stop" });
    this.stopBtn.onclick = () => this.stopAll();
    this.stopBtn.hide();
    this.localize();
    this.showNoteResults(this.plugin.currentNotePath(), true);
  }
  async onClose() {
    this.stopAll();
  }
  lang() {
    return this.plugin.currentLang();
  }
  // A random Claude Code-style waiting verb for the status bar while running.
  waitingWord() {
    return WAITING_WORDS[Math.floor(Math.random() * WAITING_WORDS.length)] + "\u2026";
  }
  // Re-apply language to static UI and rebuild the function chips.
  localize() {
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
  refreshTabs() {
    this.localize();
  }
  // Functions that participate in a run: enabled (undefined = enabled).
  enabledPrompts() {
    return this.plugin.settings.prompts.filter((p) => p.enabled !== false);
  }
  // The enabled functions the user currently has checked.
  selectedPresets() {
    return this.enabledPrompts().filter((p) => !this.deselected.has(p.id));
  }
  buildTabs() {
    this.tabsEl.empty();
    const prompts = this.enabledPrompts();
    const lang = this.lang();
    if (prompts.length === 0) {
      this.runBtn.disabled = true;
      this.tabsEl.createSpan({ cls: "chew-it-tabs-empty", text: t(lang, "ui.tabsEmpty") });
      return;
    }
    for (const p of prompts) {
      const label = p.label || t(lang, "ui.untitled");
      const on = !this.deselected.has(p.id);
      const chip = this.tabsEl.createEl("button", { cls: "chew-it-chip" });
      chip.toggleClass("is-selected", on);
      chip.setAttribute("role", "checkbox");
      chip.setAttribute("aria-checked", String(on));
      chip.setAttribute("aria-label", label);
      const box = chip.createSpan({ cls: "chew-it-chip-check" });
      (0, import_obsidian2.setIcon)(box, "check");
      chip.createSpan({ cls: "chew-it-chip-label", text: label });
      chip.onclick = () => this.toggleSelection(p.id, chip);
    }
    this.updateRunBtn();
  }
  toggleSelection(id, chip) {
    if (this.deselected.has(id)) this.deselected.delete(id);
    else this.deselected.add(id);
    const on = !this.deselected.has(id);
    chip.toggleClass("is-selected", on);
    chip.setAttribute("aria-checked", String(on));
    this.updateRunBtn();
  }
  // "Chew It" is live only when idle and at least one function is checked.
  updateRunBtn() {
    this.runBtn.disabled = this.running || this.selectedPresets().length === 0;
  }
  // The actions button only matters once there's a result to act on.
  updateMenuBtn() {
    this.menuBtn.toggle(!this.running && this.runs.length > 0);
  }
  // Jump back to the note these results belong to.
  async locateNote() {
    if (!this.currentPath) return;
    const ok = await this.plugin.revealNote(this.currentPath);
    if (!ok) new import_obsidian2.Notice(t(this.lang(), "notice.noteGone"));
  }
  // Tab-level "···" dropdown: every action targets the active tab — regenerate
  // just that function, or export just its result via an output template.
  showActionsMenu(evt) {
    const lang = this.lang();
    const menu = new import_obsidian2.Menu();
    menu.addItem(
      (item) => item.setTitle(t(lang, "ui.regenerate")).setIcon("refresh-cw").onClick(() => void this.regenerateActive())
    );
    const outs = this.plugin.settings.outputs;
    if (outs.length > 0) {
      menu.addSeparator();
      menu.addItem((item) => {
        item.setTitle(t(lang, "ui.output"));
        if (typeof item.setIsLabel === "function") item.setIsLabel(true);
        else item.setDisabled(true);
      });
      for (const o of outs) {
        menu.addItem(
          (item) => item.setTitle(o.label || t(lang, "ui.untitled")).setIcon(o.format === "canvas" ? "layout-dashboard" : "download").onClick(() => void this.runOutput(o.id))
        );
      }
    }
    menu.showAtMouseEvent(evt);
  }
  // Re-run the active tab's function in place, leaving the other tabs untouched.
  async regenerateActive() {
    var _a, _b;
    if (this.running) return;
    const run = this.activeRun;
    if (!run) return;
    const lang = this.lang();
    let prompt = run.prompt;
    let system = run.system;
    if (!prompt) {
      const preset = this.plugin.settings.prompts.find((p) => p.id === run.id || p.label === run.label);
      prompt = (_a = preset == null ? void 0 : preset.prompt) != null ? _a : "";
      system = (_b = preset == null ? void 0 : preset.system) != null ? _b : "";
    }
    if (!prompt) {
      new import_obsidian2.Notice(t(lang, "notice.cannotRegen"));
      return;
    }
    const config = this.buildConfig();
    if (!config) {
      new import_obsidian2.Notice(t(lang, "notice.needKey"));
      return;
    }
    const note = await this.plugin.getActiveNoteContent();
    if (!note) {
      new import_obsidian2.Notice(t(lang, "notice.noNote"));
      return;
    }
    if (!note.content.trim()) {
      new import_obsidian2.Notice(t(lang, "notice.empty"));
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
  stopAll() {
    var _a;
    for (const r of this.runs) r.controller.abort();
    (_a = this.extraAbort) == null ? void 0 : _a.abort();
  }
  buildConfig() {
    const s = this.plugin.settings;
    const config = s.provider === "claude" ? {
      provider: "claude",
      apiKey: s.claudeApiKey,
      model: s.claudeModel,
      baseUrl: "",
      maxTokens: s.maxTokens
    } : {
      provider: "openai",
      apiKey: s.openaiApiKey,
      model: s.openaiModel,
      baseUrl: s.openaiBaseUrl,
      maxTokens: s.maxTokens
    };
    return config.apiKey ? config : null;
  }
  // Reset the result area for a fresh generation.
  beginGeneration() {
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
  async runAnalysis() {
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
  async runPresets(presets, append = false) {
    if (this.running) return;
    const lang = this.plugin.currentLang();
    if (presets.length === 0) {
      new import_obsidian2.Notice(t(lang, "notice.needFn"));
      return;
    }
    const config = this.buildConfig();
    if (!config) {
      new import_obsidian2.Notice(t(lang, "notice.needKey"));
      return;
    }
    const note = await this.plugin.getActiveNoteContent();
    if (!note) {
      new import_obsidian2.Notice(t(lang, "notice.noNote"));
      return;
    }
    if (!note.content.trim()) {
      new import_obsidian2.Notice(t(lang, "notice.empty"));
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
    if (append && this.runs[firstNew]) this.setActiveRun(this.runs[firstNew]);
    await Promise.allSettled(jobs);
    this.lastPresetIds = this.runs.map((r) => r.id);
    this.setRunning(false);
    this.snapshotResults();
  }
  // Export the ACTIVE tab's result via an output template. Operates only on
  // that tab's content and never disturbs the result tabs.
  async runOutput(outputId) {
    var _a;
    if (this.running) return;
    const s = this.plugin.settings;
    const lang = this.plugin.currentLang();
    const run = this.activeRun;
    if (!run) return;
    const out = s.outputs.find((o) => o.id === outputId);
    if (!out) {
      new import_obsidian2.Notice(t(lang, "notice.needOutput"));
      return;
    }
    const source = run.raw.trim();
    if (!source) {
      new import_obsidian2.Notice(t(lang, "notice.empty"));
      return;
    }
    const baseName = this.lastNoteTitle || run.label || "chew";
    const filename = applyFilenameTemplate(out.filename, {
      note: baseName,
      label: out.label || run.label
    }) + extFor(out.format);
    const isCanvas = out.format === "canvas";
    try {
      const path = await this.plugin.prepareOutputPath(out.folder, filename);
      const existing = await this.plugin.readIfExists(path);
      let content;
      if (existing === null) content = isCanvas ? toCanvas(source) : source;
      else if (isCanvas) content = appendToCanvas(existing, source);
      else content = existing.replace(/\s+$/, "") + "\n\n" + source;
      await this.plugin.writeFile(path, content);
      new import_obsidian2.Notice(t(lang, existing === null ? "notice.saved" : "notice.appended", { path }));
    } catch (e) {
      new import_obsidian2.Notice(t(lang, "notice.saveError", { msg: String((_a = e.message) != null ? _a : e) }));
    }
  }
  async startRun(preset, config, note, lang) {
    var _a;
    const run = this.createRunBlock(preset.label || t(lang, "ui.untitled"), lang);
    run.id = preset.id;
    run.prompt = preset.prompt;
    run.system = (_a = preset.system) != null ? _a : "";
    await this.runPresetInto(run, preset.prompt, run.system, config, note, lang);
  }
  // Stream a prompt's result into a run block — used both for a fresh run and
  // for regenerating an existing tab in place.
  async runPresetInto(run, prompt, system, config, note, lang) {
    var _a, _b;
    run.controller = new AbortController();
    run.raw = "";
    run.state = "";
    run.renderQueued = false;
    run.bodyEl.empty();
    run.tabEl.removeClass("is-done");
    run.tabEl.removeClass("is-error");
    run.tabEl.addClass("is-running");
    run.statusEl.setText(t(lang, "run.analyzing"));
    const userPrompt = `${prompt}

---
${t(lang, "prompt.docTitle")}\uFF1A${note.title}

${note.content}`;
    try {
      await streamCompletion(config, {
        system,
        user: userPrompt,
        signal: run.controller.signal,
        onToken: (tk) => this.appendChunk(run, tk)
      });
      this.finishRun(run, t(lang, "run.done"), "is-done");
    } catch (e) {
      const err = e;
      if (err.name === "AbortError") {
        this.finishRun(run, t(lang, "run.stopped"), "");
      } else {
        this.finishRun(run, t(lang, "run.error"), "is-error");
        run.bodyEl.createEl("pre", { cls: "chew-it-error", text: String((_a = err.message) != null ? _a : err) });
        new import_obsidian2.Notice(t(lang, "notice.error", { msg: String((_b = err.message) != null ? _b : err) }));
      }
    } finally {
      await this.flushRender(run);
    }
  }
  // Create a result tab + its (hidden unless active) content panel.
  createRunBlock(title, lang) {
    const tabEl = this.resultTabsEl.createEl("button", {
      cls: "chew-it-result-tab is-running",
      text: title
    });
    const containerEl = this.resultEl.createDiv("chew-it-run");
    const statusEl = containerEl.createDiv("chew-it-run-status");
    statusEl.setText(t(lang, "run.analyzing"));
    const bodyEl = containerEl.createDiv("chew-it-run-body markdown-rendered");
    const run = {
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
      renderQueued: false
    };
    this.runs.push(run);
    tabEl.onclick = () => this.setActiveRun(run);
    if (this.runs.length === 1) this.setActiveRun(run);
    else containerEl.hide();
    return run;
  }
  setActiveRun(run) {
    this.activeRun = run;
    for (const r of this.runs) {
      const active = r === run;
      r.containerEl.toggle(active);
      r.tabEl.toggleClass("is-active", active);
    }
  }
  finishRun(run, status, cssState) {
    run.statusEl.setText(status);
    run.state = cssState;
    run.tabEl.removeClass("is-running");
    if (cssState) run.tabEl.addClass(cssState);
  }
  setRunning(running) {
    this.running = running;
    this.runBtn.toggleClass("is-running", running);
    this.updateRunBtn();
    this.statusIconEl.toggle(running);
    this.statusEl.toggleClass("is-working", running);
    this.stopBtn.toggle(running);
    this.tabsEl.toggleClass("chew-it-tabs--disabled", running);
    this.updateMenuBtn();
  }
  appendChunk(run, text) {
    run.raw += text;
    this.scheduleRender(run);
  }
  scheduleRender(run) {
    if (run.renderQueued) return;
    run.renderQueued = true;
    window.setTimeout(() => {
      run.renderQueued = false;
      void this.renderRun(run);
    }, 120);
  }
  async flushRender(run) {
    run.renderQueued = false;
    await this.renderRun(run);
  }
  async renderRun(run) {
    run.bodyEl.empty();
    await import_obsidian2.MarkdownRenderer.render(this.app, run.raw, run.bodyEl, "", this);
  }
  // Persist the current note's results so they reappear after a restart and
  // when navigating back to this document.
  snapshotResults() {
    var _a;
    const path = this.currentPath;
    if (!path) return;
    if (this.runs.length === 0) {
      void this.plugin.saveNoteResult(path, null);
      return;
    }
    const cache = {
      noteTitle: this.lastNoteTitle,
      status: (_a = this.statusEl.textContent) != null ? _a : "",
      presetIds: this.lastPresetIds,
      updatedAt: Date.now(),
      runs: this.runs.map((r) => {
        var _a2;
        return {
          id: r.id,
          label: r.label,
          prompt: r.prompt,
          system: r.system,
          raw: r.raw,
          state: r.state,
          status: (_a2 = r.statusEl.textContent) != null ? _a2 : ""
        };
      })
    };
    void this.plugin.saveNoteResult(path, cache);
  }
  // Rebuild result tabs and bodies from a saved snapshot — no LLM calls.
  restoreCache(cache) {
    var _a, _b, _c, _d, _e, _f;
    if (!((_a = cache.runs) == null ? void 0 : _a.length)) return;
    const lang = this.lang();
    this.resultEl.empty();
    this.resultTabsEl.empty();
    this.runs = [];
    this.activeRun = null;
    this.resultsHeader.show();
    this.resultEl.addClass("is-tabbed");
    this.lastPresetIds = (_b = cache.presetIds) != null ? _b : [];
    this.lastNoteTitle = (_c = cache.noteTitle) != null ? _c : "";
    for (const item of cache.runs) {
      const run = this.createRunBlock(item.label, lang);
      run.id = (_d = item.id) != null ? _d : item.label;
      run.prompt = (_e = item.prompt) != null ? _e : "";
      run.system = (_f = item.system) != null ? _f : "";
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
  showNoteResults(path, force = false) {
    if (!this.resultEl) return;
    if (this.running) return;
    if (!force && path === this.currentPath) return;
    this.currentPath = path;
    const cache = path ? this.plugin.getNoteResult(path) : null;
    if (cache) this.restoreCache(cache);
    else this.clearResults();
  }
  // Reset the result area to its empty state.
  clearResults() {
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
};

// src/main.ts
var MAX_CACHED_NOTES = 30;
var ChewItPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    // Analysis results keyed by note path, restored into the panel on open and
    // when switching documents.
    this.noteResults = {};
    // The most recently focused Markdown note — used as the analysis target even
    // when the Chew It panel itself holds focus.
    this.lastMarkdownView = null;
  }
  async onload() {
    await this.loadSettings();
    const lang = this.currentLang();
    this.registerView(VIEW_TYPE_CHEW_IT, (leaf) => new ChewItView(leaf, this));
    this.addRibbonIcon(
      "sparkles",
      t(lang, "ribbon.tooltip"),
      () => this.activateAndAnalyze()
    );
    this.addCommand({
      id: "analyze-current-note",
      name: t(lang, "cmd.analyze"),
      callback: () => this.activateAndAnalyze()
    });
    this.addCommand({
      id: "open-panel",
      name: t(lang, "cmd.openPanel"),
      callback: () => {
        void this.activateView();
      }
    });
    this.addSettingTab(new ChewItSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      const mv = this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
      if (mv) this.lastMarkdownView = mv;
    });
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        var _a, _b;
        if ((leaf == null ? void 0 : leaf.view) instanceof import_obsidian3.MarkdownView) {
          this.lastMarkdownView = leaf.view;
          const path = (_b = (_a = leaf.view.file) == null ? void 0 : _a.path) != null ? _b : null;
          for (const l of this.app.workspace.getLeavesOfType(VIEW_TYPE_CHEW_IT)) {
            const v = l.view;
            if (v instanceof ChewItView) v.showNoteResults(path);
          }
        }
      })
    );
  }
  async loadSettings() {
    var _a, _b, _c;
    const data = await this.loadData();
    const source = (_b = (_a = data == null ? void 0 : data.settings) != null ? _a : data) != null ? _b : {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, source);
    const legacyRole = this.settings.systemPrompt;
    if (legacyRole) {
      for (const p of this.settings.prompts) {
        if (p.system === void 0) p.system = legacyRole;
      }
    }
    delete this.settings.systemPrompt;
    this.noteResults = (_c = data == null ? void 0 : data.results) != null ? _c : {};
  }
  async saveSettings() {
    await this.persist();
  }
  getNoteResult(path) {
    var _a;
    return (_a = this.noteResults[path]) != null ? _a : null;
  }
  // Store (or clear) one note's results without touching settings.
  async saveNoteResult(path, cache) {
    if (cache) this.noteResults[path] = cache;
    else delete this.noteResults[path];
    this.trimResults();
    await this.persist();
  }
  // Keep only the most recently updated notes' results.
  trimResults() {
    const keys = Object.keys(this.noteResults);
    if (keys.length <= MAX_CACHED_NOTES) return;
    keys.sort((a, b) => {
      var _a, _b;
      return ((_a = this.noteResults[a].updatedAt) != null ? _a : 0) - ((_b = this.noteResults[b].updatedAt) != null ? _b : 0);
    }).slice(0, keys.length - MAX_CACHED_NOTES).forEach((k) => delete this.noteResults[k]);
  }
  currentLang() {
    return import_obsidian3.moment.locale().startsWith("zh") ? "zh" : "en";
  }
  // Path of the note the panel should currently target.
  currentNotePath() {
    const mv = this.lastMarkdownView;
    if (mv == null ? void 0 : mv.file) return mv.file.path;
    const f = this.app.workspace.getActiveFile();
    return f && f.extension === "md" ? f.path : null;
  }
  async persist() {
    await this.saveData({ settings: this.settings, results: this.noteResults });
  }
  // Rebuild the tab bar in any open Chew It panel after the function list changes.
  refreshViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_CHEW_IT)) {
      const view = leaf.view;
      if (view instanceof ChewItView) view.refreshTabs();
    }
  }
  async activateView() {
    var _a;
    const { workspace } = this.app;
    let leaf = (_a = workspace.getLeavesOfType(VIEW_TYPE_CHEW_IT)[0]) != null ? _a : null;
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) return null;
      await leaf.setViewState({ type: VIEW_TYPE_CHEW_IT, active: true });
    }
    await workspace.revealLeaf(leaf);
    return leaf.view;
  }
  async activateAndAnalyze() {
    const view = await this.activateView();
    if (!view) return;
    const path = this.currentNotePath();
    if (path && this.getNoteResult(path)) return;
    void view.runAnalysis();
  }
  async getActiveNoteContent() {
    const mv = this.lastMarkdownView;
    if (mv == null ? void 0 : mv.file) {
      try {
        return { title: mv.file.basename, content: mv.editor.getValue(), path: mv.file.path };
      } catch (e) {
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
  async writeOutput(folder, filename, content) {
    const cleanFolder = (0, import_obsidian3.normalizePath)(folder.replace(/^\/+|\/+$/g, ""));
    const hasFolder = cleanFolder !== "" && cleanFolder !== ".";
    if (hasFolder && !this.app.vault.getAbstractFileByPath(cleanFolder)) {
      try {
        await this.app.vault.createFolder(cleanFolder);
      } catch (e) {
      }
    }
    const path = (0, import_obsidian3.normalizePath)(hasFolder ? `${cleanFolder}/${filename}` : filename);
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian3.TFile) {
      await this.app.vault.modify(existing, content);
    } else {
      await this.app.vault.create(path, content);
    }
    return path;
  }
  // Resolve `<folder>/<filename>` to a normalized vault path, creating the
  // folder if it doesn't exist yet. Does not write anything.
  async prepareOutputPath(folder, filename) {
    const cleanFolder = (0, import_obsidian3.normalizePath)(folder.replace(/^\/+|\/+$/g, ""));
    const hasFolder = cleanFolder !== "" && cleanFolder !== ".";
    if (hasFolder && !this.app.vault.getAbstractFileByPath(cleanFolder)) {
      try {
        await this.app.vault.createFolder(cleanFolder);
      } catch (e) {
      }
    }
    return (0, import_obsidian3.normalizePath)(hasFolder ? `${cleanFolder}/${filename}` : filename);
  }
  // Return the text of an existing file, or null if it doesn't exist.
  async readIfExists(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian3.TFile) return await this.app.vault.read(file);
    return null;
  }
  // Create or overwrite a file at the given path.
  async writeFile(path, content) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian3.TFile) {
      await this.app.vault.modify(file, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }
  async openPath(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian3.TFile) {
      await this.app.workspace.getLeaf(true).openFile(file);
    }
  }
  // Jump back to a note: focus an already-open pane showing it, else open it in
  // the main editor area. Returns false if the file is gone.
  async revealNote(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian3.TFile)) return false;
    const open = this.app.workspace.getLeavesOfType("markdown").find((l) => {
      var _a;
      return l.view instanceof import_obsidian3.MarkdownView && ((_a = l.view.file) == null ? void 0 : _a.path) === path;
    });
    if (open) {
      this.app.workspace.setActiveLeaf(open, { focus: true });
      await this.app.workspace.revealLeaf(open);
    } else {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
    return true;
  }
};
