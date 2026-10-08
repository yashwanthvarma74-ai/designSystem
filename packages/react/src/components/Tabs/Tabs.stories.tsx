import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { defaultValue: 'overview', children: null },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Roving tabindex: only the active tab is in the tab order. Arrow keys move between tabs, `Home` and `End` jump to the ends.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List aria-label="Project sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="members">Members</Tabs.Tab>
        <Tabs.Tab value="billing" disabled>
          Billing
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">A summary of what the team shipped this week.</Tabs.Panel>
      <Tabs.Panel value="activity">Recent commits, comments and deploys.</Tabs.Panel>
      <Tabs.Panel value="members">Twelve people have access to this project.</Tabs.Panel>
      <Tabs.Panel value="billing">Billing details.</Tabs.Panel>
    </Tabs>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: Default.render,
};
