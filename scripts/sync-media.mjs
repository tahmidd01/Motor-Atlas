import { access, readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

// Exact, visually reviewed Commons filenames. Never substitute arbitrary search results.
const sources = JSON.parse(await readFile('scripts/media-sources.json', 'utf8'));
const manifest = JSON.parse(await readFile('src/data/media.json', 'utf8'));
const strip = (value) =>
  (value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim();
const headers = {
  'User-Agent': 'MotorAtlasPortfolio/1.0 (local educational archive; attribution retained)',
};
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
    if (response.ok) return response;
    if (response.status === 429 || response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
      continue;
    }
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  throw new Error('Upstream unavailable');
}
await mkdir('public/media', { recursive: true });
let failures = 0;
for (const source of sources) {
  try {
    const existing = manifest[source.vehicleId]?.find((photo) => photo.id === source.id);
    if (existing && !process.argv.includes('--refresh')) {
      try {
        await access(`public${source.path}`);
        await access(`public${source.thumbnail}`);
        console.log(`Retained ${source.id}`);
        continue;
      } catch {
        /* recover missing local assets */
      }
    }
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: source.file,
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: '1600',
    });
    const result = await (await get(`https://commons.wikimedia.org/w/api.php?${params}`)).json();
    const info = Object.values(result.query?.pages ?? {})[0]?.imageinfo?.[0];
    if (!info?.thumburl) throw new Error(`Missing Commons file: ${source.file}`);
    const meta = info.extmetadata;
    const license = strip(meta.LicenseShortName?.value);
    if (!/CC BY|CC0|Public domain/.test(license))
      throw new Error(`Unsupported license: ${license}`);
    const buffer = Buffer.from(await (await get(info.thumburl)).arrayBuffer());
    await sharp(buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(`public${source.path}`);
    await sharp(buffer)
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`public${source.thumbnail}`);
    const photo = {
      id: source.id,
      path: source.path,
      thumbnail: source.thumbnail,
      alt: strip(meta.ImageDescription?.value) || source.file.replace('File:', ''),
      caption: source.caption,
      credit: strip(meta.Artist?.value) || 'Wikimedia Commons contributor',
      sourceUrl: info.descriptionurl,
      license,
      licenseUrl: meta.LicenseUrl?.value ?? 'https://creativecommons.org/publicdomain/mark/1.0/',
      type: source.type,
      changes:
        'Resized and converted to WebP; displayed with cropping. Adaptation retains its original license.',
    };
    manifest[source.vehicleId] = [
      ...(manifest[source.vehicleId] ?? []).filter((item) => item.id !== photo.id),
      photo,
    ];
    await writeFile('src/data/media.json', `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Saved ${source.file} (${license})`);
  } catch (error) {
    failures++;
    console.error(error.message);
  }
}
if (failures) process.exitCode = 1;
console.log(
  `${sources.length} reviewed photographs; ${failures} failures. Studio adaptation is maintained separately.`,
);
