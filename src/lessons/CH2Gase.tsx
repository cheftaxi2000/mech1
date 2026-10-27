import { Box, Section, Src, Derivation } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { ChemAnim } from '../viz/chem/ChemAnim';
import { DensityBoxes } from '../viz/chem/DensityBoxes';
import { GasLawExplorer } from '../viz/chem/GasLawExplorer';
import { MixBox, PressureBox } from '../viz/chem/GasBox';
import { PressureTools } from '../viz/chem/PressureTools';
import { SigFigTool } from '../viz/chem/SigFigTool';
import { airColumnScene, balloonScene, baroScene, daltonScene, iglScene } from '../viz/chem/gasScenes';

const t = String.raw;

export default function CH2Gase() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Gas besteht aus winzigen Teilchen, die ständig herumfliegen und gegen jede Wand prallen. Aus diesem einen Bild folgt fast alles dieser Lektion: der Druck, die Gasgesetze und das ideale Gasgesetz <M>{t`PV=nRT`}</M> Denk an eine Fahrradpumpe: Du drückst den Kolben hinein, das Gas wird enger, und es drückt stärker zurück.</p>}
        en={<p className="lede">A gas consists of tiny particles that keep flying around and bouncing off every wall. Almost everything in this lesson follows from that one picture: the pressure, the gas laws and the ideal gas law <M>{t`PV=nRT`}</M> Think of a bicycle pump: you push the piston in, the gas gets cramped, and it pushes back harder.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="vier" title={<T de="1. Ein Gas und seine vier Grössen" en="1. A gas and its four quantities" />}>
        <Box kind="lecture" src={<Src lec={2} p="8–10" />} title={<T de="Gase; Parameter, die ein Gas beschreiben" en="Gases; parameters that describe a gas" />}>
          <T
            de={<ul>
              <li>Gase sind für Ingenieure wichtig (Industrie und Alltag). Drei Aggregatzustände: fest, flüssig, gasförmig (Beispiel <C>H2O</C> als Eis, Wasser, Dampf).</li>
              <li>Gase dehnen sich aus, bis sie ihren Behälter füllen. Man kann sie zusammendrücken. Sie bilden homogene Mischungen. Die Moleküle nehmen nur einen winzigen Teil des Volumens ein (bei Luft rund <M>{t`0{,}1\,\%`}</M> handschriftlich).</li>
              <li>Für ein einfaches Gas genügen vier Grössen: Volumen <M>V</M> und Stoffmenge <M>n</M> (Anzahl Mol) sind <em>extensiv</em> (hängen von der Grösse der Probe ab); Temperatur <M>T</M> und Druck <M>P</M> sind <em>intensiv</em> (hängen nicht davon ab).</li>
              <li>Druck: <M p=".">{t`P=\dfrac{F}{A}`}</M> Die SI-Einheit der Kraft ist das Newton <M p=",">{t`\mathrm{N}`}</M> die des Drucks das Pascal <M p=".">{t`\mathrm{Pa}=\mathrm{N/m^2}`}</M></li>
            </ul>}
            en={<ul>
              <li>Gases are an important topic for engineers (industry and everyday life). Three states of matter: solid, liquid, vapour (example <C>H2O</C> as ice, water, steam).</li>
              <li>Gases expand to fill their container. They can be compressed. They form homogeneous mixtures. The molecules occupy only a tiny fraction of the volume (for air about <M p=",">{t`0.1\,\%`}</M> handwritten).</li>
              <li>A simple gas needs only four quantities: volume <M>V</M> and amount <M>n</M> (number of moles) are <em>extensive</em> (they depend on the size of the sample); temperature <M>T</M> and pressure <M>P</M> are <em>intensive</em> (they do not).</li>
              <li>Pressure: <M p=".">{t`P=\dfrac{F}{A}`}</M> The SI unit of force is the newton <M p=",">{t`\mathrm{N}`}</M> that of pressure the pascal <M p=".">{t`\mathrm{Pa}=\mathrm{N/m^2}`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Folie.</b> «Extensiv» heisst: Schneidest du die Probe in zwei gleiche Hälften, halbieren sich <M>V</M> und <M p=".">n</M> «Intensiv» heisst: <M>T</M> und <M>P</M> bleiben in jeder Hälfte gleich, so wie die Dichte. Eine Tasse Tee ist so heiss wie die halbe Tasse.</p>
            <p>Der Druck <M>{t`P=F/A`}</M> ist Kraft pro Fläche. Dieselbe Kraft auf eine kleine Fläche drückt stärker: Ein Stöckelschuh hinterlässt tiefere Spuren als ein Turnschuh. Ein Pascal ist winzig (ein Newton auf einen ganzen Quadratmeter), darum nimmt man oft <M p=",">{t`\mathrm{kPa}`}</M> <M>{t`\mathrm{bar}`}</M> oder <M p=".">{t`\mathrm{atm}`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>How to read the slide.</b> “Extensive” means: cut the sample into two equal halves and <M>V</M> and <M>n</M> are halved. “Intensive” means: <M>T</M> and <M>P</M> stay the same in each half, like the density. A cup of tea is as hot as half a cup.</p>
            <p>The pressure <M>{t`P=F/A`}</M> is force per area. The same force on a small area presses harder: a stiletto heel leaves deeper marks than a trainer. One pascal is tiny (one newton on a whole square metre), so we often use <M p=",">{t`\mathrm{kPa}`}</M> <M>{t`\mathrm{bar}`}</M> or <M p=".">{t`\mathrm{atm}`}</M></p>
          </>}
        />
        <details className="more">
          <summary><T de="Die Gase der Folie 9" en="The gases of slide 9" /></summary>
          <T
            de={<p>Zimmertemperatur-Gase der Tabelle: <C>HCN</C> (sehr giftig, Bittermandelgeruch), <C>H2S</C> (sehr giftig, faule Eier), <C>CO</C> (giftig, geruchlos), <C>CO2</C> (farb- und geruchlos), <C>CH4</C> (brennbar), <C>C2H4</C> (Ethen, lässt Früchte reifen), <C>C3H8</C> (Propan, Flaschengas), <C>N2O</C> (Lachgas), <C>NO2</C> (giftig, rotbraun), <C>NH3</C> (stechend), <C>SO2</C> (reizender Geruch). <Src lec={2} p="9" /></p>}
            en={<p>The room-temperature gases of the table: <C>HCN</C> (very toxic, bitter-almond smell), <C>H2S</C> (very toxic, rotten eggs), <C>CO</C> (toxic, odourless), <C>CO2</C> (colourless, odourless), <C>CH4</C> (flammable), <C>C2H4</C> (ethene, ripens fruit), <C>C3H8</C> (propane, bottled gas), <C>N2O</C> (laughing gas), <C>NO2</C> (toxic, red-brown), <C>NH3</C> (pungent), <C>SO2</C> (irritating smell). <Src lec={2} p="9" /></p>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="druck" title={<T de="2. Woher kommt der Druck?" en="2. Where does pressure come from?" />}>
        <Box kind="lecture" src={<Src lec={2} p="11" />} title={<T de="Ursprung des Drucks" en="Origin of pressure" />}>
          <T
            de={<ul>
              <li>Die Moleküle bewegen sich zufällig. Wo sie auf eine Fläche treffen, üben sie eine Kraft pro Fläche aus.</li>
              <li>Luftdruck: Druck durch die Erdanziehung. Man betrachtet eine Luftsäule von <M>{t`1\,\mathrm{m^2}`}</M> Querschnitt mit <M p=".">{t`m\approx 10\,000\,\mathrm{kg}`}</M></li>
              <li><M>{t`F=mg\approx 1\cdot10^{5}\,\mathrm{N}`}</M> und damit <M p=".">{t`P_{\mathrm{atm}}\approx 10^{5}\,\mathrm{N/m^2}\approx 100\,\mathrm{kPa}\approx 1\,\mathrm{bar}`}</M> Die Folie nennt das eine Schätzung.</li>
            </ul>}
            en={<ul>
              <li>Molecules move randomly. Where they hit a surface they cause a force per unit area.</li>
              <li>Atmospheric pressure: pressure due to the Earth’s gravity. Consider a column of air of <M>{t`1\,\mathrm{m^2}`}</M> cross-section with <M p=".">{t`m\approx 10\,000\,\mathrm{kg}`}</M></li>
              <li><M>{t`F=mg\approx 1\cdot10^{5}\,\mathrm{N}`}</M> and therefore <M p=".">{t`P_{\mathrm{atm}}\approx 10^{5}\,\mathrm{N/m^2}\approx 100\,\mathrm{kPa}\approx 1\,\mathrm{bar}`}</M> The slide calls this an estimate.</li>
            </ul>}
          />
          <T
            de={<p>Handschrift: <M>{t`1\,\mathrm{bar}=1\cdot10^{5}\,\mathrm{Pa}`}</M> und <M p=".">g</M> ist die Beschleunigung durch die Erdanziehung. (Auf der Folie steht für <M>g</M> die Einheit <M p=",">{t`\mathrm{m^2/s}`}</M> gemeint ist <M p=".)">{t`\mathrm{m/s^2}`}</M></p>}
            en={<p>Handwritten: <M>{t`1\,\mathrm{bar}=1\cdot10^{5}\,\mathrm{Pa}`}</M> and <M>g</M> is the acceleration due to the Earth’s gravity. (The slide writes the unit of <M>g</M> as <M p=",">{t`\mathrm{m^2/s}`}</M> but <M>{t`\mathrm{m/s^2}`}</M> is meant.)</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>Das Bild dazu.</b> Im Kasten fliegen Teilchen. Jedes Mal, wenn eines die Wand trifft, gibt es ihr einen kleinen Stoss. Ein einzelner Stoss ist winzig. Aber es sind unzählige pro Sekunde, und sie verschmelzen zu einer gleichmässigen Kraft auf die Wand. Kraft pro Fläche ist der Druck.</p>
            <p>Unten misst die Figur den Druck genau so: Sie zählt die Stösse und ihre Stärke. Daneben steht, was das ideale Gasgesetz <M>{t`P=nRT/V`}</M> für dieselben Zahlen sagt. Beide stimmen überein, nur wackelt die Messung ein wenig, weil es so wenige Teilchen sind. Ein echter Liter Luft hat rund <M>{t`10^{22}`}</M> Teilchen, da wackelt nichts mehr. Zieh die Regler und beobachte die Wandstösse.</p>
          </>}
          en={<>
            <p><b>The picture.</b> Particles fly around in the box. Each time one hits the wall it gives the wall a tiny push. A single push is tiny. But there are countless ones per second, and they blend into a steady force on the wall. Force per area is the pressure.</p>
            <p>The figure below measures the pressure in exactly this way: it counts the hits and their strength. Next to it stands what the ideal gas law <M>{t`P=nRT/V`}</M> says for the same numbers. They agree, except that the measurement wobbles a little because there are so few particles. A real litre of air has about <M>{t`10^{22}`}</M> particles, and then nothing wobbles. Drag the sliders and watch the wall hits.</p>
          </>}
        />
        <PressureBox />
        <T
          de={<p>Probiere die Knöpfe aus. <em>Volumen halbieren:</em> Dieselben Teilchen treffen die Wand doppelt so oft, der Druck verdoppelt sich. <em>Temperatur verdoppeln:</em> Die Teilchen sind schneller und treffen häufiger und härter. <em>Doppelt so viele Teilchen:</em> doppelt so viele Stösse. Genau das fassen die drei Gasgesetze unten in Formeln. Das Bild passt auch zur Folie 25: Verdoppelt man <M>T</M> (in Kelvin), verdoppelt sich die mittlere Bewegungsenergie, und der Druck verdoppelt sich mit.</p>}
          en={<p>Try the buttons. <em>Halve the volume:</em> the same particles hit the wall twice as often, so the pressure doubles. <em>Double the temperature:</em> the particles are faster and hit more often and harder. <em>Twice as many particles:</em> twice as many hits. This is exactly what the three gas laws below put into formulas. It also fits slide 25: if you double <M>T</M> (in kelvin) the average kinetic energy doubles, and so does the pressure.</p>}
        />
        <Derivation title={<T de="Warum die Atmosphäre mit rund 1 bar drückt" en="Why the atmosphere presses with about 1 bar" />}>
          <StepPlayer
            label={tr('Animation: Luftsäule über einem Quadratmeter', 'Animation: a column of air above one square metre')}
            steps={[
              { ms: 3000, holdMs: 2200, caption: <T
                de={<>Wir stellen uns eine Luftsäule vor, die auf <M>{t`1\,\mathrm{m^2}`}</M> Boden steht und bis ins All reicht. Unten ist die Luft dichter, denn die Luft darüber lastet auf ihr.</>}
                en={<>Picture a column of air standing on <M>{t`1\,\mathrm{m^2}`}</M> of ground and reaching up to space. The air is denser at the bottom because the air above weighs on it.</>} /> },
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Die ganze Säule hat die Masse <M>{t`m\approx 10^{4}\,\mathrm{kg}`}</M> (zehn Tonnen). Die Erdanziehung <M>g</M> zieht jedes Stück nach unten.</>}
                en={<>The whole column has the mass <M>{t`m\approx 10^{4}\,\mathrm{kg}`}</M> (ten tonnes). Gravity <M>g</M> pulls every piece down.</>} /> },
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Das Gewicht der Säule ist die Kraft <M p=".">{t`F=mg\approx 1\cdot10^{5}\,\mathrm{N}`}</M> Sie drückt auf den einen Quadratmeter Boden.</>}
                en={<>The weight of the column is the force <M p=".">{t`F=mg\approx 1\cdot10^{5}\,\mathrm{N}`}</M> It presses on the one square metre of ground.</>} /> },
              { ms: 2500, caption: <T
                de={<>Kraft pro Fläche ist der Druck: <M p=".">{t`P=F/A\approx 10^{5}\,\mathrm{Pa}=100\,\mathrm{kPa}\approx 1\,\mathrm{bar}`}</M></>}
                en={<>Force per area is the pressure: <M p=".">{t`P=F/A\approx 10^{5}\,\mathrm{Pa}=100\,\mathrm{kPa}\approx 1\,\mathrm{bar}`}</M></>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={airColumnScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="barometer" title={<T de="3. Barometer und Manometer" en="3. Barometer and manometer" />}>
        <Box kind="lecture" src={<Src lec={2} p="12–13" />} title={<T de="Luftdruck messen; Überdruck messen" en="Measuring atmospheric pressure; measuring relative pressure" />}>
          <T
            de={<ul>
              <li><b>Barometer</b> (Torricelli, 1608–1647): ein Rohr mit Quecksilber (<C>Hg</C>), mit dem offenen Ende in eine Schale getaucht, oben Vakuum. Die Säule ist <M>h</M> hoch.</li>
              <li><M p=",">{t`P_{\mathrm{Hg}}=\dfrac{F}{A}=\dfrac{mg}{A}=\dfrac{\rho V g}{A}`}</M> mit <M p=",">V=Ah</M> also <M p=".">{t`P_{\mathrm{Hg}}=\rho g h`}</M> Das ist der hydrostatische Druck. Die Dichte von Quecksilber: <M p=".">{t`\rho=13{,}5\,\mathrm{g/cm^3}`}</M></li>
              <li>Auf Meereshöhe: <M p=".">{t`h=760\,\mathrm{mm\,Hg}`}</M> Umgerechnet: <M p=".">{t`P_{\mathrm{atm}}=760\,\mathrm{torr}=1\,\mathrm{atm}=101{,}325\,\mathrm{kPa}=1{,}01325\,\mathrm{bar}`}</M></li>
              <li><b>Manometer</b> misst den Druck relativ zu <M p=":">{t`P_{\mathrm{atm}}`}</M> <M p=".">{t`P_{\mathrm{gas}}=P_{\mathrm{atm}}+\rho g h`}</M> Auch der Blutdruck wird so gemessen: «120 zu 80» in mm Hg (Handschrift: systolisch zu diastolisch, Maximum und Minimum).</li>
            </ul>}
            en={<ul>
              <li><b>Barometer</b> (Torricelli, 1608–1647): a tube of mercury (<C>Hg</C>), open end dipped into a dish, vacuum on top. The column is <M>h</M> high.</li>
              <li><M p=",">{t`P_{\mathrm{Hg}}=\dfrac{F}{A}=\dfrac{mg}{A}=\dfrac{\rho V g}{A}`}</M> with <M p=",">V=Ah</M> so <M p=".">{t`P_{\mathrm{Hg}}=\rho g h`}</M> This is the hydrostatic pressure. The density of mercury: <M p=".">{t`\rho=13.5\,\mathrm{g/cm^3}`}</M></li>
              <li>At sea level: <M p=".">{t`h=760\,\mathrm{mm\,Hg}`}</M> In other units: <M p=".">{t`P_{\mathrm{atm}}=760\,\mathrm{torr}=1\,\mathrm{atm}=101.325\,\mathrm{kPa}=1.01325\,\mathrm{bar}`}</M></li>
              <li><b>Manometer</b> measures the pressure relative to <M p=":">{t`P_{\mathrm{atm}}`}</M> <M p=".">{t`P_{\mathrm{gas}}=P_{\mathrm{atm}}+\rho g h`}</M> Blood pressure is measured this way, too: “120 over 80” in mm Hg (handwritten: systolic over diastolic, max and min).</li>
            </ul>}
          />
          <T
            de={<p>Handschrift: «Wir benutzen <M>\rho</M> für die Dichte, wie in euren anderen Fächern (Brown schreibt <M p=").">d</M>»</p>}
            en={<p>Handwritten: “We will use <M>\rho</M> as the symbol for density to be consistent with your other classes (Brown uses <M p=").">d</M>”</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Zeilen.</b> Das Quecksilber im Rohr fällt nicht heraus, weil die Luft von aussen auf die Schale drückt und die Säule hochhält. Zwei Kräfte halten sich die Waage: unten drückt die Luft, oben zieht das Gewicht der Säule.</p>
            <ol className="keep">
              <li>Der Druck der Säule ist ihr Gewicht geteilt durch die Fläche <M p=".">{t`P=F/A`}</M></li>
              <li>Das Gewicht ist Masse mal <M p=",">g</M> also <M p=".">{t`F=mg`}</M></li>
              <li>Die Masse ist Dichte mal Volumen, <M p=",">{t`m=\rho V`}</M> und das Volumen eines Zylinders ist Fläche mal Höhe, <M p=".">{t`V=Ah`}</M></li>
              <li>Setzt man ein, kürzt sich <M>A</M> weg: <M p=".">{t`P=\rho g h`}</M> Darum hängt der Druck nur von der Höhe ab, nicht vom Rohrquerschnitt.</li>
            </ol>
            <p>Quecksilber nimmt man, weil es sehr dicht ist (<M p=")">{t`13{,}6`}</M> mal dichter als Wasser): Die Säule ist nur etwa <M>{t`76\,\mathrm{cm}`}</M> hoch. Mit Wasser wäre sie über zehn Meter hoch. Probiere es in der Figur aus.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the lines.</b> The mercury in the tube does not fall out because the air outside presses on the dish and holds the column up. Two forces balance: from below the air pushes, from above the weight of the column pulls.</p>
            <ol className="keep">
              <li>The pressure of the column is its weight divided by the area, <M p=".">{t`P=F/A`}</M></li>
              <li>The weight is mass times <M p=",">g</M> so <M p=".">{t`F=mg`}</M></li>
              <li>The mass is density times volume, <M p=",">{t`m=\rho V`}</M> and the volume of a cylinder is area times height, <M p=".">{t`V=Ah`}</M></li>
              <li>Insert and <M>A</M> cancels: <M p=".">{t`P=\rho g h`}</M> So the pressure depends only on the height, not on the width of the tube.</li>
            </ol>
            <p>We use mercury because it is very dense (<M>{t`13.6`}</M> times denser than water): the column is only about <M>{t`76\,\mathrm{cm}`}</M> high. With water it would be over ten metres. Try it in the figure.</p>
          </>}
        />
        <Derivation title={<T de="Das Barometer in fünf Schritten" en="The barometer in five steps" />}>
          <StepPlayer
            label={tr('Animation: Herleitung P = ρ g h am Barometer', 'Animation: deriving P = ρ g h at the barometer')}
            steps={[
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Das Rohr steht umgekehrt in der Quecksilberschale. Oben ist Vakuum. Die Luft drückt (<M p=")">{t`P_{\mathrm{atm}}`}</M> auf die Schale und hält die Säule der Höhe <M>h</M> hoch.</>}
                en={<>The tube stands upside down in the dish of mercury. On top is a vacuum. The air presses (<M p=")">{t`P_{\mathrm{atm}}`}</M> on the dish and holds up the column of height <M p=".">h</M></>} /> },
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Die Säule hat ein Gewicht <M p=".">{t`F=mg`}</M> Ihr Druck auf den Fuss ist Kraft pro Fläche, <M p=".">{t`P_{\mathrm{Hg}}=F/A=mg/A`}</M></>}
                en={<>The column has a weight <M p=".">{t`F=mg`}</M> Its pressure on the foot is force per area, <M p=".">{t`P_{\mathrm{Hg}}=F/A=mg/A`}</M></>} /> },
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Die Fläche des Rohrquerschnitts ist <M p=".">A</M> Das Volumen der Säule ist <M p=",">{t`V=Ah`}</M> also die Masse <M p=".">{t`m=\rho V=\rho A h`}</M></>}
                en={<>The cross-section of the tube has area <M p=".">A</M> The volume of the column is <M p=",">{t`V=Ah`}</M> so the mass is <M p=".">{t`m=\rho V=\rho A h`}</M></>} /> },
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Eingesetzt kürzt sich <M>A</M> weg: <M p=".">{t`P_{\mathrm{Hg}}=\rho A h g/A=\rho g h`}</M> Das ist der hydrostatische Druck.</>}
                en={<>Inserted, <M>A</M> cancels: <M p=".">{t`P_{\mathrm{Hg}}=\rho A h g/A=\rho g h`}</M> This is the hydrostatic pressure.</>} /> },
              { ms: 2500, caption: <T
                de={<>Auf Meereshöhe ist <M p=",">{t`h=760\,\mathrm{mm}`}</M> also <M p=".">{t`P_{\mathrm{atm}}=760\,\mathrm{mm\,Hg}=1\,\mathrm{atm}`}</M></>}
                en={<>At sea level <M p=",">{t`h=760\,\mathrm{mm}`}</M> so <M p=".">{t`P_{\mathrm{atm}}=760\,\mathrm{mm\,Hg}=1\,\mathrm{atm}`}</M></>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={baroScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Beim <b>Manometer</b> (U-Rohr) steht auf einer Seite das Gas, auf der anderen die offene Luft. Ist der Gasdruck grösser, drückt er das Quecksilber auf seiner Seite nach unten, und auf der offenen Seite steigt es um <M p=".">h</M> Die Höhendifferenz «zeigt» den Überdruck: <M p=".">{t`P_{\mathrm{gas}}=P_{\mathrm{atm}}+\rho g h`}</M> Ist der Gasdruck kleiner als der Luftdruck, kehrt sich der Höhenunterschied um und <M>h</M> wird negativ.</p>}
          en={<p>In a <b>manometer</b> (U-tube) the gas is on one side and the open air on the other. If the gas pressure is larger, it pushes the mercury down on its side, and on the open side it rises by <M p=".">h</M> The height difference “shows” the excess pressure: <M p=".">{t`P_{\mathrm{gas}}=P_{\mathrm{atm}}+\rho g h`}</M> If the gas pressure is smaller than the air pressure, the height difference reverses and <M>h</M> becomes negative.</p>}
        />
        <PressureTools />
        <T
          de={<p><b>Das Zahlenbeispiel der Folie.</b> Das Bild der Folie 13 zeigt die Quecksilberstände <M>{t`136{,}4\,\mathrm{mm}`}</M> und <M p=".">{t`103{,}8\,\mathrm{mm}`}</M> Der Unterschied ist <M p=".">{t`h=32{,}6\,\mathrm{mm}`}</M> Die Folie rechnet das nicht weiter. Bei <M>{t`P_{\mathrm{atm}}=760\,\mathrm{mm\,Hg}`}</M> folgt <M p=",">{t`P_{\mathrm{gas}}=760+32{,}6=792{,}6\,\mathrm{mm\,Hg}`}</M> das sind etwa <M p=".">{t`105{,}7\,\mathrm{kPa}`}</M> Der Knopf «Folie» in der Figur stellt genau diesen Fall ein. Weil ein Millimeter Quecksilber dasselbe Mass wie ein Torr ist, kann man Höhen direkt als Druck lesen.</p>}
          en={<p><b>The slide’s numbers.</b> The picture on slide 13 shows the mercury levels <M>{t`136.4\,\mathrm{mm}`}</M> and <M p=".">{t`103.8\,\mathrm{mm}`}</M> The difference is <M p=".">{t`h=32.6\,\mathrm{mm}`}</M> The slide does not go on to compute. For <M>{t`P_{\mathrm{atm}}=760\,\mathrm{mm\,Hg}`}</M> it follows <M p=",">{t`P_{\mathrm{gas}}=760+32.6=792.6\,\mathrm{mm\,Hg}`}</M> about <M p=".">{t`105.7\,\mathrm{kPa}`}</M> The button “Slide” in the figure sets exactly this case. Because one millimetre of mercury is the same unit as one torr, you can read heights directly as pressure.</p>}
        />
        <Box kind="uebung" src={<Src ex={2} p="6" />} title={<T de="Barometer und Manometer in der Übung" en="Barometer and manometer in the exercise class" />}>
          <T
            de={<p>Die Übung fasst beide Geräte in je einer Formel zusammen, mit der Einheit jeder Grösse: Barometer <M p=",">{t`P=\rho\,g\,h`}</M> Manometer <M p=".">{t`P_G=P_{\mathrm{atm}}+\rho\,g\,h`}</M> Dabei sind <M>P</M> in <M p=",">{t`\mathrm{Pa}`}</M> <M>\rho</M> in <M p=",">{t`\mathrm{kg/m^3}`}</M> <M>g</M> in <M p=",">{t`9{,}81\,\mathrm{m/s^2}`}</M> und <M>h</M> in <M p=".">{t`\mathrm{m}`}</M> Skizzen: ein Rohr in einer Hg-Wanne und ein U-Rohr mit dem Gas links.</p>}
            en={<p>The exercise class puts each device into one formula, with the unit of every quantity: barometer <M p=",">{t`P=\rho\,g\,h`}</M> manometer <M p=".">{t`P_G=P_{\mathrm{atm}}+\rho\,g\,h`}</M> Here <M>P</M> is in <M p=",">{t`\mathrm{Pa}`}</M> <M>\rho</M> in <M p=",">{t`\mathrm{kg/m^3}`}</M> <M>g</M> in <M p=",">{t`9.81\,\mathrm{m/s^2}`}</M> and <M>h</M> in <M p=".">{t`\mathrm{m}`}</M> Sketches: a tube in a Hg dish and a U-tube with the gas on the left.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="gesetze" title={<T de="4. Boyle, Charles und Avogadro" en="4. Boyle, Charles and Avogadro" />}>
        <T
          de={<p>Wie hängen die vier Grössen zusammen? Die Folie sagt (handschriftlich): Wir betrachten sie paarweise. Man ändert <em>eine</em> Grösse, hält die anderen fest und schaut, was eine zweite tut. Diese Idee stammt von Boyle und ist ein Grundgedanke der Naturwissenschaft und Technik.</p>}
          en={<p>How do the four quantities depend on each other? The slide says (handwritten): we consider them in pairs. You change <em>one</em> quantity, hold the others fixed and watch what a second one does. This idea is due to Boyle and is a key idea of science and engineering.</p>}
        />
        <Box kind="lecture" src={<Src lec={2} p="14–16" />} title={<T de="Die drei Gasgesetze" en="The three gas laws" />}>
          <T
            de={<ul>
              <li><b>Boyle</b> (1627–1691), <M>n</M> und <M>T</M> konstant: Halbiert man das Volumen, verdoppelt sich der Druck. <M p=",">{t`PV=\text{konstant}`}</M> oder <M p=".">{t`P=\text{konstant}/V`}</M> Erstes Gasgesetz; <M>P</M> und <M>V</M> sind umgekehrt proportional. Ein <em>Gesetz</em> sagt, <em>was</em> passiert; eine Theorie erklärt, <em>warum</em>.</li>
              <li><b>Charles</b> (1746–1823), <M>n</M> und <M>P</M> konstant: <M>V</M> ist linear in <M p=".">T</M> Man verschiebt den Nullpunkt: <M p=".">{t`-273{,}15\,^\circ\mathrm{C}=0\,\mathrm{K}`}</M> Eine Änderung von <M>{t`1{,}0\,^\circ\mathrm{C}`}</M> ist eine von <M p=".">{t`1{,}0\,\mathrm{K}`}</M> Dann <M p=",">{t`V=\text{konstant}\cdot T`}</M> also <M p=".">{t`V/T=\text{konstant}`}</M> Zweites Gasgesetz; <M>V</M> und <M>T</M> sind direkt proportional. Das Gas erreicht den absoluten Nullpunkt nie, weil es vorher flüssig und fest wird.</li>
              <li><b>Avogadro</b> (1776–1856), <M>P</M> und <M>T</M> konstant: <M>V</M> ist linear in <M p=".">n</M> <M p=",">{t`V=\text{konstant}\cdot n`}</M> also <M p=".">{t`V/n=\text{konstant}`}</M> Drittes Gasgesetz. Avogadros <em>Hypothese</em>: Die Konstante ist (ungefähr) für alle Gase gleich. Gleiche Volumen verschiedener Gase bei gleichem <M>P</M> und <M>T</M> enthalten gleich viele Moleküle («Wow!»).</li>
            </ul>}
            en={<ul>
              <li><b>Boyle</b> (1627–1691), <M>n</M> and <M>T</M> constant: if we halve the volume, the pressure doubles. <M p=",">{t`PV=\text{constant}`}</M> or <M p=".">{t`P=\text{constant}/V`}</M> First gas law; <M>P</M> and <M>V</M> are inversely proportional. A <em>law</em> states <em>what</em> happens; a theory explains <em>why</em>.</li>
              <li><b>Charles</b> (1746–1823), <M>n</M> and <M>P</M> constant: <M>V</M> is linear with <M p=".">T</M> Rescale: <M p=".">{t`-273.15\,^\circ\mathrm{C}=0\,\mathrm{K}`}</M> A change of <M>{t`1.0\,^\circ\mathrm{C}`}</M> is a change of <M p=".">{t`1.0\,\mathrm{K}`}</M> Then <M p=",">{t`V=\text{constant}\cdot T`}</M> or <M p=".">{t`V/T=\text{constant}`}</M> Second gas law; <M>V</M> and <M>T</M> are directly proportional. The gas never reaches absolute zero because it liquefies and solidifies first.</li>
              <li><b>Avogadro</b> (1776–1856), <M>P</M> and <M>T</M> constant: <M>V</M> is linear with <M p=".">n</M> <M p=",">{t`V=\text{constant}\cdot n`}</M> or <M p=".">{t`V/n=\text{constant}`}</M> Third gas law. Avogadro’s <em>hypothesis</em>: the constant is (approximately) the same for all gases. Equal volumes of different gases at the same <M>P</M> and <M>T</M> contain the same number of molecules (“Wow!”).</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Jede Zeile hat dieselbe Form: «Halte zwei Grössen fest, bewege die dritte, die vierte folgt.» Die Folien zeigen jeweils zwei Diagramme desselben Gesetzes. Das erste zeigt die Messpunkte, das zweite macht daraus eine Gerade, an der man das Gesetz sofort erkennt:</p>
            <ul className="keep">
              <li>Boyle: Gegen <M>V</M> aufgetragen ist <M>P</M> eine fallende Kurve (eine Hyperbel). Gegen <M>{t`1/V`}</M> aufgetragen ist es eine Gerade durch den Nullpunkt.</li>
              <li>Charles: In <M>{t`^\circ\mathrm{C}`}</M> ist <M>V(T)</M> eine Gerade, die nicht durch den Nullpunkt geht. Verlängert man sie, trifft sie die Achse bei <M p=".">{t`-273{,}15\,^\circ\mathrm{C}`}</M> In Kelvin geht sie durch den Nullpunkt. Dort ist das Volumen null (nur gedacht, denn echtes Gas wird vorher flüssig).</li>
              <li>Avogadro: Doppelt so viele Mol, doppelt so viel Volumen: eine Gerade durch den Nullpunkt.</li>
            </ul>
            <p>Die Figur unten zeigt das alles. Wähle ein Gesetz, bewege den obersten Regler (oder drücke «Abspielen») und beobachte den Punkt auf der Kurve. Die gestrichelten Kurven zeigen, was passiert, wenn man die festgehaltene Grösse ändert. Unter den Diagrammen steht die Konstante des Gesetzes: Sie bleibt beim Bewegen gleich. Das vierte Gesetz (<M>n</M> und <M>V</M> fest, <M>P</M> gegen <M p=")">T</M> ist das Beispiel 2 der Folie 19.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> Each line has the same form: “hold two quantities fixed, move the third, the fourth follows.” The slides show two diagrams of each law. The first shows the data points, the second turns them into a straight line, where you recognise the law at once:</p>
            <ul className="keep">
              <li>Boyle: plotted against <M p=",">V</M> <M>P</M> is a falling curve (a hyperbola). Plotted against <M>{t`1/V`}</M> it is a straight line through the origin.</li>
              <li>Charles: in <M p=",">{t`^\circ\mathrm{C}`}</M> <M>V(T)</M> is a straight line that does not pass through the origin. Extend it and it meets the axis at <M p=".">{t`-273.15\,^\circ\mathrm{C}`}</M> In kelvin it passes through the origin. There the volume is zero (only imagined, because a real gas liquefies first).</li>
              <li>Avogadro: twice as many moles, twice the volume: a straight line through the origin.</li>
            </ul>
            <p>The figure below shows all of this. Choose a law, move the top slider (or press “Play”) and watch the point on the curve. The dashed curves show what happens when the fixed quantity is changed. Below the diagrams is the constant of the law: it stays the same while you move. The fourth law (<M>n</M> and <M>V</M> fixed, <M>P</M> against <M p=")">T</M> is example 2 of slide 19.</p>
          </>}
        />
        <GasLawExplorer />
        <Box kind="misconception" title={<T de="«100 °C ist doppelt so heiss wie 50 °C»" en="“100 °C is twice as hot as 50 °C”" />}>
          <T
            de={<p>Verhältnisse wie «doppelt» gelten nur auf der Kelvin-Skala, denn nur dort ist null der echte Nullpunkt. Bei <M>{t`50\,^\circ\mathrm{C}=323\,\mathrm{K}`}</M> und <M>{t`100\,^\circ\mathrm{C}=373\,\mathrm{K}`}</M> ist das Verhältnis nur <M p=".">{t`373/323\approx 1{,}15`}</M> Ein Gas dehnt sich beim Erwärmen von 50 auf <M>{t`100\,^\circ\mathrm{C}`}</M> darum nur um 15 % aus, nicht auf das Doppelte. Setze in jedes Gasgesetz immer Kelvin ein. Die Handschrift der Folie 20 sagt dasselbe.</p>}
            en={<p>Ratios like “twice” only hold on the kelvin scale, because only there zero is the true zero. At <M>{t`50\,^\circ\mathrm{C}=323\,\mathrm{K}`}</M> and <M>{t`100\,^\circ\mathrm{C}=373\,\mathrm{K}`}</M> the ratio is only <M p=".">{t`373/323\approx 1.15`}</M> So a gas heated from 50 to <M>{t`100\,^\circ\mathrm{C}`}</M> expands by only 15 %, not to twice the volume. Always put kelvin into every gas law. The handwriting on slide 20 says the same.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="igl" title={<T de="5. Standardbedingungen und das ideale Gasgesetz" en="5. Standard conditions and the ideal gas law" />}>
        <Box kind="lecture" src={<Src lec={2} p="17–18" />} title={<T de="STP; ideales Gas; ideales Gasgesetz" en="STP; ideal gas; ideal gas law" />}>
          <T
            de={<ul>
              <li><b>STP</b> (Normbedingungen): <M>{t`T=0\,^\circ\mathrm{C}=273{,}15\,\mathrm{K}`}</M> und <M p=".">{t`P=1\,\mathrm{atm}=101{,}325\,\mathrm{kPa}`}</M> Molares Volumen bei STP: <M p=".">{t`22{,}41\,\mathrm{L}`}</M> (Handschrift: «Als Ingenieur solltest du diese Zahl kennen»). Gute Näherung für jedes Gas, auch wenn 1 mol verschiedener Gase verschieden viel wiegt (<C>H2</C>: <M p=",">{t`2\,\mathrm{g}`}</M> <C>CH4</C>: <M p=").">{t`16\,\mathrm{g}`}</M></li>
              <li><b>Ideales Gas</b>: ein gedachtes Gas, das alle drei Gesetze befolgt: <M p=",">{t`V\propto 1/P`}</M> <M p=",">{t`V\propto T`}</M> <M p=".">{t`V\propto n`}</M> Zusammen <M p=",">{t`V\propto nT/P`}</M> also <M p=".">{t`V=R\,\dfrac{nT}{P}`}</M> <M>R</M> heisst Gaskonstante.</li>
              <li><b>Ideales Gasgesetz</b> (IGL, «unglaublich wichtig»): <M p=".">{t`PV=nRT`}</M> <M p=",">{t`R=8{,}314\,\mathrm{m^3\,Pa/(mol\,K)}=8{,}314\,\mathrm{J/(mol\,K)}`}</M> <M p=",">{t`R=0{,}08206\,\mathrm{L\,atm/(mol\,K)}`}</M> <M p=".">{t`R=62{,}36\,\mathrm{L\,torr/(mol\,K)}`}</M></li>
              <li>Annahmen: Die Moleküle wechselwirken nicht, und ihr eigenes Volumen ist viel kleiner als das Volumen des Behälters. Die Gasmenge hängt von der Zahl der <em>gasförmigen Teilchen</em> ab: <M p=",">{t`A\to B+C`}</M> verdoppelt den Druck, wenn <M>V</M> und <M>T</M> gleich bleiben.</li>
            </ul>}
            en={<ul>
              <li><b>STP</b> (standard temperature and pressure): <M>{t`T=0\,^\circ\mathrm{C}=273.15\,\mathrm{K}`}</M> and <M p=".">{t`P=1\,\mathrm{atm}=101.325\,\mathrm{kPa}`}</M> Molar volume at STP: <M p=".">{t`22.41\,\mathrm{L}`}</M> (handwritten: “as an engineer you should know this number”). A good approximation for any gas, even though 1 mol of different gases has different masses (<C>H2</C>: <M p=",">{t`2\,\mathrm{g}`}</M> <C>CH4</C>: <M p=").">{t`16\,\mathrm{g}`}</M></li>
              <li><b>Ideal gas</b>: a hypothetical gas that follows all three laws: <M p=",">{t`V\propto 1/P`}</M> <M p=",">{t`V\propto T`}</M> <M p=".">{t`V\propto n`}</M> Together <M p=",">{t`V\propto nT/P`}</M> so <M p=".">{t`V=R\,\dfrac{nT}{P}`}</M> <M>R</M> is the gas constant.</li>
              <li><b>Ideal gas law</b> (IGL, “incredibly important”): <M p=".">{t`PV=nRT`}</M> <M p=",">{t`R=8.314\,\mathrm{m^3\,Pa/(mol\,K)}=8.314\,\mathrm{J/(mol\,K)}`}</M> <M p=",">{t`R=0.08206\,\mathrm{L\,atm/(mol\,K)}`}</M> <M p=".">{t`R=62.36\,\mathrm{L\,torr/(mol\,K)}`}</M></li>
              <li>Assumptions: the molecules do not interact, and the volume they occupy is much smaller than the volume of the container. The amount of gas depends on the number of <em>gaseous particles</em>: <M p=",">{t`A\to B+C`}</M> doubles the pressure if <M>V</M> and <M>T</M> stay the same.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Folie.</b> Die drei Gesetze sagen, wie das Volumen von jeder Grösse einzeln abhängt. Drei «proportional zu»-Aussagen lassen sich in einer Zeile vereinen: <M>V</M> wächst mit <M>n</M> und <M>T</M> und schrumpft mit <M p=".">P</M> Das Zeichen <M>{t`\propto`}</M> verbirgt eine Konstante. Man gibt ihr einen Namen, <M p=",">R</M> und rechnet um: <M p=".">{t`PV=nRT`}</M></p>
            <p>Was bedeutet <M>R</M> für die Zahlen? Es hat je nach Einheit einen anderen Wert, aber es ist immer dieselbe Grösse. Setzt du <M>P</M> in Pa und <M>V</M> in <M>{t`\mathrm{m^3}`}</M> ein, nimmst du <M p=".">{t`8{,}314`}</M> Setzt du <M>P</M> in atm und <M>V</M> in L ein, nimmst du <M p=".">{t`0{,}08206`}</M> Der Rest der Einheiten (<M p=",">{t`\mathrm{mol}`}</M> <M p=")">{t`\mathrm{K}`}</M> bleibt gleich. Die Einheit muss zur Rechnung passen, sonst ist das Ergebnis falsch.</p>
            <p>Ein Test: Ein Mol bei STP nimmt <M>{t`V=nRT/P=0{,}08206\cdot 273{,}15/1=22{,}41\,\mathrm{L}`}</M> ein. Das ist die Zahl der Folie. Und weil in <M>{t`PV=nRT`}</M> keine Gasart vorkommt, gilt sie für <em>jedes</em> ideale Gas (Avogadro). Der Handschrift der Übung nach hängt das Verhalten nur von der Zahl der Teilchen ab, nicht davon, welches Atom oder Molekül es ist.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the slide.</b> The three laws say how the volume depends on each quantity separately. Three “proportional to” statements can be merged into one line: <M>V</M> grows with <M>n</M> and <M>T</M> and shrinks with <M p=".">P</M> The sign <M>{t`\propto`}</M> hides a constant. We give it a name, <M p=",">R</M> and rearrange: <M p=".">{t`PV=nRT`}</M></p>
            <p>What does <M>R</M> mean for the numbers? It has a different value for each choice of units, but it is always the same quantity. If you insert <M>P</M> in Pa and <M>V</M> in <M>{t`\mathrm{m^3}`}</M> you use <M p=".">{t`8.314`}</M> If you insert <M>P</M> in atm and <M>V</M> in L you use <M p=".">{t`0.08206`}</M> The rest of the units (<M p=",">{t`\mathrm{mol}`}</M> <M p=")">{t`\mathrm{K}`}</M> stays the same. The unit has to match the calculation, otherwise the result is wrong.</p>
            <p>A test: one mole at STP takes up <M>{t`V=nRT/P=0.08206\cdot 273.15/1=22.41\,\mathrm{L}`}</M> That is the number on the slide. And because no kind of gas appears in <M>{t`PV=nRT`}</M> it holds for <em>every</em> ideal gas (Avogadro). The handwriting of the exercise class says: the behaviour depends only on the number of particles, not on which atom or molecule it is.</p>
          </>}
        />
        <Derivation title={<T de={<>Vom Einzelgesetz zu <M>{t`PV=nRT`}</M></>} en={<>From the single laws to <M>{t`PV=nRT`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: Boyle, Charles und Avogadro ergeben das ideale Gasgesetz', 'Animation: Boyle, Charles and Avogadro give the ideal gas law')}
            steps={[
              { ms: 3000, holdMs: 2200, caption: <T
                de={<>Boyle: Der Druck steigt auf das Doppelte (Pfeile). Das Volumen wird halb so gross: <M p=".">{t`V\propto 1/P`}</M></>}
                en={<>Boyle: the pressure rises to twice its value (arrows). The volume becomes half as large: <M p=".">{t`V\propto 1/P`}</M></>} /> },
              { ms: 3000, holdMs: 2200, caption: <T
                de={<>Charles: Man erwärmt auf die doppelte Temperatur in Kelvin (rote Pfeile, schnellere Teilchen). Das Volumen wird doppelt so gross: <M p=".">{t`V\propto T`}</M></>}
                en={<>Charles: heat to twice the temperature in kelvin (red arrows, faster particles). The volume becomes twice as large: <M p=".">{t`V\propto T`}</M></>} /> },
              { ms: 3000, holdMs: 2200, caption: <T
                de={<>Avogadro: Man gibt gleich viele Teilchen dazu (doppelte Menge <M p=").">n</M> Das Volumen wird doppelt so gross: <M p=".">{t`V\propto n`}</M></>}
                en={<>Avogadro: add as many particles again (twice the amount <M p=").">n</M> The volume becomes twice as large: <M p=".">{t`V\propto n`}</M></>} /> },
              { ms: 2000, holdMs: 2200, caption: <T
                de={<>Alles zusammen: <M p=".">{t`V\propto nT/P`}</M> Mehr Teilchen und höhere Temperatur vergrössern das Volumen, höherer Druck verkleinert es.</>}
                en={<>All together: <M p=".">{t`V\propto nT/P`}</M> More particles and a higher temperature enlarge the volume, a higher pressure shrinks it.</>} /> },
              { ms: 2000, caption: <T
                de={<>Das <M>{t`\propto`}</M> versteckt eine Konstante. Wir nennen sie <M p=":">R</M> <M>{t`V=R\,nT/P`}</M> und umgestellt <M p=".">{t`PV=nRT`}</M></>}
                en={<>The <M>{t`\propto`}</M> hides a constant. We call it <M p=":">R</M> <M>{t`V=R\,nT/P`}</M> and rearranged <M p=".">{t`PV=nRT`}</M></>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={iglScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Im Bild bleibt das Verhältnis <M>{t`nT/P`}</M> der Massstab für das Volumen: Es verdoppelt sich in Schritt 2 und 3 und halbiert sich in Schritt 1. Die Länge der Pfeile ist nur ein Hinweis auf <M p=",">P</M> <M>T</M> und <M p=",">n</M> nicht auf echte Zahlen. Und den Satz der Folie «<M>{t`A\to B+C`}</M> verdoppelt den Druck» kannst du oben in der Figur der Teilchenbox nachspielen: <em>Doppelt so viele Teilchen</em> heisst doppelter Druck, so wie wenn jedes Molekül von <M>A</M> in zwei Teile zerfällt.</p>}
          en={<p>In the picture the ratio <M>{t`nT/P`}</M> is the measure of the volume: it doubles in steps 2 and 3 and halves in step 1. The length of the arrows is only a hint for <M p=",">P</M> <M>T</M> and <M p=",">n</M> not real numbers. And the slide’s statement “<M>{t`A\to B+C`}</M> doubles the pressure” you can replay in the particle-box figure above: <em>twice as many particles</em> means twice the pressure, just as if each molecule of <M>A</M> splits into two pieces.</p>}
        />
        <Box kind="uebung" src={<Src ex={2} p="4" />} title={<T de="Die Übung zum idealen Gasgesetz" en="The exercise class on the ideal gas law" />}>
          <T
            de={<p>Die Übung schreibt <M>{t`PV=nRT`}</M> mit den Einheiten <M p=",">{t`[P]=\mathrm{Pa}`}</M> <M p=",">{t`[V]=\mathrm{m^3}`}</M> <M p=",">{t`[T]=\mathrm K`}</M> und <M>{t`n=m/M`}</M> (<M>m</M> in Gramm, <M>M</M> die molare Masse in g/mol, ein mol sind <M p=")">{t`6{,}022\cdot10^{23}`}</M> Teilchen. Die Werte von <M p=":">R</M> <M p=",">{t`8{,}314\,\mathrm{J/(mol\,K)}`}</M> <M p=",">{t`0{,}08314\,\mathrm{L\,bar/(mol\,K)}`}</M> <M p=".">{t`0{,}08206\,\mathrm{L\,atm/(mol\,K)}`}</M> Die Übung nennt <M>R</M> dabei «Boltzmann-Konstante». Gemeint ist die <em>Gaskonstante</em>; die Boltzmann-Konstante ist <M p=".">{t`k_B=R/N_A\approx 1{,}38\cdot10^{-23}\,\mathrm{J/K}`}</M> STP: <M>{t`T=0\,^\circ\mathrm C=273\,\mathrm K`}</M> und <M p=".">{t`P=101\,325\,\mathrm{Pa}`}</M></p>}
            en={<p>The exercise class writes <M>{t`PV=nRT`}</M> with the units <M p=",">{t`[P]=\mathrm{Pa}`}</M> <M p=",">{t`[V]=\mathrm{m^3}`}</M> <M p=",">{t`[T]=\mathrm K`}</M> and <M>{t`n=m/M`}</M> (<M>m</M> in grams, <M>M</M> the molar mass in g/mol, one mole is <M p=")">{t`6.022\cdot10^{23}`}</M> particles. The values of <M p=":">R</M> <M p=",">{t`8.314\,\mathrm{J/(mol\,K)}`}</M> <M p=",">{t`0.08314\,\mathrm{L\,bar/(mol\,K)}`}</M> <M p=".">{t`0.08206\,\mathrm{L\,atm/(mol\,K)}`}</M> The exercise class calls <M>R</M> the “Boltzmann constant”. What is meant is the <em>gas constant</em>; the Boltzmann constant is <M p=".">{t`k_B=R/N_A\approx 1.38\cdot10^{-23}\,\mathrm{J/K}`}</M> STP: <M>{t`T=0\,^\circ\mathrm C=273\,\mathrm K`}</M> and <M p=".">{t`P=101\,325\,\mathrm{Pa}`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="typen" title={<T de="6. Das Gasgesetz anwenden: drei Aufgabentypen" en="6. Using the gas law: three problem types" />}>
        <Box kind="lecture" src={<Src lec={2} p="19–20" />} title={<T de="Aufgabentypen 1, 2 und 3" en="Problem types 1, 2 and 3" />}>
          <T
            de={<ul>
              <li><b>Typ 1:</b> drei der vier Grössen sind gegeben, die vierte fehlt. Umstellen: <M p=",">{t`P=\dfrac{nRT}{V}`}</M> <M p=",">{t`V=\dfrac{nRT}{P}`}</M> <M p=",">{t`n=\dfrac{PV}{RT}`}</M> <M p=".">{t`T=\dfrac{PV}{nR}`}</M></li>
              <li><b>Typ 2:</b> zwei Grössen bleiben konstant, zwei andere ändern sich. Beispiel 1 (<M p=",">n</M> <M>T</M> konstant): <M>PV</M> ist konstant, also <M p=",">{t`P_iV_i=P_fV_f`}</M> <M p=".">{t`P_f=P_iV_i/V_f`}</M> Beispiel 2 (<M p=",">n</M> <M>V</M> konstant): <M>P/T</M> ist konstant, also <M p=",">{t`P_i/T_i=P_f/T_f`}</M> <M p=".">{t`P_f=P_iT_f/T_i`}</M> (<M>i</M> = initial, <M>f</M> = final.)</li>
              <li><b>Typ 3:</b> eine Grösse bleibt konstant, drei ändern sich. Beispiel (<M>n</M> konstant): <M>PV/T=nR</M> ist konstant, also <M p=",">{t`P_iV_i/T_i=P_fV_f/T_f`}</M> <M p=".">{t`P_f=P_i\,\dfrac{V_i}{V_f}\,\dfrac{T_f}{T_i}`}</M></li>
              <li>Handschrift: Es geht nicht darum, diese Varianten auswendig zu lernen, sondern mit dem Gasgesetz aus Bekanntem und Unbekanntem zu arbeiten. Typisch für Prüfungen.</li>
            </ul>}
            en={<ul>
              <li><b>Type 1:</b> three of the four quantities are given, the fourth is missing. Rearrange: <M p=",">{t`P=\dfrac{nRT}{V}`}</M> <M p=",">{t`V=\dfrac{nRT}{P}`}</M> <M p=",">{t`n=\dfrac{PV}{RT}`}</M> <M p=".">{t`T=\dfrac{PV}{nR}`}</M></li>
              <li><b>Type 2:</b> two quantities stay constant, two others change. Example 1 (<M p=",">n</M> <M>T</M> constant): <M>PV</M> is constant, so <M p=",">{t`P_iV_i=P_fV_f`}</M> <M p=".">{t`P_f=P_iV_i/V_f`}</M> Example 2 (<M p=",">n</M> <M>V</M> constant): <M>P/T</M> is constant, so <M p=",">{t`P_i/T_i=P_f/T_f`}</M> <M p=".">{t`P_f=P_iT_f/T_i`}</M> (<M>i</M> = initial, <M>f</M> = final.)</li>
              <li><b>Type 3:</b> one quantity stays constant, three change. Example (<M>n</M> constant): <M>PV/T=nR</M> is constant, so <M p=",">{t`P_iV_i/T_i=P_fV_f/T_f`}</M> <M p=".">{t`P_f=P_i\,\dfrac{V_i}{V_f}\,\dfrac{T_f}{T_i}`}</M></li>
              <li>Handwritten: the point is not to memorise these variations but to learn how to work with the ideal gas law given knowns and unknowns. Common on exams.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Typ 1 ist reines Umstellen. Typ 2 und 3 haben ein «vorher» und ein «nachher». Der Trick: <M>R</M> ist immer gleich, und was konstant bleibt (zum Beispiel <M p=")">n</M> steht links und rechts. Dann kürzt es sich weg. Man schreibt <M>{t`PV/(nT)=R`}</M> für beide Zustände hin, streicht, was gleich bleibt, und löst nach der Unbekannten auf.</p>
            <p>Merke dir eine Prüfung-Regel: Stoffmenge und alle Einheiten prüfen, <em>Temperaturen in Kelvin</em>. Bei Verhältnissen wie <M>{t`P_i/P_f`}</M> müssen nur beide Drücke dieselbe Einheit haben; dann kürzt sich die Einheit weg.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> Type 1 is pure rearranging. Types 2 and 3 have a “before” and an “after”. The trick: <M>R</M> is always the same, and whatever stays constant (for example <M p=")">n</M> stands on the left and right. Then it cancels. Write <M>{t`PV/(nT)=R`}</M> for both states, strike out what stays the same, and solve for the unknown.</p>
            <p>Remember an exam rule: check the amount and all units, and <em>temperatures in kelvin</em>. For ratios like <M>{t`P_i/P_f`}</M> only the two pressures need the same unit; then the unit cancels.</p>
          </>}
        />
        <Box kind="lecture" src={<Src lec={2} p="20" />} title={<T de="Beispiel: der Ballon (Typ 3)" en="Example: the balloon (type 3)" />}>
          <T
            de={<p>Ein Ballon mit <M>{t`V=6{,}0\,\mathrm L`}</M> bei <M>{t`P=101{,}3\,\mathrm{kPa}`}</M> steigt, bis <M>{t`P=45{,}6\,\mathrm{kPa}`}</M> herrscht. Die Temperatur fällt von <M>{t`22\,^\circ\mathrm C`}</M> auf <M p=".">{t`-21\,^\circ\mathrm C`}</M> Wie gross ist das Endvolumen? Bekannt: <M>n</M> fest, <M p=",">{t`V_i`}</M> <M p=",">{t`P_i`}</M> <M p=",">{t`P_f`}</M> <M p=",">{t`T_i`}</M> <M p=".">{t`T_f`}</M> Gesucht: <M p=".">{t`V_f`}</M> Strategie: <M>PV/T=nR</M> ist konstant, also <M p=",">{t`P_iV_i/T_i=P_fV_f/T_f`}</M> nach der Unbekannten aufgelöst <M p=",">{t`V_f=V_i\,\dfrac{P_i}{P_f}\,\dfrac{T_f}{T_i}`}</M> eingesetzt: <M p=".">{t`V_f=11\,\mathrm L`}</M> Handschrift: Temperaturen müssen immer in Kelvin sein!</p>}
            en={<p>A balloon of <M>{t`V=6.0\,\mathrm L`}</M> at <M>{t`P=101.3\,\mathrm{kPa}`}</M> rises until <M p=".">{t`P=45.6\,\mathrm{kPa}`}</M> The temperature falls from <M>{t`22\,^\circ\mathrm C`}</M> to <M p=".">{t`-21\,^\circ\mathrm C`}</M> What is the final volume? Known: <M>n</M> fixed, <M p=",">{t`V_i`}</M> <M p=",">{t`P_i`}</M> <M p=",">{t`P_f`}</M> <M p=",">{t`T_i`}</M> <M p=".">{t`T_f`}</M> Unknown: <M p=".">{t`V_f`}</M> Strategy: <M>PV/T=nR</M> is constant, so <M p=",">{t`P_iV_i/T_i=P_fV_f/T_f`}</M> solved for the unknown <M p=",">{t`V_f=V_i\,\dfrac{P_i}{P_f}\,\dfrac{T_f}{T_i}`}</M> inserted: <M p=".">{t`V_f=11\,\mathrm L`}</M> Handwritten: temperatures must always be in kelvin!</p>}
          />
        </Box>
        <T
          de={<p>Warum ist das Ergebnis richtig und wie kommt man darauf? Jedes Verhältnis ist ein Faktor, der das Volumen vergrössert oder verkleinert. Der Druck fällt, also dehnt sich das Gas aus: Faktor <M p=".">{t`P_i/P_f>1`}</M> Es wird kälter, also zieht sich das Gas zusammen: Faktor <M p=".">{t`T_f/T_i<1`}</M> Die Animation macht beides nacheinander, die Reihenfolge ändert das Ergebnis nicht.</p>}
          en={<p>Why is the result right and how do you get there? Each ratio is a factor that enlarges or shrinks the volume. The pressure falls, so the gas expands: factor <M p=".">{t`P_i/P_f>1`}</M> It gets colder, so the gas contracts: factor <M p=".">{t`T_f/T_i<1`}</M> The animation does both one after the other; the order does not change the result.</p>}
        />
        <Derivation title={<T de="Der Ballon in vier Schritten" en="The balloon in four steps" />}>
          <StepPlayer
            label={tr('Animation: Ballon steigt, Druck und Temperatur fallen', 'Animation: balloon rises, pressure and temperature fall')}
            steps={[
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Anfangszustand: <M>{t`V_i=6{,}0\,\mathrm L`}</M> bei <M>{t`P_i=101{,}3\,\mathrm{kPa}`}</M> und <M>{t`T_i=22\,^\circ\mathrm C=295\,\mathrm K`}</M> (Kelvin: <M p=")">{t`22+273{,}15`}</M></>}
                en={<>Initial state: <M>{t`V_i=6.0\,\mathrm L`}</M> at <M>{t`P_i=101.3\,\mathrm{kPa}`}</M> and <M>{t`T_i=22\,^\circ\mathrm C=295\,\mathrm K`}</M> (kelvin: <M p=")">{t`22+273.15`}</M></>} /> },
              { ms: 3500, holdMs: 2400, caption: <T
                de={<>Der Ballon steigt, der Druck fällt auf <M p=".">{t`45{,}6\,\mathrm{kPa}`}</M> Allein dadurch wächst das Volumen mit dem Faktor <M p=",">{t`P_i/P_f`}</M> auf rund <M p=".">{t`13{,}3\,\mathrm L`}</M></>}
                en={<>The balloon rises, the pressure falls to <M p=".">{t`45.6\,\mathrm{kPa}`}</M> By this alone the volume grows by the factor <M p=",">{t`P_i/P_f`}</M> to about <M p=".">{t`13.3\,\mathrm L`}</M></>} /> },
              { ms: 3500, holdMs: 2400, caption: <T
                de={<>Zugleich kühlt die Luft auf <M p=".">{t`-21\,^\circ\mathrm C=252\,\mathrm K`}</M> Das verkleinert das Volumen mit dem Faktor <M p=",">{t`T_f/T_i`}</M> auf rund <M p=".">{t`11{,}4\,\mathrm L`}</M></>}
                en={<>At the same time the air cools to <M p=".">{t`-21\,^\circ\mathrm C=252\,\mathrm K`}</M> This shrinks the volume by the factor <M p=",">{t`T_f/T_i`}</M> to about <M p=".">{t`11.4\,\mathrm L`}</M></>} /> },
              { ms: 2000, caption: <T
                de={<>Ergebnis: <M p=",">{t`V_f=V_i\,\dfrac{P_i}{P_f}\,\dfrac{T_f}{T_i}\approx 11\,\mathrm L`}</M> auf zwei gültige Ziffern gerundet, wie in den Daten.</>}
                en={<>Result: <M p=",">{t`V_f=V_i\,\dfrac{P_i}{P_f}\,\dfrac{T_f}{T_i}\approx 11\,\mathrm L`}</M> rounded to two significant digits, like the data.</>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={balloonScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Der Ballon ist so gezeichnet, dass seine <em>Fläche</em> zum Volumen passt (ein flaches Bild eines Ballons). Die Zahlen daneben stammen aus der Rechnung. Ohne Umrechnung in Kelvin käme ein negatives Volumen heraus: <M>{t`-21/22`}</M> ist negativ.</p>}
          en={<p>The balloon is drawn so that its <em>area</em> matches the volume (a flat picture of a balloon). The numbers beside it come from the calculation. Without converting to kelvin you would get a negative volume: <M>{t`-21/22`}</M> is negative.</p>}
        />
        <Box kind="uebung" src={<Src ex={2} p="5–6" />} title={<T de="Die Aufgaben der Übung 2" en="The tasks of exercise class 2" />}>
          <T
            de={<>
              <p><b>Aufgabe 2 (Typ 1).</b> Ein Tennisball hat <M>{t`144\,\mathrm{cm^3}`}</M> und enthält <M>{t`0{,}33\,\mathrm g`}</M> <C>N2</C> bei <M p=".">{t`24\,^\circ\mathrm C`}</M> Wie gross ist der Druck? Man stellt <M>{t`PV=nRT=(m/M)RT`}</M> um: <M p=".">{t`P=\dfrac{mRT}{VM}`}</M> Eingesetzt, mit <M p=",">{t`T=297{,}15\,\mathrm K`}</M> <M p=",">{t`V=144\cdot10^{-6}\,\mathrm{m^3}`}</M> <M p=":">{t`M=28\,\mathrm{g/mol}`}</M> <M p=".">{t`P=\dfrac{0{,}33\cdot 8{,}314\cdot 297{,}15}{144\cdot10^{-6}\cdot 28}\,\mathrm{Pa}\approx 2{,}0\cdot10^{5}\,\mathrm{Pa}`}</M> Zwei gültige Ziffern. Das sind rund zwei Atmosphären, wie für einen Tennisball nötig. (Auf dem Blatt steht «<M>{t`20\cdot10^{5}\,\mathrm{Pa}`}</M>», eine Zehnerpotenz zu viel.)</p>
              <p><b>Typ 2.</b> Gegeben sind zwei Zustände, der Rest bleibt konstant: <M>{t`P_1`}</M> <M>{t`P_2`}</M> <M>{t`T_1`}</M> bekannt, gesucht <M p=".">{t`T_2`}</M> Konstant ist <M p=",">{t`P/T=nR/V`}</M> also <M p=",">{t`P_1/T_1=P_2/T_2`}</M> und <M p=".">{t`T_2=\dfrac{P_2}{P_1}\,T_1`}</M></p>
              <p><b>Aufgabe 3 (Typ 2).</b> Ein Zylinder mit Kolben enthält <M>{t`50{,}0\,\mathrm L`}</M> <C>O2</C> bei <M p=".">{t`1{,}875\,\mathrm{MPa}`}</M> Welches Volumen hat das Gas bei konstanter Temperatur, wenn der Druck auf <M>{t`101{,}3\,\mathrm{kPa}`}</M> sinkt? Konstant ist <M p=",">{t`PV=nRT`}</M> also <M p=".">{t`V_2=\dfrac{P_1V_1}{P_2}=\dfrac{1875\cdot 50{,}0}{101{,}3}\,\mathrm L\approx 925\,\mathrm L`}</M> Drei gültige Ziffern. (Auf dem Blatt steht <M p=",">{t`926\,\mathrm L`}</M> genauer <M p=".)">{t`925{,}5\,\mathrm L`}</M></p>
            </>}
            en={<>
              <p><b>Task 2 (type 1).</b> A tennis ball has <M>{t`144\,\mathrm{cm^3}`}</M> and contains <M>{t`0.33\,\mathrm g`}</M> of <C>N2</C> at <M p=".">{t`24\,^\circ\mathrm C`}</M> What is the pressure? Rearrange <M>{t`PV=nRT=(m/M)RT`}</M> to <M p=".">{t`P=\dfrac{mRT}{VM}`}</M> Inserting <M p=",">{t`T=297.15\,\mathrm K`}</M> <M p=",">{t`V=144\cdot10^{-6}\,\mathrm{m^3}`}</M> <M p=":">{t`M=28\,\mathrm{g/mol}`}</M> <M p=".">{t`P=\dfrac{0.33\cdot 8.314\cdot 297.15}{144\cdot10^{-6}\cdot 28}\,\mathrm{Pa}\approx 2.0\cdot10^{5}\,\mathrm{Pa}`}</M> Two significant digits. That is about two atmospheres, as a tennis ball needs. (The sheet says “<M>{t`20\cdot10^{5}\,\mathrm{Pa}`}</M>”, a power of ten too large.)</p>
              <p><b>Type 2.</b> Two states are given, the rest is constant: <M>{t`P_1`}</M> <M>{t`P_2`}</M> <M>{t`T_1`}</M> are known, <M p=".">{t`T_2`}</M> is wanted. Constant is <M p=",">{t`P/T=nR/V`}</M> so <M p=",">{t`P_1/T_1=P_2/T_2`}</M> and <M p=".">{t`T_2=\dfrac{P_2}{P_1}\,T_1`}</M></p>
              <p><b>Task 3 (type 2).</b> A cylinder with a piston holds <M>{t`50.0\,\mathrm L`}</M> of <C>O2</C> at <M p=".">{t`1.875\,\mathrm{MPa}`}</M> What volume does the gas occupy at constant temperature when the pressure falls to <M p="?">{t`101.3\,\mathrm{kPa}`}</M> Constant is <M p=",">{t`PV=nRT`}</M> so <M p=".">{t`V_2=\dfrac{P_1V_1}{P_2}=\dfrac{1875\cdot 50.0}{101.3}\,\mathrm L\approx 925\,\mathrm L`}</M> Three significant digits. (The sheet says <M p=",">{t`926\,\mathrm L`}</M> more exactly <M p=".)">{t`925.5\,\mathrm L`}</M></p>
            </>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={2} p="12" />} title={<T de="Bonus: der Airbag" en="Bonus: the airbag" />}>
          <T
            de={<>
              <p>Ein Airbag wird mit Stickstoff gefüllt, der beim Zerfall von festem Natriumazid <C>NaN3</C> entsteht (zweites Produkt: Natrium). Welches Volumen <C>N2</C> entsteht bei <M>{t`27\,^\circ\mathrm C`}</M> und <M>{t`100{,}8\,\mathrm{kPa}`}</M> aus <M>{t`130\,\mathrm g`}</M> Natriumazid? (<M p=")">{t`M_{\mathrm{Na}}=23\,\mathrm{g/mol}`}</M> <M p=".">{t`M_{\mathrm N}=14\,\mathrm{g/mol}`}</M></p>
              <CD>{'2 NaN3(s) -> 2 Na(s) + 3 N2(g)'}</CD>
              <p><b>a)</b> <M p=",">{t`n_{\mathrm{NaN_3}}=\dfrac{130}{23+3\cdot14}=2{,}0\,\mathrm{mol}`}</M> und nach der Gleichung <M p=".">{t`n_{\mathrm{N_2}}=\tfrac32\cdot 2{,}0=3{,}0\,\mathrm{mol}`}</M> <b>b)</b> <M p=".">{t`V=\dfrac{nRT}{P}=\dfrac{3{,}0\cdot 8{,}314\cdot 300}{100\,800}\,\mathrm{m^3}\approx 0{,}074\,\mathrm{m^3}`}</M> Das sind <M>{t`74\,\mathrm L`}</M> aus gut einem Viertel Kilo Feststoff. Zwei gültige Ziffern.</p>
            </>}
            en={<>
              <p>An airbag is filled with nitrogen formed by the decomposition of solid sodium azide <C>NaN3</C> (the other product is sodium). What volume of <C>N2</C> forms at <M>{t`27\,^\circ\mathrm C`}</M> and <M>{t`100.8\,\mathrm{kPa}`}</M> from <M>{t`130\,\mathrm g`}</M> of sodium azide? (<M p=")">{t`M_{\mathrm{Na}}=23\,\mathrm{g/mol}`}</M> <M p=".">{t`M_{\mathrm N}=14\,\mathrm{g/mol}`}</M></p>
              <CD>{'2 NaN3(s) -> 2 Na(s) + 3 N2(g)'}</CD>
              <p><b>a)</b> <M p=",">{t`n_{\mathrm{NaN_3}}=\dfrac{130}{23+3\cdot14}=2.0\,\mathrm{mol}`}</M> and by the equation <M p=".">{t`n_{\mathrm{N_2}}=\tfrac32\cdot 2.0=3.0\,\mathrm{mol}`}</M> <b>b)</b> <M p=".">{t`V=\dfrac{nRT}{P}=\dfrac{3.0\cdot 8.314\cdot 300}{100\,800}\,\mathrm{m^3}\approx 0.074\,\mathrm{m^3}`}</M> That is <M>{t`74\,\mathrm L`}</M> from a good quarter kilogram of solid. Two significant digits.</p>
            </>}
          />
        </Box>

        <T
          de={<>
            <h3>Gültige Ziffern (SigFigs)</h3>
            <p>Die Übung 2 legt grossen Wert auf die Zahl der angegebenen Ziffern: In der Prüfung gibt es einen Punkt pro Rechenaufgabe, und das kann bis zu einer halben Note ausmachen. Ein Messwert kennt nicht alle Stellen, und das Ergebnis darf nicht genauer sein als die Eingabe. Die Regeln der Übung:</p>
            <ul>
              <li>Jede Ziffer ausser null zählt; jede Null <em>zwischen</em> zwei solchen Ziffern zählt; Nullen am Anfang zählen nicht.</li>
              <li>Nullen am Ende zählen nur, wenn die Zahl ein Komma hat: <M>{t`7{,}0`}</M> hat zwei, <M>{t`700=7\cdot10^2`}</M> hat eine. Achtung: <M>{t`0{,}070`}</M> hat zwei.</li>
              <li><b>Summe und Differenz:</b> so viele Nachkommastellen wie der unsicherste Wert.</li>
              <li><b>Produkt und Quotient:</b> so viele gültige Ziffern wie der Wert mit den wenigsten.</li>
              <li><b>Runden:</b> Ist die erste weggelassene Ziffer 5 oder mehr, wird aufgerundet.</li>
              <li><b>Logarithmus:</b> so viele Stellen <em>nach</em> dem Komma, wie die Eingabe gültige Ziffern hat: <M p=".">{t`\log_{10}(1{,}00\cdot10^8)=8{,}000`}</M> Exakte Zahlen (ein Dutzend ist 12) und Konstanten zählen nicht.</li>
            </ul>
            <p>Probiere die Zählregeln hier aus. Die Ziffern, die zählen, sind unterstrichen.</p>
          </>}
          en={<>
            <h3>Significant digits (SigFigs)</h3>
            <p>Exercise class 2 puts a lot of weight on the number of digits you give: in the exam there is one point per calculation exercise, and it can make up to half a grade. A measurement does not know all digits, and the result must not be more precise than the input. The rules of the exercise class:</p>
            <ul>
              <li>Every digit other than zero counts; every zero <em>between</em> two such digits counts; zeros at the start do not count.</li>
              <li>Zeros at the end count only if the number has a decimal point: <M>{t`7.0`}</M> has two, <M>{t`700=7\cdot10^2`}</M> has one. Careful: <M>{t`0.070`}</M> has two.</li>
              <li><b>Sum and difference:</b> as many decimal places as the least certain value.</li>
              <li><b>Product and quotient:</b> as many significant digits as the value with the fewest.</li>
              <li><b>Rounding:</b> if the first dropped digit is 5 or more, round up.</li>
              <li><b>Logarithm:</b> as many places <em>after</em> the decimal point as the input has significant digits: <M p=".">{t`\log_{10}(1.00\cdot10^8)=8.000`}</M> Exact numbers (a dozen is 12) and constants do not count.</li>
            </ul>
            <p>Try the counting rules here. The digits that count are underlined.</p>
          </>}
        />
        <SigFigTool />
        <T
          de={<p>Die Beispiele des Blatts, neu gerechnet. Summe: <M p=",">{t`20{,}43+1{,}322+83{,}1=104{,}852`}</M> der unsicherste Wert (<M p=")">{t`83{,}1`}</M> hat eine Nachkommastelle, also <M p=".">{t`104{,}9`}</M> (das Blatt hat <M>{t`104{,}842`}</M> und <M>{t`104{,}8`}</M> ein Rechenfehler). Produkt: <M p=",">{t`6{,}221\cdot 5{,}2=32{,}3492`}</M> zwei gültige Ziffern, also <M p=".">32</M> Aufgabe a: <M>{t`2{,}0\cdot 7{,}14=14{,}28`}</M> hat zwei gültige Ziffern, also <M p=",">14</M> dazu <M p=":">{t`9{,}00009`}</M> <M p=".">{t`14+9{,}00009=23`}</M> Aufgabe b: <M>{t`(8{,}1+7{,}26)\cdot 3{,}0`}</M> mit <M>{t`8{,}1+7{,}26=15{,}4`}</M> (eine Nachkommastelle) gibt <M>{t`15{,}4\cdot 3{,}0=46{,}2`}</M> und gerundet <M p=".">46</M> (das Blatt hat <M>{t`46{,}6\to 47`}</M> – ein Rechenfehler). Aufgabe c: <M p=".">{t`-\log_{10}(1{,}0\cdot10^3)=-3{,}00`}</M></p>}
          en={<p>The sheet’s examples, recomputed. Sum: <M p=",">{t`20.43+1.322+83.1=104.852`}</M> the least certain value (<M p=")">{t`83.1`}</M> has one decimal place, so <M p=".">{t`104.9`}</M> (the sheet has <M>{t`104.842`}</M> and <M p=",">{t`104.8`}</M> an arithmetic slip). Product: <M p=",">{t`6.221\cdot 5.2=32.3492`}</M> two significant digits, so <M p=".">32</M> Task a: <M>{t`2.0\cdot 7.14=14.28`}</M> has two significant digits, so <M p=",">14</M> plus <M p=":">{t`9.00009`}</M> <M p=".">{t`14+9.00009=23`}</M> Task b: <M>{t`(8.1+7.26)\cdot 3.0`}</M> with <M>{t`8.1+7.26=15.4`}</M> (one decimal place) gives <M>{t`15.4\cdot 3.0=46.2`}</M> and rounded <M p=".">46</M> (the sheet has <M p=",">{t`46.6\to 47`}</M> an arithmetic slip). Task c: <M p=".">{t`-\log_{10}(1.0\cdot10^3)=-3.00`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="dichte" title={<T de="7. Dichte und molare Masse aus dem Gasgesetz" en="7. Density and molar mass from the gas law" />}>
        <Box kind="lecture" src={<Src lec={2} p="21" />} title={<T de="Weitere Anwendungen des IGL" en="Other uses of the IGL" />}>
          <T
            de={<ul>
              <li><b>Dichte:</b> Das Gasgesetz umgestellt gibt <M p=".">{t`\dfrac{n}{V}=\dfrac{P}{RT}`}</M> Mit der molaren Masse <M>{t`M_w`}</M> (in g/mol) multipliziert: <M p=",">{t`\dfrac{n}{V}\cdot M_w=\dfrac{P}{RT}\cdot M_w`}</M> Einheiten: <M p=".">{t`\dfrac{\mathrm{mol}}{\mathrm L}\cdot\dfrac{\mathrm g}{\mathrm{mol}}=\dfrac{\mathrm g}{\mathrm L}`}</M> Also <M p=".">{t`\rho=\dfrac{P}{RT}\,M_w`}</M></li>
              <li><b>Molare Masse:</b> <M p=".">{t`M_w=\dfrac{\rho RT}{P}`}</M> Man bestimmt die Dichte eines Gases aus der molaren Masse oder umgekehrt.</li>
              <li>Handschrift: Die Dichte eines Gases hängt von <M p=",">P</M> <M>T</M> und <M>{t`M_w`}</M> ab.</li>
            </ul>}
            en={<ul>
              <li><b>Density:</b> rearranged, the gas law gives <M p=".">{t`\dfrac{n}{V}=\dfrac{P}{RT}`}</M> Multiplied by the molar mass <M>{t`M_w`}</M> (in g/mol): <M p=",">{t`\dfrac{n}{V}\cdot M_w=\dfrac{P}{RT}\cdot M_w`}</M> units: <M p=".">{t`\dfrac{\mathrm{mol}}{\mathrm L}\cdot\dfrac{\mathrm g}{\mathrm{mol}}=\dfrac{\mathrm g}{\mathrm L}`}</M> So <M p=".">{t`\rho=\dfrac{P}{RT}\,M_w`}</M></li>
              <li><b>Molar mass:</b> <M p=".">{t`M_w=\dfrac{\rho RT}{P}`}</M> You can find the density of a gas from the molar mass or the other way round.</li>
              <li>Handwritten: the density of a gas depends on <M p=",">P</M> <M>T</M> and <M p=".">{t`M_w`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> <M>{t`n/V`}</M> sind «Mol pro Liter»: wie dicht die <em>Teilchen</em> gepackt sind. Multipliziert man mit der Masse eines Mols, erhält man «Gramm pro Liter»: wie dicht die <em>Masse</em> gepackt ist. Das ist die Dichte. Die Teilchendichte <M>{t`P/(RT)`}</M> ist für alle idealen Gase gleich. Nur die Masse pro Teilchen unterscheidet sie.</p>
            <p>In der Figur siehst du das: Drei Kästen mit gleichem Volumen, gleichem <M>P</M> und <M>T</M> enthalten gleich viele Teilchen (das ist Avogadros Hypothese). Die Dichte unterscheidet sich nur durch die molare Masse. Warme Luft hat bei gleichem Druck weniger Teilchen pro Liter und ist darum leichter: so steigt ein Heissluftballon.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> <M>{t`n/V`}</M> is “moles per litre”: how densely the <em>particles</em> are packed. Multiplied by the mass of one mole you get “grams per litre”: how densely the <em>mass</em> is packed. That is the density. The particle density <M>{t`P/(RT)`}</M> is the same for all ideal gases. Only the mass per particle tells them apart.</p>
            <p>You can see this in the figure: three boxes with the same volume, the same <M>P</M> and <M>T</M> hold the same number of particles (that is Avogadro’s hypothesis). The density differs only by the molar mass. Warm air has fewer particles per litre at the same pressure and is therefore lighter: that is how a hot-air balloon rises.</p>
          </>}
        />
        <DensityBoxes />
        <T
          de={<p><b>Zwei Rechenbeispiele</b> (nicht auf den Folien). Stickstoff bei STP: <M>{t`\rho=\dfrac{1\cdot 28{,}01}{0{,}08206\cdot 273{,}15}\,\mathrm{g/L}=1{,}25\,\mathrm{g/L}`}</M> – dasselbe wie <M p=".">{t`28{,}01/22{,}41`}</M> Luft (<M p=")">{t`M_w\approx 29\,\mathrm{g/mol}`}</M> bei <M>{t`25\,^\circ\mathrm C`}</M> und <M p=":">{t`1\,\mathrm{atm}`}</M> <M p=".">{t`\rho\approx 1{,}18\,\mathrm{g/L}`}</M> Umgekehrt: Ein Gas hat bei <M>{t`300\,\mathrm K`}</M> und <M>{t`1\,\mathrm{atm}`}</M> die Dichte <M p=".">{t`1{,}79\,\mathrm{g/L}`}</M> Dann ist <M p=",">{t`M_w=\dfrac{1{,}79\cdot 0{,}08206\cdot 300}{1}\approx 44\,\mathrm{g/mol}`}</M> also wohl <C>CO2</C></p>}
          en={<p><b>Two worked examples</b> (not on the slides). Nitrogen at STP: <M>{t`\rho=\dfrac{1\cdot 28.01}{0.08206\cdot 273.15}\,\mathrm{g/L}=1.25\,\mathrm{g/L}`}</M> – the same as <M p=".">{t`28.01/22.41`}</M> Air (<M p=")">{t`M_w\approx 29\,\mathrm{g/mol}`}</M> at <M>{t`25\,^\circ\mathrm C`}</M> and <M p=":">{t`1\,\mathrm{atm}`}</M> <M p=".">{t`\rho\approx 1.18\,\mathrm{g/L}`}</M> The other way round: a gas has the density <M>{t`1.79\,\mathrm{g/L}`}</M> at <M>{t`300\,\mathrm K`}</M> and <M p=".">{t`1\,\mathrm{atm}`}</M> Then <M p=",">{t`M_w=\dfrac{1.79\cdot 0.08206\cdot 300}{1}\approx 44\,\mathrm{g/mol}`}</M> so probably <C>CO2</C></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="gemische" title={<T de="8. Gasgemische: Partialdrücke und Molenbruch" en="8. Gas mixtures: partial pressures and mole fraction" />}>
        <Box kind="lecture" src={<Src lec={2} p="22–23" />} title={<T de="Gemische, Daltons Gesetz, Molenbruch" en="Mixtures, Dalton’s law, mole fraction" />}>
          <T
            de={<ul>
              <li>Ein Gemisch aus <M>i</M> idealen Gasen im selben Behälter: Der Gesamtdruck hängt nur von der Gesamtzahl der Mole ab, <M p=".">{t`n_{\mathrm{tot}}=n_1+n_2+\dots+n_i`}</M></li>
              <li><M p=".">{t`P_{\mathrm{tot}}=n_{\mathrm{tot}}\dfrac{RT}{V}=n_1\dfrac{RT}{V}+n_2\dfrac{RT}{V}+\dots+n_i\dfrac{RT}{V}`}</M> (<M>T</M> und <M>V</M> sind für alle Gase gleich, weil sie im selben Behälter sind.)</li>
              <li><b>Daltons Gesetz:</b> <M p=",">{t`P_{\mathrm{tot}}=P_1+P_2+\dots+P_i`}</M> <M>{t`P_i`}</M> ist der <em>Partialdruck</em> der Sorte <M p=".">i</M> Handschrift: Jede ideale Sorte verhält sich gleich und unabhängig von den anderen. Nur die Zahl der Gasmoleküle zählt.</li>
              <li><M p=",">{t`P_i=\dfrac{n_i}{n_{\mathrm{tot}}}\,P_{\mathrm{tot}}=X_i\,P_{\mathrm{tot}}`}</M> mit dem <b>Molenbruch</b> <M p=".">{t`X_i\equiv\dfrac{n_i}{n_{\mathrm{tot}}}`}</M> Das ist der Anteil der Mole, der auf die Sorte <M>i</M> fällt.</li>
            </ul>}
            en={<ul>
              <li>A mixture of <M>i</M> ideal gases in the same container: the total pressure depends only on the total number of moles, <M p=".">{t`n_{\mathrm{tot}}=n_1+n_2+\dots+n_i`}</M></li>
              <li><M p=".">{t`P_{\mathrm{tot}}=n_{\mathrm{tot}}\dfrac{RT}{V}=n_1\dfrac{RT}{V}+n_2\dfrac{RT}{V}+\dots+n_i\dfrac{RT}{V}`}</M> (<M>T</M> and <M>V</M> are the same for all gases because they are in the same container.)</li>
              <li><b>Dalton’s law:</b> <M p=",">{t`P_{\mathrm{tot}}=P_1+P_2+\dots+P_i`}</M> <M>{t`P_i`}</M> is the <em>partial pressure</em> of species <M p=".">i</M> Handwritten: each ideal species behaves the same way and independently of the others. Only the number of gas molecules matters.</li>
              <li><M p=",">{t`P_i=\dfrac{n_i}{n_{\mathrm{tot}}}\,P_{\mathrm{tot}}=X_i\,P_{\mathrm{tot}}`}</M> with the <b>mole fraction</b> <M p=".">{t`X_i\equiv\dfrac{n_i}{n_{\mathrm{tot}}}`}</M> It is the fraction of the moles that belongs to species <M p=".">i</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> Die Teilchen verschiedener Gase im selben Kasten stören sich nicht (ideal heisst: keine Wechselwirkung). Jede Sorte prallt gegen die Wand, als wäre sie allein. Ihr Anteil am Druck ist der Druck, den <em>sie allein</em> im Kasten hätte: <M p=".">{t`P_i=n_iRT/V`}</M> Alle Anteile zusammen ergeben den Gesamtdruck.</p>
            <p>Der Molenbruch <M>{t`X_i`}</M> ist eine Zahl zwischen 0 und 1. Alle <M>{t`X_i`}</M> zusammen ergeben 1. Hat die Sorte ein Viertel aller Mole, liefert sie ein Viertel des Drucks. Das ist alles, was <M>{t`P_i=X_iP_{\mathrm{tot}}`}</M> sagt. Die Übung zeigt das als Bild: zwei Kästen (je eine Sorte) ergeben zusammen einen Kasten mit beiden.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> The particles of different gases in the same box do not disturb each other (ideal means: no interaction). Each species bounces off the wall as if it were alone. Its share of the pressure is the pressure it would have <em>on its own</em> in the box: <M p=".">{t`P_i=n_iRT/V`}</M> All shares together make the total pressure.</p>
            <p>The mole fraction <M>{t`X_i`}</M> is a number between 0 and 1. All <M>{t`X_i`}</M> together give 1. If a species has a quarter of all moles, it delivers a quarter of the pressure. That is all <M>{t`P_i=X_iP_{\mathrm{tot}}`}</M> says. The exercise class shows it as a picture: two boxes (one species each) together make one box with both.</p>
          </>}
        />
        <Derivation title={<T de="Daltons Gesetz in vier Schritten" en="Dalton’s law in four steps" />}>
          <StepPlayer
            label={tr('Animation: Teildrücke addieren sich zum Gesamtdruck', 'Animation: partial pressures add up to the total pressure')}
            steps={[
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Gas 1 allein im Kasten: <M>{t`n_1=5`}</M> Teilchen. Es erzeugt den Druck <M p=".">{t`P_1`}</M> (blauer Balken).</>}
                en={<>Gas 1 alone in the box: <M>{t`n_1=5`}</M> particles. It produces the pressure <M p=".">{t`P_1`}</M> (blue bar).</>} /> },
              { ms: 2500, holdMs: 2200, caption: <T
                de={<>Gas 2 allein im gleichen Kasten (gleiches <M>V</M> und <M p=")">T</M> <M>{t`n_2=3`}</M> Teilchen, Druck <M p=".">{t`P_2`}</M> Weniger Teilchen, kleinerer Balken.</>}
                en={<>Gas 2 alone in the same box (same <M>V</M> and <M p=")">T</M> <M>{t`n_2=3`}</M> particles, pressure <M p=".">{t`P_2`}</M> Fewer particles, a smaller bar.</>} /> },
              { ms: 3500, holdMs: 2200, caption: <T
                de={<>Beide Gase kommen in einen Kasten. Die Teilchen stören sich nicht, jedes prallt wie vorher an die Wand.</>}
                en={<>Both gases go into one box. The particles do not disturb each other; each one bounces off the wall as before.</>} /> },
              { ms: 2500, caption: <T
                de={<>Die Balken stapeln sich: <M p=".">{t`P_{\mathrm{tot}}=P_1+P_2`}</M> Weil <M>V</M> und <M>T</M> gleich sind, ist der Druck zur Teilchenzahl proportional.</>}
                en={<>The bars stack: <M p=".">{t`P_{\mathrm{tot}}=P_1+P_2`}</M> Because <M>V</M> and <M>T</M> are equal, the pressure is proportional to the number of particles.</>} /> },
            ]}
          >
            {(step, tt) => <ChemAnim build={daltonScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Jetzt zum Ausprobieren: Zwei Gase im Kasten, Helium (leicht, schnell) und Stickstoff (schwer, langsam). Die Figur misst die Partialdrücke wieder aus den Wandstössen jeder Sorte und stellt sie neben die Rechnung <M p=".">{t`P_i=n_iRT/V`}</M> Die Balken addieren sich zum Gesamtdruck, und die Anteile folgen den Molenbrüchen. Die Knöpfe <M>{t`(\mathrm i)`}</M> bis <M>{t`(\mathrm{iii})`}</M> sind die Proben der Übung 5.</p>}
          en={<p>Now try it out: two gases in the box, helium (light, fast) and nitrogen (heavy, slow). The figure again measures the partial pressures from the wall hits of each species and puts them next to the calculation <M p=".">{t`P_i=n_iRT/V`}</M> The bars add up to the total pressure, and the shares follow the mole fractions. The buttons <M>{t`(\mathrm i)`}</M> to <M>{t`(\mathrm{iii})`}</M> are the samples of exercise 5.</p>}
        />
        <MixBox />
        <Box kind="uebung" src={<Src ex={2} p="9" />} title={<T de="Übung 5: drei Proben mit Helium und Stickstoff" en="Exercise 5: three samples with helium and nitrogen" />}>
          <T
            de={<>
              <p>Drei Kästen gleichen Volumens enthalten <C>He</C> und <C>N2</C>: (i) fünf He-Atome und zwei <C>N2</C>-Moleküle, (ii) drei und eins, (iii) zwei und fünf. Alle haben dieselbe Temperatur. Ordne nach (a) Gesamtdruck, (b) Partialdruck von Helium, (c) Dichte, (d) mittlerer kinetischer Energie.</p>
              <p>Handschrift: Der Druck hängt von der Teilchenzahl ab, <M p=",">{t`P=nRT/V`}</M> die Dichte von der Masse, <M p=".">{t`\rho=m/V`}</M> Lösung: <b>(a)</b> <M p=".">{t`P_{\mathrm i}=P_{\mathrm{iii}}>P_{\mathrm{ii}}`}</M> (je 7, 7 und 4 Teilchen); <b>(b)</b> <M p=".">{t`P_{\mathrm{He,i}}>P_{\mathrm{He,ii}}>P_{\mathrm{He,iii}}`}</M> (5, 3 und 2 He-Atome); <b>(c)</b> <M>{t`M_{\mathrm{N_2}}>M_{\mathrm{He}}`}</M> also <M p=".">{t`\rho_{\mathrm{iii}}>\rho_{\mathrm i}>\rho_{\mathrm{ii}}`}</M> <b>(d)</b> Die Temperatur ist gleich, also ist die mittlere kinetische Energie in allen drei Proben gleich.</p>
            </>}
            en={<>
              <p>Three boxes of equal volume hold <C>He</C> and <C>N2</C>: (i) five He atoms and two <C>N2</C> molecules, (ii) three and one, (iii) two and five. All have the same temperature. Rank them by (a) total pressure, (b) partial pressure of helium, (c) density, (d) average kinetic energy.</p>
              <p>Handwritten: the pressure depends on the number of particles, <M p=",">{t`P=nRT/V`}</M> the density on the mass, <M p=".">{t`\rho=m/V`}</M> Solution: <b>(a)</b> <M p=".">{t`P_{\mathrm i}=P_{\mathrm{iii}}>P_{\mathrm{ii}}`}</M> (7, 7 and 4 particles); <b>(b)</b> <M p=".">{t`P_{\mathrm{He,i}}>P_{\mathrm{He,ii}}>P_{\mathrm{He,iii}}`}</M> (5, 3 and 2 He atoms); <b>(c)</b> <M>{t`M_{\mathrm{N_2}}>M_{\mathrm{He}}`}</M> so <M p=".">{t`\rho_{\mathrm{iii}}>\rho_{\mathrm i}>\rho_{\mathrm{ii}}`}</M> <b>(d)</b> the temperature is the same, so the average kinetic energy is the same in all three samples.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Die Zählung (5, 3, 2 He und 2, 1, 5 <C>N2</C>) stammt aus dem Bild der Übung; die Figur oben stellt genau diese Proben ein. In der Figur siehst du auch den Punkt (d): Die mittlere kinetische Energie ist bei beiden Gasen gleich, nur ist Helium wegen der kleineren Masse etwa <M>{t`2{,}6`}</M> mal schneller. Das ist das Thema der nächsten Lektion.</p>}
          en={<p>The count (5, 3, 2 He and 2, 1, 5 <C>N2</C>) comes from the picture in the exercise sheet; the figure above sets exactly these samples. In the figure you also see point (d): the average kinetic energy is the same for both gases, but helium is about <M>{t`2.6`}</M> times faster because of its smaller mass. That is the topic of the next lesson.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Ein schwereres Gas drückt stärker»" en="“A heavier gas presses harder”" />}>
        <T
          de={<p>Nein. Der Druck eines idealen Gases hängt nur von <M p=",">n</M> <M>T</M> und <M>V</M> ab, nicht von der Gasart. Die schweren Teilchen sind bei gleicher Temperatur langsamer; ihr schwererer Stoss wird genau durch das kleinere Tempo ausgeglichen. In Übung 5 hat Probe (i) mit viel Helium denselben Druck wie Probe (iii) mit viel Stickstoff, weil beide gleich viele Teilchen enthalten.</p>}
          en={<p>No. The pressure of an ideal gas depends only on <M p=",">n</M> <M>T</M> and <M p=",">V</M> not on the kind of gas. The heavy particles are slower at the same temperature; their heavier push is exactly balanced by the smaller speed. In exercise 5, sample (i) with lots of helium has the same pressure as sample (iii) with lots of nitrogen, because both contain the same number of particles.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Halbiert man das Volumen, verdoppelt sich der Druck – immer»" en="“Halve the volume and the pressure doubles – always”" />}>
        <T
          de={<p>Das gilt nur, wenn <M>n</M> und <M>T</M> gleich bleiben. Drückt man einen Kolben schnell zusammen, erwärmt sich das Gas, und der Druck steigt stärker. Und das Gesetz gilt nur für ein ideales Gas: bei sehr hohem Druck stimmt es nicht mehr (siehe die nächste Lektion über reale Gase).</p>}
          en={<p>That holds only if <M>n</M> and <M>T</M> stay the same. If you push a piston in quickly, the gas warms up and the pressure rises more. And the law holds only for an ideal gas: at very high pressure it no longer fits (see the next lesson on real gases).</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die Einheit spielt keine Rolle, wenn die Zahlen stimmen»" en="“The unit does not matter if the numbers are right”" />}>
        <T
          de={<p>Mit <M>{t`R=0{,}08206`}</M> musst du <M>P</M> in atm und <M>V</M> in L einsetzen; mit <M>{t`R=8{,}314`}</M> Pa und <M p=".">{t`\mathrm{m^3}`}</M> Wer kPa und L mit <M>{t`8{,}314`}</M> mischt, ist um einen Faktor 1000 daneben. Und <M>T</M> ist immer in Kelvin. Ein Tipp für die Prüfung: Schreib die Einheiten mit, dann zeigt sich der Fehler beim Kürzen.</p>}
          en={<p>With <M>{t`R=0.08206`}</M> you must insert <M>P</M> in atm and <M>V</M> in L; with <M>{t`R=8.314`}</M> Pa and <M p=".">{t`\mathrm{m^3}`}</M> If you mix kPa and L with <M>{t`8.314`}</M> you are off by a factor 1000. And <M>T</M> is always in kelvin. An exam tip: write the units down, then the mistake shows up when you cancel.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Der Luftdruck von 1 atm drückt nur von oben»" en="“The air pressure of 1 atm pushes only from above”" />}>
        <T
          de={<p>Der Druck eines Gases wirkt in <em>alle</em> Richtungen gleich, weil die Teilchen aus allen Richtungen kommen. Die Luftsäule erklärt, <em>wie gross</em> der Druck ist, nicht, in welche Richtung er zeigt. Darum drückt die Luft auch von der Seite und von unten gegen dich, und du spürst es nicht, weil dein Körper von innen mit gleichem Druck zurückdrückt.</p>}
          en={<p>The pressure of a gas acts equally in <em>all</em> directions because the particles come from all directions. The air column explains <em>how large</em> the pressure is, not in which direction it points. So the air also presses on you from the side and from below, and you do not feel it because your body pushes back from inside with the same pressure.</p>}
        />
      </Box>

      <Box kind="key">
        <T
          de={<ul>
            <li>Ein Gas wird durch <M p=",">P</M> <M p=",">V</M> <M>T</M> und <M>n</M> beschrieben. Druck entsteht durch Teilchen, die an die Wand prallen: <M p=".">{t`P=F/A`}</M></li>
            <li>Barometer: <M p=".">{t`P=\rho g h`}</M> Manometer: <M p=".">{t`P_{\mathrm{gas}}=P_{\mathrm{atm}}+\rho g h`}</M> <M p=".">{t`1\,\mathrm{atm}=760\,\mathrm{torr}=101{,}325\,\mathrm{kPa}`}</M></li>
            <li>Boyle <M p=",">{t`PV=\text{const.}`}</M> Charles <M p=",">{t`V/T=\text{const.}`}</M> Avogadro <M p=".">{t`V/n=\text{const.}`}</M> Zusammen: <M p=".">{t`PV=nRT`}</M> <M>T</M> immer in Kelvin; <M>R</M> passend zu den Einheiten.</li>
            <li>Typ 1: umstellen. Typ 2 und 3: <M>{t`PV/(nT)`}</M> vorher gleich nachher, Konstantes streichen. Molares Volumen bei STP: <M p=".">{t`22{,}41\,\mathrm L`}</M></li>
            <li>Dichte <M p=",">{t`\rho=PM_w/(RT)`}</M> Daltons Gesetz <M p=",">{t`P_{\mathrm{tot}}=\sum P_i`}</M> <M p=".">{t`P_i=X_iP_{\mathrm{tot}}`}</M></li>
          </ul>}
          en={<ul>
            <li>A gas is described by <M p=",">P</M> <M p=",">V</M> <M>T</M> and <M p=".">n</M> Pressure comes from particles hitting the wall: <M p=".">{t`P=F/A`}</M></li>
            <li>Barometer: <M p=".">{t`P=\rho g h`}</M> manometer: <M p=".">{t`P_{\mathrm{gas}}=P_{\mathrm{atm}}+\rho g h`}</M> <M p=".">{t`1\,\mathrm{atm}=760\,\mathrm{torr}=101.325\,\mathrm{kPa}`}</M></li>
            <li>Boyle <M p=",">{t`PV=\text{const.}`}</M> Charles <M p=",">{t`V/T=\text{const.}`}</M> Avogadro <M p=".">{t`V/n=\text{const.}`}</M> Together: <M p=".">{t`PV=nRT`}</M> <M>T</M> always in kelvin; <M>R</M> matching the units.</li>
            <li>Type 1: rearrange. Types 2 and 3: <M>{t`PV/(nT)`}</M> before equals after, strike out what is constant. Molar volume at STP: <M p=".">{t`22.41\,\mathrm L`}</M></li>
            <li>Density <M p=",">{t`\rho=PM_w/(RT)`}</M> Dalton’s law <M p=",">{t`P_{\mathrm{tot}}=\sum P_i`}</M> <M p=".">{t`P_i=X_iP_{\mathrm{tot}}`}</M></li>
          </ul>}
        />
        <MD>{t`PV=nRT`}</MD>
      </Box>
    </article>
  );
}
