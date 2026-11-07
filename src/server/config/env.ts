import fs from 'node:fs';
import path from 'node:path';

let envLoaded = false;

export function loadEnvironment(): void {
  if (envLoaded) return;
  envLoaded = true;

  const candidates = ['.env.local', '.env'];
  for (const filename of candidates) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(fullPath)) {
      try {
        if (typeof process.loadEnvFile === 'function') {
          process.loadEnvFile(fullPath);
        } else {
          // Manual fallback parsing
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
              const key = trimmed.slice(0, eqIdx).trim();
              const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        }
      } catch (err) {
        console.warn(`[EnvLoader] Notice reading ${filename}:`, err);
      }
    }
  }
}

export function getGeminiApiKey(): string | null {
  loadEnvironment();
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
}
