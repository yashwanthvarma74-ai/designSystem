import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: IconName;
  /** Usually a Button or two. */
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4;
}

export function EmptyState({
  title,
  description,
  icon = 'inbox',
  action,
  headingLevel = 3,
  className,
  ...rest
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={cx(styles.root, className)} {...rest}>
      <span className={styles.iconWrap}>
        <Icon name={icon} size={24} />
      </span>
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
