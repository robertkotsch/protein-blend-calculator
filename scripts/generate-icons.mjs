import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const standard = readFileSync(join(__dirname, 'icon-source.svg'));
const maskable = readFileSync(join(__dirname, 'icon-source-maskable.svg'));

const targets = [
  { svg: standard, size: 192, out: 'pwa-192x192.png' },
  { svg: standard, size: 512, out: 'pwa-512x512.png' },
  { svg: maskable, size: 512, out: 'pwa-maskable-512x512.png' },
  { svg: standard, size: 180, out: 'apple-touch-icon.png' },
];

for (const { svg, size, out } of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(join(publicDir, out));
  console.log(`generated ${out} (${size}x${size})`);
}
