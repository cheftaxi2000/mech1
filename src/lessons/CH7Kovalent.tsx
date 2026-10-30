import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { BondDecision, CovalentPlayer, DipoleFigure, OctetCounter, PolarityExplorer } from '../viz/chem/BondFigures';

const t = String.raw;

export default function CH7Kovalent() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die meisten Stoffe sind keine Salze: Wasser, Zucker, Luft bestehen aus Molekülen. Ihre Atome geben sich keine Elektronen, sie teilen sie. Diese Lektion zeigt, wie ein geteiltes Paar zur Bindung wird, wann Atome zwei oder drei Paare teilen und warum ein Paar nicht immer fair geteilt wird.</p>}
        en={<p className="lede">Most substances are not salts: water, sugar, air are made of molecules. Their atoms do not give each other electrons, they share them. This lesson shows how a shared pair becomes a bond, when atoms share two or three pairs, and why a pair is not always shared fairly.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="geteiltes-paar" title={<T de="1. Ein geteiltes Elektronenpaar" en="1. A shared electron pair" />}>
        <Box kind="lecture" src={<Src lec={7} p="10" />} title={<T de="Kovalente Bindung" en="Covalent bonding" />}>
          <T
            de={<>
              <p>Handschriftlich: «Aber die meisten Stoffe sind nicht ionisch (z. B. Moleküle). Sie nutzen …»</p>
              <ul>
                <li>Zwei Atome teilen ihre Valenzelektronen <M>\Rightarrow</M> kovalente Bindung.</li>
                <li>Das geteilte Paar von Valenzelektronen <M>\Rightarrow</M> der «Leim», der die Atome zusammenhält.</li>
              </ul>
              <p>Bsp.: <C>{'H· + ·H -> H:H'}</C> und <C p=".">{':Cl· + ·Cl: -> :Cl:Cl:'}</C> «Jedes Atom hat jetzt Edelgaskonfiguration <M>\Rightarrow</M> He bzw. Ar.» (Randnotiz: «Lewis-Strukturen».)</p>
              <p><b>Das Bindungspaar wird als Strich gezeichnet:</b> <M p=",">{t`\mathrm{H{-}H}`}</M> <M p=".">{t`:\!\mathrm{Cl}\!-\!\mathrm{Cl}\!:`}</M> Nicht geteilte Elektronen bleiben Punkte <M>\Rightarrow</M> «<b>freie Elektronenpaare</b>» (<i>lone pairs</i>). «Die Atome können auch mehrere Paare teilen …»</p>
            </>}
            en={<>
              <p>Handwritten: “But most substances are not ionic (e.g., molecules are not ionic). They exploit …”</p>
              <ul>
                <li>Two atoms share their valence electrons <M>\Rightarrow</M> covalent bond.</li>
                <li>The shared pair of valence electrons <M>\Rightarrow</M> the “glue” that holds atoms together.</li>
              </ul>
              <p>Ex: <C>{'H· + ·H -> H:H'}</C> and <C p=".">{':Cl· + ·Cl: -> :Cl:Cl:'}</C> “Each atom now has noble-gas configuration <M>\Rightarrow</M> He and Ar, respectively.” (Margin: “Lewis ‘dot’ structures”.)</p>
              <p><b>Bonding pair drawn as line:</b> <M p=",">{t`\mathrm{H{-}H}`}</M> <M p=".">{t`:\!\mathrm{Cl}\!-\!\mathrm{Cl}\!:`}</M> Unshared or non-bonding electrons kept as dots <M>\Rightarrow</M> “<b>lone pairs</b>”. “The atoms can also share multiple pairs …”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep"><b>Warum hält ein geteiltes Paar?</b> Die zwei Elektronen sitzen zwischen den beiden Kernen. Jeder Kern zieht an ihnen, und so ziehen die Elektronen indirekt beide Kerne zueinander. Zählt man die Elektronen, gehört das geteilte Paar <b>beiden</b> Atomen ganz: Chlor hat sechs eigene Elektronen in freien Paaren plus das geteilte Paar, also 8, wie Argon.</p>}
          en={<p className="keep"><b>Why does a shared pair hold?</b> The two electrons sit between the two nuclei. Each nucleus pulls on them, and so the electrons indirectly pull both nuclei towards each other. When you count electrons, the shared pair belongs fully to <b>both</b> atoms: chlorine has six of its own electrons in lone pairs plus the shared pair, so 8, like argon.</p>}
        />
        <CovalentPlayer />
        <Box kind="uebung" src={<Src ex={7} p="4" />} title={<T de="Kovalente Bindungen zeichnen" en="Drawing covalent bonds" />}>
          <T
            de={<p>«Nichtmetalle bilden kovalente Bindungen, indem sie einige ihrer Valenzelektronen teilen.» Die Bindungen werden als Striche gezeichnet; «alle anderen Valenzelektronen müssen als Punkte gezeichnet werden, nicht als Striche». Man kann auch Doppel- oder Dreifachbindungen zeichnen. «Achtung: H und He sind mit 2 Valenzelektronen am stabilsten (Duettregel).» «Die Art der Bindung hängt davon ab, ob die Atome Metalle oder Nichtmetalle sind.»</p>}
            en={<p>“Non-metals form covalent bonds. They do this by sharing some of their valence electrons.” The bonds are drawn as lines; “all other valence electrons must be drawn as dots, not lines”. We can also draw double or triple bonds. “Attention: H and He are most stable with 2 valence electrons (duet rule).” “The type of bond depends on whether the atoms are metals or non-metals.”</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="mehrfach" title={<T de="2. Doppel- und Dreifachbindungen" en="2. Double and triple bonds" />}>
        <Box kind="lecture" src={<Src lec={7} p="11" />} title={<T de="Mehrfache kovalente Bindungen" en="Multiple covalent bonds" />}>
          <T
            de={<>
              <p>Ein geteiltes Elektronenpaar ist eine kovalente Bindung <M>\Rightarrow</M> <b>Einfachbindung</b>. Zwei Atome teilen zwei Paare <M>\Rightarrow</M> <b>Doppelbindung</b>. Bsp. <M p=":">{t`\mathrm{CO_2}`}</M> <M p=".">{t`\mathrm{O}{=}\mathrm{C}{=}\mathrm{O}`}</M> Drei Paare <M>\Rightarrow</M> <b>Dreifachbindung</b>. Bsp. <M p=":">{t`\mathrm{N_2}`}</M> <M p=".">{t`:\!\mathrm{N}{\equiv}\mathrm{N}\!:`}</M></p>
              <p>«Allgemein werden Bindungen kürzer, je mehr Elektronenpaare geteilt werden.» Bsp. <M>{t`\mathrm{N{-}N}`}</M> 147, <M>{t`\mathrm{N{=}N}`}</M> 124, <M>{t`\mathrm{N{\equiv}N}`}</M> 110 pm.</p>
            </>}
            en={<>
              <p>A single pair of shared electrons represents one covalent bond <M>\Rightarrow</M> <b>single bond</b>. Two atoms that share two pairs <M>\Rightarrow</M> <b>double bond</b>. Ex: <M p=":">{t`\mathrm{CO_2}`}</M> <M p=".">{t`\mathrm{O}{=}\mathrm{C}{=}\mathrm{O}`}</M> Three pairs <M>\Rightarrow</M> <b>triple bond</b>. Ex: <M p=":">{t`\mathrm{N_2}`}</M> <M p=".">{t`:\!\mathrm{N}{\equiv}\mathrm{N}\!:`}</M></p>
              <p>“In general, bond lengths decrease with number of shared electron pairs.” Ex: <M>{t`\mathrm{N{-}N}`}</M> 147, <M>{t`\mathrm{N{=}N}`}</M> 124, <M>{t`\mathrm{N{\equiv}N}`}</M> 110 pm.</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So zählt man.</b> Kohlenstoff hat nur 4 Valenzelektronen, jeder Sauerstoff 6. Mit je einer Einfachbindung hätte C nur 4 Elektronen um sich. Erst wenn es mit jedem <C>O</C> zwei Paare teilt, sieht C <M>{t`2 \cdot 4 = 8`}</M> Elektronen, und jedes <C>O</C> hat 4 in freien Paaren plus 4 geteilte: ebenfalls 8. Bei <C>N2</C> braucht jedes N drei Paare in der Bindung und ein freies Paar. Im Bild steht neben jedem Atom die gezählte Zahl.</p>}
          en={<p className="keep"><b>How to count.</b> Carbon has only 4 valence electrons, each oxygen 6. With one single bond to each, C would have only 4 electrons around it. Only when it shares two pairs with each <C>O</C> does C see <M>{t`2 \cdot 4 = 8`}</M> electrons, and each <C>O</C> has 4 in lone pairs plus 4 shared: also 8. In <C>N2</C> each N needs three pairs in the bond and one lone pair. In the figure the counted number stands next to each atom.</p>}
        />
        <OctetCounter />
        <T
          de={<p>Mehr geteilte Paare ziehen die Kerne näher zusammen. Wie stark dabei die Bindung wird, misst die Bindungsenthalpie: siehe <a href="#ch-bindungsenthalpie">Bindungsenthalpie und Bindungslänge</a>.</p>}
          en={<p>More shared pairs pull the nuclei closer together. How strong the bond becomes is measured by the bond enthalpy: see <a href="#ch-bindungsenthalpie">Bond enthalpy and bond length</a>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="polaritaet" title={<T de="3. Polarität und Elektronegativität" en="3. Polarity and electronegativity" />}>
        <Box kind="lecture" src={<Src lec={7} p="12–15" />} title={<T de="Wie werden die Valenzelektronen geteilt?" en="How are valence electrons shared?" />}>
          <T
            de={<>
              <p>Handschriftlich: «Lewis-Strukturen tun so, als würde das Paar gleichmässig geteilt.» <b>Bindungspolarität:</b> Wie gleichmässig ist das Bindungspaar verteilt? Gleichmässig <M>\Rightarrow</M> unpolare kovalente Bindung (Bsp. <C p=",">Cl2</C> <C p=";">N2</C> «die gebundenen Atome sind gleich»). Ungleichmässig <M>\Rightarrow</M> polare kovalente Bindung (Bsp. HF).</p>
              <p>Zur Abschätzung dient die <b>Elektronegativität</b>: «die Fähigkeit eines Atoms im Molekül, Elektronen an sich zu ziehen». Elektronegative Atome haben eine stark negative Elektronenaffinität und eine grosse Ionisierungsenergie (handschriftlich: «ziehen Elektronen an, <M p=",">{t`EA \ll 0`}</M> und geben ungern welche ab, <M p=")">{t`I_1 \gg 0`}</M>»). Skala von Linus Pauling (1901–1994), aus thermodynamischen Daten, ohne Einheit.</p>
              <p>Folie 13: Elektronendichte von <C p=",">F2</C> HF und LiF (blau: wenig, rot: viel Elektronendichte). Folie 14: Tabelle der Elektronegativitäten.</p>
              <p>Folie 15: Man nimmt die <b>Differenz der Elektronegativitäten</b> (Tabelle! – «steht an der Prüfung auf dem Infoblatt»). Bsp. HF: <M>{t`4{,}0 - 2{,}1 = 1{,}9`}</M> <M>\Rightarrow</M> polare kovalente Bindung, mit <b>Partialladungen</b> <M p=".">{t`\delta^+\ \mathrm{H{-}F}\ \delta^-`}</M> <b>Faustregel:</b> Differenz <M>{t`\ge 2`}</M> <M>\Rightarrow</M> Ionenbindung (handschriftlich: LiF, <M>{t`4{,}0 - 1{,}0 = 3{,}0`}</M> <M>\Rightarrow</M> ionisch). Die Elektronegativität nimmt im Periodensystem nach rechts und nach oben zu.</p>
            </>}
            en={<>
              <p>Handwritten: “But Lewis structures imply that the electron pair is shared equally.” <b>Bond polarity:</b> how equally is the bonding pair distributed? Equally <M>\Rightarrow</M> nonpolar covalent bond (Ex: <C p=",">Cl2</C> <C p=";">N2</C> “the bonded atoms are the same”). Unequally <M>\Rightarrow</M> polar covalent bond (Ex: HF).</p>
              <p>To estimate it we use the <b>electronegativity</b>: “ability of atom in molecule to attract electrons to itself”. Electronegative atoms have a large negative electron affinity and a large ionization energy (handwritten: “atoms that attract electrons, <M p=",">{t`EA \ll 0`}</M> and resist giving electrons away, <M p=")">{t`I_1 \gg 0`}</M>”). Scale of Linus Pauling (1901–1994), based on thermodynamic data, no units.</p>
              <p>Slide 13: electron density of <C p=",">F2</C> HF and LiF (blue: low, red: high electron density). Slide 14: table of electronegativities.</p>
              <p>Slide 15: use the <b>electronegativity difference</b> (table! – “given at exam, on the useful info sheet”). Ex: HF: <M>{t`4.0 - 2.1 = 1.9`}</M> <M>\Rightarrow</M> polar covalent bond, represented with <b>partial charges</b> <M p=".">{t`\delta^+\ \mathrm{H{-}F}\ \delta^-`}</M> <b>Rule of thumb:</b> difference <M>{t`\ge 2`}</M> <M>\Rightarrow</M> ionic bond (handwritten: LiF, <M>{t`4.0 - 1.0 = 3.0`}</M> <M>\Rightarrow</M> ionic). Electronegativity increases as we move right and to the top of the periodic table.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Zwei Atome ziehen am selben Elektronenpaar wie zwei Leute an einem Seil.</p>
            <ol className="keep">
              <li>Gleich starke Atome (<M p=",">{t`\Delta EN = 0`}</M> etwa <C p=")">F2</C> Das Paar bleibt in der Mitte: unpolar.</li>
              <li>Eines zieht stärker (<C p=":">HF</C> <M p=")">{t`\Delta EN = 1{,}9`}</M> Das Paar rückt zu <C p=".">F</C> Fluor trägt dann etwas mehr als seinen Anteil an Elektronen, eine negative Partialladung <M p=",">{t`\delta^-`}</M> H entsprechend <M p=".">{t`\delta^+`}</M> «Partial» heisst: ein Bruchteil einer Elementarladung.</li>
              <li>Sehr verschieden (<C p=":">LiF</C> <M p=")">{t`\Delta EN = 3{,}0`}</M> Das Paar gehört praktisch ganz dem <C p=":">F</C> Aus den Partialladungen werden ganze Ionen.</li>
            </ol>
            <p>Tippe im Periodensystem zwei Atome an. Je kräftiger die Farbe einer Zelle, desto grösser die Elektronegativität: oben rechts liegt Fluor mit 4,0.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> Two atoms pull on the same electron pair like two people on a rope.</p>
            <ol className="keep">
              <li>Equally strong atoms (<M p=",">{t`\Delta EN = 0`}</M> e.g. <C p=")">F2</C> The pair stays in the middle: nonpolar.</li>
              <li>One pulls harder (<C p=":">HF</C> <M p=")">{t`\Delta EN = 1.9`}</M> The pair moves towards <C p=".">F</C> Fluorine then carries a bit more than its share of electrons, a negative partial charge <M p=",">{t`\delta^-`}</M> H correspondingly <M p=".">{t`\delta^+`}</M> “Partial” means a fraction of an elementary charge.</li>
              <li>Very different (<C p=":">LiF</C> <M p=")">{t`\Delta EN = 3.0`}</M> The pair practically belongs entirely to <C p=":">F</C> the partial charges become whole ions.</li>
            </ol>
            <p>Tap two atoms in the periodic table. The stronger the colour of a cell, the larger the electronegativity: at the top right sits fluorine with 4.0.</p>
          </>}
        />
        <PolarityExplorer />
        <Box kind="uebung" src={<Src ex={7} p="3–4" />} title={<T de="Elektronegativität" en="Electronegativity" />}>
          <T
            de={<p>«Elektronegativität EN: die Fähigkeit eines Atoms, Elektronen anzuziehen. EN wächst mit <M>{t`Z_\mathrm{eff}`}</M> (effektive Kernladung) und nimmt mit der Zahl der Schalen ab.» «Je grösser <M p=",">{t`\Delta EN`}</M> desto ungleicher die Teilung der Elektronen, desto polarer.»</p>}
            en={<p>“Electronegativity EN: it's the ability of an atom to attract electrons. EN increases with <M>{t`Z_\mathrm{eff}`}</M> (effective nuclear charge) and decreases with the number of shells.” “The higher <M p=",">{t`\Delta EN`}</M> the more unequal the sharing of electrons, the more polar.”</p>}
          />
        </Box>
        <T
          de={<p>Das passt zu Woche 6: Nach rechts wächst <M>{t`Z_\mathrm{eff}`}</M> und das Atom wird kleiner, also zieht es stärker an fremden Elektronen. Nach unten liegt die Valenzschale weiter aussen und wird schwächer gehalten.</p>}
          en={<p>This fits week 6: to the right <M>{t`Z_\mathrm{eff}`}</M> grows and the atom gets smaller, so it pulls harder on other electrons. Further down, the valence shell lies farther out and is held more weakly.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="dipol" title={<T de="4. Das Dipolmoment" en="4. The dipole moment" />}>
        <Box kind="lecture" src={<Src lec={7} p="16" />} title={<T de="Dipolmomente" en="Dipole moments" />}>
          <T
            de={<>
              <p>Partialladungen führen zu einem <b>Dipolmoment</b> <M>{t`\vec\mu`}</M> («mü»). Unter <M>{t`\delta^+\ \mathrm{H{-}F}\ \delta^-`}</M> ist <M>{t`\vec\mu`}</M> als Pfeil von <C>F</C> nach <C>H</C> gezeichnet: «Die Ladungstrennung wird durch einen Vektor beschrieben, der von negativ nach positiv zeigt.»</p>
              <MD>{t`|\vec\mu| = Qr`}</MD>
              <p><M>{t`\pm Q`}</M> sind die Ladungen im Abstand <M>r</M> (Randnotiz: «bei HF ist <M p=")">{t`Q = \delta`}</M>»). Sehr polare Bindungen <M>\Rightarrow</M> grosses <M p=".">{t`|\vec\mu|`}</M> Einheit: Debye, <M>{t`1\ \mathrm D = 3{,}34\cdot10^{-30}\ \mathrm{C\cdot m}`}</M> (Coulomb-Meter). Ein Proton und ein Elektron im Abstand 0,1 nm: <M p=".">{t`|\vec\mu| = 4{,}8\ \mathrm D`}</M> <M p=".">{t`|\vec\mu_\mathrm{HF}| = 1{,}8\ \mathrm D`}</M></p>
              <p>Handschriftlich: «Wir benutzen die Richtungskonvention der Physik (negativ nach positiv). In der Chemie ist es umgekehrt.» Rand: «Typische Dipolmomente zweiatomiger Moleküle: 0–10 D.»</p>
            </>}
            en={<>
              <p>Partial charges lead to a <b>dipole moment</b> <M>{t`\vec\mu`}</M> (“mu”). Under <M>{t`\delta^+\ \mathrm{H{-}F}\ \delta^-`}</M> the arrow <M>{t`\vec\mu`}</M> is drawn from <C>F</C> to <C p=":">H</C> “Separation of charge quantified by vector pointing from negative to positive.”</p>
              <MD>{t`|\vec\mu| = Qr`}</MD>
              <p><M>{t`\pm Q`}</M> are the charges separated by distance <M>r</M> (margin: “for HF, <M p=")">{t`Q = \delta`}</M>”). Very polar bonds <M>\Rightarrow</M> large <M p=".">{t`|\vec\mu|`}</M> Units: Debye, <M>{t`1\ \mathrm D = 3.34\cdot10^{-30}\ \mathrm{C\cdot m}`}</M> (coulomb-metre). A proton and an electron separated by 0.1 nm: <M p=".">{t`|\vec\mu| = 4.8\ \mathrm D`}</M> <M p=".">{t`|\vec\mu_\mathrm{HF}| = 1.8\ \mathrm D`}</M></p>
              <p>Handwritten: “We are using the physicist's convention for the direction of the dipole (negative to positive). Chemists use the opposite convention.” Margin: “Typical dipole moments for diatomic molecules: 0–10 D.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Woher kommt 4,8 D?</b> Eine ganze Elementarladung, <M p=",">{t`Q = 1{,}602\cdot10^{-19}\ \mathrm C`}</M> im Abstand <M p=":">{t`r = 0{,}1\ \mathrm{nm} = 10^{-10}\ \mathrm m`}</M></p>
            <MD>{t`Qr = 1{,}602\cdot10^{-29}\ \mathrm{C\cdot m} = \frac{1{,}602\cdot10^{-29}}{3{,}34\cdot10^{-30}}\ \mathrm D \approx 4{,}8\ \mathrm D`}</MD>
            <p className="keep">HF ist rund 0,09 nm lang und hat nur 1,8 D. Rückwärts gerechnet sitzt auf <C>F</C> also nur etwa <M p=":">{t`\delta \approx 1{,}8 / (4{,}8 \cdot 0{,}92) \approx 0{,}41`}</M> knapp die Hälfte einer Elementarladung. Im Bild stellst du <M>Q</M> und <M>r</M> ein.</p>
          </>}
          en={<>
            <p className="keep"><b>Where does 4.8 D come from?</b> One whole elementary charge, <M p=",">{t`Q = 1.602\cdot10^{-19}\ \mathrm C`}</M> at a distance <M p=":">{t`r = 0.1\ \mathrm{nm} = 10^{-10}\ \mathrm m`}</M></p>
            <MD>{t`Qr = 1.602\cdot10^{-29}\ \mathrm{C\cdot m} = \frac{1.602\cdot10^{-29}}{3.34\cdot10^{-30}}\ \mathrm D \approx 4.8\ \mathrm D`}</MD>
            <p className="keep">HF is about 0.09 nm long and has only 1.8 D. Working backwards, <C>F</C> carries only about <M p=":">{t`\delta \approx 1.8 / (4.8 \cdot 0.92) \approx 0.41`}</M> a bit less than half an elementary charge. In the figure you set <M>Q</M> and <M p=".">r</M></p>
          </>}
        />
        <DipoleFigure />
        <Box kind="misconception" title={<T de="«Der Dipolpfeil zeigt immer zum negativen Ende»" en="“The dipole arrow always points to the negative end”" />}>
          <T
            de={<p>Das ist die Konvention der Chemie-Bücher (oft mit einem Kreuzchen am positiven Ende). Die Vorlesung benutzt die der Physik: von minus nach plus. Beide beschreiben dieselbe Ladungstrennung; wichtig ist nur, dass man beim Lesen weiss, welche gilt. In diesem Kurs zeigt <M>{t`\vec\mu`}</M> von <M>{t`\delta^-`}</M> nach <M p=".">{t`\delta^+`}</M></p>}
            en={<p>That is the convention of chemistry books (often with a little cross at the positive end). The lecture uses the physicists' one: from minus to plus. Both describe the same separation of charge; what matters is knowing which one applies when reading. In this course <M>{t`\vec\mu`}</M> points from <M>{t`\delta^-`}</M> to <M p=".">{t`\delta^+`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ionisch-kovalent" title={<T de="5. Ionisch oder kovalent?" en="5. Ionic or covalent?" />}>
        <Box kind="lecture" src={<Src lec={7} p="17" />} title={<T de="Ionisch gegenüber kovalent" en="Ionic versus covalent" />}>
          <T
            de={<>
              <p>Keine scharfe Grenze <M>\Rightarrow</M> ein Kontinuum. Eher kovalent <M>\Rightarrow</M> Moleküle <M>\Rightarrow</M> tiefe Schmelz- und Siedetemperatur (Rand: «bilden in Wasser Nichtelektrolyte»). Eher ionisch <M>\Rightarrow</M> Ionenkristalle <M>\Rightarrow</M> spröde, hohe Schmelztemperatur. Die Faustregel mit der Elektronegativitätsdifferenz ist nützlich, aber nicht perfekt.</p>
              <p><b>Je höher die Oxidationszahl des Metalls, desto kovalenter die Bindung.</b> Bsp.: MnO (<M p=")">{t`+2,\ -2`}</M> <b>ionisch</b>; <M>{t`\mathrm{Mn_2O_7}`}</M> (<M p=")">{t`+7,\ -2`}</M> <b>kovalent</b>. Handschriftlich: «Mangan(II)-oxid bildet einen Ionenkristall mit Schmelztemperatur 1842 °C.» «Mangan(VII)-oxid ist bei 25 °C flüssig: molekulares Verhalten wegen kovalenter Bindung.» «Diesen Unterschied sieht man der Elektronegativitätsdifferenz nicht an.»</p>
            </>}
            en={<>
              <p>Not a strict line between <M>\Rightarrow</M> a continuum of behaviour. More covalent <M>\Rightarrow</M> molecular behaviour <M>\Rightarrow</M> low melting/boiling temperature (margin: “also forms nonelectrolytes in water”). More ionic <M>\Rightarrow</M> ionic solids <M>\Rightarrow</M> brittle, high melting temperature. The electronegativity-difference rule of thumb is useful, but not perfect.</p>
              <p><b>As the oxidation number of the metal increases, bonding becomes more covalent.</b> Ex: MnO (<M p=")">{t`+2,\ -2`}</M> <b>ionic</b>; <M>{t`\mathrm{Mn_2O_7}`}</M> (<M p=")">{t`+7,\ -2`}</M> <b>covalent</b>. Handwritten: “Manganese(II) oxide forms an ionic solid with melting temperature of 1842 °C.” “Manganese(VII) oxide forms a liquid at 25 °C: molecular behaviour due to covalent bonding.” “This change is not apparent if we just look at the electronegativity difference.”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep"><b>Warum macht eine hohe Oxidationszahl kovalent?</b> Ein Mangan, das sieben Elektronen abgeben müsste, wäre ein winziges, extrem geladenes Ion. So viel Ladung lässt sich nicht trennen; stattdessen teilt Mangan die Elektronen mit den Sauerstoffatomen. Darum ist die Faustregel <M>{t`\Delta EN \ge 2`}</M> nur der erste Blick. Beide Oxide haben dasselbe <M>{t`\Delta EN = 3{,}5 - 1{,}5 = 2{,}0`}</M> (handschriftlich steht 2,1; CH-013). Die Übung macht daraus einen kleinen Entscheidungsbaum.</p>}
          en={<p className="keep"><b>Why does a high oxidation number make it covalent?</b> A manganese that had to give away seven electrons would be a tiny, extremely charged ion. That much charge cannot be separated; instead manganese shares the electrons with the oxygen atoms. That is why the rule of thumb <M>{t`\Delta EN \ge 2`}</M> is only the first look. Both oxides have the same <M>{t`\Delta EN = 3.5 - 1.5 = 2.0`}</M> (the handwriting says 2.1; CH-013). The exercise class turns this into a small decision tree.</p>}
        />
        <BondDecision />
        <Box kind="uebung" src={<Src ex={7} p="7" />} title={<T de="Zwei Faustregeln" en="Two rules of thumb" />}>
          <T
            de={<p>«Das Nichtmetall stiehlt dem Metall das Elektron, weil <M p=".">{t`EN_\text{Nichtmetall} > EN_\text{Metall}`}</M> Das positiv geladene Metall und das negativ geladene Nichtmetall werden durch elektrostatische Kräfte zusammengehalten.» «Eine Bindung gilt als ionisch, wenn <M p=".">{t`\Delta EN > 2{,}0`}</M>» Entscheidungsbaum: <M p="?">{t`\Delta EN > 2`}</M> Nein <M>\to</M> kovalent; ja <M>\to</M> «Hat das Metall eine hohe Oxidationszahl?» Nein <M>\to</M> ionisch (MnO), ja <M>\to</M> kovalent <M p=".">{t`(\mathrm{Mn_2O_7})`}</M></p>}
            en={<p>“The non-metal steals the electron of the metal, because <M p=".">{t`EN_\text{non-metal} > EN_\text{metal}`}</M> The positively charged metal and negatively charged non-metal are held together by electrostatic forces.” “A bond is considered ionic if <M p=".">{t`\Delta EN > 2.0`}</M>” Decision tree: <M p="?">{t`\Delta EN > 2`}</M> No <M>\to</M> covalent; yes <M>\to</M> “Does the metal have a high oxidation number?” No <M>\to</M> ionic (MnO), yes <M>\to</M> covalent <M p=".">{t`(\mathrm{Mn_2O_7})`}</M></p>}
          />
          <T de={<p>Die Folie schreibt «<M>{t`\ge 2`}</M>», die Übung «<M>{t`> 2`}</M>». Bei MnO mit genau 2,0 passt nur die Fassung der Folie; das Bild benutzt sie.</p>} en={<p>The slide writes “<M>{t`\ge 2`}</M>”, the exercise class “<M>{t`> 2`}</M>”. For MnO with exactly 2.0 only the slide's version fits; the figure uses it.</p>} />
        </Box>
      </Section>
    </article>
  );
}
