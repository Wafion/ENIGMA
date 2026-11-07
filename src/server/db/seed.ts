import { db } from './database';
import { BLAIR_WITCH_MANIFEST } from '../../cases/case-001-blair-witch/manifest';

export function seedInitialDatabase(customDb?: any) {
  const targetDb = customDb || db;

  // Seed ONLY Case 001 (Blair Witch) - user requirement: keep only Blair Witch
  if (!targetDb.getManifestBySlug('001')) {
    targetDb.saveManifest({
      id: BLAIR_WITCH_MANIFEST.id,
      investigation_id: 'proj-001-blair-witch',
      slug: BLAIR_WITCH_MANIFEST.slug,
      case_number: BLAIR_WITCH_MANIFEST.caseNumber,
      title: BLAIR_WITCH_MANIFEST.title,
      manifest_json: JSON.stringify(BLAIR_WITCH_MANIFEST),
      composition_json: JSON.stringify({ manifest: BLAIR_WITCH_MANIFEST }),
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}
