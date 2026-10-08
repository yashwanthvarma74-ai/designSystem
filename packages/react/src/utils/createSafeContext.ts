import { createContext, useContext } from 'react';

// A context that throws a readable error when a part is used outside its parent.
export function createSafeContext<T>(parentName: string, partName: string) {
  const Context = createContext<T | null>(null);
  function useSafeContext(): T {
    const value = useContext(Context);
    if (value === null) {
      throw new Error(`<${partName}> must be rendered inside <${parentName}>.`);
    }
    return value;
  }
  return [Context.Provider, useSafeContext] as const;
}
