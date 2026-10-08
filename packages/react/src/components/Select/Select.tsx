import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldProps } from '../../utils/fieldContext';
import { Icon } from '../Icon';
import field from '../../styles/field.module.css';
import styles from './Select.module.css';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

// A styled native <select>: it keeps the platform's keyboard handling and mobile pickers.
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size = 'md', invalid, className, children, ...rest },
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
      <select
        ref={ref}
        {...rest}
        {...fieldProps}
        className={cx(field.control, field[size], styles.select, className)}
      >
        {children}
      </select>
      <Icon name="chevron-down" size={16} className={styles.chevron} />
    </span>
  );
});
