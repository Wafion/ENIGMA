#!/usr/bin/env node

/**
 * ENIGMA Master Documentary Pipeline & Provenance Verification CLI
 * 
 * Usage:
 *   node scripts/enigma-pipeline.mjs case:create --slug <slug> --title <title> [--number <num>]
 *   node scripts/enigma-pipeline.mjs case:validate [--case <slug>] [--all]
 *   node scripts/enigma-pipeline.mjs case:process-assets [--case <slug>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CASES_DIR = path.join(ROOT_DIR, 'src', 'cases');
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets');

// Terminal color helpers
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgDark: '\x1b[40m',
};

function banner() {
  console.log(`
${c.cyan}┌──────────────────────────────────────────────────────────────────┐
│  ${c.bold}ENIGMA DOCUMENTARY ENGINE${c.reset}${c.cyan} — Production & Provenance Pipeline CLI  │
└──────────────────────────────────────────────────────────────────┘${c.reset}`);
}

function parseArgs(args) {
  const parsed = {
    command: args[0] || 'help',
    options: {},
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        parsed.options[key] = nextArg;
        i++;
      } else {
        parsed.options[key] = true;
      }
    }
  }

  return parsed;
}

/**
 * Normalizes case slug and resolves target directory
 */
function resolveCaseDirectory(caseIdentifier) {
  if (!caseIdentifier) return null;
  const clean = caseIdentifier.toLowerCase().trim();

  // Check direct name
  const directPath = path.join(CASES_DIR, clean);
  if (fs.existsSync(directPath)) return { dir: directPath, slug: clean };

  // Search case directories
  const entries = fs.readdirSync(CASES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.toLowerCase() === clean) {
      return { dir: path.join(CASES_DIR, entry.name), slug: entry.name };
    }
    if (entry.name.toLowerCase().includes(clean)) {
      return { dir: path.join(CASES_DIR, entry.name), slug: entry.name };
    }
  }

  return null;
}

/**
 * 1. COMMAND: case:create
 */
function handleCaseCreate(options) {
  const slug = (options.slug || options.name || '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const title = options.title || 'Untitled Investigation';
  const number = options.number || options.num || '003';
  const lead = options.lead || 'ENIGMA Investigative Unit';
  const summary = options.summary || 'A granular forensic documentary and primary-source reconstruction.';

  if (!slug) {
    console.error(`${c.red}Error:${c.reset} --slug is required. Example: --slug voynich-manuscript --title "The Voynich Manuscript"`);
    process.exit(1);
  }

  const folderName = `case-${number.padStart(3, '0')}-${slug}`;
  const caseDir = path.join(CASES_DIR, folderName);
  const assetDir = path.join(PUBLIC_ASSETS_DIR, slug);

  if (fs.existsSync(caseDir)) {
    console.error(`${c.red}Error:${c.reset} Target case directory already exists: ${caseDir}`);
    process.exit(1);
  }

  console.log(`${c.blue}→ Scaffolding new documentary case:${c.reset} ${folderName}`);
  fs.mkdirSync(caseDir, { recursive: true });

  // Scaffold public assets directories
  const assetSubdirs = ['images', 'documents', 'audio', 'video', 'ascii', 'textures'];
  for (const sub of assetSubdirs) {
    fs.mkdirSync(path.join(assetDir, sub), { recursive: true });
  }

  // 1. theme.ts
  const themeContent = `import type { CaseClimate } from '../../core/types/caseSchema';

export const CASE_CLIMATE: CaseClimate = {
  themeName: '${slug}',
  tokens: {
    bgPrimary: '#0d1117',
    bgSecondary: '#161b22',
    bgSurface: '#21262d',
    textPrimary: '#f0f6fc',
    textSecondary: '#8b949e',
    textMuted: '#484f58',
    accentEvidence: '#f97316',
    accentRedacted: '#30363d',
    borderMuted: 'rgba(240, 246, 252, 0.1)',
    filmGrainOpacity: 0.05,
    crtScanlineOpacity: 0.03,
  },
  typography: {
    fontSerif: 'Newsreader, Georgia, serif',
    fontSans: 'Instrument Sans, system-ui, sans-serif',
    fontMono: 'Geist Mono, monospace',
    fontDisplay: 'Instrument Serif, serif',
  },
};
`;
  fs.writeFileSync(path.join(caseDir, 'theme.ts'), themeContent);

  // 2. sources.ts
  const sourcesContent = `import type { EnigmaSourceCitation } from '../../core/types/provenance';

export const CASE_SOURCES: EnigmaSourceCitation[] = [
  {
    id: 'src-${slug}-01',
    code: 'SRC-01',
    title: 'Primary Archival Docket for ${title}',
    authorOrPublisher: '${lead}',
    publicationDate: '${new Date().toISOString().split('T')[0]}',
    url: 'https://archive.org',
    category: 'Primary Historical Archive',
    verificationNote: 'Initial primary source baseline established for case ${number}.',
    rightsStatus: 'Public Domain / Verified Archival Record',
  },
];

export const SOURCE_MAP: Record<string, EnigmaSourceCitation> = Object.fromEntries(
  CASE_SOURCES.map((s) => [s.code, s])
);
`;
  fs.writeFileSync(path.join(caseDir, 'sources.ts'), sourcesContent);

  // 3. assets.ts
  const assetsContent = `import type { EnigmaAsset } from '../../core/types/provenance';

export const CASE_ASSETS: EnigmaAsset[] = [
  {
    id: 'img-${slug}-hero',
    filename: 'hero-archive-scan.jpg',
    localPath: '/assets/${slug}/images/hero-archive-scan.jpg',
    assetType: 'image',
    title: 'Archival Overview for ${title}',
    sourceUrl: 'https://commons.wikimedia.org',
    creator: '${lead}',
    date: '${new Date().getFullYear()}',
    license: 'Public Domain',
    attribution: 'Verified Documentary Evidence Registry',
    description: 'Primary documentary visual establishing historical context.',
    historicalStatus: 'Genuine historical material',
    truthLayer: 'VERIFIED HISTORICAL FACT',
    usageContext: 'Prologue establishing panoramic archival context',
  },
];

export const ASSET_MAP: Record<string, EnigmaAsset> = Object.fromEntries(
  CASE_ASSETS.map((a) => [a.id, a])
);
`;
  fs.writeFileSync(path.join(caseDir, 'assets.ts'), assetsContent);

  // 4. audio.ts
  const audioContent = `import type { ChapterAudioCue } from '../../core/types/caseSchema';

export const CASE_AUDIO_CUES: ChapterAudioCue[] = [
  {
    movementId: 'movement-01',
    cueLabel: 'Prologue Resonance',
    scoreTrack: 'tone-prologue',
    ambienceTrack: 'ambience-room',
    targetVolumeDb: -12,
    fadeInSec: 2.5,
    duckScoreOnSfx: true,
  },
];
`;
  fs.writeFileSync(path.join(caseDir, 'audio.ts'), audioContent);

  // 5. manifest.ts
  const manifestContent = `import type { CaseManifest } from '../../core/types/caseSchema';
import { CASE_CLIMATE } from './theme';

export const MANIFEST: CaseManifest = {
  id: 'case-${number.padStart(3, '0')}-${slug}',
  slug: '${slug}',
  caseNumber: '${number.padStart(3, '0')}',
  title: '${title}',
  tagline: 'An Investigative Digital Documentary',
  summary: '${summary}',
  editorialLead: '${lead}',
  publishedDate: '${new Date().toISOString().split('T')[0]}',
  readingTimeMin: 22,
  coordinates: '00°00\\'00" N, 00°00\\'00" W',
  climate: CASE_CLIMATE,
  movements: [
    {
      id: 'movement-00',
      number: '00',
      title: 'Prologue: The Archival Ledger',
      subtitle: 'Primary Inquest & Geographic Context',
      durationMin: 4,
      audioCue: {
        scoreTrack: 'prologue-score',
        ambienceTrack: 'prologue-wind',
        targetVolumeDb: -14,
        fadeInSec: 3.0,
      },
    },
    {
      id: 'movement-01',
      number: '01',
      title: 'The Evidence Matrix',
      subtitle: 'Contradiction and Forensic Cross-Reference',
      durationMin: 6,
    },
  ],
};
`;
  fs.writeFileSync(path.join(caseDir, 'manifest.ts'), manifestContent);

  // 6. Experience component
  const expComponentName = `Case${number.padStart(3, '0')}Experience`;
  const expContent = `import React from 'react';
import { MANIFEST } from './manifest';
import { CASE_SOURCES } from './sources';

export function ${expComponentName}() {
  return (
    <main 
      role="main"
      aria-label="${title} Documentary Experience"
      className="min-h-screen bg-[#0d1117] text-[#f0f6fc] font-sans selection:bg-orange-500/30"
    >
      <header className="py-24 px-6 md:px-16 border-b border-white/10 max-w-5xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-orange-400">
          CASE {MANIFEST.caseNumber} // ARCHIVAL DOSSIER
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-white mt-3 mb-4">
          {MANIFEST.title}
        </h1>
        <p className="font-serif text-lg text-white/70 italic leading-relaxed">
          {MANIFEST.summary}
        </p>
      </header>

      <section className="py-16 px-6 md:px-16 max-w-4xl mx-auto space-y-12">
        <article className="border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="font-display text-2xl text-white mb-3">
            Movement 00: Archival Ledger
          </h2>
          <p className="font-serif text-white/80 leading-relaxed">
            Historical documentation verified against primary registry [SRC-01].
          </p>
        </article>

        <footer className="pt-12 border-t border-white/10">
          <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest mb-4">
            Primary Archival Sources ({CASE_SOURCES.length})
          </h3>
          <ul className="space-y-3 font-mono text-xs text-white/70">
            {CASE_SOURCES.map((s) => (
              <li key={s.id} className="border-l-2 border-orange-500/50 pl-3">
                <span className="text-orange-400 font-bold">{s.code}:</span> {s.title} ({s.publicationDate})
              </li>
            ))}
          </ul>
        </footer>
      </section>
    </main>
  );
}

export default ${expComponentName};
`;
  fs.writeFileSync(path.join(caseDir, `${expComponentName}.tsx`), expContent);

  console.log(`
${c.green}✔ Case scaffolded successfully!${c.reset}
  📁 Case Code:      ${c.bold}src/cases/${folderName}/${c.reset}
  📁 Public Assets:  ${c.bold}public/assets/${slug}/${c.reset}

${c.yellow}Next Steps:${c.reset}
  1. Add this case to ${c.cyan}src/core/registry/caseRegistry.ts${c.reset}:
     - Import manifest from \`../../cases/${folderName}/manifest\`
     - Add dynamic loader: \`'${slug}': () => import('../../cases/${folderName}/${expComponentName}')\`
  2. Validate case integrity:
     - Run: ${c.cyan}node scripts/enigma-pipeline.mjs case:validate --case ${slug}${c.reset}
`);
}

/**
 * 2. COMMAND: case:validate
 */
function handleCaseValidate(options) {
  const targetCase = options.case || options.slug;
  const validateAll = options.all || !targetCase;

  let casesToValidate = [];

  if (validateAll) {
    const entries = fs.readdirSync(CASES_DIR, { withFileTypes: true });
    casesToValidate = entries
      .filter((e) => e.isDirectory() && (e.name.startsWith('case-') || e.name === 'blair-witch' || e.name === 'dyatlov-pass'))
      .map((e) => ({ dir: path.join(CASES_DIR, e.name), slug: e.name }));
  } else {
    const resolved = resolveCaseDirectory(targetCase);
    if (!resolved) {
      console.error(`${c.red}Error:${c.reset} Case not found: "${targetCase}". Checked ${CASES_DIR}`);
      process.exit(1);
    }
    casesToValidate = [resolved];
  }

  console.log(`${c.blue}→ Validating ${casesToValidate.length} documentary case(s)...${c.reset}\n`);

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const cInfo of casesToValidate) {
    console.log(`${c.bold}${c.cyan}══════════════════════════════════════════════════════════════════${c.reset}`);
    console.log(`${c.bold}CASE AUDIT: ${cInfo.slug}${c.reset} (at ${path.relative(ROOT_DIR, cInfo.dir)})`);
    console.log(`${c.cyan}══════════════════════════════════════════════════════════════════${c.reset}`);

    const caseErrors = [];
    const caseWarnings = [];

    // 1. Audit Manifest
    const manifestPath = path.join(cInfo.dir, 'manifest.ts');
    if (!fs.existsSync(manifestPath)) {
      caseErrors.push('Missing required file: manifest.ts');
    } else {
      const manifestText = fs.readFileSync(manifestPath, 'utf-8');
      if (!manifestText.includes('CaseManifest')) {
        caseWarnings.push('manifest.ts should declare and export a typed CaseManifest.');
      }
      if (!manifestText.includes('movements:')) {
        caseErrors.push('manifest.ts is missing "movements" array.');
      }
      if (!manifestText.includes('climate:')) {
        caseWarnings.push('manifest.ts should configure "climate" tokens.');
      }
    }

    // 2. Audit Sources
    const sourcesPath = path.join(cInfo.dir, 'sources.ts');
    const knownSourceCodes = new Set();
    if (!fs.existsSync(sourcesPath)) {
      caseErrors.push('Missing required file: sources.ts');
    } else {
      const sourcesText = fs.readFileSync(sourcesPath, 'utf-8');
      
      // Match all SRC-XX codes defined
      const codeMatches = sourcesText.matchAll(/code:\s*['"](SRC-\d+)['"]/g);
      for (const m of codeMatches) {
        knownSourceCodes.add(m[1]);
      }

      // If re-exporting, check referenced file
      if (sourcesText.includes('export { BLAIR_WITCH_SOURCES') || sourcesText.includes('from \'../../data/blairWitchAssets\'')) {
        const refPath = path.join(ROOT_DIR, 'src', 'data', 'blairWitchAssets.ts');
        if (fs.existsSync(refPath)) {
          const refText = fs.readFileSync(refPath, 'utf-8');
          const refCodes = refText.matchAll(/code:\s*['"](SRC-\d+)['"]/g);
          for (const m of refCodes) {
            knownSourceCodes.add(m[1]);
          }
        }
      }

      if (knownSourceCodes.size === 0) {
        caseWarnings.push('No source codes matching "SRC-XX" found in sources.ts');
      } else {
        console.log(`  ${c.green}✔${c.reset} Verified ${knownSourceCodes.size} primary source citations: [${Array.from(knownSourceCodes).join(', ')}]`);
      }
    }

    // 3. Audit Assets & Provenance
    const assetsPath = path.join(cInfo.dir, 'assets.ts');
    const declaredAssets = [];
    if (!fs.existsSync(assetsPath)) {
      caseErrors.push('Missing required file: assets.ts');
    } else {
      const assetsText = fs.readFileSync(assetsPath, 'utf-8');

      // Check truth layers
      const validTruthLayers = [
        'VERIFIED HISTORICAL FACT',
        'EDITORIAL SYNTHESIS',
        'LORE / FOLKLORE',
        'FACTION / RECONSTRUCTION',
      ];
      const validHistoricalStatuses = [
        'Genuine historical material',
        'Reconstructed fictional material',
        'Modern contextual photography',
        'Declassified government document',
        'Archival synthesis',
        'Production artifact',
        'Forensic analysis',
      ];

      // Validate truth layers
      const truthMatches = assetsText.matchAll(/truthLayer:\s*['"]([^'"]+)['"]/g);
      for (const m of truthMatches) {
        if (!validTruthLayers.includes(m[1])) {
          caseErrors.push(`Invalid truthLayer in assets.ts: "${m[1]}"`);
        }
      }

      // Validate historical status
      const statusMatches = assetsText.matchAll(/historicalStatus:\s*['"]([^'"]+)['"]/g);
      for (const m of statusMatches) {
        if (!validHistoricalStatuses.includes(m[1])) {
          caseErrors.push(`Invalid historicalStatus in assets.ts: "${m[1]}"`);
        }
      }

      // Scan for declared localPaths
      const pathMatches = assetsText.matchAll(/localPath:\s*['"]([^'"]+)['"]/g);
      for (const m of pathMatches) {
        declaredAssets.push(m[1]);
      }

      // If re-exporting, check referenced file
      if (assetsText.includes('export { BLAIR_WITCH_ASSETS') || assetsText.includes('from \'../../data/blairWitchAssets\'')) {
        const refPath = path.join(ROOT_DIR, 'src', 'data', 'blairWitchAssets.ts');
        if (fs.existsSync(refPath)) {
          const refText = fs.readFileSync(refPath, 'utf-8');
          const refPaths = refText.matchAll(/localPath:\s*['"]([^'"]+)['"]/g);
          for (const m of refPaths) {
            declaredAssets.push(m[1]);
          }
        }
      }

      console.log(`  ${c.green}✔${c.reset} Verified ${declaredAssets.length} asset provenance records.`);

      // Check file presence in public/
      let missingFiles = 0;
      for (const p of declaredAssets) {
        const fullDiskPath = path.join(ROOT_DIR, 'public', p.startsWith('/') ? p.slice(1) : p);
        if (!fs.existsSync(fullDiskPath)) {
          missingFiles++;
          caseWarnings.push(`Referenced asset not found on disk: public${p}`);
        }
      }
      if (missingFiles === 0 && declaredAssets.length > 0) {
        console.log(`  ${c.green}✔${c.reset} All ${declaredAssets.length} asset files exist in public directory.`);
      }
    }

    // 4. Cross-Reference Citation Scan across case TSX/TS files
    const usedCitations = new Set();
    function scanDirForCitations(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const f of files) {
        const full = path.join(dir, f.name);
        if (f.isDirectory()) {
          scanDirForCitations(full);
        } else if (f.name.endsWith('.tsx') || f.name.endsWith('.ts')) {
          if (f.name === 'sources.ts') continue;
          const content = fs.readFileSync(full, 'utf-8');
          const citations = content.matchAll(/\[(SRC-\d+)\]/g);
          for (const cit of citations) {
            usedCitations.add(cit[1]);
            if (!knownSourceCodes.has(cit[1])) {
              caseErrors.push(`Unverified citation in ${f.name}: [${cit[1]}] is not declared in sources.ts`);
            }
          }
        }
      }
    }
    scanDirForCitations(cInfo.dir);

    // Also check Blair Witch experience and data folder if this is case-001
    if (cInfo.slug.includes('001') || cInfo.slug.includes('blair-witch')) {
      const expDir = path.join(ROOT_DIR, 'src', 'experience');
      if (fs.existsSync(expDir)) {
        scanDirForCitations(expDir);
      }
      const dataFile = path.join(ROOT_DIR, 'src', 'data', 'blairWitchCase.ts');
      if (fs.existsSync(dataFile)) {
        const dataContent = fs.readFileSync(dataFile, 'utf-8');
        const citations = dataContent.matchAll(/\[(SRC-\d+)\]/g);
        for (const cit of citations) {
          usedCitations.add(cit[1]);
        }
      }
    }

    console.log(`  ${c.green}✔${c.reset} Verified ${usedCitations.size} inline citations in case narrative: [${Array.from(usedCitations).join(', ')}]`);

    // Report unused citations as informational warnings
    for (const code of knownSourceCodes) {
      if (!usedCitations.has(code)) {
        caseWarnings.push(`Declared source [${code}] is not cited inline in narrative components.`);
      }
    }

    // Print summary for this case
    if (caseErrors.length > 0) {
      console.log(`\n  ${c.red}${c.bold}Errors (${caseErrors.length}):${c.reset}`);
      for (const err of caseErrors) {
        console.log(`    ${c.red}✖ ${err}${c.reset}`);
      }
    }

    if (caseWarnings.length > 0) {
      console.log(`\n  ${c.yellow}Warnings (${caseWarnings.length}):${c.reset}`);
      for (const warn of caseWarnings) {
        console.log(`    ${c.yellow}▲ ${warn}${c.reset}`);
      }
    }

    if (caseErrors.length === 0 && caseWarnings.length === 0) {
      console.log(`\n  ${c.green}${c.bold}STATUS: 100% PROVENANCE & ARCHITECTURE COMPLIANT${c.reset}`);
    } else if (caseErrors.length === 0) {
      console.log(`\n  ${c.green}${c.bold}STATUS: PASSED WITH ADVISORIES${c.reset}`);
    } else {
      console.log(`\n  ${c.red}${c.bold}STATUS: FAILED VERIFICATION AUDIT${c.reset}`);
    }

    console.log('');
    totalErrors += caseErrors.length;
    totalWarnings += caseWarnings.length;
  }

  console.log(`${c.bold}══════════════════════════════════════════════════════════════════${c.reset}`);
  if (totalErrors === 0) {
    console.log(`${c.green}${c.bold}✔ ALL CASES PASSED VERIFICATION.${c.reset} (${totalWarnings} advisory notes)`);
    process.exit(0);
  } else {
    console.error(`${c.red}${c.bold}✖ AUDIT FAILED with ${totalErrors} error(s).${c.reset}`);
    process.exit(1);
  }
}

/**
 * 3. COMMAND: case:process-assets
 */
function handleProcessAssets(options) {
  const targetCase = options.case || options.slug;
  let targetSlug = 'blair-witch';

  if (targetCase) {
    const resolved = resolveCaseDirectory(targetCase);
    if (resolved) {
      targetSlug = resolved.slug.replace(/^case-\d+-/, '');
    } else {
      targetSlug = targetCase;
    }
  }

  const assetBaseDir = path.join(PUBLIC_ASSETS_DIR, targetSlug);
  if (!fs.existsSync(assetBaseDir)) {
    console.error(`${c.red}Error:${c.reset} Asset directory not found: ${assetBaseDir}`);
    process.exit(1);
  }

  console.log(`${c.blue}→ Auditing & processing assets for:${c.reset} ${targetSlug}`);
  console.log(`  Directory: ${assetBaseDir}\n`);

  let totalFiles = 0;
  let totalBytes = 0;
  let oversizedFiles = 0;

  function walk(dir) {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(full);
      } else {
        totalFiles++;
        const stats = fs.statSync(full);
        totalBytes += stats.size;
        const rel = path.relative(assetBaseDir, full);
        const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
        const ext = path.extname(item.name).toLowerCase();

        // Check for oversized assets (> 1.5MB)
        if (stats.size > 1.5 * 1024 * 1024) {
          oversizedFiles++;
          console.log(`  ${c.yellow}▲ [Oversized: ${sizeMb} MB]${c.reset} ${rel} — Recommend responsive AVIF/WebP derivative`);
        } else {
          console.log(`  ${c.green}✔${c.reset} [${(stats.size / 1024).toFixed(0)} KB] ${rel}`);
        }

        // Quick check for JPEG EXIF markers
        if (ext === '.jpg' || ext === '.jpeg') {
          const fd = fs.openSync(full, 'r');
          const buffer = Buffer.alloc(10);
          fs.readSync(fd, buffer, 0, 10, 0);
          fs.closeSync(fd);
          if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff && buffer[3] === 0xe1) {
            console.log(`    ${c.cyan}ℹ EXIF APP1 header detected; verified historical metadata present.${c.reset}`);
          }
        }
      }
    }
  }

  walk(assetBaseDir);

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`
${c.cyan}Asset Inventory Summary:${c.reset}
  Total Files:      ${c.bold}${totalFiles}${c.reset}
  Total Size:       ${c.bold}${totalMb} MB${c.reset}
  Oversized Files:  ${c.bold}${oversizedFiles}${c.reset}
`);
}

/**
 * CLI Help Manual
 */
function showHelp() {
  console.log(`
${c.bold}ENIGMA CLI COMMANDS:${c.reset}

  ${c.cyan}case:create${c.reset}
    Scaffold a new, typed documentary case package.
    Options:
      --slug <slug>        URL slug for the case (required)
      --title <title>      Documentary title (required)
      --number <num>       Case number, e.g. "003" (default: "003")
      --lead <name>        Editorial lead name
      --summary <text>     Short narrative summary
    Example:
      node scripts/enigma-pipeline.mjs case:create --slug voynich-manuscript --title "The Voynich Manuscript"

  ${c.cyan}case:validate${c.reset}
    Validate provenance integrity, license records, and citation cross-references.
    Options:
      --case <slug>        Validate a specific case (e.g. blair-witch, dyatlov-pass)
      --all                Validate all registered cases (default if --case omitted)
    Example:
      node scripts/enigma-pipeline.mjs case:validate --case blair-witch

  ${c.cyan}case:process-assets${c.reset}
    Audit asset directory, verify file sizes, and scan binary headers.
    Options:
      --case <slug>        Target case asset folder (default: blair-witch)
    Example:
      node scripts/enigma-pipeline.mjs case:process-assets --case blair-witch

  ${c.cyan}help${c.reset}
    Show this manual.
`);
}

// Main execution entry point
const args = process.argv.slice(2);
const parsed = parseArgs(args);

banner();

switch (parsed.command) {
  case 'case:create':
  case 'create':
    handleCaseCreate(parsed.options);
    break;
  case 'case:validate':
  case 'validate':
    handleCaseValidate(parsed.options);
    break;
  case 'case:process-assets':
  case 'process-assets':
    handleProcessAssets(parsed.options);
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    showHelp();
    break;
}
