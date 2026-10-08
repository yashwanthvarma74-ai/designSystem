/* eslint-disable jsx-a11y/no-static-element-interactions -- arrow keys bubble up from the focusable trigger buttons */
import { useId, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { createSafeContext } from '../../utils/createSafeContext';
import { useControllableState } from '../../utils/useControllableState';
import { Icon } from '../Icon';
import styles from './Accordion.module.css';

interface AccordionContextValue {
  baseId: string;
  openItems: string[];
  toggle: (value: string) => void;
  headingLevel: 2 | 3 | 4 | 5 | 6;
}

const [AccordionProvider, useAccordion] = createSafeContext<AccordionContextValue>(
  'Accordion',
  'Accordion.Item',
);

export interface AccordionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /** "single" keeps one item open at a time. */
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Heading level used for each item title, so the page outline stays correct. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export function Accordion({
  type = 'single',
  value,
  defaultValue = [],
  onValueChange,
  headingLevel = 3,
  className,
  children,
  onKeyDown,
  ...rest
}: AccordionProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const toggle = (item: string) => {
    setOpenItems((prev) => {
      if (prev.includes(item)) return prev.filter((v) => v !== item);
      return type === 'single' ? [item] : [...prev, item];
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const triggers = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-accordion-trigger]:not(:disabled)',
      ) ?? [],
    );
    const index = triggers.findIndex((t) => t === document.activeElement);
    if (index === -1) return;
    let target: HTMLButtonElement | undefined;
    if (event.key === 'ArrowDown') target = triggers[(index + 1) % triggers.length];
    else if (event.key === 'ArrowUp')
      target = triggers[(index - 1 + triggers.length) % triggers.length];
    else if (event.key === 'Home') target = triggers[0];
    else if (event.key === 'End') target = triggers[triggers.length - 1];
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  return (
    <AccordionProvider value={{ baseId, openItems, toggle, headingLevel }}>
      <div ref={rootRef} className={cx(styles.root, className)} onKeyDown={handleKeyDown} {...rest}>
        {children}
      </div>
    </AccordionProvider>
  );
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  value: string;
  title: ReactNode;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  title,
  disabled = false,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const { baseId, openItems, toggle, headingLevel } = useAccordion();
  const open = openItems.includes(value);
  const Heading = `h${headingLevel}` as const;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <div className={cx(styles.item, className)} data-state={open ? 'open' : 'closed'} {...rest}>
      <Heading className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          data-accordion-trigger=""
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          className={styles.trigger}
          onClick={() => toggle(value)}
        >
          <span>{title}</span>
          <Icon name="chevron-down" size={18} className={styles.chevron} />
        </button>
      </Heading>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className={styles.panel}
      >
        {children}
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;
