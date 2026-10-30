import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { BondEnthalpyFigure, BondLengthFigure } from '../viz/chem/BondFigures';

const t = String.raw;

export default function CH7Enthalpie() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wie fest hält eine Bindung? Man misst es mit der Energie, die nötig ist, um sie zu brechen. Mit einer Tabelle dieser Energien lässt sich die Reaktionsenthalpie fast jeder Gasreaktion abschätzen, ohne eine einzige Bildungsenthalpie zu kennen. Und man sieht: Je mehr Paare zwei Atome teilen, desto kürzer und fester ist ihre Bindung.</p>}
        en={<p className="lede">How firmly does a bond hold? One measures it by the energy needed to break it. With a table of these energies, the reaction enthalpy of almost any gas reaction can be estimated without knowing a single enthalpy of formation. And one sees: the more pairs two atoms share, the shorter and firmer their bond.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Eine Reaktion ist wie ein Umbau mit Lego: Erst alle Steine auseinandernehmen (das kostet Kraft), dann neu zusammenstecken (das gibt etwas zurück). Ob der Umbau insgesamt Energie liefert, hängt davon ab, ob die neuen Verbindungen fester sind als die alten.</p>}
          en={<p>A reaction is like rebuilding with Lego: first take all the bricks apart (that costs effort), then click them together anew (that gives something back). Whether the rebuild delivers energy overall depends on whether the new connections are firmer than the old ones.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="bindungsenthalpie" title={<T de="1. Bindungsenthalpien" en="1. Bond enthalpies" />}>
        <Box kind="lecture" src={<Src lec={7} p="25" />} title={<T de="Stärke kovalenter Bindungen" en="Strengths of covalent bonds" />}>
          <T
            de={<>
              <p><b>Bindungsenthalpie:</b> die Enthalpieänderung beim Brechen einer bestimmten Bindung. Eine positive Zahl: die Energie, die nötig ist, um die Bindung zu brechen. Werte stehen in Tabellen; sie geben <b>mittlere</b> Bindungsenthalpien für bestimmte Bindungen. Man kann damit <M>{t`\Delta H_\mathrm{rxn}`}</M> abschätzen:</p>
              <MD>{t`\Delta H_\mathrm{rxn} = \sum \bigl(\text{Enthalpien der gebrochenen Bindungen}\bigr) - \sum \bigl(\text{Enthalpien der gebildeten Bindungen}\bigr)`}</MD>
              <p>Daneben Tabelle 8.3 aus Brown, «Mittlere Bindungsenthalpien (kJ/mol)», z. B. <M>{t`\mathrm{C{-}H}`}</M> 413, <M>{t`\mathrm{H{-}H}`}</M> 436, <M>{t`\mathrm{O{-}H}`}</M> 463, <M>{t`\mathrm{Cl{-}Cl}`}</M> 242, <M>{t`\mathrm{H{-}Cl}`}</M> 431, <M>{t`\mathrm{O{=}O}`}</M> 495, <M>{t`\mathrm{C{=}O}`}</M> 799, <M>{t`\mathrm{N{\equiv}N}`}</M> 941.</p>
            </>}
            en={<>
              <p><b>Bond enthalpies:</b> the enthalpy change for breaking a particular bond. A positive number: the energy required to break the bond. Values are available in tables; they give <b>average</b> bond enthalpies for specific bonds. They can be used to estimate <M p=":">{t`\Delta H_\mathrm{rxn}`}</M></p>
              <MD>{t`\Delta H_\mathrm{rxn} = \sum \bigl(\text{enthalpies for bonds broken}\bigr) - \sum \bigl(\text{enthalpies for bonds formed}\bigr)`}</MD>
              <p>Next to it Table 8.3 from Brown, “Average bond enthalpies (kJ/mol)”, e.g. <M>{t`\mathrm{C{-}H}`}</M> 413, <M>{t`\mathrm{H{-}H}`}</M> 436, <M>{t`\mathrm{O{-}H}`}</M> 463, <M>{t`\mathrm{Cl{-}Cl}`}</M> 242, <M>{t`\mathrm{H{-}Cl}`}</M> 431, <M>{t`\mathrm{O{=}O}`}</M> 495, <M>{t`\mathrm{C{=}O}`}</M> 799, <M>{t`\mathrm{N{\equiv}N}`}</M> 941.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum diese Formel?</b> Es ist der Satz von Hess (Woche 4) mit einem besonderen Umweg: über die freien Gasatome.</p>
            <ol className="keep">
              <li>Alle Bindungen der Ausgangsstoffe brechen: Man landet bei lauter einzelnen Atomen. Das kostet die Summe der gebrochenen Bindungsenthalpien (Pfeil nach oben).</li>
              <li>Aus den Atomen die Bindungen der Produkte bilden: Dabei wird die Summe der gebildeten Bindungsenthalpien frei (Pfeil nach unten, darum das Minus).</li>
              <li>Was netto übrig bleibt, ist <M p=".">{t`\Delta H_\mathrm{rxn}`}</M> Sind die neuen Bindungen fester als die alten, ist die Reaktion exotherm.</li>
            </ol>
            <p>Die Tabelle gilt für Gase; Werte wie «<M>{t`\mathrm{C{-}H}`}</M> 413» sind Mittelwerte über viele Moleküle. Das Ergebnis ist darum eine Schätzung. Für die Verbrennung von Methan gibt sie <M p=",">{t`-808\ \mathrm{kJ}`}</M> die Bildungsenthalpien (mit Wasserdampf) geben <M p=".">{t`-802\ \mathrm{kJ}`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>Why this formula?</b> It is Hess's law (week 4) with a special detour: via the free gaseous atoms.</p>
            <ol className="keep">
              <li>Break all bonds of the reactants: one ends up with nothing but single atoms. That costs the sum of the broken bond enthalpies (arrow up).</li>
              <li>Form the bonds of the products from the atoms: this releases the sum of the formed bond enthalpies (arrow down, hence the minus).</li>
              <li>What remains net is <M p=".">{t`\Delta H_\mathrm{rxn}`}</M> If the new bonds are firmer than the old ones, the reaction is exothermic.</li>
            </ol>
            <p>The table holds for gases; values like “<M>{t`\mathrm{C{-}H}`}</M> 413” are averages over many molecules. The result is therefore an estimate. For the combustion of methane it gives <M p=",">{t`-808\ \mathrm{kJ}`}</M> the enthalpies of formation (with water vapour) give <M p=".">{t`-802\ \mathrm{kJ}`}</M></p>
          </>}
        />
        <BondEnthalpyFigure />
        <Box kind="uebung" src={<Src ex={7} p="5" />} title={<T de="Bindungsenthalpie" en="Bond enthalpy" />}>
          <T
            de={<p>«Um eine kovalente Bindung zu brechen, brauchen wir eine Energie, die Bindungsenthalpie. Mit ihr kann man Reaktionsenthalpien näherungsweise berechnen.» Eingerahmt: <M p=".">{t`\Delta H_\mathrm{rxn} = \sum H_\text{gebrochen} - \sum H_\text{gebildet}`}</M></p>}
            en={<p>“To break a covalent bond, we need an energy known as the bond enthalpy. It can be used to approximate reaction enthalpies.” Boxed: <M p=".">{t`\Delta H_\mathrm{rxn} = \sum H_\text{broken} - \sum H_\text{formed}`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Beim Brechen einer Bindung wird Energie frei»" en="“Breaking a bond releases energy”" />}>
          <T
            de={<p>Umgekehrt: Brechen kostet immer Energie, Bilden setzt sie frei. Darum sind alle Bindungsenthalpien positiv. Wenn ein Brennstoff «Energie in seinen Bindungen speichert», heisst das nur: Die Bindungen der Produkte (<C>CO2</C> und <C p=")">H2O</C> sind zusammen fester als die der Ausgangsstoffe.</p>}
            en={<p>The other way round: breaking always costs energy, forming releases it. That is why all bond enthalpies are positive. When a fuel “stores energy in its bonds”, this only means: the bonds of the products (<C>CO2</C> and <C p=")">H2O</C> are firmer together than those of the reactants.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="bindungslaenge" title={<T de="2. Bindungslänge" en="2. Bond length" />}>
        <Box kind="lecture" src={<Src lec={7} p="26" />} title={<T de="Länge kovalenter Bindungen" en="Lengths of covalent bonds" />}>
          <T
            de={<>
              <p>Tabelle 8.4 aus Brown, «Mittlere Bindungslängen einiger Einfach-, Doppel- und Dreifachbindungen» (pm): <M>{t`\mathrm{C{-}C}`}</M> 154, <M>{t`\mathrm{C{=}C}`}</M> 134, <M>{t`\mathrm{C{\equiv}C}`}</M> 120; <M>{t`\mathrm{C{-}N}`}</M> 143, <M>{t`\mathrm{C{=}N}`}</M> 138, <M>{t`\mathrm{C{\equiv}N}`}</M> 116; <M>{t`\mathrm{C{-}O}`}</M> 143, <M>{t`\mathrm{C{=}O}`}</M> 123, <M>{t`\mathrm{C{\equiv}O}`}</M> 113; <M>{t`\mathrm{N{-}N}`}</M> 147, <M>{t`\mathrm{N{=}N}`}</M> 124, <M>{t`\mathrm{N{\equiv}N}`}</M> 110; <M>{t`\mathrm{N{-}O}`}</M> 136, <M>{t`\mathrm{N{=}O}`}</M> 122; <M>{t`\mathrm{O{-}O}`}</M> 148, <M>{t`\mathrm{O{=}O}`}</M> 121.</p>
              <p><b>«Zwischen zwei Atomen werden die Bindungen kürzer, je mehr Bindungen es sind.»</b></p>
            </>}
            en={<>
              <p>Table 8.4 from Brown, “Average bond lengths for some single, double, and triple bonds” (pm): <M>{t`\mathrm{C{-}C}`}</M> 154, <M>{t`\mathrm{C{=}C}`}</M> 134, <M>{t`\mathrm{C{\equiv}C}`}</M> 120; <M>{t`\mathrm{C{-}N}`}</M> 143, <M>{t`\mathrm{C{=}N}`}</M> 138, <M>{t`\mathrm{C{\equiv}N}`}</M> 116; <M>{t`\mathrm{C{-}O}`}</M> 143, <M>{t`\mathrm{C{=}O}`}</M> 123, <M>{t`\mathrm{C{\equiv}O}`}</M> 113; <M>{t`\mathrm{N{-}N}`}</M> 147, <M>{t`\mathrm{N{=}N}`}</M> 124, <M>{t`\mathrm{N{\equiv}N}`}</M> 110; <M>{t`\mathrm{N{-}O}`}</M> 136, <M>{t`\mathrm{N{=}O}`}</M> 122; <M>{t`\mathrm{O{-}O}`}</M> 148, <M>{t`\mathrm{O{=}O}`}</M> 121.</p>
              <p><b>“Bonds get shorter between two atoms as number of bonds increases.”</b></p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Legt man beide Tabellen nebeneinander, sieht man den Zusammenhang: Mehr geteilte Paare bedeuten mehr negative Ladung zwischen den Kernen. Sie ziehen die Kerne näher zusammen (kürzer) und halten sie fester (grössere Bindungsenthalpie). Bei <M p=":">{t`\mathrm{C{-}C}`}</M> 154, 134, 120 pm und 348, 614, 839 kJ/mol. Die Dreifachbindung ist aber nicht dreimal so fest wie die Einfachbindung.</p>}
          en={<p className="keep">Put the two tables side by side and you see the connection: more shared pairs mean more negative charge between the nuclei. They pull the nuclei closer together (shorter) and hold them more firmly (larger bond enthalpy). For <M p=":">{t`\mathrm{C{-}C}`}</M> 154, 134, 120 pm and 348, 614, 839 kJ/mol. The triple bond is not three times as firm as the single bond, though.</p>}
        />
        <BondLengthFigure />
        <Box kind="uebung" src={<Src ex={7} p="5" />} title={<T de="Bindungslänge" en="Bond length" />}>
          <T
            de={<p>«Bindungslänge: der Abstand zwischen zwei gebundenen Atomen. Doppelbindungen sind kürzer als Einfachbindungen» – <M>{t`\mathrm{A{=}A}`}</M> kürzer als <M p=",">{t`\mathrm{A{-}A}`}</M> «nur für dieselben Atome, über <M>{t`\mathrm{A{-}B}`}</M> wissen wir so nichts». «Je kleiner die Atomradien, desto kürzer die Bindung.» «Die Bindungslänge hängt nicht allein von <M>{t`\Delta EN`}</M> ab, aber bei grösserem <M>{t`\Delta EN`}</M> kann die Bindung stärker und kürzer sein.»</p>}
            en={<p>“Bond length: the distance between two bonded atoms. Double bonds are shorter than single bonds” – <M>{t`\mathrm{A{=}A}`}</M> shorter than <M p=",">{t`\mathrm{A{-}A}`}</M> “only same atom type, we don't know about <M>{t`\mathrm{A{-}B}`}</M>”. “The smaller the atomic radii, the shorter the bond.” “The bond length does not solely depend on <M p=",">{t`\Delta EN`}</M> but if <M>{t`\Delta EN`}</M> is bigger, the bond can be stronger and shorter.”</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Eine Doppelbindung ist immer kürzer als jede Einfachbindung»" en="“A double bond is always shorter than any single bond”" />}>
          <T
            de={<p>Nur zwischen denselben zwei Atomen. Die Einfachbindung <M>{t`\mathrm{H{-}H}`}</M> ist 74 pm lang (nicht in der Tabelle), viel kürzer als die Doppelbindung <M>{t`\mathrm{C{=}C}`}</M> mit 134 pm, weil Wasserstoffatome winzig sind. Darum betont die Übung: «nur für dieselben Atome».</p>}
            en={<p>Only between the same two atoms. The single bond <M>{t`\mathrm{H{-}H}`}</M> is 74 pm long (not in the table), much shorter than the double bond <M>{t`\mathrm{C{=}C}`}</M> with 134 pm, because hydrogen atoms are tiny. That is why the exercise class stresses: “only same atom type”.</p>}
          />
        </Box>
      </Section>
    </article>
  );
}
