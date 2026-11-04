import type { FactFictionComparisonRow } from '../../types/enigma';
import { SourceRef } from './primitives';

export function FactLedger({ rows }: { rows: FactFictionComparisonRow[] }) {
  return (
    <section className="fact-ledger" aria-labelledby="ledger-title">
      <header className="fact-ledger__head" data-reveal>
        <p className="kicker">The final ledger</p>
        <h3 id="ledger-title">Claim and record</h3>
        <p>
          Six claims that did most of the work in 1999, set against what can actually be
          documented. Each row points to a source in the register.
        </p>
      </header>
      <div className="fact-ledger__table" role="table" aria-label="Fact and fiction comparison">
        <div className="fact-ledger__row fact-ledger__row--head" role="row">
          <span role="columnheader">The story</span>
          <span role="columnheader">The record</span>
          <span role="columnheader">Source</span>
        </div>
        {rows.map((row) => (
          <div className="fact-ledger__row" role="row" key={row.id}>
            <div role="cell">
              <span className="fact-ledger__topic">{row.topic}</span>
              <p>{row.inUniverseClaim}</p>
              <span className="fact-ledger__label">In-universe claim</span>
            </div>
            <div role="cell">
              <p>{row.historicalReality}</p>
              <span className="fact-ledger__label">Documented record</span>
            </div>
            <div role="cell" className="fact-ledger__source">
              <SourceRef code={row.primarySourceCode} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
