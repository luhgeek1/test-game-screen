import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(__dirname, '..');
const REFERENCE_PATH = path.join(ROOT_DIR, 'reference_screenshot.png');
const OUTPUT_DIR = path.join(ROOT_DIR, 'test-results', 'main-screen');
const MAX_DIFF_RATIO = 0.0165;

test('main screen pixel diff vs reference', async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(800);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const actualPath = path.join(OUTPUT_DIR, 'actual.png');
  const expectedPath = path.join(OUTPUT_DIR, 'expected.png');
  const diffPath = path.join(OUTPUT_DIR, 'diff.png');

  await page.screenshot({ path: actualPath });
  fs.copyFileSync(REFERENCE_PATH, expectedPath);

  const actual = PNG.sync.read(fs.readFileSync(actualPath));
  const expected = PNG.sync.read(fs.readFileSync(expectedPath));
  const { width, height } = expected;
  const diff = new PNG({ width, height });

  const differentPixels = pixelmatch(expected.data, actual.data, diff.data, width, height, {
    threshold: 0.1,
  });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const ratio = differentPixels / (width * height);
  console.log(
    `pixel diff: ${differentPixels}/${width * height} (${(ratio * 100).toFixed(2)}%)`,
  );
  console.log(`actual:   ${actualPath}`);
  console.log(`expected: ${expectedPath}`);
  console.log(`diff:     ${diffPath}`);

  expect(ratio).toBeLessThan(MAX_DIFF_RATIO);
});
