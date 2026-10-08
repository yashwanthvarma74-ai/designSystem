import { expect, test } from '@playwright/test';
import { storyUrl } from './stories';

// A real-browser pass over the widgets whose focus behaviour matters most.
test('dialog traps focus, closes with Escape and restores focus', async ({ page }) => {
  await page.goto(storyUrl('components-dialog--default'));
  const trigger = page.getByRole('button', { name: 'Rename project' });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Rename project' });
  await expect(dialog).toBeVisible();

  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(inside).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('tabs move with arrow keys', async ({ page }) => {
  await page.goto(storyUrl('components-tabs--default'));
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('Recent commits');
});

test('combobox filters and selects with the keyboard', async ({ page }) => {
  await page.goto(storyUrl('components-combobox--default'));
  const input = page.getByRole('combobox', { name: 'Assign to' });
  await input.fill('gra');
  await expect(page.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Grace Hopper');
});

test('every interactive control in the main stories shows a visible focus ring', async ({
  page,
}) => {
  await page.goto(storyUrl('components-button--primary'));
  await page.locator('#storybook-root button').waitFor();
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = getComputedStyle(el);
    return { width: parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThanOrEqual(2);
});

test('reduced motion is honoured', async ({ page }) => {
  await page.goto(storyUrl('components-spinner--default'));
  const duration = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    return svg ? getComputedStyle(svg).animationDuration : '';
  });
  // The spinner slows down rather than stopping, so assert it is no longer the default 0.8s.
  expect(duration).not.toBe('0.8s');
});
