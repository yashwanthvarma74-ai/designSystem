import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';
import { expectNoA11yViolations } from '../../test-utils';

describe('Avatar', () => {
  it('shows initials and is named after the person', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('falls back to initials when the image fails', () => {
    const { container } = render(<Avatar name="Grace Hopper" src="/missing.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('img', { name: 'Grace Hopper' })).toHaveTextContent('GH');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Avatar name="Alan Turing" />);
    await expectNoA11yViolations(container);
  });
});
