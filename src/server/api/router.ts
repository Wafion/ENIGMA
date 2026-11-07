import type { IncomingMessage, ServerResponse } from 'node:http';
import { db } from '../db/database';
import { orchestrator, type OrchestratorEvent } from '../orchestrator/InvestigationOrchestrator';
import { connectorHub } from '../connectors/ConnectorHub';
import type { ManifestRow } from '../db/schema';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method?.toUpperCase();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // --- SSE Stream for Investigation Telemetry ---
  const sseMatch = pathname.match(/^\/api\/investigations\/([^/]+)\/stream$/);
  if (sseMatch && method === 'GET') {
    const investigationId = sseMatch[1];
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', investigationId })}\n\n`);

    // Stream past events first
    const pastEvents = db.getEvents(investigationId, 50);
    for (const ev of pastEvents) {
      res.write(`data: ${JSON.stringify({ type: 'PAST_EVENT', event: ev })}\n\n`);
    }

    const unsubscribe = orchestrator.subscribe(investigationId, (event: OrchestratorEvent) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    req.on('close', () => {
      unsubscribe();
    });
    return;
  }

  // JSON helper
  const sendJson = (status: number, data: unknown) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Body parser helper
  const readBody = async (): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  };

  // --- Endpoints ---

  // 1. GET /api/status
  if (pathname === '/api/status' && method === 'GET') {
    sendJson(200, {
      status: 'ONLINE',
      engine: 'ENIGMA Autonomous Documentary Engine v2.0',
      activeCases: db.listPublishedManifests().length,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 2. GET /api/cases
  if (pathname === '/api/cases' && method === 'GET') {
    const manifests = db.listPublishedManifests();
    sendJson(200, manifests.map((m: ManifestRow) => JSON.parse(m.manifest_json)));
    return;
  }

  // 3. GET /api/cases/:slug
  const caseMatch = pathname.match(/^\/api\/cases\/([^/]+)$/);
  if (caseMatch && method === 'GET') {
    const slug = caseMatch[1];
    const manifestRow = db.getManifestBySlug(slug);
    if (!manifestRow) {
      sendJson(404, { error: `Case '${slug}' not found in published manifests.` });
      return;
    }
    sendJson(200, JSON.parse(manifestRow.composition_json));
    return;
  }

  // 4. POST /api/investigations (Launch autonomous investigation)
  if (pathname === '/api/investigations' && method === 'POST') {
    try {
      const body = await readBody();
      const title = String(body.title || '').trim();
      const historicalContext = String(body.historicalContext || '').trim();
      const centralInvestigativeQuestion = String(body.centralInvestigativeQuestion || '').trim();
      const customSources = Array.isArray(body.customSources)
        ? (body.customSources as Array<{ title: string; url?: string; text?: string }>)
        : undefined;

      if (!title || !centralInvestigativeQuestion) {
        sendJson(400, { error: 'Documentary Title and Central Investigative Question are strictly required.' });
        return;
      }

      const investigationId = await orchestrator.runInvestigation({
        title,
        historicalContext: historicalContext || 'Historical anomaly recorded in primary archives.',
        centralInvestigativeQuestion,
        customSources,
      });

      const inv = db.getInvestigation(investigationId);
      sendJson(201, {
        investigationId,
        slug: inv?.slug,
        status: 'INITIALIZED',
        message: 'Investigation loop initiated. Connect to /api/investigations/:id/stream for live telemetry.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      sendJson(500, { error: `Failed to initiate investigation: ${message}` });
    }
    return;
  }

  // 5. GET /api/investigations
  if (pathname === '/api/investigations' && method === 'GET') {
    const list = db.listInvestigations();
    sendJson(200, list);
    return;
  }

  // 6. GET /api/investigations/:id
  const invDetailMatch = pathname.match(/^\/api\/investigations\/([^/]+)$/);
  if (invDetailMatch && method === 'GET') {
    const id = invDetailMatch[1];
    const inv = db.getInvestigation(id);
    if (!inv) {
      sendJson(404, { error: `Investigation '${id}' not found.` });
      return;
    }

    const questions = db.getQuestions(inv.id);
    const sources = db.getSources(inv.id);
    const passages = db.getPassages(inv.id);
    const claims = db.getClaims(inv.id);
    const contradictions = db.getContradictions(inv.id);
    const timeline = db.getTimelineEvents(inv.id);
    const hypotheses = db.getHypotheses(inv.id);
    const manifestRow = db.getManifestBySlug(inv.slug);
    const pendingGate = db.getPendingReviewGate(inv.id);

    sendJson(200, {
      investigation: inv,
      questions,
      sources,
      passages,
      claims,
      contradictions,
      timeline,
      hypotheses,
      manifest: manifestRow ? JSON.parse(manifestRow.manifest_json) : null,
      compositionBundle: manifestRow ? JSON.parse(manifestRow.composition_json) : null,
      pendingGate,
    });
    return;
  }

  // 7. POST /api/investigations/:id/review
  const reviewMatch = pathname.match(/^\/api\/investigations\/([^/]+)\/review$/);
  if (reviewMatch && method === 'POST') {
    try {
      const body = await readBody();
      const gateId = String(body.gateId || '');
      const resolution = String(body.resolution || 'Editorial Override Approved');
      db.resolveReviewGate(gateId, resolution);
      sendJson(200, { success: true, gateId, resolution });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      sendJson(500, { error: `Review resolution failed: ${message}` });
    }
    return;
  }

  // 8. GET /api/connectors/search?q=...
  if (pathname === '/api/connectors/search' && method === 'GET') {
    const q = url.searchParams.get('q') || '';
    if (!q) {
      sendJson(400, { error: 'Search parameter q is required.' });
      return;
    }
    const candidates = await connectorHub.discoverSources({ query: q, maxResults: 4 });
    sendJson(200, candidates);
    return;
  }

  // 404 Fallback
  sendJson(404, { error: `API route not found: ${method} ${pathname}` });
}
