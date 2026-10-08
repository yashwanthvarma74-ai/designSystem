import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Patterns/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No projects yet',
    description:
      'Projects you create will show up here. Start with a blank one or import from a file.',
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: {
    action: (
      <>
        <Button>Import</Button>
        <Button variant="primary">New project</Button>
      </>
    ),
  },
};
export const Search: Story = {
  args: {
    icon: 'search',
    title: 'No results',
    description: 'Try a different keyword or clear the filters.',
  },
};
