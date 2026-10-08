# 1. CSS variables over runtime CSS-in-JS

Status: accepted

## Context

The library has to support three themes, server rendering, and consumers on very different stacks.
Styling options considered: runtime CSS-in-JS (styled-components, Emotion), build-time CSS-in-JS
(vanilla-extract), and CSS Modules driven by CSS variables.

## Decision

Components are styled with CSS Modules that only read CSS variables (`--mrd-*`). Themes are sets of
variables selected by a `data-theme` attribute.

## Why

- **Zero runtime cost.** There is no style serialisation or injection in the browser.
- **Theme switches never re-render.** Changing `data-theme` repaints the page. React is not involved, so
  switching theme in a page with thousands of nodes is a single style recalculation.
- **Server components and SSR work.** Nothing depends on a client-only context or on style tags created at
  render time.
- **Any consumer can theme it.** Plain CSS can override a variable without importing our code.

## Why not the alternatives

- _Runtime CSS-in-JS_ adds bundle size and render cost, needs a provider for theming, and is awkward with
  React Server Components.
- _vanilla-extract_ is a good option and also zero-runtime, but it ties consumers to a build plugin. CSS
  Modules are supported by every major bundler and framework without extra setup.

## Consequences

- Dynamic values (for example a calculated width) are passed as inline styles or custom properties.
- Component authors must use tokens and never raw colours. Lint and review enforce this.
