const baseUrl = "https://tpbl-stat-site.vercel.app";

const urls = [
  { path: "/", changefreq: "weekly", priority: 1 },
  { path: "/players", changefreq: "weekly", priority: 0.8 },
  { path: "/lineups", changefreq: "weekly", priority: 0.8 },
  { path: "/compare", changefreq: "weekly", priority: 0.7 },
];

function buildSitemap(): string {
  const lastmod = new Date().toISOString();
  const urlEntries = urls
    .map(
      (item) => `
  <url>
    <loc>${baseUrl}${item.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
}

export function GET(): Response {
  const xml = buildSitemap();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
