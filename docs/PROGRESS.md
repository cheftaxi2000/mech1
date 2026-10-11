# Progress

## Completion checklist (a topic may be set to `review` only when all are ✅)
1. Source pages examined (rendered page images, not the text layer).
2. Every lecture equation transcribed in `SOURCE_MAP.md` and shown with a page ref.
3. Physics verified: closed forms tested in `src/physics/*.test.ts`; worked examples tested; source issues logged in `REVIEW_LOG.md`.
4. Explanation coherent: intuition → meaning → derivation → example → misconceptions → checks → connections.
5. Essential visualisation works and was visually inspected (screenshot), showing the same situation as the equations.
6. All math renders (e2e: no `.tex-error`, no console errors).
7. Question ideas for the final quiz part recorded in `docs/QUIZ_BANK.md` (no questions in the chapter itself, D-015).
8. Implementation tested (`npm run check` green).
9. Documented here and in `SESSION_LOG.md`.
10. Complete in **both languages** (German and English), passing the e2e language-leak test.
11. Every symbol typeset by KaTeX, one glyph per symbol (e2e `plainTextMath`, lint).
12. **Visualisation first:** every concept has a figure, every derivation a step-synchronised animation whose final frames match the captions; source issues mentioned briefly where they matter (no red boxes, D-012); running frames inspected in light/dark, iPad/phone.

`complete` additionally requires the student's sign-off after working through the lesson.

## Status

| Topic | Pages | Status | Notes |
|---|---|---|---|
| koordinaten | 3–4 | **complete** | Signed off by the student 2026-10-11. Quizzes moved to the quiz bank (D-015). |
| vektoren | 5 | **complete** | Signed off by the student 2026-10-11. Quizzes moved to the quiz bank (D-015). |
| basen | 6–7 | **complete** | Signed off by the student 2026-10-11. |
| geschwindigkeit | 8–9 | **complete** | Signed off by the student 2026-10-11 (after the plain-language rewrite). |
| v-krummlinig | 10 | **complete** | Student continued («weiter») after review; CurvilinearVelocity fixed after the student's report (path drawn, v tangent to it). |
| kreisbewegung | 11 | **complete** | Student continued («mach weiter mit dem nächsten Kapitel»). |
| sdpg | 12–13 | **complete** | Broomstick intuition; rigidity (Fig. 3.1, a·b const); SdpG with `SdpgDemo` (choose v_M and ω, projections equal; «Körper dehnt sich» breaks it); proof as 5-step animation (`sdpgScene.ts`, 4 frame tests) + read-out; ladder example with `LadderDemo` (slide, v_V = v_H cot α), R-006 one sentence; 3 misconceptions; `sdpg.test.ts`. Frames inspected iPad, phone, dark. Signed off 2026-10-11. |
| translation | 13–14 | **review** | Definition (p. 13): a = MN keeps length *and* direction, Fig. 3.4 as 4-step animation (`transScene.ts`, 4 frame tests: t₁ → t with equal displacements → t₂ congruent paths → v_M = v_N, ȧ = 0); «So liest man das». p. 14 straight / curved / circular translation with `TranslationDemo` (M, N, P with paths and equal velocity arrows; «Vergleich: Drehung» with concentric circles of different radii; pure `demoFrame`, label placement tested in `translationDemo.test.ts`). Momentary translation (p. 14) with the supplement `SliderCrank` (ω_rod = 0 only when the crank is vertical; `translation.test.ts`), R-016 in a `<details>`. 3 misconceptions. p. 14 cube example empty (R-008). Frames inspected iPad, phone, dark. **Awaiting sign-off.** |
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
