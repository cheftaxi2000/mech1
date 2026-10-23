# Lineare Algebra I — sources, notation, figure conventions (D-026)

**Sources.** *Annotated slides* of the exercise classes by Mårten Olofsson (ETH, HS 2026; PDFs from polybox, **not committed**, like D-003) and his interactive HTML visualisations «Why linear algebra» (Lesson 01), «Column Picture – Ax = b» (Lesson 03), «Matrix as a Transformation» (Lesson 04), «Composing Transformations» (Lesson 05). Provided: slides of exercise classes 1, 2 and 4. **Not provided: slides of classes 3 and 5**; class 3 content is covered by the recap in class 4 (slides 5–13) and the Lesson 03 visualisation, class 5 by the Lesson 05 visualisation and the product slides of class 4. Chapters are named after the exercise classes («Woche n»). Transcriptions: `SOURCE_U01.md`, `SOURCE_U02.md`, `SOURCE_U04.md` (slide numbers = PDF page numbers; the printed slide numbers repeat on build slides).

**Source labels.** `pages: 'Ü<n>/<slides>'` in `curriculum.ts`; in lessons `<Src u={n} p="…" slides />` for slides and `<Src u={n} vis="Column Picture" />` for a visualisation. Boxes «Aus der Übung» (`Box kind="uebung"`) quote slides; everything else is a supplement. Handwriting on the slides is lecture content (the TA wrote it).

**Notation (as on the slides).** Matrix A ∈ ℝ^{m×n} («Zeilen zuerst, Spalten später»: m rows, n columns), entry A_{ij} (row i, column j); unknowns x₁ … x_n; right-hand side b; augmented matrix («Erweiterte Matrix») [A | b]; equations E₁, E₂, … and row operations written «II − I», «III − 2·I» (the red circled numbers on the slides are the multiples); pivot («Pivot»), pivot / free variables, free parameter α, solution set L («Lösungsmenge»); row-echelon form («Zeilen-Stufen-Form»), reduced («Vereinfachte Zeilen-Stufen-Form»); rank r («Rang»); identity 𝕀 («Einheitsmatrix»), lower / upper triangular L, R («Links-/Rechts-Dreiecksmatrix»), transpose Aᵀ, symmetric Aᵀ = A, antisymmetric A = −Aᵀ. English terms with German glosses in English mode (`<De>`).

**Colour roles** (the colours of the TA's visualisations; `Plot` roles, CSS variables `--la-*` in `design.css`):

| role | meaning | colour |
|---|---|---|
| `c1` | first column a₁ of A, image of e₁, first unknown's term x₁a₁ | green |
| `c2` | second column a₂, image of e₂, x₂a₂ | blue |
| `tgt` | target b (right-hand side) | red |
| `ax` | the combination A x | dark (foreground) |
| `miss` | the miss Ax − b, "this entry / part" | orange |
| `c3` | product / composition C = AB, third item | purple |
| `aux` | span line, helper lines | grey |

In the 2-D line pictures E₁ is `f` (blue), E₂ `g` (magenta) as in the Analysis plots; combined equations `sec` (teal). 3-D planes: x blue, y amber, z green are for *axes*; the three planes use `f`, `g`, `sec` hues.

**Shared code.** `src/linalg/` — `frac.ts` (exact rationals), `gauss.ts` (elimination with recorded row operations, reduced form, solution sets, classification), `plane2.ts` (2×2 column picture analysis, composition, `interp`), all with tests. Plot helpers `ELine`, `GridWarp` in `src/viz/plot/Plot.tsx`.
