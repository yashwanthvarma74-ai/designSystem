import { useCallback, useRef, useState } from 'react';

interface Options<T> {
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
}

// Lets a component work both controlled (value + onChange) and uncontrolled (defaultValue).
export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const [inner, setInner] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : inner;

  const latest = useRef({ current, isControlled, onChange });
  latest.current = { current, isControlled, onChange };

  const update = useCallback((next: T | ((prev: T) => T)) => {
    const { current: prev, isControlled: controlled, onChange: notify } = latest.current;
    const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
    if (Object.is(resolved, prev)) return;
    if (!controlled) setInner(resolved);
    notify?.(resolved);
  }, []);

  return [current, update] as const;
}
