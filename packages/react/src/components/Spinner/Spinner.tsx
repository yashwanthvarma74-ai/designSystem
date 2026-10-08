import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Spinner.module.css';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Announced to screen readers. */
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(styles.spinner, styles[size], className)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true" focusable="false">
        <circle className={styles.track} cx="12" cy="12" r="9" />
        <circle className={styles.arc} cx="12" cy="12" r="9" />
      </svg>
    </span>
  );
}
