// src/data/resumeStore.ts

type Lang = "en" | "fr";

const DB_NAME = "portfolio_db";
const DB_VERSION = 3; // bump to force upgrade
const STORE = "resume_files";

function keyFor(lang: Lang) {
  return `resume_${lang}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function deleteDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}

async function openDbSafe(): Promise<IDBDatabase> {
  const db = await openDb();

  if (!db.objectStoreNames.contains(STORE)) {
    db.close();
    await deleteDb();
    return openDb();
  }

  return db;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] ?? "application/pdf";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  return new File([bytes], filename, { type: mime });
}

export async function getResume(lang: Lang): Promise<File | null> {
  const db = await openDbSafe();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.get(keyFor(lang));

    req.onsuccess = () => {
      const value = req.result as { dataUrl: string; name: string } | undefined;
      resolve(value ? dataUrlToFile(value.dataUrl, value.name) : null);
    };
    req.onerror = () => reject(req.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function saveResume(lang: Lang, file: File): Promise<void> {
  const db = await openDbSafe();
  const dataUrl = await fileToDataUrl(file);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    store.put({ dataUrl, name: file.name }, keyFor(lang));

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ✅ keep the same export name your page imports
export async function deleteResume(lang: Lang): Promise<void> {
  const db = await openDbSafe();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    store.delete(keyFor(lang));

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// optional alias if anything else imports it
export const clearResume = deleteResume;
