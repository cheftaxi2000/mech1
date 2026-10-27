import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { planetScene } from '../viz/anim/planetScene';
import { PlanetaryGear } from '../viz/PlanetaryFigures';

const t = String.raw;

export default function L15Planetary() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Planetengetriebe besteht aus vier Teilen: Sonne, Hohlrad und Arm drehen sich um dieselbe Mitte <M p=";">O</M> der Planet sitzt drehbar auf dem Arm und läuft zwischen Sonne und Hohlrad mit. Das Skript rechnet aus, wie schnell sich der Arm dreht, wenn man Sonnenrad und Hohlrad antreibt. Das einzige Werkzeug dafür ist das <a href="#ebene-bewegung">Momentanzentrum</a> des Planetenrads.</p>}
        en={<p className="lede">A planetary gear consists of four parts: sun, ring gear and arm turn about the same centre <M p=";">O</M> the planet sits on the arm, free to turn, and runs along between sun and ring. The notes work out how fast the arm turns when the sun gear and the ring gear are driven. The only tool needed is the <a href="#ebene-bewegung">instantaneous centre</a> of the planet gear.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Planetengetriebe stecken in der Nabenschaltung eines Velos, im Automatikgetriebe eines Autos und im Küchenmixer mit den kreisenden Rührbesen. Der Trick: Ein kleines Zahnrad, der «Planet», läuft zwischen einem inneren Rad (der «Sonne») und einem äusseren Zahnkranz (dem «Hohlrad») im Kreis herum – wie ein Planet um die Sonne. Er sitzt drehbar auf einem Arm, der sich um die Mitte dreht. Der Planet selbst dreht sich also nicht um die Mitte, sondern in jedem Augenblick um seinen eigenen ruhenden Punkt <M p=".">{t`Z_3`}</M> Je nachdem, welches Teil man festhält und welches man antreibt, dreht sich der Rest schneller, langsamer oder rückwärts.</p>}
          en={<p>Planetary gears sit in the hub gears of a bicycle, in the automatic gearbox of a car and in a kitchen mixer with circling beaters. The trick: a small gear, the “planet”, runs around in a circle between an inner wheel (the “sun”) and an outer toothed ring (the “ring gear”) – like a planet around the sun. It sits, free to spin, on an arm that turns about the centre. So the planet itself does not turn about the centre but, at each instant, about its own point at rest <M p=".">{t`Z_3`}</M> Depending on which part you hold and which one you drive, the rest turns faster, slower or backwards.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="teile" title={<T de="1. Die vier Teile" en="1. The four parts" />}>
        <T
          de={<>
            <ul className="keep">
              <li><b>Sonnenrad</b> <M p=":">{t`\boxed{1}`}</M> das Zahnrad in der Mitte, Radius <M p=",">{t`R_1`}</M> dreht sich um <M>O</M> mit der Winkelgeschwindigkeit <M p=".">{t`\omega_1`}</M></li>
              <li><b>Hohlrad</b> <M p=":">{t`\boxed{2}`}</M> der äussere Ring mit den Zähnen innen, Radius <M p=",">{t`R_2`}</M> dreht sich ebenfalls um <M p=",">O</M> mit <M p=".">{t`\omega_2`}</M></li>
              <li><b>Planetenrad</b> <M p=":">{t`\boxed{3}`}</M> sitzt zwischen den beiden, Radius <M p=",">{t`R_3`}</M> Mittelpunkt <M p=".">A</M> Es dreht sich mit <M>{t`\omega_3`}</M> – momentan um seinen ruhenden Punkt <M p=".">{t`Z_3`}</M></li>
              <li><b>Arm</b> (auch Steg genannt): verbindet <M>O</M> mit <M p=",">A</M> Länge <M p=",">L</M> dreht sich um <M>O</M> mit <M p=".">{t`\omega_{\text{Arm}}`}</M></li>
            </ul>
            <p>Der Planet berührt die Sonne im Punkt <M>P</M> und das Hohlrad im Punkt <M p=".">Q</M> Die Zähne sorgen dafür, dass dort nichts rutscht: Es ist <a href="#rollen">Rollen</a>. Beim Rollen sind die beiden Körper im Berührpunkt gleich schnell. Daraus folgt alles.</p>
            <p className="keep"><b>Vorzeichen.</b> Das Skript sagt es nicht ausdrücklich, aber die Figur zeichnet alle Geschwindigkeiten oben nach links: Alle <M>\omega</M> werden im gleichen Drehsinn gezählt, positiv im Gegenuhrzeigersinn. Ein negatives <M>\omega</M> heisst: Drehung im Uhrzeigersinn.</p>
          </>}
          en={<>
            <ul className="keep">
              <li><b>Sun gear</b> (<span lang="de">Sonnenrad</span>) <M p=":">{t`\boxed{1}`}</M> the gear in the middle, radius <M p=",">{t`R_1`}</M> turning about <M>O</M> with angular velocity <M p=".">{t`\omega_1`}</M></li>
              <li><b>Ring gear</b> (<span lang="de">Hohlrad</span>) <M p=":">{t`\boxed{2}`}</M> the outer ring with its teeth on the inside, radius <M p=",">{t`R_2`}</M> also turning about <M p=",">O</M> with <M p=".">{t`\omega_2`}</M></li>
              <li><b>Planet gear</b> (<span lang="de">Planetenrad</span>) <M p=":">{t`\boxed{3}`}</M> sits between the two, radius <M p=",">{t`R_3`}</M> centre <M p=".">A</M> It turns with <M>{t`\omega_3`}</M> – momentarily about its point at rest <M p=".">{t`Z_3`}</M></li>
              <li><b>Arm</b> (also called carrier): joins <M>O</M> to <M p=",">A</M> length <M p=",">L</M> turning about <M>O</M> with <M p=".">{t`\omega_{\text{Arm}}`}</M></li>
            </ul>
            <p>The planet touches the sun at the point <M>P</M> and the ring gear at the point <M p=".">Q</M> The teeth make sure nothing slips there: it is <a href="#rollen">rolling</a>. In rolling, the two bodies are equally fast at the contact point. Everything follows from this.</p>
            <p className="keep"><b>Signs.</b> The notes do not say it explicitly, but the figure draws all velocities at the top to the left: every <M>\omega</M> is counted in the same turning sense, positive counter-clockwise. A negative <M>\omega</M> means: turning clockwise.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="skript" title={<T de="2. Das Planetengetriebe im Skript" en="2. The planetary gear in the notes" />}>
        <Box kind="lecture" src={<Src p={28} fig="Fig. 3.21" />} title={<T de="Figur 3.21: Planetengetriebe" en={<>Figure 3.21: planetary gear (<span lang="de">Planetengetriebe</span>)</>} />}>
          <T
            de={<>
              <p>Legende: <M p=":">{t`\boxed{1}`}</M> Sonnenrad, <M p=",">{t`R_1`}</M> <M p=",">{t`Z_1 \equiv O`}</M> <M p=".">{t`\omega_1`}</M> <M p=":">{t`\boxed{2}`}</M> Hohlrad, <M p=",">{t`R_2`}</M> <M p=",">{t`Z_2 \equiv O`}</M> <M p=".">{t`\omega_2`}</M> <M p=":">{t`\boxed{3}`}</M> Planetenrad, <M p=",">{t`R_3`}</M> <M p=",">{t`Z_3`}</M> <M p=".">{t`\omega_3`}</M> Arm, <M p=",">L</M> <M p=",">{t`Z_A \equiv O`}</M> <M p=".">\omega</M> In der Figur: <M>Q</M> oben (Planet–Hohlrad), <M>A</M> (<M p=")">{t`= O'`}</M> Mitte des Planeten, <M>P</M> (Planet–Sonne), <M p=";">O</M> Pfeile <M>{t`R_2\omega_2`}</M> bei <M p=",">Q</M> <M>v</M> bei <M p=",">A</M> <M>{t`R_1\omega_1`}</M> bei <M p=",">P</M> alle nach links; <M>{t`Z_3`}</M> unten auf der Geraden <M p=".">{t`QPO`}</M></p>
              <p>Geometrie: <M p=",">{t`R_3 = \tfrac12(R_2 - R_1)`}</M> <M p=".">{t`L = R_1 + R_3 = \tfrac12(R_2 + R_1)`}</M></p>
              <p>Handschriftliche Lösung:</p>
            </>}
            en={<>
              <p>Legend: <M p=":">{t`\boxed{1}`}</M> sun gear, <M p=",">{t`R_1`}</M> <M p=",">{t`Z_1 \equiv O`}</M> <M p=".">{t`\omega_1`}</M> <M p=":">{t`\boxed{2}`}</M> ring gear, <M p=",">{t`R_2`}</M> <M p=",">{t`Z_2 \equiv O`}</M> <M p=".">{t`\omega_2`}</M> <M p=":">{t`\boxed{3}`}</M> planet gear, <M p=",">{t`R_3`}</M> <M p=",">{t`Z_3`}</M> <M p=".">{t`\omega_3`}</M> Arm, <M p=",">L</M> <M p=",">{t`Z_A \equiv O`}</M> <M p=".">\omega</M> In the figure: <M>Q</M> at the top (planet–ring), <M>A</M> (<M p=")">{t`= O'`}</M> centre of the planet, <M>P</M> (planet–sun), <M p=";">O</M> arrows <M>{t`R_2\omega_2`}</M> at <M p=",">Q</M> <M>v</M> at <M p=",">A</M> <M>{t`R_1\omega_1`}</M> at <M p=",">P</M> all to the left; <M>{t`Z_3`}</M> at the bottom on the line <M p=".">{t`QPO`}</M></p>
              <p>Geometry: <M p=",">{t`R_3 = \tfrac12(R_2 - R_1)`}</M> <M p=".">{t`L = R_1 + R_3 = \tfrac12(R_2 + R_1)`}</M></p>
              <p>Handwritten solution:</p>
            </>}
          />
          <MD>{t`\begin{aligned}
&P,\ Q \in \boxed{3}\\
&P \in \boxed{1}\colon\ v_P = \omega_1\cdot R_1\\
&Q \in \boxed{2}\colon\ v_Q = \omega_2\cdot R_2\\[4pt]
&\left\{\begin{aligned} &Z_3P\cdot\omega_3 = v_P = \omega_1\cdot R_1\\ &(Z_3P + PQ)\cdot\omega_3 = v_Q = \omega_2\cdot R_2 \end{aligned}\right.\\
&(PQ = R_2 - R_1)\\[4pt]
&Z_3P\cdot\omega_3 - Z_3P\cdot\omega_3 - PQ\cdot\omega_3\\ &\qquad = \omega_1\cdot R_1 - \omega_2\cdot R_2\\
&\Leftrightarrow\ \omega_1\cdot R_1 + PQ\cdot\omega_3 = \omega_2\cdot R_2\\
&\qquad\qquad \text{${tr('(daneben:', '(beside it:')}}\ \omega_2R_2 = \omega_1R_1\ ?\text{)}\\
&\Leftrightarrow\ \omega_3 = \frac{\omega_2R_2 - \omega_1R_1}{R_2 - R_1}\\[4pt]
&v_A = \tfrac12\,(\omega_2\cdot R_2 + \omega_1\cdot R_1)\\
&A \in \text{Arm};\quad Z_{\text{Arm}} = O\\
&\omega_{\text{Arm}}\cdot L = v_A\\
&\omega_{\text{Arm}} = \frac{v_A}{L} = \frac{\tfrac12(\omega_2R_2 + \omega_1R_1)}{\tfrac12(R_2 + R_1)}\\[4pt]
&\boxed{\ \omega_{\text{Arm}} = \omega_2\cdot\frac{R_2}{R_2 + R_1} + \omega_1\cdot\frac{R_1}{R_2 + R_1}\ }
\end{aligned}`}</MD>
          <T
            de={<p>Rot (deine Notizen): «<M>{t`\omega_2 = 0 \to`}</M> 1. (erstes) Übersetzungsverhältnis»; «<M>{t`\omega_2 \neq 0`}</M> … <M p="».">{t`\omega_2 < 0 \Rightarrow \omega_{\text{Arm}}\downarrow`}</M></p>}
            en={<p>Red (your notes): «<M>{t`\omega_2 = 0 \to`}</M> <span lang="de">1. (erstes) Übersetzungsverhältnis</span>» (first transmission ratio); «<M>{t`\omega_2 \neq 0`}</M> … <M p="».">{t`\omega_2 < 0 \Rightarrow \omega_{\text{Arm}}\downarrow`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Die Geometrie zuerst:</b> Der Planet füllt die Lücke zwischen Sonne und Hohlrad genau aus. Sein Durchmesser ist also <M p=",">{t`2R_3 = R_2 - R_1`}</M> und das ist <M p=".">{t`R_3 = \tfrac12(R_2 - R_1)`}</M> Der Arm reicht von <M>O</M> bis zur Mitte <M>A</M> des Planeten: <M p=".">{t`L = R_1 + R_3`}</M> In der Legende heisst die Winkelgeschwindigkeit des Arms einfach <M p=";">\omega</M> in der Lösung <M p=".">{t`\omega_{\text{Arm}}`}</M></p>
            <p>Die Figur unten folgt Fig. 3.21 (Sonne rosa, Planet hellblau, Arm sandfarben). Stell mit <M>{t`\omega_1`}</M> und <M>{t`\omega_2`}</M> ein, wie schnell Sonne und Hohlrad drehen, und drück «Getriebe drehen». Alles andere – <M p=",">{t`\omega_3`}</M> <M p=",">{t`\omega_{\text{Arm}}`}</M> <M>{t`Z_3`}</M> – rechnet das Bild mit den Formeln des Skripts aus. Die Zähne greifen dabei immer richtig ineinander: Es rutscht nichts.</p>
          </>}
          en={<>
            <p className="keep"><b>The geometry first:</b> the planet exactly fills the gap between sun and ring. So its diameter is <M p=",">{t`2R_3 = R_2 - R_1`}</M> which is <M p=".">{t`R_3 = \tfrac12(R_2 - R_1)`}</M> The arm reaches from <M>O</M> to the centre <M>A</M> of the planet: <M p=".">{t`L = R_1 + R_3`}</M> In the legend the arm’s angular velocity is simply called <M p=";">\omega</M> in the solution it is <M p=".">{t`\omega_{\text{Arm}}`}</M></p>
            <p>The figure below follows Fig. 3.21 (sun pink, planet light blue, arm sand). Set with <M>{t`\omega_1`}</M> and <M>{t`\omega_2`}</M> how fast sun and ring turn, and press “Turn the gear”. Everything else – <M p=",">{t`\omega_3`}</M> <M p=",">{t`\omega_{\text{Arm}}`}</M> <M>{t`Z_3`}</M> – the figure computes with the formulas of the notes. The teeth always mesh correctly: nothing slips.</p>
          </>}
        />
        <PlanetaryGear />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="loesung" title={<T de="3. Die Lösung Schritt für Schritt" en="3. The solution step by step" />}>
        <Derivation title={<T de={<>Von <M>{t`v_P`}</M> und <M>{t`v_Q`}</M> zu <M>{t`\omega_{\text{Arm}}`}</M></>} en={<>From <M>{t`v_P`}</M> and <M>{t`v_Q`}</M> to <M>{t`\omega_{\text{Arm}}`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: Planetengetriebe, Herleitung von omega_3 und omega_Arm', 'Animation: planetary gear, derivation of omega_3 and omega_Arm')}
            steps={[
              { ms: 5000, holdMs: 2500, caption: <T
                de={<>Sonne <M>{t`\boxed{1}`}</M> und Hohlrad <M>{t`\boxed{2}`}</M> drehen sich um <M p=";">O</M> der Planet <M>{t`\boxed{3}`}</M> rollt zwischen ihnen und nimmt den Arm mit. Am Ende steht der Arm senkrecht, wie in Fig. 3.21.</>}
                en={<>Sun <M>{t`\boxed{1}`}</M> and ring <M>{t`\boxed{2}`}</M> turn about <M p=";">O</M> the planet <M>{t`\boxed{3}`}</M> rolls between them and takes the arm along. At the end the arm stands vertical, as in Fig. 3.21.</>} /> },
              { ms: 2500, holdMs: 3000, caption: <T
                de={<><M>P</M> ist der Berührpunkt von Planet und Sonne, <M>Q</M> der von Planet und Hohlrad. Beide gehören zum Planeten: <M p=".">{t`P, Q \in \boxed{3}`}</M></>}
                en={<><M>P</M> is where planet and sun touch, <M>Q</M> where planet and ring touch. Both belong to the planet: <M p=".">{t`P, Q \in \boxed{3}`}</M></>} /> },
              { ms: 3000, holdMs: 3000, caption: <T
                de={<>Bei <M>P</M> rollt der Planet auf der Sonne: Er ist dort so schnell wie die Sonne. Die Sonne dreht sich um <M p=",">O</M> also <M p=".">{t`v_P = \omega_1R_1`}</M></>}
                en={<>At <M>P</M> the planet rolls on the sun: there it is as fast as the sun. The sun turns about <M p=",">O</M> so <M p=".">{t`v_P = \omega_1R_1`}</M></>} /> },
              { ms: 3000, holdMs: 3000, caption: <T
                de={<>Ebenso bei <M p=":">Q</M> Planet und Hohlrad sind gleich schnell, <M p=".">{t`v_Q = \omega_2R_2`}</M></>}
                en={<>Likewise at <M p=":">Q</M> planet and ring are equally fast, <M p=".">{t`v_Q = \omega_2R_2`}</M></>} /> },
              { ms: 4000, holdMs: 4000, caption: <T
                de={<>Der Planet dreht sich momentan um <M p=":">{t`Z_3`}</M> Dort trifft die Gerade durch die Pfeilspitzen die Gerade <M p=".">{t`QPO`}</M> Also <M>{t`Z_3P\cdot\omega_3 = v_P`}</M> und <M p=".">{t`(Z_3P + PQ)\cdot\omega_3 = v_Q`}</M></>}
                en={<>The planet momentarily turns about <M p=".">{t`Z_3`}</M> That is where the line through the arrow tips meets the line <M p=".">{t`QPO`}</M> So <M>{t`Z_3P\cdot\omega_3 = v_P`}</M> and <M p=".">{t`(Z_3P + PQ)\cdot\omega_3 = v_Q`}</M></>} /> },
              { ms: 3000, holdMs: 4000, caption: <T
                de={<>Zieht man die Gleichungen voneinander ab, fällt <M>{t`Z_3P`}</M> weg: <M p=".">{t`PQ\cdot\omega_3 = \omega_2R_2 - \omega_1R_1`}</M> Mit <M>{t`PQ = R_2 - R_1`}</M> folgt <M p=".">{t`\omega_3`}</M></>}
                en={<>Subtracting the equations, <M>{t`Z_3P`}</M> drops out: <M p=".">{t`PQ\cdot\omega_3 = \omega_2R_2 - \omega_1R_1`}</M> With <M>{t`PQ = R_2 - R_1`}</M> this gives <M p=".">{t`\omega_3`}</M></>} /> },
              { ms: 3000, holdMs: 3500, caption: <T
                de={<><M>A</M> liegt in der Mitte von <M p=",">{t`PQ`}</M> und die Geschwindigkeit wächst linear: <M p=".">{t`v_A = \tfrac12(v_P + v_Q)`}</M> Die Spitze von <M>{t`v_A`}</M> liegt auf der roten Geraden.</>}
                en={<><M>A</M> is the midpoint of <M p=",">{t`PQ`}</M> and the velocity grows linearly: <M p=".">{t`v_A = \tfrac12(v_P + v_Q)`}</M> The tip of <M>{t`v_A`}</M> lies on the red line.</>} /> },
              { ms: 3500, caption: <T
                de={<><M>A</M> ist auch ein Punkt des Arms, und der Arm dreht sich um <M p=":">O</M> <M p=".">{t`\omega_{\text{Arm}}\cdot L = v_A`}</M> Mit <M>{t`L = \tfrac12(R_2 + R_1)`}</M> folgt das eingerahmte Resultat.</>}
                en={<><M>A</M> is also a point of the arm, and the arm turns about <M p=":">O</M> <M p=".">{t`\omega_{\text{Arm}}\cdot L = v_A`}</M> With <M>{t`L = \tfrac12(R_2 + R_1)`}</M> the boxed result follows.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={planetScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>So liest man die Lösung:</b></p>
            <ol>
              <li><M>{t`\boxed{3}`}</M> heisst «Körper 3», also der Planet. «<M p="»">{t`P, Q\in\boxed{3}`}</M> sagt: <M>P</M> und <M>Q</M> werden als Punkte des Planeten betrachtet.</li>
              <li>«<M p="»:">{t`P\in\boxed{1}`}</M> Derselbe Punkt <M>P</M> gehört auch zur Sonne. Rollen heisst: Beide Körper sind dort gleich schnell. Für die Sonne ist <M>P</M> ein Punkt im Abstand <M>{t`R_1`}</M> von ihrer Drehachse, also <M p=".">{t`v_P = \omega_1R_1`}</M> Genauso <M p=".">{t`v_Q = \omega_2R_2`}</M></li>
              <li>Der Planet bewegt sich eben. Nach dem <a href="#ebene-bewegung">Satz vom Momentanzentrum</a> dreht er sich momentan um einen ruhenden Punkt <M p=",">{t`Z_3`}</M> und jede Geschwindigkeit ist <M>{t`\omega_3`}</M> mal Abstand von <M p=".">{t`Z_3`}</M> <M>{t`v_P`}</M> und <M>{t`v_Q`}</M> sind beide senkrecht zur Geraden <M p=",">{t`QPO`}</M> also liegt <M>{t`Z_3`}</M> auf dieser Geraden – gefunden mit den Pfeilspitzen (der Sonderfall «beide senkrecht» aus der <a href="#ebene-bewegung">letzten Lektion</a>). Der Abstand von <M>{t`Z_3`}</M> zu <M>P</M> ist <M p=",">{t`Z_3P`}</M> zu <M>Q</M> ist er <M p=".">{t`Z_3P + PQ`}</M> Das gibt die beiden Gleichungen in der geschweiften Klammer.</li>
              <li>Die erste minus die zweite: <M>{t`Z_3P\cdot\omega_3`}</M> hebt sich weg, und übrig bleibt eine Gleichung mit nur einer Unbekannten, <M p=".">{t`\omega_3`}</M> Mit <M>{t`PQ = R_2 - R_1`}</M> (Hohlrad-Radius minus Sonnen-Radius) aufgelöst gibt das <M p=".">{t`\omega_3`}</M></li>
              <li><M>A</M> ist die Mitte von <M p=".">{t`PQ`}</M> Weil die Geschwindigkeit linear mit dem Abstand von <M>{t`Z_3`}</M> wächst, ist die Geschwindigkeit in der Mitte der Mittelwert: <M p=".">{t`v_A = \tfrac12(v_P + v_Q)`}</M></li>
              <li>«<M p="»:">{t`A\in\text{Arm};\ Z_{\text{Arm}} = O`}</M> <M>A</M> gehört auch zum Arm, und der Arm dreht sich um den festen Punkt <M p=".">O</M> Also <M>{t`v_A = \omega_{\text{Arm}}\cdot L`}</M> – nach <M>{t`\omega_{\text{Arm}}`}</M> aufgelöst, die <M>{t`\tfrac12`}</M> gekürzt, auf zwei Brüche verteilt: das eingerahmte Resultat.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the solution:</b></p>
            <ol>
              <li><M>{t`\boxed{3}`}</M> means “body 3”, i.e. the planet. “<M p="”">{t`P, Q\in\boxed{3}`}</M> says: <M>P</M> and <M>Q</M> are regarded as points of the planet.</li>
              <li>“<M p="”:">{t`P\in\boxed{1}`}</M> the same point <M>P</M> also belongs to the sun. Rolling means: both bodies are equally fast there. For the sun, <M>P</M> is a point at distance <M>{t`R_1`}</M> from its axis, so <M p=".">{t`v_P = \omega_1R_1`}</M> In the same way <M p=".">{t`v_Q = \omega_2R_2`}</M></li>
              <li>The planet moves in a plane. By the <a href="#ebene-bewegung">theorem of the instantaneous centre</a> it momentarily turns about a point at rest <M p=",">{t`Z_3`}</M> and every velocity is <M>{t`\omega_3`}</M> times the distance from <M p=".">{t`Z_3`}</M> <M>{t`v_P`}</M> and <M>{t`v_Q`}</M> are both perpendicular to the line <M p=",">{t`QPO`}</M> so <M>{t`Z_3`}</M> lies on this line – found with the arrow tips (the special case “both perpendicular” of the <a href="#ebene-bewegung">previous lesson</a>). The distance from <M>{t`Z_3`}</M> to <M>P</M> is <M p=",">{t`Z_3P`}</M> to <M>Q</M> it is <M p=".">{t`Z_3P + PQ`}</M> This gives the two equations in the curly bracket.</li>
              <li>The first minus the second: <M>{t`Z_3P\cdot\omega_3`}</M> cancels, and what remains is an equation with only one unknown, <M p=".">{t`\omega_3`}</M> With <M>{t`PQ = R_2 - R_1`}</M> (ring radius minus sun radius), solving gives <M p=".">{t`\omega_3`}</M></li>
              <li><M>A</M> is the midpoint of <M p=".">{t`PQ`}</M> Since the velocity grows linearly with the distance from <M p=",">{t`Z_3`}</M> the velocity at the midpoint is the mean: <M p=".">{t`v_A = \tfrac12(v_P + v_Q)`}</M></li>
              <li>“<M p="”:">{t`A\in\text{Arm};\ Z_{\text{Arm}} = O`}</M> <M>A</M> also belongs to the arm, and the arm turns about the fixed point <M p=".">O</M> So <M>{t`v_A = \omega_{\text{Arm}}\cdot L`}</M> – solved for <M p=",">{t`\omega_{\text{Arm}}`}</M> the <M>{t`\tfrac12`}</M> cancelled, split into two fractions: the boxed result.</li>
            </ol>
          </>}
        />
        <T
          de={<p>Die Animation benutzt die Werte, wie sie Fig. 3.21 zeichnet (alle Pfeile nach links, <M p="):">{t`v_Q > v_P`}</M> <M p=",">{t`\omega_1 = 1`}</M> <M p=",">{t`\omega_2 = 0{,}5`}</M> <M p=",">{t`R_1 = 0{,}8`}</M> <M p=".">{t`R_2 = 2{,}8`}</M> Dann ist <M p=",">{t`\omega_3 = 0{,}3`}</M> <M p=",">{t`v_A = 1{,}1`}</M> <M>{t`\omega_{\text{Arm}} = 1{,}1/1{,}8 \approx 0{,}61`}</M> und <M>{t`Z_3`}</M> liegt <M>{t`8/3 \approx 2{,}67`}</M> unter <M>P</M> – unterhalb von <M p=",">O</M> wie in der Figur. (Die Einheiten sind frei gewählt.)</p>}
          en={<p>The animation uses values as drawn in Fig. 3.21 (all arrows to the left, <M p="):">{t`v_Q > v_P`}</M> <M p=",">{t`\omega_1 = 1`}</M> <M p=",">{t`\omega_2 = 0.5`}</M> <M p=",">{t`R_1 = 0.8`}</M> <M p=".">{t`R_2 = 2.8`}</M> Then <M p=",">{t`\omega_3 = 0.3`}</M> <M p=",">{t`v_A = 1.1`}</M> <M p=",">{t`\omega_{\text{Arm}} = 1.1/1.8 \approx 0.61`}</M> and <M>{t`Z_3`}</M> lies <M>{t`8/3 \approx 2.67`}</M> below <M>P</M> – below <M p=",">O</M> as in the figure. (The units are arbitrary.)</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="deutung" title={<T de="4. Was die Formel sagt" en="4. What the formula says" />}>
        <T
          de={<>
            <p className="keep"><b>Ein gewichteter Mittelwert.</b> Die eingerahmte Formel lässt sich lesen als</p>
            <MD>{t`\omega_{\text{Arm}} = \frac{R_1\,\omega_1 + R_2\,\omega_2}{R_1 + R_2}.`}</MD>
            <p>Das ist ein Mittelwert von <M>{t`\omega_1`}</M> und <M p=",">{t`\omega_2`}</M> bei dem das Hohlrad mehr zählt (es ist grösser). Darum liegt <M>{t`\omega_{\text{Arm}}`}</M> immer zwischen <M>{t`\omega_1`}</M> und <M p=".">{t`\omega_2`}</M> Der Grund ist einfach: <M>{t`v_A`}</M> ist der Mittelwert von <M>{t`v_P`}</M> und <M p=",">{t`v_Q`}</M> und <M>{t`\omega_{\text{Arm}}`}</M> ist <M>{t`v_A`}</M> geteilt durch <M p=".">L</M> Drehen Sonne und Hohlrad gleich schnell (<M p="),">{t`\omega_1 = \omega_2`}</M> dreht sich alles zusammen wie ein einziger starrer Körper.</p>
            <p className="keep"><b>Die Sonderfälle</b> (Knöpfe im Getriebe-Bild):</p>
            <ul className="keep">
              <li><b>Hohlrad fest, <M p="">{t`\omega_2 = 0`}</M></b> Dann ruht <M p=",">Q</M> also ist <M p=".">{t`Z_3 = Q`}</M> Der Arm dreht mit <M p=",">{t`\omega_{\text{Arm}} = \omega_1\frac{R_1}{R_1 + R_2}`}</M> viel langsamer als die Sonne. Der Planet dreht sogar rückwärts: <M>{t`\omega_3 = -\omega_1R_1/(R_2 - R_1)`}</M> (im Bild <M p=").">{t`-0{,}4`}</M> Das ist dein «erstes Übersetzungsverhältnis».</li>
              <li><b>Sonne fest, <M p="">{t`\omega_1 = 0`}</M></b> Dann ruht <M p=",">P</M> <M p=":">{t`Z_3 = P`}</M> Der Planet rollt auf der stehenden Sonne ab.</li>
              <li><b><M p="">{t`\omega_2R_2 = \omega_1R_1`}</M></b> – deine Frage im Skript. Dann ist <M p=",">{t`v_P = v_Q`}</M> und die Formel gibt <M p=".">{t`\omega_3 = 0`}</M> Der Planet dreht sich nicht, er verschiebt sich nur: Alle seine Punkte sind gleich schnell (eine <a href="#translation">Translation</a> auf einer Kreisbahn, wie eine Riesenrad-Gondel). Die Pfeilspitzen liegen auf einer Parallelen zur Geraden <M p=";">{t`QPO`}</M> <M>{t`Z_3`}</M> liegt «im Unendlichen» – der Satz vom Momentanzentrum gilt ja nur für <M p=".">{t`\v\omega\neq\v 0`}</M> Die Gleichung <M>{t`Z_3P\cdot\omega_3 = v_P`}</M> hat dann keine Lösung.</li>
              <li><b><M p="">{t`\omega_2 < 0`}</M></b> Das Hohlrad dreht gegen die Sonne. Der zweite Summand der Formel wird negativ, also wird <M>{t`\omega_{\text{Arm}}`}</M> kleiner als bei festem Hohlrad – das meint deine Notiz «<M p="».">{t`\omega_2 < 0 \Rightarrow \omega_{\text{Arm}}\downarrow`}</M> Bei <M>{t`\omega_2 = -\omega_1R_1/R_2`}</M> steht der Arm still, noch kleinere <M>{t`\omega_2`}</M> lassen ihn rückwärts drehen.</li>
            </ul>
          </>}
          en={<>
            <p className="keep"><b>A weighted mean.</b> The boxed formula can be read as</p>
            <MD>{t`\omega_{\text{Arm}} = \frac{R_1\,\omega_1 + R_2\,\omega_2}{R_1 + R_2}.`}</MD>
            <p>This is a mean of <M>{t`\omega_1`}</M> and <M p=",">{t`\omega_2`}</M> in which the ring counts more (it is larger). So <M>{t`\omega_{\text{Arm}}`}</M> always lies between <M>{t`\omega_1`}</M> and <M p=".">{t`\omega_2`}</M> The reason is simple: <M>{t`v_A`}</M> is the mean of <M>{t`v_P`}</M> and <M p=",">{t`v_Q`}</M> and <M>{t`\omega_{\text{Arm}}`}</M> is <M>{t`v_A`}</M> divided by <M p=".">L</M> If sun and ring turn equally fast (<M p="),">{t`\omega_1 = \omega_2`}</M> everything turns together like one single rigid body.</p>
            <p className="keep"><b>The special cases</b> (buttons in the gear figure):</p>
            <ul className="keep">
              <li><b>Ring fixed, <M p="">{t`\omega_2 = 0`}</M></b> Then <M>Q</M> is at rest, so <M p=".">{t`Z_3 = Q`}</M> The arm turns with <M p=",">{t`\omega_{\text{Arm}} = \omega_1\frac{R_1}{R_1 + R_2}`}</M> much more slowly than the sun. The planet even turns backwards: <M>{t`\omega_3 = -\omega_1R_1/(R_2 - R_1)`}</M> (in the figure <M p=").">{t`-0.4`}</M> This is your “first transmission ratio”.</li>
              <li><b>Sun fixed, <M p="">{t`\omega_1 = 0`}</M></b> Then <M>P</M> is at rest, <M p=":">{t`Z_3 = P`}</M> the planet rolls on the standing sun.</li>
              <li><b><M p="">{t`\omega_2R_2 = \omega_1R_1`}</M></b> – your question in the notes. Then <M p=",">{t`v_P = v_Q`}</M> and the formula gives <M p=".">{t`\omega_3 = 0`}</M> The planet does not turn, it only shifts: all its points are equally fast (a <a href="#translation">translation</a> along a circle, like a Ferris-wheel gondola). The arrow tips lie on a parallel to the line <M p=";">{t`QPO`}</M> <M>{t`Z_3`}</M> is “at infinity” – the theorem of the instantaneous centre only holds for <M p=".">{t`\v\omega\neq\v 0`}</M> The equation <M>{t`Z_3P\cdot\omega_3 = v_P`}</M> then has no solution.</li>
              <li><b><M p="">{t`\omega_2 < 0`}</M></b> The ring turns against the sun. The second term of the formula becomes negative, so <M>{t`\omega_{\text{Arm}}`}</M> is smaller than with the ring fixed – that is what your note “<M p="”">{t`\omega_2 < 0 \Rightarrow \omega_{\text{Arm}}\downarrow`}</M> means. At <M>{t`\omega_2 = -\omega_1R_1/R_2`}</M> the arm stands still; even smaller <M>{t`\omega_2`}</M> make it turn backwards.</li>
            </ul>
          </>}
        />
        <Box keep kind="supplement" title={<T de="Übersetzungsverhältnis" en={<>Transmission ratio (<span lang="de">Übersetzungsverhältnis</span>)</>} />}>
          <T
            de={<p>Das Wort steht in deiner Notiz, nicht im gedruckten Skript. Das Übersetzungsverhältnis ist das Verhältnis der Winkelgeschwindigkeiten von Antrieb und Abtrieb: <M p=".">{t`i = \omega_{\text{an}}/\omega_{\text{ab}}`}</M> Bei festem Hohlrad treibt man die Sonne an und nimmt die Drehung am Arm ab:</p>}
            en={<p>The word is in your note, not in the printed notes. The transmission ratio is the ratio of the angular velocities of input and output: <M p=".">{t`i = \omega_{\text{in}}/\omega_{\text{out}}`}</M> With the ring fixed, the sun is driven and the turning is taken off at the arm:</p>}
          />
          <MD>{t`i = \frac{\omega_1}{\omega_{\text{Arm}}} = \frac{R_1 + R_2}{R_1} = 1 + \frac{R_2}{R_1}.`}</MD>
          <T
            de={<p>Für das Getriebe im Bild (<M p=",">{t`R_1 = 0{,}8`}</M> <M p="):">{t`R_2 = 2{,}8`}</M> <M p=".">{t`i = 4{,}5`}</M> Die Sonne dreht viereinhalbmal, bis der Arm einmal herum ist – so wird aus einem schnellen Motor eine langsame, kräftige Drehung. Weil die Zähne gleich gross sind, kann man auch die Zähne zählen: <M p=".">{t`1 + 56/16 = 4{,}5`}</M></p>}
            en={<p>For the gear in the figure (<M p=",">{t`R_1 = 0.8`}</M> <M p="):">{t`R_2 = 2.8`}</M> <M p=".">{t`i = 4.5`}</M> The sun turns four and a half times while the arm goes round once – this is how a fast motor becomes a slow, strong turning. Since the teeth are all the same size, you can also count teeth: <M p=".">{t`1 + 56/16 = 4.5`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section long id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«Der Planet dreht sich mit dem Arm mit, also <M p="»">{t`\omega_3 = \omega_{\text{Arm}}`}</M></>} en={<>“The planet turns along with the arm, so <M p="”">{t`\omega_3 = \omega_{\text{Arm}}`}</M></>} />}>
          <T de={<>Nein. Bei festem Hohlrad ist im Bild <M p=",">{t`\omega_{\text{Arm}} \approx 0{,}22`}</M> aber <M p=":">{t`\omega_3 = -0{,}4`}</M> Der Planet dreht sich sogar in die andere Richtung. Gleich sind sie nur, wenn sich alles zusammen dreht (<M p=").">{t`\omega_1 = \omega_2`}</M></>} en={<>No. With the ring fixed the figure has <M p=",">{t`\omega_{\text{Arm}} \approx 0.22`}</M> but <M p=":">{t`\omega_3 = -0.4`}</M> the planet even turns the other way. They are equal only when everything turns together (<M p=").">{t`\omega_1 = \omega_2`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\omega_3`}</M> ist die Drehung des Planeten auf dem Arm.»</>} en={<>“<M>{t`\omega_3`}</M> is the planet’s turning on the arm.”</>} />}>
          <T de={<><M>{t`\omega_3`}</M> ist die Winkelgeschwindigkeit des Planeten gegenüber dem Boden – die seiner Drehung um <M p=".">{t`Z_3`}</M> Wer auf dem Arm mitfährt, sieht ihn mit <M>{t`\omega_3 - \omega_{\text{Arm}}`}</M> drehen (Ergänzung).</>} en={<><M>{t`\omega_3`}</M> is the planet’s angular velocity relative to the ground – that of its turning about <M p=".">{t`Z_3`}</M> Someone riding on the arm sees it turn with <M>{t`\omega_3 - \omega_{\text{Arm}}`}</M> (supplement).</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Der Planet dreht sich um seinen Mittelpunkt <M p="»">A</M></>} en={<>“The planet turns about its centre <M p="”">A</M></>} />}>
          <T de={<><M>A</M> bewegt sich ja mit dem Arm: <M p=".">{t`v_A = \omega_{\text{Arm}}L`}</M> Momentan dreht sich der Planet um <M p=",">{t`Z_3`}</M> den einzigen ruhenden Punkt. Bei festem Hohlrad ist das der Berührpunkt <M p=",">Q</M> genau wie beim <a href="#ebene-bewegung">rollenden Rad</a>.</>} en={<><M>A</M> moves with the arm: <M p=".">{t`v_A = \omega_{\text{Arm}}L`}</M> At this instant the planet turns about <M p=",">{t`Z_3`}</M> its only point at rest. With the ring fixed that is the contact point <M p=",">Q</M> just like for the <a href="#ebene-bewegung">rolling wheel</a>.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Die Formel gilt nur, wenn sich alles in dieselbe Richtung dreht.»" en="“The formula only holds when everything turns the same way.”" />}>
          <T de={<>Sie gilt für alle Vorzeichen – solange man alle <M>\omega</M> im selben Drehsinn zählt (hier: Gegenuhrzeigersinn positiv). Ein negatives Resultat heisst einfach: Dieses Teil dreht im Uhrzeigersinn.</>} en={<>It holds for all signs – as long as every <M>\omega</M> is counted in the same sense (here: counter-clockwise positive). A negative result simply means: this part turns clockwise.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="merke" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Rollen in <M>P</M> und <M p=":">Q</M> <M p=",">{t`v_P = \omega_1R_1`}</M> <M p=".">{t`v_Q = \omega_2R_2`}</M></li>
              <li>Momentanzentrum des Planeten: <M p=".">{t`\omega_3 = \frac{\omega_2R_2 - \omega_1R_1}{R_2 - R_1}`}</M></li>
              <li><M>A</M> ist die Mitte von <M p=":">{t`PQ`}</M> <M p=",">{t`v_A = \tfrac12(v_P + v_Q)`}</M> und <M p=".">{t`\omega_{\text{Arm}} = v_A/L`}</M></li>
            </ul>}
            en={<ul>
              <li>Rolling at <M>P</M> and <M p=":">Q</M> <M p=",">{t`v_P = \omega_1R_1`}</M> <M p=".">{t`v_Q = \omega_2R_2`}</M></li>
              <li>Instantaneous centre of the planet: <M p=".">{t`\omega_3 = \frac{\omega_2R_2 - \omega_1R_1}{R_2 - R_1}`}</M></li>
              <li><M>A</M> is the midpoint of <M p=":">{t`PQ`}</M> <M p=",">{t`v_A = \tfrac12(v_P + v_Q)`}</M> and <M p=".">{t`\omega_{\text{Arm}} = v_A/L`}</M></li>
            </ul>}
          />
          <MD>{t`\omega_{\text{Arm}} = \omega_2\,\frac{R_2}{R_2 + R_1} + \omega_1\,\frac{R_1}{R_2 + R_1}`}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Ohne Rutschen in den Berührpunkten (<a href="#rollen">Rollen</a>) gäbe es <M>{t`v_P = \omega_1R_1`}</M> nicht. Der Punkt <M>{t`Z_3`}</M> ist das <a href="#ebene-bewegung">Momentanzentrum</a> des Planeten, gefunden wie dort mit den Pfeilspitzen. Und dass die Geschwindigkeiten auf einem starren Körper so zusammenpassen, ist am Ende wieder die <a href="#sdpg">SdpG</a> und die <a href="#allgemein">Grundgleichung</a>.</p>}
          en={<p className="connections"><b>Connections:</b> without slipping at the contact points (<a href="#rollen">rolling</a>) there would be no <M p=".">{t`v_P = \omega_1R_1`}</M> The point <M>{t`Z_3`}</M> is the planet’s <a href="#ebene-bewegung">instantaneous centre</a>, found as there with the arrow tips. And that the velocities on a rigid body fit together like this is, in the end, again the <a href="#sdpg">SdpG</a> and the <a href="#allgemein">fundamental equation</a>.</p>}
        />
      </Section>
    </article>
  );
}
