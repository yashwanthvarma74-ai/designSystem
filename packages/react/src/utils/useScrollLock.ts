import { useEffect } from 'react';

let locks = 0;
let previousOverflow = '';
let previousPadding = '';

// Stops the page behind a modal from scrolling. Counts locks so stacked dialogs behave.
export function useScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const body = document.body;
    if (locks === 0) {
      previousOverflow = body.style.overflow;
      previousPadding = body.style.paddingRight;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPadding;
      }
    };
  }, [enabled]);
}
