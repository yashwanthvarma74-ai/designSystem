import { createContext, useContext, useRef, type ReactNode } from 'react';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  Input as AriaInput,
  Label as AriaLabel,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Text as AriaText,
} from 'react-aria-components';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Icon } from '../Icon';
import field from '../../styles/field.module.css';
import styles from './Combobox.module.css';

interface ComboboxContextValue {
  getKey: (value: never) => string;
  register: (key: string, value: unknown) => void;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext(part: string) {
  const ctx = useContext(ComboboxContext);
  if (!ctx) throw new Error(`<${part}> must be rendered inside <Combobox>.`);
  return ctx;
}

function defaultGetKey(value: unknown): string {
  if (value && typeof value === 'object' && 'id' in value)
    return String((value as { id: unknown }).id);
  return String(value);
}

export interface ComboboxProps<T> {
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
  /** Unique string for an option's value. Defaults to `value.id`, or the value itself. */
  getKey?: (value: T) => string;
  children: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  /** Accessible name when there is no Combobox.Label. */
  'aria-label'?: string;
}

export function Combobox<T>({
  value,
  defaultValue = null,
  onChange,
  getKey = defaultGetKey as (value: T) => string,
  children,
  disabled,
  invalid,
  className,
  'aria-label': ariaLabel,
}: ComboboxProps<T>) {
  const [current, setCurrent] = useControllableState<T | null>({ value, defaultValue, onChange });
  // Options register themselves while rendering so a selected key can be mapped back to its value.
  const registry = useRef(new Map<string, unknown>());

  return (
    <ComboboxContext.Provider
      value={{
        getKey: getKey as (value: never) => string,
        register: (key, optionValue) => registry.current.set(key, optionValue),
      }}
    >
      <AriaComboBox
        aria-label={ariaLabel}
        selectedKey={current === null || current === undefined ? null : getKey(current)}
        onSelectionChange={(key) => {
          setCurrent(
            key === null ? null : ((registry.current.get(String(key)) as T | undefined) ?? null),
          );
        }}
        isDisabled={disabled}
        isInvalid={invalid}
        menuTrigger="focus"
        allowsEmptyCollection
        className={cx(styles.root, className)}
      >
        {children}
      </AriaComboBox>
    </ComboboxContext.Provider>
  );
}

function ComboboxLabel({ className, children }: { className?: string; children: ReactNode }) {
  return <AriaLabel className={cx(styles.label, className)}>{children}</AriaLabel>;
}

function ComboboxDescription({ children }: { children: ReactNode }) {
  return (
    <AriaText slot="description" className={styles.description}>
      {children}
    </AriaText>
  );
}

function ComboboxInput({
  placeholder,
  size = 'md',
}: {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={styles.inputWrap}>
      <AriaInput
        placeholder={placeholder}
        className={cx(field.control, field[size], styles.input)}
      />
      <AriaButton className={styles.toggle}>
        <Icon name="chevron-down" size={16} />
      </AriaButton>
    </div>
  );
}

// Options need to live inside the ListBox, so List takes them as children.
function ComboboxList({
  emptyMessage = 'No results found.',
  children,
}: {
  emptyMessage?: string;
  children: ReactNode;
}) {
  return (
    <AriaPopover className={styles.popover} offset={6}>
      <AriaListBox
        className={styles.list}
        renderEmptyState={() => <div className={styles.empty}>{emptyMessage}</div>}
      >
        {children}
      </AriaListBox>
    </AriaPopover>
  );
}

export interface ComboboxOptionProps<T> {
  value: T;
  /** Text used for filtering and for the input once selected. Taken from string children by default. */
  textValue?: string;
  disabled?: boolean;
  children: ReactNode;
}

function ComboboxOption<T>({ value, textValue, disabled, children }: ComboboxOptionProps<T>) {
  const { getKey, register } = useComboboxContext('Combobox.Option');
  const key = (getKey as (v: T) => string)(value);
  register(key, value);
  const text = textValue ?? (typeof children === 'string' ? children : key);

  return (
    <AriaListBoxItem id={key} textValue={text} isDisabled={disabled} className={styles.option}>
      {({ isSelected }) => (
        <>
          <span className={styles.optionText}>{children}</span>
          {isSelected && <Icon name="check" size={16} className={styles.check} />}
        </>
      )}
    </AriaListBoxItem>
  );
}

Combobox.Label = ComboboxLabel;
Combobox.Description = ComboboxDescription;
Combobox.Input = ComboboxInput;
// Combobox.List renders the popover and listbox around its Combobox.Option children.
Combobox.List = ComboboxList;
Combobox.Option = ComboboxOption;
