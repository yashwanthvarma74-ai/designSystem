import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import { expectNoA11yViolations } from '../../test-utils';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Meridian' },
];

describe('Breadcrumbs', () => {
  it('is a labelled navigation landmark with links', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('marks the last item as the current page', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Meridian')).toHaveAttribute('aria-current', 'page');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Breadcrumbs items={items} />);
    await expectNoA11yViolations(container);
  });
});
