import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import type {
  InvestigationRow,
  QuestionRow,
  SourceRow,
  DocumentRow,
  PassageRow,
  ClaimRow,
  ContradictionRow,
  TimelineEventRow,
  HypothesisRow,
  ManifestRow,
  InvestigationEventRow,
  ReviewGateRow,
} from './schema';

class EnigmaDatabase {
  private db: DatabaseSync;
  private dbPath: string;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'enigma.db');
    this.db = new DatabaseSync(this.dbPath);
    this.initializeTables();
  }

  private initializeTables() {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = OFF;

      CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        subject TEXT NOT NULL,
        category TEXT NOT NULL,
        central_question TEXT NOT NULL,
        historical_scope TEXT NOT NULL,
        date_range TEXT NOT NULL,
        status TEXT NOT NULL,
        research_progress INTEGER NOT NULL DEFAULT 0,
        climate_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        question TEXT NOT NULL,
        priority TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        known_evidence TEXT NOT NULL,
        unanswered_questions TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        author_publisher TEXT NOT NULL,
        publication_date TEXT NOT NULL,
        url TEXT NOT NULL,
        category TEXT NOT NULL,
        verification_note TEXT NOT NULL,
        call_number TEXT,
        repository_name TEXT,
        rights_status TEXT NOT NULL,
        document_hash TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        sha256 TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        local_path TEXT NOT NULL,
        page_count INTEGER NOT NULL DEFAULT 1,
        file_size INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS passages (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        source_code TEXT NOT NULL,
        document_title TEXT NOT NULL,
        page_or_sheet TEXT NOT NULL,
        verbatim_text TEXT NOT NULL,
        english_translation TEXT,
        text_sha256 TEXT NOT NULL,
        is_ocr_derived INTEGER NOT NULL DEFAULT 0,
        ocr_confidence REAL NOT NULL DEFAULT 1.0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS claims (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        proposition TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        epistemic_layer TEXT NOT NULL,
        temporal_anchor TEXT,
        geographic_anchor TEXT,
        confidence_score REAL NOT NULL,
        supporting_evidence_ids TEXT NOT NULL,
        contradicting_evidence_ids TEXT NOT NULL,
        passages_json TEXT NOT NULL,
        movement_id TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS contradictions (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        title TEXT NOT NULL,
        claim_a_id TEXT NOT NULL,
        claim_b_id TEXT NOT NULL,
        proposition_a TEXT NOT NULL,
        proposition_b TEXT NOT NULL,
        conflict_description TEXT NOT NULL,
        nature_of_conflict TEXT NOT NULL,
        status TEXT NOT NULL,
        editorial_analysis TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS timeline_events (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        date TEXT NOT NULL,
        estimated_date TEXT,
        precision TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        geographic_location TEXT,
        coordinates TEXT,
        supporting_source_codes TEXT NOT NULL,
        contradicting_source_codes TEXT,
        certainty_status TEXT NOT NULL,
        editorial_notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS hypotheses (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        evidence_weight REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        supporting_claim_ids TEXT NOT NULL,
        refuting_claim_ids TEXT NOT NULL,
        unresolved_anomalies TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS manifests (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        case_number TEXT NOT NULL,
        title TEXT NOT NULL,
        manifest_json TEXT NOT NULL,
        composition_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS investigation_events (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        stage TEXT NOT NULL,
        message TEXT NOT NULL,
        data_json TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS review_gates (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        gate_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        options_json TEXT NOT NULL,
        status TEXT NOT NULL,
        resolution TEXT,
        created_at TEXT NOT NULL,
        resolved_at TEXT,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
      );
    `);
  }

  // --- Investigation Queries ---
  createInvestigation(row: InvestigationRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO investigations (id, title, slug, subject, category, central_question, historical_scope, date_range, status, research_progress, climate_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      row.id,
      row.title,
      row.slug,
      row.subject,
      row.category,
      row.central_question,
      row.historical_scope,
      row.date_range,
      row.status,
      row.research_progress,
      row.climate_json,
      row.created_at,
      row.updated_at
    );
  }

  getInvestigation(id: string): InvestigationRow | undefined {
    const stmt = this.db.prepare(`SELECT * FROM investigations WHERE id = ? OR slug = ?`);
    return stmt.get(id, id) as InvestigationRow | undefined;
  }

  listInvestigations(): InvestigationRow[] {
    const stmt = this.db.prepare(`SELECT * FROM investigations ORDER BY updated_at DESC`);
    return stmt.all() as unknown as InvestigationRow[];
  }

  updateInvestigationStatus(id: string, status: string, progress: number) {
    const stmt = this.db.prepare(`
      UPDATE investigations 
      SET status = ?, research_progress = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(status, progress, new Date().toISOString(), id);
  }

  updateInvestigationClimate(id: string, climateJson: string) {
    const stmt = this.db.prepare(`
      UPDATE investigations 
      SET climate_json = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(climateJson, new Date().toISOString(), id);
  }

  // --- Questions ---
  addQuestion(q: QuestionRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO questions (id, investigation_id, question, priority, category, status, known_evidence, unanswered_questions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(q.id, q.investigation_id, q.question, q.priority, q.category, q.status, q.known_evidence, q.unanswered_questions, q.created_at);
  }

  getQuestions(investigationId: string): QuestionRow[] {
    const stmt = this.db.prepare(`SELECT * FROM questions WHERE investigation_id = ? ORDER BY created_at ASC`);
    return stmt.all(investigationId) as unknown as QuestionRow[];
  }

  // --- Sources ---
  addSource(s: SourceRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO sources (id, investigation_id, code, title, author_publisher, publication_date, url, category, verification_note, call_number, repository_name, rights_status, document_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      s.id,
      s.investigation_id,
      s.code,
      s.title,
      s.author_publisher,
      s.publication_date,
      s.url,
      s.category,
      s.verification_note,
      s.call_number,
      s.repository_name,
      s.rights_status,
      s.document_hash,
      s.created_at
    );
  }

  getSources(investigationId: string): SourceRow[] {
    const stmt = this.db.prepare(`SELECT * FROM sources WHERE investigation_id = ? ORDER BY code ASC`);
    return stmt.all(investigationId) as unknown as SourceRow[];
  }

  // --- Documents ---
  addDocument(d: DocumentRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO documents (id, investigation_id, source_id, sha256, mime_type, local_path, page_count, file_size, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(d.id, d.investigation_id, d.source_id, d.sha256, d.mime_type, d.local_path, d.page_count, d.file_size, d.created_at);
  }

  getDocuments(investigationId: string): DocumentRow[] {
    const stmt = this.db.prepare(`SELECT * FROM documents WHERE investigation_id = ?`);
    return stmt.all(investigationId) as unknown as DocumentRow[];
  }

  // --- Passages ---
  addPassage(p: PassageRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO passages (id, investigation_id, source_id, source_code, document_title, page_or_sheet, verbatim_text, english_translation, text_sha256, is_ocr_derived, ocr_confidence, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      p.id,
      p.investigation_id,
      p.source_id,
      p.source_code,
      p.document_title,
      p.page_or_sheet,
      p.verbatim_text,
      p.english_translation,
      p.text_sha256,
      p.is_ocr_derived,
      p.ocr_confidence,
      p.created_at
    );
  }

  getPassages(investigationId: string): PassageRow[] {
    const stmt = this.db.prepare(`SELECT * FROM passages WHERE investigation_id = ? ORDER BY source_code ASC, page_or_sheet ASC`);
    return stmt.all(investigationId) as unknown as PassageRow[];
  }

  // --- Claims ---
  addClaim(c: ClaimRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO claims (id, investigation_id, proposition, category, status, epistemic_layer, temporal_anchor, geographic_anchor, confidence_score, supporting_evidence_ids, contradicting_evidence_ids, passages_json, movement_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      c.id,
      c.investigation_id,
      c.proposition,
      c.category,
      c.status,
      c.epistemic_layer,
      c.temporal_anchor,
      c.geographic_anchor,
      c.confidence_score,
      c.supporting_evidence_ids,
      c.contradicting_evidence_ids,
      c.passages_json,
      c.movement_id,
      c.created_at
    );
  }

  getClaims(investigationId: string): ClaimRow[] {
    const stmt = this.db.prepare(`SELECT * FROM claims WHERE investigation_id = ? ORDER BY created_at ASC`);
    return stmt.all(investigationId) as unknown as ClaimRow[];
  }

  // --- Contradictions ---
  addContradiction(c: ContradictionRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO contradictions (id, investigation_id, title, claim_a_id, claim_b_id, proposition_a, proposition_b, conflict_description, nature_of_conflict, status, editorial_analysis, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      c.id,
      c.investigation_id,
      c.title,
      c.claim_a_id,
      c.claim_b_id,
      c.proposition_a,
      c.proposition_b,
      c.conflict_description,
      c.nature_of_conflict,
      c.status,
      c.editorial_analysis,
      c.created_at
    );
  }

  getContradictions(investigationId: string): ContradictionRow[] {
    const stmt = this.db.prepare(`SELECT * FROM contradictions WHERE investigation_id = ? ORDER BY created_at ASC`);
    return stmt.all(investigationId) as unknown as ContradictionRow[];
  }

  // --- Timeline ---
  addTimelineEvent(e: TimelineEventRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO timeline_events (id, investigation_id, date, estimated_date, precision, title, summary, geographic_location, coordinates, supporting_source_codes, contradicting_source_codes, certainty_status, editorial_notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      e.id,
      e.investigation_id,
      e.date,
      e.estimated_date,
      e.precision,
      e.title,
      e.summary,
      e.geographic_location,
      e.coordinates,
      e.supporting_source_codes,
      e.contradicting_source_codes,
      e.certainty_status,
      e.editorial_notes,
      e.created_at
    );
  }

  getTimelineEvents(investigationId: string): TimelineEventRow[] {
    const stmt = this.db.prepare(`SELECT * FROM timeline_events WHERE investigation_id = ? ORDER BY date ASC`);
    return stmt.all(investigationId) as unknown as TimelineEventRow[];
  }

  // --- Hypotheses ---
  addHypothesis(h: HypothesisRow) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO hypotheses (id, investigation_id, title, description, evidence_weight, status, supporting_claim_ids, refuting_claim_ids, unresolved_anomalies, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      h.id,
      h.investigation_id,
      h.title,
      h.description,
      h.evidence_weight,
      h.status,
      h.supporting_claim_ids,
      h.refuting_claim_ids,
      h.unresolved_anomalies,
      h.created_at
    );
  }

  getHypotheses(investigationId: string): HypothesisRow[] {
    const stmt = this.db.prepare(`SELECT * FROM hypotheses WHERE investigation_id = ? ORDER BY evidence_weight DESC`);
    return stmt.all(investigationId) as unknown as HypothesisRow[];
  }

  // --- Manifests & Published Documentaries ---
  saveManifest(m: ManifestRow) {
    const stmt = this.db.prepare(`
      INSERT INTO manifests (id, investigation_id, slug, case_number, title, manifest_json, composition_json, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        manifest_json = excluded.manifest_json,
        composition_json = excluded.composition_json,
        status = excluded.status,
        updated_at = excluded.updated_at
    `);
    stmt.run(m.id, m.investigation_id, m.slug, m.case_number, m.title, m.manifest_json, m.composition_json, m.status, m.created_at, m.updated_at);
  }

  getManifestBySlug(slug: string): ManifestRow | undefined {
    const stmt = this.db.prepare(`SELECT * FROM manifests WHERE slug = ? OR case_number = ?`);
    return stmt.get(slug, slug) as ManifestRow | undefined;
  }

  listPublishedManifests(): ManifestRow[] {
    const stmt = this.db.prepare(`SELECT * FROM manifests WHERE status = 'published' ORDER BY case_number ASC`);
    return stmt.all() as unknown as ManifestRow[];
  }

  // --- Events & Telemetry ---
  addEvent(e: InvestigationEventRow) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO investigation_events (id, investigation_id, event_type, stage, message, data_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(e.id, e.investigation_id, e.event_type, e.stage, e.message, e.data_json, e.created_at);
    } catch (err) {
      console.warn('[EnigmaDatabase] Failed to insert telemetry event:', err);
    }
  }

  getEvents(investigationId: string, limit = 100): InvestigationEventRow[] {
    const stmt = this.db.prepare(`
      SELECT * FROM investigation_events 
      WHERE investigation_id = ? 
      ORDER BY created_at ASC 
      LIMIT ?
    `);
    return stmt.all(investigationId, limit) as unknown as InvestigationEventRow[];
  }

  // --- Human Review Gates ---
  addReviewGate(g: ReviewGateRow) {
    const stmt = this.db.prepare(`
      INSERT INTO review_gates (id, investigation_id, gate_type, title, description, options_json, status, resolution, created_at, resolved_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(g.id, g.investigation_id, g.gate_type, g.title, g.description, g.options_json, g.status, g.resolution, g.created_at, g.resolved_at);
  }

  getPendingReviewGate(investigationId: string): ReviewGateRow | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM review_gates 
      WHERE investigation_id = ? AND status = 'pending' 
      ORDER BY created_at ASC 
      LIMIT 1
    `);
    return stmt.get(investigationId) as ReviewGateRow | undefined;
  }

  resolveReviewGate(id: string, resolution: string) {
    const stmt = this.db.prepare(`
      UPDATE review_gates 
      SET status = 'resolved', resolution = ?, resolved_at = ?
      WHERE id = ?
    `);
    stmt.run(resolution, new Date().toISOString(), id);
  }

  close() {
    this.db.close();
  }
}

export const db = new EnigmaDatabase();

// Auto-seed manifests if database is new
import { seedInitialDatabase } from './seed';
try {
  seedInitialDatabase(db);
} catch (e) {
  console.warn('[EnigmaDatabase] Seed notice:', e);
}

