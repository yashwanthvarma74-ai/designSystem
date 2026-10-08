import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

// Shared with other components that need to look like a button (e.g. a menu trigger).
export function buttonClass({
  variant = 'secondary',
  size = 'md',
  fullWidth,
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth' | 'className'> = {}) {
  return cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth,
    className,
    children,
    type = 'button',
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, fullWidth, className })}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      data-loading={loading || undefined}
      onClick={(event) => {
        // A loading button stays focusable but must not fire again.
        if (loading) return event.preventDefault();
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? <Spinner size="sm" label="Loading" className={styles.spinner} /> : leadingIcon}
      {children !== undefined && children !== null && (
        <span className={styles.label}>{children}</span>
      )}
      {!loading && trailingIcon}
    </button>
  );
});
