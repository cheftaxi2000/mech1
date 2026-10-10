# Mechanik I Learning Lab — project memory

Interactive learning platform for the ETH Zürich **Mechanik I** course (lecture notes in German).
The student wants **depth over coverage**: mastering 10 pages well beats skimming 150.
Correctness > clarity > visuals > speed.

## Start of every session

1. Read `docs/PROGRESS.md` (where we are), `docs/REVIEW_LOG.md` (open issues), and the latest entry in `docs/SESSION_LOG.md`.
2. Check whether the lecture PDF is available (it is **not** committed — see `docs/DECISIONS.md` D-003). If it is not, ask the student to upload it, or work from `docs/SOURCE_MAP.md`, which transcribes every page.
3. Run `npm install && npm test` to confirm the baseline is green before changing anything.

## Non-negotiable rules

- **Never invent what the lecturer said.** Everything labelled "From the lecture" must be traceable to a printed page (`<Src p={…} />`). Anything else goes in a `supplement` box.
- **Keep the lecturer's notation.** Vectors underlined (`\v{r}` macro), cylindrical `(ρ, φ, z)`, spherical `(r, θ, ψ)` with **ψ = azimuth**, θ from +z. Full list: `docs/NOTATION.md`.
- **Source problems get a review ID** (`R-xxx` in `docs/REVIEW_LOG.md`) and a `review` box in the lesson. Do not silently "fix" the source.
- **Every formula shown must be verified**: a test in `src/physics/*.test.ts` (numeric check of a closed form, or of a worked example), or a derivation shown step by step in the lesson. Numerical agreement is a check, not a proof — say so where it matters.
- **A topic is "review" status only when the full checklist in `docs/PROGRESS.md` is satisfied.** It becomes "complete" only after the student signs off.
- Teaching language: English explanations, German lecture terms kept and glossed (`<De en="…">…</De>`). (D-002)

## Commands

```
npm run dev        # local dev server
npm test           # vitest: physics verification + content lint
npm run test:e2e   # playwright: renders every lesson in Chromium; fails on console/KaTeX errors
npm run check      # typecheck + unit + build + e2e — run before every commit
```
In the cloud container, e2e needs `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
E2E writes screenshots to `test-results/screens/` — **look at them** after changing a visual; passing tests do not prove a figure is right.

## Layout

```
src/physics/      vec, coords, kinematics, rigid  (+ *.test.ts — the numeric source of truth)
src/components/   Tex (KaTeX + lecture macros), Blocks (Box/Src/Derivation/De/Section), Quiz
src/viz/          Scene (z-up r3f canvas), primitives (Arrow/Label/Curve/...), interactive figures
src/lessons/      one file per topic, registered in src/content/curriculum.ts
src/content/      curriculum registry, lint tests for lesson sources
docs/             PLAN, PROGRESS, SOURCE_MAP, NOTATION, REVIEW_LOG, DECISIONS, SESSION_LOG
e2e/              playwright specs
```

## Writing a lesson (template)

Follow `docs/PLAN.md` § "Lesson anatomy". In short: orientation → lecture box(es) with page refs → intuition → precise meaning → derivation (every step justified) → interactive figure → worked example → misconceptions → active checks (predict / choice / numeric, each wrong answer explained) → connections. Adapt; don't pad trivial topics.

Authoring gotchas:
- Inside JSX, a line break between text and an inline element swallows the space. Add `{' '}` (the lint test enforces this).
- TeX in JSX: use ``<M>{t`\rho`}</M>`` with `const t = String.raw`.
- 3D labels: use `<Label>` (sprite). Do **not** use drei `<Html>` (D-004).
- Three.js scenes are z-up; pass physics coordinates directly.

## End of every session

Update `docs/PROGRESS.md`, `docs/REVIEW_LOG.md`, and append to `docs/SESSION_LOG.md`. Run `npm run check`. Commit.
