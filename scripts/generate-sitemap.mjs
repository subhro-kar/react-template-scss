import { mkdirSync, writeFileSync } from 'node:fs';

// Generates public/sitemap.xml from the route list below. Run after adding
// routes: `pnpm sitemap`. Replace SITE_ORIGIN with the deployed origin —
// or export it as VITE_SITE_ORIGIN and read process.env here.

const SITE_ORIGIN = process.env.SITE_ORIGIN ?? 'https://YOUR.DOMAIN';

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  // Feature routes are behind VITE_ENABLE_* flags; list them when they ship.
  // { path: '/tasks', changefreq: 'weekly', priority: '0.8' },
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_ORIGIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', xml);

console.log(`Generated public/sitemap.xml with ${routes.length} URL(s) for ${SITE_ORIGIN}`);
