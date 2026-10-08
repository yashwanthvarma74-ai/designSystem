import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Icon } from '../Icon';
import { IconButton } from './IconButton';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('IconButton', () => {
  it('is named by its label', () => {
    setup(<IconButton label="Close" icon={<Icon name="close" />} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('responds to the keyboard', async () => {
    const onClick = vi.fn();
    const { user } = setup(
      <IconButton label="Search" icon={<Icon name="search" />} onClick={onClick} />,
    );
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = setup(<IconButton label="More" icon={<Icon name="more" />} />);
    await expectNoA11yViolations(container);
  });
});
