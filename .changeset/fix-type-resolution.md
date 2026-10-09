---
'@yashwanthvarma74/react': patch
---

Fix type resolution for consumers: each component's JavaScript is now built to `components/<Name>/index.js`, next to its `index.d.ts`. Before, TypeScript with `moduleResolution: "bundler"` found `components/Input.js` first, saw no types, and typed every component as `any`.
