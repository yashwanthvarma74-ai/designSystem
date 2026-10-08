import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Popover } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component:
          'A non-modal panel anchored to a trigger. It flips to stay on screen, closes on `Escape` or an outside click, and returns focus to the trigger.',
      },
    },
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 40 }}>
      <Popover {...args}>
        <Popover.Trigger>
          <Button>Share link</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Share link">
          <FormField label="Anyone with this link can view">
            <Input readOnly value="https://meridian.dev/s/4f9d2" />
          </FormField>
        </Popover.Content>
      </Popover>
    </div>
  ),
};

export const OpenByDefault: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div style={{ padding: 40, minHeight: 220 }}>
      <Popover {...args} defaultOpen>
        <Popover.Trigger>
          <Button>Details</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Details">Last edited by Priya, 2 hours ago.</Popover.Content>
      </Popover>
    </div>
  ),
};
