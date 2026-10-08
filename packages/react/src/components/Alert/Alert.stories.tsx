import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    title: 'Scheduled maintenance',
    children: 'The dashboard will be read-only tonight from 22:00 to 23:00 UTC.',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = {
  args: { variant: 'success', title: 'Deployment finished', children: 'Version 2.4.0 is live.' },
};
export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Storage almost full',
    children: 'You have used 92% of your quota.',
  },
};
export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Payment failed',
    children: 'Update your card to keep your plan active.',
  },
};
export const Dismissible: Story = { args: { onDismiss: () => {} } };
