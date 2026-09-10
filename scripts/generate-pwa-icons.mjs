import sharp from 'sharp';

// Replace this mark with your project's logo, then run `pnpm icons`.
const mark = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#141a24"/>
  <text x="256" y="340" font-family="Georgia, serif" font-size="220" font-weight="700" fill="#e8ecf4" text-anchor="middle">R</text>
</svg>`;

const maskable = mark.replace('rx="112"', 'rx="0"').replace('font-size="220"', 'font-size="190"').replace('y="340"', 'y="320"');

await Promise.all([
  sharp(Buffer.from(mark)).resize(192, 192).png().toFile('public/pwa-192x192.png'),
  sharp(Buffer.from(mark)).resize(512, 512).png().toFile('public/pwa-512x512.png'),
  sharp(Buffer.from(maskable)).resize(512, 512).png().toFile('public/pwa-maskable-512x512.png'),
  sharp(Buffer.from(mark)).resize(180, 180).png().toFile('public/apple-touch-icon.png'),
]);

console.log('Generated PWA icons in public/.');