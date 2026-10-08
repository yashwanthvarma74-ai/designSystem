import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { DataTable, type DataTableColumn } from './DataTable';
import { expectNoA11yViolations, setup } from '../../test-utils';

interface Person {
  id: string;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: 'a', name: 'Carol', age: 41 },
  { id: 'b', name: 'Alice', age: 29 },
  { id: 'c', name: 'Bob', age: 35 },
];

const columns: DataTableColumn<Person>[] = [
  { id: 'name', header: 'Name', cell: (p) => p.name, sortValue: (p) => p.name },
  { id: 'age', header: 'Age', cell: (p) => p.age, sortValue: (p) => p.age, align: 'end' },
];

function renderTable(props: Partial<React.ComponentProps<typeof DataTable<Person>>> = {}) {
  return setup(
    <DataTable
      columns={columns}
      rows={people}
      getRowId={(p) => p.id}
      aria-label="People"
      {...props}
    />,
  );
}

const bodyNames = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('gridcell')[0]!.textContent);

describe('DataTable', () => {
  it('renders grid semantics with row and column counts', () => {
    renderTable();
    const grid = screen.getByRole('grid', { name: 'People' });
    expect(grid).toHaveAttribute('aria-rowcount', '4');
    expect(grid).toHaveAttribute('aria-colcount', '2');
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('sorts ascending, then descending, then clears', async () => {
    const { user } = renderTable();
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(within(nameHeader).getByRole('button'));
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(bodyNames()).toEqual(['Alice', 'Bob', 'Carol']);

    await user.click(within(nameHeader).getByRole('button'));
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    expect(bodyNames()).toEqual(['Carol', 'Bob', 'Alice']);

    await user.click(within(nameHeader).getByRole('button'));
    expect(bodyNames()).toEqual(['Carol', 'Alice', 'Bob']);
  });

  it('moves focus between rows with arrow keys, Home and End', async () => {
    const { user } = renderTable();
    const rows = () => screen.getAllByRole('row').slice(1);
    rows()[0]!.focus();
    await user.keyboard('{ArrowDown}');
    expect(rows()[1]).toHaveFocus();
    await user.keyboard('{End}');
    expect(rows()[2]).toHaveFocus();
    await user.keyboard('{ArrowUp}{Home}');
    expect(rows()[0]).toHaveFocus();
  });

  it('keeps only the active row in the tab order', () => {
    renderTable();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.filter((r) => r.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('selects rows with Space and with the select-all checkbox', async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ selectable: true, onSelectedIdsChange: onChange });
    const first = screen.getAllByRole('row')[1]!;
    first.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(['a']);
    expect(first).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
  });

  it('runs onRowAction on Enter', async () => {
    const onRowAction = vi.fn();
    const { user } = renderTable({ onRowAction });
    screen.getAllByRole('row')[1]!.focus();
    await user.keyboard('{Enter}');
    expect(onRowAction).toHaveBeenCalledWith(people[0]);
  });

  it('only renders the rows in view for large data sets', () => {
    const many = Array.from({ length: 5000 }, (_, i) => ({
      id: String(i),
      name: `Person ${i}`,
      age: i,
    }));
    renderTable({ rows: many, height: 220, rowHeight: 44, overscan: 2 });
    const rendered = screen.getAllByRole('row').length - 1;
    expect(rendered).toBeLessThan(20);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '5001');
  });

  it('shows the empty state when there are no rows', () => {
    renderTable({ rows: [] });
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderTable({ selectable: true });
    await expectNoA11yViolations(container);
  });
});
