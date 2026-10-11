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
