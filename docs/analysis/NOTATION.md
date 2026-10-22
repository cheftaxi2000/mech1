# Analysis 1 — notation and figure conventions (D-023)

**Sources.** Weeks 1–5: the Übungs-Resümees «Analysis 1 – Übung n» by the teaching assistant (PDF, arazzakov.ch; not committed, like D-003). Week 6: the ETH online script on complex numbers (pending). Cite with `<Src u={n} p={pdfPage} />` («Übung n, S. p»); quote the slides in `<Box kind="uebung">` («Aus der Übung»). Anything not on the slides is a `supplement` box or clearly an explanation. Transcriptions: `docs/analysis/SOURCE_U0n.md`. Source problems: `docs/REVIEW_LOG.md` § Analysis (A-xxx).

**Notation (as on the slides).** Sequences aₙ (explicit and recursive), Sₙ partial sums, d (arithmetic difference), q (geometric ratio); functions f: D → ℝ, x ↦ f(x); 𝔻 / D Definitionsbereich, 𝕎 / W(f) = Im(f) Wertebereich/Bild, Z Zielbereich; intervals [a, b], (a, b] (round bracket at ±∞); lim_{x→a⁻}, lim_{x→a⁺}; f′, f″; f⁻¹ (inverse, not 1/f); Δx, Δf, df = f′(x)Δx, E_f absolute, r_f relative error; complex z = a + bi, Re z, Im z, z̄, |z|. Write ln, sin, cos, tan, arcsin, arctan upright (`\ln`, `\sin`, …). German decimal comma (`{,}` in TeX, `fmtNum`).

**Depth.** High-school material (arithmetic/geometric sequences, intervals, set notation, function types, power rule, shifting graphs, conjugate binomial) gets one short box + one figure. University material (convergence and its implications, the harmonic series, limit techniques, L'Hôpital and its conditions, continuity and the IVT, injective/surjective/bijective, inverse functions and their derivative, differentiability, mean value theorem, curvature tests, error propagation, complex arithmetic) gets the full Mechanik treatment: plain words → formula → why each step is allowed → animation/interactive figure → worked example → misconceptions. The student dislikes long reading: short sentences, no padding, no repeated examples.

**Figures** use the shared plot in `src/viz/plot/Plot.tsx` (`Plot`, `Curve`, `Pt`, `Seg`, `Line`, `HLine`, `VLine`, `Band`, `PArrow`, `PLabel`, `Path`). Colour roles:

| role | meaning | colour |
|---|---|---|
| `f` | the function / sequence being studied | blue |
| `g` | a second, derived or inverse function; the transformed graph | magenta |
| `ref` | the original graph before a transformation, mirror line y = x | grey, dashed |
| `tan` | tangent | magenta |
| `sec` | secant | teal, dashed |
| `asym` | asymptote, pole line | purple, dashed |
| `pt` | marked point, moving point | red |
| `band` | strip / bound / ε-band / interval | teal fill |
| `aux` | helper lines, Δx/Δy arrows | grey |

Holes: `<Pt open />`. Poles and jumps: `breaks` on `<Curve>`. Labels are KaTeX (`PLabel`), never SVG text (tick numbers excepted).
