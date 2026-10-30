import { Box, Section, Src } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { BornHaberFigure, CoulombFigure, LewisSymbols, NaClFig } from '../viz/chem/BondFigures';

const t = String.raw;

export default function CH7Bindung() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Warum hält Kochsalz zusammen, warum besteht Wasser aus Molekülen? In beiden Fällen halten Bindungen die Atome zusammen, und an jeder Bindung sind nur die äussersten Elektronen beteiligt. Diese Lektion zählt sie mit Lewis-Symbolen, erklärt die Oktettregel und rechnet aus, wie stark die Ionenbindung in NaCl ist.</p>}
        en={<p className="lede">Why does table salt hold together, why is water made of molecules? In both cases bonds hold the atoms together, and only the outermost electrons take part in a bond. This lesson counts them with Lewis symbols, explains the octet rule and works out how strong the ionic bond in NaCl is.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Zwei Kinder und ein Ball. Entweder schenkt das eine Kind den Ball ganz her: Danach hat eines etwas zu viel, das andere etwas zu wenig, und beide bleiben beisammen, weil sie sich anziehen (Ionenbindung). Oder beide halten den Ball gemeinsam fest: Er gehört beiden, und der gemeinsame Ball hält sie zusammen (kovalente Bindung). Der Ball ist ein Valenzelektron.</p>}
          en={<p>Two children and a ball. Either one child gives the ball away completely: afterwards one has a bit too much, the other a bit too little, and both stay together because they attract each other (ionic bond). Or both hold the ball together: it belongs to both, and the shared ball keeps them together (covalent bond). The ball is a valence electron.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="bindungsarten" title={<T de="1. Drei Arten von Bindung" en="1. Three kinds of bond" />}>
        <Box kind="lecture" src={<Src lec={7} p="5" />} title={<T de="Grundlagen der chemischen Bindung" en="Basics of chemical bonding" />}>
          <T
            de={<>
              <p>«Atome oder Ionen werden in Molekülen und Festkörpern durch <b>Bindungen</b> zusammengehalten.» Wie beschreiben wir sie? «Bindungen betreffen die Valenzelektronen» – typischerweise die Elektronen der äussersten Schale.</p>
              <ul>
                <li><b>Ionisch:</b> Ionen, zusammengehalten durch elektrostatische Anziehung. Bsp. <C p=",">Na^+Cl^-</C> ein Ionenkristall.</li>
                <li><b>Kovalent:</b> Atome, zusammengehalten durch geteilte Valenzelektronen. Bsp. <C p=",">H2O</C> Moleküle.</li>
                <li><b>Metallisch:</b> Valenzelektronen werden mit dem ganzen Festkörper geteilt. Bsp. <C p=",">Ag(s)</C> Metalle.</li>
              </ul>
            </>}
            en={<>
              <p>“Atoms or ions are held together in molecules and solids by <b>bonds</b>.” How do we describe them? “Bonds involve valence electrons” – typically, electrons in the outermost shell.</p>
              <ul>
                <li><b>Ionic:</b> ions held together by electrostatic attraction. Ex: <C p=",">Na^+Cl^-</C> an ionic solid.</li>
                <li><b>Covalent:</b> atoms held together by shared valence electrons. Ex: <C p=",">H2O</C> molecules.</li>
                <li><b>Metallic:</b> valence electrons shared with the entire solid. Ex: <C p=",">Ag(s)</C> metallic solids.</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Die drei Arten unterscheiden sich darin, <b>wo die Valenzelektronen sind</b>: ganz bei einem Partner (ionisch), zwischen zwei Partnern (kovalent) oder frei im ganzen Stück Metall (metallisch). Wer die Elektronen bekommt, entscheidet, wie stark ein Atom an ihnen zieht; das kommt in der nächsten Lektion als Elektronegativität.</p>}
          en={<p className="keep">The three kinds differ in <b>where the valence electrons are</b>: entirely with one partner (ionic), between two partners (covalent), or free in the whole piece of metal (metallic). Who gets the electrons depends on how strongly an atom pulls on them; that comes in the next lesson as electronegativity.</p>}
        />
        <Box kind="uebung" src={<Src ex={7} p="8" />} title={<T de="Metallbindung" en="Metallic bonds" />}>
          <T
            de={<>
              <p>«Zwei Metalle binden, wir gehen nicht ins Detail.»</p>
              <ul>
                <li>Die Valenzelektronen werden mit dem ganzen Festkörper geteilt.</li>
                <li>Positive Atomrümpfe, umgeben von einer negativ geladenen Elektronenwolke («Meer beweglicher Valenzelektronen»).</li>
                <li>Metallen fehlen Valenzelektronen, darum bilden sie keine kovalenten Bindungen.</li>
                <li>Die frei bewegliche Elektronenwolke ist der Grund für die hohe Wärme- und elektrische Leitfähigkeit.</li>
              </ul>
            </>}
            en={<>
              <p>“Two metals bond, we won't go into detail.”</p>
              <ul>
                <li>Valence electrons shared with the entire solid.</li>
                <li>Positive cores surrounded by a negatively charged electron cloud (“sea of mobile valence electrons”).</li>
                <li>Metals have a deficit of valence electrons and therefore do not form covalent bonds.</li>
                <li>The freely movable electron cloud is the cause of the high thermal and electrical conductivity.</li>
              </ul>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="lewis-symbole" title={<T de="2. Valenzelektronen und Lewis-Symbole" en="2. Valence electrons and Lewis symbols" />}>
        <Box kind="lecture" src={<Src lec={7} p="6" />} title={<T de="Lewis-Symbole" en="Lewis symbols" />}>
          <T
            de={<>
              <p>Handschriftlich: «Um über Bindungen zu sprechen, führen wir zuerst ein einfaches Werkzeug ein …» <b>Für jedes Atom: das Elementsymbol und die Valenzelektronen als Punkte zeichnen.</b></p>
              <p>Bsp. Schwefel: <M>{t`[\mathrm{Ne}]\,3s^2 3p^4`}</M> <M>\Rightarrow</M> 6 Valenzelektronen, zwei Zeichnungen (handschriftlich: «beide sind richtig»).</p>
              <p><b>Regeln:</b> höchstens 2 Punkte auf jeder der 4 Seiten; die vorhandenen Valenzelektronen verteilen; oben, unten, links und rechts sind gleichwertig.</p>
              <p>Weitere Beispiele: Li (<M p=")">{t`2s^1`}</M> bis Ne (<M p=")">{t`2s^2 2p^6`}</M> mit ihren Lewis-Symbolen.</p>
            </>}
            en={<>
              <p>Handwritten: “To discuss bonding, we first introduce a simple tool …” <b>For each atom: draw the atomic symbol plus the valence electrons (as “dots”).</b></p>
              <p>Ex: sulfur <M>{t`[\mathrm{Ne}]\,3s^2 3p^4`}</M> <M>\Rightarrow</M> 6 valence electrons, drawn two ways (handwritten: “both are correct”).</p>
              <p><b>Rules:</b> place 2 dots maximum on each of 4 sides; spread out the valence electrons available; top, bottom, left and right sides of the symbol are all equivalent.</p>
              <p>Other examples: Li (<M p=")">{t`2s^1`}</M> to Ne (<M p=")">{t`2s^2 2p^6`}</M> with their Lewis symbols.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b></p>
            <ol className="keep">
              <li>Aus der Elektronenkonfiguration (Woche 6) nimmt man nur die äusserste Schale. Bei Schwefel ist das die dritte: <M p=",">{t`3s^2 3p^4`}</M> also <M>{t`2 + 4 = 6`}</M> Valenzelektronen. Die zehn Elektronen des Neon-Rumpfs <M>{t`[\mathrm{Ne}]`}</M> zählen nicht.</li>
              <li>Jedes Valenzelektron wird ein Punkt. Zuerst bekommt jede Seite einen Punkt, erst ab dem fünften Elektron entstehen Paare. Ein Paar zweier Punkte heisst später «freies Elektronenpaar», wenn es nicht an einer Bindung beteiligt ist.</li>
              <li>Ein einzelner Punkt ist ein ungepaartes Elektron: Dort kann das Atom eine Bindung eingehen.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b></p>
            <ol className="keep">
              <li>From the electron configuration (week 6) you take only the outermost shell. For sulfur that is the third: <M p=",">{t`3s^2 3p^4`}</M> so <M>{t`2 + 4 = 6`}</M> valence electrons. The ten electrons of the neon core <M>{t`[\mathrm{Ne}]`}</M> do not count.</li>
              <li>Every valence electron becomes a dot. First each side gets one dot; pairs only form from the fifth electron on. A pair of dots is later called a “lone pair” if it does not take part in a bond.</li>
              <li>A single dot is an unpaired electron: there the atom can form a bond.</li>
            </ol>
          </>}
        />
        <LewisSymbols />
        <Box kind="uebung" src={<Src ex={7} p="2" />} title={<T de="Valenzelektronen zählen" en="Counting valence electrons" />}>
          <T
            de={<p>«Valenzelektronen: die Elektronen in der äussersten Schale, sie nehmen an der Bindung teil.» Kohlenstoff, <M p=":">{t`1s^2 2s^2 2p^2`}</M> Die Schale 2 hat 4 Elektronen, also 4 Valenzelektronen. «Trick: Die Zahl der Valenzelektronen der blauen und roten Elemente (s- und p-Block) ist gleich der Spaltennummer 1 bis 8 (ausser He).» «Um Valenzelektronen in d- und f-Orbitalen kümmern wir uns nicht.»</p>}
            en={<p>“Valence electrons: the electrons in the outermost shell, they participate in the bonding.” Carbon, <M p=":">{t`1s^2 2s^2 2p^2`}</M> shell 2 has 4 electrons, so 4 valence electrons. “Trick: the number of valence electrons of the blue and red elements (s and p block) is equal to the column index 1 to 8 (excluding He).” “We do not bother about valence electrons in the d and f orbitals.”</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="oktett" title={<T de="3. Die Oktettregel" en="3. The octet rule" />}>
        <Box kind="lecture" src={<Src lec={7} p="7" />} title={<T de="Oktettregel" en="Octet rule" />}>
          <T
            de={<>
              <p><b>Atome neigen dazu, Elektronen aufzunehmen, abzugeben oder zu teilen, bis sie von 8 Valenzelektronen umgeben sind.</b></p>
              <p>Warum 8? Weil sie dann die stabile Edelgaskonfiguration haben (Neon: <M p=").">{t`2s^2 2p^6`}</M></p>
              <p>Achtung: Es gibt Ausnahmen zur Oktettregel. Trotzdem eine sehr nützliche Idee, um Bindungen zu verstehen. Am nützlichsten für Atome mit Valenzelektronen in s- und p-Unterschalen (nicht in d und f).</p>
            </>}
            en={<>
              <p><b>Atoms tend to gain, lose, or share electrons until surrounded by 8 valence electrons.</b></p>
              <p>Why 8? Because then they have the stable “noble gas” configuration (neon: <M p=").">{t`2s^2 2p^6`}</M></p>
              <p>Note: exceptions exist to the octet rule. Still a very useful idea to understand bonding. Most useful for atoms with valence electrons in s and p subshells (rather than d and f).</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Eine volle äussere Schale besteht aus einer s-Unterschale (2 Elektronen) und einer p-Unterschale (6 Elektronen): zusammen 8. Darum die Zahl 8. Wasserstoff und Helium haben nur die erste Schale, die schon mit 2 Elektronen voll ist; für sie gilt die «Duettregel» (Übung 7, S. 4). Es gibt drei Wege zur vollen Schale: abgeben (Natrium wird <M p=")">{t`\mathrm{Na}^+`}</M> aufnehmen (Chlor wird <M p=")">{t`\mathrm{Cl}^-`}</M> oder teilen (zwei Chloratome bilden <C p=").">Cl2</C></p>}
          en={<p className="keep">A full outer shell consists of an s subshell (2 electrons) and a p subshell (6 electrons): 8 together. Hence the number 8. Hydrogen and helium only have the first shell, which is already full with 2 electrons; for them the “duet rule” holds (exercise class 7, p. 4). There are three ways to a full shell: give away (sodium becomes <M p=")">{t`\mathrm{Na}^+`}</M> take up (chlorine becomes <M p=")">{t`\mathrm{Cl}^-`}</M> or share (two chlorine atoms form <C p=").">Cl2</C></p>}
        />
        <Box kind="misconception" title={<T de="«Atome wollen acht Elektronen»" en="“Atoms want eight electrons”" />}>
          <T
            de={<p>Atome wollen nichts. Die Oktettregel ist eine Faustregel, die beschreibt, welche Verbindungen tief in der Energie liegen. Sie hat Ausnahmen (Bor in <C p=",">BF3</C> Phosphor in <C p=",">PF5</C> siehe <a href="#ch-lewis">Lewis-Strukturen</a>), und Natrium gibt sein Elektron nicht freiwillig ab: Das kostet sogar Energie (Abschnitt 5).</p>}
            en={<p>Atoms do not want anything. The octet rule is a rule of thumb describing which compounds are low in energy. It has exceptions (boron in <C p=",">BF3</C> phosphorus in <C p=",">PF5</C> see <a href="#ch-lewis">Lewis structures</a>), and sodium does not give up its electron voluntarily: that even costs energy (section 5).</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="ionenbindung" title={<T de="4. Die Ionenbindung" en="4. The ionic bond" />}>
        <Box kind="lecture" src={<Src lec={7} p="8" />} title={<T de="Ionenbindung" en="Ionic bonding" />}>
          <T
            de={<>
              <p>Metallatome geben Valenzelektronen ab, Nichtmetallatome nehmen Valenzelektronen auf – um die Oktettregel zu erfüllen.</p>
              <CD>{'Na· + ·Cl -> Na^+ + [Cl]^- -> Na^+Cl^-(s)'}</CD>
              <p>Randnotiz: «Dabei geht Na zu [Ne], Cl zu [Ar].»</p>
              <p><b>Die Ionenbindung ist stark!</b> Wegen der elektrostatischen Anziehung der Ionen: «Entgegengesetzte Ladungen ziehen sich an! Das senkt die Energie, wenn sie sich nähern.» Randnotiz: <M p=";">{t`E_\mathrm{el} = \frac{1}{4\pi\varepsilon_0}\frac{Q_1 Q_2}{d}`}</M> «Ionen wollen nahe beieinander sein (kleines <M p=")">d</M> um ihre Energie zu senken.»</p>
              <p>Die Stärke misst die <b>Gitterenergie</b>: «die Energie, die nötig ist, um die Ionen unendlich weit voneinander zu trennen». Bsp.:</p>
              <MD>{t`\mathrm{Na^+Cl^-}(s) \xrightarrow{\ \Delta H_\mathrm{lat}\ } \mathrm{Na^+}(g) + \mathrm{Cl^-}(g), \qquad \Delta H_\mathrm{lat} = +788\ \mathrm{kJ/mol}`}</MD>
              <p>Handschriftlich: «Die Rückreaktion, NaCl(s) aus <C>Na^+</C> und <C>Cl^-</C> bilden, ist stark exotherm <M p=".">{t`\Rightarrow -\Delta H_\mathrm{lat}`}</M>» Frage: «Wie können wir die Gitterenergie berechnen?»</p>
            </>}
            en={<>
              <p>Metal atoms lose valence electrons, non-metal atoms gain valence electrons – to satisfy the octet rule.</p>
              <CD>{'Na· + ·Cl -> Na^+ + [Cl]^- -> Na^+Cl^-(s)'}</CD>
              <p>Margin: “In this process: Na goes to [Ne], Cl goes to [Ar].”</p>
              <p><b>Ionic bonding is strong!</b> Due to the electrostatic attraction of ions: “Opposite charges attract! This lowers energy as they approach.” Margin: <M p=";">{t`E_\mathrm{el} = \frac{1}{4\pi\varepsilon_0}\frac{Q_1 Q_2}{d}`}</M> “Ions want to be close together (i.e., small <M p=")">d</M> to lower their energy.”</p>
              <p>Strength quantified by the <b>lattice energy</b>: “energy required to separate ions to infinite distance”. Ex:</p>
              <MD>{t`\mathrm{Na^+Cl^-}(s) \xrightarrow{\ \Delta H_\mathrm{lat}\ } \mathrm{Na^+}(g) + \mathrm{Cl^-}(g), \qquad \Delta H_\mathrm{lat} = +788\ \mathrm{kJ/mol}`}</MD>
              <p>Handwritten: “The reverse reaction, forming NaCl(s) from <C>Na^+</C> and <C p=",">Cl^-</C> is highly exothermic <M p=".">{t`\Rightarrow -\Delta H_\mathrm{lat}`}</M>” Question: “How can we calculate the lattice energy?”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Die Animation spielt die Zeile der Folie nach. Natrium hat ein einzelnes Valenzelektron, Chlor sieben. Das eine Elektron springt hinüber: Natrium hat jetzt die Konfiguration von Neon, Chlor die von Argon. Dabei ändert sich auch die Grösse: Das Kation schrumpft, das Anion wächst (Woche 6, Ionenradien). Erst die Anziehung von Plus und Minus macht daraus eine feste Bindung, und viele solche Paare stapeln sich zum Kristall.</p>}
          en={<p className="keep">The animation replays the line of the slide. Sodium has a single valence electron, chlorine seven. The one electron jumps across: sodium now has the configuration of neon, chlorine that of argon. The size changes as well: the cation shrinks, the anion grows (week 6, ionic radii). Only the attraction of plus and minus makes this a firm bond, and many such pairs stack up into a crystal.</p>}
        />
        <StepPlayer
          label={tr('Animation: Natrium gibt ein Elektron an Chlor ab', 'Animation: sodium gives an electron to chlorine')}
          steps={[
            { ms: 600, holdMs: 2600, caption: <T de={<>Ein Natriumatom mit einem Valenzelektron, ein Chloratom mit sieben (drei Paare und ein einzelnes).</>} en={<>A sodium atom with one valence electron, a chlorine atom with seven (three pairs and a single one).</>} /> },
            { ms: 1600, holdMs: 2800, caption: <T de={<>Das Elektron (gelb) springt von Natrium zu Chlor und füllt dort den freien Platz zum vierten Paar.</>} en={<>The electron (yellow) jumps from sodium to chlorine and fills the free place there to make the fourth pair.</>} /> },
            { ms: 1400, holdMs: 3000, caption: <T de={<>Jetzt sind es Ionen: <M>{t`\mathrm{Na}^+`}</M> mit der Konfiguration von Neon, kleiner; <M>{t`\mathrm{Cl}^-`}</M> mit der von Argon, grösser.</>} en={<>Now they are ions: <M>{t`\mathrm{Na}^+`}</M> with the configuration of neon, smaller; <M>{t`\mathrm{Cl}^-`}</M> with that of argon, larger.</>} /> },
            { ms: 1500, holdMs: 2800, caption: <T de={<>Plus und Minus ziehen sich an und rücken zusammen. Je näher, desto tiefer die Energie.</>} en={<>Plus and minus attract and move together. The closer, the lower the energy.</>} /> },
            { ms: 1400, holdMs: 3000, caption: <T de={<>Viele Ionen ordnen sich abwechselnd an: der Kristall <C p=".">Na^+Cl^-(s)</C> Es gibt keine einzelnen NaCl-Moleküle.</>} en={<>Many ions arrange themselves alternately: the crystal <C p=".">Na^+Cl^-(s)</C> There are no single NaCl molecules.</>} /> },
          ]}
        >
          {(step, tt) => <NaClFig step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p className="keep"><b>Was macht die Bindung stark?</b> Die Randnotiz der Folie gibt die Antwort: Die Energie zweier Ladungen ist proportional zu <M p=".">{t`Q_1 Q_2 / d`}</M> Doppelte Ladungen geben die vierfache Anziehung, kleinere Ionen kommen näher zusammen und ziehen stärker. Die Übung fasst es so: «Die Gitterenergie ist gross für kurze Bindungen und höhere Ladungen.» Im Bild vergleichst du vier Salze.</p>}
          en={<p className="keep"><b>What makes the bond strong?</b> The margin note of the slide gives the answer: the energy of two charges is proportional to <M p=".">{t`Q_1 Q_2 / d`}</M> Double charges give four times the attraction, smaller ions get closer together and attract more strongly. The exercise class puts it like this: “It is large for short bonds and higher charges.” In the figure you compare four salts.</p>}
        />
        <CoulombFigure />
        <Box kind="misconception" title={<T de="«Kochsalz besteht aus NaCl-Molekülen»" en="“Table salt is made of NaCl molecules”" />}>
          <T
            de={<p>Im Kristall hat jedes <M>{t`\mathrm{Na}^+`}</M> sechs <M>{t`\mathrm{Cl}^-`}</M> als nächste Nachbarn und umgekehrt. Kein Chlorid gehört zu einem bestimmten Natrium. Die Formel <C>NaCl</C> gibt nur das Verhältnis 1 : 1 an.</p>}
            en={<p>In the crystal every <M>{t`\mathrm{Na}^+`}</M> has six <M>{t`\mathrm{Cl}^-`}</M> as nearest neighbours and vice versa. No chloride belongs to a particular sodium. The formula <C>NaCl</C> only gives the ratio 1 : 1.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="born-haber" title={<T de="5. Die Gitterenergie berechnen" en="5. Calculating the lattice energy" />}>
        <Box kind="lecture" src={<Src lec={7} p="9" />} title={<T de="Berechnung der Gitterenergie" en="Calculating the lattice energy" />}>
          <T
            de={<>
              <p>Handschriftlich: «Wir können <M>{t`\Delta H_\mathrm{lat}`}</M> berechnen, indem wir viele Ideen zusammensetzen, die wir gelernt haben! <M>\Rightarrow</M> Satz von Hess, <M p=",">{t`\Delta H^\circ_f`}</M> Ionisierungsenergie und Elektronenaffinität (EA).»</p>
              <p>Diagramm (Energie nach oben): <C>NaCl(s)</C> <M>{t`\xrightarrow{-\Delta H^\circ_f[\mathrm{NaCl}(s)]}`}</M> <C>Na(s) + 1/2 Cl2(g)</C> <M>{t`\xrightarrow{\Delta H^\circ_f[\mathrm{Na}(g)]}`}</M> <C>Na(g) + 1/2 Cl2(g)</C> <M>{t`\xrightarrow{\Delta H^\circ_f[\mathrm{Cl}(g)]}`}</M> <C>Na(g) + Cl(g)</C> <M>{t`\xrightarrow{I_1(\mathrm{Na})}`}</M> <C>Na^+(g) + e^- + Cl(g)</C> <M>{t`\xrightarrow{EA(\mathrm{Cl})}`}</M> <C p=".">Na^+(g) + Cl^-(g)</C> Ein roter Pfeil «Gitterenergie von NaCl» führt direkt von <C>NaCl(s)</C> nach oben: <M p=".">{t`\Delta H_\mathrm{lat} = +788\ \mathrm{kJ/mol}`}</M></p>
              <p>«Details: Brown, S. 376.» (Die Zahlen der einzelnen Schritte stehen nicht auf der Folie.)</p>
            </>}
            en={<>
              <p>Handwritten: “We can calculate <M>{t`\Delta H_\mathrm{lat}`}</M> by putting many ideas that we have learned together! <M>\Rightarrow</M> Hess's law, <M p=",">{t`\Delta H^\circ_f`}</M> ionization energy, and electron affinity (EA).”</p>
              <p>Diagram (energy upwards): <C>NaCl(s)</C> <M>{t`\xrightarrow{-\Delta H^\circ_f[\mathrm{NaCl}(s)]}`}</M> <C>Na(s) + 1/2 Cl2(g)</C> <M>{t`\xrightarrow{\Delta H^\circ_f[\mathrm{Na}(g)]}`}</M> <C>Na(g) + 1/2 Cl2(g)</C> <M>{t`\xrightarrow{\Delta H^\circ_f[\mathrm{Cl}(g)]}`}</M> <C>Na(g) + Cl(g)</C> <M>{t`\xrightarrow{I_1(\mathrm{Na})}`}</M> <C>Na^+(g) + e^- + Cl(g)</C> <M>{t`\xrightarrow{EA(\mathrm{Cl})}`}</M> <C p=".">Na^+(g) + Cl^-(g)</C> A red arrow “lattice energy of NaCl” leads directly upwards from <C p=":">NaCl(s)</C> <M p=".">{t`\Delta H_\mathrm{lat} = +788\ \mathrm{kJ/mol}`}</M></p>
              <p>“See p. 376 of Brown for details.” (The numbers of the individual steps are not on the slide.)</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das Diagramm.</b> Die Gitterenergie kann man nicht direkt messen. Darum geht man einen Umweg, dessen Schritte alle gemessen sind. Weil die Enthalpie eine Zustandsfunktion ist (Satz von Hess, Woche 4), ist die Summe der Umweg-Pfeile gleich dem direkten Pfeil.</p>
            <ol className="keep">
              <li>NaCl zurück in die Elemente zerlegen: das Gegenteil der Bildung, also <M p=".">{t`-\Delta H^\circ_f`}</M></li>
              <li>Festes Natrium verdampfen und ein halbes Mol <C>Cl2</C> in Atome spalten: zwei Bildungsenthalpien von Gasatomen.</li>
              <li>Natrium das Elektron wegnehmen: <M p=".">{t`I_1`}</M> Chlor gibt es auf: <M p=",">EA</M> negativ, weil Energie frei wird.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the diagram.</b> The lattice energy cannot be measured directly. So one takes a detour whose steps have all been measured. Because enthalpy is a state function (Hess's law, week 4), the sum of the detour arrows equals the direct arrow.</p>
            <ol className="keep">
              <li>Take NaCl back apart into the elements: the reverse of formation, so <M p=".">{t`-\Delta H^\circ_f`}</M></li>
              <li>Vaporise solid sodium and split half a mole of <C>Cl2</C> into atoms: two enthalpies of formation of gaseous atoms.</li>
              <li>Take the electron away from sodium: <M p=".">{t`I_1`}</M> Chlorine takes it up: <M p=",">EA</M> negative, because energy is released.</li>
            </ol>
          </>}
        />
        <BornHaberFigure />
        <Box kind="supplement" keep title={<T de="Die Zahlen der fünf Schritte" en="The numbers of the five steps" />}>
          <T
            de={<p>Mit den Tabellenwerten aus Brown (Anhang C, nicht auf der Folie):</p>}
            en={<p>With the table values from Brown (Appendix C, not on the slide):</p>}
          />
          <MD>{t`\Delta H_\mathrm{lat} = 410{,}9 + 107{,}3 + 121{,}3 + 496 - 349 = 786{,}5\ \mathrm{kJ/mol} \approx 788\ \mathrm{kJ/mol}`}</MD>
          <T
            de={<p>Der kleine Unterschied zu 788 kommt von gerundeten Tabellenwerten. <M>{t`\Delta H^\circ_f[\mathrm{Cl}(g)] = 121{,}3`}</M> ist gerade die Hälfte der <M>{t`\mathrm{Cl{-}Cl}`}</M>-Bindungsenthalpie, denn pro NaCl braucht man nur ein halbes <C>Cl2</C> zu spalten.</p>}
            en={<p>The small difference from 788 comes from rounded table values. <M>{t`\Delta H^\circ_f[\mathrm{Cl}(g)] = 121.3`}</M> is exactly half the <M>{t`\mathrm{Cl{-}Cl}`}</M> bond enthalpy, because per NaCl only half a <C>Cl2</C> has to be split.</p>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={7} p="7" />} title={<T de="Born-Haber-Kreisprozess" en="Born–Haber cycle" />}>
          <T
            de={<p>«Die schrittweise Bildung einer Ionenbindung bzw. eines Ionenkristalls.» Die Pfeile des Diagramms heissen <M p=",">{t`I_e`}</M> <M p=",">{t`EA`}</M> <M p=",">{t`\Delta H_\mathrm{lat}`}</M> <M p=".">{t`\Delta H_f`}</M></p>}
            en={<p>“This is the stepwise formation of an ionic bond / ionic solid.” The arrows of the diagram are called <M p=",">{t`I_e`}</M> <M p=",">{t`EA`}</M> <M p=",">{t`\Delta H_\mathrm{lat}`}</M> <M p=".">{t`\Delta H_f`}</M></p>}
          />
          <MD>{t`\Delta H_\mathrm{lat} = -\Delta H_f(\mathrm{NaCl}) + \Delta H_f[\mathrm{Cl}] + \Delta H_f[\mathrm{Na}] + I_e[\mathrm{Na}] + EA[\mathrm{Cl}]`}</MD>
          <T de={<p>«Gitterenergie: die Energie, um die Ionenbindung zu brechen, also die Anziehung zwischen den Ionen zu überwinden. Sie ist gross für kurze Bindungen und höhere Ladungen.»</p>} en={<p>“Lattice energy: the energy to break the ionic bond, to overcome the attraction force between the ions. It is large for short bonds and higher charges.”</p>} />
        </Box>
        <Box kind="misconception" title={<T de="«Natrium gibt sein Elektron gern ab»" en="“Sodium likes to give away its electron”" />}>
          <T
            de={<p>Lies die zwei Elektronen-Pfeile im Diagramm: Das Elektron wegnehmen kostet <M p=",">{t`496\ \mathrm{kJ}`}</M> Chlor gibt beim Aufnehmen nur <M>{t`349\ \mathrm{kJ}`}</M> zurück. Der Elektronenwechsel allein kostet also <M p=".">{t`147\ \mathrm{kJ/mol}`}</M> Bezahlt wird er erst durch die Anziehung der Ionen im Kristall (788 kJ/mol). Ohne Gitter gäbe es kein Kochsalz.</p>}
            en={<p>Read the two electron arrows in the diagram: taking the electron away costs <M p=",">{t`496\ \mathrm{kJ}`}</M> chlorine gives back only <M>{t`349\ \mathrm{kJ}`}</M> when taking it up. The electron swap alone therefore costs <M p=".">{t`147\ \mathrm{kJ/mol}`}</M> It is paid for only by the attraction of the ions in the crystal (788 kJ/mol). Without the lattice there would be no table salt.</p>}
          />
        </Box>
      </Section>
    </article>
  );
}
