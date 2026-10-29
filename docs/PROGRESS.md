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
| fachwerk | HS 2018, 27–28 | draft | New (student's 2018 notes, 3.2 Fachwerk, Fig. 3.24). 6-step `trussScene` (Z_i, ω_i of all bars from v_B), `physics/truss.ts` + tests (v_E three ways, SdpG, parallelogram DEBF). Geometry reconstructed from handwriting (R-036). **Awaiting sign-off.** |
| parallelogramm | HS 2018, 28 | draft | Fig. 3.25, rule ω_AB = ω_DC, ω_BC = ω_AD with proof (go around the loop); `ParallelogramDemo` (4 ω sliders, two routes to v_C, gap). **Awaiting sign-off.** |

## Short version (Kurz), Mechanik — 2026-10-27
Toggle «Ausführlich / Kurz» in the top bar (Mechanik pages only; stored in `localStorage` `mech1.detail`). Short keeps lecture boxes, key points, all formulas, all figures and step animations; it drops lede, intuition and misconception boxes, supplements (unless `keep`), `observe` lists, «Was du sehen sollst» notes, `<details className="more">`, and section prose that is not marked `className="keep"`. Per lesson the professor's cut is done by `className="keep"` on essential paragraphs/lists (recipes, «So liest man das», definitions), `<Box keep>` for supplements/misconceptions worth keeping and `<Section long>` for sections that exist only in the full version. Text drops to roughly 35–75 % (e2e `short.spec.ts` guards: less text, all animations kept). **Awaiting the student's review of the cut.** Quiz 1–5 removed from Mechanik (student's decision; ideas stay in `QUIZ_BANK.md`). The app now always opens at the home menu.

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

## Chemie (D-027)
| Kapitel | Lektion | Status |
|---|---|---|
| CH1 | ch-atome, ch-stoechio | review |
| CH2 | ch-gase, ch-kinetik | review |
| CH3 | ch-loesungen, ch-redox | review |
| CH4 | ch-energie, ch-enthalpie | review |
| CH5 | ch-entropie, ch-gibbs | review |
| CH6 | ch-licht, ch-orbitale, ch-trends | review |

Offen: Polybox-Links nicht erreichbar; Übungen 2–4 handschriftlich (nur Bild) — Werte aus Scans gelesen; iPad-Hochformat und Animationsframes nicht für alle Lektionen geprüft. Quellen: `docs/chem/SOURCE_*.md`.

## Mechanik Kap. 4 Kräfte / Kap. 5 Leistung (D-028)
| Topic | Pages | Status |
|---|---|---|
| kraft | 29 | review |
| reaktionsprinzip | 30 | review |
| systemabgrenzung | 30–31 | review |
| verteilte-kraefte | 31–32 | review |
| leistung | 33 | review |
| leistung-rotation | 33–35 | review |
| leistung-kraeftegruppe | 34–36 | review |

## Informatik I (D-030)
| Topic | Notes pages | Status | Notes |
|---|---|---|---|
| i-algorithmus | infln01 pp. 8–12 | review | Euclid demo + invariant chips, three abstraction levels, box computer simulator (`src/info/boxcomputer.ts`, 8 tests), Predict/Choice checks, I-001. **Awaiting the student's verdict on the template.** |
| i-rechner | infln01 pp. 12–17 | draft | Turing/von Neumann, syntax vs semantics, first C++ program view; I-002. |
| i-programm | infln01 pp. 18–21 | draft | Trace table, compile/run errors recorded from g++. |
| i-variablen | infln01 pp. 21–25 | draft | Declaration, assignment, swap, lvalue/rvalue; computed traces. |
| i-ausdruecke | infln01 pp. 25–29 | draft | Expressions, evaluation, types. |
| i-vorrang | infln02 pp. 30–34 | draft | Expression tree with all valid evaluation orders; I-004. |
| i-operatoren | infln02 pp. 34–36 | draft | Division/modulo, ++/--, compound assignment. |
| i-ganzzahlen | infln02 pp. 37–40 | draft | B-bit wrap ring; I-003 is in the Fahrenheit example. |
| i-fliesskomma | infln02 pp. 40–43 | draft | Exact decimal expansion inspector. |
| i-wahrheitswerte | infln02 pp. 43–48 | draft | Truth tables, De Morgan, short-circuit. |
| i-verzweigung | infln03 pp. 49–50 | draft | if / if-else / else-if chain; semicolon and `=` pitfalls (computed). |
| i-for | infln03 pp. 50–53 | draft | Four stations of for, trace n = 2 (I-005), termination, halting problem, prime test (tested for 2 ≤ n ≤ 60). |
| i-bloecke | infln03 pp. 53–57 | draft | Blocks, dangling body, scope bars (`ScopeFigure`), shadowing, recreated locals (output 61718191101 from g++); I-006. |
| i-while | infln03 pp. 57–64 | draft | while, Collatz (27: 111 steps, peak 9232, int overflow at 113383 — tested), do-while, break/continue calculators. |
| i-kontrollfluss | infln03 pp. 64–70 | draft | Flow diagrams 5.4–5.8 (`FlowViewer`), choosing a structure (3 odd-number loops equal, tested), switch + fall-through (g++ -Wextra warning tested). |
| i-funktion | infln04 pp. 71–74 | draft | Why functions, SignatureFigure, definition/call, Examples 6.2–6.4 (output from g++); I-007. |
| i-aufruf | infln04 pp. 74–78 | draft | Five steps of a call, parameters are copies, call stack (`StackView`, Tracer `stack`), nested calls. |
| i-vertrag | infln04 pp. 78–83 | draft | void, missing return (-Wall warning tested), weak/strong contracts, pow limits (inf/0), assert (+ -DNDEBUG tested). |
| i-verfeinerung | infln04 pp. 83–89 | draft | Rectangle model `RectOverlap` (`src/info/overlap.ts` tested against the C++ program), refinement steps, intervals via the negated question, brute-force test; I-009. |
| i-module | infln04 pp. 88–94 | draft | Scope/forward declaration, include vs separate compilation (build tested with g++), `BuildFigure`, headers; I-008. |
| i-namensraeume | infln04 pp. 94–96 | draft | Namespaces (interpreter supports `namespace`), std library, prime test with sqrt bound (999 vs 1 000 002 divisions, tested). |
| i-vektor | infln05 pp. 97–99 | draft | Sieve (`SieveGrid`, `src/info/sieve.ts` tested), vector basics, contiguous layout + `MemoryStrip` (p + s·i). |
| i-vektor-umgang | infln05 pp. 99–102 | draft | Four initializations, push_back/size, out of bounds (at, _GLIBCXX_DEBUG tested with g++), unsigned size() trap (2^64−1 tested), std::ssize. |
| i-vektor-2d | infln05 pp. 103–106 | draft | Nested vectors, `MatrixLayout`, lower-triangle sum, jagged vectors, using/auto; I-010. |
| i-referenz | infln05 pp. 107–109 | draft | swap by value/reference (stack view with aliases), T& rules (compile errors from g++), pass by value vs reference. |
| i-rueckgabe | infln05 pp. 109–113 | draft | Return by reference (inc(inc(x)), wrap_at), dangling reference (-Wall warning tested), const references, parameter table. |
| i-zeichen | infln06 pp. 114–116 | draft | char as integer, ASCII table (`AsciiTable`), digit/letter arithmetic, UTF-8 (`Utf8Figure`, `src/info/text.ts` tested against TextEncoder); I-013. |
| i-caesar | infln06 pp. 115–117 | draft | Caesar wheel (`CaesarWheel`), mod with negative numbers, Code 9.1 (noskipws, EOF) in the interpreter and g++; ZEBRA both ciphers; I-012. |
| i-text | infln06 pp. 116–118 | draft | std::string operations, at/[] , += vs + with literals (compile error from g++). |
| i-rekursion | infln07 pp. 119–120 | draft | fac recursively with stack boxes and call tree (`CallTree`), base case/progress, stack overflow (SIGSEGV tested). |
| i-stapel | infln07 pp. 120–123 | draft | Call stack with recursion, 13! overflow, gcd recursively (termination, 7 calls for gcd(21,13) tested). |
| i-bitfolgen | infln07 pp. 123–127 | draft | All bit strings: decision tree drawn from the run, copy vs. single string by reference; bitset equality tested with g++. |
| i-strategien | infln07 pp. 127–131 | draft | Decrease/divide and conquer for the sum, recursion depth `DepthCompare` (n+1 vs ⌈log₂ n⌉+1 tested with the interpreter). |
| i-fibonacci | infln07 pp. 131–133 | draft | fib call counts (`FibGrowth`, coloured call tree), iterative version, int overflow at F47 (g++); I-014, I-015. |

## Visualisation upgrade 2026-10-29 (D-032)
New figures: ladder polodes (ebene-bewegung), Euler circle with cos/sin graphs (ana-komplex), circular motion in components (kreisbewegung §4). Fixes: figure toggle layout, ch-redox DOM nesting/keys, iPad GL buffer. No new dependency. The three lessons keep their status (`complete` kreisbewegung stays signed off — the student should glance at the new §4 figure; ebene-bewegung `review`; ana-komplex `review`).
