const DB_NAME = "portfolio-db";
const STORE = "experience";
const VERSION = 1;

export type Lang = "en" | "fr";

export type ExperienceItem = {
  title: string;
  org: string;
  dates: string;
  bullets: string[];
  tech?: string[];
};

export type EducationItem = {
  program: string;
  school: string;
  dates: string;
};

type Payload = {
  experience: ExperienceItem[];
  educationItems: EducationItem[];
};

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

export async function saveExperience(lang: Lang, data: Payload): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    tx.objectStore(STORE).put(data, lang);
  });
  db.close();
}

export async function getExperience(lang: Lang): Promise<Payload | null> {
  const db = await openDb();
  const result = await new Promise<Payload | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    tx.onerror = () => reject(tx.error);

    const req = tx.objectStore(STORE).get(lang);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as Payload) ?? null);
  });
  db.close();
  return result;
}

export async function deleteExperience(lang: Lang): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    tx.objectStore(STORE).delete(lang);
  });
  db.close();
}
