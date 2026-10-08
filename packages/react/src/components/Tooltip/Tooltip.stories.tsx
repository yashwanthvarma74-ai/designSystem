import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Copy to clipboard', placement: 'top', children: <Button>Copy</Button> },
  argTypes: { placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  decorators: [
    (Story) => (
      <div style={{ padding: 60 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Short, supplementary text. It shows on hover and on keyboard focus, stays open while the pointer is over it, and `Escape` dismisses it. Never put essential information only in a tooltip.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnIconButton: Story = {
  args: {
    content: 'Search the workspace',
    children: <IconButton label="Search" icon={<Icon name="search" />} variant="secondary" />,
  },
};
