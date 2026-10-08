import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: 320, fontFamily: 'var(--mrd-font-family-sans)' }}>
      <p>Account</p>
      <Separator />
      <p>Billing</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        fontFamily: 'var(--mrd-font-family-sans)',
      }}
    >
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Changelog</span>
    </div>
  ),
};
