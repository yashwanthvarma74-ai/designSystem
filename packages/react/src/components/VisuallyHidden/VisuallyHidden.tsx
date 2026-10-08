import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './VisuallyHidden.module.css';

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;

// Hides content visually while keeping it available to screen readers.
export function VisuallyHidden({ className, ...rest }: VisuallyHiddenProps) {
  return <span className={cx(styles.hidden, className)} {...rest} />;
}
