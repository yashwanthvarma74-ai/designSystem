# Contributing

Thanks for helping. This guide covers adding a component, the checks a pull request has to pass, and how
releases work. The same guide is published in Storybook under **Guides / Contributing**.

## Setup

```bash
nvm use            # Node 22
npm install
npm run build      # tokens first, then the library
npm run storybook  # http://localhost:6006
```

## Adding a component

Every component lives in its own folder and carries its own tests and stories:

```
packages/react/src/components/Combobox/
├─ Combobox.tsx          component + compound parts
├─ Combobox.module.css   styles from CSS variables
├─ Combobox.test.tsx     behaviour + axe checks
├─ Combobox.stories.tsx  docs, controls, visual tests
└─ index.ts              public exports
```

1. **Build bottom-up.** A component may only use components from the tiers below it
   (foundations → primitives → composites → patterns).
2. **Use tokens.** No raw colours, sizes or durations in CSS. Use `--mrd-*` variables.
3. **Prefer composition.** Compound components beat long prop lists. Support controlled and uncontrolled
   use where it makes sense.
4. **Make misuse hard.** Create roles, ids and keyboard handling inside the component.
5. **Test behaviour the way a user does**, with `user-event`, and add an axe check for each visible state.
6. **Write stories** for each meaningful state, with controls and a note on keyboard use.
7. **Respect motion preferences** with `@media (prefers-reduced-motion: reduce)`.
8. **Export** the component from `packages/react/src/index.ts`.
9. **Add a changeset**: `npm run changeset`.

## Changing a token

Edit the JSON under `packages/tokens/src`, then:

```bash
npm run build      # regenerates CSS variables and types
npm run contrast   # checks every text and UI pairing in all three themes
```

## Checks every pull request must pass

| Step                                                       | Command                                          |
| ---------------------------------------------------------- | ------------------------------------------------ |
| Lint and format                                            | `npm run lint`                                   |
| Types (strict)                                             | `npm run typecheck`                              |
| Unit, interaction and axe tests, 85%+ coverage on the code | `npm run test:coverage`                          |
| Token contrast                                             | `npm run contrast`                               |
| Bundle budgets                                             | `npm run size`                                   |
| Axe on every story in every theme, keyboard checks         | `npm run e2e -w @meridian/docs -- a11y keyboard` |
| Visual regression                                          | `npm run e2e -w @meridian/docs -- visual`        |
| Lighthouse accessibility on the docs                       | `npx lhci autorun`                               |

Any red step blocks the merge.

## Visual snapshots

Screenshots are taken with fonts pinned, animations off, a fixed viewport and fixed data. Pixel output
depends on the OS, so baselines are created and compared inside the Playwright container that CI uses:

```bash
docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.50.0-jammy \
  npm run e2e:update -w @meridian/docs
```

Commit the updated images together with the change that caused them.

## Releasing

1. Merge a pull request that contains a changeset.
2. The release workflow opens (or updates) a "version packages" pull request.
3. Merging that pull request bumps versions, writes `CHANGELOG.md` and publishes to npm with provenance.

## Breaking changes

Follow semver strictly. Use a `major` changeset, keep the old API for one minor release with a deprecation
note when possible, and write the migration steps in the changeset text.
