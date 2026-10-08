import {
  forwardRef,
  useId,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { createSafeContext } from '../../utils/createSafeContext';
import { useControllableState } from '../../utils/useControllableState';
import styles from './Radio.module.css';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  select: (value: string) => void;
}

const [RadioGroupProvider, useRadioGroup] = createSafeContext<RadioGroupContextValue>(
  'RadioGroup',
  'Radio',
);

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange' | 'defaultValue' | 'value'
> {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  label,
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const generatedName = useId();
  const [current, setCurrent] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: (next) => next !== undefined && onChange?.(next),
  });

  return (
    <RadioGroupProvider
      value={{ name: name ?? generatedName, value: current, disabled, select: setCurrent }}
    >
      <fieldset className={cx(styles.group, className)} disabled={disabled} {...rest}>
        <legend className={styles.legend}>{label}</legend>
        <div className={cx(styles.options, orientation === 'horizontal' && styles.horizontal)}>
          {children}
        </div>
      </fieldset>
    </RadioGroupProvider>
  );
}

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'checked' | 'value'
> {
  value: string;
  children?: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, children, description, className, disabled, onChange, ...rest },
  ref,
) {
  const group = useRadioGroup();
  const isDisabled = disabled || group.disabled;

  return (
    <label className={cx(styles.root, isDisabled && styles.disabled, className)}>
      <input
        ref={ref}
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        disabled={isDisabled}
        onChange={(event) => {
          group.select(value);
          onChange?.(event);
        }}
        className={styles.input}
        {...rest}
      />
      <span className={styles.circle} aria-hidden="true" />
      <span className={styles.text}>
        {children && <span className={styles.label}>{children}</span>}
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </label>
  );
});
