import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useFieldProps } from '../../utils/fieldContext';
import field from '../../styles/field.module.css';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** Decorative content before the text, such as an icon. */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid, startAdornment, endAdornment, className, ...rest },
  ref,
) {
  const fieldProps = useFieldProps({
    id: rest.id,
    disabled: rest.disabled,
    required: rest.required,
    invalid,
    'aria-describedby': rest['aria-describedby'],
  });

  return (
    <span className={styles.wrapper}>
      {startAdornment && (
        <span className={cx(styles.adornment, styles.start)}>{startAdornment}</span>
      )}
      <input
        ref={ref}
        {...rest}
        {...fieldProps}
        className={cx(
          field.control,
          field[size],
          Boolean(startAdornment) && styles.hasStart,
          Boolean(endAdornment) && styles.hasEnd,
          className,
        )}
      />
      {endAdornment && <span className={cx(styles.adornment, styles.end)}>{endAdornment}</span>}
    </span>
  );
});
