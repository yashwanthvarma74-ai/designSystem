import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { CommandPalette, useCommandPaletteShortcut, type Command } from './CommandPalette';

const commands: Command[] = [
  {
    id: 'new',
    label: 'New document',
    group: 'File',
    icon: <Icon name="plus" size={16} />,
    shortcut: 'N',
    onSelect: () => {},
  },
  {
    id: 'open',
    label: 'Open project…',
    group: 'File',
    keywords: ['folder'],
    icon: <Icon name="inbox" size={16} />,
    onSelect: () => {},
  },
  {
    id: 'search',
    label: 'Search everything',
    group: 'Navigate',
    icon: <Icon name="search" size={16} />,
    shortcut: '/',
    onSelect: () => {},
  },
  {
    id: 'dark',
    label: 'Switch to dark theme',
    group: 'View',
    icon: <Icon name="moon" size={16} />,
    onSelect: () => {},
  },
  {
    id: 'light',
    label: 'Switch to light theme',
    group: 'View',
    icon: <Icon name="sun" size={16} />,
    onSelect: () => {},
  },
  {
    id: 'hc',
    label: 'Switch to high contrast',
    group: 'View',
    icon: <Icon name="contrast" size={16} />,
    onSelect: () => {},
  },
];

const meta = {
  title: 'Patterns/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: () => {}, commands },
  parameters: {
    docs: {
      description: {
        component:
          'A searchable list of commands in a modal. Press `Cmd+K` / `Ctrl+K` (via `useCommandPaletteShortcut`) to open. Focus stays in the input while `aria-activedescendant` tracks the highlighted command.',
      },
    },
  },
} satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    useCommandPaletteShortcut(() => setOpen((v) => !v));
    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          trailingIcon={<kbd style={{ font: '12px var(--mrd-font-family-sans)' }}>⌘K</kbd>}
        >
          Open command palette
        </Button>
        <CommandPalette {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

export const OpenOnLoad: Story = {
  tags: ['!autodocs'],
  render: (args) => <CommandPalette {...args} open onOpenChange={() => {}} />,
};
