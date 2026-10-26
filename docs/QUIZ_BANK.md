# Quiz bank — questions removed from the lessons (D-015)
The student wants the chapters to be pure explanation; questions will come back in a separate quiz part at the end of the course. These are the original checks (JSX, verified values in `src/physics/*.test.ts`), kept here to build that part. Components: `src/components/Quiz.tsx`.

## L01 koordinaten – explorer tasks (section 5)

```tsx
        <T
          de={<ul className="tasks">
            <li>Ändere im zylindrischen Modus nur <M p=".">\varphi</M> Welche Kurve beschreibt <M p="?">M</M>
              <details><summary>Antwort</summary>Einen waagrechten Kreis mit Radius <M>\rho</M> um die <span className="nowrap"><M>z</M>-Achse</span> – die <M>\varphi</M>-Linie. Das wird die <em>Kreisbewegung</em> (S. 11).</details></li>
            <li>Setze im sphärischen Modus <M p=".">{t`\theta = 90^\circ`}</M> In welcher Ebene bist du? Wie gross ist <M>\rho</M> im Vergleich zu <M p="?">r</M>
              <details><summary>Antwort</summary>In der <span className="nowrap"><M>xy</M>-Ebene</span> <M p=").">{t`(z = r\cos 90^\circ = 0`}</M> Dort ist <M p=",">{t`\rho = r\sin 90^\circ = r`}</M> die beiden Abstände sind gleich.</details></li>
            <li>Setze <M p=".">{t`\rho = 0`}</M> Welche Koordinaten verlieren ihre Bedeutung?
              <details><summary>Antwort</summary><M>\varphi</M> (und <M p="):">\psi</M> Jeder Winkel beschreibt denselben Punkt auf der <span className="nowrap"><M>z</M>-Achse</span>. Ist zusätzlich <M p=",">{t`z = 0`}</M> also <M p=",">{t`M = O`}</M> ist auch <M>\theta</M> bedeutungslos.</details></li>
            <li>Tippe auf «Bewegung abspielen». Was zeigen die drei Schieberegler, während <M>M</M> läuft?
              <details><summary>Antwort</summary>Drei Funktionen der Zeit – genau <M>{t`x = F_x(t),\ y = F_y(t),\ z = F_z(t)`}</M> aus der Vorlesung (bzw. <M>{t`\rho = F_\rho(t), \dots`}</M> in den anderen Systemen). Die rote Kurve ist die Bahnkurve.</details></li>
          </ul>}
          en={<ul className="tasks">
            <li>In cylindrical mode, change only <M p=".">\varphi</M> What curve does <M>M</M> follow?
              <details><summary>Answer</summary>A horizontal circle of radius <M>\rho</M> around the <span className="nowrap"><M>z</M>-axis</span> – the <M>\varphi</M>-line. This will be <em>Kreisbewegung</em> (p. 11).</details></li>
            <li>In spherical mode, set <M p=".">{t`\theta = 90^\circ`}</M> Which plane are you in? What is <M>\rho</M> compared with <M p="?">r</M>
              <details><summary>Answer</summary>In the <span className="nowrap"><M>xy</M>-plane</span> <M p=").">{t`(z = r\cos 90^\circ = 0`}</M> There <M p=":">{t`\rho = r\sin 90^\circ = r`}</M> both distances are equal.</details></li>
            <li>Set <M p=".">{t`\rho = 0`}</M> Which coordinates lose their meaning?
              <details><summary>Answer</summary><M>\varphi</M> (and <M p="):">\psi</M> every angle describes the same point on the <span className="nowrap"><M>z</M>-axis</span>. If also <M p=",">{t`z = 0`}</M> i.e. <M p=",">{t`M = O`}</M> then <M>\theta</M> means nothing either.</details></li>
            <li>Tap “Play a motion”. What do the three sliders show while <M>M</M> moves?
              <details><summary>Answer</summary>Three functions of time – exactly <M>{t`x = F_x(t),\ y = F_y(t),\ z = F_z(t)`}</M> from the lecture (or <M>{t`\rho = F_\rho(t), \dots`}</M> in the other systems). The red curve is the trajectory (Bahnkurve).</details></li>
          </ul>}
        />
```

## L01 koordinaten – section 8 "Überprüfe dein Verständnis"

```tsx
      {/* ------------------------------------------------------------------ 8 */}
      <Section id="check" title={<T de="8. Überprüfe dein Verständnis" en="8. Check your understanding" />}>
        <Choice
          question={<T
            de={<>Welche Koordinatenlinie durch einen Punkt <M>M</M> (nicht auf der <span className="nowrap"><M>z</M>-Achse</span>) ist in zylindrischen Koordinaten ein Kreis?</>}
            en={<>In cylindrical coordinates, which coordinate line through a point <M>M</M> (not on the <span className="nowrap"><M>z</M>-axis</span>) is a circle?</>} />}
          choices={[
            { text: <T de={<>die <span className="nowrap"><M>\rho</M>-Linie</span></>} en={<>the <span className="nowrap"><M>\rho</M>-line</span></>} />,
              why: <T de={<>Wenn man <M>\rho</M> bei festem <M>{t`\varphi, z`}</M> variiert, bewegt sich <M>M</M> radial von der Achse weg: ein gerader Strahl.</>}
                en={<>Varying <M>\rho</M> with <M>{t`\varphi, z`}</M> fixed moves <M>M</M> radially away from the axis: a straight ray.</>} /> },
            { text: <T de={<>die <span className="nowrap"><M>\varphi</M>-Linie</span></>} en={<>the <span className="nowrap"><M>\varphi</M>-line</span></>} />, correct: true,
              why: <T de={<>Fest sind <M>\rho</M> und <M p=":">z</M> alle Punkte im Abstand <M>\rho</M> von der Achse auf der Höhe <M p=",">z</M> also ein horizontaler Kreis. Deshalb erhält die Geschwindigkeit einen Term <M>{t`\rho\dot\varphi`}</M> (S. 10).</>}
                en={<>Fixed <M>\rho</M> and <M p=":">z</M> all points at distance <M>\rho</M> from the axis at height <M p=",">z</M> i.e. a horizontal circle. This is why the velocity will pick up a <M>{t`\rho\dot\varphi`}</M> term (p. 10).</>} /> },
            { text: <T de={<>die <span className="nowrap"><M>z</M>-Linie</span></>} en={<>the <span className="nowrap"><M>z</M>-line</span></>} />,
              why: <T de={<>Wenn man nur <M>z</M> variiert, bewegt sich <M>M</M> vertikal: eine Gerade.</>} en={<>Varying only <M>z</M> moves <M>M</M> vertically: a straight line.</>} /> },
            { text: <T de="keine, alle Koordinatenlinien sind gerade" en="none, all coordinate lines are straight" />,
              why: <T de="Das gilt nur für kartesische Koordinaten." en="That is only true for Cartesian coordinates." /> },
          ]}
        />
        <Choice
          question={<T
            de={<>Wie gross ist der zylindrische Winkel <M>\varphi</M> des Punktes <M>{t`(x,y,z) = (0,-2,5)`}</M> in der Konvention <M p="?">{t`0 \le \varphi < 360^\circ`}</M></>}
            en={<>What is the cylindrical angle <M>\varphi</M> of the point <M p=",">{t`(x,y,z) = (0,-2,5)`}</M> using the convention <M p="?">{t`0 \le \varphi < 360^\circ`}</M></>} />}
          choices={[
            { text: <M>{t`-90^\circ`}</M>,
              why: <T de={<>Gleiche Richtung, aber ausserhalb des verlangten Bereichs. Addiere <M p=".">{t`360^\circ`}</M> (Verwendet eine Übung <M p=",">{t`(-180^\circ, 180^\circ]`}</M> wäre das die Antwort. Prüfe immer die Konvention.)</>}
                en={<>Same direction, but outside the requested range. Add <M p=".">{t`360^\circ`}</M> (If an exercise uses <M p=",">{t`(-180^\circ, 180^\circ]`}</M> this would be the answer. Always check the convention.)</>} /> },
            { text: <M>{t`270^\circ`}</M>, correct: true,
              why: <T de={<>Die Projektion des Punktes liegt auf der negativen <span className="nowrap"><M>y</M>-Achse</span>, also <M>{t`270^\circ`}</M> von <M>+x</M> aus. Beachte: <M>{t`\arctan(y/x)`}</M> ist hier nicht definiert, weil <M p=".">{t`x = 0`}</M></>}
                en={<>The point's projection lies on the negative <span className="nowrap"><M>y</M>-axis</span>, i.e. <M>{t`270^\circ`}</M> from <M p=".">+x</M> Note <M>{t`\arctan(y/x)`}</M> is undefined here because <M p=".">{t`x = 0`}</M></>} /> },
            { text: <M>{t`90^\circ`}</M>,
              why: <T de={<>Das ist die positive <span className="nowrap"><M>y</M>-Achse</span>.</>} en={<>That is the positive <span className="nowrap"><M>y</M>-axis</span>.</>} /> },
            { text: <T de="nicht definiert" en="undefined" />,
              why: <T de={<>Nicht definiert ist <M>\varphi</M> nur auf der <span className="nowrap"><M>z</M>-Achse</span> (<M p=").">{t`\rho=0`}</M> Hier ist <M p=".">{t`\rho = 2`}</M></>}
                en={<>Undefined only on the <span className="nowrap"><M>z</M>-axis</span> (<M p=").">{t`\rho=0`}</M> Here <M p=".">{t`\rho = 2`}</M></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>r</M> für <M p=".">{t`(x,y,z) = (2,-3,6)`}</M></>} en={<>Compute <M>r</M> for <M p=".">{t`(x,y,z) = (2,-3,6)`}</M></>} />}
          value={7}
          explain={<T
            de={<><M p=".">{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M> Vorzeichen spielen für Abstände keine Rolle.</>}
            en={<><M p=".">{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M> Signs do not matter for distances.</>} />}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>\theta</M> (in Grad) für <M p=".">{t`(x,y,z) = (1,1,-\sqrt2)`}</M></>} en={<>Compute <M>\theta</M> (in degrees) for <M p=".">{t`(x,y,z) = (1,1,-\sqrt2)`}</M></>} />}
          value={135} unit="°" tol={0.005}
          explain={<T
            de={<><M p=",">{t`r = 2`}</M> <M p=",">{t`\cos\theta = z/r = -\sqrt2/2`}</M> also <M p=".">{t`\theta = 135^\circ`}</M> Das naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> ist falsch.</>}
            en={<><M p=",">{t`r = 2`}</M> <M p=",">{t`\cos\theta = z/r = -\sqrt2/2`}</M> so <M p=".">{t`\theta = 135^\circ`}</M> The naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> is wrong.</>} />}
        />
        <Predict
          prompt={<T
            de={<>Zylinder- und Kugelkoordinaten haben ihre Namen von einer Fläche «<M>{t`\text{eine Koordinate} = \text{const}`}</M>». Welche Fläche ist <M p="?">{t`\theta = \text{const}`}</M> Und insbesondere <M p="?">{t`\theta = 90^\circ`}</M></>}
            en={<>Cylindrical and spherical coordinates get their names from a surface “<M>{t`\text{one coordinate} = \text{const}`}</M>”. What surface is <M p="?">{t`\theta = \text{const}`}</M> And <M>{t`\theta = 90^\circ`}</M> in particular?</>} />}
          answer={<T
            de={<><M>{t`\theta = \text{const}`}</M> ist ein <b>Kegel</b> mit Spitze <M>O</M> um die <span className="nowrap"><M>z</M>-Achse</span> (halber Öffnungswinkel <M p=",">\theta</M> für <M>{t`\theta > 90^\circ`}</M> öffnet er sich nach unten). Für <M>{t`\theta = 90^\circ`}</M> öffnet sich der Kegel zur <b><span className="nowrap"><M>xy</M>-Ebene</span></b>. Zum Vergleich: <M>{t`r = \text{const}`}</M> ist eine Kugel (→ «sphärisch»), <M>{t`\rho = \text{const}`}</M> ein Zylinder (→ «zylindrisch»).</>}
            en={<><M>{t`\theta = \text{const}`}</M> is a <b>cone</b> with apex <M>O</M> around the <span className="nowrap"><M>z</M>-axis</span> (half-opening angle <M p=",">\theta</M> opening downwards for <M p=").">{t`\theta > 90^\circ`}</M> For <M>{t`\theta = 90^\circ`}</M> the cone opens up into the <b><span className="nowrap"><M>xy</M>-plane</span></b>. Compare: <M>{t`r = \text{const}`}</M> is a sphere (→ “spherical”), <M>{t`\rho = \text{const}`}</M> a cylinder (→ “cylindrical”).</>} />}
        />
      </Section>
```

## L02 vektoren – section 5 checks

```tsx
        <Predict
          prompt={<T de={<>Was ist <M p="?">{t`\v a\times\v a`}</M></>} en={<>What is <M p="?">{t`\v a\times\v a`}</M></>} />}
          answer={<T de={<>Der Nullvektor <M p=":">{t`\v 0`}</M> <M p=",">{t`\varphi = 0`}</M> das «Parallelogramm» ist zu einer Strecke zusammengefallen, Fläche <M p=".">{t`|\v a|^2\sin 0 = 0`}</M> Im Bild: Schieberegler auf <M p=".">{t`0^\circ`}</M></>}
            en={<>The zero vector <M p=":">{t`\v 0`}</M> <M p=",">{t`\varphi = 0`}</M> the “parallelogram” has collapsed to a segment, area <M p=".">{t`|\v a|^2\sin 0 = 0`}</M> In the figure: slider to <M p=".">{t`0^\circ`}</M></>} />}
        />
        <Choice
          question={<T de={<>Für zwei Vektoren gilt <M p=".">{t`\v a\cdot\v b < 0`}</M> Was folgt?</>} en={<>Two vectors have <M p=".">{t`\v a\cdot\v b < 0`}</M> What follows?</>} />}
          choices={[
            { text: <T de={<>Der Winkel zwischen ihnen ist grösser als <M p=".">{t`90^\circ`}</M></>} en={<>The angle between them is larger than <M p=".">{t`90^\circ`}</M></>} />, correct: true,
              why: <T de={<>Längen sind positiv, also muss <M>{t`\cos\varphi < 0`}</M> sein: <M p=".">{t`90^\circ < \varphi \le 180^\circ`}</M> Der Schatten zeigt nach hinten.</>} en={<>Lengths are positive, so <M p=":">{t`\cos\varphi < 0`}</M> <M p=".">{t`90^\circ < \varphi \le 180^\circ`}</M> The shadow points backwards.</>} /> },
            { text: <T de="Einer der Vektoren ist kürzer als null." en="One of the vectors is shorter than zero." />,
              why: <T de={<>Längen <M>{t`|\v a|`}</M> sind nie negativ. Das Vorzeichen kommt allein vom <M p=".">\cos</M></>} en={<>Lengths <M>{t`|\v a|`}</M> are never negative. The sign comes from the <M>\cos</M> alone.</>} /> },
            { text: <T de="Die Vektoren stehen senkrecht aufeinander." en="The vectors are perpendicular." />,
              why: <T de={<>Senkrecht hiesse <M p=".">{t`\v a\cdot\v b = 0`}</M></>} en={<>Perpendicular would mean <M p=".">{t`\v a\cdot\v b = 0`}</M></>} /> },
          ]}
        />
        <Choice
          question={<T de={<>Was ist <M p="?">{t`\v e_z\times\v e_y`}</M></>} en={<>What is <M p="?">{t`\v e_z\times\v e_y`}</M></>} />}
          choices={[
            { text: <M>{t`\v e_x`}</M>, why: <T de={<>Das wäre <M>{t`\v e_y\times\v e_z`}</M> (im Kreis). Hier ist die Reihenfolge umgekehrt.</>} en={<>That would be <M>{t`\v e_y\times\v e_z`}</M> (along the cycle). Here the order is reversed.</>} /> },
            { text: <M>{t`-\v e_x`}</M>, correct: true, why: <T de={<><M>{t`z\to y`}</M> läuft gegen den Kreis <M p=",">{t`x\to y\to z\to x`}</M> also Minus: <M p=".">{t`\v e_z\times\v e_y = -\,\v e_y\times\v e_z = -\v e_x`}</M></>} en={<><M>{t`z\to y`}</M> runs against the cycle <M p=",">{t`x\to y\to z\to x`}</M> so minus: <M p=".">{t`\v e_z\times\v e_y = -\,\v e_y\times\v e_z = -\v e_x`}</M></>} /> },
            { text: <M>{t`\v 0`}</M>, why: <T de={<>Nur parallele Vektoren geben <M p=".">{t`\v 0`}</M> <M>{t`\v e_z`}</M> und <M>{t`\v e_y`}</M> stehen senkrecht, die Fläche ist 1.</>} en={<>Only parallel vectors give <M p=".">{t`\v 0`}</M> <M>{t`\v e_z`}</M> and <M>{t`\v e_y`}</M> are perpendicular; the area is 1.</>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<><M p=",">{t`|\v a| = 2`}</M> <M p=",">{t`|\v b| = 3`}</M> Winkel <M p=".">{t`30^\circ`}</M> Wie lang ist <M p="?">{t`\v a\times\v b`}</M></>} en={<><M p=",">{t`|\v a| = 2`}</M> <M p=",">{t`|\v b| = 3`}</M> angle <M p=".">{t`30^\circ`}</M> How long is <M p="?">{t`\v a\times\v b`}</M></>} />}
          value={3}
          explain={<T de={<><M p=".">{t`|\v a\times\v b| = 2\cdot3\cdot\sin30^\circ = 6\cdot\tfrac12 = 3`}</M></>} en={<><M p=".">{t`|\v a\times\v b| = 2\cdot3\cdot\sin30^\circ = 6\cdot\tfrac12 = 3`}</M></>} />}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M p=".">{t`(1,2,0)\cdot(3,-1,4)`}</M></>} en={<>Compute <M p=".">{t`(1,2,0)\cdot(3,-1,4)`}</M></>} />}
          value={1}
          explain={<T de={<><M p=".">{t`1\cdot3 + 2\cdot(-1) + 0\cdot4 = 1`}</M> Positiv, also ist der Winkel kleiner als <M p=".">{t`90^\circ`}</M></>} en={<><M p=".">{t`1\cdot3 + 2\cdot(-1) + 0\cdot4 = 1`}</M> Positive, so the angle is less than <M p=".">{t`90^\circ`}</M></>} />}
        />
```

## Question ideas, lessons 3–8 (not yet written as components)

Short ideas for the quiz part at the end of the course (D-015). Every answer must be checked against the lesson and a test before it becomes a question.

### L03 basen (pp. 6–7)
- Which direction does e_φ point at the point (ρ, φ, z) = (2, 90°, 1)? (−x direction.)
- Is r = ρ e_ρ + z e_z or r = ρ e_ρ + φ e_φ + z e_z? Why is there no e_φ term?
- True/false: e_ρ, e_φ, e_z are the same three vectors at every point.

### L04 geschwindigkeit (pp. 8–9)
- A car drives 3 km in 2 min; is 90 km/h the velocity or the mean speed? What would the speedometer show?
- Why is Δr ∥ τ only in the limit Δt → 0? (Chord vs. tangent.)
- v = ṡ τ: what are |v| and the direction of v when s(t) = 4t²?

### L05 v-krummlinig (p. 10)
- Compute v for ρ = 2, ρ̇ = 1, φ̇ = 3, ż = 0 in cylindrical components; what is |v|?
- Why is ė_ρ = φ̇ e_φ and not 0? (e_ρ turns when φ changes.)
- True/false: v always lies tangential to the circle about the z-axis. (Only if ρ̇ = ż = 0.)

### L06 kreisbewegung (p. 11)
- A point on a circle of radius 0,5 m with φ̇ = 4 s⁻¹: |v| = ? (2 m/s.)
- Does v = ω × r depend on which point of the axis is used as origin? (No: ω × (r + λω) = ω × r.)
- Direction of ω for a wheel turning counterclockwise seen from above.

### L07 sdpg (pp. 12–13)
- v_A = (2, 1, 0), A→B = (1, 0, 0): which x-component must v_B have? (2.)
- Ladder: floor angle α = 30°, bottom slides at v_H = 1 m/s: v_V = ? (cot 30° ≈ 1,73 m/s.)
- Why does a stretching body violate the SdpG?

### L08 translation (pp. 13–14)
- A Ferris-wheel gondola: are all its points on circles? Is it a rotation or a translation? Why?
- Circles of the same size with different centres vs. circles with one centre and different radii: which motion is which?
- Slider crank: at which crank angles is the rod in momentary translation? Are the rod's points' accelerations then also equal? (No — momentary only.)

### L09 rotation (pp. 15–19)
- Door: the hinges at rest — which points of the door move on the biggest circle? Which turn by the biggest angle? (Handle; all the same angle.)
- Why does one point at rest not make a rotation? (Axis could wander: Kreiselung.)
- |ω| = 2 s⁻¹, M at distance 0,3 m from the axis and 0,5 m from O on the axis: |v_M| = ? (0,6 m/s — distance from the axis, not |OM|.)
- In v = ω × r, r from a point off the axis: what goes wrong? (Points on the axis would move.)
- Cube p. 19: from v_A = (v,0,−v), E at rest, find ω; does the axis pass through C?

### L10 rollen (p. 20)
- A bicycle rides at 18 km/h. How fast is the top of the tyre, the hub, the contact point? (36, 18, 0 km/h.)
- Wheel R = 0,3 m rolls with v_C = 3 m/s on the ground: ω = ? (10 s⁻¹.)
- Wheel on a belt running backwards at 1 m/s, v_C = 2 m/s, R = 0,5 m: which ω makes it roll? (v_C − ωR = u ⇒ ω = 6 s⁻¹.)
- Locked wheel sliding: where is the momentary centre? (None — translation.)

## L11 kreiselung — ideas
- Ein Kegel rollt auf dem Tisch um seine Spitze. Welche Punkte ruhen in diesem Augenblick? (Die Berührlinie; nur die Spitze ruht dauernd.)
- Warum liegt O in der Ebene E_M durch M senkrecht zu v_M? (|r_M| = konst. ⇒ v_M ⊥ r_M.)
- Warum braucht der Beweis zwei Punkte M, N mit nicht parallelen Geschwindigkeiten? (Sonst E_M = E_N, keine Schnittgerade.)
- Rollender Kegel, γ = 30°, L = 0,2 m, φ̇ = 2 1/s: v_C, |ω|, v oben? (v_C = φ̇ L cos²γ = 0,3 m/s; |ω| = φ̇ cot γ ≈ 3,46 1/s; oben 0,6 m/s — check with `kreiselGeom.test.ts` formulas.)

## L12 allgemein — ideas
- Ein Rad (Radius R) rollt mit v_C. Grundgleichung mit B = C: Geschwindigkeit des obersten Punkts? (v_C + ωR = 2v_C.)
- Warum ist ω für alle Bezugspunkte gleich? (Die Platte dreht sich um denselben Winkel, egal mit welchem Punkt man mitfährt; Rechnung S. 22.)
- Würfel S. 23 mit anderen Daten: v₁ = v₃ ⇒ ω ∥ P₁P₃ — warum? (ω × P₁P₃ = 0.)
- Gibt es beim Würfel einen ruhenden Punkt? (Nein: ω·v = −v²/L ≠ 0 für alle Punkte.)
- Leite die SdpG aus der Grundgleichung her (· BM).

## Lessons 13–15 (pp. 24–28) — ideas not yet used in Quiz 4
- Pitch of the Problem 3.30 screw: p = v_ω/ω = 1 m/rad, i.e. 2π m per turn (`screw.ts` pitch).
- ω̲ = (0,0,1), v̲_B = (−0.75, 0, 0.25) at B = (0, 0.75, 0): Z = (0,0,0), p = 0.25 (`centralAxis`).
- |v̲_B| = 2√2 ≈ 2.83 m/s in Problem 3.30; check with √(v_ω² + ω²d²), d = 1.
- True/false: «v̲_ω hängt vom Punkt ab», «ζ liegt im Körper», «mit v̲_B ⊥ ω̲ gibt es eine Schraube» — all false.
- Ladder at φ = 45°: v_V = v_H; the distance from Z to the wall corner is always L.
- Rolling wheel: speed of the top point 2ωR (Z = contact point).
- ω₁ = 1, ω₂ = 0.5 (R₁ = 0.8, R₂ = 2.8): ω₃ = 0.3, Z₃P = 8/3, ω_Arm ≈ 0.61.
- If v̲_A ∥ v̲_B and both ⊥ AB: find Z with the line through the arrow tips.
- Ladder (p. 13 in SdpG): at which α are both ends equally fast? 45°.


## Analysis 1 — ideas from the week implementers (answers computed in `src/analysis/*`)

**Week 1.** ε = 0,05: for 1 + (−1)ⁿ/n → N = 21, for n/(n+1) → N = 20 · (3n⁴ − 5n² + 2)/(7n⁴ − 4n³) → 3/7 · √(n+1) − √n → 0; √((n+1)n) − n → ½ · 1/n² + 2/n² + … + n/n² = (n+1)/(2n) → ½ · cos(πn/3): bounded, not monotonic, divergent · «converges because aₙ → 0?» (true for q = ½, false for Σ1/k) · a₁ = 1, S_∞ = 10 → q = 0,9 · S₁₆ of the harmonic series ≥ 3 (3,3807) · Σ_{k=1}^5 1/k! = 1,7167 → e − 1 · 4 + … + 24 = 84; 3 + 6 + 12 + 24 = 45; 1 + … + 100 = 5050.

**Week 2.** Image of (x−4)² on (4, 6) → (0, 4); on [5, 6) → [1, 4) · 4x + 3 on (−1, 4] → (−1, 19] · is 8 a value of (x−15)/(√x−4)? no; is x = 0 allowed? yes, 3,75 · one-sided limits of (x−1)/(2|x−1|) at 1 → ±½ · even/odd: 0,3x² + 0,5x − 1 neither; x³ + 1 not odd · limits 4/5, 1/4, 5, 0 (slide methods) · L'Hôpital on (x+1)/(x+2) at 0 not allowed (limit ½) · (x + sin x)/x → 1 although f′/g′ has no limit · Serie 2/1: D = ℝ∖{−1, 0, 2}, only zero −3.

**Week 4.** Difference quotient of x² at 1 with h = −0,5 → 1,5 · |x| differentiable at 0? no (−1 vs +1) · (x² sin x)′(0) = 0 · (5 ln(x²+2))′(1) = 10/3 · (f⁻¹)′(3) for x² + 2 → ½ and f⁻¹(3) = 1 ≠ 1/11 · arctan′(1) = ½ · tangent to 1/√(1+2x) at 4, value at 13 → 0 · normal to x² at 1: y = 3/2 − x/2 · tangents to x² at ±1 meet in (0, −1) · (uv)′ = u′v′? test with x·x.

**Week 5.** r with 2 % error: area ≈ 4 %, x³ ≈ 6 % · Quader exact Δd = 0,428 vs 0,421 · x² on [0,3; 2,9]: c = 1,6 (midpoint) · x³ − 3x on [−2, 2]: c = ±2/√3 · |x| on [−1, 1]: no c (why) · x³ − x on [−½, 1]: max 3/8 at the end · inflection points of x⁴ − x²: ±1/√6 · (2 − 3i)(1 + i) = 5 − i · (2 − 3i)/(1 + i) = −½ − 5/2 i · |3 + 4i| = 5.

**Week 6.** i²⁰²⁶ = −1 · arg(−1 − i) = 5π/4 (arctan gives π/4) · (1 + i)⁸ = 16 · roots of z³ = 8i: √3 + i, −√3 + i, −2i · |z − 2| = |z − 2i| is the line b = a · |z − (1+i)| ≤ 2 and Re(iz) > 1: empty (they touch only at 1 − i, excluded) · Serie 6/3c: smallest n with n(5π/16 + 15π/16) ∈ 2πℤ is 8 · 0 < r < 1: ⁴√r > r («Radius in die n-te Wurzel, nicht durch n teilen»).

## L16 Kräfte/Leistung — systemabgrenzung (pp. 30–31)
- System «nur Lastkörper»: welche Kräfte sind äussere? (G, Z, N₁, N₂, R₁, R₂ – alle sechs; ihre Reaktionen liegen an Erde, Zug, Träger.)
- System «Lastkörper + Träger»: wie viele äussere Kräfte? (4: G, Z, F_A, F_B.) Welche sind jetzt innere? (N₁, N₂, R₁, R₂ mit ihren Reaktionen.)
- Dieselbe Kraft N₁: für welches System äussere, für welches innere Kraft? (Lastkörper allein: äussere; Lastkörper + Träger: innere.)
- Warum ist G für jede Wahl von Lastkörper/Träger/Stützen eine äussere Kraft? (Die Reaktion greift an der Erde an.)
- Zwei Wagen (H = 70 N auf Wagen 1, P = 42 N auf Wagen 2): Σ der äusseren Kräfte für Wagen 1? (70 − 42 = 28 N), für beide Wagen? (70 N). Σ der inneren? (0.)
- Welches System wählst du, um F_A zu bestimmen, ohne N und R zu kennen? (Lastkörper + Träger.)
- True/false: «Die Summe der inneren Kräfte ist immer null» (true, Reaktionsprinzip); «Die Summe der äusseren Kräfte ist immer null» (false: nur im Gleichgewicht).
- Beim Abtrennen des Lastkörpers: welche Kraft wirkt am Träger, wenn N₁ am Lastkörper wirkt? (−N₁.)
- Our example (G = 80 N, Z = 50 N, Ort 40 %): F_A = (−25; 48) N, F_B = (−25; 32) N (`supportForces`).

## L17 Kräfte/Leistung — verteilte Kräfte (pp. 31–32)
- Einheiten: s in N/m², F (Raumkraftdichte) in N/m³, q in N/m. Welche Einheit hat ∬ s dA? (N.)
- 700 N auf 100 cm² gegen 700 N auf 10 cm²: s = 70 kPa gegen 700 kPa (Faktor 10).
- Gleichmässiger Schnee s = 1000 N/m² auf 6 m × 4 m: R = 24 kN. Mit s = 400 + 250 x (x in m): R = 27,6 kN (Mittelwert 1150 N/m²).
- Gleichlast q = 40 N/m auf L = 4 m: R = 160 N. Rampe 0…60 N/m: R = 120 N (Dreieck, ½ q_max L). Parabel 100 (x/L)²: R ≈ 133,3 N (⅓ q_max L).
- q(x) = 20 + 60 (x/L)², L = 4 m: Mittelpunktsumme n = 2: 155 N; n = 4: 158,75 N; n = 8: 159,6875 N; Integral 160 N.
- Parenthèse: Was passiert mit ΔM und mit ΔM/ΔV, wenn ΔV → 0? (ΔM → 0; ΔM/ΔV → ρ.) Bei konstantem ρ: ΔM/ΔV = ρ für jedes ΔV.
- Gewicht: 1 L Wasser (ρ = 1000 kg/m³): G = 9,81 N. Quader 2 m × 1,5 m × 0,5 m Beton (2400 kg/m³): G = 35,3 kN (3600 kg · 9,81).
- ρ g für Wasser: 9,81 kN/m³; Beton 23,5 kN/m³; Stahl ≈ 77 kN/m³.
- Dichte nimmt nach oben ab, ρ(z) = ρ₀ (1 + 0,8 (1 − z/c)): Mittelwert 1,4 ρ₀, also G um 40 % grösser als bei ρ₀ (Stahlquader 2 × 1,5 × 1,2: G = 388,1 kN).
- True/false: «q ist eine Kraft in N» (false), «R = q L gilt immer» (false: nur bei konstantem q), «ρ ist die Raumkraftdichte der Schwerkraft» (false: ρ g).
- Wo greift R = ∫ q dx an? (Das beantwortet die Seite nicht – kommt mit den Momenten.)
