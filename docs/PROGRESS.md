# Progress

## Completion checklist (a topic may be set to `review` only when all are ✅)
1. Source pages examined (rendered page images, not the text layer).
2. Every lecture equation transcribed in `SOURCE_MAP.md` and shown with a page ref.
3. Physics verified: closed forms tested in `src/physics/*.test.ts`; worked examples tested; source issues logged in `REVIEW_LOG.md`.
4. Explanation coherent: intuition → meaning → derivation → example → misconceptions → checks → connections.
5. Essential visualisation works and was visually inspected (screenshot), showing the same situation as the equations.
6. All math renders (e2e: no `.tex-error`, no console errors).
7. Active checks are meaningful (every wrong option explained).
8. Implementation tested (`npm run check` green).
9. Documented here and in `SESSION_LOG.md`.
10. Complete in **both languages** (German and English), passing the e2e language-leak test.
11. Every symbol typeset by KaTeX, one glyph per symbol (e2e `plainTextMath`, lint).
12. **Visualisation first:** every concept has a figure, every derivation a step-synchronised animation whose final frames match the captions; source issues mentioned briefly where they matter (no red boxes, D-012); running frames inspected in light/dark, iPad/phone.

`complete` additionally requires the student's sign-off after working through the lesson.

## Status

| Topic | Pages | Status | Notes |
|---|---|---|---|
| koordinaten | 3–4 | **review** | Checklist 1–12 ✅ (DE + EN). Feedback rounds 1–3 applied: both derivations animated, motion demo, professor review fixes; round 3: R-001 boxes and section figures removed (D-012, D-013), explorer fullscreen. **Awaiting the student's sign-off to mark complete.** |
| vektoren | 5 | **review** | Short lesson (student's wish): Ortsvektor figure with motion and Cartesian components, scalar product as projection (drag demo), cross product 3D (parallelogram area, swap order), Rechtssystem cycle, component formulas as supplement; 15 tests in `vec.test.ts`; DE + EN; frames inspected (iPad, phone, dark). **Awaiting sign-off.** |
| basen | 5–7 | planned | |
| geschwindigkeit | 8–9 | planned | p. 9 now available and transcribed; its claims verified (R-013, R-014) |
| v-krummlinig | 10 | planned | formulas already verified in tests |
| kreisbewegung | 11 | planned | ω × r verified |
| sdpg | 12–13 | planned | SdpG + ladder verified |
| translation | 13–14 | planned | |
| rotation | 15–19 | planned | R-003 verified; R-004/R-005 open |
| rollen | 20 | planned | |
| kreiselung | 20–21 | planned | |
| allgemein | 22–23 | planned | cube example verified (R-007) |

## Polish backlog
- Animation: during the four-quadrant sweep, labels near O can briefly crowd each other in quadrants II/III (transient, final frames are clean and tested).
- koordinaten: labels O, θ, ψ crowd each other when M is near the origin; consider offsetting the O label and drawing angle labels outside the arcs.
- koordinaten: optional "animate φ" button to preview Kreisbewegung.
- vektoren: in the position-vector figure, e̲_y lies partly under r̲ near O for some t (3D overlap, readable).
- Bundle size: three.js chunk > 500 kB; split the 3D figures into their own lazy chunk when more lessons exist.
