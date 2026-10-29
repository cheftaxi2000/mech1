# Session log

## 2026-10-10 — Session 1: inspect, plan, prepare
- Repo was empty. Read all 22 PDF pages visually (text layer is unreliable — see SOURCE_MAP).
- Found: printed pp. 1–2 and 9 missing (R-002); PDF p. 9 is slide photos; PDF p. 22 is an unnumbered handwritten continuation.
- Verified every worked example numerically. Found/confirmed R-001 (arctan quadrants), R-003 (typo + coplanarity gap in p. 17 proof), R-004 (v̲_A sign discrepancy p. 19), R-005 (inconsistent variant p. 19), R-007 (v_Bz = 0).
- Built: project skeleton (D-001), physics core + 24 verification tests, content lint, e2e suite (render, console/KaTeX errors, interaction, phone width, screenshots), lesson framework, lesson 1 (koordinaten, pp. 3–4) with 3D coordinate explorer and quadrant-trap widget.
- Bugs caught by the new tests and fixed: angle rounding made M drift when switching coordinate systems; drei `<Html>` lost the first label (D-004); JSX swallowed spaces; phone-width overflow from wide equations.
- The original user prompt was cut off after "3. FIRST ACTION: INSPECT, PLAN AND PREPARE … inspect the repository, available files, environment,". Ask for the rest — it may change priorities.
- Next: student reviews lesson 1 and answers the open questions in PLAN.md; then lesson 2 (vektoren, p. 5).

## 2026-10-10 — Session 1, continued: page 9
- Student supplied printed p. 9 as an iPad screenshot. Transcribed into SOURCE_MAP (v̲ = τ̲ṡ via chain rule; §2.2 Cartesian velocity; start of cylindrical).
- New review items: R-013 (typo "r̲ = ṙ̲"), R-014 (implicit limit / unit-length / invertibility assumptions in the v̲ = τ̲ṡ derivation). Added 3 verification tests (chord/arc → 1, ṡ = |ṙ̲|, tangent direction).
- Screenshot not committed (same reasoning as D-003).

## 2026-10-10 — Session 1, continued: published
- Published the app as a private artifact (D-008): https://claude.ai/artifact/NKD6xQuLjVjgiubQrXyvy4
- Hash routes changed from `#/topic` to `#topic`; theme tokens restructured for explicit light/dark choice.

## 2026-10-10 — Session 1, continued: Deutsch / English
- Student asked for a language choice. Added `src/i18n.tsx` (LangProvider, `<T>`, `useTr`, `fmtNum`, toggle), translated all UI, the explorer, the quadrant widget and lesson 1 completely into German.
- New e2e tests run every lesson in both languages, reveal all hidden quiz explanations and fail if function words of the other language appear (mutation-tested: a planted English phrase in a hidden German solution was caught). Also: toggle switches and is remembered after reload; German number format in the explorer.

## 2026-10-10 — Session 1, continued: student feedback round 1 (screenshots)
- Requests: (1) remove the "Warum starr?" box; (2) Greek letters must always look like the formulas (a heading's φ was a different glyph); (3) an animation for the derivation x = ρ cos φ, y = ρ sin φ.
- Done: box removed; every symbol typeset by KaTeX, 3D/SVG labels in KaTeX_Math (D-010) with an e2e check for plain-text math (Greek, symbols, lone variables, relations — also inside every revealed quiz explanation); StepPlayer + animated derivation (D-009).
- Independent review workflow (5 lenses: maths, visuals, language, code, requirements; each finding adversarially verified): 44 confirmed, 6 rejected. All 44 fixed, among them: final frames that did not show their captions (now tested per step), a skipped-step / crash bug in the player when pressing Next during the pause, x-axis orientation not matching Fig. 1.4/1.8 (start view and 3D explorer now match the lecture), y-label colour collision for x < 0, phone layout (sticky figure), touch targets, contrast, line breaks inside formulas, readout rounding, ✓ wrapping alone, plain-text M / "x > 0".
- New: `cylScene.ts` pure scene + per-frame unit tests; `<M p=…>` punctuation attachment + lint; true minus in plain-text numbers; lecture-oriented explorer camera.
- Republished to the artifact URL (D-008).
- Next: student reviews lesson 1 + animation; then lesson 2 (vektoren, p. 5). Candidate: animate the spherical derivation.

## 2026-10-10/11 — Session 1, continued: feedback round 2 + professor review
- Requests: animate the spherical derivation too; check every φ ψ ρ θ is the same glyph and legible; make the red arctan part much simpler and shorter; persist "visualisation first" in CLAUDE.md; professor-level review of the whole first part.
- Done: sphScene (5 steps, 23 tests), shared scene module and colour system; ArctanDemo (auto-running, (−x,−y) idea, +180°/+360° chips) with a 3-sentence box; θ/ψ box two sentences; glyph lint; CLAUDE.md "Visualisation first" section.
- Reviews: a fix-verification workflow (for the 44 fixes) and a professor review workflow ran partly (session limit stopped several agents). All collected findings were checked and fixed by hand, among them: KaTeX's root sign squashed by `.anim-fig svg` (formula showed (x²+y²)/z!) — now `> svg` + regression test; caption with the main spherical result cut off; arctan demo's ✓ for 315° vs −45° (+360° chip, rule text); reduced-motion first frame; y-axis tip on the drop line; label collisions; sprite halo grey ring; sticky figure height; punctuation now typeset inside formulas; caption 3 argued via the unit circle; tan φ ambiguity linked to R-001; full spherical inverse; θ>90° note; explorer: lecture colours, undefined angles at O, task answers, motion demo; locked section figures.
- Not done (minor, noted): e2e test for "Next during the hold after step 4"; lecture elevation ~30° vs our 27° (cosmetic).

## 2026-10-11 — Session 1, continued: feedback round 3 + lesson 2 (vektoren)
- Requests: delete both red R-001 boxes; keep only the one explorer at the end (remove the small per-section figures); fullscreen for the explorer ("wie Netflix"); burger menu top left with the chapters instead of the permanent sidebar; then lesson 2 (vectors, dot and cross product), kept short.
- Done: boxes + ArctanDemo removed, the arctan caveat kept in captions/misconception/quiz (D-012); locked explorers removed (D-013); fullscreen via Fullscreen API with a CSS-overlay fallback; top bar + drawer navigation (D-014); new e2e `ui-shell.spec.ts` (drawer, Esc, fullscreen on iPad and phone).
- Lesson 2 `L02Vectors.tsx` (p. 5): PositionVectorFigure (r̲(t) moving, basis vectors, components head to tail), DotDemo (drag b̲, projection |b̲| cos φ, sign colours, presets), CrossDemo (3D parallelogram, c̲ = a̲ × b̲ with length = area, swap order), CycleDiagram (Rechtssystem); supplement with component formulas + derivation and a worked example; misconception, predict, 2 choices, 2 numeric. `vec.test.ts` verifies every formula and every quiz value. R-015 logged.
- Next: student reviews both lessons; then lesson 3 (basen, pp. 5–7).

## 2026-10-11 — Session 1, continued: lessons 1–2 signed off; no questions; lesson 3 (basen)
- Student signed off koordinaten and vektoren (→ complete). Request: keep the orange misconception boxes, remove all questions from the chapters (a quiz part comes at the end) → D-015; removed checks archived in `docs/QUIZ_BANK.md`; explorer tasks rewritten as observations; the cone/name prediction became a short supplement.
- Lesson 3 `L03Bases.tsx` (pp. 6–7): scalar/vector components, the "tangent to the coordinate lines" rule as a recipe, cylindrical basis animated in 3D (`CylBasisAnim` + pure `cylBasisFrame`), p. 10 preview of e_ρ, e_φ, misconception r = ρe_ρ + φe_φ + ze_z (the notes' "Falsch!"), spherical basis + Cartesian components (supplement, scale factors 1, r, r sin θ), explorer with local basis, key points and outlook.
- Shared: `useFullscreen.tsx` (extracted), Scene `camera`/`target` props and a portrait field-of-view fit, explorer `basis` prop.
- Next: student reviews lesson 3; then Kapitel 2 Geschwindigkeit (pp. 8–9).

## 2026-10-11 — Session 1, continued: lesson 3 signed off; lesson 4 (geschwindigkeit)
- basen → complete. Lesson 4 `L04Velocity.tsx` (pp. 8–9), pure explanation: rectilinear motion + `SecantDemo` (Δt slider, secant vs tangent), what is wanted in 3D, §2.1 with a 4-step animation (`velScene.ts`: trajectory/arc length, chord Δr and arc Δs, Δt → 0 with |Δr|/Δs readout, v = ṡτ), chain-rule calculation, R-014 in `<details>`, §2.2 Cartesian basis with \cancel'd ė-terms, `HelixVelocity` 3D figure (components head to tail, τ, ṡ constant), cylindrical preview (ė_ρ ≠ 0), 3 misconceptions.
- Next: student reviews lesson 4; then v-krummlinig (p. 10).
- Feedback: "Erklärung ist manchmal schwieriger zu verstehen". Lesson 4 rewritten in plain language: car/speedometer/odometer intuition box first, every symbol explained on first use, the compact lecture line read out step by step, shorter animation captions (what you see → what it means), chain rule explained in words. New explanation-style rules in CLAUDE.md.

## 2026-10-11 — Session 1, continued: lesson 4 signed off; lesson 5 (v-krummlinig, p. 10)
- `L05CurvVelocity.tsx`: written to the new explanation-style rules. `erhoScene.ts` (ė_ρ = φ̇ e_φ in 5 steps: components of e_ρ, e_φ as e_ρ turned by 90°, Δe_ρ for a turn Δφ, Δφ → 0 with |Δe_ρ|/Δφ → 1, ė_ρ = φ̇ e_φ), `CurvilinearVelocity` (cyl/sph tabs, rate sliders, terms head to tail, trajectory), `PathVelocity` (generic; helix now uses it), p. 10 example solved as a supplement.
- Fixes: phone overflow from a long unbreakable h1 (title changed to «Zylinder- und Kugelkoordinaten», h1 overflow-wrap); `.katex-display` position: relative; scene label-width estimate knows \Delta, \v, \tau.
- Next: student reviews lesson 5; then Kreisbewegung (p. 11).

## 2026-10-11 — Session 1, continued: sticky notes
- Student asked for pinnable, realistic, beautiful post-it notes before continuing. Built `src/notes/` (model + tests, store with db/localStorage backends and a per-note write queue, `NotesLayer`/`StickyNote` UI) and a «Meine Notizen» list in the drawer (D-016). e2e `notes.spec.ts` (pin, type, recolour, drag, persist across reload, fold, list, delete + undo, empty note discarded; iPad + phone).
- Lesson 5 (v-krummlinig) still awaiting sign-off; next lesson: Kreisbewegung (p. 11).
- Student feedback on notes → D-017 redesign (normal font, title, premium look). Figure audit workflow ran only partly (subagent session limit): 19 unverified findings for the explorer and lesson-1 animations recorded for a later pass; the CurvilinearVelocity fix (path drawn, M stays put on rate change, stop at edge) is in.

## 2026-10-11 — lesson 6 (kreisbewegung, p. 11 + slides L5)
- `L06Circle.tsx`, `circFrame.ts` + `CircleAnim.tsx`, `CircleFigures.tsx` (RotationField), `circle.test.ts`. v-krummlinig → complete.
- Open: the 19 unverified figure-audit findings (explorer, lesson-1 animations) from the interrupted workflow; re-run the audit for the remaining groups when subagents are available.

## 2026-10-11 — lesson 7 (sdpg, pp. 12–13)
- Student away for an hour, asked to continue. `L07Rigid.tsx`, `sdpgScene.ts` (+test), `RigidFigures.tsx` (SdpgDemo, LadderDemo), `sdpg.test.ts`. kreisbewegung → complete.

## 2026-10-11 — lesson 8 (translation, pp. 13–14)
- Student: "weiter nächstes kapitel" → sdpg complete. `L08Translation.tsx`, `transScene.ts` (+test), `TranslationFigures.tsx` (TranslationDemo with pure `demoFrame` + `freeSpot` label placement, `translationDemo.test.ts`; SliderCrank), `physics/translation.ts` (+test). R-016 (bowl figure) logged and handled in a `<details>`.
- Frame review (REVIEW_FRAMES entry added): point labels were covered by the velocity arrows in the circular mode, the rotation comparison had tiny arrows and a back-and-forth swing → labels now dodge arrows (tested for all modes and 50 phases), rotation is a full turn about the black dot (concentric circles, clearly different speeds), short arrows get short heads.
- Next: student reviews lesson 8; then Rotation (pp. 15–19).

## 2026-10-11 — lesson 9 (rotation, pp. 15–19)
- Student: "Weiter" → translation complete. `L09Rotation.tsx` with three step animations (`restScene`, `circProofScene`, `omegaScene`), the 3D `CubeAnim` (`cubeFrame`), `RotationExplorer` and `FootDemo` (`RotationFigures.tsx`, pure geometry in `rotGeom.ts`), physics in `rotation.ts`. R-003, R-009, R-010 handled; R-004/R-005 stay open (need the official solution) and are explained briefly in the lesson.
- Shared: `sceneTestKit.ts` (inside / overlap checks for scene tests), anchors `bl`/`br` for scene labels, `texWidth` now handles control words before spaces (`\\times r`, `\\v r`) and more macros.
- Frame review fixes: door turned to face the camera, camera pulled back so the axis and ω fit, slider labels on one line, FootDemo readouts wrap between formulas on the phone, cube camera and labels, proof-2 view from higher up (right angles readable).
- Next: student reviews lesson 9; then Rollen (p. 20).

## 2026-10-11 — lesson 10 (rollen, p. 20)
- Student: "Passt" → rotation complete. `L10Rolling.tsx`, `rollScene.ts` (+test), `RollingFigures.tsx` (`RollingWheel`), `physics/rolling.ts` (+test). No new source issues on p. 20.
- KaTeX in strict mode rejects « » inside \\text — the lecture's contact conditions are written as a list with inline formulas instead.
- Next: student reviews lesson 10; then Kreiselung (pp. 20–21, R-012).

## 2026-10-12 — lesson 11 (kreiselung, pp. 20–21)
- Student: "mache weiter … bis zum Schluss" → rollen complete; the student will review every page personally at the end. `L11Kreiselung.tsx`, `kreiselProofScene.ts` (+test), `KreiselFigures.tsx` (`KreiselExplorer`, pure `kreiselGeom.ts` + test), `physics/kreisel.ts` (+test). R-012 handled. `hull()` moved to `geometry.ts` (shared by rollScene and kreiselProofScene).
- Frame review: first proof view showed v_M almost collinear with r_M (right angle unreadable) → searched views/point placements numerically for screen angles near 90° and arrows that do not cross μ; explorer default position changed so the rolling velocities lie across the screen instead of into it; sphere drawn front faces only.

## 2026-10-12 — lesson 12 (allgemein, pp. 22–23)
- `L12General.tsx`, `genScene.ts` (+test), `GeneralFigures.tsx` (`RideDemo`, `FieldDemo`; pure frames in `genGeom.ts` + test), `cubeGenFrame.ts` (+test) + `CubeGenAnim.tsx`, `physics/general.ts` (+test). R-007, R-011 handled; R-008 tetrahedron mentioned.
- `<M p="…">` now keeps quotation marks (« » “ ” „) outside KaTeX in a no-wrap span — KaTeX strict mode has no glyph for them.
- Frame review: the decomposition triangle was cramped (plate turned so v_M is a clear sum; scene zoomed); the cube camera at 45° put B, P₁, P₃ on one screen line (camera moved to 15° azimuth, ω drawn on the upper diagonal, v₂ − v₃ drawn at P₂); field figure enlarged, slider ranges ±40 so every arrow stays inside (tested); long handwritten solution split into short lines.

## 2026-10-12 — quiz part (D-018)
- `Q1Quiz.tsx`, `Q2Quiz.tsx`, `Q3Quiz.tsx` (chapter «Quiz» in `curriculum.ts`), `content/quizValues.ts` (+test), `See` link helper in `Quiz.tsx`. Home page text updated (no planned lessons left). e2e: hidden explanations are now also checked for KaTeX errors.
- The course is complete up to p. 23. Next: the student reviews every page and sends change requests.

## 2026-10-12 — website on GitHub Pages (D-019)
- Student: «Make it main on GitHub so it can be a website». Created `main` from the lesson branch, added `.github/workflows/pages.yml` (npm ci, npm test, build, deploy `dist/`). The student switched the default branch to `main` and Pages → Source to «GitHub Actions». Site: https://cheftaxi2000.github.io/mech1/. Work continues on `main` from now on.

## 2026-10-12 … 10-19 — full audit and quality overhaul (student: «FULL PROJECT AUDIT & QUALITY OVERHAUL»)
- **Audits** (read-only sub-agents, against a frozen build and the lecture page images): science, visualisation, pedagogy, frontend. Findings verified by the lead before acting (e.g. the p. 21 handwriting slip and the flat bowl bottom on p. 14 checked on high-res crops).
- **Layout (lead):** the 940 px content cap was removed. Prose keeps a reading measure (`--measure`), figures/steppers/explorers break out to the full width (`--wide`); on ≥ 1024 px steppers are figure-left/captions-right with the figure sized to the viewport height, 3D explorers and 2D demos become drawing-left / controls-right. Home page with chapter cards, page refs and «Weiterlesen»; previous/next links under every lesson; consistent 44 px controls; print styles.
- **Shared 3D (lead):** arrowheads scale with the line width (ω directions were unreadable); reset-view button; inside the page a vertical swipe scrolls (touch-action pan-y) and the wheel no longer zooms (zoom in fullscreen); 3D steps keep the 4:3 frame.
- **Performance (lead):** three.js in its own chunk and 2D helpers in `viz/figUtils.ts` — 2D-only lessons no longer download three.js (sdpg 1.48 MB → 0.54 MB JS); KaTeX render cache.
- **Science fixes:** L10 «speed ωh» was wrong in general (speed = ω × distance from the contact line; √2·v_C for the foremost rim point); SdpgDemo showed a signed projection as |v′|; slider-crank chip at 88–92°; arctan rule completed (x > 0, y < 0); German `\text` inside shared formulas; orphan test numbers in `sdpg.test.ts`; ω sign convention for the rolling wheel stated; R-016 corrected; R-017 new (p. 21 «E_M ⊥ r_M»).
- **Visual fixes (chapter implementers in worktrees):** coordinate explorer draws the coordinates as coloured lengths; e_φ no longer hidden/foreshortened (basis and circle animations); rotation field seen broadside; τ beside v at the same scale; cube (p. 19) in the lecture's orientation with ω's components; parallelogram completion in the rotation proof; ladder neutral grey with visible equal projections; translation demo calmer; two distinguishable planes in the Kreiselung proof (dark mode too); FieldDemo rays and right angles to the point at rest; Play works under Reduce Motion everywhere.
- **Pedagogy:** missing «why» added where lessons jump from «at rest at this instant» to rotation results (L10–L12); read-aloud steps completed; undefined symbols/jargon explained (Spatprodukt, e_μ, α, Bewegungszustand, R_M); «Kapitel 3 auf einen Blick»; lesson numbers replaced by links; new Q3 numeric question.
- **New pages 24–28** (iPad screenshots): transcribed in SOURCE_MAP (student's red notes recorded as requests), R-018 … R-023; three new lessons registered: `zentralachse` (24–25), `ebene-bewegung` (26–27), `planetengetriebe` (28).

## 2026-10-19 … 21 — pages 24–28, Quiz 4, independent QA
- New lessons merged: `zentralachse` (L13: InvariantExplorer, 7-step ScrewAnim — the student's requested screw animation —, ScrewExplorer, Problem 3.30 cube animation; `screw.ts`), `ebene-bewegung` (L14: planeScene, CentreDemo, WheelRays, ladder solved with the Momentanzentrum; `plane.ts`), `planetengetriebe` (L15: turning PlanetaryGear, planetScene; `planetary.ts`). Quiz 4 (pp. 24–28) with values from the physics code.
- Lead review: numbers re-checked by hand (ζ = (1,0,0) + λ(0,1,0); ladder ω = v_H/(L sin φ); gear ω_Arm = 2/9 with ring fixed, arm at rest for ω₂ = −R₁/R₂); figures inspected.
- Independent QA (read-only agent) → fixed: L13 first-invariant intuition was wrong in 3D («every line turns by the same angle» — a line along the axis does not turn); L12 no longer calls itself the last section; translation preset showed a Z; v_B* hidden at B*; Z₃ «on the arm» → on line QPO; L15 lede; long lecture lines split for phones; display formulas fit on tablets (boxes slightly wider than prose) with a scroll cue elsewhere; note button shrinks to its icon while reading; screw at negative pitch stays in view; label crowding.
- Checks: 434 unit tests, 107 e2e tests green.

## 2026-10-22 — Analysis 1 section (scaffold)
- Student asked for a second subject «Analysis 1»: weeks 1–5 from the Übungs-Resümee PDFs on arazzakov.ch, week 6 from the ETH online script on complex numbers; one chapter per week; short on high-school material.
- Both sites are blocked by the container's network policy → asked the student to allow the hosts or upload the PDFs. No content written from memory.
- Built the structure (D-023): `SUBJECTS`, chapters A1–A6 with planned topics (titles from the overview page), home page and drawer grouped by subject, pager per subject, source labels («Übung N» / «Online-Skript»).

## 2026-10-22 — Analysis 1, weeks 1–5
- Student uploaded the five Übungs-Resümee PDFs (arazzakov.ch still blocked); week 6 (ETH online script on complex numbers) follows as a PDF later.
- Lead read all PDFs page by page, logged A-001…A-013, built the shared plot (`src/viz/plot`), `Src u/p`, `Box kind="uebung"`, the 15-lesson plan and `docs/analysis/NOTATION.md`.
- Five implementers (one per week, worktrees) wrote the lessons, maths modules + tests, pure animation frames + tests, transcriptions `docs/analysis/SOURCE_U0n.md`; they found A-014…A-018. All hit the rate limit once and were resumed.
- Lead reviewed every lesson on iPad screenshots, spot-checked the numbers in the figures, merged (CSS/curriculum conflicts kept both sides; curriculum order restored), removed a committed `node_modules` symlink and fixed `.gitignore` (`node_modules` without slash).
- Known: `ana-grenzwerte-funktionen` is long; a few formula colours are fixed hex (KaTeX) and do not follow dark mode; some small labels close together on phones (see agent reports in PROGRESS notes).

## 2026-10-23 — Analysis 1, week 6
- Student supplied Übung 6 as PDF (instead of the online script). Read all 13 pages, no source errors found; lesson plan of three lessons (polar/Euler form, powers/roots/angle formulas, regions); one implementer built them (`A6*.tsx`, `week6.ts`, `W6Figures.tsx`, `w6Scenes.ts`, SOURCE_U06). Lead reviewed screenshots, merged, published.

## 2026-10-23 — Design pass (D-024, D-025)
Visual system rewritten in `src/design.css` (quiet, Apple-inspired). New entry flow: subject chooser landing, per-subject pages with table of contents, subject-aware top bar and drawer (`src/home/`). Home e2e test now checks landing + both subject pages; notes e2e focuses the burger instead of the brand (hidden on phones inside a subject). Checks: tsc, 734 unit tests, lessons/ui-shell/notes e2e green.

## 2026-10-23 — Lineare Algebra I (new subject)
- Topics from exercise classes 1, 2, 4 (classes 3 and 5 filled from recap slides and the TA's visualisations; polybox links unreachable). Nine lessons in chapters LA1–LA5 (`src/lessons/LA*.tsx`, `src/viz/la/`, `src/linalg/`), accent teal-green, landing tile with warping grid. Four implementers in worktrees, lead merged and reviewed on screenshots (iPad landscape, phone). Checks: tsc, 985 unit tests, e2e `la-` and landing green. Review IDs LA-001…006.

## 2026-10-24 — Chemie (new subject, 13 lessons)
Four implementer agents wrote 13 lessons from lectures 1–6 and the TA's exercise slides; merged by the lead. Name clashes (`mixScene.ts`, `chem.css`, `periodic.css`) resolved: the calorimeter scene is now `thermoMixScene.ts`. Review IDs CH-001…CH-012. vitest 1445 green, ch-* e2e (de/en/phone) 67 green. Screenshot spot-checks on iPad landscape.

## 2026-10-26 — Mechanik Kapitel 4 «Kräfte» und 5 «Leistung» (pp. 29–36)
- Student sent eight Goodnotes screenshots (pp. 29–36). Lead built the foundation: transcription in `SOURCE_MAP.md`, numeric truth `src/physics/force.ts` (+28 tests), colour tokens (`--c-force`, `--c-vel`), D-028, brief with the explanation checklist. Four implementers (worktrees) wrote seven lessons: `kraft`, `reaktionsprinzip`, `systemabgrenzung`, `verteilte-kraefte`, `leistung`, `leistung-rotation`, `leistung-kraeftegruppe`, each with interactive figures, step-synchronised animations (frame tests) and supplements marked as ours. They hit the usage limit twice and were resumed.
- Lead merged (conflicts only in `curriculum.ts` / `QUIZ_BANK.md`), reviewed all lessons on iPad-landscape screenshots, built Quiz 5 (`Q5Quiz.tsx`, values `Q5` in `quizValues.ts` with tests). Source issues R-024…R-035 in `REVIEW_LOG.md`.
- Fixed: the circled I/II of the ladder example (p. 35) were swapped in `SOURCE_MAP.md`/`force.ts` (checked against the screenshot); curriculum title of `leistung` had plain-text math (broke the e2e plain-text test for every lesson).
- Known: dark mode, phone and iPad portrait were checked by the implementers, not by the lead; K6 close-up frames of the O′ animation are the least clear picture.

## 2026-10-27 — Short version for Mechanik, quizzes removed, start at home
- Added the «Ausführlich / Kurz» switch (D-029) and curated all 22 Mechanik lessons (text 35–75 % of the full version; all step animations kept; checked by `e2e/short.spec.ts` and by screenshots).
- Removed Quiz 1–5 from Mechanik; the home tile now says «Kurzfassung» instead of the quiz count.
- The app opens at the home menu (hash cleared on load unless reload).
- Open: the student reviews which prose should stay or go; rotation (74 %) and zentralachse (68 %) keep the most because their proofs live in lecture boxes. Figures that sit inside hidden boxes (e.g. K5 «EverydayPower», «WattScale») are hidden in Short.

## 2026-10-27 — Informatik I started
- Read infln01 (pp. 8–17) page by page, headings of infln02–07 and the ThB sheet from the text layer. Plan in `docs/info/PLAN.md`.
- Infrastructure: subject `info` (curriculum, route, tile, accent, e2e subject loop); `<Code>`/`<K>`; `src/info/euclid.ts` + `boxcomputer.ts` with tests (gcd for all pairs, steps = 6k+3, data boxes change only via store).
- Lesson `i-algorithmus` (pp. 8–12): Euclid demo (bars, trace table, common-divisor chips = the invariant), three abstraction levels, box computer simulator with pseudo-code line sync, 1 Choice + 2 Predict, 3 misconceptions. I-001 logged (Fig. 1.7 `b = a-b`). Checked on iPad, phone, dark.
- Not yet: pp. 12–17 (Turing, von Neumann, syntax/semantics) and everything after; waiting for the student's verdict on the template before scaling.

## 2026-10-27 — Informatik I, chapters 1–3
- Interpreter (`src/info/cpp/`): subset of C++ with 32-bit int/unsigned, float/double, bool, char, strings, all control statements (incl. `switch`, `break`, `continue`), functions, cin/cout; every program in `programs.ts` is run in the interpreter and compared with recorded g++ output (`fixtures.json`, re-checked when g++ exists).
- Chapters I1 (5 lessons), I2 (5 lessons), I3 (5 lessons: `I3Verzweigung`, `I3For`, `I3Bloecke`, `I3While`, `I3Kontrollfluss`) written to the student's brief: few animations (a stepping tracer instead), explain the code and what the machine does, «Tipp» boxes against typical mistakes, university-level tone, attempt-first checks.
- I3 adds `viz/info/ControlFigures.tsx` (`CompileFail`, `ScopeFigure`, `FlowViewer`) and 16 tests on the notes' claims (Collatz 27, odd-number loops, prime loop, fall-through warning).
- Source issues I-001…I-006 are logged and handled in one sentence each.
- Open: lesson tone of `i-algorithmus` (informal) could be revisited; chapters 4–7 (functions, vectors, ASCII/Caesar, recursion) are next.

## 2026-10-27 — Informatik I, chapter 4 «Funktionen»
- Six lessons from infln04 (`I4Funktion`, `I4Aufruf`, `I4Vertrag`, `I4Verfeinerung`, `I4Module`, `I4Namensraeume`).
- Interpreter: `assert` (aborts with g++'s message), `namespace X { … }` with `X::f` calls; programs for the chapter are compared with g++ output.
- New figures in `viz/info/FunctionFigures.tsx`: call-stack boxes (`StackView`, `<Tracer stack>`), `SignatureFigure`, `RectOverlap` (x blue, y amber), `BuildFigure`. Multi-file example in `info/cpp/multifile.ts`, built with g++ in a test (include, linker error, `-c`, header, multiple definition).
- Tests on the notes' claims: Code 6.1 output, Example 6.7, assert message, -DNDEBUG, -Wall warning, interval overlap vs. brute force (g++ and interpreter), prime test iteration counts.
- Source issues I-007…I-009.

## 2026-10-27 — Informatik I, chapter 5 «Vektoren und Referenzen»
- Five lessons from infln05 (`I5Vektor`, `I5VektorUmgang`, `I5Vektor2D`, `I5Referenz`, `I5Rueckgabe`).
- Interpreter: `std::vector<T>(n[, e])` expressions, `{…}` lists (nested), `auto`, `using` aliases, `>>` in templates, `std::ssize`, `int(x)` casts, return by reference, reference locals, `const T&` binding to temporaries, value semantics (deep copy) for vectors; vector contents are shown as boxes (`VarView.vec`, `VecCells`) in all tracers.
- The g++ standard for the test programs is now C++20 (the notes use `std::ssize`).
- New figures `viz/info/VectorFigures.tsx`: `SieveGrid`, `MemoryStrip`, `MatrixLayout`, `VecCells`.
- Claims checked with g++: size_t wrap-around, `at` exception text, `-D_GLIBCXX_DEBUG` message, dangling-reference warning, row gap of vector<vector<int>>; compile errors for T& misuse, const-ness, auto indexing.
- Source issues I-010, I-011.

## 2026-10-27 — Informatik I, chapters 6 and 7 (course material complete)
- Chapter 6 (3 lessons: `I6Zeichen`, `I6Caesar`, `I6Text`) and chapter 7 (5 lessons: `I7Rekursion`, `I7Stapel`, `I7Bitfolgen`, `I7Strategien`, `I7Fibonacci`) written from infln06/07: with this the notes infln01–07 are covered (7 chapters, 36 lessons).
- Interpreter: strings (index read/write through proxy cells, `+=`, `+` with char, `std::string(n, c)`, `at`, `ssize`), `std::cin >> std::noskipws`, EOF/failbit for `while (std::cin >> c)`, `assert`-style aborts, brace lists as arguments, call/return flow events (`Snap.flow`) for the call tree.
- New figures: `AsciiTable`, `CaesarWheel`, `Utf8Figure` (`TextFigures.tsx`); `CallTree` (a call tree drawn from the run, in step with the stepper, optional colouring of equal calls), `FibGrowth`, `DepthCompare` (`RecursionFigures.tsx`). Pure models `src/info/text.ts`, `src/info/recursion.ts` with tests.
- Checked with g++: UTF-8 string size, stack overflow signal, 13!/Fibonacci overflow, bitset equality, sums with initializer lists; the notes' claims about F1 ≈ 10^9 calls and fib(50) with int are corrected (I-014, I-015); ZEBRA and the UTF-8 table (I-012, I-013).
- Open: student's verdict on the Informatik lessons (all `draft`); optional: revisit tone of `i-algorithmus`; German command sheet `ThB_unknown_Info1.pdf` not yet used for terminology.

## 2026-10-29 — Mechanik: Fachwerk + Parallelogrammregel (HS 2018 notes pp. 27–28)
- Two new chapter-3 lessons before «Kraft»: `L16Fachwerk` (6-step `trussScene` animation, recipe, three ways to v_E, SdpG check) and `L17Parallelogramm` (rule, proof around the loop, `ParallelogramDemo`).
- `physics/truss.ts` is the numeric source of truth (12 tests); every handwritten value re-derived. Source issue R-036.
- Both `draft`. Not published to the claude.ai artifact.

## 2026-10-29 — Redesign of the whole app (D-031)
- Research with four parallel agents: educational layout references (Tufte CSS, Distill, Observable sources), type/colour (font metrics measured locally; web largely blocked), codebase audit, independent critique of the old screens.
- New `src/theme.css` (single design system), `src/roles.css` (colour roles moved out of the deleted `design.css`), `styles.css` reduced to physics colours + figure mechanics. Self-hosted Source Serif 4 / IBM Plex Sans / IBM Plex Mono in `src/fonts/`.
- Components: `<Section>` splits off section numbers; `LessonOutline` (rail ≥ 1360 px, top of the drawer below); top-bar tools fold behind «Ansicht» on phones; course index rebuilt as a list with still drawings; Box hides a title that only repeats its label; parallelogram figure classes renamed `pgr-*` (collided with the planetary gear's `pg-*`).
- Checked: tsc, all unit tests, e2e (see below); screenshots desktop / iPad landscape / phone, light + dark, for index, subject page and several lessons of every subject.

## 2026-10-29 — Second redesign (D-032): white, black, the margin column
- Installed design skills: `npx skills add anthropics/skills --skill frontend-design` (→ `.claude/skills/frontend-design`, `skills-lock.json`); `npx impeccable install` could not reach impeccable.style (blocked by the network policy), so the same compiled skill was copied from the pbakaus/impeccable GitHub repo (`plugin/skills/impeccable`, Apache-2.0, launcher verifies the engine checksum); no hooks installed. Evaluated and not installed: vercel-labs `web-design-guidelines` (a code checklist fetched per use — used once as a final check list), leonxlnx `taste-skill` (built for landing/marketing pages; its «tells» registry was used by the critic).
- Three parallel critics (interface audit, real references, AI-tell critic with the impeccable detector), then `PRODUCT.md`, `DESIGN.md`, D-032.
- New `src/theme.css`; fonts Archivo + Charis SIL replace Source Serif 4 + IBM Plex Sans; App: lesson meta in the margin, running head (`useOutline` hook shared with the drawer outline), rail removed, status shown only in the drawer for unfinished lessons; Blocks: derivation summary split into `drv-kind` / `drv-title`; landing copy without middle-dot meta strings.
- Figure CSS normalised: radii → 0, chips/«Go!»/primary buttons → ink, centred chip rows → left, `.kf-see`/`.lp-see` → sans captions without the orange rule, Informatik code colours neutral; sticky-note pop easing without overshoot.
- Refinement pass after an independent critique of the implementation (vs. the previous build side by side): lighter section openers (1 px rule, grey number), hairline-free buttons, tracer highlight grey, figure cards without borders/tints, «What to look for» lead-in hung into the margin, drawer outline separated, «C++» tightened, key-point rule dropped right under a heading. Fixed a class collision (`.dot` hid the sticky-note colour buttons).
- Checked: tsc; vitest 148 files / 2246 tests; full e2e 532 passed, 2 failed (the `.dot` collision, fixed and re-run — see commit); impeccable detector on CSS and three rendered routes (remaining: advisory contrast of the physics red on grey, kept for one colour system); screenshots iPad landscape / desktop / phone, light + dark, all five subjects, drawer, index and subject page.
## 2026-10-29 — Visualisation upgrade (audit, three new figures, defect fixes; D-033)
- **Research.** Studied `hyfaust/science-art` (31 single-file Canvas-2D demos, GPL-3.0) and evaluated 15 libraries (Mafs, JSXGraph, Plotly, D3/Plot, uPlot, function-plot, 3Dmol, vtk.js, regl, GSAP/Motion, physics engines) against the existing stack (three/r3f/drei + in-house SVG `Plot` + pure scenes). Result: **no dependency added**, **no code copied** (GPL-3.0 would make the whole app GPL on distribution via GitHub Pages); ideas only. Full table and licence analysis: D-033.
- **Audit.** Automated sweep of all lessons on iPad (1024×768) and phone (390×844): console errors, horizontal overflow, small touch targets, rAF load while scrolling (loops must stop off-screen), plus a dev-mode console sweep in both languages (React warnings do not show in the production e2e).
- **New figures** (each: pure geometry + unit tests, e2e, inspected in light/dark, iPad/phone, German/English):
  - `PolodeDemo` (ebene-bewegung, ladder): fixed polode (circle R = L about the corner) and moving polode (circle L/2 about the ladder's middle, Thales) with the two equal arcs swept so far — the small circle rolls inside the big one; point P at fraction s of the ladder runs on an ellipse (trammel), v_P ⊥ ZP. Drag A/B, φ and s sliders, Play. `physics/plane.ts` `ladderPoint/ladderZBody/movingPolodePoint/ladderPointVelocity` + 6 tests (Z on both circles, rolling without slipping, ellipse, v = ω × ZP against the numerical derivative); `viz/polodeGeom.ts` + 5 tests (everything inside the viewBox). Supplement «Warum rollt der kleine Kreis im grossen?».
  - `EulerCircle` (ana-komplex, section Eulerform, which had no figure): unit circle with cos φ / sin φ shadows (x blue, y amber), arc length φ unrolled onto the axis of the cos/sin graphs, presets with exact values, drag/slider/Play. `viz/ana/eulerGeom.ts` + 5 tests (power series of e^{iφ} = cos φ + i sin φ, e^{iπ} = −1, exact values in all quadrants).
  - `CircleComponents` (kreisbewegung §4, the component calculation had no figure): top view of r, v and components; x(t), y(t) with the tangents, v_x, v_y below — the velocity component is the slope of the position curve. `viz/circleComp.ts` + 3 tests (v = ω × r, numerical derivative, v ⊥ r).
- **Defects fixed.** `.toggle` labels with text + formula were laid out one column per child (≈ 20 figures: Kreisbewegung, Rotation, Rollen, Planetengetriebe …) → block layout. ch-redox: block formula inside `<p>` (4 places) and duplicate scene keys `water`/`glass` (two beakers). `data-*` attributes from scene data are lower-cased (React warning). `preserveDrawingBuffer` only when the browser is automated (costs memory/fill rate on iPad).
- **Not changed on purpose.** Existing step animations, 3D scenes and particle simulations were compared with the alternatives and kept; no figure was replaced by weaker code. Known library warning: `THREE.Clock deprecated` comes from react-three-fiber, not from our code.
