import { useState, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

interface Options {
  open: boolean;
  placement?: Placement;
  align?: Align;
  offset?: number;
  /** Match the floating element's width to the anchor. */
  matchWidth?: boolean;
}

export interface Position {
  top: number;
  left: number;
  placement: Placement;
  minWidth?: number;
}

const opposite: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};
const EDGE_GAP = 8;

function compute(
  anchor: DOMRect,
  floating: DOMRect,
  placement: Placement,
  align: Align,
  offset: number,
): { top: number; left: number } {
  let top = 0;
  let left = 0;
  if (placement === 'top' || placement === 'bottom') {
    top = placement === 'bottom' ? anchor.bottom + offset : anchor.top - floating.height - offset;
    if (align === 'start') left = anchor.left;
    else if (align === 'end') left = anchor.right - floating.width;
    else left = anchor.left + anchor.width / 2 - floating.width / 2;
  } else {
    left = placement === 'right' ? anchor.right + offset : anchor.left - floating.width - offset;
    if (align === 'start') top = anchor.top;
    else if (align === 'end') top = anchor.bottom - floating.height;
    else top = anchor.top + anchor.height / 2 - floating.height / 2;
  }
  return { top, left };
}

// Positions a fixed element next to an anchor, flipping sides when it would leave the viewport.
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  { open, placement = 'bottom', align = 'start', offset = 6, matchWidth = false }: Options,
) {
  const [position, setPosition] = useState<Position | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const update = () => {
      const anchor = anchorRef.current;
      const floating = floatingRef.current;
      if (!anchor || !floating) return;

      const anchorRect = anchor.getBoundingClientRect();
      const floatRect = floating.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let side = placement;
      let next = compute(anchorRect, floatRect, side, align, offset);

      const overflows = (p: { top: number; left: number }) =>
        p.top < EDGE_GAP ||
        p.left < EDGE_GAP ||
        p.top + floatRect.height > vh - EDGE_GAP ||
        p.left + floatRect.width > vw - EDGE_GAP;

      if (overflows(next)) {
        const flipped = compute(anchorRect, floatRect, opposite[side], align, offset);
        if (!overflows(flipped)) {
          side = opposite[side];
          next = flipped;
        }
      }

      const left = Math.min(
        Math.max(next.left, EDGE_GAP),
        Math.max(EDGE_GAP, vw - floatRect.width - EDGE_GAP),
      );
      const top = Math.min(
        Math.max(next.top, EDGE_GAP),
        Math.max(EDGE_GAP, vh - floatRect.height - EDGE_GAP),
      );
      setPosition({
        top,
        left,
        placement: side,
        minWidth: matchWidth ? anchorRect.width : undefined,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, placement, align, offset, matchWidth, anchorRef, floatingRef]);

  return position;
}
