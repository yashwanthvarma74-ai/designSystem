import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { expectNoA11yViolations } from '../../test-utils';

describe('Spinner', () => {
  it('announces a status with a custom label', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    await expectNoA11yViolations(container);
  });
});
