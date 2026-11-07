import http from 'node:http';
import { handleApiRequest } from './api/router';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = http.createServer((req, res) => {
  handleApiRequest(req, res).catch((err) => {
    console.error('[EnigmaStandaloneServer] Unhandled request error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ENIGMA AUTONOMOUS DOCUMENTARY ORCHESTRATION SERVER  `);
  console.log(`======================================================`);
  console.log(`  Status: ONLINE`);
  console.log(`  Port:   http://localhost:${PORT}`);
  console.log(`  API:    http://localhost:${PORT}/api/status`);
  console.log(`======================================================\n`);
});

export default server;
