import https from 'https';
import { execSync } from 'child_process';
import path from 'path';

const TOKEN = process.argv[2];
const REPO_NAME = 'findcalculator-online';

if (!TOKEN) {
  console.error('❌ Token argument missing');
  process.exit(1);
}

function githubRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'User-Agent': 'Antigravity-Agent',
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function setupRepository() {
  try {
    console.log('🔄 Autenticando con GitHub API...');
    const userRes = await githubRequest('/user');
    if (userRes.status !== 200) {
      console.error('❌ Error de autenticación en GitHub:', userRes.data);
      return;
    }

    const username = userRes.data.login;
    console.log(`✅ Autenticado como usuario de GitHub: ${username}`);

    const projectDir = path.resolve('.');
    const remoteUrl = `https://${TOKEN}@github.com/${username}/${REPO_NAME}.git`;

    try {
      execSync('git remote remove origin', { cwd: projectDir });
    } catch (e) {}

    execSync(`git remote add origin ${remoteUrl}`, { cwd: projectDir });

    console.log('🔄 Agregando archivos y realizando commit limpio...');
    execSync('git add .', { cwd: projectDir });
    execSync('git commit --amend -m "Deploy 331 Calculators with SEO and AdSense support - findcalculator.online"', { cwd: projectDir });

    console.log('🚀 Subiendo código a GitHub (git push origin main)...');
    execSync('git push -u origin main --force', { cwd: projectDir });

    console.log('\n🎉 ¡CÓDIGO PUBLICADO EXITOSAMENTE EN GITHUB!');
    console.log(`🔗 URL del Repositorio: https://github.com/${username}/${REPO_NAME}`);
    console.log(`🔗 URL de Clonación para Hostinger: https://github.com/${username}/${REPO_NAME}.git`);

  } catch (err) {
    console.error('❌ Error ejecutando comandos de Git:', err.message);
  }
}

setupRepository();
