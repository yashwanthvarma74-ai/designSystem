# 4. Compound components for composite widgets

Status: accepted

## Context

Composite widgets (Combobox, Dialog, Tabs, Menu, Accordion) have several parts. A single component with a
large set of props such as `items`, `renderItem`, `renderEmpty` and `headerSlot` grows without limit and
cannot express layout the author did not predict.

## Decision

Expose parts as members of the root: `<Tabs><Tabs.List><Tabs.Tab/></Tabs.List><Tabs.Panel/></Tabs>`.
The root owns state and accessibility wiring (ids, roles, keyboard handling) and shares it through context.
Components work controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).

## Why

- Consumers control markup and order, which keeps the API small and flexible.
- The library still guarantees correct ARIA, because relationships are created inside the library.
- Using a part outside its parent throws a readable error instead of failing silently.

## Consequences

- More exports per component. The root re-exports parts as static members to keep imports short.
- Adding a feature usually means adding a part, not a prop, which keeps backwards compatibility simple.
