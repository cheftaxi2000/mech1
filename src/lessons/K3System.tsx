import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CartPair, SystemExplorer } from '../viz/force/K3SystemFigure';
import { freeScene } from '../viz/force/k3FreeScene';
import '../viz/force/k34.css';

const t = String.raw;

export default function K3System() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bevor man Kräfte berechnet, muss man festlegen, <em>was</em> man eigentlich untersucht: nur den Klotz, den Klotz samt Unterlage oder die ganze Maschine. Diese Entscheidung heisst <De en="system boundary">Systemabgrenzung</De>. Sie bestimmt, welche Kräfte «von aussen» kommen und welche «im Inneren» bleiben. Das Skript zeigt es auf zwei Seiten an einem einzigen Bild: ein Lastkörper liegt auf einem Träger, der auf zwei Stützen ruht.</p>}
        en={<p className="lede">Before you calculate forces you have to decide <em>what</em> you are actually looking at: just the block, the block together with its support, or the whole machine. This decision is called the <De en="system boundary">Systemabgrenzung</De>. It determines which forces come “from outside” and which stay “inside”. The notes show it over two pages with a single picture: a load body rests on a beam, which rests on two supports.</p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Stell dir vor, du schneidest aus einem Foto einen Ausschnitt aus. Was im Ausschnitt liegt, gehört zu deiner Untersuchung. Alles andere ist «draussen». Der Rand des Ausschnitts ist die Systemgrenze.</p>
            <p>Ein Auto mit Insassen zeigt, warum das wichtig ist. Du sitzt drin und stemmst dich mit aller Kraft gegen das Armaturenbrett. Das Auto fährt nicht los. Du drückst aufs Armaturenbrett, und das Armaturenbrett drückt genauso stark zurück. Beide Kräfte liegen <em>innerhalb</em> des Autos – es sind <b>innere Kräfte</b>. Stellst du dich aber auf die Strasse und schiebst von aussen, dann kommt die Kraft über die Grenze herein: eine <b>äussere Kraft</b>. Was das Auto als Ganzes in Bewegung bringt, kommt von aussen.</p>
          </>}
          en={<>
            <p>Imagine cutting a piece out of a photo. What is inside the piece belongs to your investigation. Everything else is “outside”. The edge of the piece is the system boundary.</p>
            <p>A car with passengers shows why this matters. You sit inside and push with all your strength against the dashboard. The car does not move. You push on the dashboard, and the dashboard pushes back just as hard. Both forces lie <em>inside</em> the car – they are <b>inner forces</b>. But if you stand on the road and push from outside, the force comes in across the boundary: an <b>outer force</b>. What sets the car as a whole in motion comes from outside.</p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="skript" title={<T de="1. Was das Skript sagt" en="1. What the notes say" />}>
        <Box kind="lecture" src={<Src p="30–31" />} title={<T de="Innere und äussere Kräfte, Systemabgrenzung" en={<>Inner and outer forces (<span lang="de">innere und äussere Kräfte</span>), system boundary</>} />}>
          <T
            de={<>
              <p>Am Ende der Seite zum Reaktionsprinzip (S. 30):</p>
              <ul>
                <li>«Es existiert keine Kraft ohne Reaktion.»</li>
                <li>«<u>Innere</u> und <u>äussere Kräfte</u> <M>{t`\leftrightarrow`}</M> <u>Systemabgrenzung</u>»</li>
                <li><b>Innere Kraft:</b> Angriffspunkt der Reaktion <u>auch</u> im System.</li>
                <li><b>Äussere Kraft:</b> Angriffspunkt der Reaktion <u>ausserhalb</u> vom System.</li>
              </ul>
              <p>Auf der nächsten Seite (S. 31), unter den Bildern:</p>
              <ul>
                <li><b>Systemabgrenzung.</b> System: Teilbereich des 3D-Raumes, besteht i. A. aus mehreren Körpern.</li>
                <li>Abgrenzung: je nach Ziel der Analyse.</li>
              </ul>
              <p>Die Bilder dazu (Lastkörper auf Träger auf zwei Stützen) schauen wir uns in Abschnitt 3 an.</p>
            </>}
            en={<>
              <p>At the end of the page on the reaction principle (p. 30):</p>
              <ul>
                <li>“There is no force without a reaction.”</li>
                <li>“<u>Inner</u> and <u>outer forces</u> <M>{t`\leftrightarrow`}</M> <u>system boundary</u>”</li>
                <li><b>Inner force:</b> the point of application of the reaction is <u>also</u> in the system.</li>
                <li><b>Outer force:</b> the point of application of the reaction is <u>outside</u> the system.</li>
              </ul>
              <p>On the next page (p. 31), below the pictures:</p>
              <ul>
                <li><b>System boundary</b> (<span lang="de">Systemabgrenzung</span>). System: a region of 3D space; in general it consists of several bodies.</li>
                <li>Where to draw the boundary: depending on the aim of the analysis.</li>
              </ul>
              <p>The pictures that go with it (load body on a beam on two supports) are looked at in section 3.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Jede Kraft hat eine Reaktion (<a href="#reaktionsprinzip">Reaktionsprinzip</a>). Zu <M>{t`\{A_2 \mid \v F\}`}</M> gehört <M p=".">{t`\{A_1 \mid -\v F\}`}</M> Die Reaktion greift am <em>anderen</em> Körper an, im Punkt <M p=".">{t`A_1`}</M></li>
              <li>Das System ist ein Stück des Raumes, das wir mit einer geschlossenen Grenze abstecken. Was darin liegt, gehört dazu – oft sind es mehrere Körper.</li>
              <li>Nimm eine Kraft, die an einem Punkt <em>im System</em> angreift. Frage: Wo greift ihre Reaktion an? Liegt dieser Punkt auch im System, ist es eine <b>innere</b> Kraft. Liegt er draussen, ist es eine <b>äussere</b> Kraft.</li>
              <li>«Je nach Ziel der Analyse» heisst: Die Grenze wählst <em>du</em>. Wo du sie ziehst, entscheidet, welche Kräfte «aussen» sind (Abschnitt 5).</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>Every force has a reaction (<a href="#reaktionsprinzip">reaction principle</a>). To <M>{t`\{A_2 \mid \v F\}`}</M> belongs <M p=".">{t`\{A_1 \mid -\v F\}`}</M> The reaction acts on the <em>other</em> body, at the point <M p=".">{t`A_1`}</M></li>
              <li>The system is a piece of space that we mark off with a closed boundary. Whatever lies inside belongs to it – often several bodies.</li>
              <li>Take a force that acts at a point <em>in the system</em>. Ask: where does its reaction act? If that point is in the system too, it is an <b>inner</b> force. If it is outside, it is an <b>outer</b> force.</li>
              <li>“Depending on the aim of the analysis” means: <em>you</em> choose the boundary. Where you draw it decides which forces are “outside” (section 5).</li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="wagen" title={<T de="2. Das kleinste Beispiel: zwei Wagen" en="2. The smallest example: two carts" />}>
        <T
          de={<>
            <p>Bevor wir das Bild des Skripts mit seinen vierzehn Pfeilen anschauen, genügen zwei Wagen auf einer glatten Schiene. Eine Hand schiebt Wagen 1 mit der Kraft <M p=".">{t`\v H`}</M> Wagen 1 schiebt dabei Wagen 2 mit <M p=",">{t`\v P`}</M> und Wagen 2 schiebt Wagen 1 mit <M>{t`-\v P`}</M> zurück. Das ist das Paar Actio und Reactio. Gewicht und Schiene lassen wir weg.</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Bei «Wagen 1» allein liegt die Reaktion von <M>{t`\v P`}</M> ausserhalb der Grenze, also ist <M>{t`-\v P`}</M> eine äussere Kraft. Wähle «beide»: Dann liegt das ganze Paar im Rahmen. Es wird grau und bleibt in der Summe der äusseren Kräfte nicht übrig.</p>
          </>}
          en={<>
            <p>Before we look at the picture of the notes with its fourteen arrows, two carts on a smooth rail are enough. A hand pushes cart 1 with the force <M p=".">{t`\v H`}</M> Cart 1 thereby pushes cart 2 with <M p=",">{t`\v P`}</M> and cart 2 pushes cart 1 back with <M>{t`-\v P`}</M> That is the pair actio and reactio. We leave out the weight and the rail.</p>
            <p className="vdemo-note"><b>What to look for:</b> With “cart 1” alone, the reaction of <M>{t`\v P`}</M> lies outside the boundary, so <M>{t`-\v P`}</M> is an outer force. Choose “both”: now the whole pair is inside the frame. It turns grey and nothing of it is left in the sum of the outer forces.</p>
          </>}
        />
        <CartPair />
        <T
          de={<p>Wie gross <M>{t`\v P`}</M> ist, hängt davon ab, wie sich die Wagen bewegen. Das kommt später; hier zählt nur, <em>wo die Pfeile angreifen</em>. Die Summen unter dem Bild nehmen wir gleich noch einmal auf: Die inneren Kräfte addieren sich immer zu null, weil jede ihre Gegenkraft im selben Rahmen hat.</p>}
          en={<p>How large <M>{t`\v P`}</M> is depends on how the carts move. That comes later; here all that matters is <em>where the arrows act</em>. We pick up the sums below the picture again in a moment: the inner forces always add up to zero, because each has its counter-force inside the same frame.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="bild" title={<T de="3. Das Bild auf Seite 31" en="3. The picture on page 31" />}>
        <Box kind="lecture" src={<Src p={31} fig="Bild oben" />} title={<T de="Lastkörper auf Träger auf zwei Stützen" en={<>Load body (<span lang="de">Lastkörper</span>) on beam (<span lang="de">Träger</span>) on two supports (<span lang="de">Stützen</span>)</>} />}>
          <T
            de={<>
              <p>Oben steht das Gesamtbild: ein <b>Lastkörper</b> liegt auf einem <b>Träger</b>, der bei <M>A</M> und <M>B</M> auf einer <b>Stütze</b> aufliegt. Eingezeichnet sind (alle grau):</p>
              <ul>
                <li>am Lastkörper: <M>{t`\v G`}</M> (nach unten, im Kreis in der Mitte) und <M>{t`\v Z`}</M> (nach rechts, am rechten Ende);</li>
                <li>an den zwei Berührpunkten Lastkörper–Träger: <M>{t`\v N_1, \v N_2`}</M> (nach oben) und <M>{t`\v R_1, \v R_2`}</M> (nach links, am Lastkörper);</li>
                <li>dazu die Gegenkräfte am Träger: <M>{t`-\v N_1, -\v N_2`}</M> (nach unten) und <M>{t`-\v R_1, -\v R_2`}</M> (nach rechts);</li>
                <li>an den Stützen: <M>{t`\v F_A, \v F_B`}</M> am Träger (schräg nach links oben) und <M>{t`-\v F_A, -\v F_B`}</M> an den Stützen (schräg nach rechts unten).</li>
              </ul>
              <p>Darunter folgen vier kleinere Zeichnungen desselben Bildes: zuerst der Lastkörper allein, dann Lastkörper und Träger zusammen (jeweils alle Kräfte grau); danach dieselben zwei Systeme noch einmal, jetzt mit der Legende «<b>äussere Kräfte</b>» (rosa) und «<b>innere Kräfte</b>» (schwarz):</p>
              <ul>
                <li><b>System Lastkörper:</b> <M>{t`\v G, \v Z, \v N_1, \v N_2, \v R_1, \v R_2`}</M> sind alle rosa, also äussere Kräfte.</li>
                <li><b>System Lastkörper + Träger:</b> <M>{t`\v G, \v Z, \v F_A, \v F_B`}</M> sind rosa. Die Kräfte <M>{t`\v N, \v R, -\v N, -\v R`}</M> an den Berührpunkten bleiben grau, sind also innere Kräfte.</li>
              </ul>
              <p>Die Buchstaben <M>N</M> und <M>R</M> erklärt das Skript nicht. Wir lesen sie als Kraft senkrecht zur Berührfläche (<M p=",">N</M> «Normalkraft») und längs der Berührfläche (<M p=",">R</M> «Reibung»).</p>
            </>}
            en={<>
              <p>At the top is the whole picture: a <b>load body</b> lies on a <b>beam</b> that rests on a <b>support</b> at <M>A</M> and at <M p=".">B</M> Drawn in (all grey) are:</p>
              <ul>
                <li>on the load body: <M>{t`\v G`}</M> (downward, in the circle in the middle) and <M>{t`\v Z`}</M> (to the right, at the right end);</li>
                <li>at the two contact points load body–beam: <M>{t`\v N_1, \v N_2`}</M> (upward) and <M>{t`\v R_1, \v R_2`}</M> (to the left, on the load body);</li>
                <li>with their counter-forces on the beam: <M>{t`-\v N_1, -\v N_2`}</M> (downward) and <M>{t`-\v R_1, -\v R_2`}</M> (to the right);</li>
                <li>at the supports: <M>{t`\v F_A, \v F_B`}</M> on the beam (slanted up-left) and <M>{t`-\v F_A, -\v F_B`}</M> on the supports (slanted down-right).</li>
              </ul>
              <p>Below follow four smaller drawings of the same picture: first the load body alone, then load body and beam together (all forces grey in each); after that the same two systems again, now with the legend “<b>outer forces</b>” (pink) and “<b>inner forces</b>” (black):</p>
              <ul>
                <li><b>System load body:</b> <M>{t`\v G, \v Z, \v N_1, \v N_2, \v R_1, \v R_2`}</M> are all pink, so outer forces.</li>
                <li><b>System load body + beam:</b> <M>{t`\v G, \v Z, \v F_A, \v F_B`}</M> are pink. The forces <M>{t`\v N, \v R, -\v N, -\v R`}</M> at the contact points stay grey, so they are inner forces.</li>
              </ul>
              <p>The notes do not explain the letters <M>N</M> and <M p=".">R</M> We read them as the force perpendicular to the contact surface (<M p=",">N</M> “normal force”) and along the contact surface (<M p=",">R</M> “friction”).</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Wer zieht an wem?</b> Bevor wir die Pfeile einfärben, schreiben wir zu jeder Kraft die Reaktion dazu. Das ist die Frage aus «So liest man das», Punkt 3.</p>
            <div className="kf-table-wrap">
              <table className="kf-table">
                <thead><tr><th>Kraft</th><th>wirkt auf</th><th>ihre Reaktion</th><th>wirkt auf</th></tr></thead>
                <tbody>
                  <tr><td><M>{t`\v G`}</M></td><td>Lastkörper</td><td><M>{t`-\v G`}</M></td><td>Erde (nicht gezeichnet)</td></tr>
                  <tr><td><M>{t`\v Z`}</M></td><td>Lastkörper</td><td><M>{t`-\v Z`}</M></td><td>das, was zieht (nicht gezeichnet)</td></tr>
                  <tr><td><M>{t`\v N_1, \v N_2`}</M></td><td>Lastkörper</td><td><M>{t`-\v N_1, -\v N_2`}</M></td><td>Träger</td></tr>
                  <tr><td><M>{t`\v R_1, \v R_2`}</M></td><td>Lastkörper</td><td><M>{t`-\v R_1, -\v R_2`}</M></td><td>Träger</td></tr>
                  <tr><td><M>{t`\v F_A, \v F_B`}</M></td><td>Träger</td><td><M>{t`-\v F_A, -\v F_B`}</M></td><td>Stützen <M p=",">A</M> <M>B</M></td></tr>
                </tbody>
              </table>
            </div>
            <p>Das Skript zeichnet für <M>{t`\v G`}</M> und <M>{t`\v Z`}</M> keine Reaktion. Sie wirkt an der Erde bzw. an dem, was am Lastkörper zieht – an Körpern, die in <em>keinem</em> unserer Systeme liegen. Darum sind <M>{t`\v G`}</M> und <M>{t`\v Z`}</M> bei jeder Wahl äussere Kräfte.</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Wähle Körper aus. Die gestrichelte Linie legt sich um sie. Äussere Kräfte werden zinnoberrot, innere grau. Kräfte, die an Körpern <em>ausserhalb</em> der Grenze angreifen, bleiben blass: Sie gehören nicht zum System. Tippe auf einen Pfeil, und seine Reaktion leuchtet auf.</p>
          </>}
          en={<>
            <p><b>Who pulls on whom?</b> Before we colour the arrows, we write down the reaction of every force. This is the question from “How to read this”, point 3.</p>
            <div className="kf-table-wrap">
              <table className="kf-table">
                <thead><tr><th>force</th><th>acts on</th><th>its reaction</th><th>acts on</th></tr></thead>
                <tbody>
                  <tr><td><M>{t`\v G`}</M></td><td>load body</td><td><M>{t`-\v G`}</M></td><td>Earth (not drawn)</td></tr>
                  <tr><td><M>{t`\v Z`}</M></td><td>load body</td><td><M>{t`-\v Z`}</M></td><td>whatever pulls (not drawn)</td></tr>
                  <tr><td><M>{t`\v N_1, \v N_2`}</M></td><td>load body</td><td><M>{t`-\v N_1, -\v N_2`}</M></td><td>beam</td></tr>
                  <tr><td><M>{t`\v R_1, \v R_2`}</M></td><td>load body</td><td><M>{t`-\v R_1, -\v R_2`}</M></td><td>beam</td></tr>
                  <tr><td><M>{t`\v F_A, \v F_B`}</M></td><td>beam</td><td><M>{t`-\v F_A, -\v F_B`}</M></td><td>supports <M p=",">A</M> <M>B</M></td></tr>
                </tbody>
              </table>
            </div>
            <p>The notes draw no reaction for <M>{t`\v G`}</M> and <M p=".">{t`\v Z`}</M> It acts on the Earth, or on whatever pulls on the load body – bodies that are in <em>none</em> of our systems. So <M>{t`\v G`}</M> and <M>{t`\v Z`}</M> are outer forces whatever you choose.</p>
            <p className="vdemo-note"><b>What to look for:</b> Choose bodies. The dashed line wraps around them. Outer forces turn vermilion, inner forces grey. Forces that act on bodies <em>outside</em> the boundary stay faint: they do not belong to the system. Tap an arrow and its reaction lights up.</p>
          </>}
        />
        <SystemExplorer />
        <T
          de={<>
            <p>Probiere diese vier Fälle aus. Die ersten zwei sind die farbigen Bilder des Skripts.</p>
            <ul>
              <li><b>Nur Lastkörper:</b> sechs äussere Kräfte, keine innere. Die Reaktionen von <M>{t`\v N`}</M> und <M>{t`\v R`}</M> liegen am Träger, und der ist draussen.</li>
              <li><b>Lastkörper + Träger:</b> nur noch vier äussere Kräfte: <M>{t`\v G, \v Z, \v F_A, \v F_B`}</M> Die Berührkräfte sind jetzt Paare <em>im</em> Rahmen.</li>
              <li><b>Nur Träger:</b> die Reaktionen <M>{t`-\v N, -\v R`}</M> vom Lastkörper kommen von aussen, ebenso <M>{t`\v F_A, \v F_B`}</M> von den Stützen.</li>
              <li><b>Alles:</b> Jetzt sind auch <M>{t`\v F_A`}</M> und <M>{t`\v F_B`}</M> innere Kräfte. Von aussen bleiben <M>{t`\v G`}</M> und <M>{t`\v Z`}</M> – und der Boden, der die Stützen hält. Diese Bodenkräfte <M>{t`\v H_A, \v H_B`}</M> hat das Skript nicht gezeichnet; wir haben sie ergänzt, damit auch die Stützen im Gleichgewicht sind.</li>
            </ul>
            <p>Die Zahlen (<M p=",">G</M> <M p=",">Z</M> Ort) sind unser Beispiel: Wir lassen den Lastkörper ruhen, mit <M>{t`\v N_1 = \v N_2`}</M> und <M>{t`\v R_1 = \v R_2`}</M> – das nehmen wir einfach an. Welche Kräfte die Stützen dann aufbringen müssen, rechnet man in der Statik aus; hier siehst du nur, dass die äusseren Kräfte sich zu null addieren, wenn nichts beschleunigt.</p>
          </>}
          en={<>
            <p>Try these four cases. The first two are the coloured pictures of the notes.</p>
            <ul>
              <li><b>Load body only:</b> six outer forces, no inner one. The reactions of <M>{t`\v N`}</M> and <M>{t`\v R`}</M> act on the beam, and that is outside.</li>
              <li><b>Load body + beam:</b> only four outer forces are left: <M>{t`\v G, \v Z, \v F_A, \v F_B`}</M> The contact forces are now pairs <em>inside</em> the frame.</li>
              <li><b>Beam only:</b> the reactions <M>{t`-\v N, -\v R`}</M> from the load body come from outside, and so do <M>{t`\v F_A, \v F_B`}</M> from the supports.</li>
              <li><b>Everything:</b> now <M>{t`\v F_A`}</M> and <M>{t`\v F_B`}</M> are inner forces too. What is left from outside is <M>{t`\v G`}</M> and <M>{t`\v Z`}</M> – and the ground that holds the supports. These ground forces <M>{t`\v H_A, \v H_B`}</M> are not drawn in the notes; we added them so that the supports are in equilibrium as well.</li>
            </ul>
            <p>The numbers (<M p=",">G</M> <M p=",">Z</M> place) are our example: we let the load body rest, with <M>{t`\v N_1 = \v N_2`}</M> and <M>{t`\v R_1 = \v R_2`}</M> – we simply assume that. Which forces the supports then have to supply is worked out in statics; here you only see that the outer forces add up to zero when nothing accelerates.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="freischneiden" title={<T de="4. Vom Gesamtbild zum Bild des Lastkörpers" en="4. From the whole picture to the picture of the load body" />}>
        <T
          de={<p>Wie kommt man vom Gesamtbild zu den zwei farbigen Bildern? Man legt die Grenze fest, trennt auf und ersetzt, was man abtrennt, durch Kräfte. Das Wort «Freischneiden» steht nicht im Skript (in der Statik heisst dieses Vorgehen so); das Skript zeigt nur das Ergebnis. Die Animation zeigt den Weg.</p>}
          en={<p>How do we get from the whole picture to the two coloured pictures? We fix the boundary, separate, and replace what we remove by forces. The word “cutting free” (<span lang="de">Freischneiden</span>) is not in the notes (statics uses it for this procedure); the notes only show the result. The animation shows the way.</p>}
        />
        <Derivation title={<T de="System festlegen, abtrennen, Kräfte setzen" en="Fix the system, separate, set the forces" />}>
          <StepPlayer
            label={tr('Animation: Freischneiden des Lastkörpers, innere und äussere Kräfte', 'Animation: cutting the load body free, inner and outer forces')}
            steps={[
              { ms: 2200, holdMs: 3200, caption: <T
                de={<>Ein Lastkörper liegt auf einem Träger auf zwei Stützen. Zwei Pfeile sind schon da: <M>{t`\v G`}</M> zieht ihn nach unten, <M p=".">{t`\v Z`}</M> nach rechts.</>}
                en={<>A load body lies on a beam on two supports. Two arrows are already there: <M>{t`\v G`}</M> pulls it down, <M p=".">{t`\v Z`}</M> to the right.</>} /> },
              { ms: 2600, holdMs: 3400, caption: <T
                de={<>Wir ziehen eine gestrichelte Linie um den Lastkörper: die <b>Systemgrenze</b>. Was darin liegt, gehört zum System. Alles ausserhalb – der Träger, die Stützen, die Erde – nicht.</>}
                en={<>We draw a dashed line around the load body: the <b>system boundary</b>. What lies inside belongs to the system. Everything outside – the beam, the supports, the Earth – does not.</>} /> },
              { ms: 2600, holdMs: 3400, caption: <T
                de={<>Wir heben den Lastkörper vom Träger ab. Jetzt fehlt, was der Träger bisher getan hat – er hat den Lastkörper getragen und festgehalten.</>}
                en={<>We lift the load body off the beam. Now something is missing: what the beam did before – it carried the load body and held it in place.</>} /> },
              { ms: 3200, holdMs: 4000, caption: <T
                de={<>Das ersetzen wir durch Kräfte an den Berührpunkten: <M>{t`\v N_1, \v N_2`}</M> drücken nach oben, <M>{t`\v R_1, \v R_2`}</M> halten nach links. Ihre Reaktionen <M>{t`-\v N, -\v R`}</M> wirken auf den Träger (blass).</>}
                en={<>We replace it by forces at the contact points: <M>{t`\v N_1, \v N_2`}</M> push up, <M>{t`\v R_1, \v R_2`}</M> hold to the left. Their reactions <M>{t`-\v N, -\v R`}</M> act on the beam (faint).</>} /> },
              { ms: 2800, holdMs: 4600, caption: <T
                de={<>Für jede Kraft am Lastkörper fragen wir: Wo greift die Reaktion an? Bei <M>{t`\v G`}</M> an der Erde, bei <M>{t`\v Z`}</M> an dem, was zieht, bei <M>{t`\v N, \v R`}</M> am Träger. Alle liegen ausserhalb der Linie: Es sind sechs <b>äussere Kräfte</b>. Das ist das erste farbige Bild des Skripts.</>}
                en={<>For every force on the load body we ask: where does its reaction act? For <M>{t`\v G`}</M> on the Earth, for <M>{t`\v Z`}</M> on whatever pulls, for <M>{t`\v N, \v R`}</M> on the beam. All lie outside the line: these are six <b>outer forces</b>. This is the first coloured picture of the notes.</>} /> },
              { ms: 3800, caption: <T
                de={<>Jetzt legen wir die Grenze um Lastkörper <em>und</em> Träger. Die Berührpunkte liegen im Rahmen: <M>{t`\v N, \v R`}</M> und ihre Reaktionen sind jetzt <b>innere Kräfte</b> (grau). Dafür kommen <M>{t`\v F_A, \v F_B`}</M> von den Stützen von aussen dazu. Das ist das zweite farbige Bild.</>}
                en={<>Now we put the boundary around the load body <em>and</em> the beam. The contact points lie inside the frame: <M>{t`\v N, \v R`}</M> and their reactions are now <b>inner forces</b> (grey). In return <M>{t`\v F_A, \v F_B`}</M> come in from the supports, from outside. This is the second coloured picture.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={freeScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>Das Wichtigste am Bild:</b> <M>{t`\v N_1`}</M> ist dieselbe Kraft in Schritt 5 und 6 – nur ihre Rolle wechselt. Im ersten Bild ist sie äusserlich (zinnoberrot), im zweiten innerlich (grau). Die Physik am Berührpunkt hat sich nicht verändert; wir haben nur die Grenze verschoben.</p>
          </>}
          en={<>
            <p><b>The key point of the picture:</b> <M>{t`\v N_1`}</M> is the same force in steps 5 and 6 – only its role changes. In the first picture it is outer (vermilion), in the second inner (grey). The physics at the contact point has not changed; we only moved the boundary.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ziel" title={<T de="5. Welches System für welche Frage?" en="5. Which system for which question?" />}>
        <T
          de={<>
            <p>«Abgrenzung: je nach Ziel der Analyse» – das ist der praktische Satz der Seite. Man wählt das System so, dass die Kraft, die man sucht, <em>äussere</em> Kraft ist, und die, die man nicht kennt und nicht braucht, <em>innere</em> Kraft.</p>
            <div className="kf-table-wrap">
              <table className="kf-table">
                <thead><tr><th>Ich will wissen …</th><th>Ich wähle als System …</th><th>Dann ist das …</th></tr></thead>
                <tbody>
                  <tr><td>die Kräfte <M>{t`\v R_1, \v R_2`}</M> zwischen Lastkörper und Träger</td><td>den Lastkörper allein</td><td><M>{t`\v R_1, \v R_2`}</M> sind äussere Kräfte und stehen in der Liste.</td></tr>
                  <tr><td>die Kräfte <M p=",">{t`\v F_A, \v F_B`}</M> die die Stützen am Träger aufbringen</td><td>Lastkörper <em>und</em> Träger</td><td><M>{t`\v F_A, \v F_B`}</M> sind äussere Kräfte. <M>{t`\v N, \v R`}</M> sind innere Kräfte und verschwinden aus der Liste. Man muss sie nicht kennen.</td></tr>
                  <tr><td>was der Boden an den Stützen aufnimmt</td><td>alles, mit den Stützen</td><td>Von aussen bleiben nur <M>{t`\v G, \v Z`}</M> und die Kräfte des Bodens.</td></tr>
                </tbody>
              </table>
            </div>
            <p>Man kann es sich merken: <b>Soll eine Kraft in die Rechnung, schneide so, dass sie die Grenze kreuzt.</b> Wie man aus den äusseren Kräften dann Zahlen bekommt, lernst du in der Statik. Hier geht es nur um die Auswahl.</p>
          </>}
          en={<>
            <p>“Boundary: depending on the aim of the analysis” – this is the practical sentence of the page. You choose the system so that the force you are looking for is an <em>outer</em> force, and the ones you neither know nor need are <em>inner</em> forces.</p>
            <div className="kf-table-wrap">
              <table className="kf-table">
                <thead><tr><th>I want to know …</th><th>I choose as the system …</th><th>Then …</th></tr></thead>
                <tbody>
                  <tr><td>the forces <M>{t`\v R_1, \v R_2`}</M> between load body and beam</td><td>the load body alone</td><td><M>{t`\v R_1, \v R_2`}</M> are outer forces and are in the list.</td></tr>
                  <tr><td>the forces <M>{t`\v F_A, \v F_B`}</M> that the supports exert on the beam</td><td>load body <em>and</em> beam</td><td><M>{t`\v F_A, \v F_B`}</M> are outer forces. <M>{t`\v N, \v R`}</M> are inner forces and vanish from the list. You need not know them.</td></tr>
                  <tr><td>what the ground takes up at the supports</td><td>everything, with the supports</td><td>Only <M>{t`\v G, \v Z`}</M> and the forces of the ground remain from outside.</td></tr>
                </tbody>
              </table>
            </div>
            <p>A rule to remember: <b>if a force is to enter the calculation, cut so that it crosses the boundary.</b> How to get numbers from the outer forces is learned in statics. Here it is only about the choice.</p>
          </>}
        />
        <Box kind="supplement" title={<T de="Warum ist die Summe der inneren Kräfte null?" en="Why do the inner forces add up to zero?" />}>
          <T
            de={<>
              <p>Das ist eine Folgerung aus dem Reaktionsprinzip, nicht aus dem Skript. Jede innere Kraft hat ihre Reaktion <em>auch im System</em>. Also treten die inneren Kräfte immer als Paare auf:</p>
              <MD>{t`\v F + (-\v F) = \v 0.`}</MD>
              <p>Beide Pfeile des Paars liegen im System, also gehen beide in die Summe über alle Kräfte am System ein, und sie heben sich weg. Darum zeigt die Anzeige unter den Bildern bei <M>{t`\sum \v F_{\text{innen}}`}</M> immer null – für jede Wahl des Systems. Bei einer äusseren Kraft liegt die Reaktion draussen, also fehlt der Partner in der Summe.</p>
              <p>Die Summe der <em>äusseren</em> Kräfte ist dagegen nur null, wenn sich nichts beschleunigt (wie in unserem Beispiel mit dem ruhenden Lastkörper). Bei den Wagen ist sie ungleich null: Die Hand schiebt, die Wagen werden schneller. Was die inneren Kräfte für Momente bedeuten, kommt später.</p>
            </>}
            en={<>
              <p>This is a consequence of the reaction principle, not something from the notes. Every inner force has its reaction <em>also in the system</em>. So inner forces always occur in pairs:</p>
              <MD>{t`\v F + (-\v F) = \v 0.`}</MD>
              <p>Both arrows of the pair are in the system, so both enter the sum over all forces on the system, and they cancel. That is why the display below the pictures always shows zero for <M>{t`\sum \v F_{\text{inner}}`}</M> – for every choice of system. For an outer force the reaction is outside, so its partner is missing from the sum.</p>
              <p>The sum of the <em>outer</em> forces, on the other hand, is only zero if nothing accelerates (as in our example with the load body at rest). For the carts it is not zero: the hand pushes, the carts speed up. What inner forces mean for moments comes later.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="missverstaendnisse" title={<T de="6. Häufige Missverständnisse" en="6. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Innere Kräfte gibt es gar nicht.»" en="“Inner forces do not exist.”" />}>
          <T de={<>Doch, es gibt sie. Wagen 1 schiebt Wagen 2 wirklich mit <M p=".">{t`\v P`}</M> «Innere Kraft» heisst nur: Die Reaktion liegt im selben System. Darum taucht das Paar in der Liste der äusseren Kräfte nicht auf und hebt sich in der Summe weg. Wähle nur Wagen 1, und <M>{t`-\v P`}</M> ist wieder da.</>} en={<>They do. Cart 1 really does push cart 2 with <M p=".">{t`\v P`}</M> “Inner force” only means: the reaction lies in the same system. That is why the pair does not show up in the list of outer forces and cancels in the sum. Choose just cart 1, and <M>{t`-\v P`}</M> is back.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Wenn ich die Grenze anders ziehe, ändert sich die Physik.»" en="“If I draw the boundary differently, the physics changes.”" />}>
          <T de={<>Nein. Die Kräfte am Berührpunkt sind dieselben, egal welches System du wählst. Es ändert sich nur die Beschreibung: welche Kräfte du als «von aussen» aufschreiben musst. Mit der richtigen Wahl wird die Aufgabe kürzer, aber nie ein anderes Ergebnis.</>} en={<>No. The forces at the contact point are the same whichever system you choose. Only the description changes: which forces you have to write down as “from outside”. With the right choice the task gets shorter, but never gives a different result.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Eine Kraft ist entweder innen oder aussen – für immer.»" en="“A force is either inner or outer – for good.”" />}>
          <T de={<>«Innen» und «aussen» gibt es nur <em>in Bezug auf ein System</em>. <M>{t`\v N_1`}</M> ist äusserlich für den Lastkörper allein und innerlich für Lastkörper + Träger. Frage immer: innere Kraft <em>von welchem System?</em></>} en={<>“Inner” and “outer” only exist <em>with respect to a system</em>. <M>{t`\v N_1`}</M> is outer for the load body alone and inner for load body + beam. Always ask: inner force <em>of which system?</em></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Beim Abtrennen genügt ein Pfeil an der Schnittstelle.»" en="“One arrow at the cut is enough.”" />}>
          <T de={<>An der Schnittstelle hat jede Seite ihren eigenen Pfeil: <M>{t`\v N_1`}</M> am Lastkörper, <M>{t`-\v N_1`}</M> am Träger. Nimmt man nur den Lastkörper, zeichnet man nur <M p=";">{t`\v N_1`}</M> <M>{t`-\v N_1`}</M> gehört dann zum Träger und fehlt im Bild. Wer beide Pfeile an denselben Körper setzt, hat die Kräfte doppelt gezählt – sie heben sich im Bild nur dann weg, wenn beide Körper im System sind.</>} en={<>At the cut each side has its own arrow: <M>{t`\v N_1`}</M> on the load body, <M>{t`-\v N_1`}</M> on the beam. If you take only the load body, you draw only <M p=";">{t`\v N_1`}</M> <M>{t`-\v N_1`}</M> then belongs to the beam and is missing from the picture. Putting both arrows on the same body counts the forces twice – they only cancel in the picture when both bodies are in the system.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="merke" title={<T de="7. Das Wichtigste" en="7. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Das <b>System</b> ist ein Teilbereich des Raumes, meist mit mehreren Körpern. Seine Grenze wählt man selbst, je nach Ziel der Analyse.</li>
              <li><b>Innere Kraft:</b> Die Reaktion greift auch im System an. <b>Äussere Kraft:</b> Die Reaktion greift ausserhalb an.</li>
              <li>Dieselbe Kraft kann für ein System äusserlich und für ein grösseres innerlich sein (<M p=").">{t`\v N_1`}</M></li>
              <li>Innere Kräfte treten als Paare <M p=",">{t`\v F`}</M> <M>{t`-\v F`}</M> im System auf. Ihre Summe ist null, und sie stehen nicht in der Liste der äusseren Kräfte.</li>
            </ul>}
            en={<ul>
              <li>The <b>system</b> is a region of space, usually with several bodies. You choose its boundary yourself, depending on the aim of the analysis.</li>
              <li><b>Inner force:</b> the reaction also acts in the system. <b>Outer force:</b> the reaction acts outside.</li>
              <li>The same force can be outer for one system and inner for a larger one (<M p=").">{t`\v N_1`}</M></li>
              <li>Inner forces occur as pairs <M p=",">{t`\v F`}</M> <M>{t`-\v F`}</M> in the system. Their sum is zero, and they do not appear in the list of outer forces.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Ohne das <a href="#reaktionsprinzip">Reaktionsprinzip</a> gäbe es keine Paare und damit keine Unterscheidung innen/aussen. Das Bild arbeitet mit <a href="#kraft">punktgebundenen Kräften</a>; im Berührpunkt ist der «Pfeil» in Wirklichkeit eine <a href="#verteilte-kraefte">verteilte Kraft</a>. Später, bei der <a href="#leistung">Leistung</a>, fragt man ebenfalls, welche Kräfte von aussen am System arbeiten.</p>}
          en={<p className="connections"><b>Connections:</b> Without the <a href="#reaktionsprinzip">reaction principle</a> there would be no pairs and so no inner/outer distinction. The picture works with <a href="#kraft">point-bound forces</a>; at a contact point the “arrow” is in reality a <a href="#verteilte-kraefte">distributed force</a>. Later, with <a href="#leistung">power</a>, one also asks which forces act on the system from outside.</p>}
        />
      </Section>
    </article>
  );
}
