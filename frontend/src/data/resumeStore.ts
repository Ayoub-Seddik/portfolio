const DB_NAME = "portfolio-db";
const STORE = "resumes";
const VERSION = 1;

// keys: "en" | "fr"
type ResumeLang = "en" | "fr";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onerror = () => reject(req.error);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    req.onsuccess = () => resolve(req.result);
  });
}

export async function saveResume(lang: ResumeLang, file: File): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    const store = tx.objectStore(STORE);
    store.put(file, lang);
  });
  db.close();
}

export async function getResume(lang: ResumeLang): Promise<File | null> {
  const db = await openDb();
  const result = await new Promise<File | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    tx.onerror = () => reject(tx.error);

    const store = tx.objectStore(STORE);
    const req = store.get(lang);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as File) ?? null);
  });
  db.close();
  return result;
}

export async function deleteResume(lang: ResumeLang): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    const store = tx.objectStore(STORE);
    store.delete(lang);
  });
  db.close();
}
