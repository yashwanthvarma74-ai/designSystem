import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../Badge';
import { DataTable, type DataTableColumn } from './DataTable';

interface Order {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Refunded';
  total: number;
}

const customers = [
  'Priya Nair',
  'Marcus Webb',
  'Lena Fischer',
  'Tomás Rey',
  'Aiko Tanaka',
  'Omar Haddad',
];
const statuses: Order['status'][] = ['Paid', 'Pending', 'Refunded'];

function makeOrders(count: number): Order[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${String(1000 + i)}`,
    customer: customers[i % customers.length]!,
    status: statuses[i % statuses.length]!,
    total: Math.round((20 + ((i * 37) % 480) + (i % 7) * 0.99) * 100) / 100,
  }));
}

const statusVariant = { Paid: 'success', Pending: 'warning', Refunded: 'neutral' } as const;

const columns: DataTableColumn<Order>[] = [
  { id: 'id', header: 'Order', cell: (o) => o.id, sortValue: (o) => o.id, width: '8rem' },
  {
    id: 'customer',
    header: 'Customer',
    cell: (o) => o.customer,
    sortValue: (o) => o.customer,
    width: 'minmax(0, 2fr)',
  },
  {
    id: 'status',
    header: 'Status',
    cell: (o) => (
      <Badge variant={statusVariant[o.status]} dot>
        {o.status}
      </Badge>
    ),
    sortValue: (o) => o.status,
    width: '8rem',
  },
  {
    id: 'total',
    header: 'Total',
    cell: (o) => `$${o.total.toFixed(2)}`,
    sortValue: (o) => o.total,
    align: 'end',
    width: '8rem',
  },
];

const meta = {
  title: 'Patterns/DataTable',
  component: DataTable<Order>,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 'min(760px, 92vw)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A virtualized grid: only the rows in view are in the DOM, so ten thousand rows stay fast. Rows use a roving tabindex. Arrow keys, `Home`, `End`, `PageUp` and `PageDown` move between rows, `Space` selects and `Enter` activates. Sortable headers expose `aria-sort`.',
      },
    },
  },
} satisfies Meta<typeof DataTable<Order>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns,
    rows: makeOrders(8),
    getRowId: (o) => o.id,
    'aria-label': 'Orders',
    height: 400,
  },
};

export const Selectable: Story = {
  args: Default.args,
  render: function Render(args) {
    const [ids, setIds] = useState<string[]>(['ORD-1001']);
    return (
      <div>
        <p style={{ font: '14px var(--mrd-font-family-sans)', margin: '0 0 8px' }}>
          {ids.length} selected
        </p>
        <DataTable {...args} selectable selectedIds={ids} onSelectedIdsChange={setIds} />
      </div>
    );
  },
};

export const TenThousandRows: Story = {
  args: { ...Default.args, rows: makeOrders(10000), height: 380, selectable: true },
};

export const Empty: Story = { args: { ...Default.args, rows: [] } };
