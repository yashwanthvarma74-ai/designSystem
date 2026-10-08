import { screen } from '@testing-library/react';
import { Accordion } from './Accordion';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Demo(props: { type?: 'single' | 'multiple' }) {
  return (
    <Accordion {...props}>
      <Accordion.Item value="a" title="Shipping">
        Ships in two days.
      </Accordion.Item>
      <Accordion.Item value="b" title="Returns">
        Thirty day returns.
      </Accordion.Item>
      <Accordion.Item value="c" title="Warranty">
        One year.
      </Accordion.Item>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('starts closed and opens with click', async () => {
    const { user } = setup(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Shipping' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Shipping' })).toBeVisible();
  });

  it('closes the other item in single mode', async () => {
    const { user } = setup(<Demo type="single" />);
    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Returns' }));
    expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('keeps several open in multiple mode', async () => {
    const { user } = setup(<Demo type="multiple" />);
    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Returns' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('moves focus with arrow keys', async () => {
    const { user } = setup(<Demo />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Warranty' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { user, container } = setup(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await expectNoA11yViolations(container);
  });
});
