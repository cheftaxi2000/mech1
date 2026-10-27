import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { allowedL, allowedMl, orbitalsInShell, orbitalsInSubshell, subshellLetter } from '../chem/quantum';
import { ConfigFiller, EnergyLevels, QuantumBuilder, SpinPauli } from '../viz/chem/OrbitalFigures';
import '../viz/chem/orbitals.css';

const t = String.raw;

/** Table 6.2 of the lecture (slide 15): relationship among n, ℓ and m_ℓ through n = 4. */
function Table62() {
  return (
    <div className="ob-table-wrap">
      <table className="ob-table">
        <thead>
          <tr>
            <th><M>n</M></th><th><M>\ell</M></th><th><T de="Unterschale" en="subshell" /></th><th><M>{t`m_\ell`}</M></th>
            <th><T de="Orb. je Unterschale" en="orbitals per subshell" /></th><th><T de="Orb. je Schale" en="orbitals per shell" /></th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].flatMap((n) => allowedL(n).map((l) => (
            <tr key={`${n}${l}`} className={l === 0 ? 'first' : ''}>
              <td>{l === 0 ? <M>{`${n}`}</M> : null}</td>
              <td><M>{`${l}`}</M></td>
              <td><M>{`${n}\\mathrm{${subshellLetter(l)}}`}</M></td>
              <td><M>{allowedMl(l).slice().reverse().join(',\\,')}</M></td>
              <td><M>{`${orbitalsInSubshell(l)}`}</M></td>
              <td>{l === 0 ? <M>{`${orbitalsInShell(n)}`}</M> : null}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}

export default function CH6Orbitale() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bohr hat die Elektronen auf Kreisbahnen gesetzt wie Planeten um die Sonne. Das stimmt nicht ganz. Die Quantenmechanik gibt keine Bahn an, sondern eine <b>Karte</b>: Wo ist das Elektron wahrscheinlich? Eine solche Karte heisst <b>Orbital</b>. Vier Zahlen beschreiben sie. Damit füllen wir am Ende das Periodensystem Elektron für Elektron.</p>}
        en={<p className="lede">Bohr put the electrons on circular paths like planets around the sun. That is not quite right. Quantum mechanics gives no path but a <b>map</b>: where is the electron likely to be? Such a map is called an <b>orbital</b>. Four numbers describe it. With them we fill the periodic table at the end, electron by electron.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir eine Biene vor, die um eine Blume fliegt. Mit einem einzigen Foto siehst du nur einen Punkt. Machst du tausend Fotos und legst sie übereinander, entsteht eine Wolke: dicht nahe an der Blume, dünn weiter weg. Genau so zeigt ein Orbital, wo das Elektron «meistens» ist. Wir können die Biene nie genau verfolgen, nur die Wolke kennen.</p>}
          en={<p>Imagine a bee flying around a flower. A single photo shows only one dot. Take a thousand photos and lay them on top of each other, and a cloud appears: dense near the flower, thin farther away. This is exactly how an orbital shows where the electron is “mostly”. We can never follow the bee exactly, we can only know the cloud.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="karte" title={<T de="1. Orbital: eine Karte statt einer Bahn" en="1. Orbital: a map instead of a path" />}>
        <Box kind="lecture" src={<Src lec={6} p="13, 16" />} title={<T de="Was die Quantenmechanik sagt" en="Quantum mechanics says" />}>
          <T
            de={<ul>
              <li>Die Bewegung des Elektrons wird durch seine <b>Wellenfunktion</b> beschrieben (Folie: «eine Funktion, die eine <i>Karte</i> liefert, wo das Elektron ist, unter den Bedingungen der Unschärferelation»).</li>
              <li>Wegen der Unschärferelation kennen wir nur Wahrscheinlichkeiten («zum Beispiel die Wahrscheinlichkeit, das Elektron in einem bestimmten Gebiet zu finden»).</li>
              <li>Bohr-Bahnen werden zu <b>Atomorbitalen</b>.</li>
              <li>Handschriftlich (Folie 16): «Konturplots: Das Elektron liegt innerhalb der Fläche mit einer bestimmten hohen Wahrscheinlichkeit (z. B. 90&nbsp;%)»; «Elektronendichte-Plot».</li>
            </ul>}
            en={<ul>
              <li>Electron motion is described by its <b>wavefunction</b> (slide: “function that gives a ‘map’ of where the electron is, given constraints of the Uncertainty Principle”).</li>
              <li>Due to the Uncertainty Principle we only know probabilities (“for example, the probability that the electron is in a certain region”).</li>
              <li>Bohr orbits become <b>atomic orbitals</b>.</li>
              <li>Handwritten (slide 16): “Contour plots. Electron is inside surface with specified high probability (e.g. 90&nbsp;%)”; “electron density plot”.</li>
            </ul>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={6} p="5" />} title={<T de="Neues Atommodell (Übung 6)" en="New atomic model (exercise class 6)" />}>
          <T
            de={<p>Die Unschärferelation: <M p=".">{t`\Delta x\cdot\Delta p \ge \frac{h}{4\pi}`}</M> «Statt fester Bahnen sind Elektronen in Gebieten um den Kern, wo wir eine 90&nbsp;%-Chance haben, das Elektron zu finden. Jeder Punkt steht für eine mögliche Elektronenposition.» Neues Modell: Elektronen besetzen verschiedene <b>Schalen</b> um den Kern; jede Schale enthält <b>Unterschalen</b> (s, p, d, f), das sind Gruppen von Orbitalen; jedes <b>Orbital</b> fasst höchstens zwei Elektronen.</p>}
            en={<p>The uncertainty principle: <M p=".">{t`\Delta x\cdot\Delta p \ge \frac{h}{4\pi}`}</M> “Instead of fixed paths, electrons are in regions around the nucleus where we have a 90&nbsp;% chance of finding the electron. Each dot symbolises a potential electron position.” New model: electrons occupy different <b>shells</b> around the nucleus; each shell contains <b>subshells</b> (s, p, d, f), which are groups of orbitals; each <b>orbital</b> can hold a maximum of two electrons.</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Ort <M>x</M> und Impuls <M>p</M> (Masse mal Geschwindigkeit) kann man nicht beide beliebig genau kennen. Das Produkt der Unschärfen <M>{t`\Delta x`}</M> und <M>{t`\Delta p`}</M> ist mindestens <M p=".">{t`h/4\pi`}</M> Wer den Ort genauer festlegt, verliert Wissen über die Geschwindigkeit. Darum gibt es keine scharfe Bahn.</li>
              <li>Was man angeben kann, ist die Wahrscheinlichkeit, das Elektron in einem Gebiet zu finden. Die Wellenfunktion <M>{t`\psi`}</M> liefert sie: Das Quadrat <M>{t`\psi^2`}</M> ist die Dichte der Karte.</li>
              <li>Die gezeichnete Fläche ist eine Konvention: Sie umschliesst 90&nbsp;% der Karte. Das Elektron ist <em>innerhalb</em> dieser Fläche, nicht <em>auf</em> ihr.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>Position <M>x</M> and momentum <M>p</M> (mass times velocity) cannot both be known arbitrarily well. The product of the uncertainties <M>{t`\Delta x`}</M> and <M>{t`\Delta p`}</M> is at least <M p=".">{t`h/4\pi`}</M> If you pin down the position more precisely, you lose knowledge of the velocity. This is why there is no sharp path.</li>
              <li>What you can state is the probability of finding the electron in a region. The wave function <M>{t`\psi`}</M> provides it: the square <M>{t`\psi^2`}</M> is the density of the map.</li>
              <li>The drawn surface is a convention: it encloses 90&nbsp;% of the map. The electron is <em>inside</em> this surface, not <em>on</em> it.</li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="quantenzahlen" title={<T de="2. Die vier Quantenzahlen und die Formen der Orbitale" en="2. The four quantum numbers and the shapes of orbitals" />}>
        <Box kind="lecture" src={<Src lec={6} p="13–15" />} title={<T de="Orbitale werden durch vier Zahlen beschrieben" en="Orbitals are described by four numbers" />}>
          <MD>{t`n,\ \ell,\ m_\ell,\ m_s`}</MD>
          <T
            de={<ul>
              <li><b>Hauptquantenzahl</b> <M>n</M> <M>\Rightarrow</M> <M p=",">{t`1, 2, 3, \dots`}</M> wie im Bohr-Modell. <M>n</M> heisst «Schale» und bestimmt die Grösse des Orbitals.</li>
              <li><b>Drehimpuls-Quantenzahl</b> <M>{t`\ell`}</M> <M>\Rightarrow</M> ganze Zahlen von <M>0</M> bis <M p=".">{t`n - 1`}</M> Der Bereich von <M>{t`\ell`}</M> hängt von <M>n</M> ab. <M>{t`\ell`}</M> heisst «Unterschale» und bestimmt die <em>Form</em>. Konvention: <M>{t`\ell = 0, 1, 2, 3`}</M> heisst s, p, d, f (handschriftlich: «sharp», «principal», «diffuse», «fundamental»; die Buchstaben stammen aus der Zeit der Spektrallinien).</li>
              <li><b>Magnetische Quantenzahl</b> <M>{t`m_\ell`}</M> <M>\Rightarrow</M> <M p=".">{t`-\ell, -\ell+1, \dots, 0, \dots, \ell-1, \ell`}</M> Der Bereich hängt von <M>{t`\ell`}</M> ab. <M>{t`m_\ell`}</M> bestimmt die <em>Orientierung</em> des Orbitals im Raum.</li>
              <li><b>Spin-Quantenzahl</b> <M p=":">{t`m_s`}</M> siehe Abschnitt 3.</li>
            </ul>}
            en={<ul>
              <li><b>Principal quantum number</b> <M>n</M> <M>\Rightarrow</M> <M p=",">{t`1, 2, 3, \dots`}</M> same as in the Bohr model. <M>n</M> is called “shell” and sets the size of the orbital.</li>
              <li><b>Angular quantum number</b> <M p=".">{t`\ell`}</M> <M>\Rightarrow</M> integers between <M>0</M> and <M p=".">{t`n - 1`}</M> The range of <M>{t`\ell`}</M> depends on <M>n</M> <M>{t`\ell`}</M> is called “subshell” and gives the <em>shape</em>. By convention <M>{t`\ell = 0, 1, 2, 3`}</M> are s, p, d, f (handwritten: “sharp”, “principal”, “diffuse”, “fundamental”; the letters come from the early days of describing atomic emission lines).</li>
              <li><b>Magnetic quantum number</b> <M p=".">{t`m_\ell`}</M> <M>\Rightarrow</M> <M p=".">{t`-\ell, -\ell+1, \dots, 0, \dots, \ell-1, \ell`}</M> The range depends on <M>{t`\ell`}</M> <M>{t`m_\ell`}</M> relates to the <em>orientation</em> of the orbital in space.</li>
              <li><b>Spin magnetic quantum number</b> <M p=":">{t`m_s`}</M> see section 3.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Regeln:</b> Stell dir ein Hochhaus vor.</p>
            <ol className="keep">
              <li><M>n</M> ist das Stockwerk (Schale). Je höher, desto grösser die Wohnungen (Orbitale).</li>
              <li><M>{t`\ell`}</M> ist die Art der Wohnung auf dem Stockwerk (Unterschale). Im Stockwerk <M>n</M> gibt es genau <M>n</M> Arten: <M>{t`\ell = 0`}</M> bis <M p=".">{t`n-1`}</M> Im ersten Stock nur s, im zweiten s und p, im dritten s, p und d.</li>
              <li><M p=",">{t`m_\ell`}</M> nummeriert die Zimmer einer Art: von <M p=",">{t`-\ell`}</M> bis <M p=",">{t`+\ell`}</M> also <M>{t`2\ell+1`}</M> Stück. s hat <M>1</M> Orbital, p hat <M>3</M> d hat <M>5</M> f hat <M p=".">7</M></li>
              <li>Zählt man alle Zimmer eines Stockwerks, ist das Ergebnis immer <M p=".">{t`n^2`}</M> Das steht in der Tabelle (letzte Spalte).</li>
            </ol>
            <p>Die Tabelle von Folie 15:</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the rules:</b> Imagine a tall building.</p>
            <ol className="keep">
              <li><M>n</M> is the floor (shell). The higher up, the bigger the flats (orbitals).</li>
              <li><M>{t`\ell`}</M> is the kind of flat on that floor (subshell). Floor <M>n</M> has exactly <M>n</M> kinds: <M>{t`\ell = 0`}</M> to <M p=".">{t`n-1`}</M> The first floor has only s, the second s and p, the third s, p and d.</li>
              <li><M p=",">{t`m_\ell`}</M> numbers the rooms of one kind: from <M p=",">{t`-\ell`}</M> to <M p=",">{t`+\ell`}</M> so <M>{t`2\ell+1`}</M> of them. s has <M>1</M> orbital, p has <M>3</M> d has <M>5</M> f has <M p=".">7</M></li>
              <li>If you count all rooms of a floor, the result is always <M p=".">{t`n^2`}</M> It is in the table (last column).</li>
            </ol>
            <p>The table of slide 15:</p>
          </>}
        />
        <Box kind="lecture" src={<Src lec={6} p="15" />} title={<T de={<>Tabelle 6.2: Beziehung zwischen <M p=",">n</M> <M p=",">{t`\ell`}</M> und <M>{t`m_\ell`}</M></>} en={<>Table 6.2: relationship among <M>n</M> <M>{t`\ell`}</M> and <M>{t`m_\ell`}</M></>} />}>
          <Table62 />
        </Box>
        <T
          de={<p className="keep">Jetzt zu den Formen (Folien 16–18). Wähle im Bild oben die Schale <M>n</M> und klicke auf ein Kästchen: Jedes Kästchen ist ein Orbital, die Zahl darin ist <M p=".">{t`m_\ell`}</M> Rechts siehst du den Schnitt durch das Orbital. Dunkel heisst: Hier ist das Elektron wahrscheinlich. Die Linie umschliesst 90&nbsp;% der Karte. Die zwei Pfeile im Kästchen erinnern an den Spin (Abschnitt 3).</p>}
          en={<p className="keep">Now the shapes (slides 16–18). In the figure choose the shell <M>n</M> and click a box: each box is one orbital, the number inside is <M p=".">{t`m_\ell`}</M> On the right you see a cross-section of the orbital. Dark means: the electron is likely here. The line encloses 90&nbsp;% of the map. The two arrows in the box remind you of the spin (section 3).</p>}
        />
        <QuantumBuilder />
        <Box kind="lecture" src={<Src lec={6} p="16–18" />} title={<T de="Orbitale sichtbar gemacht" en="Visualizing atomic orbitals" />}>
          <T
            de={<ul>
              <li><b>s-Orbitale</b> (<M p=")">{t`\ell = 0`}</M> sind kugelförmig; die Grösse wächst mit <M>n</M> (1s, 2s, 3s). <M>{t`m_\ell = 0`}</M> für alle s-Orbitale. Grauer Kasten: «Sinnvoll! Eine Kugel hat nur eine mögliche Orientierung.»</li>
              <li><b>p-Orbitale</b> (<M p=")">{t`\ell = 1`}</M> haben «Hantelform» mit zwei Keulen: <M p=",">{t`p_z`}</M> <M p=",">{t`p_x`}</M> <M p=".">{t`p_y`}</M> <M>{t`m_\ell = -1, 0, +1`}</M> steht für drei verschiedene Orientierungen.</li>
              <li><b>d-Orbitale</b> (<M p=")">{t`\ell = 2`}</M> haben «vierblättrige Kleeblätter» mit vier Keulen: <M p=",">{t`d_{yz}`}</M> <M p=",">{t`d_{xz}`}</M> <M p=",">{t`d_{xy}`}</M> <M p=",">{t`d_{x^2-y^2}`}</M> <M p=".">{t`d_{z^2}`}</M> <M>{t`m_\ell = -2, \dots, +2`}</M> steht für fünf Orientierungen.</li>
            </ul>}
            en={<ul>
              <li><b>s orbitals</b> (<M p=")">{t`\ell = 0`}</M> have spherical shapes; the size increases with <M>n</M> (1s, 2s, 3s). <M>{t`m_\ell = 0`}</M> for all s orbitals. Grey box: “Makes sense! Sphere only has one possible orientation.”</li>
              <li><b>p orbitals</b> (<M p=")">{t`\ell = 1`}</M> have “dumbbell” shapes with two lobes: <M p=",">{t`p_z`}</M> <M p=",">{t`p_x`}</M> <M p=".">{t`p_y`}</M> <M>{t`m_\ell = -1, 0, +1`}</M> represents three different orientations.</li>
              <li><b>d orbitals</b> (<M p=")">{t`\ell = 2`}</M> have “four-leaf clover” shapes with four lobes: <M p=",">{t`d_{yz}`}</M> <M p=",">{t`d_{xz}`}</M> <M p=",">{t`d_{xy}`}</M> <M p=",">{t`d_{x^2-y^2}`}</M> <M p=".">{t`d_{z^2}`}</M> <M>{t`m_\ell = -2, \dots, +2`}</M> represents five orientations.</li>
            </ul>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Woher die Bilder im Bild kommen" en="Where the pictures in the figure come from" />}>
          <T
            de={<>
              <p>Die Bilder der Folien stammen aus dem Lehrbuch (Brown). Die Schnitte im Bild oben haben wir selbst gerechnet, aus den exakten Wellenfunktionen des Wasserstoffatoms: <M p=",">{t`\psi_{n\ell m}(r,\theta,\varphi) = R_{n\ell}(r)\cdot Y(\theta,\varphi)`}</M> dargestellt wird die Dichte <M p=",">{t`\psi^2`}</M> in einer Ebene durch den Kern. Es sind die reellen Formen (<M p=",">{t`p_x`}</M> <M>{t`d_{z^2}`}</M> …), die man im Lehrbuch zeichnet; sie sind Mischungen von Orbitalen mit <M>{t`+m_\ell`}</M> und <M p=".">{t`-m_\ell`}</M></p>
              <p>Die Linie ist die 90&nbsp;%-Fläche: Die Fläche, innerhalb deren (im ganzen Raum) 90&nbsp;% der Wahrscheinlichkeit liegen. Die Länge <M>{t`a_0 \approx 53\ \mathrm{pm}`}</M> ist der Bohr-Radius. Ein Beispiel für die Zahl der Knoten: Beim 2s-Orbital gibt es einen Ring ohne Elektronendichte (ein radialer Knoten). Bei 3s sind es zwei. Das ist <M p=".">{t`n-\ell-1`}</M></p>
              <p>Für ein Atom mit mehreren Elektronen sehen die Orbitale ähnlich aus, aber etwas anders skaliert: Das Bild zeigt nur Wasserstoff.</p>
            </>}
            en={<>
              <p>The pictures on the slides come from the textbook (Brown). The cross-sections in the figure above were calculated by us from the exact wave functions of the hydrogen atom: <M p=",">{t`\psi_{n\ell m}(r,\theta,\varphi) = R_{n\ell}(r)\cdot Y(\theta,\varphi)`}</M> shown is the density <M p=",">{t`\psi^2`}</M> in a plane through the nucleus. They are the real forms (<M p=",">{t`p_x`}</M> <M>{t`d_{z^2}`}</M> …) that textbooks draw; they are mixtures of orbitals with <M>{t`+m_\ell`}</M> and <M p=".">{t`-m_\ell`}</M></p>
              <p>The line is the 90&nbsp;% surface: the surface inside which (in the whole space) 90&nbsp;% of the probability lies. The length <M>{t`a_0 \approx 53\ \mathrm{pm}`}</M> is the Bohr radius. An example for the number of nodes: the 2s orbital has one ring without electron density (a radial node). The 3s has two. That is <M p=".">{t`n-\ell-1`}</M></p>
              <p>For an atom with several electrons the orbitals look similar, but scaled somewhat differently: the figure shows hydrogen only.</p>
            </>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={6} p="9" />} title={<T de="Aufgabe 6: Welche Quantenzahlen gehören zu einem d-Orbital?" en="Problem 6: which quantum numbers belong to a d orbital?" />}>
          <T
            de={<p>Das Bild zeigt ein <M>{t`d_{xy}`}</M>-Orbital. (a) Kleinstes <M p=":">n</M> ein d-Orbital braucht <M p=",">{t`\ell = 2`}</M> und <M>{t`\ell`}</M> geht höchstens bis <M p=",">{t`n-1`}</M> also <M p=".">{t`n \ge 3`}</M> (b) <M p=":">{t`\ell = 2`}</M> die Unterschale d. (c) Grösstes <M>{t`m_\ell`}</M> <M p=".">{t`m_\ell = \{-2, -1, 0, 1, 2\}`}</M> also <M p=".">2</M></p>}
            en={<p>The picture shows a <M>{t`d_{xy}`}</M> orbital. (a) Smallest <M p=":">n</M> a d orbital needs <M p=",">{t`\ell = 2`}</M> and <M>{t`\ell`}</M> goes at most up to <M p=",">{t`n-1`}</M> so <M p=".">{t`n \ge 3`}</M> (b) <M p=":">{t`\ell = 2`}</M> the subshell d. (c) Largest <M>{t`m_\ell`}</M> <M p=",">{t`m_\ell = \{-2, -1, 0, 1, 2\}`}</M> so <M p=".">2</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="spin" title={<T de="3. Spin und das Pauli-Prinzip" en="3. Spin and the Pauli principle" />}>
        <Box kind="lecture" src={<Src lec={6} p="20–22" />} title={<T de="Die letzte Quantenzahl" en="Last quantum number" />}>
          <T
            de={<>
              <p><b>Spin-Quantenzahl</b> <M p=":">{t`m_s`}</M></p>
              <ul>
                <li>Hat einen von zwei Werten: <M>{t`+1/2`}</M> oder <M p=".">{t`-1/2`}</M> «Spin up» oder «Spin down».</li>
                <li>Ein rotierender elektrischer Strom erzeugt einen Magneten. Elektronen verhalten sich, <em>als ob</em> sie sich drehten. Man kann das Magnetfeld des Elektrons messen. Aber es dreht sich nicht wirklich! Es gibt nur zwei mögliche Spin-Orientierungen: ein «Ergebnis der Quantenmechanik».</li>
              </ul>
              <p><b>Pauli-Prinzip</b> (Folie 22): Das Atom hat eine bestimmte Zahl von Elektronen. Von unten nach oben auffüllen. Zwei Elektronen in jedem Kästchen (wegen des Spins), eines mit Spin up, eines mit Spin down. Oder: ein Elektron für jeden bestimmten Satz <M p=".">{t`n, \ell, m_\ell, m_s`}</M> Keine zwei Elektronen können denselben Satz <M>{t`n, \ell, m_\ell, m_s`}</M> haben.</p>
            </>}
            en={<>
              <p><b>Spin magnetic quantum number</b> <M p=":">{t`m_s`}</M></p>
              <ul>
                <li>Has one of two values: <M>{t`+1/2`}</M> or <M p=".">{t`-1/2`}</M> Spin “up” or spin “down”.</li>
                <li>Rotating electrical current creates a magnet. Electrons behave <em>as if</em> they were spinning. One can measure the magnetic field of an electron. But it is not really spinning! There are only two possible spin orientations: an “outcome of quantum mechanics”.</li>
              </ul>
              <p><b>Pauli Exclusion Principle</b> (slide 22): the atom has a given number of electrons. Fill from bottom up. Two electrons in each box (due to spin), spin up and spin down in each box. Or: one electron for each specific <M p=".">{t`n, \ell, m_\ell, m_s`}</M> No two electrons can have the same set of <M p=".">{t`n, \ell, m_\ell, m_s`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Der Spin ist wie ein winziger Stabmagnet am Elektron. Er kann nur nach oben oder nach unten zeigen. Mehr gibt es nicht. Das Bild links zeigt die zwei Fälle.</li>
              <li>Ein Orbital (ein Kästchen) legt <M p=",">n</M> <M>{t`\ell`}</M> und <M>{t`m_\ell`}</M> fest. Bleibt für das Elektron nur noch <M p=".">{t`m_s`}</M> Zwei Werte, also höchstens zwei Elektronen pro Kästchen.</li>
              <li>Zwei Elektronen im selben Kästchen müssen deshalb entgegengesetzten Spin haben (<M p=").">{t`\uparrow\downarrow`}</M> Zwei mit gleichem Spin (<M p=")">{t`\uparrow\uparrow`}</M> hätten denselben Satz von vier Zahlen. Das verbietet das Pauli-Prinzip.</li>
            </ol>
            <p>Daraus folgt die Platzrechnung: s hat 1 Kästchen und fasst 2 Elektronen, p hat 3 und fasst 6, d hat 5 und fasst 10, f hat 7 und fasst 14. Eine ganze Schale <M>n</M> fasst <M p=".">{t`2n^2`}</M> Das steht im Bild oben unter den Kästchen.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>The spin is like a tiny bar magnet on the electron. It can only point up or down. There is nothing else. The figure on the left shows the two cases.</li>
              <li>An orbital (one box) fixes <M p=",">n</M> <M p=".">{t`\ell`}</M> and <M>{t`m_\ell`}</M> For the electron only <M>{t`m_s`}</M> remains. Two values, so at most two electrons per box.</li>
              <li>Two electrons in the same box must therefore have opposite spin (<M p=").">{t`\uparrow\downarrow`}</M> Two with the same spin (<M p=")">{t`\uparrow\uparrow`}</M> would have the same set of four numbers. The Pauli principle forbids that.</li>
            </ol>
            <p>The counting follows: s has 1 box and holds 2 electrons, p has 3 and holds 6, d has 5 and holds 10, f has 7 and holds 14. A whole shell <M>n</M> holds <M p=".">{t`2n^2`}</M> This is shown in the figure above below the boxes.</p>
          </>}
        />
        <SpinPauli />
        <Box kind="uebung" src={<Src ex={6} p="6" />} title={<T de="Übung 6: die Quantenzahlen und Pauli" en="Exercise class 6: quantum numbers and Pauli" />}>
          <T
            de={<p>4) Spin-Quantenzahl <M p=":">{t`m_s`}</M> «Die zwei Elektronen in einem Orbital sind nicht gleich; <M>{t`m_s`}</M> unterscheidet sie» <M p=".">{t`m_s = \{-\tfrac12, \tfrac12\}`}</M> Pauli-Prinzip: «Jedes Elektron in einem Atom muss einen eindeutigen Satz von Quantenzahlen haben.» Bild: s fasst 2 Elektronen, p 6, d 10, f 14.</p>}
            en={<p>4) Spin magnetic quantum number <M p=":">{t`m_s`}</M> “the two electrons in an orbital are not the same, <M>{t`m_s`}</M> distinguishes them” <M p=".">{t`m_s = \{-\tfrac12, \tfrac12\}`}</M> Pauli’s exclusion principle: “each electron in an atom must have a unique set of quantum numbers.” Picture: s holds 2 electrons, p 6, d 10, f 14.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="energie" title={<T de="4. Die Energie der Orbitale" en="4. The energy of orbitals" />}>
        <Box kind="lecture" src={<Src lec={6} p="19, 22" />} title={<T de="Energie im Wasserstoffatom und in Mehrelektronenatomen" en="Energy in hydrogen and in multielectron atoms" />}>
          <T
            de={<>
              <p><b>Wasserstoff</b> (Folie 19): Wasserstoff hat ein Elektron. Ist es im tiefsten Niveau 1s: Grundzustand. Ist es höher: angeregter Zustand. Die Energie hängt nur von <M>n</M> ab. 2s und 2p haben dieselbe Energie. 3s, 3p, 3d haben dieselbe Energie. Jedes Kästchen im Diagramm gehört zu einem bestimmten <M p=".">{t`n, \ell, m_\ell`}</M> «Wie ist es bei Mehrelektronenatomen?»</p>
              <p><b>Jenseits von Wasserstoff</b> (Folie 22): Die Energie verschiedener Unterschalen innerhalb derselben Schale ist jetzt verschieden, weil sich die Elektronen gegenseitig abstossen. Bei gegebenem <M p=":">n</M> <M p=".">{t`s < p < d < f`}</M> «Reihenfolge der Unterschalen?»</p>
            </>}
            en={<>
              <p><b>Hydrogen</b> (slide 19): hydrogen has one electron. If it is in the lowest 1s level: ground state. If in a higher level: excited state. Energy only depends on <M p=".">n</M> 2s, 2p have the same energy. 3s, 3p, 3d have the same energy. Each box in the diagram is specific <M p=".">{t`n, \ell, m_\ell`}</M> “What about multielectron atoms?”</p>
              <p><b>Beyond hydrogen</b> (slide 22): the energy of different subshells within the same shell is now different, due to the electrons repelling each other. For given <M p=":">n</M> <M p=".">{t`s < p < d < f`}</M> “Order of subshells?”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das Bild:</b></p>
            <ol className="keep">
              <li>Wasserstoff: Nur ein Elektron, es spürt nur den Kern. Dann zählt allein, wie weit weg es ist, also <M p=".">n</M> Alle Kästchen einer Schale liegen gleich hoch. Die Formel dazu aus der Übung: <M p=".">{t`E_n = -R_H/n^2`}</M></li>
              <li>Mehrelektronenatom: Die anderen Elektronen stossen ab. Wie stark, hängt davon ab, wie nah ein Elektron dem Kern kommt. Ein s-Elektron dringt im Mittel am nächsten heran, ein p-Elektron weniger, ein d-Elektron noch weniger. Die Übung sagt es so (genauer ist es die «Durchdringung», siehe die Lektion zur Abschirmung, CH-601): Der mittlere Abstand wächst, <M p=",">{t`\Delta x_s < \Delta x_p < \Delta x_d < \Delta x_f`}</M> und damit steigt die Energie, <M p=".">{t`E_s < E_p < E_d < E_f`}</M></li>
              <li>Darum liegt 4s <em>unter</em> 3d. Das Bild schaltet zwischen beiden Fällen um. Auf der nächsten Lektion (Abschirmung) wird dieser Grund genauer erklärt.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the figure:</b></p>
            <ol className="keep">
              <li>Hydrogen: only one electron, it feels only the nucleus. Then only its distance counts, that is, <M p=".">n</M> All boxes of a shell lie at the same height. The formula from the exercise class: <M p=".">{t`E_n = -R_H/n^2`}</M></li>
              <li>Multielectron atom: the other electrons repel. How strongly depends on how close an electron comes to the nucleus. An s electron comes closest on average, a p electron less, a d electron even less. The exercise class says it this way (more precisely it is “penetration”, see the lesson on screening, CH-601): the average distance grows, <M p=",">{t`\Delta x_s < \Delta x_p < \Delta x_d < \Delta x_f`}</M> and so the energy rises, <M p=".">{t`E_s < E_p < E_d < E_f`}</M></li>
              <li>This is why 4s lies <em>below</em> 3d. The figure switches between the two cases. The next lesson (screening) explains this reason in more detail.</li>
            </ol>
          </>}
        />
        <EnergyLevels />
        <Box kind="uebung" src={<Src ex={6} p="3, 8" />} title={<T de="Energie in den Übungen" en="Energy in the exercise classes" />}>
          <T
            de={<p>Bohr-Modell (S. 3): <M p=",">{t`E_n = -\dfrac{h\,c\,R_H}{n^2}`}</M> <M>{t`R_H`}</M> ist die Rydberg-Konstante, <M p=".">{t`1{,}097\cdot 10^7\ \mathrm{m^{-1}}`}</M> «Je näher das Elektron beim Kern, desto kleiner <M p=".">E</M>» S. 8: «Für Unterschalen derselben Schale gilt <M p=".">{t`E_s < E_p < E_d < E_f`}</M> Der Grund, dass 4s vor 3d gefüllt wird: Die potentielle Energie von 4s ist tiefer.»</p>}
            en={<p>Bohr model (p. 3): <M p=",">{t`E_n = -\dfrac{h\,c\,R_H}{n^2}`}</M> <M>{t`R_H`}</M> is the Rydberg constant, <M p=".">{t`1.097\cdot 10^7\ \mathrm{m^{-1}}`}</M> “The closer the electron to the nucleus, the smaller <M p=".">E</M>” p. 8: “For subshells in the same shell, <M p=".">{t`E_s < E_p < E_d < E_f`}</M> The reason for filling the 4s before the 3d orbital is that the potential energy of 4s is lower.”</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="konfiguration" title={<T de="5. Elektronenkonfiguration: das Periodensystem lesen" en="5. Electron configuration: reading the periodic table" />}>
        <Box kind="lecture" src={<Src lec={6} p="23–25" />} title={<T de="Reihenfolge der Unterschalen" en="Order of subshells" />}>
          <T
            de={<>
              <p><b>Benutze das Periodensystem.</b> «Wenn du dich erinnern kannst: s hat 2, p hat 6, d hat 10, f hat 14.» Die Folien zeigen das Periodensystem als Block-Karte: s-Orbitale (blau), p-Orbitale (rosa), d-Orbitale (orange, Übergangsmetalle), f-Orbitale (beige, f-Block). Zeilen: 1s, 2s, 3s, 4s, 5s, 6s, 7s; 2p, 3p, …; 3d, 4d, 5d, 6d; 4f, 5f. Rot: «Für jedes Element im Periodensystem können wir also schreiben …»</p>
              <p><b>Elektronenkonfigurationen</b> (Folie 25, Tabelle 6.3): Li <M p=";">{t`1s^2\,2s^1`}</M> Be <M p=";">{t`1s^2\,2s^2`}</M> B <M p=";">{t`1s^2\,2s^2\,2p^1`}</M> C <M p=";">{t`1s^2\,2s^2\,2p^2`}</M> N <M p=";">{t`1s^2\,2s^2\,2p^3`}</M> Ne <M p=";">{t`1s^2\,2s^2\,2p^6`}</M> Na <M p=".">{t`1s^2\,2s^2\,2p^6\,3s^1`}</M> Handschriftlich: «<M>{t`\uparrow`}</M> = Spin up, <M>{t`\downarrow`}</M> = Spin down. Wir benutzen die <b>Hund-Regel</b>: Wenn wir in einer Unterschale die Wahl haben, setzen wir die Elektronen zuerst in getrennte «Kästchen» (mit parallelem Spin), bevor wir sie «paaren».»</p>
            </>}
            en={<>
              <p><b>Use the periodic table.</b> “If you can remember: s has 2, p has 6, d has 10, f has 14.” The slides show the periodic table as a block map: s orbitals (blue), p orbitals (pink), d orbitals (orange, transition metals), f orbitals (beige, f-block metals). Rows: 1s, 2s, 3s, 4s, 5s, 6s, 7s; 2p, 3p, …; 3d, 4d, 5d, 6d; 4f, 5f. Red: “So for any element in the periodic table we can write …”</p>
              <p><b>Electron configurations</b> (slide 25, Table 6.3): Li <M p=";">{t`1s^2\,2s^1`}</M> Be <M p=";">{t`1s^2\,2s^2`}</M> B <M p=";">{t`1s^2\,2s^2\,2p^1`}</M> C <M p=";">{t`1s^2\,2s^2\,2p^2`}</M> N <M p=";">{t`1s^2\,2s^2\,2p^3`}</M> Ne <M p=";">{t`1s^2\,2s^2\,2p^6`}</M> Na <M p=".">{t`1s^2\,2s^2\,2p^6\,3s^1`}</M> Handwritten: “<M>{t`\uparrow`}</M> = spin up, <M>{t`\downarrow`}</M> = spin down. We are using <b>Hund’s rule</b>: if we have a choice of placing electron in a subshell, we place the electrons in separate ‘boxes’ first (with spins parallel) before ‘pairing up’ the electrons.”</p>
            </>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={6} p="7–8" />} title={<T de="Konfiguration schreiben und Kästchen füllen" en="Writing a configuration and filling boxes" />}>
          <T
            de={<>
              <p>Schreibweise: <M p=",">{t`n\,\ell^{\,\#e^-}`}</M> also Schale, Unterschale, Zahl der Elektronen in der Unterschale. Reihenfolge:</p>
              <MD>{t`1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^{10}\,4p^6\,5s^2\,4d^{10}\,5p^6\,6s^2\,4f^{14}\dots`}</MD>
              <p>«bis alle Elektronen eingefüllt sind». Kurzschreibweise: «Je weiter unten im Periodensystem, desto länger wird es. Setze das Edelgas der Zeile darüber ein.»</p>
              <p>Aufgabe 4: H: <M p=";">{t`1s^1`}</M> He: <M p=";">{t`1s^2`}</M> Li: <M p=";">{t`1s^2\,2s^1`}</M> C: <M p=";">{t`1s^2\,2s^2\,2p^2`}</M> Se: <M p=";">{t`[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^4`}</M> Mg: <M p=".">{t`[\mathrm{Ne}]\,3s^2`}</M></p>
              <p><b>Hund-Regel</b> (S. 8): «Jedes Orbital in einer Unterschale wird zuerst einzeln mit Elektronen gleichen Spins besetzt, bevor ein Orbital doppelt besetzt wird.» Aufgabe 5, Sauerstoff, mit Kästchen für je zwei Elektronen: (1) alle relevanten Orbitale zeichnen: 1s, 2s und drei 2p; (2) 1s und 2s füllen; (3) die 2p-Unterschale einzeln füllen, gleicher Spin; (4) die übrigen Elektronen doppelt einfüllen. «Ungepaarte Elektronen» sind die Elektronen einzeln besetzter Orbitale.</p>
            </>}
            en={<>
              <p>Notation: <M p=",">{t`n\,\ell^{\,\#e^-}`}</M> that is shell, subshell, number of electrons in the subshell. Order:</p>
              <MD>{t`1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^{10}\,4p^6\,5s^2\,4d^{10}\,5p^6\,6s^2\,4f^{14}\dots`}</MD>
              <p>“until all electrons are filled in”. Condensed notation: “the further down you go in the periodic table, the longer it gets. Plug in the noble gas from one row up.”</p>
              <p>Problem 4: H: <M p=";">{t`1s^1`}</M> He: <M p=";">{t`1s^2`}</M> Li: <M p=";">{t`1s^2\,2s^1`}</M> C: <M p=";">{t`1s^2\,2s^2\,2p^2`}</M> Se: <M p=";">{t`[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^4`}</M> Mg: <M p=".">{t`[\mathrm{Ne}]\,3s^2`}</M></p>
              <p><b>Hund’s rule</b> (p. 8): “every orbital in a subshell is singly filled with electrons that have the same spin before an orbital is doubly occupied.” Problem 5, oxygen, with boxes that hold two electrons each: (1) draw all relevant orbitals: 1s, 2s and three 2p; (2) fill the 1s and 2s subshells; (3) singly fill the 2p subshell, same spin; (4) doubly fill the remaining electrons. “Unpaired electrons” are the electrons of singly filled orbitals.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Du füllst das Periodensystem wie einen Bücherschrank, Regal für Regal von links nach rechts.</p>
            <ol className="keep">
              <li>Jedes Element ist ein Feld. Jedes Feld bekommt ein Elektron mehr als das vorige. Die Blöcke im Periodensystem sind die Unterschalen: Die zwei linken Spalten sind der s-Block (2 Plätze pro Zeile), rechts der p-Block (6), in der Mitte der d-Block (10).</li>
              <li>Wenn du ein Element suchst, zähle von Wasserstoff aus Feld für Feld. Die Zeile sagt dir die Schale, der Block die Unterschale. So ist Selen (Zeile 4, p-Block, viertes Feld im p-Block) bei <M p=".">{t`4p^4`}</M></li>
              <li>In jeder Unterschale gilt Hund: Zuerst bekommt jedes Kästchen ein Elektron mit Spin up, erst dann kommen die Spin-down-Elektronen dazu. Beim Sauerstoff: <M p=".">{t`2p^4`}</M> heisst: drei Kästchen je ein Pfeil nach oben, dann ein Pfeil nach unten im ersten. Zwei Elektronen bleiben ungepaart.</li>
              <li>Weil das bei den schweren Elementen lang wird, kürzt man ab: Das Edelgas der Zeile darüber steht für alle inneren Elektronen, zum Beispiel <M p=".">{t`[\mathrm{Ar}] = 1s^2\,2s^2\,2p^6\,3s^2\,3p^6`}</M></li>
            </ol>
            <p>Im Bild wählst du ein Element im Periodensystem (oder die Pfeile). Die Elemente bis dahin sind kräftig gefärbt. «Elektronen einfüllen» setzt sie nacheinander in die Kästchen. Das ist die Leiter der Folie 22, von unten nach oben.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b> You fill the periodic table like a bookcase, shelf by shelf from left to right.</p>
            <ol className="keep">
              <li>Every element is a cell. Each cell gets one electron more than the previous one. The blocks of the periodic table are the subshells: the two left columns are the s block (2 places per row), on the right the p block (6), in the middle the d block (10).</li>
              <li>If you look for an element, count from hydrogen cell by cell. The row tells you the shell, the block the subshell. So selenium (row 4, p block, fourth cell of the p block) is at <M p=".">{t`4p^4`}</M></li>
              <li>In every subshell Hund applies: first every box gets one electron with spin up, only then the spin-down electrons join. For oxygen: <M>{t`2p^4`}</M> means: three boxes with one arrow up each, then one arrow down in the first. Two electrons stay unpaired.</li>
              <li>Because this gets long for heavy elements, you abbreviate: the noble gas of the row above stands for all inner electrons, for example <M p=".">{t`[\mathrm{Ar}] = 1s^2\,2s^2\,2p^6\,3s^2\,3p^6`}</M></li>
            </ol>
            <p>In the figure you pick an element in the periodic table (or use the arrows). The elements up to there are strongly coloured. “Fill in the electrons” places them one after the other into the boxes. This is the ladder of slide 22, from bottom to top.</p>
          </>}
        />
        <ConfigFiller initial={8} />
        <Box kind="lecture" src={<Src lec={6} p="26" />} title={<T de="Valenzelektronen" en="Valence electrons" />}>
          <T
            de={<p><b>Elektronen in der äussersten Schale.</b> Beispiel Selen: <M p=".">{t`[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^4`}</M> Das «Edelgas-Core» ist <M p=".">{t`[\mathrm{Ar}]`}</M> «Valenzelektronen sind wichtig für Chemie und Bindung.» «Gefüllte d- oder f-Unterschalen werden nicht als Valenzelektronen gezählt.»</p>}
            en={<p><b>Electrons in outermost shell.</b> Example selenium: <M p=".">{t`[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^4`}</M> The “noble-gas core” is <M p=".">{t`[\mathrm{Ar}]`}</M> “Valence electrons are important for chemistry and bonding.” “Filled d or f subshells not considered valence electrons.”</p>}
          />
        </Box>
        <T
          de={<p>Selen: <M>{t`4s^2`}</M> und <M>{t`4p^4`}</M> machen <M p=",">6</M> die gefüllte <M>{t`3d^{10}`}</M> zählt nicht mit. Das passt: Selen steht in Gruppe 16. Wähle im Bild Selen: Die Zahl der Valenzelektronen steht unter der Konfiguration. Für die Hauptgruppen ist sie gleich der Gruppennummer (bei Gruppe 13 bis 18 minus 10).</p>}
          en={<p>Selenium: <M>{t`4s^2`}</M> and <M>{t`4p^4`}</M> make <M p=",">6</M> the filled <M>{t`3d^{10}`}</M> does not count. That fits: selenium is in group 16. Pick selenium in the figure: the number of valence electrons is shown below the configuration. For the main groups it equals the group number (minus 10 for groups 13 to 18).</p>}
        />
        <Box kind="lecture" src={<Src lec={6} p="27" />} title={<T de="Ausnahmen" en="Exceptions" />}>
          <T
            de={<p>«Fast halb gefüllte oder fast gefüllte d-Unterschalen.» Beispiele: Cr: <M p=";">{t`[\mathrm{Ar}]\,4s^1\,3d^5`}</M> Cu: <M p=".">{t`[\mathrm{Ar}]\,4s^1\,3d^{10}`}</M> Blau: «Nicht auswendig lernen! Nur wissen.» Die Folie zeigt das Periodensystem mit den Konfigurationen (Brown, S. 313).</p>}
            en={<p>“Nearly half-filled or nearly filled d-subshells.” Examples: Cr: <M p=";">{t`[\mathrm{Ar}]\,4s^1\,3d^5`}</M> Cu: <M p=".">{t`[\mathrm{Ar}]\,4s^1\,3d^{10}`}</M> Blue: “Don’t memorize! Just be aware.” The slide shows the periodic table with the configurations (Brown, p. 313).</p>}
          />
        </Box>
        <T
          de={<p>Warum? Eine halb gefüllte (<M p=")">{t`d^5`}</M> oder volle (<M p=")">{t`d^{10}`}</M> Unterschale ist für das Atom ein wenig günstiger. Weil <M>4s</M> und <M>3d</M> fast gleich hoch liegen, lohnt es sich, ein Elektron von 4s nach 3d zu schicken. (Diese Begründung steht nicht auf den Folien; sie sagen nur: «Nicht auswendig lernen».) Wähle Chrom oder Kupfer im Bild: Dort stimmt die einfache Regel nicht, und das Bild zeigt es. Auch Niob, Molybdän, Ruthenium, Rhodium, Palladium und Silber sind Ausnahmen, die auf den Folien nicht erwähnt werden; das Bild zeigt sie ebenfalls.</p>}
          en={<p>Why? A half-filled (<M p=")">{t`d^5`}</M> or full (<M p=")">{t`d^{10}`}</M> subshell is slightly more favourable for the atom. Because <M>4s</M> and <M>3d</M> lie almost at the same height, it pays to send one electron from 4s to 3d. (This reasoning is not on the slides; they only say: “Don’t memorize!”) Pick chromium or copper in the figure: there the simple rule fails, and the figure shows it. Niobium, molybdenum, ruthenium, rhodium, palladium and silver are exceptions too, not mentioned on the slides; the figure shows them as well.</p>}
        />
        <Box kind="uebung" src={<Src ex={6} p="9" />} title={<T de="Aufgabe 7: Gruppe und ungepaarte Elektronen" en="Problem 7: group and unpaired electrons" />}>
          <T
            de={<>
              <p>«Finde die Gruppe der Elemente zu den folgenden verallgemeinerten Konfigurationen und gib die Zahl der ungepaarten Elektronen an.»</p>
              <ul>
                <li>(a) <M p=":">{t`[\text{Edelgas}]\,ns^2\,np^5`}</M> <C>F</C> oder <C>Cl</C>, <M p=":">1</M> ungepaartes Elektron (<M>{t`np^5`}</M> zwei Paare und ein einzelnes).</li>
                <li>(b) <M p=":">{t`[\text{Edelgas}]\,ns^2\,(n-1)d^2`}</M> <C>Ti</C> oder <C>Zr</C>, <M p=":">2</M> ungepaarte (<M>{t`d^2`}</M> zwei Kästchen je ein Elektron).</li>
                <li>(c) <M p=":">{t`[\text{Edelgas}]\,ns^2\,(n-1)d^{10}\,np^1`}</M> <C>Ga</C> oder <C>In</C>, <M>1</M> ungepaartes.</li>
                <li>(d) <M p=":">{t`[\text{Edelgas}]\,ns^2\,(n-2)f^6`}</M> <C>Sm</C> oder <C>Pu</C>, <M p=":">6</M> ungepaarte (<M>{t`f^6`}</M> sechs von sieben Kästchen je ein Elektron).</li>
              </ul>
            </>}
            en={<>
              <p>“Identify the group of elements that corresponds to each of the following generalized electron configurations and indicate the number of unpaired electrons for each.”</p>
              <ul>
                <li>(a) <M p=":">{t`[\text{noble gas}]\,ns^2\,np^5`}</M> <C>F</C> or <C>Cl</C>, <M p=":">1</M> unpaired electron (<M>{t`np^5`}</M> two pairs and a single one).</li>
                <li>(b) <M p=":">{t`[\text{noble gas}]\,ns^2\,(n-1)d^2`}</M> <C>Ti</C> or <C>Zr</C>, <M p=":">2</M> unpaired (<M>{t`d^2`}</M> two boxes with one electron each).</li>
                <li>(c) <M p=":">{t`[\text{noble gas}]\,ns^2\,(n-1)d^{10}\,np^1`}</M> <C>Ga</C> or <C>In</C>, <M>1</M> unpaired.</li>
                <li>(d) <M p=":">{t`[\text{noble gas}]\,ns^2\,(n-2)f^6`}</M> <C>Sm</C> or <C>Pu</C>, <M p=":">6</M> unpaired (<M>{t`f^6`}</M> six of seven boxes with one electron each).</li>
              </ul>
            </>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Das Elektron kreist auf einer Bahn»" en="“The electron circles on a path”" />}>
          <T
            de={<p>Nein, das war Bohrs Bild. Ein Orbital ist eine Wahrscheinlichkeitskarte. Es gibt keine Bahn, nur ein Gebiet, in dem das Elektron mit 90&nbsp;% Wahrscheinlichkeit ist. In der Übung steht dazu die Wahr-oder-falsch-Aufgabe: «Das Elektron ist auf der Fläche» ist falsch, denn es ist <em>innerhalb</em> der Fläche.</p>}
            en={<p>No, that was Bohr’s picture. An orbital is a probability map. There is no path, only a region where the electron is with 90&nbsp;% probability. The exercise class has a true-or-false problem on this: “the electron is on the surface” is false, because it is <em>inside</em> the surface.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Spin heisst: das Elektron dreht sich»" en="“Spin means the electron rotates”" />}>
          <T
            de={<p>Die Folie sagt es deutlich: Elektronen verhalten sich, <em>als ob</em> sie sich drehten, aber sie drehen sich nicht wirklich. Spin ist eine Eigenschaft mit nur zwei möglichen Werten, <M p=".">{t`m_s = \pm\tfrac12`}</M></p>}
            en={<p>The slide says it clearly: electrons behave <em>as if</em> they were spinning, but they do not really spin. Spin is a property with only two possible values, <M p=".">{t`m_s = \pm\tfrac12`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Zuerst 3d, dann 4s»" en="“First 3d, then 4s”" />}>
          <T
            de={<p>Nach 3p kommt 4s, nicht 3d. Das Periodensystem zeigt es: Kalium und Calcium (4s) stehen vor Scandium (erstes 3d). Merke dir nicht die Reihenfolge der Schalen, sondern lies das Periodensystem. Auch <C>{'Cr'}</C> und <C>{'Cu'}</C> brechen die Regel: ein Elektron wandert von 4s nach 3d.</p>}
            en={<p>After 3p comes 4s, not 3d. The periodic table shows it: potassium and calcium (4s) come before scandium (first 3d). Do not memorise the order of shells, read the periodic table. <C>{'Cr'}</C> and <C>{'Cu'}</C> also break the rule: one electron moves from 4s to 3d.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Elektronen paaren sich sofort»" en="“Electrons pair up immediately”" />}>
          <T
            de={<p>Nein, Hund sagt: erst jedes Kästchen einzeln, dann paaren. Darum hat Stickstoff (<M p=")">{t`2p^3`}</M> drei ungepaarte Elektronen und Sauerstoff (<M p=")">{t`2p^4`}</M> zwei, nicht null und nicht eines.</p>}
            en={<p>No, Hund says: every box singly first, then pair up. This is why nitrogen (<M p=")">{t`2p^3`}</M> has three unpaired electrons and oxygen (<M p=")">{t`2p^4`}</M> has two, not none and not one.</p>}
          />
        </Box>
      </Section>

      <Box kind="key">
        <T
          de={<ul>
            <li>Ein Orbital ist eine Wahrscheinlichkeitskarte, keine Bahn. Die gezeichnete Fläche umschliesst etwa 90&nbsp;% der Karte.</li>
            <li>Vier Zahlen: <M>n</M> (Schale, Grösse), <M>{t`\ell`}</M> (Unterschale, Form; <M>0</M> bis <M>{t`n-1`}</M> heisst s, p, d, f), <M>{t`m_\ell`}</M> (Orientierung; <M>{t`-\ell`}</M> bis <M p="),">{t`+\ell`}</M> <M>{t`m_s`}</M> (Spin, <M p=").">{t`\pm\tfrac12`}</M></li>
            <li>Orbitale: s hat 1, p hat 3, d hat 5, f hat 7; eine Schale hat <M p=",">{t`n^2`}</M> fasst <M p=".">{t`2n^2`}</M> Elektronen.</li>
            <li>Pauli: höchstens zwei Elektronen pro Orbital, mit entgegengesetztem Spin. Hund: Kästchen einer Unterschale zuerst einzeln füllen, mit gleichem Spin.</li>
            <li>Wasserstoff: Energie hängt nur von <M>n</M> ab. Mehrelektronenatom: <M p=",">{t`E_s < E_p < E_d < E_f`}</M> darum liegt 4s unter 3d.</li>
            <li>Konfiguration: Periodensystem von links nach rechts, Zeile für Zeile lesen; Kurzform mit Edelgas, zum Beispiel <M p=".">{t`[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^4`}</M> Valenzelektronen: die äussersten, ohne gefüllte d- und f-Unterschalen. Ausnahmen: Cr und Cu.</li>
          </ul>}
          en={<ul>
            <li>An orbital is a probability map, not a path. The drawn surface encloses about 90&nbsp;% of the map.</li>
            <li>Four numbers: <M>n</M> (shell, size), <M>{t`\ell`}</M> (subshell, shape; <M>0</M> to <M>{t`n-1`}</M> is called s, p, d, f), <M>{t`m_\ell`}</M> (orientation; <M>{t`-\ell`}</M> to <M p="),">{t`+\ell`}</M> <M>{t`m_s`}</M> (spin, <M p=").">{t`\pm\tfrac12`}</M></li>
            <li>Orbitals: s has 1, p has 3, d has 5, f has 7; a shell has <M p=",">{t`n^2`}</M> holds <M p=".">{t`2n^2`}</M> electrons.</li>
            <li>Pauli: at most two electrons per orbital, with opposite spin. Hund: fill the boxes of a subshell singly first, with the same spin.</li>
            <li>Hydrogen: the energy depends on <M>n</M> only. Multielectron atom: <M p=",">{t`E_s < E_p < E_d < E_f`}</M> so 4s lies below 3d.</li>
            <li>Configuration: read the periodic table from left to right, row by row; short form with a noble gas, for example <M p=".">{t`[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^4`}</M> Valence electrons: the outermost, without filled d and f subshells. Exceptions: Cr and Cu.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
