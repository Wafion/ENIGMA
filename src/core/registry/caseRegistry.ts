import React, { lazy } from 'react';
import type { CaseManifest } from '../types/caseSchema';
import { BLAIR_WITCH_MANIFEST } from '../../cases/case-001-blair-witch/manifest';
import { DB_COOPER_MANIFEST } from '../../cases/case-002-db-cooper/manifest';

export interface CaseRegistryEntry {
  manifest: CaseManifest;
  aliases: string[];
  loader: () => Promise<{ default: React.ComponentType<{ slug?: string }> }>;
}

// Canonical Static Registry — Case 001 (Blair Witch) & Case 002 (D.B. Cooper)
const REGISTRY: Record<string, CaseRegistryEntry> = {
  '001': {
    manifest: BLAIR_WITCH_MANIFEST,
    aliases: ['001', 'case-001', 'blair-witch', 'case-001-blair-witch'],
    loader: () => import('../../cases/case-001-blair-witch/Case001Experience'),
  },
  '002': {
    manifest: DB_COOPER_MANIFEST,
    aliases: ['002', 'case-002', 'db-cooper', 'dbcooper', 'cooper', 'case-002-db-cooper'],
    loader: () => import('../../cases/case-002-db-cooper/Case002Experience'),
  },
};

// Internal map for fast alias resolution
const ALIAS_MAP: Map<string, string> = new Map();

function buildAliasMap() {
  ALIAS_MAP.clear();
  for (const [id, entry] of Object.entries(REGISTRY)) {
    ALIAS_MAP.set(id.toLowerCase(), id);
    for (const alias of entry.aliases) {
      ALIAS_MAP.set(alias.toLowerCase(), id);
    }
  }
}
buildAliasMap();

/**
 * Register a new case dynamically without overwriting canonical static cases
 */
export function registerCase(entry: CaseRegistryEntry) {
  const key = entry.manifest.slug.toLowerCase();
  if (key === '001' || key === '002' || ALIAS_MAP.has(key)) return;
  REGISTRY[key] = entry;
  buildAliasMap();
}

/**
 * Resolve a URL slug to its canonical case entry
 */
export function resolveCase(slug: string): CaseRegistryEntry | undefined {
  const normalized = slug.trim().toLowerCase();
  const canonicalId = ALIAS_MAP.get(normalized);
  if (!canonicalId) return undefined;
  return REGISTRY[canonicalId];
}

/**
 * Get all registered case manifests
 */
export function getAllCaseManifests(): CaseManifest[] {
  return Object.values(REGISTRY).map((entry) => entry.manifest);
}

/**
 * Get published case manifests
 */
export function getPublishedCaseManifests(): CaseManifest[] {
  return Object.values(REGISTRY)
    .filter((entry) => entry.manifest.status === 'published')
    .map((entry) => entry.manifest);
}

// Cache for lazy component definitions to prevent component remounting during render
const COMPONENT_CACHE = new Map<string, React.LazyExoticComponent<React.ComponentType<{ slug?: string }>>>();

/**
 * Get lazy-loaded component for a case slug
 */
export function getCaseComponent(slug: string): React.LazyExoticComponent<React.ComponentType<{ slug?: string }>> | null {
  const entry = resolveCase(slug);
  if (!entry) return null;
  const canonicalId = ALIAS_MAP.get(slug.trim().toLowerCase()) || slug;
  if (!COMPONENT_CACHE.has(canonicalId)) {
    COMPONENT_CACHE.set(canonicalId, lazy(entry.loader));
  }
  return COMPONENT_CACHE.get(canonicalId)!;
}
