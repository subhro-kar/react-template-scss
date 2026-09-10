import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

// 1200×630 Open Graph / Twitter card, self-contained: no source artwork
// needed. Swap the title, tagline, and colors, then run `pnpm og-image`.

const card = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#141a24"/>
  <circle cx="1010" cy="120" r="220" fill="#1c2430"/>
  <circle cx="180" cy="520" r="260" fill="#1c2430"/>
  <rect x="80" y="250" width="100" height="8" rx="4" fill="#5b8dff"/>
  <text x="80" y="360" fill="#e8ecf4" font-family="Georgia, serif" font-size="64" font-weight="700">React SCSS Template</text>
  <text x="82" y="418" fill="#9aa7b6" font-family="system-ui, sans-serif" font-size="28" letter-spacing="1">REACT 19 · TYPESCRIPT · SCSS MODULES · CLEAN ARCHITECTURE</text>
</svg>`;

mkdirSync('public/og', { recursive: true });
await sharp(Buffer.from(card)).png({ compressionLevel: 9 }).toFile('public/og/og-image.png');

console.log('Generated public/og/og-image.png');
