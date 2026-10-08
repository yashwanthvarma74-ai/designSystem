import { screen } from '@testing-library/react';
import { Textarea } from './Textarea';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('Textarea', () => {
  it('accepts multi-line text', async () => {
    const { user } = setup(<Textarea aria-label="Notes" />);
    const box = screen.getByRole('textbox', { name: 'Notes' });
    await user.type(box, 'one{Enter}two');
    expect(box).toHaveValue('one\ntwo');
  });

  it('has no axe violations', async () => {
    const { container } = setup(<Textarea aria-label="Bio" />);
    await expectNoA11yViolations(container);
  });
});
