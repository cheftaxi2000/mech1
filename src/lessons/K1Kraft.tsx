import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { ForceAnim } from '../viz/force/ForceAnim';
import { resultantScene } from '../viz/force/resultantScene';
import { See } from '../viz/force/kfKit';
import { K1Effects } from '../viz/force/K1Effects';
import { K1Matchbox } from '../viz/force/K1Matchbox';
import { K1Newton } from '../viz/force/K1Newton';
import { K1Contact } from '../viz/force/K1Contact';
import { K1Fig41 } from '../viz/force/K1Fig41';
import { K1Resultant } from '../viz/force/K1Resultant';

const t = String.raw;

export default function K1Kraft() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Mit Seite 29 beginnt das Kapitel «Kräfte». Die Seite ist kurz, aber sie legt fest, wie wir in der ganzen Statik mit Kräften umgehen: Eine Kraft ist nicht bloss ein Pfeil, sondern ein Pfeil, der an einem bestimmten Punkt angreift.</p>}
        en={<p className="lede">With page 29 the chapter “Kräfte” (forces) begins. The page is short, but it fixes how we treat forces in all of statics: a force is not just an arrow, but an arrow that acts at one particular point.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Eine Kraft sieht man nie – man sieht nur, was sie bewirkt. Du schiebst einen Einkaufswagen an: Er wird schneller. Du drückst einen Schwamm zusammen: Er wird kleiner. Mehr kann eine Kraft nicht: Sie ändert die Geschwindigkeit eines Körpers oder seine Gestalt. Und wenn sich mehrere Kräfte genau ausgleichen, passiert gar nichts: Der Wagen bleibt stehen, obwohl an ihm gedrückt wird. Diesen Fall nennt das Skript «Gleichgewicht», und ihn untersucht die Statik.</p>}
          en={<p>You never see a force – you only see what it does. You push a shopping trolley: it gets faster. You squeeze a sponge: it gets smaller. A force can do no more than that: it changes the velocity of a body, or its shape. And when several forces balance exactly, nothing happens at all: the trolley stays where it is although it is being pushed. The notes call this case <De en="equilibrium">Gleichgewicht</De>, and statics studies it.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="wirkung" title={<T de="1. Was Kräfte tun" en="1. What forces do" />}>
        <Box kind="lecture" src={<Src p={29} />} title={<T de="Eigenschaften von Kräften" en={<>Properties of forces (<span lang="de">Eigenschaften</span>)</>} />}>
          <T
            de={<>
              <ul>
                <li>Beschreiben Wechselwirkung zwischen materiellen Systemen.</li>
                <li>Ursachen für Veränderung von <M>{t`\v v`}</M> oder Veränderung der Gestalt <span className="kf-note">(im Skript unterstrichen: <M>{t`\v v`}</M> und «Gestalt»)</span>.</li>
                <li>Statik: Wie sollen Kräfte sein, damit ein System in Ruhe bleibt? <span className="kf-note">(handschriftlich:)</span> <M>{t`\to`}</M> <em>Gleichgewicht</em></li>
              </ul>
            </>}
            en={<>
              <ul>
                <li>Describe the interaction (<span lang="de">Wechselwirkung</span>) between material systems.</li>
                <li>Causes of a change of <M>{t`\v v`}</M> or of a change of shape (<span lang="de">Gestalt</span>) <span className="kf-note">(underlined in the notes: <M>{t`\v v`}</M> and “shape”)</span>.</li>
                <li>Statics: how must forces be so that a system stays at rest? <span className="kf-note">(handwritten:)</span> <M>{t`\to`}</M> <span lang="de">Gleichgewicht</span> (equilibrium)</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>«Wechselwirkung»: Zwei Körper wirken aufeinander ein, wie bei einem Händedruck – beide spüren etwas. Wie genau, regelt die <a href="#reaktionsprinzip">nächste Lektion</a>.</li>
              <li>«Veränderung von <M>{t`\v v`}</M>»: <M>{t`\v v`}</M> ist die Geschwindigkeit (Kapitel 2). Eine Kraft kann einen Körper schneller, langsamer oder in eine andere Richtung bringen.</li>
              <li>«Veränderung der Gestalt»: Der Körper verformt sich – ein Schwamm wird kleiner, eine Feder wird länger.</li>
              <li>«Statik» fragt umgekehrt: Welche Kräfte müssen es sein, damit sich <em>nichts</em> ändert? Die handschriftliche Antwort ist nur ein Wort, «Gleichgewicht». Wie man es ausrechnet, kommt später – diese Seite legt zuerst die Sprache fest, in der man über Kräfte spricht.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>“Interaction”: two bodies act on each other, like a handshake – both feel something. How exactly is settled in the <a href="#reaktionsprinzip">next lesson</a>.</li>
              <li>“Change of <M>{t`\v v`}</M>”: <M>{t`\v v`}</M> is the velocity (chapter 2). A force can make a body faster, slower, or send it in another direction.</li>
              <li>“Change of shape”: the body deforms – a sponge gets smaller, a spring gets longer.</li>
              <li>“Statics” asks the other way round: which forces must there be so that <em>nothing</em> changes? The handwritten answer is just one word, “<span lang="de">Gleichgewicht</span>”. How to calculate it comes later – this page first fixes the language in which we talk about forces.</li>
            </ol>
          </>}
        />
        <See>
          <T
            de={<>Schiebe links und rechts gleich stark: Der Wagen bleibt stehen. Beim Schwamm siehst du das Andere: Auch wenn er an seinem Platz bleibt, ändert sich seine Gestalt.</>}
            en={<>Push equally hard from the left and from the right: the trolley stays put. The sponge shows the other effect: even if it stays in place, its shape changes.</>}
          />
        </See>
        <K1Effects />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="drei" title={<T de="2. Eine Kraft braucht drei Angaben" en="2. A force needs three pieces of information" />}>
        <Box kind="lecture" src={<Src p={29} />} title={<T de="Mathematische Beschreibung" en={<>Mathematical description (<span lang="de">Mathematische Beschreibung</span>)</>} />}>
          <T
            de={<>
              <p><M>{t`\to`}</M> Charakterisierung der Wirkung durch Richtung, Betrag und Angriffspunkt.</p>
              <p><M>{t`\Rightarrow`}</M> Kraft: punktgebundener Vektor <M p=".">{t`\{A\,|\,\v F\}`}</M></p>
              <p className="kf-note">Handschriftliche Pfeile im Skript: auf <M>{t`\v F`}</M> zeigt «Vektor <M>{t`\v F`}</M>», auf <M>A</M> zeigt «Angriffspunkt «<M>A</M>»».</p>
            </>}
            en={<>
              <p><M>{t`\to`}</M> Characterisation of the effect by direction (<span lang="de">Richtung</span>), magnitude (<span lang="de">Betrag</span>) and point of application (<span lang="de">Angriffspunkt</span>).</p>
              <p><M>{t`\Rightarrow`}</M> Force: point-bound vector (<span lang="de">punktgebundener Vektor</span>) <M p=".">{t`\{A\,|\,\v F\}`}</M></p>
              <p className="kf-note">Handwritten arrows in the notes: one points at <M>{t`\v F`}</M> and says “vector <M>{t`\v F`}</M>”, one points at <M>A</M> and says “point of application <M>A</M>”.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p>Stell dir vor, du sollst einem Freund am Telefon erklären, wie du eine Kiste schiebst. Du musst drei Dinge sagen: <b>wohin</b> du schiebst (Richtung), <b>wie fest</b> (Betrag) und <b>wo</b> an der Kiste (Angriffspunkt). Fehlt eine Angabe, weiss er nicht, was passiert.</p>
            <p>Die ersten beiden Angaben zusammen sind ein gewöhnlicher Vektor <M p=",">{t`\v F`}</M> wie auf <a href="#vektoren">Seite 5</a>: Er hat eine Richtung und eine Länge. Der Angriffspunkt <M>A</M> kommt dazu. Deshalb heisst die Kraft «punktgebundener Vektor»: ein Vektor, der an einen Punkt gebunden ist.</p>
            <p><b>So liest man <M p=":">{t`\{A\,|\,\v F\}`}</M></b></p>
            <ol>
              <li>Die geschweifte Klammer hält zusammen, was zusammengehört: Punkt und Vektor sind ein Paar, nicht zwei getrennte Dinge.</li>
              <li>Links vom senkrechten Strich steht der Punkt <M p=",">A</M> der Ort, an dem die Kraft angreift: «wo?».</li>
              <li>Rechts steht der Vektor <M p=",">{t`\v F`}</M> Richtung und Länge: «wohin, wie stark?». Seine Länge, der Betrag, heisst <M p=".">{t`|\v F|`}</M></li>
              <li>Darum sind <M>{t`\{A_1\,|\,\v F\}`}</M> und <M>{t`\{A_2\,|\,\v F\}`}</M> zwei <em>verschiedene</em> Kräfte, auch wenn der Vektor <M>{t`\v F`}</M> derselbe ist.</li>
            </ol>
          </>}
          en={<>
            <p>Imagine you have to explain to a friend on the phone how you push a box. You have to say three things: <b>which way</b> you push (direction), <b>how hard</b> (magnitude), and <b>where</b> on the box (point of application). If one is missing, he cannot know what happens.</p>
            <p>The first two together are an ordinary vector <M p=",">{t`\v F`}</M> as on <a href="#vektoren">page 5</a>: it has a direction and a length. The point of application <M>A</M> is added. That is why a force is a “point-bound vector” (<span lang="de">punktgebundener Vektor</span>): a vector that is tied to a point.</p>
            <p><b>How to read <M p=":">{t`\{A\,|\,\v F\}`}</M></b></p>
            <ol>
              <li>The curly bracket holds together what belongs together: point and vector are a pair, not two separate things.</li>
              <li>To the left of the vertical bar stands the point <M p=",">A</M> the place where the force acts: “where?”.</li>
              <li>To the right stands the vector <M p=",">{t`\v F`}</M> direction and length: “which way, how strong?”. Its length, the magnitude, is written <M p=".">{t`|\v F|`}</M></li>
              <li>So <M>{t`\{A_1\,|\,\v F\}`}</M> and <M>{t`\{A_2\,|\,\v F\}`}</M> are two <em>different</em> forces, even if the vector <M>{t`\v F`}</M> is the same.</li>
            </ol>
          </>}
        />
        <Box kind="supplement" title={<T de="Dieselbe Kraft an anderer Stelle – ein Versuch auf dem Tisch" en="The same force at another place – an experiment on the table" />}>
          <T
            de={<p>Ein Körper liegt auf einem glatten Tisch (Blick von oben, Reibung ausgeschaltet). Ein Faden, der bei <M>A</M> am Körper befestigt ist, zieht immer mit demselben Vektor <M p=".">{t`\v F`}</M> Du wählst nur, <em>wo</em> <M>A</M> liegt. Das Wie, also warum der Körper sich so bewegt, rechnen wir erst später. Hier zählt nur das Bild: <M>A</M> gehört zur Kraft.</p>}
            en={<p>A body lies on a smooth table (view from above, friction switched off). A string tied to the body at <M>A</M> always pulls with the same vector <M p=".">{t`\v F`}</M> You only choose <em>where</em> <M>A</M> is. The how – why the body moves like this – we calculate later. Here only the picture counts: <M>A</M> belongs to the force.</p>}
          />
        </Box>
        <See>
          <T
            de={<>Zieh den roten Punkt <M>A</M> auf dem Körper hin und her (oder tippe auf eine Stelle) und drücke «Los!». Das Kreuz <M>S</M> ist der Schwerpunkt. Er fährt immer gleich weit. Nur die Drehung ändert sich.</>}
            en={<>Drag the red point <M>A</M> around on the body (or tap a spot) and press “Go!”. The cross <M>S</M> is the centre of mass. It always travels the same distance. Only the turning changes.</>}
          />
        </See>
        <K1Matchbox />
        <T
          de={<>
            <p>Zwei Beobachtungen, beides Ergänzung (nicht im Skript):</p>
            <ul>
              <li>Der Schwerpunkt wandert bei jedem <M>A</M> genau gleich – nur der Vektor <M>{t`\v F`}</M> bestimmt, wie. Der Punkt <M>A</M> entscheidet über etwas anderes: ob und wie stark sich der Körper dreht.</li>
              <li>Geht die gestrichelte Gerade durch <M>A</M> in Richtung der Kraft durch den Schwerpunkt, wird der Körper nur verschoben. Geht sie am Schwerpunkt vorbei, dreht er sich zusätzlich, und zwar umso mehr, je weiter sie vorbeigeht (Abstand <M p=").">d</M> Diese Gerade heisst «Wirkungslinie» – das Wort taucht auf Seite 30 auf. Das Mass für das Drehen ist das <a href="#leistung-rotation">Moment</a> (Seite 34).</li>
            </ul>
          </>}
          en={<>
            <p>Two observations, both supplements (not in the notes):</p>
            <ul>
              <li>The centre of mass moves exactly the same for every <M>A</M> – only the vector <M>{t`\v F`}</M> decides how. The point <M>A</M> decides something else: whether, and how strongly, the body turns.</li>
              <li>If the dashed line through <M>A</M> in the direction of the force passes through the centre of mass, the body is only shifted. If it passes beside the centre of mass, the body also turns, and the more the further it passes by (distance <M p=").">d</M> This line is called the line of action (<span lang="de">Wirkungslinie</span>) – the word appears on page 30. The measure of turning is the <a href="#leistung-rotation">moment</a> (page 34).</li>
            </ul>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="newton" title={<T de="3. Die Einheit Newton" en="3. The unit newton" />}>
        <Box kind="lecture" src={<Src p={29} />} title={<T de="Einheit" en={<>Unit (<span lang="de">Einheit</span>)</>} />}>
          <T
            de={<p>Einheit: <M>{t`N := \dfrac{\mathrm{kg}\,\mathrm{m}}{\mathrm{s}^2}`}</M> (Newton)</p>}
            en={<p>Unit: <M>{t`N := \dfrac{\mathrm{kg}\,\mathrm{m}}{\mathrm{s}^2}`}</M> (newton)</p>}
          />
        </Box>
        <T
          de={<>
            <p>Im Skript steht «<M p="»">{t`\mathrm{Kgm/s^2}`}</M> mit grossem <M p=".">{t`\mathrm{K}`}</M> Gemeint ist <M p=".">{t`\mathrm{kg\,m/s^2}`}</M> Man liest: Kilogramm mal Meter durch Sekunde im Quadrat. Das <M>:=</M> heisst: «ist per Definition gleich» – das Newton ist <em>so festgelegt</em>.</p>
            <p>Ergänzung, in Worten: Eine Kraft von <M>{t`1\,\mathrm{N}`}</M> gibt einer Masse von <M>{t`1\,\mathrm{kg}`}</M> in jeder Sekunde <M>{t`1\,\mathrm{m/s}`}</M> Tempo dazu (<M>{t`1\,\mathrm{m/s}`}</M> sind 3,6 km/h). Wie das genau zusammenhängt, ist Dynamik und kommt später.</p>
            <p>Wie gross ist das? Das Bild unten gibt einen Anker: Die Gewichtskraft eines Apfels ist ungefähr <M p=".">{t`1\,\mathrm{N}`}</M> Der Apfel hat die <em>Masse</em> 100 g; die Erde zieht ihn mit der <em>Kraft</em> 1 N an. Masse (<M p=")">{t`\mathrm{kg}`}</M> und Kraft (<M p=")">{t`\mathrm{N}`}</M> sind zwei verschiedene Grössen.</p>
          </>}
          en={<>
            <p>The notes write “<M p="”">{t`\mathrm{Kgm/s^2}`}</M> with a capital <M p=".">{t`\mathrm{K}`}</M> What is meant is <M p=".">{t`\mathrm{kg\,m/s^2}`}</M> Read: kilogram times metre per second squared. The <M>:=</M> means “is equal by definition” – the newton is <em>defined</em> like this.</p>
            <p>Supplement, in words: a force of <M>{t`1\,\mathrm{N}`}</M> adds <M>{t`1\,\mathrm{m/s}`}</M> of speed to a mass of <M>{t`1\,\mathrm{kg}`}</M> every second (<M>{t`1\,\mathrm{m/s}`}</M> is 3.6 km/h). Exactly how this fits together is dynamics and comes later.</p>
            <p>How big is that? The picture below gives an anchor: the weight of an apple is roughly <M p=".">{t`1\,\mathrm{N}`}</M> The apple has the <em>mass</em> 100 g; the Earth pulls it with the <em>force</em> 1 N. Mass (<M p=")">{t`\mathrm{kg}`}</M> and force (<M p=")">{t`\mathrm{N}`}</M> are two different quantities.</p>
          </>}
        />
        <See>
          <T
            de={<>Die Balken sind logarithmisch: Jeder Teilstrich ist 100-mal so viel wie der vorige. Der Apfel liegt bei 1 N. Schieb den Regler: Du siehst das Gewicht jedes Gegenstands von 1 g bis 100 t.</>}
            en={<>The bars are logarithmic: every tick is 100 times the previous one. The apple sits at 1 N. Move the slider: you see the weight of any object from 1 g to 100 t.</>}
          />
        </See>
        <K1Newton />
        <T
          de={<p className="kf-note">Die Werte sind Ergänzung (nicht im Skript): runde Massen, <M p=".">{t`g \approx 9{,}81\,\mathrm{N/kg}`}</M></p>}
          en={<p className="kf-note">The values are a supplement (not in the notes): round masses, <M p=".">{t`g \approx 9.81\,\mathrm{N/kg}`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kontakt" title={<T de="4. Kontaktkräfte und Fernkräfte" en="4. Contact forces and forces at a distance" />}>
        <Box kind="lecture" src={<Src p={29} />}>
          <T
            de={<ul>
              <li><u>Kontaktkräfte</u>: Wechselwirkung mit Berührung</li>
              <li><u>Fernkräfte</u>: Wechselwirkung ohne Berührung</li>
            </ul>}
            en={<ul>
              <li><u><span lang="de">Kontaktkräfte</span></u> (contact forces): interaction with touching</li>
              <li><u><span lang="de">Fernkräfte</span></u> (forces at a distance): interaction without touching</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Die Frage ist einfach: Berühren sich die beiden Körper, oder nicht? Schiebst du eine Kiste, berührt deine Hand die Kiste: Kontaktkraft. Lässt du einen Apfel los, fällt er – die Erde zieht ihn an, ohne ihn zu berühren: Fernkraft. Weitere Fernkräfte sind die Anziehung eines Magneten und die zwischen elektrischen Ladungen. Der Angriffspunkt <M>A</M> liegt beim Kontakt dort, wo die Körper sich berühren, bei der Fernkraft am Körper, auf den die Kraft wirkt.</p>}
          en={<p>The question is simple: do the two bodies touch, or not? When you push a box, your hand touches the box: contact force. When you let go of an apple it falls – the Earth pulls it without touching it: force at a distance. Other forces at a distance are the attraction of a magnet and the one between electric charges. The point of application <M>A</M> lies, for contact, where the bodies touch; for a force at a distance, on the body the force acts on.</p>}
        />
        <See>
          <T de={<>In beiden Bildern gehört der Pfeil zu einem Punkt <M p=".">A</M> Links berühren sich Hand und Kiste in <M p=",">A</M> rechts ist zwischen Apfel und Erde ein Abstand, und trotzdem greift die Kraft an.</>}
            en={<>In both pictures the arrow belongs to a point <M p=".">A</M> On the left hand and box touch at <M p=",">A</M> on the right there is a gap between apple and Earth, and the force still acts.</>} />
        </See>
        <K1Contact />
        <T
          de={<p className="kf-note">Zwei Vereinfachungen, die das Skript später selbst genauer macht: Eine Hand berührt eine Kiste nicht in einem Punkt, sondern auf einer Fläche, und die Erde zieht an jedem Stückchen des Apfels. Beides sind <a href="#verteilte-kraefte">verteilte Kräfte</a> (Seite 31 und 32). Bis dahin zeichnen wir die Kraft als einen Pfeil an einem Punkt.</p>}
          en={<p className="kf-note">Two simplifications that the notes make more precise later: a hand does not touch a box at one point but over an area, and the Earth pulls at every little bit of the apple. Both are <a href="#verteilte-kraefte">distributed forces</a> (pages 31 and 32). Until then we draw the force as one arrow at one point.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="fig41" title={<T de="5. Kräfte am Balken (Fig. 4.1)" en="5. Forces on a bar (Fig. 4.1)" />}>
        <Box kind="lecture" src={<Src p={29} fig="Fig. 4.1" />} title={<T de="Fig. 4.1: Kräfte als punktgebundene Vektoren" en={<>Fig. 4.1: forces as point-bound vectors</>} />}>
          <T
            de={<p>Ein Balken mit fünf Punkten <M>{t`A_1`}</M> bis <M>{t`A_5`}</M> und fünf Pfeilen <M>{t`\v F_1`}</M> bis <M p=",">{t`\v F_5`}</M> in verschiedene Richtungen und mit verschiedenen Längen. <M>{t`\v F_1`}</M> zeigt vom linken Ende nach oben, <M>{t`\v F_2`}</M> von oben schräg auf <M>{t`A_2`}</M> zu, <M>{t`\v F_3`}</M> von oben auf <M>{t`A_3`}</M> zu, <M>{t`\v F_4`}</M> von <M>{t`A_4`}</M> nach links unten, <M>{t`\v F_5`}</M> vom rechten Ende nach rechts oben. (Wir zeichnen die Figur unten nach.)</p>}
            en={<p>A bar with five points <M>{t`A_1`}</M> to <M>{t`A_5`}</M> and five arrows <M>{t`\v F_1`}</M> to <M p=",">{t`\v F_5`}</M> in different directions and of different lengths. <M>{t`\v F_1`}</M> points up from the left end, <M>{t`\v F_2`}</M> comes obliquely from above towards <M p=",">{t`A_2`}</M> <M>{t`\v F_3`}</M> comes from above towards <M p=",">{t`A_3`}</M> <M>{t`\v F_4`}</M> leaves <M>{t`A_4`}</M> to the lower left, <M>{t`\v F_5`}</M> leaves the right end to the upper right. (We redraw the figure below.)</p>}
          />
        </Box>
        <T
          de={<>
            <p>Das ist der erste Blick auf mehrere Kräfte an einem Körper: Jede Kraft hat ihr eigenes Paar <M p=".">{t`\{A_i\,|\,\v F_i\}`}</M> Der Index <M>i</M> zählt einfach durch: <M p=".">{t`i = 1, 2, \dots, 5`}</M></p>
            <p>Beachte die Pfeile: Bei <M p=",">{t`\v F_1`}</M> <M>{t`\v F_4`}</M> und <M>{t`\v F_5`}</M> beginnt der Pfeil im Punkt, bei <M>{t`\v F_2`}</M> und <M>{t`\v F_3`}</M> endet er dort. Das Skript sagt dazu nichts. Wir lesen es so: Gemeint ist immer, dass <M>{t`\v F_i`}</M> in <M>{t`A_i`}</M> angreift, und die Pfeilspitze zeigt in die Richtung von <M p=".">{t`\v F_i`}</M> Am Anfang oder am Ende des Pfeils zu stehen, ist nur eine Frage des Zeichnens.</p>
          </>}
          en={<>
            <p>This is the first look at several forces on one body: each force has its own pair <M p=".">{t`\{A_i\,|\,\v F_i\}`}</M> The index <M>i</M> simply counts: <M p=".">{t`i = 1, 2, \dots, 5`}</M></p>
            <p>Note the arrows: for <M p=",">{t`\v F_1`}</M> <M>{t`\v F_4`}</M> and <M>{t`\v F_5`}</M> the arrow starts at the point, for <M>{t`\v F_2`}</M> and <M>{t`\v F_3`}</M> it ends there. The notes say nothing about this. We read it like this: what is always meant is that <M>{t`\v F_i`}</M> acts at <M p=",">{t`A_i`}</M> and the arrow head points in the direction of <M p=".">{t`\v F_i`}</M> Standing at the start or at the end of the arrow is only a matter of drawing.</p>
          </>}
        />
        <See>
          <T
            de={<>Zieh an einem Pfeilende, und <M>{t`\v F_i`}</M> ändert sich in der Tabelle. Zieh an einem weissen Punkt, und <M>{t`A_i`}</M> wandert am Balken. Schalte dann «nur die Vektoren» ein: Die Pfeile verlieren ihre Punkte.</>}
            en={<>Drag an arrow end and <M>{t`\v F_i`}</M> changes in the table. Drag a white dot and <M>{t`A_i`}</M> moves along the bar. Then switch on “only the vectors”: the arrows lose their points.</>}
          />
        </See>
        <K1Fig41 />
        <T
          de={<p>Mit den Punkten ist das Bild eine genaue Beschreibung: fünf Paare <M p=".">{t`\{A_i\,|\,\v F_i\}`}</M> Ohne Punkte bleiben fünf gleiche Pfeile übrig, und man weiss nicht mehr, welche Kraft wo zieht. Genau diese Information wollte das Skript mit dem «punktgebundenen Vektor» festhalten.</p>}
          en={<p>With the points the picture is an exact description: five pairs <M p=".">{t`\{A_i\,|\,\v F_i\}`}</M> Without points five identical arrows are left and you no longer know which force pulls where. This is exactly the information that the notes want to keep with the “point-bound vector”.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="gruppe" title={<T de="6. Kräftegruppe und Resultierende" en="6. Group of forces and resultant" />}>
        <Box kind="lecture" src={<Src p={29} fig="Fig. 4.2" />} title={<T de="Kräftegruppe" en={<>Group of forces (<span lang="de">Kräftegruppe</span>)</>} />}>
          <T
            de={<p><u>Kräftegruppe</u>: mehrere Kräfte am System. <span className="kf-note">(handschriftlich: «äquivalente Darstellung»; «speziell»)</span></p>}
            en={<p><u><span lang="de">Kräftegruppe</span></u>: several forces on the system. <span className="kf-note">(handwritten: “<span lang="de">äquivalente Darstellung</span>” = equivalent representation; “<span lang="de">speziell</span>” = special case)</span></p>}
          />
          <MD>{t`\begin{aligned}
&\{A_i\,|\,\v F_i\},\ \ i = 1, 2, 3, \dots \ \ \to\ \ \{\{A_1\,|\,\v F_1\},\ \{A_2\,|\,\v F_2\},\ \{A_3\,|\,\v F_3\},\ \dots\}\\[4pt]
&\{A\,|\,\v F_i\},\ \ i = 1, 2, 3, \dots \ \ \to\ \ \{A\,|\,\v R\},\qquad \v R = \sum_i \v F_i
\end{aligned}`}</MD>
          <T
            de={<p>Fig. 4.2: Kräfte mit gleichem Angriffspunkt. Fünf Pfeile <M>{t`\v F_1`}</M> bis <M>{t`\v F_5`}</M> in einem Punkt <M>A</M> und ein grauer Pfeil <M>{t`\v R`}</M> zwischen <M>{t`\v F_4`}</M> und <M p=".">{t`\v F_5`}</M> Die Teilbilder (a) und (b) zeigen dieselbe Gruppe, einmal mit unterstrichenen Buchstaben, einmal ohne.</p>}
            en={<p>Fig. 4.2: forces with the same point of application. Five arrows <M>{t`\v F_1`}</M> to <M>{t`\v F_5`}</M> at one point <M>A</M> and a grey arrow <M>{t`\v R`}</M> between <M>{t`\v F_4`}</M> and <M p=".">{t`\v F_5`}</M> Parts (a) and (b) show the same group, once with underlined letters, once without.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Zeilen:</b></p>
            <ol>
              <li>Eine <em>Kräftegruppe</em> ist einfach eine Sammlung von Kräften an einem System. Mit <M>{t`i = 1, 2, 3, \dots`}</M> wird sie durchnummeriert.</li>
              <li>Der Pfeil <M>{t`\to`}</M> in der ersten Zeile verbindet zwei Schreibweisen derselben Gruppe: links kurz mit dem Laufindex <M p=",">i</M> rechts ausgeschrieben, Kraft für Kraft. «Äquivalente Darstellung» heisst: gleiche Bedeutung, anders hingeschrieben.</li>
              <li>Die zweite Zeile ist der Spezialfall: <em>alle</em> Kräfte greifen im selben Punkt <M>A</M> an. Dort steht kein Index am <M p=",">A</M> denn es gibt nur einen Punkt.</li>
              <li>Dann lässt sich die ganze Gruppe durch eine einzige Kraft <M>{t`\{A\,|\,\v R\}`}</M> ausdrücken, mit <M p=".">{t`\v R = \sum_i \v F_i`}</M> Lies <M>{t`\sum_i`}</M> als «Summe über alle <M p="».">i</M> <M>{t`\v R`}</M> heisst Resultierende; der Vektor <M>{t`\v R`}</M> ist die Summe der Vektoren.</li>
            </ol>
            <p>Fig. 4.2 ist genau dieser Fall: fünf Pfeile in <M p=",">A</M> und der graue Pfeil <M p=",">{t`\v R`}</M> der alle zusammenfasst. Wie ein Pfeil aus fünf wird, zeigt die Animation.</p>
          </>}
          en={<>
            <p><b>How to read the lines:</b></p>
            <ol>
              <li>A <em><span lang="de">Kräftegruppe</span></em> is simply a collection of forces on a system. With <M>{t`i = 1, 2, 3, \dots`}</M> it is numbered.</li>
              <li>The arrow <M>{t`\to`}</M> in the first line connects two ways of writing the same group: on the left short, with the running index <M p=",">i</M> on the right written out, force by force. “<span lang="de">Äquivalente Darstellung</span>” means: same meaning, written differently.</li>
              <li>The second line is the special case: <em>all</em> forces act at the same point <M p=".">A</M> There is no index on <M p=",">A</M> because there is only one point.</li>
              <li>Then the whole group can be expressed by a single force <M p=",">{t`\{A\,|\,\v R\}`}</M> with <M p=".">{t`\v R = \sum_i \v F_i`}</M> Read <M>{t`\sum_i`}</M> as “sum over all <M p="”.">i</M> <M>{t`\v R`}</M> is called the resultant (<span lang="de">Resultierende</span>); the vector <M>{t`\v R`}</M> is the sum of the vectors.</li>
            </ol>
            <p>Fig. 4.2 is exactly this case: five arrows at <M p=",">A</M> and the grey arrow <M p=",">{t`\v R`}</M> which sums them up. How one arrow comes out of five is shown by the animation.</p>
          </>}
        />
        <ForceAnim
          build={resultantScene}
          label={tr('Animation: Resultierende von fünf Kräften am selben Punkt (Fig. 4.2)', 'Animation: resultant of five forces at the same point (Fig. 4.2)')}
          steps={[
            { ms: 3600, holdMs: 2500, caption: <T
              de={<>Fünf Kräfte greifen im selben Punkt <M>A</M> an, wie in Fig. 4.2. Jeder Pfeil ist ein Vektor <M p=".">{t`\v F_i`}</M></>}
              en={<>Five forces act at the same point <M p=",">A</M> as in Fig. 4.2. Each arrow is a vector <M p=".">{t`\v F_i`}</M></>} /> },
            { ms: 3600, holdMs: 3500, caption: <T
              de={<>Wir hängen eine Kopie von <M>{t`\v F_2`}</M> an die Spitze von <M p=".">{t`\v F_1`}</M> Der gestrichelte Pfeil von <M>A</M> bis zur neuen Spitze ist <M p=".">{t`\v F_1 + \v F_2`}</M> So addiert man Vektoren (<a href="#vektoren">Seite 5</a>). Wir verschieben die Kraft nicht – wir zeichnen nur eine Kopie zum Rechnen.</>}
              en={<>We hang a copy of <M>{t`\v F_2`}</M> on the tip of <M p=".">{t`\v F_1`}</M> The dashed arrow from <M>A</M> to the new tip is <M p=".">{t`\v F_1 + \v F_2`}</M> This is how vectors are added (<a href="#vektoren">page 5</a>). We do not move the force – we only draw a copy for the calculation.</>} /> },
            { ms: 3000, holdMs: 3000, caption: <T
              de={<>Dasselbe mit <M p=":">{t`\v F_3`}</M> Kopie an die Spitze, und der Pfeil von <M>A</M> aus zeigt jetzt <M p=".">{t`\v F_1 + \v F_2 + \v F_3`}</M></>}
              en={<>The same with <M p=":">{t`\v F_3`}</M> a copy at the tip, and the arrow from <M>A</M> now shows <M p=".">{t`\v F_1 + \v F_2 + \v F_3`}</M></>} /> },
            { ms: 3000, holdMs: 3000, caption: <T
              de={<>Dann <M p=".">{t`\v F_4`}</M> Die Kette läuft nach oben zurück.</>}
              en={<>Then <M p=".">{t`\v F_4`}</M> The chain turns back upwards.</>} /> },
            { ms: 3600, holdMs: 4000, caption: <T
              de={<>Zuletzt <M p=".">{t`\v F_5`}</M> Der Pfeil von <M>A</M> bis zum Ende der Kette ist die Summe aller fünf: die Resultierende <M p=".">{t`\v R`}</M> Mit den Zahlen unserer Zeichnung ist <M p=".">{t`\v R = (25;\ 45)\,\mathrm{N}`}</M></>}
              en={<>Last <M p=".">{t`\v F_5`}</M> The arrow from <M>A</M> to the end of the chain is the sum of all five: the resultant <M p=".">{t`\v R`}</M> With the numbers of our drawing, <M p=".">{t`\v R = (25,\ 45)\,\mathrm{N}`}</M></>} /> },
            { ms: 3000, caption: <T
              de={<>Die Kette räumen wir weg. Übrig bleiben die fünf Kräfte und <M>{t`\v R`}</M> am selben Punkt <M p=",">A</M> wie in Fig. 4.2. Man schreibt: <M p=".">{t`\{A\,|\,\v F_i\} \to \{A\,|\,\v R\}`}</M></>}
              en={<>We take the chain away. What remains are the five forces and <M>{t`\v R`}</M> at the same point <M p=",">A</M> as in Fig. 4.2. One writes: <M p=".">{t`\{A\,|\,\v F_i\} \to \{A\,|\,\v R\}`}</M></>} /> },
          ]}
        />
        <T
          de={<p className="kf-note">Die Zahlen dieser Zeichnung sind unsere Wahl, nicht die des Skripts: Wir haben die Richtungen und die relativen Längen aus Fig. 4.2 ausgemessen und 10 N pro Teilstrich gewählt. Die Summe haben wir mit <code>force.ts</code> nachgerechnet: <M p=".">{t`\v R = (25;\ 45)\,\mathrm{N}`}</M></p>}
          en={<p className="kf-note">The numbers of this drawing are our choice, not the notes’: we measured the directions and relative lengths from Fig. 4.2 and chose 10 N per tick. The sum was checked in <code>force.ts</code>: <M p=".">{t`\v R = (25,\ 45)\,\mathrm{N}`}</M></p>}
        />
        <Box kind="supplement" title={<T de="Warum darf man Pfeile so addieren?" en="Why may arrows be added like this?" />}>
          <T
            de={<p>Das Skript schreibt hier <M>{t`\v R = \sum_i \v F_i`}</M> einfach hin. Dass Kräfte im selben Punkt wie Vektoren addiert werden dürfen (Kräfteparallelogramm), ist eine Erfahrung der Mechanik. Auf dieser Seite wird sie vorausgesetzt, nicht begründet. Und wichtig: Der Satz gilt hier nur für <em>einen gemeinsamen</em> Angriffspunkt. Was bei verschiedenen Punkten gilt, beantwortet diese Seite nicht.</p>}
            en={<p>The notes simply write <M>{t`\v R = \sum_i \v F_i`}</M> here. That forces at the same point may be added like vectors (parallelogram of forces) is an experience of mechanics. This page assumes it; it does not justify it. And important: the statement holds here only for <em>one common</em> point of application. What holds for different points, this page does not answer.</p>}
          />
        </Box>
        <See>
          <T
            de={<>Zieh die Spitzen der fünf Kräfte. Die Tabelle addiert Spalte für Spalte, und der dicke Pfeil <M>{t`\v R`}</M> folgt. Mit «Pfeile aneinanderhängen» siehst du die Kette, und die Reihenfolge ändert das Ende nicht.</>}
            en={<>Drag the tips of the five forces. The table adds column by column and the thick arrow <M>{t`\v R`}</M> follows. With “chain the arrows” you see the chain, and the order does not change its end.</>}
          />
        </See>
        <K1Resultant />
        <T
          de={<p>Drückst du auf «Kräfte halten sich die Waage», schliesst sich die Kette: Das Ende liegt wieder bei <M p=",">A</M> und <M p=".">{t`\v R = \v 0`}</M> Das ist der Vorgeschmack auf das «Gleichgewicht» vom Anfang der Seite. Was die Statik daraus macht, kommt später. Merke schon jetzt: Für Kräfte an <em>verschiedenen</em> Punkten, wie in Fig. 4.1, reicht ein <M>{t`\v R`}</M> allein nicht (der Versuch auf dem Tisch hat es gezeigt).</p>}
          en={<p>If you press “Forces balance”, the chain closes: its end is back at <M p=",">A</M> and <M p=".">{t`\v R = \v 0`}</M> This is a foretaste of the “<span lang="de">Gleichgewicht</span>” from the beginning of the page. What statics makes of it comes later. Remember already now: for forces at <em>different</em> points, as in Fig. 4.1, a <M>{t`\v R`}</M> alone is not enough (the experiment on the table showed it).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="missverstaendnisse" title={<T de="7. Häufige Missverständnisse" en="7. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Eine Kraft ist ein freier Pfeil, den man beliebig verschieben darf.»" en="“A force is a free arrow that may be moved anywhere.”" />}>
          <T
            de={<>Nicht in diesem Skript: Eine Kraft ist ein <em>punktgebundener</em> Vektor <M p=".">{t`\{A\,|\,\v F\}`}</M> Derselbe Vektor <M>{t`\v F`}</M> an einem anderen Punkt ist eine andere Kraft. Der Versuch auf dem Tisch zeigt es: Der Körper dreht sich anders. Nur beim <em>Addieren</em> der Vektoren (der Kette in der Animation) schiebt man Kopien herum, und auch dort bleiben die echten Kräfte am Punkt <M p=".">A</M></>}
            en={<>Not in these notes: a force is a <em>point-bound</em> vector <M p=".">{t`\{A\,|\,\v F\}`}</M> The same vector <M>{t`\v F`}</M> at another point is another force. The experiment on the table shows it: the body turns differently. Only when <em>adding</em> the vectors (the chain in the animation) do you push copies around, and even there the real forces stay at the point <M p=".">A</M></>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«Die Resultierende <M>{t`\v R`}</M> ersetzt jede Kräftegruppe.»</>} en={<>“The resultant <M>{t`\v R`}</M> replaces any group of forces.”</>} />}>
          <T
            de={<>Auf Seite 29 gilt <M>{t`\{A\,|\,\v F_i\} \to \{A\,|\,\v R\}`}</M> nur im «speziellen» Fall: <em>alle</em> Kräfte greifen im selben Punkt an. Bei verschiedenen Punkten, wie in Fig. 4.1, ist die Summe <M>{t`\sum \v F_i`}</M> zwar auch ein Vektor, aber sie sagt nicht, wo und wie die Kräfte den Körper drehen. Das klärt das Moment (<a href="#leistung-kraeftegruppe">Seite 34</a>).</>}
            en={<>On page 29, <M>{t`\{A\,|\,\v F_i\} \to \{A\,|\,\v R\}`}</M> holds only in the “special” case: <em>all</em> forces act at the same point. For different points, as in Fig. 4.1, the sum <M>{t`\sum \v F_i`}</M> is a vector too, but it does not say where and how the forces turn the body. The moment clears that up (<a href="#leistung-kraeftegruppe">page 34</a>).</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Ruhe heisst: Es wirken keine Kräfte.»" en="“At rest means: no forces act.”" />}>
          <T
            de={<>Ein Buch liegt auf dem Tisch: Die Erde zieht es nach unten, der Tisch drückt es nach oben. Zwei Kräfte, und sie halten sich die Waage. Das Buch ruht <em>wegen</em> des Gleichgewichts, nicht weil keine Kraft da wäre. Der Schwamm im ersten Bild zeigt es auch: Er ruht und wird trotzdem verformt.</>}
            en={<>A book lies on the table: the Earth pulls it down, the table pushes it up. Two forces, and they balance. The book rests <em>because of</em> the equilibrium, not because there is no force. The sponge in the first picture shows it too: it rests and is still deformed.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Wie lang der Pfeil ist, ist egal – Hauptsache, er zeigt in die Richtung.»" en="“How long the arrow is doesn’t matter – as long as it points the right way.”" />}>
          <T
            de={<>Die Länge ist der Betrag <M p=".">{t`|\v F|`}</M> Bei einer Zeichnung mit mehreren Kräften muss sie überall im gleichen Massstab gezeichnet sein (hier: 10 N entsprechen einer festen Länge, siehe den Massstab in Fig. 4.1 oben). Sonst stimmt auch <M>{t`\v R = \sum \v F_i`}</M> nicht mehr mit dem Bild überein.</>}
            en={<>The length is the magnitude <M p=".">{t`|\v F|`}</M> In a drawing with several forces it must have the same scale everywhere (here: 10 N correspond to a fixed length, see the scale in Fig. 4.1 above). Otherwise <M>{t`\v R = \sum \v F_i`}</M> no longer agrees with the picture either.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="merke" title={<T de="8. Das Wichtigste" en="8. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Kräfte ändern die Geschwindigkeit <M>{t`\v v`}</M> oder die Gestalt eines Körpers. Die Statik fragt, wann alles in Ruhe bleibt: Gleichgewicht.</li>
              <li>Eine Kraft ist ein <b>punktgebundener Vektor</b> <M p=":">{t`\{A\,|\,\v F\}`}</M> <M>A</M> sagt, <em>wo</em>, <M>{t`\v F`}</M> sagt, <em>wohin und wie stark</em>. Einheit: <M p=".">{t`\mathrm{N} = \mathrm{kg\,m/s^2}`}</M></li>
              <li>Kontaktkräfte brauchen Berührung, Fernkräfte nicht.</li>
              <li>Greifen mehrere Kräfte im <em>selben</em> Punkt an, ersetzt sie die Resultierende <M p=":">{t`\{A\,|\,\v R\}`}</M></li>
            </ul>}
            en={<ul>
              <li>Forces change the velocity <M>{t`\v v`}</M> or the shape of a body. Statics asks when everything stays at rest: equilibrium.</li>
              <li>A force is a <b>point-bound vector</b> <M p=":">{t`\{A\,|\,\v F\}`}</M> <M>A</M> says <em>where</em>, <M>{t`\v F`}</M> says <em>which way and how strong</em>. Unit: <M p=".">{t`\mathrm{N} = \mathrm{kg\,m/s^2}`}</M></li>
              <li>Contact forces need touching, forces at a distance do not.</li>
              <li>If several forces act at the <em>same</em> point, the resultant replaces them: <M p=".">{t`\{A\,|\,\v R\}`}</M></li>
            </ul>}
          />
          <MD>{t`\v R = \sum_i \v F_i`}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Die Vektoren und ihre Summe kennst du von <a href="#vektoren">Seite 5</a>. Die nächste Lektion zeigt, dass jede Kraft eine Gegenkraft hat: das <a href="#reaktionsprinzip">Reaktionsprinzip</a>. Wo man die Grenze um «das System» zieht, regelt die <a href="#systemabgrenzung">Systemabgrenzung</a>. Dass der Pfeil eigentlich viele kleine Kräfte zusammenfasst, kommt bei den <a href="#verteilte-kraefte">verteilten Kräften</a>. Und mit der <a href="#leistung">Leistung</a> <M>{t`P = \v F\cdot\v v_A`}</M> wird wichtig, dass <M>{t`\v v_A`}</M> die Geschwindigkeit genau des Angriffspunkts <M>A</M> ist.</p>}
          en={<p className="connections"><b>Connections:</b> You know vectors and their sum from <a href="#vektoren">page 5</a>. The next lesson shows that every force has a counter-force: the <a href="#reaktionsprinzip">reaction principle</a>. Where to draw the boundary around “the system” is settled by the <a href="#systemabgrenzung">system boundary</a>. That the arrow really sums up many small forces comes with the <a href="#verteilte-kraefte">distributed forces</a>. And with the <a href="#leistung">power</a> <M>{t`P = \v F\cdot\v v_A`}</M> it becomes important that <M>{t`\v v_A`}</M> is the velocity of exactly the point of application <M p=".">A</M></p>}
        />
      </Section>
    </article>
  );
}
