import { Box, Section, Src } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T, useLang } from '../i18n';
import { chainTex } from '../chem/unitchain';
import { factor } from '../chem/units';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { balanceScene } from '../viz/chem/balanceScene';
import { sampleScene } from '../viz/chem/sampleScene';
import { Balancer, MoleConverter, ScaleTable } from '../viz/chem/StoichFigures';
import { En } from '../viz/chem/En';
import '../viz/chem/chem.css';
import '../viz/chem/stoich.css';

const t = String.raw;
const YOGURT = { value: 78, unit: 'kcal' };
const YOGURT_F = [factor(1000, 'cal', 1, 'kcal'), factor(4.184, 'J', 1, 'cal')];

export default function CH1Stoechio() {
  const de = useLang() === 'de';
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Atome sind die Buchstaben, Moleküle die Wörter, <b>Reaktionen die Sätze</b>. In dieser Lektion lernst du, einen solchen Satz richtig zu schreiben (die Gleichung <b>ausgleichen</b>) und ihn in Gramm zu übersetzen. Dafür brauchst du eine Einheit, die zwischen der Welt der Atome und der Waage vermittelt: das <b>Mol</b>.</p>}
        en={<p className="lede">Atoms are the letters, molecules the words, <b>reactions the sentences</b>. In this lesson you learn to write such a sentence correctly (<b>balancing</b> the equation) and to translate it into grams. For that you need a unit that connects the world of atoms to the balance: the <b>mole</b>.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an ein Rezept: «2 Eier und 1 Tasse Mehl geben 1 Pfannkuchen-Portion». Das Rezept sagt, <em>wie viele Stück</em> von jeder Zutat nötig sind. Im Laden kauft man aber Eier im Karton und Mehl nach Gewicht. Die Chemie hat dieselbe Aufgabe: Die Gleichung zählt Moleküle, die Waage wiegt Gramm. Das Mol ist der «Karton», der beides verbindet.</p>}
          en={<p>Think of a recipe: “2 eggs and 1 cup of flour make 1 portion of pancakes”. The recipe says <em>how many pieces</em> of each ingredient are needed. In the shop, though, you buy eggs by the box and flour by weight. Chemistry has the same task: the equation counts molecules, the balance weighs grams. The mole is the “box” that connects the two.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="reaktionen" title={<T de="1. Chemische Reaktionen" en="1. Chemical reactions" />}>
        <Box kind="lecture" src={<Src lec={1} p="25" />} title={<T de="Chemische Reaktionen" en="Chemical reactions" />}>
          <T
            de={<>
              <p>Reaktionen beschreiben den Wechsel von einem Stoff zu einem anderen. Das ist etwas anderes als eine <i>physikalische</i> Änderung desselben Stoffes: Schmelzendes Eis ist keine chemische Reaktion (nur der Aggregatzustand ändert sich).</p>
              <p>Die Regeln chemischer Reaktionen:</p>
              <ul>
                <li>Atome werden bei einer Reaktion weder erzeugt noch zerstört.</li>
                <li>Energie kann nötig sein, um eine Reaktion zu starten.</li>
                <li>Energie kann bei einer Reaktion frei werden oder aufgenommen werden.</li>
              </ul>
              <p>Beschrieben werden Reaktionen durch <b>chemische Gleichungen</b> (<En>chemical equations</En>): Edukte (<En>reactants</En>) <M>{t`\longrightarrow`}</M> Produkte (<En>products</En>), gelesen «gehen über in» oder «erzeugen». Jede Atomsorte muss auf beiden Seiten gleich oft vorkommen, weil Atome nicht verschwinden können. Randnotiz: Energie ist ein Grund, warum chemische Reaktionen für Maschinen- und Verfahrensingenieure so wichtig sind.</p>
            </>}
            en={<>
              <p>Reactions describe the change from one substance to another. This is different from a <i>physical</i> change of the same substance: melting ice is not a chemical reaction (only the state changes).</p>
              <p>The rules of chemical reactions:</p>
              <ul>
                <li>Atoms are neither created nor destroyed in a reaction.</li>
                <li>Energy may be required to start a reaction.</li>
                <li>Energy may be released or absorbed by a reaction.</li>
              </ul>
              <p>Reactions are described by <b>chemical equations</b>: reactants <M>{t`\longrightarrow`}</M> products, read “go to” or “produce”. Every kind of atom must occur equally often on both sides, because atoms cannot disappear. Side note: energy is one reason why chemical reactions are so important to mechanical and process engineers.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="ausgleichen" title={<T de="2. Gleichungen ausgleichen" en="2. Balancing equations" />}>
        <Box kind="lecture" src={<Src lec={1} p="26" />} title={<T de="Stöchiometrie: das Beispiel Wasser" en="Stoichiometry: the water example" />}>
          <T
            de={<>
              <p><b>Stöchiometrie</b> (<En>stoichiometry</En>) fragt: Wie viele Edukte werden verbraucht, wie viele Produkte entstehen? Beispiel (das Verbrennen von Wasserstoff setzt nutzbare Energie frei und ist wichtig für die Zukunft unseres Planeten):</p>
              <CD>H2 + O2 -&gt; H2O</CD>
              <p>Die Folie zählt nur die Atome: links <M p=",">{t`2\mathrm{H} + 2\mathrm{O}`}</M> rechts <M p=".">{t`2\mathrm{H} + \mathrm{O}`}</M> Das ist <b>nicht ausgeglichen</b>. Man gleicht «durch Hinsehen» aus, indem man Koeffizienten vor die Formeln setzt, wie in einer algebraischen Gleichung:</p>
              <CD>2 H2 + O2 -&gt; 2 H2O</CD>
              <p>Oder man geht systematisch vor (nächste Folie).</p>
            </>}
            en={<>
              <p><b>Stoichiometry</b> asks: how many reactants are consumed, how many products are produced? Example (burning hydrogen releases useful energy and is important for the future of our planet):</p>
              <CD>H2 + O2 -&gt; H2O</CD>
              <p>The slide just counts atoms: on the left <M p=",">{t`2\mathrm{H} + 2\mathrm{O}`}</M> on the right <M p=".">{t`2\mathrm{H} + \mathrm{O}`}</M> This is <b>not balanced</b>. One balances “by inspection” by putting coefficients in front of the formulae, like in an algebraic equation:</p>
              <CD>2 H2 + O2 -&gt; 2 H2O</CD>
              <p>Or one proceeds systematically (next slide).</p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={1} p="27" />} title={<T de="Systematisch ausgleichen" en="Balancing systematically" />}>
          <T
            de={<>
              <p>Man schreibt unbekannte Koeffizienten <M p=",">a</M> <M p=",">b</M> <M>c</M> vor die Formeln:</p>
              <MD>{t`a\,\mathrm{H_2} + b\,\mathrm{O_2} \longrightarrow c\,\mathrm{H_2O}`}</MD>
              <p>Ausgleichen verlangt <M>{t`a = c`}</M> und <M p=".">{t`b = \tfrac12 c`}</M> Setzt man <M p=",">{t`a = 1`}</M> folgt <M>{t`c = 1`}</M> und <M p=":">{t`b = \tfrac12`}</M></p>
              <CD>H2 + 1/2 O2 -&gt; H2O</CD>
              <p>Mit 2 multipliziert, damit alle Koeffizienten ganze Zahlen sind: <C p=".">2 H2 + O2 -&gt; 2 H2O</C> Beide Formen sind ausgeglichen; man kann es immer prüfen.</p>
              <p><b>Merke:</b> Zum Ausgleichen ändert man die <em>Koeffizienten</em>, nie die <em>Indizes</em>! Es gilt <M p=".">{t`\mathrm{H_2O} \neq \mathrm{H_2O_2}`}</M></p>
            </>}
            en={<>
              <p>One writes unknown coefficients <M p=",">a</M> <M p=",">b</M> <M>c</M> in front of the formulae:</p>
              <MD>{t`a\,\mathrm{H_2} + b\,\mathrm{O_2} \longrightarrow c\,\mathrm{H_2O}`}</MD>
              <p>Balancing requires <M>{t`a = c`}</M> and <M p=".">{t`b = \tfrac12 c`}</M> Setting <M p=",">{t`a = 1`}</M> gives <M>{t`c = 1`}</M> and <M p=":">{t`b = \tfrac12`}</M></p>
              <CD>H2 + 1/2 O2 -&gt; H2O</CD>
              <p>Multiplied by 2 so that all coefficients are whole numbers: <C p=".">2 H2 + O2 -&gt; 2 H2O</C> Both forms are balanced; you can always check.</p>
              <p><b>Note:</b> to balance, change the <em>coefficients</em>, never the <em>subscripts</em>! We have <M p=".">{t`\mathrm{H_2O} \neq \mathrm{H_2O_2}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Zeilen:</b></p>
            <ol>
              <li>Der Koeffizient <M>a</M> sagt, wie viele <C>H2</C>-Moleküle mitmachen. Jedes hat 2 Wasserstoffatome, also liefern <M>a</M> Moleküle <M>{t`2a`}</M> Atome <C p=".">H</C></li>
              <li>Rechts hat jedes <C>H2O</C> zwei <C p=",">H</C> also <M>{t`2c`}</M> Atome. Beide Seiten gleich: <M p=".">{t`2a = 2c`}</M> Das gibt <M p=".">{t`a = c`}</M></li>
              <li>Für <C>O</C> ist es anders: <C>O2</C> hat zwei Atome, <C>H2O</C> nur eines. Links <M p=",">{t`2b`}</M> rechts <M p=".">c</M> Aus <M>{t`2b = c`}</M> folgt <M p=".">{t`b = c/2`}</M></li>
              <li>Das System hat mehr Unbekannte als Gleichungen: Wir dürfen eine frei wählen. Mit <M>{t`a = 1`}</M> ist alles festgelegt. Weil man kein halbes Molekül zeichnen kann, verdoppelt man alles.</li>
            </ol>
            <p>Im Bild siehst du die vier Schritte. Unten steht die <b>Atombilanz</b>: je eine Zeile für <C>H</C> und <C p=",">O</C> links die Zahl der Atome im Edukt, rechts im Produkt. Stimmen beide Zeilen überein, ist die Gleichung ausgeglichen.</p>
          </>}
          en={<>
            <p><b>How to read the lines:</b></p>
            <ol>
              <li>The coefficient <M>a</M> says how many <C>H2</C> molecules take part. Each has 2 hydrogen atoms, so <M>a</M> molecules supply <M>{t`2a`}</M> atoms <C p=".">H</C></li>
              <li>On the right each <C>H2O</C> has two <C p=",">H</C> so <M>{t`2c`}</M> atoms. Both sides equal: <M p=".">{t`2a = 2c`}</M> This gives <M p=".">{t`a = c`}</M></li>
              <li>For <C>O</C> it is different: <C>O2</C> has two atoms, <C>H2O</C> only one. On the left <M p=",">{t`2b`}</M> on the right <M p=".">c</M> From <M>{t`2b = c`}</M> follows <M p=".">{t`b = c/2`}</M></li>
              <li>The system has more unknowns than equations: we may choose one freely. With <M>{t`a = 1`}</M> everything is fixed. Because you cannot draw half a molecule, you double everything.</li>
            </ol>
            <p>The figure shows the four steps. At the bottom is the <b>atom ledger</b>: one row for <C>H</C> and one for <C p=",">O</C> on the left the number of atoms in the reactants, on the right in the products. If both rows agree, the equation is balanced.</p>
          </>}
        />
        <StepPlayer
          label="Wasserstoff und Sauerstoff werden ausgeglichen"
          steps={[
            { ms: 2200, holdMs: 3800, caption: <T
              de={<>So steht die Reaktion zuerst da: ein <C>H2</C>, ein <C>O2</C>, ein <C p=".">H2O</C> Die Atombilanz zeigt: <C>H</C> stimmt (2 und 2), aber <C>O</C> nicht (2 links, 1 rechts). Das orange Kästchen ist zu viel.</>}
              en={<>This is how the reaction first looks: one <C>H2</C>, one <C>O2</C>, one <C p=".">H2O</C> The ledger shows: <C>H</C> is fine (2 and 2), but <C>O</C> is not (2 on the left, 1 on the right). The orange square is too many.</>} /> },
            { ms: 2500, holdMs: 4200, caption: <T
              de={<>Unbekannte Koeffizienten <M p=",">a</M> <M p=",">b</M> <M p=".">c</M> Die Bilanz wird zu zwei Gleichungen: für <C>H</C> gilt <M p=",">{t`2a = 2c`}</M> für <C>O</C> gilt <M p=".">{t`2b = c`}</M></>}
              en={<>Unknown coefficients <M p=",">a</M> <M p=",">b</M> <M p=".">c</M> The ledger becomes two equations: for <C>H</C> we need <M p=",">{t`2a = 2c`}</M> for <C>O</C> we need <M p=".">{t`2b = c`}</M></>} /> },
            { ms: 3000, holdMs: 4200, caption: <T
              de={<>Wähle <M p=".">{t`a = 1`}</M> Dann ist <M>{t`c = 1`}</M> und <M p=".">{t`b = \tfrac12`}</M> Das heisst: ein halbes <C p=".">O2</C> (gestrichelt). Beide Zeilen der Bilanz stimmen jetzt.</>}
              en={<>Choose <M p=".">{t`a = 1`}</M> Then <M>{t`c = 1`}</M> and <M p=".">{t`b = \tfrac12`}</M> That means: half an <C>O2</C> (dashed). Both rows of the ledger now agree.</>} /> },
            { ms: 3000, holdMs: 3000, caption: <T
              de={<>Alles mal 2: <C p=".">2 H2 + O2 -&gt; 2 H2O</C> Nur ganze Moleküle, die Bilanz bleibt ausgeglichen (4 und 4, 2 und 2).</>}
              en={<>Everything times 2: <C p=".">2 H2 + O2 -&gt; 2 H2O</C> Only whole molecules, the ledger stays balanced (4 and 4, 2 and 2).</>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={balanceScene} step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>Selbst ausprobieren.</b> Wähle eine Reaktion und ändere die Koeffizienten mit den Knöpfen. Jede Zeile der Atombilanz zeigt, wie viele Atome einer Sorte links und rechts stehen. Ist ein Kästchen orange, ist auf dieser Seite etwas übrig. Die letzte Reaktion ist die Aufgabe 9 der Übung.</p>}
          en={<p><b>Try it yourself.</b> Choose a reaction and change the coefficients with the buttons. Each row of the ledger shows how many atoms of one kind are on the left and on the right. An orange square means something is left over on that side. The last reaction is exercise 9 of the exercise class.</p>}
        />
        <Balancer />
        <Box kind="uebung" src={<Src ex={1} p="11" />} title={<T de="Aufgabe 9: ausgleichen" en="Exercise 9: balance" />}>
          <T
            de={<p>Gleiche die Gleichung aus: <C p=".">CF4(l) + Br2(g) -&gt; CBr4(l) + F2(g)</C> Die Übung zählt: links <M p=",">{t`1\,\mathrm{C}`}</M> <M p=",">{t`4\,\mathrm{F}`}</M> <M p=",">{t`2\,\mathrm{Br}`}</M> rechts <M p=",">{t`1\,\mathrm{C}`}</M> <M p=",">{t`4\,\mathrm{Br}`}</M> <M p=".">{t`2\,\mathrm{F}`}</M> Brom und Fluor tauschen sich also aus; je ein zusätzlicher Faktor 2 hilft. Ergebnis:</p>}
            en={<p>Balance the equation: <C p=".">CF4(l) + Br2(g) -&gt; CBr4(l) + F2(g)</C> The exercise class counts: on the left <M p=",">{t`1\,\mathrm{C}`}</M> <M p=",">{t`4\,\mathrm{F}`}</M> <M p=",">{t`2\,\mathrm{Br}`}</M> on the right <M p=",">{t`1\,\mathrm{C}`}</M> <M p=",">{t`4\,\mathrm{Br}`}</M> <M p=".">{t`2\,\mathrm{F}`}</M> So bromine and fluorine swap places; a factor 2 on <C>Br2</C> and on <C>F2</C> helps. Result:</p>}
          />
          <CD>CF4(l) + 2 Br2(g) -&gt; CBr4(l) + 2 F2(g)</CD>
          <T
            de={<p>Probe: links <M>{t`4\,\mathrm{F}`}</M> und <M p=",">{t`2\cdot 2 = 4\,\mathrm{Br}`}</M> rechts <M>{t`4\,\mathrm{Br}`}</M> und <M p=".">{t`2\cdot 2 = 4\,\mathrm{F}`}</M> Stimmt. (Unten im Bild als letzte Reaktion.)</p>}
            en={<p>Check: on the left <M>{t`4\,\mathrm{F}`}</M> and <M p=",">{t`2\cdot 2 = 4\,\mathrm{Br}`}</M> on the right <M>{t`4\,\mathrm{Br}`}</M> and <M p=".">{t`2\cdot 2 = 4\,\mathrm{F}`}</M> Correct. (It is the last reaction in the figure above.)</p>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Zustandsangaben" en="State symbols" />}>
          <T
            de={<p>In den Gleichungen stehen oft kleine Buchstaben hinter den Formeln: <M>(s)</M> fest (<En>solid</En>), <M>(l)</M> flüssig (<En>liquid</En>), <M>(g)</M> gasförmig (<En>gas</En>), <M p=".">(aq)</M> in Wasser gelöst. Sie ändern nichts an den Koeffizienten, sagen aber, in welchem Zustand der Stoff vorliegt.</p>}
            en={<p>Equations often carry small letters after the formulae: <M>(s)</M> solid, <M>(l)</M> liquid, <M>(g)</M> gas, <M p=".">(aq)</M> dissolved in water. They do not change the coefficients but say in which state the substance is.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="formelgewicht" title={<T de="3. Formelgewicht: Masse eines Moleküls" en="3. Formula weight: the mass of a molecule" />}>
        <T
          de={<p>In einem Labor reagieren nie genau zwei <C>H2</C>-Moleküle mit einem <C p=".">O2</C> Man arbeitet mit Gramm und Kilogramm. Dafür muss man zuerst wissen, wie schwer ein Molekül ist. Das Atomgewicht aus der letzten Lektion hilft dabei.</p>}
          en={<p>In a lab, exactly two <C>H2</C> molecules never react with one <C p=".">O2</C> One works with grams and kilograms. For that you first need to know how heavy a molecule is. The atomic weight from the last lesson helps.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="28" />} title={<T de="Formelgewicht" en="Formula weight" />}>
          <T
            de={<>
              <p>Das <b>Formelgewicht</b> (<En>formula weight, FW</En>) ist die Summe der Atomgewichte aller Atome in der Formel. Beispiel Wasser:</p>
              <MD>{t`\mathrm{FW(H_2O)} = 2\cdot(1{,}0\,\mathrm{u}) + 1\cdot(16{,}0\,\mathrm{u}) = 18{,}0\,\mathrm{u}`}</MD>
              <p>Das sind (von links nach rechts) das Atomgewicht von Wasserstoff, das von Sauerstoff und die Masse eines <C>H2O</C>-Moleküls in atomaren Masseneinheiten. Ist der Stoff ein Molekül, heisst das Formelgewicht <b>Molekulargewicht</b> <M p="">{t`M_\mathrm{w}`}</M> (<En>molecular weight</En>). Ist er ein Ionenfestkörper, nimmt man die <b>Verhältnisformel</b> (<En>empirical formula</En>), also das kleinste ganzzahlige Verhältnis der Atome, zum Beispiel <C>NaCl</C> oder <C p=".">CaCl2</C> (Randnotiz: festes <C>NaCl</C> ist eine dreidimensionale Anordnung von «NaCl»-Paaren.) Randnotiz: Das Formelgewicht ist die Masse eines einzelnen Moleküls in <M p=".">{t`\mathrm{u}`}</M></p>
            </>}
            en={<>
              <p>The <b>formula weight</b> (FW) is the sum of the atomic weights of all atoms in the formula. Example water:</p>
              <MD>{t`\mathrm{FW(H_2O)} = 2\cdot(1.0\,\mathrm{u}) + 1\cdot(16.0\,\mathrm{u}) = 18.0\,\mathrm{u}`}</MD>
              <p>These are (from left to right) the atomic weight of hydrogen, that of oxygen and the mass of one <C>H2O</C> molecule in atomic mass units. If the substance is a molecule, the formula weight is called the <b>molecular weight</b> <M p=",">{t`M_\mathrm{w}`}</M> If it is an ionic solid, one uses the <b>empirical formula</b>, i.e. the smallest whole-number ratio of the atoms, for example <C>NaCl</C> or <C p=".">CaCl2</C> (Side note: solid <C>NaCl</C> is a three-dimensional arrangement of “NaCl” pairs.) Side note: the formula weight is the mass of a single molecule in <M p=".">{t`\mathrm{u}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Zeile:</b> Jedes Atom in der Formel trägt seine Masse bei. Der Index sagt, wie oft. <C>H2O</C> hat zwei <C>H</C> und ein <C p=".">O</C> Also zweimal <M>{t`1{,}0\,\mathrm{u}`}</M> plus einmal <M p=".">{t`16{,}0\,\mathrm{u}`}</M> Für <C>CaCl2</C> wären es ein <C>Ca</C> und zwei <C p=".">Cl</C> Mit genaueren Atomgewichten (<M>{t`1{,}008`}</M> und <M p=")">{t`15{,}999`}</M> gibt <C>H2O</C> übrigens <M p=".">{t`18{,}015\,\mathrm{u}`}</M></p>
          </>}
          en={<>
            <p><b>How to read the line:</b> Each atom in the formula contributes its mass. The subscript says how often. <C>H2O</C> has two <C>H</C> and one <C p=".">O</C> So twice <M>{t`1.0\,\mathrm{u}`}</M> plus once <M p=".">{t`16.0\,\mathrm{u}`}</M> For <C>CaCl2</C> it would be one <C>Ca</C> and two <C p=".">Cl</C> With more precise atomic weights (<M>{t`1.008`}</M> and <M p=")">{t`15.999`}</M> <C>H2O</C> gives <M p=".">{t`18.015\,\mathrm{u}`}</M></p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="einheiten" title={<T de="4. Einheiten umrechnen (Dimensionsanalyse)" en="4. Converting units (dimensional analysis)" />}>
        <T
          de={<p>Die Beispielaufgabe der Vorlesung besteht aus einer langen Kette von Umrechnungen. Die Folie sagt dazu: «Übung 1 gibt eine Einführung in die Dimensionsanalyse. Solche Umrechnungen machen Sie in Ihren Fächern oft.» Wir üben die Methode deshalb zuerst an einem einfachen Fall aus der Übung.</p>}
          en={<p>The lecture’s sample problem consists of a long chain of conversions. The slide says: “Exercise 1 will have a tutorial on dimensional analysis. You will do such unit conversions a lot in your courses.” So we first practise the method on a simple case from the exercise class.</p>}
        />
        <Box kind="uebung" src={<Src ex={1} p="6–8" />} title={<T de="SI-Einheiten und Umrechnungsfaktoren" en="SI units and conversion factors" />}>
          <T
            de={<>
              <p><b>SI-Basiseinheiten</b> (<En>système international d’unités</En>), die man kennen muss: Länge Meter <M p=",">{t`\mathrm{m}`}</M> Masse Kilogramm <M p=",">{t`\mathrm{kg}`}</M> Temperatur Kelvin <M p=",">{t`\mathrm{K}`}</M> Zeit Sekunde <M p=",">{t`\mathrm{s}`}</M> Stoffmenge Mol <M p=".">{t`\mathrm{mol}`}</M> <b>Vorsätze</b> zum Kennen: Giga <M p=",">{t`\mathrm{G} = 10^{9}`}</M> Mega <M p=",">{t`\mathrm{M} = 10^{6}`}</M> Kilo <M p=",">{t`\mathrm{k} = 10^{3}`}</M> Dezi <M p=",">{t`\mathrm{d} = 10^{-1}`}</M> Zenti <M p=",">{t`\mathrm{c} = 10^{-2}`}</M> Milli <M p=",">{t`\mathrm{m} = 10^{-3}`}</M> Mikro <M p=",">{t`\mu = 10^{-6}`}</M> Nano <M p=".">{t`\mathrm{n} = 10^{-9}`}</M> Weiter: <M p=";">{t`T/\mathrm{K} = \theta/{}^\circ\mathrm{C} + 273{,}15`}</M> <M>{t`1\,\mathrm{L} = 1\,\mathrm{dm^3}`}</M> und <M p=";">{t`1\,\mathrm{mL} = 1\,\mathrm{cm^3}`}</M> <M p=".">{t`\mathrm{N} = \mathrm{kg\,m\,s^{-2}}`}</M></p>
              <p>Ein <b>Umrechnungsfaktor</b> (<En>conversion factor</En>) ist eine Zahl, die eine Einheit in eine andere umrechnet, zum Beispiel <M p=",">{t`1\,\mathrm{cal} = 4{,}184\,\mathrm{J}`}</M> Man schreibt ihn als Bruch, der gleich 1 ist: <M p=".">{t`\dfrac{4{,}184\,\mathrm{J}}{1\,\mathrm{cal}} = 1`}</M> Die Regel der Übung:</p>
              <MD>{t`\text{gegebene Einheit}\cdot\frac{\text{gesuchte Einheit}}{\text{gegebene Einheit}} = \text{gesuchte Einheit}`}</MD>
            </>}
            en={<>
              <p><b>SI base units</b> (système international d’unités) to know: length metre <M p=",">{t`\mathrm{m}`}</M> mass kilogram <M p=",">{t`\mathrm{kg}`}</M> temperature kelvin <M p=",">{t`\mathrm{K}`}</M> time second <M p=",">{t`\mathrm{s}`}</M> amount of substance mole <M p=".">{t`\mathrm{mol}`}</M> <b>Prefixes</b> to know: giga <M p=",">{t`\mathrm{G} = 10^{9}`}</M> mega <M p=",">{t`\mathrm{M} = 10^{6}`}</M> kilo <M p=",">{t`\mathrm{k} = 10^{3}`}</M> deci <M p=",">{t`\mathrm{d} = 10^{-1}`}</M> centi <M p=",">{t`\mathrm{c} = 10^{-2}`}</M> milli <M p=",">{t`\mathrm{m} = 10^{-3}`}</M> micro <M p=",">{t`\mu = 10^{-6}`}</M> nano <M p=".">{t`\mathrm{n} = 10^{-9}`}</M> Also: <M p=";">{t`T/\mathrm{K} = \theta/{}^\circ\mathrm{C} + 273.15`}</M> <M>{t`1\,\mathrm{L} = 1\,\mathrm{dm^3}`}</M> and <M p=";">{t`1\,\mathrm{mL} = 1\,\mathrm{cm^3}`}</M> <M p=".">{t`\mathrm{N} = \mathrm{kg\,m\,s^{-2}}`}</M></p>
              <p>A <b>conversion factor</b> is a number that converts one unit into another, for example <M p=",">{t`1\,\mathrm{cal} = 4.184\,\mathrm{J}`}</M> You write it as a fraction that equals 1: <M p=".">{t`\dfrac{4.184\,\mathrm{J}}{1\,\mathrm{cal}} = 1`}</M> The rule of the exercise class:</p>
              <MD>{t`\text{given unit}\cdot\frac{\text{desired unit}}{\text{given unit}} = \text{desired unit}`}</MD>
            </>}
          />
        </Box>
        <T
          de={<p><b>Warum ist das erlaubt?</b> Multipliziert man eine Zahl mit einem Bruch, der gleich 1 ist, ändert sich ihr Wert nicht, nur die Einheit. Die Einheiten verhalten sich wie Zahlen: Gleiche oben und unten kürzen sich weg. So erkennt man sofort, ob man den Faktor richtig herum eingesetzt hat: Die ungewollte Einheit muss verschwinden.</p>}
          en={<p><b>Why is this allowed?</b> Multiplying a number by a fraction equal to 1 does not change its value, only its unit. Units behave like numbers: equal units on top and bottom cancel. So you see at once whether you put the factor the right way up: the unwanted unit must disappear.</p>}
        />
        <Box kind="uebung" src={<Src ex={1} p="8" />} title={<T de="Aufgabe 4: Ein Joghurt hat 78 kcal. Wie viele Joule?" en="Exercise 4: a yogurt contains 78 kcal. How many joules?" />}>
          <StepPlayer
            label="Einheiten kürzen"
            steps={[
              { ms: 1500, holdMs: 2500, caption: <T de={<>Gegeben: <M p=".">{t`78\,\mathrm{kcal}`}</M> Gesucht: Joule. Die Einheit <M>{t`\mathrm{kcal}`}</M> muss weg, <M>{t`\mathrm{J}`}</M> muss her.</>} en={<>Given: <M p=".">{t`78\,\mathrm{kcal}`}</M> Wanted: joules. The unit <M>{t`\mathrm{kcal}`}</M> must go, <M>{t`\mathrm{J}`}</M> must appear.</>} /> },
              { ms: 2500, holdMs: 3500, caption: <T de={<>Erster Faktor: <M p=".">{t`1\,\mathrm{kcal} = 1000\,\mathrm{cal}`}</M> Er steht so, dass <M>{t`\mathrm{kcal}`}</M> unten steht und sich mit dem <M>{t`\mathrm{kcal}`}</M> vorne kürzt. Übrig: Kalorien.</>} en={<>First factor: <M p=".">{t`1\,\mathrm{kcal} = 1000\,\mathrm{cal}`}</M> It is placed so that <M>{t`\mathrm{kcal}`}</M> is in the denominator and cancels with the <M>{t`\mathrm{kcal}`}</M> at the front. Left: calories.</>} /> },
              { ms: 2500, holdMs: 2500, caption: <T de={<>Zweiter Faktor: <M p=".">{t`1\,\mathrm{cal} = 4{,}184\,\mathrm{J}`}</M> Jetzt kürzt sich <M p=".">{t`\mathrm{cal}`}</M> Es bleibt nur Joule, und die Zahl ist <M p=".">{t`78\cdot 1000\cdot 4{,}184 \approx 3{,}3\times 10^{5}`}</M></>} en={<>Second factor: <M p=".">{t`1\,\mathrm{cal} = 4.184\,\mathrm{J}`}</M> Now <M>{t`\mathrm{cal}`}</M> cancels. Only joules remain, and the number is <M p=".">{t`78\cdot 1000\cdot 4.184 \approx 3.3\times 10^{5}`}</M></>} /> },
            ]}
          >
            {(step, tt) => <div className="dim-chain" data-t={tt.toFixed(2)}><MD>{chainTex(YOGURT, YOGURT_F, step + 0, de)}</MD></div>}
          </StepPlayer>
          <T
            de={<p>Ergebnis der Übung: <M p=".">{t`3{,}3\times 10^{5}\,\mathrm{J}`}</M> Wie gross ist das? Etwa der Energieinhalt, den eine 100-W-Lampe in einer knappen Stunde verbraucht.</p>}
            en={<p>Result of the exercise class: <M p=".">{t`3.3\times 10^{5}\,\mathrm{J}`}</M> How big is that? About the energy a 100 W lamp uses in just under an hour.</p>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={1} p="7–8" />} title={<T de="Weitere Aufgaben der Übung" en="More exercises from the exercise class" />}>
          <T
            de={<ul>
              <li><b>Aufgabe 1:</b> Die Einheit von <M>{t`E_\mathrm{kin} = \tfrac12 m v^2`}</M> in SI: <M p=".">{t`\mathrm{kg}\cdot(\mathrm{m/s})^2 = \mathrm{kg\,m^2\,s^{-2}} = \mathrm{J}`}</M></li>
              <li><b>Aufgabe 2:</b> Eine Rakete fliegt mit <M p=".">{t`7{,}4\,\mathrm{km/s}`}</M> Welche Strecke legt sie in <M p="?">{t`5{,}0\,\mathrm{ms}`}</M> Erst in SI: <M>{t`7{,}4\times 10^{3}\,\mathrm{m/s}`}</M> und <M p=".">{t`5{,}0\times 10^{-3}\,\mathrm{s}`}</M> Dann <M p=".">{t`s = v\,t = 7{,}4\times 10^{3}\cdot 5{,}0\times 10^{-3}\,\mathrm{m} = 37\,\mathrm{m}`}</M></li>
              <li><b>Aufgabe 3:</b> <M>{t`10^{-9}`}</M> Gramm sind Nanogramm, <M>{t`10^{-6}`}</M> Sekunden Mikrosekunden, <M>{t`10^{-12}`}</M> Meter Pikometer.</li>
              <li><b>Aufgabe 5:</b> Wie viele Tonnen Treibstoff fasst die Rakete SpaceX Super Heavy (70 m hoch, 9,0 m Durchmesser, Dichte <M p=")">{t`0{,}83\,\mathrm{kg/L}`}</M> Volumen <M p=",">{t`V = \pi r^2 h = \pi\,(4{,}5\,\mathrm{m})^2\cdot 70\,\mathrm{m} \approx 4{,}45\times 10^{3}\,\mathrm{m^3}`}</M> also <M p=".">{t`4{,}45\times 10^{6}\,\mathrm{L}`}</M> Masse: <M p=".">{t`m = \rho V = 0{,}83\,\mathrm{kg/L}\cdot 4{,}45\times 10^{6}\,\mathrm{L} \approx 3{,}7\times 10^{6}\,\mathrm{kg} = 3{,}7\times 10^{3}\,\mathrm{t}`}</M></li>
            </ul>}
            en={<ul>
              <li><b>Exercise 1:</b> the unit of <M>{t`E_\mathrm{kin} = \tfrac12 m v^2`}</M> in SI: <M p=".">{t`\mathrm{kg}\cdot(\mathrm{m/s})^2 = \mathrm{kg\,m^2\,s^{-2}} = \mathrm{J}`}</M></li>
              <li><b>Exercise 2:</b> a rocket flies at <M p=".">{t`7.4\,\mathrm{km/s}`}</M> How far does it travel in <M p="?">{t`5.0\,\mathrm{ms}`}</M> First in SI: <M>{t`7.4\times 10^{3}\,\mathrm{m/s}`}</M> and <M p=".">{t`5.0\times 10^{-3}\,\mathrm{s}`}</M> Then <M p=".">{t`s = v\,t = 7.4\times 10^{3}\cdot 5.0\times 10^{-3}\,\mathrm{m} = 37\,\mathrm{m}`}</M></li>
              <li><b>Exercise 3:</b> <M>{t`10^{-9}`}</M> gram is a nanogram, <M>{t`10^{-6}`}</M> seconds are microseconds, <M>{t`10^{-12}`}</M> metre is a picometre.</li>
              <li><b>Exercise 5:</b> how many tonnes of fuel does the SpaceX Super Heavy booster hold (70 m tall, 9.0 m diameter, density <M p=")">{t`0.83\,\mathrm{kg/L}`}</M> Volume <M p=",">{t`V = \pi r^2 h = \pi\,(4.5\,\mathrm{m})^2\cdot 70\,\mathrm{m} \approx 4.45\times 10^{3}\,\mathrm{m^3}`}</M> so <M p=".">{t`4.45\times 10^{6}\,\mathrm{L}`}</M> Mass: <M p=".">{t`m = \rho V = 0.83\,\mathrm{kg/L}\cdot 4.45\times 10^{6}\,\mathrm{L} \approx 3.7\times 10^{6}\,\mathrm{kg} = 3.7\times 10^{3}\,\mathrm{t}`}</M></li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="beispiel" title={<T de="5. Die Beispielaufgabe der Vorlesung" en="5. The lecture’s sample problem" />}>
        <Box kind="lecture" src={<Src lec={1} p="29" />} title={<T de="Beispielaufgabe (Sample Problem)" en="Sample problem" />}>
          <T
            de={<>
              <p><b>Frage:</b> Wie viele Gramm <C>O2</C> können mit 2,00 g <C>H2</C> reagieren? Reaktion: <C p=".">2 H2 + O2 -&gt; 2 H2O</C> Formelgewichte: <M>{t`\mathrm{FW(H_2)} = 2\cdot(1{,}00\,\mathrm{u}) = 2{,}00\,\mathrm{u}`}</M> und <M p=".">{t`\mathrm{FW(O_2)} = 2\cdot(16{,}0\,\mathrm{u}) = 32{,}0\,\mathrm{u}`}</M></p>
              <p><b>Strategie:</b> Einheiten umrechnen: Gramm <C>H2</C> → u <C>H2</C> → Moleküle <C>H2</C> → Moleküle <C>O2</C> → u <C>O2</C> → Gramm <C p=".">O2</C></p>
              <MD>{t`\begin{aligned} 2\,\mathrm{g}\cdot\frac{1\,\mathrm{kg}}{1000\,\mathrm{g}}\cdot\frac{1\,\mathrm{u}}{1{,}66\times 10^{-27}\,\mathrm{kg}}\cdot\frac{1\,\text{Molekül}\ \mathrm{H_2}}{2{,}00\,\mathrm{u}}\cdot\frac{\tfrac12\,\text{Molekül}\ \mathrm{O_2}}{1\,\text{Molekül}\ \mathrm{H_2}}\\ &\cdot\frac{32{,}0\,\mathrm{u}}{1\,\text{Molekül}\ \mathrm{O_2}}\cdot\frac{1{,}66\times 10^{-27}\,\mathrm{kg}}{1\,\mathrm{u}}\cdot\frac{1000\,\mathrm{g}}{1\,\mathrm{kg}}\end{aligned}`}</MD>
              <p>Zwischenergebnisse: <M>{t`6{,}02\times 10^{23}`}</M> Moleküle <C>H2</C> und <M>{t`3{,}01\times 10^{23}`}</M> Moleküle <C p=".">O2</C> <b>Antwort: <M p="">{t`16{,}0\,\mathrm{g}`}</M> <C p=".">O2</C></b></p>
              <p>Randnotizen der Folie: A. Die Antwort ist nicht 1,0 g <C p=",">O2</C> denn 2 Moleküle <C>H2</C> reagieren mit 1 Molekül <C p=",">O2</C> und verschiedene Moleküle haben verschiedene Massen. B. Dieser Weg ist mühsam: Gibt es einen einfacheren?</p>
            </>}
            en={<>
              <p><b>Question:</b> how many grams of <C>O2</C> can react with 2.00 g of <C p="?">H2</C> Reaction: <C p=".">2 H2 + O2 -&gt; 2 H2O</C> Formula weights: <M>{t`\mathrm{FW(H_2)} = 2\cdot(1.00\,\mathrm{u}) = 2.00\,\mathrm{u}`}</M> and <M p=".">{t`\mathrm{FW(O_2)} = 2\cdot(16.0\,\mathrm{u}) = 32.0\,\mathrm{u}`}</M></p>
              <p><b>Strategy:</b> convert units: grams <C>H2</C> → u <C>H2</C> → molecules <C>H2</C> → molecules <C>O2</C> → u <C>O2</C> → grams <C p=".">O2</C></p>
              <MD>{t`\begin{aligned} 2\,\mathrm{g}\cdot\frac{1\,\mathrm{kg}}{1000\,\mathrm{g}}\cdot\frac{1\,\mathrm{u}}{1.66\times 10^{-27}\,\mathrm{kg}}\cdot\frac{1\,\text{molecule}\ \mathrm{H_2}}{2.00\,\mathrm{u}}\cdot\frac{\tfrac12\,\text{molecule}\ \mathrm{O_2}}{1\,\text{molecule}\ \mathrm{H_2}}\\ &\cdot\frac{32.0\,\mathrm{u}}{1\,\text{molecule}\ \mathrm{O_2}}\cdot\frac{1.66\times 10^{-27}\,\mathrm{kg}}{1\,\mathrm{u}}\cdot\frac{1000\,\mathrm{g}}{1\,\mathrm{kg}}\end{aligned}`}</MD>
              <p>Intermediate results: <M>{t`6.02\times 10^{23}`}</M> molecules <C>H2</C> and <M>{t`3.01\times 10^{23}`}</M> molecules <C p=".">O2</C> <b>Answer: <M>{t`16.0\,\mathrm{g}`}</M> <C p=".">O2</C></b></p>
              <p>Side notes on the slide: A. The answer is not 1.0 g <C p=",">O2</C> because 2 molecules of <C>H2</C> react with 1 molecule of <C p=",">O2</C> and different molecules have different masses. B. This process is tedious: is there an easier way?</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die lange Zeile:</b></p>
            <ol>
              <li>Man startet mit <M p=".">{t`2\,\mathrm{g}`}</M> Jeder Bruch ist ein Umrechnungsfaktor gleich 1, wie im Joghurt-Beispiel.</li>
              <li>Die ersten beiden Brüche führen von Gramm über Kilogramm zu atomaren Masseneinheiten (<M p=").">{t`1\,\mathrm{u} = 1{,}66\times 10^{-27}\,\mathrm{kg}`}</M> Das sind etwa <M>{t`1{,}2\times 10^{24}\,\mathrm{u}`}</M></li>
              <li>Teilt man durch die Masse eines Moleküls (<M p=")">{t`2{,}00\,\mathrm{u}`}</M> kommt die <em>Anzahl</em> Moleküle heraus: <M p=".">{t`6{,}02\times 10^{23}`}</M></li>
              <li>Der vierte Bruch kommt aus der Gleichung: 2 Moleküle <C>H2</C> brauchen 1 Molekül <C p=",">O2</C> also braucht 1 Molekül <C>H2</C> ein halbes <C p=".">O2</C></li>
              <li>Zurück: Molekülzahl mal <M p=",">{t`32{,}0\,\mathrm{u}`}</M> dann über Kilogramm in Gramm.</li>
            </ol>
            <p>Die Lehre B der Folie ist richtig: Die Zahl <M>{t`6{,}02\times 10^{23}`}</M> taucht auf, und die Faktoren <M>{t`1{,}66\times 10^{-27}`}</M> heben sich am Ende genau wieder weg. Ein besserer Weg lässt diese Zwischenschritte weg. Dafür dient das Mol.</p>
          </>}
          en={<>
            <p><b>How to read the long line:</b></p>
            <ol>
              <li>You start with <M p=".">{t`2\,\mathrm{g}`}</M> Every fraction is a conversion factor equal to 1, as in the yogurt example.</li>
              <li>The first two fractions lead from grams via kilograms to atomic mass units (<M p=").">{t`1\,\mathrm{u} = 1.66\times 10^{-27}\,\mathrm{kg}`}</M> That is about <M>{t`1.2\times 10^{24}\,\mathrm{u}`}</M></li>
              <li>Dividing by the mass of one molecule (<M p=")">{t`2.00\,\mathrm{u}`}</M> gives the <em>number</em> of molecules: <M p=".">{t`6.02\times 10^{23}`}</M></li>
              <li>The fourth fraction comes from the equation: 2 molecules of <C>H2</C> need 1 molecule of <C p=",">O2</C> so 1 molecule of <C>H2</C> needs half an <C p=".">O2</C></li>
              <li>Back: number of molecules times <M p=",">{t`32.0\,\mathrm{u}`}</M> then via kilograms to grams.</li>
            </ol>
            <p>Lesson B of the slide is right: the number <M>{t`6.02\times 10^{23}`}</M> appears, and the factors <M>{t`1.66\times 10^{-27}`}</M> cancel again at the end. A better way skips these intermediate steps. This is what the mole is for.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="mol" title={<T de="6. Das Mol" en="6. The mole" />}>
        <T
          de={<p>Die Idee der Vorlesung: Man legt eine <em>feste, grosse Anzahl</em> Teilchen fest und gibt für jeden Stoff an, wie viel diese Anzahl wiegt. So wie «ein Dutzend» immer 12 Stück sind, egal ob Eier oder Schrauben, aber ein Dutzend Eier wiegt mehr als ein Dutzend Büroklammern.</p>}
          en={<p>The lecture’s idea: fix a <em>definite, large number</em> of particles and say for every substance how much this number weighs. Just as “a dozen” is always 12 pieces, whether eggs or screws, but a dozen eggs weighs more than a dozen paper clips.</p>}
        />
        <Box kind="lecture" src={<Src lec={1} p="30" />} title={<T de={<>Das Mol (<En>The Magnificent Mole</En>)</>} en="The magnificent mole" />}>
          <T
            de={<>
              <MD>{t`6{,}022140857\times 10^{23} \equiv N_\mathrm{A} \equiv \text{Avogadro-Zahl}`}</MD>
              <p>Warum diese Zahl? Der Bequemlichkeit halber. Sie ist so festgelegt, dass das Atomgewicht eines Elements <b>in Gramm</b> genau <M>{t`N_\mathrm{A}`}</M> Atome enthält. Beispiel Kalium (<C>K</C>, Ordnungszahl 19, Atomgewicht 39,0983): Ein Atom hat die Masse <M p=",">{t`39{,}0983\,\mathrm{u}`}</M> also enthalten <M>{t`39{,}0983\,\mathrm{g}`}</M> Kalium <M>{t`N_\mathrm{A}`}</M> Atome. Das nennt man <b>1 Mol</b> (<En>mole</En>, Abkürzung <M p=")">{t`\mathrm{mol}`}</M> Kalium. Auch das Molekulargewicht einer Molekülsorte in Gramm enthält <M>{t`N_\mathrm{A}`}</M> solche Moleküle. Das Formelgewicht liefert so die <b>molare Masse</b> (<En>molar mass</En>) in <M p="">{t`\mathrm{g/mol}`}</M> – <em>nützlich!</em> Man rechnet damit leicht zwischen Anzahl und Masse um.</p>
              <p>Randnotizen: Das Mol ist eine riesige Menge, schwer vorstellbar. <M>{t`N_\mathrm{A}`}</M> Murmeln würden die Erde mit einer 5 km dicken Schicht bedecken. Man kann ein Mol von allem haben: Es ist eine festgelegte Anzahl wie ein Dutzend (12), ein Gros (<M p=")">{t`12\cdot 12 = 144`}</M> oder ein Mol (<M p=").">{t`6{,}02\times 10^{23}`}</M></p>
            </>}
            en={<>
              <MD>{t`6.022140857\times 10^{23} \equiv N_\mathrm{A} \equiv \text{Avogadro’s number}`}</MD>
              <p>Why this number? For convenience. It is defined such that the atomic weight of any element <b>in grams</b> contains exactly <M>{t`N_\mathrm{A}`}</M> atoms. Example potassium (<C>K</C>, atomic number 19, atomic weight 39.0983): one atom has mass <M p=",">{t`39.0983\,\mathrm{u}`}</M> so <M>{t`39.0983\,\mathrm{g}`}</M> of potassium contain <M>{t`N_\mathrm{A}`}</M> atoms. This is called <b>1 mole</b> (abbreviation <M p=")">{t`\mathrm{mol}`}</M> of potassium. Also the molecular weight of any molecule in grams contains <M>{t`N_\mathrm{A}`}</M> such molecules. The formula weight then gives the <b>molar mass</b> in <M p="">{t`\mathrm{g/mol}`}</M> – <em>useful!</em> It lets you convert easily between number and mass.</p>
              <p>Side notes: the mole is a huge quantity, hard to imagine. <M>{t`N_\mathrm{A}`}</M> marbles would cover the Earth with a layer 5 km thick. You can have a mole of anything: it is a defined number like a dozen (12), a gross (<M p=")">{t`12\cdot 12 = 144`}</M> or a mole (<M p=").">{t`6.02\times 10^{23}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Ein <C>K</C>-Atom wiegt <M p=".">{t`39{,}1\,\mathrm{u}`}</M> Es ist <M p=",">{t`1\,\mathrm{u} = 1{,}66\times 10^{-24}\,\mathrm{g}`}</M> also wiegt ein Atom <M p=".">{t`6{,}5\times 10^{-23}\,\mathrm{g}`}</M></li>
              <li>Davon braucht man <M>{t`N_\mathrm{A}`}</M> Stück: <M p=".">{t`6{,}022\times 10^{23}\cdot 6{,}5\times 10^{-23}\,\mathrm{g} \approx 39\,\mathrm{g}`}</M> Die kleine und die grosse Zahl heben sich gerade auf. Das ist <em>kein Zufall</em>: Das Mol ist so gewählt, dass <M p=".">{t`N_\mathrm{A}\cdot 1\,\mathrm{u} = 1\,\mathrm{g}`}</M></li>
              <li>Darum steht im Periodensystem eine Zahl, die zwei Dinge zugleich bedeutet: «u pro Atom» und «g pro mol».</li>
              <li>Die Einheit der molaren Masse ist <M p=",">{t`\mathrm{g/mol}`}</M> die der Stoffmenge <M p=".">{t`\mathrm{mol}`}</M> Dazwischen gilt <M p=",">{t`n = m/M`}</M> also Masse durch molare Masse.</li>
            </ol>
            <p><b>Warum ist die Stoffmenge so nützlich?</b> Die Gleichung sagt «2 : 1 : 2» für Moleküle. Weil 1 mol von jedem Stoff gleich viele Teilchen enthält, sagt dieselbe Gleichung auch «2 mol : 1 mol : 2 mol». Mol ist das Zählmass, Gramm das Wiegemass, und die molare Masse ist der Umrechnungsfaktor dazwischen.</p>
            <p>Im Bild rechnest du zwischen Gramm, Mol und Teilchen um. Die Balken unten zeigen: Ein Mol jedes Stoffes hat gleich viele Teilchen, aber sehr verschiedene Masse.</p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>One <C>K</C> atom weighs <M p=".">{t`39.1\,\mathrm{u}`}</M> With <M>{t`1\,\mathrm{u} = 1.66\times 10^{-24}\,\mathrm{g}`}</M> one atom weighs <M p=".">{t`6.5\times 10^{-23}\,\mathrm{g}`}</M></li>
              <li>You need <M>{t`N_\mathrm{A}`}</M> of them: <M p=".">{t`6.022\times 10^{23}\cdot 6.5\times 10^{-23}\,\mathrm{g} \approx 39\,\mathrm{g}`}</M> The small and the large number just cancel. This is <em>no accident</em>: the mole is chosen so that <M p=".">{t`N_\mathrm{A}\cdot 1\,\mathrm{u} = 1\,\mathrm{g}`}</M></li>
              <li>That is why the periodic table has one number that means two things at once: “u per atom” and “g per mol”.</li>
              <li>The unit of the molar mass is <M p=",">{t`\mathrm{g/mol}`}</M> that of the amount of substance <M p=".">{t`\mathrm{mol}`}</M> In between, <M p=",">{t`n = m/M`}</M> i.e. mass divided by molar mass.</li>
            </ol>
            <p><b>Why is the amount of substance so useful?</b> The equation says “2 : 1 : 2” for molecules. Because 1 mol of every substance contains the same number of particles, the same equation also says “2 mol : 1 mol : 2 mol”. The mole is the counting measure, the gram the weighing measure, and the molar mass is the conversion factor in between.</p>
            <p>In the figure you convert between grams, moles and particles. The bars at the bottom show: one mole of each substance has the same number of particles, but very different mass.</p>
          </>}
        />
        <MoleConverter />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="zurueck" title={<T de="7. Zurück zur Stöchiometrie" en="7. Back to stoichiometry" />}>
        <Box kind="lecture" src={<Src lec={1} p="31" />} title={<T de="Von der Gleichung zu den Gramm" en="From the equation to the grams" />}>
          <T
            de={<>
              <p>Dieselbe Gleichung kann man auf drei Ebenen lesen:</p>
              <table className="ch-table"><tbody>
                <tr><th>{'Gleichung'}</th><td><C p="">2 H2(g) + O2(g) -&gt; 2 H2O(l)</C></td></tr>
                <tr><th>Moleküle</th><td>2 Moleküle <C>H2</C>, 1 Molekül <C>O2</C>, 2 Moleküle <C>H2O</C></td></tr>
                <tr><th>Mol</th><td>2 mol <C>H2</C>, 1 mol <C>O2</C>, 2 mol <C>H2O</C></td></tr>
                <tr><th>Gramm</th><td><M>{t`4{,}0\,\mathrm{g}`}</M> <C>H2</C>, <M>{t`32{,}0\,\mathrm{g}`}</M> <C>O2</C>, <M>{t`36{,}0\,\mathrm{g}`}</M> <C>H2O</C></td></tr>
              </tbody></table>
              <p>Die Umrechnung «Mol in Gramm» geschieht mit den molaren Massen, die man aus dem Formelgewicht erhält. Randnotiz: Die Zustände (fest <M p=",">s</M> flüssig <M p=",">l</M> gasförmig <M p=")">g</M> sind nun mit angegeben. Und: Die Masse bleibt erhalten, wie es das Gesetz der Massenerhaltung verlangt.</p>
            </>}
            en={<>
              <p>The same equation can be read on three levels:</p>
              <table className="ch-table"><tbody>
                <tr><th>Equation</th><td><C p="">2 H2(g) + O2(g) -&gt; 2 H2O(l)</C></td></tr>
                <tr><th>Molecules</th><td>2 molecules <C>H2</C>, 1 molecule <C>O2</C>, 2 molecules <C>H2O</C></td></tr>
                <tr><th>Moles</th><td>2 mol <C>H2</C>, 1 mol <C>O2</C>, 2 mol <C>H2O</C></td></tr>
                <tr><th>Grams</th><td><M>{t`4.0\,\mathrm{g}`}</M> <C>H2</C>, <M>{t`32.0\,\mathrm{g}`}</M> <C>O2</C>, <M>{t`36.0\,\mathrm{g}`}</M> <C>H2O</C></td></tr>
              </tbody></table>
              <p>Converting “moles to grams” uses the molar masses, which come from the formula weight. Side note: the states (solid <M p=",">s</M> liquid <M p=",">l</M> gas <M p=")">g</M> are now specified. And: mass is conserved, as the law of conservation of mass demands.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Tabelle:</b> Von links nach rechts steigt man ab. Die Gleichung zählt Moleküle (2 : 1 : 2). Multipliziert man jede Zahl mit <M p=",">{t`N_\mathrm{A}`}</M> hat man dasselbe Verhältnis in Mol. Multipliziert man die Mol mit der molaren Masse, hat man Gramm: <M p=",">{t`2\cdot 2{,}0 = 4{,}0`}</M> <M p=",">{t`1\cdot 32{,}0 = 32{,}0`}</M> <M p=".">{t`2\cdot 18{,}0 = 36{,}0`}</M> Und es gilt <M p=".">{t`4{,}0 + 32{,}0 = 36{,}0`}</M> Das Verhältnis der Gramm ist <em>nicht</em> 2 : 1 : 2, sondern 4 : 32 : 36.</p>
            <p>Im Bild schiebst du die Zahl der Reaktionseinheiten von 1 (zwei <C>H2</C>-Moleküle, ein <C>O2</C>) bis zu einem Mol. Die Zahlen werden riesig, die Verhältnisse bleiben. Beim letzten Schritt stehen (gerundet) die Zahlen der Folie da: 4,0 g, 32,0 g und 36,0 g.</p>
          </>}
          en={<>
            <p><b>How to read the table:</b> From top to bottom you step down. The equation counts molecules (2 : 1 : 2). Multiplying every number by <M>{t`N_\mathrm{A}`}</M> gives the same ratio in moles. Multiplying the moles by the molar mass gives grams: <M p=",">{t`2\cdot 2.0 = 4.0`}</M> <M p=",">{t`1\cdot 32.0 = 32.0`}</M> <M p=".">{t`2\cdot 18.0 = 36.0`}</M> And <M p=".">{t`4.0 + 32.0 = 36.0`}</M> The ratio of the grams is <em>not</em> 2 : 1 : 2 but 4 : 32 : 36.</p>
            <p>In the figure you move the number of reaction units from 1 (two <C>H2</C> molecules, one <C>O2</C>) up to one mole. The numbers become huge, the ratios stay. At the last position the numbers of the slide appear (rounded): 4.0 g, 32.0 g and 36.0 g.</p>
          </>}
        />
        <ScaleTable />
        <T
          de={<p>Jetzt der kurze Weg für die Beispielaufgabe. Er braucht nur drei Rechnungen und kein <M>{t`1{,}66\times 10^{-27}`}</M> mehr. Die Zahlen sind die der Folie (Atomgewichte <M>{t`1{,}00`}</M> und <M p=").">{t`16{,}0`}</M></p>}
          en={<p>Now the short way for the sample problem. It needs only three calculations and no <M>{t`1.66\times 10^{-27}`}</M> any more. The numbers are those of the slide (atomic weights <M>{t`1.00`}</M> and <M p=").">{t`16.0`}</M></p>}
        />
        <StepPlayer
          label="Wie viel O2 für 2 g H2"
          steps={[
            { ms: 1500, holdMs: 2800, caption: <T de={<>Gegeben sind <M p=",">{t`2{,}00\,\mathrm{g}`}</M> <C>H2</C> gesucht sind Gramm <C p=".">O2</C></>} en={<>Given: <M p=",">{t`2.00\,\mathrm{g}`}</M> <C>H2</C> wanted: grams of <C p=".">O2</C></>} /> },
            { ms: 2500, holdMs: 3500, caption: <T de={<>Gramm in Mol: durch die molare Masse teilen. <M p=".">{t`n(\mathrm{H_2}) = 2{,}00\,\mathrm{g}\,/\,2{,}00\,\mathrm{g/mol} = 1{,}00\,\mathrm{mol}`}</M></>} en={<>Grams to moles: divide by the molar mass. <M p=".">{t`n(\mathrm{H_2}) = 2.00\,\mathrm{g}\,/\,2.00\,\mathrm{g/mol} = 1.00\,\mathrm{mol}`}</M></>} /> },
            { ms: 2800, holdMs: 4000, caption: <T de={<>Die Gleichung sagt: 2 mol <C>H2</C> brauchen 1 mol <C p=".">O2</C> Im Bild zwei <C>H2</C> und ein <C p=",">O2</C> also das Verhältnis <M p=".">{t`1/2`}</M> Es folgt <M p=".">{t`n(\mathrm{O_2}) = \tfrac12\cdot 1{,}00\,\mathrm{mol} = 0{,}500\,\mathrm{mol}`}</M></>} en={<>The equation says: 2 mol of <C>H2</C> need 1 mol of <C p=".">O2</C> In the picture two <C>H2</C> and one <C p=",">O2</C> so the ratio is <M p=".">{t`1/2`}</M> It follows <M p=".">{t`n(\mathrm{O_2}) = \tfrac12\cdot 1.00\,\mathrm{mol} = 0.500\,\mathrm{mol}`}</M></>} /> },
            { ms: 2500, holdMs: 2500, caption: <T de={<>Mol in Gramm: mal die molare Masse. <M p=".">{t`m(\mathrm{O_2}) = 0{,}500\,\mathrm{mol}\cdot 32{,}0\,\mathrm{g/mol} = 16{,}0\,\mathrm{g}`}</M> Dasselbe Ergebnis wie auf dem langen Weg.</>} en={<>Moles to grams: times the molar mass. <M p=".">{t`m(\mathrm{O_2}) = 0.500\,\mathrm{mol}\cdot 32.0\,\mathrm{g/mol} = 16.0\,\mathrm{g}`}</M> The same result as the long way.</>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={sampleScene} step={step} t={tt} />}
        </StepPlayer>
        <Box kind="supplement" title={<T de="Wo bleibt das «Limiting Reagent»?" en="What about the limiting reagent?" />}>
          <T
            de={<p>Diese Lektion rechnet immer so, dass von einem Stoff genau die Menge «passend» vorhanden ist. Reicht von einem Edukt weniger, bestimmt dieses, wie viel Produkt entsteht (<En>limiting reagent</En>). Das steht nicht auf den Folien der ersten Vorlesung und wird hier nicht behandelt.</p>}
            en={<p>This lesson always computes as if exactly the “fitting” amount of one substance is present. If less of one reactant is available, it decides how much product forms (limiting reagent). This is not on the slides of the first lecture and is not treated here.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«2 g Wasserstoff brauchen 1 g Sauerstoff»" en="“2 g of hydrogen need 1 g of oxygen”" />}>
        <T
          de={<p>Die Koeffizienten zählen <em>Moleküle</em> (oder Mol), nicht Gramm. 2 Moleküle <C>H2</C> brauchen ein Molekül <C p=",">O2</C> aber ein <C>O2</C>-Molekül ist sechzehnmal schwerer als ein <C p=".">H2</C> Darum die Antwort <M p="">{t`16\,\mathrm{g}`}</M> und nicht <M p=".">{t`1\,\mathrm{g}`}</M> (Lehre A der Folie).</p>}
          en={<p>The coefficients count <em>molecules</em> (or moles), not grams. 2 molecules of <C>H2</C> need one molecule of <C p=",">O2</C> but one <C>O2</C> molecule is sixteen times heavier than one <C p=".">H2</C> So the answer is <M>{t`16\,\mathrm{g}`}</M> and not <M p=".">{t`1\,\mathrm{g}`}</M> (lesson A on the slide).</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Zum Ausgleichen ändere ich die Indizes»" en="“To balance, I change the subscripts”" />}>
        <T
          de={<p>Nein. Der Index gehört zur Formel des Stoffes: <C>H2O</C> ist Wasser, <C>H2O2</C> ist Wasserstoffperoxid, ein anderer Stoff. Ausgleichen darf nur die Koeffizienten davor ändern, denn sie sagen bloss, <em>wie viele</em> Moleküle es sind.</p>}
          en={<p>No. The subscript is part of the formula of the substance: <C>H2O</C> is water, <C>H2O2</C> is hydrogen peroxide, a different substance. Balancing may only change the coefficients in front, because they only say <em>how many</em> molecules there are.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«1 mol ist immer gleich schwer»" en="“1 mol always has the same mass”" />}>
        <T
          de={<p>Ein Mol hat immer die gleiche <em>Anzahl</em> Teilchen, aber je nach Stoff eine andere <em>Masse</em>: <M>{t`2\,\mathrm{g}`}</M> bei <C p=",">H2</C> <M>{t`18\,\mathrm{g}`}</M> bei <C p=",">H2O</C> <M>{t`58{,}4\,\mathrm{g}`}</M> bei <C p=".">NaCl</C> Das zeigen die Balken im Bild. Gleich schwer wären gleich viele <em>Gramm</em>, nicht gleich viele Mol.</p>}
          en={<p>A mole always has the same <em>number</em> of particles, but depending on the substance a different <em>mass</em>: <M>{t`2\,\mathrm{g}`}</M> for <C p=",">H2</C> <M>{t`18\,\mathrm{g}`}</M> for <C p=",">H2O</C> <M>{t`58.4\,\mathrm{g}`}</M> for <C p=".">NaCl</C> The bars in the figure show it. Equal weight would mean equal <em>grams</em>, not equal moles.</p>}
        />
      </Box>

      <Box kind="key" title={<T de="Merke" en="Key points" />}>
        <T
          de={<ul>
            <li>Eine Gleichung ist ausgeglichen, wenn jede Atomsorte links und rechts gleich oft vorkommt. Man ändert nur Koeffizienten.</li>
            <li>Einheiten kürzen sich wie Zahlen: Man multipliziert mit Brüchen gleich 1.</li>
            <li>Das Formelgewicht ist die Summe der Atomgewichte (in u). Die molare Masse ist dieselbe Zahl in <M p=".">{t`\mathrm{g/mol}`}</M></li>
            <li>1 mol sind <M>{t`N_\mathrm{A} = 6{,}022\times 10^{23}`}</M> Teilchen. Es gilt <M p=".">{t`n = m/M`}</M></li>
            <li>Rezept für Aufgaben: Gramm <M>{t`\to`}</M> Mol (durch <M p=")">M</M> Mol <M>{t`\to`}</M> Mol (Verhältnis der Koeffizienten), Mol <M>{t`\to`}</M> Gramm (mal <M p=").">M</M></li>
          </ul>}
          en={<ul>
            <li>An equation is balanced when every kind of atom occurs equally often on the left and on the right. Only coefficients are changed.</li>
            <li>Units cancel like numbers: you multiply by fractions equal to 1.</li>
            <li>The formula weight is the sum of the atomic weights (in u). The molar mass is the same number in <M p=".">{t`\mathrm{g/mol}`}</M></li>
            <li>1 mol is <M>{t`N_\mathrm{A} = 6.022\times 10^{23}`}</M> particles. We have <M p=".">{t`n = m/M`}</M></li>
            <li>Recipe for problems: grams <M>{t`\to`}</M> moles (divide by <M p=")">M</M> moles <M>{t`\to`}</M> moles (ratio of the coefficients), moles <M>{t`\to`}</M> grams (times <M p=").">M</M></li>
          </ul>}
        />
      </Box>
    </article>
  );
}
