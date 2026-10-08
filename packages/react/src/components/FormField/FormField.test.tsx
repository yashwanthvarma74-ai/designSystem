import { screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../Input';
import { expectNoA11yViolations, setup } from '../../test-utils';

describe('FormField', () => {
  it('labels the control it wraps', () => {
    setup(
      <FormField label="Email">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('links description and error text to the control', () => {
    setup(
      <FormField label="Email" description="We never share it." error="Enter a valid email">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('We never share it. Enter a valid email');
  });

  it('marks required fields', () => {
    setup(
      <FormField label="Name" required>
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText(/Name/)).toBeRequired();
  });

  it('has no axe violations in the error state', async () => {
    const { container } = setup(
      <FormField label="Email" error="Enter a valid email">
        <Input />
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });
});
