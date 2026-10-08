// Prepends the token variables to the component styles so one import is enough.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tokensCss = path.resolve(here, '../../tokens/dist/tokens.css');
const stylesCss = path.resolve(here, '../dist/styles.css');

const [tokens, components] = await Promise.all([
  readFile(tokensCss, 'utf8'),
  readFile(stylesCss, 'utf8'),
]);

await writeFile(stylesCss, `${tokens}\n${components}`);
console.log('styles.css: tokens + components bundled');
