import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { Cube43Fig, DiscFigure, WaageFig } from '../viz/statik/StatikFigures';

const t = String.raw;

export default function S6Gleichgewicht() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Jetzt fügt sich alles zusammen. Eine Kräftegruppe ist im <b>Gleichgewicht</b>, wenn sie zur «Nullgruppe» äquivalent ist: Resultierende null und Moment null. Das sind sechs Gleichungen im Raum. Mit ihnen prüft man, ob ein Körper in Ruhe bleibt, und berechnet unbekannte Lagerkräfte.</p>}
        en={<p className="lede">Now everything comes together. A group of forces is in <b>equilibrium</b> if it is equivalent to the “zero group”: resultant zero and moment zero. These are six equations in space. With them one checks whether a body stays at rest, and computes unknown support forces.</p>}
      />

      <Box kind="intuition">
        <T
          de={<p>Ein Bild hängt ruhig an der Wand. Damit das so bleibt, müssen zwei Dinge stimmen: Die Kräfte dürfen es nirgendwohin schieben (alle zusammen null) und nicht verdrehen (alle Momente zusammen null). Fehlt eines davon, rutscht es oder es kippt.</p>}
          en={<p>A picture hangs still on the wall. For it to stay that way, two things must hold: the forces must not push it anywhere (all together zero) and must not twist it (all moments together zero). If one is missing, it slides or it tips.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="bedingungen" title={<T de="1. Die Gleichgewichtsbedingungen" en="1. The equilibrium conditions" />}>
        <Box kind="lecture" src={<Src p={43} />} title={<T de="6.8 Kräftegruppe im Gleichgewicht" en={<>6.8 Group of forces in equilibrium (<span lang="de">Kräftegruppe im Gleichgewicht</span>)</>} />}>
          <MD>{t`\text{${tr('Falls', 'If')}}\colon\ \boxed{\ \v R = \v 0\ \text{${tr('und', 'and')}}\ \v M_P = \v 0\ }`}</MD>
          <T
            de={<p>«Gleichgewichtsbedingungen.» <M p=":">{t`\v R = \v 0`}</M> Komponentenbedingungen (drei); <M p=":">{t`\v M_P = \v 0`}</M> Momentenbedingungen (drei). In 3D: 6 Gleichungen.</p>}
            en={<p>“Equilibrium conditions” (<span lang="de">Gleichgewichtsbedingungen</span>). <M p=":">{t`\v R = \v 0`}</M> component conditions (three); <M p=":">{t`\v M_P = \v 0`}</M> moment conditions (three). In 3D: 6 equations.</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum gerade diese zwei?</b> Ein Körper bleibt in Ruhe, wenn die Kräfte bei keiner gedachten Bewegung Leistung haben (<a href="#statische-aequivalenz">erste Lektion</a>): <M>{t`\v R\cdot\v v_P + \v M_P\cdot\v\omega = 0`}</M> für alle <M>{t`\v v_P`}</M> und <M p=".">{t`\v\omega`}</M> Mit demselben Argument wie im Beweis des Äquivalenzsatzes folgt <M>{t`\v R = \v 0`}</M> und <M p=".">{t`\v M_P = \v 0`}</M> Die Gruppe ist dann äquivalent zu «gar keiner Kraft».</p>
            <ul className="keep">
              <li>Jede Vektorgleichung hat drei Komponenten: <M>{t`\sum F_x = \sum F_y = \sum F_z = 0`}</M> und <M p=".">{t`\sum M_x = \sum M_y = \sum M_z = 0`}</M></li>
              <li>Den Bezugspunkt <M>P</M> wählt man frei. Ist <M p=",">{t`\v R = \v 0`}</M> dann ist das Moment bezüglich jedes Punktes gleich (<a href="#dyname">Dyname</a>): Gilt <M>{t`\v M_P = \v 0`}</M> für einen Punkt, gilt es für alle. Geschickt ist ein Punkt, durch den viele Kräfte gehen; ihre Momente fallen dann weg.</li>
              <li>In der Ebene bleiben drei Gleichungen: <M p=",">{t`\sum F_x = 0`}</M> <M p=",">{t`\sum F_y = 0`}</M> <M p=".">{t`\sum M_z = 0`}</M></li>
            </ul>
          </>}
          en={<>
            <p className="keep"><b>Why exactly these two?</b> A body stays at rest if the forces have no power for any imagined motion (<a href="#statische-aequivalenz">first lesson</a>): <M>{t`\v R\cdot\v v_P + \v M_P\cdot\v\omega = 0`}</M> for all <M>{t`\v v_P`}</M> and <M p=".">{t`\v\omega`}</M> By the same argument as in the proof of the equivalence theorem, <M>{t`\v R = \v 0`}</M> and <M p=".">{t`\v M_P = \v 0`}</M> The group is then equivalent to “no force at all”.</p>
            <ul className="keep">
              <li>Each vector equation has three components: <M>{t`\sum F_x = \sum F_y = \sum F_z = 0`}</M> and <M p=".">{t`\sum M_x = \sum M_y = \sum M_z = 0`}</M></li>
              <li>The reference point <M>P</M> is free to choose. If <M p=",">{t`\v R = \v 0`}</M> the moment is the same about every point (<a href="#dyname">Dyname</a>): if <M>{t`\v M_P = \v 0`}</M> holds for one point, it holds for all. A clever choice is a point through which many forces pass; their moments then drop out.</li>
              <li>In the plane three equations remain: <M p=",">{t`\sum F_x = 0`}</M> <M p=",">{t`\sum F_y = 0`}</M> <M p=".">{t`\sum M_z = 0`}</M></li>
            </ul>
          </>}
        />
        <Box kind="lecture" src={<Src p={43} />} title={<T de="Beispiel: Würfel" en="Example: cube" />}>
          <MD>{t`\v F_A = \begin{pmatrix}-F\\0\\0\end{pmatrix},\ \v F_B = \begin{pmatrix}0\\F\\0\end{pmatrix},\ \v F_C = \begin{pmatrix}0\\0\\F\end{pmatrix},\ \v F_D = \begin{pmatrix}F\\-F\\-F\end{pmatrix}\quad\text{${tr('im Gleichgewicht?', 'in equilibrium?')}}`}</MD>
          <T de={<p>Dyname in <M p=":">A</M></p>} en={<p>Dyname at <M p=":">A</M></p>} />
          <MD>{t`\textstyle\sum F_x\colon -F + 0 + 0 + F \overset{?}{=} 0\ \checkmark,\quad \sum F_y\colon 0 + F + 0 - F \overset{?}{=} 0\ \checkmark,\quad \sum F_z\colon 0 + 0 + F - F \overset{?}{=} 0\ \checkmark`}</MD>
          <MD>{t`\v M_A\colon\ \v F_C\times\v{CA} + \v F_B\times\v{BA} + \v F_D\times\v{DA} = \begin{pmatrix}0\\-aF\\0\end{pmatrix} + \begin{pmatrix}0\\0\\aF\end{pmatrix} + \begin{pmatrix}0\\aF\\-aF\end{pmatrix} \overset{?}{=} \v 0\ \checkmark`}</MD>
          <T de={<p>«Komponentenbedingungen erfüllt! Momentenbedingungen erfüllt! <M>\to</M> Kräftegruppe im Gleichgewicht!»</p>} en={<p>“Component conditions satisfied! Moment conditions satisfied! <M>\to</M> group of forces in equilibrium!”</p>} />
        </Box>
        <T
          de={<p className="keep"><b>So liest man das Beispiel.</b> Bezugspunkt ist <M p=",">A</M> denn dort greift <M>{t`\v F_A`}</M> an und hat kein Moment. Die Vektoren <M>{t`\v{CA}, \v{BA}, \v{DA}`}</M> zeigen von den Angriffspunkten nach <M>A</M> (darum die Reihenfolge <M p=").">{t`\v F\times\v{CA} = \v{AC}\times\v F`}</M> Die drei Momente heben sich paarweise auf: Der y-Anteil von <M>{t`\v F_C`}</M> gegen den von <M p=",">{t`\v F_D`}</M> der z-Anteil von <M>{t`\v F_B`}</M> gegen den von <M p=".">{t`\v F_D`}</M></p>}
          en={<p className="keep"><b>How to read the example.</b> The reference point is <M p=",">A</M> because <M>{t`\v F_A`}</M> acts there and has no moment. The vectors <M>{t`\v{CA}, \v{BA}, \v{DA}`}</M> point from the points of action to <M>A</M> (hence the order <M p=").">{t`\v F\times\v{CA} = \v{AC}\times\v F`}</M> The three moments cancel in pairs: the y-part of <M>{t`\v F_C`}</M> against that of <M p=",">{t`\v F_D`}</M> the z-part of <M>{t`\v F_B`}</M> against that of <M p=".">{t`\v F_D`}</M></p>}
        />
        <StepPlayer
          label={tr('Animation: Würfel, Gleichgewicht prüfen', 'Animation: cube, checking equilibrium')}
          steps={[
            { ms: 600, holdMs: 2800, caption: <T de={<>Vier Kräfte an den Punkten <M p=".">A, B, C, D</M> (<M>{t`\v F_D`}</M> ist <M>{t`\sqrt3`}</M>-mal so lang wie die anderen.)</>} en={<>Four forces at the points <M p=".">A, B, C, D</M> (<M>{t`\v F_D`}</M> is <M>{t`\sqrt3`}</M> times as long as the others.)</>} /> },
            { ms: 900, holdMs: 3000, caption: <T de={<>Komponenten: In jeder Richtung steht ein <M>+F</M> gegen ein <M p=".">-F</M> <M p=".">{t`\v R = \v 0`}</M></>} en={<>Components: in each direction a <M>+F</M> stands against a <M p=".">-F</M> <M p=".">{t`\v R = \v 0`}</M></>} /> },
            { ms: 1200, holdMs: 3200, caption: <T de={<>Momente bezüglich <M p=":">A</M> die Hebel <M>{t`\v{AC}, \v{AB}, \v{AD}`}</M> (grau) und die drei Momente aus dem Skript.</>} en={<>Moments about <M p=":">A</M> the levers <M>{t`\v{AC}, \v{AB}, \v{AD}`}</M> (grey) and the three moments from the notes.</>} /> },
            { ms: 800, holdMs: 3000, caption: <T de={<>Ihre Summe ist <M p=".">{t`\v 0`}</M> Beide Bedingungen sind erfüllt: Die Kräftegruppe ist im Gleichgewicht.</>} en={<>Their sum is <M p=".">{t`\v 0`}</M> Both conditions hold: the group of forces is in equilibrium.</>} /> },
          ]}
        >
          {(step, tt) => <Cube43Fig step={step} t={tt} />}
        </StepPlayer>
        <Box kind="misconception" title={<T de="«Wenn sich die Kräfte aufheben, ist der Körper im Gleichgewicht»" en="“If the forces cancel, the body is in equilibrium”" />}>
          <T
            de={<p>Das ist nur die Hälfte (die Komponentenbedingungen). Ein Kräftepaar hat <M>{t`\v R = \v 0`}</M> und dreht den Körper trotzdem. Prüfe immer auch die Momente.</p>}
            en={<p>That is only half of it (the component conditions). A couple has <M>{t`\v R = \v 0`}</M> and still turns the body. Always check the moments as well.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="lagerkraefte" title={<T de="2. Unbekannte Lagerkräfte bestimmen" en="2. Finding unknown support forces" />}>
        <Box kind="lecture" src={<Src p={44} />} title={<T de="Beispiel: Waage im Gleichgewicht" en={<>Example: scale in equilibrium (<span lang="de">Waage im Gleichgewicht</span>)</>} />}>
          <T de={<p>Balken auf einem Lager <M>A</M> mit <M>{t`F_1`}</M> links (Abstand <M p=")">{t`a_1`}</M> und <M>{t`F_2`}</M> rechts (Abstand <M p=")">{t`a_2`}</M> freigeschnitten mit <M p=",">{t`A_x`}</M> <M p=",">{t`A_y`}</M> <M p=".">{t`A_z`}</M> «GGB in <M p=":">A</M>»</p>} en={<p>Beam on a support <M>A</M> with <M>{t`F_1`}</M> on the left (distance <M p=")">{t`a_1`}</M> and <M>{t`F_2`}</M> on the right (distance <M p=")">{t`a_2`}</M> cut free with <M p=",">{t`A_x`}</M> <M p=",">{t`A_y`}</M> <M p=".">{t`A_z`}</M> “Equilibrium conditions at <M p=":">A</M>”</p>} />
          <MD>{t`\begin{aligned}
&\textstyle\sum F_z = A_z = 0,\quad \sum F_x = A_x = 0,\quad \sum F_y = A_y - F_1 - F_2 = 0\ \to\ \boxed{A_y = F_1 + F_2}\\
&\textstyle\sum M_x^{(A)} = 0,\quad \sum M_y^{(A)} = 0,\quad \sum M_z^{(A)} = F_1\cdot a_1 - F_2\cdot a_2 = 0\ \to\ a_2 = a_1\cdot\dfrac{F_1}{F_2}
\end{aligned}`}</MD>
          <T de={<p>Handschriftlich: «Lagerkräfte» (die eingerahmten <M p=",">{t`A_z`}</M> <M p=",">{t`A_x`}</M> <M p=").">{t`A_y`}</M></p>} en={<p>Handwritten: “support forces” (<span lang="de">Lagerkräfte</span>; the boxed <M p=",">{t`A_z`}</M> <M p=",">{t`A_x`}</M> <M p=").">{t`A_y`}</M></p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So geht man vor.</b></p>
            <ol className="keep">
              <li><b>Freischneiden:</b> Das Lager wird weggenommen und durch die Kräfte ersetzt, die es ausüben kann: hier in allen drei Richtungen, <M p=".">{t`A_x, A_y, A_z`}</M> Sie sind die Unbekannten.</li>
              <li><b>Komponentenbedingungen:</b> In <M>x</M> und <M>z</M> wirkt sonst nichts, also <M p=".">{t`A_x = A_z = 0`}</M> In <M>y</M> trägt das Lager das Gewicht beider Lasten: <M p=".">{t`A_y = F_1 + F_2`}</M></li>
              <li><b>Momentenbedingung um <M p=":">A</M></b> Die Lagerkräfte gehen durch <M>A</M> und fallen weg. Übrig bleibt das Hebelgesetz, das du aus der ersten Lektion kennst, jetzt als Gleichgewichtsbedingung.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to proceed.</b></p>
            <ol className="keep">
              <li><b>Cut free:</b> the support is removed and replaced by the forces it can exert: here in all three directions, <M p=".">{t`A_x, A_y, A_z`}</M> They are the unknowns.</li>
              <li><b>Component conditions:</b> nothing else acts in <M>x</M> and <M p=",">z</M> so <M p=".">{t`A_x = A_z = 0`}</M> In <M>y</M> the support carries the weight of both loads: <M p=".">{t`A_y = F_1 + F_2`}</M></li>
              <li><b>Moment condition about <M p=":">A</M></b> the support forces pass through <M>A</M> and drop out. What remains is the law of the lever you know from the first lesson, now as an equilibrium condition.</li>
            </ol>
          </>}
        />
        <StepPlayer
          label={tr('Animation: Waage freischneiden und Gleichgewicht', 'Animation: cutting the scale free and equilibrium')}
          steps={[
            { ms: 600, holdMs: 2400, caption: <T de={<>Die Waage mit zwei Lasten auf dem Lager <M p=".">A</M></>} en={<>The scale with two loads on the support <M p=".">A</M></>} /> },
            { ms: 1200, holdMs: 2800, caption: <T de={<>Freischneiden: Das Lager wird durch <M p=",">{t`A_x`}</M> <M p=",">{t`A_y`}</M> <M>{t`A_z`}</M> ersetzt. In <M>x</M> und <M>z</M> gibt es sonst keine Kraft, also sind beide null.</>} en={<>Cut free: the support is replaced by <M p=",">{t`A_x`}</M> <M p=",">{t`A_y`}</M> <M p=".">{t`A_z`}</M> There is no other force in <M>x</M> and <M p=",">z</M> so both are zero.</>} /> },
            { ms: 900, holdMs: 2800, caption: <T de={<>Kräfte in <M p=":">y</M> <M p=".">{t`A_y = F_1 + F_2`}</M> Das Lager trägt beide Lasten.</>} en={<>Forces in <M p=":">y</M> <M p=".">{t`A_y = F_1 + F_2`}</M> The support carries both loads.</>} /> },
            { ms: 900, holdMs: 3000, caption: <T de={<>Momente um <M p=":">A</M> <M p=",">{t`F_1 a_1 = F_2 a_2`}</M> also <M p=".">{t`a_2 = a_1 F_1/F_2`}</M></>} en={<>Moments about <M p=":">A</M> <M p=",">{t`F_1 a_1 = F_2 a_2`}</M> so <M p=".">{t`a_2 = a_1 F_1/F_2`}</M></>} /> },
          ]}
        >
          {(step, tt) => <WaageFig step={step} t={tt} />}
        </StepPlayer>
        <Box kind="lecture" src={<Src p={44} fig="Fig. 6.23" />} title={<T de="Fig. 6.23: zu Aufgabe 1" en="Fig. 6.23: for exercise 1" />}>
          <T
            de={<p>Eine Scheibe zwischen zwei unter 45° geneigten Wänden mit dem Gewicht <M>{t`\v G`}</M> (handschriftlich 8), <M>{t`\v F_1`}</M> waagrecht von links (4) und <M>{t`\v F_2`}</M> unter 45° von rechts oben (10); Kontaktkräfte <M>{t`\v A`}</M> und <M>{t`\v B`}</M> unter 45°. Eine Lösung steht nicht auf der Seite.</p>}
            en={<p>A disc between two walls inclined at 45° with the weight <M>{t`\v G`}</M> (handwritten 8), <M>{t`\v F_1`}</M> horizontal from the left (4) and <M>{t`\v F_2`}</M> at 45° from the upper right (10); contact forces <M>{t`\v A`}</M> and <M>{t`\v B`}</M> at 45°. No solution is on the page.</p>}
          />
        </Box>
        <Box kind="supplement" keep title={<T de="Lösung von Aufgabe 1" en="Solution of exercise 1" />}>
          <T
            de={<p>Alle Kräfte gehen durch den Mittelpunkt der Scheibe (die Kontaktkräfte stehen senkrecht auf den Wänden, also radial). Ihre Momente bezüglich des Mittelpunkts sind null; es bleiben zwei Komponentenbedingungen für <M>A</M> und <M p=".">B</M> Mit <M p=":">{t`s = \tfrac{\sqrt2}{2}`}</M></p>}
            en={<p>All forces pass through the centre of the disc (the contact forces are normal to the walls, i.e. radial). Their moments about the centre are zero; two component conditions remain for <M>A</M> and <M p=".">B</M> With <M p=":">{t`s = \tfrac{\sqrt2}{2}`}</M></p>}
          />
          <MD>{t`\begin{aligned}
\textstyle\sum F_x &= 4 - 10s + A s - B s = 0 &&\Rightarrow\ A - B = 10 - 4\sqrt2\\
\textstyle\sum F_y &= -8 - 10s + A s + B s = 0 &&\Rightarrow\ A + B = 10 + 8\sqrt2\\
A &= 10 + 2\sqrt2 \approx 12{,}83, &&\ \ B = 6\sqrt2 \approx 8{,}49
\end{aligned}`}</MD>
          <T
            de={<p>Die Richtungen der Kräfte sind aus der Figur abgelesen (R-037). Im Bild schliesst sich das Kraftpolygon: Legt man alle fünf Kräfte Spitze an Ende, kommt man zum Anfang zurück, <M p=".">{t`\v R = \v 0`}</M></p>}
            en={<p>The directions of the forces are read from the figure (R-037). In the figure the force polygon closes: laying all five forces tip to tail brings you back to the start, <M p=".">{t`\v R = \v 0`}</M></p>}
          />
          <DiscFigure />
        </Box>
        <Box kind="misconception" title={<T de="«Den Bezugspunkt für die Momente wählt man in der Mitte»" en="“The reference point for the moments is chosen in the middle”" />}>
          <T
            de={<p>Man darf ihn frei wählen, aber am klügsten dort, wo möglichst viele <b>unbekannte</b> Kräfte angreifen: Ihre Momente fallen weg, und die Momentengleichung enthält weniger Unbekannte. Bei der Waage ist das das Lager <M p=".">A</M></p>}
            en={<p>It may be chosen freely, but most cleverly where as many <b>unknown</b> forces as possible act: their moments drop out, and the moment equation contains fewer unknowns. For the scale that is the support <M p=".">A</M></p>}
          />
        </Box>
        <Box kind="key" title={<T de="Das Wichtigste" en="The essentials" />}>
          <T
            de={<ul><li>Gleichgewicht: <M>{t`\v R = \v 0`}</M> und <M p=".">{t`\v M_P = \v 0`}</M> Im Raum sind das 6 Gleichungen, in der Ebene 3.</li><li>Vorgehen: freischneiden, unbekannte Lagerkräfte einzeichnen, Gleichungen aufstellen.</li><li>Den Bezugspunkt für die Momente dort wählen, wo viele Unbekannte angreifen.</li></ul>}
            en={<ul><li>Equilibrium: <M>{t`\v R = \v 0`}</M> and <M p=".">{t`\v M_P = \v 0`}</M> In space these are 6 equations, in the plane 3.</li><li>Procedure: cut free, draw the unknown support forces, set up the equations.</li><li>Choose the reference point for the moments where many unknowns act.</li></ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
