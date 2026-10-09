# @yashwanthvarma74/react

## 0.1.1

### Patch Changes

- 37a67ee: Fix type resolution for consumers: each component's JavaScript is now built to `components/<Name>/index.js`, next to its `index.d.ts`. Before, TypeScript with `moduleResolution: "bundler"` found `components/Input.js` first, saw no types, and typed every component as `any`.
  - @yashwanthvarma74/tokens@0.1.1

## 0.1.0

### Minor Changes

- fcdd1d1: First public release: design tokens, three themes and the initial set of components.

### Patch Changes

- Updated dependencies [fcdd1d1]
  - @yashwanthvarma74/tokens@0.1.0
