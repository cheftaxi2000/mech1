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
