import { useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { DBC_ASSET_MAP } from '../assets';
import { EVIDENCE, type EvidenceItem } from '../content';
import {
  Chapter,
  ChapterHead,
  Cite,
  Overlay,
  Status,
  imageSources,
} from './ui';

function EvidenceDrawer({ item, onClose }: { item: EvidenceItem | null; onClose: () => void }) {
  const asset = item?.assetId ? DBC_ASSET_MAP[item.assetId] : null;
  const source = asset ? imageSources(asset.path) : null;

  return (
    <Overlay open={Boolean(item)} onClose={onClose} title={item?.title ?? 'Evidence'} variant="drawer">
      {item && (
        <div className="ed-evidence-drawer">
          <div className="ed-evidence-drawer__head">
            <span className="ed-kicker">{item.number}</span>
            <h2>{item.title}</h2>
            <p>{item.subtitle}</p>
            <Status value={item.status} />
          </div>

          {asset && source ? (
            <figure className="ed-evidence-drawer__media">
              <img
                src={source.src}
                srcSet={'srcSet' in source ? source.srcSet : undefined}
                sizes="(max-width: 700px) 100vw, 520px"
                width={source.width}
                height={source.height}
                alt={asset.description}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span>{asset.title}</span>
                <span>{asset.creator} · {asset.date} · {asset.license}</span>
              </figcaption>
            </figure>
          ) : (
            <div className="ed-evidence-drawer__blank">
              <span>NOT RECOVERED</span>
              <p>No photograph exists in this file for the missing object.</p>
            </div>
          )}

          <p className="ed-evidence-drawer__summary">{item.summary}</p>

          <div className="ed-evidence-drawer__lists">
            <section>
              <h3>What the record supports</h3>
              <ul>
                {item.facts.map((fact) => <li key={fact}>{fact}</li>)}
              </ul>
            </section>
            <section>
              <h3>What it cannot prove</h3>
              <ul>
                {item.limits.map((limit) => <li key={limit}>{limit}</li>)}
              </ul>
            </section>
          </div>

          <div className="ed-evidence-drawer__source">
            <span>Source record</span>
            <span>{item.source.split(', ').map((code, index) => (
              <span key={code}>{index > 0 ? ' · ' : ''}<Cite code={code} /></span>
            ))}</span>
          </div>

          {asset?.sourceUrl && (
            <a className="ed-link" href={asset.sourceUrl} target="_blank" rel="noreferrer">
              Open the asset record <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
            </a>
          )}
        </div>
      )}
    </Overlay>
  );
}

export function Evidence() {
  const [active, setActive] = useState<EvidenceItem | null>(null);

  return (
    <Chapter id="dbc-the-evidence" number="07" climate="manila" className="ed-evidence">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-the-evidence"
          number="07"
          kicker="Evidence · six artefacts and one absence"
          title="What Came Back"
          lede={
            <p>
              The case file is not a narrative with props. It is a small set of objects, documents,
              and absences. Each item below is inspectable. Each has a limit printed beside it.
            </p>
          }
          aside={<p className="ed-evidence__count">6 records<br /><span>1 absence</span></p>}
        />

        <div className="ed-evidence__index" role="list" data-evidence-index>
          <span className="ed-evidence__thread" data-evidence-thread aria-hidden />
          <div className="ed-evidence__head" aria-hidden>
            <span>Code</span>
            <span>Artefact</span>
            <span>Status</span>
            <span>Record</span>
            <span />
          </div>
          {EVIDENCE.map((item) => (
            <button
              key={item.id}
              type="button"
              className="ed-evidence__row"
              data-evidence-row
              onClick={() => setActive(item)}
              aria-label={`Inspect evidence ${item.number}: ${item.title}`}
            >
              <span className="ed-evidence__code">{item.number}</span>
              <span className="ed-evidence__title">
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
                <span className="ed-evidence__summary">{item.summary}</span>
              </span>
              <span><Status value={item.status} compact /></span>
              <span className="ed-evidence__source">{item.source}</span>
              <span className="ed-evidence__inspect" aria-hidden>
                <Maximize2 size={15} strokeWidth={1.5} />
              </span>
            </button>
          ))}
        </div>

        <div className="ed-chain">
          <p className="ed-kicker">Evidence → inference → theory</p>
          <div className="ed-chain__row">
            <article>
              <span className="ed-chain__step">01 · Evidence</span>
              <h3>290 bills match the 1971 serial list</h3>
              <Status value="CONFIRMED" compact />
              <p>The bundles are the ransom. This is a documented match, not an interpretation.</p>
            </article>
            <span className="ed-chain__arrow" aria-hidden>→</span>
            <article>
              <span className="ed-chain__step">02 · Inference</span>
              <h3>Part of the ransom reached the Columbia</h3>
              <Status value="DOCUMENTED" compact />
              <p>The money was in the river environment at some point. The route and the timing are not settled.</p>
            </article>
            <span className="ed-chain__arrow" aria-hidden>→</span>
            <article>
              <span className="ed-chain__step">03 · Theory</span>
              <h3>How and when it entered the water</h3>
              <Status value="THEORY" compact />
              <p>Landing, dredging, or a later hand. Each explains something. None is demonstrated.</p>
            </article>
          </div>
        </div>

        <p className="ed-evidence__note">
          Absence is part of the evidence. The bomb, the body, the used canopy, and the attaché case
          are not gaps in this page; they are the shape of the file.
        </p>
      </div>

      <EvidenceDrawer item={active} onClose={() => setActive(null)} />
    </Chapter>
  );
}
