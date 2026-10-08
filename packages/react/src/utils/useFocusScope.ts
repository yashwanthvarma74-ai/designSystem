import { useEffect, useRef, type RefObject } from 'react';
import { getFocusable, trapTab } from './focus';

interface Options {
  active: boolean;
  /** Element to focus first. Falls back to the first tabbable child, then the container. */
  initialFocus?: RefObject<HTMLElement | null>;
  trap?: boolean;
  restoreFocus?: boolean;
}

// Moves focus into a container when it opens, optionally traps Tab, and gives focus back on close.
export function useFocusScope(containerRef: RefObject<HTMLElement | null>, options: Options) {
  const { active, initialFocus, trap = true, restoreFocus = true } = options;
  const returnTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    returnTarget.current = document.activeElement as HTMLElement | null;

    const target = initialFocus?.current ?? getFocusable(container)[0] ?? container;
    target.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (trap) trapTab(event, container);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (restoreFocus) {
        const back = returnTarget.current;
        if (back && document.contains(back)) back.focus({ preventScroll: true });
      }
    };
    // initialFocus is a ref and only read when the scope opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, trap, restoreFocus]);
}
