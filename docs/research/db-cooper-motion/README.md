# Motion research — CASE 002 / NORJAK

Research pass for the motion and spatial-interaction upgrade. The goal is not to copy any
site's visual identity. The goal is to extract **interaction principles** that suit an
investigative documentary: controlled attention, evidence choreography, camera direction,
and a clear hierarchy between quiet reading and staged scenes.

Screens captured in `screens/`:

| File | Reference | What was studied |
| --- | --- | --- |
| `gsap-showcase.png` | gsap.com/showcase | Pinned scene construction, scrubbed timelines, editorial sequencing, the difference between a reveal and a scene. |
| `gsap-demos.png` | demos.gsap.com | Horizontal sequences, masked transitions, motion-path movement, SVG stroke drawing. |
| `awwwards-scrolling.png` | Awwwards · scrolling collection | Scroll as a directing tool; sparse scenes that hold while information changes; chapter-level rhythm changes. |
| `pudding-pi.png` | The Pudding · *Afterlife of Pi* | Interactive journalism: a persistent visual anchor, progressive annotation, typographic scale used as navigation. |
| `little-match-girl.png` | *The Little Match Girl* (onecoldnight.com) | Layered depth, camera pull-backs, image sequencing, atmosphere built without UI chrome. |
| `sbs-the-boat.png` | SBS · *The Boat* | Immersive scrollytelling; scene holds, text fragments, spatial continuity between chapters. |
| `21st-dev.png` | 21st.dev | Interface patterns only: state transitions, morphing lists, controlled micro-motion. Not an editorial reference. |
| `nyt-graphics.png` | NYT interactive graphics (paywall/blank capture) | Used only through web research; the capture did not render. |

## Principles extracted

1. **A scene is a change of state, not an entrance.**
   Pinning the visual and letting scroll change what it says is more documentary than
   fading a section in. The unit of storytelling becomes *state → state*, not *section →
   section*.

2. **The camera should reveal information.**
   Pull-backs and pushes are useful only when they expose context: a line becomes a
   document, a document becomes a case file, a field becomes a map. A zoom with nothing
   new inside it is decoration.

3. **Horizontal movement works when the content is a sequence.**
   Timelines, evidence strips, trajectories, and comparison sets are naturally lateral.
   Horizontal motion should be a chapter-level device, not the page's navigation model.

4. **Motion should answer "what do I notice next?"**
   Evidence choreography is sequencing attention: enter → isolate → annotate → compare →
   file away. The animation is an editorial argument about relevance.

5. **Contrast creates rhythm.**
   Loud chapters need quiet neighbours. Body copy should stay still. Reserve clip
   reveals, pins and large camera moves for the few moments that carry the case:
   the note, the jump, the map, the money, the suspended stamp.

6. **Typography can move when it behaves like evidence.**
   Titles, chapter numbers, times, counts and status words can enter on a mask. Paragraphs
   should not drift, track, or split. Readability is part of the documentary's credibility.

7. **Depth is a composition, not a 3D demo.**
   Foreground evidence, type, secondary imagery and background plate can move at different
   rates. A 2.5D treatment is sufficient. WebGL is only justified where true spatial
   comprehension is gained; here SVG geometry and CSS transforms already carry the map and
   aircraft, so no Three.js scene is introduced.

8. **State changes inside a chapter need continuity.**
   Filtering suspects, switching theories and stepping a map should visually connect the
   outgoing and incoming state (Flip, masked panel transition, highlighted matrix row),
   rather than replacing content with a hard cut.

9. **Performance is directorial discipline.**
   Transform and opacity only. One persistent map camera, one pinned trajectory, one
   pinned horizontal strip. No particles, no constant canvas, no scroll-jacking.

## What was deliberately not copied

- No full-screen WebGL worlds, particles, glass panels, HUDs or gradient atmospheres.
- No scroll-hijacking or smooth-scroll replacement. Native scroll remains the input.
- No uniform reveal preset. Each chapter has its own motion language.
- No motion on body prose. Reading stability wins.

## Library decision

- **GSAP 3.15 + ScrollTrigger + `@gsap/react`** for pins, scrub, batching, timelines,
  cleanup and match-media branches. Already installed.
- **Flip** for the suspect filter re-layout.
- **MotionPathPlugin** for the aircraft marker on the route, and for following the drawn
  map/trajectory path.
- **No Three.js.** The flight and geography are diagrammatic in this edition. A WebGL
  scene would add weight, hurt legibility and contradict the print-dossier identity.
- Native CSS remains responsible for hover, focus and the existing UI transitions.
