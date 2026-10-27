import { Box, Section, Src } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { chemTex } from '../chem/tex';
import { T } from '../i18n';
import { CalorimeterFigure } from '../viz/chem/CalorimeterFigure';
import { HessFigure } from '../viz/chem/HessFigure';
import { MixFigure } from '../viz/chem/MixFigure';
import { PhaseEnthalpyFigure } from '../viz/chem/PhaseEnthalpyFigure';
import { PistonWorkAnim } from '../viz/chem/PistonWorkAnim';

const t = String.raw;
const cx = chemTex;

export default function CH4Enthalpie() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die meiste Chemie passiert offen an der Luft, bei konstantem Druck, und dabei dehnt sich ein Gas aus oder zieht sich zusammen. Dann steckt Energie auch in der Arbeit gegen die Luft. Die Enthalpie <M>H</M> ist die Grösse, die dieses Hin und Her gleich mit einrechnet. Ihre Änderung <M>{t`\Delta H`}</M> ist genau die Wärme, die man mit einem Becher und einem Thermometer messen kann.</p>}
        en={<p className="lede">Most chemistry happens in the open, at constant pressure, and then a gas expands or shrinks. Some of the energy then goes into work against the air. The enthalpy <M>H</M> is the quantity that takes this back and forth into account. Its change <M>{t`\Delta H`}</M> is exactly the heat you can measure with a cup and a thermometer.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Du heizt einen Topf Wasser auf dem Herd und stellst ein Thermometer hinein. Die Wärme, die aus dem Herd kommt, siehst du am Temperaturanstieg. Genau das nutzt die Kalorimetrie: Wärme sieht man nie direkt, man liest sie an der Temperatur eines bekannten Stoffes ab (meist Wasser). Mit der Enthalpie wird aus «Wärme bei konstantem Druck» eine Zustandsgrösse, für die man Tabellen anlegen und Rechenwege wählen darf.</p>}
          en={<p>You heat a pot of water on the stove and put in a thermometer. You see the heat that comes from the stove as a rise in temperature. This is exactly what calorimetry uses: heat is never seen directly, it is read off the temperature of a known substance (usually water). With enthalpy, «heat at constant pressure» becomes a state quantity, for which we may build tables and choose calculation routes.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="enthalpie" title={<T de={<>1. Enthalpie <M>H</M> und warum <M>{t`\Delta H = q_p`}</M> gilt</>} en={<>1. Enthalpy <M>H</M> and why <M>{t`\Delta H = q_p`}</M></>} />}>
        <Box kind="lecture" src={<Src lec={4} p="16–18" />} title={<T de={<>Enthalpie, Druck-Volumen-Arbeit, <M>{t`\Delta H = q_p`}</M></>} en={<>Enthalpy, pressure–volume work, <M>{t`\Delta H = q_p`}</M></>} />}>
          <T
            de={<>
              <p>Die <b>Enthalpie</b> ist definiert als <M p=",">{t`H \equiv E + PV`}</M> also innere Energie plus Druck mal Volumen. <M p=",">E</M> <M>P</M> und <M>V</M> sind Zustandsfunktionen, also ist auch <M>H</M> eine Zustandsfunktion. (Am Rand: «Warum das? Das sehen wir gleich.»)</p>
              <p>Ein Kolben mit Fläche <M>A</M> und einem Gas, das gegen konstanten Druck <M>P</M> drückt, bewegt sich um <M p=".">{t`\Delta x`}</M> Wie viel Arbeit wird geleistet? <M p=",">{t`w = -F\,\Delta x`}</M> <M p=",">{t`F = P\,A`}</M> also <M>{t`w = -P\,A\,\Delta x = -P\,\Delta V`}</M> – die <b>Druck-Volumen-Arbeit</b> (<i>pressure–volume work</i>). Am Rand: der expandierende Kolben leistet Arbeit an der Umgebung, also ist <M p=";">{t`w < 0`}</M> wird das Gas komprimiert, ist <M>{t`\Delta V < 0`}</M> und <M p=".">{t`w > 0`}</M></p>
              <p>Bei konstantem Druck gilt (Summen- und Produktregel):</p>
              <MD>{t`\Delta H = \Delta(E + PV) = \Delta E + P\,\Delta V + V\,\Delta P = \Delta E + P\,\Delta V`}</MD>
              <MD>{t`\Delta H = q_p + w + (-w) = q_p`}</MD>
              <p>Die beiden <M>w</M> heben sich auf, weil wir nur Druck-Volumen-Arbeit annehmen. <b>Die Enthalpieänderung ist gleich der Wärme <M>{t`q_p`}</M> bei konstantem Druck.</b> Weil Chemie meist bei konstantem <M>P</M> läuft und <M>{t`q_p`}</M> messbar ist (Kalorimetrie, unten), können wir <M>{t`\Delta H`}</M> für eine Reaktion bestimmen. <M p=":">{t`\Delta H > 0`}</M> das System hat Wärme aufgenommen (endotherm); <M p=":">{t`\Delta H < 0`}</M> es hat Wärme abgegeben (exotherm).</p>
              <p>«Wait! Contradiction?» <M>{t`\Delta H = q_p`}</M> ist eine Zustandsfunktion, aber <M>q</M> ist keine. Kein Widerspruch: <M>{t`q_p`}</M> ist die Wärme bei <em>konstantem Druck</em>, und wir haben nur Druck-Volumen-Arbeit angenommen. Es sind spezielle Bedingungen. Entsprechend gilt bei festem Volumen: <M>{t`\Delta E = q + w = q - P\,\Delta V = q - P\cdot 0 = q_v`}</M> (Wärme bei konstantem Volumen). Der Unterschied ist <M p=";">{t`\Delta H - \Delta E = P\,\Delta V`}</M> ist <M>{t`\Delta V`}</M> klein, ist <M>{t`\Delta H \approx \Delta E`}</M> (Rand: viele Reaktionen haben eine vernachlässigbare Volumenänderung).</p>
            </>}
            en={<>
              <p><b>Enthalpy</b> is defined as <M p=",">{t`H \equiv E + PV`}</M> that is internal energy plus pressure times volume. <M p=",">E</M> <M>P</M> and <M>V</M> are state functions, so <M>H</M> is a state function too. (In the margin: «Why this? We will see.»)</p>
              <p>A piston of area <M>A</M> with a gas pushing against constant pressure <M>P</M> moves by <M p=".">{t`\Delta x`}</M> How much work is done? <M p=",">{t`w = -F\,\Delta x`}</M> <M p=",">{t`F = P\,A`}</M> so <M>{t`w = -P\,A\,\Delta x = -P\,\Delta V`}</M> – the <b>pressure–volume work</b>. In the margin: the expanding gas does work on the surroundings, so <M p=";">{t`w < 0`}</M> if the gas is compressed, <M>{t`\Delta V < 0`}</M> and <M p=".">{t`w > 0`}</M></p>
              <p>At constant pressure (sum and product rule):</p>
              <MD>{t`\Delta H = \Delta(E + PV) = \Delta E + P\,\Delta V + V\,\Delta P = \Delta E + P\,\Delta V`}</MD>
              <MD>{t`\Delta H = q_p + w + (-w) = q_p`}</MD>
              <p>The two <M>w</M> cancel because we assume only pressure–volume work. <b>The change in enthalpy equals the heat <M>{t`q_p`}</M> at constant pressure.</b> Because chemistry usually runs at constant <M>P</M> and <M>{t`q_p`}</M> can be measured (calorimetry, below), we can determine <M>{t`\Delta H`}</M> for a reaction. <M p=":">{t`\Delta H > 0`}</M> the system has gained heat (endothermic); <M p=":">{t`\Delta H < 0`}</M> it has lost heat (exothermic).</p>
              <p>«Wait! Contradiction?» <M>{t`\Delta H = q_p`}</M> is a state function but <M>q</M> is not. No contradiction: <M>{t`q_p`}</M> is the heat change at <em>constant pressure</em>, and we assumed only pressure–volume work. These are specific conditions. Similarly, at fixed volume: <M>{t`\Delta E = q + w = q - P\,\Delta V = q - P\cdot 0 = q_v`}</M> (heat at constant volume). The difference is <M p=";">{t`\Delta H - \Delta E = P\,\Delta V`}</M> if <M>{t`\Delta V`}</M> is small, <M>{t`\Delta H \approx \Delta E`}</M> (margin: many reactions have a negligible volume change).</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Ein Gas schiebt den Kolben nach oben. Es muss gegen den Druck der Luft arbeiten und gibt dabei Energie ab: <M p=".">{t`w < 0`}</M></li>
              <li>Wie gross ist <M p="?">w</M> Kraft mal Weg. Die Kraft ist Druck mal Fläche, der Weg ist <M p=".">{t`\Delta x`}</M> Fläche mal Weg ist ein Volumen, darum <M p=".">{t`w = -P\,\Delta V`}</M></li>
              <li>Die Energiebuchführung: <M p=".">{t`\Delta E = q_p + w`}</M> Nun kommt der Trick der Definition <M p=":">{t`H = E + PV`}</M> Bei konstantem <M>P</M> addiert <M>{t`P\,\Delta V`}</M> genau die Arbeit wieder, die vorher abgezogen wurde. Übrig bleibt nur die Wärme.</li>
            </ol>
            <p>Genau das zeigt die Animation. Die Zahlen darin (<M>{t`+10`}</M> und <M p=")">{t`-4`}</M> sind ein Beispiel; sie stehen nicht auf der Folie.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>A gas pushes the piston up. It has to work against the pressure of the air and gives away energy: <M p=".">{t`w < 0`}</M></li>
              <li>How big is <M p="?">w</M> Force times distance. The force is pressure times area, the distance is <M p=".">{t`\Delta x`}</M> Area times distance is a volume, so <M p=".">{t`w = -P\,\Delta V`}</M></li>
              <li>The energy bookkeeping: <M p=".">{t`\Delta E = q_p + w`}</M> Now comes the trick of the definition <M p=":">{t`H = E + PV`}</M> at constant <M p=",">P</M> <M>{t`P\,\Delta V`}</M> adds back exactly the work that was subtracted before. Only the heat remains.</li>
            </ol>
            <p>That is exactly what the animation shows. The numbers in it (<M>{t`+10`}</M> and <M p=")">{t`-4`}</M> are an example; they are not on the slide.</p>
          </>}
        />
        <PistonWorkAnim />
        <Box kind="supplement" title={<T de="Wie gross ist das in Zahlen?" en="How big is that in numbers?" />}>
          <T
            de={<p>Ein Gas dehnt sich bei <M>{t`P = 1{,}00\,\mathrm{atm}`}</M> um <M>{t`\Delta V = 2{,}0\,\mathrm{L}`}</M> aus. Dann ist <M p=".">{t`w = -P\,\Delta V = -2{,}0\,\mathrm{L\,atm}`}</M> Mit <M>{t`1\,\mathrm{L\,atm} = 101{,}325\,\mathrm{J}`}</M> sind das <M p=".">{t`w = -203\,\mathrm{J}`}</M> Bei einer Reaktion, die mehrere Hundert Kilojoule umsetzt, ist das fast nichts: darum ist oft <M p=".">{t`\Delta H \approx \Delta E`}</M> Nur wenn sich die Zahl der Gasteilchen stark ändert, zählt der Unterschied (bei Raumtemperatur etwa <M>{t`2{,}5\,\mathrm{kJ}`}</M> pro Mol Gas, das entsteht oder verschwindet).</p>}
            en={<p>A gas expands by <M>{t`\Delta V = 2.0\,\mathrm{L}`}</M> at <M p=".">{t`P = 1.00\,\mathrm{atm}`}</M> Then <M p=".">{t`w = -P\,\Delta V = -2.0\,\mathrm{L\,atm}`}</M> With <M>{t`1\,\mathrm{L\,atm} = 101.325\,\mathrm{J}`}</M> that is <M p=".">{t`w = -203\,\mathrm{J}`}</M> For a reaction that converts several hundred kilojoules this is almost nothing: that is why often <M p=".">{t`\Delta H \approx \Delta E`}</M> Only when the number of gas particles changes strongly does the difference count (at room temperature about <M>{t`2.5\,\mathrm{kJ}`}</M> per mole of gas that is formed or disappears).</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="reaktionsenthalpie" title={<T de="2. Reaktionsenthalpie und Enthalpiediagramm" en="2. Enthalpy of reaction and the enthalpy diagram" />}>
        <Box kind="lecture" src={<Src lec={4} p="19" />} title={<T de="Reaktionsenthalpien" en="Enthalpies of reaction" />}>
          <T
            de={<>
              <MD>{t`\Delta H = H_\mathrm{final} - H_\mathrm{initial} = H_\mathrm{products} - H_\mathrm{reactants} \equiv \Delta H_\mathrm{rxn}`}</MD>
              <p>Auch «Reaktionswärme». Beispiel im Enthalpiediagramm: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(g)'}</C></span> mit <M p=".">{t`\Delta H_\mathrm{rxn} = -483{,}6\,\mathrm{kJ\,mol^{-1}}`}</M> Achtung: Das Endprodukt ist hier gasförmiges Wasser (auf Folie 13 war es flüssig). Man muss also Zustand und Bedingungen angeben; ohne Angabe gilt Normbedingung (STP).</p>
              <p><b>Regeln für thermochemische Gleichungen:</b> Die Enthalpie ist eine extensive Grösse (doppelt so viel Stoff, doppelt so viel <M p=");">{t`\Delta H`}</M> <M p=";">{t`\Delta H_\mathrm{forward} = -\Delta H_\mathrm{reverse}`}</M> und <M>{t`\Delta H_\mathrm{rxn}`}</M> hängt vom Zustand <M>{t`(\mathrm{s}, \ell, \mathrm{g})`}</M> der Ausgangsstoffe und Produkte ab.</p>
            </>}
            en={<>
              <MD>{t`\Delta H = H_\mathrm{final} - H_\mathrm{initial} = H_\mathrm{products} - H_\mathrm{reactants} \equiv \Delta H_\mathrm{rxn}`}</MD>
              <p>Also called «heat of reaction». Example in an enthalpy diagram: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(g)'}</C></span> with <M p=".">{t`\Delta H_\mathrm{rxn} = -483.6\,\mathrm{kJ\,mol^{-1}}`}</M> Note: the final state of water here is gas (on slide 13 it was liquid). So one has to specify state and conditions; without further information standard conditions (STP) apply.</p>
              <p><b>Rules for thermochemical equations:</b> enthalpy is an extensive property (twice the substance, twice <M p=");">{t`\Delta H`}</M> <M p=";">{t`\Delta H_\mathrm{forward} = -\Delta H_\mathrm{reverse}`}</M> and <M>{t`\Delta H_\mathrm{rxn}`}</M> depends on the state <M>{t`(\mathrm{s}, \ell, \mathrm{g})`}</M> of reactants and products.</p>
            </>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> <M>{t`\mathrm{mol^{-1}}`}</M> steht hier für «pro Reaktion, so wie sie hingeschrieben ist»: <M>{t`-483{,}6\,\mathrm{kJ}`}</M> gelten für 2 Mol <C>H2</C> und 1 Mol <C>O2</C>. Schreibst du die Gleichung für 1 Mol <C>H2</C> hin, halbiert sich die Zahl. Im Diagramm zeigt jeder Pfeil nach unten eine exotherme Reaktion (die Enthalpie sinkt), jeder nach oben eine endotherme. Die ganze Hess-Geschichte unten ist nur ein Spiel mit solchen Pfeilen.</p>}
          en={<p><b>How to read this:</b> <M>{t`\mathrm{mol^{-1}}`}</M> here means «per reaction as it is written»: <M>{t`-483.6\,\mathrm{kJ}`}</M> holds for 2 mol <C>H2</C> and 1 mol <C>O2</C>. If you write the equation for 1 mol <C>H2</C>, the number is halved. In the diagram every arrow pointing down is an exothermic reaction (the enthalpy falls), every arrow pointing up is endothermic. The whole Hess story below is just a game with such arrows.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="kalorimetrie" title={<T de="3. Kalorimetrie: Wärme an der Temperatur ablesen" en="3. Calorimetry: reading heat off a temperature" />}>
        <Box kind="lecture" src={<Src lec={4} p="20–22" />} title={<T de="Kalorimetrie" en="Calorimetry" />}>
          <T
            de={<>
              <p>Kalorimetrie misst <M p=":">{t`\Delta H`}</M> Wärmeflüsse ändern die Temperatur eines Stoffes. <b>Wärmekapazität</b> (<i>heat capacity</i>) = Wärme, die für <M>{t`\Delta T = 1\,\mathrm{K}`}</M> nötig ist.</p>
              <ul>
                <li>Molare Wärmekapazität <M>{t`C_\mathrm{m}`}</M> in <M p=":">{t`\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> <M p=".">{t`q = n\cdot C_\mathrm{m}\cdot\Delta T`}</M></li>
                <li>Spezifische Wärmekapazität <M>{t`C_\mathrm{s}`}</M> in <M p=":">{t`\mathrm{J\,g^{-1}\,K^{-1}}`}</M> <M p=".">{t`q = m\cdot C_\mathrm{s}\cdot\Delta T`}</M></li>
              </ul>
              <p>Vorzeichencheck: <M>{t`\Delta T > 0`}</M> heisst <M p=",">{t`T_\mathrm{final} > T_\mathrm{initial}`}</M> also <M>{t`q > 0`}</M> (Wärme vom Stoff aufgenommen). Beispiel <C>H2O</C>: <M>{t`C_\mathrm{s} = 4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}}`}</M> bei <M p=".">{t`14{,}5\,^\circ\mathrm{C}`}</M> Die Werte schwanken leicht mit der Temperatur. Wasser ist ein ungewöhnliches Molekül mit grossem <M>{t`C_\mathrm{s}`}</M> (Rand: «Stell dir den Klimawandel ohne Ozeane vor, die die Wirkung mildern!»). Ein Kelvin ist gleich ein Grad Celsius, wenn es um <em>Differenzen</em> geht.</p>
              <p><b>Konstanter Druck</b> (Folie 21, «Kaffeetassen-Kalorimeter»): System (Reaktanden) und Umgebung (<C>H2O</C>) liegen zusammen in einem isolierten Kalorimeter. Wegen <M>{t`\Delta H_\mathrm{rxn} = q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M> gilt: exotherm (<M p=")">{t`q_\mathrm{rxn} < 0`}</M> wärmt sich das Wasser auf (<M p=");">{t`q_{${cx('H2O')}} > 0`}</M> endotherm (<M p=")">{t`q_\mathrm{rxn} > 0`}</M> wird es kälter (<M p=").">{t`q_{${cx('H2O')}} < 0`}</M></p>
              <p><b>Konstantes Volumen</b> (Folie 22): Man kann das Gefäss auch verschliessen, eine «Bombe»; ein Funke zündet die Reaktanden. Dann ist <M p=".">{t`\Delta E_\mathrm{rxn} = q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M></p>
            </>}
            en={<>
              <p>Calorimetry measures <M p=":">{t`\Delta H`}</M> heat flows change the temperature of a substance. <b>Heat capacity</b> = heat required for <M p=".">{t`\Delta T = 1\,\mathrm{K}`}</M></p>
              <ul>
                <li>Molar heat capacity <M>{t`C_\mathrm{m}`}</M> in <M p=":">{t`\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> <M p=".">{t`q = n\cdot C_\mathrm{m}\cdot\Delta T`}</M></li>
                <li>Specific heat capacity <M>{t`C_\mathrm{s}`}</M> in <M p=":">{t`\mathrm{J\,g^{-1}\,K^{-1}}`}</M> <M p=".">{t`q = m\cdot C_\mathrm{s}\cdot\Delta T`}</M></li>
              </ul>
              <p>Sign check: <M>{t`\Delta T > 0`}</M> means <M p=",">{t`T_\mathrm{final} > T_\mathrm{initial}`}</M> so <M>{t`q > 0`}</M> (heat absorbed by the substance). Example <C>H2O</C>: <M>{t`C_\mathrm{s} = 4.18\,\mathrm{J\,g^{-1}\,K^{-1}}`}</M> at <M p=".">{t`14.5\,^\circ\mathrm{C}`}</M> Values vary slightly with temperature. Water is an unusual molecule with a large <M>{t`C_\mathrm{s}`}</M> (margin: «Imagine climate change without oceans to moderate the effects!»). One kelvin equals one degree Celsius when it comes to <em>differences</em>.</p>
              <p><b>Constant pressure</b> (slide 21, «coffee-cup calorimeter»): system (reactants) and surroundings (<C>H2O</C>) are combined in an insulated calorimeter. Because <M p=":">{t`\Delta H_\mathrm{rxn} = q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M> if exothermic (<M p=")">{t`q_\mathrm{rxn} < 0`}</M> the water warms up (<M p=");">{t`q_{${cx('H2O')}} > 0`}</M> if endothermic (<M p=")">{t`q_\mathrm{rxn} > 0`}</M> it is cooled (<M p=").">{t`q_{${cx('H2O')}} < 0`}</M></p>
              <p><b>Constant volume</b> (slide 22): one can also seal the vessel, a «bomb»; a spark ignites the reactants. Then <M p=".">{t`\Delta E_\mathrm{rxn} = q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Heizt du <M>m</M> Gramm Wasser um <M p=",">{t`\Delta T`}</M> brauchst du <M p=".">{t`q = m\,C_\mathrm{s}\,\Delta T`}</M> Mit <M>{t`C_\mathrm{s}`}</M> kannst du das als «Preis pro Gramm und Kelvin» lesen: 4,18 Joule.</li>
              <li>Im Becher steckt die Reaktion <em>im</em> Wasser. Was die Reaktion abgibt, nimmt das Wasser auf, und umgekehrt: <M p=".">{t`q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M></li>
              <li>Also rückwärts: aus der gemessenen Temperaturänderung folgt <M p=",">{t`q_{${cx('H2O')}}`}</M> daraus <M p=",">{t`q_\mathrm{rxn}`}</M> und im Becher ist das <M p=".">{t`\Delta H_\mathrm{rxn}`}</M></li>
            </ol>
            <p>Probiere es aus: Der Regler <M>{t`q_\mathrm{rxn}`}</M> bestimmt, wie viel Wärme die Reaktion liefert (negativ) oder braucht (positiv). Die Zahlen sind unsere Wahl, nicht aus den Folien. Der Wechsel zur Bombe ändert nur die Bezeichnung: dort liest man <M>{t`\Delta E`}</M> statt <M p=".">{t`\Delta H`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>If you heat <M>m</M> grams of water by <M p=",">{t`\Delta T`}</M> you need <M p=".">{t`q = m\,C_\mathrm{s}\,\Delta T`}</M> You can read <M>{t`C_\mathrm{s}`}</M> as a «price per gram and kelvin»: 4.18 joules.</li>
              <li>In the cup the reaction takes place <em>in</em> the water. What the reaction gives off, the water takes up, and vice versa: <M p=".">{t`q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M></li>
              <li>So backwards: from the measured temperature change you get <M p=",">{t`q_{${cx('H2O')}}`}</M> from that <M p=",">{t`q_\mathrm{rxn}`}</M> and in the cup that is <M p=".">{t`\Delta H_\mathrm{rxn}`}</M></li>
            </ol>
            <p>Try it: the slider <M>{t`q_\mathrm{rxn}`}</M> sets how much heat the reaction delivers (negative) or needs (positive). The numbers are our choice, not from the slides. Switching to the bomb only changes the name: there you read <M>{t`\Delta E`}</M> instead of <M p=".">{t`\Delta H`}</M></p>
          </>}
        />
        <CalorimeterFigure />
        <Box kind="uebung" src={<Src ex={4} p="10" />} title={<T de="Aufgabe 6 mit Lösung: Kaffee und Löffel" en="Exercise 6 with solution: coffee and spoon" />}>
          <T
            de={<>
              <p>Wie stark sinkt die Temperatur einer Tasse (180 g) Kaffee von <M>{t`95\,^\circ\mathrm{C}`}</M> (spezifische Wärme wie Wasser, <M p="),">{t`4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}}`}</M> wenn ein 45-g-Silberlöffel (<M p=")">{t`0{,}24\,\mathrm{J\,g^{-1}\,K^{-1}}`}</M> von <M>{t`25\,^\circ\mathrm{C}`}</M> hineingelegt wird und beide dieselbe Temperatur erreichen?</p>
              <p>Ansatz der Lösung: Die Wärme, die der Kaffee abgibt, nimmt der Löffel auf: <M p=".">{t`q_\mathrm{c} = q_\mathrm{s}`}</M></p>
              <MD>{t`180\,\mathrm{g}\cdot(95\,^\circ\mathrm{C} - T_\mathrm{eq})\cdot 4{,}18 = 45\,\mathrm{g}\cdot(T_\mathrm{eq} - 25\,^\circ\mathrm{C})\cdot 0{,}24`}</MD>
              <p>Auf dem Blatt steht als Ergebnis <M p=".">{t`T_\mathrm{eq} = 89\,^\circ\mathrm{C}`}</M> Rechnet man die Gleichung aus, kommt <M>{t`T_\mathrm{eq} = 94{,}0\,^\circ\mathrm{C}`}</M> heraus (CH-002): <M>{t`752{,}4\,(95 - T) = 10{,}8\,(T - 25)`}</M> gibt <M p=".">{t`T = 71\,748/763{,}2`}</M> Der Kaffee kühlt nur um etwa <M>{t`1\,\mathrm{K}`}</M> ab, weil der Löffel so wenig Wärme speichern kann.</p>
            </>}
            en={<>
              <p>How much will the temperature of a cup (180 g) of coffee at <M>{t`95\,^\circ\mathrm{C}`}</M> (same specific heat as water, <M p=")">{t`4.18\,\mathrm{J\,g^{-1}\,K^{-1}}`}</M> fall when a 45 g silver spoon (<M p=")">{t`0.24\,\mathrm{J\,g^{-1}\,K^{-1}}`}</M> at <M>{t`25\,^\circ\mathrm{C}`}</M> is put in and the two reach the same temperature?</p>
              <p>Set-up of the solution: the heat the coffee gives off is taken up by the spoon: <M p=".">{t`q_\mathrm{c} = q_\mathrm{s}`}</M></p>
              <MD>{t`180\,\mathrm{g}\cdot(95\,^\circ\mathrm{C} - T_\mathrm{eq})\cdot 4.18 = 45\,\mathrm{g}\cdot(T_\mathrm{eq} - 25\,^\circ\mathrm{C})\cdot 0.24`}</MD>
              <p>The sheet gives the result <M p=".">{t`T_\mathrm{eq} = 89\,^\circ\mathrm{C}`}</M> Working out the equation gives <M>{t`T_\mathrm{eq} = 94.0\,^\circ\mathrm{C}`}</M> (CH-002): <M>{t`752.4\,(95 - T) = 10.8\,(T - 25)`}</M> gives <M p=".">{t`T = 71\,748/763.2`}</M> The coffee cools by only about <M>{t`1\,\mathrm{K}`}</M> because the spoon can store so little heat.</p>
            </>}
          />
        </Box>
        <MixFigure />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="hess" title={<T de="4. Der Satz von Hess und die Bildungsenthalpien" en="4. Hess’s law and enthalpies of formation" />}>
        <Box kind="lecture" src={<Src lec={4} p="23–25" />} title={<T de="Satz von Hess" en="Hess’s law" />}>
          <T
            de={<>
              <p>Reaktionsenthalpien vieler Reaktionen sind tabelliert; wir nutzen, dass <M>H</M> eine Zustandsfunktion ist. Lässt sich eine Reaktion in Schritte mit <M>{t`\Delta H_1, \Delta H_2, \Delta H_3, \dots`}</M> zerlegen, ist die Reaktionsenthalpie die Summe aller Schritte:</p>
              <MD>{t`\Delta H_\mathrm{rxn} = \Delta H_1 + \Delta H_2 + \Delta H_3 + \cdots`}</MD>
              <p>Beispiel: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(l)'}</C></span>, <M p=".">{t`\Delta H_\mathrm{rxn} = ?`}</M> Aus der Tabelle:</p>
              <CD>{'2 H2(g) + O2(g) -> 2 H2O(g)'}</CD>
              <MD>{t`\Delta H_1 = -483{,}6\,\mathrm{kJ\,mol^{-1}}`}</MD>
              <CD>{'2 H2O(g) -> 2 H2O(l)'}</CD>
              <MD>{t`\Delta H_2 = -88\,\mathrm{kJ\,mol^{-1}}`}</MD>
              <p>Die zweite Reaktion ist die Kondensation von Wasserdampf. Addiert man beide, kürzt sich <C>{'2 H2O(g)'}</C> auf beiden Seiten weg: <M p=".">{t`\Delta H_\mathrm{rxn} = -572\,\mathrm{kJ\,mol^{-1}}`}</M> Im Enthalpiediagramm führen die Pfeile von <M>{t`-483{,}6`}</M> und <M>{t`-88`}</M> nacheinander zum selben Ziel wie der lange Pfeil <M p=".">{t`-572`}</M></p>
            </>}
            en={<>
              <p>Enthalpies of reaction for many reactions have been tabulated; we use that <M>H</M> is a state function. If a reaction can be written in steps <M p=",">{t`\Delta H_1, \Delta H_2, \Delta H_3, \dots`}</M> the enthalpy change of the reaction is the sum of all steps:</p>
              <MD>{t`\Delta H_\mathrm{rxn} = \Delta H_1 + \Delta H_2 + \Delta H_3 + \cdots`}</MD>
              <p>Example: <span className="th-rx"><C>{'2 H2(g) + O2(g) -> 2 H2O(l)'}</C></span>, <M p=".">{t`\Delta H_\mathrm{rxn} = ?`}</M> From the table:</p>
              <CD>{'2 H2(g) + O2(g) -> 2 H2O(g)'}</CD>
              <MD>{t`\Delta H_1 = -483.6\,\mathrm{kJ\,mol^{-1}}`}</MD>
              <CD>{'2 H2O(g) -> 2 H2O(l)'}</CD>
              <MD>{t`\Delta H_2 = -88\,\mathrm{kJ\,mol^{-1}}`}</MD>
              <p>The second reaction is the condensation of water vapour. Adding both, <C>{'2 H2O(g)'}</C> cancels on both sides: <M p=".">{t`\Delta H_\mathrm{rxn} = -572\,\mathrm{kJ\,mol^{-1}}`}</M> In the enthalpy diagram the arrows of <M>{t`-483.6`}</M> and <M>{t`-88`}</M> lead one after the other to the same goal as the long arrow <M p=".">{t`-572`}</M></p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={4} p="26–29" />} title={<T de="Bildungsenthalpien und die allgemeine Formel" en="Enthalpies of formation and the general formula" />}>
          <T
            de={<>
              <p><b>Standard-Bildungsenthalpie</b> <M p=":">{t`\Delta H^\circ_\mathrm{f}`}</M> die Enthalpie, die nötig ist, um 1 Mol einer Substanz aus den Elementen (im Standardzustand) bei STP zu bilden; dann ist <M p=".">{t`\Delta H_\mathrm{rxn} = \Delta H^\circ_\mathrm{f}`}</M> (Rand: das hochgestellte «°» bedeutet Standard, also <M>{t`25\,^\circ\mathrm{C}`}</M> und <M p=".)">{t`1\,\mathrm{atm}`}</M> Beispiel Propan: <span className="th-rx"><C>{'3 C(graphite) + 4 H2(g) -> C3H8(g)'}</C></span> mit <M p=".">{t`\Delta H^\circ_\mathrm{f} = -103{,}9\,\mathrm{kJ\,mol^{-1}}`}</M> <b>Alle Elemente in ihrer stabilsten Form bei STP haben <M>{t`\Delta H^\circ_\mathrm{f} = 0`}</M></b>.</p>
              <p><b>Verbrennung von Propan</b> (<M p="):">{t`\Delta H^\circ_\mathrm{rxn} = ?`}</M> <span className="th-rx"><C>{'C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)'}</C></span>. Schritt 1, die Ausgangsstoffe «ent-bilden»: <span className="th-rx"><C>{'C3H8(g) -> 3 C(graphite) + 4 H2(g)'}</C></span> kostet <M p=".">{t`-\Delta H^\circ_\mathrm{f}[${cx('C3H8')}] = -(-104)\,\mathrm{kJ\,mol^{-1}}`}</M> Schritt 2, die Produkte bilden: <span className="th-rx"><C>{'C(graphite) + O2(g) -> CO2(g)'}</C></span> mit <M>{t`-394`}</M> und <span className="th-rx"><C>{'H2(g) + 1/2 O2(g) -> H2O(l)'}</C></span> mit <M p=".">{t`-286`}</M> Mit den Koeffizienten der Reaktion multipliziert:</p>
              <MD>{t`\Delta H^\circ_\mathrm{rxn} = -\Delta H^\circ_\mathrm{f}[${cx('C3H8')}] + 3\,\Delta H^\circ_\mathrm{f}[${cx('CO2')}] + 4\,\Delta H^\circ_\mathrm{f}[${cx('H2O')}(\ell)] = -2220\,\mathrm{kJ\,mol^{-1}}`}</MD>
              <p>(Rand: <M p=",">{t`\Delta H^\circ_\mathrm{f}[${cx('O2')}] = 0`}</M> weil <C>O2(g)</C> bei STP in seiner stabilsten Elementform vorliegt.) Das Enthalpiediagramm auf Folie 28 zeigt dasselbe: Schritt ① Zerlegen in die Elemente, <M p=";">{t`\Delta H_1 = +103{,}85\,\mathrm{kJ}`}</M> ② Bildung von 3 <C>CO2</C>, <M p=";">{t`\Delta H_2 = -1181\,\mathrm{kJ}`}</M> ③ Bildung von 4 <C>H2O</C>, <M p=";">{t`\Delta H_3 = -1143\,\mathrm{kJ}`}</M> und der rote Pfeil <M p=".">{t`\Delta H^\circ_\mathrm{rxn} = -2220\,\mathrm{kJ}`}</M></p>
              <p><b>Allgemein</b> (Folie 29): für <M>{t`a_1 R_1 + a_2 R_2 + \cdots \to b_1 P_1 + b_2 P_2 + \cdots`}</M> mit den stöchiometrischen Koeffizienten <M>{t`a_i, b_j`}</M> gilt</p>
              <MD>{t`\Delta H^\circ_\mathrm{rxn} = \sum_{\text{Produkte } j} b_j\,\Delta H^\circ_{\mathrm{f},j} - \sum_{\text{Edukte } i} a_i\,\Delta H^\circ_{\mathrm{f},i}`}</MD>
              <p>«Mit diesem Vorgehen bestimmen wir <M>{t`\Delta H^\circ_\mathrm{rxn}`}</M> für jede Reaktion.»</p>
            </>}
            en={<>
              <p><b>Standard enthalpy of formation</b> <M p=":">{t`\Delta H^\circ_\mathrm{f}`}</M> the enthalpy required to create 1 mol of a substance from the elements (in their standard state) at STP; then <M p=".">{t`\Delta H_\mathrm{rxn} = \Delta H^\circ_\mathrm{f}`}</M> (Margin: the superscript «°» denotes standard, i.e. <M>{t`25\,^\circ\mathrm{C}`}</M> and <M p=".)">{t`1\,\mathrm{atm}`}</M> Example propane: <span className="th-rx"><C>{'3 C(graphite) + 4 H2(g) -> C3H8(g)'}</C></span> with <M p=".">{t`\Delta H^\circ_\mathrm{f} = -103.9\,\mathrm{kJ\,mol^{-1}}`}</M> <b>All elements in their most stable form at STP have <M>{t`\Delta H^\circ_\mathrm{f} = 0`}</M></b>.</p>
              <p><b>Combustion of propane</b> (<M p="):">{t`\Delta H^\circ_\mathrm{rxn} = ?`}</M> <span className="th-rx"><C>{'C3H8(g) + 5 O2(g) -> 3 CO2(g) + 4 H2O(l)'}</C></span>. Step 1, «unform» the reactants: <span className="th-rx"><C>{'C3H8(g) -> 3 C(graphite) + 4 H2(g)'}</C></span> costs <M p=".">{t`-\Delta H^\circ_\mathrm{f}[${cx('C3H8')}] = -(-104)\,\mathrm{kJ\,mol^{-1}}`}</M> Step 2, form the products: <span className="th-rx"><C>{'C(graphite) + O2(g) -> CO2(g)'}</C></span> with <M>{t`-394`}</M> and <span className="th-rx"><C>{'H2(g) + 1/2 O2(g) -> H2O(l)'}</C></span> with <M p=".">{t`-286`}</M> Multiplied by the coefficients of the reaction:</p>
              <MD>{t`\Delta H^\circ_\mathrm{rxn} = -\Delta H^\circ_\mathrm{f}[${cx('C3H8')}] + 3\,\Delta H^\circ_\mathrm{f}[${cx('CO2')}] + 4\,\Delta H^\circ_\mathrm{f}[${cx('H2O')}(\ell)] = -2220\,\mathrm{kJ\,mol^{-1}}`}</MD>
              <p>(Margin: <M>{t`\Delta H^\circ_\mathrm{f}[${cx('O2')}] = 0`}</M> because <C>O2(g)</C> is in its most stable elemental form at STP.) The enthalpy diagram on slide 28 shows the same: step ① decomposition into the elements, <M p=";">{t`\Delta H_1 = +103.85\,\mathrm{kJ}`}</M> ② formation of 3 <C>CO2</C>, <M p=";">{t`\Delta H_2 = -1181\,\mathrm{kJ}`}</M> ③ formation of 4 <C>H2O</C>, <M p=";">{t`\Delta H_3 = -1143\,\mathrm{kJ}`}</M> and the red arrow <M p=".">{t`\Delta H^\circ_\mathrm{rxn} = -2220\,\mathrm{kJ}`}</M></p>
              <p><b>In general</b> (slide 29): for <M>{t`a_1 R_1 + a_2 R_2 + \cdots \to b_1 P_1 + b_2 P_2 + \cdots`}</M> with the stoichiometric coefficients <M>{t`a_i, b_j`}</M> we have</p>
              <MD>{t`\Delta H^\circ_\mathrm{rxn} = \sum_{\text{products } j} b_j\,\Delta H^\circ_{\mathrm{f},j} - \sum_{\text{reactants } i} a_i\,\Delta H^\circ_{\mathrm{f},i}`}</MD>
              <p>«We can use this approach to determine <M>{t`\Delta H^\circ_\mathrm{rxn}`}</M> for any reaction.»</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Summenformel:</b></p>
            <ol className="keep">
              <li>Jede Substanz hat ihre «Meereshöhe» <M p=",">{t`\Delta H^\circ_\mathrm{f}`}</M> gemessen von den Elementen aus. Die Elemente selbst liegen auf Höhe 0.</li>
              <li>Eine Reaktion führt von den Ausgangsstoffen zu den Produkten. Du kannst sie dir als Umweg über die Elemente vorstellen: erst alle Ausgangsstoffe zu den Elementen «zerlegen», dann die Produkte aufbauen.</li>
              <li>Das Zerlegen kostet das Negative der Bildungsenthalpie, also das Minus vor der zweiten Summe. Das Aufbauen kostet die Bildungsenthalpie, also das Plus vor der ersten. Jeder Posten wird mit seinem Koeffizienten multipliziert, weil <M>{t`\Delta H`}</M> extensiv ist.</li>
            </ol>
            <p>Im Bild unten spielst du das Ganze durch: Wähle eine Reaktion und drücke «Abspielen». Jeder Pfeil ist ein Posten der Summe. Der lange dunkle Pfeil am Schluss ist <M p=".">{t`\Delta H_\mathrm{rxn}`}</M> Die Pfeillängen sind nur grob proportional, damit die Beschriftungen lesbar bleiben; die Zahlen stimmen genau. Die Tabelle darunter ist die Rechnung der Summenformel.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the summation formula:</b></p>
            <ol className="keep">
              <li>Every substance has its «altitude» <M p=",">{t`\Delta H^\circ_\mathrm{f}`}</M> measured from the elements. The elements themselves lie at height 0.</li>
              <li>A reaction leads from the reactants to the products. You can imagine it as a detour via the elements: first «take apart» all reactants down to the elements, then build the products.</li>
              <li>Taking apart costs the negative of the enthalpy of formation, hence the minus before the second sum. Building costs the enthalpy of formation, hence the plus before the first. Each item is multiplied by its coefficient because <M>{t`\Delta H`}</M> is extensive.</li>
            </ol>
            <p>In the figure below you play this through: choose a reaction and press «Play». Each arrow is one item of the sum. The long dark arrow at the end is <M p=".">{t`\Delta H_\mathrm{rxn}`}</M> The arrow lengths are only roughly proportional so that the labels stay readable; the numbers are exact. The table below is the calculation of the summation formula.</p>
          </>}
        />
        <HessFigure />
        <T
          de={<p>Zum Propan: Die Folie rechnet mit gerundeten Werten und nennt <M p=";">{t`-2220\,\mathrm{kJ}`}</M> setzt man die gerundeten Zahlen von Folie 27 wirklich ein, kommt <M>{t`-2222\,\mathrm{kJ}`}</M> heraus. Mit den genauen Tabellenwerten (<M p=",">{t`-103{,}85`}</M> <M p=",">{t`-393{,}5`}</M> <M p=")">{t`-285{,}8`}</M> ergibt sich <M p=",">{t`-2219{,}85\,\mathrm{kJ}`}</M> also gerundet <M>{t`-2220`}</M> (CH-001). Ebenso sind <M>{t`-1181`}</M> und <M>{t`-1143`}</M> auf Folie 28 gerundete Werte von <M>{t`3\cdot(-393{,}5) = -1180{,}5`}</M> und <M p=".">{t`4\cdot(-285{,}8) = -1143{,}2`}</M></p>}
          en={<p>On propane: the slide calculates with rounded values and states <M p=";">{t`-2220\,\mathrm{kJ}`}</M> if you really insert the rounded numbers of slide 27 you get <M p=".">{t`-2222\,\mathrm{kJ}`}</M> With the exact table values (<M p=",">{t`-103.85`}</M> <M p=",">{t`-393.5`}</M> <M p=")">{t`-285.8`}</M> one gets <M p=",">{t`-2219.85\,\mathrm{kJ}`}</M> which rounds to <M>{t`-2220`}</M> (CH-001). Likewise <M>{t`-1181`}</M> and <M>{t`-1143`}</M> on slide 28 are rounded values of <M>{t`3\cdot(-393.5) = -1180.5`}</M> and <M p=".">{t`4\cdot(-285.8) = -1143.2`}</M></p>}
        />
        <Box kind="uebung" src={<Src ex={4} p="7, 9" />} title={<T de="Aufgaben 3, 4 und 5 mit Lösung" en="Exercises 3, 4 and 5 with solution" />}>
          <T
            de={<>
              <p><b>Aufgabe 3:</b> <M>{t`\Delta H`}</M> für <span className="th-rx"><C>{'CO(g) + 2 H2(g) -> CH3OH(g)'}</C></span>, mit <M p=",">{t`\Delta H_\mathrm{f}(${cx('CO')}) = -110{,}5`}</M> <M p=",">{t`\Delta H_\mathrm{f}(${cx('H2')}) = 0`}</M> <M p=".">{t`\Delta H_\mathrm{f}(${cx('CH3OH')}) = -201{,}2\,\mathrm{kJ\,mol^{-1}}`}</M> Lösung: <M p=".">{t`\Delta H_\mathrm{rxn} = -201{,}2 + 110{,}5 = -90{,}7\,\mathrm{kJ\,mol^{-1}}`}</M> (Der Wert für <C>CH3OH(g)</C> stammt aus Appendix C; Tabelle 5.3 nennt nur die Flüssigkeit, <M p=".)">{t`-238{,}6`}</M></p>
              <p><b>Aufgabe 4</b> (zusammen) ist das Propan-Diagramm: ① Ausgangsstoffe in Elemente zerlegen, <M p=";">{t`\Delta H_1 = -\Delta H^\circ_\mathrm{f}(${cx('C3H8')})`}</M> ② <M p=";">{t`\Delta H_2 = 3\,\Delta H^\circ_\mathrm{f}(${cx('CO2')})`}</M> ③ <M p=";">{t`\Delta H_3 = 4\,\Delta H^\circ_\mathrm{f}(${cx('H2O')})`}</M> insgesamt <M p=".">{t`\Delta H^\circ_\mathrm{rxn} = \Delta H_1 + \Delta H_2 + \Delta H_3`}</M></p>
              <p><b>Aufgabe 5:</b> mit den Werten aus Appendix C, endotherm oder exotherm? (a) <span className="th-rx"><C>{'CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)'}</C></span>: <M p=",">{t`\Delta H_\mathrm{rxn} = 635{,}5 + 2\cdot 268{,}61 - 1219{,}6 - 241{,}82 = -288{,}7\,\mathrm{kJ\,mol^{-1}}`}</M> exotherm. (b) <span className="th-rx"><C>{'Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)'}</C></span>: <M p=",">{t`\Delta H_\mathrm{rxn} = 822{,}16 - 3\cdot 110{,}5 = +490{,}7\,\mathrm{kJ\,mol^{-1}}`}</M> endotherm. Alle drei Rechnungen kannst du im Bild oben durchspielen.</p>
            </>}
            en={<>
              <p><b>Exercise 3:</b> <M>{t`\Delta H`}</M> for <span className="th-rx"><C>{'CO(g) + 2 H2(g) -> CH3OH(g)'}</C></span>, with <M p=",">{t`\Delta H_\mathrm{f}(${cx('CO')}) = -110.5`}</M> <M p=",">{t`\Delta H_\mathrm{f}(${cx('H2')}) = 0`}</M> <M p=".">{t`\Delta H_\mathrm{f}(${cx('CH3OH')}) = -201.2\,\mathrm{kJ\,mol^{-1}}`}</M> Solution: <M p=".">{t`\Delta H_\mathrm{rxn} = -201.2 + 110.5 = -90.7\,\mathrm{kJ\,mol^{-1}}`}</M> (The value for <C>CH3OH(g)</C> comes from Appendix C; table 5.3 lists only the liquid, <M p=".)">{t`-238.6`}</M></p>
              <p><b>Exercise 4</b> (together) is the propane diagram: ① decompose the reactants into the elements, <M p=";">{t`\Delta H_1 = -\Delta H^\circ_\mathrm{f}(${cx('C3H8')})`}</M> ② <M p=";">{t`\Delta H_2 = 3\,\Delta H^\circ_\mathrm{f}(${cx('CO2')})`}</M> ③ <M p=";">{t`\Delta H_3 = 4\,\Delta H^\circ_\mathrm{f}(${cx('H2O')})`}</M> in total <M p=".">{t`\Delta H^\circ_\mathrm{rxn} = \Delta H_1 + \Delta H_2 + \Delta H_3`}</M></p>
              <p><b>Exercise 5:</b> using the values of Appendix C, endothermic or exothermic? (a) <span className="th-rx"><C>{'CaO(s) + 2 HF(g) -> CaF2(s) + H2O(g)'}</C></span>: <M p=",">{t`\Delta H_\mathrm{rxn} = 635.5 + 2\cdot 268.61 - 1219.6 - 241.82 = -288.7\,\mathrm{kJ\,mol^{-1}}`}</M> exothermic. (b) <span className="th-rx"><C>{'Fe2O3(s) + 3 C(s) -> 2 Fe(s) + 3 CO(g)'}</C></span>: <M p=",">{t`\Delta H_\mathrm{rxn} = 822.16 - 3\cdot 110.5 = +490.7\,\mathrm{kJ\,mol^{-1}}`}</M> endothermic. You can play all three calculations in the figure above.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="weitere" title={<T de="5. Weitere Enthalpien: Schmelzen und Verdampfen" en="5. Other enthalpies: fusion and vaporisation" />}>
        <Box kind="lecture" src={<Src lec={4} p="30" />} title={<T de="Weitere Enthalpien" en="Other enthalpies" />}>
          <T
            de={<ul>
              <li><M p=":">{t`\Delta H_\mathrm{fus}`}</M> Schmelzwärme (Schmelzen, fest → flüssig), <M p=".">{t`\Delta H > 0`}</M></li>
              <li><M p=":">{t`\Delta H_\mathrm{vap}`}</M> Verdampfungswärme (Sieden, flüssig → gasförmig), <M p=".">{t`\Delta H > 0`}</M></li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`\Delta H_\mathrm{fus}`}</M> heat of fusion (melting, solid → liquid), <M p=".">{t`\Delta H > 0`}</M></li>
              <li><M p=":">{t`\Delta H_\mathrm{vap}`}</M> heat of vaporization (boiling, liquid → vapor), <M p=".">{t`\Delta H > 0`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Die Folie nennt keine Zahlen. Für Wasser kennt man <M>{t`\Delta H_\mathrm{fus} = 6{,}0\,\mathrm{kJ\,mol^{-1}}`}</M> (diese Zahl nutzt die nächste Vorlesung) und <M>{t`\Delta H_\mathrm{vap} \approx 40{,}7\,\mathrm{kJ\,mol^{-1}}`}</M> (Ergänzung). Beide Prozesse sind endotherm, es gibt also nichts Neues zu rechnen – nur neue Namen für <M p=".">{t`\Delta H`}</M></p>}
          en={<p>The slide gives no numbers. For water one knows <M>{t`\Delta H_\mathrm{fus} = 6.0\,\mathrm{kJ\,mol^{-1}}`}</M> (the next lecture uses this number) and <M>{t`\Delta H_\mathrm{vap} \approx 40.7\,\mathrm{kJ\,mol^{-1}}`}</M> (supplement). Both processes are endothermic, so there is nothing new to calculate – only new names for <M p=".">{t`\Delta H`}</M></p>}
        />
        <PhaseEnthalpyFigure />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de={<>«<M>{t`\Delta H = q`}</M> gilt immer»</>} en={<>«<M>{t`\Delta H = q`}</M> always holds»</>} />}>
        <T
          de={<p>Nur bei konstantem Druck und wenn ausser Druck-Volumen-Arbeit keine andere Arbeit im Spiel ist. Bei konstantem Volumen ist es <M p=",">{t`\Delta E`}</M> das gleich der Wärme ist. Darum schreibt man <M>{t`q_p`}</M> und <M p=".">{t`q_v`}</M></p>}
          en={<p>Only at constant pressure and when no work other than pressure–volume work is involved. At constant volume it is <M>{t`\Delta E`}</M> that equals the heat. That is why we write <M>{t`q_p`}</M> and <M p=".">{t`q_v`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Beim Zerlegen das Vorzeichen vergessen»" en="«Forgetting the sign when taking apart»" />}>
        <T
          de={<p>Die Reaktanden stehen in der Formel mit Minus. Das ist kein Zufall: Man läuft den Weg «Stoff → Elemente» rückwärts, und <M>{t`\Delta H_\mathrm{forward} = -\Delta H_\mathrm{reverse}`}</M> (Folie 19). Ebenso gehört der Koeffizient zu jedem Posten, auch wenn ein Stoff mehrfach vorkommt.</p>}
          en={<p>The reactants appear in the formula with a minus. This is no accident: you walk the way «substance → elements» backwards, and <M>{t`\Delta H_\mathrm{forward} = -\Delta H_\mathrm{reverse}`}</M> (slide 19). Likewise the coefficient belongs to every item, also when a substance occurs several times.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Wasser ist Wasser»" en="«Water is water»" />}>
        <T
          de={<p>Für <C>H2O(g)</C> und <C>H2O(l)</C> ist <M>{t`\Delta H^\circ_\mathrm{f}`}</M> verschieden (<M>{t`-241{,}8`}</M> gegen <M p=").">{t`-285{,}8\,\mathrm{kJ\,mol^{-1}}`}</M> Der Unterschied ist die Kondensationswärme. Wer den Zustand vergisst, rechnet mit dem falschen Wert (Folie 19: <M>{t`\Delta H`}</M> hängt vom Zustand ab).</p>}
          en={<p>For <C>H2O(g)</C> and <C>H2O(l)</C> the <M>{t`\Delta H^\circ_\mathrm{f}`}</M> differ (<M>{t`-241.8`}</M> versus <M p=").">{t`-285.8\,\mathrm{kJ\,mol^{-1}}`}</M> The difference is the heat of condensation. If you forget the state, you calculate with the wrong value (slide 19: <M>{t`\Delta H`}</M> depends on the state).</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li><M p=",">{t`H = E + PV`}</M> und bei konstantem Druck <M p=".">{t`\Delta H = \Delta E + P\,\Delta V = q_p`}</M></li>
            <li>Druck-Volumen-Arbeit: <M p=".">{t`w = -P\,\Delta V`}</M></li>
            <li>Kalorimetrie: <M p=",">{t`q = m\,C_\mathrm{s}\,\Delta T`}</M> <M p=".">{t`q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M></li>
            <li>Hess: Enthalpien von Teilschritten addieren sich. Rückwärts: Vorzeichen umdrehen. Doppelt so viel Stoff: doppelte Enthalpie.</li>
            <li><M p=";">{t`\Delta H^\circ_\mathrm{rxn} = \sum b_j\,\Delta H^\circ_{\mathrm{f},j} - \sum a_i\,\Delta H^\circ_{\mathrm{f},i}`}</M> Elemente haben <M p=".">{t`\Delta H^\circ_\mathrm{f} = 0`}</M></li>
          </ul>}
          en={<ul>
            <li><M p=",">{t`H = E + PV`}</M> and at constant pressure <M p=".">{t`\Delta H = \Delta E + P\,\Delta V = q_p`}</M></li>
            <li>Pressure–volume work: <M p=".">{t`w = -P\,\Delta V`}</M></li>
            <li>Calorimetry: <M p=",">{t`q = m\,C_\mathrm{s}\,\Delta T`}</M> <M p=".">{t`q_\mathrm{rxn} = -q_{${cx('H2O')}}`}</M></li>
            <li>Hess: enthalpies of partial steps add up. Backwards: flip the sign. Twice the substance: twice the enthalpy.</li>
            <li><M p=";">{t`\Delta H^\circ_\mathrm{rxn} = \sum b_j\,\Delta H^\circ_{\mathrm{f},j} - \sum a_i\,\Delta H^\circ_{\mathrm{f},i}`}</M> elements have <M p=".">{t`\Delta H^\circ_\mathrm{f} = 0`}</M></li>
          </ul>}
        />
      </Box>
      <T de={<p className="th-note">Nächste Lektion: <a href="#ch-entropie">Spontane Prozesse und Entropie</a> – warum <M>{t`\Delta H`}</M> allein nicht sagt, ob eine Reaktion von selbst abläuft.</p>} en={<p className="th-note">Next lesson: <a href="#ch-entropie">spontaneous processes and entropy</a> – why <M>{t`\Delta H`}</M> alone does not tell whether a reaction runs by itself.</p>} />
    </article>
  );
}
