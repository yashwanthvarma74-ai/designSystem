import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

const here = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(here, 'src', 'components');

// One entry per component folder, so consumers can import a single component.
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [`components/${entry.name}`, path.join(componentsDir, entry.name, 'index.ts')]),
);

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.build.json', entryRoot: 'src' })],
  css: {
    modules: {
      generateScopedName: 'mrd_[name]_[local]__[hash:base64:5]',
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: { index: path.join(here, 'src', 'index.ts'), ...componentEntries },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^react-aria-components($|\/)/,
        'react/jsx-runtime',
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.tsx',
        'src/**/*.stories.tsx',
        'src/**/index.ts',
        'src/test-utils.tsx',
      ],
      reporter: ['text-summary', 'html', 'lcov'],
      thresholds: { lines: 85, statements: 85, functions: 85, branches: 75 },
    },
  },
});
