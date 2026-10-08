import { createContext, useContext } from 'react';

export interface FieldContextValue {
  id: string;
  descriptionId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

interface OwnFieldProps {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  'aria-describedby'?: string;
}

// Merges what a surrounding <FormField> knows (ids, error state) into a control's own props.
export function useFieldProps(own: OwnFieldProps) {
  const field = useContext(FieldContext);
  const describedBy = [
    own['aria-describedby'],
    field?.descriptionId,
    field?.invalid ? field.errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const invalid = own.invalid ?? field?.invalid ?? false;
  const required = own.required ?? field?.required ?? false;
  return {
    id: own.id ?? field?.id,
    disabled: own.disabled ?? field?.disabled ?? false,
    required,
    invalid,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': invalid || undefined,
  };
}
