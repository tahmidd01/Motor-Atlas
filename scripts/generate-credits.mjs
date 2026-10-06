import { readFile, writeFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile('src/data/media.json', 'utf8'));
const safe = (value) => value.replace(/\|/g, '\\|').replace(/[\r\n]/g, ' ');
let content =
  '# Photograph attributions\n\nEvery file below is locally resized, converted to WebP, and may be displayed with cropping. Derivative media retains its source license. Refer to the linked source for the author and complete license terms.\n\n| Local exhibit file | Author | Source | License |\n| --- | --- | --- | --- |\n';
for (const photos of Object.values(manifest))
  for (const photo of photos) {
    content += `| ${safe(photo.path)} | ${safe(photo.credit)} | [Commons source](${photo.sourceUrl}) | [${safe(photo.license)}](${photo.licenseUrl}) |\n`;
  }
content +=
  '\nThe studio adaptation `public/media/hero-studio.webp` derives from Alexander Migl’s Porsche 992 GT3 RS photograph and retains [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). See [MEDIA.md](MEDIA.md) for its source and editing notice.\n';
await writeFile('docs/ATTRIBUTIONS.md', content);
console.log('Updated docs/ATTRIBUTIONS.md');
