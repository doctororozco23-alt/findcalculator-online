import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, '..');

const distDir = path.join(projectDir, 'dist');
const viteCacheDir = path.join(projectDir, 'node_modules', '.vite');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
if (fs.existsSync(viteCacheDir)) {
  fs.rmSync(viteCacheDir, { recursive: true, force: true });
}

fs.copyFileSync(
  path.join(projectDir, 'index.source.html'),
  path.join(projectDir, 'index.html')
);

console.log('✅ Prepared clean entry template index.html for Vite build.');
