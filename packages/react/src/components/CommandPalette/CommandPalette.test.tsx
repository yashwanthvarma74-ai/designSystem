import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../Button';
import { CommandPalette, type Command } from './CommandPalette';
import { expectNoA11yViolations, setup } from '../../test-utils';

function makeCommands(onSelect: (id: string) => void = vi.fn()): Command[] {
  return [
    { id: 'new', label: 'New document', group: 'File', onSelect: () => onSelect('new') },
    {
      id: 'open',
      label: 'Open project',
      group: 'File',
      keywords: ['folder'],
      onSelect: () => onSelect('open'),
    },
    { id: 'theme', label: 'Switch theme', group: 'View', onSelect: () => onSelect('theme') },
  ];
}

function Demo({ onSelect }: { onSelect?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandPalette open={open} onOpenChange={setOpen} commands={makeCommands(onSelect)} />
    </>
  );
}

async function openPalette(onSelect?: (id: string) => void) {
  const utils = setup(<Demo onSelect={onSelect} />);
  await utils.user.click(screen.getByRole('button', { name: 'Open palette' }));
  await screen.findByRole('dialog');
  return utils;
}

describe('CommandPalette', () => {
  it('focuses the search field and lists all commands', async () => {
    await openPalette();
    const input = screen.getByRole('combobox');
    await waitFor(() => expect(input).toHaveFocus());
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters by label and by keyword', async () => {
    const { user } = await openPalette();
    await user.type(screen.getByRole('combobox'), 'folder');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Open project');
  });

  it('shows a message when nothing matches', async () => {
    const { user } = await openPalette();
    await user.type(screen.getByRole('combobox'), 'qqq');
    expect(screen.getAllByText('No matching commands.').length).toBeGreaterThan(0);
  });

  it('moves the active option with arrow keys and announces it via aria-activedescendant', async () => {
    const { user } = await openPalette();
    const input = screen.getByRole('combobox');
    await user.keyboard('{ArrowDown}');
    const second = screen.getAllByRole('option')[1]!;
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', second.id);
  });

  it('runs the active command on Enter and closes', async () => {
    const onSelect = vi.fn();
    const { user } = await openPalette(onSelect);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('open');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape and restores focus', async () => {
    const { user } = await openPalette();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open palette' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    await openPalette();
    await expectNoA11yViolations(screen.getByRole('dialog'));
  });
});
