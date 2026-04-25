import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = (val: T) => {
    setState(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [state, setValue];
}
