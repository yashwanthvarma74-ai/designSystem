import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const icons: Record<AlertVariant, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'x-circle',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: ReactNode;
  /** Shows a close button and calls this when pressed. */
  onDismiss?: () => void;
}

export function Alert({
  variant = 'info',
  title,
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  const urgent = variant === 'danger' || variant === 'warning';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cx(styles.alert, styles[variant], className)}
      {...rest}
    >
      <Icon name={icons[variant]} size={20} className={styles.icon} />
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.close} aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
