import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { expectNoA11yViolations } from '../../test-utils';

describe('Card', () => {
  it('renders its parts', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Billing</Card.Title>
          <Card.Description>Manage your plan</Card.Description>
        </Card.Header>
        <Card.Body>Body text</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Billing' })).toBeInTheDocument();
    expect(screen.getByText('Manage your plan')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Card>
        <Card.Title>Title</Card.Title>
      </Card>,
    );
    await expectNoA11yViolations(container);
  });
});
