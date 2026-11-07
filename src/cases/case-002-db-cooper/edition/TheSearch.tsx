import { LANDSCAPE_PROSE, SEARCH_PROSE } from '../content';
import {
  AssetFigure,
  Chapter,
  ChapterHead,
  Cited,
  MarginNote,
  Prose,
} from './ui';
import { SearchMap } from './SearchMap';

export function TheSearch() {
  return (
    <Chapter id="dbc-the-search" number="05" climate="paper" className="ed-search">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-the-search"
          number="05"
          kicker="The search · 1971–1973"
          title="The Search"
          lede={<Cited text={SEARCH_PROSE.lede} />}
        />

        <div className="ed-search__stage">
          <div className="ed-search__map">
            <SearchMap />
          </div>

          <div className="ed-search__notes">
            <p className="ed-kicker">What the ground was asked to give up</p>
            <Prose paragraphs={[SEARCH_PROSE.paragraphs[0], SEARCH_PROSE.paragraphs[1]]} />

            <div className="ed-search__stats">
              {SEARCH_PROSE.stats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.value}</span>
                  <strong>{stat.label}</strong>
                  <small>{stat.note}</small>
                </div>
              ))}
            </div>

            <Prose paragraphs={[SEARCH_PROSE.paragraphs[2]]} />

            <div className="ed-search__lead">
              <span className="ed-search__lead-code">LEAD · 2019</span>
              <div>
                <h3>Heisson, three hours after the jump</h3>
                <p><Cited text={SEARCH_PROSE.paragraphs[3]} /></p>
              </div>
              <span className="ed-search__lead-tag">Lead, not solution</span>
            </div>

            <Prose paragraphs={[LANDSCAPE_PROSE.paragraphs[0], LANDSCAPE_PROSE.paragraphs[1]]} />
          </div>
        </div>
      </div>

      <AssetFigure
        assetId="dbc-lake-merwin-aerial"
        className="ed-search__aerial"
        bleed
        sizes="100vw"
        caption={
          <>
            <strong>THE COUNTRY BELOW</strong>
            <span>
              Lake Merwin, Ariel Dam, and the second-growth conifer ridges of Clark and Cowlitz
              Counties beneath the calculated 8:13 p.m. drop zone. The terrain was logged, crossed
              by roads, and inhabited. That made the absence of evidence more striking, not less.
            </span>
          </>
        }
      />

      <div className="ed-wrap ed-search__margins">
        {SEARCH_PROSE.margin.map((note, index) => (
          <MarginNote key={note} label={index === 0 ? 'On failure' : 'On the eruption'}>
            {note}
          </MarginNote>
        ))}
      </div>
    </Chapter>
  );
}
