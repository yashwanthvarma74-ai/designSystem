import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { Menu } from './Menu';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: { children: null },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 260 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown of actions. Arrow keys move through the items (roving focus), typing jumps to a match, `Escape` closes it and focus returns to the trigger.',
      },
    },
  },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>
        Actions <Icon name="chevron-down" size={16} />
      </Menu.Trigger>
      <Menu.Content aria-label="Document actions">
        <Menu.Item id="rename" shortcut="R">
          Rename
        </Menu.Item>
        <Menu.Item id="duplicate" shortcut="D">
          Duplicate
        </Menu.Item>
        <Menu.Item id="move" disabled>
          Move to…
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item id="delete" danger>
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};
