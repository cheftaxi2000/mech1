# Source — Analysis 1, Übung 1 (and the week-1 recap in Übung 2)

Source files: `U01.pdf` (14 PDF pages), `U02.pdf` pp. 1–2 (recap of week 1). Not committed (D-003, D-023).
Typeset slides by the teaching assistant (Keynote style): black text, **blue** = sequence (Folge) boxes and underlines,
**magenta** = series (Reihe) boxes and underlines, **red** = conclusions, yellow highlighter on «oder» / «falls».
Citations: `<Src u={1} p={…} />` = PDF page of U01, `<Src u={2} p={…} />` = PDF page of U02.

## Page index

| PDF p. | Content | Use |
|---|---|---|
| U01/1–9 | title, about the TA, Polybox/WhatsApp, organisation, exam info, structure of the exercise class | ignored (organisational) |
| U01/10 | Folgen aₙ (plot with three kinds), Konvergent/Divergent, Nullfolge, Beschränkt, Monoton | `ana-folgen` |
| U01/11 | Grenzwerte: Brüche (degree rule, 3 examples), Wurzeln (3. binomische Formel), arithmetic sequence + series, Bsp. 84 | `ana-grenzwerte-folgen`, `ana-reihen` |
| U01/12 | geometric sequence + series, Bsp. 45, S∞ with Bsp. 6, harmonic series, e-series, 1+…+n | `ana-reihen` |
| U01/13–14 | «Serie 1» (exercise sheet, Dr. Andreas Steiger) with handwritten hints | quiz ideas only |
| U02/1 | Recap: arithmetic + geometric boxes, «WICHTIG: … Ankerpunkt/Startwert!», implication list with crossed-out arrows | `ana-folgen`, `ana-reihen` |
| U02/2 | Harmonische Reihe: grouping proof with coloured brackets (then: Funktionen → week 2) | `ana-reihen` |

## U01 p. 10 — «Analysis 1 - Übung 1»

**Folgen aₙ.** Plot: vertical axis aₙ, horizontal axis n (arrow). Three kinds of markers, legend on the right:
- blue squares «divergent»: rise steadily along a straight line, leave the picture at the top right;
- green crosses «konvergent & beschränkt»: rise steeply over the first ~6 n, overshoot a little, then lie on a horizontal level (about half the picture height);
- magenta circles «divergent & beschränkt»: oscillate up and down in a narrow band around the n-axis, without settling.
(Next to it a film poster «Divergent» — ignored.)

**Konvergent/Divergent**
- Konvergent => besitzt einen Grenzwert <red>=> Beschränkt</red>
- Beschränkt & Monoton steigend/fallend => <red>Konvergent</red>
- Divergent fallls nicht konvergent oder Nicht beschränkt => <red>Divergent</red>  (sic: «fallls»)

**Nullfolge**
- Folge konvergiert gegen 0

**Beschränkt**
- Alle Glieder sind in einem endlich breiten, waagerechten Parallelstreifen enthalten.

**Monoton wachsend/fallend**
- wachsend  a_{n+1} ≥ a_n   (strikt: a_{n+1} > a_n)
- fallend   a_{n+1} ≤ a_n   (strikt: a_{n+1} < a_n)

## U01 p. 11

**Grenzwerte — Brüche mit lim_{n→∞} Zähler/Nenner**
- Grad (Zähler) > Grad (Nenner):  lim_{n→∞} (5n³ + 3n + 7)/(n² − 2n) = ∞
- Grad (Zähler) = Grad (Nenner):  lim_{n→∞} (7n² + 3n)/(4n²) = 7/4
- Grad (Zähler) < Grad (Nenner):  lim_{n→∞} (1n⁵ − 4n)/(6n⁶ − 2) = 0

**Wurzeln** (magenta note at the right: «3. Binomische Formel»)

lim n·(√(1 + 1/n) − 1) = lim n·(√(1 + 1/n) − 1)·(√(1 + 1/n) + 1)/(√(1 + 1/n) + 1)
= lim n·[(1 + 1/n) − 1]/(√(1 + 1/n) + 1) = lim 1/(√(1 + 1/n) + 1) = 1/(√1 + 1) = 1/2  (double underline)

**Muss man gesehen haben:**
- arithmetische Folge (blue underline) + Reihe (magenta underline)
- blue box: «Explizit: aₙ = a₁ + d(n − 1)   Rekursiv: aₙ = aₙ₋₁ + d»
- magenta box: Sₙ = Σ_{k=1}^n a_k = ½·n[a₁ + aₙ]  *oder* (highlighted)  Sₙ = ½·n[2a₁ + d(n − 1)]
- Bsp.: 4 + 8 + 12 + 16 + 20 + 24 = ?   aₙ = 4 + (n − 1)·4;   Σ_{n=1}^6 aₙ = 6/2 [4 + 24] = 3·28 = 84 (double underline)

## U01 p. 12

- geometische (sic) Folge + Reihe
- blue box: «Explizit: aₙ = a₁·q^{n−1}   Rekursiv: aₙ = aₙ₋₁·q»
- magenta box: Sₙ = Σ_{k=1}^n a_k = a₁(1 + q + q² + … + qⁿ) = a₁·(1 − qⁿ)/(1 − q)   (**A-001**: the bracket should end with q^{n−1})
- Bsp.: 3 + 6 + 12 + 24 = 3(1 + 2 + 4 + 8), magenta arcs «·2» between 1→2→4→8; → a₁ = 3, q = 2, n = 4;
  a₁(1 − qⁿ)/(1 − q) = 3·(1 − 2⁴)/(1 − 2) = 3·(1 − 16)/(−1) = 3·15 = 45 (double underline)
- blue box: S_∞ = Σ_{k=1}^∞ a_k = a₁(1 + q + q² + …) = a₁·1/(1 − q), *falls* (highlighted) |q| < 1
- Bsp.: 3 + 3/2 + 3/4 + 3/8 + … = 3(1 + 1/2 + 1/4 + 1/8 + …) → a₁ = 3, q = 1/2; magenta «merke/prüfe |q| = 1/2 < 1» with a tick;
  3·1/(1 − 1/2) = 3/(1/2) = 3·2 = 6 (double underline)
- harmonische Reihe — blue box: Sₙ = Σ_{n=1}^∞ 1/n = 1/1 + 1/2 + 1/3 + 1/4 + 1/5 + … = ∞   (**A-003**)
- box: Sₙ = 1/1! + 1/2! + … + 1/n!;  lim_{n→∞} Sₙ = e   (**A-002**: the limit is e − 1)
- box: 1 + 2 + 3 + … + n = n(n + 1)/2

## U01 pp. 13–14 — Serie 1 (exercise sheet; handwritten hints are the student's)

1. (♥) algebra: (a) (1+√2)/(1−√2) + (1−√2)/(1+√2) «3. Binomische Formel nutzen, dafür Nenner erweitern»; (b) (a²−b²)/(a−b); (c) (a−b)/(1/a − 1/b); (d) a fraction sum for a ≠ 8; (e) ln(ab) + ln(a²/b) − 2 ln(ab); (f) log_a 5 = 1/2; (g) 7^{2a} = 2.
2. bounded? monotone? convergent? limit? (a) aₙ = cos(πn/3) «Kurve vorstellen (GeoGebra)»; (b) aₙ = 1/n² + 2/n² + … + n/n² «An Reihe der natürlichen Zahlen erinnern»; (c) (3n⁴ − 5n² + 2)/(7n⁴ − 4n³) «Trick mit teilen durch höchste Potenz»; (d) a₁ = 0, a₂ = 1, aₙ = ½(aₙ₋₁ + aₙ₋₂); (e) √(n+1) − √n «Wurzeltrick»; (f) √((n+1)n) − n «Wurzeltrick».
3. Fibonacci a₀ = a₁ = 1, aₙ = aₙ₋₁ + aₙ₋₂; bₙ = aₙ/aₙ₋₁ → golden ratio (1+√5)/2 (parts a–e).

## U02 p. 1 — «Analysis 1 - Übung 2», Recap

- arithmetic boxes as on U01/11 (Explizit/Rekursiv; Sₙ = ½n[a₁ + aₙ] *oder* ½n[2a₁ + d(n−1)]).
- geometric boxes as on U01/12, now Sₙ and S_∞ in one magenta box (same q^n slip, A-001).
- blue: «WICHTIG: Für die rekursive Darstellung braucht es einen Ankerpunkt/Startwert!»
- konvergent => besitzt einen Grenzwert => beschränkt
- konvergent => beschränkt **=/>** divergent/konvergent  (magenta stroke through the second arrow: bounded implies neither)
- konvergent **=/>** monoton wachsend/fallend  (magenta stroke through the arrow)
- divergent fallls nicht konvergent

## U02 p. 2 — Harmonische Reihe

Blue box: Sₙ = Σ_{n=1}^∞ 1/n = 1/1 + 1/2 + 1/3 + 1/4 + 1/5 + … = ∞, with coloured underlines: **blue** under 1/1 + 1/2, **magenta** under 1/3 + 1/4, **green** under 1/5 + … .
Below, three lines with coloured bars at the left (same colours):
- blue | 1 + 1/2
- magenta | 1/3 + 1/4 > 1/4 + 1/4 = 2/4 = 1/2
- green | 1/5 + 1/6 + 1/7 + 1/8 > 1/8 + 1/8 + 1/8 + 1/8 = 4/8 = 1/2
- ⋮
A purple bracket joins them: 1 + 1/2 + 1/2 + 1/2 + 1/2 + … = ∞.
(Then a meme photo — ignored; «Funktionen» starts week 2.)
