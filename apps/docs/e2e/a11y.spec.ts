import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { loadStories, storyUrl, themes } from './stories';

// Every story, in every theme, must come back clean from axe. This is the "0 violations" gate.
const stories = await loadStories();

for (const theme of themes) {
  test.describe(`axe in ${theme} theme`, () => {
    for (const story of stories) {
      test(`${story.title} / ${story.name}`, async ({ page }) => {
        await page.goto(storyUrl(story.id, theme));
        await page.locator('#storybook-root').waitFor({ state: 'attached' });
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
          .include('body')
          .disableRules(['region'])
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();

        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      });
    }
  });
}
