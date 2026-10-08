import { render, screen } from '@testing-library/react';
import { Separator } from './Separator';

describe('Separator', () => {
  it('is hidden from assistive tech by default', () => {
    render(<Separator />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('exposes a separator role when it is meaningful', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
