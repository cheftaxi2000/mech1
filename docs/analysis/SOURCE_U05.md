# Übung 5 — transcription (Analysis 1 – Übung 5, arazzakov.ch PDF, 9 pages)

Faithful transcription of the content pages. Formulas in plain TeX. Boxed formulas on the slide are marked **[Box]**
(blue frame) or **[Box pink]** (magenta frame). Page 1 header: e-mail, password, QR code (organisational, ignored).
Memes on pp. 2, 6, 9 ignored.

## S. 1 — Fehlerrechnung

«Wir messen eine Grösse x mit Messfehler Δx. Mit dieser gemessenen Grösse x berechnen wir eine Grösse f(x). Wie wirkt
sich der Messfehler Δx auf f aus?»

    \Delta f = f(x+\Delta x) - f(x)

«Für kleine Δx hilft die Tangente:»

- **[Box]** `\Delta f \approx df = f'(x)\cdot\Delta x`
- *Absoluter Fehler* (blue heading) **[Box]** `E_f = |\Delta f| \approx |f'(x)|\cdot|\Delta x|`
- *Relativer Fehler* (blue heading) **[Box]** `r_f = \frac{E_f}{|f(x)|} \approx \frac{|f'(x)|\cdot|\Delta x|}{|f(x)|},\quad f(x)\neq 0`

Purple line: «**Absolut**: wie viel?» — «**Relativ**: wie viel im Verhältnis? Für Prozent: ×100.»

### Bsp. Rechteck

«Nur a wird gemessen. b ist bekannt.»

    A(a) = a\cdot b
    \Delta A = (a+\Delta a)b - a\cdot b = b\cdot\Delta a

**[Box]** `\frac{|\Delta A|}{A} = \frac{b|\Delta a|}{a\cdot b} = \frac{|\Delta a|}{a}\quad (a, b > 0)`

    a = 12\,\mathrm{m},\quad b = 3\,\mathrm{m},\quad |\Delta a| = 0{,}1\,\mathrm{m}
    E_A = 0{,}3\,m^2,\qquad r_A = \frac{0{,}1}{12} \approx 0{,}833\%

Drawing (right): a magenta rectangle (width a, height b; labels «a» above, «b» left, magenta), a blue strip on its
right side (overlapping the magenta outline a little), below it a double arrow «<–>» and «Δa» (blue).

## S. 2 — Bsp. Zylinder und Quader

*Zylinder: Nur der Radius schwankt*

    \frac{|\Delta r|}{r} = 1\%,\qquad h = 1\ \text{fest}
    V(r) = \pi r^2 h \;\Rightarrow\; V'(r) = 2\pi r h

**[Box]** `\frac{|\Delta V|}{V} \approx \frac{2\pi r h\,|\Delta r|}{\pi r^2 h} = 2\frac{|\Delta r|}{r} = 2\%`

«Radius zum Quadrat ⇒ ungefähr doppelter relativer Fehler.»

Drawing: cylinder («Zylinder»), height arrow «h = 1» on the left, magenta radius arrow «r» on the top face.

*Quader: Nur eine Seite schwankt*

    a = 25,\quad b = 20,\quad c = 50,\quad |\Delta a| = 1
    d(a) = \sqrt{a^2+b^2+c^2} \Rightarrow d'(a) = \frac{a}{\sqrt{a^2+b^2+c^2}} = \frac{a}{d}
    d = \sqrt{3525} \approx 59{,}37
    E_d \approx \frac{a}{d}|\Delta a| = \frac{25}{\sqrt{3525}}\cdot 1 \approx 0{,}421

**[Box]** `r_d \approx \frac{a|\Delta a|}{d^2} = \frac{25}{3525} \approx 0{,}709\%`

Drawing: blue box («Quader»), labels a = 25 (front bottom), b = 20 (depth), c = 50 (height); space diagonal d in
magenta from the front bottom-left corner to the back top-right corner.

## S. 3 — Mittelwertsatz

«Sekante: mittlere Steigung. Irgendwo dazwischen passt eine Tangente.»
«Falls f auf [a, b] stetig und auf (a, b) differenzierbar ist:»

**[Box]** `a < b \;\Rightarrow\; \exists c\in(a,b):\; f'(c) = \frac{f(b)-f(a)}{b-a}`

Figure: f(x) = x² (black) on about [0,3; 3,4]; points (1, 1) and (3, 9) black; secant through them magenta dashed;
tangent at (2, 4) blue with a blue dot. Text in the figure: «f(x) = x²», «Sekante: m = 4» (magenta), «Tangente: m = 4»
(blue), «⇒ parallel». Ticks 1, 2, 3 on x; 1, 4, 9 on y.

*Bsp.* `f(x) = x^2,\quad [a,b] = [1,3]`

**[Box]** `m_{\text{Sekante}} = \frac{9-1}{3-1} = 4`, `f'(c) = 2c = 4 \Rightarrow c = 2`

*Satz von Rolle* — «Gleiche Höhe ⇒ irgendwo waagerecht. Dieselben Bedingungen!»

**[Box pink]** `f(a) = f(b) \;\Rightarrow\; \exists c\in(a,b):\; f'(c) = 0`

## S. 4 — Extremum oder Wendepunkt?

    f' > 0: \nearrow \qquad f' < 0: \searrow

«Waagerecht ist erst ein Kandidat!» `f'(x_0) = 0`

«Falls f zweimal stetig differenzierbar ist:» (table, rows coloured blue / magenta / purple)

| | |
|---|---|
| f′(x₀) = 0 & f″(x₀) > 0 | lokales Minimum |
| f′(x₀) = 0 & f″(x₀) < 0 | lokales Maximum |
| f′(x₀) = 0 & f″(x₀) = 0 | noch keine Entscheidung |

«Alternativ: Vorzeichenwechsel von f′ prüfen. f sei bei x₀ stetig, daneben differenzierbar.»
`+ → −`: Maximum (plus blue, minus magenta); `− → +`: Minimum.

*Krümmung*

    f' = 0 \;\&\; f'' > 0:\ \text{konvex (blue)} \qquad f' = 0 \;\&\; f'' < 0:\ \text{konkav (magenta)}   (→ A-012)

«Waagerechte Tangente dazu ⇒ Sattelpunkt» — «Krümmung wechselt ⇒ Wendepunkt»

Three small graphs, each with the part where f″ < 0 in magenta and f″ > 0 in blue, black dot at 0:
- f(x) = x³: «f″ < 0» (magenta, left), «f″ > 0» (blue, right); dashed horizontal tangent; «Sattelpunkt», «f′(0) = 0».
- f(x) = x⁴: «f″ > 0» on both sides (blue); dashed horizontal tangent; «Kein Wendepunkt», «f′(0) = 0».
- f(x) = x³ + x: «f″ < 0» left magenta, «f″ > 0» right blue; dashed oblique tangent (slope 1); «Wendepunkt», «f′(0) = 1».

Table: | f(x) | f″(x) | Bei x = 0 |
- x³ | 6x: − → + | Sattelpunkt
- x⁴ | 12x²: + → + | kein Wendepunkt
- x³ + x | 6x: − → + | Wendepunkt, f′(0) = 1

## S. 5 — Extremalstellen bestimmen

«Stetiges f auf [a, b]: Ränder, nicht ableitbare Stellen und f′ = 0 prüfen. Dann Werte vergleichen.»

*Bsp. 1*

    f(x) = x^3 - x,\qquad D_f = [-\tfrac12, 1]
    f(-\tfrac12) = \tfrac38,\qquad f(1) = 0
    f'(x) = 3x^2 - 1 = 0 \Rightarrow x = \pm\frac{1}{\sqrt3}
    -\frac{1}{\sqrt3}\notin D_f,\qquad f\!\left(\frac{1}{\sqrt3}\right) = -\frac{2}{3\sqrt3}

**[Box]** `\max(f) = \frac38 \text{ bei } x = -\frac12,\qquad \min(f) = -\frac{2}{3\sqrt3} \text{ bei } x = \frac{1}{\sqrt3}`

*Bsp. 2*

    g(x) = x^4 - x^2,\qquad D_g = [-2, 2]
    g'(x) = 2x(2x^2-1) = 0 \Rightarrow x = 0, \pm\frac{1}{\sqrt2}

| x | −2 | −1/√2 | 0 | 1/√2 | 2 |
|---|---|---|---|---|---|
| g(x) | 12 | −1/4 | 0 | −1/4 | 12 |

Two graphs: left «Intervall [−2, 2]», graph blue, blue dots at (±2, 12), «globale Maxima», dotted line at 12.
Right «Zoom um x = 0»: black dot at (0, 0) «lokales Maximum», magenta dots at (±1/√2, −1/4), dotted line at −1/4,
caption «globale Minima» (magenta).

**[Box]** `\max(g) = 12 \text{ bei } x = \pm 2,\qquad \min(g) = -\tfrac14 \text{ bei } x = \pm\frac{1}{\sqrt2}`

Blue line: «Lokal: nur die Umgebung.» — «Global: alle erlaubten Stellen. Bei x = 0 also nur lokal!»

## S. 6 — Bernoulli-L'Hôpital; Zahlenmengen

**[Box]** `\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}`
**[Box]** «falls: `\lim_{x\to a} f(x) = 0 und \lim_{x\to a} g(x) = 0` oder `\lim_{x\to a} f(x) = \pm\infty und \lim_{x\to a} g(x) = \pm\infty`» (→ A-008)

*Bsp. 1*

    \lim_{x\to\infty}\frac{\ln x}{e^{2x}} = \lim_{x\to\infty}\frac{1/x}{2e^{2x}} = \lim_{x\to\infty}\frac{1}{2xe^{2x}} = 0
    \lim_{x\to\infty}\ln x = \infty,\qquad \lim_{x\to\infty} e^{2x} = \infty

Number sets (bottom of the page; «+» on ℕ⁺ and «2» on i² handwritten in black):

- ℕ = natürliche Zahlen = {(0), 1; 2; 3; …}  ℕ⁺ = ℕ \ {0} = {1; 2; 3; …}
- ℤ = ganze Zahlen = {0; ±1; ±2; ±3; …}
- ℚ = rationale Zahlen = {p/q: p, q sind ℤ und q ≠ 0}
- ℝ = reelle Zahlen = alle Zahlen die auf der Zahlengerade liegen
- ℂ = komplexe Zahlen = {z = a − ib: a, b sind ℝ und i = √−1 oder i² = −1} (→ A-013); magenta arrow from i: «Imaginäre Einheit»

## S. 7 — Komplexe Zahlen

    x^2 = -1 \;\Rightarrow\; x = \pm i,\qquad i^2 = -1

**[Box]** `z = a + bi,\qquad a, b\in\mathbb R`

    Re(z) = a,\qquad Im(z) = b\quad(\text{nicht } bi!)

Figure: axes «Re» (right) and «Im» (up); z = 3 + 4i blue dot with blue arrow from 0, label «|z| = 5» along it; blue
dashed lines to 3 on Re and 4 on Im. z̄ = 3 − 4i magenta dot and arrow, magenta dashed lines to −4 on Im.
«Realteil: rechts/links» — «Imaginärteil: oben/unten»

*Addieren / Subtrahieren* — «Gleiches zu Gleichem.»

**[Box]** `(a+bi)\pm(c+di) = (a\pm c) + (b\pm d)i`

    z_1 = 3 + i,\qquad z_2 = 1 + 2i
    z_1 + z_2 = (3+1) + (1+2)i = 4 + 3i
    z_1 - z_2 = (3-1) + (1-2)i = 2 - i

## S. 8 — Rechnen mit komplexen Zahlen

*Multiplizieren* — «Ausmultiplizieren. Dann i² = −1 einsetzen.»

**[Box]** `(a+bi)(c+di) = (ac-bd) + (ad+bc)i`

    (3+i)(1+2i) = 3 + 6i + i + 2i^2 = 3 + 7i - 2 = 1 + 7i

*Komplex konjugierte z̄* — «Vorzeichen vor i wechseln oder Spiegelung an der reellen Achse.»

**[Box pink]** `z = a + bi \;\Rightarrow\; \bar z = a - bi`

    (a+bi)(a-bi) = a^2 + b^2 \in \mathbb R

*Dividieren* — «Mit dem konjugierten Nenner erweitern!»

**[Box]** `\frac{a+bi}{c+di} = \frac{(a+bi)(c-di)}{c^2+d^2},\quad c + di \neq 0` and
`\frac{a+bi}{c+di} = \frac{ac+bd}{c^2+d^2} + \frac{bc-ad}{c^2+d^2}\,i`

    \frac{3+i}{1+2i} = \frac{(3+i)(1-2i)}{(1+2i)(1-2i)} = \frac{3-6i+i-2i^2}{1-4i^2} = \frac{5-5i}{5} = 1 - i
    Check: (1-i)(1+2i) = 1 + 2i - i - 2i^2 = 3 + i

## S. 9 — Tips zur Serie 5 (exercise hints; not lesson content)

- Aufgabe 1: Bernoulli L'Hopital → Immer zuvor prüfen ob die Bedingungen es erlauben
- Aufgabe 2: Extremalstellen untersuchen → f′(x) → f″(x) → … ; Randpunkte beachten; Schreibt organisiert → Überblick ist alles
- Aufgabe 3: Grundformel m(t) = m₀ exp(−at) immer aufschreiben; Nach gesuchter Grösse auflösen bevor du differenzierst; Differential bei Messfehler nutzen
- Aufgabe 4: Differentialquotient erinnern; Mittelwertsatz: f(x₂) − f(x₁) = f′(…)·(x₂ − x₁) = 0
- Aufgabe 5: Absoluter Fehler bspw: dm; Relativer Fehler bspw: dm/m
