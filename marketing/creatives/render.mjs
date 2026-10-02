import { chromium } from 'playwright';
import { mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
await mkdir(path.join(root, 'out'), { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const file of (await readdir(root)).filter(f => f.endsWith('.html'))) {
    for (const [ratio, height] of [['45', 1350], ['916', 1920]]) {
      const page = await browser.newPage({ viewport: { width: 1080, height }, deviceScaleFactor: 1 });
      const external = [];
      page.on('request', r => { if (/^https?:/.test(r.url())) external.push(r.url()); });
      await page.goto(`${pathToFileURL(path.join(root, file))}?ratio=${ratio}`);
      await page.evaluate(() => document.fonts.ready);
      const bounds = await page.locator('.creative').boundingBox();
      if (bounds.width !== 1080 || bounds.height !== height || external.length) throw new Error(`Invalid creative: ${file} ${ratio}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 1080 || [...document.querySelectorAll('h1,p,.cta,.brand')].some(e => { const r = e.getBoundingClientRect(); return r.left < 0 || r.right > 1080 || r.bottom > innerHeight; }));
      if (overflow) throw new Error(`Text overflow: ${file} ${ratio}`);
      const buffer = await page.screenshot({ path: path.join(root, 'out', `${file.replace('.html', '')}-${ratio}.png`) });
      if (buffer.readUInt32BE(16) !== 1080 || buffer.readUInt32BE(20) !== height) throw new Error('Wrong PNG dimensions');
      console.log(`${file} ${ratio}: 1080x${height}, no external requests, text within canvas`);
      await page.close();
    }
  }
} finally { await browser.close(); }
