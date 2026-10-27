import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { EnergyDiagramFigure } from '../viz/chem/EnergyDiagramFigure';
import { FirstLawFigure } from '../viz/chem/FirstLawFigure';
import { StateFunctionFigure } from '../viz/chem/StateFunctionFigure';
import { SystemTypesFigure } from '../viz/chem/SystemTypesFigure';

const t = String.raw;

export default function CH4Energie() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wenn Wasserstoff verbrennt, wird es warm, und manchmal bewegt sich ein Kolben. Wie viel Wärme ist das, wie viel Arbeit, und wie rechnet man das aus? Dafür braucht man zuerst eine saubere Buchführung für Energie. Genau die liefert der 1. Hauptsatz der Thermodynamik: <M p=".">{t`\Delta E = q + w`}</M></p>}
        en={<p className="lede">When hydrogen burns, things get warm, and sometimes a piston moves. How much heat is that, how much work, and how do we calculate it? First we need clean bookkeeping for energy. That is what the 1st law of thermodynamics gives us: <M p=".">{t`\Delta E = q + w`}</M></p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir ein Bankkonto vor. Du kennst den Kontostand nicht «an sich», aber du siehst jede Einzahlung und jede Abhebung. Wie viel sich geändert hat, ist die Summe der Buchungen. Das System ist das Konto, Wärme <M>q</M> und Arbeit <M>w</M> sind die zwei Arten von Buchungen, und <M>{t`\Delta E`}</M> ist die Änderung des Kontostands.</p>}
          en={<p>Think of a bank account. You do not know the balance «as such», but you see every deposit and every withdrawal. The change is the sum of the bookings. The system is the account, heat <M>q</M> and work <M>w</M> are the two kinds of bookings, and <M>{t`\Delta E`}</M> is the change of the balance.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="system" title={<T de="1. Was die Thermodynamik untersucht – und was «das System» ist" en="1. What thermodynamics studies – and what «the system» is" />}>
        <Box kind="lecture" src={<Src lec={4} p="6–9" />} title={<T de="Thermodynamik, Energie, Systemtypen" en="Thermodynamics, energy, system types" />}>
          <T
            de={<ul>
              <li>Thermodynamik: Studium der Energie und ihrer Umwandlungen. Sie verbindet Wärme, Arbeit und chemische Reaktionen.</li>
              <li>Heute: <b>Thermochemie</b> – wie chemische Reaktionen Wärme erzeugen oder aufnehmen. (Am Rand: ein Schlüsselthema für Maschinenbau- und Verfahrensingenieure.)</li>
              <li>Zwei Energieformen: <b>kinetische Energie</b> (Bewegung) und <b>potenzielle Energie</b> (gespeicherte Energie, in der Chemie z. B. in Bindungen).</li>
              <li>1. Hauptsatz: Energie kann in andere Formen umgewandelt, aber nicht erzeugt oder vernichtet werden.</li>
              <li><b>System</b> = Ausgangsstoffe und Produkte; <b>Umgebung</b> (<i>surroundings</i>) = alles andere.</li>
              <li><b>Offen</b> (<i>open</i>): Materie und Energie können mit der Umgebung ausgetauscht werden (Beispiel: kochender Topf). <b>Geschlossen</b> (<i>closed</i>): nur Energie (Beispiel: Kolben mit <C>H2</C>-Verbrennung). <b>Isoliert</b> (<i>isolated</i>): weder Materie noch Energie (Beispiel: versiegelte, thermisch isolierte Flasche).</li>
            </ul>}
            en={<ul>
              <li>Thermodynamics: the study of energy and its transformations. It relates heat, work and chemical reactions.</li>
              <li>Today: <b>thermochemistry</b> – how chemical reactions produce or absorb heat. (In the margin: a key topic for mechanical and process engineers.)</li>
              <li>Two types of energy: <b>kinetic energy</b> (motion) and <b>potential energy</b> (stored energy, in chemistry e.g. in bonds).</li>
              <li>1st law: energy can be converted between different types, but it cannot be created or destroyed.</li>
              <li><b>System</b> = reactants and products; <b>surroundings</b> = everything else.</li>
              <li><b>Open</b>: matter and energy can be exchanged with the surroundings (example: boiling pot). <b>Closed</b>: energy only (example: piston with <C>H2</C> combustion). <b>Isolated</b>: neither matter nor energy (example: sealed, thermally insulated flask).</li>
            </ul>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> «System» ist der Teil der Welt, den wir gerade betrachten: das Gas im Zylinder, der Inhalt des Topfes. Alles ausserhalb der gedachten Grenze ist die Umgebung. Die Grenze entscheidet, was hindurch darf. Probiere die drei Typen aus – die Pfeile zeigen, was die Grenze kreuzt.</p>}
          en={<p><b>How to read this:</b> the «system» is the part of the world we look at right now: the gas in the cylinder, the content of the pot. Everything outside the imagined boundary is the surroundings. The boundary decides what may pass. Try the three types – the arrows show what crosses the boundary.</p>}
        />
        <SystemTypesFigure />
        <T
          de={<p>Im Kolben-Beispiel (geschlossen) gibt es zwei Wege, Energie auszutauschen: Wärme durch die Wand und Arbeit am Kolben. Diese beiden Wege sind der Kern dieser Lektion.</p>}
          en={<p>In the piston example (closed) there are two ways to exchange energy: heat through the wall and work on the piston. These two ways are the core of this lesson.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="innere-energie" title={<T de="2. Innere Energie und ihre Änderung" en="2. Internal energy and its change" />}>
        <Box kind="lecture" src={<Src lec={4} p="10–11" />} title={<T de={<>Innere Energie <M>E</M></>} en={<>Internal energy <M>E</M></>} />}>
          <T
            de={<>
              <p><b>Innere Energie</b> (<i>internal energy</i>) <M p=":">E</M> gesamte kinetische plus potenzielle Energie im System. Den tatsächlichen Wert von <M>E</M> kennt man typischerweise nicht. Stattdessen interessiert man sich für Änderungen:</p>
              <MD>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial}`}</MD>
              <p>«Nachher minus vorher»: nachdem «etwas» mit dem System passiert ist, meist eine chemische Reaktion. Das Vorzeichen ist wichtig: <M>{t`\Delta E > 0`}</M> heisst, das System hat Energie gewonnen (aus der Umgebung); <M>{t`\Delta E < 0`}</M> heisst, es hat Energie verloren (an die Umgebung). Bei einer Reaktion gilt <M>{t`E_\mathrm{final}`}</M> für die Produkte und <M>{t`E_\mathrm{initial}`}</M> für die Ausgangsstoffe.</p>
              <p>Energiediagramm: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(l)'}</C></span> gibt Energie an die Umgebung ab, also <M p=".">{t`\Delta E < 0`}</M></p>
            </>}
            en={<>
              <p><b>Internal energy</b> <M p=":">E</M> total kinetic plus potential energy in the system. Typically we do not know the actual value of <M p=".">E</M> Instead we focus on changes:</p>
              <MD>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial}`}</MD>
              <p>«After minus before»: after «something» happened to the system, usually a chemical reaction. The sign is important: <M>{t`\Delta E > 0`}</M> means the system has gained energy (from the surroundings); <M>{t`\Delta E < 0`}</M> means it has lost energy (to the surroundings). For a chemical reaction, <M>{t`E_\mathrm{final}`}</M> belongs to the products and <M>{t`E_\mathrm{initial}`}</M> to the reactants.</p>
              <p>Energy diagram: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(l)'}</C></span> releases energy to the surroundings, so <M p=".">{t`\Delta E < 0`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> Das tiefgestellte «initial» heisst «am Anfang», «final» heisst «am Ende». Die Zeile <M>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial}`}</M> ist nichts anderes als «Kontostand nachher minus Kontostand vorher». Im Diagramm liegt die höhere Energie weiter oben; der Pfeil von oben nach unten ist darum ein Verlust. Wechsle die Richtung und beobachte das Vorzeichen.</p>}
          en={<p><b>How to read this:</b> the subscript «initial» means «at the start», «final» means «at the end». The line <M>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial}`}</M> is just «balance after minus balance before». In the diagram higher energy is higher up; an arrow from top to bottom is therefore a loss. Switch the direction and watch the sign.</p>}
        />
        <EnergyDiagramFigure />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="erster-hauptsatz" title={<T de={<>3. Der 1. Hauptsatz: <M>{t`\Delta E = q + w`}</M></>} en={<>3. The 1st law: <M>{t`\Delta E = q + w`}</M></>} />}>
        <Box kind="lecture" src={<Src lec={4} p="12–13" />} title={<T de="Der 1. Hauptsatz erneut, Vorzeichenkonvention" en="1st law revisited, sign convention" />}>
          <T
            de={<>
              <p>Weil Energie nicht erzeugt oder vernichtet werden kann, muss sie irgendwohin gehen:</p>
              <MD>{t`\Delta E = q + w`}</MD>
              <p><M>q</M> ist die Wärme, die dem System zugeführt wird (<i>heat added to system</i>); <M>w</M> ist die Arbeit, die am System verrichtet wird (<i>work done on system</i>). Zur Erinnerung: <M>{t`w = F\cdot d`}</M> – Arbeit ist eine Kraft über eine Strecke. Wer einen Kolben schiebt, leistet also Arbeit.</p>
              <p><b>Vorzeichenkonvention</b> (das Pluszeichen bedeutet: <M>E</M> des Systems hat zugenommen): <M>{t`q > 0`}</M> Wärme wird dem System zugeführt; <M>{t`q < 0`}</M> Wärme wird dem System entzogen; <M>{t`w > 0`}</M> Arbeit wird am System verrichtet; <M>{t`w < 0`}</M> Arbeit wird vom System verrichtet. Am Rand: unglücklicherweise ist dies nicht die einzige Konvention (siehe Thermodynamik im 3. Semester, D-MAVT); in diesem Kurs gilt die von Brown.</p>
              <p>Folie 13 zeigt einen Tresor mit «innerer Energie»: Pfeile hinein (<M p=",">{t`q > 0`}</M> <M p=")">{t`w > 0`}</M> legen Energie ein, <M p=";">{t`\Delta E > 0`}</M> Pfeile heraus (<M p=",">{t`q < 0`}</M> <M p=")">{t`w < 0`}</M> heben Energie ab, <M p=".">{t`\Delta E < 0`}</M></p>
            </>}
            en={<>
              <p>As energy cannot be created or destroyed, it must go somewhere:</p>
              <MD>{t`\Delta E = q + w`}</MD>
              <p><M>q</M> is the heat added to the system; <M>w</M> is the work done on the system. Recall <M>{t`w = F\cdot d`}</M> – work is a force applied over a distance. So pushing a piston does work.</p>
              <p><b>Sign convention</b> (the plus sign means: <M>E</M> of the system has increased): <M>{t`q > 0`}</M> heat added to the system; <M>{t`q < 0`}</M> heat removed from the system; <M>{t`w > 0`}</M> work done on the system; <M>{t`w < 0`}</M> work done by the system. In the margin: unfortunately this is not the only convention (see 3rd-semester thermodynamics, D-MAVT); in this course the convention of Brown is used.</p>
              <p>Slide 13 shows a safe containing «internal energy»: arrows going in (<M p=",">{t`q > 0`}</M> <M p=")">{t`w > 0`}</M> deposit energy, <M p=";">{t`\Delta E > 0`}</M> arrows going out (<M p=",">{t`q < 0`}</M> <M p=")">{t`w < 0`}</M> withdraw energy, <M p=".">{t`\Delta E < 0`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Zuerst die Frage: Was hat das System <em>bekommen</em>? Wärme und Arbeit, die hineinfliessen, zählen plus.</li>
              <li>Was es <em>abgegeben</em> hat, zählt minus. Ein Gas, das den Kolben hinausschiebt, gibt Arbeit ab: <M p=".">{t`w < 0`}</M></li>
              <li>Beides zusammenzählen gibt <M p=".">{t`\Delta E`}</M> Alles wird dabei aus der Sicht des Systems gezählt.</li>
            </ol>
            <p>Im Bild unten stellst du <M>q</M> und <M>w</M> selbst ein. Die Teilchen sind das System: bekommt es Energie, werden sie schneller. Rechts steht die Buchführung von Anfang zu Ende. Die Voreinstellungen sind die Folien und die Aufgabe 1 der Übung.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>First ask: what did the system <em>receive</em>? Heat and work that flow in count plus.</li>
              <li>What it <em>gave away</em> counts minus. A gas that pushes the piston out gives away work: <M p=".">{t`w < 0`}</M></li>
              <li>Adding both gives <M p=".">{t`\Delta E`}</M> Everything is counted from the point of view of the system.</li>
            </ol>
            <p>In the figure below you set <M>q</M> and <M>w</M> yourself. The particles are the system: if it receives energy they get faster. On the right is the ledger from start to end. The presets are the slides and exercise 1 of the exercise class.</p>
          </>}
        />
        <FirstLawFigure />
        <Box kind="uebung" src={<Src ex={4} p="4" />} title={<T de="Aufgabe 1 mit Lösung" en="Exercise 1 with solution" />}>
          <T
            de={<>
              <p>Drei geschlossene Kästen (Voreinstellungen oben, «Übung 1»). Die Pfeile zeigen <M>q</M> und <M p=";">w</M> ihre Länge ist ihr Betrag. In (i) fliesst Wärme hinaus und Arbeit hinein (Arbeit grösser); in (ii) nur Arbeit hinein; in (iii) Wärme hinein und Arbeit hinaus, beide gleich lang.</p>
              <ul>
                <li>a) Endotherm (<M p=")?">{t`q > 0`}</M> Nur (iii).</li>
                <li>b) Exotherm (<M p=")?">{t`q < 0`}</M> Nur (i).</li>
                <li>c) <M p="?">{t`\Delta E > 0`}</M> (i) und (ii): dort ist <M>w</M> grösser als der Wärmeverlust.</li>
                <li>d) <M p="?">{t`\Delta E < 0`}</M> Keiner.</li>
                <li>e) <M p="?">{t`\Delta E = 0`}</M> (iii): <M p=".">{t`q + w = 0`}</M></li>
              </ul>
            </>}
            en={<>
              <p>Three closed boxes (presets above, «Exercise 1»). The arrows show <M>q</M> and <M p=";">w</M> their length is their magnitude. In (i) heat flows out and work flows in (work larger); in (ii) only work flows in; in (iii) heat in and work out, both equally long.</p>
              <ul>
                <li>a) Endothermic (<M p=")?">{t`q > 0`}</M> Only (iii).</li>
                <li>b) Exothermic (<M p=")?">{t`q < 0`}</M> Only (i).</li>
                <li>c) <M p="?">{t`\Delta E > 0`}</M> (i) and (ii): there <M>w</M> is larger than the heat lost.</li>
                <li>d) <M p="?">{t`\Delta E < 0`}</M> None.</li>
                <li>e) <M p="?">{t`\Delta E = 0`}</M> (iii): <M p=".">{t`q + w = 0`}</M></li>
              </ul>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={4} p="14" />} title={<T de="Endotherm und exotherm" en="Endothermic and exothermic" />}>
          <T
            de={<ul>
              <li><b>Endotherm</b>: <M p=",">{t`q > 0`}</M> Wärme wird vom System aufgenommen. Beispiel: schmelzendes Eis.</li>
              <li><b>Exotherm</b>: <M p=",">{t`q < 0`}</M> Wärme wird vom System abgegeben. Beispiel: Verbrennung von <C>H2</C>.</li>
            </ul>}
            en={<ul>
              <li><b>Endothermic</b>: <M p=",">{t`q > 0`}</M> heat is absorbed by the system. Example: ice melting.</li>
              <li><b>Exothermic</b>: <M p=",">{t`q < 0`}</M> heat is released by the system. Example: <C>H2</C> combustion.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="keep">Merkhilfe: «endo» heisst «nach innen», «exo» heisst «nach aussen». Das Wort bezieht sich auf die Wärme, die das System aufnimmt oder abgibt. Aus Sicht der Umgebung ist es umgekehrt: Wo ein Eiswürfel Wärme aufnimmt, wird die Hand kälter.</p>}
          en={<p className="keep">Memory aid: «endo» means «inward», «exo» means «outward». The word refers to the heat the system takes in or gives out. From the point of view of the surroundings it is the other way round: where an ice cube absorbs heat, the hand gets colder.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="zustandsfunktion" title={<T de="4. Zustandsfunktion: der Weg ist egal" en="4. State function: the path does not matter" />}>
        <Box kind="lecture" src={<Src lec={4} p="14–15" />} title={<T de={<><M>E</M> ist eine Zustandsfunktion</>} en={<><M>E</M> is a state function</>} />}>
          <T
            de={<>
              <p>Die innere Energie <M>E</M> ist eine <b>Zustandsfunktion</b> (<i>state function</i>): Ihr Wert hängt nur vom jetzigen «Zustand» des Systems ab, <em>nicht</em> vom Weg dorthin. Der Zustand ist durch Bedingungen wie <M p=",">P</M> <M p=",">V</M> … festgelegt. <M>E</M> hängt auch von der Stoffmenge ab: <M>E</M> ist eine <i>extensive</i> Grösse.</p>
              <p><M>{t`\Delta E`}</M> hängt also nur vom Anfangs- und Endzustand ab; wie wir dorthin gekommen sind, ist egal. Dagegen sind <M>q</M> und <M>w</M> keine Zustandsfunktionen: <b>der Weg zählt!</b></p>
              <p>Beispiel: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(l)'}</C></span> – zwei Mol Wasserstoff verbrennen. Methode 1: im Brenner, der alles als Wärme liefert: <M p=".">{t`\Delta E = q`}</M> Methode 2: im Kolben, der Arbeit plus Wärme liefert: <M p=".">{t`\Delta E = q + w`}</M> <M>{t`\Delta E`}</M> ist gleich, aber <M>q</M> und <M>w</M> hängen von der Methode ab. (Und die Frage am Ende der Folie: Welche weiteren Zustandsfunktionen gibt es?)</p>
            </>}
            en={<>
              <p>The internal energy <M>E</M> is a <b>state function</b>: its value depends only on the current «state» of the system, <em>not</em> on the path taken to get there. The state is specified by conditions such as <M p=",">P</M> <M p=",">V</M> … <M>E</M> also depends on the quantity of matter: <M>E</M> is an <i>extensive</i> property.</p>
              <p>So <M>{t`\Delta E`}</M> depends only on the initial and final state; how we got there does not matter. In contrast <M>q</M> and <M>w</M> are not state functions: <b>the path matters!</b></p>
              <p>Example: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(l)'}</C></span> – combust two moles of hydrogen. Method 1: in a burner that produces all heat: <M p=".">{t`\Delta E = q`}</M> Method 2: in a piston that produces work plus heat: <M p=".">{t`\Delta E = q + w`}</M> <M>{t`\Delta E`}</M> is the same, but <M>q</M> and <M>w</M> depend on the method. (And the question at the end of the slide: which other state functions can we consider?)</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Stell dir einen Berg vor. Die Höhe über dem Meer ist eine Zustandsfunktion: Wenn du von Zermatt zum Gornergrat gehst, hängt der Höhenunterschied nicht davon ab, welchen Weg du nimmst. Wie lange du gelaufen bist und wie viel du geschwitzt hast, hängt dagegen sehr wohl vom Weg ab. Die Höhe ist <M p=",">E</M> der Höhenunterschied ist <M p=",">{t`\Delta E`}</M> und die Mühe des Weges sind <M>q</M> und <M p=".">w</M></p>
            <p>Unten siehst du das mit den Zahlen der Wasserstoff-Verbrennung (die Zahlen sind eine Ergänzung, sie stehen nicht auf der Folie). Methode 1 liefert alles als Wärme. Methode 2 lässt den Kolben Arbeit leisten; mit dem Regler wählst du, wie viel. Die grauen Balken <M>{t`\Delta E`}</M> sind immer gleich hoch.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b> picture a mountain. The height above sea level is a state function: if you walk from Zermatt to the Gornergrat, the height difference does not depend on the path you take. How long you walked and how much you sweated do depend on the path. The height is <M p=",">E</M> the height difference is <M p=",">{t`\Delta E`}</M> and the effort of the way is <M>q</M> and <M p=".">w</M></p>
            <p>Below you see this with the numbers of hydrogen combustion (the numbers are a supplement, they are not on the slide). Method 1 delivers everything as heat. Method 2 lets the piston do work; with the slider you choose how much. The grey bars <M>{t`\Delta E`}</M> are always equally tall.</p>
          </>}
        />
        <StateFunctionFigure />
        <Box kind="supplement" title={<T de="Woher die Zahlen kommen" en="Where the numbers come from" />}>
          <T
            de={<p>Für zwei Mol Wasserstoff gilt später (Lektion «Enthalpie») <M p=".">{t`\Delta H = -571{,}6\,\mathrm{kJ}`}</M> Verbrennt das Gas in einem starren Gefäss, ist <M>{t`w = 0`}</M> und die ganze Energie kommt als Wärme heraus. Verbrennt es in einem Kolben, der gegen die Luft von aussen arbeitet, schrumpft das Volumen (aus drei Mol Gas werden null, das Wasser ist flüssig), die Luft drückt den Kolben hinein und leistet <M>{t`w = +7{,}4\,\mathrm{kJ}`}</M> am System. Beide Wege enden bei <M p=".">{t`\Delta E = -564{,}2\,\mathrm{kJ}`}</M></p>}
            en={<p>For two moles of hydrogen we will find later (lesson «Enthalpy») <M p=".">{t`\Delta H = -571.6\,\mathrm{kJ}`}</M> If the gas burns in a rigid vessel, <M>{t`w = 0`}</M> and all the energy comes out as heat. If it burns in a piston working against the outside air, the volume shrinks (three moles of gas become zero, the water is liquid), the air pushes the piston in and does <M>{t`w = +7.4\,\mathrm{kJ}`}</M> on the system. Both paths end at <M p=".">{t`\Delta E = -564.2\,\mathrm{kJ}`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Im System steckt eine bestimmte Menge Wärme»" en="«The system contains a certain amount of heat»" />}>
        <T
          de={<p>Wärme <M>q</M> ist keine Eigenschaft des Systems, sondern Energie <em>auf dem Weg</em> von einem Körper zum anderen. Ein Körper hat innere Energie <M p=",">E</M> aber nicht «Wärme». Darum ist <M>q</M> keine Zustandsfunktion, und darum zählt der Weg.</p>}
          en={<p>Heat <M>q</M> is not a property of the system but energy <em>on its way</em> from one body to another. A body has internal energy <M p=",">E</M> but not «heat». That is why <M>q</M> is not a state function, and why the path matters.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>{t`w > 0`}</M> heisst, das System leistet Arbeit»</>} en={<>«<M>{t`w > 0`}</M> means the system does work»</>} />}>
        <T
          de={<p>In diesem Kurs ist es umgekehrt: <M>{t`w > 0`}</M> heisst, dass <em>am</em> System Arbeit verrichtet wird (das System bekommt Energie). Leistet das System Arbeit, ist <M p=".">{t`w < 0`}</M> In anderen Büchern und Kursen ist die Konvention anders (Folie 12, Rand) – achte immer darauf, welche gilt.</p>}
          en={<p>In this course it is the other way round: <M>{t`w > 0`}</M> means that work is done <em>on</em> the system (the system receives energy). If the system does work, <M p=".">{t`w < 0`}</M> In other books and courses the convention differs (slide 12, margin) – always check which one applies.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>{t`\Delta E < 0`}</M> heisst, Energie ist verschwunden»</>} en={<>«<M>{t`\Delta E < 0`}</M> means energy has vanished»</>} />}>
        <T
          de={<p>Nein, die Energie des <em>Systems</em> hat abgenommen; die der Umgebung hat um genau so viel zugenommen. Die Summe bleibt gleich. Das ist der 1. Hauptsatz: Energie geht nur woandershin.</p>}
          en={<p>No, the energy of the <em>system</em> has decreased; that of the surroundings has increased by exactly the same amount. The sum stays the same. That is the 1st law: energy only goes somewhere else.</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>System und Umgebung; offen, geschlossen, isoliert – je nachdem, was die Grenze passieren darf.</li>
            <li>Von <M>E</M> kennt man nur die Änderung: <M p=".">{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial}`}</M></li>
            <li>1. Hauptsatz: <M p=",">{t`\Delta E = q + w`}</M> mit <M p=",">q</M> <M>w</M> positiv, wenn sie dem System <em>zugeführt</em> werden.</li>
            <li>Endotherm: <M p=";">{t`q > 0`}</M> exotherm: <M p=".">{t`q < 0`}</M></li>
            <li><M>E</M> ist eine Zustandsfunktion; <M>q</M> und <M>w</M> sind es nicht. <M>{t`\Delta E`}</M> ist wegunabhängig, die Aufteilung in <M>q</M> und <M>w</M> nicht.</li>
          </ul>}
          en={<ul>
            <li>System and surroundings; open, closed, isolated – depending on what may cross the boundary.</li>
            <li>Of <M>E</M> we only know the change: <M p=".">{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial}`}</M></li>
            <li>1st law: <M p=",">{t`\Delta E = q + w`}</M> with <M p=",">q</M> <M>w</M> positive when they are <em>added</em> to the system.</li>
            <li>Endothermic: <M p=";">{t`q > 0`}</M> exothermic: <M p=".">{t`q < 0`}</M></li>
            <li><M>E</M> is a state function; <M>q</M> and <M>w</M> are not. <M>{t`\Delta E`}</M> is path-independent, the split into <M>q</M> and <M>w</M> is not.</li>
          </ul>}
        />
      </Box>
      <T de={<p className="th-note">Weiter geht es mit der <a href="#ch-enthalpie">Enthalpie</a>: einer zweiten Zustandsfunktion, die genau die Wärme bei konstantem Druck misst.</p>} en={<p className="th-note">Next: <a href="#ch-enthalpie">enthalpy</a> – a second state function that measures exactly the heat at constant pressure.</p>} />
    </article>
  );
}
