import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Portal } from '../../utils/Portal';
import { Icon, type IconName } from '../Icon';
import styles from './Toast.module.css';

export type ToastVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milliseconds before it goes away. Use 0 to keep it until dismissed. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>.');
  return ctx;
}

const variantIcon: Record<ToastVariant, IconName | null> = {
  neutral: null,
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'x-circle',
  info: 'info',
};

export interface ToastProviderProps {
  children: ReactNode;
  /** How many toasts can be on screen at once. Older ones are dropped first. */
  limit?: number;
  defaultDuration?: number;
}

export function ToastProvider({ children, limit = 4, defaultDuration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);
  const regionRef = useRef<HTMLElement>(null);

  const dismiss = useCallback(
    (id: string) => setToasts((list) => list.filter((t) => t.id !== id)),
    [],
  );
  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((list) =>
        [
          ...list,
          { duration: defaultDuration, variant: 'neutral' as ToastVariant, ...options, id },
        ].slice(-limit),
      );
      return id;
    },
    [defaultDuration, limit],
  );

  // F8 jumps keyboard focus into the notifications, a common convention.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F8') {
        regionRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <section
          ref={regionRef}
          aria-label="Notifications (press F8 to focus)"
          tabIndex={-1}
          className={styles.region}
        >
          <ol className={styles.list}>
            {toasts.map((item) => (
              <ToastItem key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
            ))}
          </ol>
        </section>
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastItem({ item, onDismiss }: { item: ToastRecord; onDismiss: () => void }) {
  const { title, description, variant = 'neutral', duration = 0, action } = item;
  const [paused, setPaused] = useState(false);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  // The timer stops while someone is hovering or has keyboard focus inside the toast.
  useEffect(() => {
    if (!duration || paused) return;
    const timer = setTimeout(() => dismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration, paused]);

  const icon = variantIcon[variant];
  const urgent = variant === 'danger' || variant === 'warning';

  return (
    <li className={styles.item}>
      <div
        role={urgent ? 'alert' : 'status'}
        aria-atomic="true"
        className={cx(styles.toast, styles[variant])}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {icon && <Icon name={icon} size={20} className={styles.icon} />}
        <div className={styles.content}>
          <p className={styles.title}>{title}</p>
          {description && <p className={styles.description}>{description}</p>}
          {action && (
            <button
              type="button"
              className={styles.action}
              onClick={() => {
                action.onClick();
                onDismiss();
              }}
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </li>
  );
}
