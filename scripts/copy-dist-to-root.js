import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = path.resolve(__dirname, '..');

const filesToSync = [
  { src: path.join(projectDir, 'dist', 'index.html'), dest: path.join(projectDir, 'index.html') },
  { src: path.join(projectDir, 'public', '.htaccess'), dest: path.join(projectDir, '.htaccess') },
  { src: path.join(projectDir, 'public', 'robots.txt'), dest: path.join(projectDir, 'robots.txt') },
  { src: path.join(projectDir, 'public', 'sitemap.xml'), dest: path.join(projectDir, 'sitemap.xml') },
];

filesToSync.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copiado ${path.basename(dest)} a la raíz del repositorio exitosamente.`);
  } else {
    console.warn(`⚠️ No se encontró ${src}`);
  }
});
