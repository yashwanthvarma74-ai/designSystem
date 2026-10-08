import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { Portal } from '../../utils/Portal';
import { useAnchoredPosition, type Placement } from '../../utils/useAnchoredPosition';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: ReactNode;
  /** One element that can take a ref and focus/mouse handlers. */
  children: ReactElement<Record<string, unknown>>;
  placement?: Placement;
  /** Milliseconds to wait before showing on hover. Focus shows it straight away. */
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 400,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Escape dismisses without moving focus (WCAG 1.4.13).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!isValidElement(children)) throw new Error('<Tooltip> needs a single element child.');
  const childProps = children.props as Record<string, (e: unknown) => void>;
  const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  const show = (wait: number) => {
    clearTimeout(timer.current);
    if (wait <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    // A short grace period lets the pointer travel onto the tooltip itself.
    timer.current = setTimeout(() => setOpen(false), 80);
  };

  const trigger = cloneElement(children, {
    ref: mergeRefs(childRef, anchorRef),
    'aria-describedby': open ? id : (children.props['aria-describedby'] as string | undefined),
    onMouseEnter: (e: unknown) => {
      childProps.onMouseEnter?.(e);
      show(delay);
    },
    onMouseLeave: (e: unknown) => {
      childProps.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: unknown) => {
      childProps.onFocus?.(e);
      show(0);
    },
    onBlur: (e: unknown) => {
      childProps.onBlur?.(e);
      clearTimeout(timer.current);
      setOpen(false);
    },
  });

  return (
    <>
      {trigger}
      {open && (
        <Portal>
          <TooltipBubble
            id={id}
            anchorRef={anchorRef}
            placement={placement}
            className={className}
            onEnter={() => clearTimeout(timer.current)}
            onLeave={hide}
          >
            {content}
          </TooltipBubble>
        </Portal>
      )}
    </>
  );
}

interface BubbleProps {
  id: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  placement: Placement;
  className?: string;
  onEnter: () => void;
  onLeave: () => void;
  children: ReactNode;
}

function TooltipBubble({
  id,
  anchorRef,
  placement,
  className,
  onEnter,
  onLeave,
  children,
}: BubbleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const position = useAnchoredPosition(anchorRef, ref, {
    open: true,
    placement,
    align: 'center',
    offset: 8,
  });

  return (
    <div
      ref={ref}
      id={id}
      role="tooltip"
      className={cx(styles.tooltip, className)}
      style={{ top: position?.top ?? 0, left: position?.left ?? 0, opacity: position ? 1 : 0 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
