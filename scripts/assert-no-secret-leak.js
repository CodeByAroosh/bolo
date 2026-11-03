const fs = require('fs');
const path = require('path');

function getSecretKey() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('SARVAM_API_KEY=') && !trimmed.startsWith('#')) {
          const val = trimmed.split('=')[1]?.trim().replace(/^['"]|['"]$/g, '');
          if (val && val.length > 8) return val;
        }
      }
    }
  }
  return process.env.SARVAM_API_KEY || null;
}

function scanDir(dir, secret) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, secret);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(secret)) {
        console.error(`\x1b[31m[SECURITY VIOLATION] SARVAM_API_KEY leaked in client bundle: ${fullPath}\x1b[0m`);
        process.exit(1);
      }
    }
  }
}

const key = getSecretKey();
if (!key) {
  console.log('[Security Guard] No SARVAM_API_KEY found to scan for.');
  process.exit(0);
}

const staticDir = path.resolve(process.cwd(), '.next/static');
console.log('[Security Guard] Verifying SARVAM_API_KEY does not leak in .next/static...');
scanDir(staticDir, key);
console.log('\x1b[32m[Security Guard] PASSED: No secret leakage found in client bundles.\x1b[0m');
