import { screen } from '@testing-library/react';
import { Button } from '../Button';
import { Popover } from './Popover';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Demo() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button>Filters</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Filters">
        <label>
          Owner <input />
        </label>
      </Popover.Content>
    </Popover>
  );
}

describe('Popover', () => {
  it('toggles from the trigger and exposes expanded state', async () => {
    const { user } = setup(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape and gives focus back to the trigger', async () => {
    const { user } = setup(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveFocus();
  });

  it('closes when clicking outside', async () => {
    const { user } = setup(
      <div>
        <Demo />
        <p>Elsewhere</p>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    await user.click(screen.getByText('Elsewhere'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const { user, container } = setup(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    await expectNoA11yViolations(document.body);
    expect(container).toBeTruthy();
  });
});
