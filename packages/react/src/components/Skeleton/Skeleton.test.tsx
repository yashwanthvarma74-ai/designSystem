import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';
import { expectNoA11yViolations } from '../../test-utils';

describe('Skeleton', () => {
  it('is hidden from assistive tech', () => {
    const { container } = render(<Skeleton width={120} height={16} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Skeleton shape="circle" width={40} height={40} />);
    await expectNoA11yViolations(container);
  });
});
