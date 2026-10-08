import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  shape?: 'text' | 'rect' | 'circle';
}

// A placeholder for content that is still loading. It is hidden from screen readers;
// announce loading state on the surrounding region instead (aria-busy).
export function Skeleton({
  width,
  height,
  shape = 'rect',
  className,
  style,
  ...rest
}: SkeletonProps) {
  const sizing: CSSProperties = { width, height, ...style };
  return (
    <div
      aria-hidden="true"
      className={cx(styles.skeleton, styles[shape], className)}
      style={sizing}
      {...rest}
    />
  );
}
