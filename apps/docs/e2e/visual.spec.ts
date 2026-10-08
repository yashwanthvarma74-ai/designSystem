import { expect, test, type Page } from '@playwright/test';
import { loadStories, storyUrl, themes } from './stories';

// Fonts, animation and data are pinned so a diff always means a real visual change.
const stories = (await loadStories()).filter((s) => !s.tags?.includes('skip-visual'));

async function freeze(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html { font-family: Arial, Helvetica, sans-serif !important; }
      :root { --mrd-font-family-sans: Arial, Helvetica, sans-serif; --mrd-font-family-mono: 'Courier New', monospace; }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of themes) {
  test.describe(`visual / ${theme}`, () => {
    for (const story of stories) {
      test(`${story.id}`, async ({ page }) => {
        await page.goto(storyUrl(story.id, theme));
        await page.locator('#storybook-root').waitFor({ state: 'attached' });
        await page.waitForLoadState('networkidle');
        await freeze(page);
        await expect(page).toHaveScreenshot(`${theme}/${story.id}.png`, { fullPage: false });
      });
    }
  });
}
