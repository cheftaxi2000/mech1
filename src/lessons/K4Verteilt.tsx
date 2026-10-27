import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CellsFigure } from '../viz/force/K4CellsFigure';
import { DensityFigure } from '../viz/force/K4DensityFigure';
import { LineFigure } from '../viz/force/K4LineFigure';
import { PatchFigure } from '../viz/force/K4PatchFigure';
import { WeightFigure } from '../viz/force/K4WeightFigure';
import { lineScene } from '../viz/force/k4LineScene';
import { weightScene } from '../viz/force/k4WeightScene';
import '../viz/force/k34.css';

const t = String.raw;

export default function K4Verteilt() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bisher war eine Kraft ein Pfeil in einem Punkt. Das ist praktisch, aber es gibt es nur auf dem Papier: In Wirklichkeit drückt immer etwas über eine Fläche, zieht in jedem Stückchen eines Körpers oder verteilt sich entlang eines Balkens. Der Pfeil ist eine <em>Zusammenfassung</em>. Diese Lektion zeigt, was dahinter steckt: die <De en="force density">Kraftdichte</De> – Kraft pro Fläche, pro Volumen oder pro Länge.</p>}
        en={<p className="lede">So far a force was an arrow at a point. That is handy, but it only exists on paper: in reality something always presses over an area, pulls in every little piece of a body, or spreads along a beam. The arrow is a <em>summary</em>. This lesson shows what is behind it: the <De en="force density">Kraftdichte</De> – force per area, per volume or per length.</p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Ein Stuhl drückt nicht «in einem Punkt» auf den Boden, sondern über vier kleine Flecken, nämlich seine Stuhlbeine. Ein Stöckelschuh trägt dieselbe Person auf einer viel kleineren Fläche, nämlich einem Absatz von etwa einem Quadratzentimeter. Die Kraft insgesamt ist gleich. Der Absatz hinterlässt trotzdem Dellen im Parkett, die Sohle eines Turnschuhs nicht. Wichtig ist offenbar, <em>wie viel Kraft auf wie viel Platz</em> kommt.</p>
            <p>Das kennst du von der Bevölkerungsdichte: «Einwohner pro Quadratkilometer». Eine Stadt ist dicht, ein Bergtal nicht – bei gleicher Zahl Einwohner. Genauso fragt man bei Kräften: <b>wie viel Kraft pro Platz?</b> Diese Zahl heisst Kraftdichte. Der Pfeil im Skript sagt nur, wie viel es <em>insgesamt</em> ist.</p>
          </>}
          en={<>
            <p>A chair does not press on the floor “at one point”, but over four small patches, its legs. A stiletto carries the same person on a much smaller area, a heel of about one square centimetre. The total force is the same. The heel still dents the parquet, the sole of a trainer does not. Evidently what matters is <em>how much force there is per bit of space</em>.</p>
            <p>You know this from population density: “inhabitants per square kilometre”. A city is dense, a mountain valley is not – with the same number of inhabitants. We ask the same about forces: <b>how much force per bit of space?</b> This number is called force density. The arrow in the notes only says how much there is <em>in total</em>.</p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="pfeil" title={<T de="1. Der Pfeil ist eine Zusammenfassung" en="1. The arrow is a summary" />}>
        <Box kind="lecture" src={<Src p={31} fig="Fig. 4.8" />} title={<T de="Figur 4.8: verteilte Kräfte" en={<>Figure 4.8: distributed forces (<span lang="de">verteilte Kräfte</span>)</>} />}>
          <T
            de={<>
              <p>Drei Bildpaare, jeweils «ein Pfeil <M>{t`\Rightarrow`}</M> verteilte Kraft»:</p>
              <ul>
                <li><b>Träger und Stütze:</b> Ein Träger liegt auf einer Stütze. Links ein einziger Pfeil im Berührpunkt, rechts derselbe Kontakt als schmaler schraffierter Streifen: Die Kraft verteilt sich über die Auflagefläche.</li>
                <li><b>Kugel auf ebener Unterlage:</b> Links ein Pfeil im Berührpunkt, rechts ein schraffierter Streifen, wo die Kugel die Unterlage wirklich berührt.</li>
                <li><b>Ladungen:</b> Zwei Kreise (geladene Körper) mit einem Pfeil zwischen sich, rechts zwei schraffierte Zylinder: Die Kraft sitzt im ganzen Volumen.</li>
              </ul>
            </>}
            en={<>
              <p>Three pairs of drawings, each “one arrow <M>{t`\Rightarrow`}</M> distributed force”:</p>
              <ul>
                <li><b>Beam and support:</b> A beam rests on a support. Left a single arrow at the contact point, right the same contact as a narrow hatched strip: the force is spread over the contact area.</li>
                <li><b>Ball on a flat base:</b> Left an arrow at the contact point, right a hatched strip where the ball really touches the base.</li>
                <li><b>Charges:</b> Two circles (charged bodies) with an arrow between them, on the right two hatched cylinders: the force sits in the whole volume.</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Was heisst das?</b> Der Pfeil «in einem Punkt» ist ein <em>Grenzfall</em>: Man tut so, als wäre die Auflage unendlich klein. Das ist bequem, solange es nur auf die Gesamtkraft ankommt. Sobald man wissen will, wie stark der Träger oder die Unterlage <em>lokal</em> belastet wird, muss man hinter den Pfeil schauen.</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Dieselbe Kraft <M>{t`\v F`}</M> (der orange Pfeil bleibt gleich lang) drückt auf eine Auflage. Verkleinere die Breite <M p=":">w</M> Die Kraft pro Fläche, <M p=",">s</M> wächst – der Balken rechts wird höher. Schaltest du die Verteilung aus, bleibt nur der Pfeil übrig, wie im Skript links.</p>
          </>}
          en={<>
            <p><b>What does this mean?</b> The arrow “at a point” is a <em>limiting case</em>: we pretend that the contact is infinitely small. This is convenient as long as only the total force matters. As soon as you want to know how strongly the beam or the support is loaded <em>locally</em>, you have to look behind the arrow.</p>
            <p className="vdemo-note"><b>What to look for:</b> The same force <M>{t`\v F`}</M> (the orange arrow stays equally long) presses on a contact. Make the width <M>w</M> smaller: the force per area, <M p=",">s</M> grows – the bar on the right gets taller. If you switch the distribution off, only the arrow is left, as on the left in the notes.</p>
          </>}
        />
        <PatchFigure />
        <T
          de={<p>Die Kraft ist hier jedes Mal 700 N, etwa das Gewicht einer Person (70 kg). Breite <M>w</M> mal 10 cm ist die Fläche <M p=",">A</M> und <M>{t`s = F/A`}</M> ist, was auf jeden Quadratmeter entfällt. Zehnmal schmaler heisst zehnmal dichter. Merke dir: <b>«Wie gross ist die Kraft?» und «Wie dicht ist sie verteilt?» sind zwei verschiedene Fragen.</b> Die zweite beantwortet die Kraftdichte <M p=".">s</M></p>}
          en={<p>The force is 700 N every time, about the weight of a person (70 kg). The width <M>w</M> times 10 cm is the area <M p=",">A</M> and <M>{t`s = F/A`}</M> is what falls on each square metre. Ten times narrower means ten times denser. Remember: <b>“How large is the force?” and “How densely is it spread?” are two different questions.</b> The second one is answered by the force density <M p=".">s</M></p>}
        />
        <Box kind="supplement" title={<T de="Alltagszahlen (Rundwerte)" en="Everyday numbers (rounded)" />}>
          <T
            de={<>
              <p>Dieselbe Person (70 kg) steht auf einem Fuss: Auf der Sohle eines Turnschuhs (etwa 200 <M p=")">{t`\mathrm{cm^2}`}</M> sind das etwa 35 <M p=",">{t`\mathrm{kN/m^2}`}</M> also 35 kPa. Eine 60-kg-Frau auf einem Absatz von 1 <M>{t`\mathrm{cm^2}`}</M> drückt mit etwa 6 000 <M>{t`\mathrm{kN/m^2}`}</M> (6 MPa) auf den Boden. Ein Autoreifen liegt bei rund 200 kPa. Der Absatz drückt also etwa dreissigmal stärker auf den Boden als ein Autoreifen – bei viel kleinerer Gesamtkraft.</p>
              <p>1 <M>{t`\mathrm{N/m^2}`}</M> heisst 1 Pascal (Pa). Das Wort kommt im Skript nicht vor.</p>
            </>}
            en={<>
              <p>The same person (70 kg) stands on one foot: on the sole of a trainer (about 200 <M p=")">{t`\mathrm{cm^2}`}</M> that is about 35 <M p=",">{t`\mathrm{kN/m^2}`}</M> i.e. 35 kPa. A 60 kg woman on a heel of 1 <M>{t`\mathrm{cm^2}`}</M> presses on the floor with about 6 000 <M>{t`\mathrm{kN/m^2}`}</M> (6 MPa). A car tyre is at around 200 kPa. So the heel presses about thirty times harder on the floor than a car tyre – with a much smaller total force.</p>
              <p>1 <M>{t`\mathrm{N/m^2}`}</M> is called 1 pascal (Pa). The word does not appear in the notes.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="dichte" title={<T de="2. Drei Arten, drei Dichten" en="2. Three kinds, three densities" />}>
        <Box kind="lecture" src={<Src p={32} />} title={<T de="Kraftdichte – verteilte Kräfte" en={<>Force density (<span lang="de">Kraftdichte</span>) – distributed forces</>} />}>
          <T
            de={<>
              <p>Kontaktkräfte <M>{t`\to`}</M> flächenverteilt. Fernkräfte <M>{t`\to`}</M> volumenverteilt. Beides zusammen: <u>Kraftdichte – verteilte Kräfte</u> (rot unterstrichen).</p>
              <p>Dazu kommen die Linienkräfte (dritter Aufzählungspunkt der Seite, siehe Abschnitt 5). Das Skript behandelt alle drei nach demselben Muster:</p>
              <ul>
                <li>Flächenkräfte <M>{t`\to`}</M> <b>Flächenkraftdichte</b> in <M p=".">{t`\mathrm{N/m^2}`}</M></li>
                <li>Volumenkräfte <M>{t`\to`}</M> <b>Raumkraftdichte</b> in <M p=".">{t`\mathrm{N/m^3}`}</M></li>
                <li>Linienkräfte <M>{t`\to`}</M> <b>Linienkraftdichte</b> in <M p=".">{t`\mathrm{N/m}`}</M></li>
              </ul>
            </>}
            en={<>
              <p>Contact forces <M>{t`\to`}</M> distributed over an area. Remote forces <M>{t`\to`}</M> distributed over a volume. Together: <u>force density – distributed forces</u> (underlined in red).</p>
              <p>In addition there are line forces (third bullet of the page, see section 5). The notes treat all three by the same pattern:</p>
              <ul>
                <li>area forces <M>{t`\to`}</M> <b>area force density</b> in <M p=".">{t`\mathrm{N/m^2}`}</M></li>
                <li>volume forces <M>{t`\to`}</M> <b>volume force density</b> in <M p=".">{t`\mathrm{N/m^3}`}</M></li>
                <li>line forces <M>{t`\to`}</M> <b>line force density</b> in <M p=".">{t`\mathrm{N/m}`}</M></li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Woher kommt welche Dichte?</b> Ein Kontakt hat eine Fläche, also verteilt sich die Kraft über eine Fläche. Eine Fernkraft wie die Schwerkraft wirkt in jedem Stück des Körpers, also über das Volumen. Eine Linienlast ist ein Sonderfall: Bei einem langen schmalen Ding wie einem Balken fasst man die Breite zusammen und gibt nur die Kraft <em>pro Meter</em> an.</p>
            <p className="keep"><b>«Dichte» heisst immer «pro»:</b> Kraft pro Fläche, Kraft pro Volumen, Kraft pro Länge. Das «pro» steckt in der Einheit: Newton geteilt durch Quadratmeter, Kubikmeter oder Meter.</p>
          </>}
          en={<>
            <p><b>Where does which density come from?</b> A contact has an area, so the force is spread over an area. A remote force like gravity acts in every piece of the body, so over the volume. A line load is a special case: for a long, narrow thing like a beam you lump the width together and only state the force <em>per metre</em>.</p>
            <p className="keep"><b>“Density” always means “per”:</b> force per area, force per volume, force per length. The “per” is in the unit: newtons divided by square metres, cubic metres or metres.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="flaeche" title={<T de="3. Flächenkraftdichte" en="3. Area force density" />}>
        <Box kind="lecture" src={<Src p={32} />} title={<T de="Flächenkräfte" en={<>Area forces (<span lang="de">Flächenkräfte</span>)</>} />}>
          <T
            de={<>
              <p>Flächenkräfte <M>{t`\to`}</M> Flächenkraftdichte <M p=":">{t`[\mathrm{N/m^2}]`}</M></p>
              <MD>{t`\v s = \lim_{\Delta A\to 0}\frac{\Delta\v F}{\Delta A}`}</MD>
              <p>Kraft am infinitesimalen Flächenelement, und die Summe aller Kräfte:</p>
              <MD>{t`\mathrm d\v F = \v s\,\mathrm dA, \qquad \v R = \iint_A \v s\,\mathrm dA.`}</MD>
              <p>Dazu eine Skizze: ein gekrümmtes Flächenstück <M>A</M> mit einem kleinen Element <M>{t`\mathrm dA`}</M> und der Kraft <M p=".">{t`\mathrm d\v F`}</M></p>
            </>}
            en={<>
              <p>Area forces <M>{t`\to`}</M> area force density <M p=":">{t`[\mathrm{N/m^2}]`}</M></p>
              <MD>{t`\v s = \lim_{\Delta A\to 0}\frac{\Delta\v F}{\Delta A}`}</MD>
              <p>Force on the infinitesimal area element, and the sum of all forces:</p>
              <MD>{t`\mathrm d\v F = \v s\,\mathrm dA, \qquad \v R = \iint_A \v s\,\mathrm dA.`}</MD>
              <p>With a sketch: a curved piece of surface <M>A</M> with a small element <M>{t`\mathrm dA`}</M> and the force <M p=".">{t`\mathrm d\v F`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li><M>{t`\Delta A`}</M> ist ein kleines Stück der Fläche um einen Punkt (das <M>{t`\Delta`}</M> heisst «ein kleines Stück von»). <M>{t`\Delta\v F`}</M> ist die Kraft, die genau auf dieses Stück wirkt.</li>
              <li><M>{t`\Delta\v F/\Delta A`}</M> ist die Kraft pro Fläche, <em>gemittelt</em> über das Stück. Es ist wie «Einwohner dieses Quartiers geteilt durch seine Fläche».</li>
              <li><M>{t`\lim_{\Delta A\to 0}`}</M> heisst: Das Stück zieht sich auf den Punkt zusammen. Man nimmt den Wert, dem der Quotient dabei immer näher kommt. Das ist die Dichte <em>an dieser Stelle</em>: <M p=".">{t`\v s`}</M></li>
              <li><M>{t`\mathrm d\v F = \v s\,\mathrm dA`}</M> liest man andersherum: Die Kraft auf ein winziges Stück ist Dichte mal Fläche (wie «Einwohner: Dichte mal Fläche»).</li>
              <li><M p=":">{t`\v R = \iint_A \v s\,\mathrm dA`}</M> Alle winzigen Kräfte <M>{t`\mathrm d\v F`}</M> über die ganze Fläche zusammenzählen gibt die Gesamtkraft <M p=".">{t`\v R`}</M> Das Doppelintegral ist nur eine «Summe über eine Fläche».</li>
            </ol>
            <p><M>{t`\v s`}</M> ist ein Vektor (unterstrichen): Die Kraft pro Fläche kann in jede Richtung zeigen, zum Beispiel senkrecht zur Fläche (Druck) oder entlang der Fläche (Reibung).</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Das Dach wird in Quadrate der Kante <M>h</M> zerlegt. Jedes Quadrat trägt ein Stück <M p=".">{t`\Delta F`}</M> Mach die Quadrate kleiner: <M>{t`\Delta F`}</M> des markierten Quadrats wird winzig, aber <M>{t`\Delta F/\Delta A`}</M> nähert sich <M p=".">{t`s(P)`}</M> Und alle Quadrate zusammen ergeben immer dieselbe Gesamtkraft <M p=".">R</M> Ziehe den Punkt <M>P</M> an eine andere Stelle.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li><M>{t`\Delta A`}</M> is a small piece of the surface around a point (the <M>{t`\Delta`}</M> means “a small piece of”). <M>{t`\Delta\v F`}</M> is the force that acts on exactly this piece.</li>
              <li><M>{t`\Delta\v F/\Delta A`}</M> is the force per area, <em>averaged</em> over the piece. It is like “inhabitants of this district divided by its area”.</li>
              <li><M>{t`\lim_{\Delta A\to 0}`}</M> means: the piece shrinks to the point. You take the value the quotient comes closer and closer to. That is the density <em>at this place</em>: <M p=".">{t`\v s`}</M></li>
              <li><M>{t`\mathrm d\v F = \v s\,\mathrm dA`}</M> is read the other way round: the force on a tiny piece is density times area (like “inhabitants: density times area”).</li>
              <li><M p=":">{t`\v R = \iint_A \v s\,\mathrm dA`}</M> adding up all the tiny forces <M>{t`\mathrm d\v F`}</M> over the whole surface gives the total force <M p=".">{t`\v R`}</M> The double integral is just a “sum over a surface”.</li>
            </ol>
            <p><M>{t`\v s`}</M> is a vector (underlined): the force per area can point in any direction, for example perpendicular to the surface (pressure) or along it (friction).</p>
            <p className="vdemo-note"><b>What to look for:</b> The roof is cut into squares of side <M p=".">h</M> Each square carries a piece <M p=".">{t`\Delta F`}</M> Make the squares smaller: <M>{t`\Delta F`}</M> of the marked square becomes tiny, but <M>{t`\Delta F/\Delta A`}</M> approaches <M p=".">{t`s(P)`}</M> And all squares together always give the same total force <M p=".">R</M> Drag the point <M>P</M> somewhere else.</p>
          </>}
        />
        <CellsFigure />
        <T
          de={<p>Das Beispiel ist unseres (Schnee auf einem Dach von 6 m mal 4 m; die Zahlen sind erfunden, aber plausibel). Bei gleichmässigem Schnee mit <M>{t`s = 1000\,\mathrm{N/m^2}`}</M> ist die Rechnung einfach: <M>{t`R = s\cdot A = 1000\cdot 24 = 24\,\mathrm{kN}`}</M> Bei ungleichmässigem Schnee muss man wirklich integrieren – das Bild macht es dir durch Zählen der Quadrate vor.</p>}
          en={<p>The example is ours (snow on a roof of 6 m by 4 m; the numbers are made up but plausible). With even snow of <M>{t`s = 1000\,\mathrm{N/m^2}`}</M> the calculation is easy: <M>{t`R = s\cdot A = 1000\cdot 24 = 24\,\mathrm{kN}`}</M> With uneven snow you really have to integrate – the picture does it for you by counting squares.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="raum" title={<T de="4. Raumkraftdichte und das Gewicht" en="4. Volume force density and the weight" />}>
        <Box kind="lecture" src={<Src p={32} />} title={<T de="Volumenkräfte, das Gewicht, Parenthèse" en={<>Volume forces (<span lang="de">Volumenkräfte</span>), the weight, <span lang="de">Parenthèse</span></>} />}>
          <T
            de={<>
              <p>Volumenkräfte <M>{t`\to`}</M> Raumkraftdichte <M p=":">{t`[\mathrm{N/m^3}]`}</M></p>
              <MD>{t`\v F = \lim_{\Delta V\to 0}\frac{\Delta\v F}{\Delta V}, \qquad \mathrm d\v F = \v F\,\mathrm dV.`}</MD>
              <p><i>(handschriftlich)</i> <b>Das Gewicht</b> – eine Skizze eines Quaders mit den Achsen <M>{t`\e x, \e y, \e z`}</M> (<M>z</M> nach oben):</p>
              <MD>{t`\begin{aligned}
&\v F = -\underbrace{\rho\cdot g}_{\gamma}\cdot\e z\\
&\mathrm d\v F = \mathrm d\v G = -\rho\cdot g\cdot\mathrm dV\,\e z\\
&\text{Summe der Kräfte:}\quad \v G = -\iiint_V \rho\,g\,\mathrm dV\,\e z = -\rho\cdot g\cdot V\,\e z \quad(\text{falls homogen})
\end{aligned}`}</MD>
              <p><i>(handschriftlich, im Rahmen)</i> <b>Parenthèse:</b></p>
              <MD>{t`\Delta V\to 0 \Rightarrow \Delta M\to 0, \qquad \Delta V\to 0 \Rightarrow \frac{\Delta M}{\Delta V}\neq 0, \qquad \lim_{\Delta V\to 0}\frac{\Delta M}{\Delta V} = \rho.`}</MD>
            </>}
            en={<>
              <p>Volume forces <M>{t`\to`}</M> volume force density <M p=":">{t`[\mathrm{N/m^3}]`}</M></p>
              <MD>{t`\v F = \lim_{\Delta V\to 0}\frac{\Delta\v F}{\Delta V}, \qquad \mathrm d\v F = \v F\,\mathrm dV.`}</MD>
              <p><i>(handwritten)</i> <b>The weight</b> – a sketch of a box with the axes <M>{t`\e x, \e y, \e z`}</M> (<M>z</M> pointing up):</p>
              <MD>{t`\begin{aligned}
&\v F = -\underbrace{\rho\cdot g}_{\gamma}\cdot\e z\\
&\mathrm d\v F = \mathrm d\v G = -\rho\cdot g\cdot\mathrm dV\,\e z\\
&\text{sum of the forces:}\quad \v G = -\iiint_V \rho\,g\,\mathrm dV\,\e z = -\rho\cdot g\cdot V\,\e z \quad(\text{if homogeneous})
\end{aligned}`}</MD>
              <p><i>(handwritten, in a frame)</i> <b><span lang="de">Parenthèse</span>:</b></p>
              <MD>{t`\Delta V\to 0 \Rightarrow \Delta M\to 0, \qquad \Delta V\to 0 \Rightarrow \frac{\Delta M}{\Delta V}\neq 0, \qquad \lim_{\Delta V\to 0}\frac{\Delta M}{\Delta V} = \rho.`}</MD>
            </>}
          />
        </Box>
        <T
          de={<p className="keep"><b>Achtung, ein Namensproblem (R-025):</b> Das Skript schreibt für die Raumkraftdichte wieder <M p=",">{t`\v F`}</M> obwohl <M>{t`\v F`}</M> sonst eine Kraft in N ist. Hier ist es eine Dichte in <M p=".">{t`\mathrm{N/m^3}`}</M> Du erkennst es an der Einheit und am Wort «Raumkraftdichte». Darum nennen wir sie im Text immer so.</p>}
          en={<p className="keep"><b>Careful, a naming problem (R-025):</b> The notes write <M>{t`\v F`}</M> again for the volume force density, although <M>{t`\v F`}</M> is otherwise a force in N. Here it is a density in <M p=".">{t`\mathrm{N/m^3}`}</M> You recognise it by the unit and by the words “volume force density”. That is why we always call it that in the text.</p>}
        />

        <h3><T de="4.1 Warum ein Grenzwert? Die «Parenthèse»" en="4.1 Why a limit? The “Parenthèse”" /></h3>
        <T
          de={<>
            <p>Die handschriftliche Klammer beantwortet eine Frage, die man sich bei <M>{t`\lim \Delta\v F/\Delta V`}</M> stellen sollte: Wenn das Stück <M>{t`\Delta V`}</M> gegen null geht, geht auch die Masse <M>{t`\Delta M`}</M> darin gegen null. Steht dann nicht «0 durch 0» da?</p>
            <p>Der Trick: Beide werden klein, aber <em>gleich schnell</em>. Ein Würfel mit 1 mm Kante hat fast keine Masse – aber auch fast kein Volumen. Teilt man die beiden, bleibt eine ganz vernünftige Zahl: die Dichte <M p=".">{t`\rho`}</M> Das ist kein «0 durch 0» im Sinne von «unmöglich», sondern ein <b>Grenzwert</b>: der Wert, dem der Quotient immer näher kommt.</p>
            <p>Mit der Dichte der Masse ist es bei Kraft genauso: <M>{t`\Delta\v F`}</M> geht gegen null, die Kraft <em>pro</em> Volumen nicht.</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Ein Würfel der Kante <M>h</M> um den roten Punkt <M p=".">P</M> Links wird <M>{t`\Delta M`}</M> beim Schrumpfen immer kleiner und erreicht 0 (genauer: <M>{t`\Delta M = \rho\,h^3`}</M> ungefähr). Rechts läuft <M>{t`\Delta M/\Delta V`}</M> auf den gestrichelten Wert <M>{t`\rho(P)`}</M> zu. Die dichte Linse (dunkel) macht den grossen Würfel zu einem schlechten Messgerät.</p>
          </>}
          en={<>
            <p>The handwritten frame answers a question you should ask yourself at <M p=":">{t`\lim \Delta\v F/\Delta V`}</M> when the piece <M>{t`\Delta V`}</M> goes to zero, the mass <M>{t`\Delta M`}</M> in it goes to zero as well. Isn’t that “zero over zero”?</p>
            <p>The trick: both become small, but <em>equally fast</em>. A cube with a 1 mm edge has almost no mass – but also almost no volume. Divide the two and a perfectly sensible number remains: the density <M p=".">{t`\rho`}</M> That is not a “zero over zero” in the sense of “impossible”, but a <b>limit</b>: the value the quotient comes closer and closer to.</p>
            <p>With force it is the same as with mass: <M>{t`\Delta\v F`}</M> goes to zero, the force <em>per</em> volume does not.</p>
            <p className="vdemo-note"><b>What to look for:</b> A cube of edge <M>h</M> around the red point <M p=".">P</M> On the left <M>{t`\Delta M`}</M> gets smaller and smaller as it shrinks and reaches 0 (roughly <M p=").">{t`\Delta M = \rho\,h^3`}</M> On the right <M>{t`\Delta M/\Delta V`}</M> runs towards the dashed value <M p=".">{t`\rho(P)`}</M> The dense lens (dark) makes the big cube a poor measuring device.</p>
          </>}
        />
        <DensityFigure />

        <h3><T de="4.2 Das Gewicht als Volumenkraft" en="4.2 The weight as a volume force" /></h3>
        <T
          de={<p>Ein Körper wiegt nicht «in einem Punkt»: Jedes Stückchen von ihm wird von der Erde angezogen. Die Schwerkraft ist also eine Volumenkraft. Ihre Raumkraftdichte ist die Dichte mal <M p=",">g</M> nach unten. Die Herleitung des Gesamtgewichts, Zeile für Zeile:</p>}
          en={<p>A body does not weigh “at one point”: every little piece of it is pulled by the Earth. So gravity is a volume force. Its volume force density is the density times <M p=",">g</M> pointing down. The derivation of the total weight, line by line:</p>}
        />
        <Derivation title={<T de="Vom Würfelchen zum Gesamtgewicht" en="From the little cube to the total weight" />}>
          <StepPlayer
            label={tr('Animation: das Gewicht als Summe über alle Volumenelemente', 'Animation: the weight as a sum over all volume elements')}
            steps={[
              { ms: 1500, holdMs: 3000, caption: <T
                de={<>Ein Körper, hier ein Quader. Sein Gewicht sitzt nicht in einem Punkt, sondern in jedem Stückchen von ihm. Die Achsen sind wie im Skript, <M>z</M> zeigt nach oben.</>}
                en={<>A body, here a box. Its weight does not sit at one point but in every little piece of it. The axes are as in the notes, <M>z</M> points up.</>} /> },
              { ms: 2400, holdMs: 4200, caption: <T
                de={<>Wir nehmen ein winziges Würfelchen mit dem Volumen <M>{t`\mathrm dV`}</M> heraus. Seine Masse ist <M p=",">{t`\rho\,\mathrm dV`}</M> und die Erde zieht daran nach unten: <M p=".">{t`\mathrm d\v G = -\rho\,g\,\mathrm dV\,\e z`}</M></>}
                en={<>We pick out a tiny cube of volume <M p=".">{t`\mathrm dV`}</M> Its mass is <M p=",">{t`\rho\,\mathrm dV`}</M> and the Earth pulls it downwards: <M p=".">{t`\mathrm d\v G = -\rho\,g\,\mathrm dV\,\e z`}</M></>} /> },
              { ms: 2800, holdMs: 5200, caption: <T
                de={<>Jetzt zerlegen wir den ganzen Körper in solche Würfelchen. Jedes hat seinen eigenen Pfeil (die Längen sind verschieden, wenn <M>{t`\rho`}</M> nicht überall gleich ist). Das Gesamtgewicht ist die Summe aller Pfeile: <M p=".">{t`\v G = -\iiint_V \rho\,g\,\mathrm dV\,\e z`}</M></>}
                en={<>Now we cut the whole body into such cubes. Each has its own arrow (the lengths differ if <M>{t`\rho`}</M> is not the same everywhere). The total weight is the sum of all the arrows: <M p=".">{t`\v G = -\iiint_V \rho\,g\,\mathrm dV\,\e z`}</M></>} /> },
              { ms: 3200, caption: <T
                de={<>Bei einem homogenen Körper sind <M>{t`\rho`}</M> und <M>g</M> überall gleich. Dann darf man sie vor das Integral ziehen, und <M>{t`\iiint\mathrm dV`}</M> ist einfach das Volumen <M p=".">V</M> Alle Pfeile werden zu einem: <M p=".">{t`\v G = -\rho\,g\,V\,\e z`}</M></>}
                en={<>For a homogeneous body <M>{t`\rho`}</M> and <M>g</M> are the same everywhere. Then they can be taken in front of the integral, and <M>{t`\iiint\mathrm dV`}</M> is simply the volume <M p=".">V</M> All the arrows become one: <M p=".">{t`\v G = -\rho\,g\,V\,\e z`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={weightScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>So liest man die Zeilen:</b></p>
            <ol>
              <li><M p=":">{t`\v F = -\rho g\,\e z`}</M> Die Raumkraftdichte der Schwerkraft ist «Masse pro <M>{t`\mathrm{m^3}`}</M> (<M p=")">{t`\rho`}</M> mal Fallbeschleunigung <M>g</M>», also Newton pro <M p=".">{t`\mathrm{m^3}`}</M> Das Minus und <M>{t`\e z`}</M> sagen «nach unten», weil <M>z</M> nach oben zeigt. Die Klammer im Skript nennt das Produkt <M p=".">{t`\gamma = \rho g`}</M></li>
              <li><M p=":">{t`\mathrm d\v F = \mathrm d\v G = -\rho g\,\mathrm dV\,\e z`}</M> Kraft auf ein Würfelchen ist Dichte mal Volumen (so wie <M>{t`\mathrm d\v F = \v F\,\mathrm dV`}</M> von oben). <M>{t`\mathrm d\v G`}</M> heisst: ein Stück Gewicht.</li>
              <li>«Summe der Kräfte» ist das Integral über alle Würfelchen, <M p=",">{t`\iiint_V`}</M> das Dreifachintegral.</li>
              <li>«Falls homogen» (überall gleich dicht): <M>{t`\rho`}</M> und <M>g</M> sind Zahlen und gehören vor das Integral. Übrig bleibt <M p=".">{t`\iiint_V\mathrm dV = V`}</M></li>
            </ol>
            <p><b>Wo greift <M>{t`\v G`}</M> an?</b> Das beantwortet diese Seite nicht; der Pfeil im Bild ist ein Symbol für die Summe. (Das gehört zum Schwerpunkt, später.)</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Wähle ein Material und die Abmessungen: <M>{t`G = \rho g V`}</M> berechnet sich daraus. Ein Liter Wasser (<M p=")">{t`V = 0{,}001\,\mathrm{m^3}`}</M> wiegt 9,81 N. Schalte «Dichte nimmt nach oben ab» ein: Jetzt ist <M>{t`\rho`}</M> nicht mehr überall gleich, und das Dreifachintegral zählt wirklich.</p>
          </>}
          en={<>
            <p><b>How to read the lines:</b></p>
            <ol>
              <li><M p=":">{t`\v F = -\rho g\,\e z`}</M> The volume force density of gravity is “mass per <M>{t`\mathrm{m^3}`}</M> (<M p=")">{t`\rho`}</M> times acceleration of free fall <M>g</M>”, so newtons per <M p=".">{t`\mathrm{m^3}`}</M> The minus and <M>{t`\e z`}</M> say “downwards”, since <M>z</M> points up. The brace in the notes calls the product <M p=".">{t`\gamma = \rho g`}</M></li>
              <li><M p=":">{t`\mathrm d\v F = \mathrm d\v G = -\rho g\,\mathrm dV\,\e z`}</M> force on a little cube is density times volume (just like <M>{t`\mathrm d\v F = \v F\,\mathrm dV`}</M> above). <M>{t`\mathrm d\v G`}</M> means: a piece of weight.</li>
              <li>“Sum of the forces” is the integral over all the little cubes, <M p=",">{t`\iiint_V`}</M> the triple integral.</li>
              <li>“If homogeneous” (equally dense everywhere): <M>{t`\rho`}</M> and <M>g</M> are numbers and belong in front of the integral. What remains is <M p=".">{t`\iiint_V\mathrm dV = V`}</M></li>
            </ol>
            <p><b>Where does <M>{t`\v G`}</M> act?</b> This page does not answer that; the arrow in the picture is a symbol for the sum. (That belongs to the centre of mass, later.)</p>
            <p className="vdemo-note"><b>What to look for:</b> Choose a material and the dimensions: <M>{t`G = \rho g V`}</M> follows from them. One litre of water (<M p=")">{t`V = 0.001\,\mathrm{m^3}`}</M> weighs 9.81 N. Switch on “density decreases upwards”: now <M>{t`\rho`}</M> is no longer the same everywhere, and the triple integral really counts.</p>
          </>}
        />
        <WeightFigure />
        <Box kind="supplement" title={<T de={<><M p=",">{t`\gamma`}</M> die «Wichte»</>} en={<><M p=",">{t`\gamma`}</M> the “specific weight”</>} />}>
          <T
            de={<p>Der Buchstabe <M>{t`\gamma`}</M> steht handschriftlich unter der Klammer, einen Namen nennt das Skript nicht. In der Technik heisst <M>{t`\gamma = \rho g`}</M> <em>Wichte</em> oder spezifisches Gewicht. Rundwerte: Wasser <M p=",">{t`9{,}81\,\mathrm{kN/m^3}`}</M> Beton etwa <M p=",">{t`23{,}5\,\mathrm{kN/m^3}`}</M> Stahl etwa <M p=".">{t`77\,\mathrm{kN/m^3}`}</M></p>}
            en={<p>The letter <M>{t`\gamma`}</M> is written by hand under the brace; the notes give no name. In engineering <M>{t`\gamma = \rho g`}</M> is called <em>specific weight</em> (<span lang="de">Wichte</span>). Rounded values: water <M p=",">{t`9.81\,\mathrm{kN/m^3}`}</M> concrete about <M p=",">{t`23.5\,\mathrm{kN/m^3}`}</M> steel about <M p=".">{t`77\,\mathrm{kN/m^3}`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="linie" title={<T de="5. Linienkraftdichte: von der Summe zum Integral" en="5. Line force density: from the sum to the integral" />}>
        <Box kind="lecture" src={<Src p={32} />} title={<T de="Linienkräfte" en={<>Line forces (<span lang="de">Linienkräfte</span>)</>} />}>
          <T
            de={<>
              <p>Linienkräfte <M>{t`\to`}</M> Linienkraftdichte <M p=":">{t`[\mathrm{N/m}]`}</M></p>
              <MD>{t`\v q = \lim_{\Delta x\to 0}\frac{\Delta\v F}{\Delta x}, \qquad \mathrm d\v F = \v q\,\mathrm dx \;\to\; \v R = \int \v q(x)\,\mathrm dx.`}</MD>
              <p>Zwei Skizzen: ein Balken auf zwei Stützen mit einer Reihe gleich langer Pfeile nach unten (eine konstante Linienlast). Darunter eine <M>x</M>-Achse von <M>0</M> bis <M p=",">L</M> ein Stück <M>{t`\mathrm dx`}</M> mit dem Pfeil <M>{t`\mathrm d\v F`}</M> und handschriftlich <M p=".">{t`\v R = \int_0^L \v q(x)\,\mathrm dx`}</M></p>
            </>}
            en={<>
              <p>Line forces <M>{t`\to`}</M> line force density <M p=":">{t`[\mathrm{N/m}]`}</M></p>
              <MD>{t`\v q = \lim_{\Delta x\to 0}\frac{\Delta\v F}{\Delta x}, \qquad \mathrm d\v F = \v q\,\mathrm dx \;\to\; \v R = \int \v q(x)\,\mathrm dx.`}</MD>
              <p>Two sketches: a beam on two supports with a row of equally long arrows pointing down (a constant line load). Below it an <M>x</M>-axis from <M>0</M> to <M p=",">L</M> a piece <M>{t`\mathrm dx`}</M> with the arrow <M>{t`\mathrm d\v F`}</M> and, handwritten, <M p=".">{t`\v R = \int_0^L \v q(x)\,\mathrm dx`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Die Idee in einem Bild:</b> Eine Last, die über einen Balken verteilt ist, kann man in Stücke schneiden. Auf ein Stück der Breite <M>{t`\Delta x`}</M> wirkt ungefähr «Dichte mal Breite», <M p=".">{t`\Delta F\approx q(x_i)\,\Delta x`}</M> Das ist die Fläche eines schmalen Rechtecks. Alle Rechtecke zusammen nähern die Fläche unter der Kurve <M>{t`q(x)`}</M> an. Je schmaler die Stücke, desto besser. Im Grenzfall ist die Summe das Integral.</p>
            <p>Gezeichnet ist die <em>Länge</em> von <M>{t`\v q`}</M> (der Vektor zeigt hier nach unten). Der Balken hat die Länge <M p=",">L</M> die Last ist <M>{t`q(x) = 20 + 60\,(x/L)^2`}</M> in N/m, mit <M p=".">{t`L = 4\,\mathrm m`}</M></p>
          </>}
          en={<>
            <p><b>The idea in one picture:</b> A load spread over a beam can be cut into pieces. On a piece of width <M>{t`\Delta x`}</M> acts roughly “density times width”, <M p=".">{t`\Delta F\approx q(x_i)\,\Delta x`}</M> That is the area of a narrow rectangle. All rectangles together approximate the area under the curve <M p=".">{t`q(x)`}</M> The narrower the pieces, the better. In the limit the sum is the integral.</p>
            <p>What is drawn is the <em>length</em> of <M>{t`\v q`}</M> (the vector points down here). The beam has length <M p=",">L</M> the load is <M>{t`q(x) = 20 + 60\,(x/L)^2`}</M> in N/m, with <M p=".">{t`L = 4\,\mathrm m`}</M></p>
          </>}
        />
        <Derivation title={<T de="Zwei, vier, acht, sechzehn Stücke – und dann unendlich viele" en="Two, four, eight, sixteen pieces – and then infinitely many" />}>
          <StepPlayer
            label={tr('Animation: Summe der Stücke q(x_i) Delta x nähert sich dem Integral', 'Animation: the sum of the pieces q(x_i) Delta x approaches the integral')}
            steps={[
              { ms: 2200, holdMs: 3400, caption: <T
                de={<>Ein Balken auf zwei Stützen trägt eine Last, die nach rechts zunimmt. Jeder Pfeil zeigt, wie stark es an dieser Stelle drückt: Das ist die Linienkraftdichte <M p=".">{t`\v q(x)`}</M></>}
                en={<>A beam on two supports carries a load that increases to the right. Each arrow shows how hard it presses at that place: this is the line force density <M p=".">{t`\v q(x)`}</M></>} /> },
              { ms: 2400, holdMs: 4200, caption: <T
                de={<>Wir schneiden den Balken in 2 Stücke. Auf jedem Stück schätzen wir die Kraft: Höhe in der Mitte mal Breite, <M p=".">{t`\Delta F_i\approx q(x_i)\,\Delta x`}</M> Beide zusammen: 155 N.</>}
                en={<>We cut the beam into 2 pieces. On each piece we estimate the force: height in the middle times width, <M p=".">{t`\Delta F_i\approx q(x_i)\,\Delta x`}</M> Both together: 155 N.</>} /> },
              { ms: 2200, holdMs: 3400, caption: <T
                de={<>4 Stücke. Die Treppe schmiegt sich besser an die Kurve. Die Summe ist 158,75 N.</>}
                en={<>4 pieces. The staircase fits the curve better. The sum is 158.75 N.</>} /> },
              { ms: 2200, holdMs: 3400, caption: <T
                de={<>8 Stücke: 159,69 N.</>}
                en={<>8 pieces: 159.69 N.</>} /> },
              { ms: 2200, holdMs: 3600, caption: <T
                de={<>16 Stücke: 159,92 N. Die Summe ändert sich kaum noch. Sie läuft auf 160 N zu.</>}
                en={<>16 pieces: 159.92 N. The sum hardly changes any more. It runs towards 160 N.</>} /> },
              { ms: 3000, caption: <T
                de={<>Mit unendlich vielen, unendlich schmalen Stücken wird aus der Summe das <b>Integral</b>: die Fläche unter <M p=".">{t`q(x)`}</M> Ein Stück hat die Breite <M>{t`\mathrm dx`}</M> und die Kraft <M p=".">{t`\mathrm d\v F = \v q\,\mathrm dx`}</M> Zusammen: <M p=".">{t`R = \int_0^L q\,\mathrm dx = 160\,\mathrm N`}</M></>}
                en={<>With infinitely many, infinitely narrow pieces the sum becomes the <b>integral</b>: the area under <M p=".">{t`q(x)`}</M> One piece has width <M>{t`\mathrm dx`}</M> and force <M p=".">{t`\mathrm d\v F = \v q\,\mathrm dx`}</M> Together: <M p=".">{t`R = \int_0^L q\,\mathrm dx = 160\,\mathrm N`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={lineScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>{t`\Delta x`}</M> ist ein kurzes Stück des Balkens, <M>{t`\Delta\v F`}</M> die Kraft darauf. <M>{t`\v q`}</M> ist ihr Quotient im Grenzfall: «Newton pro Meter an dieser Stelle».</li>
              <li><M p=":">{t`\mathrm d\v F = \v q\,\mathrm dx`}</M> Die Kraft auf ein winziges Stück ist Dichte mal Länge.</li>
              <li><M p=":">{t`\v R = \int_0^L \v q(x)\,\mathrm dx`}</M> Alle Stücke von <M>0</M> bis <M>L</M> aufaddieren. Das Integral ist die Grenze der Summe <M p=".">{t`\sum q(x_i)\Delta x`}</M></li>
              <li>Probe mit Einheiten: <M p=".">{t`\mathrm{N/m}\cdot\mathrm m = \mathrm N`}</M> Das Ergebnis <M>{t`\v R`}</M> ist wieder eine Kraft.</li>
            </ol>
            <p><b>Wo greift <M>{t`\v R`}</M> an?</b> Diese Seite gibt nur Betrag und Richtung der Gesamtkraft. Wo sie angreift, sagt sie nicht; das klärt sich mit den Momenten (Kapitel 5). Darum zeichnen wir <M>{t`\v R`}</M> hier nicht als Pfeil an den Balken.</p>
            <p className="vdemo-note"><b>Was du sehen sollst:</b> Wähle einen Verlauf und schiebe die Zahl der Stücke <M>n</M> hoch. Die Summe läuft auf den Wert des Integrals zu. Bei der konstanten Last stimmt sie schon mit einem Stück, denn alle Stücke sind gleich hoch. Dann gilt auch <M p=".">{t`R = q\cdot L`}</M></p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li><M>{t`\Delta x`}</M> is a short piece of the beam, <M>{t`\Delta\v F`}</M> the force on it. <M>{t`\v q`}</M> is their quotient in the limit: “newtons per metre at this place”.</li>
              <li><M p=":">{t`\mathrm d\v F = \v q\,\mathrm dx`}</M> the force on a tiny piece is density times length.</li>
              <li><M p=":">{t`\v R = \int_0^L \v q(x)\,\mathrm dx`}</M> add up all pieces from <M>0</M> to <M p=".">L</M> The integral is the limit of the sum <M p=".">{t`\sum q(x_i)\Delta x`}</M></li>
              <li>Check with units: <M p=".">{t`\mathrm{N/m}\cdot\mathrm m = \mathrm N`}</M> The result <M>{t`\v R`}</M> is a force again.</li>
            </ol>
            <p><b>Where does <M>{t`\v R`}</M> act?</b> This page only gives the size and direction of the total force. It does not say where it acts; that is settled with moments (chapter 5). That is why we do not draw <M>{t`\v R`}</M> as an arrow on the beam here.</p>
            <p className="vdemo-note"><b>What to look for:</b> Choose a shape and push up the number of pieces <M p=".">n</M> The sum runs towards the value of the integral. For the constant load it is already right with one piece, since all pieces are equally high. Then <M p=".">{t`R = q\cdot L`}</M></p>
          </>}
        />
        <LineFigure />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="einheiten" title={<T de="6. Die drei Dichten im Überblick" en="6. The three densities at a glance" />}>
        <T
          de={<>
            <p className="keep">Die drei Fälle sehen gleich aus. Nur das «pro» ändert sich:</p>
            <div className="kf-table-wrap">
              <table className="kf-table">
                <thead><tr><th>Dichte</th><th>Symbol im Skript</th><th>Einheit</th><th>«pro» …</th><th>Gesamtkraft</th></tr></thead>
                <tbody>
                  <tr><td>Linienkraftdichte</td><td><M>{t`\v q`}</M></td><td><M>{t`\mathrm{N/m}`}</M></td><td>Länge</td><td><M p=",">{t`\v R = \int \v q\,\mathrm dx`}</M> Probe <M>{t`\mathrm{N/m}\cdot\mathrm m = \mathrm N`}</M></td></tr>
                  <tr><td>Flächenkraftdichte</td><td><M>{t`\v s`}</M></td><td><M>{t`\mathrm{N/m^2}`}</M></td><td>Fläche</td><td><M p=",">{t`\v R = \iint \v s\,\mathrm dA`}</M> Probe <M>{t`\mathrm{N/m^2}\cdot\mathrm{m^2} = \mathrm N`}</M></td></tr>
                  <tr><td>Raumkraftdichte</td><td><M>{t`\v F`}</M> (R-025)</td><td><M>{t`\mathrm{N/m^3}`}</M></td><td>Volumen</td><td><M p=",">{t`\v R = \iiint \v F\,\mathrm dV`}</M> Probe <M>{t`\mathrm{N/m^3}\cdot\mathrm{m^3} = \mathrm N`}</M></td></tr>
                </tbody>
              </table>
            </div>
            <p>Die Zeile für <M>{t`\v R = \iiint\v F\,\mathrm dV`}</M> steht so nicht im Skript; sie folgt aus <M>{t`\mathrm d\v F = \v F\,\mathrm dV`}</M> und dem Aufsummieren, genau wie bei den anderen zwei. Beim Gewicht ist sie die Zeile <M>{t`\v G = -\iiint\rho g\,\mathrm dV\,\e z`}</M> von oben.</p>
            <p className="keep">Jedes Mal gilt: <b>Dichte mal Mass ergibt die Kraft.</b> Wenn das «Mass» (Länge, Fläche, Volumen) klein ist, ist die Kraft klein. Die Dichte selbst bleibt am Ort ein fester Wert.</p>
          </>}
          en={<>
            <p className="keep">The three cases look alike. Only the “per” changes:</p>
            <div className="kf-table-wrap">
              <table className="kf-table">
                <thead><tr><th>density</th><th>symbol in the notes</th><th>unit</th><th>“per” …</th><th>total force</th></tr></thead>
                <tbody>
                  <tr><td>line force density</td><td><M>{t`\v q`}</M></td><td><M>{t`\mathrm{N/m}`}</M></td><td>length</td><td><M p=",">{t`\v R = \int \v q\,\mathrm dx`}</M> check <M>{t`\mathrm{N/m}\cdot\mathrm m = \mathrm N`}</M></td></tr>
                  <tr><td>area force density</td><td><M>{t`\v s`}</M></td><td><M>{t`\mathrm{N/m^2}`}</M></td><td>area</td><td><M p=",">{t`\v R = \iint \v s\,\mathrm dA`}</M> check <M>{t`\mathrm{N/m^2}\cdot\mathrm{m^2} = \mathrm N`}</M></td></tr>
                  <tr><td>volume force density</td><td><M>{t`\v F`}</M> (R-025)</td><td><M>{t`\mathrm{N/m^3}`}</M></td><td>volume</td><td><M p=",">{t`\v R = \iiint \v F\,\mathrm dV`}</M> check <M>{t`\mathrm{N/m^3}\cdot\mathrm{m^3} = \mathrm N`}</M></td></tr>
                </tbody>
              </table>
            </div>
            <p>The line <M>{t`\v R = \iiint\v F\,\mathrm dV`}</M> is not in the notes in this form; it follows from <M>{t`\mathrm d\v F = \v F\,\mathrm dV`}</M> and adding up, exactly as for the other two. For the weight it is the line <M>{t`\v G = -\iiint\rho g\,\mathrm dV\,\e z`}</M> from above.</p>
            <p className="keep">Every time: <b>density times measure gives the force.</b> If the “measure” (length, area, volume) is small, the force is small. The density itself stays a fixed value at the place.</p>
          </>}
        />
        <Box kind="supplement" title={<T de="Alltagszahlen zum Einordnen" en="Everyday numbers for orientation" />}>
          <T
            de={<ul>
              <li><b>Linie, N/m:</b> Ein Brett mit Büchern: 20 kg Bücher auf 1 m Länge sind etwa <M p=".">{t`200\,\mathrm{N/m}`}</M></li>
              <li><b>Fläche, <M p=":">{t`\mathrm{N/m^2}`}</M></b> Luftdruck rund <M p=",">{t`100\,000\,\mathrm{N/m^2}`}</M> eine Schneedecke von einem halben Meter etwa <M p=".">{t`1000\,\mathrm{N/m^2}`}</M></li>
              <li><b>Volumen, <M p=":">{t`\mathrm{N/m^3}`}</M></b> Wasser <M p=",">{t`9810\,\mathrm{N/m^3}`}</M> Stahl etwa <M p=".">{t`77\,000\,\mathrm{N/m^3}`}</M></li>
            </ul>}
            en={<ul>
              <li><b>Line, N/m:</b> A shelf with books: 20 kg of books on 1 m length are about <M p=".">{t`200\,\mathrm{N/m}`}</M></li>
              <li><b>Area, <M p=":">{t`\mathrm{N/m^2}`}</M></b> Air pressure about <M p=",">{t`100\,000\,\mathrm{N/m^2}`}</M> half a metre of snow about <M p=".">{t`1000\,\mathrm{N/m^2}`}</M></li>
              <li><b>Volume, <M p=":">{t`\mathrm{N/m^3}`}</M></b> water <M p=",">{t`9810\,\mathrm{N/m^3}`}</M> steel about <M p=".">{t`77\,000\,\mathrm{N/m^3}`}</M></li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section long id="missverstaendnisse" title={<T de="7. Häufige Missverständnisse" en="7. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M p=",">{t`\v s`}</M> <M>{t`\v F`}</M> (als Dichte) und <M>{t`\v q`}</M> sind Kräfte in Newton.»</>} en={<>“<M p=",">{t`\v s`}</M> <M>{t`\v F`}</M> (as a density) and <M>{t`\v q`}</M> are forces in newtons.”</>} />}>
          <T de={<>Nein. Es sind Kräfte <em>pro</em> Fläche, Volumen oder Länge: <M p=",">{t`\mathrm{N/m^2}`}</M> <M p=",">{t`\mathrm{N/m^3}`}</M> N/m. Erst nach dem Integrieren kommt eine Kraft in N heraus. Ein Pfeil einer Streckenlast ist darum <em>kein</em> Kraftpfeil, sondern ein Bild der Dichte an dieser Stelle. Das Skript benutzt dasselbe Zeichen <M>{t`\v F`}</M> für beides (R-025): Achte auf die Einheit.</>} en={<>No. They are forces <em>per</em> area, volume or length: <M p=",">{t`\mathrm{N/m^2}`}</M> <M p=",">{t`\mathrm{N/m^3}`}</M> N/m. Only after integrating do you get a force in N. An arrow of a line load is therefore <em>not</em> a force arrow but a picture of the density at that place. The notes use the same sign <M>{t`\v F`}</M> for both (R-025): watch the unit.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`R = q\cdot L`}</M> gilt immer.»</>} en={<>“<M>{t`R = q\cdot L`}</M> always holds.”</>} />}>
          <T de={<>Nur bei einer <em>konstanten</em> Last. Wächst <M>q</M> gleichmässig von 0 auf <M>{t`q_{\max}`}</M> (eine Rampe), ist die Fläche ein Dreieck: <M p=".">{t`R = \tfrac12\,q_{\max}L`}</M> Wächst <M>q</M> wie <M p=",">{t`x^2`}</M> ist es nur <M p=".">{t`\tfrac13\,q_{\max}L`}</M> Im Bild oben kannst du es nachprüfen: Bei der Rampe ist <M p=",">{t`q_{\max}L = 240\,\mathrm N`}</M> aber <M p=";">{t`R = 120\,\mathrm N`}</M> bei der Parabel ist <M>{t`q_{\max}L = 400\,\mathrm N`}</M> und <M p=".">{t`R\approx 133\,\mathrm N`}</M></>} en={<>Only for a <em>constant</em> load. If <M>q</M> grows evenly from 0 to <M>{t`q_{\max}`}</M> (a ramp), the area is a triangle: <M p=".">{t`R = \tfrac12\,q_{\max}L`}</M> If <M>q</M> grows like <M p=",">{t`x^2`}</M> it is only <M p=".">{t`\tfrac13\,q_{\max}L`}</M> You can check it in the picture above: for the ramp <M>{t`q_{\max}L = 240\,\mathrm N`}</M> but <M p=";">{t`R = 120\,\mathrm N`}</M> for the parabola <M>{t`q_{\max}L = 400\,\mathrm N`}</M> and <M p=".">{t`R\approx 133\,\mathrm N`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Die Dichte <M>{t`\rho`}</M> ist die Raumkraftdichte.»</>} en={<>“The density <M>{t`\rho`}</M> is the volume force density.”</>} />}>
          <T de={<><M>{t`\rho`}</M> ist Masse pro Volumen, in <M p=".">{t`\mathrm{kg/m^3}`}</M> Die Raumkraftdichte der Schwerkraft ist <M>{t`\rho g`}</M> in <M p=".">{t`\mathrm{N/m^3}`}</M> Wasser: <M>{t`1000\,\mathrm{kg/m^3}`}</M> gegen <M p=".">{t`9810\,\mathrm{N/m^3}`}</M> Gleiche Zahl bis auf den Faktor <M p=",">g</M> aber nicht dasselbe.</>} en={<><M>{t`\rho`}</M> is mass per volume, in <M p=".">{t`\mathrm{kg/m^3}`}</M> The volume force density of gravity is <M>{t`\rho g`}</M> in <M p=".">{t`\mathrm{N/m^3}`}</M> Water: <M>{t`1000\,\mathrm{kg/m^3}`}</M> versus <M p=".">{t`9810\,\mathrm{N/m^3}`}</M> The same number up to the factor <M p=",">g</M> but not the same thing.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Wenn das Stück gegen null geht, steht da 0 durch 0 – das geht nicht.»" en="“When the piece goes to zero you get 0 over 0 – that is impossible.”" />}>
          <T de={<>Zähler und Nenner werden gleich schnell klein, der Quotient bleibt vernünftig: Bei <M>{t`\Delta M = \rho\,\Delta V`}</M> ist <M>{t`\Delta M/\Delta V = \rho`}</M> für jedes noch so kleine <M>{t`\Delta V`}</M> (wenn <M>{t`\rho`}</M> konstant ist). Sonst nähert sich der Quotient dem lokalen Wert. Im Bild zur Parenthèse siehst du es: die Masse läuft gegen null, der Quotient gegen <M p=".">{t`\rho(P)`}</M></>} en={<>Numerator and denominator become small equally fast, the quotient stays sensible: with <M p=",">{t`\Delta M = \rho\,\Delta V`}</M> <M>{t`\Delta M/\Delta V = \rho`}</M> for every <M p=",">{t`\Delta V`}</M> however small (if <M>{t`\rho`}</M> is constant). Otherwise the quotient approaches the local value. You see it in the picture for the <span lang="de">Parenthèse</span>: the mass goes to zero, the quotient to <M p=".">{t`\rho(P)`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Die Pfeile einer Streckenlast sind viele einzelne Kräfte.»" en="“The arrows of a line load are many separate forces.”" />}>
          <T de={<>Die Pfeile sind ein Bild von <M p=".">{t`q(x)`}</M> Ihre Länge ist die Dichte an der Stelle, nicht eine Kraft in N, und ihre Anzahl ist Zeichensache. Zeichnest du doppelt so viele Pfeile, hat sich die Last nicht verdoppelt. Die Kraft steht erst in der Fläche unter der Kurve.</>} en={<>The arrows are a picture of <M p=".">{t`q(x)`}</M> Their length is the density at the place, not a force in N, and their number is a matter of drawing. If you draw twice as many arrows, the load has not doubled. The force is only in the area under the curve.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="merke" title={<T de="8. Das Wichtigste" en="8. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Der Punktkraft-Pfeil ist eine Zusammenfassung. Kontaktkräfte verteilen sich über eine <b>Fläche</b>, Fernkräfte über ein <b>Volumen</b>, Linienlasten entlang einer <b>Länge</b>.</li>
              <li><b>Kraftdichte</b> = Kraft pro Platz: <M>{t`\v s = \lim \Delta\v F/\Delta A`}</M> in <M p=",">{t`\mathrm{N/m^2}`}</M> <M>{t`\v F = \lim\Delta\v F/\Delta V`}</M> in <M p=",">{t`\mathrm{N/m^3}`}</M> <M>{t`\v q = \lim\Delta\v F/\Delta x`}</M> in N/m.</li>
              <li>Kraft auf ein winziges Stück: <M p=",">{t`\mathrm d\v F = \v s\,\mathrm dA`}</M> <M p=",">{t`\v F\,\mathrm dV`}</M> <M p=".">{t`\v q\,\mathrm dx`}</M> Gesamtkraft: aufintegrieren, zum Beispiel <M p=".">{t`\v R = \int_0^L \v q\,\mathrm dx`}</M></li>
              <li>Gewicht: Raumkraftdichte <M p=",">{t`-\rho g\,\e z`}</M> <M p=",">{t`\v G = -\iiint\rho g\,\mathrm dV\,\e z`}</M> homogen: <M p=".">{t`\v G = -\rho g V\,\e z`}</M></li>
              <li>Ein Grenzwert wie <M>{t`\lim\Delta M/\Delta V = \rho`}</M> ist der Wert, dem der Quotient näher kommt, während Zähler und Nenner gegen null gehen.</li>
            </ul>}
            en={<ul>
              <li>The point-force arrow is a summary. Contact forces spread over an <b>area</b>, remote forces over a <b>volume</b>, line loads along a <b>length</b>.</li>
              <li><b>Force density</b> = force per bit of space: <M>{t`\v s = \lim \Delta\v F/\Delta A`}</M> in <M p=",">{t`\mathrm{N/m^2}`}</M> <M>{t`\v F = \lim\Delta\v F/\Delta V`}</M> in <M p=",">{t`\mathrm{N/m^3}`}</M> <M>{t`\v q = \lim\Delta\v F/\Delta x`}</M> in N/m.</li>
              <li>Force on a tiny piece: <M p=",">{t`\mathrm d\v F = \v s\,\mathrm dA`}</M> <M p=",">{t`\v F\,\mathrm dV`}</M> <M p=".">{t`\v q\,\mathrm dx`}</M> Total force: integrate, for example <M p=".">{t`\v R = \int_0^L \v q\,\mathrm dx`}</M></li>
              <li>Weight: volume force density <M p=",">{t`-\rho g\,\e z`}</M> <M p=",">{t`\v G = -\iiint\rho g\,\mathrm dV\,\e z`}</M> homogeneous: <M p=".">{t`\v G = -\rho g V\,\e z`}</M></li>
              <li>A limit like <M>{t`\lim\Delta M/\Delta V = \rho`}</M> is the value the quotient comes closer to while numerator and denominator go to zero.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Das <a href="#kraft">punktgebundene Kraft-Modell</a> ist der Grenzfall der Verteilung. Beim <a href="#systemabgrenzung">Systemabgrenzen</a> zeichnet man Kontaktkräfte als Pfeile, obwohl sie verteilt sind. Die Summen und Integrale benutzen den <a href="#vektoren">Vektorrechnungs-Werkzeugkasten</a>. Wo die Gesamtkraft angreift, beantworten später die <a href="#leistung-rotation">Momente</a>.</p>}
          en={<p className="connections"><b>Connections:</b> The <a href="#kraft">point-bound force model</a> is the limiting case of the distribution. When <a href="#systemabgrenzung">setting a system boundary</a> one draws contact forces as arrows although they are distributed. The sums and integrals use the <a href="#vektoren">vector toolbox</a>. Where the total force acts is answered later by <a href="#leistung-rotation">moments</a>.</p>}
        />
      </Section>
    </article>
  );
}
