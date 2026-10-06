import { chromium, devices } from '@playwright/test';
/* global document -- this identifier is used only inside Playwright's browser callback. */
import { mkdir } from 'node:fs/promises';

await mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const detail = '/cars/porsche/911/992/gt3-rs';
const compare = '/compare?cars=porsche-911-992-gt3-rs,ferrari-f40,nissan-skyline-gtr-r34';
for (const [device, options] of [
  ['desktop', { viewport: { width: 1440, height: 1000 } }],
  ['mobile', devices['Pixel 7']],
]) {
  const context = await browser.newContext({
    ...options,
    reducedMotion: 'reduce',
    baseURL: 'http://127.0.0.1:5173',
  });
  const page = await context.newPage();
  const routes =
    device === 'desktop'
      ? [
          ['home', '/'],
          ['explore', '/cars'],
          ['brand', '/brands/porsche'],
          ['generation', '/models/porsche/911/992'],
          ['exhibit', detail],
          ['compare', compare],
          ['timeline', '/timeline'],
          ['technology', '/technology'],
          ['glossary', '/glossary'],
          ['404', '/wrong-road'],
        ]
      : [
          ['home', '/'],
          ['explore', '/cars'],
          ['exhibit', detail],
          ['compare', compare],
        ];
  for (const [name, route] of routes) {
    await page.goto(route);
    await page.locator('h1').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images]
          .filter((image) => image.loading !== 'lazy')
          .map((image) => image.decode().catch(() => {})),
      );
    });
    await page.screenshot({ path: `docs/screenshots/${device}-${name}.png` });
    console.log(`Captured ${device}-${name}`);
  }
  if (device === 'desktop') {
    await page.goto(detail);
    await page
      .locator('.exhibit-action-bar')
      .getByRole('button', { name: 'Save to collection', exact: true })
      .click();
    await page.goto('/collection');
    await page.locator('.car-card').waitFor();
    await page.screenshot({ path: 'docs/screenshots/desktop-collection.png' });
    await page.goto(detail);
    await page.getByRole('button', { name: 'Open engineering study' }).click();
    await page.locator('.three-canvas canvas').waitFor();
    await page
      .locator('.interactive-section')
      .screenshot({ path: 'docs/screenshots/desktop-workshop.png' });
  }
  await context.close();
}
await browser.close();
