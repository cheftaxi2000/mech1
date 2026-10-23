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
| translation | 13–14 | **complete** | Definition (p. 13): a = MN keeps length *and* direction, Fig. 3.4 as 4-step animation (`transScene.ts`, 4 frame tests: t₁ → t with equal displacements → t₂ congruent paths → v_M = v_N, ȧ = 0); «So liest man das». p. 14 straight / curved / circular translation with `TranslationDemo` (M, N, P with paths and equal velocity arrows; «Vergleich: Drehung» with concentric circles of different radii; pure `demoFrame`, label placement tested in `translationDemo.test.ts`). Momentary translation (p. 14) with the supplement `SliderCrank` (ω_rod = 0 only when the crank is vertical; `translation.test.ts`), R-016 in a `<details>`. 3 misconceptions. p. 14 cube example empty (R-008). Frames inspected iPad, phone, dark. Signed off 2026-10-11. |
| rotation | 15–19 | **complete** | Door intuition; p. 15 definition + three properties with `RotationExplorer` (3D door on a tiltable axis μ through hinges A, B: circles, equal angle φ, velocities Fig. 3.8; geometry in `rotGeom.ts` + test). Property 1 («Anschaulich», R-009) as 3-step animation (`restScene.ts`), why the angle and not the distance in a `<details>`. Proof 2 (p. 16, R-010 one sentence) as 5-step oblique animation (`circProofScene.ts`). Proof 3 (p. 17) with the R-003 typo marked red in the lecture box and one sentence below, 5-step top-view animation with the parallelogram X (`omegaScene.ts`), R-003 (b) in a `<details>`. p. 18 |v| = |ω||AM| with `FootDemo` (O slides on μ, parallelogram keeps base and height). p. 19 cube example: handwritten solution, R-004 one paragraph, 6-step 3D animation (`cubeFrame.ts` + `CubeAnim`), R-005 in a `<details>`. 4 misconceptions. Physics: `rotation.ts` + 11 tests. Frames inspected iPad, phone, dark. Signed off 2026-10-11. |
| rollen | 20 | **complete** | Tyre intuition (no skid marks, top 2v). «Rollen: momentane Rotation» with a 4-step oblique animation of the rolling cylinder (`rollScene.ts`: contact line AB at rest ⇒ rotation about μ = AB, velocities linear in the height, μ moves along; not CD). Supplement v_C = ωR. Contact conditions (Kontakt / Gleiten / Rollen, Z₂ at rest) with `RollingWheel` (wheel Z₁ on a belt Z₂: sliders v_C, ω, u; presets rolling / locked / spin / belt; rim-point path, momentary centre, v_t(Z₁) vs v_t(Z₂) with a rolling/sliding chip). 4 misconceptions. Physics `rolling.ts` + 6 tests. Frames inspected iPad, phone, dark. Signed off 2026-10-12 («mache weiter»). |
| kreiselung | 20–21 | **review** | Spinning-top / cup intuition. p. 20 definition with «So liest man das» and `KreiselExplorer` (3D cone rolling about its apex O, pure geometry in `kreiselGeom.ts` + test: presets rolling / no spin / fast spin, momentary axis μ along ω always through O, μ = line of contact when rolling, velocities v = ω × r, sphere |OM| = L with the path of M). p. 21 proof (Fig. 3.11) transcribed with the handwritten notes, read aloud in 5 steps, 6-step oblique animation (`kreiselProofScene.ts`: planes E_M, E_N through O, μ = E_M ∩ E_N, A on μ, SdpG with M, N, O ⇒ v_A = 0, rotation about μ); view chosen so the right angles v_M ⊥ r_M, v_N ⊥ r_N read as right angles. R-012 one sentence + `<details>`. «Kreiselung als momentane Rotation» with the supplement «rollender Kegel» (v_C = φ̇ L cos²γ, |ω| = φ̇ cot γ, top 2 v_C). 3 misconceptions. Physics `kreisel.ts` + 9 tests. Frames inspected iPad, phone, dark. **Awaiting sign-off.** |
| allgemein | 22–23 | **review** | Frisbee intuition. p. 22 decomposition r_M = r_B + ρ, v_M = v_B + ρ̇, ρ̇ = ω* × ρ read aloud and as a 5-step animation of a plate (`genScene.ts`: motion with ghost and paths, position vectors, velocity triangle, riding along with B ⇒ circle about B, translation part + turning part). ω* = ω** derivation read line by line, `RideDemo` (camera at rest / riding with B / riding with C: the plate turns about the riding point by the same angle φ), R-011 one paragraph. Grundgleichung with `FieldDemo` (velocity field of the plate from v_B and ω; presets translation / turning about B / general; split at M with reference point B or C; supplement: the point at rest in the plane), special cases translation / rotation / SdpG derived from it. p. 23 cube example: lecture data + handwritten solution, R-007 (positions inferred, v_Bz = 0), 5-step 3D animation (`cubeGenFrame.ts` + `CubeGenAnim`), supplement «no point at rest» (ω·v = −v²/L for every point); tetrahedron empty (R-008) one sentence. 3 misconceptions. Physics `general.ts` + 9 tests, pure figure frames `genGeom.ts` + 6 tests. Frames inspected iPad, phone, dark. **Awaiting sign-off.** |

| zentralachse | 24–25 | **review** | Screw/rugby-ball intuition. Kinemate {v̲_B, ω̲} (p. 24); 1st invariant explained (R-018, student's «+ Erklärung»), 2nd invariant from the struck-out term; `InvariantExplorer` (move P: ω̲ and v̲_ω stay, the ⊥ part changes). Fig. 3.16 read aloud + 7-step 3D animation `ScrewAnim`/`screwFrame.ts` (split, walk along g, Z and ζ, B*, circle about ζ, one full screw turn with helix and quarter-turn copies — the student's «Animation die das einfach visualisieren lässt»). p. 25 text, R-020/R-021 supplements, special cases + `ScrewExplorer` (Schraube / Rotation / Translation, pitch, play). Problem Fig. 3.30 with the handwritten solution (R-019), «Warum y_P beliebig?» answered, 6-step cube animation `CubeScrewAnim`. 4 misconceptions. Physics `screw.ts` + 19 tests. **Awaiting sign-off.** |
| ebene-bewegung | 26–27 | **review** | 3.1 Ebene Bewegung: v_z = 0 ⇒ ω̲ ⊥ E (5-step `planeScene`: tilting ω̲ lifts points out of the plane). Satz vom Momentanzentrum quoted; `CentreDemo` (drag v̲_A, v̲_B — v̲_B constrained by the SdpG; perpendiculars, Z, rays, right angles; translation / tips-line / A-at-rest cases). Fig. 3.20 `WheelRays`. Ladder «Löse mit SMZ» solved as a supplement (R-022, student's «Lösung fehlt»): 7-step `ladderScene`, Z moves on a quarter circle. 4 misconceptions. Physics `plane.ts` + tests. **Awaiting sign-off.** |
| planetengetriebe | 28 | **review** | Fig. 3.21 + handwritten solution (R-023). `PlanetaryGear`: turning toothed gear (meshing tested), sliders ω₁, ω₂, presets (Fig. 3.21, ring fixed = erstes Übersetzungsverhältnis i = 1 + R₂/R₁, sun fixed, ω₂R₂ = ω₁R₁ → planet translates, ω₂ < 0), velocities on the arm, velocity triangle, Z₃. 8-step `planetScene`, one step per handwritten line. 4 misconceptions. Physics `planetary.ts` + tests. **Awaiting sign-off.** |
| quiz-4 | 24–28 | **review** | 11 questions (invariants, |v_ω|, «Warum y_P beliebig», fastest corner, special case v̲_B ⊥ ω̲, wheel Z, ladder ω, ω ⊥ plane, gear ω_Arm, arm at rest, ω₂R₂ = ω₁R₁); values in `quizValues.ts` Q4 from the physics code, tested. **Awaiting sign-off.** |
| quiz-1/2/3 | 3–23 | **review** | Quiz part (D-015, D-018): three pages in the menu chapter «Quiz», one per lecture chapter, built from `QUIZ_BANK.md` (L01/L02 questions reused, ideas for L03–L12 written out): Choice / NumericAnswer / Predict, every answer with an explanation and a link back to its lesson (`See`). Every number comes from `src/content/quizValues.ts`, computed with the lessons' physics code and checked in `quizValues.test.ts`. The e2e language/plain-math test reveals every hidden explanation and now also fails on KaTeX errors inside them. **Awaiting sign-off.** |

## Overhaul 2026-10-12 … 19 (all lessons)
Lessons L01–L12 keep their status; they received targeted improvements from the audit (see SESSION_LOG): wider iPad layout, readable 3D arrowheads, corrected L10 supplement, clearer figures, missing «why» sentences. The student should glance over them again.

## Polish backlog
- New lessons: on phones some 3D labels are small (zentralachse steps 3–5); long lecture formula lines scroll sideways inside their box on phones (ebene-bewegung, planetengetriebe); planetary teeth are clipped-cosine, not involute (they mesh correctly on the line of centres).
- Animation: during the four-quadrant sweep, labels near O can briefly crowd each other in quadrants II/III (transient, final frames are clean and tested).
- koordinaten: labels O, θ, ψ crowd each other when M is near the origin; consider offsetting the O label and drawing angle labels outside the arcs.
- koordinaten: optional "animate φ" button to preview Kreisbewegung.
- vektoren: in the position-vector figure, e̲_y lies partly under r̲ near O for some t (3D overlap, readable).
- Bundle size: done — three.js has its own chunk and loads only on lessons with a 3D figure.

## Analysis 1 (D-023)

Lessons built by one implementer per week (worktrees), reviewed by the lead against the PDFs and screenshots (iPad landscape, phone), merged.

| Topic | Source | Status | Notes |
|---|---|---|---|
| ana-folgen | Ü1/10, Ü2/1 | review | Three-kinds plot; StripExplorer (Parallelstreifen vs ε-strip, live N); implication list with crossed arrows; animations «konvergent ⇒ beschränkt», «beschränkt + monoton ⇒ konvergent»; `folgen.ts`. |
| ana-grenzwerte-folgen | Ü1/11 | review | Degree rule + DegreeExplorer (incl. −∞ preset, A-004); root trick read aloud + area animation (3rd binomial formula); A-014. |
| ana-reihen | Ü1/11–12, Ü2/1–2 | review | Gauss pairing, telescoping derivation, halving animation 3 + 3/2 + … = 6, GeoExplorer, harmonic grouping animation, e-series (A-001…A-003); `reihen.ts`. |
| ana-funktionen | Ü2/2–4 | review | Anatomy figure; image explorer (drag domain ends, open/closed); horizontal-line probe; function types; even/odd mirror; A-005, A-006; `w2.ts`. |
| ana-grenzwerte-funktionen | Ü2/4–7 | review | One-sided-limit probe; all slide methods with «warum erlaubt»; sin x/x unit-circle animation; L'Hôpital zoom + counterexample (A-007, A-008, A-015, A-016). Long (many methods on the slide). |
| ana-stetigkeit | Ü3/1–3 | review | Title «Stetigkeit, Lücken und Zwischenwertsatz». IntervalStrip; LimitExplorer (stetig/Loch/Pol/Sprung); IvtFigure (Bsp. 1, Bsp. 2 with −π, several hits, jump); bisection animation (supplement) to c ≈ 1,3247; `week3.ts`. |
| ana-transformationen | Ü3/4–5, Ü4/1 | review | TransformExplorer (a, b, c, d on p, six slide presets, tracked maximum); ReciprocalFigure 1/p vs p(1/x); Serie 3/2d animation max → min at x = −2. |
| ana-umkehr | Ü3/5–8 | review | Arrow diagrams; draggable horizontal-line test with verdicts (A-009); Bsp. 1–5 with every step justified; mirror-at-y = x animation incl. D/W swapping (A-018). |
| ana-asymptoten | Ü3/9–12 | review | GapFigure with f − g plotted (both directions, A-010); hole vs pole contrast; polynomial long division animation in the slide's layout. |
| ana-ableitung | Ü4/2–3 | review | Secant → tangent animation filling the slide's table; left/right secants (x² vs \|x\|); A-011; `deriv.ts`. |
| ana-ableitungsregeln | Ü4/4–7 | review | Product-rule area figure, chain-rule stretched number lines, special-case table incl. tan′ both forms, inverse derivative by folding the slope triangle. |
| ana-tangente | Ü4/8–9 | review | Zoom figure («lineare Ersatzfunktion»), normal with turned slope triangle (A-017). |
| ana-fehler | Ü5/1–2 | review | Δf vs df animation, rectangle strip, ring unrolled (cylinder doubles), Quader; supplement xⁿ rule; `week5.ts`. |
| ana-mws | Ü5/3–6 | review | MWS animation + MvtExplorer (several c, Rolle, \|x\|), CurvatureExplorer with f′/f″ sign bars (A-012), extremal-value animations, L'Hôpital example. |
| ana-komplex-rechnen | Ü5/6–8 | review | Number sets, complex plane explorer (conjugate, sum, difference), multiplication grid animation, division animation (A-013). |
| ana-komplex | Ü6/1–7 | review | «Polarform und Eulerform»: only the new bits of pp. 1–4 (i-cycle figure, \|z\|, conj rules, division formula); polar form; AngleExplorer (arctan(b/a) vs true φ in all quadrants); Euler form; multiplication animation + MulExplorer (lengths multiply, angles add; ÷ mode); supplement why the angles add. `week6.ts`. |
| ana-komplex-potenzen | Ü6/8–9, 11 | review | PowerSpiral; ·i as quarter turn; z⁴ = −16 animation; RootsExplorer (n-gon, start angle θ/n, step 2π/n, «Probe» animation); double-angle formulas. |
| ana-komplex-bereiche | Ü6/10, 12 | review | Re(iz) > 1 animation; RegionExplorer (disc, half-plane, annulus, Re z ≥ Im z, intersection; test point with ✓/✗ per condition; solid/dashed boundaries); supplement perpendicular bisector. |

## Lineare Algebra I (D-026)
| Kapitel | Lektion | Status |
|---|---|---|
| LA1 | la-einstieg | review |
| LA2 | la-lgs, la-gauss | review |
| LA3 | la-rang, la-spaltenbild | review |
| LA4 | la-transformation, la-rechnen, la-spezial | review |
| LA5 | la-produkt | review |

Offen: Folien der Übungen 3 und 5 fehlen (aus Zusammenfassungen und TA-Visualisierungen ergänzt); Volltest e2e und Animationsframes noch nicht komplett gelaufen.
