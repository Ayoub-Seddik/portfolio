import { translateText } from "../api/translateApi";

const PREFIX = "tr:v1:";

function keyFor(text: string, targetLang: string) {
  // keep key small-ish
  const normalized = text.trim();
  return `${PREFIX}${targetLang}:${normalized}`;
}

export async function translateCached(text: string, targetLang: "fr" | "en") {
  if (!text || !text.trim()) return text;

  const key = keyFor(text, targetLang);
  const cached = localStorage.getItem(key);
  if (cached) return cached;

  const translated = await translateText(text, targetLang);
  try {
    localStorage.setItem(key, translated);
  } catch {
    // ignore storage quota issues
  }
  return translated;
}