import { useEffect, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Avatar.module.css';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Person or entity name. Used for the accessible name and the initials fallback. */
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = 'md', className, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      role="img"
      aria-label={name}
      className={cx(styles.avatar, styles[size], className)}
      {...rest}
    >
      {showImage ? (
        <img src={src} alt="" className={styles.image} onError={() => setFailed(true)} />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
