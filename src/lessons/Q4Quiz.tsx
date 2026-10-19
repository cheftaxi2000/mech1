import { Section } from '../components/Blocks';
import { Choice, NumericAnswer, See } from '../components/Quiz';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { Q4 } from '../content/quizValues';

const t = String.raw;

/** Quiz part, chapter 3 continued (lecture pp. 24–28): Kinemate, central axis, plane motion, planetary gear. */
export default function Q4Quiz() {
  return (
    <article className="lesson quiz-part">
      <T
        de={<p className="lede">Fragen zu S. 24–28: Kinemate und Zentralachse, ebene Bewegung mit dem Momentanzentrum, Planetengetriebe. Jede Antwort hat eine Erklärung und einen Link zur Lektion.</p>}
        en={<p className="lede">Questions on pp. 24–28: Kinemate and central axis, plane motion with the instantaneous centre, planetary gear. Every answer has an explanation and a link to the lesson.</p>}
      />

      <Section id="schraube-quiz" title={<T de="Kinemate und Zentralachse" en="Kinemate and central axis" />}>
        <Choice
          question={<T de={<>Du wechselst den Bezugspunkt von <M>B</M> zu <M p=".">P</M> Was bleibt an der Kinemate gleich?</>} en={<>You change the reference point from <M>B</M> to <M p=".">P</M> What stays the same in the Kinemate?</>} />}
          choices={[
            { text: <T de="die Geschwindigkeit des Bezugspunktes" en="the velocity of the reference point" />, why: <T de={<>Nein: <M>{t`\v v_P = \v v_B + \v\omega\times\v{BP}`}</M> ist im Allgemeinen anders als <M p=".">{t`\v v_B`}</M></>} en={<>No: <M>{t`\v v_P = \v v_B + \v\omega\times\v{BP}`}</M> is in general different from <M p=".">{t`\v v_B`}</M></>} /> },
            { text: <T de={<><M>{t`\v\omega`}</M> und der Anteil <M>{t`\v v_\omega`}</M> der Geschwindigkeit entlang <M>{t`\v\omega`}</M></>} en={<><M>{t`\v\omega`}</M> and the part <M>{t`\v v_\omega`}</M> of the velocity along <M>{t`\v\omega`}</M></>} />, correct: true, why: <T de={<>Die zwei Invarianten (S. 24): Der Körper dreht sich als Ganzes, also ist <M>{t`\v\omega`}</M> überall gleich. Und <M>{t`\v\omega\times\v{BP}`}</M> steht senkrecht auf <M p=",">{t`\v\omega`}</M> ändert also den Anteil entlang <M>{t`\v\omega`}</M> nicht. <See id="zentralachse">Zentralachse</See></>} en={<>The two invariants (p. 24): the body turns as a whole, so <M>{t`\v\omega`}</M> is the same everywhere. And <M>{t`\v\omega\times\v{BP}`}</M> is perpendicular to <M p=",">{t`\v\omega`}</M> so it does not change the part along <M p=".">{t`\v\omega`}</M> <See id="zentralachse">Central axis</See></>} /> },
            { text: <T de="nichts – beide Vektoren ändern sich" en="nothing – both vectors change" />, why: <T de={<><M>{t`\v\omega`}</M> hängt nicht vom Punkt ab; das ist die erste Invariante.</>} en={<><M>{t`\v\omega`}</M> does not depend on the point; that is the first invariant.</>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Problem Fig. 3.30: <M p=",">{t`\v v_B = (0, 2, 2)\,\mathrm{m/s}`}</M> <M p=".">{t`\v\omega = (0, 2, 0)\,\mathrm{s^{-1}}`}</M> Wie gross ist <M p="?">{t`|\v v_\omega|`}</M></>} en={<>Problem Fig. 3.30: <M p=",">{t`\v v_B = (0, 2, 2)\,\mathrm{m/s}`}</M> <M p=".">{t`\v\omega = (0, 2, 0)\,\mathrm{s^{-1}}`}</M> What is <M p="?">{t`|\v v_\omega|`}</M></>} />}
          value={Q4.vOmega} unit="m/s"
          explain={<T de={<><M p=",">{t`\v e_\omega = (0, 1, 0)`}</M> also <M p=".">{t`\v v_B\cdot\v e_\omega = 2`}</M> Dann <M p=".">{t`\v v_\omega = 2\,\v e_\omega = (0, 2, 0)\,\mathrm{m/s}`}</M> Das ist die kleinste Schnelligkeit im ganzen Körper – die der Punkte auf <M p=".">\zeta</M> <See id="zentralachse">Zentralachse</See></>} en={<><M p=",">{t`\v e_\omega = (0, 1, 0)`}</M> so <M p=".">{t`\v v_B\cdot\v e_\omega = 2`}</M> Then <M p=".">{t`\v v_\omega = 2\,\v e_\omega = (0, 2, 0)\,\mathrm{m/s}`}</M> This is the smallest speed in the whole body – that of the points on <M p=".">\zeta</M> <See id="zentralachse">Central axis</See></>} />}
        />
        <Choice
          question={<T de={<>In der Lösung von Problem 3.30 ist <M>{t`y_P`}</M> «beliebig». Warum?</>} en={<>In the solution of Problem 3.30, <M>{t`y_P`}</M> is “arbitrary”. Why?</>} />}
          choices={[
            { text: <T de="weil die Rechnung einen Fehler hat" en="because the calculation has an error" />, why: <T de="Nein – das ist genau richtig und der Kern der Sache." en="No – it is exactly right and the heart of the matter." /> },
            { text: <T de={<>weil Verschieben von <M>P</M> entlang <M>{t`\v\omega`}</M> das Kreuzprodukt nicht ändert</>} en={<>because moving <M>P</M> along <M>{t`\v\omega`}</M> does not change the cross product</>} />, correct: true, why: <T de={<><M p=",">{t`\v\omega\times(\v{BP} + \lambda\,\v\omega) = \v\omega\times\v{BP}`}</M> weil <M p=".">{t`\v\omega\times\v\omega = \v 0`}</M> Darum hat eine ganze Gerade parallel zu <M>{t`\v\omega`}</M> dieselbe Geschwindigkeit – die Zentralachse <M p=".">{t`\zeta: (1, 0, 0) + \lambda\,(0, 1, 0)`}</M> <See id="zentralachse">Zentralachse</See></>} en={<><M p=",">{t`\v\omega\times(\v{BP} + \lambda\,\v\omega) = \v\omega\times\v{BP}`}</M> because <M p=".">{t`\v\omega\times\v\omega = \v 0`}</M> So a whole line parallel to <M>{t`\v\omega`}</M> has the same velocity – the central axis <M p=".">{t`\zeta: (1, 0, 0) + \lambda\,(0, 1, 0)`}</M> <See id="zentralachse">Central axis</See></>} /> },
            { text: <T de={<>weil <M>{t`v_{By}`}</M> null ist</>} en={<>because <M>{t`v_{By}`}</M> is zero</>} />, why: <T de={<>Im Gegenteil: <M p=".">{t`v_{By} = 2`}</M> Es liegt an der Richtung von <M p=",">{t`\v\omega`}</M> nicht an <M p=".">{t`\v v_B`}</M></>} en={<>On the contrary: <M p=".">{t`v_{By} = 2`}</M> It is due to the direction of <M p=",">{t`\v\omega`}</M> not to <M p=".">{t`\v v_B`}</M></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Derselbe Würfel (Kante <M p=",">{t`1\,\mathrm m`}</M> <M>B</M> im Ursprung). Wie schnell ist seine schnellste Ecke?</>} en={<>The same cube (edge <M p=",">{t`1\,\mathrm m`}</M> <M>B</M> at the origin). How fast is its fastest corner?</>} />}
          value={Q4.fastestCorner} unit="m/s" tol={0.01}
          explain={<T de={<><M p=".">{t`\v v = (0, 2, 2) + \v\omega\times(x, y, z) = (2z,\ 2,\ 2 - 2x)`}</M> Am grössten für <M>{t`z = 1`}</M> und <M p=":">{t`x = 0`}</M> <M p=".">{t`|\v v| = \sqrt{4 + 4 + 4} = 2\sqrt3 \approx 3{,}46\,\mathrm{m/s}`}</M> Das sind die Ecken am weitesten weg von <M p=";">\zeta</M> die langsamsten (<M p=")">{t`2\,\mathrm{m/s}`}</M> liegen auf <M p=".">\zeta</M> <See id="zentralachse">Zentralachse</See></>} en={<><M p=".">{t`\v v = (0, 2, 2) + \v\omega\times(x, y, z) = (2z,\ 2,\ 2 - 2x)`}</M> Largest for <M>{t`z = 1`}</M> and <M p=":">{t`x = 0`}</M> <M p=".">{t`|\v v| = \sqrt{4 + 4 + 4} = 2\sqrt3 \approx 3.46\,\mathrm{m/s}`}</M> These are the corners farthest from <M p=";">\zeta</M> the slowest (<M p=")">{t`2\,\mathrm{m/s}`}</M> lie on <M p=".">\zeta</M> <See id="zentralachse">Central axis</See></>} />}
        />
        <Choice
          question={<T de={<>Es gilt <M>{t`\v\omega \ne \v 0`}</M> und <M p=".">{t`\v v_B \perp \v\omega`}</M> Was für eine Bewegung ist das in diesem Augenblick?</>} en={<>We have <M>{t`\v\omega \ne \v 0`}</M> and <M p=".">{t`\v v_B \perp \v\omega`}</M> What kind of motion is it at this instant?</>} />}
          choices={[
            { text: <T de="eine Schraubung mit Vorschub" en="a screw motion with a forward slide" />, why: <T de={<>Für einen Vorschub bräuchte es einen Anteil entlang <M p=".">{t`\v\omega`}</M> Hier ist <M p=".">{t`\v v_\omega = \v 0`}</M></>} en={<>A forward slide would need a part along <M p=".">{t`\v\omega`}</M> Here <M p=".">{t`\v v_\omega = \v 0`}</M></>} /> },
            { text: <T de={<>eine (momentane) Rotation um <M p=",">\zeta</M> auch wenn <M>B</M> nicht auf der Achse liegt</>} en={<>a (momentary) rotation about <M p=",">\zeta</M> even if <M>B</M> is not on the axis</>} />, correct: true, why: <T de={<>Spezialfall auf S. 25: «kein Schraubung», <M>\zeta</M> wird zur Rotationsachse. <See id="zentralachse">Zentralachse</See></>} en={<>Special case on p. 25: “no screw”, <M>\zeta</M> becomes the rotation axis. <See id="zentralachse">Central axis</See></>} /> },
            { text: <T de="eine Translation" en="a translation" />, why: <T de={<>Eine Translation hätte <M p=".">{t`\v\omega = \v 0`}</M></>} en={<>A translation would have <M p=".">{t`\v\omega = \v 0`}</M></>} /> },
          ]}
        />
      </Section>

      <Section id="smz-quiz" title={<T de="Ebene Bewegung und Momentanzentrum" en="Plane motion and instantaneous centre" />}>
        <Choice
          question={<T de="Ein Rad rollt auf der Strasse, ohne zu rutschen. Wo liegt sein Momentanzentrum?" en="A wheel rolls on the road without slipping. Where is its instantaneous centre?" />}
          choices={[
            { text: <T de="in der Radnabe" en="at the hub" />, why: <T de="Die Nabe bewegt sich mit dem Auto – sie ruht nicht." en="The hub moves with the car – it is not at rest." /> },
            { text: <T de="im Berührpunkt mit der Strasse" en="at the point of contact with the road" />, correct: true, why: <T de={<>Er ruht beim Rollen (Fig. 3.20). Jede Geschwindigkeit steht senkrecht auf ihrem Strahl von <M p=",">Z</M> und <M p=".">{t`v_P = \omega\,|\v{ZP}|`}</M> <See id="ebene-bewegung">Ebene Bewegung</See></>} en={<>It is at rest when rolling (Fig. 3.20). Every velocity is perpendicular to its ray from <M p=",">Z</M> and <M p=".">{t`v_P = \omega\,|\v{ZP}|`}</M> <See id="ebene-bewegung">Plane motion</See></>} /> },
            { text: <T de="ganz oben am Rad" en="at the very top of the wheel" />, why: <T de="Dort ist das Rad am schnellsten – doppelt so schnell wie die Nabe." en="That is where the wheel is fastest – twice as fast as the hub." /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Leiter (S. 27), Länge <M p=",">{t`L = 2\,\mathrm m`}</M> Winkel <M p=",">{t`\varphi = 30^\circ`}</M> der Fuss gleitet mit <M>{t`v_H = 1\,\mathrm{m/s}`}</M> von der Wand weg. Wie gross ist <M>{t`|\omega|`}</M> der Leiter?</>} en={<>Ladder (p. 27), length <M p=",">{t`L = 2\,\mathrm m`}</M> angle <M p=",">{t`\varphi = 30^\circ`}</M> the foot slides away from the wall with <M p=".">{t`v_H = 1\,\mathrm{m/s}`}</M> What is the ladder’s <M p="?">{t`|\omega|`}</M></>} />}
          value={Q4.ladderOmega} unit="1/s"
          explain={<T de={<>Das Momentanzentrum <M>Z</M> liegt senkrecht über <M>A</M> auf der Höhe von <M p=",">B</M> also <M p=".">{t`|\v{ZA}| = L\sin\varphi = 1\,\mathrm m`}</M> Dann <M p=".">{t`|\omega| = v_H/|\v{ZA}| = 1\,\mathrm{s^{-1}}`}</M> Und <M p=",">{t`v_V = |\omega|\,L\cos\varphi \approx 1{,}73\,\mathrm{m/s}`}</M> wie mit der SdpG. <See id="ebene-bewegung">Ebene Bewegung</See></>} en={<>The instantaneous centre <M>Z</M> lies straight above <M>A</M> at the height of <M p=",">B</M> so <M p=".">{t`|\v{ZA}| = L\sin\varphi = 1\,\mathrm m`}</M> Then <M p=".">{t`|\omega| = v_H/|\v{ZA}| = 1\,\mathrm{s^{-1}}`}</M> And <M p=",">{t`v_V = |\omega|\,L\cos\varphi \approx 1.73\,\mathrm{m/s}`}</M> as with the SdpG. <See id="ebene-bewegung">Plane motion</See></>} />}
        />
        <Choice
          question={<T de={<>Bei einer ebenen Bewegung (alle Punkte in Ebenen parallel zur <M>xy</M>-Ebene): Welche Richtung kann <M>{t`\v\omega`}</M> haben?</>} en={<>In a plane motion (all points in planes parallel to the <M>xy</M>-plane): which direction can <M>{t`\v\omega`}</M> have?</>} />}
          choices={[
            { text: <T de="jede Richtung" en="any direction" />, why: <T de={<>Ein schräges <M>{t`\v\omega`}</M> gäbe Punkten eine Geschwindigkeit aus der Ebene heraus: <M p=".">{t`v_{Az} = \omega_x PA_y - \omega_y PA_x \ne 0`}</M></>} en={<>A tilted <M>{t`\v\omega`}</M> would give points a velocity out of the plane: <M p=".">{t`v_{Az} = \omega_x PA_y - \omega_y PA_x \ne 0`}</M></>} /> },
            { text: <T de={<>nur senkrecht zur Ebene, <M p=",">{t`\v\omega = (0, 0, \omega_z)`}</M> oder <M>{t`\v\omega = \v 0`}</M></>} en={<>only perpendicular to the plane, <M p=",">{t`\v\omega = (0, 0, \omega_z)`}</M> or <M>{t`\v\omega = \v 0`}</M></>} />, correct: true, why: <T de={<><M>{t`v_{Az} = 0`}</M> für alle <M>A</M> erzwingt <M p=".">{t`\omega_x = \omega_y = 0`}</M> Dann ist es eine momentane Rotation um <M>Z</M> oder eine Translation. <See id="ebene-bewegung">Ebene Bewegung</See></>} en={<><M>{t`v_{Az} = 0`}</M> for all <M>A</M> forces <M p=".">{t`\omega_x = \omega_y = 0`}</M> Then it is a momentary rotation about <M>Z</M> or a translation. <See id="ebene-bewegung">Plane motion</See></>} /> },
          ]}
        />
      </Section>

      <Section id="planeten-quiz" title={<T de="Planetengetriebe" en="Planetary gear" />}>
        <NumericAnswer
          question={<T de={<>Planetengetriebe mit <M p=",">{t`R_1 = 0{,}8`}</M> <M p=".">{t`R_2 = 2{,}8`}</M> Das Hohlrad steht still, die Sonne dreht mit <M p=".">{t`\omega_1 = 1\,\mathrm{s^{-1}}`}</M> Wie schnell dreht sich der Arm?</>} en={<>Planetary gear with <M p=",">{t`R_1 = 0.8`}</M> <M p=".">{t`R_2 = 2.8`}</M> The ring stands still, the sun turns with <M p=".">{t`\omega_1 = 1\,\mathrm{s^{-1}}`}</M> How fast does the arm turn?</>} />}
          value={Q4.armRingFixed} unit="1/s" tol={0.005}
          explain={<T de={<>Mit <M>{t`\omega_2 = 0`}</M> bleibt <M p=".">{t`\omega_\mathrm{Arm} = \omega_1\,\frac{R_1}{R_1 + R_2} = \frac{0{,}8}{3{,}6} = \frac29 \approx 0{,}22\,\mathrm{s^{-1}}`}</M> Die Sonne dreht also <M>{t`4{,}5`}</M> mal schneller als der Arm (erstes Übersetzungsverhältnis). Der Planet dreht dabei rückwärts: <M p=".">{t`\omega_3 = -0{,}4\,\mathrm{s^{-1}}`}</M> <See id="planetengetriebe">Planetengetriebe</See></>} en={<>With <M>{t`\omega_2 = 0`}</M> we get <M p=".">{t`\omega_\mathrm{Arm} = \omega_1\,\frac{R_1}{R_1 + R_2} = \frac{0.8}{3.6} = \frac29 \approx 0.22\,\mathrm{s^{-1}}`}</M> So the sun turns <M>{t`4.5`}</M> times faster than the arm (the first transmission ratio). The planet turns backwards: <M p=".">{t`\omega_3 = -0.4\,\mathrm{s^{-1}}`}</M> <See id="planetengetriebe">Planetary gear</See></>} />}
        />
        <NumericAnswer
          question={<T de={<>Dasselbe Getriebe, <M p=".">{t`\omega_1 = 1\,\mathrm{s^{-1}}`}</M> Bei welchem <M>{t`\omega_2`}</M> steht der Arm still?</>} en={<>The same gear, <M p=".">{t`\omega_1 = 1\,\mathrm{s^{-1}}`}</M> For which <M>{t`\omega_2`}</M> does the arm stand still?</>} />}
          value={Q4.armStill} unit="1/s" tol={0.005}
          explain={<T de={<><M>{t`\omega_\mathrm{Arm} = 0`}</M> heisst <M p=",">{t`v_A = \tfrac12(\omega_2 R_2 + \omega_1 R_1) = 0`}</M> also <M p=".">{t`\omega_2 = -\omega_1 R_1/R_2 = -\tfrac27 \approx -0{,}29\,\mathrm{s^{-1}}`}</M> Das Hohlrad dreht gegen die Sonne; der Planet dreht sich dann an Ort. <See id="planetengetriebe">Planetengetriebe</See></>} en={<><M>{t`\omega_\mathrm{Arm} = 0`}</M> means <M p=",">{t`v_A = \tfrac12(\omega_2 R_2 + \omega_1 R_1) = 0`}</M> so <M p=".">{t`\omega_2 = -\omega_1 R_1/R_2 = -\tfrac27 \approx -0.29\,\mathrm{s^{-1}}`}</M> The ring turns against the sun; the planet then turns in place. <See id="planetengetriebe">Planetary gear</See></>} />}
        />
        <Choice
          question={<T de={<>Was macht der Planet, wenn <M>{t`\omega_2 R_2 = \omega_1 R_1`}</M> ist?</>} en={<>What does the planet do when <M p="?">{t`\omega_2 R_2 = \omega_1 R_1`}</M></>} />}
          choices={[
            { text: <T de="Er steht still." en="It stands still." />, why: <T de={<>Nein: <M>A</M> bewegt sich mit <M p=".">{t`v_A = \omega_1 R_1 \ne 0`}</M></>} en={<>No: <M>A</M> moves with <M p=".">{t`v_A = \omega_1 R_1 \ne 0`}</M></>} /> },
            { text: <T de={<>Er dreht sich nicht, <M p=":">{t`\omega_3 = 0`}</M> er verschiebt sich nur (momentan).</>} en={<>It does not turn, <M p=":">{t`\omega_3 = 0`}</M> it only shifts (momentarily).</>} />, correct: true, why: <T de={<><M p=":">{t`\omega_3 = (\omega_2 R_2 - \omega_1 R_1)/(R_2 - R_1) = 0`}</M> <M>P</M> und <M>Q</M> sind gleich schnell, die Gerade durch die Pfeilspitzen ist parallel zum Arm – <M>{t`Z_3`}</M> liegt «im Unendlichen». <See id="planetengetriebe">Planetengetriebe</See></>} en={<><M p=":">{t`\omega_3 = (\omega_2 R_2 - \omega_1 R_1)/(R_2 - R_1) = 0`}</M> <M>P</M> and <M>Q</M> are equally fast, the line through the arrow tips is parallel to the arm – <M>{t`Z_3`}</M> lies “at infinity”. <See id="planetengetriebe">Planetary gear</See></>} /> },
            { text: <T de="Er dreht sich doppelt so schnell wie die Sonne." en="It turns twice as fast as the sun." />, why: <T de={<>Die Formel für <M>{t`\omega_3`}</M> gibt hier genau null.</>} en={<>The formula for <M>{t`\omega_3`}</M> gives exactly zero here.</>} /> },
          ]}
        />
      </Section>
    </article>
  );
}
