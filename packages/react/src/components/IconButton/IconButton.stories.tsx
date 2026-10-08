import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { label: 'Search', icon: <Icon name="search" />, variant: 'ghost', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = {
  args: { variant: 'danger', label: 'Delete', icon: <Icon name="close" /> },
};
