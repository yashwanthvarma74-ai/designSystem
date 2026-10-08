import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Combobox } from './Combobox';

interface Person {
  id: number;
  name: string;
}

const people: Person[] = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Grace Hopper' },
  { id: 3, name: 'Alan Turing' },
  { id: 4, name: 'Margaret Hamilton' },
  { id: 5, name: 'Katherine Johnson' },
  { id: 6, name: 'Linus Torvalds' },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'An accessible autocomplete built as a compound component. Roles, ids, `aria-activedescendant` and arrow-key handling are wired for you, built on React Aria for the hardest keyboard and screen reader cases.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: function Render() {
    const [person, setPerson] = useState<Person | null>(null);
    return (
      <Combobox value={person} onChange={setPerson}>
        <Combobox.Label>Assign to</Combobox.Label>
        <Combobox.Input placeholder="Search people" />
        <Combobox.List>
          {people.map((p) => (
            <Combobox.Option key={p.id} value={p} textValue={p.name}>
              {p.name}
            </Combobox.Option>
          ))}
        </Combobox.List>
      </Combobox>
    );
  },
};

export const WithSelection: Story = {
  args: { children: null },
  render: () => (
    <Combobox defaultValue={people[1]}>
      <Combobox.Label>Reviewer</Combobox.Label>
      <Combobox.Input />
      <Combobox.List>
        {people.map((p) => (
          <Combobox.Option key={p.id} value={p} textValue={p.name}>
            {p.name}
          </Combobox.Option>
        ))}
      </Combobox.List>
    </Combobox>
  ),
};
