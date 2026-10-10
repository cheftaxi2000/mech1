# Plan

## What the source actually contains
22 PDF pages = printed pp. 3–23 (minus p. 9, supplied separately as a screenshot) + one page of slide photos + one handwritten page. Three chapters:
1. Bewegung eines materiellen Punktes (coordinates, vectors, bases) — pp. 3–7
2. Geschwindigkeit (velocity, speed, curvilinear bases, circular motion) — pp. 8–11
3. Starrer Körper (SdpG, translation, rotation, rolling, Kreiselung, general motion) — pp. 12–23

The user prompt mentions ~150 pages; this PDF is the first 23. More material will arrive later — append to `SOURCE_MAP.md` and `curriculum.ts` as it does.

## Teaching order (lecture order, with dependencies)

| # | Topic id | Printed pp. | Depends on | Key interactive / verification ideas |
|---|---|---|---|---|
| 1 | koordinaten | 3–4 | — | ✅ 3D coordinate explorer; quadrant trap |
| 2 | vektoren | 5 | 1 | drag a̲, b̲: live dot product as projection, cross product as oriented parallelogram area; right-hand rule check |
| 3 | basen | 5–7 | 1, 2 | local basis at M moves with M; "same vector, different components" widget; (R, φ, z₀) vs (R, 0, z₀) |
| 4 | geschwindigkeit | 8–9 | 3 | secant Δr̲/Δt → tangent as Δt → 0 animation; chord vs arc length → ratio 1; chain rule v̲ = τ̲ṡ; product rule in Cartesian vs cylindrical basis (why ė̲_ρ ≠ 0 is the whole story) |
| 5 | v-krummlinig | 10 | 3, 4 | ė̲_ρ = φ̇ e̲_φ visual (rotating basis); decompose v̲ into ρ̇, ρφ̇, ż parts live; solve p. 10 Beispiel |
| 6 | kreisbewegung | 11 + slides | 5 | ω̲ × r̲ field; why z₀ drops out; Winkelschnelligkeit vs Winkelgeschwindigkeit |
| 7 | sdpg | 12–13 | 2, 4 | rigid bar with arbitrary end velocities: projections must match; ladder simulation (R-006) |
| 8 | translation | 13–14 | 7 | congruent trajectories, circular translation (Ferris-wheel gondola), momentary translation |
| 9 | rotation | 15–19 | 6, 7 | velocity distribution Fig 3.8 in 3D; proofs with R-003/R-009/R-010; cube example (R-004/R-005 pending) |
| 10 | rollen | 20 | 9 | rolling wheel: contact point at rest, instantaneous axis; slip slider |
| 11 | kreiselung | 20–21 | 9 | spinning top, instantaneous axis as E_M ∩ E_N (R-012) |
| 12 | allgemein | 22–23 | 8, 11 | v̲_M = v̲_B + ω̲ × BM; change reference point, ω̲ invariant; cube solver (R-007) |

Recommended pace: one topic per study session, with the student working through the checks before moving on.

## Lesson anatomy
Adapt to the topic; never pad.
1. **Orientation** — what the lecturer is doing here and why.
2. **From the lecture** boxes, each with `<Src p=…/>`, in the lecture's notation.
3. **Intuition / mental model.**
4. **Precise meaning** of every symbol (scalar vs vector, units, ranges, frames).
5. **Derivation** — every non-trivial step justified, limiting cases checked.
6. **Interactive figure** — must show the *same* situation as the equations.
7. **Worked example** — lecture's own first; supplements labelled.
8. **Misconceptions.**
9. **Active checks** — predict-then-reveal, multiple choice with per-option explanations, numeric answers.
10. **Connections** — backward and forward, with page refs.

## Architecture
- `src/physics` is the single numeric source of truth. Figures and tests import from it; lessons never hand-roll formulas in figure code.
- Lessons are TSX (typed, lintable). TeX via `<M>`/`<MD>` with project macros (`\v`, `\e`).
- `curriculum.ts` drives navigation and status badges; e2e iterates over it, so a new lesson is tested automatically.

## Quality gates (automated)
- `npm test`: physics verification (closed forms vs numerics, every worked example), content lint (JSX whitespace, registry consistency).
- `npm run test:e2e`: every written lesson renders, zero console errors, zero KaTeX errors, ≥ 20 formulas, interactive smoke tests, phone width has no horizontal scroll, screenshots for human review.

## Not yet built (candidate infrastructure, add when a lesson needs it)
- Progress persistence for the student (which checks were answered) — localStorage, per-viewer.
- Glossary page DE ↔ EN generated from `<De>` usages.
- Spaced-repetition review across lessons.
- Deployment (GitHub Pages or Claude artifact) — ask the student.

## Open questions for the student
1. ~~Missing p. 9~~ (received). Printed pages 1–2 (R-002): do they contain anything beyond a title page / contents?
2. R-004/R-005 (cube example p. 19) — is there an official solution?
3. Teaching language: English with German terms (current) — or German throughout?
4. May the lecture PDF be committed to this repo (D-003)?
5. Remaining ~130 pages: when should they be added?
