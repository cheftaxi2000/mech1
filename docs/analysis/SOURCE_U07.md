# Übung 7 — transcription (Analysis 1 – Übung 7, arazzakov.ch PDF `U_07_arazzakov.pdf`, 14 pages)

Only the **new course material** (pp. 5–12) is used, as the student asked. Pages 1–4 are worked solutions of Serie 6
(1d: Apollonius circle (x − 2/3)² + (y + 2)² = 52/9; 3a: four fourth roots of w; 3b: five fifth roots, w = A⁵ = R⁵ i is
not real) — homework solutions, not used. Pages 13–14 «Tipps zur Serie 7» are hints for the next exercise sheet — not
used. Memes (pp. 5, 10, 12) ignored. Page 5 header: e-mail, password, QR code (organisational).

Lessons: `ana-nullstellen` (pp. 5–7), `ana-hyperbel` (pp. 8–10 top), `ana-groessen` (pp. 10 bottom–12).
Formulas in plain TeX. **[Box]** = blue frame, **[Box pink]** = magenta frame.

## S. 5 — Nullstellen von reellen Polynomen

- **[Box]** `p(z) = a_0 + a_1 z + a_2 z^2 + a_3 z^3 + \dots + a_n z^n`
- Pink: «n = Grad des Polynoms   a_i = reelle Koeffizienten»

*Komplexe Nullstellen*: «Eine Nullstelle ist eine Zahl, die beim Einsetzen null ergibt.»

- **[Box]** `p(z) = 0`
- `az^2 + bz + c = 0 \;\Rightarrow\; z_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`
- `b^2 - 4ac > 0`: 2 reele Nullstellen (blue); `b^2 - 4ac = 0`: doppelte reelle Nullstelle (blue); `b^2 - 4ac < 0`: 2 komplexe Nullstellen (purple).

*Bsp.*

- `z^2 - 2z + 5 = 0 \;\Rightarrow\; z_{1,2} = \frac{2 \pm \sqrt{2^2 - 4\cdot 5}}{2} = \frac{2 \pm \sqrt{4 - 4\cdot5}}{2} = 1 \pm \sqrt{-4}`
- **[Box]** `z_1 = 1 + 2i,\quad z_2 = 1 - 2i`
- Figure: axes Re, Im; 1 + 2i blue at (1, 2), 1 − 2i magenta at (1, −2), dashed guides.

«Die beiden Punkte sind Spiegelbilder an der reellen Achse.» Pink: «Komplexe Nullstellen kommen immer in komplex konjugierten Paaren vor: a + bi und a − bi».

## S. 6 — Nullstellen zählen

- **[Box]** p(z) as on S. 5; pink «n = Grad des Polynoms, a_i = reelle Koeffizienten»
- Blue example: `p(z) = z^5 - 67z^4 + 69z^3 + 27z^2 + 2026z + 104`

«Der Grad sagt, wie viele Nullstellen es insgesamt (= reell + komplex) gibt. Wiederholte Nullstellen zählen mehrfach.»

- **[Box]** `\text{Grad } n = \#\,\text{Nullstellen}`

*Bsp. Eine doppelte Nullstelle*: `p(z) = (z - 2)^2(z^2 + 1) = (z - 2)(z - 2)(z^2 + 1)`. Table «Nullstelle / Wie oft?»: 2 zweimal, i einmal, −i einmal. «Vier Nullstellen gezählt, aber nur drei verschiedene Zahlen.»

*Reelle & komplexe Nullstellen*: «r_p zählt die reellen, c_p die nicht-reellen Nullstellen, jeweils mit Vielfachheit.»

- **[Box]** `r_p + c_p = n, \qquad c_p \in \{0, 2, 4, \dots\}`

«Nicht-reelle Nullstellen kommen paarweise. Bei ungeradem Grad bleibt mindestens eine reelle übrig.» `\text{Grad 3:}\ (r_p, c_p) = (3, 0) \text{ oder } (1, 2)`.

Printed exam question **SC 9** (A): «Sei p(x) ein Polynom mit reellen Koeffizienten. Es sei bekannt, dass die komplexen Zahlen −1 − i, 0, 1 + i und −1 + i Nullstellen von p sind. Was ist der kleinstmögliche Grad von p unter diesen Bedingungen?» (A) 7 (B) 5 (C) 8 (D) 4 — (B) circled. → used as a worked example (answer and reason shown), also in `docs/QUIZ_BANK.md`.

## S. 7 — Nullstellen finden

«Gegeben ist eine Nullstelle 1 + i von p(z). Wir suchen die restlichen Nullstellen.»

- `p(z) = z^4 - 6z^3 + 23z^2 - 34z + 26 = (z - z_1)(z - z_2)(z - z_3)(z - z_4)`

*Das Paar liefert einen Faktor*: `1 + i \Rightarrow 1 - i \;\Rightarrow\; p(z) = (z - (1 + i))(z - (1 - i))(z - z_3)(z - z_4)`

- **[Box]** `(z - (1 + i))(z - (1 - i)) = (z - 1)^2 + 1 = z^2 - 2z + 2`

*Polynomdivision*:

    (z^4 − 6z^3 + 23z^2 − 34z + 26) : (z^2 − 2z + 2) = (z^2 − 4z + 13)
    −(z^4 − 2z^3 + 2z^2)
         −4z^3 + 21z^2 − 34z
        −(4z^3 + 8z^2 − 8z)          ← sign slip: should be −(−4z^3 + 8z^2 − 8z), A-019
              13z^2 − 26z + 26
            −(13z^2 − 26z + 26)
                              0

- **[Box]** `p(z) = (z^2 - 2z + 2)(z^2 - 4z + 13)`
- `z^2 - 4z + 13 = 0 \Rightarrow z_{3,4} = \frac{4 \pm \sqrt{4^2 - 4\cdot 13}}{2} = 2 \pm \sqrt{4 - 13} = 2 \pm \sqrt{-9} = 2 \pm 3i`
- `z_1 = 1 + i,\ z_2 = 1 - i,\ z_3 = 2 + 3i,\ z_4 = 2 - 3i`

Blue: «Kontrolle: vier Nullstellen für ein Polynom vierten Grades.» Printed **SC 8** (A): «Wie viele reelle, mit Vielfachheit gezählten Nullstellen hat das Polynom P(x) = x⁴ − x?» (A) 1 (B) 3 (C) 4 (D) 2 — (D) circled.

## S. 8 — Hyperbolische Funktionen

- Pink: `e^{ix} = \cos(x) + i\sin(x), \qquad z = re^{ix}`
- **[Box]** `\cos(x) = \frac{e^{ix} + e^{-ix}}{2}, \qquad \sin(x) = \frac{e^{ix} - e^{-ix}}{2i}`

«Aber was passiert, wenn wir statt x einfach ix in den cos(•) oder −i sin(•) einsetzen?»

- `\cos(ix) = \frac{e^{x} + e^{-x}}{2}, \qquad -i\sin(ix) = \frac{e^{x} - e^{-x}}{2}`
- `\cos(ix) = \cosh(x), \qquad -i\sin(ix) = \sinh(x)`
- **[Box]** `\cosh(x) = \frac{e^x + e^{-x}}{2} \qquad \sinh(x) = \frac{e^x - e^{-x}}{2} \qquad \tanh(x) = \frac{\sinh(x)}{\cosh(x)}`

Figure: graphs of cosh (blue), sinh (magenta), tanh (green) with dashed lines y = ±1; point (0, 1) on cosh.
«cosh = achsensymmetrisch zur y-Achse = gerade; sinh & tanh = punktsymmetrisch zum Ursprung = ungerade».

- `\cosh(0) = 1, \qquad \sinh(0) = 0, \qquad \tanh(0) = 0`
- Pink: «cosh x ≥ 1. Der Graph von tanh bleibt zwischen −1 und 1.»
- `\lim_{x\to\infty} \tanh(x) = 1, \qquad \lim_{x\to-\infty} \tanh(x) = -1`

## S. 9 — Rechnen mit sinh und cosh

- Blue: `\cos^2(ix) + \sin^2(ix) = 1`; `\cos(ix) = \cosh(x) \qquad \sin(ix) = i\sinh(x)`
- **[Box]** `\cosh^2(x) - \sinh^2(x) = 1`

*Ableitungen*

- **[Box]** `(\sinh x)' = \cosh x, \qquad (\cosh x)' = \sinh x`
- «Bei der Ableitung von cosh entsteht kein Minuszeichen.»
- **[Box]** `(\tanh x)' = \frac{\cosh^2 x - \sinh^2 x}{\cosh^2 x} = \frac{1}{\cosh^2 x}`

*Additionsformeln*

- `\sinh(x + y) = \sinh(x)\cosh(y) + \cosh(x)\sinh(y)`
- `\cosh(x + y) = \cosh(x)\cosh(y) + \sinh(x)\sinh(y)`

*Umkehrfunktionen auf einen Blick*

- **[Box]** `\operatorname{Arsinh} x = \ln\bigl(x + \sqrt{x^2 + 1}\bigr),\ x \in \mathbb R` — `(\operatorname{Arsinh} x)' = \frac{1}{\sqrt{x^2 + 1}}`
- **[Box]** `\operatorname{Arcosh} x = \ln\bigl(x + \sqrt{x^2 - 1}\bigr),\ x \ge 1` — `(\operatorname{Arcosh} x)' = \frac{1}{\sqrt{x^2 - 1}},\ x > 1`
- **[Box]** `\operatorname{Artanh} x = \frac12\ln\Bigl(\frac{1 + x}{1 - x}\Bigr),\ -1 < x < 1` — `(\operatorname{Artanh} x)' = \frac{1}{1 - x^2}`

## S. 10 — graphs, SC 4, growth plot

- Figure: artanh x (green, between dashed x = ±1), arsinh x (blue), arcosh x (magenta, from (1, 0)); legend «arsinh: x ∈ ℝ, arcosh: x ≥ 1, artanh: −1 < x < 1». Meme ignored.
- Printed **SC 4** (I): «Welche der untenstehenden Funktionen g ist eine Asymptote von f(x) = cosh(2x) wenn x → +∞?» (A) e^x/2 (B) e^x (C) e^{2x}/2 (D) e^{2x} — (C) circled.
- Figure (log scale y from 10⁻¹ to 10⁷, x from 1 to 10): x! (red dots and line), 2^x (blue), x² (green), x ln x (magenta), x (purple), ln x (brown), 1 (grey dashed).

## S. 11 — Grössenordnungen

*Kleines o: im Vergleich verschwindend klein* — pink «f(x) wächst langsamer als g(x)»

- **[Box]** `f(x) = o(g(x)) \text{ für } x \to a \iff \lim_{x\to a} \frac{f(x)}{g(x)} = 0`
- `\lim_{x\to\infty} \frac{x^2}{x^3} = \frac1x \longrightarrow 0 \;\Rightarrow\; x^2 = o(x^3)`
- **[Box pink]** «Es gilt:»
  - `x^a = o(e^{bx})` für x → ∞ und a, b > 0
  - `e^{-bx} = o(x^{-a})` für x → ∞ und a, b > 0
  - `(\ln(x))^c = o(x^a)` für x → ∞ und a, c > 0
  - `(\ln(x))^c = o(x^{-a})` für x → 0⁺ und a, c > 0 — ln x < 0 there; meant |ln x|^c, A-020
  - `x^a = o(x^b)` für x → ∞ und 0 < a < b
  - `\ln(\ln(x)) = o(\ln(x))` für x → ∞
  - `x^a = o(x^a \ln(x))` für x → ∞

*Grosses O: durch ein festes Vielfaches begrenzt*

- **[Box]** `f(x) = O(g(x)) \text{ für } x \to a \iff \lim_{x\to a} \left|\frac{f(x)}{g(x)}\right| \le A \in \mathbb R` — A-021 (the limit need not exist; meant: |f/g| stays bounded near a)

## S. 12 — Bsp.: Wachstum vergleichen

«Für x → +∞ Ordne die folgende Funktion der Grösse nach: f₁(x) = x³, f₂(x) = e^{5x+1}, f₃(x) = ln(e^{x^{1/4}} − 2), f₄(x) = √x»

- **[Box]** `e^{5x+1} \gg x^3 \gg \sqrt{x} \gg \ln\bigl(e^{x^{1/4}} - 2\bigr)`

Printed **SC 12** (II): «Welche der folgenden vier Aussagen über Grössenordnungen ist richtig?» (A) ln x = o(√(x² + x)) für x → ∞ — circled; (B) ln x = o(ln(x²)); (C) √(x² + x) = o(ln x); (D) ln(x²) = o(ln x).
Printed **SC 6** (II): «… wenn x → 0⁺?» (A) x⁻² = o(eˣ); (B) e^{1/x} = o(x⁻²); (C) e^{−1/x} = o(x⁴) — circled; (D) x⁻³ = o(e^{−1/x}).
Meme «O(n²) | O(n log n)» ignored.

## Not on the slides (added in the lessons as «Ergänzung»)
- Why the conjugate of a zero is a zero (conjugate p(z̄) = conj(p(z)) for real coefficients).
- The unit hyperbola x² − y² = 1 and the point (cosh t, sinh t) (origin of the name).
- Why the quotient x^a e^{−bx} has its maximum at x = a/b.
