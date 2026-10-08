import { screen } from '@testing-library/react';
import { Select } from './Select';
import { expectNoA11yViolations, setup } from '../../test-utils';

const options = (
  <>
    <option value="a">Alpha</option>
    <option value="b">Beta</option>
  </>
);

describe('Select', () => {
  it('changes the selected option', async () => {
    const { user } = setup(<Select aria-label="Letter">{options}</Select>);
    const select = screen.getByRole('combobox', { name: 'Letter' });
    await user.selectOptions(select, 'b');
    expect(select).toHaveValue('b');
  });

  it('has no axe violations', async () => {
    const { container } = setup(<Select aria-label="Letter">{options}</Select>);
    await expectNoA11yViolations(container);
  });
});
