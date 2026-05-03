import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com';

function getPriority(url) {
  const decoded = decodeURIComponent(url);

  // AI Advisor → priority 0.9
  if (decoded.includes('ai-advisor')) return 0.9;

  // Car loan / installment calculators → 1.0
  if (decoded.includes('ผ่อนรถ') || decoded.includes('สินเชื่อรถ') || decoded.includes('เปรียบเทียบซื้อรถ')) {
    return 1.0;
  }

  // Insurance calculators → 1.0
  if (decoded.includes('ประกัน') && !decoded.includes('ประกันสังคม')) {
    return 1.0;
  }

  // Tax calculators → 0.9
  if (decoded.includes('ภาษี') || /vat/i.test(decoded) || decoded.includes('ประกันสังคม')) {
    return 0.9;
  }

  // Articles → 0.8
  if (decoded.includes('/บทความ/')) return 0.8;

  // Admin/API/calculator redirects excluded from sitemap
  if (decoded.includes('/admin/') || decoded.includes('/api/') || decoded.includes('/calculator/')) return null;

  // Everything else → 0.5
  return 0.5;
}

function walkDir(dir, baseUrl = '') {
  const pages = [];

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
    return pages;
  }

  for (const entry of entries) {
    // Skip hidden directories, node_modules, and asset directories
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '_astro' || entry.name === 'chunks') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const currentPath = baseUrl ? `${baseUrl}/${entry.name}` : `/${entry.name}`;

    if (entry.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const url = currentPath === '/' ? SITE_URL + '/' : SITE_URL + currentPath + '/';
        const priority = getPriority(url);
        if (priority !== null) {
          pages.push({
            url,
            priority,
            lastmod: new Date().toISOString().split('T')[0],
          });
        }
      }
      // Recursively walk subdirectories
      try {
        pages.push(...walkDir(fullPath, currentPath));
      } catch (error) {
        console.warn(`Warning: Error walking subdirectory ${fullPath}: ${error.message}`);
      }
    }
  }

  return pages;
}

function generateSitemap(pages) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Sort pages by URL for consistency
  pages.sort((a, b) => a.url.localeCompare(b.url));

  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';
  return xml;
}

function generateSitemapIndex(pages) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += `  <sitemap>\n`;
  xml += `    <loc>${SITE_URL}/sitemap-0.xml</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += '</sitemapindex>\n';
  return xml;
}

try {
  // Start crawl from dist directory, but need to handle root index separately
  const pages = [];
  
  // Add root index
  const rootIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(rootIndex)) {
    pages.push({
      url: SITE_URL + '/',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0],
    });
  }

  // Walk subdirectories
  pages.push(...walkDir(distDir, ''));

  console.log(`Found ${pages.length} pages for sitemap`);

  if (pages.length === 0) {
    console.warn('Warning: No pages found in dist directory');
  }

  // Generate sitemap-0.xml
  const sitemap = generateSitemap(pages);
  fs.writeFileSync(path.join(distDir, 'sitemap-0.xml'), sitemap);
  console.log('✓ Generated sitemap-0.xml');

  // Generate sitemap-index.xml
  const sitemapIndex = generateSitemapIndex(pages);
  fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndex);
  console.log('✓ Generated sitemap-index.xml');

  // Remove /sitemap.xml directory if it exists (created by Astro)
  const sitemapDirPath = path.join(distDir, 'sitemap.xml');
  if (fs.existsSync(sitemapDirPath)) {
    if (fs.statSync(sitemapDirPath).isDirectory()) {
      fs.rmSync(sitemapDirPath, { recursive: true, force: true });
      console.log('✓ Removed /sitemap.xml directory');
    } else {
      fs.unlinkSync(sitemapDirPath);
    }
  }

  // Create sitemap.xml as alias for sitemap-0.xml
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml (alias)');

  console.log('Sitemap generation complete!');
} catch (error) {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}
