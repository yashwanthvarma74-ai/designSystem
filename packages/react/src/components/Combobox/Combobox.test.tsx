import { useState } from 'react';
import { screen, within } from '@testing-library/react';
import { Combobox } from './Combobox';
import { expectNoA11yViolations, setup } from '../../test-utils';

interface Person {
  id: number;
  name: string;
}

const people: Person[] = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Grace Hopper' },
  { id: 3, name: 'Alan Turing' },
];

function Demo({ onPick }: { onPick?: (p: Person | null) => void }) {
  const [person, setPerson] = useState<Person | null>(null);
  return (
    <Combobox
      value={person}
      onChange={(p) => {
        setPerson(p);
        onPick?.(p);
      }}
    >
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
}

describe('Combobox', () => {
  it('is a labelled combobox that controls a listbox', async () => {
    const { user } = setup(<Demo />);
    const input = screen.getByRole('combobox', { name: 'Assign to' });
    await user.click(input);
    const list = await screen.findByRole('listbox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(within(list).getAllByRole('option')).toHaveLength(3);
  });

  it('filters options as the user types', async () => {
    const { user } = setup(<Demo />);
    await user.type(screen.getByRole('combobox'), 'gra');
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Grace Hopper');
  });

  it('shows a message when nothing matches', async () => {
    const { user } = setup(<Demo />);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  it('supports arrow keys and Enter to choose, using aria-activedescendant', async () => {
    const onPick = vi.fn();
    const { user } = setup(<Demo onPick={onPick} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
    await user.keyboard('{Enter}');
    expect(onPick).toHaveBeenLastCalledWith(people[1]);
    expect(input).toHaveValue('Grace Hopper');
  });

  it('closes with Escape', async () => {
    const { user } = setup(<Demo />);
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const { user } = setup(<Demo />);
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    await expectNoA11yViolations(document.body);
  });
});
