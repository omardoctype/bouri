const isStorageAvailable = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const safeStorage = {
  getItem(key: string): string | null {
    if (!isStorageAvailable()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): boolean {
    if (!isStorageAvailable()) return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  removeItem(key: string): boolean {
    if (!isStorageAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

