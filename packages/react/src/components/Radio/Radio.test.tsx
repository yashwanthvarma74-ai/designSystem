import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Radio, RadioGroup } from './Radio';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Plans(props: { onChange?: (v: string) => void; defaultValue?: string }) {
  return (
    <RadioGroup label="Plan" {...props}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('exposes a labelled group', () => {
    setup(<Plans />);
    expect(screen.getByRole('group', { name: 'Plan' })).toBeInTheDocument();
  });

  it('selects on click and reports the value', async () => {
    const onChange = vi.fn();
    const { user } = setup(<Plans onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('pro');
  });

  it('moves the selection with the arrow keys', async () => {
    const { user } = setup(<Plans defaultValue="free" />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = setup(<Plans defaultValue="free" />);
    await expectNoA11yViolations(container);
  });
});
