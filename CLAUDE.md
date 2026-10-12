# Mechanik I Learning Lab — project memory

Interactive learning platform for the ETH Zürich **Mechanik I** course (lecture notes in German).
The student wants **depth over coverage**: mastering 10 pages well beats skimming 150.
Correctness > clarity > visuals > speed.

## Visualisation first — the student's #1 requirement (never skip)

Visualising is the most important part of learning mechanics. Every lesson is judged first by its pictures.
- **Every concept with a geometric or physical meaning gets a figure**: interactive (sliders, dragging) where the student can explore, animated where something moves or is constructed.
- **Every derivation gets a step-synchronised animation** (`StepPlayer` + a pure scene in `src/viz/anim/`), one animation step per derivation step, each step's final frame showing exactly what its caption says.
- **No red review boxes** (student's decision, D-012). A source problem is logged in `docs/REVIEW_LOG.md` and handled *inside* the lesson in one or two sentences where it matters (a caption, a misconception box, a quiz explanation). Long details go into a collapsible `<details className="more">`.
- Figures follow the lecture's own drawings (orientation of axes, point names like `M_x`, `M_xy`, `M_z`) and one colour system everywhere: x blue, y amber, z green, ρ teal, r dark, angles purple, points red.
- Keep explanations simple: short sentences, one idea per step, the picture does the heavy lifting.
- **Explain so a first-semester student understands it on first reading** (student's feedback: "manchmal schwieriger zu verstehen"):
  - start each idea in plain words or with an everyday picture (car, speedometer, odometer), *then* the formula;
  - say what every new symbol means the first time it appears ("s(t) = Weg entlang der Kurve, wie ein Kilometerzähler");
  - one formula per sentence at most; never chain three relations in one sentence;
  - explain *why* each step of the lecture is allowed (e.g. "ė_x = 0, weil sich e_x nie ändert"), and read compact lecture lines aloud ("So liest man die Zeile im Skript: 1. … 2. … 3. …");
  - animation captions: what you see first, then what it means; ≤ 3 short sentences;
  - avoid jargon without a translation ("Grenzwert" → "der Wert, dem man immer näher kommt").
- **No duplicate figures.** One good interactive figure per idea beats several small ones (the student removed the per-section 3D figures in favour of the one explorer at the end). Large 3D figures get a fullscreen button (`useFullscreen` in `viz/CoordinateExplorer.tsx`).
- Short topics stay short (e.g. p. 5 vectors): lecture box, one figure per concept.
- **No questions in the chapters** (D-015): no quizzes, predictions or tasks — chapters are pure explanation. Orange misconception boxes stay (the student likes them). Question ideas go into `docs/QUIZ_BANK.md` for the quiz part at the end of the course.
- Before calling a lesson done, **look at the rendered frames yourself** (`test-results/screens/`, `REVIEW_FRAMES=1 …` → `test-results/frames/`) in light and dark mode, on iPad and phone width. Passing tests do not prove a figure is right.
- When unsure whether something needs a visual: it does.

## Start of every session

1. Read `docs/PROGRESS.md` (where we are), `docs/REVIEW_LOG.md` (open issues), and the latest entry in `docs/SESSION_LOG.md`.
2. Check whether the lecture PDF is available (it is **not** committed — see `docs/DECISIONS.md` D-003). If it is not, ask the student to upload it, or work from `docs/SOURCE_MAP.md`, which transcribes every page.
3. Run `npm install && npm test` to confirm the baseline is green before changing anything.

## Non-negotiable rules

- **Never invent what the lecturer said.** Everything labelled "From the lecture" must be traceable to a printed page (`<Src p={…} />`). Anything else goes in a `supplement` box.
- **Keep the lecturer's notation.** Vectors underlined (`\v{r}` macro), cylindrical `(ρ, φ, z)`, spherical `(r, θ, ψ)` with **ψ = azimuth**, θ from +z. Full list: `docs/NOTATION.md`.
- **Source problems get a review ID** (`R-xxx` in `docs/REVIEW_LOG.md`) and are mentioned briefly where they matter in the lesson — no separate `review` box (D-012). Do not silently "fix" the source.
- **Every formula shown must be verified**: a test in `src/physics/*.test.ts` (numeric check of a closed form, or of a worked example), or a derivation shown step by step in the lesson. Numerical agreement is a check, not a proof — say so where it matters.
- **A topic is "review" status only when the full checklist in `docs/PROGRESS.md` is satisfied.** It becomes "complete" only after the student signs off.
- **Every mathematical symbol is typeset by KaTeX** — in headings, box titles, legends, quiz options, everywhere. Never type ρ, φ, θ, ψ, √, ², ⊥ … as plain text (a heading's φ would come out as a different glyph than the formula's \varphi). 3D sprite labels and SVG text use the KaTeX_Math font. The e2e test `plainTextMath` enforces this. (D-010)
- **Two complete languages, switchable (Deutsch / English).** Every visible text exists in both: lessons wrap content in `<T de={…} en={…} />`, components use `useTr()`. German uses Swiss orthography (ss, not ß), «Guillemets», decimal comma (`fmtNum`, `{,}` inside TeX) and `;` between tuple entries that contain decimal numbers (symbolic tuples like `(\rho, 0)` keep commas). In English mode, German lecture terms stay visible via `<De en="gloss">Begriff</De>`. Formulas are shared, never duplicated with different content. The e2e "no text in the other language" test enforces this. (D-002)

## Commands

```
npm run dev        # local dev server
npm test           # vitest: physics verification + content lint
npm run test:e2e   # playwright: renders every lesson in Chromium; fails on console/KaTeX errors
npm run check      # typecheck + unit + build + e2e — run before every commit
npm run build:artifact  # build for publishing (see below)
```

**Where the student sees it:** the website https://cheftaxi2000.github.io/mech1/ (GitHub Pages, deployed automatically from `main` by `.github/workflows/pages.yml`, D-019) and the private artifact https://claude.ai/artifact/NKD6xQuLjVjgiubQrXyvy4. After changing lessons, run `npm run build:artifact` and republish to that same URL (details: `docs/DECISIONS.md` D-008). The page declares `capabilities: {db: {}, user: {}}` for the student's sticky notes (D-016) — omit `capabilities` on redeploys to keep it; never pass `{}` (that would revoke the notes' storage).
In the cloud container, e2e needs `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
E2E writes screenshots to `test-results/screens/` — **look at them** after changing a visual; passing tests do not prove a figure is right.

## Layout

```
src/physics/      vec, coords, kinematics, rigid  (+ *.test.ts — the numeric source of truth)
src/components/   Tex (KaTeX + lecture macros), Blocks (Box/Src/Derivation/De/Section), Quiz
src/viz/          Scene (z-up r3f canvas), primitives (Arrow/Label/Curve/...), interactive figures (CoordinateExplorer, VectorFigures)
src/lessons/      one file per topic, registered in src/content/curriculum.ts
src/content/      curriculum registry, lint tests for lesson sources
docs/             PLAN, PROGRESS, SOURCE_MAP, NOTATION, REVIEW_LOG, DECISIONS, SESSION_LOG
e2e/              playwright specs
```

## Writing a lesson (template)

Follow `docs/PLAN.md` § "Lesson anatomy". In short: orientation → lecture box(es) with page refs → intuition → precise meaning → derivation (every step justified, animated) → interactive figure → worked example → misconceptions (orange boxes) → connections. No questions (D-015). Adapt; don't pad trivial topics.

Authoring gotchas:
- Inside JSX, a line break between text and an inline element swallows the space. Add `{' '}` (the lint test enforces this).
- Punctuation right after a formula goes into the formula's `p` prop: `<M p=".">{t`x = 0`}</M>` — otherwise the period can wrap onto the next line on its own (lint-enforced). Use `&nbsp;✓` for check marks.
- Write the German text as proper German, not a word-for-word translation of the English (and vice versa). In German mode, lecture boxes quote the Skript's own wording where possible.
- TeX in JSX: use ``<M>{t`\rho`}</M>`` with `const t = String.raw`.
- 3D labels: use `<Label>` (sprite, KaTeX_Math font). Do **not** use drei `<Html>` (D-004).
- Derivations that move (a construction, a sweep, a limit) get a step-synchronised animation: `<StepPlayer steps={[{ms, holdMs, caption}]}>{(step, t) => <Figure …/>}</StepPlayer>`, the figure built from a pure scene function like `viz/anim/cylScene.ts` (unit-test every frame: labels inside, colours, final frames). **Each step's final frame must show what its caption says.** 3D views start in the lecture's orientation (Fig. 1.4: x down-right, y up-right). Check the running frames (`REVIEW_FRAMES=1 npx playwright test e2e/animation-frames.spec.ts` → `test-results/frames/`), not only end states. (D-009)
- Three.js scenes are z-up; pass physics coordinates directly.

## End of every session

Update `docs/PROGRESS.md`, `docs/REVIEW_LOG.md`, and append to `docs/SESSION_LOG.md`. Run `npm run check`. Commit.
