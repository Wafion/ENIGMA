# CASE 002 — Score direction

The score is one evolving piece of film music, not a playlist attached to chapters.
A section boundary is never, by itself, a reason to change the track.

The implementation lives in `src/cases/case-002-db-cooper/music.ts`; the engine in
`audio.ts` already keeps a deck alive when the next cue names the same track, so a
carry is heard as a gain and ambience change rather than a restart.

## Recurring identities

| Theme | Track | What it is for |
| --- | --- | --- |
| **THE CASE** | “Aloft” — LEMMiNO | The restrained investigative spine. Opens and closes the file. |
| **THE CASE, investigative variation** | “Cipher” — LEMMiNO | The case as a system: the NORJAK archive. |
| **THE MAN** | “Nocturnal” — LEMMiNO | A human, ambiguous presence. The portrait, the note, then the trace evidence and the named suspects. |
| **THE MAN, suspicion variation** | “Beyond These Walls” — Scott Buckley | The same man fractured into competing theories after the names have been read. |
| **THE JUMP, first phase** | “The Encounter” — Scott Buckley | Flight 305 and the ground hold. Long-form, so the sequence can develop without looping. |
| **THE JUMP, escalation** | “Encounters” — LEMMiNO | The second takeoff, the aft stairs, and the search. A darker, tenser variation, then the drop. |
| **THE AFTERMATH** | “Solace” — Scott Buckley | The first human breath after the search: the Tina Bar money find. |
| **THE UNKNOWN, wide** | “Siberian” — LEMMiNO | The ground below the drop zone. Cold, geographical, unresolved. |
| **THE UNKNOWN, inward** | “Unraveling” — Scott Buckley | The closing questions. Sparse enough to be almost atmosphere. |

Only these nine tracks are cued. The remaining licensed tracks stay in the
register as reserve material and are not part of the current cut.

## The arc

### 00 Prologue → 01 The Man
`Aloft` establishes THE CASE. At The Man the score hands over to `Nocturnal`,
because the film moves from an event to a person. That is a real change of subject.

### 01 The Man → 02 The Note
No new song. `Nocturnal` continues under the note: the same man, closer to the
record. The hijack texture waits for the aircraft.

### 03 Flight 305 → 04 The Aft Stairs
`The Encounter` enters with Flight 305 and carries the ground hold. `Encounters`
is the musical turn at the second takeoff: a darker, tenser variation of the same
hijack, not another restart. It carries all the way to the aft stairs and
through the record that follows: only the procedural wind falls away at the
jump, so the chapter is heard as one continuous take rather than a cut. The
silence belongs to the wind and the record, not to the score.

### 05 The Search
`Encounters` stays. The hijack texture runs unbroken into the search and sees it
through to its end; the ground does not get a musical reset. `Siberian` is no
longer used here.

### 06 The Money at Tina Bar
`Solace` is the first warm cue after the search. It begins only when the money
surfaces, after the aerial photograph of the search country has passed and the
money chapter is reached. It is held without triumph.

### 07 What Came Back → 08 The Named
`Nocturnal` returns and stays across both chapters. THE MAN is first a trace —
the tie, the prints, the partial profile — and then a set of names. Same identity,
different distance; no new song at the section break.

### 09 Four Ways to Disappear
`Beyond These Walls` is the suspicion variation. The theories are readings of the
same unresolved man, not four new songs. Gain and procedural tone tighten; the
track does not restart.

### 10 What Remains → Epilogue
`Unraveling` leaves the questions open. `Aloft` returns for the epilogue, changed
by everything in between — a bookend, not a reset.

### The Register
Silence. Room tone, paper, and provenance only.

## Rules for future edits

- Do not add a cue because a chapter changed. Add one because the story changed.
- Prefer a carry with a gain change over a crossfade to a new track.
- Keep each identity together: the portrait and the note; the evidence and the
  names; the second takeoff, the jump, and the search.
- Do not cut the score at the jump or the section break that follows it; the
  register, and a revelation that is more powerful dry, still stay unscored.
- If a new track is unavoidable, bridge it with a sustained tone or let the old
  track resolve under the new element rather than cutting on the section line.
- Keep the licensed register honest: if a track is not cued, mark it Reserve.
