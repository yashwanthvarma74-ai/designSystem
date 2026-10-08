import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { label: 'Billing plan', defaultValue: 'pro', children: null },
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Built on native radio inputs inside a `fieldset`, so arrow-key movement and form behaviour come for free.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free" description="For personal projects">
        Free
      </Radio>
      <Radio value="pro" description="For growing teams">
        Pro
      </Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
