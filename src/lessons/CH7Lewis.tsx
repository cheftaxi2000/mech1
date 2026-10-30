import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { ChargeCompare, FormalChargeExplorer, HcnFig, ResonanceFigure } from '../viz/chem/BondFigures';

const t = String.raw;

export default function CH7Lewis() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Für <C>H2</C> und <C>Cl2</C> reicht ein Blick. Für grössere Moleküle braucht es ein Rezept: fünf Regeln, die eine Lewis-Struktur Schritt für Schritt aufbauen. Oft passen mehrere Strukturen; dann entscheidet die Formalladung, welche die beste ist. Und manchmal ist keine allein richtig.</p>}
        en={<p className="lede">For <C>H2</C> and <C>Cl2</C> one look is enough. Larger molecules need a recipe: five rules that build a Lewis structure step by step. Often several structures fit; then the formal charge decides which is best. And sometimes no single one is right.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="regeln" title={<T de="1. Fünf Regeln für eine Lewis-Struktur" en="1. Five rules for a Lewis structure" />}>
        <Box kind="lecture" src={<Src lec={7} p="18" />} title={<T de="Lewis-Strukturen zeichnen" en="Drawing Lewis structures" />}>
          <T
            de={<>
              <p>Handschriftlich: «Wenn Moleküle komplizierter werden, brauchen wir Regeln …» Bsp. HCN rechts daneben.</p>
              <ol>
                <li>Valenzelektronen aller Atome zusammenzählen – die Gesamtladung berücksichtigen. HCN: <M p=".">{t`1 + 4 + 5 = 10`}</M></li>
                <li>Symbole hinschreiben und mit Einfachbindungen verbinden – das Zentralatom steht oft zuerst in der Formel (aber nicht immer). <M>{t`\mathrm{H{-}C{-}N}`}</M> (Rand: «jeder Strich nimmt 2 Valenzelektronen»).</li>
                <li>Oktette um die äusseren Atome vervollständigen – H braucht nur 2 Elektronen.</li>
                <li>Übrige Valenzelektronen um das Zentralatom setzen – auch wenn es dann mehr als 8 hat. Rand: «Keine übrig. Kohlenstoff hat 4 Elektronen.»</li>
                <li>Mehrfachbindungen versuchen, wenn das Zentralatom kein Oktett hat: <M p=".">{t`\mathrm{H{-}C{\equiv}N}\!:`}</M></li>
              </ol>
              <p>Handschriftlich: «Endgültige Lewis-Struktur. C und N erfüllen die Oktettregel, H hat wie verlangt 2 Elektronen.»</p>
            </>}
            en={<>
              <p>Handwritten: “As molecules become more complicated, we need rules to draw Lewis structures …” Ex: HCN on the right.</p>
              <ol>
                <li>Sum valence electrons of all atoms – factor in overall charge. HCN: <M p=".">{t`1 + 4 + 5 = 10`}</M></li>
                <li>Write symbols and connect with single bonds – central atom often written first in formula (but not always). <M>{t`\mathrm{H{-}C{-}N}`}</M> (margin: “each line takes 2 valence electrons”).</li>
                <li>Complete octets around non-central atoms – H only needs 2 electrons.</li>
                <li>Place remaining valence electrons around central atom – even if it then has more than 8 electrons. Margin: “None left. Carbon has 4 electrons.”</li>
                <li>Try multiple bonds if central atom does not have octet: <M p=".">{t`\mathrm{H{-}C{\equiv}N}\!:`}</M></li>
              </ol>
              <p>Handwritten: “Final Lewis structure. C, N satisfy octet rule. H has 2 electrons, as required.”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Die Animation führt die Regeln an HCN aus. Oben liegt der «Elektronen-Vorrat» aus Regel 1: zehn Punkte. Jede Regel verbraucht einige davon. Bei Regel 4 ist nichts mehr übrig, aber Kohlenstoff sieht nur 4 Elektronen. Regel 5 löst das, ohne neue Elektronen: Zwei freie Paare des Stickstoffs werden zu Bindungspaaren. Sie gehören dann beiden Atomen, und plötzlich zählen C und N je 8.</p>}
          en={<p className="keep">The animation applies the rules to HCN. At the top lies the “electron supply” from rule 1: ten dots. Each rule uses some of them. At rule 4 nothing is left, but carbon sees only 4 electrons. Rule 5 solves this without new electrons: two lone pairs of nitrogen become bonding pairs. They then belong to both atoms, and suddenly C and N each count 8.</p>}
        />
        <StepPlayer
          label={tr('Animation: die Lewis-Struktur von HCN nach den fünf Regeln', 'Animation: the Lewis structure of HCN by the five rules')}
          steps={[
            { ms: 500, holdMs: 2000, caption: <T de={<>Die drei Atome H, C, N, noch ohne Elektronen.</>} en={<>The three atoms H, C, N, still without electrons.</>} /> },
            { ms: 1200, holdMs: 2800, caption: <T de={<>Regel 1: Valenzelektronen zählen, <M p=".">{t`1 + 4 + 5 = 10`}</M> Sie liegen oben im Vorrat.</>} en={<>Rule 1: count valence electrons, <M p=".">{t`1 + 4 + 5 = 10`}</M> They lie in the supply at the top.</>} /> },
            { ms: 1300, holdMs: 2800, caption: <T de={<>Regel 2: Einfachbindungen <M>{t`\mathrm{H{-}C}`}</M> und <M p=".">{t`\mathrm{C{-}N}`}</M> Jeder Strich nimmt 2 Elektronen, 6 bleiben.</>} en={<>Rule 2: single bonds <M>{t`\mathrm{H{-}C}`}</M> and <M p=".">{t`\mathrm{C{-}N}`}</M> Each line takes 2 electrons, 6 remain.</>} /> },
            { ms: 1300, holdMs: 2800, caption: <T de={<>Regel 3: Das äussere Atom N bekommt sein Oktett: drei freie Paare. H hat mit seiner Bindung schon 2. Der Vorrat ist leer.</>} en={<>Rule 3: the outer atom N gets its octet: three lone pairs. H already has 2 with its bond. The supply is empty.</>} /> },
            { ms: 900, holdMs: 3000, caption: <T de={<>Regel 4: Für das Zentralatom C bleibt nichts. Es sieht nur seine zwei Bindungen: 4 Elektronen statt 8 (orange).</>} en={<>Rule 4: nothing is left for the central atom C. It sees only its two bonds: 4 electrons instead of 8 (orange).</>} /> },
            { ms: 1600, holdMs: 3400, caption: <T de={<>Regel 5: Zwei freie Paare von N wandern in die Bindung, es entsteht <M p=".">{t`\mathrm{C{\equiv}N}`}</M> Jetzt zählen C und N je 8, H zählt 2.</>} en={<>Rule 5: two lone pairs of N move into the bond, giving <M p=".">{t`\mathrm{C{\equiv}N}`}</M> Now C and N each count 8, H counts 2.</>} /> },
          ]}
        >
          {(step, tt) => <HcnFig step={step} t={tt} />}
        </StepPlayer>
        <Box kind="uebung" src={<Src ex={7} p="10" />} title={<T de="Lewis-Struktur in drei Schritten" en="Lewis structure in three steps" />}>
          <T
            de={<p>Für die 2D-Darstellung: ① die Zahl der Valenzelektronen jedes Atoms aufschreiben ② die Atome mit Einfachbindungen verbinden und die Valenzelektronen setzen ③ Doppel- und Dreifachbindungen versuchen, um die Oktettregel zu erfüllen. HCN: H → 1, C → 4, N → 5. «Ionen brauchen eine Klammer und eine Ladung!»</p>}
            en={<p>For the 2D visualisation: ① write down the number of valence electrons for every atom ② connect the atoms with single bonds and place the valence electrons ③ try double/triple bonds to fulfil the octet rule. HCN: H → 1, C → 4, N → 5. “Ions need a bracket and a charge!”</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="formalladung" title={<T de="2. Formalladung: welche Struktur gewinnt?" en="2. Formal charge: which structure wins?" />}>
        <Box kind="lecture" src={<Src lec={7} p="19–20" />} title={<T de="Alternative Lewis-Strukturen" en="Alternative Lewis structures" />}>
          <T
            de={<>
              <p>Manchmal erfüllen mehrere Lewis-Strukturen die Oktettregel. Welche ist richtig? Man berechnet die <b>Formalladung</b> jedes Atoms in jeder Struktur:</p>
              <MD>{t`\text{Formalladung} = (\text{Valenz-}e^-) - \tfrac12(\text{bindende } e^-) - (\text{nichtbindende } e^-)`}</MD>
              <p>Rand: «Die Summe der Formalladungen ist gleich der Ladung des Moleküls.» Bsp. Cyanid <M p=":">{t`[:\!\mathrm{C}{\equiv}\mathrm{N}\!:]^-`}</M> C: <M p=";">{t`4 - \tfrac12(6) - 2 = -1`}</M> N: <M p=".">{t`5 - \tfrac12(6) - 2 = 0`}</M></p>
              <p><b>Die dominante Lewis-Struktur hat Formalladungen möglichst nahe bei null, und negative Formalladungen sitzen auf den elektronegativeren Atomen.</b></p>
              <p>Folie 20 (Tabellen aus Brown): <M>{t`\mathrm{O{=}C{=}O}`}</M> mit 0 0 0 gegen <M>{t`:\!\mathrm{O{-}C{\equiv}O}\!:`}</M> mit <M>{t`-1,\ 0,\ +1`}</M> (zugeordnete Elektronen 6 4 6 bzw. 7 4 5). Thiocyanat <M p=":">{t`\mathrm{NCS^-}`}</M> <M p=";">{t`-2,\ 0,\ +1`}</M> <M>{t`-1,\ 0,\ 0`}</M> (rot umrandet); <M p=".">{t`0,\ 0,\ -1`}</M> Handschriftlich: «N ist elektronegativer als S.»</p>
            </>}
            en={<>
              <p>Sometimes the octet rule is satisfied with more than one Lewis structure. Which one is correct? Calculate the <b>formal charge</b> of each atom in each structure:</p>
              <MD>{t`\text{formal charge} = (\text{valence } e^-) - \tfrac12(\text{bonding } e^-) - (\text{non-bonding } e^-)`}</MD>
              <p>Margin: “sum of formal charges equals charge on molecule.” Ex: cyanide <M p=":">{t`[:\!\mathrm{C}{\equiv}\mathrm{N}\!:]^-`}</M> C: <M p=";">{t`4 - \tfrac12(6) - 2 = -1`}</M> N: <M p=".">{t`5 - \tfrac12(6) - 2 = 0`}</M></p>
              <p><b>Dominant Lewis structure for molecule has formal charges closest to zero and any negative formal charges are on more electronegative atoms.</b></p>
              <p>Slide 20 (tables from Brown): <M>{t`\mathrm{O{=}C{=}O}`}</M> with 0 0 0 versus <M>{t`:\!\mathrm{O{-}C{\equiv}O}\!:`}</M> with <M>{t`-1,\ 0,\ +1`}</M> (electrons assigned 6 4 6 and 7 4 5). Thiocyanate <M p=":">{t`\mathrm{NCS^-}`}</M> <M p=";">{t`-2,\ 0,\ +1`}</M> <M>{t`-1,\ 0,\ 0`}</M> (boxed in red); <M p=".">{t`0,\ 0,\ -1`}</M> Handwritten: “N is more electronegative than S.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Formel.</b> Man vergleicht, wie viele Elektronen ein Atom als freies Atom hatte (Valenzelektronen) mit wie vielen es in der Struktur «besitzt».</p>
            <ol className="keep">
              <li>Freie Elektronen gehören dem Atom ganz.</li>
              <li>Jedes Bindungspaar wird gerecht halbiert: ein Elektron für jeden Partner. Darum <M p=".">{t`\tfrac12(\text{bindende } e^-)`}</M></li>
              <li>Besitzt das Atom ein Elektron mehr als vorher, ist seine Formalladung <M p=";">-1</M> eines weniger: <M p=".">+1</M></li>
            </ol>
            <p>Im Bild hat jedes Atom eine eigene Farbe, und jeder Punkt die Farbe des Atoms, dem er zugeordnet wird. Bei <M>{t`\mathrm{NCS^-}`}</M> haben Struktur 2 und 3 gleich kleine Ladungen (zusammen 1). Den Ausschlag gibt die zweite Hälfte der Regel: Die <M>-1</M> soll auf dem elektronegativeren N sitzen, also gewinnt Struktur 2.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the formula.</b> You compare how many electrons an atom had as a free atom (valence electrons) with how many it “owns” in the structure.</p>
            <ol className="keep">
              <li>Non-bonding electrons belong to the atom entirely.</li>
              <li>Each bonding pair is split fairly: one electron for each partner. Hence <M p=".">{t`\tfrac12(\text{bonding } e^-)`}</M></li>
              <li>If the atom owns one electron more than before, its formal charge is <M p=";">-1</M> one fewer: <M p=".">+1</M></li>
            </ol>
            <p>In the figure each atom has its own colour, and each dot the colour of the atom it is assigned to. For <M>{t`\mathrm{NCS^-}`}</M> structures 2 and 3 have equally small charges (1 in total). The second half of the rule decides: the <M>-1</M> should sit on the more electronegative N, so structure 2 wins.</p>
          </>}
        />
        <FormalChargeExplorer initial="ncs" groups={['cn', 'co2', 'ncs', 'hcl']} />
        <Box kind="uebung" src={<Src ex={7} p="9" />} title={<T de="Formalladung in der Übung" en="Formal charge in the exercise class" />}>
          <T
            de={<p>«Formalladung eines Atoms: Zahl der Valenzelektronen laut Periodensystem gegenüber seiner Zahl im ganzen Molekül <M>\to</M> ignoriert die Elektronegativität <M>\to</M> ‹gerechte Teilung›.»</p>}
            en={<p>“Formal charge of an atom: number of valence electrons according to the periodic table versus its number in the whole molecule <M>\to</M> ignores electronegativity <M>\to</M> ‘equal split’.”</p>}
          />
          <MD>{t`FC = \#\,\text{ve} - \text{zugeordnete } e^- = \#\,\text{ve} - \tfrac12\,\#\,\text{bindende } e^- - \#\,\text{nichtbindende } e^-`}</MD>
          <T de={<p>Beispiel <M p=":">{t`\mathrm{H{-}F}`}</M> Valenzelektronen 1 und 7, zugeordnet 1 und 7, Formalladung 0 und 0.</p>} en={<p>Example <M p=":">{t`\mathrm{H{-}F}`}</M> valence electrons 1 and 7, assigned 1 and 7, formal charge 0 and 0.</p>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="drei-ladungen" title={<T de="3. Oxidationszahl, Formalladung, Partialladung" en="3. Oxidation number, formal charge, partial charge" />}>
        <Box kind="lecture" src={<Src lec={7} p="21" />} title={<T de="Drei Arten, Ladung zu beschreiben" en="Three ways to describe charge" />}>
          <T
            de={<>
              <p>Handschriftlich: «Wir haben jetzt drei Arten, die Ladung eines Atoms im Molekül zu beschreiben. Was ist der Unterschied?»</p>
              <ul>
                <li><b>Oxidationszahl:</b> Ladungen, die die Atome hätten, wenn die Bindungen ganz ionisch wären. Geteilte Elektronen gehen ganz an das elektronegativere Atom. Überschätzt die Rolle der Elektronegativität.</li>
                <li><b>Formalladung:</b> Ladungen, wenn die Bindungselektronen gerecht geteilt würden. Ignoriert die Elektronegativität.</li>
                <li><b>Partialladung:</b> irgendwo dazwischen.</li>
              </ul>
              <p>Bsp. <M p=":">{t`\mathrm{H{-}Cl}`}</M> Oxidationszahlen <M p=";">{t`+1,\ -1`}</M> Formalladungen 0, 0; tatsächliche Partialladungen <M p=".">{t`0{,}18{+}\text{ und }0{,}18{-}`}</M> Handschriftlich: «Die ersten beiden sind nur Buchhaltung, keine wirklichen Ladungen. Die Partialladungen sind wirkliche Ladungen.»</p>
            </>}
            en={<>
              <p>Handwritten: “We now have three ways to describe the electronic charge on a specific atom in a molecule: oxidation state, formal charge, and partial charge. What's the difference?”</p>
              <ul>
                <li><b>Oxidation number:</b> charges atoms would have if bonds were completely ionic. Shared electrons given completely to the more electronegative atom. Overestimates the role of electronegativity.</li>
                <li><b>Formal charge:</b> charges atoms would have if bonding electrons were shared equally. Ignores electronegativity.</li>
                <li><b>Partial charge:</b> somewhere in between.</li>
              </ul>
              <p>Ex: <M p=":">{t`\mathrm{H{-}Cl}`}</M> oxidation numbers <M p=";">{t`+1,\ -1`}</M> formal charges 0, 0; actual partial charges <M p=".">{t`0.18{+}\text{ and }0.18{-}`}</M> Handwritten: “These are just bookkeeping systems. Do not represent actual charges.” / “These represent actual charges.”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Im Bild oben kannst du bei jedem Molekül von «Formalladung» auf «Oxidationszahl» umschalten. Bei HCl ändert sich nur, wem das Bindungspaar zugeschlagen wird: einmal halbiert, einmal ganz an Cl. Die Wahrheit liegt dazwischen: Das Paar ist etwas zu Cl verschoben, aber nicht ganz. Die Skala zeigt die drei Zahlen für das H-Atom nebeneinander.</p>}
          en={<p className="keep">In the figure above you can switch from “formal charge” to “oxidation number” for each molecule. For HCl only the owner of the bonding pair changes: once split in half, once entirely given to Cl. The truth lies in between: the pair is shifted somewhat towards Cl, but not completely. The scale shows the three numbers for the H atom side by side.</p>}
        />
        <ChargeCompare />
        <Box kind="misconception" title={<T de="«Die Formalladung ist die wirkliche Ladung eines Atoms»" en="“The formal charge is the real charge of an atom”" />}>
          <T
            de={<p>Formalladung und Oxidationszahl sind Buchhaltung: zwei verschiedene Regeln, die geteilten Elektronen zu verteilen. In HCl sagen sie 0 und +1, gemessen sind 0,18. Die Formalladung dient zum Vergleichen von Lewis-Strukturen, die Oxidationszahl zum Verfolgen von Redoxreaktionen (Woche 3).</p>}
            en={<p>Formal charge and oxidation number are bookkeeping: two different rules for distributing the shared electrons. In HCl they say 0 and +1, the measured value is 0.18. The formal charge is used to compare Lewis structures, the oxidation number to track redox reactions (week 3).</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="resonanz" title={<T de="4. Resonanz" en="4. Resonance" />}>
        <Box kind="lecture" src={<Src lec={7} p="22–23" />} title={<T de="Resonanzstrukturen" en="Resonance structures" />}>
          <T
            de={<>
              <p><b>Zwei verschiedene, aber völlig gleichwertige Lewis-Strukturen.</b> Bsp. 1: Ozon <M p=":">{t`\mathrm{O_3}`}</M> 18 Valenzelektronen; das mittlere <C>O</C> braucht eine Einfach- und eine Doppelbindung. <M>{t`\mathrm{O{=}O{-}O}`}</M> oder <M p="?">{t`\mathrm{O{-}O{=}O}`}</M> «Welche ist richtig?» – <b>Eine Mischung beider Resonanzstrukturen</b> (geschrieben mit <M p=").">\leftrightarrow</M> Tatsächliche Struktur: beide Bindungen 127,8 pm lang, Winkel 117°, «Bindungslängen gleich».</p>
              <p>Bsp. 2: Benzol <M p=":">{t`\mathrm{C_6H_6}`}</M> abwechselnd Einfach- und Doppelbindungen. «Aber die Bindungslängen im Ring sind gleich – zwischen <M>{t`\mathrm{C{-}C}`}</M>-Einfach- und Doppelbindung.» Sechseck mit Kreis: «Die Elektronen der Doppelbindungen sind über den Ring delokalisiert.»</p>
            </>}
            en={<>
              <p><b>Two alternative, but completely equivalent Lewis structures.</b> Ex 1: ozone <M p=":">{t`\mathrm{O_3}`}</M> 18 valence electrons; the central <C>O</C> needs 1 single bond and 1 double bond. <M>{t`\mathrm{O{=}O{-}O}`}</M> or <M p="?">{t`\mathrm{O{-}O{=}O}`}</M> “Which one is correct?” – <b>A blend of both resonance structures</b> (written with <M p=").">\leftrightarrow</M> Actual structure: both bonds 127.8 pm long, angle 117°, “bond lengths same”.</p>
              <p>Ex 2: benzene <M p=":">{t`\mathrm{C_6H_6}`}</M> alternating single and double bonds. “But bond lengths in the ring are same – intermediate between <M>{t`\mathrm{C{-}C}`}</M> single and double bond.” Hexagon with a circle: “Electrons from double bonds delocalized over the ring.”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Eine Lewis-Struktur kann nur ganze Paare zeichnen: Einfach- oder Doppelbindung. Ozon hat aber zwei gleich lange Bindungen, irgendwo zwischen den beiden. Darum zeichnet man beide Strukturen und den Doppelpfeil <M>\leftrightarrow</M> dazwischen. Er bedeutet nicht, dass das Molekül hin und her springt: Das wirkliche Molekül ist immer die Mischung, eine «Anderthalbfachbindung» auf jeder Seite.</p>}
          en={<p className="keep">A Lewis structure can only draw whole pairs: single or double bond. Ozone, however, has two bonds of equal length, somewhere between the two. So one draws both structures with the double arrow <M>\leftrightarrow</M> between them. It does not mean that the molecule jumps back and forth: the real molecule is always the blend, a “one-and-a-half bond” on each side.</p>}
        />
        <ResonanceFigure />
        <Box kind="misconception" title={<T de="«Das Elektron springt zwischen den Bindungen hin und her»" en="“The electron jumps back and forth between the bonds”" />}>
          <T
            de={<p>So steht es handschriftlich in der Übung (S. 10), als Merkhilfe. Gemessen wird aber kein Hin und Her: Beide Bindungen sind zu jeder Zeit gleich lang. Die Resonanzstrukturen sind zwei unvollkommene Zeichnungen desselben Moleküls, wie zwei Fotos aus verschiedenen Blickwinkeln.</p>}
            en={<p>That is the handwritten note in the exercise class (p. 10), as a memory aid. But no back and forth is measured: both bonds have the same length at every moment. The resonance structures are two imperfect drawings of the same molecule, like two photos from different angles.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausnahmen" title={<T de="5. Ausnahmen zur Oktettregel" en="5. Exceptions to the octet rule" />}>
        <Box kind="lecture" src={<Src lec={7} p="24" />} title={<T de="Ausnahmen zur Oktettregel" en="Exceptions to the octet rule" />}>
          <T
            de={<>
              <p>Manche Moleküle erfüllen die Oktettregel nicht. Ausnahmen betreffen:</p>
              <ul>
                <li><b>Ungerade Elektronenzahl:</b> <M>{t`\mathrm{N{=}O}`}</M> mit 11 Valenzelektronen (Stickstoffmonoxid); das ungepaarte Elektron kann auf <C>N</C> oder <C>O</C> gezeichnet werden.</li>
                <li><b>Weniger als ein Oktett:</b> <M p=":">{t`\mathrm{BF_3}`}</M> «B hat 6 Elektronen». Dominant ist die Struktur mit drei Einfachbindungen (alle Formalladungen 0); weniger wichtig drei Strukturen mit einer <M>{t`\mathrm{B{=}F}`}</M>-Doppelbindung (<M p=").">{t`\mathrm{F}\ {+1},\ \mathrm{B}\ {-1}`}</M></li>
                <li><b>Mehr als ein Oktett:</b> <M p=":">{t`\mathrm{PF_5}`}</M> «P hat 10 Elektronen», «hypervalent genannt», «ab Periode 3».</li>
              </ul>
            </>}
            en={<>
              <p>Some molecules fail the octet rule. Exceptions involve:</p>
              <ul>
                <li><b>Odd number of electrons:</b> <M>{t`\mathrm{N{=}O}`}</M> with 11 valence electrons (nitric oxide); the unpaired electron can be drawn on <C>N</C> or on <C p=".">O</C></li>
                <li><b>Less than an octet:</b> <M p=":">{t`\mathrm{BF_3}`}</M> “B has 6 electrons”. Dominant is the structure with three single bonds (all formal charges 0); less important are three structures with one <M>{t`\mathrm{B{=}F}`}</M> double bond (<M p=").">{t`\mathrm{F}\ {+1},\ \mathrm{B}\ {-1}`}</M></li>
                <li><b>More than an octet:</b> <M p=":">{t`\mathrm{PF_5}`}</M> “P has 10 electrons”, “called hypervalent”, “period 3 or beyond”.</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum gerade diese?</b></p>
            <ul className="keep">
              <li>Mit 11 Elektronen kann man keine Paare bilden, ein Elektron bleibt allein. Kein Atom kommt auf 8.</li>
              <li>Bei <C>BF3</C> würde eine Doppelbindung B das Oktett geben, aber dem elektronegativsten Element <C>F</C> eine positive Formalladung. Die Formalladungs-Regel ist hier stärker als die Oktettregel.</li>
              <li>Atome ab Periode 3 sind gross genug für mehr als vier Nachbarn. Darum gibt es <C>PF5</C>, aber kein <M p=".">{t`\mathrm{NF_5}`}</M></li>
            </ul>
            <p>Das Beispiel der Übung, <M p=",">{t`\mathrm{XeO_3}`}</M> zeigt beide Regeln im Streit. Struktur <M>{t`\mathsf{K}`}</M> erfüllt jedes Oktett, hat aber die Formalladungen <M p=".">{t`+3,\ -1,\ -1,\ -1`}</M> Struktur <M>{t`\mathsf{N}`}</M> (drei Doppelbindungen) gibt allen Atomen die Formalladung 0, Xenon hat dann 14 Elektronen um sich. Die Übung wählt <M p=":">{t`\mathsf{N}`}</M> Die kleinsten Formalladungen gewinnen. Struktur <M>{t`\mathsf{M}`}</M> (zwei Doppelbindungen) hat drei Resonanzstrukturen, je nachdem, welches <C>O</C> die Einfachbindung trägt. Schalte im Bild «Elektronen zählen» ein.</p>
          </>}
          en={<>
            <p className="keep"><b>Why these?</b></p>
            <ul className="keep">
              <li>With 11 electrons one cannot form only pairs; one electron stays alone. Not every atom reaches 8.</li>
              <li>In <C>BF3</C> a double bond would give B its octet, but would give the most electronegative element <C>F</C> a positive formal charge. Here the formal-charge rule is stronger than the octet rule.</li>
              <li>Atoms from period 3 on are large enough for more than four neighbours. That is why <C>PF5</C> exists, but no <M p=".">{t`\mathrm{NF_5}`}</M></li>
            </ul>
            <p>The example of the exercise class, <M p=",">{t`\mathrm{XeO_3}`}</M> shows both rules in conflict. Structure <M>{t`\mathsf{K}`}</M> satisfies every octet but has the formal charges <M p=".">{t`+3,\ -1,\ -1,\ -1`}</M> Structure <M>{t`\mathsf{N}`}</M> (three double bonds) gives every atom the formal charge 0, and xenon then has 14 electrons around it. The exercise class picks <M p=":">{t`\mathsf{N}`}</M> the smallest formal charges win. Structure <M>{t`\mathsf{M}`}</M> (two double bonds) has three resonance structures, depending on which <C>O</C> carries the single bond. Switch on “count the electrons” in the figure.</p>
          </>}
        />
        <FormalChargeExplorer initial="xeo3" groups={['xeo3', 'bf3', 'no', 'pf5']} />
        <Box kind="uebung" src={<Src ex={7} p="11" />} title={<T de={<>Die vier Strukturen von <M>{t`\mathrm{XeO_3}`}</M></>} en={<>The four structures of <M>{t`\mathrm{XeO_3}`}</M></>} />}>
          <T
            de={<p>Vier mögliche Lewis-Strukturen <M>{t`\mathsf{K}, \mathsf{L}, \mathsf{M}, \mathsf{N}`}</M> (null bis drei Doppelbindungen, Xe behält ein freies Paar). «Struktur <M>{t`\mathsf{K}`}</M> erfüllt die Oktettregel für jedes Atom.» «Wie viele Resonanzstrukturen hat <M p="?">{t`\mathsf{M}`}</M> – drei.» «Welche Struktur minimiert die Formalladungen? Diese Struktur sollten wir wählen: <M p=",">{t`\mathsf{N}`}</M> drei Doppelbindungen.» Die Formalladungen selbst sind in der Übung leer gelassen; das Bild rechnet sie aus.</p>}
            en={<p>Four possible Lewis structures <M>{t`\mathsf{K}, \mathsf{L}, \mathsf{M}, \mathsf{N}`}</M> (zero to three double bonds, Xe keeps one lone pair). “Structure <M>{t`\mathsf{K}`}</M> satisfies the octet rule for each atom.” “How many resonance structures does <M>{t`\mathsf{M}`}</M> have? – three.” “Which structure minimizes overall formal charges? This is the structure we should choose: <M p=",">{t`\mathsf{N}`}</M> three double bonds.” The formal charges themselves are left blank in the exercise class; the figure computes them.</p>}
          />
        </Box>
      </Section>
    </article>
  );
}
