import { screen, waitFor } from '@testing-library/react';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Tooltip', () => {
  it('appears on keyboard focus and describes the trigger', async () => {
    const { user } = setup(
      <Tooltip content="Save to cloud">
        <Button>Save</Button>
      </Tooltip>,
    );
    await user.tab();
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Save to cloud');
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription(
      'Save to cloud',
    );
  });

  it('shows on hover and hides when the pointer leaves', async () => {
    const { user } = setup(
      <Tooltip content="Hello" delay={0}>
        <Button>Hover me</Button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await user.unhover(screen.getByRole('button'));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('dismisses with Escape while focus stays put', async () => {
    const { user } = setup(
      <Tooltip content="Tip">
        <Button>Info</Button>
      </Tooltip>,
    );
    await user.tab();
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('has no axe violations while open', async () => {
    const { user } = setup(
      <Tooltip content="Tip">
        <Button>Info</Button>
      </Tooltip>,
    );
    await user.tab();
    await screen.findByRole('tooltip');
    await expectNoA11yViolations(document.body);
  });
});
