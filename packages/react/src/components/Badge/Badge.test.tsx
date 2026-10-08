import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { expectNoA11yViolations } from '../../test-utils';

describe('Badge', () => {
  it('shows its text', () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('has no axe violations for every variant', async () => {
    const { container } = render(
      <div>
        {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((v) => (
          <Badge key={v} variant={v} dot>
            {v}
          </Badge>
        ))}
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
