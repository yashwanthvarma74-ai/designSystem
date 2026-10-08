import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { configureAxe } from 'vitest-axe';

// Components are tested as fragments, so the page-level "region" rule does not apply.
const axe = configureAxe({ rules: { region: { enabled: false } } });

// Renders with a user-event session, so tests read like real interaction.
export function setup(ui: ReactElement, options?: RenderOptions) {
  const user = userEvent.setup();
  return { user, ...render(ui, options) };
}

export async function expectNoA11yViolations(container: Element) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
