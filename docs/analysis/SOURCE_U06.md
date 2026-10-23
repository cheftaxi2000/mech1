# Übung 6 — transcription (Analysis 1 – Übung 6, arazzakov.ch PDF, 13 pages)

Faithful transcription of the content pages. Formulas in plain TeX. Boxed formulas on the slide are marked **[Box]**
(blue frame) or **[Box pink]** (magenta frame). Page 1 header: e-mail, password, QR code (organisational, ignored).
Memes on pp. 1, 4, 11 ignored. Pages 12–13 «Tipps zur Serie 6» are hints for the exercise sheet: only the general
rules on p. 12 are used in the lessons; the task-specific hints are quiz material only.

Lessons: `ana-komplex` (pp. 1–7), `ana-komplex-potenzen` (pp. 8–9, 11), `ana-komplex-bereiche` (pp. 10, 12).

## S. 1 — Komplexe Zahlen

«Welche Zahl ergibt beim Quadrieren −1? Bei den reellen Zahlen geht das nicht. Dafür führen wir i ein.»

- **[Box]** `i^2 = -1 \quad\Rightarrow\quad z^2 = -1:\ z = i \text{ oder } z = -i`

«Eine komplexe Zahl besteht aus einem Realteil und einem Imaginärteil.»

- **[Box]** `z = a + bi, \quad a, b \in \mathbb R`
- `\mathrm{Re}(z) = a, \quad \mathrm{Im}(z) = b`

Figure: axes Re, Im; blue arrow from 0 to the point `z = 3 + 2i` (blue label), dashed blue guides to 3 on Re and 2 on Im.

Magenta line: «Bei z = 3 + 2i ist der Imaginärteil 2, nicht 2i.»

## S. 2 — Rechnen mit komplexen Zahlen

*Addieren und Subtrahieren*: «Realteile zusammen, Imaginärteile zusammen.»

    (3 + 2i) + (1 - 4i) = 4 - 2i
    (3 + 2i) - (1 - 4i) = 2 + 6i

*Multiplizieren*: «Wie gewohnt ausmultiplizieren. Danach i² = −1 einsetzen.»

- **[Box]** `(3 + 2i)(1 - 4i) = 3 - 12i + 2i - 8i^2 = 11 - 10i`

*Potenzen von i*: «Nach vier Schritten beginnt alles wieder von vorne.»

- **[Box pink]** `i^0 = 1,\quad i^1 = i,\quad i^2 = -1,\quad i^3 = -i,\quad i^4 = 1`
- `i^{27} = i^{4\cdot 6 + 3} = (i^4)^6 i^3 = -i`

Blue line: «Tipp: Den Exponenten durch 4 teilen. Nur der Rest zählt.»

## S. 3 — Komplex konjugierte z̄ und Betrag

«Komplex konjugieren: Nur das Vorzeichen vor dem Imaginärteil wechseln.»

- **[Box]** `z = a + bi \quad\Rightarrow\quad \bar z = a - bi`

Figure: blue arrow to `z = 3 + 2i` labelled `r = \sqrt{13}` along the arrow; magenta arrow to `\bar z = 3 - 2i`; dashed guides
to 3, 2, −2.

«Der Betrag ist die Länge vom Ursprung bis zum Punkt.»

- **[Box]** `|z| = \sqrt{a^2 + b^2}, \qquad |3 + 2i| = \sqrt{13}`
- `z\bar z = (a + bi)(a - bi) = a^2 + b^2 = |z|^2`

«Die Konjugierte ist die Spiegelung an der reellen Achse.»

    \bar{\bar z} = z, \qquad \overline{z_1 z_2} = \bar z_1\,\bar z_2

Magenta line: «Wichtig: |z| ist eine nichtnegative reelle Zahl.»

## S. 4 — Dividieren

«Wir wollen das i aus dem Nenner entfernen. Dazu erweitern wir mit dem konjugierten Nenner.»

- **[Box]** `\frac{z_1}{z_2} = \frac{z_1\bar z_2}{|z_2|^2}, \qquad z_2 \neq 0`

Bsp. `\frac{3 + i}{1 + 2i}`. «Der konjugierte Nenner ist 1 − 2i. Oben und unten damit multiplizieren.»

    \frac{3 + i}{1 + 2i} = \frac{(3 + i)(1 - 2i)}{(1 + 2i)(1 - 2i)}
    (3 + i)(1 - 2i) = 3 - 6i + i - 2i^2 = 5 - 5i
    (1 + 2i)(1 - 2i) = 1 + 4 = 5

- **[Box]** `\frac{3 + i}{1 + 2i} = \frac{5 - 5i}{5} = 1 - i`

Check: `(1 - i)(1 + 2i) = 3 + i`. Magenta line: «Erweitern heisst: Zähler und Nenner mit derselben Zahl multiplizieren.»
(Meme 1/i vs −i ignored.)

## S. 5 — Polarform

«Statt rechts/oben beschreiben wir einen Punkt mit Länge und Winkel.»

- **[Box]** `z = a + bi = r(\cos\varphi + i\sin\varphi)`
- `r = |z| = \sqrt{a^2 + b^2}, \qquad a = r\cos\varphi, \quad b = r\sin\varphi`

Figure: blue arrow to `z = \sqrt3 + i` (blue label), labelled `r = 2` along the arrow; magenta arc at the origin with
`\varphi = \frac{\pi}{6}`; dashed guides to √3 and 1.

Bsp. `z = \sqrt3 + i: \quad r = \sqrt{3 + 1} = 2, \quad \varphi = \frac{\pi}{6}`

- **[Box]** `\sqrt3 + i = 2\left(\cos\frac{\pi}{6} + i\sin\frac{\pi}{6}\right)`

«Den Winkel ab der positiven reellen Achse gegen den Uhrzeigersinn messen.»
Magenta line: «Bei z = 0 ist r = 0. Der Winkel ist dort nicht festgelegt.»

## S. 6 — Den richtigen Winkel finden

«Zuerst den Punkt grob einzeichnen. Dann den passenden Winkel bestimmen.»

- **[Box]** `\cos\varphi = \frac{a}{r}, \qquad \sin\varphi = \frac{b}{r} \qquad (r > 0)`

Table (blue header row):

| φ | 0 | π/6 | π/4 | π/3 | π/2 |
|---|---|---|---|---|---|
| cos φ | 1 | √3/2 | √2/2 | 1/2 | 0 |
| sin φ | 0 | 1/2 | √2/2 | √3/2 | 1 |

*Bsp. Linke obere Ecke*: `z = -\sqrt3 + i, \quad r = 2`; `\cos\varphi = -\frac{\sqrt3}{2}, \quad \sin\varphi = \frac12 \;\Rightarrow\; \varphi = \frac{5\pi}{6}`

Magenta line: «arctan(b/a) allein reicht nicht: Der Wert kann in der falschen Hälfte liegen.»

*Eine ganze Drehung ändert den Punkt nicht*: `\varphi \text{ und } \varphi + 2\pi k, \quad k \in \mathbb Z`.
«Für unsere Beispiele wählen wir einen Winkel 0 ≤ φ < 2π.»

    1: 0 \qquad i: \frac{\pi}{2} \qquad -1: \pi \qquad -i: \frac{3\pi}{2}

Blue line: «Im Bogenmass rechnen: Eine volle Drehung entspricht 2π.»

## S. 7 — Eulerform und Rechenregeln

«Die Eulerform schreibt dieselbe Zahl kürzer.»

- **[Box]** `e^{i\varphi} = \cos\varphi + i\sin\varphi, \qquad z = re^{i\varphi}`

*Multiplizieren*: «Längen multiplizieren, Winkel addieren.» `(r_1e^{i\varphi_1})(r_2e^{i\varphi_2}) = r_1r_2e^{i(\varphi_1 + \varphi_2)}`

- **[Box]** `(2e^{i\pi/6})(3e^{i\pi/3}) = 6e^{i\pi/2} = 6i`

*Dividieren*: «Längen teilen, Winkel abziehen.» `\frac{r_1e^{i\varphi_1}}{r_2e^{i\varphi_2}} = \frac{r_1}{r_2}e^{i(\varphi_1 - \varphi_2)}, \quad r_2 > 0`;
`\frac{6e^{i\pi/2}}{2e^{i\pi/6}} = 3e^{i\pi/3}`

*Konjugieren*: `\bar z = re^{-i\varphi}`

Magenta line: «Addieren bleibt in der Form a + bi meistens einfacher.»

## S. 8 — Potenzen

«Die Länge potenzieren, den Winkel mit dem Exponenten multiplizieren.»

- **[Box]** `(re^{i\varphi})^n = r^ne^{in\varphi}, \qquad n \in \mathbb N`

Bsp. `\frac{1}{(1 + i)^4}`. «Zuerst 1 + i in Eulerform schreiben.»

    1 + i = \sqrt2\,e^{i\pi/4}
    (1 + i)^4 = (\sqrt2)^4e^{i\pi} = 4(-1) = -4

- **[Box]** `\frac{1}{(1 + i)^4} = -\frac14`

*Was passiert beim Multiplizieren mit i?* `i = e^{i\pi/2} \Rightarrow iz = re^{i(\varphi + \pi/2)}`.
«Der Punkt dreht sich um 90° gegen den Uhrzeigersinn. Die Länge bleibt gleich.»
`z = 6 + 7i \Rightarrow iz = 6i + 7i^2 = -7 + 6i`

Magenta line: «Wichtig: rⁿ für die Länge, nφ für den Winkel.»

## S. 9 — Wurzeln ziehen

«Gesucht sind alle Zahlen, die beim Potenzieren dieselbe Zahl ergeben.»

    z^n = w = Re^{i\theta}, \qquad R > 0, \quad n \in \{1, 2, \dots\}

- **[Box]** `z_k = \sqrt[n]{R}\,e^{i(\theta + 2\pi k)/n}, \qquad k = 0, \dots, n - 1`

«Länge: n-te Wurzel. Startwinkel: θ/n. Dann jeweils 2π/n weiterdrehen.»

Bsp. `z^4 = -16 = 16e^{i\pi} \Rightarrow z_k = 2e^{i(\pi/4 + k\pi/2)}`

Figure: grey dashed circle of radius 2 (ticks ±2), blue square with corners z₀ (magenta, upper right), z₁ (upper left),
z₂ (lower left), z₃ (lower right); magenta radius `r = 2` to z₀ with the angle `\frac{\pi}{4}`.

    \sqrt2 + i\sqrt2, \quad -\sqrt2 + i\sqrt2, \quad -\sqrt2 - i\sqrt2, \quad \sqrt2 - i\sqrt2

Magenta line: «Hier entstehen vier verschiedene Lösungen. Bei w = 0 gibt es nur z = 0.»

## S. 10 — Bereiche in der komplexen Ebene

«Ein Betrag beschreibt einen Abstand.»

- **[Box]** `|z - z_0| = R: \quad \text{Kreislinie um } z_0 \text{ mit Radius } R`
- `|z - z_0| < R: \quad \text{innen, ohne Rand} \qquad (R > 0)`

*Bsp. Kreis und Halbebene*: `|z - (1 + i)| \leq 2` «und als zweites Beispiel:» `\mathrm{Re}(iz) > 1`

Figures: left, title `|z - (1 + i)| \leq 2`: light blue disc with solid blue boundary, centre `1 + i` (blue dot), radius
segment labelled 2; caption (blue) «Rand dabei». Right, title `\mathrm{Re}(iz) > 1`: magenta shaded region below a
dashed magenta horizontal line at −1, label `b < -1`; caption (magenta) «Rand nicht dabei».

    z = a + bi \;\Rightarrow\; iz = ai - b \;\Rightarrow\; -b > 1 \;\Rightarrow\; b < -1

Blue: «Mittelpunkt 1 + i, Radius 2, Rand dabei.» Magenta: «Unterhalb von y = −1, ohne Grenzlinie.»

*Mehrere Bedingungen*: «Jede Bedingung einzeln zeichnen. Dann nur die gemeinsame Menge behalten.»
Magenta line: «Rand dabei: durchgezogen. Rand ausgeschlossen: gestrichelt.»

## S. 11 — Trigonometrische Beziehungen

«Dieselbe komplexe Zahl auf zwei Arten schreiben. Dann Realteil und Imaginärteil vergleichen.»

*Bsp. Doppelter Winkel*

    e^{2ix} = (e^{ix})^2
    \cos(2x) + i\sin(2x) = (\cos x + i\sin x)^2

«Rechts ausmultiplizieren und i² = −1 einsetzen.»

    (\cos x + i\sin x)^2 = \cos^2x - \sin^2x + i\,2\sin x\cos x

«Realteil mit Realteil vergleichen:» **[Box]** `\cos(2x) = \cos^2x - \sin^2x`
«Imaginärteil mit Imaginärteil vergleichen:» **[Box]** `\sin(2x) = 2\sin x\cos x`

Blue line: «Für den dreifachen Winkel in Serie 6 funktioniert dieselbe Idee mit der dritten Potenz.» (Meme ignored.)

## S. 12 — Tipps zur Serie 6 (general rules used; task hints = quiz material)

*Aufgabe 1: Mengen skizzieren* — «Beträge als Abstände lesen. Bei mehreren Bedingungen zählt nur die gemeinsame Menge.»
1a) |z| = 3 only the circle line, keep Im(z) ≥ 0, end points included. 1b) z = x + iy, boundary y = x, test point; with ≥
the line belongs. 1c) two circles, small one with boundary, big one without. 1d) z ≠ −i; multiply by the denominator,
square, complete the square: `(x + 2)^2 + (y - 2)^2 = 4(x^2 + (y + 1)^2)`. 1e) compare the distances to −3 + i and −2i;
after squaring a line remains; test point; first quadrant. Magenta: «Die Achsen sind ausgeschlossen. Die
Gleichheitsgrenze der Abstände gehört innerhalb des ersten Quadranten dazu.»

## S. 13 — Tipps zur Serie 6 (quiz material only)

2a/b triple angle: `\cos(3x) + i\sin(3x) = (\cos x + i\sin x)^3`, use i² = −1, i³ = −i, and sin² + cos² = 1.
3a fourth roots `z_k = \sqrt[4]{r}\,e^{i(\varphi + 2\pi k)/4}`, k = 0,1,2,3: start at φ/4, then π/2 further; «Den Radius in
die vierte Wurzel nehmen, nicht durch 4 teilen.» 0 < r < 1: compare r and ⁴√r. 3b: A = ir, r > 0; where is A⁵?
3c: equal moduli; the new angles differ by whole turns: `n\left(\frac{5\pi}{16} + \frac{15\pi}{16}\right) = 2\pi k`; smallest
positive integer n, then `c = z_1^n`.

## Source issues

None found on these pages (all worked examples recomputed in `src/analysis/week6.test.ts`).
