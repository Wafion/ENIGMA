import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'enigma-api-and-seo-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const urlPath = (req.url ?? '').split('?')[0];
          if (urlPath === '/sitemap.xml') {
            try {
              const mod = await server.ssrLoadModule('/src/seo/sitemapXml.ts');
              const xml = mod.buildSitemapXml();
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
              res.end(xml);
            } catch (err) {
              console.error('[EnigmaServer] Sitemap generation error:', err);
              next(err);
            }
            return;
          }
          if (urlPath.startsWith('/api')) {
            try {
              const router = await server.ssrLoadModule('/src/server/api/router.ts');
              await router.handleApiRequest(req, res);
            } catch (err) {
              console.error('[EnigmaServer] API middleware error:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal server error in API middleware' }));
              }
            }
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        const distDir = path.resolve(process.cwd(), 'dist');
        server.middlewares.use((req, res, next) => {
          const rawUrl = (req.url ?? '/').split('?')[0];
          if (rawUrl === '/sitemap.xml' || rawUrl === '/api/sitemap') {
            const sitemapPath = path.join(distDir, 'sitemap.xml');
            if (fs.existsSync(sitemapPath)) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
              res.end(fs.readFileSync(sitemapPath, 'utf8'));
              return;
            }
          }

          if (rawUrl === '/case/001' || rawUrl === '/case/case-001') {
            res.statusCode = 301;
            res.setHeader('Location', '/case/blair-witch');
            res.end();
            return;
          }
          if (rawUrl === '/case/002' || rawUrl === '/case/case-002' || rawUrl === '/case/cooper') {
            res.statusCode = 301;
            res.setHeader('Location', '/case/db-cooper');
            res.end();
            return;
          }

          const hasExtension = path.extname(rawUrl) !== '';
          if (rawUrl !== '/' && !hasExtension && !rawUrl.startsWith('/api')) {
            const cleanCandidate = path.join(distDir, `${rawUrl.replace(/^\/+/, '')}.html`);
            if (fs.existsSync(cleanCandidate)) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(cleanCandidate, 'utf8'));
              return;
            }
            const notFoundPath = path.join(distDir, '404.html');
            if (fs.existsSync(notFoundPath)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(notFoundPath, 'utf8'));
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
