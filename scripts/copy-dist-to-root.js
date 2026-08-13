import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = path.resolve(__dirname, '..');
const distHtml = path.join(projectDir, 'dist', 'index.html');
const rootHtml = path.join(projectDir, 'index.html');

if (fs.existsSync(distHtml)) {
  fs.copyFileSync(distHtml, rootHtml);
  console.log('✅ index.html de producción compilado copiado a la raíz del repositorio exitosamente.');
} else {
  console.error('⚠️ dist/index.html no encontrado.');
}
