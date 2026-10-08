import { screen } from '@testing-library/react';
import { Input } from './Input';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Input', () => {
  it('lets the user type', async () => {
    const { user } = setup(<Input aria-label="Name" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.type(input, 'Ada');
    expect(input).toHaveValue('Ada');
  });

  it('exposes the invalid state to assistive tech', () => {
    setup(<Input aria-label="Email" invalid />);
    expect(screen.getByRole('textbox')).toBeInvalid();
  });

  it('cannot be edited when disabled', async () => {
    const { user } = setup(<Input aria-label="Locked" disabled defaultValue="fixed" />);
    await user.type(screen.getByRole('textbox'), 'x');
    expect(screen.getByRole('textbox')).toHaveValue('fixed');
  });

  it('has no axe violations', async () => {
    const { container } = setup(<Input aria-label="Search" placeholder="Search" />);
    await expectNoA11yViolations(container);
  });
});
