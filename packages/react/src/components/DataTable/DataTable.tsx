import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type UIEvent,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Checkbox } from '../Checkbox';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import styles from './DataTable.module.css';

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** Plain-text name used for the select-row labels and sort announcements. */
  label?: string;
  cell: (row: T) => ReactNode;
  /** Provide to make the column sortable. */
  sortValue?: (row: T) => string | number;
  /** Any CSS grid track size, for example "2fr" or "120px". */
  width?: string;
  align?: 'start' | 'end';
}

export type SortDirection = 'ascending' | 'descending';
export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Accessible name for the table. */
  'aria-label': string;
  /** Visible height of the scrolling body in pixels. Only the rows in view are rendered. */
  height?: number;
  rowHeight?: number;
  /** Extra rows rendered above and below the visible window. */
  overscan?: number;
  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Called when a row is activated with Enter. */
  onRowAction?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  'aria-label': ariaLabel,
  height = 360,
  rowHeight = 44,
  overscan = 6,
  selectable = false,
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  sort,
  defaultSort = null,
  onSortChange,
  onRowAction,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedIds,
    defaultValue: defaultSelectedIds,
    onChange: onSelectedIdsChange,
  });
  const [sortState, setSortState] = useControllableState<SortState | null>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  const [scrollTop, setScrollTop] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const shouldFocusRow = useRef(false);

  const sortedRows = useMemo(() => {
    if (!sortState) return rows;
    const column = columns.find((c) => c.id === sortState.columnId);
    if (!column?.sortValue) return rows;
    const getValue = column.sortValue;
    const factor = sortState.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = getValue(a);
      const right = getValue(b);
      if (left < right) return -1 * factor;
      if (left > right) return 1 * factor;
      return 0;
    });
  }, [rows, columns, sortState]);

  const total = sortedRows.length;
  const bodyHeight = Math.min(height, Math.max(total * rowHeight, rowHeight));
  const visibleCount = Math.max(1, Math.floor(bodyHeight / rowHeight));
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(total, Math.ceil((scrollTop + bodyHeight) / rowHeight) + overscan);
  const windowRows = sortedRows.slice(startIndex, endIndex);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const allSelected = total > 0 && sortedRows.every((row) => selectedSet.has(getRowId(row)));
  const someSelected = !allSelected && sortedRows.some((row) => selectedSet.has(getRowId(row)));

  const gridTemplate = [
    selectable ? '2.75rem' : null,
    ...columns.map((c) => c.width ?? 'minmax(0, 1fr)'),
  ]
    .filter(Boolean)
    .join(' ');
  const gridStyle = { '--dt-columns': gridTemplate } as CSSProperties;

  // Keep the active row inside the rendered window, then move DOM focus to it.
  useEffect(() => {
    if (!shouldFocusRow.current) return;
    const row = bodyRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (row) {
      row.focus({ preventScroll: true });
      shouldFocusRow.current = false;
    }
  });

  const moveTo = (index: number) => {
    const next = Math.min(Math.max(index, 0), total - 1);
    setActiveIndex(next);
    shouldFocusRow.current = true;
    const body = bodyRef.current;
    if (body) {
      const top = next * rowHeight;
      if (top < body.scrollTop) body.scrollTop = top;
      else if (top + rowHeight > body.scrollTop + bodyHeight)
        body.scrollTop = top + rowHeight - bodyHeight;
      setScrollTop(body.scrollTop);
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    const ids = sortedRows.map(getRowId);
    setSelected(allSelected ? [] : ids);
  };

  const cycleSort = (column: DataTableColumn<T>) => {
    if (!column.sortValue) return;
    if (!sortState || sortState.columnId !== column.id)
      setSortState({ columnId: column.id, direction: 'ascending' });
    else if (sortState.direction === 'ascending')
      setSortState({ columnId: column.id, direction: 'descending' });
    else setSortState(null);
  };

  const onRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, row: T, index: number) => {
    // Let controls inside a cell (like the checkbox) handle their own keys.
    if (event.target !== event.currentTarget) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveTo(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveTo(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        moveTo(0);
        break;
      case 'End':
        event.preventDefault();
        moveTo(total - 1);
        break;
      case 'PageDown':
        event.preventDefault();
        moveTo(index + visibleCount);
        break;
      case 'PageUp':
        event.preventDefault();
        moveTo(index - visibleCount);
        break;
      case ' ':
        if (selectable) {
          event.preventDefault();
          toggleRow(getRowId(row));
        }
        break;
      case 'Enter':
        if (onRowAction) {
          event.preventDefault();
          onRowAction(row);
        }
        break;
    }
  };

  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      aria-rowcount={total + 1}
      aria-colcount={colCount}
      aria-multiselectable={selectable || undefined}
      className={cx(styles.table, className)}
      style={gridStyle}
    >
      <div role="rowgroup" className={styles.head}>
        <div role="row" aria-rowindex={1} className={cx(styles.row, styles.headRow)}>
          {selectable && (
            <div
              role="columnheader"
              aria-colindex={1}
              className={cx(styles.cell, styles.checkCell)}
            >
              <Checkbox
                aria-label="Select all rows"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                disabled={total === 0}
              />
            </div>
          )}
          {columns.map((column, i) => {
            const isSorted = sortState?.columnId === column.id;
            const ariaSort = isSorted
              ? sortState!.direction
              : column.sortValue
                ? 'none'
                : undefined;
            return (
              <div
                key={column.id}
                role="columnheader"
                aria-colindex={i + 1 + (selectable ? 1 : 0)}
                aria-sort={ariaSort}
                className={cx(
                  styles.cell,
                  styles.headCell,
                  column.align === 'end' && styles.alignEnd,
                )}
              >
                {column.sortValue ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => cycleSort(column)}
                  >
                    {column.header}
                    <Icon
                      name={
                        isSorted
                          ? sortState!.direction === 'ascending'
                            ? 'arrow-up'
                            : 'arrow-down'
                          : 'sort'
                      }
                      size={14}
                      className={cx(styles.sortIcon, isSorted && styles.sortIconActive)}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </div>
            );
          })}
        </div>
      </div>

      {total === 0 ? (
        <div role="rowgroup">
          <div role="row" aria-rowindex={2}>
            <div role="gridcell" aria-colspan={colCount} className={styles.empty}>
              {emptyState ?? (
                <EmptyState title="No data" description="There is nothing to show yet." />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          role="rowgroup"
          ref={bodyRef}
          className={styles.body}
          style={{ height: bodyHeight }}
          onScroll={(event: UIEvent<HTMLDivElement>) => setScrollTop(event.currentTarget.scrollTop)}
        >
          <div className={styles.spacer} style={{ height: total * rowHeight }}>
            {windowRows.map((row, offset) => {
              const index = startIndex + offset;
              const id = getRowId(row);
              const isSelected = selectedSet.has(id);
              return (
                <div
                  key={id}
                  role="row"
                  data-index={index}
                  aria-rowindex={index + 2}
                  aria-selected={selectable ? isSelected : undefined}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={cx(styles.row, styles.bodyRow, isSelected && styles.selected)}
                  style={{ height: rowHeight, transform: `translateY(${index * rowHeight}px)` }}
                  onKeyDown={(event) => onRowKeyDown(event, row, index)}
                  onFocus={(event) => {
                    if (event.target === event.currentTarget) setActiveIndex(index);
                  }}
                  onDoubleClick={() => onRowAction?.(row)}
                >
                  {selectable && (
                    <div
                      role="gridcell"
                      aria-colindex={1}
                      className={cx(styles.cell, styles.checkCell)}
                    >
                      <Checkbox
                        aria-label={`Select row ${index + 1}`}
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        tabIndex={-1}
                      />
                    </div>
                  )}
                  {columns.map((column, i) => (
                    <div
                      key={column.id}
                      role="gridcell"
                      aria-colindex={i + 1 + (selectable ? 1 : 0)}
                      className={cx(styles.cell, column.align === 'end' && styles.alignEnd)}
                    >
                      {column.cell(row)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
