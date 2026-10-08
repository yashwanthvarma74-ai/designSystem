import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { type: 'single', defaultValue: ['shipping'], children: null },
  argTypes: { type: { control: 'inline-radio', options: ['single', 'multiple'] } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="shipping" title="How long does shipping take?">
        Orders leave the warehouse within one business day and arrive in two to five days.
      </Accordion.Item>
      <Accordion.Item value="returns" title="Can I return an item?">
        Yes, within thirty days as long as it is unused and in its original packaging.
      </Accordion.Item>
      <Accordion.Item value="warranty" title="What does the warranty cover?">
        Manufacturing defects for one year from the date of delivery.
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['shipping', 'returns'] },
  render: Default.render,
};
