import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './Button';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Button', () => {
  it('fires onClick when pressed with mouse or keyboard', async () => {
    const onClick = vi.fn();
    const { user } = setup(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('does not fire while loading but stays focusable', async () => {
    const onClick = vi.fn();
    const { user } = setup(
      <Button loading onClick={onClick}>
        Pay
      </Button>,
    );
    const button = screen.getByRole('button', { name: /pay/i });
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).not.toBeDisabled();
  });

  it('is not clickable when disabled', async () => {
    const onClick = vi.fn();
    const { user } = setup(
      <Button disabled onClick={onClick}>
        Delete
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no axe violations across variants', async () => {
    const { container } = render(
      <div>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
