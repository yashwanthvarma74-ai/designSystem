import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Separator.module.css';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Decorative separators are hidden from assistive tech. Set false when it divides real sections. */
  decorative?: boolean;
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...rest
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cx(styles.separator, styles[orientation], className)}
      {...rest}
    />
  );
}
