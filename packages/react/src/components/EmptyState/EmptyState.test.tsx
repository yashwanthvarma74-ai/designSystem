import { render, screen } from '@testing-library/react';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';
import { expectNoA11yViolations } from '../../test-utils';

describe('EmptyState', () => {
  it('renders a heading, description and action', () => {
    render(
      <EmptyState
        title="No projects yet"
        description="Create one to get started."
        action={<Button>New project</Button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No projects yet', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Create one to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New project' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    await expectNoA11yViolations(container);
  });
});
