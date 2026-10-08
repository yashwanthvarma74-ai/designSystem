import { render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Checkbox', () => {
  it('toggles with click and with the space bar', async () => {
    const { user } = setup(<Checkbox>Accept terms</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    await user.click(box);
    expect(box).toBeChecked();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
  });

  it('reports the mixed state', () => {
    render(<Checkbox indeterminate>Select all</Checkbox>);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('cannot be toggled when disabled', async () => {
    const { user } = setup(<Checkbox disabled>Locked</Checkbox>);
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Checkbox>One</Checkbox>
        <Checkbox indeterminate description="Some selected">
          Two
        </Checkbox>
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
