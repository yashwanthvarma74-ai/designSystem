import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from '../Input';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import { FormField } from './FormField';

const meta = {
  title: 'Patterns/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: 'Email address', children: null },
  decorators: [
    (Story) => (
      <div style={{ width: 340 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Connects a visible label, helper text and an error message to any input inside it, so ids and `aria-describedby` are never wired by hand.',
      },
    },
  },
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormField {...args} description="We only use this to send receipts.">
      <Input type="email" placeholder="you@company.com" />
    </FormField>
  ),
};

export const Required: Story = {
  render: (args) => (
    <FormField {...args} required>
      <Input type="email" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <FormField {...args} error="Enter an email address like name@company.com">
      <Input type="email" defaultValue="name@" />
    </FormField>
  ),
};

export const LiveValidation: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    const error =
      value && !value.includes('@') ? 'This does not look like an email address' : undefined;
    return (
      <FormField {...args} error={error}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </FormField>
    );
  },
};

export const OtherControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <FormField label="Role" description="Pick the closest match.">
        <Select>
          <option>Designer</option>
          <option>Engineer</option>
        </Select>
      </FormField>
      <FormField label="About you">
        <Textarea />
      </FormField>
    </div>
  ),
};
