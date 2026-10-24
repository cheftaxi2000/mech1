import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { BohrExplorer } from '../viz/chem/BohrExplorer';
import { ChemAnim } from '../viz/chem/ChemAnim';
import { CloudFigure } from '../viz/chem/CloudFigure';
import { LightWave } from '../viz/chem/LightWave';
import { lightScene } from '../viz/chem/lightScene';

const t = String.raw;

export default function CH6Licht() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wie sind die Elektronen im Atom angeordnet? Das bestimmt, wie ein Atom reagiert und welche Bindungen es eingeht. Die Antwort kam zuerst von einer unerwarteten Seite: vom Licht, das Atome aussenden. Diese Lektion beginnt mit dem Licht (Wellenlänge, Frequenz, Photonen), schaut sich das Licht von Wasserstoff an und folgt Bohr, der daraus das erste Bild vom Atom baute. Alltagsbild: Eine Treppe. Man kann nur auf einer Stufe stehen, nie dazwischen, und für jeden Schritt zahlt oder gewinnt man eine feste Menge Energie.</p>}
        en={<p className="lede">How are the electrons arranged in an atom? That decides how an atom reacts and which bonds it forms. The answer first came from an unexpected side: from the light that atoms give off. This lesson starts with light (wavelength, frequency, photons), looks at the light of hydrogen and follows Bohr, who built the first picture of the atom from it. Everyday picture: a staircase. You can only stand on a step, never in between, and for each step you pay or gain a fixed amount of energy.</p>}
      />

      <Box kind="lecture" src={<Src lec={6} p="6" />} title={<T de="Heute: Elektronenstruktur" en="Today: electronic structure" />}>
        <T
          de={<p>Chemie handelt von Elektronen. Sie bestimmen die Reaktivität der Atome, und sie bilden die Bindungen, die Atome zu Molekülen zusammenhalten. Um Chemie zu verstehen, muss man also verstehen, wie die Elektronen im Atom organisiert sind (<span lang="en">electronic structure</span>). Das ganze Bild braucht Quantenmechanik (4. Semester). Ziel der Vorlesung: die Grundzüge skizzieren.</p>}
          en={<p>Chemistry is about electrons. They determine the reactivity of atoms, and they form the bonds that hold atoms together in molecules. So to understand chemistry we must understand how electrons are organised in atoms (electronic structure). The full picture needs quantum mechanics (4th semester). The goal of the lecture: sketch the basics.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="licht" title={<T de="1. Licht: Welle und Photon" en="1. Light: wave and photon" />}>
        <Box kind="lecture" src={<Src lec={6} p="7" />} title={<T de="Licht" en="Light" />}>
          <T
            de={<ul>
              <li>Licht ist eine schwingende elektromagnetische Welle (elektrisches und magnetisches Feld stehen senkrecht aufeinander und zur Ausbreitungsrichtung). Wichtige Grössen: die <b>Wellenlänge</b> <M p=",">\lambda</M> die <b>Frequenz</b> <M p=",">{t`\nu=c/\lambda`}</M> die Lichtgeschwindigkeit im Vakuum <M p=".">c</M> (Handschrift: <M>\nu</M> ist «nü», <M p=",">{t`c=2{,}998\cdot10^{8}\,\mathrm{m/s}`}</M> <M>\lambda</M> ist «lambda».)</li>
              <li>Die «Farbe» hängt von der Wellenlänge ab: <M>{t`430\,\mathrm{nm}`}</M> ist blau, <M>{t`530\,\mathrm{nm}`}</M> grün, <M>{t`630\,\mathrm{nm}`}</M> rot.</li>
              <li>Aber Licht trägt Energie in festen Portionen: <M p=".">{t`E=h\nu=hc/\lambda`}</M> Diese Portionen heissen <b>Photonen</b>. <M>h</M> ist die Plancksche Konstante, <M p=".">{t`h=6{,}626\cdot10^{-34}\,\mathrm{J\,s}`}</M> Handschrift: Ein blaues Photon trägt mehr Energie als ein rotes. Blaues Licht hat die kürzere Wellenlänge und die höhere Frequenz.</li>
              <li>Handschrift: Dass sich Licht wie eine Welle <em>und</em> wie ein Teilchen verhält, heisst <span lang="en">wave-particle duality</span>; sie ist der Kern der Quantenmechanik.</li>
            </ul>}
            en={<ul>
              <li>Light is an oscillating electromagnetic wave (the electric and magnetic fields stand perpendicular to each other and to the direction of travel). Important quantities: the <b>wavelength</b> <M p=",">\lambda</M> the <b>frequency</b> <M p=",">{t`\nu=c/\lambda`}</M> the speed of light in vacuum <M p=".">c</M> (handwritten: <M>\nu</M> is “nu”, <M p=",">{t`c=2.998\cdot10^{8}\,\mathrm{m/s}`}</M> <M>\lambda</M> is “lambda”.)</li>
              <li>The “colour” depends on the wavelength: <M>{t`430\,\mathrm{nm}`}</M> is blue, <M>{t`530\,\mathrm{nm}`}</M> green, <M>{t`630\,\mathrm{nm}`}</M> red.</li>
              <li>But light carries energy in fixed portions: <M p=".">{t`E=h\nu=hc/\lambda`}</M> These portions are called <b>photons</b>. <M>h</M> is Planck’s constant, <M p=".">{t`h=6.626\cdot10^{-34}\,\mathrm{J\,s}`}</M> Handwritten: a blue photon carries more energy than a red photon. Blue light has the shorter wavelength and the higher frequency.</li>
              <li>Handwritten: that light behaves like a wave <em>and</em> like a particle is called the wave-particle duality; it is central to quantum mechanics.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das.</b> Stell dir eine Welle auf einem Seil vor. Der Abstand von Wellenberg zu Wellenberg ist die Wellenlänge <M p=".">\lambda</M> Die Frequenz <M>\nu</M> sagt, wie viele Wellenberge pro Sekunde an dir vorbeiziehen. Die Welle läuft mit der Geschwindigkeit <M p=",">c</M> also kommen in einer Sekunde so viele Berge vorbei, wie in die Strecke <M>c</M> passen: <M p=".">{t`\nu=c/\lambda`}</M> Kurze Wellen ziehen darum viel schneller «im Takt» vorbei als lange.</p>
            <ol>
              <li><M p=":">{t`\nu=c/\lambda`}</M> kleines <M p=",">\lambda</M> grosses <M p=".">\nu</M> Die Einheit von <M>\nu</M> ist <M p=",">{t`1/\mathrm s=\mathrm{Hz}`}</M> Hertz.</li>
              <li><M p=":">{t`E=h\nu`}</M> Jedes Photon hat eine feste Energie, die nur von der Frequenz abhängt. Mehr Licht heisst nicht stärkere Photonen, sondern <em>mehr</em> Photonen.</li>
              <li>Zusammen: <M p=".">{t`E=hc/\lambda`}</M> Kleine Wellenlänge, grosse Energie. Ein UV-Photon trägt mehr als ein sichtbares, ein sichtbares mehr als ein Infrarot-Photon.</li>
            </ol>
            <p>Probiere es in der Figur: Schiebe <M>\lambda</M> und beobachte, wie sich die Welle staucht und streckt, während <M>\nu</M> und <M>E</M> sich gegenläufig ändern. Die Zahl der Wellen im Bild ist 2000 nm geteilt durch <M p=".">\lambda</M></p>
          </>}
          en={<>
            <p><b>How to read this.</b> Picture a wave on a rope. The distance from crest to crest is the wavelength <M p=".">\lambda</M> The frequency <M>\nu</M> says how many crests pass you per second. The wave travels at the speed <M p=",">c</M> so in one second as many crests pass as fit into the length <M p=":">c</M> <M p=".">{t`\nu=c/\lambda`}</M> Short waves therefore pass “in rhythm” much faster than long ones.</p>
            <ol>
              <li><M p=":">{t`\nu=c/\lambda`}</M> small <M p=",">\lambda</M> large <M p=".">\nu</M> The unit of <M>\nu</M> is <M p=",">{t`1/\mathrm s=\mathrm{Hz}`}</M> hertz.</li>
              <li><M p=":">{t`E=h\nu`}</M> each photon has a fixed energy that depends only on the frequency. More light does not mean stronger photons but <em>more</em> photons.</li>
              <li>Together: <M p=".">{t`E=hc/\lambda`}</M> Small wavelength, large energy. A UV photon carries more than a visible one, a visible one more than an infrared photon.</li>
            </ol>
            <p>Try it in the figure: move <M>\lambda</M> and watch the wave get squeezed and stretched while <M>\nu</M> and <M>E</M> change the opposite way. The number of waves in the picture is 2000 nm divided by <M p=".">\lambda</M></p>
          </>}
        />
        <LightWave />
        <T
          de={<p><b>Zahlenbeispiel.</b> Grünes Licht, <M p=":">{t`\lambda=530\,\mathrm{nm}=5{,}30\cdot10^{-7}\,\mathrm m`}</M> <M p=",">{t`\nu=\dfrac{2{,}998\cdot10^{8}}{5{,}30\cdot10^{-7}}\,\mathrm{Hz}\approx 5{,}66\cdot10^{14}\,\mathrm{Hz}`}</M> <M p=".">{t`E=h\nu\approx 6{,}626\cdot10^{-34}\cdot 5{,}66\cdot10^{14}\,\mathrm J\approx 3{,}75\cdot10^{-19}\,\mathrm J`}</M> Das ist winzig, aber ein Mol solcher Photonen trägt rund <M p=".">{t`226\,\mathrm{kJ}`}</M> Zum Vergleich: ein blaues Photon (<M>{t`430\,\mathrm{nm}`}</M> hat das Verhältnis <M>{t`530/430\approx 1{,}23`}</M> mal mehr Energie. (Die Rechnung ist nicht auf den Folien; sie ist im Code geprüft.)</p>}
          en={<p><b>Worked numbers.</b> Green light, <M p=":">{t`\lambda=530\,\mathrm{nm}=5.30\cdot10^{-7}\,\mathrm m`}</M> <M p=",">{t`\nu=\dfrac{2.998\cdot10^{8}}{5.30\cdot10^{-7}}\,\mathrm{Hz}\approx 5.66\cdot10^{14}\,\mathrm{Hz}`}</M> <M p=".">{t`E=h\nu\approx 6.626\cdot10^{-34}\cdot 5.66\cdot10^{14}\,\mathrm J\approx 3.75\cdot10^{-19}\,\mathrm J`}</M> That is tiny, but a mole of such photons carries about <M p=".">{t`226\,\mathrm{kJ}`}</M> For comparison: a blue photon (<M>{t`430\,\mathrm{nm}`}</M> has <M>{t`530/430\approx 1.23`}</M> times more energy. (The calculation is not on the slides; it is checked in the code.)</p>}
        />
        <Box kind="supplement" title={<T de="Wo das sichtbare Licht im Spektrum liegt" en="Where visible light sits in the spectrum" />}>
          <T
            de={<p>Das Auge sieht nur einen schmalen Streifen elektromagnetischer Wellen, ungefähr von <M>{t`400`}</M> bis <M>{t`700\,\mathrm{nm}`}</M> (die Folie 8 zeigt diesen Bereich). Kürzere Wellen sind Ultraviolett (UV), Röntgen- und Gammastrahlung; längere Infrarot, Mikrowellen und Radiowellen. Alle laufen im Vakuum gleich schnell, <M p=".">c</M> Die Grenzen sind Faustwerte, nicht Teil der Vorlesung; die Übung zeigt das ganze Spektrum als Bild.</p>}
            en={<p>The eye sees only a narrow strip of electromagnetic waves, roughly from <M>{t`400`}</M> to <M>{t`700\,\mathrm{nm}`}</M> (slide 8 shows this range). Shorter waves are ultraviolet (UV), X-rays and gamma rays; longer ones are infrared, microwaves and radio waves. All travel at the same speed in vacuum, <M p=".">c</M> The limits are rules of thumb, not part of the lecture; the exercise class shows the whole spectrum as a picture.</p>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={6} p="2" />} title={<T de="Übung 6.2 und Aufgabe 1" en="Exercise 6.2 and task 1" />}>
          <T
            de={<>
              <p>Licht ist eine elektromagnetische Welle mit der Lichtgeschwindigkeit <M p=",">{t`c=3\cdot10^{8}\,\mathrm{m/s}`}</M> die Wellenlänge bestimmt die Farbe, die Frequenz ist <M>{t`\nu=c/\lambda`}</M> in <M p=",">{t`\mathrm{Hz}=1/\mathrm s`}</M> Photonen sind kleine, getrennte Energiepakete; ihre Energie hängt von der Frequenz ab: <M p=",">{t`E_{\mathrm{ph}}=h\nu=hc/\lambda`}</M> mit <M p=".">{t`h=6{,}62\cdot10^{-34}\,\mathrm{Js}`}</M></p>
              <p><b>Aufgabe 1</b> (wahr oder falsch): (a) «Die Frequenz nimmt zu, wenn die Wellenlänge zunimmt» – <b>falsch</b> (<M>{t`\nu=c/\lambda`}</M> fällt). (b) «Elektromagnetische Strahlung läuft im Vakuum mit konstanter Geschwindigkeit, egal welche Wellenlänge» – <b>wahr</b>. (c) «Infrarotlicht hat eine höhere Frequenz als sichtbares Licht» – <b>falsch</b> (Infrarot hat die längere Welle, also die tiefere Frequenz).</p>
            </>}
            en={<>
              <p>Light is an electromagnetic wave with the speed of light <M p=",">{t`c=3\cdot10^{8}\,\mathrm{m/s}`}</M> the wavelength determines the colour, the frequency is <M>{t`\nu=c/\lambda`}</M> in <M p=",">{t`\mathrm{Hz}=1/\mathrm s`}</M> Photons are tiny discrete packages of energy; their energy depends on the frequency: <M p=",">{t`E_{\mathrm{ph}}=h\nu=hc/\lambda`}</M> with <M p=".">{t`h=6.62\cdot10^{-34}\,\mathrm{Js}`}</M></p>
              <p><b>Task 1</b> (true or false): (a) “The frequency of radiation increases as the wavelength increases” – <b>false</b> (<M>{t`\nu=c/\lambda`}</M> falls). (b) “Electromagnetic radiation travels through vacuum at constant speed, regardless of wavelength” – <b>true</b>. (c) “Infrared light has a higher frequency than visible light” – <b>false</b> (infrared has the longer wave, so the lower frequency).</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="wasserstoff" title={<T de="2. Das Rätsel des Wasserstoffs" en="2. The mystery of hydrogen" />}>
        <Box kind="lecture" src={<Src lec={6} p="8–9" />} title={<T de="Licht von Wasserstoffatomen; Rydberg-Gleichung" en="Light emitted from hydrogen atoms; Rydberg equation" />}>
          <T
            de={<ul>
              <li>Bild (Folie 8): Eine Wasserstoff-Lampe leuchtet rosa. Schickt man ihr Licht durch Spalt und Prisma, erscheinen auf dem Schirm nur einzelne Linien bei etwa 410, 434, 486 und 656 nm (<span lang="en">atomic spectrum</span>, «Atomlinien»). Woher kommen sie?</li>
              <li>Ab Mitte des 19. Jahrhunderts untersuchten Forscher wie der Basler Lehrer und Mathematiker Johann Balmer (1825–1898) das Licht von Wasserstoff. Heisse Lichtquellen (die Sonne) senden weisses Licht aus, mit Photonen aller Regenbogenfarben. Wasserstoffatome senden Photonen aber nur bei bestimmten Energien aus, <M p=".">{t`E=hc/\lambda`}</M></li>
              <li>Die Energien folgen einer einfachen, empirischen Formel, der <b>Rydberg-Gleichung</b>: <M p=",">{t`E_{\mathrm H}=\dfrac{hc}{\lambda_{\mathrm H}}=hc\,R_{\mathrm H}\Bigl(\dfrac{1}{n_1^2}-\dfrac{1}{n_2^2}\Bigr)`}</M> mit der Rydberg-Konstanten <M p=",">{t`R_{\mathrm H}=1{,}097\cdot10^{7}\,\mathrm{m^{-1}}`}</M> und ganzen Zahlen <M p=".">{t`n_2>n_1>0`}</M> (<M>{t`E_{\mathrm H}`}</M> ist die Energie der ausgesandten Photonen.)</li>
              <li>«Aber warum funktioniert diese Gleichung?» Die erste Erklärung gab Niels Bohr (1885–1962).</li>
            </ul>}
            en={<ul>
              <li>Picture (slide 8): a hydrogen lamp glows pink. If its light is sent through a slit and a prism, only single lines appear on the screen at about 410, 434, 486 and 656 nm (atomic spectrum, “atomic lines”). Where do they come from?</li>
              <li>From the mid-1800s researchers like the Basel schoolteacher and mathematician Johann Balmer (1825–1898) studied the light of hydrogen. Hot light sources (the sun) emit white light, with photons of all the colours of the rainbow. Hydrogen atoms, however, emit photons only at certain energies, <M p=".">{t`E=hc/\lambda`}</M></li>
              <li>The energies follow a simple, empirical formula, the <b>Rydberg equation</b>: <M p=",">{t`E_{\mathrm H}=\dfrac{hc}{\lambda_{\mathrm H}}=hc\,R_{\mathrm H}\Bigl(\dfrac{1}{n_1^2}-\dfrac{1}{n_2^2}\Bigr)`}</M> with the Rydberg constant <M p=",">{t`R_{\mathrm H}=1.097\cdot10^{7}\,\mathrm{m^{-1}}`}</M> and integers <M p=".">{t`n_2>n_1>0`}</M> (<M>{t`E_{\mathrm H}`}</M> is the energy of the emitted photons.)</li>
              <li>“But why does this equation work?” The first explanation was given by Niels Bohr (1885–1962).</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Gleichung.</b> Man wählt zwei ganze Zahlen, die kleinere <M>{t`n_1`}</M> und die grössere <M p=".">{t`n_2`}</M> Dann rechnet man <M p=".">{t`1/n_1^2-1/n_2^2`}</M> Das gibt eine Zahl zwischen 0 und 1, die mit <M>{t`hcR_{\mathrm H}`}</M> multipliziert die Energie eines Photons liefert. Für jedes Paar <M>{t`(n_1,n_2)`}</M> gibt es genau eine Linie, und die Wellenlänge folgt aus <M p=".">{t`1/\lambda=R_{\mathrm H}(1/n_1^2-1/n_2^2)`}</M></p>
            <p>Beispiel für <M p=":">{t`n_1=2`}</M> <M>{t`n_2=3`}</M> gibt <M p=",">{t`1/\lambda=1{,}097\cdot10^{7}\cdot(1/4-1/9)\,\mathrm{m^{-1}}=1{,}524\cdot10^{6}\,\mathrm{m^{-1}}`}</M> also <M p=".">{t`\lambda=656\,\mathrm{nm}`}</M> Das ist die rote Linie der Folie 8. Mit <M>{t`n_2=4,5,6`}</M> folgen die drei anderen:</p>
          </>}
          en={<>
            <p><b>How to read the equation.</b> You choose two integers, the smaller <M>{t`n_1`}</M> and the larger <M p=".">{t`n_2`}</M> Then you compute <M p=".">{t`1/n_1^2-1/n_2^2`}</M> That gives a number between 0 and 1 which, multiplied by <M p=",">{t`hcR_{\mathrm H}`}</M> delivers the energy of a photon. Each pair <M>{t`(n_1,n_2)`}</M> gives exactly one line, and the wavelength follows from <M p=".">{t`1/\lambda=R_{\mathrm H}(1/n_1^2-1/n_2^2)`}</M></p>
            <p>Example for <M p=":">{t`n_1=2`}</M> <M>{t`n_2=3`}</M> gives <M p=",">{t`1/\lambda=1.097\cdot10^{7}\cdot(1/4-1/9)\,\mathrm{m^{-1}}=1.524\cdot10^{6}\,\mathrm{m^{-1}}`}</M> so <M p=".">{t`\lambda=656\,\mathrm{nm}`}</M> That is the red line of slide 8. With <M>{t`n_2=4,5,6`}</M> the three others follow:</p>
          </>}
        />
        <div className="la-cases-wrap">
          <table className="la-cases">
            <thead><tr><th><M>{t`n_1`}</M></th><th><M>{t`n_2`}</M></th><th><M>\lambda</M></th><th><T de="Farbe" en="colour" /></th></tr></thead>
            <tbody>
              <tr><td><M>2</M></td><td><M>3</M></td><td><M>{t`656\,\mathrm{nm}`}</M></td><td><T de="rot" en="red" /></td></tr>
              <tr><td><M>2</M></td><td><M>4</M></td><td><M>{t`486\,\mathrm{nm}`}</M></td><td><T de="blaugrün" en="blue-green" /></td></tr>
              <tr><td><M>2</M></td><td><M>5</M></td><td><M>{t`434\,\mathrm{nm}`}</M></td><td><T de="blauviolett" en="blue-violet" /></td></tr>
              <tr><td><M>2</M></td><td><M>6</M></td><td><M>{t`410\,\mathrm{nm}`}</M></td><td><T de="violett" en="violet" /></td></tr>
            </tbody>
          </table>
        </div>
        <T
          de={<p>Diese vier Wellenlängen sind genau die vier Linien auf Folie 8 (im Code mit den Folienkonstanten nachgerechnet). Mit <M>{t`n_1=1`}</M> kommen Linien im Ultraviolett heraus (<span lang="en">Lyman</span>-Serie), mit <M>{t`n_1=3`}</M> im Infrarot (Paschen); die Folie zeigt nur den sichtbaren Teil. Die Gleichung ist <em>empirisch</em>: Sie beschreibt die Messung, erklärt sie aber nicht. Das tut erst Bohr.</p>}
          en={<p>These four wavelengths are exactly the four lines on slide 8 (recomputed in the code with the slide constants). With <M>{t`n_1=1`}</M> lines in the ultraviolet come out (Lyman series), with <M>{t`n_1=3`}</M> in the infrared (Paschen); the slide shows only the visible part. The equation is <em>empirical</em>: it describes the measurement but does not explain it. Only Bohr does that.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="bohr" title={<T de="3. Das Bohr-Modell" en="3. The Bohr model" />}>
        <Box kind="lecture" src={<Src lec={6} p="10–11" />} title={<T de="Bohr-Modell; Energien der Bahnen" en="Bohr model; orbital energies" />}>
          <T
            de={<ul>
              <li>Idee: das Atom als Sonnensystem im Kleinen. Kern = «Sonne», Elektron = «umlaufender Planet» (Wasserstoff: ein Proton, ein Elektron).</li>
              <li>Bohr nahm an: Das Elektron darf nur auf bestimmten Bahnen sein (<M p=")">{t`n=1,2,3,\dots`}</M> es hat bestimmte «erlaubte» Energien <M p=",">{t`E_n`}</M> und kann zwischen den erlaubten Bahnen wechseln. Dazu muss es ein Photon <b>aufnehmen</b> oder <b>aussenden</b> mit <M p=".">{t`E_{\mathrm{ph}}=h\nu`}</M> Beispiel <M p=":">{t`E_3\to E_1`}</M> mit <M>{t`E_3>E_1`}</M> gilt <M p=".">{t`\Delta E_{3\to1}=E_1-E_3=-E_{\mathrm{ph}}`}</M> (Handschrift: Das Vorzeichen ist negativ, weil das Elektron Energie verliert, indem es ein Photon aussendet.)</li>
              <li>Bohr setzte das als <em>Postulate</em> (Annahmen) – obwohl es Probleme macht. Die richtige Beschreibung braucht Quantenmechanik, aber das Bild ist auf der richtigen Spur. (Handschrift: Ein Elektron auf einer Kreisbahn müsste klassisch Energie verlieren und in den Kern stürzen. Tut es aber nicht!)</li>
              <li>Mit diesen Annahmen kann man die Energie jeder Bahn aus den klassischen Bewegungsgleichungen bestimmen: <M p=",">{t`E_n=-\dfrac{hc\,R_{\mathrm H}}{n^2}`}</M> und <M p=".">{t`\Delta E=E_{n_f}-E_{n_i}=-hc\,R_{\mathrm H}\Bigl(\dfrac{1}{n_f^2}-\dfrac{1}{n_i^2}\Bigr)`}</M> (Handschrift: Die Energie ist negativ, weil das Elektron durch die Nähe zum positiven Kern Energie verliert: Entgegengesetzte Ladungen ziehen sich an!)</li>
              <li><b>Beispiel:</b> Das Elektron fällt von <M>{t`n=3`}</M> nach <M p=".">{t`n=1`}</M> <M p=",">{t`\Delta E_{3\to1}=E_1-E_3=-2{,}18\cdot10^{-18}\,\mathrm J\,\bigl(1-\tfrac19\bigr)=-1{,}94\cdot10^{-18}\,\mathrm J`}</M> <M p=",">{t`E_{\mathrm{ph}}=+1{,}94\cdot10^{-18}\,\mathrm J`}</M> <M p=".">{t`\lambda_{\mathrm{ph}}=hc/E_{\mathrm{ph}}=103\,\mathrm{nm}`}</M> (Handschrift: tiefes Ultraviolett; 10–121 nm ist extremes UV, das ASML in der EUV-Lithographie bei <M>{t`13{,}5\,\mathrm{nm}`}</M> nutzt.)</li>
            </ul>}
            en={<ul>
              <li>Idea: the atom as a solar system in miniature. Nucleus = “sun”, electron = “orbiting planet” (hydrogen: one proton, one electron).</li>
              <li>Bohr proposed: the electron can occupy only certain orbits (<M p=")">{t`n=1,2,3,\dots`}</M> it has specific “allowed” energies <M p=",">{t`E_n`}</M> and can move between the allowed orbits. For this it must <b>absorb</b> or <b>emit</b> a photon with <M p=".">{t`E_{\mathrm{ph}}=h\nu`}</M> Example <M p=":">{t`E_3\to E_1`}</M> with <M>{t`E_3>E_1`}</M> we have <M p=".">{t`\Delta E_{3\to1}=E_1-E_3=-E_{\mathrm{ph}}`}</M> (Handwritten: the sign is negative because the electron loses energy by emitting a photon.)</li>
              <li>Bohr proposed these as <em>postulates</em> – though they are problematic. The correct description needs quantum mechanics, but the picture is on the right track. (Handwritten: an electron on a circular orbit should classically lose energy and spiral into the nucleus. But it does not!)</li>
              <li>With these assumptions the energy of every orbit follows from the classical equations of motion: <M p=",">{t`E_n=-\dfrac{hc\,R_{\mathrm H}}{n^2}`}</M> and <M p=".">{t`\Delta E=E_{n_f}-E_{n_i}=-hc\,R_{\mathrm H}\Bigl(\dfrac{1}{n_f^2}-\dfrac{1}{n_i^2}\Bigr)`}</M> (Handwritten: the energy is negative because the electron lowers its energy by moving closer to the positively charged nucleus: opposite charges attract!)</li>
              <li><b>Example:</b> the electron falls from <M>{t`n=3`}</M> to <M p=".">{t`n=1`}</M> <M p=",">{t`\Delta E_{3\to1}=E_1-E_3=-2.18\cdot10^{-18}\,\mathrm J\,\bigl(1-\tfrac19\bigr)=-1.94\cdot10^{-18}\,\mathrm J`}</M> <M p=",">{t`E_{\mathrm{ph}}=+1.94\cdot10^{-18}\,\mathrm J`}</M> <M p=".">{t`\lambda_{\mathrm{ph}}=hc/E_{\mathrm{ph}}=103\,\mathrm{nm}`}</M> (Handwritten: deep ultraviolet; 10–121 nm is extreme UV, which ASML uses in EUV lithography at <M p=".)">{t`13.5\,\mathrm{nm}`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Zeilen.</b> Stell dir ein Haus mit Stockwerken vor, nur ohne Treppenabsätze: Das Elektron kann in Stock 1, 2, 3 … stehen, nie dazwischen. Jedes Stockwerk hat eine feste Energie <M p=".">{t`E_n`}</M></p>
            <ol>
              <li><b>Warum negativ?</b> Die Null der Energie liegt «ganz weit weg» (<M p=")">{t`n=\infty`}</M> dort ist das Elektron frei. Je näher am Kern, desto stärker ist es gebunden, also liegt seine Energie <em>unter</em> null. <M>{t`n=1`}</M> ist am tiefsten: <M p=".">{t`E_1=-2{,}18\cdot10^{-18}\,\mathrm J`}</M></li>
              <li><b>Warum <M p="?">{t`1/n^2`}</M></b> Die Energie wächst nach oben, aber die Stufen werden immer enger. <M>{t`E_2=E_1/4`}</M> <M p=",">{t`E_3=E_1/9`}</M> und bei <M>{t`n\to\infty`}</M> läuft sie gegen null. Das zeigt das Bild der Niveaus.</li>
              <li><b>Was ist <M p="?">{t`\Delta E`}</M></b> <M>{t`\Delta E=E_f-E_i`}</M> ist «Ende minus Anfang». Fällt das Elektron nach unten (<M p=")">{t`n_f<n_i`}</M> ist <M>{t`\Delta E`}</M> negativ: Es gibt Energie ab, und die geht als Photon weg. Das Photon hat die Energie <M>{t`|\Delta E|`}</M> und die Wellenlänge <M p=".">{t`\lambda=hc/|\Delta E|`}</M> Springt es nach oben, muss ein Photon genau dieser Energie <em>aufgenommen</em> werden.</li>
              <li><b>Warum passt das zu Rydberg?</b> Setzt man <M>{t`E_n=-hcR_{\mathrm H}/n^2`}</M> in <M>{t`E_f-E_i`}</M> ein, erhält man bis aufs Vorzeichen die Rydberg-Gleichung. Die empirische Formel der Messungen steckt in Bohrs Energien.</li>
            </ol>
            <p>Die Figur zeigt dasselbe Springen dreimal: in den Bahnen, in den Energieniveaus und im Spektrum. Wähle Start und Ziel. Bei den Übergängen nach <M>{t`n=2`}</M> (Balmer-Serie) liegt das Photon im Streifen von 400 bis 700 nm, und sein Ort fällt auf eine der vier Linien.</p>
          </>}
          en={<>
            <p><b>How to read the lines.</b> Picture a building with floors but no landings: the electron can stand on floor 1, 2, 3 … never in between. Each floor has a fixed energy <M p=".">{t`E_n`}</M></p>
            <ol>
              <li><b>Why negative?</b> The zero of energy lies “very far away” (<M p=")">{t`n=\infty`}</M> where the electron is free. The closer to the nucleus, the more strongly it is bound, so its energy lies <em>below</em> zero. <M>{t`n=1`}</M> is lowest: <M p=".">{t`E_1=-2.18\cdot10^{-18}\,\mathrm J`}</M></li>
              <li><b>Why <M p="?">{t`1/n^2`}</M></b> The energy rises upwards, but the steps get closer and closer. <M>{t`E_2=E_1/4`}</M> <M p=",">{t`E_3=E_1/9`}</M> and for <M>{t`n\to\infty`}</M> it approaches zero. The picture of the levels shows this.</li>
              <li><b>What is <M p="?">{t`\Delta E`}</M></b> <M>{t`\Delta E=E_f-E_i`}</M> is “end minus start”. If the electron falls down (<M p=")">{t`n_f<n_i`}</M> <M>{t`\Delta E`}</M> is negative: it gives off energy, and that leaves as a photon. The photon has the energy <M>{t`|\Delta E|`}</M> and the wavelength <M p=".">{t`\lambda=hc/|\Delta E|`}</M> If it jumps up, a photon of exactly this energy must be <em>absorbed</em>.</li>
              <li><b>Why does this match Rydberg?</b> Insert <M>{t`E_n=-hcR_{\mathrm H}/n^2`}</M> into <M>{t`E_f-E_i`}</M> and you get the Rydberg equation up to the sign. The empirical formula of the measurements is hidden in Bohr’s energies.</li>
            </ol>
            <p>The figure shows the same jump three times: in the orbits, in the energy levels and in the spectrum. Choose start and target. For the transitions to <M>{t`n=2`}</M> (Balmer series) the photon lies in the strip from 400 to 700 nm, and its place falls on one of the four lines.</p>
          </>}
        />
        <BohrExplorer />
        <Derivation title={<T de={<>Das Beispiel der Folie: <M>{t`3\to1`}</M></>} en={<>The slide’s example: <M>{t`3\to1`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: Elektron fällt von n = 3 nach n = 1 und sendet ein Photon aus', 'Animation: electron falls from n = 3 to n = 1 and emits a photon')}
            steps={[
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Das Elektron des Wasserstoffatoms sitzt auf der Bahn <M>{t`n=3`}</M> (links), das heisst auf dem Energieniveau <M>{t`E_3`}</M> (rechts).</>}
                en={<>The electron of the hydrogen atom sits on orbit <M>{t`n=3`}</M> (left), that is on the energy level <M>{t`E_3`}</M> (right).</>} /> },
              { ms: 3500, holdMs: 2400, caption: <T
                de={<>Es fällt auf die Bahn <M p=",">{t`n=1`}</M> also auf das tiefste Niveau. Die frei gewordene Energie verlässt das Atom als Photon (gelbe Welle).</>}
                en={<>It falls to orbit <M p=",">{t`n=1`}</M> that is to the lowest level. The released energy leaves the atom as a photon (yellow wave).</>} /> },
              { ms: 3000, holdMs: 2600, caption: <T
                de={<>Energiebilanz: <M p=",">{t`\Delta E=E_1-E_3=-2{,}18\cdot10^{-18}\,\mathrm J\,(1-\tfrac19)=-1{,}94\cdot10^{-18}\,\mathrm J`}</M> negativ, weil das Elektron Energie verliert. Das Photon trägt <M p=".">{t`E_{\mathrm{ph}}=+1{,}94\cdot10^{-18}\,\mathrm J`}</M></>}
                en={<>Energy balance: <M p=",">{t`\Delta E=E_1-E_3=-2.18\cdot10^{-18}\,\mathrm J\,(1-\tfrac19)=-1.94\cdot10^{-18}\,\mathrm J`}</M> negative because the electron loses energy. The photon carries <M p=".">{t`E_{\mathrm{ph}}=+1.94\cdot10^{-18}\,\mathrm J`}</M></>} /> },
              { ms: 2500, caption: <T
                de={<>Die Wellenlänge des Photons: <M p=",">{t`\lambda=hc/E_{\mathrm{ph}}=103\,\mathrm{nm}`}</M> tiefes Ultraviolett, für das Auge unsichtbar.</>}
                en={<>The wavelength of the photon: <M p=",">{t`\lambda=hc/E_{\mathrm{ph}}=103\,\mathrm{nm}`}</M> deep ultraviolet, invisible to the eye.</>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={lightScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Die Folie rechnet mit <M>{t`hcR_{\mathrm H}=2{,}18\cdot10^{-18}\,\mathrm J`}</M> (mit den Konstanten der Folien <M p=").">{t`2{,}1796\cdot10^{-18}\,\mathrm J`}</M> Das ergibt <M>{t`1{,}937\cdot10^{-18}\,\mathrm J`}</M> und <M p=",">{t`\lambda=102{,}6\,\mathrm{nm}`}</M> was die Folie auf <M>{t`103\,\mathrm{nm}`}</M> rundet. Ein Mol solcher Photonen trägt rund <M p=".">{t`1170\,\mathrm{kJ}`}</M></p>}
          en={<p>The slide computes with <M>{t`hcR_{\mathrm H}=2.18\cdot10^{-18}\,\mathrm J`}</M> (with the constants of the slides <M p=").">{t`2.1796\cdot10^{-18}\,\mathrm J`}</M> That gives <M>{t`1.937\cdot10^{-18}\,\mathrm J`}</M> and <M p=",">{t`\lambda=102.6\,\mathrm{nm}`}</M> which the slide rounds to <M p=".">{t`103\,\mathrm{nm}`}</M> A mole of such photons carries about <M p=".">{t`1170\,\mathrm{kJ}`}</M></p>}
        />
        <Box kind="uebung" src={<Src ex={6} p="3–4" />} title={<T de="Übung 6.3 und Aufgabe 2" en="Exercise 6.3 and task 2" />}>
          <T
            de={<>
              <p>Das Bohr-Modell ist aus dem Wasserstoffatom abgeleitet: Kern <M>{t`p^+`}</M> Elektron <M>{t`e^-`}</M> auf Kreisbahnen mit Nummer <M p=".">n</M> Die potentielle Energie hängt von der Bahn ab: bei unendlichem Abstand ist <M p=",">{t`E=0`}</M> je näher am Kern, desto kleiner. Die <M>n</M>-te Bahn hat <M p=",">{t`E_n=-\dfrac{h\,c\,R_{\mathrm H}}{n^2}`}</M> mit <M p=".">{t`R_{\mathrm H}=1{,}097\cdot10^{7}\,\mathrm{m^{-1}}`}</M></p>
              <p>Wechselt das Elektron die Bahn, ändert sich seine Energie: <M p=".">{t`\Delta E_{i\to f}=E_f-E_i=h\,c\,R_{\mathrm H}\Bigl(\dfrac{1}{n_i^2}-\dfrac{1}{n_f^2}\Bigr)`}</M> <M p=":">{t`\Delta E>0`}</M> Elektron nach aussen, Photon <em>aufgenommen</em>. <M p=":">{t`\Delta E<0`}</M> Elektron nach innen, Photon <em>abgegeben</em>.</p>
              <p><b>Aufgabe 2.</b> Das Elektron eines Wasserstoffatoms wird von <M>{t`n=1`}</M> nach <M>{t`n=\infty`}</M> angeregt. (a) Was ist das Ergebnis? (b) Welche Wellenlänge muss absorbiert werden? (c) Was passiert mit kürzerer Wellenlänge? <b>(a)</b> Das Elektron wird aus dem Atom entfernt. <b>(b)</b> <M p=",">{t`\Delta E=2{,}18\cdot10^{-18}\,\mathrm J`}</M> also <M p=",">{t`\lambda=\dfrac{hc}{\Delta E}=\dfrac{6{,}626\cdot10^{-34}\cdot 2{,}998\cdot10^{8}}{2{,}18\cdot10^{-18}}\,\mathrm m\approx 9{,}11\cdot10^{-8}\,\mathrm m=91{,}1\,\mathrm{nm}`}</M> Ultraviolett. <b>(c)</b> Kürzere Wellenlänge heisst mehr Energie: Das Elektron wird nicht nur abgelöst, es bekommt auch kinetische Energie.</p>
            </>}
            en={<>
              <p>The Bohr model is derived from the hydrogen atom: nucleus <M>{t`p^+`}</M> electron <M>{t`e^-`}</M> on circular orbits with number <M p=".">n</M> The potential energy depends on the orbit: at infinite distance <M p=",">{t`E=0`}</M> the closer to the nucleus the smaller. The <M>n</M>-th orbit has <M p=",">{t`E_n=-\dfrac{h\,c\,R_{\mathrm H}}{n^2}`}</M> with <M p=".">{t`R_{\mathrm H}=1.097\cdot10^{7}\,\mathrm{m^{-1}}`}</M></p>
              <p>If the electron changes orbit, its energy changes: <M p=".">{t`\Delta E_{i\to f}=E_f-E_i=h\,c\,R_{\mathrm H}\Bigl(\dfrac{1}{n_i^2}-\dfrac{1}{n_f^2}\Bigr)`}</M> <M p=":">{t`\Delta E>0`}</M> electron moved outwards, photon <em>absorbed</em>. <M p=":">{t`\Delta E<0`}</M> electron moved inwards, photon <em>released</em>.</p>
              <p><b>Task 2.</b> The electron of a hydrogen atom is excited from <M>{t`n=1`}</M> to <M p=".">{t`n=\infty`}</M> (a) What is the result? (b) What wavelength must be absorbed? (c) What happens with a shorter wavelength? <b>(a)</b> The electron is removed from the atom. <b>(b)</b> <M p=",">{t`\Delta E=2.18\cdot10^{-18}\,\mathrm J`}</M> so <M p=",">{t`\lambda=\dfrac{hc}{\Delta E}=\dfrac{6.626\cdot10^{-34}\cdot 2.998\cdot10^{8}}{2.18\cdot10^{-18}}\,\mathrm m\approx 9.11\cdot10^{-8}\,\mathrm m=91.1\,\mathrm{nm}`}</M> ultraviolet. <b>(c)</b> A shorter wavelength means more energy: the electron is not only removed, it also gains kinetic energy.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Der Wert <M>{t`91{,}1\,\mathrm{nm}`}</M> gehört zur Energie <M p=".">{t`2{,}18\cdot10^{-18}\,\mathrm J`}</M> (das Blatt schreibt sie als <M>{t`218\cdot10^{-20}\,\mathrm J`}</M> nach der Achse des Brown-Bildes, ohne Fehler). In der Figur bekommst du dasselbe, wenn du von <M>{t`n=1`}</M> nach <M>{t`\infty`}</M> gehst. Mit den genauen Folienkonstanten ist es <M p=".">{t`91{,}2\,\mathrm{nm}`}</M></p>}
          en={<p>The value <M>{t`91.1\,\mathrm{nm}`}</M> belongs to the energy <M p=".">{t`2.18\cdot10^{-18}\,\mathrm J`}</M> (the sheet writes it as <M>{t`218\cdot10^{-20}\,\mathrm J`}</M> following the axis of the Brown picture, which is not an error). In the figure you get the same if you go from <M>{t`n=1`}</M> to <M p=".">{t`\infty`}</M> With the exact slide constants it is <M p=".">{t`91.2\,\mathrm{nm}`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="grenzen" title={<T de="4. Die Grenzen des Bohr-Modells" en="4. The limits of the Bohr model" />}>
        <Box kind="lecture" src={<Src lec={6} p="12" />} title={<T de="Grenzen; Quantenmechanik" en="Limitations; quantum mechanics" />}>
          <T
            de={<ul>
              <li>Das Modell kann die stabilen Bahnen nicht erklären (Handschrift: warum stürzt das Elektron nicht in den Kern?). Es erklärt nur das <b>Wasserstoffatom</b>; für andere Atome versagt es.</li>
              <li>Die <b>Quantenmechanik</b> behebt die Grenzen. Sie sagt aber die <b>Unschärferelation</b> voraus: <M p=".">{t`\Delta x\cdot\Delta p\ge\dfrac{h}{4\pi}`}</M> <M>{t`\Delta x`}</M> und <M>{t`\Delta p`}</M> sind die Unsicherheiten, mit denen wir Ort <M>x</M> und Impuls <M>p</M> des Elektrons kennen. (Handschrift: Es gibt eine grundsätzliche Grenze, wie gut wir die Bewegung des Elektrons kennen können. Klassisch könnte man <M>{t`\Delta x=0`}</M> und <M>{t`\Delta p=0`}</M> haben, quantenmechanisch nicht!)</li>
              <li>Folge: Die Bahn ist «unscharf», man spricht von einer <b>Elektronenwolke</b>. (Handschrift: Wir dürfen Bohrs Idee einer Bahn mit fester Energie behalten, aber die Bahn ist unscharf.)</li>
            </ul>}
            en={<ul>
              <li>The model cannot explain the stable orbits (handwritten: why does the electron not spiral into the nucleus?). It explains only the <b>hydrogen atom</b>; for other atoms it fails.</li>
              <li><b>Quantum mechanics</b> resolves the limitations. But it predicts the <b>uncertainty principle</b>: <M p=".">{t`\Delta x\cdot\Delta p\ge\dfrac{h}{4\pi}`}</M> <M>{t`\Delta x`}</M> and <M>{t`\Delta p`}</M> are the uncertainties with which we know the position <M>x</M> and momentum <M>p</M> of the electron. (Handwritten: a fundamental limit exists to how well we can know the electron’s motion. Classically one could have <M>{t`\Delta x=0`}</M> and <M p=",">{t`\Delta p=0`}</M> in quantum mechanics not!)</li>
              <li>Consequence: the orbit is “fuzzy”; we speak of an <b>electron cloud</b>. (Handwritten: we can still use Bohr’s idea of an orbit with fixed energy, but the orbit is fuzzy.)</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das.</b> Der Impuls <M>{t`p=mv`}</M> ist Masse mal Geschwindigkeit. Die Unschärferelation sagt: Je genauer man weiss, wo das Elektron ist (kleines <M p=")">{t`\Delta x`}</M> desto ungenauer weiss man, wie schnell es ist (grosses <M p=")">{t`\Delta p`}</M> und umgekehrt. Das Produkt kann nie kleiner als <M>{t`h/(4\pi)`}</M> werden. Weil <M>h</M> winzig ist, spürt man das bei einem Auto nie. Beim Elektron im Atom ist es entscheidend.</p>
            <p>Darum zeichnet man nicht mehr eine Bahn, sondern eine <em>Wolke</em>. Jede «Momentaufnahme» des Elektrons liefert einen Punkt; sehr viele Punkte zeichnen die Wolke. Die Übung zeigt es so: Das Elektron ist mit 90 % Wahrscheinlichkeit innerhalb der gestrichelten Linie, und diese Region nennt man <em>Orbital</em>. Zieh den Regler.</p>
          </>}
          en={<>
            <p><b>How to read this.</b> The momentum <M>{t`p=mv`}</M> is mass times velocity. The uncertainty principle says: the better you know where the electron is (small <M p=")">{t`\Delta x`}</M> the worse you know how fast it is (large <M p=")">{t`\Delta p`}</M> and vice versa. The product can never be smaller than <M p=".">{t`h/(4\pi)`}</M> Because <M>h</M> is tiny, you never notice this with a car. For the electron in the atom it is decisive.</p>
            <p>So one no longer draws an orbit but a <em>cloud</em>. Each “snapshot” of the electron gives a dot; very many dots draw the cloud. The exercise class shows it like this: the electron is within the dashed line with 90 % probability, and this region is called an <em>orbital</em>. Drag the slider.</p>
          </>}
        />
        <CloudFigure />
        <Box kind="uebung" src={<Src ex={6} p="5" />} title={<T de="Übung 6.4: Quantenmechanik" en="Exercise 6.4: quantum mechanics" />}>
          <T
            de={<p>Das Bohr-Modell ist veraltet. Heisenbergs Unschärferelation: Ort <M>x</M> und Impuls <M>{t`p=m\cdot v`}</M> (<M p=")">{t`[p]=\mathrm{kg\,m/s}`}</M> lassen sich nicht beide genau bestimmen, <M p=".">{t`\Delta x\cdot\Delta p>h/(4\pi)`}</M> Statt fester Bahnen gibt es <em>Orbitale</em>: Regionen um den Kern, in denen man das Elektron mit 90 % Wahrscheinlichkeit findet (Punktwolke mit gestrichelter Linie, jeder Punkt ein möglicher Ort). Das neue Modell: Die Elektronen besetzen verschiedene Schalen (<M p=")">n</M> jede Schale enthält Unterschalen (<M p=",">s</M> <M p=",">p</M> <M>d</M> …), das sind Gruppen von Orbitalen, und jedes Orbital fasst höchstens zwei Elektronen. Mehr dazu in der nächsten Lektion.</p>}
            en={<p>The Bohr model is outdated. Heisenberg’s uncertainty principle: position <M>x</M> and momentum <M>{t`p=m\cdot v`}</M> (<M p=")">{t`[p]=\mathrm{kg\,m/s}`}</M> cannot both be determined precisely, <M p=".">{t`\Delta x\cdot\Delta p>h/(4\pi)`}</M> Instead of fixed paths there are <em>orbitals</em>: regions around the nucleus where the electron is found with 90 % probability (dot cloud with a dashed line, each dot a possible place). The new model: electrons occupy different shells (<M p=")">n</M> each shell contains subshells (<M p=",">s</M> <M p=",">p</M> <M>d</M> …), which are groups of orbitals, and each orbital holds at most two electrons. More on this in the next lesson.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Das Elektron kreist wirklich wie ein Planet»" en="“The electron really orbits like a planet”" />}>
        <T
          de={<p>Das Bild ist ein Hilfsmittel. Ein Planet hat zu jedem Zeitpunkt einen genauen Ort und eine genaue Geschwindigkeit; ein Elektron nicht (Unschärferelation). Bohrs Bahnen liefern die richtigen Energien für Wasserstoff, aber die Wirklichkeit ist eine Wolke. Und für Atome mit mehreren Elektronen versagt das Bild.</p>}
          en={<p>The picture is a tool. A planet has an exact place and an exact velocity at every moment; an electron does not (uncertainty principle). Bohr’s orbits give the right energies for hydrogen, but reality is a cloud. And for atoms with several electrons the picture fails.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Negative Energie heisst: das Elektron hat keine Energie»" en="“Negative energy means the electron has no energy”" />}>
        <T
          de={<p>Die Null ist nur festgelegt als «Elektron weit weg und in Ruhe». Alles darunter ist <em>gebunden</em>: Man müsste Energie zuführen, um das Elektron zu lösen. Je negativer, desto fester sitzt es. <M>{t`n=1`}</M> ist am negativsten und am festesten gebunden. Die Ionisierung (<M>{t`n=1\to\infty`}</M> kostet <M p=".">{t`2{,}18\cdot10^{-18}\,\mathrm J`}</M></p>}
          en={<p>The zero is simply defined as “electron far away and at rest”. Everything below is <em>bound</em>: you would have to supply energy to free the electron. The more negative, the tighter it sits. <M>{t`n=1`}</M> is the most negative and most tightly bound. Ionisation (<M>{t`n=1\to\infty`}</M> costs <M p=".">{t`2.18\cdot10^{-18}\,\mathrm J`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Helleres Licht hat Photonen mit mehr Energie»" en="“Brighter light has photons with more energy”" />}>
        <T
          de={<p>Die Energie eines einzelnen Photons ist <M p=",">{t`E=h\nu`}</M> sie hängt nur von der Farbe (Frequenz) ab. Helligkeit heisst, wie viele Photonen pro Sekunde ankommen. Ein schwaches blaues Licht hat energiereichere Photonen als ein starker roter Scheinwerfer, nur weniger davon.</p>}
          en={<p>The energy of a single photon is <M p=",">{t`E=h\nu`}</M> it depends only on the colour (frequency). Brightness means how many photons arrive per second. A faint blue light has more energetic photons than a strong red searchlight, just fewer of them.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Bei der Rydberg-Gleichung ist es egal, welche Zahl grösser ist»" en="“In the Rydberg equation it does not matter which number is larger”" />}>
        <T
          de={<p>Doch: <M>{t`n_2>n_1`}</M> sorgt dafür, dass <M>{t`1/n_1^2-1/n_2^2`}</M> positiv ist und man eine positive Wellenlänge erhält. Der Übergang selbst läuft aber in beide Richtungen: von <M>{t`n_2`}</M> nach <M>{t`n_1`}</M> wird ein Photon ausgesandt, von <M>{t`n_1`}</M> nach <M>{t`n_2`}</M> genau dasselbe Photon aufgenommen. Die Wellenlänge ist gleich, nur das Vorzeichen von <M>{t`\Delta E`}</M> wechselt.</p>}
          en={<p>It does: <M>{t`n_2>n_1`}</M> makes sure that <M>{t`1/n_1^2-1/n_2^2`}</M> is positive, so you get a positive wavelength. The transition itself runs in both directions, though: from <M>{t`n_2`}</M> to <M>{t`n_1`}</M> a photon is emitted, from <M>{t`n_1`}</M> to <M>{t`n_2`}</M> exactly the same photon is absorbed. The wavelength is the same, only the sign of <M>{t`\Delta E`}</M> changes.</p>}
        />
      </Box>

      <Box kind="key">
        <T
          de={<ul>
            <li>Licht ist eine Welle mit <M p=",">{t`\nu=c/\lambda`}</M> und kommt in Photonen mit der Energie <M p=".">{t`E=h\nu=hc/\lambda`}</M> Kurze Welle: viel Energie, hohe Frequenz.</li>
            <li>Wasserstoff sendet nur einzelne Linien aus; sie folgen der Rydberg-Gleichung <M p=".">{t`1/\lambda=R_{\mathrm H}(1/n_1^2-1/n_2^2)`}</M></li>
            <li>Bohr: nur bestimmte Bahnen, <M p=",">{t`E_n=-hcR_{\mathrm H}/n^2`}</M> Wechsel nur mit einem Photon der Energie <M p=".">{t`|\Delta E|`}</M> Fallen gibt ein Photon ab, Steigen nimmt eines auf.</li>
            <li>Beispiel <M p=":">{t`3\to1`}</M> <M>{t`1{,}94\cdot10^{-18}\,\mathrm J`}</M> <M p=",">{t`\lambda=103\,\mathrm{nm}`}</M> Ultraviolett. Das Modell stimmt nur für Wasserstoff; die Quantenmechanik ersetzt die Bahn durch eine Wolke (Unschärferelation).</li>
          </ul>}
          en={<ul>
            <li>Light is a wave with <M p=",">{t`\nu=c/\lambda`}</M> and comes in photons of energy <M p=".">{t`E=h\nu=hc/\lambda`}</M> Short wave: lots of energy, high frequency.</li>
            <li>Hydrogen gives off only single lines; they follow the Rydberg equation <M p=".">{t`1/\lambda=R_{\mathrm H}(1/n_1^2-1/n_2^2)`}</M></li>
            <li>Bohr: only certain orbits, <M p=",">{t`E_n=-hcR_{\mathrm H}/n^2`}</M> changes only with a photon of energy <M p=".">{t`|\Delta E|`}</M> Falling gives off a photon, rising absorbs one.</li>
            <li>Example <M p=":">{t`3\to1`}</M> <M>{t`1.94\cdot10^{-18}\,\mathrm J`}</M> <M p=",">{t`\lambda=103\,\mathrm{nm}`}</M> ultraviolet. The model holds only for hydrogen; quantum mechanics replaces the orbit by a cloud (uncertainty principle).</li>
          </ul>}
        />
        <MD>{t`E_n=-\dfrac{hc\,R_{\mathrm H}}{n^2}`}</MD>
      </Box>
    </article>
  );
}
