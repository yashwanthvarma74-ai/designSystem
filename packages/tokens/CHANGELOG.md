# @yashwanthvarma74/tokens

## 0.2.0

### Minor Changes

- 081489e: A new design language, "graphite". Primary actions are near-black (near-white in the dark theme) instead of indigo, and one blue is kept for links, focus rings and information. Corners are tighter across the radius scale.

  - `color.accent.*` now maps to the neutral palette. `color.text.link`, `color.focus.ring` and `color.info.*` use the new `palette.blue` ramp.
  - The `palette.indigo` ramp is removed. Anything that read `--mrd-palette-indigo-*` should use `--mrd-palette-blue-*` or a semantic token.
  - `radius.sm` to `radius.2xl` are one step smaller (for example `radius.xl` is 0.5rem, was 0.75rem).
  - The high contrast theme is unchanged. All 105 contrast checks pass.

  Visual change only: no component API changed.

## 0.1.1

## 0.1.0

### Minor Changes

- fcdd1d1: First public release: design tokens, three themes and the initial set of components.
