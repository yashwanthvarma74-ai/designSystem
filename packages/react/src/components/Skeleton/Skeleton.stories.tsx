import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { width: 240, height: 16 },
  argTypes: { shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProfileCard: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Skeleton shape="circle" width={48} height={48} />
      <div style={{ display: 'grid', gap: 8 }}>
        <Skeleton shape="text" width={160} />
        <Skeleton shape="text" width={100} />
      </div>
    </div>
  ),
};
