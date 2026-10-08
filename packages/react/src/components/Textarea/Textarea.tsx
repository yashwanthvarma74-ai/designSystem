import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldProps } from '../../utils/fieldContext';
import field from '../../styles/field.module.css';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  resize?: 'none' | 'vertical';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, resize = 'vertical', rows = 4, className, ...rest },
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
    <textarea
      ref={ref}
      rows={rows}
      {...rest}
      {...fieldProps}
      className={cx(field.control, styles.textarea, styles[resize], className)}
    />
  );
});
