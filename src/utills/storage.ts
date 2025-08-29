import { TextRevision } from "@/types";

const STORAGE_KEY = "tone-picker-app-data";

interface StoredData {
  currentText: string;
  revisions: TextRevision[];
  currentRevisionIndex: number;
}

function isStorageAvailable(): boolean {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch {
    return false;
  }
}

export function saveToStorage(data: Partial<StoredData>): void {
  if (!isStorageAvailable()) return;

  try {
    const existing = loadFromStorage();

    const dataToSave: StoredData = {
      ...existing,
      ...data,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function loadFromStorage(): StoredData {
  const defaultData: StoredData = {
    currentText: "",
    revisions: [],
    currentRevisionIndex: -1,
  };

  if (!isStorageAvailable()) return defaultData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultData;

    const parsed = JSON.parse(stored);

    if (typeof parsed !== "object" || !Array.isArray(parsed.revisions)) {
      return defaultData;
    }

    return {
      currentText: parsed.currentText || "",
      revisions: parsed.revisions || [],
      currentRevisionIndex: parsed.currentRevisionIndex ?? -1,
    };
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return defaultData;
  }
}

export function clearStorage(): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}
