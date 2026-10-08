import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Alert', () => {
  it('uses the alert role for errors and status for information', () => {
    const { rerender } = render(<Alert variant="danger" title="Payment failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    rerender(<Alert variant="info" title="Maintenance tonight" />);
    expect(screen.getByRole('status')).toHaveTextContent('Maintenance tonight');
  });

  it('can be dismissed', async () => {
    const onDismiss = vi.fn();
    const { user } = setup(<Alert title="Saved" variant="success" onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Alert variant="info" title="Info">
          Body
        </Alert>
        <Alert variant="success" title="Success">
          Body
        </Alert>
        <Alert variant="warning" title="Warning">
          Body
        </Alert>
        <Alert variant="danger" title="Danger">
          Body
        </Alert>
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
