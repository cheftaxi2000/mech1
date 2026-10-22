# Source — «Analysis 1 – Übung 3» (U03.pdf) + U04.pdf p. 1

Teaching assistant's summary of exercise class 3 (12 pages, A4, typeset with coloured remarks). Not committed (D-003).
Colours: **blue** = TA's explanation/example, **magenta** = warning/emphasis, grey = legend. Memes/QR code ignored.
Citation: `<Src u={3} p={n} />`.

## p. 1 — Stetigkeit; Recap Schreibweise
- «Stetig heisst anschaulich: Wir können den Graphen ohne Absetzen zeichnen. An der Stelle **a** darf nichts «springen».»
- Magenta box: `\lim_{x\to a^-} f(x) = f(a) = \lim_{x\to a^+} f(x)`. Blue: «Von links und rechts kommt derselbe Wert heraus. Dieser Wert muss auch f(a) sein.»
- «Am Rand eines Intervalls schauen wir nur von der erlaubten Seite.»
- Meme (Real Analysis Student: ε–δ definition vs Precalculus Student: «If I can draw it without picking my pen up, it's continuous») — ignored.
- Recap Schreibweise: `f: D \subseteq \mathbb R \to \mathbb R,\ x \mapsto f(x)`; blue: «D: erlaubte x-Werte», «f(D): erreichbare y-Werte».
- «Menge: Wir sammeln alle x, die eine Bedingung erfüllen.» `\{x\in\mathbb R \mid x^2 < 2\}` oder z.B. `\{1,2,3\}`.
- «Intervalle: [ ] = Rand dabei, ( ) = Rand nicht dabei.» `(a,b): a<x<b`, `[a,b]: a\le x\le b`, `(a,b]: a<x\le b`, `[a,b): a\le x<b`.
- Blue: «Bei ± ∞ ist die Klammer immer rund.»

## p. 2 — Lücken und Sprünge
- **Hebbare Lücke.** «Hier fehlt nur ein Punkt.» `f(x) = \frac{x^2-1}{x-1} = x+1`; magenta «Kürzen geht nur für x ≠ 1!»; `\lim_{x\to1} f(x) = 2`. «Setzen wir f(1) = 2, ist das Loch zu.» Graph: line y = x+1 on [−1.5, 3], open circle at (1, 2), label «Loch».
- **Polstelle.** «Der Graph läuft nach oben oder unten weg.» `g(x) = 1/x`; `x\to0^-: g(x)\to-\infty`, `x\to0^+: g(x)\to+\infty`. Graph: hyperbola, magenta dashed line x = 0.
- **Sprungstelle.** `h(x) = \begin{cases} -2-\sqrt{4-x}, & x\le 4\\ 0, & x>4\end{cases}`. Magenta: «Links: −2 Rechts: 0. Die beiden Seiten passen nicht zusammen.» Graph: left branch rising from ≈ −4 (x = 0) to the filled dot (4, −2); open circle at (4, 0), horizontal line y = 0 for x > 4.

## p. 3 — Zwischenwertsatz
- «Stetig = kein Sprung. Starten wir unter einer Höhe und landen darüber, müssen wir diese Höhe irgendwo treffen.»
- `f` stetig auf `[a,b]`, `m` zwischen `f(a)` und `f(b)`; blue box: `\Rightarrow` mindestens ein `c\in[a,b]` mit `f(c) = m`.
- **Bsp. 1: Gibt es eine Nullstelle?** `f(x) = x^3-x-1`; «Polynom → stetig»; `f(1) = -1 < 0`, `f(2) = 5 > 0`. Blue: «Also liegt eine Nullstelle zwischen 1 und 2.» Graph on [0, 2.2]: blue dots (1, −1), (2, 5), magenta dot at the root (≈ 1.32).
- Magenta: «Der ZWS sagt: mindestens eine. Er sagt nicht, wo genau.»
- **Bsp. 2: Geht auch h(x) = −π?** «Wir nehmen den linken Teil von h aus dem letzten Beispiel … Auf [−1, 4] ist dieser Teil stetig.» Box: `h(-1) = -2-\sqrt5 < -\pi < -2 = h(4)`. Blue: «−π liegt dazwischen → es gibt ein passendes x in (−1, 4).»

## p. 4 — Graphen verschieben und strecken
- Bsp. `p(x) = 2x^3-3x^2-6x+6`. Legend: grey dashed = p(x), blue solid = «veränderter Graph».
- **In x-Richtung verschieben** `f(x-a)`: «a > 0: rechts (magenta) a < 0: links»; blue «p(x + 2): 2 nach links». Graph on [−4, 4] × [−10, 10].
- **In y-Richtung verschieben** `f(x)+b`: «b > 0: oben b < 0: unten (magenta)»; «p(x) + 4: 4 nach oben».
- **In x-Richtung strecken/stauchen** `f(cx),\ c\ne0`: «Breite × 1/|c|» (|c| magenta). «Für c < 0: zusätzlich an der y-Achse spiegeln.» «p(2x): halb so breit».
- **In y-Richtung strecken/stauchen** `d\cdot f(x)`: «Höhe × |d|. Für d < 0: zusätzlich an der x-Achse spiegeln.» «2p(x): doppelt so hoch».

## p. 5 — Kehrwert und Umkehrfunktion
- **Kehrwert der y-Werte** `\frac{1}{f(x)}`: «Jeder y-Wert wird zu 1/y. Nur möglich, wenn f(x) ≠ 0.» Bsp. 1/p(x): graph [−4, 4] × [−3, 3] with poles at the three zeros of p.
- **Kehrwert im x einsetzen** `f(1/x)`: «Erst 1/x rechnen, dann f anwenden. x ≠ 0 und 1/x muss in D liegen.» Bsp. p(1/x): graph [−4, 4] × [−12, 12].
- Magenta box: `f^{-1}(x) \ne \frac{1}{f(x)}` im Allgemeinen.
- «Umkehren: Welches x hat diesen y-Wert geliefert?» `x^2 = 9 \Rightarrow x = 3` oder `x=-3`; magenta «Zwei Möglichkeiten. So können wir nicht eindeutig zurückrechnen.» `x^3 = 8 \Rightarrow x = 2` eindeutig!

## p. 6 — Injektiv, surjektiv, bijektiv
- Grey: «D = Definitionsbereich Z = Zielbereich».
- **Injektiv**: «Kein y-Wert wird von zwei verschiedenen x getroffen.» `f(x) = 2x+1` injektiv; `g(x) = x^2: g(-2) = g(2) = 4`; magenta «x² auf ℝ ist also nicht injektiv.» Blue «Graph-Test: Jede waagerechte Linie trifft höchstens einmal.» «Zum Rechnen: f(x₁) = f(x₂) ⇒ x₁ = x₂». Diagram: two ovals D, Z with 4 dots each; arrows 1→3, 2→2, 3→1, 4→4 (crossing).
- **Surjektiv**: «Jeder Wert im Zielbereich wird getroffen.» `x^3: \mathbb R\to\mathbb R` surjektiv; `e^x: \mathbb R\to\mathbb R` nicht surjektiv; magenta «eˣ ist immer positiv. 0 und negative Zielwerte werden nie erreicht.» Blue «Graph-Test: Jede **senkrechte** Linie trifft mindestens einmal.» (→ A-009: must be waagerechte). Diagram: D 4 dots, Z 3 dots; arrows 1→1, 2→1, 3→2, 4→3.
- **Bijektiv**: box «injektiv + surjektiv = bijektiv». «Jeder Zielwert wird genau einmal getroffen. Dann können wir eindeutig zurückrechnen.» Diagram: 4 → 4 parallel arrows.

## p. 7 — Umkehrfunktion bestimmen
- «Wir gehen rückwärts: Aus dem Output wird wieder der Input.» Box: `y = f(x) \longrightarrow` nach x auflösen `\longrightarrow` x, y tauschen. (Meme «this is fine» ignored.)
- Legend: magenta f, blue f⁻¹, grey «Spiegelung an y = x».
- Bsp. 1 `f:\mathbb R\to\mathbb R`, `y = 2x+3 \Rightarrow x = \frac{y-3}{2}`, `f^{-1}(x) = \frac{x-3}{2},\ x\in\mathbb R`.
- Bsp. 2 `g:[0,\infty)\to[0,\infty)`, `y = x^2,\ x\ge0 \Rightarrow x = \sqrt y`, `g^{-1}(x) = \sqrt x,\ x\ge0`.
- Bsp. 3 `h:\mathbb R\to(0,\infty)`, `y = e^x \Rightarrow x = \ln(y)`, `h^{-1}(x) = \ln(x),\ x>0`, `h^{-1}:(0,\infty)\to\mathbb R`.
- Each with a graph: f magenta, f⁻¹ blue, y = x grey dashed.

## p. 8 — Umkehrfunktion: weitere Beispiele
- **Bsp. 4: Bruchfunktion** `y = \frac{x-1}{x+2},\ y:\mathbb R\setminus\{-2\}\to\mathbb R\setminus\{1\}`.
  `y(x+2) = x-1` («× (x + 2)»); `yx+2y = x-1`; `yx-x = -1-2y` («Alle x auf eine Seite.»); `(y-1)x = -1-2y` («x ausklammern.»); `x = -\frac{2y+1}{y-1}` (magenta «÷ (y − 1), also y ≠ 1»).
  Box: `y^{-1}(x) = -\frac{2x+1}{x-1},\ x\ne1`; magenta `y^{-1}: \mathbb R\setminus\{1\}\to\mathbb R\setminus\{-2\}`.
  (Note: the function is called y, the same letter as the variable — see A-new-1.)
- **Bsp. 5: Sinus** «Sinus trifft denselben y-Wert mehrmals. Wir nehmen deshalb nur das Stück [−π/2, π/2].» `\sin:[-\frac\pi2,\frac\pi2]\to[-1,1]` (magenta), `\arcsin:[-1,1]\to[-\frac\pi2,\frac\pi2]` (blue). Graph: sin magenta, arcsin blue, y = x grey dashed.
- Purple: «Bei der Umkehrfunktion tauschen Definitionsbereich und Wertebereich die Rollen.»

## p. 9 — Asymptoten
- «Die Asymptote g(x) zur Funktion f(x) erfüllt folgende Bedingung:» box `\lim_{x\to\infty}(f(x)-g(x)) = 0` (→ A-010). Meme labels «Finding a GF / Me» on a graph — ignored.
- **Waagerechte Asymptote**: «Geht f(x) (blue) gegen die Zahl b, ist g(x) = b (magenta) die Asymptote.»
- Bsp. 1 `f(x) = \frac{2x}{x+1} = 2-\frac{2}{x+1}`; «Der Bruch rechts geht gegen 0.» `\Rightarrow g(x) = 2`. Graph: pole x = −1, magenta dashed y = 2.
- Bsp. 2 `\frac{4x^2+3}{2x^2-1} = \frac{4+3/x^2}{2-1/x^2} \longrightarrow \frac42 = 2`; «Für grosse |x| (also x ≠ 0):» «Durch die grösste Potenz teilen: hier x². Für +∞ und −∞ kommt wieder g = 2 heraus.» Graph: symmetric, poles at ±1/√2, bump (0, −3).

## p. 10 — Senkrechte Asymptote
- «Wenn f(x) bei x = a nach +∞ oder −∞ läuft, ist x = a eine senkrechte Asymptote. Eine Seite genügt.»
- Bsp. 1 `f(x) = \frac1{x-2}`; `x\to2^-: f\to-\infty`; `x\to2^+: f\to+\infty`; magenta «Asymptote: x = 2».
- Bsp. 2 `g(x) = \frac{2x+1}{x-1} = 2+\frac3{x-1}`; `x\to1^\mp: g\to\mp\infty`; «Asymptote: x = 1». Graph also shows grey dashed y = 2.
- Magenta box: «WICHTIG: Nenner = 0 reicht nicht! Erst Kürzen prüfen. Sonst kann es auch nur ein Loch sein (wie auf Seite 2).»

## p. 11 — Schiefe Asymptote
- «Bei Brüchen hilft Polynomdivision. Der Restbruch soll gegen 0 gehen. Zählergrad = Nennergrad + 1 → schiefe Gerade.»
- Bsp. 1: Schiefe Gerade `f(x) = \frac{x^2}{x+1}`. Long division: `x^2 : (x+1) = x - 1 + \frac1{x+1}`; rows `-(x^2+x)` (underlined), `-x`, `-(-x-1)` (underlined), `1`.
  `\lim_{x\to\infty}\left(x-1+\frac1{x+1}-g(x)\right) = 0`; magenta box `g(x) = x-1`. Graph: f blue, magenta dashed line.
- Bsp. 2: Auch eine Parabel geht `f(x) = \frac{x^3-3x+5}{x-1}`. `(x^3-3x+5):(x-1)`; rows `-(x^3-x^2)`, line, `x^2-3x`, `-(x^2-x\ )`, line, `-2x+5`, `-(-2x+2)`, line, `3`. `= x^2+x-2+\frac3{x-1}`. Magenta «Rest = 3 → Restbruch geht gegen 0.» `g(x) = x^2+x-2`. Graph: f blue, magenta dashed parabola.

## p. 12 — Tipps zur Serie 3 (hints only)
- A1: «Vergleiche jeden Graphen mit f₁. Was hat sich geändert: Lage, Breite, Höhe oder Vorzeichen?» Blue: «Änderung im Argument → x-Richtung. Änderung ausserhalb von f → y-Richtung.»
- A2: «Bei injektiv und surjektiv die Bereiche immer mitlesen.» `|x| = |-x| \Rightarrow` auf ℝ nicht injektiv; blue `|\cdot|:\mathbb R\to[0,\infty)` ist surjektiv. Magenta: «Bild = tatsächlich erreichte Werte. Zielbereich = die Menge rechts vom Pfeil.» «Bei min und max: Welche Werte kommen wirklich heraus? Bei Brüchen: zuerst vereinfachen und verbotene x-Werte behalten.»
- A3/4a: «Asymptote gefunden? Den Abstand prüfen:» box `f(x)-g(x)\longrightarrow0`.

## U04.pdf p. 1 — «Aufgabe 2d: Warum wird aus dem Maximum ein Minimum?» (Analysis 1 – Serie 3)
- «Gegeben ist ein positives lokales Maximum von f₅ bei t = −1/2. Das dürfen wir benutzen, ohne es nochmals zu zeigen.»
  `f_5(t) = |\tan(t^2+t)|,\qquad \tilde f_5(x) = \frac{1}{f_5(1/x)}`.
  «Wir zeigen: f̃₅ hat bei x = −2 ein positives lokales Minimum. Dafür brauchen wir keine Ableitungen.»
- «1. Der Kehrwert macht aus dem Maximum ein Minimum.» «Bei positiven Zahlen gilt: Je grösser der Nenner, desto kleiner der Bruch. Zum Beispiel: 2 < 4, aber 1/2 > 1/4. In der Nähe von t = −1/2 ist f₅(t) nirgends grösser als am Maximum. Weil f₅ dort stetig und positiv ist, bleibt sie auch ganz in der Nähe positiv.»
  Box: `0 < f_5(t) \le f_5(-\tfrac12) \Rightarrow \frac1{f_5(t)} \ge \frac1{f_5(-\frac12)}`. «Der Kehrwert ist also genau dort am kleinsten. Aus dem lokalen Maximum wird ein lokales Minimum.»
- «2. Warum liegt die neue Stelle bei x = −2?» «In der neuen Funktion setzen wir 1/x in f₅ ein. Dieser Input soll die alte Stelle −1/2 treffen:» `\frac1x = -\frac12 \Rightarrow x = -2`. «Auch die Nachbarschaft passt: Ist x nahe bei −2, dann ist 1/x nahe bei −1/2. Deshalb gilt dort:»
  Box: `\tilde f_5(x) = \frac1{f_5(1/x)} \ge \frac1{f_5(-\frac12)} = \tilde f_5(-2) > 0`. «Alle Werte in der Nähe sind also mindestens so gross wie der Wert bei −2. Genau das bedeutet: **positives lokales Minimum bei x = −2.**»
- Magenta summary box: `f_5(t)\mapsto\frac1{f_5(t)}` underbrace «Maximum wird Minimum»; `\frac1x = -\frac12 \Rightarrow x=-2` underbrace «Die Stelle verschiebt sich».
