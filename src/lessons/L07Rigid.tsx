import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { sdpgScene } from '../viz/anim/sdpgScene';
import { LadderDemo, SdpgDemo } from '../viz/RigidFigures';

const t = String.raw;

export default function L07Rigid() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bisher ging es um einen einzelnen Punkt. Ab jetzt bewegen sich ganze Körper. Ein <b>starrer</b> Körper verformt sich nie – und diese eine Eigenschaft verbindet die Geschwindigkeiten all seiner Punkte. Das erste Ergebnis daraus ist der <b>Satz der projizierten Geschwindigkeiten</b> (SdpG), ein Werkzeug, mit dem man viele Aufgaben in zwei Zeilen löst.</p>}
        en={<p className="lede">So far we dealt with a single point. From now on whole bodies move. A <b>rigid</b> body never deforms – and this one property ties together the velocities of all its points. The first result is the <b>theorem of projected velocities</b> (<em lang="de">Satz der projizierten Geschwindigkeiten</em>, SdpG), a tool that solves many problems in two lines.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Nimm einen Besenstiel in beide Hände und bewege ihn irgendwie: schieben, drehen, kippen. Die beiden Hände können ganz verschieden schnell sein und in verschiedene Richtungen gehen. Nur eines geht nicht: Sie können sich entlang des Stiels nicht näherkommen oder voneinander entfernen – der Stiel ist ja nicht zusammendrückbar. Also bewegen sich beide Enden <em>in Richtung des Stiels</em> genau gleich schnell. Das ist der ganze SdpG.</p>}
          en={<p>Hold a broomstick in both hands and move it any way you like: push, turn, tilt. The two hands can move at quite different speeds and in different directions. Only one thing is impossible: they cannot get closer or further apart along the stick – it cannot be compressed. So both ends move <em>along the stick</em> exactly equally fast. That is the whole SdpG.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="starr" title={<T de="1. Was «starr» bedeutet" en="1. What “rigid” means" />}>
        <Box kind="lecture" src={<Src p={12} fig="Fig. 3.1" />}>
          <T
            de={<ul>
              <li>Abstand zwischen 2 beliebigen Punkten konstant.</li>
              <li>Winkel zwischen Verbindungsvektoren konstant.</li>
              <li><M>\to</M> keine Gestaltänderung/Volumenänderung, keine Deformation.</li>
            </ul>}
            en={<ul>
              <li>The distance between any 2 points is constant.</li>
              <li>The angle between connecting vectors is constant.</li>
              <li><M>\to</M> no change of shape/volume, no deformation.</li>
            </ul>}
          />
          <MD>{t`\v a = \v{MM'}, \quad \v b = \v{MM''}; \qquad \text{i.A. } \v a(t_1) \ne \v a(t_2), \quad |\v a(t_1)| = |\v a(t_2)|, \quad \alpha(t_1) = \alpha(t_2)`}</MD>
          <MD>{t`\to\ \v a(t)\cdot\v b(t) = |\v a|\,|\v b|\cos\alpha \ \text{: konstant}`}</MD>
        </Box>
        <T
          de={<p className="keep">Die Pfeile <M>{t`\v a`}</M> und <M>{t`\v b`}</M> zwischen Punkten des Körpers dürfen sich drehen – sie zeigen später im Allgemeinen woanders hin. Aber ihre <b>Längen</b> und der <b>Winkel</b> zwischen ihnen bleiben gleich. Darum ist auch das Skalarprodukt <M>{t`\v a\cdot\v b = |\v a|\,|\v b|\cos\alpha`}</M> konstant (siehe <a href="#vektoren">Vektoren</a>), obwohl sich <M>{t`\v a`}</M> und <M>{t`\v b`}</M> selbst ändern. Die handschriftliche Notiz im Skript sagt genau das: <M>{t`\dot{\v a} \ne \v 0`}</M> und <M p=",">{t`\dot{\v b} \ne \v 0`}</M> aber <M p=".">{t`(\v a\cdot\v b)^{\cdot} = 0`}</M></p>}
          en={<p className="keep">The arrows <M>{t`\v a`}</M> and <M>{t`\v b`}</M> between points of the body may turn – in general they point elsewhere later. But their <b>lengths</b> and the <b>angle</b> between them stay the same. That is why the dot product <M>{t`\v a\cdot\v b = |\v a|\,|\v b|\cos\alpha`}</M> is constant (see <a href="#vektoren">Vectors</a>), although <M>{t`\v a`}</M> and <M>{t`\v b`}</M> themselves change. The handwritten note in the script says exactly this: <M>{t`\dot{\v a} \ne \v 0`}</M> and <M p=",">{t`\dot{\v b} \ne \v 0`}</M> but <M p=".">{t`(\v a\cdot\v b)^{\cdot} = 0`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="sdpg" title={<T de="2. Der Satz der projizierten Geschwindigkeiten" en="2. The theorem of projected velocities" />}>
        <Box kind="lecture" src={<Src p={12} />} title={<T de="Satz der projizierten Geschwindigkeiten (SdpG)" en={<>Theorem of projected velocities (<span lang="de">Satz der projizierten Geschwindigkeiten</span>, SdpG)</>} />}>
          <T
            de={<p>Die Geschwindigkeiten <M>{t`\v v_M, \v v_N`}</M> zweier beliebiger Punkte <M>M</M> und <M>N</M> eines starren Körpers weisen zu allen Zeiten gleiche Projektionen <M>{t`\v v'_M = \v v'_N`}</M> in Richtung ihrer Verbindungsgeraden <M>{t`MN`}</M> auf.</p>}
            en={<p>The velocities <M>{t`\v v_M, \v v_N`}</M> of any two points <M>M</M> and <M>N</M> of a rigid body have, at all times, equal projections <M>{t`\v v'_M = \v v'_N`}</M> in the direction of their connecting line <M p=".">{t`MN`}</M></p>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So liest man den Satz:</b> Zeichne die Gerade durch <M>M</M> und <M p=".">N</M> Fälle von der Spitze jedes Geschwindigkeitspfeils das Lot auf diese Gerade. Die Stücke von <M>M</M> bzw. <M>N</M> bis zum Lotfusspunkt («Schatten», siehe <a href="#vektoren">Vektoren</a>) sind gleich lang und zeigen in dieselbe Richtung. Senkrecht zur Geraden dürfen sich die beiden Geschwindigkeiten beliebig unterscheiden – das ist die Drehung des Körpers. Der Strich in <M>{t`\v v'_M`}</M> heisst hier «Projektion», nicht «Ableitung».</p>}
          en={<p className="keep"><b>How to read the theorem:</b> draw the line through <M>M</M> and <M p=".">N</M> Drop a perpendicular from the tip of each velocity arrow onto this line. The pieces from <M>M</M> and <M>N</M> to the feet of the perpendiculars (“shadows”, see <a href="#vektoren">Vectors</a>) are equally long and point the same way. Perpendicular to the line the two velocities may differ arbitrarily – that is the turning of the body. The prime in <M>{t`\v v'_M`}</M> means “projection” here, not “derivative”.</p>}
        />
        <SdpgDemo />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="beweis" title={<T de="3. Der Beweis" en="3. The proof" />}>
        <Box kind="lecture" src={<Src p={12} />} title={<T de="Beweis des SdpG" en={<>Proof of the SdpG (<span lang="de">Beweis des SdpG</span>)</>} />}>
          <MD>{t`\v a\cdot\v a = \text{konst.} \ \to\ (\v a\cdot\v a)^{\cdot} = 0`}</MD>
          <MD>{t`\v a\cdot\dot{\v a} + \dot{\v a}\cdot\v a = 2\,(\v a\cdot\dot{\v a}) = 0, \qquad \v a, \dot{\v a} \ne \v 0`}</MD>
          <MD>{t`\v a = \v r_N - \v r_M, \qquad \dot{\v a} = \v v_N - \v v_M, \qquad \v a\cdot(\v v_N - \v v_M) = 0`}</MD>
          <MD>{t`\v v_N\cdot\v a = \v v_M\cdot\v a \ \to\ \v v'_N = \v v'_M`}</MD>
        </Box>
        <Derivation title={<T de="der Beweis im Bild" en="the proof in pictures" />}>
          <StepPlayer
            label={tr('Animation: Beweis des SdpG', 'Animation: proof of the SdpG')}
            steps={[
              { ms: 4000, holdMs: 2500, caption: <T
                de={<>Ein starrer Körper mit zwei Punkten <M>M</M> und <M p=".">N</M> Der Pfeil <M>{t`\v a = \v r_N - \v r_M`}</M> verbindet sie. Etwas später (gestrichelt) hat sich <M>{t`\v a`}</M> gedreht, ist aber gleich lang: <M p=".">{t`\v a\cdot\v a = |\v a|^2 = \text{konst.}`}</M></>}
                en={<>A rigid body with two points <M>M</M> and <M p=".">N</M> The arrow <M>{t`\v a = \v r_N - \v r_M`}</M> joins them. A little later (dashed) <M>{t`\v a`}</M> has turned but is just as long: <M p=".">{t`\v a\cdot\v a = |\v a|^2 = \text{const}`}</M></>} /> },
              { ms: 3000, holdMs: 2500, caption: <T
                de={<>Die Geschwindigkeiten <M>{t`\v v_M`}</M> und <M>{t`\v v_N`}</M> (rot). Sie sind verschieden – in Grösse und Richtung.</>}
                en={<>The velocities <M>{t`\v v_M`}</M> and <M>{t`\v v_N`}</M> (red). They differ – in size and direction.</>} /> },
              { ms: 3500, holdMs: 3000, caption: <T
                de={<>Ihre Schatten auf die Gerade <M>{t`MN`}</M> (türkis) sind trotzdem gleich lang. Das ist die Aussage des SdpG. Warum?</>}
                en={<>Their shadows on the line <M>{t`MN`}</M> (teal) are nevertheless equally long. That is the statement of the SdpG. Why?</>} /> },
              { ms: 4000, holdMs: 3000, caption: <T
                de={<>Wie schnell sich <M>{t`\v a`}</M> ändert, ist <M p=".">{t`\dot{\v a} = \v v_N - \v v_M`}</M> Im Bild: <M>{t`\v v_M`}</M> nach <M>N</M> verschoben (grau), der violette Pfeil ergänzt bis <M p=".">{t`\v v_N`}</M> Weil <M>{t`|\v a|`}</M> sich nicht ändern darf, kann <M>{t`\v a`}</M> sich nur drehen: Die Änderung steht <b>senkrecht</b> auf <M p=".">{t`\v a`}</M></>}
                en={<>How fast <M>{t`\v a`}</M> changes is <M p=".">{t`\dot{\v a} = \v v_N - \v v_M`}</M> In the figure: <M>{t`\v v_M`}</M> moved to <M>N</M> (grey), the purple arrow completes it to <M p=".">{t`\v v_N`}</M> Since <M>{t`|\v a|`}</M> must not change, <M>{t`\v a`}</M> can only turn: the change is <b>perpendicular</b> to <M p=".">{t`\v a`}</M></>} /> },
              { ms: 3000, caption: <T
                de={<>Senkrecht heisst Skalarprodukt null: <M p=".">{t`\v a\cdot(\v v_N - \v v_M) = 0`}</M> Ausmultipliziert: <M p=":">{t`\v a\cdot\v v_N = \v a\cdot\v v_M`}</M> gleiche Schatten auf <M p=".">{t`\v a`}</M></>}
                en={<>Perpendicular means zero dot product: <M p=".">{t`\v a\cdot(\v v_N - \v v_M) = 0`}</M> Multiplied out: <M p=":">{t`\v a\cdot\v v_N = \v a\cdot\v v_M`}</M> equal shadows on <M p=".">{t`\v a`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={sdpgScene} step={step} t={tt} />}
          </StepPlayer>
          <T
            de={<>
              <p><b>So liest man den Beweis im Skript:</b></p>
              <ol>
                <li><M>{t`\v a\cdot\v a`}</M> ist die quadrierte Länge, also konstant. Eine Konstante hat Ableitung null.</li>
                <li>Produktregel für das Skalarprodukt: <M p=".">{t`(\v a\cdot\v a)^{\cdot} = \dot{\v a}\cdot\v a + \v a\cdot\dot{\v a} = 2\,\v a\cdot\dot{\v a}`}</M> Also <M p=":">{t`\v a\cdot\dot{\v a} = 0`}</M> Änderung senkrecht zum Pfeil.</li>
                <li><M>{t`\v a = \v r_N - \v r_M`}</M> abgeleitet gibt <M p=".">{t`\dot{\v a} = \v v_N - \v v_M`}</M> Einsetzen und ausmultiplizieren ergibt den Satz.</li>
              </ol>
              <p>Der Zusatz <M>{t`\v a, \dot{\v a} \ne \v 0`}</M> im Skript sagt: Aus <M>{t`\v a\cdot\dot{\v a} = 0`}</M> folgt <em>nicht</em> <M p=";">{t`\dot{\v a} = \v 0`}</M> die beiden stehen nur senkrecht aufeinander.</p>
            </>}
            en={<>
              <p><b>How to read the proof in the notes:</b></p>
              <ol>
                <li><M>{t`\v a\cdot\v a`}</M> is the squared length, hence constant. A constant has derivative zero.</li>
                <li>Product rule for the dot product: <M p=".">{t`(\v a\cdot\v a)^{\cdot} = \dot{\v a}\cdot\v a + \v a\cdot\dot{\v a} = 2\,\v a\cdot\dot{\v a}`}</M> So <M p=":">{t`\v a\cdot\dot{\v a} = 0`}</M> the change is perpendicular to the arrow.</li>
                <li>Differentiating <M>{t`\v a = \v r_N - \v r_M`}</M> gives <M p=".">{t`\dot{\v a} = \v v_N - \v v_M`}</M> Substituting and multiplying out gives the theorem.</li>
              </ol>
              <p>The remark <M>{t`\v a, \dot{\v a} \ne \v 0`}</M> in the notes says: <M>{t`\v a\cdot\dot{\v a} = 0`}</M> does <em>not</em> imply <M p=";">{t`\dot{\v a} = \v 0`}</M> the two are only perpendicular.</p>
            </>}
          />
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="leiter" title={<T de="4. Beispiel: die gleitende Leiter" en="4. Example: the sliding ladder" />}>
        <Box kind="lecture" src={<Src p={13} />}>
          <T de={<>Leiter der Länge <M p=".">L</M> <M>A</M> gleitet am Boden, <M>B</M> gleitet an der Wand; die Leiter bewegt sich nach oben. Gegeben <M p=",">{t`L, \alpha`}</M> <M p=".">{t`\dot s_A = v_H`}</M></>} en={<>Ladder of length <M p=".">L</M> <M>A</M> slides on the floor, <M>B</M> slides on the wall; the ladder moves up. Given <M p=",">{t`L, \alpha`}</M> <M p=".">{t`\dot s_A = v_H`}</M></>} />
          <MD>{t`\text{SdpG: } \v v_A\cdot\v{AB} = \v v_B\cdot\v{AB}: \quad \begin{pmatrix} v_H \\ 0 \\ 0 \end{pmatrix}\cdot\begin{pmatrix} L\cos\alpha \\ L\sin\alpha \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ v_V \\ 0 \end{pmatrix}\cdot\begin{pmatrix} L\cos\alpha \\ L\sin\alpha \\ 0 \end{pmatrix}`}</MD>
          <MD>{t`\Rightarrow\ v_H\,L\cos\alpha = v_V\,L\sin\alpha \ \Rightarrow\ v_V = v_H\,\frac{\cos\alpha}{\sin\alpha} = v_H\cot\alpha`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Lösung:</b></p>
            <ol className="keep">
              <li>Die Richtungen kennt man schon aus der Situation: <M>A</M> kann nur waagrecht gleiten, <M>B</M> nur senkrecht. Also <M>{t`\v v_A = (v_H, 0, 0)`}</M> und <M p=";">{t`\v v_B = (0, v_V, 0)`}</M> unbekannt ist nur <M p=".">{t`v_V`}</M></li>
              <li>Beide Punkte gehören zur starren Leiter, also gilt der SdpG entlang <M p=".">{t`\v{AB} = (L\cos\alpha, L\sin\alpha, 0)`}</M></li>
              <li>Skalarprodukte ausrechnen, <M>L</M> kürzen, nach <M>{t`v_V`}</M> auflösen.</li>
            </ol>
            <p><b>Was das Ergebnis sagt:</b> Steht die Leiter fast senkrecht (<M>\alpha</M> nahe bei <M p="),">{t`90^\circ`}</M> ist <M>{t`\cot\alpha`}</M> klein: <M>B</M> bewegt sich kaum. Liegt sie fast flach, muss <M>B</M> sehr schnell steigen. Bei <M>{t`\alpha = 45^\circ`}</M> ist <M>{t`\cot\alpha = 1`}</M> – beide Enden sind gleich schnell.</p>
            <p>Die Figur im Skript nennt den Winkel am Boden <M p=",">\varphi</M> die Rechnung <M>\alpha</M> – es ist derselbe Winkel.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the solution:</b></p>
            <ol className="keep">
              <li>The directions are known from the situation: <M>A</M> can only slide horizontally, <M>B</M> only vertically. So <M>{t`\v v_A = (v_H, 0, 0)`}</M> and <M p=";">{t`\v v_B = (0, v_V, 0)`}</M> only <M>{t`v_V`}</M> is unknown.</li>
              <li>Both points belong to the rigid ladder, so the SdpG holds along <M p=".">{t`\v{AB} = (L\cos\alpha, L\sin\alpha, 0)`}</M></li>
              <li>Compute the dot products, cancel <M p=",">L</M> solve for <M p=".">{t`v_V`}</M></li>
            </ol>
            <p><b>What the result says:</b> if the ladder stands almost upright (<M>\alpha</M> close to <M p="),">{t`90^\circ`}</M> <M>{t`\cot\alpha`}</M> is small: <M>B</M> hardly moves. If it lies almost flat, <M>B</M> has to climb very fast. At <M>{t`\alpha = 45^\circ`}</M> we have <M>{t`\cot\alpha = 1`}</M> – both ends are equally fast.</p>
            <p>The figure in the notes calls the angle at the floor <M p=",">\varphi</M> the calculation <M>\alpha</M> – it is the same angle.</p>
          </>}
        />
        <LadderDemo />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section long id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Im starren Körper haben alle Punkte dieselbe Geschwindigkeit.»" en="“In a rigid body all points have the same velocity.”" />}>
          <T de={<>Nein – nur die <em>Projektionen</em> auf die Verbindungsgerade sind gleich. Dreht sich der Körper, sind die Geschwindigkeiten verschieden (Leiter: <M>A</M> waagrecht, <M>B</M> senkrecht). Gleiche Geschwindigkeit überall gibt es nur bei der <a href="#translation">Translation</a>.</>} en={<>No – only the <em>projections</em> onto the connecting line are equal. If the body turns, the velocities differ (ladder: <M>A</M> horizontal, <M>B</M> vertical). The same velocity everywhere happens only in <a href="#translation">translation</a>.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Die Projektionen sind in jeder Richtung gleich.»" en="“The projections are equal in every direction.”" />}>
          <T de={<>Nur in Richtung der Verbindungsgeraden <M p=".">{t`MN`}</M> Senkrecht dazu dürfen sie verschieden sein – im Bild oben sieht man das an den roten Pfeilen.</>} en={<>Only along the connecting line <M p=".">{t`MN`}</M> Perpendicular to it they may differ – visible in the red arrows above.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Der SdpG gilt für jeden Körper.»" en="“The SdpG holds for any body.”" />}>
          <T de={<>Nur für starre. Schalte oben «Körper dehnt sich» ein: Sobald sich der Abstand <M>{t`|\v a|`}</M> ändert, sind die Projektionen verschieden.</>} en={<>Only for rigid ones. Switch on “body stretches” above: as soon as the distance <M>{t`|\v a|`}</M> changes, the projections differ.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <MD>{t`\text{${tr('starr', 'rigid')}: } |\v a| = \text{${tr('konst.', 'const.')}} \ \Rightarrow\ \v a\cdot(\v v_N - \v v_M) = 0 \ \Rightarrow\ \v v_M\cdot\v{MN} = \v v_N\cdot\v{MN}`}</MD>
          <T de="Rezept für Aufgaben: Richtungen der Geschwindigkeiten aus der Situation ablesen, SdpG entlang der Verbindungsgeraden ansetzen, nach der Unbekannten auflösen." en="Recipe for problems: read the directions of the velocities off the situation, apply the SdpG along the connecting line, solve for the unknown." />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Ist <M>{t`\v a`}</M> nicht nur gleich lang, sondern auch gleich gerichtet, bewegen sich alle Punkte gleich – die <b>Translation</b> <Src p={13} />. Der SdpG wird ausserdem der Schlüssel im Beweis, dass eine Rotation aus Kreisbewegungen besteht <Src p={16} />.</p>}
          en={<p className="connections"><b>Next:</b> if <M>{t`\v a`}</M> keeps not only its length but also its direction, all points move alike – <b>translation</b> <Src p={13} />. The SdpG is also the key in the proof that a rotation consists of circular motions <Src p={16} />.</p>}
        />
      </Section>
    </article>
  );
}
