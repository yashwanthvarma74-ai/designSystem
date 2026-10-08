import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldContext } from '../../utils/fieldContext';
import styles from './FormField.module.css';

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  description?: ReactNode;
  /** Error message. When set, the control is marked invalid and the message is announced. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

// Wires the label, hint and error text to whichever control sits inside it.
export function FormField({
  label,
  description,
  error,
  required = false,
  disabled = false,
  className,
  children,
  ...rest
}: FormFieldProps) {
  const baseId = useId();
  const id = `${baseId}-control`;
  const hasError = Boolean(error);

  return (
    <FieldContext.Provider
      value={{
        id,
        descriptionId: description ? `${baseId}-description` : undefined,
        errorId: hasError ? `${baseId}-error` : undefined,
        invalid: hasError,
        required,
        disabled,
      }}
    >
      <div className={cx(styles.field, className)} {...rest}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        {description && (
          <p id={`${baseId}-description`} className={styles.description}>
            {description}
          </p>
        )}
        {children}
        {hasError && (
          <p id={`${baseId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}
