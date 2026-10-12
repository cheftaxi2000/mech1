import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { genScene } from '../viz/anim/genScene';
import { CubeGenAnim } from '../viz/anim/CubeGenAnim';
import { FieldDemo, RideDemo } from '../viz/GeneralFigures';

const t = String.raw;

export default function L12General() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Jetzt darf sich alles bewegen – kein Punkt muss mehr ruhen. Das Skript zeigt: Jede Bewegung eines starren Körpers besteht in jedem Augenblick aus zwei einfachen Teilen, einer <b>Translation</b> und einer <b>Kreiselung</b>. Daraus folgt die wichtigste Formel des Kapitels, die <b>Grundgleichung</b> <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M></p>}
        en={<p className="lede">Now everything may move – no point has to be at rest any more. The notes show: every motion of a rigid body consists at each instant of two simple parts, a <b>translation</b> and a <b>spinning motion</b> (<span lang="de">Kreiselung</span>). From this follows the most important formula of the chapter, the <b>fundamental equation</b> (<span lang="de">Grundgleichung</span>) <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M></p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Wirf einen Frisbee: Er fliegt und dreht sich zugleich. Stell dir vor, du sitzt auf einem Punkt <M>B</M> des Frisbees und fliegst mit, ohne dich mitzudrehen. Von dort aus siehst du nur noch, wie sich die Scheibe um dich dreht. Jede Bewegung ist also: die Bewegung von <M>B</M> (für alle Punkte gleich) plus eine Drehung um <M p=".">B</M></p>}
          en={<p>Throw a frisbee: it flies and turns at the same time. Imagine you sit on a point <M>B</M> of the frisbee and fly along without turning yourself. From there you only see the disc turning about you. So every motion is: the motion of <M>B</M> (the same for all points) plus a turning about <M p=".">B</M></p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="zerlegung" title={<T de="1. Translation plus Kreiselung" en="1. Translation plus spinning motion" />}>
        <Box kind="lecture" src={<Src p={22} />} title={<T de="Allgemeinste Bewegung" en={<>Most general motion (<span lang="de">Allgemeinste Bewegung</span>)</>} />}>
          <T
            de={<>
              <p><M p=";">{t`\v r_M = \v r_B + \v\rho`}</M> <M p=";">{t`\dot{\v r}_M = \v v_M = \v v_B + \dot{\v\rho}`}</M> <M p=":">{t`\dot{\v\rho}`}</M> Geschwindigkeit von <M>M</M> bezüglich <M p=".">B</M></p>
              <p><M>B</M> als Bezugspunkt auf <M p=":">K</M> bez. <M>B</M> führen alle Punkte eine Kreiselung aus; <M p=":">{t`\v\omega^*`}</M> Winkelgeschwindigkeit der Kreiselung um <M p=".">B</M></p>
              <MD>{t`\dot{\v\rho} = \v v^*_M = \v\omega^*\times\v\rho = \v\omega^*\times\v{BM}, \qquad \v v_M = \v v_B + \v\omega^*\times\v{BM}`}</MD>
            </>}
            en={<>
              <p><M p=";">{t`\v r_M = \v r_B + \v\rho`}</M> <M p=";">{t`\dot{\v r}_M = \v v_M = \v v_B + \dot{\v\rho}`}</M> <M p=":">{t`\dot{\v\rho}`}</M> velocity of <M>M</M> relative to <M p=".">B</M></p>
              <p><M>B</M> as reference point on <M p=":">K</M> relative to <M>B</M> all points perform a spinning motion; <M p=":">{t`\v\omega^*`}</M> angular velocity of the spinning motion about <M p=".">B</M></p>
              <MD>{t`\dot{\v\rho} = \v v^*_M = \v\omega^*\times\v\rho = \v\omega^*\times\v{BM}, \qquad \v v_M = \v v_B + \v\omega^*\times\v{BM}`}</MD>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>K</M> ist der Körper, <M>B</M> einer seiner Punkte, den man als <b>Bezugspunkt</b> wählt. <M>{t`\v\rho = \v{BM}`}</M> zeigt von <M>B</M> nach <M p=".">M</M> Also <M p=".">{t`\v r_M = \v r_B + \v\rho`}</M></li>
              <li>Ableiten nach der Zeit: <M p=".">{t`\v v_M = \v v_B + \dot{\v\rho}`}</M> <M>{t`\dot{\v\rho}`}</M> ist die Geschwindigkeit, die <M>M</M> hat, wenn man mit <M>B</M> mitfährt («bezüglich <M p="»).">B</M></li>
              <li>Für den Mitfahrer ruht <M p=",">B</M> und <M>{t`|\v\rho|`}</M> bleibt gleich (starrer Körper). Wichtig: Er fährt mit, <em>ohne sich mitzudrehen</em>; darum sieht er dasselbe <M>{t`\dot{\v\rho}`}</M> wie wir. Für ihn ruht ein Punkt des Körpers: eine Kreiselung um <M>B</M> (S. 20). Eine Kreiselung ist eine momentane Rotation, <M>{t`\v v = \v\omega\times\v r`}</M> mit <M>{t`\v r`}</M> vom ruhenden Punkt aus (S. 21). Hier ist das <M p=",">B</M> also <M p=".">{t`\dot{\v\rho} = \v\omega^*\times\v\rho`}</M> <M>{t`\v\omega^*`}</M> ist die Winkelgeschwindigkeit dieser Kreiselung; das Skript nennt <M>{t`\dot{\v\rho}`}</M> auch <M p=".">{t`\v v^*_M`}</M></li>
              <li>Zusammen: <M p=".">{t`\v v_M = \v v_B + \v\omega^*\times\v{BM}`}</M> Der erste Teil ist für alle Punkte gleich (Translation), der zweite ist eine Drehung um <M>B</M> (Kreiselung).</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li><M>K</M> is the body, <M>B</M> one of its points, chosen as the <b>reference point</b>. <M>{t`\v\rho = \v{BM}`}</M> points from <M>B</M> to <M p=".">M</M> So <M p=".">{t`\v r_M = \v r_B + \v\rho`}</M></li>
              <li>Differentiate with respect to time: <M p=".">{t`\v v_M = \v v_B + \dot{\v\rho}`}</M> <M>{t`\dot{\v\rho}`}</M> is the velocity <M>M</M> has when you ride along with <M>B</M> (“relative to <M p="”).">B</M></li>
              <li>For the rider <M>B</M> is at rest and <M>{t`|\v\rho|`}</M> stays the same (rigid body). Important: the rider moves along <em>without turning</em>, so they see the same <M>{t`\dot{\v\rho}`}</M> as we do. For them one point of the body is at rest: a spinning motion about <M>B</M> (p. 20). A spinning motion is a momentary rotation, <M>{t`\v v = \v\omega\times\v r`}</M> with <M>{t`\v r`}</M> from the point at rest (p. 21). Here that is <M p=",">B</M> so <M p=".">{t`\dot{\v\rho} = \v\omega^*\times\v\rho`}</M> <M>{t`\v\omega^*`}</M> is the angular velocity of this spinning motion; the notes also call <M>{t`\dot{\v\rho}`}</M> <M p=".">{t`\v v^*_M`}</M></li>
              <li>Together: <M p=".">{t`\v v_M = \v v_B + \v\omega^*\times\v{BM}`}</M> The first part is the same for all points (translation), the second is a turning about <M>B</M> (spinning motion).</li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Die Zerlegung Schritt für Schritt" en="The decomposition step by step" />}>
          <StepPlayer
            label={tr('Animation: allgemeine Bewegung einer Platte, Zerlegung in Translation und Drehung', 'Animation: general motion of a plate, split into translation and turning')}
            steps={[
              { ms: 4000, holdMs: 2500, caption: <T
                de={<>Eine Platte bewegt sich in ihrer Ebene: Sie verschiebt sich und dreht sich zugleich. Gestrichelt: wo sie am Anfang war, und die Bahnen von <M>B</M> und <M>M</M> (Ringe: wo sie anfangen).</>}
                en={<>A plate moves in its plane: it shifts and turns at the same time. Dashed: where it was at the start, and the paths of <M>B</M> and <M>M</M> (rings: where they begin).</>} /> },
              { ms: 3000, holdMs: 3000, caption: <T
                de={<>In einem Augenblick: <M>{t`\v r_B`}</M> zeigt von <M>O</M> nach <M p=",">B</M> <M>{t`\v\rho = \v{BM}`}</M> von <M>B</M> nach <M p=".">M</M> Also <M p=".">{t`\v r_M = \v r_B + \v\rho`}</M></>}
                en={<>At one instant: <M>{t`\v r_B`}</M> points from <M>O</M> to <M p=",">B</M> <M>{t`\v\rho = \v{BM}`}</M> from <M>B</M> to <M p=".">M</M> So <M p=".">{t`\v r_M = \v r_B + \v\rho`}</M></>} /> },
              { ms: 3500, holdMs: 3500, caption: <T
                de={<>Ableiten: <M p=".">{t`\v v_M = \v v_B + \dot{\v\rho}`}</M> Grau: <M p=",">{t`\v v_B`}</M> zu <M>M</M> verschoben; violett: <M p=",">{t`\dot{\v\rho}`}</M> die Geschwindigkeit von <M>M</M> bezüglich <M p=".">B</M></>}
                en={<>Differentiate: <M p=".">{t`\v v_M = \v v_B + \dot{\v\rho}`}</M> Grey: <M p=",">{t`\v v_B`}</M> moved to <M p=";">M</M> purple: <M p=",">{t`\dot{\v\rho}`}</M> the velocity of <M>M</M> relative to <M p=".">B</M></>} /> },
              { ms: 4500, holdMs: 3500, caption: <T
                de={<>Fährt man mit <M>B</M> mit, dreht sich die Platte nur um <M p=":">B</M> <M>M</M> läuft auf einem Kreis um <M p=".">B</M> Das ist eine Kreiselung um <M p=",">B</M> also <M p=".">{t`\dot{\v\rho} = \v\omega^*\times\v\rho`}</M></>}
                en={<>Riding along with <M p=",">B</M> the plate only turns about <M p=":">B</M> <M>M</M> runs on a circle about <M p=".">B</M> This is a spinning motion about <M p=",">B</M> so <M p=".">{t`\dot{\v\rho} = \v\omega^*\times\v\rho`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Zusammen: <M p=".">{t`\v v_M = \v v_B + \v\omega^*\times\v{BM}`}</M> Grau der Translationsteil (für alle Punkte gleich), violett der Drehteil.</>}
                en={<>Together: <M p=".">{t`\v v_M = \v v_B + \v\omega^*\times\v{BM}`}</M> Grey the translation part (the same for all points), purple the turning part.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={genScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>In der Ebene ist die Kreiselung um <M>B</M> eine Drehung um die Achse durch <M>B</M> senkrecht zur Ebene; das Zeichen <M>\odot</M> heisst: <M>{t`\v\omega^*`}</M> zeigt aus dem Bild heraus. Im Raum läuft <M>M</M> auf einer Kugel um <M p=",">B</M> und die Achse darf in jede Richtung zeigen.</p>}
          en={<p>In the plane, the spinning motion about <M>B</M> is a turning about the axis through <M>B</M> perpendicular to the plane; the sign <M>\odot</M> means: <M>{t`\v\omega^*`}</M> points out of the page. In space, <M>M</M> moves on a sphere about <M p=",">B</M> and the axis may point in any direction.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="bezugspunkt" title={<T de={<>2. <M>{t`\v\omega`}</M> ist für alle Bezugspunkte gleich</>} en={<>2. <M>{t`\v\omega`}</M> is the same for every reference point</>} />}>
        <Box kind="lecture" src={<Src p={22} />}>
          <T
            de={<p>Anderer Bezugspunkt <M p=":">C</M> <M p=".">{t`\v v_M = \v v_C + \v\omega^{**}\times\v{CM}`}</M> <b>Behauptung:</b> <M>{t`\v\omega^* = \v\omega^{**} = \v\omega`}</M> (gleich für alle Bezugspunkte).</p>}
            en={<p>Another reference point <M p=":">C</M> <M p=".">{t`\v v_M = \v v_C + \v\omega^{**}\times\v{CM}`}</M> <b>Claim:</b> <M>{t`\v\omega^* = \v\omega^{**} = \v\omega`}</M> (the same for all reference points).</p>}
          />
          <MD>{t`\begin{aligned}
&\v v_B + \v\omega^*\times\v{BM} = \v v_C + \v\omega^{**}\times\v{CM}\\
&\v v_B + \v\omega^*\times(\v{BC} + \v{CM}) = \dots\\
&\v v_B + \v\omega^*\times\v{BC} + \v\omega^*\times\v{CM} = \v v_C + \v\omega^{**}\times\v{CM} = \v v_B + \v\omega^*\times\v{BC} + \v\omega^{**}\times\v{CM}
\end{aligned}`}</MD>
          <T
            de={<p><M>{t`\to\ \v\omega^* = \v\omega^{**}`}</M> da <M p=",">B</M> <M p=",">C</M> <M>M</M> beliebig.</p>}
            en={<p><M>{t`\to\ \v\omega^* = \v\omega^{**}`}</M> since <M p=",">B</M> <M p=",">C</M> <M>M</M> are arbitrary.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Rechnung:</b></p>
            <ol>
              <li>Dieselbe Geschwindigkeit <M>{t`\v v_M`}</M> zweimal geschrieben: einmal mit <M>B</M> als Bezugspunkt, einmal mit <M p=".">C</M> Ob die beiden <M>\omega</M> gleich sind, weiss man noch nicht – darum heissen sie <M>{t`\v\omega^*`}</M> und <M p=".">{t`\v\omega^{**}`}</M></li>
              <li>Der Weg von <M>B</M> nach <M>M</M> geht auch über <M p=":">C</M> <M p=".">{t`\v{BM} = \v{BC} + \v{CM}`}</M> Das Kreuzprodukt darf man ausmultiplizieren: <M p=".">{t`\v\omega^*\times(\v{BC} + \v{CM}) = \v\omega^*\times\v{BC} + \v\omega^*\times\v{CM}`}</M></li>
              <li>Für <M>{t`\v v_C`}</M> setzt man die Formel mit <M>B</M> ein (mit <M p=")">{t`M = C`}</M> <M p=".">{t`\v v_C = \v v_B + \v\omega^*\times\v{BC}`}</M></li>
              <li>Links und rechts steht jetzt <M p=".">{t`\v v_B + \v\omega^*\times\v{BC}`}</M> Es fällt weg, und übrig bleibt <M p=".">{t`\v\omega^*\times\v{CM} = \v\omega^{**}\times\v{CM}`}</M></li>
              <li>Alles auf eine Seite: <M p=".">{t`(\v\omega^* - \v\omega^{**})\times\v{CM} = \v 0`}</M> Ein Kreuzprodukt ist null, wenn die beiden Vektoren parallel sind (oder einer null ist). Das gilt für jeden Punkt <M p=",">M</M> also müsste der Unterschied zu jedem <M>{t`\v{CM}`}</M> parallel sein – auch zu zwei nicht parallelen. Das schafft nur der Nullvektor: <M p=".">{t`\v\omega^* = \v\omega^{**}`}</M></li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the calculation:</b></p>
            <ol>
              <li>The same velocity <M>{t`\v v_M`}</M> written twice: once with <M>B</M> as the reference point, once with <M p=".">C</M> Whether the two <M>\omega</M> are equal is not known yet – so they are called <M>{t`\v\omega^*`}</M> and <M p=".">{t`\v\omega^{**}`}</M></li>
              <li>The way from <M>B</M> to <M>M</M> can also pass through <M p=":">C</M> <M p=".">{t`\v{BM} = \v{BC} + \v{CM}`}</M> The cross product may be multiplied out: <M p=".">{t`\v\omega^*\times(\v{BC} + \v{CM}) = \v\omega^*\times\v{BC} + \v\omega^*\times\v{CM}`}</M></li>
              <li>For <M>{t`\v v_C`}</M> insert the formula with <M>B</M> (with <M p=")">{t`M = C`}</M> <M p=".">{t`\v v_C = \v v_B + \v\omega^*\times\v{BC}`}</M></li>
              <li>Both sides now contain <M p=".">{t`\v v_B + \v\omega^*\times\v{BC}`}</M> It cancels, leaving <M p=".">{t`\v\omega^*\times\v{CM} = \v\omega^{**}\times\v{CM}`}</M></li>
              <li>Everything on one side: <M p=".">{t`(\v\omega^* - \v\omega^{**})\times\v{CM} = \v 0`}</M> A cross product is zero when the two vectors are parallel (or one of them is zero). This holds for every point <M p=",">M</M> so the difference would have to be parallel to every <M p=",">{t`\v{CM}`}</M> including two non-parallel ones. Only the zero vector manages that: <M p=".">{t`\v\omega^* = \v\omega^{**}`}</M></li>
            </ol>
          </>}
        />
        <T
          de={<p><b>Anschaulich:</b> Fährt man mit <M>B</M> mit, sieht man die Platte um <M>B</M> drehen; fährt man mit <M>C</M> mit, um <M p=".">C</M> Der Winkel, um den sie sich dreht, ist aber in beiden Fällen derselbe – also auch die Winkelgeschwindigkeit. Probiere es aus:</p>}
          en={<p><b>Intuitively:</b> riding along with <M p=",">B</M> you see the plate turning about <M p=";">B</M> riding along with <M p=",">C</M> about <M p=".">C</M> But the angle by which it turns is the same in both cases – and so is the angular velocity. Try it:</p>}
        />
        <RideDemo />
        <T
          de={<p>Ein Detail zu «da <M p=",">B</M> <M p=",">C</M> <M>M</M> beliebig»: Bei einem echten Körper gibt es immer zwei Punkte <M>M</M> mit nicht parallelen <M p=".">{t`\v{CM}`}</M> Bei einem unendlich dünnen Stab nicht – dort sieht man eine Drehung um den Stab selbst gar nicht.</p>}
          en={<p>A detail about “since <M p=",">B</M> <M p=",">C</M> <M>M</M> are arbitrary”: a real body always has two points <M>M</M> with non-parallel <M p=".">{t`\v{CM}`}</M> An infinitely thin rod does not – a turning about the rod itself cannot be seen at all.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="grundgleichung" title={<T de="3. Die Grundgleichung" en="3. The fundamental equation" />}>
        <Box kind="lecture" src={<Src p={22} />} title={<T de="Grundgleichung des Bewegungszustandes" en={<>Fundamental equation of the state of motion (<span lang="de">Grundgleichung des Bewegungszustandes</span>)</>} />}>
          <MD>{t`\v v_M = \v v_B + \v\omega\times\v{BM} \qquad \forall\ M, B \in K`}</MD>
          <T
            de={<p>Aus <M p=",">{t`\v v_P`}</M> <M>{t`\v\omega \ \Rightarrow`}</M> Geschwindigkeit in jedem Punkt berechnen.</p>}
            en={<p>From <M p=",">{t`\v v_P`}</M> <M>{t`\v\omega \ \Rightarrow`}</M> compute the velocity at every point.</p>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> <M>\forall</M> heisst «für alle». Die Formel gilt für jedes Paar von Punkten <M>M</M> und <M>B</M> des Körpers <M p=".">K</M> Kennt man die Geschwindigkeit eines einzigen Punktes und <M p=",">{t`\v\omega`}</M> kennt man die Geschwindigkeit jedes Punktes. Der ganze <b>Bewegungszustand</b> – alle Geschwindigkeiten in diesem Augenblick – steckt also in zwei Vektoren.</p>}
          en={<p><b>How to read this:</b> <M>\forall</M> means “for all”. The formula holds for every pair of points <M>M</M> and <M>B</M> of the body <M p=".">K</M> If you know the velocity of a single point and <M p=",">{t`\v\omega`}</M> you know the velocity of every point. So the whole <b>state of motion</b> (<span lang="de">Bewegungszustand</span>) – all velocities at this instant – is contained in two vectors.</p>}
        />
        <FieldDemo />
        <T
          de={<>
            <p>In der Grundgleichung steckt alles, was du in diesem Kapitel gelernt hast:</p>
            <ul>
              <li><b><M p=":">{t`\v\omega = \v 0`}</M></b> <M>{t`\v v_M = \v v_B`}</M> für alle Punkte – eine <b><a href="#translation">Translation</a></b> (S. 13). Knopf «Translation».</li>
              <li><b><M>B</M> ruht in diesem Augenblick:</b> <M>{t`\v v_M = \v\omega\times\v{BM}`}</M> – eine (momentane) <b>Rotation</b> oder <b>Kreiselung</b> um <M>B</M> (S. 15, S. 20). Mit <M>{t`B = O`}</M> ist das die Formel <M>{t`\v v = \v\omega\times\v r`}</M> der <a href="#rotation">Rotation</a>. Knopf «Drehung um <M p="».">B</M></li>
              <li><b><a href="#rollen">Rollen</a></b> (S. 20): Wähle als Bezugspunkt einen Punkt <M>A</M> der Berührlinie. Er ruht, also <M p=".">{t`\v v_M = \v\omega\times\v{AM}`}</M> Für den Mittelpunkt <M>C</M> des Rades gibt das <M p=".">{t`v_C = \omega R`}</M></li>
              <li><b>Die SdpG</b> (S. 12) folgt: Bilde auf beiden Seiten das Skalarprodukt mit <M p=".">{t`\v{BM}`}</M> Der Drehteil fällt weg, weil <M>{t`\v\omega\times\v{BM}`}</M> senkrecht auf <M>{t`\v{BM}`}</M> steht:</li>
            </ul>
            <MD>{t`\v v_M\cdot\v{BM} = \v v_B\cdot\v{BM} + \underbrace{(\v\omega\times\v{BM})\cdot\v{BM}}_{=\,0} = \v v_B\cdot\v{BM}.`}</MD>
          </>}
          en={<>
            <p>Everything you learned in this chapter is contained in the fundamental equation:</p>
            <ul>
              <li><b><M p=":">{t`\v\omega = \v 0`}</M></b> <M>{t`\v v_M = \v v_B`}</M> for all points – a <b><a href="#translation">translation</a></b> (p. 13). Button “translation”.</li>
              <li><b><M>B</M> at rest at this instant:</b> <M>{t`\v v_M = \v\omega\times\v{BM}`}</M> – a (momentary) <b>rotation</b> or <b>spinning motion</b> about <M>B</M> (p. 15, p. 20). With <M>{t`B = O`}</M> this is the formula <M>{t`\v v = \v\omega\times\v r`}</M> of the <a href="#rotation">rotation</a>. Button “turning about <M p="”.">B</M></li>
              <li><b><a href="#rollen">Rolling</a></b> (p. 20): choose a point <M>A</M> of the contact line as the reference point. It is at rest, so <M p=".">{t`\v v_M = \v\omega\times\v{AM}`}</M> For the centre <M>C</M> of the wheel this gives <M p=".">{t`v_C = \omega R`}</M></li>
              <li><b>The SdpG</b> (p. 12) follows: take the dot product of both sides with <M p=".">{t`\v{BM}`}</M> The turning part drops out because <M>{t`\v\omega\times\v{BM}`}</M> is perpendicular to <M p=":">{t`\v{BM}`}</M></li>
            </ul>
            <MD>{t`\v v_M\cdot\v{BM} = \v v_B\cdot\v{BM} + \underbrace{(\v\omega\times\v{BM})\cdot\v{BM}}_{=\,0} = \v v_B\cdot\v{BM}.`}</MD>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wuerfel" title={<T de="4. Beispiel: Würfel, allgemeine Bewegung" en="4. Example: cube, general motion" />}>
        <Box kind="lecture" src={<Src p={23} />} title={<T de="Beispiel Würfel, allgemeine Bewegung" en={<>Example: cube, general motion (<span lang="de">Beispiel Würfel, allgemeine Bewegung</span>)</>} />}>
          <T
            de={<>
              <p>Figur: Würfel mit Kantenlänge <M p=",">L</M> <M>B</M> im Ursprung (<M>x</M> zum Betrachter, <M>y</M> nach rechts, <M>z</M> nach oben). Gegeben: <M p=",">{t`P_1\colon \v v_1 = (-v, 0, 0)`}</M> <M p=",">{t`P_2\colon \v v_2 = (0, 0, v)`}</M> <M p=".">{t`P_3\colon \v v_3 = (-v, 0, 0)`}</M> Gesucht: <M p=",">{t`\v v_B`}</M> <M>{t`\v\omega`}</M> («Kinemat in <M p="»).">B</M></p>
              <p>Lösung im Skript (handschriftlich):</p>
            </>}
            en={<>
              <p>Figure: cube of edge length <M p=",">L</M> <M>B</M> at the origin (<M>x</M> toward the viewer, <M>y</M> to the right, <M>z</M> up). Given: <M p=",">{t`P_1\colon \v v_1 = (-v, 0, 0)`}</M> <M p=",">{t`P_2\colon \v v_2 = (0, 0, v)`}</M> <M p=".">{t`P_3\colon \v v_3 = (-v, 0, 0)`}</M> Wanted: <M p=",">{t`\v v_B`}</M> <M>{t`\v\omega`}</M> (“<span lang="de">Kinemat in</span> <M p="”).">B</M></p>
              <p>Solution in the notes (handwritten):</p>
            </>}
          />
          <MD>{t`\begin{aligned}
&\v v_3 = \v v_1 + \v\omega\times\v{P_1P_3};\quad \v v_3 - \v v_1 = \v 0 = \v\omega\times(-L, -L, L)\\
&\to\ 0 = \omega_y L + \omega_z L,\quad 0 = -\omega_z L - \omega_x L,\quad 0 = -\omega_x L + \omega_y L\\
&\to\ \omega_y = -\omega_z,\ \omega_x = -\omega_z,\ \omega_x = \omega_y\ \to\ \v\omega = (\omega_x, \omega_x, -\omega_x)\\[4pt]
&\v v_2 = \v v_3 + \v\omega\times\v{P_3P_2};\quad \v v_2 - \v v_3 = (v, 0, v) = (\omega_x, \omega_x, -\omega_x)\times(0, L, 0)\\
&\to\ v = \omega_x L,\quad 0 = 0,\quad v = \omega_x L\ \to\ \omega_x = \tfrac{v}{L};\quad \v\omega = \tfrac{v}{L}(1, 1, -1)\\[4pt]
&\v v_B = \v v_3 + \v\omega\times\v{P_3B} = (-v, 0, 0) + \tfrac{v}{L}(1, 1, -1)\times(0, 0, -L)\colon\\
&v_{Bx} = -2v,\ \ v_{By} = v,\ \ v_{Bz} = \ \text{${tr('(leer)', '(empty)')}}
\end{aligned}`}</MD>
        </Box>
        <T
          de={<>
            <p>Die Lage der Punkte steht nur in der Figur; aus den Rechnungen folgt <M p=",">{t`P_1 = (L, L, 0)`}</M> <M p=",">{t`P_2 = (0, L, L)`}</M> <M p=".">{t`P_3 = (0, 0, L)`}</M> «Kinemat in <M p="»">B</M> meint das Paar <M>{t`\v v_B`}</M> und <M p=":">{t`\v\omega`}</M> genau die zwei Vektoren, die die Grundgleichung braucht. Das übliche Fachwort für dieses Paar ist «Kinemate» (Ergänzung).</p>
            <p><b>So liest man die Lösung:</b></p>
            <ol>
              <li>Grundgleichung mit <M>{t`P_1`}</M> als Bezugspunkt und <M>{t`P_3`}</M> als <M p=".">M</M> Weil <M p=",">{t`\v v_1 = \v v_3`}</M> muss <M>{t`\v\omega\times\v{P_1P_3}`}</M> null sein. Ein Kreuzprodukt ist null, wenn die Vektoren parallel sind: <M>{t`\v\omega`}</M> zeigt entlang der Raumdiagonale <M p=".">{t`\v{P_1P_3} = (-L, -L, L)`}</M> Ausgeschrieben gibt das Kreuzprodukt drei Gleichungen (zweite Zeile im Kasten). Durch <M>L</M> geteilt: <M p=",">{t`\omega_y = -\omega_z`}</M> <M p=",">{t`\omega_x = -\omega_z`}</M> <M p=".">{t`\omega_x = \omega_y`}</M> Also <M p=".">{t`\v\omega = (\omega_x, \omega_x, -\omega_x)`}</M></li>
              <li>Mit <M>{t`P_3`}</M> als Bezugspunkt und <M>{t`P_2`}</M> als <M p=":">M</M> <M p=".">{t`\v v_2 - \v v_3 = \v\omega\times\v{P_3P_2}`}</M> Links steht <M p=",">{t`(v, 0, v)`}</M> rechts <M p=".">{t`\v\omega\times(0, L, 0) = (\omega_x L, 0, \omega_x L)`}</M> Also <M p=".">{t`\omega_x = v/L`}</M></li>
              <li>Jetzt ist <M>{t`\v\omega`}</M> bekannt, und die Grundgleichung gibt <M p=":">{t`\v v_B`}</M> <M p=".">{t`\tfrac{v}{L}(1, 1, -1)\times(0, 0, -L) = (-v, v, 0)`}</M> Dazu <M>{t`\v v_3`}</M> addiert: <M p=".">{t`\v v_B = (-2v, v, 0)`}</M> Die <M>z</M>-Komponente ist im Skript leer geblieben; sie ist <M p=".">0</M></li>
            </ol>
          </>}
          en={<>
            <p>The positions of the points are only in the figure; the calculations imply <M p=",">{t`P_1 = (L, L, 0)`}</M> <M p=",">{t`P_2 = (0, L, L)`}</M> <M p=".">{t`P_3 = (0, 0, L)`}</M> “<span lang="de">Kinemat in</span> <M p="”">B</M> means the pair <M>{t`\v v_B`}</M> and <M p=":">{t`\v\omega`}</M> exactly the two vectors the fundamental equation needs. The usual technical term for this pair is <De en="velocity and angular velocity as a pair">Kinemate</De> (supplement).</p>
            <p><b>How to read the solution:</b></p>
            <ol>
              <li>Fundamental equation with <M>{t`P_1`}</M> as the reference point and <M>{t`P_3`}</M> as <M p=".">M</M> Since <M p=",">{t`\v v_1 = \v v_3`}</M> <M>{t`\v\omega\times\v{P_1P_3}`}</M> must be zero. A cross product is zero when the vectors are parallel: <M>{t`\v\omega`}</M> points along the space diagonal <M p=".">{t`\v{P_1P_3} = (-L, -L, L)`}</M> Written out, the cross product gives three equations (second line in the box). Divided by <M p=":">L</M> <M p=",">{t`\omega_y = -\omega_z`}</M> <M p=",">{t`\omega_x = -\omega_z`}</M> <M p=".">{t`\omega_x = \omega_y`}</M> So <M p=".">{t`\v\omega = (\omega_x, \omega_x, -\omega_x)`}</M></li>
              <li>With <M>{t`P_3`}</M> as the reference point and <M>{t`P_2`}</M> as <M p=":">M</M> <M p=".">{t`\v v_2 - \v v_3 = \v\omega\times\v{P_3P_2}`}</M> The left side is <M p=",">{t`(v, 0, v)`}</M> the right side <M p=".">{t`\v\omega\times(0, L, 0) = (\omega_x L, 0, \omega_x L)`}</M> So <M p=".">{t`\omega_x = v/L`}</M></li>
              <li>Now <M>{t`\v\omega`}</M> is known, and the fundamental equation gives <M p=":">{t`\v v_B`}</M> <M p=".">{t`\tfrac{v}{L}(1, 1, -1)\times(0, 0, -L) = (-v, v, 0)`}</M> Adding <M p=":">{t`\v v_3`}</M> <M p=".">{t`\v v_B = (-2v, v, 0)`}</M> The <M>z</M>-component was left empty in the notes; it is <M p=".">0</M></li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Der Würfel Schritt für Schritt" en="The cube step by step" />}>
          <StepPlayer
            label={tr('Animation: Würfel, allgemeine Bewegung', 'Animation: cube, general motion')}
            steps={[
              { ms: 1500, holdMs: 3000, caption: <T
                de={<>Gegeben sind die Geschwindigkeiten in <M p=",">{t`P_1`}</M> <M>{t`P_2`}</M> und <M p=".">{t`P_3`}</M> Gesucht sind <M>{t`\v\omega`}</M> und die Geschwindigkeit von <M p=".">B</M></>}
                en={<>Given are the velocities at <M p=",">{t`P_1`}</M> <M p=",">{t`P_2`}</M> and <M p=".">{t`P_3`}</M> Wanted are <M>{t`\v\omega`}</M> and the velocity of <M p=".">B</M></>} /> },
              { ms: 3000, holdMs: 3500, caption: <T
                de={<><M>{t`\v v_1 = \v v_3`}</M> heisst <M p=".">{t`\v\omega\times\v{P_1P_3} = \v 0`}</M> Also zeigt <M>{t`\v\omega`}</M> entlang der Raumdiagonale <M>{t`P_1P_3`}</M> (gestrichelt).</>}
                en={<><M>{t`\v v_1 = \v v_3`}</M> means <M p=".">{t`\v\omega\times\v{P_1P_3} = \v 0`}</M> So <M>{t`\v\omega`}</M> points along the space diagonal <M>{t`P_1P_3`}</M> (dashed).</>} /> },
              { ms: 4000, holdMs: 3500, caption: <T
                de={<>Schwarz die Kante <M p=".">{t`\v{P_3P_2}`}</M> Bei <M p=":">{t`P_2`}</M> grau eine Kopie von <M p=",">{t`\v v_3`}</M> violett <M p=";">{t`\v\omega\times\v{P_3P_2} = (v, 0, v)`}</M> zusammen ergeben sie <M p=".">{t`\v v_2`}</M> Daraus <M p=".">{t`\v\omega = \tfrac{v}{L}(1, 1, -1)`}</M></>}
                en={<>Black the edge <M p=".">{t`\v{P_3P_2}`}</M> At <M p=":">{t`P_2`}</M> grey a copy of <M p=",">{t`\v v_3`}</M> purple <M p=";">{t`\v\omega\times\v{P_3P_2} = (v, 0, v)`}</M> together they give <M p=".">{t`\v v_2`}</M> Hence <M p=".">{t`\v\omega = \tfrac{v}{L}(1, 1, -1)`}</M></>} /> },
              { ms: 3500, holdMs: 3500, caption: <T
                de={<><M p=".">{t`\v v_B = \v v_3 + \v\omega\times\v{P_3B} = (-2v, v, 0)`}</M></>}
                en={<><M p=".">{t`\v v_B = \v v_3 + \v\omega\times\v{P_3B} = (-2v, v, 0)`}</M></>} /> },
              { ms: 3000, caption: <T
                de={<>Mit <M>{t`\v v_B`}</M> und <M>{t`\v\omega`}</M> gibt die Grundgleichung die Geschwindigkeit jeder Ecke. Zum Beispiel für die Ecke <M p=":">M</M> <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM} = (0, -v, 0)`}</M></>}
                en={<>With <M>{t`\v v_B`}</M> and <M>{t`\v\omega`}</M> the fundamental equation gives the velocity of every corner. For example, for the corner <M p=":">M</M> <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM} = (0, -v, 0)`}</M></>} /> },
            ]}
          >
            {(step, tt) => <CubeGenAnim step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="supplement" title={<T de="Ruht irgendein Punkt des Würfels?" en="Is any point of the cube at rest?" />}>
          <T
            de={<p>Nein. Bilde das Skalarprodukt der Grundgleichung mit <M p=":">{t`\v\omega`}</M> Der Drehteil <M>{t`\v\omega\times\v{BM}`}</M> steht senkrecht auf <M p=",">{t`\v\omega`}</M> also fällt er weg: <M>{t`\v\omega\cdot\v v_M = \v\omega\cdot\v v_B`}</M> für jeden Punkt. Beim Würfel ist <M p=".">{t`\v\omega\cdot\v v_B = \tfrac{v}{L}(-2v + v) = -\tfrac{v^2}{L} \ne 0`}</M> Hätte ein Punkt <M p=",">{t`\v v_M = \v 0`}</M> wäre dort <M p=".">{t`\v\omega\cdot\v v_M = 0`}</M> Also ruht kein Punkt – anders als bei Rotation und Kreiselung.</p>}
            en={<p>No. Take the dot product of the fundamental equation with <M p=".">{t`\v\omega`}</M> The turning part <M>{t`\v\omega\times\v{BM}`}</M> is perpendicular to <M p=",">{t`\v\omega`}</M> so it drops out: <M>{t`\v\omega\cdot\v v_M = \v\omega\cdot\v v_B`}</M> for every point. For the cube <M p=".">{t`\v\omega\cdot\v v_B = \tfrac{v}{L}(-2v + v) = -\tfrac{v^2}{L} \ne 0`}</M> If a point had <M p=",">{t`\v v_M = \v 0`}</M> then <M>{t`\v\omega\cdot\v v_M`}</M> would be <M p=".">0</M> So no point is at rest – unlike in rotation and spinning motion.</p>}
          />
        </Box>
        <T
          de={<p>Auf S. 23 steht davor noch ein «Beispiel Tetraeder, allgemeine Bewegung» – nur mit Figur, ohne Aufgabe und Lösung. Darum fehlt es hier.</p>}
          en={<p>Before this, p. 23 also has an “example: tetrahedron, general motion” – only the figure, without data or solution. That is why it is missing here.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v\omega`}</M> hängt davon ab, welchen Bezugspunkt man wählt.»</>} en={<>“<M>{t`\v\omega`}</M> depends on the reference point you choose.”</>} />}>
          <T de={<>Nein, <M>{t`\v\omega`}</M> ist für alle Bezugspunkte gleich. Nur der Translationsteil <M>{t`\v v_B`}</M> hängt von <M>B</M> ab (Knöpfe «Bezugspunkt» im Feld-Bild).</>} en={<>No, <M>{t`\v\omega`}</M> is the same for every reference point. Only the translation part <M>{t`\v v_B`}</M> depends on <M>B</M> (buttons “reference point” in the field figure).</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«In der Grundgleichung darf man <M>{t`\v r_M`}</M> statt <M>{t`\v{BM}`}</M> schreiben.»</>} en={<>“In the fundamental equation you may write <M>{t`\v r_M`}</M> instead of <M p=".">{t`\v{BM}`}</M>”</>} />}>
          <T de={<>Nur wenn <M>B</M> im Ursprung liegt, wie beim Würfel. Allgemein zählt der Vektor von <M>B</M> nach <M p=":">M</M> <M p=".">{t`\v{BM} = \v r_M - \v r_B`}</M></>} en={<>Only if <M>B</M> is at the origin, as for the cube. In general what counts is the vector from <M>B</M> to <M p=":">M</M> <M p=".">{t`\v{BM} = \v r_M - \v r_B`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Irgendein Punkt ruht immer, man muss ihn nur finden.»" en="“Some point is always at rest, you just have to find it.”" />}>
          <T de={<>In der Ebene stimmt das, solange sich der Körper dreht (violetter Punkt im Feld-Bild). Im Raum nicht unbedingt: Beim Würfel ruht kein einziger Punkt.</>} en={<>In the plane this is true as long as the body turns (purple dot in the field figure). In space not necessarily: for the cube not a single point is at rest.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T de={<>Jede Bewegung eines starren Körpers ist in jedem Augenblick eine Translation (mit der Geschwindigkeit <M>{t`\v v_B`}</M> eines Bezugspunkts) plus eine Kreiselung um <M>B</M> (mit <M p=")">{t`\v\omega`}</M> <M>{t`\v\omega`}</M> ist für alle Bezugspunkte gleich.</>} en={<>Every motion of a rigid body is at each instant a translation (with the velocity <M>{t`\v v_B`}</M> of a reference point) plus a spinning motion about <M>B</M> (with <M p=").">{t`\v\omega`}</M> <M>{t`\v\omega`}</M> is the same for every reference point.</>} />
          <MD>{t`\v v_M = \v v_B + \v\omega\times\v{BM} \qquad \forall\ M, B \in K`}</MD>
        </Box>
        <Box kind="key" title={<T de="Kapitel 3 auf einen Blick" en="Chapter 3 at a glance" />}>
          <T
            de={<ul>
              <li><b><a href="#sdpg">SdpG</a></b> (S. 12): Zwei Punkte eines starren Körpers haben gleiche Geschwindigkeits-Projektionen auf ihre Verbindungslinie – das Werkzeug für alles Weitere.</li>
              <li><b><a href="#translation">Translation</a></b> (S. 13): <M p=";">{t`\v\omega = \v 0`}</M> alle Punkte haben dieselbe Geschwindigkeit.</li>
              <li><b><a href="#rotation">Rotation</a></b> (S. 15–17): Zwei Punkte ruhen dauernd, also eine feste Achse <M p=";">\mu</M> <M p=".">{t`\v v = \v\omega\times\v r`}</M></li>
              <li><b><a href="#rollen">Rollen</a></b> (S. 20): Die Berührlinie ruht in diesem Augenblick – eine momentane Rotation um sie.</li>
              <li><b><a href="#kreiselung">Kreiselung</a></b> (S. 20–21): Ein Punkt <M>O</M> ruht dauernd – eine momentane Rotation um eine wandernde Achse durch <M p=".">O</M></li>
              <li><b>Allgemein</b> (S. 22): Translation plus Kreiselung, <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M> Alle Fälle oben sind Spezialfälle davon.</li>
            </ul>}
            en={<ul>
              <li><b><a href="#sdpg">SdpG</a></b> (p. 12): two points of a rigid body have equal velocity projections onto the line joining them – the tool for everything else.</li>
              <li><b><a href="#translation">Translation</a></b> (p. 13): <M p=";">{t`\v\omega = \v 0`}</M> all points have the same velocity.</li>
              <li><b><a href="#rotation">Rotation</a></b> (pp. 15–17): two points permanently at rest, hence a fixed axis <M p=";">\mu</M> <M p=".">{t`\v v = \v\omega\times\v r`}</M></li>
              <li><b><a href="#rollen">Rolling</a></b> (p. 20): the contact line is at rest at this instant – a momentary rotation about it.</li>
              <li><b><a href="#kreiselung">Spinning motion</a></b> (pp. 20–21): one point <M>O</M> permanently at rest – a momentary rotation about a wandering axis through <M p=".">O</M></li>
              <li><b>General</b> (p. 22): translation plus spinning motion, <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M> All the cases above are special cases of it.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Geschafft:</b> Das war der letzte Abschnitt der Mitschrift. Zum Üben gibt es den <a href="#quiz-1">Quiz-Teil</a> am Ende des Menüs.</p>}
          en={<p className="connections"><b>Done:</b> this was the last section of the notes. For practice there is the <a href="#quiz-1">quiz part</a> at the end of the menu.</p>}
        />
      </Section>
    </article>
  );
}
