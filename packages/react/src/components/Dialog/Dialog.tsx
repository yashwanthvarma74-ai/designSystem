/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/heading-has-content -- the backdrop click is a pointer shortcut (Escape is the keyboard path); the title content is passed in by the caller */
import { useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { createSafeContext } from '../../utils/createSafeContext';
import { Portal } from '../../utils/Portal';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useFocusScope } from '../../utils/useFocusScope';
import { useInertOutside } from '../../utils/useInertOutside';
import { useScrollLock } from '../../utils/useScrollLock';
import { Icon } from '../Icon';
import styles from './Dialog.module.css';

interface DialogContextValue {
  titleId: string;
  descriptionId: string;
  close: () => void;
}

const [DialogProvider, useDialogContext] = createSafeContext<DialogContextValue>(
  'Dialog',
  'Dialog part',
);

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Close when the backdrop is clicked. */
  dismissOnOverlayClick?: boolean;
  /** Use "alertdialog" for confirmations that need an explicit answer. */
  role?: 'dialog' | 'alertdialog';
  /** Element to focus first when the dialog opens. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export function Dialog({ open, ...rest }: DialogProps) {
  if (!open) return null;
  return (
    <Portal>
      <DialogPanel {...rest} />
    </Portal>
  );
}

// Lives inside the portal, so its refs and effects start once the panel is really in the DOM.
function DialogPanel({
  onOpenChange,
  children,
  size = 'md',
  dismissOnOverlayClick = true,
  role = 'dialog',
  initialFocusRef,
}: Omit<DialogProps, 'open'>) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const close = () => onOpenChange(false);

  useEscapeKey(close);
  // Declared before the focus scope so its cleanup (removing inert) runs first,
  // and focus can actually return to the trigger.
  useInertOutside(panelRef, true);
  useFocusScope(panelRef, {
    active: true,
    initialFocus: initialFocusRef,
    trap: true,
    restoreFocus: true,
  });
  useScrollLock(true);

  return (
    <div
      className={styles.overlay}
      data-testid="dialog-overlay"
      onMouseDown={(event) => {
        if (dismissOnOverlayClick && event.target === event.currentTarget) close();
      }}
    >
      <DialogProvider value={{ titleId, descriptionId, close }}>
        <div
          ref={panelRef}
          role={role}
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className={cx(styles.panel, styles[size])}
        >
          {children}
        </div>
      </DialogProvider>
    </div>
  );
}

export function DialogHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialogContext();
  return <h2 id={titleId} className={cx(styles.title, className)} {...rest} />;
}

export function DialogDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialogContext();
  return <p id={descriptionId} className={cx(styles.description, className)} {...rest} />;
}

export function DialogBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.body, className)} {...rest} />;
}

export function DialogFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}

export function DialogClose({ label = 'Close dialog' }: { label?: string }) {
  const { close } = useDialogContext();
  return (
    <button type="button" className={styles.closeButton} aria-label={label} onClick={close}>
      <Icon name="close" size={18} />
    </button>
  );
}

Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
