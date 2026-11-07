import type { Plugin } from 'vite';
import { handleApiRequest } from './api/router.ts';

export function enigmaServerPlugin(): Plugin {
  return {
    name: 'enigma-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          try {
            await handleApiRequest(req, res);
          } catch (err) {
            console.error('[EnigmaServerPlugin] Error handling API request:', err);
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
  };
}
