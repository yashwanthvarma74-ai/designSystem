/* eslint-disable jsx-a11y/interactive-supports-focus -- focus lives on the tab buttons (roving tabindex) */
import {
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { createSafeContext } from '../../utils/createSafeContext';
import { useControllableState } from '../../utils/useControllableState';
import styles from './Tabs.module.css';

interface TabsContextValue {
  baseId: string;
  value: string;
  select: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  activation: 'automatic' | 'manual';
}

const [TabsProvider, useTabs] = createSafeContext<TabsContextValue>('Tabs', 'Tabs part');

export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  /** "automatic" selects a tab as soon as it gets focus; "manual" waits for Enter or Space. */
  activation?: 'automatic' | 'manual';
  children: ReactNode;
}

export function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  activation = 'automatic',
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsProvider value={{ baseId, value: current, select: setCurrent, orientation, activation }}>
      <div
        className={cx(styles.root, orientation === 'vertical' && styles.rootVertical, className)}
        {...rest}
      >
        {children}
      </div>
    </TabsProvider>
  );
}

export function TabsList({ className, onKeyDown, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { orientation, activation, select } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    const index = tabs.findIndex((tab) => tab === document.activeElement);
    if (index === -1) return;

    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    let target: HTMLButtonElement | undefined;
    if (event.key === nextKey) target = tabs[(index + 1) % tabs.length];
    else if (event.key === prevKey) target = tabs[(index - 1 + tabs.length) % tabs.length];
    else if (event.key === 'Home') target = tabs[0];
    else if (event.key === 'End') target = tabs[tabs.length - 1];
    if (!target) return;

    event.preventDefault();
    target.focus();
    if (activation === 'automatic') select(target.dataset.value ?? '');
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cx(styles.list, orientation === 'vertical' && styles.listVertical, className)}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}

export interface TabsTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
}

export function TabsTab({ value, className, onClick, ...rest }: TabsTabProps) {
  const { baseId, value: current, select } = useTabs();
  const selected = current === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      data-state={selected ? 'active' : 'inactive'}
      className={cx(styles.tab, className)}
      onClick={(event) => {
        onClick?.(event);
        select(value);
      }}
      {...rest}
    />
  );
}

export interface TabsPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value'> {
  value: string;
}

export function TabsPanel({ value, className, children, ...rest }: TabsPanelProps) {
  const { baseId, value: current } = useTabs();
  const selected = current === value;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={0}
      className={cx(styles.panel, className)}
      {...rest}
    >
      {selected ? children : null}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;
