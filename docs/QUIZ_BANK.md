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
