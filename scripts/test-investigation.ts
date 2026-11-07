import { orchestrator } from '../src/server/orchestrator/InvestigationOrchestrator';
import { db } from '../src/server/db/database';

async function run() {
  console.log('Testing investigation orchestrator pipeline...');
  
  const events: string[] = [];
  
  const testBrief = {
    title: 'D.B. Cooper Skyjacking',
    historicalContext: 'On November 24 1971 a man identifying as Dan Cooper hijacked Boeing 727 Flight 305, extorted $200,000, and parachuted into the dense forested wilderness of southwest Washington state.',
    centralInvestigativeQuestion: 'Did the hijacker survive the freezing nighttime jump through dense cloud cover and what physical clues explain the Tina Bar money recovery?',
  };

  const invId = await orchestrator.runInvestigation(testBrief);
  console.log(`Started investigation ID: ${invId}`);

  orchestrator.subscribe(invId, (evt) => {
    events.push(evt.stage);
    console.log(`[EVENT] ${evt.stage}: ${evt.message}`);
  });

  // Wait for the pipeline to reach PUBLISHED or FAILED
  let attempts = 0;
  while (attempts < 60) {
    await new Promise((r) => setTimeout(r, 1000));
    attempts++;
    const inv = db.getInvestigation(invId);
    if (inv?.status === 'PUBLISHED' || inv?.status === 'FAILED') {
      console.log(`\nFinal investigation status: ${inv.status} (progress: ${inv.research_progress}%)`);
      break;
    }
  }

  // Verify manifest
  const manifests = db.listPublishedManifests();
  console.log(`Total published manifests in DB: ${manifests.length}`);
  const latest = manifests[0];
  console.log(`Latest published manifest: ${latest?.title} (slug: ${latest?.slug})`);

  db.close();
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
