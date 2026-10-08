import type { Decorator, Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { useEffect, type ReactNode } from 'react';
import '../../../packages/tokens/dist/tokens.css';
import './preview.css';

const themes = ['light', 'dark', 'high-contrast'] as const;

// Docs pages are not wrapped by story decorators, so listen for the toolbar choice directly
// and keep the page theme in sync there too.
interface GlobalsPayload {
  globals?: { theme?: string };
  userGlobals?: { theme?: string };
}
const applyTheme = (payload: GlobalsPayload) => {
  const theme = payload.userGlobals?.theme ?? payload.globals?.theme;
  if (theme) document.documentElement.setAttribute('data-theme', theme);
};
if (typeof window !== 'undefined') {
  const channel = addons.getChannel();
  channel.on(GLOBALS_UPDATED, applyTheme);
  channel.on(SET_GLOBALS, applyTheme);
}

function ThemeFrame({ theme, children }: { theme: string; children: ReactNode }) {
  // Set during render too, so the very first paint (and screenshots) already use the right theme.
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return <>{children}</>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeFrame theme={(context.globals.theme as string) ?? 'light'}>
    <Story />
  </ThemeFrame>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: themes.map((value) => ({ value, title: value.replace('-', ' ') })),
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'centered',
    // Our own Theme control drives the background, so Storybook's built-in one would only fight it.
    backgrounds: { disabled: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error', config: { rules: [{ id: 'region', enabled: false }] } },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting started',
          'Foundations',
          'Components',
          'Patterns',
          'Guides',
        ],
      },
    },
    docs: { toc: true },
  },
  tags: ['autodocs'],
};

export default preview;
