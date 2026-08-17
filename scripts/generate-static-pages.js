import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, '..');

const DOMAIN = 'https://findcalculator.online';
const CALCULATORS_DIR = path.join(projectDir, 'src/data/calculators');
const TAXONOMY_PATH = path.join(projectDir, 'src/data/taxonomy.json');
const DIST_DIR = path.join(projectDir, 'dist');
const CSS_PATH = path.join(projectDir, 'src/index.css');

// Leer CSS global para embeber estilos consistentes en todas las páginas estáticas
const globalCSS = fs.existsSync(CSS_PATH) ? fs.readFileSync(CSS_PATH, 'utf-8') : '';

// Leer taxonomía
const taxonomyData = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf-8'));
const categories = taxonomyData.categories || [];

// Leer todos los archivos JSON de calculadoras
const calculatorFiles = fs.readdirSync(CALCULATORS_DIR).filter((f) => f.endsWith('.json'));
const calculators = calculatorFiles.map((file) => {
  try {
    const raw = fs.readFileSync(path.join(CALCULATORS_DIR, file), 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error leyendo ${file}:`, e.message);
    return null;
  }
}).filter(Boolean);

console.log(`📦 Procesando ${calculators.length} calculadoras para generación estática SSG...`);

// Extraer el bundle de JS de dist/index.html para permitir la interactividad React
let reactScriptTag = '';
if (fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  const distHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  const scriptMatch = distHtml.match(/<script type="module" crossorigin>[\s\S]*?<\/script>/i);
  if (scriptMatch) {
    reactScriptTag = scriptMatch[0];
  }
}

// Helper para escapar HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generar FAQ Schema y contenido HTML a partir del esquema
function generateFaqForCalc(calc) {
  const faqs = [];
  const title = calc.meta.title_en || calc.meta.title;
  const cat = calc.meta.category || 'General';

  // Pregunta 1: ¿Qué es y para qué sirve?
  faqs.push({
    q: `What is the ${title} and how does it work?`,
    a: calc.content.longDescription_en || calc.content.longDescription || calc.content.shortDescription_en || calc.content.shortDescription
  });

  // Pregunta 2: ¿Cómo se utiliza la calculadora?
  if (calc.content.howToUse_en && calc.content.howToUse_en.length > 0) {
    faqs.push({
      q: `How do I use this ${title}?`,
      a: calc.content.howToUse_en.join(' ')
    });
  } else if (calc.content.howToUse && calc.content.howToUse.length > 0) {
    faqs.push({
      q: `How do I use this ${title}?`,
      a: calc.content.howToUse.join(' ')
    });
  }

  // Pregunta 3: Metodología y fórmula
  if (calc.content.methodology_en || calc.content.methodology) {
    faqs.push({
      q: `What mathematical formula is used in this calculation?`,
      a: calc.content.methodology_en || calc.content.methodology
    });
  }

  // Pregunta 4: ¿Es gratuita y segura?
  faqs.push({
    q: `Is the ${title} on FindCalculator free to use?`,
    a: `Yes, all 330+ interactive tools on FindCalculator.online are 100% free, run directly in your browser without registration, and do not store your private calculation data.`
  });

  return faqs;
}

// Generar página estática para una calculadora
function generateCalculatorPage(calc) {
  const title = calc.meta.title_en || calc.meta.title;
  const titleEs = calc.meta.title;
  const shortDesc = calc.content.shortDescription_en || calc.content.shortDescription;
  const longDesc = calc.content.longDescription_en || calc.content.longDescription || shortDesc;
  const category = calc.meta.category || 'tools';
  const subcategory = calc.meta.subcategory || 'general';
  const slug = calc.meta.slug || calc.meta.id;
  const canonicalUrl = `${DOMAIN}/${category}/${slug}`;

  const faqs = generateFaqForCalc(calc);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${title} — FindCalculator`,
    "url": canonicalUrl,
    "description": shortDesc,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // Renderizar campos de entrada en HTML estático
  const inputsHtml = (calc.inputs || []).map(input => {
    const label = input.label_en || input.label;
    const defaultVal = input.default !== undefined ? input.default : '';
    const unit = input.unit || (input.units && input.units[0]?.label) || '';
    const help = input.help_en || input.help || '';

    return `
      <div style="margin-bottom: 16px;">
        <label class="input-label" style="display:block; font-weight:600; font-size:0.875rem; margin-bottom:6px;">
          ${escapeHtml(label)} ${unit ? `<span style="color:var(--text-secondary); font-size:0.8125rem;">(${escapeHtml(unit)})</span>` : ''}
        </label>
        <div style="display:flex; gap:8px;">
          <input type="${input.type === 'currency' || input.type === 'slider' ? 'number' : (input.type || 'number')}"
                 value="${escapeHtml(defaultVal)}"
                 class="input-field"
                 style="flex:1;"
                 placeholder="${escapeHtml(label)}" />
        </div>
        ${help ? `<p style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">${escapeHtml(help)}</p>` : ''}
      </div>
    `;
  }).join('');

  // Renderizar secciones de la guía educativa en HTML estático
  const guideHtml = (calc.guideSections || []).map(section => {
    const sectionTitle = section.title_en || section.title || section.title_es || 'Information';
    const sectionContent = section.content_html_en || section.content_html || '';

    return `
      <section style="margin-bottom: 24px; padding: 20px; background-color: var(--surface-alt); border-radius: var(--radius-card); border: 1px solid var(--border);">
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; display:flex; align-items:center; gap:8px;">
          <span>${section.icon || '📘'}</span>
          <span>${escapeHtml(sectionTitle)}</span>
        </h3>
        <div style="color: var(--text-secondary); line-height: 1.7; font-size: 0.9375rem;">
          ${sectionContent}
        </div>
      </section>
    `;
  }).join('');

  // Renderizar FAQ en HTML estático
  const faqHtml = faqs.map((f, i) => `
    <details style="margin-bottom: 12px; padding: 14px 16px; background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-control);">
      <summary style="font-weight: 600; cursor: pointer; color: var(--text-primary); font-size: 1rem;">
        ${escapeHtml(f.q)}
      </summary>
      <div style="margin-top: 10px; color: var(--text-secondary); font-size: 0.9375rem; line-height: 1.6;">
        <p>${escapeHtml(f.a)}</p>
      </div>
    </details>
  `).join('');

  // Calculadoras relacionadas de la misma categoría
  const relatedCalcs = calculators
    .filter(c => c.meta.category === category && c.meta.id !== calc.meta.id)
    .slice(0, 6);

  const relatedHtml = relatedCalcs.map(c => `
    <a href="/${c.meta.category}/${c.meta.slug || c.meta.id}"
       style="text-decoration:none; display:block; padding:12px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-control); transition:border-color 0.15s;">
      <div style="font-weight:600; font-size:0.875rem; color:var(--text-primary); margin-bottom:4px;">${escapeHtml(c.meta.title_en || c.meta.title)}</div>
      <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">${escapeHtml(c.content.shortDescription_en || c.content.shortDescription)}</div>
    </a>
  `).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} — FindCalculator</title>
    <meta name="description" content="${escapeHtml(shortDesc)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="google-site-verification" content="g3MBggA4tcgyFmGhMW-bfWP2Np_epWi6XeH5cMSXiJg" />
    <meta name="google-adsense-account" content="ca-pub-1369999948195621" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1369999948195621" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <script type="application/ld+json">
${JSON.stringify(softwareSchema, null, 2)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
    </script>
    <style>
${globalCSS}
    </style>
  </head>
  <body>
    <div id="root">
      <!-- HEADER GLOBAL ESTÁTICO -->
      <header style="position:sticky; top:0; z-index:50; background-color:var(--surface); border-bottom:1px solid var(--border);">
        <div style="maxWidth:1200px; margin:0 auto; padding:0 16px; height:64px; display:flex; alignItems:center; justifyContent:space-between; gap:16px;">
          <div style="display:flex; alignItems:center; gap:16px;">
            <a href="/" style="display:flex; alignItems:center; gap:8px; text-decoration:none;">
              <div style="width:36px; height:36px; border-radius:8px; background-color:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.25rem;">
                🧮
              </div>
              <div>
                <span style="font-weight:700; font-size:1.25rem; letter-spacing:-0.02em; color:var(--text-primary);">
                  Find<span style="color:var(--primary);">Calculator</span>
                </span>
              </div>
            </a>
            <a href="/" class="btn-secondary desktop-only" style="gap:6px; height:36px; font-size:0.8125rem; text-decoration:none;">
              <span>🏠 Home</span>
            </a>
            <a href="/${category}" class="btn-secondary desktop-only" style="gap:6px; height:36px; font-size:0.8125rem; text-decoration:none;">
              <span>📁 ${escapeHtml(category.toUpperCase())}</span>
            </a>
          </div>
          <div style="display:flex; gap:10px;">
            <a href="/" class="btn-primary" style="height:36px; font-size:0.8125rem; text-decoration:none; padding:0 14px;">
              330+ Calculators
            </a>
          </div>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL DE LA CALCULADORA -->
      <main style="max-width:1200px; margin:0 auto; padding:24px 16px;">
        <!-- Breadcrumbs -->
        <nav aria-label="breadcrumb" style="margin-bottom:16px; font-size:0.8125rem; color:var(--text-secondary);">
          <a href="/" style="color:var(--primary); text-decoration:none;">Home</a> &gt; 
          <a href="/${category}" style="color:var(--primary); text-decoration:none;">${escapeHtml(category)}</a> &gt; 
          <span>${escapeHtml(title)}</span>
        </nav>

        <!-- Encabezado de la Herramienta -->
        <div style="margin-bottom: 24px;">
          <div style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
            <span class="badge badge-neutral">${escapeHtml(category)}</span>
            <span class="badge badge-neutral">${escapeHtml(subcategory)}</span>
          </div>
          <h1 style="font-size:2rem; font-weight:800; letter-spacing:-0.02em; margin-bottom:8px; color:var(--text-primary);">
            ${escapeHtml(title)}
          </h1>
          <p style="font-size:1.0625rem; color:var(--text-secondary); max-width:800px; line-height:1.5;">
            ${escapeHtml(longDesc)}
          </p>
        </div>

        <!-- Anuncio Superior AdSense -->
        <div style="margin: 24px 0; text-align: center;">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-1369999948195621"
               data-ad-slot="9916108334"
               data-ad-format="autorelaxed"></ins>
        </div>

        <!-- Grid de Cálculo Interactivo -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; align-items:start; margin-bottom:32px;">
          <div class="card">
            <h2 style="font-size:1.125rem; font-weight:700; margin-bottom:16px; color:var(--text-primary);">
              Input Parameters
            </h2>
            ${inputsHtml}
          </div>

          <div class="card" style="background-color:var(--surface-alt); border-color:var(--primary);">
            <h2 style="font-size:1.125rem; font-weight:700; margin-bottom:16px; color:var(--text-primary);">
              Instant Calculation Result
            </h2>
            <div style="padding:20px; background-color:var(--surface); border-radius:var(--radius-control); border:1px solid var(--border); text-align:center; margin-bottom:16px;">
              <span style="font-size:0.8125rem; color:var(--text-secondary); text-transform:uppercase; font-weight:600; letter-spacing:0.05em;">Estimated Output</span>
              <div style="font-size:2rem; font-weight:800; color:var(--primary); margin:8px 0;" class="tabular-nums">
                Active in Real-Time
              </div>
              <p style="font-size:0.8125rem; color:var(--text-secondary);">
                Adjust values on the left to calculate live results.
              </p>
            </div>
            ${calc.content.methodology_en || calc.content.methodology ? `
              <div style="font-size:0.8125rem; color:var(--text-secondary); line-height:1.5;">
                <strong>Formula:</strong> ${escapeHtml(calc.content.methodology_en || calc.content.methodology)}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Anuncio Intermedio AdSense (In-Article) -->
        <div style="margin: 28px 0; text-align: center;">
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-1369999948195621"
               data-ad-slot="2364921374"></ins>
        </div>

        <!-- GUÍA EDUCATIVA EN HTML ESTÁTICO PURO -->
        <section style="margin-top: 40px; margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; color: var(--text-primary);">
            In-Depth Guide & Mathematical Methodology
          </h2>
          ${guideHtml}
        </section>

        <!-- SECCIÓN DE PREGUNTAS FRECUENTES (FAQ) -->
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; color: var(--text-primary);">
            Frequently Asked Questions (FAQ)
          </h2>
          ${faqHtml}
        </section>

        <!-- CALCULADORAS RELACIONADAS -->
        ${relatedCalcs.length > 0 ? `
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary);">
              More Free Calculators in ${escapeHtml(category.toUpperCase())}
            </h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
              ${relatedHtml}
            </div>
          </section>
        ` : ''}
      </main>

      <!-- FOOTER GLOBAL -->
      <footer style="background-color:var(--surface); border-top:1px solid var(--border); padding:40px 16px 24px; margin-top:64px;">
        <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; font-size:0.8125rem; color:var(--text-secondary);">
          <div>
            © 2026 <strong>FindCalculator — findcalculator.online</strong>. All rights reserved.
          </div>
          <div style="display:flex; gap:20px;">
            <a href="/privacy.html" style="color:var(--primary); text-decoration:underline; font-weight:600;">Privacy Policy</a>
            <a href="/terms.html" style="color:var(--primary); text-decoration:underline; font-weight:600;">Terms of Use</a>
            <a href="/about.html" style="color:var(--primary); text-decoration:underline; font-weight:600;">About Us</a>
          </div>
        </div>
      </footer>
    </div>

    <!-- SCRIPT DE HIDRATACIÓN REACT / INTERACTIVIDAD EN TIEMPO REAL -->
    ${reactScriptTag}
  </body>
</html>`;
}

// Generar página estática para una categoría
function generateCategoryPage(cat) {
  const catName = cat.name_en || cat.name;
  const catDesc = cat.description_en || cat.description;
  const catCalculators = calculators.filter(c => c.meta.category === cat.id);
  const canonicalUrl = `${DOMAIN}/${cat.slug}`;

  const calcCardsHtml = catCalculators.map(c => `
    <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
          <span class="badge badge-neutral">${escapeHtml(c.meta.subcategory || cat.id)}</span>
          <span class="badge badge-success">Free Online</span>
        </div>
        <h3 style="font-size:1.125rem; font-weight:700; margin-bottom:6px;">
          <a href="/${c.meta.category}/${c.meta.slug || c.meta.id}" style="color:var(--text-primary); text-decoration:none;">
            ${escapeHtml(c.meta.title_en || c.meta.title)}
          </a>
        </h3>
        <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.5; margin-bottom:16px;">
          ${escapeHtml(c.content.shortDescription_en || c.content.shortDescription)}
        </p>
      </div>
      <a href="/${c.meta.category}/${c.meta.slug || c.meta.id}" class="btn-secondary" style="width:100%; justify-content:center; text-decoration:none; height:38px; font-size:0.8125rem;">
        Open Calculator →
      </a>
    </div>
  `).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(catName)} Calculators — FindCalculator</title>
    <meta name="description" content="${escapeHtml(catDesc)} — Free online precision calculators on FindCalculator.online" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="google-site-verification" content="g3MBggA4tcgyFmGhMW-bfWP2Np_epWi6XeH5cMSXiJg" />
    <meta name="google-adsense-account" content="ca-pub-1369999948195621" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1369999948195621" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
${globalCSS}
    </style>
  </head>
  <body>
    <div id="root">
      <header style="position:sticky; top:0; z-index:50; background-color:var(--surface); border-bottom:1px solid var(--border);">
        <div style="max-width:1200px; margin:0 auto; padding:0 16px; height:64px; display:flex; align-items:center; justify-content:space-between;">
          <a href="/" style="display:flex; align-items:center; gap:8px; text-decoration:none;">
            <div style="width:36px; height:36px; border-radius:8px; background-color:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700;">
              🧮
            </div>
            <span style="font-weight:700; font-size:1.25rem; color:var(--text-primary);">
              Find<span style="color:var(--primary);">Calculator</span>
            </span>
          </a>
          <a href="/" class="btn-secondary" style="text-decoration:none;">← Back to Home</a>
        </div>
      </header>

      <main style="max-width:1200px; margin:0 auto; padding:32px 16px;">
        <div class="card" style="background-color:var(--surface-alt); border-left:4px solid var(--primary); margin-bottom:32px; padding:32px 24px;">
          <span class="badge badge-neutral" style="margin-bottom:8px;">${catCalculators.length} Free Interactive Tools</span>
          <h1 style="font-size:2.25rem; font-weight:800; margin-bottom:8px; color:var(--text-primary);">
            ${escapeHtml(catName)} Calculators
          </h1>
          <p style="font-size:1.0625rem; color:var(--text-secondary); max-width:800px; line-height:1.5;">
            ${escapeHtml(catDesc)}
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
          ${calcCardsHtml}
        </div>
      </main>

      <footer style="background-color:var(--surface); border-top:1px solid var(--border); padding:40px 16px 24px; margin-top:64px;">
        <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; font-size:0.8125rem; color:var(--text-secondary);">
          <div>© 2026 <strong>FindCalculator — findcalculator.online</strong>. All rights reserved.</div>
          <div style="display:flex; gap:20px;">
            <a href="/privacy.html" style="color:var(--primary); text-decoration:underline;">Privacy Policy</a>
            <a href="/terms.html" style="color:var(--primary); text-decoration:underline;">Terms of Use</a>
            <a href="/about.html" style="color:var(--primary); text-decoration:underline;">About Us</a>
          </div>
        </div>
      </footer>
    </div>
    ${reactScriptTag}
  </body>
</html>`;
}

// Función principal para escribir todos los archivos físicos
function runSSG() {
  let createdCount = 0;

  // 1. Generar páginas de calculadoras
  calculators.forEach((calc) => {
    const category = calc.meta.category || 'tools';
    const slug = calc.meta.slug || calc.meta.id;
    const calcId = calc.meta.id;

    const htmlContent = generateCalculatorPage(calc);

    // Guardar en dist/{category}/{slug}/index.html
    const targetDir = path.join(DIST_DIR, category, slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');

    // Guardar también en dist/{category}/{slug}.html
    fs.writeFileSync(path.join(DIST_DIR, category, `${slug}.html`), htmlContent, 'utf-8');

    // Guardar también si id !== slug
    if (calcId !== slug) {
      const idDir = path.join(DIST_DIR, category, calcId);
      if (!fs.existsSync(idDir)) {
        fs.mkdirSync(idDir, { recursive: true });
      }
      fs.writeFileSync(path.join(idDir, 'index.html'), htmlContent, 'utf-8');
      fs.writeFileSync(path.join(DIST_DIR, category, `${calcId}.html`), htmlContent, 'utf-8');
    }

    createdCount++;
  });

  // 2. Generar páginas de categorías
  categories.forEach((cat) => {
    const htmlContent = generateCategoryPage(cat);

    // Guardar en dist/{cat.slug}/index.html y dist/{cat.id}/index.html
    [cat.slug, cat.id].forEach(slugName => {
      if (!slugName) return;
      const catDir = path.join(DIST_DIR, slugName);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
      }
      fs.writeFileSync(path.join(catDir, 'index.html'), htmlContent, 'utf-8');
      fs.writeFileSync(path.join(DIST_DIR, `${slugName}.html`), htmlContent, 'utf-8');
    });
  });

  console.log(`✅ ¡Generación SSG completada con éxito! Se crearon páginas HTML físicas e independientes para ${createdCount} calculadoras y ${categories.length} categorías.`);
}

runSSG();
