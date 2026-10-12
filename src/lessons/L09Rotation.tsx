import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { restScene } from '../viz/anim/restScene';
import { circProofScene } from '../viz/anim/circProofScene';
import { omegaScene } from '../viz/anim/omegaScene';
import { CubeAnim } from '../viz/anim/CubeAnim';
import { FootDemo, RotationExplorer } from '../viz/RotationFigures';

const t = String.raw;

export default function L09Rotation() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Jetzt das Gegenstück zur Translation: Der Körper dreht sich um eine feste Achse – wie eine Tür in ihren Scharnieren. Das Skript zeigt auf S. 15–19, was daraus folgt, und kommt zur Formel <M p=",">{t`\v v = \v\omega\times\v r`}</M> die du von der Kreisbewegung kennst – jetzt für jeden starren Körper und jede Richtung der Achse.</p>}
        en={<p className="lede">Now the counterpart of translation: the body turns about a fixed axis – like a door on its hinges. On pp. 15–19 the notes show what follows from this and arrive at the formula <M p=",">{t`\v v = \v\omega\times\v r`}</M> which you know from circular motion – now for every rigid body and every direction of the axis.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Eine Tür hängt an zwei Scharnieren. Öffnest du sie, bleiben die Scharniere stehen. Jeder andere Punkt der Tür fährt auf einem Kreis um die Scharnierlinie – die Klinke auf einem grossen, ein Punkt nahe am Scharnier auf einem kleinen. Und die ganze Tür dreht sich um denselben Winkel: Steht sie 30° offen, dann überall.</p>}
          en={<p>A door hangs on two hinges. When you open it, the hinges stay where they are. Every other point of the door travels on a circle about the hinge line – the handle on a big one, a point near the hinge on a small one. And the whole door turns by the same angle: if it is open by 30°, it is open by 30° everywhere.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="definition" title={<T de="1. Was Rotation heisst" en="1. What rotation means" />}>
        <Box kind="lecture" src={<Src p={15} />}>
          <T
            de={<ul>
              <li><b>Rotation</b> liegt vor, falls 2 Punkte des Körpers in Ruhe sind.</li>
              <li>Rotationsachse <M p=":">\mu</M> Achse durch 2 Punkte, die in Ruhe sind.</li>
              <li>Eigenschaften: (1) alle Punkte auf <M>\mu</M> in Ruhe; (2) alle Punkte <M p=":">{t`\notin\mu`}</M> Kreisbewegung; (3) Winkelschnelligkeit gleich <M>\forall</M> Punkte.</li>
            </ul>}
            en={<ul>
              <li><b>Rotation</b> (<span lang="de">Rotation</span>) is present if 2 points of the body are at rest.</li>
              <li>Axis of rotation <M p=":">\mu</M> the axis through 2 points at rest.</li>
              <li>Properties: (1) all points on <M>\mu</M> at rest; (2) all points <M p=":">{t`\notin\mu`}</M> circular motion; (3) angular speed (<span lang="de">Winkelschnelligkeit</span>) equal <M>\forall</M> points.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> Zwei Punkte festhalten genügt – dann ist die Bewegung schon eine Rotation. Die Gerade durch diese zwei Punkte heisst Rotationsachse <M p=".">\mu</M> Die drei Eigenschaften sagen, wie sich dann alle anderen Punkte bewegen. «Winkelschnelligkeit» heisst: wie schnell sich der Winkel ändert, also <M p=".">{t`\dot\varphi`}</M> Das Skript beweist die drei Eigenschaften eine nach der anderen (Abschnitte 2 bis 4).</p>}
          en={<p><b>How to read this:</b> holding two points fixed is enough – then the motion is already a rotation. The line through these two points is called the axis of rotation <M p=".">\mu</M> The three properties say how all the other points then move. “Angular speed” means how fast the angle changes, that is <M p=".">{t`\dot\varphi`}</M> The notes prove the three properties one after the other (sections 2 to 4).</p>}
        />
        <RotationExplorer />
        <T
          de={<p>Im Bild ist der Körper eine Tür, <M>A</M> und <M>B</M> sind die Scharniere. Mit «Neigung» siehst du: Die Achse muss nicht senkrecht stehen. Alles bleibt gleich – nur die Kreise liegen dann schräg, immer senkrecht zu <M p=".">\mu</M></p>}
          en={<p>In the figure the body is a door, <M>A</M> and <M>B</M> are the hinges. With “tilt” you see: the axis does not have to be vertical. Everything stays the same – only the circles are then tilted, always perpendicular to <M p=".">\mu</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="achse" title={<T de="2. Warum die ganze Achse ruht" en="2. Why the whole axis is at rest" />}>
        <Box kind="lecture" src={<Src p={15} />}>
          <T de={<>Anschaulich (Punkt <M>C</M> auf <M p=")">\mu</M></>} en={<>Intuitively (<span lang="de">anschaulich</span>; point <M>C</M> on <M p=")">\mu</M></>} />
          <MD>{t`\v v_C \parallel \mu = 0 \ \text{aus SdpG}; \qquad \v v_C \perp \mu = 0 \ \text{sonst Winkeländerung}`}</MD>
        </Box>
        <T
          de={<p><b>So liest man die Zeile:</b> Man zerlegt eine mögliche Geschwindigkeit von <M>C</M> in zwei Teile: einen Teil längs der Achse und einen Teil quer dazu. «<M>{t`\v v_C \parallel \mu = 0`}</M>» ist Kurzschrift für: Der Teil längs <M>\mu</M> ist null. Ebenso heisst «<M>{t`\v v_C \perp \mu = 0`}</M>»: Der Teil quer zu <M>\mu</M> ist null. Dahinter stehen zwei verschiedene Gründe.</p>}
          en={<p><b>How to read the line:</b> split a possible velocity of <M>C</M> into two parts: one along the axis and one across it. “<M>{t`\v v_C \parallel \mu = 0`}</M>” is shorthand for: the part along <M>\mu</M> is zero. Likewise “<M>{t`\v v_C \perp \mu = 0`}</M>” means: the part across <M>\mu</M> is zero. Behind them are two different reasons (“<span lang="de">aus SdpG</span>” – from the SdpG; “<span lang="de">sonst Winkeländerung</span>” – otherwise an angle would change).</p>}
        />
        <Derivation title={<T de="Eigenschaft 1 Schritt für Schritt" en="Property 1 step by step" />}>
          <StepPlayer
            label={tr('Animation: Punkte auf der Achse ruhen', 'Animation: points on the axis are at rest')}
            steps={[
              { ms: 3000, holdMs: 2500, caption: <T
                de={<><M>A</M> und <M>B</M> ruhen, <M>C</M> liegt dazwischen auf der Achse. Angenommen, <M>C</M> hätte eine Geschwindigkeit <M>{t`\v v_C`}</M> (gestrichelt). Wir zerlegen sie: Teil längs <M>\mu</M> (türkis), Teil quer dazu (violett).</>}
                en={<><M>A</M> and <M>B</M> are at rest, <M>C</M> lies between them on the axis. Suppose <M>C</M> had a velocity <M>{t`\v v_C`}</M> (dashed). We split it: the part along <M>\mu</M> (teal), the part across it (purple).</>} /> },
              { ms: 3500, holdMs: 3000, caption: <T
                de={<>Teil längs <M p=":">\mu</M> Nach dem SdpG hat <M>{t`\v v_C`}</M> auf der Geraden <M>{t`AC`}</M> dieselbe Projektion wie <M p=".">{t`\v v_A`}</M> Und <M p=".">{t`\v v_A = \v 0`}</M> Also ist dieser Teil null.</>}
                en={<>The part along <M p=":">\mu</M> by the SdpG, <M>{t`\v v_C`}</M> has the same projection onto the line <M>{t`AC`}</M> as <M p=".">{t`\v v_A`}</M> And <M p=".">{t`\v v_A = \v 0`}</M> So this part is zero.</>} /> },
              { ms: 4000, caption: <T
                de={<>Teil quer zu <M p=":">\mu</M> Dann würde <M>C</M> die Gerade verlassen (gestrichelt), und der Winkel <M>\gamma</M> bei <M>C</M> wäre nicht mehr 180°. Im starren Körper ändern sich Winkel nicht – also <M p=".">{t`\v v_C = \v 0`}</M></>}
                en={<>The part across <M p=":">\mu</M> then <M>C</M> would leave the line (dashed), and the angle <M>\gamma</M> at <M>C</M> would no longer be 180°. In a rigid body angles do not change – so <M p=".">{t`\v v_C = \v 0`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={restScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <details className="more">
          <summary><T de="Warum mit dem Winkel und nicht mit dem Abstand?" en="Why with the angle and not with the distance?" /></summary>
          <T
            de={<p>Rutscht <M>C</M> ein kleines Stück <M>\varepsilon</M> zur Seite, werden die Abstände <M>{t`AC`}</M> und <M>{t`CB`}</M> nur um etwas der Grösse <M>{t`\varepsilon^2`}</M> länger – fast nichts. Der Winkel bei <M>C</M> ändert sich aber sofort um etwas proportional zu <M p=".">\varepsilon</M> Darum benutzt das Skript den Winkel: Im starren Körper bleiben Winkel zwischen Verbindungsvektoren gleich (S. 12).</p>}
            en={<p>If <M>C</M> slides a small distance <M>\varepsilon</M> sideways, the distances <M>{t`AC`}</M> and <M>{t`CB`}</M> grow only by something of size <M>{t`\varepsilon^2`}</M> – almost nothing. But the angle at <M>C</M> changes at once by something proportional to <M p=".">\varepsilon</M> That is why the notes use the angle: in a rigid body the angles between connecting vectors stay the same (p. 12).</p>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="kreis" title={<T de="3. Beweis 2: Jeder Punkt fährt einen Kreis" en="3. Proof 2: every point travels on a circle" />}>
        <Box kind="lecture" src={<Src p={16} />}>
          <T de={<>Damit Kreisbewegung um <M p=":">\mu</M> <M p=",">{t`\v v_P \perp \v{DP}`}</M> <M p=".">{t`\v v_P \perp \mu`}</M></>} en={<>For circular motion about <M p=":">\mu</M> <M p=",">{t`\v v_P \perp \v{DP}`}</M> <M p=".">{t`\v v_P \perp \mu`}</M></>} />
          <MD>{t`\text{SdpG } P \leftrightarrow D\colon\ \v v_P\cdot\v{DP} = \v v_D\cdot\v{DP} \ (= 0) \ \to\ \v v_P \perp \v{DP}`}</MD>
          <MD>{t`(\v{DP}\cdot\v{DA})^{\boldsymbol\cdot} = \big((\v r_P - \v r_D)\cdot(\v r_A - \v r_D)\big)^{\boldsymbol\cdot} = 0`}</MD>
          <MD>{t`(\v r_P - \v r_D)^{\boldsymbol\cdot}\cdot(\v r_A - \v r_D) + (\v r_P - \v r_D)\cdot(\v r_A - \v r_D)^{\boldsymbol\cdot} = 0, \quad \v v_A = \v v_D = \v 0`}</MD>
          <MD>{t`\dot{\v r}_P\cdot(\v r_A - \v r_D) = 0 \ \to\ \v v_P \perp \mu`}</MD>
          <T de="Zylindrisch:" en={<>In cylindrical coordinates (<span lang="de">zylindrisch</span>):</>} />
          <MD>{t`\v r_P = \rho(t)\,\v e_\rho + z(t)\,\v e_z, \qquad \v v_P = \dot\rho\,\v e_\rho + \rho\dot\varphi\,\v e_\varphi + \dot z\,\v e_z`}</MD>
          <MD>{t`\v v_P \perp \mu \leftrightarrow \v e_z \ \Rightarrow\ \dot z = 0,\ z = z_0; \qquad \v v_P \perp \v{DP} \leftrightarrow \v e_\rho \ \Rightarrow\ \dot\rho = 0,\ \rho = R`}</MD>
          <MD>{t`\v r_P = R\,\v e_\rho + z_0\,\v e_z\colon\ \text{Kreisbewegung!}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man den Beweis:</b></p>
            <ol>
              <li><M>D</M> ist der <b>Fusspunkt</b>: der Punkt auf <M p=",">\mu</M> der <M>P</M> am nächsten ist. Darum steht <M>{t`\v{DP}`}</M> senkrecht auf <M p=".">\mu</M></li>
              <li>Für einen Kreis um <M>\mu</M> darf sich <M>P</M> weder von der Achse entfernen (Richtung <M p=")">{t`\v{DP}`}</M> noch längs der Achse wandern (Richtung <M p=")">\mu</M> Das sind die zwei Bedingungen der ersten Zeile.</li>
              <li><M>D</M> liegt auf der Achse, also ruht <M>D</M> (Eigenschaft 1). Der SdpG für <M>P</M> und <M>D</M> gibt dann <M p=":">{t`\v v_P\cdot\v{DP} = 0`}</M> <M>{t`\v v_P`}</M> steht senkrecht auf <M p=".">{t`\v{DP}`}</M></li>
              <li><M>{t`\v{DP}`}</M> und <M>{t`\v{DA}`}</M> stehen senkrecht. Im starren Körper bleibt dieser Winkel 90°, also ist <M>{t`\v{DP}\cdot\v{DA}`}</M> immer null – eine Konstante, ihre Ableitung ist null. Die Produktregel gibt zwei Terme. Der zweite fällt weg, weil <M>A</M> und <M>D</M> ruhen. Übrig bleibt <M p=":">{t`\v v_P\cdot\v{DA} = 0`}</M> <M>{t`\v v_P`}</M> steht senkrecht auf <M p=".">\mu</M></li>
              <li>Jetzt Zylinderkoordinaten mit der <M>z</M>-Achse auf <M p=".">\mu</M> «Senkrecht auf <M>\mu</M>» heisst: kein <M>{t`\v e_z`}</M>-Anteil, also <M p=".">{t`\dot z = 0`}</M> «Senkrecht auf <M>{t`\v{DP}`}</M>» heisst: kein <M>{t`\v e_\rho`}</M>-Anteil, also <M p=".">{t`\dot\rho = 0`}</M> Höhe und Abstand bleiben fest: ein Kreis.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the proof:</b></p>
            <ol>
              <li><M>D</M> is the <b>foot</b> of the perpendicular: the point on <M>\mu</M> closest to <M p=".">P</M> That is why <M>{t`\v{DP}`}</M> is perpendicular to <M p=".">\mu</M></li>
              <li>For a circle about <M p=",">\mu</M> <M>P</M> may neither move away from the axis (direction <M p=")">{t`\v{DP}`}</M> nor travel along the axis (direction <M p=")">\mu</M> These are the two conditions of the first line.</li>
              <li><M>D</M> lies on the axis, so <M>D</M> is at rest (property 1). The SdpG for <M>P</M> and <M>D</M> then gives <M p=":">{t`\v v_P\cdot\v{DP} = 0`}</M> <M>{t`\v v_P`}</M> is perpendicular to <M p=".">{t`\v{DP}`}</M></li>
              <li><M>{t`\v{DP}`}</M> and <M>{t`\v{DA}`}</M> are perpendicular. In a rigid body this angle stays 90°, so <M>{t`\v{DP}\cdot\v{DA}`}</M> is always zero – a constant, its derivative is zero. The product rule gives two terms. The second drops out because <M>A</M> and <M>D</M> are at rest. What is left is <M p=":">{t`\v v_P\cdot\v{DA} = 0`}</M> <M>{t`\v v_P`}</M> is perpendicular to <M p=".">\mu</M></li>
              <li>Now cylindrical coordinates with the <M>z</M>-axis along <M p=".">\mu</M> “Perpendicular to <M>\mu</M>” means: no <M>{t`\v e_z`}</M> part, so <M p=".">{t`\dot z = 0`}</M> “Perpendicular to <M>{t`\v{DP}`}</M>” means: no <M>{t`\v e_\rho`}</M> part, so <M p=".">{t`\dot\rho = 0`}</M> Height and distance stay fixed: a circle (<span lang="de">Kreisbewegung</span>).</li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Beweis 2 Schritt für Schritt" en="Proof 2 step by step" />}>
          <StepPlayer
            label={tr('Animation: Beweis der Kreisbewegung', 'Animation: proof of the circular motion')}
            steps={[
              { ms: 2500, holdMs: 2500, caption: <T
                de={<>Die Achse <M>\mu</M> mit <M p=",">O</M> <M>D</M> und <M>A</M> – alle in Ruhe. <M>P</M> liegt neben der Achse; <M>{t`\v{DP}`}</M> steht senkrecht auf <M p=".">\mu</M></>}
                en={<>The axis <M>\mu</M> with <M p=",">O</M> <M>D</M> and <M>A</M> – all at rest. <M>P</M> lies off the axis; <M>{t`\v{DP}`}</M> is perpendicular to <M p=".">\mu</M></>} /> },
              { ms: 3000, holdMs: 3000, caption: <T
                de={<>Ziel: <M>P</M> bleibt auf dem Kreis um <M>\mu</M> (rot gestrichelt). Dafür darf <M>{t`\v v_P`}</M> weder nach aussen noch nach oben zeigen – die grauen Pfeile.</>}
                en={<>Goal: <M>P</M> stays on the circle about <M>\mu</M> (red, dashed). For that <M>{t`\v v_P`}</M> may point neither outward nor upward – the grey arrows.</>} /> },
              { ms: 3500, holdMs: 3000, caption: <T
                de={<>SdpG für <M>P</M> und <M p=":">D</M> <M p=",">{t`\v v_P\cdot\v{DP} = 0`}</M> weil <M>D</M> ruht. Also steht <M>{t`\v v_P`}</M> senkrecht auf <M p=".">{t`\v{DP}`}</M></>}
                en={<>SdpG for <M>P</M> and <M p=":">D</M> <M p=",">{t`\v v_P\cdot\v{DP} = 0`}</M> because <M>D</M> is at rest. So <M>{t`\v v_P`}</M> is perpendicular to <M p=".">{t`\v{DP}`}</M></>} /> },
              { ms: 3500, holdMs: 3000, caption: <T
                de={<><M>{t`\v{DP}\cdot\v{DA}`}</M> ist konstant (rechter Winkel im starren Körper). Ableiten gibt <M p=":">{t`\v v_P\cdot\v{DA} = 0`}</M> <M>{t`\v v_P`}</M> steht auch senkrecht auf <M p=".">\mu</M></>}
                en={<><M>{t`\v{DP}\cdot\v{DA}`}</M> is constant (a right angle in a rigid body). Differentiating gives <M p=":">{t`\v v_P\cdot\v{DA} = 0`}</M> <M>{t`\v v_P`}</M> is also perpendicular to <M p=".">\mu</M></>} /> },
              { ms: 5000, caption: <T
                de={<>Also <M>{t`\dot\rho = 0`}</M> und <M p=":">{t`\dot z = 0`}</M> Der Abstand <M>R</M> und die Höhe <M>{t`z_0`}</M> bleiben fest – <M>P</M> fährt einen Kreis um <M p=".">\mu</M></>}
                en={<>So <M>{t`\dot\rho = 0`}</M> and <M p=":">{t`\dot z = 0`}</M> the distance <M>R</M> and the height <M>{t`z_0`}</M> stay fixed – <M>P</M> travels on a circle about <M p=".">\mu</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={circProofScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p className="small-note">Dass <M>D</M> ruht, benutzt Eigenschaft 1 – und dass <M>D</M> zum Körper gehört. Liegt <M>D</M> ausserhalb des Körpers, denkt man sich den Körper starr bis dorthin verlängert.</p>}
          en={<p className="small-note">That <M>D</M> is at rest uses property 1 – and that <M>D</M> belongs to the body. If <M>D</M> lies outside the body, imagine the body extended rigidly up to there.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="winkel" title={<T de="4. Beweis 3: Alle drehen gleich schnell" en="4. Proof 3: all points turn equally fast" />}>
        <Box kind="lecture" src={<Src p={17} />}>
          <MD>{t`\v v_P = \dot\varphi_P\,\v e_z\times\v r_P, \qquad \v v_Q = \dot\varphi_Q\,\v e_z\times\v r_Q. \qquad \text{Zu zeigen: } \dot\varphi_P = \dot\varphi_Q`}</MD>
          <MD>{t`\text{SdpG: } \v v_P\cdot\v{PQ} = \v v_Q\cdot\v{PQ}\colon\quad \dot\varphi_P\,(\v e_z\times\v r_P)\cdot(\v r_Q - \v r_P) = \dot\varphi_Q\,(\v e_z\times\v r_Q)\cdot(\v r_Q - \v r_P)`}</MD>
          <MD>{t`\dot\varphi_P\,(\v e_z\times\v r_P)\cdot\v r_Q = -\dot\varphi_{\textcolor{#e11d48}{P}}\,(\v e_z\times\v r_Q)\cdot\v r_P = \dot\varphi_Q\,(\v r_Q\times\v e_z)\cdot\v r_P \quad [\text{wegen } -(\v a\times\v b) = \v b\times\v a]`}</MD>
          <MD>{t`\dot\varphi_P\,(\v e_z\times\v r_P)\cdot\v r_Q = \dot\varphi_Q\,(\v e_z\times\v r_P)\cdot\v r_Q \quad [\text{Spatprodukt } (\v a\times\v b)\cdot\v c = (\v b\times\v c)\cdot\v a] \ \to\ \dot\varphi_P = \dot\varphi_Q`}</MD>
          <T
            de={<>Somit: Rotation: alle Punkte führen Kreisbewegung mit «Winkelgeschwindigkeit» / «Rotationsgeschwindigkeit» <M p=",">{t`\v\omega = \dot\varphi\,\v e_\mu`}</M> mit <M>{t`\mu = z'Oz \to \v\omega = \dot\varphi\,\v e_z`}</M></>}
            en={<>Hence: rotation: all points move on circles with “angular velocity” / “rotational velocity” (<span lang="de">Winkelgeschwindigkeit / Rotationsgeschwindigkeit</span>) <M p=",">{t`\v\omega = \dot\varphi\,\v e_\mu`}</M> with <M>{t`\mu = z'Oz \to \v\omega = \dot\varphi\,\v e_z`}</M></>}
          />
          <MD>{t`(3)\qquad \v v = \v\omega\times\v r = \dot\varphi\,\v e_z\times\v r \quad (\text{mit } O \text{ auf } \mu)`}</MD>
        </Box>
        <T
          de={<p>Achtung, Tippfehler: Im mittleren Term der dritten Zeile steht im Skript <M>{t`\dot\varphi_P`}</M> (rot markiert). Richtig ist <M p=",">{t`\dot\varphi_Q`}</M> sonst passt die Zeile nicht zur Zeile darüber.</p>}
          en={<p>Careful, a typo: in the middle term of the third line the notes have <M>{t`\dot\varphi_P`}</M> (marked red). It should be <M p=",">{t`\dot\varphi_Q`}</M> otherwise the line does not follow from the one above.</p>}
        />
        <T
          de={<>
            <p><b>So liest man die Rechnung:</b></p>
            <ol>
              <li>Nach Beweis 2 fahren <M>P</M> und <M>Q</M> Kreise um <M p=".">\mu</M> Legt man die <M>z</M>-Achse auf <M p=",">\mu</M> haben ihre Geschwindigkeiten die Form aus der Kreisbewegung (<a href="#kreisbewegung">S. 11</a>): <M p=".">{t`\v v = \dot\varphi\,\v e_z\times\v r`}</M> Jeder Punkt hat dabei zunächst seine eigene Winkelschnelligkeit, <M>{t`\dot\varphi_P`}</M> bzw. <M p=".">{t`\dot\varphi_Q`}</M> Ob die beiden gleich sind, ist noch offen.</li>
              <li>Der SdpG für <M>P</M> und <M>Q</M> mit <M p=".">{t`\v{PQ} = \v r_Q - \v r_P`}</M></li>
              <li><M>{t`\v e_z\times\v r_P`}</M> steht senkrecht auf <M p=",">{t`\v r_P`}</M> also ist <M p=".">{t`(\v e_z\times\v r_P)\cdot\v r_P = 0`}</M> Links bleibt nur der Term mit <M p=",">{t`\v r_Q`}</M> rechts aus demselben Grund nur der mit <M p=".">{t`\v r_P`}</M> Das Minus verschwindet mit <M p=".">{t`-(\v e_z\times\v r_Q) = \v r_Q\times\v e_z`}</M> Zuletzt das <b>Spatprodukt</b> <M p=":">{t`(\v a\times\v b)\cdot\v c`}</M> erst Kreuz-, dann Skalarprodukt. Es ist das Volumen des schiefen Quaders («Spat») aus den drei Pfeilen, mit Vorzeichen. Schiebt man die Pfeile im Kreis weiter <M p=",">{t`(\v a\to\v b\to\v c\to\v a)`}</M> bleibt das Volumen gleich; so wird <M>{t`(\v r_Q\times\v e_z)\cdot\v r_P`}</M> zu <M p=".">{t`(\v e_z\times\v r_P)\cdot\v r_Q`}</M></li>
              <li>Am Ende steht auf beiden Seiten dieselbe Zahl <M p=",">{t`X = (\v e_z\times\v r_P)\cdot\v r_Q`}</M> einmal mal <M>{t`\dot\varphi_P`}</M> und einmal mal <M p=".">{t`\dot\varphi_Q`}</M> Ist <M p=",">{t`X \ne 0`}</M> darf man durch <M>X</M> teilen: <M p=".">{t`\dot\varphi_P = \dot\varphi_Q`}</M></li>
            </ol>
            <p><M>X</M> hat ein Bild: Von oben gesehen ist es die Fläche des Parallelogramms aus <M>{t`\v r_P`}</M> und <M>{t`\v r_Q`}</M> (mit Vorzeichen).</p>
            <p><b>So liest man die Schlusszeilen im Skript:</b></p>
            <ol>
              <li>Alle Punkte fahren Kreise um <M p=",">\mu</M> alle mit demselben <M p=".">{t`\dot\varphi`}</M></li>
              <li>Daraus macht das Skript einen Vektor, die <b>Winkelgeschwindigkeit</b> <M p=".">{t`\v\omega = \dot\varphi\,\v e_\mu`}</M> Dabei ist <M>{t`\v e_\mu`}</M> der Einheitsvektor (Länge 1) längs der Achse <M p=".">\mu</M></li>
              <li><M>{t`\mu = z'Oz`}</M> heisst: Die Achse ist die <M>z</M>-Achse (von <M>{t`z'`}</M> unten über <M>O</M> nach <M>z</M> oben). Dann ist <M>{t`\v e_\mu = \v e_z`}</M> und <M p=".">{t`\v\omega = \dot\varphi\,\v e_z`}</M></li>
              <li>Gleichung (3) fasst alles zusammen: <M>{t`\v v = \v\omega\times\v r`}</M> für jeden Punkt, mit <M>O</M> auf der Achse.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the calculation:</b></p>
            <ol>
              <li>By proof 2, <M>P</M> and <M>Q</M> travel on circles about <M p=".">\mu</M> With the <M>z</M>-axis along <M p=",">\mu</M> their velocities have the form from circular motion (<a href="#kreisbewegung">p. 11</a>): <M p=".">{t`\v v = \dot\varphi\,\v e_z\times\v r`}</M> At first each point has its own angular speed, <M>{t`\dot\varphi_P`}</M> and <M p=".">{t`\dot\varphi_Q`}</M> Whether the two are equal is still open.</li>
              <li>The SdpG for <M>P</M> and <M>Q</M> with <M p=".">{t`\v{PQ} = \v r_Q - \v r_P`}</M></li>
              <li><M>{t`\v e_z\times\v r_P`}</M> is perpendicular to <M p=",">{t`\v r_P`}</M> so <M p=".">{t`(\v e_z\times\v r_P)\cdot\v r_P = 0`}</M> On the left only the term with <M>{t`\v r_Q`}</M> is left; on the right, for the same reason, only the one with <M p=".">{t`\v r_P`}</M> The minus disappears with <M p=".">{t`-(\v e_z\times\v r_Q) = \v r_Q\times\v e_z`}</M> Last comes the <b>scalar triple product</b> (<span lang="de">Spatprodukt</span>) <M p=":">{t`(\v a\times\v b)\cdot\v c`}</M> first the cross product, then the dot product. It is the volume of the slanted box (“Spat”, a parallelepiped) spanned by the three arrows, with a sign. Moving the arrows round in a circle <M p=",">{t`(\v a\to\v b\to\v c\to\v a)`}</M> keeps the volume; that is how <M>{t`(\v r_Q\times\v e_z)\cdot\v r_P`}</M> becomes <M p=".">{t`(\v e_z\times\v r_P)\cdot\v r_Q`}</M></li>
              <li>In the end both sides contain the same number <M p=",">{t`X = (\v e_z\times\v r_P)\cdot\v r_Q`}</M> once times <M>{t`\dot\varphi_P`}</M> and once times <M p=".">{t`\dot\varphi_Q`}</M> If <M p=",">{t`X \ne 0`}</M> we may divide by <M p=":">X</M> <M p=".">{t`\dot\varphi_P = \dot\varphi_Q`}</M></li>
            </ol>
            <p><M>X</M> has a picture: seen from above it is the area of the parallelogram of <M>{t`\v r_P`}</M> and <M>{t`\v r_Q`}</M> (with a sign).</p>
            <p><b>How to read the closing lines in the notes:</b></p>
            <ol>
              <li>All points travel on circles about <M p=",">\mu</M> all with the same <M p=".">{t`\dot\varphi`}</M></li>
              <li>The notes turn this into a vector, the <b>angular velocity</b> <M p=".">{t`\v\omega = \dot\varphi\,\v e_\mu`}</M> Here <M>{t`\v e_\mu`}</M> is the unit vector (length 1) along the axis <M p=".">\mu</M></li>
              <li><M>{t`\mu = z'Oz`}</M> means: the axis is the <M>z</M>-axis (from <M>{t`z'`}</M> below through <M>O</M> to <M>z</M> above). Then <M>{t`\v e_\mu = \v e_z`}</M> and <M p=".">{t`\v\omega = \dot\varphi\,\v e_z`}</M></li>
              <li>Equation (3) sums it all up: <M>{t`\v v = \v\omega\times\v r`}</M> for every point, with <M>O</M> on the axis.</li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Beweis 3 Schritt für Schritt" en="Proof 3 step by step" />}>
          <StepPlayer
            label={tr('Animation: gleiche Winkelschnelligkeit', 'Animation: equal angular speed')}
            steps={[
              { ms: 2500, holdMs: 2500, caption: <T
                de={<>Von oben auf die Achse geschaut: <M>\mu</M> ist der Punkt <M p=".">O</M> <M>P</M> und <M>Q</M> fahren Kreise. Angenommen, <M>Q</M> drehte schneller als <M p=".">P</M></>}
                en={<>Looking down the axis: <M>\mu</M> is the point <M p=".">O</M> <M>P</M> and <M>Q</M> travel on circles. Suppose <M>Q</M> turned faster than <M p=".">P</M></>} /> },
              { ms: 4000, holdMs: 3000, caption: <T
                de={<>Dann käme <M>Q</M> gegenüber <M>P</M> voran, und der Abstand <M>{t`PQ`}</M> würde sich ändern (Kasten). Im starren Körper ist das verboten.</>}
                en={<>Then <M>Q</M> would get ahead of <M p=",">P</M> and the distance <M>{t`PQ`}</M> would change (box). In a rigid body that is forbidden.</>} /> },
              { ms: 4000, holdMs: 3000, caption: <T
                de={<>Genau das sagt der SdpG: Die Projektionen von <M>{t`\v v_P`}</M> und <M>{t`\v v_Q`}</M> auf die Gerade <M>{t`PQ`}</M> (türkis) müssen gleich lang sein. Hier sind sie es nicht.</>}
                en={<>That is exactly what the SdpG says: the projections of <M>{t`\v v_P`}</M> and <M>{t`\v v_Q`}</M> onto the line <M>{t`PQ`}</M> (teal) must be equally long. Here they are not.</>} /> },
              { ms: 3500, holdMs: 3500, caption: <T
                de={<>Ausgerechnet: Beide Seiten sind <M>{t`\dot\varphi`}</M> mal dieselbe Zahl <M p=",">X</M> die Fläche des violetten Parallelogramms aus <M>{t`\v r_P`}</M> und <M p=".">{t`\v r_Q`}</M></>}
                en={<>Worked out: both sides are <M>{t`\dot\varphi`}</M> times the same number <M p=",">X</M> the area of the purple parallelogram of <M>{t`\v r_P`}</M> and <M p=".">{t`\v r_Q`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<><M>X</M> ist nicht null. Also muss <M>{t`\dot\varphi_Q = \dot\varphi_P`}</M> sein: <M>{t`\v v_Q`}</M> wird kürzer, die Projektionen werden gleich lang.</>}
                en={<><M>X</M> is not zero. So <M>{t`\dot\varphi_Q = \dot\varphi_P`}</M> must hold: <M>{t`\v v_Q`}</M> gets shorter, the projections become equally long.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={omegaScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <details className="more">
          <summary><T de={<>Und wenn <M p="?">{t`X = 0`}</M></>} en={<>And if <M p="?">{t`X = 0`}</M></>} /></summary>
          <T
            de={<p><M>{t`X = 0`}</M> heisst: Von oben gesehen liegen <M p=",">O</M> <M>P</M> und <M>Q</M> auf einer Geraden – <M p=",">P</M> <M>Q</M> und die Achse liegen in einer Ebene. Dann zeigen <M>{t`\v v_P`}</M> und <M>{t`\v v_Q`}</M> beide senkrecht aus dieser Ebene heraus, ihre Projektionen auf <M>{t`\v{PQ}`}</M> sind beide null, und der SdpG sagt nichts. Das Skript teilt hier stillschweigend durch <M p=".">X</M> Abhilfe: Man vergleicht <M>P</M> und <M>Q</M> je mit einem dritten Punkt neben dieser Ebene. Für beide ist <M>{t`X \ne 0`}</M> – also drehen alle drei gleich schnell.</p>}
            en={<p><M>{t`X = 0`}</M> means: seen from above, <M p=",">O</M> <M>P</M> and <M>Q</M> lie on one line – <M p=",">P</M> <M>Q</M> and the axis lie in one plane. Then <M>{t`\v v_P`}</M> and <M>{t`\v v_Q`}</M> both point perpendicularly out of that plane, both projections onto <M>{t`\v{PQ}`}</M> are zero, and the SdpG says nothing. The notes silently divide by <M>X</M> here. The remedy: compare <M>P</M> and <M>Q</M> each with a third point off that plane. For both, <M>{t`X \ne 0`}</M> – so all three turn equally fast.</p>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="verteilung" title={<T de="5. Die Geschwindigkeitsverteilung" en="5. The velocity distribution" />}>
        <Box kind="lecture" src={<Src p={18} fig="Fig. 3.8" />}>
          <MD>{t`\v v_M = \v\omega\times\v{OM}, \qquad |\v v_M| = |\v\omega|\cdot|\v{AM}|`}</MD>
          <T
            de={<>Fig. 3.8 Geschwindigkeitsverteilung bei Rotation. Gleichung <M>{t`\v v = \v\omega\times\v r`}</M> gültig auch falls <M p=",">{t`\mu \ne z'Oz`}</M> solange Ursprung <M>O</M> auf <M>\mu</M> ist!</>}
            en={<>Fig. 3.8 velocity distribution for rotation (<span lang="de">Geschwindigkeitsverteilung bei Rotation</span>). The equation <M>{t`\v v = \v\omega\times\v r`}</M> is valid also if <M p=",">{t`\mu \ne z'Oz`}</M> as long as the origin <M>O</M> lies on <M p="!">\mu</M></>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> <M>A</M> ist hier der Fusspunkt von <M>M</M> auf der Achse (nicht das <M>A</M> von S. 15). <M>{t`|\v{AM}|`}</M> ist also der Abstand von <M>M</M> zur Achse. Warum gilt die Formel? Der Betrag eines Kreuzprodukts ist Länge mal Länge mal Sinus des Winkels <M>\alpha</M> zwischen <M>{t`\v\omega`}</M> und <M p=":">{t`\v{OM}`}</M> <M p=".">{t`|\v\omega\times\v{OM}| = |\v\omega|\,|\v{OM}|\sin\alpha`}</M> Im rechtwinkligen Dreieck <M p=",">O</M> <M p=",">A</M> <M>M</M> ist <M>{t`|\v{OM}|\sin\alpha`}</M> genau die Seite <M p=".">{t`|\v{AM}|`}</M> Wo <M>O</M> auf der Achse liegt, spielt also keine Rolle.</p>}
          en={<p><b>How to read this:</b> here <M>A</M> is the foot of <M>M</M> on the axis (not the <M>A</M> of p. 15). So <M>{t`|\v{AM}|`}</M> is the distance of <M>M</M> from the axis. Why does the formula hold? The magnitude of a cross product is length times length times the sine of the angle <M>\alpha</M> between <M>{t`\v\omega`}</M> and <M p=":">{t`\v{OM}`}</M> <M p=".">{t`|\v\omega\times\v{OM}| = |\v\omega|\,|\v{OM}|\sin\alpha`}</M> In the right triangle <M p=",">O</M> <M p=",">A</M> <M>M</M> the quantity <M>{t`|\v{OM}|\sin\alpha`}</M> is exactly the side <M p=".">{t`|\v{AM}|`}</M> So where <M>O</M> lies on the axis does not matter.</p>}
        />
        <FootDemo />
        <T
          de={<p>Daraus folgt das Bild der <b>Geschwindigkeitsverteilung</b> (Fig. 3.8): Auf der Achse ist <M p=",">{t`\v v = \v 0`}</M> und nach aussen wächst <M>{t`|\v v|`}</M> gleichmässig mit dem Abstand – doppelt so weit heisst doppelt so schnell. Die Pfeile stehen senkrecht auf der Achse und senkrecht auf dem Weg zur Achse. Im Bild in Abschnitt 1 zeigt «Geschwindigkeiten» genau das, auch bei geneigter Achse.</p>}
          en={<p>From this follows the picture of the <b>velocity distribution</b> (Fig. 3.8): on the axis <M p=",">{t`\v v = \v 0`}</M> and outwards <M>{t`|\v v|`}</M> grows evenly with the distance – twice as far means twice as fast. The arrows are perpendicular to the axis and perpendicular to the way to the axis. In the figure of section 1, “velocities” shows exactly this, also with a tilted axis.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="wuerfel" title={<T de="6. Beispiel: der Würfel" en="6. Example: the cube" />}>
        <Box kind="lecture" src={<Src p={19} />} title={<T de="Beispiel Würfel, Rotation" en={<>Cube example, rotation (<span lang="de">Beispiel Würfel, Rotation</span>)</>} />}>
          <T
            de={<p>Figur: Würfel mit Kantenlänge <M p=";">a</M> <M p=",">{t`O \equiv A`}</M> <M>B</M> auf der <M>x</M>-Achse, <M>E</M> auf der <M>y</M>-Achse, <M>C</M> die Ecke oben hinten. Gegeben: Rotation, <M p=",">{t`\v v_A = (v, 0, v)`}</M> <M p=",">{t`\v v_B = (v_{Bx}, v, -v)`}</M> <M p=".">{t`\v v_E = \v 0`}</M> Gesucht: <M p=",">{t`\v\omega`}</M> <M p=",">{t`\v v_B`}</M> <M p=".">\mu</M></p>}
            en={<p>Figure: cube with edge <M p=";">a</M> <M p=",">{t`O \equiv A`}</M> <M>B</M> on the <M>x</M>-axis, <M>E</M> on the <M>y</M>-axis, <M>C</M> the top far corner. Given: rotation, <M p=",">{t`\v v_A = (v, 0, v)`}</M> <M p=",">{t`\v v_B = (v_{Bx}, v, -v)`}</M> <M p=".">{t`\v v_E = \v 0`}</M> Wanted: <M p=",">{t`\v\omega`}</M> <M p=",">{t`\v v_B`}</M> <M p=".">\mu</M></p>}
          />
          <T de={<p>Lösung im Skript (handschriftlich):</p>} en={<p>Solution in the notes (handwritten):</p>} />
          <MD>{t`\v v_A\cdot\v{AB} = \v v_B\cdot\v{AB}\colon\ v\,a = v_{Bx}\,a \ \Rightarrow\ v_{Bx} = v`}</MD>
          <MD>{t`\v v_A = \v\omega\times\v{EA}\colon\ \begin{pmatrix} v \\ 0 \\ -v \end{pmatrix} = \begin{pmatrix} \omega_x \\ \omega_y \\ \omega_z \end{pmatrix}\times\begin{pmatrix} 0 \\ -a \\ 0 \end{pmatrix} = \begin{pmatrix} a\,\omega_z \\ 0 \\ -a\,\omega_x \end{pmatrix} \ \Rightarrow\ \omega_z = \omega_x = \frac{v}{a}`}</MD>
          <MD>{t`\v v_B = \v\omega\times\v{EB}\colon\ \begin{pmatrix} v \\ v \\ -v \end{pmatrix} = \begin{pmatrix} v/a \\ \omega_y \\ v/a \end{pmatrix}\times\begin{pmatrix} a \\ -a \\ 0 \end{pmatrix} = \begin{pmatrix} v \\ v \\ -v - a\,\omega_y \end{pmatrix} \ \Rightarrow\ \omega_y = 0`}</MD>
          <MD>{t`\v\omega = \Big(\frac{v}{a}, 0, \frac{v}{a}\Big), \qquad \mu\colon\ (0, a, 0) + \lambda\,(a, 0, a)`}</MD>
        </Box>
        <T
          de={<p><b>Achtung:</b> Die Aufgabe nennt <M p=",">{t`\v v_A = (v, 0, v)`}</M> die Lösung rechnet mit <M p=".">{t`\v v_A = (v, 0, -v)`}</M> Nur mit dem Minus geht die Achse durch <M>C</M> – so wie die Figur sie rot einzeichnet. Vermutlich ist das Plus ein Tippfehler; wir rechnen wie die Lösung.</p>}
          en={<p><b>Careful:</b> the problem states <M p=",">{t`\v v_A = (v, 0, v)`}</M> the solution uses <M p=".">{t`\v v_A = (v, 0, -v)`}</M> Only with the minus does the axis pass through <M>C</M> – as the figure draws it in red. The plus is probably a typo; we calculate as the solution does.</p>}
        />
        <T
          de={<>
            <p><b>So liest man die Lösung:</b></p>
            <ol>
              <li><M>{t`v_{Bx}`}</M> kommt aus dem SdpG. <M>{t`\v{AB} = (a, 0, 0)`}</M> zeigt in <M>x</M>-Richtung, also vergleicht der SdpG nur die <M>x</M>-Anteile.</li>
              <li><M>E</M> ruht, also liegt <M>E</M> auf der Achse. Darum darf man <M>{t`\v r`}</M> von <M>E</M> aus messen: <M p=".">{t`\v v_A = \v\omega\times\v{EA}`}</M> Das Kreuzprodukt ausrechnen und Zeile für Zeile vergleichen gibt <M>{t`\omega_x`}</M> und <M p=".">{t`\omega_z`}</M></li>
              <li>Dasselbe mit <M>B</M> liefert die letzte Unbekannte <M p=".">{t`\omega_y`}</M></li>
              <li>Die Achse geht durch den ruhenden Punkt <M>E</M> in Richtung <M p=".">{t`\v\omega`}</M> Für <M>{t`\lambda = 1`}</M> erreicht man <M p=":">{t`(a, a, a) = C`}</M> <M>C</M> liegt auf der Achse und ruht auch.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the solution:</b></p>
            <ol>
              <li><M>{t`v_{Bx}`}</M> comes from the SdpG. <M>{t`\v{AB} = (a, 0, 0)`}</M> points in the <M>x</M>-direction, so the SdpG compares only the <M>x</M>-parts.</li>
              <li><M>E</M> is at rest, so <M>E</M> lies on the axis. That is why <M>{t`\v r`}</M> may be measured from <M p=":">E</M> <M p=".">{t`\v v_A = \v\omega\times\v{EA}`}</M> Working out the cross product and comparing line by line gives <M>{t`\omega_x`}</M> and <M p=".">{t`\omega_z`}</M></li>
              <li>The same with <M>B</M> gives the last unknown <M p=".">{t`\omega_y`}</M></li>
              <li>The axis passes through the point at rest <M>E</M> in the direction of <M p=".">{t`\v\omega`}</M> For <M>{t`\lambda = 1`}</M> one reaches <M p=":">{t`(a, a, a) = C`}</M> <M>C</M> lies on the axis and is at rest too.</li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Die Lösung Schritt für Schritt" en="The solution step by step" />}>
          <StepPlayer
            label={tr('Animation: Würfel, Rotation um die Achse durch E und C', 'Animation: cube, rotation about the axis through E and C')}
            steps={[
              { ms: 2000, holdMs: 3000, caption: <T
                de={<>Gegeben: <M>E</M> ruht, <M p=".">{t`\v v_A = (v, 0, -v)`}</M> Von <M>{t`\v v_B`}</M> kennt man nur die <M>y</M>- und <M>z</M>-Anteile (gestrichelt); <M>{t`v_{Bx}`}</M> ist gesucht.</>}
                en={<>Given: <M>E</M> is at rest, <M p=".">{t`\v v_A = (v, 0, -v)`}</M> Of <M>{t`\v v_B`}</M> only the <M>y</M>- and <M>z</M>-parts are known (dashed); <M>{t`v_{Bx}`}</M> is wanted.</>} /> },
              { ms: 4000, holdMs: 3000, caption: <T
                de={<>SdpG für <M>A</M> und <M p=":">B</M> Die <M>x</M>-Anteile (türkis) müssen gleich sein, also <M p=".">{t`v_{Bx} = v`}</M></>}
                en={<>SdpG for <M>A</M> and <M p=":">B</M> the <M>x</M>-parts (teal) must be equal, so <M p=".">{t`v_{Bx} = v`}</M></>} /> },
              { ms: 2500, holdMs: 3000, caption: <T
                de={<><M p=":">{t`\v v_A = \v\omega\times\v{EA}`}</M> Daraus <M p=".">{t`\omega_x = \omega_z = v/a`}</M> Bei <M>E</M> erscheinen die beiden Anteile <M>{t`\omega_x\,\v e_x`}</M> (blau) und <M>{t`\omega_z\,\v e_z`}</M> (grün).</>}
                en={<><M p=":">{t`\v v_A = \v\omega\times\v{EA}`}</M> this gives <M p=".">{t`\omega_x = \omega_z = v/a`}</M> At <M>E</M> the two parts <M>{t`\omega_x\,\v e_x`}</M> (blue) and <M>{t`\omega_z\,\v e_z`}</M> (green) appear.</>} /> },
              { ms: 2500, holdMs: 3000, caption: <T
                de={<><M p=":">{t`\v v_B = \v\omega\times\v{EB}`}</M> Daraus <M p=".">{t`\omega_y = 0`}</M> Ein Anteil in <M>y</M>-Richtung (orange) bleibt also nicht übrig.</>}
                en={<><M p=":">{t`\v v_B = \v\omega\times\v{EB}`}</M> this gives <M p=".">{t`\omega_y = 0`}</M> So no part in the <M>y</M>-direction (amber) is left.</>} /> },
              { ms: 3500, holdMs: 3000, caption: <T
                de={<><M>{t`\v\omega = \tfrac{v}{a}(1, 0, 1)`}</M> (violett) ist die Diagonale aus den beiden Anteilen. Die Achse <M>\mu</M> geht durch <M>E</M> in Richtung <M>{t`\v\omega`}</M> – und trifft genau die Ecke <M p=".">C</M></>}
                en={<><M>{t`\v\omega = \tfrac{v}{a}(1, 0, 1)`}</M> (purple) is the diagonal of the two parts. The axis <M>\mu</M> passes through <M>E</M> in the direction of <M>{t`\v\omega`}</M> – and hits exactly the corner <M p=".">C</M></>} /> },
              { ms: 4500, caption: <T
                de={<>Probe: Der Würfel dreht sich um <M p=".">\mu</M> <M>E</M> und <M>C</M> bleiben stehen; gestrichelt die Ausgangslage.</>}
                en={<>Check: the cube turns about <M p=".">\mu</M> <M>E</M> and <M>C</M> stay where they are; dashed: the starting position.</>} /> },
            ]}
          >
            {(step, tt) => <CubeAnim step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <details className="more">
          <summary><T de="Die erste Variante auf S. 19" en="The first variant on p. 19" /></summary>
          <T
            de={<p>Auf S. 19 steht vorher eine handschriftliche Variante mit <M p=".">{t`\v\omega = (0, 2\omega, \omega)`}</M> Sie bricht mitten in der Rechnung ab und passt nicht zur Figur: Eine Achse durch <M>E</M> in Richtung <M>{t`(0, 2, 1)`}</M> geht nicht durch <M p=".">C</M> Darum behandeln wir sie hier nicht (im Review-Log als offene Frage notiert).</p>}
            en={<p>Before this, p. 19 has a handwritten variant with <M p=".">{t`\v\omega = (0, 2\omega, \omega)`}</M> It stops in the middle of the calculation and does not match the figure: an axis through <M>E</M> in the direction <M>{t`(0, 2, 1)`}</M> does not pass through <M p=".">C</M> So we do not treat it here (noted as an open question in the review log).</p>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="missverstaendnisse" title={<T de="7. Häufige Missverständnisse" en="7. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Aussen dreht sich der Körper schneller.»" en="“Further out the body turns faster.”" />}>
          <T de={<>Nein. Alle Punkte drehen sich gleich schnell – <M>{t`\dot\varphi`}</M> ist überall gleich (Eigenschaft 3). Aussen ist nur die Schnelligkeit <M>{t`|\v v|`}</M> grösser, weil der Kreis grösser ist: <M p=".">{t`|\v v| = |\v\omega|\cdot\text{Abstand zur Achse}`}</M></>} en={<>No. All points turn equally fast – <M>{t`\dot\varphi`}</M> is the same everywhere (property 3). Further out only the speed <M>{t`|\v v|`}</M> is larger, because the circle is larger: <M p=".">{t`|\v v| = |\v\omega|\cdot\text{distance from the axis}`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M p=".">{t`|\v v| = |\v\omega|\cdot|\v r|`}</M>»</>} en={<>“<M p=".">{t`|\v v| = |\v\omega|\cdot|\v r|`}</M>”</>} />}>
          <T de={<>Nur wenn <M>{t`\v r`}</M> senkrecht auf der Achse steht. Allgemein zählt der Abstand zur Achse: <M p=".">{t`|\v v| = |\v\omega|\,|\v r|\sin\alpha = |\v\omega|\cdot|\v{AM}|`}</M></>} en={<>Only if <M>{t`\v r`}</M> is perpendicular to the axis. In general the distance from the axis counts: <M p=".">{t`|\v v| = |\v\omega|\,|\v r|\sin\alpha = |\v\omega|\cdot|\v{AM}|`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«In <M>{t`\v v = \v\omega\times\v r`}</M> darf man <M>{t`\v r`}</M> von irgendeinem Punkt aus messen.»</>} en={<>“In <M>{t`\v v = \v\omega\times\v r`}</M> one may measure <M>{t`\v r`}</M> from any point.”</>} />}>
          <T de={<>Nein, <M>O</M> muss auf der Achse liegen (S. 18). Sonst bekäme ein Punkt auf der Achse eine Geschwindigkeit – dabei ruht er.</>} en={<>No, <M>O</M> must lie on the axis (p. 18). Otherwise a point on the axis would get a velocity – yet it is at rest.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Ein ruhender Punkt genügt für eine Rotation.»" en="“One point at rest is enough for a rotation.”" />}>
          <T de={<>Nein, es braucht zwei. Mit nur einem ruhenden Punkt kann die Achse von Augenblick zu Augenblick wandern – das ist die <b>Kreiselung</b> (S. 20).</>} en={<>No, it takes two. With only one point at rest the axis can wander from instant to instant – that is <b>spinning motion</b> (<span lang="de">Kreiselung</span>, p. 20).</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="ausblick" title={<T de="8. Das Wichtigste" en="8. The essentials" />}>
        <Box kind="key">
          <T de={<>Rotation: zwei Punkte ruhen. Die Gerade durch sie ist die Achse <M p=".">\mu</M> Alle Punkte auf <M>\mu</M> ruhen, alle anderen fahren Kreise um <M>\mu</M> mit derselben Winkelschnelligkeit.</>} en={<>Rotation: two points are at rest. The line through them is the axis <M p=".">\mu</M> All points on <M>\mu</M> are at rest, all others travel on circles about <M>\mu</M> with the same angular speed.</>} />
          <MD>{t`\v v = \v\omega\times\v r, \quad \v\omega = \dot\varphi\,\v e_\mu \ (O \text{ ${tr('auf', 'on')} } \mu), \qquad |\v v_M| = |\v\omega|\cdot|\v{AM}|`}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Ein rollendes Rad ist in jedem Augenblick in Rotation um seine Berührlinie – eine <b>momentane Rotation</b> <Src p={20} />.</p>}
          en={<p className="connections"><b>Next:</b> a rolling wheel is at every instant in rotation about its line of contact – a <b>momentary rotation</b> <Src p={20} />.</p>}
        />
      </Section>
    </article>
  );
}
