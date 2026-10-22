# Source map — Analysis 1, Übung 4 (Übungs-Resümee, PDF pages 2–9)

Transcription of the content pages of «Analysis 1 – Übung 4» (teaching assistant's summary). Page 1 is a Serie-3 explanation
(handled in week 3). Header (e-mail, password, QR code) and the meme on p. 6 are ignored. Blue framed boxes = key formulas;
magenta framed boxes = conclusions. Blue text = remarks of the TA.

## p. 2 — Differenzenquotient

- Heading «Differenzenquotient». Blue: «Zeigt die mittlere Änderungsrate der Funktion über ein Intervall h».
- Blue box: `m = \frac{\Delta y}{\Delta x} = \frac{f(x_0+h) - f(x_0)}{h}, \quad h \neq 0`.
- «Sekante: Gerade durch beide Punkte. h ist die Änderung in x-Richtung.»
- Figure: axes x, y; black graph `f(x) = x^2` from 0 to about 2.5; points `P(1,1)` and `Q(2,4)` (black dots); blue dotted
  secant through P and Q, legend «Sekante: m = 3» (blue); magenta tangent at P, legend «Tangente: m = 2» (magenta);
  blue slope triangle: horizontal arrow from P to (2, 1) «Δx = 1», vertical arrow up to Q «Δy = 3». Ticks 1, 2 on x, 1, 4 on y.
- «Bsp.» `f(x) = x^2, \quad x_0 = 1`;  `\frac{(1+h)^2 - 1}{h} = \frac{2h + h^2}{h} = 2 + h`.
- Table (blue header): h | 1 | 0.5 | 0.1 | 0.01 ; Steigung | 3 | 2.5 | 2.1 | 2.01.
- Magenta box: `h \to 0 \ \Rightarrow\ m \to 2`.

## p. 3 — Differentialquotient

- «Differentialquotient = Differenzenquotient mit lim_{h→0}».
- Blue box: `f'(x_0) = \lim_{h\to 0} \frac{f(x_0+h) - f(x_0)}{h}`.
- Blue text: «Wenn es den Differentialquotienten in h gibt (d. h. der rechte und linke Grenzwert stimmen überein), so ist die
  Funktion f(x) in h differenzierbar.» «Ist die Funktion f(x) in h differenzierbar, so ist sie dort automatisch auch stetig.»
  (→ A-011: the point is x₀, not h.)
- «Bsp.» `f(x) = x^2`; `\frac{(x+h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h`; `f'(x) = \lim_{h\to0}(2x + h) = 2x`.
- «Stetig ≠> differenzierbar!» Figure `f(x) = |x|`: left branch magenta with «m_links = −1», right branch blue with
  «m_rechts = +1», black dot at 0, caption «Knick bei x = 0». Ticks −2, −1, 1, 2 and 1, 2.
- `f(x) = |x|: \quad \frac{f(h) - f(0)}{h} = \frac{|h|}{h}`;
  `\lim_{h\to 0^-} \frac{|h|}{h} = -1 \neq 1 = \lim_{h\to 0^+} \frac{|h|}{h}`. «Knick bei 0: keine Ableitung.»
- Magenta box: «differenzierbar ⇒ stetig» + blue «nicht umgekehrt».

## p. 4 — Rechenregeln

- «Rechenregeln. Hier sind u, v differenzierbar.»
- «Potenzen. Exponent nach vorne, dann um 1 kleiner.» Box `(ax^n)' = anx^{n-1}, \quad (const)' = 0`.
  «Für reelle Exponenten: x > 0. Polynome gehen auf ganz ℝ.»
  `(6x^7)' = 6\cdot 7x^6 = 42x^6`; `\left(\frac{1}{x^2}\right)' = (x^{-2})' = -2x^{-3}, \quad x \neq 0`.
- «Summe / Differenz. Jeden Term einzeln ableiten. Konstanten fallen weg, Vorfaktoren bleiben stehen.»
  Box `(u \pm v)' = u' \pm v'`; `(3x^5 + 2x - 7)' = 15x^4 + 2`.
- «Produkt». Box `(uv)' = u'v + uv'` (the «+» magenta). `f(x) = 4x^5(x^7 - x^2)`;
  `f'(x) = 20x^4(x^7 - x^2) + 4x^5(7x^6 - 2x)`.

## p. 5 — Quotient und Kette

- «Quotientenregel». Box `\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}, \quad v \neq 0` (the «−» magenta).
  «Bsp.» `f(x) = \frac{x^2}{x+1}, \quad x \neq -1`; `f'(x) = \frac{2x(x+1) - x^2}{(x+1)^2} = \frac{x^2 + 2x}{(x+1)^2}`.
- «Kettenregel. Aussen ableiten, innen stehen lassen. Dann mal innere Ableitung.» Box `(g(u(x)))' = g'(u(x))\,u'(x)`.
  «Bsp.» `f(x) = (3x^2+5)^3`; `u = 3x^2 + 5, \ u' = 6x, \quad g(u) = u^3, \ g'(u) = 3u^2`;
  `f'(x) = 3(3x^2+5)^2 \cdot 6x = 18x(3x^2+5)^2`.
- «Noch ein Bsp.» `(\tan(g(x)))' = \frac{1}{\cos^2(g(x))}\cdot g'(x)`. Blue: «Hier: cos(g(x)) ≠ 0. Innere Ableitung nicht vergessen!»

## p. 6 — Beispiele, Spezialfälle

- «Bsp. mit Kettenregel»: `(\sin(5x^3))' = \cos(5x^3)\cdot 15x^2`; `((5e^{x^2})' = 5e^{x^2}\cdot 2x = 10xe^{x^2}` (one opening
  parenthesis too many on the slide — typo, rendered balanced); `(5\ln(x^2+2))' = 5\frac{2x}{x^2+2}`.
- «Bsp. mit Produktregel»: `(x^2\sin(x))' = 2x\sin(x) + x^2\cos(x)`.
- «Bsp. mit Quotientenregel»: `\left(\frac{\sin(x)}{x}\right)' = \frac{x\cdot\cos(x) - \sin(x)}{x^2}, \quad x \neq 0`.
- «Spezialfälle. Winkel im Bogenmass! Bei einer Verkettung kommt die innere Ableitung dazu.»
  Table Funktion | Ableitung: sin(g(x)) | cos(g(x))·g′(x); cos(g(x)) | −sin(g(x))·g′(x) (minus magenta);
  tan(g(x)) | g′(x)/cos²(g(x)) = g′(x) + tan²(g(x))·g′(x); ln(g(x)) | g′(x)/g(x); e^{g(x)} | e^{g(x)}·g′(x).
- «Beim Tangens: cos(g(x)) ≠ 0. Beim Logarithmus: g(x) > 0.» (Meme «When you derive eˣ» ignored.)

## p. 7 — Umkehrfunktion ableiten

- Box `(f^{-1})'(y) = \frac{1}{f'(f^{-1}(y))}`. «f auf einem Intervall umkehrbar und differenzierbar; am inneren Punkt f′ ≠ 0.»
- «Bsp.» `f(x) = x^2 + 2, \quad x \geq 0`. «Nur die rechte Hälfte nehmen! Sonst treffen zwei x denselben Wert.»
  `f^{-1}(y) = \sqrt{y-2}, \quad y \geq 2`; `f'(x) = 2x`.
  Box `(f^{-1})'(y) = \frac{1}{2f^{-1}(y)} = \frac{1}{2\sqrt{y-2}}, \quad y > 2`.
- «Bsp. Tangens» `f(x) = \tan(x), \ -\frac{\pi}{2} < x < \frac{\pi}{2}`; `f^{-1}(y) = \arctan(y), \ y\in\mathbb R`;
  `(\arctan(y))' = \frac{1}{1 + \tan^2(\arctan(y))} = \frac{1}{1+y^2}`.
- Blue: «WICHTIG: f⁻¹ ist die Umkehrfunktion, nicht 1/f.»

## p. 8 — Lineare Ersatzfunktion = Tangenten

- «Nahe bei x₀ ersetzen wir die Funktion durch ihre Tangente.» Box `t(x) = f(x_0) + f'(x_0)\cdot(x - x_0)`.
- «Bsp.» `f(x) = x^2, \ x_0 = 1: \quad f(1) = 1, \ f'(1) = 2`; `t(x) = 1 + 2(x-1) = 2x - 1`.
- «Noch ein Bsp.» `f(x) = \frac{1}{\sqrt{1+2x}} = (1+2x)^{-1/2}, \quad x_0 = 4`. «Als Potenz schreiben. Dann Kettenregel. Hier: x > −1/2.»
  `f'(x) = -\frac12(1+2x)^{-3/2}\cdot 2 = -\frac{1}{(1+2x)^{3/2}}`; `f(4) = \frac13, \quad f'(4) = -\frac{1}{27}`.
  Box `t(x) = \frac13 - \frac{1}{27}(x-4) = \frac{13-x}{27}`.
- Figure: blue `f(x) = 1/\sqrt{1+2x}` from (0, 1) decreasing; magenta `t(x) = \frac13 - \frac{x-4}{27}`; black point
  `P(4, \frac13)` with dotted guide lines to the axes; x ticks 2, 4, 6, 8; y ticks 1/3, 1 (unequal axis scales).
- Blue: «Check: t(x₀) = f(x₀) und t′(x₀) = f′(x₀).»

## p. 9 — Tipps zur Serie 4 (only the general part is lesson content)

- Aufgabe 1: «Ableitungsregeln; Bei g) & h) Differentialquotient anwenden». Aufgabe 2: «Gerade = f(−x) = f(x) & Ungerade =
  f(−x) = −f(x). In Differentialquotient einsetzen → Umformen & f(−x) = f(x) bzw f(−x) = −f(x) nutzen → Substituiert ab
  bestimmtem Punkt u = −Δx». Aufgabe 3: «Tangente bilden; Orthogonale Steigung bilden; Der Schnittpunkt durch Gleichsetzen
  beider Tangenten (Aufpassen: Flüchtigkeitsfehler!!!)».
- Figure (English, from a textbook): «Tangent and Normal Lines». Blue curve y = f(x), point P (blue), magenta «Tangent»
  through P, green «Normal» through P with a right-angle mark. Box «Equations»:
  Tangent line (magenta): `y - y_0 = f'(x_0)(x - x_0)`; Normal line (green): `y - y_0 = -\frac{1}{f'(x_0)}(x - x_0)`.
  (The normal formula needs f′(x₀) ≠ 0; for f′(x₀) = 0 the normal is the vertical line x = x₀ — proposed review item.)
