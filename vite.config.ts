import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'enigma-api-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
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
    },
  ],
});
