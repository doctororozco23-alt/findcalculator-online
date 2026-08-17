import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, '..');
const distDir = path.join(projectDir, 'dist');

// Función recursiva para copiar directorios y archivos
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// 1. Sincronizar todo dist/ a la raíz
if (fs.existsSync(distDir)) {
  fs.readdirSync(distDir).forEach((item) => {
    const srcPath = path.join(distDir, item);
    const destPath = path.join(projectDir, item);
    copyRecursive(srcPath, destPath);
  });
  console.log('✅ Sincronizados todos los directorios y páginas HTML físicas de dist/ a la raíz del repositorio.');
}

// 2. Sincronizar archivos esenciales de public/
const publicFiles = [
  { src: path.join(projectDir, 'public', '.htaccess'), dest: path.join(projectDir, '.htaccess') },
  { src: path.join(projectDir, 'public', 'robots.txt'), dest: path.join(projectDir, 'robots.txt') },
  { src: path.join(projectDir, 'public', 'ads.txt'), dest: path.join(projectDir, 'ads.txt') },
  { src: path.join(projectDir, 'public', 'sitemap.xml'), dest: path.join(projectDir, 'sitemap.xml') },
  { src: path.join(projectDir, 'public', 'privacy', 'index.html'), dest: path.join(projectDir, 'privacy', 'index.html') },
  { src: path.join(projectDir, 'public', 'privacy', 'index.html'), dest: path.join(projectDir, 'privacy.html') },
  { src: path.join(projectDir, 'public', 'terms', 'index.html'), dest: path.join(projectDir, 'terms', 'index.html') },
  { src: path.join(projectDir, 'public', 'terms', 'index.html'), dest: path.join(projectDir, 'terms.html') },
  { src: path.join(projectDir, 'public', 'about', 'index.html'), dest: path.join(projectDir, 'about', 'index.html') },
  { src: path.join(projectDir, 'public', 'about', 'index.html'), dest: path.join(projectDir, 'about.html') },
];

publicFiles.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
});
console.log('✅ Archivos públicos (.htaccess, robots.txt, ads.txt, sitemap.xml, páginas legales) sincronizados.');
