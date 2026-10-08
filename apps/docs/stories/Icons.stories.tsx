import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from '../../../packages/react/src/components/Icon';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { name: 'check', size: 20 },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
        gap: 12,
        width: '100%',
        fontFamily: 'var(--mrd-font-family-sans)',
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: 8,
            padding: 14,
            border: '1px solid var(--mrd-color-border-subtle)',
            borderRadius: 10,
            background: 'var(--mrd-color-bg-surface)',
            color: 'var(--mrd-color-text-primary)',
          }}
        >
          <Icon name={name} size={24} />
          <code style={{ fontSize: 11, color: 'var(--mrd-color-text-secondary)' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};
