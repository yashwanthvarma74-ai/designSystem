import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Progress.module.css';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value. Leave undefined for an indeterminate bar. */
  value?: number;
  max?: number;
  /** Required: describes what is progressing. */
  label: string;
  size?: 'sm' | 'md';
  /** Show the percentage next to the bar. */
  showValue?: boolean;
}

export function Progress({
  value,
  max = 100,
  label,
  size = 'md',
  showValue = false,
  className,
  ...rest
}: ProgressProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percent = Math.round((clamped / max) * 100);

  return (
    <div className={cx(styles.root, className)} {...rest}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : clamped}
        className={cx(styles.track, styles[size])}
      >
        <div
          className={cx(styles.bar, indeterminate && styles.indeterminate)}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
      {showValue && !indeterminate && <span className={styles.value}>{percent}%</span>}
    </div>
  );
}
