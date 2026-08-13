import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = path.resolve(__dirname, '..');

const filesToSync = [
  { src: path.join(projectDir, 'dist', 'index.html'), dest: path.join(projectDir, 'index.html') },
  { src: path.join(projectDir, 'public', '.htaccess'), dest: path.join(projectDir, '.htaccess') },
  { src: path.join(projectDir, 'public', 'robots.txt'), dest: path.join(projectDir, '.htaccess') },
  { src: path.join(projectDir, 'public', 'sitemap.xml'), dest: path.join(projectDir, 'sitemap.xml') },
  { src: path.join(projectDir, 'public', 'privacy', 'index.html'), dest: path.join(projectDir, 'privacy', 'index.html') },
  { src: path.join(projectDir, 'public', 'privacy', 'index.html'), dest: path.join(projectDir, 'privacy.html') },
  { src: path.join(projectDir, 'public', 'terms', 'index.html'), dest: path.join(projectDir, 'terms', 'index.html') },
  { src: path.join(projectDir, 'public', 'terms', 'index.html'), dest: path.join(projectDir, 'terms.html') },
  { src: path.join(projectDir, 'public', 'about', 'index.html'), dest: path.join(projectDir, 'about', 'index.html') },
  { src: path.join(projectDir, 'public', 'about', 'index.html'), dest: path.join(projectDir, 'about.html') },
];

filesToSync.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`✅ Copiado ${path.relative(projectDir, dest)} a la raíz exitosamente.`);
  } else {
    console.warn(`⚠️ No se encontró ${src}`);
  }
});
