import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.tsx',
    '../../../packages/react/src/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      // GitHub-style tables and task lists in the MDX pages
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    css: {
      ...viteConfig.css,
      modules: { generateScopedName: 'mrd_[name]_[local]__[hash:base64:5]' },
    },
  }),
};

export default config;
