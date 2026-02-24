/// <reference types="vite/client" />

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function translateText(text: string, targetLang: "fr" | "en") {
  const res = await fetch(`${BASE_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!res.ok) {
    // fail-soft
    return text;
  }

  const data = await res.json();
  // support either { translatedText } or { text }
  return data.translatedText ?? data.text ?? text;
}