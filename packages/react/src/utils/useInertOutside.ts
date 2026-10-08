import { useEffect, type RefObject } from 'react';

// While a modal is open, make everything else on the page inert so assistive tech
// and the tab order stay inside it.
export function useInertOutside(modalRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const modal = modalRef.current;
    if (!modal) return;

    // The portal wrapper that holds the modal is a direct child of <body>.
    let portalRoot: HTMLElement | null = modal;
    while (portalRoot && portalRoot.parentElement !== document.body)
      portalRoot = portalRoot.parentElement;

    const changed: HTMLElement[] = [];
    for (const child of Array.from(document.body.children) as HTMLElement[]) {
      if (child === portalRoot || child.hasAttribute('inert')) continue;
      if (child.tagName === 'SCRIPT') continue;
      child.setAttribute('inert', '');
      changed.push(child);
    }
    return () => {
      for (const el of changed) el.removeAttribute('inert');
    };
  }, [enabled, modalRef]);
}
