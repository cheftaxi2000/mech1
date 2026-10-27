import { Box, De, Section, Src } from '../components/Blocks';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { ForceAnim } from '../viz/force/ForceAnim';
import { reactionScene } from '../viz/force/reactionScene';
import { See } from '../viz/force/kfKit';
import { K2Skaters } from '../viz/force/K2Skaters';
import { K2Fern } from '../viz/force/K2Fern';
import { K2Where } from '../viz/force/K2Where';

const t = String.raw;

export default function K2Reaktion() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Der Anfang von Seite 30 enthält nur einen einzigen Gedanken, aber er gehört zu den wichtigsten der ganzen Mechanik: Kräfte treten immer <em>paarweise</em> auf. Wer stösst, wird gestossen.</p>}
        en={<p className="lede">The beginning of page 30 contains only a single thought, but it is one of the most important in all of mechanics: forces always come <em>in pairs</em>. Whoever pushes is pushed.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Zwei Personen stehen sich auf Rollschuhen gegenüber. Die eine stösst die andere weg. Was passiert? Beide rollen auseinander – auch die, die gestossen hat! Oder: Du kannst gegen eine Wand drücken, so fest du willst, und spürst dabei die Wand an der Hand. Das ist kein Zufall. Eine Kraft ist nie einseitig: Wenn die eine Person auf die andere wirkt, wirkt die andere zurück. Das Skript macht daraus eine Grundregel, das «Reaktionsprinzip».</p>}
          en={<p>Two people stand facing each other on roller skates. One pushes the other away. What happens? Both roll apart – the one who pushed too! Or: you can press against a wall as hard as you like and you feel the wall on your hand. That is no accident. A force is never one-sided: when one person acts on the other, the other acts back. The notes turn this into a basic rule, the “<De en="reaction principle">Reaktionsprinzip</De>”.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="postulat" title={<T de="1. Das Postulat" en="1. The postulate" />}>
        <Box kind="lecture" src={<Src p={30} />} title={<T de="Das Reaktionsprinzip" en={<>The reaction principle (<span lang="de">Das Reaktionsprinzip</span>)</>} />}>
          <T
            de={<p><b>POSTULAT:</b> Übt ein erster materieller Punkt <M>{t`A_1`}</M> auf einen zweiten <M>{t`A_2`}</M> die Kraft <M>{t`\{A_2\,|\,\v F\}`}</M> aus (<em>Actio</em>), so wirkt seinerseits der materielle Punkt <M>{t`A_2`}</M> auf <M>{t`A_1`}</M> mit der <b>Gegenkraft</b> <M>{t`\{A_1\,|\,-\v F\}`}</M> (<em>Reactio</em>).</p>}
            en={<p><b>POSTULATE (<span lang="de">Postulat</span>):</b> If a first material point <M>{t`A_1`}</M> exerts on a second one, <M p=",">{t`A_2`}</M> the force <M>{t`\{A_2\,|\,\v F\}`}</M> (<em>Actio</em>), then in turn the material point <M>{t`A_2`}</M> acts on <M>{t`A_1`}</M> with the <b>counter-force</b> (<span lang="de">Gegenkraft</span>) <M>{t`\{A_1\,|\,-\v F\}`}</M> (<em>Reactio</em>).</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Ein «Postulat» ist eine Grundregel, die man nicht beweist, sondern annimmt, weil sie sich in der Erfahrung immer bewährt.</li>
              <li>Ein «materieller Punkt» ist ein Körper, den man als einen Punkt mit Masse behandelt (<a href="#koordinaten">Lektion 1</a>). <M>{t`A_1`}</M> und <M>{t`A_2`}</M> sind zwei solche Körper.</li>
              <li><M>{t`\{A_2\,|\,\v F\}`}</M> ist eine Kraft im Sinn von <a href="#kraft">Seite 29</a>: Der Punkt links vom Strich sagt, <em>wo</em> sie angreift, nämlich in <M p=".">{t`A_2`}</M> Der Körper <M>{t`A_1`}</M> ist ihr Absender, <M>{t`A_2`}</M> der Empfänger.</li>
              <li>Die Antwort, <M p=",">{t`\{A_1\,|\,-\v F\}`}</M> hat den Vektor <M p=",">{t`-\v F`}</M> also dieselbe Länge, aber die umgekehrte Richtung. Und sie greift in <M>{t`A_1`}</M> an: Jetzt ist <M>{t`A_1`}</M> der Empfänger.</li>
              <li>«Actio» und «Reactio» sind lateinisch: Handlung und Rückhandlung. Welche der beiden man «Actio» nennt, hängt nur davon ab, mit welchem Körper man anfängt – das ist unsere Lesart.</li>
            </ol>
            <p className="keep"><b>Das Entscheidende:</b> Die beiden Kräfte haben <em>verschiedene Angriffspunkte</em>, <M>{t`A_2`}</M> und <M p=".">{t`A_1`}</M> Sie wirken auf zwei verschiedene Körper. Die Animation zeigt, warum das wichtig ist.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>A “postulate” is a basic rule that is not proved but assumed, because it has always held up in experience.</li>
              <li>A “material point” (<span lang="de">materieller Punkt</span>) is a body that is treated as a point with mass (<a href="#koordinaten">lesson 1</a>). <M>{t`A_1`}</M> and <M>{t`A_2`}</M> are two such bodies.</li>
              <li><M>{t`\{A_2\,|\,\v F\}`}</M> is a force in the sense of <a href="#kraft">page 29</a>: the point to the left of the bar says <em>where</em> it acts, namely at <M p=".">{t`A_2`}</M> The body <M>{t`A_1`}</M> is its sender, <M>{t`A_2`}</M> the receiver.</li>
              <li>The reply, <M p=",">{t`\{A_1\,|\,-\v F\}`}</M> has the vector <M p=",">{t`-\v F`}</M> so the same length but the opposite direction. And it acts at <M p=":">{t`A_1`}</M> now <M>{t`A_1`}</M> is the receiver.</li>
              <li>“Actio” and “Reactio” are Latin: action and counter-action. Which of the two is called “Actio” depends only on which body you start with – that is our reading.</li>
            </ol>
            <p className="keep"><b>The decisive point:</b> the two forces have <em>different points of application</em>, <M>{t`A_2`}</M> and <M p=".">{t`A_1`}</M> They act on two different bodies. The animation shows why this matters.</p>
          </>}
        />
        <ForceAnim
          build={reactionScene}
          label={tr('Animation: Actio und Reactio wirken auf zwei verschiedene Körper', 'Animation: Actio and Reactio act on two different bodies')}
          steps={[
            { ms: 2800, holdMs: 3200, caption: <T
              de={<><M>{t`A_1`}</M> (oben) drückt auf <M>{t`A_2`}</M> (unten). Der Pfeil endet in <M p=":">{t`A_2`}</M> dort wirkt die Kraft. Das ist die Actio <M p=".">{t`\{A_2\,|\,\v F\}`}</M></>}
              en={<><M>{t`A_1`}</M> (above) presses on <M>{t`A_2`}</M> (below). The arrow ends at <M p=":">{t`A_2`}</M> that is where the force acts. This is the Actio <M p=".">{t`\{A_2\,|\,\v F\}`}</M></>} /> },
            { ms: 2800, holdMs: 3500, caption: <T
              de={<><M>{t`A_2`}</M> drückt zurück. Dieser Pfeil endet in <M p=".">{t`A_1`}</M> Er ist gleich lang, zeigt aber nach oben: <M p=",">{t`\{A_1\,|\,-\v F\}`}</M> die Reactio.</>}
              en={<><M>{t`A_2`}</M> presses back. This arrow ends at <M p=".">{t`A_1`}</M> It is equally long but points up: <M p=",">{t`\{A_1\,|\,-\v F\}`}</M> the Reactio.</>} /> },
            { ms: 3400, holdMs: 4500, caption: <T
              de={<>Wir zeichnen für jeden Körper ein eigenes Bild. Auf <M>{t`A_2`}</M> wirkt von diesem Paar nur <M p=",">{t`\v F`}</M> auf <M>{t`A_1`}</M> nur <M p=".">{t`-\v F`}</M> In keinem Bild stehen beide Pfeile: Deshalb können sie sich nicht gegenseitig aufheben.</>}
              en={<>We draw a separate picture for each body. On <M>{t`A_2`}</M> only <M>{t`\v F`}</M> of this pair acts, on <M>{t`A_1`}</M> only <M p=".">{t`-\v F`}</M> Neither picture contains both arrows: so they cannot cancel each other.</>} /> },
            { ms: 2800, caption: <T
              de={<>Wieder zusammen, mit den Namen: <em>Actio</em> und <em>Reactio</em> sind gleich gross, entgegengesetzt – und sie greifen an zwei verschiedenen Körpern an.</>}
              en={<>Together again, with their names: <em>Actio</em> and <em>Reactio</em> are equal in size and opposite – and they act on two different bodies.</>} /> },
          ]}
        />
        <Box kind="supplement" title={<T de="Rollschuhe: gleiche Kraft, verschiedene Wirkung" en="Roller skates: same force, different effect" />}>
          <T
            de={<p>Wieder die zwei Personen auf Rollschuhen. <M>{t`A_1`}</M> stösst <M>{t`A_2`}</M> eine halbe Sekunde lang; gleichzeitig wirkt auf <M>{t`A_1`}</M> die Gegenkraft. Beide Pfeile sind gleich lang. Danach rollen beide mit gleichbleibendem Tempo weg. Wie schnell, rechnet erst die Dynamik; das Bild zeigt nur, dass dieselbe Kraft am leichteren Körper mehr bewirkt. Du kannst die Massen verändern.</p>}
            en={<p>The two people on roller skates again. <M>{t`A_1`}</M> pushes <M>{t`A_2`}</M> for half a second; at the same time the counter-force acts on <M p=".">{t`A_1`}</M> Both arrows are equally long. Afterwards both roll away at constant speed. How fast is calculated only in dynamics; the picture just shows that the same force does more to the lighter body. You can change the masses.</p>}
          />
        </Box>
        <See>
          <T
            de={<>Drücke «Schubs!» und achte auf die zwei Pfeile: gleich lang, entgegengesetzt, an den zwei Körpern. Danach zeigen die rosa Pfeile das Tempo: Der Leichtere ist schneller.</>}
            en={<>Press “Push!” and watch the two arrows: equally long, opposite, on the two bodies. Afterwards the pink arrows show the speed: the lighter one is faster.</>}
          />
        </See>
        <K2Skaters />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="zusatz" title={<T de="2. Das Zusatzpostulat: Fernkräfte liegen auf der Verbindungsgeraden" en="2. The additional postulate: forces at a distance lie on the connecting line" />}>
        <Box kind="lecture" src={<Src p={30} />} title={<T de="Zusatzpostulat" en={<>Additional postulate (<span lang="de">Zusatzpostulat</span>)</>} />}>
          <T
            de={<>
              <p><b>ZUSATZPOSTULAT:</b> Bei Fernkräften liegen die Wirkungslinien von Kraft und Gegenkraft auf der Verbindungsgeraden durch <M>{t`A_1`}</M> und <M p=".">{t`A_2`}</M></p>
              <p className="kf-note">Zur Figur auf der Seite: links zwei gekrümmte, schraffierte Körper <M>{t`A_1`}</M> (oben) und <M>{t`A_2`}</M> (unten), die sich in einem Punkt berühren; rechts dieselben zwei Körper mit etwas Abstand, mit den Pfeilen <M>{t`\v F_2 = \v F`}</M> auf <M>{t`A_2`}</M> und <M>{t`\v F_1 = -\v F`}</M> auf <M p=";">{t`A_1`}</M> unten rechts zwei Kreise <M>{t`A_1`}</M> (klein) und <M>{t`A_2`}</M> (gross) mit einer gestrichelten roten Geraden durch beide Mitten und den Pfeilen <M>{t`\pm\v F`}</M> auf dieser Geraden.</p>
              <p>Handschriftlich: «zur Zeit <M p=":">{t`t_0`}</M> Kontaktkräfte: <M p=";">{t`A_1(t_0) = A_2(t_0)`}</M> Fernkräfte: <M p=".">{t`A_1(t_0) \neq A_2(t_0)`}</M>»</p>
            </>}
            en={<>
              <p><b>ADDITIONAL POSTULATE:</b> For forces at a distance (<span lang="de">Fernkräfte</span>) the lines of action (<span lang="de">Wirkungslinien</span>) of force and counter-force lie on the connecting line through <M>{t`A_1`}</M> and <M p=".">{t`A_2`}</M></p>
              <p className="kf-note">On the figure of the page: on the left two curved, hatched bodies <M>{t`A_1`}</M> (above) and <M>{t`A_2`}</M> (below) touching at one point; on the right the same two bodies a little apart, with the arrows <M>{t`\v F_2 = \v F`}</M> on <M>{t`A_2`}</M> and <M>{t`\v F_1 = -\v F`}</M> on <M p=";">{t`A_1`}</M> bottom right two circles <M>{t`A_1`}</M> (small) and <M>{t`A_2`}</M> (large) with a dashed red line through both centres and the arrows <M>{t`\pm\v F`}</M> on that line.</p>
              <p>Handwritten: “at time <M p=":">{t`t_0`}</M> contact forces: <M p=";">{t`A_1(t_0) = A_2(t_0)`}</M> forces at a distance: <M p=".">{t`A_1(t_0) \neq A_2(t_0)`}</M>”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>«Fernkräfte» sind Kräfte ohne Berührung (<a href="#kraft">Seite 29</a>): zum Beispiel die Anziehung zwischen zwei Magneten oder die der Erde auf den Mond.</li>
              <li>Die «Wirkungslinie» einer Kraft ist die Gerade durch ihren Angriffspunkt, in Richtung des Vektors. Auf ihr liegt der Pfeil, wenn man ihn verlängert.</li>
              <li>Die «Verbindungsgerade» ist die Gerade durch die beiden Punkte <M>{t`A_1`}</M> und <M p=".">{t`A_2`}</M></li>
              <li>Das Zusatzpostulat sagt: Diese drei Geraden sind <em>dieselbe</em>. Die Anziehung zwischen zwei Punkten zieht genau aufeinander zu, nicht schräg aneinander vorbei.</li>
              <li>Das Handschriftliche heisst: <M>{t`A_1(t_0)`}</M> ist der Ort von <M>{t`A_1`}</M> zur Zeit <M p=".">{t`t_0`}</M> Bei einer <em>Kontaktkraft</em> fallen die beiden Orte zusammen (<M p=")">=</M> bei einer Fernkraft nicht (<M p=").">{t`\neq`}</M> Fallen die Punkte zusammen, gibt es keine Verbindungsgerade mehr.</li>
            </ol>
            <p>Warum man das Zusatzpostulat braucht, sagt die Seite nicht: Sie fordert es einfach. Eine Begründung braucht das Moment (<a href="#leistung-rotation">Seite 34</a>; das ist unsere Ergänzung). Für Kontaktkräfte verlangt das Skript keine Richtung; wie eine Kontaktkraft wirkt, wenn sich die Körper auf einer Fläche berühren, behandelt erst die <a href="#verteilte-kraefte">nächste Seite</a> (Fig. 4.8).</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>“Forces at a distance” are forces without touching (<a href="#kraft">page 29</a>): for example the attraction between two magnets or that of the Earth on the Moon.</li>
              <li>The “line of action” of a force is the straight line through its point of application, in the direction of the vector. The arrow lies on it if you extend it.</li>
              <li>The “connecting line” is the straight line through the two points <M>{t`A_1`}</M> and <M p=".">{t`A_2`}</M></li>
              <li>The additional postulate says: these three lines are <em>the same</em>. The attraction between two points pulls exactly towards each other, not obliquely past each other.</li>
              <li>The handwritten part means: <M>{t`A_1(t_0)`}</M> is the position of <M>{t`A_1`}</M> at time <M p=".">{t`t_0`}</M> For a <em>contact force</em> the two positions coincide (<M p=")">=</M> for a force at a distance they do not (<M p=").">{t`\neq`}</M> If the points coincide, there is no connecting line any more.</li>
            </ol>
            <p>Why the additional postulate is needed, the page does not say: it simply demands it. A justification needs the moment (<a href="#leistung-rotation">page 34</a>; that is our supplement). For contact forces the notes ask for no direction; how a contact force acts when the bodies touch over an area is dealt with only on the <a href="#verteilte-kraefte">next page</a> (Fig. 4.8).</p>
          </>}
        />
        <See>
          <T
            de={<>Zieh die zwei Punkte hin und her: Die Pfeile bleiben auf der gestrichelten Geraden. Zieh sie zusammen, bis sie einrasten – dann fällt die Gerade weg. Schalte die «Variante» ein: Dann siehst du, was das Zusatzpostulat ausschliesst.</>}
            en={<>Drag the two points back and forth: the arrows stay on the dashed line. Drag them together until they snap – then the line disappears. Switch on the “variant”: you see what the additional postulate rules out.</>}
          />
        </See>
        <K2Fern />
        <T
          de={<p>Die Figur prüft das für dich nach: Das grüne Häkchen heisst, dass beide Pfeile parallel zur Verbindung von <M>{t`A_1`}</M> nach <M>{t`A_2`}</M> sind, also <M p=".">{t`\v F \parallel \v{A_1A_2}`}</M> In der schiefen Variante stimmt das nicht: Die Kräfte sind gleich gross und entgegengesetzt, aber sie liegen daneben.</p>}
          en={<p>The figure checks this for you: the green tick means that both arrows are parallel to the connection from <M>{t`A_1`}</M> to <M p=",">{t`A_2`}</M> that is <M p=".">{t`\v F \parallel \v{A_1A_2}`}</M> In the tilted variant this is not true: the forces are equal and opposite, but they lie beside the line.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="keine-ohne" title={<T de="3. Es existiert keine Kraft ohne Reaktion" en="3. There is no force without a reaction" />}>
        <Box kind="lecture" src={<Src p={30} />}>
          <T
            de={<ul><li>Es existiert keine Kraft ohne Reaktion.</li></ul>}
            en={<ul><li>There exists no force without a reaction.</li></ul>}
          />
        </Box>
        <T
          de={<p className="keep">Das ist der Satz zum Merken: Jede Kraft, die du zeichnest, hat eine Gegenkraft – auch wenn niemand sie zeichnet. Wenn die Erde am Buch zieht, zieht das Buch an der Erde. Zum Finden der Gegenkraft gibt es eine Faustregel: Dreh den Satz um. «Der Tisch drückt das Buch» wird zu «das Buch drückt den Tisch». Die Gegenkraft greift immer am <em>anderen</em> Körper an. (Die zwei letzten Zeilen der Seite, «innere und äussere Kräfte», sind das Thema der <a href="#systemabgrenzung">nächsten Lektion</a>.)</p>}
          en={<p className="keep">This is the sentence to remember: every force you draw has a counter-force – even if nobody draws it. When the Earth pulls on the book, the book pulls on the Earth. There is a rule of thumb for finding the counter-force: turn the sentence around. “The table pushes the book” becomes “the book pushes the table”. The counter-force always acts on the <em>other</em> body. (The last two lines of the page, “inner and outer forces”, are the topic of the <a href="#systemabgrenzung">next lesson</a>.)</p>}
        />
        <See>
          <T
            de={<>Wähle in einer Szene eine Kraft (Pfeil oder Knopf). Ihre Gegenkraft leuchtet am anderen Körper auf. Beim Buch auf dem Tisch sind das Gewicht <M>{t`\v G`}</M> und die Tischkraft <M>{t`\v N`}</M> kein Paar: Probiere beide.</>}
            en={<>Choose a force in a scene (arrow or button). Its counter-force lights up on the other body. For the book on the table, the weight <M>{t`\v G`}</M> and the table force <M>{t`\v N`}</M> are not a pair: try both.</>}
          />
        </See>
        <K2Where />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section long id="missverstaendnisse" title={<T de="4. Häufige Missverständnisse" en="4. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Actio und Reactio heben sich auf – also kann sich nichts bewegen.»" en="“Actio and Reactio cancel – so nothing could ever move.”" />}>
          <T
            de={<>Aufheben können sich nur Kräfte am <em>selben</em> Körper. Actio und Reactio greifen an verschiedenen Körpern an (<M>{t`A_2`}</M> und <M p=")">{t`A_1`}</M> Das Pferd zieht den Wagen nach vorn (Kraft am Wagen); der Wagen zieht das Pferd nach hinten (Kraft am Pferd). Was der Wagen tut, hängt nur von den Kräften <em>am Wagen</em> ab – dort steht das Gegenstück der Pferdekraft nicht. Die Rollschuhe zeigen es: Beide Pfeile sind gleich lang, und trotzdem rollen beide weg.</>}
            en={<>Only forces on the <em>same</em> body can cancel. Actio and Reactio act on different bodies (<M>{t`A_2`}</M> and <M p=").">{t`A_1`}</M> The horse pulls the cart forwards (a force on the cart); the cart pulls the horse backwards (a force on the horse). What the cart does depends only on the forces <em>on the cart</em> – and the partner of the horse’s force is not among them. The roller skates show it: both arrows are equally long, and still both roll away.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Das Gewicht des Buchs und die Kraft des Tisches sind Actio und Reactio.»" en="“The weight of the book and the force of the table are Actio and Reactio.”" />}>
          <T
            de={<>Nein, obwohl die zwei Pfeile gleich lang und entgegengesetzt aussehen. Beide wirken auf <em>dasselbe</em> Buch: <M>{t`\v G`}</M> von der Erde, <M>{t`\v N`}</M> vom Tisch. Das ist ein Gleichgewicht, kein Paar. Die Gegenkraft von <M>{t`\v G`}</M> ist die Anziehung des Buchs auf die Erde, die Gegenkraft von <M>{t`\v N`}</M> der Druck des Buchs auf den Tisch. Probiere es in der Szene «Buch auf Tisch».</>}
            en={<>No, although the two arrows look equally long and opposite. Both act on the <em>same</em> book: <M>{t`\v G`}</M> from the Earth, <M>{t`\v N`}</M> from the table. That is an equilibrium, not a pair. The counter-force of <M>{t`\v G`}</M> is the book’s attraction on the Earth, the counter-force of <M>{t`\v N`}</M> the book’s pressure on the table. Try it in the scene “Book on a table”.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Zuerst kommt die Actio, danach die Reactio.»" en="“First comes the Actio, then the Reactio.”" />}>
          <T
            de={<>Die Wörter klingen nach «erst – dann», aber so ist es nicht gemeint: Es gibt keine Kraft ohne Reaktion, und beide sind gleichzeitig da. Wer als «Actio» zählt, ist nur eine Frage der Betrachtung (Ergänzung zum Skript).</>}
            en={<>The words sound like “first – then”, but that is not what is meant: there is no force without a reaction, and both are there at the same time. Which one counts as the “Actio” is just a matter of how you look at it (supplement to the notes).</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Der Leichtere wird mit weniger Kraft gestossen.»" en="“The lighter one is pushed with less force.”" />}>
          <T
            de={<>Beide Kräfte sind gleich gross, <M p=".">{t`|\v F| = |-\v F|`}</M> Gleich gross ist die Kraft, nicht die Wirkung: Auf den Leichteren wirkt dieselbe Kraft, aber sie bringt ihn schneller in Fahrt (Rollschuhe oben).</>}
            en={<>Both forces are equally large, <M p=".">{t`|\v F| = |-\v F|`}</M> The force is equal, not its effect: the lighter one feels the same force, but it gets him moving faster (roller skates above).</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="merke" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><b>Reaktionsprinzip:</b> Wirkt <M>{t`A_1`}</M> auf <M>{t`A_2`}</M> mit <M p=",">{t`\{A_2\,|\,\v F\}`}</M> so wirkt <M>{t`A_2`}</M> auf <M>{t`A_1`}</M> mit <M p=".">{t`\{A_1\,|\,-\v F\}`}</M></li>
              <li>Gleich gross, entgegengesetzt, aber an <em>zwei verschiedenen Körpern</em>: Darum heben sie sich nicht auf.</li>
              <li><b>Zusatzpostulat:</b> Bei Fernkräften liegen beide Kräfte auf der Verbindungsgeraden von <M>{t`A_1`}</M> und <M p=".">{t`A_2`}</M> (Bei Berührung fallen die Punkte zusammen.)</li>
              <li>Es gibt keine Kraft ohne Gegenkraft. Zum Finden: den Satz umdrehen.</li>
            </ul>}
            en={<ul>
              <li><b>Reaction principle:</b> if <M>{t`A_1`}</M> acts on <M>{t`A_2`}</M> with <M p=",">{t`\{A_2\,|\,\v F\}`}</M> then <M>{t`A_2`}</M> acts on <M>{t`A_1`}</M> with <M p=".">{t`\{A_1\,|\,-\v F\}`}</M></li>
              <li>Equal, opposite, but on <em>two different bodies</em>: that is why they do not cancel.</li>
              <li><b>Additional postulate:</b> for forces at a distance both forces lie on the connecting line of <M>{t`A_1`}</M> and <M p=".">{t`A_2`}</M> (On contact the points coincide.)</li>
              <li>There is no force without a counter-force. To find it: turn the sentence around.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Die Kraft als <a href="#kraft">punktgebundener Vektor</a> (Seite 29) macht die Aussage erst möglich: «Gegenkraft am anderen Punkt» braucht den Angriffspunkt. Die <a href="#systemabgrenzung">Systemabgrenzung</a> nutzt das Prinzip sofort: Liegen beide Punkte im System, ist die Kraft «innen». Die <a href="#verteilte-kraefte">verteilten Kräfte</a> zeigen, wie die Berührung auf einer Fläche aussieht, und mit dem Moment (<a href="#leistung-rotation">Seite 34</a>) lässt sich später mehr zum Zusatzpostulat sagen.</p>}
          en={<p className="connections"><b>Connections:</b> The force as a <a href="#kraft">point-bound vector</a> (page 29) is what makes the statement possible: “counter-force at the other point” needs the point of application. The <a href="#systemabgrenzung">system boundary</a> uses the principle at once: if both points lie in the system, the force is “inner”. The <a href="#verteilte-kraefte">distributed forces</a> show what touching over an area looks like, and with the moment (<a href="#leistung-rotation">page 34</a>) more can be said about the additional postulate later.</p>}
        />
      </Section>
    </article>
  );
}
