# Interaction references for the Cooper File

The goal of this pass is not a visual redesign. It is a change of motion grammar:
from sections that fade in, to a documentary that has a camera, a stage, a
timeline and a director.

## What was studied

| Reference | Interaction principle extracted | What was not copied |
| --- | --- | --- |
| **Snow Fall** (The New York Times, 2012) — [source interview](https://source.opennews.org/articles/how-we-made-snow-fall) and [10-year retrospective](https://www.nytimes.com/2022/12/23/insider/snow-fall-at-10-how-it-changed-journalism.html) | Media is paced by the reader's scroll; an avalanche simulation is driven by reading speed, not a timer. Chapter navigation remains visible. | The full-bleed video grammar and the newspaper's type system. |
| **NRK scroll-driven stories** — [Chrome case study](https://developer.chrome.com/blog/nrk-casestudy) | Scroll-driven animation is used to make a dramaturgical point, especially where photography is scarce; text and graphic are synchronized. | The CSS-only implementation and the broadcast brand. |
| **The Boat** (SBS) — [Communication Arts case study](https://www.commarts.com/project/23899/the-boat) | Parallax and media layering are justified by the story's physical experience; the reader can choose pace. | The WebGL ink illustration and the branching narrative. |
| **Hollow** (2013) — [MIT Docubase interview](https://docubase.mit.edu/lab/interviews/design-process-behind-hollow-jeff-soyk/) and [author's analysis](https://story.sarapuotinen.com/archives/218) | Scrolling is exploration of place; layered imagery and sound reveal a community rather than decorate a page. | The participatory map and community-generated content. |
| **Bear 71** (NFB, 2012) — [In Media Res](https://mediacommons.org/imr/2014/09/28/place-and-voice-bear-71) | A map can be the narrative interface, not an illustration beside it. Spatial position carries meaning. | The surveillance-camera matrix and webcam layer. |
| **GSAP ScrollTrigger** — [pinning docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [horizontal/containerAnimation guidance](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-scrolltrigger/SKILL.md) | Pin + scrub turns vertical scroll into a timeline slider. Horizontal travel belongs inside a pinned chapter, not to the whole site. | Any stock demo easing or preset. |
| **Scrollytelling vocabulary** (Oesch, Renner & Roth, *Information Design Journal*, 2022) — [abstract](https://www.jbe-platform.com/content/journals/10.1075/idj.22005.oes?crawler=true) | Five useful techniques: graphic sequences, animated transitions, pan and zoom, scroll-through movies, and show-and-play. | The taxonomy as a checklist; technique is chosen by the evidence. |

Supporting principle from the [Interface Lab chapter contract](https://www.interfacelab.design/en/knowledge/scroll-story-chapter-contract):
a scroll story is a sequence of readable chapters, each with a question, a text
anchor, a visual state and a static fallback. Motion connects states; it is not
the only content layer.

## What this means for Case 002

- **The scroll is the edit.** Pinned scenes are used where the user should
  operate a timeline: the flight trajectory, the money strip, the evidence
  index. Ordinary reading sections still scroll normally.
- **The camera reveals information.** The cover starts close on the tail and
  aft stair, then widens to the airframe. The aircraft diagram starts on the
  ventral stair and pulls back to the whole 727. The map starts on the survey
  plate and moves to the drop field, then the river find.
- **Horizontal travel is chapter-level.** Only the money strip travels
  horizontally; the rest of the document remains a vertical read.
- **Transitions are spatial hand-offs.** The blue flight scene becomes a paper
  ground by a rising clip. The map gives way to the aerial photograph through a
  masked image reveal. The night epilogue closes as its own dark plate.
- **Evidence has physical behavior.** The note is examined with a moving loupe;
  the evidence index is pinned while its rows are placed and a red thread draws
  down the file; the comparison matrix calls one test at a time.
- **Restraint is part of the direction.** No Three.js scene, no particles, no
  glass, no new palette. The existing 1970s dossier is the stage. The one
  three-dimensional gesture is a subtle plane shift in the jump's photograph,
  because that scene is about a body leaving an aircraft.

## Motion hierarchy used

1. **Micro** — masthead chapter readout, citations, hover states.
2. **Content** — clipped evidence entrances, word-masked headings, captions.
3. **Scene** — pinned trajectory, jump descent, map journey, money strip,
   evidence assembly.
4. **Climax** — cover pull-back, note loupe, the map-to-photograph hand-off,
   the final stamp.

The strongest moves are intentionally few. If every chapter shouted, the
silence at the end would not register.
