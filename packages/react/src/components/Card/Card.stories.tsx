import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { padding: 'md' },
  argTypes: { padding: { control: 'inline-radio', options: ['none', 'md', 'lg'] } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Team plan</Card.Title>
        <Card.Description>Billed monthly, renews on the 14th.</Card.Description>
      </Card.Header>
      <Card.Body>Up to 25 seats, unlimited projects and priority support.</Card.Body>
      <Card.Footer>
        <Button variant="primary">Upgrade</Button>
        <Button variant="ghost">Compare plans</Button>
      </Card.Footer>
    </Card>
  ),
};
