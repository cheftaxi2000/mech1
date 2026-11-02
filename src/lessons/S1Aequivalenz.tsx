import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { EquivExplorer, ProofFig, SeesawExplorer } from '../viz/statik/StatikFigures';

const t = String.raw;

export default function S1Aequivalenz() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die Statik fragt nach Kräften an Körpern, die sich <b>nicht</b> bewegen. Trotzdem rechnet das Skript weiter mit der <a href="#leistung-kraeftegruppe">Leistung</a>: Man stellt sich eine kleine, gedachte Bewegung vor und fragt, welche Leistung die Kräfte dabei hätten. Daraus folgt der wichtigste Begriff des Kapitels: Zwei Kräftegruppen sind <b>statisch äquivalent</b>, wenn sie bei jeder Bewegung dieselbe Leistung haben.</p>}
        en={<p className="lede">Statics asks about forces on bodies that do <b>not</b> move. Even so, the notes keep working with the <a href="#leistung-kraeftegruppe">power</a>: one imagines a small, thought-up motion and asks what power the forces would have. This leads to the key idea of the chapter: two groups of forces are <b>statically equivalent</b> if they have the same power for every motion.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Du willst wissen, ob eine Wippe mit zwei Kindern im Gleichgewicht ist. Statt sie loszulassen, stupst du sie ganz leicht an. Geht das eine Kind hoch und das andere runter, ohne dass Energie dazukommt oder verloren geht, dann bleibt die Wippe auch ohne Stupsen stehen. «Keine Leistung bei jedem kleinen Stupser» ist dasselbe wie «Gleichgewicht».</p>}
          en={<p>You want to know whether a seesaw with two children is balanced. Instead of letting go, you give it a very small nudge. If one child goes up and the other down without energy being added or lost, the seesaw also stays put without the nudge. “No power for every small nudge” is the same as “equilibrium”.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="statik" title={<T de="1. Statik: Gleichgewicht über die Leistung" en="1. Statics: equilibrium via the power" />}>
        <Box kind="lecture" src={<Src p={37} />} title={<T de="6 Statik" en={<>6 Statics (<span lang="de">Statik</span>)</>} />}>
          <T
            de={<>
              <p>Kräfte an ruhenden Systemen (<M>{t`\v v = 0`}</M> für alle Punkte!). «Dennoch sprechen wir hauptsächlich über ‹Leistung›: Ruhend <M>\leftrightarrow</M> Kräfte im ‹Gleichgewicht›.» Aussage zu Gleichgewicht <M>\leftrightarrow</M> Aussage über Leistung.</p>
              <p>Wippe (Schaukel, Waage): <M>{t`F_A`}</M> im Abstand <M p=",">a</M> <M>{t`F_B`}</M> im Abstand <M p=",">b</M> Drehung <M p=":">\omega</M></p>
            </>}
            en={<>
              <p>Forces on systems at rest (<M>{t`\v v = 0`}</M> for all points!). “Even so we mainly talk about ‘power’: at rest <M>\leftrightarrow</M> forces in ‘equilibrium’.” Statement about equilibrium <M>\leftrightarrow</M> statement about power.</p>
              <p>Seesaw (swing, scale; <span lang="de">Wippe, Schaukel, Waage</span>): <M>{t`F_A`}</M> at distance <M p=",">a</M> <M>{t`F_B`}</M> at distance <M p=",">b</M> rotation <M p=":">\omega</M></p>
            </>}
          />
          <MD>{t`P = -F_A\cdot\omega\cdot a + F_B\cdot\omega\cdot b = 0 \quad\Rightarrow\quad F_A = \frac{b}{a}\,F_B`}</MD>
          <T de={<p>Hebel, um den Winkel <M>\alpha</M> geneigt:</p>} en={<p>Lever (<span lang="de">Hebel</span>), inclined by the angle <M p=":">\alpha</M></p>} />
          <MD>{t`P = -F_B\,\omega\,b\sin\alpha + F_A\,\omega\,a\sin\alpha \quad\Rightarrow\quad F_A = \frac{b}{a}\,F_B`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b></p>
            <ol className="keep">
              <li>Die Wippe steht still. Wir drehen sie in Gedanken mit einer kleinen Winkelgeschwindigkeit <M p=".">\omega</M> Das Ende bei <M>{t`F_B`}</M> sinkt mit der Geschwindigkeit <M p=",">{t`\omega b`}</M> in Richtung der Kraft: Leistung <M p=".">{t`+F_B\,\omega b`}</M></li>
              <li>Das Ende bei <M>{t`F_A`}</M> steigt mit <M p=",">{t`\omega a`}</M> gegen die Kraft: Leistung <M p=".">{t`-F_A\,\omega a`}</M></li>
              <li>Die Wippe bleibt von selbst stehen, wenn die Summe null ist. Dann ist <M p=":">{t`F_A a = F_B b`}</M> das Hebelgesetz, ohne ein Wort über Momente.</li>
              <li>Beim schrägen Hebel bewegen sich die Enden nicht mehr senkrecht. Nur der senkrechte Anteil <M>{t`\omega a\sin\alpha`}</M> der Geschwindigkeit zählt. Derselbe Faktor <M>{t`\sin\alpha`}</M> steht in beiden Gliedern und kürzt sich weg.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b></p>
            <ol className="keep">
              <li>The seesaw is at rest. In our mind we turn it with a small angular velocity <M p=".">\omega</M> The end at <M>{t`F_B`}</M> goes down with the speed <M p=",">{t`\omega b`}</M> in the direction of the force: power <M p=".">{t`+F_B\,\omega b`}</M></li>
              <li>The end at <M>{t`F_A`}</M> goes up with <M p=",">{t`\omega a`}</M> against the force: power <M p=".">{t`-F_A\,\omega a`}</M></li>
              <li>The seesaw stays put by itself if the sum is zero. Then <M p=":">{t`F_A a = F_B b`}</M> the law of the lever, without a word about moments.</li>
              <li>On the inclined lever the ends no longer move vertically. Only the vertical part <M>{t`\omega a\sin\alpha`}</M> of the velocity counts. The same factor <M>{t`\sin\alpha`}</M> appears in both terms and cancels.</li>
            </ol>
          </>}
        />
        <SeesawExplorer />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="aequivalenz" title={<T de="2. Statische Äquivalenz" en="2. Static equivalence" />}>
        <Box kind="lecture" src={<Src p={37} fig="Fig. 6.1, 6.2" />} title={<T de="6.1 Statische Äquivalenz von Kräftegruppen" en={<>6.1 Static equivalence of groups of forces (<span lang="de">Statische Äquivalenz</span>)</>} />}>
          <MD>{t`P\{G\} = P\{G^*\}\quad\forall\ \text{${tr('Starrkörperbewegungen', 'rigid-body motions')}}`}</MD>
          <T
            de={<>
              <p><M p=":">{t`G, G^*`}</M> Gruppen von Kräften am (starren) Körper <M p=".">K</M></p>
              <p>Figur 6.1 «statisch äquivalente Gruppe»: ein Balken mit <M>{t`\v F_1`}</M> in <M>{t`A_1`}</M> und <M>{t`\v F_2`}</M> in <M>{t`A_2`}</M> (beide nach unten, Abstand <M>a</M> von der Mitte <M p=")">A</M> und <M>{t`\v R = \v F_1 + \v F_2`}</M> in <M p=".">A</M> Handschriftlich: «Man muss für <b>alle</b> Starrkörperbewegungen sagen können, dass die Gruppen statisch äquivalent sind.»</p>
              <p>Figur 6.2 «statisch NICHT äquivalente Gruppe»: dasselbe, aber <M>{t`\v F_2^*`}</M> unter 45°. Handschriftlich: «Es reicht ein Gegenbeispiel zu finden. Beispiel hier Translation.»</p>
            </>}
            en={<>
              <p><M p=":">{t`G, G^*`}</M> groups of forces on the (rigid) body <M p=".">K</M></p>
              <p>Fig. 6.1 “statically equivalent group”: a beam with <M>{t`\v F_1`}</M> at <M>{t`A_1`}</M> and <M>{t`\v F_2`}</M> at <M>{t`A_2`}</M> (both down, distance <M>a</M> from the middle <M p=")">A</M> and <M>{t`\v R = \v F_1 + \v F_2`}</M> at <M p=".">A</M> Handwritten: “One must be able to say for <b>all</b> rigid-body motions that the groups are statically equivalent.”</p>
              <p>Fig. 6.2 “statically NOT equivalent group”: the same, but <M>{t`\v F_2^*`}</M> at 45°. Handwritten: “It is enough to find a counterexample. Example here: translation.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Was heisst das?</b> Zwei Kräftegruppen sind statisch äquivalent, wenn der starre Körper sie nicht unterscheiden kann: Wie auch immer er sich bewegt (schieben, drehen, beides), beide Gruppen hätten dieselbe Leistung. Für die Wirkung auf den <b>starren</b> Körper darf man dann die eine durch die andere ersetzen.</p>
            <p className="keep">Bei Figur 6.1 klappt das: Schiebt man nach unten, leisten beide gleich viel; dreht man um <M p=",">A</M> hebt sich <M>{t`\v F_1`}</M> gegen <M>{t`\v F_2`}</M> auf, und <M>{t`\v R`}</M> in <M>A</M> leistet nichts. Bei Figur 6.2 genügt eine einzige Bewegung, für die es nicht klappt: das Schieben in x-Richtung. Dann leistet <M>{t`\v F_2^*`}</M> etwas (es hat einen x-Anteil), <M>{t`\v R`}</M> nicht.</p>
          </>}
          en={<>
            <p className="keep"><b>What does it mean?</b> Two groups of forces are statically equivalent if the rigid body cannot tell them apart: however it moves (push, turn, both), both groups would have the same power. For the effect on the <b>rigid</b> body one may then replace one by the other.</p>
            <p className="keep">In Fig. 6.1 this works: push downwards and both deliver the same; turn about <M p=",">A</M> and <M>{t`\v F_1`}</M> cancels <M p=",">{t`\v F_2`}</M> while <M>{t`\v R`}</M> at <M>A</M> delivers nothing. In Fig. 6.2 a single motion for which it fails is enough: pushing in the x-direction. Then <M>{t`\v F_2^*`}</M> delivers something (it has an x-part), <M>{t`\v R`}</M> does not.</p>
          </>}
        />
        <EquivExplorer />
        <Box kind="misconception" title={<T de="«Gleiche Resultierende heisst äquivalent»" en="“Same resultant means equivalent”" />}>
          <T
            de={<p>Nein. Zwei gleich grosse Kräfte nach unten an den Enden eines Balkens und dieselben zwei Kräfte beide an einem Ende haben dieselbe Resultierende, drehen den Balken aber verschieden. Es braucht zusätzlich gleiche Momente, siehe Satz unten.</p>}
            en={<p>No. Two equal forces downwards at the ends of a beam and the same two forces both at one end have the same resultant, but they turn the beam differently. Equal moments are needed as well, see the theorem below.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="satz" title={<T de="3. Der Satz: Resultierende und Moment" en="3. The theorem: resultant and moment" />}>
        <Box kind="lecture" src={<Src p={37} />} title={<T de="Theorem zur statischen Äquivalenz" en={<>Theorem on static equivalence (<span lang="de">Theorem zur statischen Äquivalenz</span>)</>} />}>
          <T
            de={<p>«Zwei Kräftegruppen <M>{t`\{G\}`}</M> und <M>{t`\{G^*\}`}</M> am Körper <M>K</M> sind dann und nur dann statisch äquivalent, wenn ihre <b>Resultierenden</b> und ihre <b>Gesamtmomente</b> bezüglich eines beliebigen Bezugspunktes gleich sind.»</p>}
            en={<p>“Two groups of forces <M>{t`\{G\}`}</M> and <M>{t`\{G^*\}`}</M> on the body <M>K</M> are statically equivalent if and only if their <b>resultants</b> and their <b>total moments</b> about an arbitrary reference point are equal.”</p>}
          />
          <T de={<p><b>Beweis</b> (Bezugspunkt <M p=",">O</M> Bewegung <M p="):">{t`\{\v v_O, \v\omega\}`}</M></p>} en={<p><b>Proof</b> (reference point <M p=",">O</M> motion <M p="):">{t`\{\v v_O, \v\omega\}`}</M></p>} />
          <MD>{t`\begin{aligned}
P(G) &= \v v_O\cdot\v R + \v\omega\cdot\v M_O\\
P(G^*) &= \v v_O\cdot\v R^* + \v\omega\cdot\v M_O^*\\
P(G) - P(G^*) &= \v v_O\cdot\underbrace{(\v R - \v R^*)}_{0} + \v\omega\cdot\underbrace{(\v M_O - \v M_O^*)}_{0} \overset{!}{=} 0\quad\forall\,\v v_O, \v\omega
\end{aligned}`}</MD>
          <MD>{t`\v R = \v R^*,\qquad \v M_O = \v M_O^*`}</MD>
          <T de={<p>Handschriftlich: «<M>{t`\{\v R, \v M_O\}`}</M> charakterisiert die ‹Dyname› für <M p=".">{t`\{G\}`}</M>»</p>} en={<p>Handwritten: “<M>{t`\{\v R, \v M_O\}`}</M> characterises the ‘Dyname’ of <M p=".">{t`\{G\}`}</M>”</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man den Beweis.</b> Er benutzt die Formel <M>{t`P = \v R\cdot\v v_O + \v M_O\cdot\v\omega`}</M> aus der <a href="#leistung-kraeftegruppe">letzten Lektion</a>.</p>
            <ol className="keep">
              <li>Man zieht die zwei Leistungen voneinander ab. Übrig bleiben zwei Skalarprodukte mit den Differenzen <M>{t`\v R - \v R^*`}</M> und <M p=".">{t`\v M_O - \v M_O^*`}</M></li>
              <li>Das soll für <b>jede</b> Bewegung null sein. Wähle zuerst eine reine Verschiebung (<M p=")">{t`\v\omega = 0`}</M> Dann bleibt <M p=".">{t`\v v_O\cdot(\v R - \v R^*) = 0`}</M> Ein Vektor, dessen Skalarprodukt mit jedem <M>{t`\v v_O`}</M> null ist, ist der Nullvektor: <M p=".">{t`\v R = \v R^*`}</M></li>
              <li>Wähle dann eine reine Drehung um <M>O</M> (<M p=")">{t`\v v_O = 0`}</M> Genauso folgt <M p=".">{t`\v M_O = \v M_O^*`}</M></li>
              <li>Umgekehrt: Sind beide gleich, ist die Differenz für jede Bewegung null. Also gilt «dann und nur dann».</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the proof.</b> It uses the formula <M>{t`P = \v R\cdot\v v_O + \v M_O\cdot\v\omega`}</M> from the <a href="#leistung-kraeftegruppe">previous lesson</a>.</p>
            <ol className="keep">
              <li>Subtract the two powers. What remains are two dot products with the differences <M>{t`\v R - \v R^*`}</M> and <M p=".">{t`\v M_O - \v M_O^*`}</M></li>
              <li>This must be zero for <b>every</b> motion. First choose a pure translation (<M p=")">{t`\v\omega = 0`}</M> Then <M>{t`\v v_O\cdot(\v R - \v R^*) = 0`}</M> remains. A vector whose dot product with every <M>{t`\v v_O`}</M> is zero is the zero vector: <M p=".">{t`\v R = \v R^*`}</M></li>
              <li>Then choose a pure rotation about <M>O</M> (<M p=")">{t`\v v_O = 0`}</M> In the same way <M p=".">{t`\v M_O = \v M_O^*`}</M></li>
              <li>Conversely: if both are equal, the difference is zero for every motion. Hence “if and only if”.</li>
            </ol>
          </>}
        />
        <StepPlayer
          label={tr('Animation: Beweis mit zwei Testbewegungen', 'Animation: proof with two test motions')}
          steps={[
            { ms: 600, holdMs: 2600, caption: <T de={<>Oben die Gruppe <M p=",">{t`\{G\}`}</M> unten <M p=":">{t`\{G^*\}`}</M> die Resultierende in <M>O</M> und ein Kräftepaar mit demselben Moment. Sind sie äquivalent?</>} en={<>Top: the group <M p=",">{t`\{G\}`}</M> bottom: <M p=":">{t`\{G^*\}`}</M> the resultant at <M>O</M> and a couple with the same moment. Are they equivalent?</>} /> },
            { ms: 1200, holdMs: 3200, caption: <T de={<>Testbewegung 1: alles gleich schnell nach rechts (<M p=")">{t`\v\omega = 0`}</M> Die Leistung ist <M p=".">{t`\v v_O\cdot\v R`}</M> Gleich für alle <M>{t`\v v_O`}</M> nur wenn <M p=".">{t`\v R = \v R^*`}</M></>} en={<>Test motion 1: everything moves right at the same speed (<M p=")">{t`\v\omega = 0`}</M> The power is <M p=".">{t`\v v_O\cdot\v R`}</M> Equal for all <M>{t`\v v_O`}</M> only if <M p=".">{t`\v R = \v R^*`}</M></>} /> },
            { ms: 1200, holdMs: 3200, caption: <T de={<>Testbewegung 2: Drehung um <M>O</M> (<M p=")">{t`\v v_O = 0`}</M> Die Leistung ist <M p=".">{t`\v\omega\cdot\v M_O`}</M> Gleich für alle <M>{t`\v\omega`}</M> nur wenn <M p=".">{t`\v M_O = \v M_O^*`}</M></>} en={<>Test motion 2: rotation about <M>O</M> (<M p=")">{t`\v v_O = 0`}</M> The power is <M p=".">{t`\v\omega\cdot\v M_O`}</M> Equal for all <M>{t`\v\omega`}</M> only if <M p=".">{t`\v M_O = \v M_O^*`}</M></>} /> },
            { ms: 700, holdMs: 3200, caption: <T de={<>Jede Starrkörperbewegung ist Schieben plus Drehen. Gleiche Resultierende und gleiches Moment genügen also für alle Bewegungen.</>} en={<>Every rigid-body motion is a push plus a turn. So equal resultant and equal moment are enough for all motions.</>} /> },
          ]}
        >
          {(step, tt) => <ProofFig step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p>Das Paar <M>{t`\{\v R, \v M_O\}`}</M> heisst <De en="the pair of resultant and moment">Dyname</De> in <M p=".">O</M> Es ist das Gegenstück zur <a href="#zentralachse">Kinemate</a> <M p=":">{t`\{\v v_O, \v\omega\}`}</M> Die Kinemate beschreibt die Bewegung eines starren Körpers vollständig, die Dyname die Wirkung einer Kräftegruppe auf ihn. Mehr dazu in <a href="#dyname">Moment einer Kräftegruppe und Dyname</a>.</p>}
          en={<p>The pair <M>{t`\{\v R, \v M_O\}`}</M> is called the <De en="the pair of resultant and moment">Dyname</De> at <M p=".">O</M> It is the counterpart of the <a href="#zentralachse">Kinemate</a> <M p=":">{t`\{\v v_O, \v\omega\}`}</M> the Kinemate describes the motion of a rigid body completely, the Dyname the effect of a group of forces on it. More in <a href="#dyname">Moment of a group and Dyname</a>.</p>}
        />
        <Box kind="misconception" title={<T de="«Äquivalent heisst, die Kräfte machen im Körper dasselbe»" en="“Equivalent means the forces do the same inside the body”" />}>
          <T
            de={<p>Nur für den <b>starren</b> Körper als Ganzes. Ein Balken, der an den Enden belastet wird, biegt sich anders durch als einer mit der ganzen Last in der Mitte, und ein Mechanismus reagiert ganz anders (siehe <a href="#spezielle-kraeftegruppen">Spezielle Kräftegruppen</a>, Fig. 6.9). Äquivalenz ersetzt die Kräfte nur für die Frage nach Bewegung und Gleichgewicht des starren Körpers.</p>}
            en={<p>Only for the <b>rigid</b> body as a whole. A beam loaded at its ends bends differently from one with the whole load in the middle, and a mechanism reacts quite differently (see <a href="#spezielle-kraeftegruppen">Special groups of forces</a>, Fig. 6.9). Equivalence replaces the forces only for the question of motion and equilibrium of the rigid body.</p>}
          />
        </Box>
      </Section>
    </article>
  );
}
