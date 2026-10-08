/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- focus stays in the search input and options are chosen with aria-activedescendant; click is the pointer shortcut */
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Portal } from '../../utils/Portal';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useFocusScope } from '../../utils/useFocusScope';
import { useInertOutside } from '../../utils/useInertOutside';
import { useScrollLock } from '../../utils/useScrollLock';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './CommandPalette.module.css';

export interface Command {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
  /** Accessible name for the dialog. */
  label?: string;
  placeholder?: string;
  emptyMessage?: string;
}

function matches(command: Command, query: string) {
  if (!query) return true;
  const haystack = [command.label, command.group, ...(command.keywords ?? [])]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

// Labels that start with the query come first.
function rank(command: Command, query: string) {
  return command.label.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1;
}

export function CommandPalette({ open, ...rest }: CommandPaletteProps) {
  if (!open) return null;
  return (
    <Portal>
      <PaletteDialog {...rest} />
    </Portal>
  );
}

function PaletteDialog({
  onOpenChange,
  commands,
  label = 'Command palette',
  placeholder = 'Type a command or search…',
  emptyMessage = 'No matching commands.',
}: Omit<CommandPaletteProps, 'open'>) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const close = () => onOpenChange(false);

  useEscapeKey(close);
  // Declared before the focus scope so its cleanup (removing inert) runs first,
  // and focus can actually return to the trigger.
  useInertOutside(panelRef, true);
  useFocusScope(panelRef, { active: true, trap: true, restoreFocus: true });
  useScrollLock(true);

  const results = useMemo(
    () =>
      commands
        .filter((c) => matches(c, query))
        .map((c, i) => ({ c, i }))
        .sort((a, b) => rank(a.c, query) - rank(b.c, query) || a.i - b.i)
        .map(({ c }) => c),
    [commands, query],
  );

  // Group while keeping a single flat index for keyboard navigation.
  const groups = useMemo(() => {
    const map = new Map<string, Array<{ command: Command; index: number }>>();
    results.forEach((command, index) => {
      const key = command.group ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ command, index });
    });
    return Array.from(map.entries());
  }, [results]);

  const optionId = (index: number) => `${listId}-option-${index}`;
  const active = results[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`#${CSS.escape(optionId(activeIndex))}`)
      ?.scrollIntoView({ block: 'nearest' });
    // optionId is derived from listId, which never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const run = (command: Command | undefined) => {
    if (!command || command.disabled) return;
    close();
    command.onSelect();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(results.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(active);
    }
  };

  return (
    <div
      className={styles.overlay}
      data-testid="palette-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={styles.panel}
      >
        <div className={styles.searchRow}>
          <Icon name="search" size={18} className={styles.searchIcon} />
          <input
            type="text"
            role="combobox"
            aria-label={label}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active ? optionId(activeIndex) : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={query}
            className={styles.input}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className={styles.list}>
          {results.length === 0 && <p className={styles.empty}>{emptyMessage}</p>}
          {groups.map(([group, items]) => {
            const headingId = `${listId}-group-${group}`;
            return (
              <div
                key={group || 'ungrouped'}
                role="group"
                aria-labelledby={group ? headingId : undefined}
              >
                {group && (
                  <div id={headingId} role="presentation" className={styles.groupLabel}>
                    {group}
                  </div>
                )}
                {items.map(({ command, index }) => (
                  <div
                    key={command.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    aria-disabled={command.disabled || undefined}
                    className={cx(
                      styles.option,
                      index === activeIndex && styles.active,
                      command.disabled && styles.disabled,
                    )}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => run(command)}
                  >
                    {command.icon && <span className={styles.icon}>{command.icon}</span>}
                    <span className={styles.optionLabel}>{command.label}</span>
                    {command.shortcut && <kbd className={styles.shortcut}>{command.shortcut}</kbd>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <VisuallyHidden role="status" aria-live="polite">
          {results.length === 0
            ? emptyMessage
            : `${results.length} ${results.length === 1 ? 'command' : 'commands'} available`}
        </VisuallyHidden>

        <div className={styles.footer} aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

// Opens the palette with Cmd+K or Ctrl+K.
export function useCommandPaletteShortcut(onToggle: () => void) {
  const toggleRef = useRef(onToggle);
  toggleRef.current = onToggle;
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggleRef.current();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}
