# 3. React Aria for the hardest widgets, hand-built for the rest

Status: accepted

## Context

Accessible widgets differ a lot in difficulty. A button or a tab list has a small, well-known contract.
A combobox or a menu has many edge cases: virtual focus, typeahead, touch and screen reader quirks, and
live announcements of the result count.

## Decision

- **Combobox and Menu** are built on `react-aria-components`, wrapped in our own compound API and tokens.
- **Everything else** (Dialog, Popover, Tooltip, Tabs, Accordion, Toast, DataTable, CommandPalette, form
  controls) is hand-built from the WAI-ARIA Authoring Practices.

## Why

- Using a proven implementation for the widgets most likely to have subtle bugs lowers risk for consumers.
- Hand-building the simpler ones keeps the bundle small, keeps the code readable, and shows the patterns
  (roving tabindex, focus trap and restore, `aria-activedescendant`) rather than hiding them.
- The wrapper keeps the public API ours. If we ever replace the engine underneath, consumers are not affected.

## Consequences

- `react-aria-components` is a dependency. It is excluded from the per-component size budgets because it is
  installed once and shared.
- Hand-built widgets have their own keyboard tests and are checked in a real browser in CI.
