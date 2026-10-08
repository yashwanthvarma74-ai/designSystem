import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFieldProps } from '../../utils/fieldContext';
import { Icon } from '../Icon';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Visible label. Pass `aria-label` instead when the label lives elsewhere. */
  children?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, description, indeterminate = false, invalid, className, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldProps = useFieldProps({
    id: rest.id,
    disabled: rest.disabled,
    required: rest.required,
    invalid,
    'aria-describedby': rest['aria-describedby'],
  });

  // "indeterminate" has no HTML attribute, so it has to be set on the element.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cx(styles.root, fieldProps.disabled && styles.disabled, className)}>
      <input
        ref={mergeRefs(ref, inputRef)}
        type="checkbox"
        {...rest}
        {...fieldProps}
        className={styles.input}
      />
      <span className={styles.box} aria-hidden="true">
        <Icon name="check" size={14} className={styles.check} />
        <Icon name="minus" size={14} className={styles.dash} />
      </span>
      {(children || description) && (
        <span className={styles.text}>
          {children && <span className={styles.label}>{children}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </span>
      )}
    </label>
  );
});
