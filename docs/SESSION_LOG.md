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
