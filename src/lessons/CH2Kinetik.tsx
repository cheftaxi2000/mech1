import { Box, Derivation, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { ChemAnim } from '../viz/chem/ChemAnim';
import { DiffusionWalk } from '../viz/chem/DiffusionWalk';
import { MaxwellExplorer } from '../viz/chem/MaxwellExplorer';
import { VdwExplorer } from '../viz/chem/VdwExplorer';
import { kmtScene, vdwScene } from '../viz/chem/kineticScenes';

const t = String.raw;

export default function CH2Kinetik() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Das ideale Gasgesetz sagt, <em>was</em> ein Gas tut. Diese Lektion sagt, <em>warum</em>. Stell dir Tischtennisbälle vor, die in einem Kasten wild herumfliegen und nie zur Ruhe kommen. Daraus folgt, was Temperatur bedeutet, warum die Moleküle verschieden schnell sind und weshalb der Duft eines Parfüms nur langsam durch den Raum zieht. Zum Schluss sehen wir, wo das einfache Bild versagt: bei hohem Druck und tiefer Temperatur, wo die Moleküle sich anziehen und Platz brauchen.</p>}
        en={<p className="lede">The ideal gas law says <em>what</em> a gas does. This lesson says <em>why</em>. Picture ping-pong balls flying wildly in a box and never coming to rest. From this follows what temperature means, why the molecules have different speeds, and why the smell of perfume creeps through a room only slowly. At the end we see where the simple picture fails: at high pressure and low temperature, where molecules attract each other and take up room.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="theorie" title={<T de="1. Die kinetische Gastheorie" en="1. The kinetic theory of gases" />}>
        <Box kind="lecture" src={<Src lec={2} p="24–25" />} title={<T de="Warum erklärt das ideale Gasgesetz das Verhalten von Gasen?" en="But why does the IGL explain gas behaviour?" />}>
          <T
            de={<ul>
              <li>Man braucht eine Theorie: die <span lang="en">kinetic-molecular theory</span> (kinetische Gastheorie). Das Modell: Die Teilchen sind ständig in Bewegung und haben kinetische Energie <M p=",">{t`E_k=\tfrac12 mv^2`}</M> mit der Masse <M>m</M> und der Geschwindigkeit <M>v</M> des Moleküls.</li>
              <li>Die Gasteilchen bewegen sich zufällig, nehmen vernachlässigbar wenig Volumen ein, stossen miteinander zusammen, ohne sich anzuziehen oder abzustossen, und haben eine mittlere Bewegungsenergie, die von <M>T</M> abhängt.</li>
              <li>Handschrift: Die Moleküle im Raum sind nicht still, sondern fliegen mit rund <M>{t`500\,\mathrm{m/s}`}</M> umher und prallen wie Tischtennisbälle voneinander ab. Sie kleben nicht aneinander und stossen sich nicht ab.</li>
              <li>Ein einzelnes Molekül kann schneller oder langsamer sein. Aber die <em>mittlere</em> kinetische Energie ist bei gegebener absoluter Temperatur immer dieselbe und hängt nicht von der Gasart ab, nur von <M p=".">{t`T\,(\mathrm K)`}</M></li>
              <li>Das erklärt den Zusammenhang von <M>P</M> und <M p=":">T</M> Der Druck kommt von den Stössen auf die Wand. Er hängt von der Zahl und der Stärke der Stösse ab. Verdoppelt man <M p=",">T</M> verdoppelt sich die mittlere Energie, und man erwartet den doppelten Druck: <M p=".">{t`P\propto T`}</M> Das stimmt mit dem idealen Gasgesetz überein. Mit ähnlichen Argumenten folgt <M p=".">{t`P\propto 1/V`}</M></li>
              <li><b>Bedeutung von <M p="?">T</M></b> Die mittlere kinetische Energie <M>{t`\overline{E_k}`}</M> der Moleküle.</li>
            </ul>}
            en={<ul>
              <li>We need a theory: the <span lang="en">kinetic-molecular theory</span>. The model: the gas species are in constant motion with kinetic energy <M p=",">{t`E_k=\tfrac12 mv^2`}</M> where <M>m</M> is the mass and <M>v</M> the velocity of a molecule.</li>
              <li>Gas species move randomly, occupy negligible volume, collide with each other but neither attract nor repel, and have an average kinetic energy that depends on <M p=".">T</M></li>
              <li>Handwritten: the gas molecules in this room are not static but fly around at about <M p=",">{t`500\,\mathrm{m/s}`}</M> bouncing off each other like ping-pong balls. They do not stick to or repel each other.</li>
              <li>A specific molecule may move faster or slower. But the <em>average</em> kinetic energy is constant for a given absolute temperature and does not depend on the type of molecule, only on <M p=".">{t`T\,(\mathrm K)`}</M></li>
              <li>This explains the <M p=",">P</M><M>T</M> relationship: pressure is caused by collisions with the container wall. It depends on the number and the force of the collisions. If <M>T</M> is doubled, the average energy doubles, and we expect the pressure to double as well: <M p=".">{t`P\propto T`}</M> This agrees with the ideal gas law. Similar arguments give <M p=".">{t`P\propto 1/V`}</M></li>
              <li><b>Meaning of <M p="?">T</M></b> The average kinetic energy <M>{t`\overline{E_k}`}</M> of the molecules.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Die Folie macht aus dem Gasgesetz eine Geschichte über Teilchen. Drei Dinge sind neu:</p>
            <ol className="keep">
              <li><M>{t`E_k=\tfrac12 mv^2`}</M> ist die Bewegungsenergie. Ein doppelt so schnelles Teilchen hat <em>viermal</em> so viel, weil <M>v</M> quadriert wird.</li>
              <li>«Die mittlere Energie hängt nur von <M>T</M> ab» ist der Kern: Temperatur <em>ist</em> ein Mass für die mittlere Bewegungsenergie. Ein heisses Gas hat schnelle Teilchen, ein kaltes langsame. Bei absolut null (<M p=")">{t`0\,\mathrm K`}</M> stünden sie praktisch still.</li>
              <li>Schwere und leichte Teilchen haben bei gleichem <M>T</M> dieselbe Energie. Weil <M>{t`\tfrac12 mv^2`}</M> gleich bleiben muss, sind die leichten schneller.</li>
            </ol>
            <p>Dass <M>{t`P\propto T`}</M> folgt, zeigt die Animation. Der Druck ist ein Produkt aus zwei Dingen, und beide wachsen mit dem Tempo.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> The slide turns the gas law into a story about particles. Three things are new:</p>
            <ol className="keep">
              <li><M>{t`E_k=\tfrac12 mv^2`}</M> is the energy of motion. A particle that is twice as fast has <em>four times</em> as much, because <M>v</M> is squared.</li>
              <li>“The average energy depends only on <M>T</M>” is the core: temperature <em>is</em> a measure of the average energy of motion. A hot gas has fast particles, a cold one slow ones. At absolute zero (<M p=")">{t`0\,\mathrm K`}</M> they would practically stand still.</li>
              <li>Heavy and light particles have the same energy at the same <M p=".">T</M> Because <M>{t`\tfrac12 mv^2`}</M> has to stay the same, the light ones are faster.</li>
            </ol>
            <p>The animation shows why <M>{t`P\propto T`}</M> follows. The pressure is a product of two things, and both grow with the speed.</p>
          </>}
        />
        <Derivation title={<T de={<>Warum <M>{t`P\propto T`}</M></>} en={<>Why <M>{t`P\propto T`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: heisseres Gas, schnellere Teilchen, grösserer Druck', 'Animation: hotter gas, faster particles, higher pressure')}
            steps={[
              { ms: 3000, holdMs: 2400, caption: <T
                de={<>Zwei gleiche Kästen, rechts bei doppelter Temperatur <M p=".">{t`2T`}</M> Die mittlere Energie ist doppelt so gross, also sind die Teilchen um den Faktor <M>{t`\sqrt2`}</M> schneller (längere Pfeile).</>}
                en={<>Two equal boxes, the right one at twice the temperature <M p=".">{t`2T`}</M> The average energy is twice as large, so the particles are faster by the factor <M>{t`\sqrt2`}</M> (longer arrows).</>} /> },
              { ms: 3000, holdMs: 2400, caption: <T
                de={<>Ein schnelleres Teilchen gibt der Wand bei jedem Stoss einen härteren Schlag (Faktor <M p=",">{t`\sqrt2`}</M> gelber Balken). Und es kommt auch öfter zur Wand zurück (Faktor <M p=",">{t`\sqrt2`}</M> grüner Balken).</>}
                en={<>A faster particle gives the wall a harder blow at every hit (factor <M p=",">{t`\sqrt2`}</M> yellow bar). And it also comes back to the wall more often (factor <M p=",">{t`\sqrt2`}</M> green bar).</>} /> },
              { ms: 3000, caption: <T
                de={<>Der Druck ist Schlag mal Häufigkeit: <M>{t`\sqrt2\cdot\sqrt2=2`}</M> Also verdoppelt sich der Druck: <M p=".">{t`P\propto v^2\propto E_k\propto T`}</M></>}
                en={<>The pressure is blow times frequency: <M>{t`\sqrt2\cdot\sqrt2=2`}</M> So the pressure doubles: <M p=".">{t`P\propto v^2\propto E_k\propto T`}</M></>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={kmtScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Die Teilchenbox der <a href="#ch-gase">vorigen Lektion</a> zeigt genau das: Zieh dort den Regler <M>T</M> nach rechts, und die Teilchen werden schneller, die Stösse häufiger und härter. Die Pfeile hier sind nur Merkhilfen für das Verhältnis; die echten Geschwindigkeiten stehen unten.</p>}
          en={<p>The particle box of the <a href="#ch-gase">previous lesson</a> shows exactly this: drag the slider <M>T</M> to the right and the particles get faster, the hits more frequent and harder. The arrows here are only a reminder of the ratio; the real speeds follow below.</p>}
        />
        <Box kind="uebung" src={<Src ex={2} p="7" />} title={<T de="Übung 2.4: kinetische Gastheorie" en="Exercise 2.4: kinetic molecular theory" />}>
          <T
            de={<ul>
              <li>Gase sind in ständiger, zufälliger Bewegung; mittlere Geschwindigkeit rund <M>{t`500\,\mathrm{m/s}`}</M> bei STP; rund <M>{t`10^{10}`}</M> Zusammenstösse pro Sekunde; freie Weglänge rund <M p=".">{t`60\,\mathrm{nm}`}</M></li>
              <li>Der Druck entsteht durch Moleküle, die gegen die Wand prallen. Bei gegebener Temperatur haben die Moleküle verschiedene Geschwindigkeiten: eine <em>Verteilung</em>.</li>
              <li>Aus <M>{t`E_{kin}=\tfrac12 mv^2`}</M> folgt <M p=".">{t`v=\sqrt{2E_{kin}/m}`}</M> Je höher <M p=",">T</M> desto höher <M>{t`E_{kin}`}</M> und desto schneller die Moleküle.</li>
            </ul>}
            en={<ul>
              <li>Gases are in constant random motion; average speed about <M>{t`500\,\mathrm{m/s}`}</M> at STP; about <M>{t`10^{10}`}</M> collisions per second; mean free path about <M p=".">{t`60\,\mathrm{nm}`}</M></li>
              <li>The pressure is caused by molecules hitting the wall. At a given temperature the molecules have different speeds: a <em>distribution</em>.</li>
              <li>From <M>{t`E_{kin}=\tfrac12 mv^2`}</M> follows <M p=".">{t`v=\sqrt{2E_{kin}/m}`}</M> The higher <M p=",">T</M> the higher <M>{t`E_{kin}`}</M> and the faster the molecules.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="verteilung" title={<T de="2. Wie schnell sind die einzelnen Moleküle?" en="2. How fast are the individual molecules?" />}>
        <Box kind="lecture" src={<Src lec={2} p="26–27" />} title={<T de="Geschwindigkeitsverteilungen; besondere Geschwindigkeiten" en="Velocity distributions; special velocities" />}>
          <T
            de={<ul>
              <li>Wichtig (Handschrift: «für den Rest des Kurses wichtig!»): Die Moleküle haben eine <em>Bandbreite</em> von Geschwindigkeiten. Die Verteilung hängt von <M>T</M> und der Molekülmasse ab.</li>
              <li>Diagramm links: Anteil der Moleküle gegen Geschwindigkeit bei <M>{t`0\,^\circ\mathrm C`}</M> und <M p=".">{t`100\,^\circ\mathrm C`}</M> Bei höherem <M>T</M> ist die Kurve breiter und flacher, das Maximum liegt weiter rechts. Diagramm rechts, <M>T</M> gleich: <C>O2</C>, <C>N2</C>, <C>H2O</C>, <C>He</C>, <C>H2</C>. Die leichten Gase sind schneller. Handschrift: Weil die mittlere Energie bei gleichem <M>T</M> gleich ist, verschiebt sich die Verteilung für leichte Moleküle zu höheren Geschwindigkeiten. Helium ist so leicht und schnell, dass es der Erdanziehung entkommt (ein begrenzter Rohstoff).</li>
              <li><M p=":">{t`v_{\mathrm{mp}}`}</M> die Geschwindigkeit, die die meisten Moleküle haben (<span lang="en">most probable</span>). <M p=":">{t`v_{\mathrm{av}}`}</M> der Mittelwert der Geschwindigkeiten aller Moleküle (<span lang="en">average</span>). <M p=":">{t`v_{\mathrm{rms}}`}</M> die Geschwindigkeit eines Moleküls, dessen kinetische Energie gleich der mittleren kinetischen Energie aller Moleküle ist.</li>
              <li><M p=".">{t`v_{\mathrm{rms}}=\sqrt{\dfrac{3RT}{M_w}}`}</M> Handschrift: Das sind kleine <M>v</M> für Geschwindigkeiten, nicht grosse <M>V</M> für Volumen. <M>{t`v_{\mathrm{rms}}`}</M> liegt rechts vom Maximum, weil <M>{t`E_k=\tfrac12 mv^2`}</M> die schnellen Moleküle stärker gewichtet.</li>
            </ul>}
            en={<ul>
              <li>Important (handwritten: “important concepts for the rest of the course!”): molecules move with a <em>range</em> of speeds. The distribution depends on <M>T</M> and the molecular mass.</li>
              <li>Left diagram: fraction of molecules against speed at <M>{t`0\,^\circ\mathrm C`}</M> and <M p=".">{t`100\,^\circ\mathrm C`}</M> At higher <M>T</M> the curve is broader and flatter and its maximum lies further to the right. Right diagram, <M>T</M> constant: <C>O2</C>, <C>N2</C>, <C>H2O</C>, <C>He</C>, <C>H2</C>. The light gases are faster. Handwritten: because the average kinetic energy is the same at the same <M p=",">T</M> the distribution shifts to higher speeds for lighter molecules. Helium is so light and fast that it escapes Earth’s gravity (a limited resource).</li>
              <li><M p=":">{t`v_{\mathrm{mp}}`}</M> the speed exhibited by the largest number of molecules. <M p=":">{t`v_{\mathrm{av}}`}</M> the average (mean) speed of all the molecules. <M p=":">{t`v_{\mathrm{rms}}`}</M> the speed of a molecule whose kinetic energy is equal to the average kinetic energy of all the molecules.</li>
              <li><M p=".">{t`v_{\mathrm{rms}}=\sqrt{\dfrac{3RT}{M_w}}`}</M> Handwritten: these are small <M>v</M> for speeds, not big <M>V</M> for volume. <M>{t`v_{\mathrm{rms}}`}</M> lies to the right of the peak because <M>{t`E_k=\tfrac12 mv^2`}</M> weights the fast molecules more.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das Diagramm.</b> Die waagrechte Achse ist die Geschwindigkeit. Die Höhe der Kurve sagt, wie viele Moleküle ungefähr diese Geschwindigkeit haben. Entscheidend ist die <em>Fläche</em> unter der Kurve: Die Fläche zwischen zwei Geschwindigkeiten ist der Anteil der Moleküle in diesem Bereich. Die ganze Fläche ist 1, also alle Moleküle. Auf Folie 26 ist die Fläche rechts von <M>{t`500\,\mathrm{m/s}`}</M> gefärbt: Das sind die Moleküle, die schneller sind.</p>
            <p>Unten kannst du das ausprobieren. Die gestrichelte graue Kurve ist festgehalten, die farbige bewegst du. Schiebe <M>T</M> hoch: Die Kurve wird breiter und flacher, aber die Fläche bleibt 1. Die Zahl unter dem Bild gibt den Anteil der Moleküle, die schneller als die Grenze <M>{t`v_0`}</M> sind. Bei Stickstoff sind es bei <M>{t`0\,^\circ\mathrm C`}</M> weniger als die Hälfte (38 %), bei <M>{t`100\,^\circ\mathrm C`}</M> mehr als die Hälfte (52 %); so steht es in der Beschriftung der Folie.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the diagram.</b> The horizontal axis is the speed. The height of the curve tells you roughly how many molecules have this speed. What counts is the <em>area</em> under the curve: the area between two speeds is the fraction of molecules in that range. The whole area is 1, that is all molecules. On slide 26 the area to the right of <M>{t`500\,\mathrm{m/s}`}</M> is coloured: those are the molecules that are faster.</p>
            <p>Try it below. The dashed grey curve is pinned, the coloured one you move. Push <M>T</M> up: the curve gets broader and flatter, but the area stays 1. The number under the picture gives the fraction of molecules faster than the threshold <M p=".">{t`v_0`}</M> For nitrogen at <M>{t`0\,^\circ\mathrm C`}</M> it is less than half (38 %), at <M>{t`100\,^\circ\mathrm C`}</M> more than half (52 %); that is what the caption of the slide says.</p>
          </>}
        />
        <MaxwellExplorer />
        <T
          de={<>
            <p><b>Wie rechnet man mit <M p="?">{t`v_{\mathrm{rms}}`}</M></b> Mit <M>{t`R=8{,}314\,\mathrm{J/(mol\,K)}`}</M> muss die molare Masse in <M>{t`\mathrm{kg/mol}`}</M> stehen, sonst kommt nicht <M>{t`\mathrm{m/s}`}</M> heraus (die Folie sagt das nicht ausdrücklich). Beispiel Stickstoff bei <M p=":">{t`25\,^\circ\mathrm C=298\,\mathrm K`}</M> <M p=".">{t`v_{\mathrm{rms}}=\sqrt{\dfrac{3\cdot 8{,}314\cdot 298}{0{,}0280}}\,\mathrm{m/s}\approx 515\,\mathrm{m/s}`}</M> Das passt zu den «rund 500 m/s» der Handschrift. Helium: <M p=".">{t`v_{\mathrm{rms}}=\sqrt{\dfrac{3\cdot 8{,}314\cdot 298}{0{,}00400}}\approx 1360\,\mathrm{m/s}`}</M> Wasserstoff <C>H2</C> hat rund <M p=".">{t`1920\,\mathrm{m/s}`}</M></p>
          </>}
          en={<>
            <p><b>How do you compute with <M p="?">{t`v_{\mathrm{rms}}`}</M></b> With <M>{t`R=8.314\,\mathrm{J/(mol\,K)}`}</M> the molar mass must be in <M p=",">{t`\mathrm{kg/mol}`}</M> otherwise you do not get <M>{t`\mathrm{m/s}`}</M> (the slide does not say this explicitly). Example nitrogen at <M p=":">{t`25\,^\circ\mathrm C=298\,\mathrm K`}</M> <M p=".">{t`v_{\mathrm{rms}}=\sqrt{\dfrac{3\cdot 8.314\cdot 298}{0.0280}}\,\mathrm{m/s}\approx 515\,\mathrm{m/s}`}</M> That fits the “about 500 m/s” of the handwriting. Helium: <M p=".">{t`v_{\mathrm{rms}}=\sqrt{\dfrac{3\cdot 8.314\cdot 298}{0.00400}}\approx 1360\,\mathrm{m/s}`}</M> Hydrogen <C>H2</C> has about <M p=".">{t`1920\,\mathrm{m/s}`}</M></p>
          </>}
        />
        <Box kind="supplement" title={<T de={<>Woher kommt <M>{t`v_{\mathrm{rms}}`}</M> und was sind <M>{t`v_{\mathrm{mp}}`}</M> und <M p="?">{t`v_{\mathrm{av}}`}</M></>} en={<>Where does <M>{t`v_{\mathrm{rms}}`}</M> come from, and what are <M>{t`v_{\mathrm{mp}}`}</M> and <M p="?">{t`v_{\mathrm{av}}`}</M></>} />}>
          <T
            de={<>
              <p><M>{t`v_{\mathrm{rms}}`}</M> ist so gebaut, dass die Energie stimmt. Ein Mol Moleküle hat im Mittel die Energie <M p=",">{t`\tfrac32 RT`}</M> (dieselbe für alle Gase, wie Folie 25 sagt). Setzt man das gleich der Bewegungsenergie eines Mols von Teilchen mit der Geschwindigkeit <M p=":">{t`v_{\mathrm{rms}}`}</M> <M p=",">{t`\tfrac12 M_w v_{\mathrm{rms}}^2=\tfrac32 RT`}</M> folgt <M p=".">{t`v_{\mathrm{rms}}=\sqrt{3RT/M_w}`}</M> Der Faktor <M>{t`\tfrac32`}</M> ist der Beitrag der drei Bewegungsrichtungen (je <M p=")">{t`\tfrac12 RT`}</M> Die Folie nennt ihn nicht; wir haben die Gleichung nachgerechnet.</p>
              <p>Die Übung und die Zusammenfassung nennen auch <M p=".">{t`v_{\mathrm{mp}}=\sqrt{2RT/M_w}`}</M> Die mittlere Geschwindigkeit <M>{t`v_{\mathrm{av}}=\sqrt{8RT/(\pi M_w)}`}</M> steht auf keiner Folie; sie folgt aus der Verteilungskurve. Die drei stehen immer im selben Verhältnis: <M p=".">{t`v_{\mathrm{mp}}:v_{\mathrm{av}}:v_{\mathrm{rms}}=1:1{,}13:1{,}22`}</M> Darum ist die Reihenfolge immer <M p=",">{t`v_{\mathrm{mp}}<v_{\mathrm{av}}<v_{\mathrm{rms}}`}</M> wie die Übung 4c sagt. Alle Zahlen sind im Code numerisch gegen die Verteilung geprüft (Integral der Kurve).</p>
              <p>Helium und die Erdanziehung: Die Fluchtgeschwindigkeit von der Erde ist <M p=",">{t`11{,}2\,\mathrm{km/s}`}</M> das Achtfache von <M>{t`v_{\mathrm{rms}}`}</M> für Helium. Die allerschnellsten Atome am Ende der Verteilung schaffen es trotzdem, und leichte Gase gehen über Jahrmillionen verloren; der Wert <M>{t`11{,}2\,\mathrm{km/s}`}</M> ist unser Zusatz.</p>
            </>}
            en={<>
              <p><M>{t`v_{\mathrm{rms}}`}</M> is built so that the energy is right. One mole of molecules has on average the energy <M p=",">{t`\tfrac32 RT`}</M> (the same for all gases, as slide 25 says). Setting this equal to the kinetic energy of a mole of particles with speed <M p=":">{t`v_{\mathrm{rms}}`}</M> <M p=",">{t`\tfrac12 M_w v_{\mathrm{rms}}^2=\tfrac32 RT`}</M> gives <M p=".">{t`v_{\mathrm{rms}}=\sqrt{3RT/M_w}`}</M> The factor <M>{t`\tfrac32`}</M> is the contribution of the three directions of motion (<M>{t`\tfrac12 RT`}</M> each). The slide does not mention it; we recomputed the equation.</p>
              <p>The exercise class and its summary also give <M p=".">{t`v_{\mathrm{mp}}=\sqrt{2RT/M_w}`}</M> The average speed <M>{t`v_{\mathrm{av}}=\sqrt{8RT/(\pi M_w)}`}</M> is on no slide; it follows from the distribution curve. The three always stand in the same ratio: <M p=".">{t`v_{\mathrm{mp}}:v_{\mathrm{av}}:v_{\mathrm{rms}}=1:1.13:1.22`}</M> That is why the order is always <M p=",">{t`v_{\mathrm{mp}}<v_{\mathrm{av}}<v_{\mathrm{rms}}`}</M> as exercise 4c says. All numbers are checked numerically against the distribution in the code (integral of the curve).</p>
              <p>Helium and gravity: the escape speed from Earth is <M p=",">{t`11.2\,\mathrm{km/s}`}</M> eight times <M>{t`v_{\mathrm{rms}}`}</M> for helium. The very fastest atoms in the tail of the distribution still make it, and light gases are lost over millions of years; the value <M>{t`11.2\,\mathrm{km/s}`}</M> is our addition.</p>
            </>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={2} p="8" />} title={<T de="Übung 4: zwei Kurven A und B" en="Exercise 4: two curves A and B" />}>
          <T
            de={<>
              <p>Zwei Verteilungskurven: A schmal, hoch und weit links, B breit, flach und weiter rechts. (a) Gehören sie zu <C>He</C> und <C>O2</C> bei gleicher Temperatur, welche ist Helium? (b) Gehören sie zum selben Gas bei zwei Temperaturen, welche ist die höhere? (c) Welche Geschwindigkeit ist am grössten: <M p=",">{t`v_{\mathrm{mp}}`}</M> <M>{t`v_{\mathrm{rms}}`}</M> oder <M p="?">{t`v_{\mathrm{av}}`}</M></p>
              <p><b>(a)</b> <M>{t`m_{\mathrm{He}}<m_{\mathrm{O_2}}`}</M> und die Energie ist gleich, also <M p=",">{t`v=\sqrt{2E_{kin}/m}`}</M> Helium ist schneller: <b><M p=",">{t`\text{B}=\mathrm{He}`}</M> <M>{t`\text{A}=\mathrm{O_2}`}</M></b>. <b>(b)</b> Höheres <M>T</M> heisst höhere Energie und höheres <M p=",">v</M> also ist <b>B die höhere Temperatur</b>. <b>(c)</b> <M p=".">{t`v_{\mathrm{rms}}>v_{\mathrm{av}}>v_{\mathrm{mp}}`}</M></p>
            </>}
            en={<>
              <p>Two distribution curves: A narrow, high and far to the left, B broad, flat and further right. (a) If they belong to <C>He</C> and <C>O2</C> at the same temperature, which one is helium? (b) If they belong to the same gas at two temperatures, which is the higher one? (c) Which speed is the highest: <M p=",">{t`v_{\mathrm{mp}}`}</M> <M>{t`v_{\mathrm{rms}}`}</M> or <M p="?">{t`v_{\mathrm{av}}`}</M></p>
              <p><b>(a)</b> <M>{t`m_{\mathrm{He}}<m_{\mathrm{O_2}}`}</M> and the energy is the same, so <M p=",">{t`v=\sqrt{2E_{kin}/m}`}</M> helium is faster: <b><M p=",">{t`\text{B}=\mathrm{He}`}</M> <M>{t`\text{A}=\mathrm{O_2}`}</M></b>. <b>(b)</b> A higher <M>T</M> means a higher energy and a higher <M p=",">v</M> so <b>B is the higher temperature</b>. <b>(c)</b> <M p=".">{t`v_{\mathrm{rms}}>v_{\mathrm{av}}>v_{\mathrm{mp}}`}</M></p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="diffusion" title={<T de="3. Diffusion und freie Weglänge" en="3. Diffusion and mean free path" />}>
        <Box kind="lecture" src={<Src lec={2} p="28" />} title={<T de="Diffusion" en="Diffusion" />}>
          <T
            de={<ul>
              <li><b>Diffusion</b>: Ausbreiten eines Stoffs im Raum. Gase bei Atmosphärendruck diffundieren viel langsamer als <M>{t`v_{\mathrm{rms}}`}</M> (rund <M p="),">{t`500\,\mathrm{m/s}`}</M> weil die Moleküle rund <M>{t`10^{10}`}</M> Zusammenstösse pro Sekunde haben.</li>
              <li><b>Mittlere freie Weglänge</b> (<span lang="en">mean free path</span>): der mittlere Abstand zwischen zwei Zusammenstössen. Luft auf Meereshöhe (<M p="):">{t`P=1\,\mathrm{atm}`}</M> <M p="!">{t`60\,\mathrm{nm}`}</M> Das verkürzt den tatsächlich zurückgelegten Weg. Aber Luft in <M>{t`100\,\mathrm{km}`}</M> Höhe: <M p="!">{t`10\,\mathrm{cm}`}</M></li>
              <li>Bild: ein blaues Molekül zickzackt durch rote. Wegen der Zusammenstösse kommt es nicht weit; sie machen seine Richtung zufällig. Handschrift: Im Vakuum kann man «ballistischen» Transport über Meter erreichen und Molekularstrahlen machen.</li>
            </ul>}
            en={<ul>
              <li><b>Diffusion</b>: spread of a substance through space. Gases at atmospheric pressure diffuse much slower than <M>{t`v_{\mathrm{rms}}`}</M> (about <M p=")">{t`500\,\mathrm{m/s}`}</M> because molecules have about <M>{t`10^{10}`}</M> collisions per second.</li>
              <li><b>Mean free path</b>: the average distance between collisions. Air at sea level (<M p="):">{t`P=1\,\mathrm{atm}`}</M> <M p="!">{t`60\,\mathrm{nm}`}</M> This reduces the actual distance travelled. But for air at <M>{t`100\,\mathrm{km}`}</M> altitude: <M p="!">{t`10\,\mathrm{cm}`}</M></li>
              <li>Picture: a blue molecule zigzags through red ones. Because of the collisions it does not get far; they randomise its direction. Handwritten: in a vacuum chamber one can get “ballistic” transport over metres and make molecular beams.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Warum riechst du ein Parfüm nicht sofort im ganzen Raum, obwohl die Moleküle mit <M>{t`500\,\mathrm{m/s}`}</M> fliegen? Weil sie alle <M>{t`60\,\mathrm{nm}`}</M> mit einem anderen Molekül zusammenstossen und danach in eine neue, zufällige Richtung fliegen. Der Weg ist ein Zickzack mit unzähligen Knicken. Die gesamte Strecke ist riesig, aber der <em>Abstand vom Start</em> wächst nur langsam, ungefähr mit der Wurzel der Zahl der Zusammenstösse.</p>
            <p>Die Figur zeigt einen Ausschnitt, stark vergrössert. Rote Moleküle liegen fest; das blaue fliegt geradeaus, bis es eines trifft, und startet dann in eine neue Richtung. Ändere den Druck: Bei weniger Druck gibt es weniger rote Moleküle, die geraden Stücke werden länger und das blaue kommt weiter. Das gelbe Gestrichelte ist der Abstand vom Start; der Weg entlang der Linie ist viel länger. Genau das meint die Handschrift: «Wegen der Zusammenstösse kommt es nicht weit.»</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> Why do you not smell a perfume at once in the whole room even though the molecules fly at <M p="?">{t`500\,\mathrm{m/s}`}</M> Because every <M>{t`60\,\mathrm{nm}`}</M> they collide with another molecule and then fly off in a new, random direction. The path is a zigzag with countless kinks. The total distance is huge, but the <em>distance from the start</em> grows only slowly, roughly like the square root of the number of collisions.</p>
            <p>The figure shows a section, greatly enlarged. Red molecules stay in place; the blue one flies straight until it meets one, and then starts in a new direction. Change the pressure: at lower pressure there are fewer red molecules, the straight pieces get longer and the blue one gets further. The dashed yellow line is the distance from the start; the path along the line is much longer. This is what the handwriting means: “due to collisions it does not make it very far.”</p>
          </>}
        />
        <DiffusionWalk />
        <Box kind="supplement" title={<T de="Warum 60 nm und 10 cm? Eine Rechnung" en="Why 60 nm and 10 cm? A calculation" />}>
          <T
            de={<>
              <p>Die Folie nennt die Zahlen, aber keine Formel. Für Kugeln vom Durchmesser <M>d</M> gilt <M p=".">{t`\lambda=\dfrac{k_BT}{\sqrt2\,\pi d^2P}`}</M> Mit <M p=",">{t`d\approx 0{,}37\,\mathrm{nm}`}</M> (Luft) <M p=",">{t`T=293\,\mathrm K`}</M> und <M>{t`P=101\,325\,\mathrm{Pa}`}</M> kommt <M>{t`\lambda\approx 66\,\mathrm{nm}`}</M> heraus, von der Grössenordnung der 60 nm der Folie. Teilt man die mittlere Geschwindigkeit (<M p=")">{t`\approx 470\,\mathrm{m/s}`}</M> durch <M p=",">{t`\lambda`}</M> erhält man rund <M>{t`7\cdot 10^9`}</M> Zusammenstösse pro Sekunde, also die <M>{t`10^{10}`}</M> der Folie. Und weil <M>{t`\lambda\propto 1/P`}</M> gilt, wächst die Weglänge bei tausendmal kleinerem Druck auf das Tausendfache. In <M>{t`100\,\mathrm{km}`}</M> Höhe ist der Druck rund <M>{t`10^{-6}`}</M> des Bodendrucks; Zentimeter bis Dezimeter passen zur Folie. Diese Formel ist nicht Teil der Vorlesung; die Zahlen sind im Code geprüft.</p>
            </>}
            en={<>
              <p>The slide gives the numbers but no formula. For spheres of diameter <M>d</M> it holds that <M p=".">{t`\lambda=\dfrac{k_BT}{\sqrt2\,\pi d^2P}`}</M> With <M p=",">{t`d\approx 0.37\,\mathrm{nm}`}</M> (air) <M p=",">{t`T=293\,\mathrm K`}</M> and <M>{t`P=101\,325\,\mathrm{Pa}`}</M> you get <M p=",">{t`\lambda\approx 66\,\mathrm{nm}`}</M> of the order of the slide’s 60 nm. Dividing the average speed (<M p=")">{t`\approx 470\,\mathrm{m/s}`}</M> by <M p=",">{t`\lambda`}</M> gives about <M>{t`7\cdot 10^9`}</M> collisions per second, the <M>{t`10^{10}`}</M> of the slide. And because <M>{t`\lambda\propto 1/P`}</M> holds, the path grows a thousandfold at a thousandfold lower pressure. At <M>{t`100\,\mathrm{km}`}</M> the pressure is about <M>{t`10^{-6}`}</M> of the ground pressure; centimetres to decimetres fit the slide. This formula is not part of the lecture; the numbers are checked in the code.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="real" title={<T de={<>4. Reale Gase und die Gleichung von <span lang="de">van der Waals</span></>} en={<>4. Real gases and the <span lang="de">van der Waals</span> equation</>} />}>
        <Box kind="lecture" src={<><Src lec={2} p="29–30" /> <Src lec={3} p="5–7" /></>} title={<T de="Abweichungen vom idealen Gas" en="Nonidealities in gases" />}>
          <T
            de={<ul>
              <li>Das ideale Gasgesetz ist unglaublich nützlich, aber reale Gase sind nicht immer ideal. Bei <b>hohem Druck</b> ist das Volumen der Moleküle nicht mehr vernachlässigbar. Bei <b>tiefer Temperatur</b> beginnen die Moleküle sich zu beeinflussen (sie «kleben» aneinander).</li>
              <li>Bild: <M>{t`PV/RT`}</M> gegen <M>P</M> (0 bis 100 MPa) für <C>N2</C>, <C>CH4</C>, <C>H2</C>, <C>CO2</C>; die gestrichelte Linie bei 1,0 ist das ideale Gas. Handschrift (Vorlesung 3): Die Darstellung gilt für <M p=".">{t`n=1\,\mathrm{mol}`}</M> Jede Abweichung von <M>{t`PV/RT=1`}</M> ist Nichtidealität.</li>
              <li><b><span lang="de">Van der Waals</span></b>: <M p=".">{t`\Bigl(P+\dfrac{n^2a}{V^2}\Bigr)(V-nb)=nRT`}</M> Handschrift: <M>V</M> ist hier das Volumen; <M>P</M> und <M>V</M> sind für die Nichtidealität korrigiert; <M>n</M> ist die Zahl der Mole; <M p=",">a</M> <M>b</M> sind Korrekturfaktoren, die man für jedes Gas in Tabellen findet.</li>
              <li>Bedeutung (Handschrift): Der gemessene Druck ist kleiner, als das ideale Gasgesetz vorhersagt, wegen der Wechselwirkungen, also addiert man den Term <M>{t`n^2a/V^2`}</M> zu <M p=".">P</M> Die Moleküle ziehen sich an und stossen schwächer an die Wand. Das tatsächliche Behältervolumen ist grösser als das, was die Moleküle erfahren, weil ein Teil des Volumens von anderen Molekülen besetzt ist; darum zieht man den Term <M>nb</M> von <M>V</M> ab.</li>
            </ul>}
            en={<ul>
              <li>The IGL is incredibly useful, but real gases are not always ideal. At <b>high pressure</b> the volume occupied by the molecules is no longer negligible. At <b>low temperature</b> the molecules start to interact (they “stick” to each other).</li>
              <li>Picture: <M>{t`PV/RT`}</M> against <M>P</M> (0 to 100 MPa) for <C>N2</C>, <C>CH4</C>, <C>H2</C>, <C>CO2</C>; the dashed line at 1.0 is the ideal gas. Handwritten (lecture 3): this plot is for <M p=".">{t`n=1\,\mathrm{mol}`}</M> Any deviation from <M>{t`PV/RT=1`}</M> is non-ideality.</li>
              <li><b><span lang="de">Van der Waals</span></b>: <M p=".">{t`\Bigl(P+\dfrac{n^2a}{V^2}\Bigr)(V-nb)=nRT`}</M> Handwritten: here <M>V</M> is the volume; <M>P</M> and <M>V</M> are corrected for non-idealities; <M>n</M> is the number of moles as always; <M p=",">a</M> <M>b</M> are correction factors, found in tables for a specific gas.</li>
              <li>Meaning (handwritten): the measured pressure is lower than the IGL predicts due to interactions, so we add the term <M>{t`n^2a/V^2`}</M> to <M p=".">P</M> Molecules attract each other and strike the container walls with less force. The actual container volume is larger than the molecules experience because some of the volume is occupied by other molecules; so we subtract the term <M>nb</M> from <M p=".">V</M></li>
            </ul>}
          />
          <T
            de={<p>Tabelle 10.3 der Folie (<M>a</M> in <M p=",">{t`\mathrm{L^2\,kPa/mol^2}`}</M> <M>b</M> in <M p=")">{t`\mathrm{L/mol}`}</M> <C>He</C>: <M p=";">{t`3{,}46`}</M> <M p=".">{t`0{,}02370`}</M> <C>Ne</C>: <M p=";">{t`21{,}4`}</M> <M p=".">{t`0{,}0171`}</M> <C>Ar</C>: <M p=";">135</M> <M p=".">{t`0{,}0322`}</M> <C>Kr</C>: <M p=";">235</M> <M p=".">{t`0{,}0398`}</M> <C>Xe</C>: <M p=";">425</M> <M p=".">{t`0{,}0510`}</M> <C>H2</C>: <M p=";">{t`24{,}7`}</M> <M p=".">{t`0{,}0266`}</M> <C>N2</C>: <M p=";">141</M> <M p=".">{t`0{,}0391`}</M> <C>O2</C>: <M p=";">138</M> <M p=".">{t`0{,}0318`}</M></p>}
            en={<p>Table 10.3 of the slide (<M>a</M> in <M p=",">{t`\mathrm{L^2\,kPa/mol^2}`}</M> <M>b</M> in <M p=")">{t`\mathrm{L/mol}`}</M> <C>He</C>: <M p=";">{t`3.46`}</M> <M p=".">{t`0.02370`}</M> <C>Ne</C>: <M p=";">{t`21.4`}</M> <M p=".">{t`0.0171`}</M> <C>Ar</C>: <M p=";">135</M> <M p=".">{t`0.0322`}</M> <C>Kr</C>: <M p=";">235</M> <M p=".">{t`0.0398`}</M> <C>Xe</C>: <M p=";">425</M> <M p=".">{t`0.0510`}</M> <C>H2</C>: <M p=";">{t`24.7`}</M> <M p=".">{t`0.0266`}</M> <C>N2</C>: <M p=";">141</M> <M p=".">{t`0.0391`}</M> <C>O2</C>: <M p=";">138</M> <M p=".">{t`0.0318`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Das ideale Gasgesetz nimmt zwei Dinge an: Die Teilchen haben kein eigenes Volumen und ziehen sich nicht an. <span lang="de">Van der Waals</span> flickt genau diese beiden Annahmen, jede mit einer Zahl:</p>
            <ol className="keep">
              <li><b><M>a</M> für die Anziehung.</b> Jedes Molekül in der Mitte wird von allen Seiten gleich angezogen. Eines kurz vor der Wand wird nur nach innen gezogen und prallt schwächer auf. Darum misst man einen <em>kleineren</em> Druck <M>P</M> als <M p=".">{t`nRT/V`}</M> Damit die Rechnung wieder stimmt, addiert man den fehlenden Anteil: <M p=".">{t`P+n^2a/V^2`}</M> Der Anteil ist gross, wenn die Teilchen dicht gepackt sind (kleines <M p=")">V</M> denn er hängt von <M>{t`1/V^2`}</M> ab: Zahl der Paare nahe beieinander.</li>
              <li><b><M>b</M> für das Eigenvolumen.</b> Die Moleküle sind keine Punkte. Ein Teil des Behälters ist schon besetzt, und frei ist nur <M p=".">{t`V-nb`}</M> Pro Mol nimmt man das Volumen <M>b</M> weg.</li>
            </ol>
            <p>Die beiden Korrekturen wirken in entgegengesetzte Richtung. Bei mässigem Druck gewinnt die Anziehung (<M>{t`PV/RT<1`}</M> in der Folie 29 zuerst), bei sehr hohem Druck das Eigenvolumen (<M p=").">{t`PV/RT>1`}</M> Bei kleinem Druck sind beide klein, und das Gas ist ideal. Probiere es aus: Wähle ein Gas und verschiebe <M>T</M> und <M p=".">V</M></p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> The ideal gas law assumes two things: the particles have no volume of their own and do not attract each other. <span lang="de">Van der Waals</span> patches exactly these two assumptions, each with one number:</p>
            <ol className="keep">
              <li><b><M>a</M> for the attraction.</b> A molecule in the middle is pulled equally from all sides. One just before the wall is pulled only inwards and hits more weakly. So you measure a <em>smaller</em> pressure <M>P</M> than <M p=".">{t`nRT/V`}</M> To make the calculation right again, you add the missing part: <M p=".">{t`P+n^2a/V^2`}</M> The part is large when the particles are packed densely (small <M p=")">V</M> because it depends on <M p=":">{t`1/V^2`}</M> the number of pairs close together.</li>
              <li><b><M>b</M> for the own volume.</b> Molecules are not points. Part of the container is already taken, and only <M p=".">{t`V-nb`}</M> is free. Per mole you take away the volume <M p=".">b</M></li>
            </ol>
            <p>The two corrections work in opposite directions. At moderate pressure the attraction wins (<M>{t`PV/RT<1`}</M> first in slide 29), at very high pressure the own volume (<M p=").">{t`PV/RT>1`}</M> At low pressure both are small and the gas is ideal. Try it: choose a gas and move <M>T</M> and <M p=".">V</M></p>
          </>}
        />
        <Derivation title={<T de={<>Die zwei Korrekturen von <span lang="de">van der Waals</span></>} en={<>The two corrections of <span lang="de">van der Waals</span></>} />}>
          <StepPlayer
            label={tr('Animation: Anziehung und Eigenvolumen', 'Animation: attraction and own volume')}
            steps={[
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Das ideale Gas: Punktteilchen ohne Anziehung. Der Druck <M>{t`P_{\mathrm{ideal}}=nRT/V`}</M> ist die volle Stärke der Wandstösse (blaue Pfeile).</>}
                en={<>The ideal gas: point particles without attraction. The pressure <M>{t`P_{\mathrm{ideal}}=nRT/V`}</M> is the full strength of the wall hits (blue arrows).</>} /> },
              { ms: 3500, holdMs: 2600, caption: <T
                de={<>Die Teilchen ziehen sich an (gestrichelt). Die Wandstösse werden schwächer: Gemessen wird weniger als <M p=".">{t`P_{\mathrm{ideal}}`}</M> Der fehlende Teil (gestrichelt) ist <M p=".">{t`n^2a/V^2`}</M> Also <M p=".">{t`P+n^2a/V^2=P_{\mathrm{ideal}}`}</M></>}
                en={<>The particles attract each other (dashed). The wall hits get weaker: less than <M>{t`P_{\mathrm{ideal}}`}</M> is measured. The missing part (dashed) is <M p=".">{t`n^2a/V^2`}</M> So <M p=".">{t`P+n^2a/V^2=P_{\mathrm{ideal}}`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Die Teilchen sind keine Punkte. Sie nehmen Raum weg (grüne Höfe), frei ist nur noch <M p=".">{t`V-nb`}</M> Beide Korrekturen zusammen: <M p=".">{t`(P+n^2a/V^2)(V-nb)=nRT`}</M></>}
                en={<>The particles are not points. They take up room (green halos), only <M>{t`V-nb`}</M> is free. Both corrections together: <M p=".">{t`(P+n^2a/V^2)(V-nb)=nRT`}</M></>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={vdwScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <VdwExplorer />
        <T
          de={<>
            <p><b>Ein Zahlenbeispiel</b> (nicht auf den Folien): <M>{t`1{,}00\,\mathrm{mol}`}</M> <C>N2</C> in <M>{t`1{,}00\,\mathrm L`}</M> bei <M>{t`300\,\mathrm K`}</M> Ideal: <M p=".">{t`P=\dfrac{nRT}{V}=\dfrac{1{,}00\cdot 8{,}314\cdot 300}{1{,}00}\,\mathrm{kPa}\approx 2494\,\mathrm{kPa}`}</M> <span lang="de">Van der Waals</span> mit <M>{t`a=141`}</M> und <M p=":">{t`b=0{,}0391`}</M> <M p=".">{t`P=\dfrac{nRT}{V-nb}-\dfrac{n^2a}{V^2}=\dfrac{2494}{0{,}9609}-141\approx 2455\,\mathrm{kPa}`}</M> Das sind nur <M>{t`1{,}6\,\%`}</M> weniger. Das Eigenvolumen allein hebt den Druck um <M>{t`4{,}1\,\%`}</M> und die Anziehung senkt ihn um <M>{t`5{,}7\,\%`}</M> – die beiden Korrekturen heben sich fast auf. Darum verhält sich Stickstoff in diesem Bereich beinahe ideal. Bei <M>{t`100\,\mathrm{MPa}`}</M> (Folie 29) überwiegt das Eigenvolumen, und <M>{t`PV/RT`}</M> steigt weit über 1.</p>
            <p>Wann darf man das ideale Gasgesetz brauchen? Bei <b>niedrigem Druck</b> und <b>hoher Temperatur</b>: Dann sind die Teilchen weit auseinander (das Eigenvolumen zählt nicht) und schnell (die Anziehung zählt nicht). Bei Atmosphärendruck und Raumtemperatur ist das für die meisten Gase der Fall.</p>
          </>}
          en={<>
            <p><b>A worked example</b> (not on the slides): <M>{t`1.00\,\mathrm{mol}`}</M> of <C>N2</C> in <M>{t`1.00\,\mathrm L`}</M> at <M p=".">{t`300\,\mathrm K`}</M> Ideal: <M p=".">{t`P=\dfrac{nRT}{V}=\dfrac{1.00\cdot 8.314\cdot 300}{1.00}\,\mathrm{kPa}\approx 2494\,\mathrm{kPa}`}</M> <span lang="de">Van der Waals</span> with <M>{t`a=141`}</M> and <M p=":">{t`b=0.0391`}</M> <M p=".">{t`P=\dfrac{nRT}{V-nb}-\dfrac{n^2a}{V^2}=\dfrac{2494}{0.9609}-141\approx 2455\,\mathrm{kPa}`}</M> That is only <M>{t`1.6\,\%`}</M> less. The own volume alone raises the pressure by <M>{t`4.1\,\%`}</M> and the attraction lowers it by <M>{t`5.7\,\%`}</M> – the two corrections almost cancel. So nitrogen behaves almost ideally in this range. At <M>{t`100\,\mathrm{MPa}`}</M> (slide 29) the own volume dominates, and <M>{t`PV/RT`}</M> rises far above 1.</p>
            <p>When may you use the ideal gas law? At <b>low pressure</b> and <b>high temperature</b>: then the particles are far apart (the own volume does not matter) and fast (the attraction does not matter). At atmospheric pressure and room temperature this is the case for most gases.</p>
          </>}
        />
        <T
          de={<p>Zur Lage der Kurven in Folie 29: Die Tabelle 10.3 der Folie enthält keine Werte für <C>CH4</C> und <C>CO2</C>, darum zeigt die Figur die Gase der Tabelle. Dass <C>CO2</C> in der Folie bis etwa <M>{t`PV/RT=0{,}4`}</M> absinkt, liegt an der starken Anziehung des <C>CO2</C> nahe seiner kritischen Temperatur; wähle in der Figur <C>Xe</C> bei <M>{t`300\,\mathrm K`}</M> (nahe seinem <M p="),">{t`T_c`}</M> dann siehst du einen ähnlich tiefen Einbruch.</p>}
          en={<p>On the position of the curves in slide 29: Table 10.3 of the slide has no values for <C>CH4</C> and <C>CO2</C>, so the figure shows the gases of the table. That <C>CO2</C> in the slide sinks to about <M>{t`PV/RT=0.4`}</M> is due to the strong attraction of <C>CO2</C> near its critical temperature; choose <C>Xe</C> at <M>{t`300\,\mathrm K`}</M> in the figure (near its <M p=")">{t`T_c`}</M> and you see a similarly deep dip.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Alle Moleküle im Gas sind gleich schnell»" en="“All molecules in a gas have the same speed”" />}>
        <T
          de={<p>Nein. Bei jeder Temperatur gibt es langsame und sehr schnelle Moleküle. Nur der <em>Durchschnitt</em> ist festgelegt. Stösse tauschen dauernd Energie aus, darum ändert jedes einzelne Molekül ständig sein Tempo. Das Bild auf Folie 26 zeigt genau diese Bandbreite.</p>}
          en={<p>No. At every temperature there are slow and very fast molecules. Only the <em>average</em> is fixed. Collisions constantly exchange energy, so each single molecule keeps changing its speed. The picture on slide 26 shows exactly this spread.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die drei besonderen Geschwindigkeiten sind dasselbe»" en="“The three special speeds are the same”" />}>
        <T
          de={<p>Sie liegen nah beieinander, sind aber verschieden: <M p=".">{t`v_{\mathrm{mp}}<v_{\mathrm{av}}<v_{\mathrm{rms}}`}</M> <M>{t`v_{\mathrm{rms}}`}</M> ist der Mittelwert der <em>Energie</em> (umgerechnet in ein Tempo), <M>{t`v_{\mathrm{av}}`}</M> der Mittelwert des <em>Tempos</em>. Weil schnelle Moleküle wegen <M>{t`v^2`}</M> mehr Energie tragen, liegt <M>{t`v_{\mathrm{rms}}`}</M> weiter rechts. In der Formel der Folie ist <M>{t`v_{\mathrm{rms}}`}</M> gemeint.</p>}
          en={<p>They lie close together but are different: <M p=".">{t`v_{\mathrm{mp}}<v_{\mathrm{av}}<v_{\mathrm{rms}}`}</M> <M>{t`v_{\mathrm{rms}}`}</M> is the average of the <em>energy</em> (converted back to a speed), <M>{t`v_{\mathrm{av}}`}</M> the average of the <em>speed</em>. Because fast molecules carry more energy due to <M p=",">{t`v^2`}</M> <M>{t`v_{\mathrm{rms}}`}</M> lies further right. The formula on the slide is for <M p=".">{t`v_{\mathrm{rms}}`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Halb so viele Grad Celsius heisst halb so viel Energie»" en="“Half as many degrees Celsius means half the energy”" />}>
        <T
          de={<p>Die mittlere Energie ist proportional zur Temperatur in <em>Kelvin</em>, nicht in Grad Celsius. Von <M>{t`27\,^\circ\mathrm C`}</M> (<M p=")">{t`300\,\mathrm K`}</M> auf <M>{t`327\,^\circ\mathrm C`}</M> (<M p=")">{t`600\,\mathrm K`}</M> verdoppelt sich die Energie, obwohl die Celsius-Zahl auf das <M>{t`12`}</M>fache steigt. Die Geschwindigkeit wächst dabei nur um den Faktor <M p=".">{t`\sqrt2\approx 1{,}41`}</M></p>}
          en={<p>The average energy is proportional to the temperature in <em>kelvin</em>, not in degrees Celsius. From <M>{t`27\,^\circ\mathrm C`}</M> (<M p=")">{t`300\,\mathrm K`}</M> to <M>{t`327\,^\circ\mathrm C`}</M> (<M p=")">{t`600\,\mathrm K`}</M> the energy doubles even though the Celsius number rises twelvefold. The speed grows only by the factor <M p=".">{t`\sqrt2\approx 1.41`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<span lang="de">Van der Waals</span> gilt für jeden Druck gleich gut»</>} en={<>“<span lang="de">Van der Waals</span> works equally well at any pressure”</>} />}>
        <T
          de={<p>Die Gleichung ist ebenfalls eine <em>Näherung</em>, nur eine bessere als <M>{t`PV=nRT`}</M> Unterhalb der kritischen Temperatur beschreibt sie das Gas nur am Rand, und die Kurve wird nicht mehr eindeutig: Dort verflüssigt sich das Gas wirklich. Auch die Zahlen <M>a</M> und <M>b</M> sind für jedes Gas verschieden und gehören in die Tabelle, nicht ins Gedächtnis.</p>}
          en={<p>The equation is also an <em>approximation</em>, just a better one than <M p=".">{t`PV=nRT`}</M> Below the critical temperature it describes the gas only near the edge, and the curve is no longer unique: there the gas really liquefies. The numbers <M>a</M> and <M>b</M> also differ for each gas and belong in the table, not in your memory.</p>}
        />
      </Box>

      <Box kind="key">
        <T
          de={<ul>
            <li>Kinetische Gastheorie: Teilchen fliegen zufällig und stossen elastisch; der Druck kommt von den Wandstössen. <M>T</M> ist ein Mass für die mittlere Bewegungsenergie, bei allen Gasen gleich: <M p=".">{t`P\propto T`}</M></li>
            <li>Die Geschwindigkeiten sind verteilt. Leichter oder heisser heisst schneller. <M p=",">{t`v_{\mathrm{rms}}=\sqrt{3RT/M_w}`}</M> mit <M>{t`M_w`}</M> in <M p=".">{t`\mathrm{kg/mol}`}</M> <M p=".">{t`v_{\mathrm{mp}}<v_{\mathrm{av}}<v_{\mathrm{rms}}`}</M></li>
            <li>Diffusion ist langsam, weil die Moleküle alle rund <M>{t`60\,\mathrm{nm}`}</M> zusammenstossen; die freie Weglänge wächst wie <M p=".">{t`1/P`}</M></li>
            <li>Reale Gase: <M p=".">{t`(P+n^2a/V^2)(V-nb)=nRT`}</M> <M>a</M> korrigiert die Anziehung, <M>b</M> das Eigenvolumen. Ideal ist das Gas bei kleinem <M>P</M> und hohem <M p=".">T</M></li>
          </ul>}
          en={<ul>
            <li>Kinetic theory: particles fly randomly and collide elastically; the pressure comes from the wall hits. <M>T</M> is a measure of the average energy of motion, the same for all gases: <M p=".">{t`P\propto T`}</M></li>
            <li>The speeds are distributed. Lighter or hotter means faster. <M p=",">{t`v_{\mathrm{rms}}=\sqrt{3RT/M_w}`}</M> with <M>{t`M_w`}</M> in <M p=".">{t`\mathrm{kg/mol}`}</M> <M p=".">{t`v_{\mathrm{mp}}<v_{\mathrm{av}}<v_{\mathrm{rms}}`}</M></li>
            <li>Diffusion is slow because molecules collide about every <M p=";">{t`60\,\mathrm{nm}`}</M> the mean free path grows like <M p=".">{t`1/P`}</M></li>
            <li>Real gases: <M p=".">{t`(P+n^2a/V^2)(V-nb)=nRT`}</M> <M>a</M> corrects for the attraction, <M>b</M> for the own volume. A gas is ideal at small <M>P</M> and high <M p=".">T</M></li>
          </ul>}
        />
      </Box>
    </article>
  );
}
