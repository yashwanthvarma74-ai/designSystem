import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Foundations/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hides content visually but keeps it readable by screen readers. Use it for labels that the layout already makes obvious to sighted users.',
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <button type="button" style={{ padding: 8 }}>
      ★<VisuallyHidden>Add to favourites</VisuallyHidden>
    </button>
  ),
};
