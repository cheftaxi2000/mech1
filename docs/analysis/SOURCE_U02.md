# Source: «Analysis 1 – Übung 2» (Übungs-Resümee, PDF) — pages 2–7

Faithful transcription of the content pages used by the lessons `ana-funktionen` and `ana-grenzwerte-funktionen`.
Page = PDF page. Page 1 and the top of page 2 (recap of week 1: arithmetic/geometric series, convergence implications,
harmonic series) belong to week 1 (`ana-reihen`). Pages 8–9 are «Serie 2» (exercise sheet) → quiz ideas only.
Photos/memes (p. 2 below the harmonic series, p. 7 «Cortisol» gauge and the «confused lady» meme) and the
«Study Center» line (p. 7) are not content. Source issues: `docs/REVIEW_LOG.md` A-005 … A-008.

## p. 2 (lower half) — Funktionen

Heading «Funktionen» (underlined). An annotated formula, every part in its own colour with a label and a thin line to it:

```
              Definitionsbereich 𝔻          (orange)      Mengenpfeil (blue)
              Hier: -1 < x ≤ 4
                       f: (-1, 4] –> ℝ  ——  Zielbereich (red)
   Funktionsname (purple, points at "f")
                       x ⊢> 4x + 3
   Variable/Argument (green, at "x")   Abbildungspfeil (pink, at "⊢>")   Funktionswert (dark blue, at "4x + 3")
```

Colours: f purple, (−1, 4] orange, the set arrow «–>» blue, ℝ red, x green, «⊢>» (maps-to arrow ↦) pink, 4x + 3 dark blue.

- «Bild/Wertebereich: Alle "erreichbaren" Funktionswerte»
- «Für f(x) = 4x + 3 mit 𝔻 = (-1, 4] ist das der Wertebereich/das Bild 𝕎(f) = Im(f) = (-1, 19]»
  («der Wertebereich» purple, «das Bild 𝕎(f)» and «Im(f)» red.)

## p. 3 — Bsp.

- f(x) = 1/(x − 3)   «𝔻(f) ∈ ℝ∖{3}»   «𝕎 ∈ ℝ∖{0}»   (A-005: «∈» should be «=»)
  Graph (orange, plotter screenshot, x from −5 to 10, y from −5 to 10): hyperbola with pole at x = 3, labelled f(x).
- g(x) = (x − 15)/(√x − 4)   «𝔻(f) ∈ ℝ⁺∖{16}»   «𝕎 ∈ ℝ∖(6, 10)»   (the «+» on ℝ is handwritten; A-005)
  Graph (red, x 0…25, y −5…20, labelled g(x)): starts near 4 at x = 0, rises to a flat maximum ≈ 6 around x = 9, falls to
  −∞ at x = 16; right of 16 comes down from +∞ to a minimum ≈ 10 near x = 25.
- «Thermometer ℝ³ –> ℝ» (the ³ handwritten). «Input: Punkt mit Koordinaten (x, y, z)  Output: Temperatur in ºC»
  «𝕎 = [-273.15, ∞)»
- «Barometer: [0, 10000m] –> ℝ» «Input: Höhe in m  Output: Druck in bar» «𝕎 = (0, 1]» (A-006)
- «f(x) = (x - 4)²  𝔻 = [2, 6)» (the ² handwritten).
  Hand drawing: y-axis 1…5, x-axis 1…8, blue parabola with vertex at (4, 0), drawn from about x = 1,7 to x = 6,3
  (beyond the domain); the tick at 6 is marked pink. Pink: a horizontal line at y = 4 from x ≈ 6 to the right, a zig-zag
  scribble between y = 0 and y = 4, a double arrow from 0 to 4 at the right. Pink text: «Alle Werte dazwischen werden
  erreicht => 𝕎(f) = [0,4]».

## p. 4 — Arten von Funktionen / Eigenschaften / Stetigkeit

«Arten von Funktionen» (green highlights):
1) Potenzfunktionen: f(x) = a · xⁿ mit n, a ∈ ℝ
2) Polynom Funktionen: f(x) = a₀ + a₁x + a₂x² + ⋯ + aₙxⁿ mit n ≥ 0
3) Rationale Funktionen: Quotient zweier Polynome
4) Trigonometrische Funktionen: f(x) = sin(x) oder g(x) = cos(x)
5) Exponential-/Logarithmusfunktionen: f(x) = aˣ = e^{x ln(a)};  f(x) = log_a(x) = ln(x)/ln(a)

«Eigenschaften von Funktionen» (cyan highlights):
1) Gerade Funktion: f(x) = f(−x)      Ungerade Funktion: f(−x) = −f(x)
2) (Strikt) monoton wachsend für alle x₁ < x₂: f(x₁) ≤ f(x₂) (bzw. f(x₁) < f(x₂))
   (Strikt) monoton fallend für alle x₁ < x₂: f(x₁) ≥ f(x₂) (bzw. f(x₁) > f(x₂))

«Stetigkeit» — two hand-drawn graphs side by side:
- left: axes y, x; a wavy, unbroken curve labelled f(x) (rises, small hump, dip, rises).
- right: axes y, x; curve g(x) with a jump at x = a: the left piece ends higher, the right piece starts lower (no dots
  drawn at the ends). Pink dotted vertical lines at a and at b (b further right, where the right piece is smooth).
- «Eine Funktion ist stetig, wenn man sie mit einem Strich zeichnen kann. (Kein Sprung)»
- «–> f(x) ist stetig, g(x) ist nicht stetig»
- «–> g(x) ist» [light-blue box] «• stetig in b : lim_{x→b⁻} g(x) = lim_{x→b⁺} g(x)»
  «• nicht stetig in a : lim_{x→a⁻} g(x) ≠ lim_{x→a⁺} g(x)» (the ≠ in pink).

## p. 5 — Grenzwerte von Funktionen (eine Auswahl von Methoden)

«• Links- & Rechts-Grenzwerte und Betragsstriche»
Drawing: axes y, x; tick a on the x-axis; an arrow from the left labelled lim_{x→a⁻} and an arrow from the right labelled
lim_{x→a⁺} meet above a (the ⁻ and ⁺ in pink).

lim_{x→1⁺} (x−1)/(2|x−1|) = lim_{x→1⁺} (x−1)/(2(x−1)) = 1/2
lim_{x→1⁻} (x−1)/(2|x−1|) = lim_{x→1⁻} (x−1)/(2(−1)(x−1)) = −1/2
bracket: «Diese Funktion ist unstetig (im Punkt x = 1)» (A-007)

«• Wert einsetzen»: lim_{x→2} (x²+1)/x = (4+1)/2 = 5/2.
«Oft resultieren aber undefinierte Ausdrücke –> 0/0, ∞/∞, 0 • ∞,…»

«• Brüche Faktorisieren & Kürzen»: lim_{x→2} (x²−4)/(x²+x−6) = lim_{x→2} (x−2)(x+2)/((x+3)(x−2)) = lim_{x→2} (x+2)/(x+3) = 4/5
(the two factors (x−2) struck through in pink). Pink box: (a − b)(a + b) = a² − b².

«• Brüche mit grösster Potenz kürzen»: lim_{x→∞} (x²+5x)/(2x²) = lim_{x→∞} (1 + 5/x)/2 = 1/2 (5/x struck through, a pink
«0» above it). Blue: «"Durch die grösste Potenz teilen"».

## p. 6 — Wurzeln erweitern, trigonometrische Funktionen

«• Wurzeln erweitern» (pink box (a − b)(a + b) = a² − b²; pink labels «a» over √(x+4), «b» over 2):
lim_{x→0} (√(x+4) − 2)/x = lim_{x→0} (√(x+4) − 2)/x · (√(x+4) + 2)/(√(x+4) + 2) = lim_{x→0} ((x+4) − 4)/(x(√(x+4) + 2))
(the 4 and −4 struck through) = lim_{x→0} x/(x(√(x+4)+2)) (x struck through, «1» above) = lim_{x→0} 1/(√(x+4)+2)
= 1/(√4 + 2) = 1/4.

«• Trigonometrische Funktionen (sin, cos,…)» — two blue boxes:
lim_{x→0} sin(x)/x = lim_{x→0} x/sin(x) = 1          lim_{x→0} (cos(x) − 1)/x = 0

Bsp.: lim_{x→0} tan(5x)/x = lim_{x→0} sin(5x)/(x · cos(5x))   pink: «=> Substitution: n = 5x x–>0 / x = n/5 n–>0»
= lim_{n→0} sin(n)/((n/5) · cos(n)) = lim_{n→0} 5 sin(n)/(n · cos(n)) = lim_{n→0} 5 · sin(n)/n · 1/cos(n) = 5
(pink underlines with «1» under sin(n)/n and under 1/cos(n)).

Bsp.: lim_{x→0} x² · sin(1/x)/sin(x) = lim_{x→0} x/sin(x) · x · sin(1/x) = 1 · A = 1 · 0 = 0 (pink «1» under x/sin x, «A» under
x · sin(1/x)).
In corner brackets: A = lim_{x→0} x · sin(1/x)   blue: «Substitution: u = 1/x x –> 0 / x = 1/u u –> ∞»
= lim_{u→∞} sin(u)/u = [0 = A] (boxed). (New issue proposed: for x → 0⁻ the substitution gives u → −∞; same limit.)

## p. 7 — Bernoulli L'Hôpital

Box: lim_{x→a} f(x)/g(x) = lim_{x→a} f′(x)/g′(x)
Box: «falls:» lim_{x→a} f(x) = 0 und lim_{x→a} g(x) = 0  «oder»  lim_{x→a} f(x) = ±∞ und lim_{x→a} g(x) = ±∞ (A-008)

Bsp. (pink «0» over numerator and denominator, blue «BH» over the first «=»):
- lim_{x→0} sin(x)/x =BH lim (sin(x))′/(x)′ = lim cos(x)/1 = 1
- lim_{x→0} (cos(x) − 1)/x =BH lim (cos(x) − 1)′/(x)′ = lim −sin(x)/1 = 0 (pink «1» and «0» over cos(x) − 1: cos → 1, so 1 − 1 = 0)
- lim_{x→0} tan(5x)/x =BH lim (tan(5x))′/(x)′ = lim (5 · 1/cos²(5x))/1 = lim 5/cos²(5x) = 5
  Light-blue box: tan(x)′ = 1/cos²(x).
