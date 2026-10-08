import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { createSafeContext } from '../../utils/createSafeContext';
import { Portal } from '../../utils/Portal';
import { useControllableState } from '../../utils/useControllableState';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useFocusScope } from '../../utils/useFocusScope';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { useAnchoredPosition, type Align, type Placement } from '../../utils/useAnchoredPosition';
import { mergeRefs } from '../../utils/mergeRefs';
import styles from './Popover.module.css';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
}

const [PopoverProvider, usePopoverContext] = createSafeContext<PopoverContextValue>(
  'Popover',
  'Popover part',
);

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Popover({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  return (
    <PopoverProvider value={{ open: isOpen, setOpen, triggerRef, contentId }}>
      {children}
    </PopoverProvider>
  );
}

export interface PopoverTriggerProps {
  /** A single element that can hold a ref and receive click handlers, usually a Button. */
  children: ReactElement<Record<string, unknown>>;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef, contentId } = usePopoverContext();
  if (!isValidElement(children)) throw new Error('<Popover.Trigger> needs a single element child.');
  const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
  const childOnClick = children.props.onClick as ((e: unknown) => void) | undefined;

  return cloneElement(children, {
    ref: mergeRefs(childRef, triggerRef),
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    onClick: (event: unknown) => {
      childOnClick?.(event);
      setOpen(!open);
    },
  });
}

export interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  placement?: Placement;
  align?: Align;
  /** Accessible name for the popover panel. */
  'aria-label'?: string;
}

export function PopoverContent(props: PopoverContentProps) {
  const { open } = usePopoverContext();
  if (!open) return null;
  return (
    <Portal>
      <PopoverPanel {...props} />
    </Portal>
  );
}

function PopoverPanel({
  placement = 'bottom',
  align = 'start',
  className,
  children,
  ...rest
}: PopoverContentProps) {
  const { setOpen, triggerRef, contentId } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const position = useAnchoredPosition(triggerRef, contentRef, { open: true, placement, align });

  useEscapeKey(() => setOpen(false));
  useOutsideClick([contentRef, triggerRef], () => setOpen(false));
  useFocusScope(contentRef, { active: true, trap: false, restoreFocus: true });

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="dialog"
      tabIndex={-1}
      className={cx(styles.content, className)}
      data-placement={position?.placement ?? placement}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        opacity: position ? 1 : 0,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
