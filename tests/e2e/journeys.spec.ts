import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('search, URL filters, and semantic detail refresh', async ({ page }) => {
  await page.goto('/cars');
  await page.getByRole('textbox', { name: 'Search the vehicle archive' }).fill('Japanese AWD');
  await expect(page.locator('.car-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  if (test.info().project.name === 'mobile')
    await page.getByRole('button', { name: /Filters/ }).click();
  await page.getByLabel('Manufacturers', { exact: true }).selectOption('porsche');
  await expect(page.locator('.car-card')).toHaveCount(4);
  await page.reload();
  await expect(page.locator('.car-card')).toHaveCount(4);
  await page.goto('/cars/porsche/911/992/gt3-rs');
  await expect(page.locator('h1')).toContainText('GT3 RS');
  await page.reload();
  await expect(page.locator('h1')).toContainText('GT3 RS');
});
test('favorites persist and can be removed', async ({ page }) => {
  await page.goto('/cars/porsche/911/992/gt3-rs');
  await page
    .locator('.exhibit-action-bar')
    .getByRole('button', { name: 'Save to collection', exact: true })
    .click();
  await page.goto('/collection');
  await expect(page.locator('.car-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.car-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remove from collection', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Every collection starts somewhere.' }),
  ).toBeVisible();
});
test('comparison adds, persists, changes units, and removes cars', async ({ page }) => {
  await page.goto('/compare');
  await page.getByRole('button', { name: 'Compare three icons' }).click();
  await expect(page.locator('.compare-car')).toHaveCount(3);
  await page.reload();
  await expect(page.locator('.compare-car')).toHaveCount(3);
  await page.getByLabel('Power unit').selectOption('kW');
  await expect(page.locator('.compare-table').getByText('386 kW', { exact: true })).toBeVisible();
  await page.getByLabel('Show differences only').check();
  await page.getByRole('button', { name: 'Remove Ferrari F40 Berlinetta from comparison' }).click();
  await expect(page.locator('.compare-car')).toHaveCount(2);
});
test('global command search supports keyboard selection and dismissal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search the atlas' }).click();
  await page.getByRole('combobox').fill('R34');
  await page.getByRole('combobox').press('ArrowDown');
  await page.getByRole('combobox').press('ArrowUp');
  await page.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/r34/);
  await page.getByRole('button', { name: 'Search the atlas' }).click();
  await page.getByRole('combobox').press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('gallery fullscreen, zoom, keyboard and focus restoration', async ({ page }) => {
  await page.goto('/cars/porsche/911/992/gt3-rs');
  await page.getByRole('button', { name: 'View fullscreen' }).click();
  await expect(page.getByRole('dialog', { name: 'Vehicle photo gallery' })).toBeVisible();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.lightbox-image')).toHaveClass(/zoomed/);
  await page.getByRole('dialog').press('ArrowRight');
  await page.getByRole('button', { name: 'Close gallery' }).click();
  await expect(page.getByRole('button', { name: 'View fullscreen' })).toBeFocused();
});
test('engineering study renders and provides accessible controls', async ({ page }) => {
  await page.goto('/cars/porsche/911/992/gt3-rs');
  await page.getByRole('button', { name: 'Open engineering study' }).click();
  await expect(page.locator('.three-canvas canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Orbit right', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Start auto rotation' }).click();
  await expect(page.getByRole('button', { name: 'Pause rotation' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.getByRole('button', { name: 'Close interactive exhibit' }).click();
  await expect(page.locator('.three-canvas canvas')).toHaveCount(0);
});
test('image and WebGL failures leave the exhibit usable', async ({ page }) => {
  await page.route('**/media/porsche-911-992-gt3-rs.webp', (route) => route.abort());
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto('/cars/porsche/911/992/gt3-rs');
  await expect(page.locator('.vehicle-hero .image-fallback')).toBeVisible();
  await page.getByRole('button', { name: 'Open engineering study' }).click();
  await expect(
    page.getByText('The interactive exhibit needs WebGL.', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Engineering, by the numbers.' })).toBeVisible();
});
test('all primary routes render without runtime errors or page overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of [
    '/',
    '/cars',
    '/brands',
    '/brands/porsche',
    '/models/porsche/911',
    '/models/porsche/911/992',
    '/countries',
    '/countries/japan',
    '/collections',
    '/collections/90s-icons',
    '/collection',
    '/compare',
    '/timeline',
    '/technology',
    '/technology/electric',
    '/glossary',
    '/data',
    '/credits',
    '/wrong-road',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, `${route} overflows`).toBe(false);
  }
  expect(errors).toEqual([]);
});
test('mobile navigation and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  if (test.info().project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Manufacturers' })
      .click();
    await expect(page).toHaveURL('/brands');
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
  } else {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Manufacturers' })
      .click();
    await expect(page).toHaveURL('/brands');
  }
});
test('critical views meet automated accessibility checks', async ({ page }) => {
  // Analyze settled content, without catching the middle of intentional entrance fades.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of [
    '/',
    '/cars',
    '/cars/porsche/911/992/gt3-rs',
    '/compare?cars=porsche-911-992-gt3-rs,ferrari-f40',
    '/brands',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations,
      `${route}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});
