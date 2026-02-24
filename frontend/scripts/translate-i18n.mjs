import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import * as deepl from "deepl-node";

const AUTH_KEY = process.env.DEEPL_AUTH_KEY;
if (!AUTH_KEY) {
  console.error("Missing DEEPL_AUTH_KEY in environment.");
  process.exit(1);
}

const translator = new deepl.Translator(AUTH_KEY);

// Adjust these paths if your i18n folder differs
const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, "src", "i18n", "locales", "en");
const FR_DIR = path.join(ROOT, "src", "i18n", "locales", "fr");

// Only translate these files:
const FILES = ["public.json", "common.json"];

// DeepL language codes
const SOURCE_LANG = "EN";
const TARGET_LANG = "FR";

// Protect i18next placeholders like {{name}}, {{min}}, etc.
function protectPlaceholders(text) {
  const tokens = [];
  const protectedText = text.replace(/{{\s*[^}]+\s*}}/g, (m) => {
    const id = tokens.length;
    tokens.push(m);
    return `__PH_${id}__`;
  });
  return { protectedText, tokens };
}

function restorePlaceholders(text, tokens) {
  let out = text;
  tokens.forEach((tok, i) => {
    out = out.replaceAll(`__PH_${i}__`, tok);
  });
  return out;
}

// Decide if a string should be translated.
// You can customize this if you have values you NEVER want translated.
function shouldTranslateString(s) {
  if (!s) return false;
  const trimmed = s.trim();
  if (!trimmed) return false;

  // Skip things that are basically code/tech labels (optional heuristics)
  // (DeepL usually leaves "React", "Spring Boot" alone, but this reduces risk.)
  if (/^(React|Spring Boot|TypeScript|Java|SQL|HTML5|CSS3|Figma|Git\/GitHub|REST APIs|Microservices)$/i.test(trimmed)) {
    return false;
  }

  // If it's mostly symbols/numbers, skip
  const letters = trimmed.match(/[A-Za-z]/g)?.length ?? 0;
  if (letters === 0) return false;

  return true;
}

// Walk JSON and collect all strings + their "paths"
function collectStrings(node, currentPath = []) {
  const out = [];
  if (typeof node === "string") {
    out.push({ path: currentPath, value: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => out.push(...collectStrings(v, [...currentPath, i])));
    return out;
  }
  if (node && typeof node === "object") {
    Object.entries(node).forEach(([k, v]) => {
      out.push(...collectStrings(v, [...currentPath, k]));
    });
    return out;
  }
  return out;
}

function setAtPath(rootObj, p, value) {
  let cur = rootObj;
  for (let i = 0; i < p.length - 1; i++) {
    cur = cur[p[i]];
  }
  cur[p[p.length - 1]] = value;
}

async function translateBatch(texts) {
  // DeepL can accept arrays of strings.
  // We'll keep formatting as is. For UI text, formality can be left default.
  const results = await translator.translateText(texts, SOURCE_LANG, TARGET_LANG);
  // deepl-node returns single result if input is string, array otherwise
  return Array.isArray(results) ? results.map((r) => r.text) : [results.text];
}

async function translateFile(fileName) {
  const enPath = path.join(EN_DIR, fileName);
  const frPath = path.join(FR_DIR, fileName);

  const enJson = JSON.parse(fs.readFileSync(enPath, "utf8"));

  // Start from existing FR if it exists, otherwise clone EN structure
  let frJson;
  if (fs.existsSync(frPath)) {
    frJson = JSON.parse(fs.readFileSync(frPath, "utf8"));
  } else {
    frJson = JSON.parse(JSON.stringify(enJson));
  }

  // Ensure FR has same structure as EN (adds missing keys)
  // Simple merge that preserves existing FR translations.
  function deepMerge(target, source) {
    if (typeof source === "string") return target ?? source;
    if (Array.isArray(source)) {
      if (!Array.isArray(target)) return JSON.parse(JSON.stringify(source));
      // Ensure length
      const out = target.slice();
      for (let i = 0; i < source.length; i++) {
        out[i] = deepMerge(out[i], source[i]);
      }
      return out;
    }
    if (source && typeof source === "object") {
      const out = target && typeof target === "object" ? { ...target } : {};
      for (const [k, v] of Object.entries(source)) {
        out[k] = deepMerge(out[k], v);
      }
      return out;
    }
    return target ?? source;
  }
  frJson = deepMerge(frJson, enJson);

  // Collect strings from EN; we translate EN -> FR and write into frJson.
  const strings = collectStrings(enJson);

  // Build translation jobs for strings that need translating AND are missing/outdated in FR.
  const jobs = [];
  for (const item of strings) {
    const { path: p, value: enValue } = item;

    if (!shouldTranslateString(enValue)) continue;

    // Find current FR value at same path
    let cur = frJson;
    for (const step of p) cur = cur?.[step];

    // If FR value is missing or equals EN, translate
    if (typeof cur !== "string" || cur.trim() === "" || cur === enValue) {
      jobs.push({ path: p, enValue });
    }
  }

  if (jobs.length === 0) {
    console.log(`${fileName}: nothing to translate (already up to date).`);
    return;
  }

  console.log(`${fileName}: translating ${jobs.length} strings...`);

  // Translate in chunks to avoid huge requests
  const CHUNK_SIZE = 40;
  for (let i = 0; i < jobs.length; i += CHUNK_SIZE) {
    const chunk = jobs.slice(i, i + CHUNK_SIZE);

    const protectedChunk = chunk.map((j) => protectPlaceholders(j.enValue));
    const textsToTranslate = protectedChunk.map((x) => x.protectedText);

    const translated = await translateBatch(textsToTranslate);

    translated.forEach((tr, idx) => {
      const restored = restorePlaceholders(tr, protectedChunk[idx].tokens);
      setAtPath(frJson, chunk[idx].path, restored);
    });

    // tiny progress
    console.log(`  - ${Math.min(i + CHUNK_SIZE, jobs.length)}/${jobs.length}`);
  }

  fs.mkdirSync(FR_DIR, { recursive: true });
  fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2) + "\n", "utf8");
  console.log(`${fileName}: wrote ${frPath}`);
}

async function main() {
  for (const f of FILES) {
    await translateFile(f);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});