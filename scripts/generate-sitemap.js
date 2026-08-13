import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://findcalculator.online';
const CALCULATORS_DIR = path.join(__dirname, '../src/data/calculators');
const TAXONOMY_PATH = path.join(__dirname, '../src/data/taxonomy.json');
const OUTPUT_SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

function generateSitemap() {
  console.log('🔄 Generando sitemap.xml completo para findcalculator.online...');

  let taxonomyCategories = [];
  try {
    const taxonomyData = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf-8'));
    taxonomyCategories = taxonomyData.categories || [];
  } catch (err) {
    console.error('⚠️ Error leyendo taxonomy.json:', err.message);
  }

  const calculatorFiles = fs.readdirSync(CALCULATORS_DIR).filter((file) => file.endsWith('.json'));

  const urls = [];

  // 1. Página de inicio
  urls.push({
    loc: `${DOMAIN}/`,
    priority: '1.00',
    changefreq: 'daily',
  });

  // 2. Páginas de categorías
  taxonomyCategories.forEach((cat) => {
    urls.push({
      loc: `${DOMAIN}/${cat.slug}`,
      priority: '0.90',
      changefreq: 'weekly',
    });
  });

  // 3. URLs de las 330+ Calculadoras (Sin omitir ninguna)
  let count = 0;
  calculatorFiles.forEach((file) => {
    try {
      const filePath = path.join(CALCULATORS_DIR, file);
      const schema = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (schema && schema.meta && schema.meta.slug) {
        const categorySlug = schema.meta.category || 'herramientas';
        const calcSlug = schema.meta.slug;
        const calcUrl = `${DOMAIN}/${categorySlug}/${calcSlug}`;

        urls.push({
          loc: calcUrl,
          priority: '0.80',
          changefreq: 'monthly',
        });
        count++;
      }
    } catch (err) {
      console.error(`⚠️ Error leyendo esquema ${file}:`, err.message);
    }
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <priority>${item.priority}</priority>
    <changefreq>${item.changefreq}</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(OUTPUT_SITEMAP_PATH, xmlContent, 'utf-8');
  console.log(`✅ sitemap.xml generado exitosamente con ${count} calculadoras catalogadas (${urls.length} URLs totales).`);
}

generateSitemap();
