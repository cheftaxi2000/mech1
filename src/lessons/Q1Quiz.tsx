import { Section } from '../components/Blocks';
import { Choice, NumericAnswer, Predict, See } from '../components/Quiz';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { Q1 } from '../content/quizValues';

const t = String.raw;

/** Quiz part, chapter 1 (lecture pp. 3–7): coordinates, vectors, bases. */
export default function Q1Quiz() {
  return (
    <article className="lesson quiz-part">
      <T
        de={<p className="lede">Hier prüfst du, ob Kapitel 1 sitzt. Tippe eine Antwort an – jede Antwort hat eine Erklärung, auch die falschen. Bei Zahlen genügt ein Komma oder ein Punkt. Nichts wird gespeichert.</p>}
        en={<p className="lede">Here you check whether chapter 1 has sunk in. Tap an answer – every answer has an explanation, the wrong ones too. For numbers a comma or a point both work. Nothing is stored.</p>}
      />

      <Section id="koordinaten-quiz" title={<T de="Lage und Koordinaten" en="Position and coordinates" />}>
        <Choice
          question={<T
            de={<>Welche Koordinatenlinie durch einen Punkt <M>M</M> (nicht auf der <span className="nowrap"><M>z</M>-Achse</span>) ist in Zylinderkoordinaten ein Kreis?</>}
            en={<>In cylindrical coordinates, which coordinate line through a point <M>M</M> (not on the <span className="nowrap"><M>z</M>-axis</span>) is a circle?</>} />}
          choices={[
            { text: <T de={<>die <span className="nowrap"><M>\rho</M>-Linie</span></>} en={<>the <span className="nowrap"><M>\rho</M>-line</span></>} />,
              why: <T de={<>Ändert man nur <M p=",">\rho</M> bewegt sich <M>M</M> radial von der Achse weg: ein gerader Strahl.</>} en={<>Changing only <M>\rho</M> moves <M>M</M> radially away from the axis: a straight ray.</>} /> },
            { text: <T de={<>die <span className="nowrap"><M>\varphi</M>-Linie</span></>} en={<>the <span className="nowrap"><M>\varphi</M>-line</span></>} />, correct: true,
              why: <T de={<>Fest sind <M>\rho</M> und <M p=":">z</M> alle Punkte im Abstand <M>\rho</M> von der Achse auf der Höhe <M p=",">z</M> also ein waagrechter Kreis. <See id="koordinaten">Lage &amp; Koordinaten</See></>}
                en={<>Fixed <M>\rho</M> and <M p=":">z</M> all points at distance <M>\rho</M> from the axis at height <M p=",">z</M> i.e. a horizontal circle. <See id="koordinaten">Position &amp; coordinates</See></>} /> },
            { text: <T de={<>die <span className="nowrap"><M>z</M>-Linie</span></>} en={<>the <span className="nowrap"><M>z</M>-line</span></>} />,
              why: <T de={<>Ändert man nur <M p=",">z</M> bewegt sich <M>M</M> senkrecht: eine Gerade.</>} en={<>Changing only <M>z</M> moves <M>M</M> vertically: a straight line.</>} /> },
            { text: <T de="keine – alle Koordinatenlinien sind gerade" en="none – all coordinate lines are straight" />,
              why: <T de="Das gilt nur für kartesische Koordinaten." en="That is only true for Cartesian coordinates." /> },
          ]}
        />
        <Choice
          question={<T
            de={<>Wie gross ist der Winkel <M>\varphi</M> des Punktes <M p=",">{t`(x, y, z) = (0, -2, 5)`}</M> wenn <M p="?">{t`0 \le \varphi < 360^\circ`}</M></>}
            en={<>What is the angle <M>\varphi</M> of the point <M p=",">{t`(x, y, z) = (0, -2, 5)`}</M> if <M p="?">{t`0 \le \varphi < 360^\circ`}</M></>} />}
          choices={[
            { text: <M>{t`-90^\circ`}</M>,
              why: <T de={<>Gleiche Richtung, aber nicht im verlangten Bereich. Addiere <M p=".">{t`360^\circ`}</M></>} en={<>Same direction, but outside the requested range. Add <M p=".">{t`360^\circ`}</M></>} /> },
            { text: <M>{t`${Q1.phiDeg.toFixed(0)}^\circ`}</M>, correct: true,
              why: <T de={<>Die Projektion liegt auf der negativen <span className="nowrap"><M>y</M>-Achse</span>, also <M>{t`270^\circ`}</M> von der positiven <span className="nowrap"><M>x</M>-Achse</span> aus. Achtung: <M>{t`\arctan(y/x)`}</M> geht hier nicht, weil <M p=".">{t`x = 0`}</M> <See id="koordinaten">Lage &amp; Koordinaten</See></>}
                en={<>The projection lies on the negative <span className="nowrap"><M>y</M>-axis</span>, i.e. <M>{t`270^\circ`}</M> from the positive <span className="nowrap"><M>x</M>-axis</span>. Careful: <M>{t`\arctan(y/x)`}</M> fails here because <M p=".">{t`x = 0`}</M> <See id="koordinaten">Position &amp; coordinates</See></>} /> },
            { text: <M>{t`90^\circ`}</M>,
              why: <T de={<>Das ist die positive <span className="nowrap"><M>y</M>-Achse</span>.</>} en={<>That is the positive <span className="nowrap"><M>y</M>-axis</span>.</>} /> },
            { text: <T de="nicht definiert" en="undefined" />,
              why: <T de={<>Nicht definiert ist <M>\varphi</M> nur auf der <span className="nowrap"><M>z</M>-Achse</span> (<M p=").">{t`\rho = 0`}</M> Hier ist <M p=".">{t`\rho = 2`}</M></>} en={<>Undefined only on the <span className="nowrap"><M>z</M>-axis</span> (<M p=").">{t`\rho = 0`}</M> Here <M p=".">{t`\rho = 2`}</M></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>r</M> für <M p=".">{t`(x, y, z) = (2, -3, 6)`}</M></>} en={<>Compute <M>r</M> for <M p=".">{t`(x, y, z) = (2, -3, 6)`}</M></>} />}
          value={Q1.r}
          explain={<T de={<><M p=".">{t`r = \sqrt{4 + 9 + 36} = \sqrt{49} = 7`}</M> Vorzeichen spielen für Abstände keine Rolle.</>} en={<><M p=".">{t`r = \sqrt{4 + 9 + 36} = \sqrt{49} = 7`}</M> Signs do not matter for distances.</>} />}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>\theta</M> in Grad für <M p=".">{t`(x, y, z) = (1, 1, -\sqrt2)`}</M></>} en={<>Compute <M>\theta</M> in degrees for <M p=".">{t`(x, y, z) = (1, 1, -\sqrt2)`}</M></>} />}
          value={Q1.thetaDeg} unit="°" tol={0.005}
          explain={<T
            de={<><M p=",">{t`r = 2`}</M> <M p=",">{t`\cos\theta = z/r = -\sqrt2/2`}</M> also <M p=".">{t`\theta = 135^\circ`}</M> Das naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> ist falsch. <See id="koordinaten">Lage &amp; Koordinaten</See></>}
            en={<><M p=",">{t`r = 2`}</M> <M p=",">{t`\cos\theta = z/r = -\sqrt2/2`}</M> so <M p=".">{t`\theta = 135^\circ`}</M> The naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> is wrong. <See id="koordinaten">Position &amp; coordinates</See></>} />}
        />
        <Predict
          prompt={<T
            de={<>Welche Fläche beschreibt <M p="?">{t`\theta = \text{konst.}`}</M> Und welche <M p="?">{t`\theta = 90^\circ`}</M></>}
            en={<>Which surface is <M p="?">{t`\theta = \text{const.}`}</M> And which is <M p="?">{t`\theta = 90^\circ`}</M></>} />}
          answer={<T
            de={<>Ein <b>Kegel</b> mit Spitze <M>O</M> um die <span className="nowrap"><M>z</M>-Achse</span> (halber Öffnungswinkel <M p=").">\theta</M> Für <M>{t`\theta = 90^\circ`}</M> klappt der Kegel zur <span className="nowrap"><M>xy</M>-Ebene</span> auf. Zum Vergleich: <M>{t`r = \text{konst.}`}</M> ist eine Kugel, <M>{t`\rho = \text{konst.}`}</M> ein Zylinder – daher die Namen.</>}
            en={<>A <b>cone</b> with apex <M>O</M> about the <span className="nowrap"><M>z</M>-axis</span> (half opening angle <M p=").">\theta</M> For <M>{t`\theta = 90^\circ`}</M> the cone opens up into the <span className="nowrap"><M>xy</M>-plane</span>. Compare: <M>{t`r = \text{const.}`}</M> is a sphere, <M>{t`\rho = \text{const.}`}</M> a cylinder – hence the names.</>} />}
        />
      </Section>

      <Section id="vektoren-quiz" title={<T de="Vektoren, Skalar- und Kreuzprodukt" en="Vectors, dot and cross product" />}>
        <Predict
          prompt={<T de={<>Was ist <M p="?">{t`\v a\times\v a`}</M></>} en={<>What is <M p="?">{t`\v a\times\v a`}</M></>} />}
          answer={<T de={<>Der Nullvektor <M p=".">{t`\v 0`}</M> Der Winkel ist <M p=",">{t`0^\circ`}</M> das Parallelogramm ist zu einer Strecke geworden, seine Fläche ist <M p=".">{t`|\v a|^2\sin 0 = 0`}</M> <See id="vektoren">Vektoren</See></>}
            en={<>The zero vector <M p=".">{t`\v 0`}</M> The angle is <M p=",">{t`0^\circ`}</M> the parallelogram has collapsed to a segment, its area is <M p=".">{t`|\v a|^2\sin 0 = 0`}</M> <See id="vektoren">Vectors</See></>} />}
        />
        <Choice
          question={<T de={<>Für zwei Vektoren gilt <M p=".">{t`\v a\cdot\v b < 0`}</M> Was folgt?</>} en={<>Two vectors have <M p=".">{t`\v a\cdot\v b < 0`}</M> What follows?</>} />}
          choices={[
            { text: <T de={<>Der Winkel zwischen ihnen ist grösser als <M p=".">{t`90^\circ`}</M></>} en={<>The angle between them is larger than <M p=".">{t`90^\circ`}</M></>} />, correct: true,
              why: <T de={<>Längen sind positiv, also muss <M>{t`\cos\varphi < 0`}</M> sein: <M p=".">{t`90^\circ < \varphi \le 180^\circ`}</M> Der Schatten von <M>{t`\v b`}</M> auf <M>{t`\v a`}</M> zeigt nach hinten.</>} en={<>Lengths are positive, so <M p=":">{t`\cos\varphi < 0`}</M> <M p=".">{t`90^\circ < \varphi \le 180^\circ`}</M> The shadow of <M>{t`\v b`}</M> on <M>{t`\v a`}</M> points backwards.</>} /> },
            { text: <T de="Einer der Vektoren hat eine negative Länge." en="One of the vectors has a negative length." />,
              why: <T de={<>Längen <M>{t`|\v a|`}</M> sind nie negativ. Das Vorzeichen kommt allein vom Kosinus.</>} en={<>Lengths <M>{t`|\v a|`}</M> are never negative. The sign comes from the cosine alone.</>} /> },
            { text: <T de="Die Vektoren stehen senkrecht aufeinander." en="The vectors are perpendicular." />,
              why: <T de={<>Senkrecht hiesse <M p=".">{t`\v a\cdot\v b = 0`}</M></>} en={<>Perpendicular would mean <M p=".">{t`\v a\cdot\v b = 0`}</M></>} /> },
          ]}
        />
        <Choice
          question={<T de={<>Was ist <M p="?">{t`\v e_z\times\v e_y`}</M></>} en={<>What is <M p="?">{t`\v e_z\times\v e_y`}</M></>} />}
          choices={[
            { text: <M>{t`\v e_x`}</M>, why: <T de={<>Das wäre <M>{t`\v e_y\times\v e_z`}</M> (im Kreis <M p=").">{t`x\to y\to z\to x`}</M> Hier ist die Reihenfolge umgekehrt.</>} en={<>That would be <M>{t`\v e_y\times\v e_z`}</M> (along the cycle <M p=").">{t`x\to y\to z\to x`}</M> Here the order is reversed.</>} /> },
            { text: <M>{t`-\v e_x`}</M>, correct: true, why: <T de={<><M>{t`z\to y`}</M> läuft gegen den Kreis, also Minus: <M p=".">{t`\v e_z\times\v e_y = -\v e_y\times\v e_z = -\v e_x`}</M> <See id="vektoren">Vektoren</See></>} en={<><M>{t`z\to y`}</M> runs against the cycle, so minus: <M p=".">{t`\v e_z\times\v e_y = -\v e_y\times\v e_z = -\v e_x`}</M> <See id="vektoren">Vectors</See></>} /> },
            { text: <M>{t`\v 0`}</M>, why: <T de={<>Nur parallele Vektoren geben <M p=".">{t`\v 0`}</M> <M>{t`\v e_z`}</M> und <M>{t`\v e_y`}</M> stehen senkrecht, die Fläche ist <M p=".">1</M></>} en={<>Only parallel vectors give <M p=".">{t`\v 0`}</M> <M>{t`\v e_z`}</M> and <M>{t`\v e_y`}</M> are perpendicular; the area is <M p=".">1</M></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<><M p=",">{t`|\v a| = 2`}</M> <M p=",">{t`|\v b| = 3`}</M> Winkel <M p=".">{t`30^\circ`}</M> Wie lang ist <M p="?">{t`\v a\times\v b`}</M></>} en={<><M p=",">{t`|\v a| = 2`}</M> <M p=",">{t`|\v b| = 3`}</M> angle <M p=".">{t`30^\circ`}</M> How long is <M p="?">{t`\v a\times\v b`}</M></>} />}
          value={Q1.crossLen}
          explain={<T de={<><M p=".">{t`|\v a\times\v b| = 2\cdot 3\cdot\sin 30^\circ = 6\cdot\tfrac12 = 3`}</M> Das ist die Fläche des Parallelogramms.</>} en={<><M p=".">{t`|\v a\times\v b| = 2\cdot 3\cdot\sin 30^\circ = 6\cdot\tfrac12 = 3`}</M> That is the area of the parallelogram.</>} />}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M p=".">{t`(1, 2, 0)\cdot(3, -1, 4)`}</M></>} en={<>Compute <M p=".">{t`(1, 2, 0)\cdot(3, -1, 4)`}</M></>} />}
          value={Q1.dot}
          explain={<T de={<><M p=".">{t`1\cdot 3 + 2\cdot(-1) + 0\cdot 4 = 1`}</M> Positiv, also ist der Winkel kleiner als <M p=".">{t`90^\circ`}</M></>} en={<><M p=".">{t`1\cdot 3 + 2\cdot(-1) + 0\cdot 4 = 1`}</M> Positive, so the angle is less than <M p=".">{t`90^\circ`}</M></>} />}
        />
      </Section>

      <Section id="basen-quiz" title={<T de="Basen" en="Bases" />}>
        <Choice
          question={<T de={<>In welche Richtung zeigt <M>{t`\v e_\varphi`}</M> im Punkt mit <M p="?">{t`\varphi = 90^\circ`}</M></>} en={<>Which way does <M>{t`\v e_\varphi`}</M> point at the point with <M p="?">{t`\varphi = 90^\circ`}</M></>} />}
          choices={[
            { text: <M>{t`\v e_y`}</M>, why: <T de={<>Das ist <M>{t`\v e_\rho`}</M> bei <M p=":">{t`\varphi = 90^\circ`}</M> weg von der Achse.</>} en={<>That is <M>{t`\v e_\rho`}</M> at <M p=":">{t`\varphi = 90^\circ`}</M> away from the axis.</>} /> },
            { text: <M>{t`-\v e_x`}</M>, correct: true, why: <T de={<><M p=".">{t`\v e_\varphi = (-\sin\varphi, \cos\varphi, 0) = (-1, 0, 0)`}</M> <M>{t`\v e_\varphi`}</M> zeigt in die Richtung, in die der Punkt läuft, wenn <M>\varphi</M> wächst. <See id="basen">Basen</See></>} en={<><M p=".">{t`\v e_\varphi = (-\sin\varphi, \cos\varphi, 0) = (-1, 0, 0)`}</M> <M>{t`\v e_\varphi`}</M> points where the point goes when <M>\varphi</M> grows. <See id="basen">Bases</See></>} /> },
            { text: <M>{t`\v e_z`}</M>, why: <T de={<><M>{t`\v e_\varphi`}</M> liegt immer waagrecht.</>} en={<><M>{t`\v e_\varphi`}</M> is always horizontal.</>} /> },
          ]}
        />
        <Choice
          question={<T de="Wie schreibt man den Ortsvektor in der Zylinderbasis?" en="How is the position vector written in the cylindrical basis?" />}
          choices={[
            { text: <M>{t`\v r = \rho\,\v e_\rho + \varphi\,\v e_\varphi + z\,\v e_z`}</M>,
              why: <T de={<>Ein Winkel ist keine Länge. Und <M>{t`\v e_\rho`}</M> zeigt schon genau zum Fusspunkt von <M p=",">M</M> ein Anteil entlang <M>{t`\v e_\varphi`}</M> ist nicht nötig.</>} en={<>An angle is not a length. And <M>{t`\v e_\rho`}</M> already points exactly toward the foot of <M p=";">M</M> no part along <M>{t`\v e_\varphi`}</M> is needed.</>} /> },
            { text: <M>{t`\v r = \rho\,\v e_\rho + z\,\v e_z`}</M>, correct: true,
              why: <T de={<>Der Winkel steckt in der Richtung von <M p=".">{t`\v e_\rho`}</M> <See id="basen">Basen</See></>} en={<>The angle is contained in the direction of <M p=".">{t`\v e_\rho`}</M> <See id="basen">Bases</See></>} /> },
            { text: <M>{t`\v r = x\,\v e_\rho + y\,\v e_\varphi + z\,\v e_z`}</M>,
              why: <T de="Das mischt kartesische Koordinaten mit der Zylinderbasis." en="That mixes Cartesian coordinates with the cylindrical basis." /> },
          ]}
        />
        <Choice
          question={<T de={<>Sind <M p=",">{t`\v e_\rho`}</M> <M p=",">{t`\v e_\varphi`}</M> <M>{t`\v e_z`}</M> in jedem Punkt dieselben drei Vektoren?</>} en={<>Are <M p=",">{t`\v e_\rho`}</M> <M p=",">{t`\v e_\varphi`}</M> <M>{t`\v e_z`}</M> the same three vectors at every point?</>} />}
          choices={[
            { text: <T de="Ja" en="Yes" />, why: <T de={<>Nur <M>{t`\v e_z`}</M> ist überall gleich. <M>{t`\v e_\rho`}</M> und <M>{t`\v e_\varphi`}</M> drehen sich mit <M p=".">\varphi</M></>} en={<>Only <M>{t`\v e_z`}</M> is the same everywhere. <M>{t`\v e_\rho`}</M> and <M>{t`\v e_\varphi`}</M> turn with <M p=".">\varphi</M></>} /> },
            { text: <T de="Nein" en="No" />, correct: true, why: <T de={<>Sie hängen von <M>\varphi</M> ab. Darum ist später <M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> nicht null. <See id="v-krummlinig">Zylinder- und Kugelkoordinaten</See></>} en={<>They depend on <M p=".">\varphi</M> That is why later <M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> is not zero. <See id="v-krummlinig">Cylindrical and spherical coordinates</See></>} /> },
          ]}
        />
      </Section>
    </article>
  );
}
