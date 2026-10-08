import { screen } from '@testing-library/react';
import { Switch } from './Switch';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Switch', () => {
  it('uses the switch role and flips with click or keyboard', async () => {
    const { user } = setup(<Switch>Airplane mode</Switch>);
    const toggle = screen.getByRole('switch', { name: 'Airplane mode' });
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.keyboard(' ');
    expect(toggle).not.toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = setup(<Switch>Notifications</Switch>);
    await expectNoA11yViolations(container);
  });
});
