import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

// Branding for the Storybook sidebar: our name instead of the default logo.
const meridian = create({
  base: 'light',
  brandTitle: 'Meridian Design System',
  brandUrl: './',
  brandTarget: '_self',
  colorPrimary: '#4f46e5',
  colorSecondary: '#4f46e5',
  fontBase: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});

addons.setConfig({ theme: meridian });
