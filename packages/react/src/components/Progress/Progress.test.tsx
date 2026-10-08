import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';
import { expectNoA11yViolations } from '../../test-utils';

describe('Progress', () => {
  it('exposes the current value', () => {
    render(<Progress label="Uploading" value={40} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps values outside the range', () => {
    render(<Progress label="Upload" value={250} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('omits the value when indeterminate', () => {
    render(<Progress label="Loading" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Progress label="Syncing" value={60} showValue />);
    await expectNoA11yViolations(container);
  });
});
