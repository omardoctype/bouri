import { useEffect, useState } from 'react';
import { safeStorage } from '../lib/safe-storage';

const hasCompatibleShape = (initialValue: unknown, parsedValue: unknown) => {
  if (Array.isArray(initialValue)) {
    return Array.isArray(parsedValue);
  }

  if (initialValue !== null && typeof initialValue === 'object') {
    return parsedValue !== null && typeof parsedValue === 'object' && !Array.isArray(parsedValue);
  }

  if (initialValue === null) {
    return parsedValue === null;
  }

  return typeof parsedValue === typeof initialValue;
};

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = safeStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item) as unknown;
      return hasCompatibleShape(initialValue, parsed) ? (parsed as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    safeStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

