import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { children: 'Email me product updates' },
  argTypes: { disabled: { control: 'boolean' }, indeterminate: { control: 'boolean' } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const WithDescription: Story = { args: { description: 'About one email a month.' } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

export const Indeterminate: Story = {
  render: function Render() {
    const [items, setItems] = useState([true, false, false]);
    const all = items.every(Boolean);
    const some = items.some(Boolean);
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <Checkbox
          checked={all}
          indeterminate={some && !all}
          onChange={(e) => setItems(items.map(() => e.target.checked))}
        >
          Select all
        </Checkbox>
        {items.map((on, i) => (
          <div key={i} style={{ marginLeft: 24 }}>
            <Checkbox
              checked={on}
              onChange={(e) => setItems(items.map((v, j) => (j === i ? e.target.checked : v)))}
            >
              Item {i + 1}
            </Checkbox>
          </div>
        ))}
      </div>
    );
  },
};
