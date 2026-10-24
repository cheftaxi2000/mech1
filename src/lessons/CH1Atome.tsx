import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AtomBuilder, IonicBuilder, IsotopeExplorer, MixtureBoxes, MoleculeViews, ZoomFigure } from '../viz/chem/AtomFigures';
import { En } from '../viz/chem/En';
import { PeriodicTable } from '../viz/chem/PeriodicTable';
import { ionScene } from '../viz/chem/ionScene';
import '../viz/chem/chem.css';

const t = String.raw;

export default function CH1Atome() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Chemie hat eine eigene Sprache. Atome sind die <b>Buchstaben</b>, Moleküle und Verbindungen die <b>Wörter</b>, Reaktionen die <b>Sätze</b>. Diese Lektion lehrt die Buchstaben und Wörter: woraus ein Atom besteht, warum es verschiedene Atomsorten gibt und wie man sie im Periodensystem findet.</p>}
        en={<p className="lede">Chemistry has its own language. Atoms are the <b>letters</b>, molecules and compounds the <b>words</b>, reactions the <b>sentences</b>. This lesson teaches the letters and words: what an atom is made of, why there are different kinds of atoms, and how to find them in the periodic table.</p>}
      />
      <Box kind="lecture" src={<Src lec={1} p="10" />} title={<T de="Was ist Chemie?" en="What is chemistry?" />}>
        <T
          de={<>
            <p>Chemie ist das Studium der Eigenschaften und des Verhaltens von <b>Materie</b> (alles, was Masse und Volumen hat). Wie beschreibt man Materie? Die Folie nimmt das Bild einer Sprache:</p>
            <ul>
              <li><b>Buchstaben:</b> <i>Atome</i> (kleinste Einheit eines Elements) und <i>Elemente</i> (Stoffe aus nur einer Atomsorte, zum Beispiel Kohlenstoff <C>C</C> oder Wasserstoff <C p=")">H2</C></li>
              <li><b>Wörter:</b> <i>Moleküle</i> (zwei oder mehr verbundene Atome) und <i>Verbindungen</i> (Moleküle aus verschiedenen Atomsorten, zum Beispiel Wasser <C p=")">H2O</C></li>
              <li><b>Sätze:</b> <i>Reaktionen</i> beschreiben «chemische Änderungen», also den Wechsel von einem Stoff zu einem anderen.</li>
            </ul>
          </>}
          en={<>
            <p>Chemistry is the study of the properties and behaviour of <b>matter</b> (whatever has mass and volume). How do we describe matter? The slide uses the picture of a language:</p>
            <ul>
              <li><b>Letters:</b> <i>atoms</i> (the smallest unit of an element) and <i>elements</i> (substances made of only one kind of atom, for example carbon <C>C</C> or hydrogen <C p=")">H2</C></li>
              <li><b>Words:</b> <i>molecules</i> (two or more atoms joined together) and <i>compounds</i> (molecules with different kinds of atoms, for example water <C p=")">H2O</C></li>
              <li><b>Sentences:</b> <i>reactions</i> describe “chemical changes”, i.e. the change from one substance to another.</li>
            </ul>
          </>}
        />
      </Box>

      {/* -------------------------------------------------------------- 1 */}
      <Section id="stoffe" title={<T de="1. Reinstoffe und Gemische" en="1. Pure substances and mixtures" />}>
        <T
          de={<p>Stell dir ein Glas Leitungswasser und ein Glas Milch vor. Beide sehen nach «Flüssigkeit» aus. Doch Milch besteht aus winzigen Fetttröpfchen in Wasser, Wasser dagegen ist überall dasselbe. Genau diesen Unterschied macht die Folie.</p>}
          en={<p>Picture a glass of tap water and a glass of milk. Both look like “a liquid”. But milk is tiny fat droplets in water, whereas water is the same everywhere. This is exactly the difference the slide makes.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="11" />} title={<T de="Reinstoffe und Gemische" en="Pure substances versus mixtures" />}>
          <T
            de={<>
              <p><b>Reinstoffe</b> (<En>pure substances</En>) sind Elemente, Moleküle und Verbindungen. Sie haben eine feste Zusammensetzung, die sich von Probe zu Probe nicht ändert.</p>
              <p><b>Gemische</b> (<En>mixtures</En>) enthalten zwei oder mehr Reinstoffe. Ist das Gemisch überall gleich, heisst es <i>homogen</i>, sonst <i>heterogen</i>. Jeder Bestandteil behält seine eigenen Eigenschaften, und man kann ein Gemisch wieder in Reinstoffe trennen.</p>
              <p>Beispiele der Folie: reines Wasser ist ein Reinstoff, Mineralwasser ein homogenes Gemisch, Milch ein heterogenes Gemisch. Randnotiz: die Atmosphäre der Erde ist ein heterogenes Gemisch, ihre Zusammensetzung ändert sich mit der Höhe.</p>
            </>}
            en={<>
              <p><b>Pure substances</b> are elements, molecules and compounds. They have a fixed composition that does not change from sample to sample.</p>
              <p><b>Mixtures</b> contain two or more pure substances. If the mixture is the same everywhere it is <i>homogeneous</i>, otherwise <i>heterogeneous</i>. Each component keeps its own properties, and a mixture can be separated into pure substances again.</p>
              <p>Examples on the slide: pure water is a pure substance, mineral water a homogeneous mixture, milk a heterogeneous mixture. Side note: the Earth’s atmosphere is a heterogeneous mixture; its composition changes with altitude.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Die Übung zeigt dasselbe mit Teilchenbildern. Blaue Kugeln sind Atome der Sorte A, braune Atome der Sorte B. Zwei verbundene Kugeln sind ein Molekül. Wähle eine Beschreibung, dann leuchten die passenden Bilder auf.</p>}
          en={<p>The exercise class shows the same with particle pictures. Blue spheres are atoms of kind A, brown ones atoms of kind B. Two joined spheres are a molecule. Choose a description and the matching pictures light up.</p>}
        />
        <Box kind="uebung" src={<Src ex={1} p="9" />} title={<T de="Aufgabe 7: Welches Bild ist was?" en="Exercise 7: which picture is which?" />}>
          <T
            de={<p>Aufgabe: Welches Bild zeigt (a) ein reines Element, (b) ein Gemisch aus zwei Elementen, (c) eine reine Verbindung, (d) ein Gemisch aus einem Element und einer Verbindung? Mehrere Bilder können passen. Antwort der Übung: (a) 1, (b) 5 und 6, (c) 4, (d) 2 und 3.</p>}
            en={<p>Task: which picture shows (a) a pure element, (b) a mixture of two elements, (c) a pure compound, (d) a mixture of an element and a compound? More than one picture can fit. Answer from the exercise class: (a) 1, (b) 5 and 6, (c) 4, (d) 2 and 3.</p>}
          />
          <MixtureBoxes />
          <T
            de={<p><b>So liest man die Bilder:</b> Zuerst zählt man die Teilchensorten. Gibt es nur eine Sorte, ist es ein Reinstoff (Bild 1 und 4). Gibt es mehrere Sorten, ist es ein Gemisch. Dann fragt man, ob die Teilchen Atome oder Moleküle aus nur einer Atomsorte sind (Element) oder aus beiden Sorten bestehen (Verbindung). Bild 5 und 6 enthalten nur einzelne Atome, die nicht verbunden sind: Gemisch aus zwei Elementen. Bild 2 und 3 mischen ein Element (A) mit einer Verbindung (AB).</p>}
            en={<p><b>How to read the pictures:</b> First count the kinds of particles. If there is only one kind, it is a pure substance (pictures 1 and 4). If there are several kinds, it is a mixture. Then ask whether the particles are atoms or molecules of a single kind of atom (element) or consist of both kinds (compound). Pictures 5 and 6 contain only separate atoms that are not joined: a mixture of two elements. Pictures 2 and 3 mix an element (A) with a compound (AB).</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 2 */}
      <Section id="dalton" title={<T de="2. Atome: Daltons Idee" en="2. Atoms: Dalton’s idea" />}>
        <Box kind="lecture" src={<Src lec={1} p="12" />} title={<T de="Daltons Atomtheorie (1803–1807)" en="Dalton’s atomic theory (1803–1807)" />}>
          <T
            de={<>
              <p>Wir akzeptieren heute, dass Materie aus Atomen besteht, aber das ist nicht offensichtlich. John Dalton (1766–1844) formulierte:</p>
              <ul>
                <li>Jedes Element besteht aus Atomen.</li>
                <li>Alle Atome eines Elements sind chemisch identisch.</li>
                <li>Verschiedene Elemente bestehen aus verschiedenen Atomen.</li>
                <li>Chemische Reaktionen können Atome nicht ändern, erzeugen oder zerstören.</li>
                <li>Verbindungen entstehen aus Atomen von zwei oder mehr Elementen.</li>
              </ul>
              <p>Das erklärt drei Gesetze: <b>konstante Zusammensetzung</b> (in einer Verbindung ist Zahl und Sorte der Atome fest), <b>Massenerhaltung</b> (bei Reaktionen ändert sich die Masse nicht) und <b>multiple Proportionen</b> (bilden zwei Elemente mehrere Verbindungen, stehen ihre Massen im Verhältnis kleiner ganzer Zahlen).</p>
            </>}
            en={<>
              <p>We now accept that matter is made of atoms, but this is not obvious. John Dalton (1766–1844) stated:</p>
              <ul>
                <li>Each element is composed of atoms.</li>
                <li>All atoms of a given element are chemically identical.</li>
                <li>Different elements are composed of different atoms.</li>
                <li>Chemical reactions cannot change, create or destroy atoms.</li>
                <li>Compounds involve combinations of atoms of two or more elements.</li>
              </ul>
              <p>This explains three laws: <b>constant composition</b> (in a given compound, the number and kind of atoms is fixed), <b>conservation of mass</b> (mass does not change in reactions) and <b>multiple proportions</b> (if two elements form several compounds, their masses combine in ratios of small whole numbers).</p>
            </>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Multiple Proportionen: ein Beispiel" en="Multiple proportions: an example" />}>
          <T
            de={<p>Kohlenstoff und Sauerstoff bilden <C>CO</C> und <C p=".">CO2</C> In <C>CO2</C> sitzen auf dieselben Kohlenstoffatome doppelt so viele Sauerstoffatome wie in <C p=".">CO</C> Weil Atome nicht teilbar sind, steht die Sauerstoffmasse im Verhältnis <M>{t`2 : 1`}</M> – eine kleine ganze Zahl. Das ist genau, was das Gesetz sagt.</p>}
            en={<p>Carbon and oxygen form <C>CO</C> and <C p=".">CO2</C> For the same carbon atoms, <C>CO2</C> has twice as many oxygen atoms as <C p=".">CO</C> Because atoms cannot be divided, the oxygen masses are in the ratio <M>{t`2 : 1`}</M> – a small whole number. This is exactly what the law says.</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 3 */}
      <Section id="bau" title={<T de="3. Woraus ein Atom besteht" en="3. What an atom is made of" />}>
        <T
          de={<p>Dalton hielt Atome für unteilbar. Heute wissen wir: Atome bestehen aus noch kleineren Teilchen. Es sind nur drei, und sie sind der ganze Baukasten dieser Lektion.</p>}
          en={<p>Dalton thought atoms were indivisible. Today we know they consist of even smaller particles. There are only three, and they are the whole construction kit of this lesson.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="13" />} title={<T de="Elektronen, Protonen, Neutronen" en="Electrons, protons and neutrons" />}>
          <div className="ch-scroll">
            <table className="ch-table">
              <thead><tr><th><T de="Teilchen" en="particle" /></th><th><T de="Ladung" en="charge" /></th><th><T de="Masse" en="mass" /></th></tr></thead>
              <tbody>
                <tr><td><T de="Elektron" en="electron" /></td><td><M>{t`q_\mathrm{e} = -e`}</M></td><td><M>{t`m_\mathrm{e} = 9{,}11\times 10^{-31}\,\mathrm{kg}`}</M></td></tr>
                <tr><td><T de="Proton" en="proton" /></td><td><M>{t`q_\mathrm{p} = +e`}</M></td><td><M>{t`m_\mathrm{p} = 1{,}67\times 10^{-27}\,\mathrm{kg}`}</M></td></tr>
                <tr><td><T de="Neutron" en="neutron" /></td><td><M>{t`q_\mathrm{n} = 0`}</M></td><td><M>{t`m_\mathrm{n} = 1{,}67\times 10^{-27}\,\mathrm{kg}`}</M></td></tr>
              </tbody>
            </table>
          </div>
          <T
            de={<p>Dazu <M p=".">{t`e = 1{,}60\times 10^{-19}\,\mathrm{C}`}</M> Geladen sind Elektronen und Protonen. Notizen der Folie: Ein Atom hat gleich viele Protonen und Elektronen (es ist elektrisch neutral). Protonen und Neutronen sind viel schwerer als Elektronen (das Proton etwa 1836-mal, das Neutron etwa 1839-mal). Die Massen sind winzig, in Kilogramm unpraktisch – dafür gibt es gleich eine bessere Einheit.</p>}
            en={<p>Also <M p=".">{t`e = 1.60\times 10^{-19}\,\mathrm{C}`}</M> Electrons and protons are charged. Notes on the slide: an atom has equal numbers of protons and electrons (it is electrically neutral). Protons and neutrons are much heavier than electrons (the proton about 1836 times, the neutron about 1839 times). The masses are tiny and inconvenient in kilograms – a better unit follows shortly.</p>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={1} p="14" />} title={<T de="Das moderne Bild des Atoms" en="The modern picture of the atom" />}>
          <T
            de={<p>Im Zentrum liegt der <b>Kern</b> (<En>nucleus</En>) aus Protonen und Neutronen, etwa <M>{t`10^{-4}\,\text{\AA}`}</M> gross. Darum liegt die <b>Elektronenwolke</b> von etwa <M>{t`1`}</M> bis <M>{t`5\,\text{\AA}`}</M> Grösse. Dabei ist <M p=".">{t`1\,\text{\AA} = 1\times 10^{-10}\,\mathrm{m}`}</M> Der Kern ist unglaublich dicht: Eine Streichholzschachtel mit dieser Dichte (<M p=")">{t`10^{14}\,\mathrm{g\,cm^{-3}}`}</M> wöge 2,6 Milliarden Tonnen. Und: Wäre die Elektronenwolke ein Fussballfeld, hätte der Kern einen Durchmesser von 1 mm.</p>}
            en={<p>At the centre is the <b>nucleus</b> of protons and neutrons, about <M>{t`10^{-4}\,\text{\AA}`}</M> across. Around it is the <b>electron cloud</b>, about <M>{t`1`}</M> to <M>{t`5\,\text{\AA}`}</M> in size. Here <M p=".">{t`1\,\text{\AA} = 1\times 10^{-10}\,\mathrm{m}`}</M> The nucleus is incredibly dense: a matchbox with this density (<M p=")">{t`10^{14}\,\mathrm{g\,cm^{-3}}`}</M> would weigh 2.6 billion tonnes. And: if the electron cloud were a football pitch, the nucleus would be 1 mm across.</p>}
          />
        </Box>
        <T
          de={<p><b>Zahlen mit Bild.</b> Der Kern ist etwa zehntausendmal kleiner als die Wolke. Ein Bild kann das nie massstabsgetreu zeigen, deshalb zoomt man hier hinein. Schiebe den Regler: Bei einer Bildbreite von etwa <M>{t`10^{-9}\,\mathrm{m}`}</M> sieht man die Wolke, vom Kern nur einen Punkt. Bei <M>{t`10^{-14}\,\mathrm{m}`}</M> füllt der Kern das Bild, und die Wolke liegt weit ausserhalb. Die Cartoons der Folien zeigen den Kern also viel zu gross.</p>}
          en={<p><b>Numbers with a picture.</b> The nucleus is about ten thousand times smaller than the cloud. A drawing can never show this to scale, so here you zoom in. Move the slider: at a picture width of about <M>{t`10^{-9}\,\mathrm{m}`}</M> you see the cloud, but only a dot for the nucleus. At <M>{t`10^{-14}\,\mathrm{m}`}</M> the nucleus fills the picture and the cloud lies far outside. The cartoons on the slides therefore show the nucleus much too big.</p>}
        />
        <ZoomFigure />
        <Box kind="supplement" title={<T de="Die Zahlen zur Folie nachgerechnet" en="Checking the slide’s numbers" />}>
          <T
            de={<p>Das Verhältnis Proton zu Elektron: <M p=".">{t`m_\mathrm{p}/m_\mathrm{e} = 1{,}67\times 10^{-27} / 9{,}11\times 10^{-31} \approx 1833`}</M> Mit den genaueren Werten der Folie 17 (<M>{t`1{,}0073\,\mathrm{u}`}</M> und <M p=")">{t`5{,}486\times 10^{-4}\,\mathrm{u}`}</M> kommt man auf etwa 1836. Der Unterschied liegt an der Rundung der Folie 13. Ein Streichholzschachtel-Volumen von etwa <M>{t`26\,\mathrm{cm^3}`}</M> mal <M>{t`10^{14}\,\mathrm{g\,cm^{-3}}`}</M> gibt <M p=",">{t`2{,}6\times 10^{15}\,\mathrm{g} = 2{,}6\times 10^{9}\,\mathrm{t}`}</M> also 2,6 Milliarden Tonnen.</p>}
            en={<p>The ratio proton to electron: <M p=".">{t`m_\mathrm{p}/m_\mathrm{e} = 1.67\times 10^{-27} / 9.11\times 10^{-31} \approx 1833`}</M> With the more precise values of slide 17 (<M>{t`1.0073\,\mathrm{u}`}</M> and <M p=")">{t`5.486\times 10^{-4}\,\mathrm{u}`}</M> one gets about 1836. The difference comes from the rounding on slide 13. A matchbox volume of about <M>{t`26\,\mathrm{cm^3}`}</M> times <M>{t`10^{14}\,\mathrm{g\,cm^{-3}}`}</M> gives <M p=",">{t`2.6\times 10^{15}\,\mathrm{g} = 2.6\times 10^{9}\,\mathrm{t}`}</M> that is 2.6 billion tonnes.</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 4 */}
      <Section id="ordnung" title={<T de="4. Ordnungszahl, Massenzahl, Isotope" en="4. Atomic number, mass number, isotopes" />}>
        <T
          de={<p>Was macht aus einem Kohlenstoffatom ein Kohlenstoffatom und nicht ein Sauerstoffatom? Nicht die Neutronen, nicht die Elektronen, sondern die Zahl der <b>Protonen</b>. Sie ist wie die Hausnummer des Elements.</p>}
          en={<p>What makes a carbon atom a carbon atom and not an oxygen atom? Not the neutrons, not the electrons, but the number of <b>protons</b>. It is like the house number of the element.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="15–16" />} title={<T de="Ordnungszahl, Isotope, Massenzahl, Symbole" en="Atomic number, isotopes, mass number, symbols" />}>
          <T
            de={<>
              <p>Die <b>Ordnungszahl</b> (<En>atomic number</En>) <M>Z</M> ist die Zahl der Protonen. Sie gibt auch die Zahl der Elektronen an, weil das Atom neutral ist. Beispiele: Kohlenstoff hat 6 Protonen und 6 Elektronen (<M p="),">{t`Z = 6`}</M> Sauerstoff 8 und 8 (<M p=").">{t`Z = 8`}</M> Wichtig: Die chemischen Eigenschaften eines Atoms bestimmen seine Elektronen.</p>
              <p>Die Zahl der Neutronen kann variieren. Atome desselben Elements mit verschiedener Neutronenzahl heissen <b>Isotope</b> (<En>isotopes</En>). Sie haben verschiedene Masse, aber dieselbe Chemie. Die <b>Massenzahl</b> (<En>mass number</En>) <M>A</M> ist die Zahl der Protonen plus Neutronen. Das häufigste Kohlenstoff-Isotop hat 6 Neutronen, also <M p=".">{t`A = 12`}</M> Man schreibt <M p=".">{t`{}^{12}_{\;6}\mathrm{C}`}</M> Randnotiz: 98,93 % des Kohlenstoffs ist Kohlenstoff-12.</p>
              <p>Die Ordnungszahl ist überflüssig, sobald Symbol und Massenzahl bekannt sind. Randnotiz: <M>{t`{}^{12}\mathrm{C}`}</M> ist stabil, viele Isotope sind instabil und zerfallen unter Abgabe von Teilchen und Energie (<i>Radioaktivität</i>; Beispiel Uran: <M>{t`{}^{238}\mathrm{U}`}</M> 99,28 %, <M p=").">{t`{}^{235}\mathrm{U}`}</M> 0,71 %</p>
            </>}
            en={<>
              <p>The <b>atomic number</b> <M>Z</M> is the number of protons. It also gives the number of electrons, because the atom is neutral. Examples: carbon has 6 protons and 6 electrons (<M p="),">{t`Z = 6`}</M> oxygen 8 and 8 (<M p=").">{t`Z = 8`}</M> Important: the chemical properties of an atom are determined by its electrons.</p>
              <p>The number of neutrons can vary. Atoms of the same element with different numbers of neutrons are called <b>isotopes</b>. They have different mass but the same chemistry. The <b>mass number</b> <M>A</M> is the number of protons plus neutrons. The most common carbon isotope has 6 neutrons, so <M p=".">{t`A = 12`}</M> One writes <M p=".">{t`{}^{12}_{\;6}\mathrm{C}`}</M> Side note: 98.93 % of carbon is carbon-12.</p>
              <p>The atomic number is redundant once the symbol and the mass number are given. Side note: <M>{t`{}^{12}\mathrm{C}`}</M> is stable, many isotopes are unstable and decay by releasing particles and energy (<i>radioactivity</i>; example uranium: <M>{t`{}^{238}\mathrm{U}`}</M> 99.28 %, <M p=").">{t`{}^{235}\mathrm{U}`}</M> 0.71 %</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das Symbol</b> <M p=":">{t`{}^{A}_{Z}\mathrm{X}^{q}`}</M></p>
            <ol>
              <li>Das Buchstabensymbol <M>{t`\mathrm{X}`}</M> sagt, welches Element es ist.</li>
              <li>Unten links steht <M p=",">Z</M> die Zahl der Protonen.</li>
              <li>Oben links steht <M p=",">A</M> die Zahl der Protonen und Neutronen zusammen.</li>
              <li>Oben rechts steht die Ladung <M p=",">q</M> falls es ein Ion ist (siehe Abschnitt 8).</li>
              <li>Die Neutronen zählt man so: <M p=".">{t`N = A - Z`}</M> Die Elektronen: <M p=".">{t`Z - q`}</M></li>
            </ol>
            <p>Im Bild unten stellst du Protonen, Neutronen und Ladung selbst ein. Jedes Teilchen ist ein Punkt: rot die Protonen, grau die Neutronen, gold die Elektronen.</p>
          </>}
          en={<>
            <p><b>How to read the symbol</b> <M p=":">{t`{}^{A}_{Z}\mathrm{X}^{q}`}</M></p>
            <ol>
              <li>The letter symbol <M>{t`\mathrm{X}`}</M> says which element it is.</li>
              <li>Bottom left is <M p=",">Z</M> the number of protons.</li>
              <li>Top left is <M p=",">A</M> the number of protons and neutrons together.</li>
              <li>Top right is the charge <M p=",">q</M> if it is an ion (see section 8).</li>
              <li>Neutrons are counted like this: <M p=".">{t`N = A - Z`}</M> Electrons: <M p=".">{t`Z - q`}</M></li>
            </ol>
            <p>In the picture below you set protons, neutrons and charge yourself. Each particle is a dot: protons red, neutrons grey, electrons gold.</p>
          </>}
        />
        <AtomBuilder />
        <Box kind="uebung" src={<Src ex={1} p="11" />} title={<T de="Aufgabe 8: Teilchen von Fluorid" en="Exercise 8: particles of fluoride" />}>
          <T
            de={<p>Wie viele Neutronen, Protonen und Elektronen hat <M p="?">{t`{}^{19}_{\;9}\mathrm{F}^{-}`}</M> Antwort der Übung: 9 Protonen, 10 Neutronen, 10 Elektronen. Rechnung: <M>{t`Z = 9`}</M> gibt 9 Protonen. <M p=",">{t`N = 19 - 9 = 10`}</M> Neutronen. Die Ladung <M>{t`-1`}</M> heisst: ein Elektron mehr als Protonen, also <M p=".">{t`9 + 1 = 10`}</M> Drücke im Bild oben «<M p="»">{t`{}^{19}\mathrm{F}^{-}`}</M> und prüfe es.</p>}
            en={<p>How many neutrons, protons and electrons does <M p="?">{t`{}^{19}_{\;9}\mathrm{F}^{-}`}</M> have? Answer from the exercise class: 9 protons, 10 neutrons, 10 electrons. Computation: <M>{t`Z = 9`}</M> gives 9 protons. <M p=",">{t`N = 19 - 9 = 10`}</M> neutrons. The charge <M>{t`-1`}</M> means one more electron than protons, so <M p=".">{t`9 + 1 = 10`}</M> Press “<M p="”">{t`{}^{19}\mathrm{F}^{-}`}</M> in the picture above and check.</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 5 */}
      <Section id="gewicht" title={<T de="5. Atommasse und Atomgewicht" en="5. Atomic mass and atomic weight" />}>
        <T
          de={<p>Ein Atom wiegt etwa <M p=".">{t`10^{-26}\,\mathrm{kg}`}</M> Mit solchen Zahlen rechnet niemand gern. Man wählt deshalb eine Einheit, die zu Atomen passt, so wie man Strassen in Kilometern misst und nicht in Nanometern.</p>}
          en={<p>An atom weighs about <M p=".">{t`10^{-26}\,\mathrm{kg}`}</M> Nobody likes computing with such numbers. So one chooses a unit that fits atoms, just as roads are measured in kilometres and not in nanometres.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="17" />} title={<T de="Atommasse und Atomgewicht" en="Atomic mass and atomic weight" />}>
          <T
            de={<>
              <p>Die <b>Atommasse</b> (<En>atomic mass</En>) wird auf einer neuen Skala gemessen: Das Isotop <M>{t`{}^{12}\mathrm{C}`}</M> hat genau <M p=".">{t`12\,\mathrm{u}`}</M> Dabei ist <M p=",">{t`1\,\mathrm{u} = 1{,}660539040\times 10^{-27}\,\mathrm{kg}`}</M> die <i>atomare Masseneinheit</i> (<En>atomic mass unit, amu</En>). Die Massen der Bausteine: <M p=",">{t`m_\mathrm{p} = 1{,}0073\,\mathrm{u}`}</M> <M p=",">{t`m_\mathrm{n} = 1{,}0087\,\mathrm{u}`}</M> <M p=".">{t`m_\mathrm{e} = 5{,}486\times 10^{-4}\,\mathrm{u}`}</M></p>
              <p>Das <b>Atomgewicht</b> (<En>atomic weight</En>) ist die mittlere Atommasse eines Elements. Man mittelt über alle Isotope, gewichtet mit ihrer relativen Häufigkeit. Beispiel Kohlenstoff: <M>{t`{}^{12}\mathrm{C}`}</M> 98,93 %, <M>{t`{}^{13}\mathrm{C}`}</M> 1,07 %, <M>{t`{}^{14}\mathrm{C}`}</M> nur in Spuren:</p>
              <MD>{t`(0{,}9893\cdot 12\,\mathrm{u}) + (0{,}0107\cdot 13{,}0035\,\mathrm{u}) + \text{Spuren} = 12{,}01\,\mathrm{u}`}</MD>
            </>}
            en={<>
              <p>The <b>atomic mass</b> is measured on a new scale: the isotope <M>{t`{}^{12}\mathrm{C}`}</M> has exactly <M p=".">{t`12\,\mathrm{u}`}</M> Here <M p=",">{t`1\,\mathrm{u} = 1.660539040\times 10^{-27}\,\mathrm{kg}`}</M> is the <i>atomic mass unit</i> (amu). The masses of the building blocks: <M p=",">{t`m_\mathrm{p} = 1.0073\,\mathrm{u}`}</M> <M p=",">{t`m_\mathrm{n} = 1.0087\,\mathrm{u}`}</M> <M p=".">{t`m_\mathrm{e} = 5.486\times 10^{-4}\,\mathrm{u}`}</M></p>
              <p>The <b>atomic weight</b> is the average atomic mass of an element. One averages over all isotopes, weighted by their relative abundance. Example carbon: <M>{t`{}^{12}\mathrm{C}`}</M> 98.93 %, <M>{t`{}^{13}\mathrm{C}`}</M> 1.07 %, <M>{t`{}^{14}\mathrm{C}`}</M> only a trace:</p>
              <MD>{t`(0.9893\cdot 12\,\mathrm{u}) + (0.0107\cdot 13.0035\,\mathrm{u}) + \text{trace} = 12.01\,\mathrm{u}`}</MD>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Zeile:</b></p>
            <ol>
              <li>Von 100 Kohlenstoffatomen sind etwa 99 leicht (<M p=")">{t`12\,\mathrm{u}`}</M> und etwa eines schwerer (<M p=").">{t`13{,}0035\,\mathrm{u}`}</M></li>
              <li>Der Mittelwert ist die Summe «Anteil mal Masse». Die Anteile schreibt man als Dezimalzahl: 98,93 % wird <M p=".">{'0{,}9893'}</M></li>
              <li>Weil fast alles <M>{t`{}^{12}\mathrm{C}`}</M> ist, liegt der Mittelwert nur wenig über 12.</li>
            </ol>
            <p>Das Atomgewicht ist der Wert im Periodensystem. Darum steht dort bei Chlor <M>{t`35{,}45`}</M> und nicht eine ganze Zahl: Chlor ist ein Gemisch aus <M>{t`{}^{35}\mathrm{Cl}`}</M> und <M p=".">{t`{}^{37}\mathrm{Cl}`}</M> Im Bild kannst du den Anteil des schweren Isotops verschieben und siehst, wie der Mittelwert wandert. Er liegt immer zwischen den beiden Massen, und zwar näher bei dem häufigeren Isotop.</p>
          </>}
          en={<>
            <p><b>How to read the line:</b></p>
            <ol>
              <li>Of 100 carbon atoms, about 99 are light (<M p=")">{t`12\,\mathrm{u}`}</M> and about one is heavier (<M p=").">{t`13.0035\,\mathrm{u}`}</M></li>
              <li>The average is the sum of “share times mass”. The shares are written as decimals: 98.93 % becomes <M p=".">{'0.9893'}</M></li>
              <li>Because almost everything is <M p=",">{t`{}^{12}\mathrm{C}`}</M> the average is only slightly above 12.</li>
            </ol>
            <p>The atomic weight is the value in the periodic table. That is why chlorine has <M>{t`35.45`}</M> there and not a whole number: chlorine is a mixture of <M>{t`{}^{35}\mathrm{Cl}`}</M> and <M p=".">{t`{}^{37}\mathrm{Cl}`}</M> In the picture you can move the share of the heavy isotope and see how the average moves. It always lies between the two masses, and closer to the more common isotope.</p>
          </>}
        />
        <IsotopeExplorer />
        <Box kind="uebung" src={<Src ex={1} p="10" />} title={<T de="Die Begriffe der Übung" en="The terms of the exercise class" />}>
          <T
            de={<p>Die Übung trennt zwei Wörter sauber: <b>Atomgewicht</b>: mittlere Atommasse aller Isotope eines Elements, gewichtet mit der natürlichen Häufigkeit, in u. <b>Atommasse</b>: Masse eines einzelnen Atoms, unabhängig von den Isotopen. Und <M p=".">{t`1\,\mathrm{u} = 1{,}6605\times 10^{-27}\,\mathrm{kg}`}</M></p>}
            en={<p>The exercise class separates two words cleanly: <b>atomic weight</b>: average atomic mass of all isotopes of an element, weighted by the natural abundance, in u. <b>Atomic mass</b> = mass of a single atom, independent of the isotopes. And <M p=".">{t`1\,\mathrm{u} = 1.6605\times 10^{-27}\,\mathrm{kg}`}</M></p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 6 */}
      <Section id="pse" title={<T de="6. Das Periodensystem" en="6. The periodic table" />}>
        <Box kind="lecture" src={<Src lec={1} p="18–19" />} title={<T de="Das Periodensystem und seine Namen" en="The periodic table and its names" />}>
          <T
            de={<>
              <p>Dmitri Mendelejew ordnete die Atome 1869 in einer Tabelle. Sie ist das «Alphabet» der Chemie: alle Elemente des Universums. Die Folie nennt:</p>
              <ul>
                <li>Sie listet 118 bekannte Elemente, nach Ordnungszahl geordnet. Jedes Feld zeigt Ordnungszahl, Symbol und Atomgewicht (Beispiel Kalium: 19, <C p=",">K</C> 39,0983).</li>
                <li>Die Spalten heissen <b>Gruppen</b> (<En>groups</En>, 1 bis 18). Elemente einer Gruppe verhalten sich chemisch ähnlich. Die Zeilen heissen <b>Perioden</b> (<En>periods</En>).</li>
                <li>Farben: beige Metalle, grün Nichtmetalle, violett Halbmetalle (<En>metalloids</En>, mit Eigenschaften dazwischen). Die Treppenlinie trennt metallisches und nichtmetallisches Verhalten. Die Quantenmechanik erklärt die Form der Tabelle.</li>
                <li>Namen: Gruppe 1 Alkalimetalle (<C>Li</C> <C>Na</C> <C>K</C> <C>Rb</C> <C>Cs</C> <C>Fr</C>), Gruppe 2 Erdalkalimetalle (<C>Be</C> <C>Mg</C> <C>Ca</C> <C>Sr</C> <C>Ba</C> <C>Ra</C>), Gruppe 16 Chalkogene (<C>O</C> <C>S</C> <C>Se</C> <C>Te</C> <C>Po</C>), Gruppe 17 Halogene (<C>F</C> <C>Cl</C> <C>Br</C> <C>I</C> <C>At</C>), Gruppe 18 Edelgase (<C>He</C> <C>Ne</C> <C>Ar</C> <C>Kr</C> <C>Xe</C> <C>Rn</C>). Gruppen 3 bis 12 sind die Übergangsmetalle, die zwei Zeilen darunter Lanthanoide und Actinoide (<C>Lu</C> zählt zu den Lanthanoiden, <C>Lr</C> zu den Actinoiden).</li>
              </ul>
            </>}
            en={<>
              <p>Dmitri Mendeleev arranged the atoms in a table in 1869. It is the “alphabet” of chemistry: all the elements in the universe. The slide says:</p>
              <ul>
                <li>It lists 118 known elements, in order of atomic number. Each box shows atomic number, symbol and atomic weight (example potassium: 19, <C p=",">K</C> 39.0983).</li>
                <li>The columns are called <b>groups</b> (1 to 18). Elements in a group behave chemically alike. The rows are called <b>periods</b>.</li>
                <li>Colours: tan metals, green nonmetals, purple metalloids (properties in between). The staircase line divides metallic from nonmetallic behaviour. Quantum mechanics explains the shape of the table.</li>
                <li>Names: group 1 alkali metals (<C>Li</C> <C>Na</C> <C>K</C> <C>Rb</C> <C>Cs</C> <C>Fr</C>), group 2 alkaline earth metals (<C>Be</C> <C>Mg</C> <C>Ca</C> <C>Sr</C> <C>Ba</C> <C>Ra</C>), group 16 chalcogens (<C>O</C> <C>S</C> <C>Se</C> <C>Te</C> <C>Po</C>), group 17 halogens (<C>F</C> <C>Cl</C> <C>Br</C> <C>I</C> <C>At</C>), group 18 noble gases (<C>He</C> <C>Ne</C> <C>Ar</C> <C>Kr</C> <C>Xe</C> <C>Rn</C>). Groups 3 to 12 are the transition metals, the two rows below are the lanthanides and actinides (<C>Lu</C> counts as a lanthanide, <C>Lr</C> as an actinide).</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<p><b>So liest man ein Feld:</b> Die grosse Zahl ist <M p=",">Z</M> also die Zahl der Protonen. Das Symbol nennt das Element. Die Zahl darunter ist das Atomgewicht, der Mittelwert der Isotope aus Abschnitt 5. Fahre mit der Maus oder dem Finger über die Tabelle: Rechts erscheinen Name, Gruppe, Periode und die Teilchen des neutralen Atoms. Mit dem Schalter oben wechselt die Färbung zwischen Metall und Nichtmetall und den Gruppennamen.</p>}
          en={<p><b>How to read a box:</b> The big number is <M p=",">Z</M> the number of protons. The symbol names the element. The number below is the atomic weight, the average over the isotopes from section 5. Move the mouse or finger over the table: name, group, period and the particles of the neutral atom appear. The switch at the top changes the colouring between metal / nonmetal and the family names.</p>}
        />
        <PeriodicTable />
        <Box kind="uebung" src={<Src ex={1} p="12" />} title={<T de="Hinweis der Übung" en="Note from the exercise class" />}>
          <T
            de={<p>Perioden sind die waagrechten Zeilen. Gruppen sind die senkrechten Spalten mit ähnlichen Eigenschaften. Die Elemente stehen nach steigender Ordnungszahl. Die Treppenlinie trennt Metalle von Nichtmetallen. Eine Periodensystem-Tabelle gehört zu den Hilfsblättern der Prüfung.</p>}
            en={<p>Periods are the horizontal rows. Groups are the vertical columns with similar properties. The elements are in order of increasing atomic number. The staircase line divides metals from nonmetals. A periodic table is part of the info sheets for the exam.</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 7 */}
      <Section id="molekuele" title={<T de="7. Moleküle und Verbindungen" en="7. Molecules and compounds" />}>
        <Box kind="lecture" src={<Src lec={1} p="20" />} title={<T de="Moleküle und Verbindungen" en="Molecules and compounds" />}>
          <T
            de={<>
              <p>Nur die Edelgase kommen als einzelne Atome vor. Die meiste Materie besteht aus Molekülen oder Ionen. Man stellt sie mit chemischen Formeln dar: Wasserstoff <C>H2</C>, Sauerstoff <C>O2</C>, Kohlendioxid <C>CO2</C>, Wasser <C>H2O</C>, Wasserstoffperoxid <C>H2O2</C>, Methan <C p=".">CH4</C></p>
              <p>Wie zeigt man, was verbunden ist und wie die Form aussieht? Die Folie zeigt vier Arten am Beispiel Methan: <b>Strukturformel</b> (einfach, zeigt die Verbindungen, aber nicht die Form), <b>Perspektivzeichnung</b> (gestrichelter Keil: Bindung hinter der Zeichenebene; durchgezogene Linie: in der Ebene; ausgefüllter Keil: aus der Ebene heraus), <b>Kugel-Stab-Modell</b> (zeigt Bindungswinkel) und <b>Kalottenmodell</b> (zeigt auch das Volumen der Elektronenwolken; «das beste», aber schwer zu zeichnen).</p>
            </>}
            en={<>
              <p>Only the noble gases occur as single atoms. Most matter consists of molecules or ions. They are represented by chemical formulae: hydrogen <C>H2</C>, oxygen <C>O2</C>, carbon dioxide <C>CO2</C>, water <C>H2O</C>, hydrogen peroxide <C>H2O2</C>, methane <C p=".">CH4</C></p>
              <p>How do you show what is connected and what the shape is? The slide shows four ways using methane: <b>structural formula</b> (simple, shows connectivity but not the shape), <b>perspective drawing</b> (dashed wedge: bond behind the page; solid line: in the plane; wedge: out of the page), <b>ball-and-stick model</b> (shows bond angles) and <b>space-filling model</b> (also shows the volume of the electron clouds; “the best”, but hard to draw).</p>
            </>}
          />
        </Box>
        <T
          de={<p>Probiere die drei Darstellungen aus. Beim Wechsel von der Strukturformel zum Kugel-Stab-Modell siehst du, was das flache Bild verschweigt: das gewinkelte Wasser, die gestreckte Kette von <C p=",">CO2</C> den Knick in <C p=".">H2O2</C></p>}
          en={<p>Try the three representations. When switching from the structural formula to the ball-and-stick model you see what the flat picture hides: the bent water, the straight chain of <C p=",">CO2</C> the kink in <C p=".">H2O2</C></p>}
        />
        <MoleculeViews />
      </Section>

      {/* -------------------------------------------------------------- 8 */}
      <Section id="ionen" title={<T de="8. Ionen" en="8. Ions" />}>
        <T
          de={<p>Ein Atom ist neutral, solange es gleich viele Protonen wie Elektronen hat. Nimmt man ein Elektron weg oder gibt eines dazu, bleibt der Kern gleich, aber die Ladung stimmt nicht mehr. Dann ist es ein <b>Ion</b>.</p>}
          en={<p>An atom is neutral as long as it has as many protons as electrons. If you take an electron away or add one, the nucleus stays the same, but the charge no longer balances. Then it is an <b>ion</b>.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="21" />} title={<T de="Ionen" en="Ions" />}>
          <T
            de={<>
              <p>Ionen sind elektrisch geladene Atome oder Moleküle. <b>Kationen</b> sind positiv, weil Elektronen fehlen. <b>Anionen</b> sind negativ, weil Elektronen dazugekommen sind. Atome am Rand des Periodensystems bilden Ionen, die gleich viele Elektronen haben wie ein Edelgas. Bild der Folie: Natrium (<C>Na</C>) hat <M>{t`11\,\mathrm{p}^{+}`}</M> und <M p=";">{t`11\,\mathrm{e}^{-}`}</M> es gibt ein Elektron ab und wird zum Kation <C p=",">Na^+</C> mit <M>{t`10\,\mathrm{e}^{-}`}</M> und kleiner. Chlor (<C>Cl</C>) hat <M>{t`17\,\mathrm{p}^{+}`}</M> und <M p=";">{t`17\,\mathrm{e}^{-}`}</M> es nimmt ein Elektron auf und wird zum Anion <C p=",">Cl^-</C> mit <M>{t`18\,\mathrm{e}^{-}`}</M> und grösser. <b>Die Grösse des Atoms ändert sich also, wenn ein Ion entsteht.</b></p>
              <p>Schreibweise (wie im Lehrbuch): Die Ladung steht als Zahl und dann das Vorzeichen, zum Beispiel <C>Na^+</C> und <C p=".">Cl^-</C> Bei <C>Mg^2+</C> heisst das: zwei Elektronen fehlen.</p>
            </>}
            en={<>
              <p>Ions are electrically charged atoms or molecules. <b>Cations</b> are positive because electrons are missing. <b>Anions</b> are negative because electrons have been added. Atoms at the edges of the periodic table form ions with the same number of electrons as a noble gas. Picture on the slide: sodium (<C>Na</C>) has <M>{t`11\,\mathrm{p}^{+}`}</M> and <M p=";">{t`11\,\mathrm{e}^{-}`}</M> it gives away an electron and becomes the cation <C p=",">Na^+</C> with <M>{t`10\,\mathrm{e}^{-}`}</M> and smaller. Chlorine (<C>Cl</C>) has <M>{t`17\,\mathrm{p}^{+}`}</M> and <M p=";">{t`17\,\mathrm{e}^{-}`}</M> it takes up an electron and becomes the anion <C p=",">Cl^-</C> with <M>{t`18\,\mathrm{e}^{-}`}</M> and bigger. <b>So the size of an atom changes when an ion forms.</b></p>
              <p>Notation (as in the textbook): the charge is written as the number and then the sign, for example <C>Na^+</C> and <C p=".">Cl^-</C> For <C>Mg^2+</C> this means: two electrons are missing.</p>
            </>}
          />
        </Box>
        <StepPlayer
          label="Natrium und Chlor werden zu Ionen"
          steps={[
            { ms: 2500, holdMs: 3500, caption: <T
              de={<>Zwei neutrale Atome. Natrium hat <M>{t`11\,\mathrm{p}^{+}`}</M> und <M p=",">{t`11\,\mathrm{e}^{-}`}</M> Chlor hat <M>{t`17\,\mathrm{p}^{+}`}</M> und <M p=".">{t`17\,\mathrm{e}^{-}`}</M> Gleich viele Plus und Minus: neutral.</>}
              en={<>Two neutral atoms. Sodium has <M>{t`11\,\mathrm{p}^{+}`}</M> and <M p=",">{t`11\,\mathrm{e}^{-}`}</M> chlorine has <M>{t`17\,\mathrm{p}^{+}`}</M> and <M p=".">{t`17\,\mathrm{e}^{-}`}</M> Equal plus and minus: neutral.</>} /> },
            { ms: 4500, holdMs: 4000, caption: <T
              de={<>Ein Elektron (gold) wandert von Natrium zu Chlor. Natrium hat nun ein Elektron weniger: <C p=",">Na^+</C> kleiner. Chlor hat eins mehr: <C p=",">Cl^-</C> grösser. Die Protonen haben sich nicht bewegt.</>}
              en={<>One electron (gold) moves from sodium to chlorine. Sodium now has one electron fewer: <C p=",">Na^+</C> smaller. Chlorine has one more: <C p=",">Cl^-</C> bigger. The protons did not move.</>} /> },
            { ms: 3500, holdMs: 2500, caption: <T
              de={<>Plus und Minus ziehen sich an. Die beiden Ionen rücken zusammen, bis sie sich berühren. So entsteht ein Paar im Kochsalz <C p=".">NaCl</C></>}
              en={<>Plus and minus attract each other. The two ions move together until they touch. This is how a pair in table salt <C>NaCl</C> arises.</>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={ionScene} step={step} t={tt} />}
        </StepPlayer>
        <Box kind="uebung" src={<Src ex={1} p="9" />} title={<T de="Eselsbrücke der Übung" en="Memory aid from the exercise class" />}>
          <T
            de={<p>Ion: <b>Kation</b>: Elektron entfernt, positive Ladung; <b>Anion</b>: Elektron zugefügt, negative Ladung. Merkhilfe der Übung (englisch): «happy / positive <i>cat</i> eats sad / negative <i>ant</i>» – cat steht für <i>cation</i>, ant für <i>anion</i>. Aufgabe 6 ordnet zu: Gold ist ein Element, <C>O2</C> ein Molekül, Salzwasser ein Gemisch, <C>He</C> ein Atom, <C>CO2</C> eine Verbindung und <C>H^+</C> ein Ion.</p>}
            en={<p>Ion: <b>cation</b>: electron removed, positive charge; <b>anion</b>: electron added, negative charge. Memory aid from the exercise class: “happy / positive <i>cat</i> eats sad / negative <i>ant</i>” – cat stands for <i>cation</i>, ant for <i>anion</i>. Exercise 6 matches: gold is an element, <C>O2</C> a molecule, saltwater a mixture, <C>He</C> an atom, <C>CO2</C> a compound and <C>H^+</C> an ion.</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- 9 */}
      <Section id="ionisch" title={<T de="9. Ionische Verbindungen und häufige Ionen" en="9. Ionic compounds and common ions" />}>
        <Box kind="lecture" src={<Src lec={1} p="22" />} title={<T de="Mehratomige Ionen und ionische Verbindungen" en="Polyatomic ions and ionic compounds" />}>
          <T
            de={<>
              <p><b>Mehratomige Ionen</b> sind Ionen aus einer Gruppe von Atomen, zum Beispiel das Ammonium-Kation <C>NH4^+</C> und das Sulfat-Anion <C p=".">SO4^2-</C></p>
              <p><b>Ionische Verbindungen</b> bestehen aus Kation und Anion, meist aus Metall und Nichtmetall, zum Beispiel Kochsalz <C p=".">NaCl</C> Elektronen gehen vom Metall zum Nichtmetall über. Entgegengesetzt geladene Ionen ziehen sich an. Die Verbindung als Ganzes ist elektrisch neutral. Sind die Ladungen von Kation und Anion ungleich, gleicht man mit Koeffizienten aus: <C>Mg^2+</C> und <C>N^3-</C> geben <C p=".">Mg3N2</C> Bei einem Ionenfestkörper schreibt man die <i>Verhältnisformel</i> (<En>empirical formula</En>). Zum Nachlesen: Brown 2.8.</p>
            </>}
            en={<>
              <p><b>Polyatomic ions</b> are ions made of a group of atoms, for example the ammonium cation <C>NH4^+</C> and the sulfate anion <C p=".">SO4^2-</C></p>
              <p><b>Ionic compounds</b> consist of a cation and an anion, usually of a metal and a nonmetal, for example table salt <C p=".">NaCl</C> Electrons go from the metal to the nonmetal. Oppositely charged ions attract each other. The compound as a whole is electrically neutral. If the charges of cation and anion are unequal, one balances them with coefficients: <C>Mg^2+</C> and <C>N^3-</C> give <C p=".">Mg3N2</C> For an ionic solid one writes the <i>empirical formula</i>. For further reading: Brown 2.8.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man <C>Mg3N2</C>:</b> Die Folie kreuzt die Ladungszahlen. Die 2 von <C>Mg^2+</C> wird zur Tiefzahl bei <C p=",">N</C> die 3 von <C>N^3-</C> zur Tiefzahl bei <C p=".">Mg</C> Warum? Es müssen gleich viele Plus- wie Minusladungen da sein. Drei Magnesium-Ionen bringen <M p=",">{t`3\cdot(+2) = +6`}</M> zwei Nitrid-Ionen <M p=".">{t`2\cdot(-3) = -6`}</M> Die Summe ist null: neutral. Im Bild wählst du Kation und Anion aus den Tabellen der Folien 23 und 24 und siehst, wie viele von jedem nötig sind.</p>
          </>}
          en={<>
            <p><b>How to read <C>Mg3N2</C>:</b> The slide crosses the charge numbers. The 2 of <C>Mg^2+</C> becomes the subscript of <C p=",">N</C> the 3 of <C>N^3-</C> the subscript of <C p=".">Mg</C> Why? There must be as many plus as minus charges. Three magnesium ions bring <M p=",">{t`3\cdot(+2) = +6`}</M> two nitride ions <M p=".">{t`2\cdot(-3) = -6`}</M> The sum is zero: neutral. In the picture you choose a cation and an anion from the tables of slides 23 and 24 and see how many of each are needed.</p>
          </>}
        />
        <IonicBuilder />
        <Box kind="lecture" src={<Src lec={1} p="23–24" />} title={<T de="Häufige Kationen und Anionen" en="Common cations and anions" />}>
          <T
            de={<p>Die Folien listen die häufigen Ionen mit Namen. Die <b>fett</b> gedruckten gebraucht der Kurs am meisten («lernen Sie diese zuerst»): Kationen <C>H^+</C> <C>Na^+</C> <C>K^+</C> <C>Ag^+</C> <C>NH4^+</C> <C>Mg^2+</C> <C>Ca^2+</C> <C>Zn^2+</C> <C>Cu^2+</C> <C>Fe^2+</C> <C>Pb^2+</C> <C>Al^3+</C> <C>Fe^3+</C>; Anionen <C>F^-</C> <C>Cl^-</C> <C>Br^-</C> <C>I^-</C> <C>OH^-</C> <C>CH3COO^-</C> <C>ClO4^-</C> <C>NO3^-</C> <C>O^2-</C> <C>S^2-</C> <C>CO3^2-</C> <C>SO4^2-</C> <C>PO4^3-</C>. Namen: <i>Hydroxid</i> (<C>OH^-</C>), <i>Nitrat</i> (<C>NO3^-</C>), <i>Sulfat</i> (<C>SO4^2-</C>), <i>Carbonat</i> (<C>CO3^2-</C>), <i>Phosphat</i> (<C>PO4^3-</C>), <i>Acetat</i> (<C>CH3COO^-</C>), <i>Ammonium</i> (<C>NH4^+</C>). Im Bild oben sind alle Ionen der Tabellen anwählbar; die fetten sind hervorgehoben.</p>}
            en={<p>The slides list the common ions with their names. The ones in <b>bold</b> are used most in the course (“learn them first”): cations <C>H^+</C> <C>Na^+</C> <C>K^+</C> <C>Ag^+</C> <C>NH4^+</C> <C>Mg^2+</C> <C>Ca^2+</C> <C>Zn^2+</C> <C>Cu^2+</C> <C>Fe^2+</C> <C>Pb^2+</C> <C>Al^3+</C> <C>Fe^3+</C>; anions <C>F^-</C> <C>Cl^-</C> <C>Br^-</C> <C>I^-</C> <C>OH^-</C> <C>CH3COO^-</C> <C>ClO4^-</C> <C>NO3^-</C> <C>O^2-</C> <C>S^2-</C> <C>CO3^2-</C> <C>SO4^2-</C> <C>PO4^3-</C>. Names: <i>hydroxide</i> (<C>OH^-</C>), <i>nitrate</i> (<C>NO3^-</C>), <i>sulfate</i> (<C>SO4^2-</C>), <i>carbonate</i> (<C>CO3^2-</C>), <i>phosphate</i> (<C>PO4^3-</C>), <i>acetate</i> (<C>CH3COO^-</C>), <i>ammonium</i> (<C>NH4^+</C>). In the picture above all ions of the tables can be selected; the bold ones are highlighted.</p>}
          />
        </Box>
      </Section>

      {/* -------------------------------------------------------------- misconceptions */}
      <Box kind="misconception" title={<T de="«Isotope sind verschiedene Elemente»" en="“Isotopes are different elements”" />}>
        <T
          de={<p>Nein. <M>{t`{}^{12}\mathrm{C}`}</M> und <M>{t`{}^{13}\mathrm{C}`}</M> haben beide 6 Protonen, sind also beide Kohlenstoff. Nur die Neutronen und damit die Masse sind verschieden. Das Element legt allein die Zahl der Protonen fest.</p>}
          en={<p>No. <M>{t`{}^{12}\mathrm{C}`}</M> and <M>{t`{}^{13}\mathrm{C}`}</M> both have 6 protons, so both are carbon. Only the neutrons, and with them the mass, differ. The element is fixed by the number of protons alone.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Das Atomgewicht ist die Masse eines Atoms»" en="“The atomic weight is the mass of an atom”" />}>
        <T
          de={<p>Nicht ganz. Es ist ein <em>Mittelwert</em> über die natürliche Isotopenmischung. Es gibt kein einzelnes Chloratom mit <M p=":">{t`35{,}45\,\mathrm{u}`}</M> Jedes Atom ist entweder <M>{t`{}^{35}\mathrm{Cl}`}</M> oder <M p=".">{t`{}^{37}\mathrm{Cl}`}</M></p>}
          en={<p>Not quite. It is an <em>average</em> over the natural isotope mixture. There is no single chlorine atom with <M p=":">{t`35.45\,\mathrm{u}`}</M> each atom is either <M>{t`{}^{35}\mathrm{Cl}`}</M> or <M p=".">{t`{}^{37}\mathrm{Cl}`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Ein Ion ist ein anderes Element»" en="“An ion is a different element”" />}>
        <T
          de={<p>Nein. <C>Na</C> und <C>Na^+</C> haben beide 11 Protonen. Beim Ion fehlt nur ein Elektron. Das Element bleibt, doch die Chemie ändert sich stark: Natrium-Metall reagiert heftig, das Natrium-Ion im Salz nicht.</p>}
          en={<p>No. <C>Na</C> and <C>Na^+</C> both have 11 protons. The ion just lacks one electron. The element stays, but the chemistry changes a lot: sodium metal reacts violently, the sodium ion in salt does not.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die Atomzeichnungen sind massstäblich»" en="“The atom drawings are to scale”" />}>
        <T
          de={<p>Keine Zeichnung ist es. Der Kern ist etwa zehntausendmal kleiner als die Wolke. Die Folie sagt es selbst: «Cartoon nucleus not to scale!»</p>}
          en={<p>No drawing is. The nucleus is about ten thousand times smaller than the cloud. The slide says it itself: “Cartoon nucleus not to scale!”</p>}
        />
      </Box>

      <Box kind="key" title={<T de="Merke" en="Key points" />}>
        <T
          de={<ul>
            <li>Reinstoffe haben feste Zusammensetzung, Gemische nicht. Atome sind die Buchstaben, Moleküle und Verbindungen die Wörter.</li>
            <li>Ein Atom hat <M>Z</M> Protonen, <M>N</M> Neutronen und <M>Z</M> Elektronen. Die Massenzahl ist <M p=".">{t`A = Z + N`}</M></li>
            <li>Das Element bestimmt <M p=",">Z</M> Isotope unterscheiden sich in <M p=".">N</M></li>
            <li>Das Atomgewicht ist der Mittelwert der Isotopenmassen, gewichtet mit der Häufigkeit; <M>{t`1\,\mathrm{u} = 1{,}66\times 10^{-27}\,\mathrm{kg}`}</M></li>
            <li>Periodensystem: Zeilen heissen Perioden, Spalten Gruppen; gleiche Gruppe, ähnliche Chemie.</li>
            <li>Ionen: Elektronen ab gibt ein Kation (<M p="),">+</M> Elektronen dazu ein Anion (<M p=").">{t`-`}</M> Ionische Verbindungen sind neutral: Summe der Ladungen null.</li>
          </ul>}
          en={<ul>
            <li>Pure substances have a fixed composition, mixtures do not. Atoms are the letters, molecules and compounds the words.</li>
            <li>An atom has <M>Z</M> protons, <M>N</M> neutrons and <M>Z</M> electrons. The mass number is <M p=".">{t`A = Z + N`}</M></li>
            <li>The element determines <M p=",">Z</M> isotopes differ in <M p=".">N</M></li>
            <li>The atomic weight is the average of the isotope masses, weighted by abundance; <M>{t`1\,\mathrm{u} = 1.66\times 10^{-27}\,\mathrm{kg}`}</M></li>
            <li>Periodic table: rows are periods, columns are groups; same group, similar chemistry.</li>
            <li>Ions: electrons removed give a cation (<M p="),">+</M> electrons added give an anion (<M p=").">{t`-`}</M> Ionic compounds are neutral: the charges add up to zero.</li>
          </ul>}
        />
      </Box>
      <p className="fig-note"><T de="Weiter:" en="Next:" />{' '}<a href="#ch-stoechio"><T de="Reaktionen, Mol und Stöchiometrie" en="Reactions, the mole and stoichiometry" /></a></p>
    </article>
  );
}
