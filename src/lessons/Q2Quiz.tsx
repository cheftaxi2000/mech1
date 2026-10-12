import { Section } from '../components/Blocks';
import { Choice, NumericAnswer, See } from '../components/Quiz';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { Q2 } from '../content/quizValues';

const t = String.raw;

/** Quiz part, chapter 2 (lecture pp. 8–11): velocity, curvilinear coordinates, circular motion. */
export default function Q2Quiz() {
  return (
    <article className="lesson quiz-part">
      <T
        de={<p className="lede">Fragen zu Kapitel 2: Geschwindigkeit, Schnelligkeit, Zylinderkoordinaten und Kreisbewegung. Jede Antwort hat eine Erklärung.</p>}
        en={<p className="lede">Questions on chapter 2: velocity, speed, cylindrical coordinates and circular motion. Every answer has an explanation.</p>}
      />

      <Section id="geschwindigkeit-quiz" title={<T de="Geschwindigkeit und Schnelligkeit" en="Velocity and speed" />}>
        <Choice
          question={<T de="Ein Auto fährt auf einer kurvigen Strasse 3 km in 2 Minuten. Was sind die 90 km/h, die man daraus ausrechnet?" en="A car drives 3 km in 2 minutes on a winding road. What are the 90 km/h you compute from this?" />}
          choices={[
            { text: <T de="der Geschwindigkeitsvektor" en="the velocity vector" />, why: <T de="Ein Vektor hat eine Richtung – auf der kurvigen Strasse ändert sie sich ständig. 90 km/h ist nur eine Zahl." en="A vector has a direction – on the winding road it changes all the time. 90 km/h is just a number." /> },
            { text: <T de="die mittlere Schnelligkeit (Weg durch Zeit)" en="the mean speed (distance over time)" />, correct: true, why: <T de={<>Weg durch Zeit gibt den Mittelwert der Schnelligkeit <M p=".">{t`\dot s`}</M> Der Tacho zeigt in jedem Augenblick <M>{t`\dot s`}</M> – mal mehr, mal weniger als 90 km/h. <See id="geschwindigkeit">Geschwindigkeit</See></>} en={<>Distance over time gives the mean of the speed <M p=".">{t`\dot s`}</M> The speedometer shows <M>{t`\dot s`}</M> at each instant – sometimes more, sometimes less than 90 km/h. <See id="geschwindigkeit">Velocity</See></>} /> },
            { text: <T de="das, was der Tacho die ganze Zeit zeigt" en="what the speedometer shows all the time" />, why: <T de="Nur wenn das Auto immer gleich schnell fährt." en="Only if the car always drives at the same speed." /> },
          ]}
        />
        <Choice
          question={<T de={<>Warum zeigt <M>{t`\Delta\v r`}</M> erst im Grenzwert in Richtung der Tangente <M p="?">{t`\v\tau`}</M></>} en={<>Why does <M>{t`\Delta\v r`}</M> point along the tangent <M>{t`\v\tau`}</M> only in the limit?</>} />}
          choices={[
            { text: <T de={<>Weil <M>{t`\Delta t`}</M> dann negativ wird.</>} en={<>Because <M>{t`\Delta t`}</M> then becomes negative.</>} />, why: <T de={<>Nein – der Grenzwert lässt <M>{t`\Delta t`}</M> gegen null gehen, das Vorzeichen spielt keine Rolle.</>} en={<>No – the limit lets <M>{t`\Delta t`}</M> go to zero; the sign does not matter.</>} /> },
            { text: <T de={<>Weil <M>{t`\Delta\v r`}</M> für endliches <M>{t`\Delta t`}</M> eine Sehne der Bahn ist.</>} en={<>Because for finite <M>{t`\Delta t`}</M> <M>{t`\Delta\v r`}</M> is a chord of the path.</>} />, correct: true, why: <T de={<>Für endliches <M>{t`\Delta t`}</M> verbindet <M>{t`\Delta\v r`}</M> zwei Bahnpunkte – eine Sehne. Erst wenn die Punkte zusammenrücken, dreht sich die Sehne in die Tangente. <See id="geschwindigkeit">Geschwindigkeit</See></>} en={<>For finite <M>{t`\Delta t`}</M> <M>{t`\Delta\v r`}</M> joins two points of the path – a chord. Only as the points move together does the chord turn into the tangent. <See id="geschwindigkeit">Velocity</See></>} /> },
            { text: <T de="Das stimmt nur bei geraden Bahnen." en="That is only true for straight paths." />, why: <T de="Bei geraden Bahnen ist jede Sehne schon tangential; das Problem gibt es bei gekrümmten Bahnen." en="On straight paths every chord is already tangent; the issue arises on curved paths." /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Ein Punkt läuft auf seiner Bahn mit <M>{t`s(t) = 4t^2`}</M> (Meter, Sekunden). Wie gross ist <M>{t`|\v v|`}</M> bei <M p="?">{t`t = 1{,}5\,\mathrm s`}</M></>} en={<>A point moves along its path with <M>{t`s(t) = 4t^2`}</M> (metres, seconds). What is <M>{t`|\v v|`}</M> at <M p="?">{t`t = 1.5\,\mathrm s`}</M></>} />}
          value={Q2.speedAt15} unit="m/s"
          explain={<T de={<><M p=",">{t`|\v v| = \dot s = 8t = 12\,\mathrm{m/s}`}</M> denn <M p=".">{t`\v v = \dot s\,\v\tau`}</M> <See id="geschwindigkeit">Geschwindigkeit</See></>} en={<><M p=",">{t`|\v v| = \dot s = 8t = 12\,\mathrm{m/s}`}</M> because <M p=".">{t`\v v = \dot s\,\v\tau`}</M> <See id="geschwindigkeit">Velocity</See></>} />}
        />
      </Section>

      <Section id="krummlinig-quiz" title={<T de="Zylinderkoordinaten" en="Cylindrical coordinates" />}>
        <NumericAnswer
          question={<T de={<>Gegeben <M p=",">{t`\rho = 2`}</M> <M p=",">{t`\dot\rho = 1`}</M> <M p=",">{t`\dot\varphi = 3`}</M> <M>{t`\dot z = 0`}</M> (Meter, Sekunden). Wie gross ist <M p="?">{t`|\v v|`}</M></>} en={<>Given <M p=",">{t`\rho = 2`}</M> <M p=",">{t`\dot\rho = 1`}</M> <M p=",">{t`\dot\varphi = 3`}</M> <M>{t`\dot z = 0`}</M> (metres, seconds). What is <M p="?">{t`|\v v|`}</M></>} />}
          value={Q2.cylSpeed} unit="m/s" tol={0.005}
          explain={<T de={<><M p=".">{t`\v v = \dot\rho\,\v e_\rho + \rho\dot\varphi\,\v e_\varphi + \dot z\,\v e_z = 1\,\v e_\rho + 6\,\v e_\varphi`}</M> Die Basisvektoren stehen senkrecht, also <M p=".">{t`|\v v| = \sqrt{1 + 36} = \sqrt{37} \approx 6{,}08\,\mathrm{m/s}`}</M> <See id="v-krummlinig">Zylinder- und Kugelkoordinaten</See></>}
            en={<><M p=".">{t`\v v = \dot\rho\,\v e_\rho + \rho\dot\varphi\,\v e_\varphi + \dot z\,\v e_z = 1\,\v e_\rho + 6\,\v e_\varphi`}</M> The basis vectors are perpendicular, so <M p=".">{t`|\v v| = \sqrt{1 + 36} = \sqrt{37} \approx 6.08\,\mathrm{m/s}`}</M> <See id="v-krummlinig">Cylindrical and spherical coordinates</See></>} />}
        />
        <Choice
          question={<T de={<>Warum ist <M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> und nicht <M p="?">{t`\v 0`}</M></>} en={<>Why is <M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> and not <M p="?">{t`\v 0`}</M></>} />}
          choices={[
            { text: <T de={<>Weil <M>{t`\v e_\rho`}</M> länger wird, wenn <M>\rho</M> wächst.</>} en={<>Because <M>{t`\v e_\rho`}</M> gets longer when <M>\rho</M> grows.</>} />, why: <T de={<><M>{t`\v e_\rho`}</M> ist ein Einheitsvektor, seine Länge bleibt <M p=".">1</M></>} en={<><M>{t`\v e_\rho`}</M> is a unit vector; its length stays <M p=".">1</M></>} /> },
            { text: <T de={<>Weil sich <M>{t`\v e_\rho`}</M> dreht, wenn sich <M>\varphi</M> ändert.</>} en={<>Because <M>{t`\v e_\rho`}</M> turns when <M>\varphi</M> changes.</>} />, correct: true, why: <T de={<><M>{t`\v e_\rho = (\cos\varphi, \sin\varphi, 0)`}</M> hängt von <M>\varphi</M> ab. Ableiten gibt <M p=".">{t`\dot\varphi(-\sin\varphi, \cos\varphi, 0) = \dot\varphi\,\v e_\varphi`}</M> <See id="v-krummlinig">Zylinder- und Kugelkoordinaten</See></>} en={<><M>{t`\v e_\rho = (\cos\varphi, \sin\varphi, 0)`}</M> depends on <M p=".">\varphi</M> Differentiating gives <M p=".">{t`\dot\varphi(-\sin\varphi, \cos\varphi, 0) = \dot\varphi\,\v e_\varphi`}</M> <See id="v-krummlinig">Cylindrical and spherical coordinates</See></>} /> },
            { text: <T de={<>Weil <M>z</M> sich ändert.</>} en={<>Because <M>z</M> changes.</>} />, why: <T de={<><M>{t`\v e_\rho`}</M> hängt nicht von <M>z</M> ab.</>} en={<><M>{t`\v e_\rho`}</M> does not depend on <M p=".">z</M></>} /> },
          ]}
        />
        <Choice
          question={<T de={<>Wann zeigt <M>{t`\v v`}</M> genau entlang <M p=",">{t`\v e_\varphi`}</M> also tangential zum Kreis um die <span className="nowrap"><M>z</M>-Achse</span>?</>} en={<>When does <M>{t`\v v`}</M> point exactly along <M p=",">{t`\v e_\varphi`}</M> i.e. tangent to the circle about the <span className="nowrap"><M>z</M>-axis</span>?</>} />}
          choices={[
            { text: <T de="immer" en="always" />, why: <T de={<>Nur der Anteil <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> ist tangential; die anderen beiden können dazukommen.</>} en={<>Only the part <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> is tangent; the other two may add to it.</>} /> },
            { text: <T de={<>wenn <M>{t`\dot\rho = 0`}</M> und <M>{t`\dot z = 0`}</M></>} en={<>when <M>{t`\dot\rho = 0`}</M> and <M>{t`\dot z = 0`}</M></>} />, correct: true, why: <T de={<>Dann bleibt nur <M p=":">{t`\v v = \rho\dot\varphi\,\v e_\varphi`}</M> die Kreisbewegung. <See id="kreisbewegung">Kreisbewegung</See></>} en={<>Then only <M>{t`\v v = \rho\dot\varphi\,\v e_\varphi`}</M> is left: circular motion. <See id="kreisbewegung">Circular motion</See></>} /> },
            { text: <T de={<>wenn <M>{t`\dot\varphi = 0`}</M></>} en={<>when <M>{t`\dot\varphi = 0`}</M></>} />, why: <T de={<>Dann fehlt gerade der tangentiale Anteil.</>} en={<>Then the tangent part is exactly what is missing.</>} /> },
          ]}
        />
      </Section>

      <Section id="kreis-quiz" title={<T de="Kreisbewegung" en="Circular motion" />}>
        <NumericAnswer
          question={<T de={<>Ein Punkt läuft auf einem Kreis mit Radius <M>{t`0{,}5\,\mathrm m`}</M> mit <M p=".">{t`\dot\varphi = 4\,\mathrm{s^{-1}}`}</M> Wie gross ist <M p="?">{t`|\v v|`}</M></>} en={<>A point moves on a circle of radius <M>{t`0.5\,\mathrm m`}</M> with <M p=".">{t`\dot\varphi = 4\,\mathrm{s^{-1}}`}</M> What is <M p="?">{t`|\v v|`}</M></>} />}
          value={Q2.circleSpeed} unit="m/s"
          explain={<T de={<><M p=".">{t`|\v v| = |\v\omega\times\v r| = \rho\,\dot\varphi = 0{,}5\cdot 4 = 2\,\mathrm{m/s}`}</M> <See id="kreisbewegung">Kreisbewegung</See></>} en={<><M p=".">{t`|\v v| = |\v\omega\times\v r| = \rho\,\dot\varphi = 0.5\cdot 4 = 2\,\mathrm{m/s}`}</M> <See id="kreisbewegung">Circular motion</See></>} />}
        />
        <Choice
          question={<T de={<>Ändert sich <M p=",">{t`\v v = \v\omega\times\v r`}</M> wenn man den Ursprung von <M>{t`\v r`}</M> an eine andere Stelle der Drehachse legt?</>} en={<>Does <M>{t`\v v = \v\omega\times\v r`}</M> change if the origin of <M>{t`\v r`}</M> is moved to another place on the axis?</>} />}
          choices={[
            { text: <T de="Ja" en="Yes" />, why: <T de={<>Der Unterschied ist ein Vektor entlang der Achse, also parallel zu <M p=",">{t`\v\omega`}</M> und dessen Kreuzprodukt mit <M>{t`\v\omega`}</M> ist null.</>} en={<>The difference is a vector along the axis, i.e. parallel to <M p=",">{t`\v\omega`}</M> and its cross product with <M>{t`\v\omega`}</M> is zero.</>} /> },
            { text: <T de="Nein" en="No" />, correct: true, why: <T de={<><M p=".">{t`\v\omega\times(\v r + \lambda\v\omega) = \v\omega\times\v r`}</M> Jeder Punkt der Achse ist als Ursprung gleich gut. <See id="rotation">Rotation</See></>} en={<><M p=".">{t`\v\omega\times(\v r + \lambda\v\omega) = \v\omega\times\v r`}</M> Every point of the axis is equally good as the origin. <See id="rotation">Rotation</See></>} /> },
          ]}
        />
      </Section>
    </article>
  );
}
