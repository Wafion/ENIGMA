import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const db = new DatabaseSync(path.resolve(process.cwd(), 'data', 'enigma.db'));

// List tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

// Check manifests table
const manifests = db.prepare('SELECT slug, title, case_number FROM manifests').all();
console.log('Current manifests count:', manifests.length);

// Delete non-blair-witch manifests
db.prepare("DELETE FROM manifests WHERE slug NOT IN ('001', 'case-001', 'blair-witch', 'case-001-blair-witch')").run();

// Delete non-blair-witch investigations
db.prepare("DELETE FROM investigations WHERE slug NOT IN ('001', 'case-001', 'blair-witch', 'case-001-blair-witch')").run();

// Clean orphan events, claims, questions, documents, sources, contradictions, hypotheses, timeline_events
try {
  db.prepare("DELETE FROM telemetry_events WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('telemetry_events:', e.message); }

try {
  db.prepare("DELETE FROM questions WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('questions:', e.message); }

try {
  db.prepare("DELETE FROM claims WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('claims:', e.message); }

try {
  db.prepare("DELETE FROM sources WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('sources:', e.message); }

try {
  db.prepare("DELETE FROM documents WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('documents:', e.message); }

try {
  db.prepare("DELETE FROM passages WHERE source_id NOT IN (SELECT id FROM sources)").run();
} catch (e) { console.log('passages:', e.message); }

try {
  db.prepare("DELETE FROM contradictions WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('contradictions:', e.message); }

try {
  db.prepare("DELETE FROM hypotheses WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('hypotheses:', e.message); }

try {
  db.prepare("DELETE FROM timeline_events WHERE investigation_id NOT IN (SELECT id FROM investigations)").run();
} catch (e) { console.log('timeline_events:', e.message); }

const remaining = db.prepare('SELECT slug, title, case_number FROM manifests').all();
console.log('Remaining manifests:', remaining);

// Clean public/assets/dossiers/ of junk test folders
const dossiersDir = path.resolve(process.cwd(), 'public', 'assets', 'dossiers');
if (fs.existsSync(dossiersDir)) {
  const folders = fs.readdirSync(dossiersDir);
  for (const f of folders) {
    if (!f.includes('blair-witch')) {
      const target = path.join(dossiersDir, f);
      fs.rmSync(target, { recursive: true, force: true });
      console.log('Removed test dossier folder:', f);
    }
  }
}
console.log('Database and dossier assets cleanup complete.');
