import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { EaFigure, IonSizes, IonizationPlot, IonizationSteps, Penetration, ScreeningFigure, TrendMap } from '../viz/chem/TrendFigures';
import '../viz/chem/trends.css';

const t = String.raw;

export default function CH6Trends() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Warum ist Natrium grösser als Chlor? Warum ist es leicht, Natrium ein Elektron abzunehmen, aber schwer bei Neon? Alles hängt an einer Frage: Wie stark zieht der Kern an das äusserste Elektron? Der Kern zieht, die inneren Elektronen schirmen ab. Was unten ankommt, heisst <b>effektive Kernladung</b> <M p=".">{t`Z_{\mathrm{eff}}`}</M> Mit ihr erklären wir drei Trends im Periodensystem.</p>}
        en={<p className="lede">Why is sodium larger than chlorine? Why is it easy to take an electron from sodium, but hard from neon? Everything hangs on one question: how strongly does the nucleus pull on the outermost electron? The nucleus pulls, the inner electrons shield. What arrives is called the <b>effective nuclear charge</b> <M p=".">{t`Z_{\mathrm{eff}}`}</M> With it we explain three trends in the periodic table.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Du sitzt in der letzten Reihe eines Konzertsaals. Die Sängerin auf der Bühne ist der Kern. Zwischen ihr und dir sitzen viele Leute und schlucken den Klang. Du hörst die Musik, aber leiser. Die Leute dazwischen sind die inneren Elektronen, die Lautstärke bei dir ist <M p=".">{t`Z_{\mathrm{eff}}`}</M> Wer vorne sitzt, hört mehr.</p>}
          en={<p>You sit in the last row of a concert hall. The singer on the stage is the nucleus. Between her and you sit many people who swallow the sound. You hear the music, but quieter. The people in between are the inner electrons, the loudness at your seat is <M p=".">{t`Z_{\mathrm{eff}}`}</M> Whoever sits at the front hears more.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="abschirmung" title={<T de="1. Abschirmung und effektive Kernladung" en="1. Screening and effective nuclear charge" />}>
        <Box kind="lecture" src={<Src lec={6} p="28" />} title={<T de="Abschirmung" en="Screening" />}>
          <T
            de={<>
              <p>Frage der Folie: «Für eine gegebene Schale <M p=",">n</M> warum ist <M p="?">{t`E_s < E_p < E_d < E_f`}</M>»</p>
              <ul>
                <li>Valenzelektronen werden von Rumpfelektronen abgestossen.</li>
                <li>Valenzelektronen spüren nicht die volle Anziehung von <M>+Z</M> (handschriftlich: «von den Protonen im Kern»).</li>
                <li>Rumpfelektronen «schirmen» den Kern ab.</li>
                <li>Valenzelektronen spüren <M p=".">{t`Z_{\mathrm{eff}} < Z`}</M> Handschriftlich: «<M>{t`Z_{\mathrm{eff}}`}</M> ≡ effektive Kernladung».</li>
                <li>Der Effekt ist stärker für Unterschalen, die weiter vom Kern entfernt sind (handschriftlich: «erklärt <M p="»).">{t`E_s < E_p < E_d < E_f`}</M></li>
                <li>Der mittlere Abstand der Elektronen wächst für s <M>\to</M> p <M>\to</M> d <M p=".">\to</M> f</li>
                <li>Auch <M>{t`Z_{\mathrm{eff}}`}</M> wächst entlang einer Zeile des Periodensystems.</li>
              </ul>
              <p>Handschriftlich unten: «Die Zahl der Rumpfelektronen bleibt gleich, aber <M>Z</M> wächst, wenn wir in einer Periode nach rechts gehen. Im Prinzip sollte <M>{t`Z_{\mathrm{eff}}`}</M> in einer Spalte etwa gleich bleiben. Es wächst aber leicht, weil die Elektronenwolke diffuser wird <M>\Rightarrow</M> weniger wirksame Abschirmung.»</p>
            </>}
            en={<>
              <p>Question of the slide: “For a given shell (<M p="),">n</M> why is <M p="?">{t`E_s < E_p < E_d < E_f`}</M>”</p>
              <ul>
                <li>Valence electrons are repelled by core electrons.</li>
                <li>Valence electrons don’t feel the full attraction from <M>+Z</M> (handwritten: “from protons in nucleus”).</li>
                <li>Core electrons “screen” the nucleus.</li>
                <li>Valence electrons feel <M p=".">{t`Z_{\mathrm{eff}} < Z`}</M> Handwritten: “<M>{t`Z_{\mathrm{eff}}`}</M> ≡ effective nuclear charge”.</li>
                <li>The effect is stronger for subshells further from the nucleus (handwritten: “explains <M p="”).">{t`E_s < E_p < E_d < E_f`}</M></li>
                <li>The average distance for electrons increases for s <M>\to</M> p <M>\to</M> d <M p=".">\to</M> f</li>
                <li>Also, <M>{t`Z_{\mathrm{eff}}`}</M> increases across a row in the periodic table.</li>
              </ul>
              <p>Handwritten at the bottom: “Number of core electrons stays the same, but <M>Z</M> is increasing as we move right across a period in the periodic table. In principle, <M>{t`Z_{\mathrm{eff}}`}</M> should stay approximately the same as we move down a column. However, <M>{t`Z_{\mathrm{eff}}`}</M> increases slightly because the electron cloud becomes more diffuse <M>\Rightarrow</M> less effective screen.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Folie:</b></p>
            <ol className="keep">
              <li><M>Z</M> ist die Zahl der Protonen im Kern, also die wahre Kernladung. Ein Elektron weit aussen «sieht» aber nicht nur den Kern, sondern auch die Elektronen dazwischen.</li>
              <li>Jedes Rumpfelektron hebt rechnerisch ungefähr ein Proton auf. Als grobe Faustregel für Hauptgruppen-Elemente: <M p=".">{t`Z_{\mathrm{eff}} \approx Z - (\text{Rumpfelektronen})`}</M> Das ist nur eine Abschätzung (nicht auf den Folien); sie gibt gerade die Zahl der Valenzelektronen.</li>
              <li>Quer durch eine Periode: Jeder Schritt nach rechts fügt ein Proton hinzu. Das neue Elektron kommt aber in dieselbe Schale und schirmt kaum ab. Die Rumpfelektronen bleiben gleich viele, also wächst <M>{t`Z_{\mathrm{eff}}`}</M> Schritt für Schritt (Natrium <M p=",">1</M> Magnesium <M p=",">2</M> …, Chlor <M p=").">7</M></li>
              <li>Eine Spalte hinab: Es kommt eine neue Schale dazu, aber auch ihre Rumpfelektronen und ihre Protonen. Netto bleibt <M>{t`Z_{\mathrm{eff}}`}</M> etwa gleich.</li>
            </ol>
            <p>Das Bild zeigt es: Rote Mitte ist der Kern, die grauen Punkte sind die Rumpfelektronen, die gelben mit Rand die Valenzelektronen. Der rote Pfeil ist die Anziehung, die ein Valenzelektron noch spürt. Schiebe <M>Z</M> von Natrium nach Chlor. Der Pfeil wird dicker, die Rumpfelektronen bleiben gleich.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the slide:</b></p>
            <ol className="keep">
              <li><M>Z</M> is the number of protons in the nucleus, the true nuclear charge. An electron far out does not only “see” the nucleus, but also the electrons in between.</li>
              <li>Each core electron roughly cancels one proton. As a rough rule of thumb for main-group elements: <M p=".">{t`Z_{\mathrm{eff}} \approx Z - (\text{core electrons})`}</M> This is only an estimate (not on the slides); it gives exactly the number of valence electrons.</li>
              <li>Across a period: each step to the right adds one proton. But the new electron goes into the same shell and hardly screens. The number of core electrons stays the same, so <M>{t`Z_{\mathrm{eff}}`}</M> grows step by step (sodium <M p=",">1</M> magnesium <M p=",">2</M> …, chlorine <M p=").">7</M></li>
              <li>Down a column: a new shell is added, but also its core electrons and its protons. Net, <M>{t`Z_{\mathrm{eff}}`}</M> stays about the same.</li>
            </ol>
            <p>The figure shows it: the red centre is the nucleus, the grey dots are the core electrons, the yellow ones with an outline are the valence electrons. The red arrow is the attraction that a valence electron still feels. Move <M>Z</M> from sodium to chlorine. The arrow gets thicker, the core electrons stay the same.</p>
          </>}
        />
        <ScreeningFigure />
        <T
          de={<>
            <p><b>Und warum s, p, d?</b> Auch innerhalb einer Schale spüren die Elektronen verschieden viel vom Kern. Das Bild zeigt für Wasserstoff-Orbitale, wo sich ein 3s-, 3p- und 3d-Elektron aufhält. Die graue Zone links ist der Rumpf. Du kannst seinen Radius <M>{t`r_c`}</M> verschieben.</p>
            <ol>
              <li>Die s-Kurve hat auch ganz nahe am Kern etwas Wahrscheinlichkeit. Ein s-Elektron taucht in den Rumpf hinein und spürt dort fast die volle Kernladung. Es ist stärker gebunden, seine Energie ist tiefer.</li>
              <li>Die p-Kurve hat dort fast nichts, die d-Kurve noch weniger. Sie bleiben draussen, die Rumpfelektronen schirmen sie ab. Deshalb gilt <M p=".">{t`E_s < E_p < E_d < E_f`}</M></li>
            </ol>
            <p>Die Folie und die Übung begründen das mit dem mittleren Abstand der Elektronen. Genau gerechnet wird <M>{t`\langle r\rangle`}</M> für Wasserstoff-Orbitale von s nach d sogar etwas kleiner (Tabelle im Bild, CH-601). Entscheidend ist die Chance, nahe am Kern zu sein («Durchdringung»); die steht in der Tabelle links.</p>
          </>}
          en={<>
            <p><b>And why s, p, d?</b> Inside one shell, too, electrons feel different amounts of the nucleus. The figure shows for hydrogen orbitals where a 3s, 3p and 3d electron stays. The grey zone on the left is the core. You can move its radius <M p=".">{t`r_c`}</M></p>
            <ol>
              <li>The s curve has some probability even very close to the nucleus. An s electron dips into the core and there feels almost the full nuclear charge. It is bound more strongly, its energy is lower.</li>
              <li>The p curve has almost nothing there, the d curve even less. They stay outside, the core electrons screen them. This is why <M p=".">{t`E_s < E_p < E_d < E_f`}</M></li>
            </ol>
            <p>The slide and the exercise class explain this with the average distance of the electrons. Calculated exactly, <M>{t`\langle r\rangle`}</M> for hydrogen orbitals even gets slightly smaller from s to d (table in the figure, CH-601). What matters is the chance to be close to the nucleus (“penetration”); it is in the table on the left.</p>
          </>}
        />
        <Penetration />
        <Box kind="uebung" src={<Src ex={6} p="8" />} title={<T de="Energien in einer Schale (Übung 6)" en="Energies within a shell (exercise class 6)" />}>
          <T
            de={<p>«Für Unterschalen in derselben Schale (gleiches <M p=")">n</M> gilt <M p=".">{t`E_s < E_p < E_d < E_f`}</M> Das liegt daran, dass der Abstand eines mittleren Elektrons in einer Unterschale wächst: <M p=".">{t`\Delta x_s < \Delta x_p < \Delta x_d < \Delta x_f`}</M> Der Grund, 4s vor 3d zu füllen: Die potentielle Energie von 4s ist tiefer.»</p>}
            en={<p>“For subshells in the same shell (same <M p=")">n</M> we have <M p=".">{t`E_s < E_p < E_d < E_f`}</M> This is because the distance of an average electron in a subshell rises: <M p=".">{t`\Delta x_s < \Delta x_p < \Delta x_d < \Delta x_f`}</M> The reason for filling the 4s before the 3d orbital is that the potential energy of 4s is lower.”</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="atomgroesse" title={<T de="2. Atomgrösse" en="2. Atomic size" />}>
        <Box kind="lecture" src={<Src lec={6} p="29–30" />} title={<T de="Atomgrösse" en="Atomic size" />}>
          <T
            de={<>
              <p>Handschriftlich: «Es ist auch nützlich, ein Mass für die Grösse von Atomen und Ionen zu haben …» «Ein bisschen «unscharf», weil die Elektronenwolke keinen Rand hat.»</p>
              <p><b>Verschiedene Definitionen</b> sind möglich. Typisch: der <b>Bindungsradius</b> <M p=":">{t`\text{Atomradius} \equiv \dfrac{d}{2}`}</M> mit der Bindungslänge <M>d</M> (Bild: zwei gebundene Atome, ihre Elektronenwolken berühren sich). Mit einer Tabelle der Atomradien lassen sich neue Bindungslängen abschätzen.</p>
              <p><b>Trends:</b> Atomradien wachsen in einer Gruppe nach unten, <M>\Rightarrow</M> die Schale <M>n</M> wird grösser (handschriftlich: «die Spalte hinab»). Atomradien nehmen in einer Periode ab, <M>\Rightarrow</M> <M>{t`Z_{\mathrm{eff}}`}</M> wächst (handschriftlich: «von links nach rechts in einer Zeile»; «die Valenzelektronen werden von der grösseren positiven <M>{t`Z_{\mathrm{eff}}`}</M> hineingezogen»).</p>
              <p>Folie 30: Die dreidimensionale Balkengrafik des Periodensystems mit den Radien (Einheit <M p=")">{t`10^2\ \mathrm{pm}`}</M> und den Achsen «zunehmender Radius».</p>
            </>}
            en={<>
              <p>Handwritten: “It is also useful to have measure of size of atoms and ions …” “A little ‘fuzzy’ because of electron cloud.”</p>
              <p><b>Different ways to define</b> it. Typical: the <b>bonding atomic radius</b> <M p=":">{t`\text{atomic radius} \equiv \dfrac{d}{2}`}</M> for bond length <M>d</M> (picture: two bonded atoms, their electron clouds touch). With a table of atomic radii one can estimate new bond lengths.</p>
              <p><b>Trends:</b> atomic radii increase down a group, <M>\Rightarrow</M> <M>n</M> (shell) is getting larger (handwritten: “down column in periodic table”). Atomic radii decrease across a period, <M>\Rightarrow</M> <M>{t`Z_{\mathrm{eff}}`}</M> is increasing (handwritten: “left to right across row in periodic table”; “so valence electrons get pulled in by larger positive <M>{t`Z_{\mathrm{eff}}`}</M>”).</p>
              <p>Slide 30: the three-dimensional bar chart of the periodic table with the radii (unit <M p=")">{t`10^2\ \mathrm{pm}`}</M> and the axes “increasing radius”.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Ein Atom hat keinen scharfen Rand. Darum misst man zwei gleiche Atome, die miteinander gebunden sind, und halbiert den Abstand der Kerne: <M p=".">{t`r = d/2`}</M> Beim Wasserstoffmolekül ist <M p=",">{t`d = 74\ \mathrm{pm}`}</M> der Radius also <M p=".">{t`37\ \mathrm{pm}`}</M> Die Folie hat <M p=".">{t`31\ \mathrm{pm}`}</M> (der Unterschied liegt an der Definition, die Folie benutzt die Tabelle von Brown).</li>
              <li>Spalte hinab: eine Schale mehr, die Elektronen sitzen weiter aussen. Der Radius wächst. <M>{t`Z_{\mathrm{eff}}`}</M> ändert sich kaum, also gewinnt die grössere Schale.</li>
              <li>Zeile entlang: Dieselbe Schale, aber <M>{t`Z_{\mathrm{eff}}`}</M> wächst. Die Wolke wird zusammengezogen. Der Radius sinkt.</li>
            </ol>
            <p>Im Bild siehst du die Werte der Folie 30 als Heatmap (die Zahlen in den Feldern sind in pm). Wechsle auch zu den anderen Grössen: Alle drei Karten gehören zusammen.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>An atom has no sharp edge. So one takes two identical atoms bonded to each other and halves the distance of the nuclei: <M p=".">{t`r = d/2`}</M> For the hydrogen molecule <M p=",">{t`d = 74\ \mathrm{pm}`}</M> so the radius is <M p=".">{t`37\ \mathrm{pm}`}</M> The slide has <M p=".">{t`31\ \mathrm{pm}`}</M> (the difference is a matter of definition; the slide uses the table of Brown).</li>
              <li>Down a column: one more shell, the electrons sit farther out. The radius grows. <M>{t`Z_{\mathrm{eff}}`}</M> hardly changes, so the larger shell wins.</li>
              <li>Along a row: the same shell, but <M>{t`Z_{\mathrm{eff}}`}</M> grows. The cloud is pulled together. The radius falls.</li>
            </ol>
            <p>In the figure you see the values of slide 30 as a heat map (the numbers in the cells are in pm). Also switch to the other quantities: all three maps belong together.</p>
          </>}
        />
        <TrendMap />
        <Box kind="misconception" title={<T de="«Mehr Elektronen heisst grösseres Atom»" en="“More electrons means a bigger atom”" />}>
          <T
            de={<p>Über eine Periode stimmt das Gegenteil: Chlor hat mehr Elektronen als Natrium und ist kleiner (<M>{t`102\ \mathrm{pm}`}</M> gegen <M p=")">{t`166\ \mathrm{pm}`}</M> Die zusätzlichen Elektronen kommen in dieselbe Schale, und die wachsende Kernladung zieht sie alle enger zusammen. Grösser wird ein Atom erst, wenn eine neue Schale beginnt.</p>}
            en={<p>Across a period the opposite is true: chlorine has more electrons than sodium and is smaller (<M>{t`102\ \mathrm{pm}`}</M> versus <M p=")">{t`166\ \mathrm{pm}`}</M> The extra electrons go into the same shell, and the growing nuclear charge pulls them all closer. An atom only gets larger when a new shell begins.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="ionenradien" title={<T de="3. Ionenradien" en="3. Ionic radii" />}>
        <Box kind="lecture" src={<Src lec={6} p="31" />} title={<T de="Ionenradien" en="Ionic radii" />}>
          <T
            de={<>
              <p>Handschriftlich: «Ähnlich können wir die Grösse von Ionen abschätzen …» <b>Ionengrössen schätzt man aus Bindungslängen in Ionenkristallen.</b></p>
              <ul>
                <li>Kationen sind kleiner als das neutrale Mutteratom.</li>
                <li>Anionen sind grösser als das neutrale Mutteratom.</li>
              </ul>
              <p>Bild: Na-Atom (<M p=",">{t`11\mathrm{p}^+`}</M> <M p=")">{t`11\mathrm{e}^-`}</M> gibt ein Elektron ab und wird zum Na-Kation (<M p=",">{t`11\mathrm{p}^+`}</M> <M p=",">{t`10\mathrm{e}^-`}</M> <M p=").">{t`1+`}</M> Cl-Atom (<M p=",">{t`17\mathrm{p}^+`}</M> <M p=")">{t`17\mathrm{e}^-`}</M> nimmt ein Elektron auf und wird zum Cl-Anion (<M p=",">{t`17\mathrm{p}^+`}</M> <M p=",">{t`18\mathrm{e}^-`}</M> <M p=").">{t`1-`}</M></p>
              <p><b>Trends:</b> Ionen mit gleicher Ladung <M>\Rightarrow</M> grösser in der Gruppe nach unten (handschriftlich: «die Spalte hinab»). Ionen mit gleicher Elektronenzahl <M>\Rightarrow</M> kleiner mit wachsendem <M>Z</M> (handschriftlich: «d. h. mit wachsender Kernladung werden die Elektronen fester gehalten»). Beispiel: die isoelektronische Reihe <M p=",">{t`\mathrm{O^{2-}}`}</M> <M p=",">{t`\mathrm{F^{-}}`}</M> <M p=",">{t`\mathrm{Na^{+}}`}</M> <M p=",">{t`\mathrm{Mg^{2+}}`}</M> <M>{t`\mathrm{Al^{3+}}`}</M> mit <M>{t`r_{\mathrm{ion}} = 126, 119, 116, 86, 68\ \mathrm{pm}`}</M> («alle haben 10 Elektronen»).</p>
            </>}
            en={<>
              <p>Handwritten: “Similarly, we can estimate sizes of ions …” <b>Estimate ion sizes from bond lengths in ionic solids.</b></p>
              <ul>
                <li>Cations smaller than neutral parent ion.</li>
                <li>Anions larger than neutral parent ion.</li>
              </ul>
              <p>Picture: Na atom (<M p=",">{t`11\mathrm{p}^+`}</M> <M p=")">{t`11\mathrm{e}^-`}</M> loses an electron and becomes the Na cation (<M p=",">{t`11\mathrm{p}^+`}</M> <M p=",">{t`10\mathrm{e}^-`}</M> <M p=").">{t`1+`}</M> Cl atom (<M p=",">{t`17\mathrm{p}^+`}</M> <M p=")">{t`17\mathrm{e}^-`}</M> gains an electron and becomes the Cl anion (<M p=",">{t`17\mathrm{p}^+`}</M> <M p=",">{t`18\mathrm{e}^-`}</M> <M p=").">{t`1-`}</M></p>
              <p><b>Trends:</b> ions with the same charge <M>\Rightarrow</M> bigger down a group (handwritten: “down group, i.e. as we go down in the periodic table”). Ions with the same number of electrons <M>\Rightarrow</M> smaller with increasing <M>Z</M> (handwritten: “i.e., as nuclear charge increases, the electrons are held more tightly”). Example: the isoelectronic series <M p=",">{t`\mathrm{O^{2-}}`}</M> <M p=",">{t`\mathrm{F^{-}}`}</M> <M p=",">{t`\mathrm{Na^{+}}`}</M> <M p=",">{t`\mathrm{Mg^{2+}}`}</M> <M>{t`\mathrm{Al^{3+}}`}</M> with <M>{t`r_{\mathrm{ion}} = 126, 119, 116, 86, 68\ \mathrm{pm}`}</M> (“all have 10 electrons”).</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Ein Kation hat weniger Elektronen als Protonen. Ein Teil der Abstossung unter den Elektronen fällt weg, und oft ist die äusserste Schale ganz leer. Die übrigen Elektronen werden vom Kern enger gezogen. Das Kation schrumpft.</li>
              <li>Ein Anion hat mehr Elektronen als Protonen. Die Elektronen stossen sich stärker ab, der Kern hält jedes weniger fest. Das Anion schwillt an.</li>
              <li>«Isoelektronisch» heisst «gleich viele Elektronen». Alle fünf Ionen der Reihe haben 10 Elektronen und dieselbe Anordnung. Nur die Zahl der Protonen unterscheidet sie: 8, 9, 11, 12, 13. Je mehr Protonen, desto stärker die Anziehung und desto kleiner das Ion.</li>
            </ol>
            <p>Im Bild wählst du ein Atom und schaltest zwischen Atom und Ion um. Der Kreis wächst oder schrumpft. Darunter steht die ganze Reihe: von links nach rechts nimmt die Ladung des Kerns zu, der Radius ab. (Atomradius und Ionenradius stammen aus zwei verschiedenen Tabellen der Folien; verglichen wird der Trend.)</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>A cation has fewer electrons than protons. Part of the repulsion among the electrons disappears, and often the outermost shell is empty altogether. The remaining electrons are pulled in more tightly by the nucleus. The cation shrinks.</li>
              <li>An anion has more electrons than protons. The electrons repel each other more strongly, the nucleus holds each one less firmly. The anion swells.</li>
              <li>“Isoelectronic” means “same number of electrons”. All five ions of the series have 10 electrons and the same arrangement. Only the number of protons distinguishes them: 8, 9, 11, 12, 13. The more protons, the stronger the attraction and the smaller the ion.</li>
            </ol>
            <p>In the figure you choose an atom and switch between atom and ion. The circle grows or shrinks. Below is the whole series: from left to right the charge of the nucleus rises and the radius falls. (Atomic radius and ionic radius are from two different tables of the slides; the trend is what is compared.)</p>
          </>}
        />
        <IonSizes />
        <Box kind="misconception" title={<T de="«Ein Kation ist grösser, es hat ja eine Ladung»" en="“A cation is bigger, after all it has a charge”" />}>
          <T
            de={<p>Die Ladung ist nicht die Grösse. Ein Kation hat ein Elektron weniger und zieht die übrigen näher an den Kern. Natrium: <M>{t`166\ \mathrm{pm}`}</M> als Atom, <M>{t`116\ \mathrm{pm}`}</M> als Ion.</p>}
            en={<p>Charge is not size. A cation has one electron fewer and pulls the others closer to the nucleus. Sodium: <M>{t`166\ \mathrm{pm}`}</M> as an atom, <M>{t`116\ \mathrm{pm}`}</M> as an ion.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="ionisierung" title={<T de="4. Ionisierungsenergie" en="4. Ionisation energy" />}>
        <Box kind="lecture" src={<Src lec={6} p="32" />} title={<T de="Ionisierungsenergie" en="Ionization energy" />}>
          <T
            de={<>
              <p>Handschriftlich: «Schliesslich müssen wir zwei nützliche Grössen definieren …»</p>
              <p><b>Ionisierungsenergie:</b> Energie, die nötig ist, um ein Atom oder Ion zu ionisieren (ein Elektron zu entfernen). Handschriftlich: «genauer: die minimale Energie». Beispiele:</p>
              <MD>{t`\mathrm{Na} \;\longrightarrow\; \mathrm{Na}^+ + 1\,e^- \quad (I_1) \qquad\qquad \mathrm{Na}^+ \;\longrightarrow\; \mathrm{Na}^{2+} + 1\,e^- \quad (I_2)`}</MD>
              <p>«Erste und zweite Ionisierungsenergie.» <b>Trends:</b> <M p=";">{t`I_2 > I_1`}</M> die Ionisierungsenergie wächst von links nach rechts in einer Periode; sie fällt in einer Gruppe des Periodensystems nach unten. Handschriftlich: «Beachte: <M p=".">{t`I > 0`}</M> Wir müssen Energie zuführen, um ein Elektron zu entfernen.»</p>
            </>}
            en={<>
              <p>Handwritten: “Finally, we need to define two useful parameters …”</p>
              <p><b>Ionization energy:</b> energy needed to ionize (remove an electron from) an atom or ion. Handwritten: “more accurately, the minimum energy needed”. Examples:</p>
              <MD>{t`\mathrm{Na} \;\longrightarrow\; \mathrm{Na}^+ + 1\,e^- \quad (I_1) \qquad\qquad \mathrm{Na}^+ \;\longrightarrow\; \mathrm{Na}^{2+} + 1\,e^- \quad (I_2)`}</MD>
              <p>“First and second ionization energies.” <b>Trends:</b> <M p=";">{t`I_2 > I_1`}</M> IE increases left to right across a period; IE decreases down a group of the periodic table. Handwritten: “Note: ionization energy, <M p=".">{t`I > 0`}</M> We have to add energy to remove an electron.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li><M>{t`I_1`}</M> ist der Preis, das lockerste Elektron wegzunehmen. Du musst gegen die Anziehung des Kerns arbeiten, darum ist der Preis immer positiv.</li>
              <li>Nach rechts: <M>{t`Z_{\mathrm{eff}}`}</M> wächst, der Radius sinkt, das äusserste Elektron sitzt fester. Der Preis steigt. Bei Neon ist er am höchsten (volle Schale), bei Natrium (ein einzelnes Elektron in einer neuen Schale, weit weg) wieder tief.</li>
              <li>Nach unten: Das äusserste Elektron sitzt in einer weiter entfernten Schale. Der Preis sinkt. Darum geben Alkalimetalle ihr Elektron so leicht ab.</li>
              <li><M p=":">{t`I_2 > I_1`}</M> Das zweite Elektron muss aus einem positiven Ion heraus. Es wird stärker festgehalten.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li><M>{t`I_1`}</M> is the price of taking away the loosest electron. You have to work against the attraction of the nucleus, so the price is always positive.</li>
              <li>To the right: <M>{t`Z_{\mathrm{eff}}`}</M> grows, the radius falls, the outermost electron sits more firmly. The price rises. For neon it is highest (full shell), for sodium (a single electron in a new shell, far away) it is low again.</li>
              <li>Downwards: the outermost electron sits in a shell farther away. The price falls. This is why alkali metals give up their electron so easily.</li>
              <li><M p=":">{t`I_2 > I_1`}</M> the second electron has to come out of a positive ion. It is held more strongly.</li>
            </ol>
          </>}
        />
        <Box kind="supplement" title={<T de="Zahlen und Einbrüche (nicht auf den Folien)" en="Numbers and dips (not on the slides)" />}>
          <T
            de={<>
              <p>Die Folie zeigt nur den Trend. Die Werte im Bild unten sind übliche Tabellenwerte der ersten Ionisierungsenergie in <M p=".">{t`\mathrm{kJ\,mol^{-1}}`}</M> Im Grossen steigt die Kurve in jeder Periode. Zwei Einbrüche fallen auf (rote Ringe), und beide lassen sich mit dem Aufbau der Elektronenhülle erklären (Lektion «Orbitale»):</p>
              <ul>
                <li><b>Beryllium <M>\to</M> Bor</b> (<M p="):">{t`900 \to 801`}</M> Bei Be wird ein <M>{t`2s`}</M>-Elektron entfernt, bei B das <M>{t`2p`}</M>-Elektron. Das 2p liegt höher und wird besser abgeschirmt, es geht leichter.</li>
                <li><b>Stickstoff <M>\to</M> Sauerstoff</b> (<M p="):">{t`1402 \to 1314`}</M> Bei <C>N</C> sitzt in jedem 2p-Kästchen ein Elektron. Bei <C>O</C> ist ein Kästchen doppelt besetzt. Zwei Elektronen im selben Kästchen stossen sich ab, und eines geht leichter. Dasselbe Muster steht in Periode 3 bei <C>Mg</C> <M>\to</M> <C>Al</C> und <C>P</C> <M>\to</M> <C>S</C>.</li>
              </ul>
              <p>Das zweite Bild zeigt nacheinander entfernte Elektronen: Solange es Valenzelektronen gibt, steigt <M>{t`I_n`}</M> mässig. Danach beginnt der Rumpf, und die Energie springt. Das ist der Beleg, dass die Valenzelektronen in der äussersten Schale sitzen: Natrium hat einen Sprung nach <M p=",">{t`I_1`}</M> Magnesium nach <M p=",">{t`I_2`}</M> Aluminium nach <M p=".">{t`I_3`}</M></p>
            </>}
            en={<>
              <p>The slide shows only the trend. The values in the figure below are common table values of the first ionisation energy in <M p=".">{t`\mathrm{kJ\,mol^{-1}}`}</M> On the whole the curve rises within each period. Two dips stand out (red rings), and both can be explained by the structure of the electron shell (lesson “Orbitals”):</p>
              <ul>
                <li><b>Beryllium <M>\to</M> boron</b> (<M p="):">{t`900 \to 801`}</M> in Be a <M>{t`2s`}</M> electron is removed, in B the <M>{t`2p`}</M> electron. The 2p lies higher and is screened better, so it goes more easily.</li>
                <li><b>Nitrogen <M>\to</M> oxygen</b> (<M p="):">{t`1402 \to 1314`}</M> in <C>N</C> every 2p box has one electron. In <C>O</C> one box is doubly occupied. Two electrons in the same box repel each other, and one leaves more easily. The same pattern appears in period 3 at <C>Mg</C> <M>\to</M> <C>Al</C> and <C>P</C> <M>\to</M> <C>S</C>.</li>
              </ul>
              <p>The second figure shows electrons removed one after the other: as long as there are valence electrons, <M>{t`I_n`}</M> rises moderately. Then the core begins, and the energy jumps. This is the evidence that the valence electrons sit in the outermost shell: sodium has a jump after <M p=",">{t`I_1`}</M> magnesium after <M p=",">{t`I_2`}</M> aluminium after <M p=".">{t`I_3`}</M></p>
            </>}
          />
        </Box>
        <IonizationPlot />
        <IonizationSteps />
        <Box kind="misconception" title={<T de="«Die Ionisierungsenergie steigt in einer Periode immer weiter»" en="“Ionisation energy always keeps rising in a period”" />}>
          <T
            de={<p>Im Grossen ja, aber nicht Schritt für Schritt: <C>Be</C> <M>\to</M> <C>B</C> und <C>N</C> <M>\to</M> <C>O</C> (und <C>Mg</C> <M>\to</M> <C>Al</C>, <C>P</C> <M>\to</M> <C>S</C>) sind Einbrüche. Die Folie nennt nur den Trend; wer die Einbrüche kennt, versteht, dass das Bild der Orbitale (2s vor 2p, Paarung im Kästchen) in den Messwerten sichtbar wird.</p>}
            en={<p>On the whole yes, but not step by step: <C>Be</C> <M>\to</M> <C>B</C> and <C>N</C> <M>\to</M> <C>O</C> (and <C>Mg</C> <M>\to</M> <C>Al</C>, <C>P</C> <M>\to</M> <C>S</C>) are dips. The slide only names the trend; whoever knows the dips understands that the picture of orbitals (2s before 2p, pairing in a box) shows up in the measured values.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="affinitaet" title={<T de="5. Elektronenaffinität" en="5. Electron affinity" />}>
        <Box kind="lecture" src={<Src lec={6} p="32" />} title={<T de="Elektronenaffinität" en="Electron affinity" />}>
          <T
            de={<>
              <p><b>Elektronenaffinität:</b> Energieänderung, wenn wir einem Atom ein zusätzliches Elektron geben. Beispiel: <C p=" (EA)">{'Cl + 1 e^- -> Cl^-'}</C> Der Vorgang ist typischerweise (aber nicht immer) exotherm, <M>\Rightarrow</M> <M p=".">{t`\mathrm{EA} < 0`}</M></p>
              <p><b>Trends:</b> Halogene <M>\Rightarrow</M> <M p=";">{t`\mathrm{EA} \ll 0`}</M> Edelgase <M>\Rightarrow</M> <M p=".">{t`\mathrm{EA} > 0`}</M> Handschriftlich: «Sinnvoll, wenn man die volle Schale bedenkt.»</p>
              <p>Handschriftlich unten: «Aber <M>{t`\mathrm{EA} < 0`}</M> (in der Konvention, die wir benutzen) <M>\Rightarrow</M> das System senkt seine Energie, indem es ein weiteres Elektron aufnimmt und ein Anion bildet. Andere Konvention: EA wird als «frei werdende Energie» des Atoms definiert <M>\Rightarrow</M> EA wird dann als positive Zahl angegeben.»</p>
            </>}
            en={<>
              <p><b>Electron affinity:</b> energy change when we add an extra electron to an atom. Example: <C p=" (EA)">{'Cl + 1 e^- -> Cl^-'}</C> The process is typically (but not always) exothermic, <M>\Rightarrow</M> <M p=".">{t`\mathrm{EA} < 0`}</M></p>
              <p><b>Trends:</b> halogens <M>\Rightarrow</M> <M p=";">{t`\mathrm{EA} \ll 0`}</M> noble gases <M>\Rightarrow</M> <M p=".">{t`\mathrm{EA} > 0`}</M> Handwritten: “Makes sense considering full shell.”</p>
              <p>Handwritten at the bottom: “But <M>{t`\mathrm{EA} < 0`}</M> (in convention we are using) <M>\Rightarrow</M> system lowers its energy by accepting another electron and making an anion. Different convention: EA defined as ‘energy released’ by atom <M>\Rightarrow</M> EA is then given as positive number.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Ionisierungsenergie fragt: Was kostet es, ein Elektron <em>wegzunehmen</em>? Die Elektronenaffinität fragt das Spiegelbild: Was bringt es, ein Elektron <em>hinzuzufügen</em>?</li>
              <li>Die Vorzeichen folgen der Regel dieses Kurses: Wird Energie frei, ist die Zahl negativ (<M p=").">{t`\mathrm{EA} < 0`}</M> Ein Chlor-Atom hat eine fast volle Schale, ein Elektron mehr passt gut hinein. Es wird Energie frei.</li>
              <li>Ein Neon-Atom hat eine volle Schale. Das zusätzliche Elektron müsste in eine neue Schale, und es wird vom Kern kaum gehalten. Man muss Energie hineinstecken: <M p=".">{t`\mathrm{EA} > 0`}</M></li>
              <li>Die Folie warnt: Manche Bücher haben die umgekehrte Konvention («frei werdende Energie» als positive Zahl). Prüfe immer, welches Vorzeichen gemeint ist.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>Ionisation energy asks: what does it cost to <em>take away</em> an electron? Electron affinity asks the mirror question: what does it bring to <em>add</em> an electron?</li>
              <li>The signs follow the rule of this course: if energy is released, the number is negative (<M p=").">{t`\mathrm{EA} < 0`}</M> A chlorine atom has an almost full shell, one more electron fits in well. Energy is released.</li>
              <li>A neon atom has a full shell. The additional electron would have to go into a new shell, and the nucleus hardly holds it. You have to put energy in: <M p=".">{t`\mathrm{EA} > 0`}</M></li>
              <li>The slide warns: some books use the opposite convention (“energy released” as a positive number). Always check which sign is meant.</li>
            </ol>
          </>}
        />
        <EaFigure />
        <Box kind="misconception" title={<T de={<>«<M>{t`\mathrm{EA} < 0`}</M> heisst: Das Atom will kein Elektron»</>} en={<>“<M>{t`\mathrm{EA} < 0`}</M> means the atom does not want an electron”</>} />}>
          <T
            de={<p>Genau umgekehrt, in dieser Konvention: Ein <em>negatives</em> <M>{t`\mathrm{EA}`}</M> heisst, die Energie sinkt, und das Anion ist stabiler als Atom plus Elektron. Chlor hat darum eine stark negative Elektronenaffinität. Das Minuszeichen ist die Energiebilanz, nicht eine Wertung.</p>}
            en={<p>Exactly the other way round, in this convention: a <em>negative</em> <M>{t`\mathrm{EA}`}</M> means the energy falls, and the anion is more stable than atom plus electron. Chlorine therefore has a strongly negative electron affinity. The minus sign is the energy balance, not a judgement.</p>}
          />
        </Box>
      </Section>

      <Box kind="key">
        <T
          de={<ul>
            <li>Das äusserste Elektron spürt nicht <M p=",">Z</M> sondern <M p=".">{t`Z_{\mathrm{eff}} < Z`}</M> Die Rumpfelektronen schirmen ab.</li>
            <li>In einer Periode wächst <M p=",">{t`Z_{\mathrm{eff}}`}</M> in einer Gruppe bleibt es etwa gleich. s-Elektronen dringen am tiefsten in den Rumpf ein: <M p=".">{t`E_s < E_p < E_d < E_f`}</M></li>
            <li>Atomradius: in der Periode kleiner (<M>{t`Z_{\mathrm{eff}}`}</M> wächst), in der Gruppe grösser (neue Schale).</li>
            <li>Kationen sind kleiner als ihr Atom, Anionen grösser. In einer isoelektronischen Reihe schrumpft der Radius mit wachsendem <M p=".">Z</M></li>
            <li>Ionisierungsenergie <M p=":">{t`I > 0`}</M> wächst in der Periode, fällt in der Gruppe, <M p=".">{t`I_2 > I_1`}</M> Kleine Einbrüche bei <C>Be</C> <M>\to</M> <C>B</C> und <C>N</C> <M>\to</M> <C>O</C>.</li>
            <li>Elektronenaffinität: Halogene <M p=",">{t`\mathrm{EA} \ll 0`}</M> Edelgase <M p=".">{t`\mathrm{EA} > 0`}</M> Das Vorzeichen hängt von der Konvention ab.</li>
          </ul>}
          en={<ul>
            <li>The outermost electron does not feel <M p=",">Z</M> but <M p=".">{t`Z_{\mathrm{eff}} < Z`}</M> The core electrons screen.</li>
            <li>Across a period <M>{t`Z_{\mathrm{eff}}`}</M> grows, down a group it stays about the same. s electrons penetrate the core deepest: <M p=".">{t`E_s < E_p < E_d < E_f`}</M></li>
            <li>Atomic radius: smaller across a period (<M>{t`Z_{\mathrm{eff}}`}</M> grows), larger down a group (new shell).</li>
            <li>Cations are smaller than their atom, anions larger. In an isoelectronic series the radius shrinks as <M>Z</M> grows.</li>
            <li>Ionisation energy <M p=":">{t`I > 0`}</M> grows across a period, falls down a group, <M p=".">{t`I_2 > I_1`}</M> Small dips at <C>Be</C> <M>\to</M> <C>B</C> and <C>N</C> <M>\to</M> <C>O</C>.</li>
            <li>Electron affinity: halogens <M p=",">{t`\mathrm{EA} \ll 0`}</M> noble gases <M p=".">{t`\mathrm{EA} > 0`}</M> The sign depends on the convention.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
