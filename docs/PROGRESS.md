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

`complete` additionally requires the student's sign-off after working through the lesson.

## Status

| Topic | Pages | Status | Notes |
|---|---|---|---|
| koordinaten | 3–4 | **review** | Checklist 1–9 ✅. Awaiting student. Polish backlog below. |
| vektoren | 5 | planned | |
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
- koordinaten: labels O, θ, ψ crowd each other when M is near the origin; consider offsetting the O label and drawing angle labels outside the arcs.
- koordinaten: optional "animate φ" button to preview Kreisbewegung.
- Bundle size: three.js chunk > 500 kB; split the 3D figures into their own lazy chunk when more lessons exist.
