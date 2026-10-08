# 2. Changesets over manual versioning

Status: accepted

## Context

The tokens and the React package are published together and consumed by four apps. Version bumps and
changelogs done by hand drift, and forgotten changelog entries make upgrades risky.

## Decision

Use Changesets. Every pull request that changes a package includes a small markdown file stating which
packages change and whether it is a patch, minor or major. The release workflow turns those files into a
version pull request, and merging that pull request publishes to npm with provenance.

## Why

- Each change declares its own impact when the author knows it best.
- The changelog is generated from those notes, so it is complete and accurate.
- A CI check fails a pull request that touches `packages/` without a changeset.
- Tokens and React are "fixed" together so their versions always match.

## Why not the alternatives

- _Manual versioning_ relies on memory.
- _semantic-release_ infers the bump from commit messages. It works, but it moves release control from the
  author to a commit-message convention, and it is harder to batch several changes into one release.

## Consequences

- Contributors need to run `npm run changeset` once per pull request.
- Breaking changes are explicit: they need a `major` changeset and a written migration note.
