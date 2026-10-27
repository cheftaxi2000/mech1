import { Box, De, Section, Src } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T, useLang } from '../i18n';
import { EntropyBudget, GibbsDerivation, GibbsExplorer, GibbsSigns, ReactionLedger } from '../viz/chem/GibbsFigures';
import '../viz/chem/gibbs.css';

const t = String.raw;

/** The words under the sigma of the recipe (slides 22, 28): «Produkte/Edukte» or «products/reactants». */
function useWords() {
  const lang = useLang();
  return { P: lang === 'de' ? 'Produkte' : 'products', R: lang === 'de' ? 'Edukte' : 'reactants' };
}
/** Rows `lhs = Σ_products b_j p_j − Σ_reactants a_i r_i`, aligned. */
function Recipe({ rows }: { rows: [string, string, string][] }) {
  const W = useWords();
  const row = ([l, p, r]: [string, string, string]) => t`${l} &= \sum_{\text{${W.P}},\,j} b_j\,${p} \;-\; \sum_{\text{${W.R}},\,i} a_i\,${r}`;
  return <MD>{t`\begin{aligned} ${rows.map(row).join(t` \\ `)} \end{aligned}`}</MD>;
}
/** ΔG = (ΣΔH − ΣΔH) − T (ΣS − ΣS), exercise class 5, p. 11. */
function Route() {
  const W = useWords();
  return <MD>{t`\begin{aligned} \Delta G^\circ_{\mathrm{rxn}} &= \Big(\sum_{\text{${W.P}}} \Delta H^\circ_{\mathrm{f}} - \sum_{\text{${W.R}}} \Delta H^\circ_{\mathrm{f}}\Big) \\ &\quad - T\Big(\sum_{\text{${W.P}}} S^\circ - \sum_{\text{${W.R}}} S^\circ\Big) \end{aligned}`}</MD>;
}
const CONST = t`\qquad (T,\ P = \text{const.})`;

export default function CH5Gibbs() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Läuft eine Reaktion von selbst ab? Bisher mussten wir dafür zwei Dinge ausrechnen: die Entropie des Systems und die der Umgebung. Jetzt lernen wir eine einzige Grösse, die beides in einer Zahl zusammenfasst: die <b>Gibbs-Energie</b> <M p=".">G</M> Ihr Vorzeichen sagt, ob die Reaktion läuft – und die Temperatur kann dieses Vorzeichen umdrehen.</p>}
        en={<p className="lede">Does a reaction run by itself? Until now we had to work out two things for that: the entropy of the system and that of the surroundings. Now we learn one single quantity that combines both in one number: the <b>Gibbs free energy</b> <M p=".">G</M> Its sign tells whether the reaction runs – and the temperature can flip that sign.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Ein Ball rollt von selbst bergab: Seine Energie sinkt. Ein Tropfen Tinte verteilt sich von selbst im Wasser: Die Unordnung steigt. Spontane Vorgänge tun mindestens eins von beiden. Manchmal ziehen beide am selben Strick, manchmal gegeneinander. Dann entscheidet die Temperatur, wer gewinnt. Die Gibbs-Energie ist die Waage, die beides gegeneinander abwägt.</p>}
          en={<p>A ball rolls downhill by itself: its energy falls. A drop of ink spreads out in water by itself: disorder rises. Spontaneous processes do at least one of the two. Sometimes both pull the same way, sometimes against each other. Then the temperature decides who wins. The Gibbs free energy is the scale that weighs the two against each other.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="entropie-reaktion" title={<T de={<>1. Die Entropie einer Reaktion, <M>{t`\Delta S^\circ`}</M></>} en={<>1. The entropy of a reaction, <M>{t`\Delta S^\circ`}</M></>} />}>
        <Box kind="lecture" src={<Src lec={5} p="22–23" />} title={<T de={<>Bestimmung von <M>{t`\Delta S`}</M> für chemische Reaktionen</>} en={<>Determining <M>{t`\Delta S`}</M> for chemical reactions</>} />}>
          <T
            de={<p>«Letzte Vorlesung»: eine Reaktion mit den Edukten <M>{t`R_i`}</M> und den Produkten <M>{t`P_j`}</M> <M p=",">{t`a_i`}</M> <M>{t`b_j`}</M> sind die stöchiometrischen Koeffizienten.</p>}
            en={<p>“Last lecture”: a reaction with reactants <M>{t`R_i`}</M> and products <M p=";">{t`P_j`}</M> <M>{t`a_i`}</M> and <M>{t`b_j`}</M> are the stoichiometric coefficients.</p>}
          />
          <MD>{t`a_1 R_1 + a_2 R_2 + \cdots \;\longrightarrow\; b_1 P_1 + b_2 P_2 + \cdots`}</MD>
          <T de={<p>«Wir haben gezeigt»:</p>} en={<p>“We showed”:</p>} />
          <Recipe rows={[[t`\Delta H^\circ_{\mathrm{rxn}}`, t`\Delta H^\circ_{\mathrm{f},j}`, t`\Delta H^\circ_{\mathrm{f},i}`]]} />
          <T de={<p>«Ähnlich»:</p>} en={<p>“Similarly”:</p>} />
          <Recipe rows={[[t`\Delta S^\circ`, t`S^\circ_j`, t`S^\circ_i`]]} />
          <T
            de={<p><M>{t`S^\circ`}</M> <M>\equiv</M> molare Standardentropie: <M>S</M> für einen Stoff in seinem Standardzustand. <M>{t`\Delta H^\circ_{\mathrm{f}}`}</M> und <M>{t`S^\circ`}</M> holt man aus Tabellen. Handschriftlich: «Durch Experimente bestimmt. Methode jenseits dieses Kurses.»</p>}
            en={<p><M>{t`S^\circ`}</M> <M>\equiv</M> standard molar entropy: <M>S</M> for a substance in its standard state. Get <M>{t`\Delta H^\circ_{\mathrm{f}}`}</M> and <M>{t`S^\circ`}</M> values from tables. Handwritten: “Determined by experiments. Method beyond this course.”</p>}
          />
          <T
            de={<p>Beispiel (Folie 23): <C p=",">{'N2(g) + 3 H2(g) -> 2 NH3(g)'}</C> <M>{t`\Delta S^\circ(298\ \mathrm{K}) = {?}`}</M> Werte aus Tabelle 19.1 im Brown.</p>}
            en={<p>Example (slide 23): <C p=",">{'N2(g) + 3 H2(g) -> 2 NH3(g)'}</C> <M>{t`\Delta S^\circ(298\ \mathrm{K}) = {?}`}</M> Values from Table 19.1 in Brown.</p>}
          />
          <MD>{t`\begin{aligned} \Delta S^\circ &= 2\,S^\circ(\mathrm{NH_3}) - \left[S^\circ(\mathrm{N_2}) + 3\,S^\circ(\mathrm{H_2})\right] \\ &= 2\cdot 193 - 192 - 3\cdot 131 \ \mathrm{J\,mol^{-1}K^{-1}} = -199\ \mathrm{J\,mol^{-1}K^{-1}} \end{aligned}`}</MD>
          <T
            de={<p>«Beachte: <M>{t`\Delta S^\circ`}</M> ist negativ. Das passt zu unserer früheren Diskussion: Die Reaktion verringert die Zahl der Gasteilchen, also sinkt die Zahl der Mikrozustände und damit <M p=".">S</M>»</p>}
            en={<p>“Note: <M>{t`\Delta S^\circ`}</M> is negative. This is consistent with our discussion above. Namely, as the number of gas species is reduced by the reaction, the number of microstates, and hence <M p=",">S</M> also decreases.”</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Formel:</b></p>
            <ol className="keep">
              <li>Schau ins ausgeglichene Reaktionsschema. Die Zahl vor einem Stoff ist sein Koeffizient (<M>{t`a_i`}</M> bei den Edukten, <M>{t`b_j`}</M> bei den Produkten). Steht keine Zahl, ist er <M p=".">1</M></li>
              <li><M>{t`S^\circ`}</M> ist die Entropie von einem Mol des Stoffs. Sie steht in der Tabelle. Bei <M>{t`3\,\mathrm{H_2}`}</M> brauchst du drei Mol, also <M p=".">{t`3\cdot S^\circ(\mathrm{H_2})`}</M></li>
              <li>Addiere alles auf der Produktseite. Addiere alles auf der Eduktseite.</li>
              <li>Produkte minus Edukte, wie «Endstand minus Anfangsstand» auf dem Konto. Das ist <M p=".">{t`\Delta S^\circ`}</M></li>
            </ol>
            <p>Zur Einheit: <M>{t`S^\circ`}</M> und <M>{t`\Delta S^\circ`}</M> haben die Einheit <M p=",">{t`\mathrm{J\,mol^{-1}K^{-1}}`}</M> Joule, nicht Kilojoule. Das wird gleich wichtig.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the formula:</b></p>
            <ol className="keep">
              <li>Look at the balanced reaction. The number in front of a substance is its coefficient (<M>{t`a_i`}</M> for reactants, <M>{t`b_j`}</M> for products). If there is no number, it is <M p=".">1</M></li>
              <li><M>{t`S^\circ`}</M> is the entropy of one mole of the substance. It is in the table. For <M>{t`3\,\mathrm{H_2}`}</M> you need three moles, so <M p=".">{t`3\cdot S^\circ(\mathrm{H_2})`}</M></li>
              <li>Add up everything on the product side. Add up everything on the reactant side.</li>
              <li>Products minus reactants, like “final balance minus starting balance” on a bank account. That is <M p=".">{t`\Delta S^\circ`}</M></li>
            </ol>
            <p>A note on units: <M>{t`S^\circ`}</M> and <M>{t`\Delta S^\circ`}</M> have the unit <M p=",">{t`\mathrm{J\,mol^{-1}K^{-1}}`}</M> joules, not kilojoules. This will matter in a moment.</p>
          </>}
        />
        <T
          de={<p>Das Bild rechnet diese Bilanz für die Reaktion der Folie und für fünf weitere aus der Übung vor. Jeder Block ist «Koeffizient mal Tabellenwert». Die Linie ist die Summe, der Pfeil ist der Unterschied. Unten stehen die Gasteilchen: Das ist die Erklärung für das Vorzeichen.</p>}
          en={<p>The figure works out this ledger for the reaction on the slide and for five more from the exercise class. Each block is “coefficient times table value”. The line is the sum, the arrow is the difference. At the bottom are the gas particles: that is the explanation for the sign.</p>}
        />
        <ReactionLedger quantity="S" />
        <T
          de={<p>Beim Ammoniak verschwinden aus vier Gasteilchen zwei. Zwei Teilchen haben weniger Möglichkeiten, sich im Behälter anzuordnen als vier. Also gibt es weniger Mikrozustände, und <M>{t`\Delta S^\circ`}</M> ist negativ. Bei <C p=",">{'2 O3 -> 3 O2'}</C> ist es umgekehrt: aus zwei werden drei Gasteilchen, und <M>{t`\Delta S^\circ`}</M> ist positiv. Dieselbe Faustregel steht in der Übung: Nimmt die Zahl der Gasteilchen ab, nimmt auch die Entropie ab.</p>}
          en={<p>For ammonia, four gas particles turn into two. Two particles have fewer ways to arrange themselves in the container than four. So there are fewer microstates, and <M>{t`\Delta S^\circ`}</M> is negative. For <C p=",">{'2 O3 -> 3 O2'}</C> it is the other way round: two gas particles become three, and <M>{t`\Delta S^\circ`}</M> is positive. The same rule of thumb appears in the exercise class: if the number of gas particles falls, the entropy falls too.</p>}
        />
        <Box kind="uebung" src={<Src ex={5} p="6, 8" />} title={<T de="Faustregeln der Übung 5" en="Rules of thumb of exercise class 5" />}>
          <T
            de={<p>Aufgabe 3 (d, e) und 4: <C>{'CaO(s) + CO2(g) -> CaCO3(s)'}</C> hat weniger Teilchen (<M p=")">{t`\Delta n < 0`}</M> und damit <M p=".">{t`\Delta S < 0`}</M> Ebenso <C>{'2 SO2(g) + O2(g) -> 2 SO3(g)'}</C> (<M>{t`\Delta n < 0`}</M> und <M p=").">{t`\Delta S < 0`}</M> Die Entropie steigt auch, wenn man erwärmt (<M p=",">{t`\Delta T > 0`}</M> <M p=").">{t`\Delta S > 0`}</M> und wenn das Volumen kleiner wird, sinkt sie. Die Übung sagt: Dreht man die Reaktion um, wechselt <M>{t`\Delta S^\circ_{\mathrm{rxn}}`}</M> das Vorzeichen.</p>}
            en={<p>Problem 3 (d, e) and 4: <C>{'CaO(s) + CO2(g) -> CaCO3(s)'}</C> has fewer particles (<M p=")">{t`\Delta n < 0`}</M> and so <M p=".">{t`\Delta S < 0`}</M> The same for <C>{'2 SO2(g) + O2(g) -> 2 SO3(g)'}</C> (<M>{t`\Delta n < 0`}</M> and <M p=").">{t`\Delta S < 0`}</M> Entropy also rises on heating (<M p=",">{t`\Delta T > 0`}</M> <M p=").">{t`\Delta S > 0`}</M> and it falls when the volume gets smaller. The exercise class says: if you reverse the reaction, <M>{t`\Delta S^\circ_{\mathrm{rxn}}`}</M> changes sign.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="reicht-nicht" title={<T de={<>2. Warum <M>{t`\Delta S_{\mathrm{sys}}`}</M> allein nicht reicht</>} en={<>2. Why <M>{t`\Delta S_{\mathrm{sys}}`}</M> alone is not enough</>} />}>
        <Box kind="lecture" src={<Src lec={5} p="24" />} title={<T de="Was heisst das für die Spontanität dieser Reaktion?" en="What does this mean for spontaneity for this reaction?" />}>
          <T
            de={<p>Handschriftlich: «Ist die Reaktion <C>{'N2 + 3 H2 -> 2 NH3'}</C> spontan? Wir haben gerade <M>{t`\Delta S_{\mathrm{sys}} = -199\ \mathrm{J/K}`}</M> bestimmt.»</p>}
            en={<p>Handwritten: “Is the reaction <C>{'N2 + 3 H2 -> 2 NH3'}</C> spontaneous? We just determined <M p=".">{t`\Delta S_{\mathrm{sys}} = -199\ \mathrm{J/K}`}</M>”</p>}
          />
          <MD>{t`\Delta S_{\mathrm{surr}} = \frac{q_{\mathrm{surr}}}{T} = \frac{-q_{\mathrm{sys}}}{T} = \frac{-\Delta H_{\mathrm{sys}}}{T} = \frac{-\Delta H^\circ_{\mathrm{rxn}}}{T}`}</MD>
          <MD>{t`\Delta H^\circ_{\mathrm{rxn}} = -92{,}4\ \mathrm{kJ\,mol^{-1}} \;\Rightarrow\; \Delta S_{\mathrm{surr}} = \frac{92{,}4\ \mathrm{kJ\,mol^{-1}}}{298\ \mathrm{K}} = +310\ \mathrm{J\,mol^{-1}K^{-1}}`}</MD>
          <MD>{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} + \Delta S_{\mathrm{surr}} = [-199 + 310]\ \mathrm{J\,mol^{-1}K^{-1}} = +111\ \mathrm{J\,mol^{-1}K^{-1}}`}</MD>
          <T
            de={<p>«spontan!» (Handschriftlich: «Weil unser Kriterium <M>{t`\Delta S_{\mathrm{univ}}`}</M> positiv ist. Das sagt wieder nichts darüber, wie schnell die Reaktion abläuft.») «Aber dieses Kriterium, <M p=",">{t`\Delta S_{\mathrm{univ}} > 0`}</M> ist kompliziert! Man muss System und Umgebung getrennt analysieren und kombinieren, um <M>{t`\Delta S_{\mathrm{univ}}`}</M> zu bekommen. Gibt es ein besseres Kriterium?» Handschriftlich: «Stellt sich heraus: ja!»</p>}
            en={<p>“spontaneous!” (Handwritten: “Because our criterion <M>{t`\Delta S_{\mathrm{univ}}`}</M> is positive. Again, this does not tell us how fast the reaction will be.”) “But this criterion for spontaneity, <M p=",">{t`\Delta S_{\mathrm{univ}} > 0`}</M> is complicated! Must analyze both system and surroundings and combine to get <M p=".">{t`\Delta S_{\mathrm{univ}}`}</M> Does a better criterion exist?” Handwritten: “Turns out yes!”</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Rechnung:</b></p>
            <ol className="keep">
              <li><b>Das System</b> ist die Reaktion selbst: <M p=".">{t`\Delta S_{\mathrm{sys}} = -199\ \mathrm{J\,mol^{-1}K^{-1}}`}</M> Das System wird ordentlicher, seine Entropie sinkt.</li>
              <li><b>Die Umgebung</b> ist alles drumherum (Luft, Gefäss). Die Reaktion gibt Wärme ab: <M p=".">{t`\Delta H^\circ_{\mathrm{rxn}} = -92{,}4\ \mathrm{kJ\,mol^{-1}}`}</M> Diese Wärme geht in die Umgebung: <M p=".">{t`q_{\mathrm{surr}} = -q_{\mathrm{sys}}`}</M></li>
              <li>Wärme in der Umgebung bringt Entropie: <M p=".">{t`\Delta S_{\mathrm{surr}} = q_{\mathrm{surr}}/T`}</M> Bei konstantem Druck ist <M>{t`q_{\mathrm{sys}}`}</M> gleich <M p=",">{t`\Delta H_{\mathrm{sys}}`}</M> also <M p=".">{t`\Delta S_{\mathrm{surr}} = -\Delta H_{\mathrm{sys}}/T`}</M></li>
              <li>Zahlen: <M>{t`92{,}4\ \mathrm{kJ} = 92\,400\ \mathrm{J}`}</M> und <M p=".">{t`92\,400\ \mathrm{J}/298\ \mathrm{K} \approx 310\ \mathrm{J/K}`}</M> Das Minus aus <M>{t`-\Delta H`}</M> und das Minus von <M>{t`\Delta H < 0`}</M> ergeben ein Plus.</li>
              <li>Beide Entropien addieren: <M p=".">{t`-199 + 310 = +111`}</M> Das Universum gewinnt Entropie, die Reaktion läuft.</li>
            </ol>
            <p>Die Reaktion macht das System also ordentlicher und bezahlt dafür mit Wärme, die die Umgebung unordentlicher macht. Die Umgebung gewinnt mehr, als das System verliert.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the calculation:</b></p>
            <ol className="keep">
              <li><b>The system</b> is the reaction itself: <M p=".">{t`\Delta S_{\mathrm{sys}} = -199\ \mathrm{J\,mol^{-1}K^{-1}}`}</M> The system becomes more ordered, its entropy falls.</li>
              <li><b>The surroundings</b> are everything around it (air, vessel). The reaction gives off heat: <M p=".">{t`\Delta H^\circ_{\mathrm{rxn}} = -92.4\ \mathrm{kJ\,mol^{-1}}`}</M> This heat goes into the surroundings: <M p=".">{t`q_{\mathrm{surr}} = -q_{\mathrm{sys}}`}</M></li>
              <li>Heat in the surroundings brings entropy: <M p=".">{t`\Delta S_{\mathrm{surr}} = q_{\mathrm{surr}}/T`}</M> At constant pressure <M>{t`q_{\mathrm{sys}}`}</M> equals <M p=",">{t`\Delta H_{\mathrm{sys}}`}</M> so <M p=".">{t`\Delta S_{\mathrm{surr}} = -\Delta H_{\mathrm{sys}}/T`}</M></li>
              <li>Numbers: <M>{t`92.4\ \mathrm{kJ} = 92{,}400\ \mathrm{J}`}</M> and <M p=".">{t`92{,}400\ \mathrm{J}/298\ \mathrm{K} \approx 310\ \mathrm{J/K}`}</M> The minus sign in <M>{t`-\Delta H`}</M> and the minus sign of <M>{t`\Delta H < 0`}</M> make a plus.</li>
              <li>Add both entropies: <M p=".">{t`-199 + 310 = +111`}</M> The universe gains entropy, the reaction runs.</li>
            </ol>
            <p>So the reaction makes the system more ordered and pays for it with heat that makes the surroundings less ordered. The surroundings gain more than the system loses.</p>
          </>}
        />
        <Box kind="supplement" title={<T de="Warum durch T geteilt wird" en="Why we divide by T" />}>
          <T
            de={<p>Bild: Ein Löffel heisses Wasser in einem kalten Zimmer bringt viel Unordnung ins Zimmer. Derselbe Löffel in einer heissen Sauna fällt kaum auf. Gleiche Wärme, aber in der kalten Umgebung steigt die Entropie stärker. Darum steht <M>T</M> im Nenner von <M p=".">{t`\Delta S_{\mathrm{surr}} = q_{\mathrm{surr}}/T`}</M></p>}
            en={<p>Picture: a spoonful of hot water in a cold room adds a lot of disorder to the room. The same spoonful in a hot sauna hardly matters. The same heat, but the entropy rises more in the cold surroundings. That is why <M>T</M> is in the denominator of <M p=".">{t`\Delta S_{\mathrm{surr}} = q_{\mathrm{surr}}/T`}</M></p>}
          />
        </Box>
        <T
          de={<p>Das Bild zeigt die Entropie-Bilanz derselben Reaktion. Schiebe die Temperatur. Je wärmer die Umgebung, desto weniger Entropie bringt dieselbe Wärme, und bei hohen Temperaturen kippt die Bilanz.</p>}
          en={<p>The figure shows the entropy budget of the same reaction. Move the temperature. The warmer the surroundings, the less entropy the same heat brings, and at high temperatures the budget tips over.</p>}
        />
        <EntropyBudget />
        <T
          de={<p>Die Rechnung mit zwei Entropien funktioniert, aber sie ist umständlich. Wir bräuchten zwei Tabellen und müssten jedes Mal Umgebung und System getrennt buchführen. Das geht besser.</p>}
          en={<p>The calculation with two entropies works, but it is clumsy. We would need two tables and would have to keep separate books for system and surroundings every time. There is a better way.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="gibbs" title={<T de={<>3. Die Gibbs-Energie <M>{t`G = H - TS`}</M></>} en={<>3. The Gibbs free energy <M>{t`G = H - TS`}</M></>} />}>
        <Box kind="lecture" src={<Src lec={5} p="25" />} title={<T de="Gibbs-Energie (Gibbs Free Energy)" en="Gibbs free energy" />}>
          <T
            de={<p>«Um das bessere Kriterium zu finden, führen wir eine weitere wichtige Zustandsfunktion ein.» Handschriftlich am Rand: «Auf Deutsch: <De en="Gibbs energy">Gibbs-Energie</De> oder «<De en="free enthalpy">freie Enthalpie</De>»; spontane Vorgänge senken die Energie und/oder erhöhen die Unordnung.»</p>}
            en={<p>“To find this better criterion, we need to introduce another key state function.” Handwritten in the margin: “<span lang="de">Auf Deutsch: «Gibbs-Energie» oder «freie Enthalpie»</span>; spontaneous processes decrease energy and/or increase disorder.”</p>}
          />
          <T
            de={<p><b>Gibbs-Energie:</b> Die Spontanität wird getrieben durch Senken von <M>H</M> oder Erhöhen von <M p=".">S</M> «Kombinieren wir: <M p="»">{t`G \equiv H - TS`}</M> Warum?</p>}
            en={<p><b>Gibbs free energy:</b> spontaneity is driven by lowering <M>H</M> or increasing <M p=".">S</M> “Let’s combine: <M p=".">{t`G \equiv H - TS`}</M> Why?”</p>}
          />
          <MD>{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} + \Delta S_{\mathrm{surr}} = \Delta S_{\mathrm{sys}} + \frac{-\Delta H_{\mathrm{sys}}}{T} ${CONST}`}</MD>
          <T de={<p>«Multipliziere mit <M p=":">{t`-T`}</M></p>} en={<p>“Multiply by <M p=":">{t`-T`}</M></p>} />
          <MD>{t`-T\,\Delta S_{\mathrm{univ}} = \Delta H_{\mathrm{sys}} - T\,\Delta S_{\mathrm{sys}}`}</MD>
          <T de={<p>«Bei konstantem <M p=":">T</M> Vergleiche!»</p>} en={<p>“At constant <M p=":">T</M> Compare!”</p>} />
          <MD>{t`\Delta G_{\mathrm{sys}} = \Delta H_{\mathrm{sys}} - T\,\Delta S_{\mathrm{sys}}`}</MD>
          <T
            de={<p>«Ein spontaner Prozess verlangt <M p=".">{t`\Delta S_{\mathrm{univ}} > 0`}</M> Also …» (Handschriftlich: «da <M p="»).">{t`T > 0`}</M> Notiz: «Wir nennen <M>{t`\Delta G_{\mathrm{sys}}`}</M> einfach <M p=".">{t`\Delta G`}</M>» Josiah Willard Gibbs (1839–1903), Amerikaner, als Erster mit einem amerikanischen Doktorat in Ingenieurwissenschaften ausgezeichnet (1863).</p>}
            en={<p>“Spontaneous process requires <M p=".">{t`\Delta S_{\mathrm{univ}} > 0`}</M> Thus…” (handwritten: “since <M p=".">{t`T > 0`}</M>”). Note: “We call <M>{t`\Delta G_{\mathrm{sys}}`}</M> simply <M p=".">{t`\Delta G`}</M>” Josiah Willard Gibbs (1839–1903), American, first to be awarded an American doctorate in engineering (1863).</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Herleitung:</b></p>
            <ol className="keep">
              <li>Ausgangspunkt ist das alte Kriterium aus Abschnitt 2: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} + \Delta S_{\mathrm{surr}}`}</M></li>
              <li>Für die Umgebung setzen wir <M>{t`-\Delta H_{\mathrm{sys}}/T`}</M> ein. «Bei konstantem <M>T</M> und <M>P</M>» heisst: Die Reaktion läuft bei fester Temperatur und festem Druck, wie in einem offenen Reagenzglas.</li>
              <li>Jetzt kommt ein einfacher Trick: alles mal <M p=".">{t`-T`}</M> Das ist erlaubt, denn man darf beide Seiten einer Gleichung mit derselben Zahl malnehmen. Links steht dann <M p=",">{t`-T\,\Delta S_{\mathrm{univ}}`}</M> rechts <M p=".">{t`\Delta H_{\mathrm{sys}} - T\,\Delta S_{\mathrm{sys}}`}</M> Es steht nur noch das System da, die Umgebung ist verschwunden.</li>
              <li>Diese rechte Seite bekommt einen Namen, <M p=".">{t`\Delta G`}</M> Wir haben also <M p=".">{t`\Delta G = -T\,\Delta S_{\mathrm{univ}}`}</M></li>
              <li>Spontan heisst <M p=".">{t`\Delta S_{\mathrm{univ}} > 0`}</M> Weil <M>T</M> in Kelvin immer positiv ist, ist dann <M>{t`-T\,\Delta S_{\mathrm{univ}}`}</M> negativ. Das Vorzeichen dreht sich um: spontan heisst <M p=".">{t`\Delta G < 0`}</M></li>
            </ol>
            <p>Die Animation zeigt dieselben Schritte mit den Zahlen der Ammoniak-Synthese bei 298 K. Jeder Schritt zeigt am Ende genau das, was seine Beschriftung sagt.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the derivation:</b></p>
            <ol className="keep">
              <li>The starting point is the old criterion of section 2: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} + \Delta S_{\mathrm{surr}}`}</M></li>
              <li>For the surroundings we insert <M p=".">{t`-\Delta H_{\mathrm{sys}}/T`}</M> “At constant <M>T</M> and <M>P</M>” means: the reaction runs at fixed temperature and fixed pressure, like in an open test tube.</li>
              <li>Now comes a simple trick: multiply everything by <M p=".">{t`-T`}</M> That is allowed, because you may multiply both sides of an equation by the same number. On the left we then have <M p=",">{t`-T\,\Delta S_{\mathrm{univ}}`}</M> on the right <M p=".">{t`\Delta H_{\mathrm{sys}} - T\,\Delta S_{\mathrm{sys}}`}</M> Only the system is left, the surroundings have disappeared.</li>
              <li>This right-hand side gets a name, <M p=".">{t`\Delta G`}</M> So we have <M p=".">{t`\Delta G = -T\,\Delta S_{\mathrm{univ}}`}</M></li>
              <li>Spontaneous means <M p=".">{t`\Delta S_{\mathrm{univ}} > 0`}</M> Because <M>T</M> in kelvin is always positive, <M>{t`-T\,\Delta S_{\mathrm{univ}}`}</M> is then negative. The sign flips: spontaneous means <M p=".">{t`\Delta G < 0`}</M></li>
            </ol>
            <p>The animation shows the same steps with the numbers of the ammonia synthesis at 298 K. Each step ends with exactly what its caption says.</p>
          </>}
        />
        <GibbsDerivation />
        <Box kind="lecture" src={<Src lec={5} p="26" />} title={<T de="Gibbs-Energie: das Kriterium" en="Gibbs free energy: the criterion" />}>
          <MD>{t`G \equiv H - TS \;\Rightarrow\; \Delta G = \Delta H - T\,\Delta S ${CONST}`}</MD>
          <T
            de={<><p>Falls <M p=",">{t`\Delta G < 0`}</M> ist der Prozess spontan. Falls <M p=",">{t`\Delta G > 0`}</M> ist er nicht spontan (handschriftlich: «Man müsste Arbeit aufwenden, damit er abläuft»). Grauer Kasten: «Bequemeres Kriterium! <M>{t`\Delta G`}</M> betrifft nur das System.»</p>
              <p>Ausserdem: <M>{t`\Delta G < 0`}</M> heisst, der Prozess ist irreversibel; <M>{t`\Delta G = 0`}</M> heisst, er ist reversibel (bei konstantem <M p=",">T</M> <M p=").">P</M></p>
              <p>«Warum heisst <M>G</M> «freie» Energie?» «Man kann zeigen: Die maximale Arbeit, die man bei konstantem <M p=",">T</M> <M>P</M> aus einem Prozess gewinnen kann, ist <M p=".">{t`\Delta G`}</M>» Handschriftlich: «z. B. eine chemische Reaktion; <M p=",">{t`\Delta G = -w_{\max}`}</M> also sind Reaktionen mit stark negativem <M>{t`\Delta G`}</M> nützlich!»</p></>}
            en={<><p>If <M p=",">{t`\Delta G < 0`}</M> the process is spontaneous. If <M p=",">{t`\Delta G > 0`}</M> it is nonspontaneous (handwritten: “Work would be needed to make the process occur”). Grey box: “More convenient criterion! <M>{t`\Delta G`}</M> only relates to the system.”</p>
              <p>Also: <M>{t`\Delta G < 0`}</M> means the process is irreversible; <M>{t`\Delta G = 0`}</M> means it is reversible (at constant <M p=",">T</M> <M p=").">P</M></p>
              <p>“Why is <M>G</M> called ‘free’ energy?” “Can show that the maximum amount of work we can extract from a process at constant <M p=",">T</M> <M>P</M> is <M p=".">{t`\Delta G`}</M>” Handwritten: “e.g. a chemical reaction; <M p=",">{t`\Delta G = -w_{\max}`}</M> so reactions with large negative <M>{t`\Delta G`}</M> are useful!”</p></>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Regeln:</b></p>
            <ol className="keep">
              <li><M p=":">{t`\Delta G < 0`}</M> Die Reaktion läuft von selbst. Wie ein Ball, der bergab rollt. Aus dem Gefälle kann man sogar Arbeit holen, höchstens <M p=".">{t`-\Delta G`}</M></li>
              <li><M p=":">{t`\Delta G = 0`}</M> Gleichgewicht. Es geht in beide Richtungen gleich leicht, die Reaktion ist umkehrbar. Der Ball liegt auf der Ebene.</li>
              <li><M p=":">{t`\Delta G > 0`}</M> Von selbst läuft nichts. Wie bei einem Ball, den man bergauf schiebt, geht es nur, wenn man Arbeit hineinsteckt. Die Rückreaktion läuft aber von selbst.</li>
            </ol>
            <p>«Frei» heisst: frei verfügbar. Das ist der Teil der Reaktionsenergie, den man als Arbeit nutzen kann, etwa in einer Batterie. Der Rest geht an die Unordnung.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the rules:</b></p>
            <ol className="keep">
              <li><M p=":">{t`\Delta G < 0`}</M> the reaction runs by itself. Like a ball rolling downhill. You can even get work out of the slope, at most <M p=".">{t`-\Delta G`}</M></li>
              <li><M p=":">{t`\Delta G = 0`}</M> equilibrium. It goes both ways equally easily, the reaction is reversible. The ball lies on level ground.</li>
              <li><M p=":">{t`\Delta G > 0`}</M> nothing runs by itself. Like pushing a ball uphill, it only works if you put in work. The reverse reaction, however, runs by itself.</li>
            </ol>
            <p>“Free” means freely available. It is the part of the reaction energy that you can use as work, for instance in a battery. The rest goes to disorder.</p>
          </>}
        />
        <GibbsSigns />
        <Box kind="uebung" src={<Src ex={5} p="9" />} title={<T de="Gibbs-Energie in der Übung" en="Gibbs free energy in the exercise class" />}>
          <T
            de={<p>«Die Entropie von System und Umgebung auszurechnen, um die Spontanität zu bestimmen, ist mühsam. Darum benutzen wir die Gibbs-Energie. Die Enthalpie steht für die gesamte Energie im System. <M>G</M> ist der Teil dieser Energie, der tatsächlich Arbeit leisten kann, manchmal «nützliche Energie» genannt, und damit ein Kriterium für die Spontanität.» <M>{t`\Delta G_{\mathrm{sys}} = \Delta H_{\mathrm{sys}} - T\cdot\Delta S_{\mathrm{sys}}`}</M> und <M>G</M> ist eine Zustandsfunktion. «Das Minus berücksichtigt die Abnahme der Energie, die für Arbeit zur Verfügung steht, wenn sich Energie verteilt (<M p=").">{t`\Delta S_{\mathrm{sys}} > 0`}</M>»</p>}
            en={<p>“Having to calculate <M>{t`\Delta S_{\mathrm{sys}}`}</M> and <M>{t`\Delta S_{\mathrm{surr}}`}</M> to determine if a process is spontaneous is tedious, which is why we use a concept called Gibbs free energy. Enthalpy represents the total energy in the system. <M>G</M> is the portion of that energy that can actually be used to do work, sometimes called ‘useful energy’, so a criterion for spontaneity.” <M>{t`\Delta G_{\mathrm{sys}} = \Delta H_{\mathrm{sys}} - T\cdot\Delta S_{\mathrm{sys}}`}</M> and <M>G</M> is a state function. “The minus accounts for the decrease in energy that is available to do work when energy spreads out (<M p=").">{t`\Delta S_{\mathrm{sys}} > 0`}</M>”</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\Delta S_{\mathrm{sys}} < 0`}</M> heisst: Die Reaktion läuft nicht»</>} en={<>“<M>{t`\Delta S_{\mathrm{sys}} < 0`}</M> means the reaction does not run”</>} />}>
          <T
            de={<p>Die Ammoniak-Synthese hat <M p=",">{t`\Delta S_{\mathrm{sys}} = -199\ \mathrm{J\,mol^{-1}K^{-1}}`}</M> läuft aber bei 298 K von selbst. Das System wird ordentlicher, aber die Wärme macht die Umgebung unordentlicher. Zählt man beides zusammen, steht ein Plus.</p>}
            en={<p>The ammonia synthesis has <M p=",">{t`\Delta S_{\mathrm{sys}} = -199\ \mathrm{J\,mol^{-1}K^{-1}}`}</M> but runs by itself at 298 K. The system becomes more ordered, but the heat makes the surroundings less ordered. Count both together and the result is a plus.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Spontan heisst schnell»" en="“Spontaneous means fast”" />}>
          <T
            de={<p>Nein. Die Folie sagt es ausdrücklich: Ein positives <M>{t`\Delta S_{\mathrm{univ}}`}</M> (und damit <M p=")">{t`\Delta G < 0`}</M> sagt nicht, wie schnell die Reaktion abläuft. «Spontan» heisst nur: Sie darf von selbst ablaufen. Ob sie in einer Sekunde oder in Jahren fertig ist, sagt <M>{t`\Delta G`}</M> nicht.</p>}
            en={<p>No. The slide says it explicitly: a positive <M>{t`\Delta S_{\mathrm{univ}}`}</M> (and so <M p=")">{t`\Delta G < 0`}</M> does not tell how fast the reaction runs. “Spontaneous” only means: it is allowed to run by itself. Whether it finishes in a second or in years, <M>{t`\Delta G`}</M> does not say.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\Delta G = 0`}</M> heisst: Es passiert nichts»</>} en={<>“<M>{t`\Delta G = 0`}</M> means nothing happens”</>} />}>
          <T
            de={<p>Bei <M>{t`\Delta G = 0`}</M> ist der Prozess reversibel: Es geht in beide Richtungen gleich leicht (Gleichgewicht). Es passiert durchaus etwas, nur gibt es keinen Gewinner mehr, der Prozess hat keine Richtung.</p>}
            en={<p>At <M>{t`\Delta G = 0`}</M> the process is reversible: it goes both ways equally easily (equilibrium). Things do happen, but there is no winner any more; the process has no direction.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="tabellen" title={<T de={<>4. <M>{t`\Delta G`}</M> aus Tabellen: <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M></>} en={<>4. <M>{t`\Delta G`}</M> from tables: <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M></>} />}>
        <Box kind="lecture" src={<Src lec={5} p="27–28" />} title={<T de="Standard-Bildungsenergie und Zusammenfassung" en="Standard free energy of formation and summary" />}>
          <T
            de={<p>«Wie <M>{t`\Delta H^\circ_{\mathrm{f}}`}</M> können wir <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M> definieren:» die Änderung der Gibbs-Energie, wenn ein Stoff unter Standardbedingungen (1 atm und 25 °C) aus seinen Elementen entsteht. <M>{t`\Delta G^\circ_{\mathrm{f}} = 0`}</M> für Elemente in ihrem Standardzustand. Andere Werte stehen in Tabellen (Anhang C im Brown). «Mit den <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M>-Werten können wir <M>{t`\Delta G^\circ_{\mathrm{rxn}}`}</M> für jede Reaktion bestimmen.»</p>}
            en={<p>“Like <M p=",">{t`\Delta H^\circ_{\mathrm{f}}`}</M> we can define <M p=":">{t`\Delta G^\circ_{\mathrm{f}}`}</M>” the free-energy change to form a substance from its elements under standard conditions (1 atm and 25 °C). <M>{t`\Delta G^\circ_{\mathrm{f}} = 0`}</M> for elements in their standard state. Other values are found in tables (Appendix C in Brown). “We can use the <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M> values to determine <M>{t`\Delta G^\circ_{\mathrm{rxn}}`}</M> for any reaction.”</p>}
          />
          <T de={<p>Zusammenfassung (Folie 28), für <M p=":">{t`a_1 R_1 + \cdots \to b_1 P_1 + \cdots`}</M></p>} en={<p>Summary (slide 28), for <M p=":">{t`a_1 R_1 + \cdots \to b_1 P_1 + \cdots`}</M></p>} />
          <Recipe rows={[
            [t`\Delta H^\circ_{\mathrm{rxn}}`, t`\Delta H^\circ_{\mathrm{f},j}`, t`\Delta H^\circ_{\mathrm{f},i}`],
            [t`\Delta S^\circ`, t`S^\circ_j`, t`S^\circ_i`],
            [t`\Delta G^\circ_{\mathrm{rxn}}`, t`\Delta G^\circ_{\mathrm{f},j}`, t`\Delta G^\circ_{\mathrm{f},i}`],
          ]} />
          <T de={<p>«Hol <M p=",">{t`\Delta H^\circ_{\mathrm{f}}`}</M> <M p=",">{t`S^\circ`}</M> <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M> aus Tabellen.»</p>} en={<p>“Get <M p=",">{t`\Delta H^\circ_{\mathrm{f}}`}</M> <M p=",">{t`S^\circ`}</M> <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M> values from tables.”</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M> ist die «Bildungsenergie» von einem Mol eines Stoffs aus den Elementen. Die Elemente selbst sind der Nullpunkt, genau wie bei <M p=".">{t`\Delta H^\circ_{\mathrm{f}}`}</M> Die kleine <M>{t`^\circ`}</M> heisst «Standardbedingungen». Das Rezept für <M>{t`\Delta G^\circ_{\mathrm{rxn}}`}</M> ist dasselbe wie für <M p=",">{t`\Delta H^\circ_{\mathrm{rxn}}`}</M> und fast dasselbe wie für <M p=":">{t`\Delta S^\circ`}</M> Produkte minus Edukte, jeder Stoff mal seinen Koeffizienten. Drei Grössen, ein Rezept, drei Tabellenspalten.</p>
            <p>Probiere es im Bild aus. Oben links schaltest du zwischen den drei Grössen um. Dieselbe Reaktion, dasselbe Rezept:</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b> <M>{t`\Delta G^\circ_{\mathrm{f}}`}</M> is the “formation energy” of one mole of a substance from the elements. The elements themselves are the zero point, just as for <M p=".">{t`\Delta H^\circ_{\mathrm{f}}`}</M> The small <M>{t`^\circ`}</M> means “standard conditions”. The recipe for <M>{t`\Delta G^\circ_{\mathrm{rxn}}`}</M> is the same as for <M p=",">{t`\Delta H^\circ_{\mathrm{rxn}}`}</M> and almost the same as for <M p=":">{t`\Delta S^\circ`}</M> products minus reactants, each substance times its coefficient. Three quantities, one recipe, three table columns.</p>
            <p>Try it in the figure. At the top you switch between the three quantities. The same reaction, the same recipe:</p>
          </>}
        />
        <ReactionLedger quantity="G" switchable initial="zno" />
        <Box kind="uebung" src={<Src ex={5} p="11–13" />} title={<T de={<>Aufgabe 6: <M>{t`\Delta G^\circ`}</M> mit Daten aus Anhang C</>} en={<>Problem 6: <M>{t`\Delta G^\circ`}</M> with data from Appendix C</>} />}>
          <T
            de={<p>«Berechne mit den Daten aus Anhang C <M>{t`\Delta G^\circ`}</M> für die folgenden Reaktionen. Gib an, ob jede Reaktion bei 298 K unter Standardbedingungen spontan ist.»</p>}
            en={<p>“Using data from Appendix C, calculate <M>{t`\Delta G^\circ`}</M> for the following reactions. Indicate whether each reaction is spontaneous at 298 K under standard conditions.”</p>}
          />
          <T de={<p>(a) <C p=":">{'2 Zn(s) + O2(g) -> 2 ZnO(s)'}</C></p>} en={<p>(a) <C p=":">{'2 Zn(s) + O2(g) -> 2 ZnO(s)'}</C></p>} />
          <MD>{t`\Delta G^\circ_{\mathrm{rxn}} = -0 - 0 + 2\cdot\Delta G^\circ_{\mathrm{f,ZnO}} = 2\cdot(-318{,}2) = -636{,}4\ \mathrm{kJ\,mol^{-1}} < 0`}</MD>
          <T de={<p>Spontan. (Zn und <C>{'O2'}</C> sind Elemente: <M p=".)">{t`\Delta G^\circ_{\mathrm{f}} = 0`}</M></p>} en={<p>Spontaneous. (Zn and <C>{'O2'}</C> are elements: <M p=".)">{t`\Delta G^\circ_{\mathrm{f}} = 0`}</M></p>} />
          <T de={<p>(b) <C p=":">{'2 NaBr(s) -> 2 Na(g) + Br2(g)'}</C></p>} en={<p>(b) <C p=":">{'2 NaBr(s) -> 2 Na(g) + Br2(g)'}</C></p>} />
          <MD>{t`\Delta G^\circ_{\mathrm{rxn}} = -2\,\Delta G^\circ_{\mathrm{f,NaBr}} + 2\,\Delta G^\circ_{\mathrm{f,Na(g)}} + \Delta G^\circ_{\mathrm{f,Br_2}} > 0`}</MD>
          <T
            de={<p>Nicht spontan. Mit den Werten der Tabelle, <M p=",">{t`-349{,}3`}</M> <M>{t`77{,}3`}</M> und <M p=",">{t`3{,}14`}</M> ergibt das <M p=".">{t`-2\cdot(-349{,}3) + 2\cdot 77{,}3 + 3{,}14 = 856{,}3\ \mathrm{kJ\,mol^{-1}}`}</M> Auf der Folie steht handschriftlich <M>{t`848{,}3`}</M> (CH-501); die Aussage «nicht spontan» bleibt gleich.</p>}
            en={<p>Nonspontaneous. With the table values, <M p=",">{t`-349.3`}</M> <M>{t`77.3`}</M> and <M p=",">{t`3.14`}</M> this gives <M p=".">{t`-2\cdot(-349.3) + 2\cdot 77.3 + 3.14 = 856.3\ \mathrm{kJ\,mol^{-1}}`}</M> The slide has <M>{t`848.3`}</M> handwritten (CH-501); the conclusion “nonspontaneous” stays the same.</p>}
          />
          <T
            de={<p>Aus <M p=",">{t`\Delta G = \Delta H - T\,\Delta S`}</M> kann man <M>{t`\Delta G^\circ_{\mathrm{rxn}}`}</M> auch so schreiben:</p>}
            en={<p>From <M p=",">{t`\Delta G = \Delta H - T\,\Delta S`}</M> one can also write <M>{t`\Delta G^\circ_{\mathrm{rxn}}`}</M> like this:</p>}
          />
          <Route />
        </Box>
        <T
          de={<p>Beide Wege müssen dasselbe liefern. Prüfe es an der Ammoniak-Synthese: Aus <M>{t`\Delta H = -92{,}4\ \mathrm{kJ}`}</M> und <M>{t`\Delta S = -199\ \mathrm{J/K}`}</M> folgt <M p=".">{t`\Delta G = -92{,}4 + 298\cdot 0{,}199 = -33{,}1\ \mathrm{kJ}`}</M> Aus der Tabelle: <M p=".">{t`2\cdot(-16{,}66) = -33{,}3\ \mathrm{kJ}`}</M> Der kleine Unterschied kommt von den gerundeten Zahlen. Beachte, dass <M>{t`0{,}199`}</M> hier in <M>{t`\mathrm{kJ/K}`}</M> steht: Man muss <M>{t`\Delta S`}</M> von Joule in Kilojoule umrechnen, bevor man es von <M>{t`\Delta H`}</M> abzieht.</p>}
          en={<p>Both ways must give the same result. Check it for the ammonia synthesis: from <M>{t`\Delta H = -92.4\ \mathrm{kJ}`}</M> and <M>{t`\Delta S = -199\ \mathrm{J/K}`}</M> follows <M p=".">{t`\Delta G = -92.4 + 298\cdot 0.199 = -33.1\ \mathrm{kJ}`}</M> From the table: <M p=".">{t`2\cdot(-16.66) = -33.3\ \mathrm{kJ}`}</M> The small difference comes from rounded numbers. Note that <M>{t`0.199`}</M> is in <M>{t`\mathrm{kJ/K}`}</M> here: you have to convert <M>{t`\Delta S`}</M> from joules to kilojoules before subtracting it from <M p=".">{t`\Delta H`}</M></p>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`\Delta H`}</M> und <M>{t`\Delta S`}</M> direkt subtrahieren»</>} en={<>“Subtract <M>{t`\Delta H`}</M> and <M>{t`\Delta S`}</M> directly”</>} />}>
          <T
            de={<p><M>{t`\Delta H`}</M> steht in Kilojoule, <M>{t`\Delta S`}</M> in Joule pro Kelvin. In <M>{t`\Delta H - T\,\Delta S`}</M> müssen beide in derselben Einheit stehen. Rechne <M>{t`\Delta S`}</M> durch <M>{t`1000`}</M> (Joule in Kilojoule) um, oder <M>{t`\Delta H`}</M> mal <M p=".">{t`1000`}</M> Sonst ist das Ergebnis um den Faktor <M>{t`1000`}</M> falsch.</p>}
            en={<p><M>{t`\Delta H`}</M> is in kilojoules, <M>{t`\Delta S`}</M> in joules per kelvin. In <M>{t`\Delta H - T\,\Delta S`}</M> both must be in the same unit. Divide <M>{t`\Delta S`}</M> by <M>{t`1000`}</M> (joules to kilojoules), or multiply <M>{t`\Delta H`}</M> by <M p=".">{t`1000`}</M> Otherwise the result is wrong by a factor of <M p=".">{t`1000`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="temperatur" title={<T de="5. Die Temperatur entscheidet" en="5. Temperature decides" />}>
        <Box kind="lecture" src={<><Src lec={5} p="29" />, <Src lec={6} p="5" /></>} title={<T de="Bedeutung der Temperatur" en="Importance of temperature" />}>
          <T
            de={<p><M>{t`\Delta G = \Delta H - T\,\Delta S`}</M> – spontan für <M p=".">{t`\Delta G < 0`}</M> «<M>{t`\Delta G`}</M> hängt von der Temperatur ab. Wie beeinflusst <M>T</M> die Spontanität einer Reaktion?»</p>}
            en={<p><M>{t`\Delta G = \Delta H - T\,\Delta S`}</M> – spontaneous for <M p=".">{t`\Delta G < 0`}</M> “<M>{t`\Delta G`}</M> depends on temperature, so how does <M>T</M> affect spontaneity of reaction?”</p>}
          />
          <div className="gb-table-wrap">
            <table className="gb-table">
              <thead>
                <tr>
                  <th />
                  <th><M>{t`\Delta H`}</M></th><th><M>{t`\Delta S`}</M></th><th><M>{t`-T\,\Delta S`}</M></th><th><M>{t`\Delta G = \Delta H - T\,\Delta S`}</M></th>
                  <th><T de="Eigenschaft der Reaktion" en="Reaction characteristics" /></th>
                </tr>
              </thead>
              <tbody>
                <tr><th>1</th><td><M>-</M></td><td><M>+</M></td><td><M>-</M></td><td><M>-</M></td><td><T de="spontan bei allen Temperaturen" en="Spontaneous at all temperatures" /></td></tr>
                <tr><th>2</th><td><M>+</M></td><td><M>-</M></td><td><M>+</M></td><td><M>+</M></td><td><T de="nicht spontan bei allen Temperaturen" en="Nonspontaneous at all temperatures" /></td></tr>
                <tr><th>3</th><td><M>-</M></td><td><M>-</M></td><td><M>+</M></td><td><T de={<M>{t`+\ \text{oder}\ -`}</M>} en={<M>{t`+\ \text{or}\ -`}</M>} /></td><td><T de={<>spontan bei tiefem <M p=",">T</M> nicht spontan bei hohem <M>T</M></>} en={<>Spontaneous at low <M p=";">T</M> nonspontaneous at high <M>T</M></>} /></td></tr>
                <tr><th>4</th><td><M>+</M></td><td><M>+</M></td><td><M>-</M></td><td><T de={<M>{t`+\ \text{oder}\ -`}</M>} en={<M>{t`+\ \text{or}\ -`}</M>} /></td><td><T de={<>spontan bei hohem <M p=",">T</M> nicht spontan bei tiefem <M>T</M></>} en={<>Spontaneous at high <M p=";">T</M> nonspontaneous at low <M>T</M></>} /></td></tr>
              </tbody>
            </table>
          </div>
          <T de={<p>Beispiele:</p>} en={<p>Examples:</p>} />
          <ul>
            <li><T de="Bsp. 1: " en="Ex 1: " /><C>{'2 O3(g) -> 3 O2(g)'}</C> <T de="– Spontanität begünstigt durch Enthalpie und Entropie" en="– spontaneity favored by both enthalpy and entropy" /></li>
            <li><T de="Bsp. 2: " en="Ex 2: " /><C>{'3 O2(g) -> 2 O3(g)'}</C> <T de="– von keinem von beiden begünstigt" en="– favored by neither enthalpy nor entropy" /></li>
            <li><T de="Bsp. 3: " en="Ex 3: " /><C>{'H2O(l) -> H2O(s)'}</C> <T de="– nur von der Enthalpie begünstigt" en="– favored only by enthalpy" /></li>
            <li><T de="Bsp. 4: " en="Ex 4: " /><C>{'H2O(s) -> H2O(l)'}</C> <T de="– nur von der Entropie begünstigt" en="– favored only by entropy" /></li>
          </ul>
          <T
            de={<p>Handschriftlich: «Der Term <M>{t`-T\,\Delta S`}</M> wird mit steigendem <M>T</M> immer negativer. Irgendwann ist eine Temperatur erreicht, bei der <M>{t`-T\,\Delta S`}</M> ein <M>{t`\Delta H > 0`}</M> ausgleicht. Dann schmilzt das Eis! Alles Thermodynamik.»</p>}
            en={<p>Handwritten: “The <M>{t`-T\,\Delta S`}</M> term becomes increasingly negative as <M>T</M> goes up. Eventually, a temperature is reached where <M>{t`-T\,\Delta S`}</M> compensates for <M p=".">{t`\Delta H > 0`}</M> That’s when the ice melts! It’s all thermodynamics.”</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Tabelle:</b> Zwei Dinge treiben <M p=":">{t`\Delta G`}</M> <M>{t`\Delta H`}</M> und <M p=".">{t`-T\,\Delta S`}</M> Beide wollen negativ sein.</p>
            <ol className="keep">
              <li><M>{t`\Delta H < 0`}</M> (Wärme wird frei) hilft. <M>{t`\Delta S > 0`}</M> (mehr Unordnung) macht <M>{t`-T\,\Delta S`}</M> negativ und hilft auch.</li>
              <li>Zeile 1: beide helfen, also <M>{t`\Delta G < 0`}</M> bei jeder Temperatur. Zeile 2: beide stören, <M>{t`\Delta G > 0`}</M> bei jeder Temperatur.</li>
              <li>Zeilen 3 und 4: Einer hilft, einer stört. Dann gewinnt, wer mehr Gewicht hat. Der Entropie-Term <M>{t`-T\,\Delta S`}</M> hat den Faktor <M p=",">T</M> er wird bei hoher Temperatur wichtiger. Tief gewinnt die Enthalpie, hoch die Entropie.</li>
            </ol>
            <p>Das Bild zeigt <M>{t`\Delta G`}</M> als Funktion von <M p=".">T</M> Es ist eine gerade Linie: Sie startet bei <M>{t`T = 0`}</M> auf der Höhe <M>{t`\Delta H`}</M> und hat die Steigung <M p=".">{t`-\Delta S`}</M> Wo die Linie unter der Nulllinie liegt (das Feld ist getönt), ist die Reaktion spontan. Probier alle vier Zeilen der Tabelle aus: Die Knöpfe haben die Beispiele der Folie, und die Zahl am Knopf ist die Zeile.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the table:</b> Two things drive <M p=":">{t`\Delta G`}</M> <M>{t`\Delta H`}</M> and <M p=".">{t`-T\,\Delta S`}</M> Both want to be negative.</p>
            <ol className="keep">
              <li><M>{t`\Delta H < 0`}</M> (heat is released) helps. <M>{t`\Delta S > 0`}</M> (more disorder) makes <M>{t`-T\,\Delta S`}</M> negative and helps too.</li>
              <li>Row 1: both help, so <M>{t`\Delta G < 0`}</M> at every temperature. Row 2: both hurt, <M>{t`\Delta G > 0`}</M> at every temperature.</li>
              <li>Rows 3 and 4: one helps, one hurts. Then the one with more weight wins. The entropy term <M>{t`-T\,\Delta S`}</M> has the factor <M p=",">T</M> so it matters more at high temperature. Low: enthalpy wins. High: entropy wins.</li>
            </ol>
            <p>The figure shows <M>{t`\Delta G`}</M> as a function of <M p=".">T</M> It is a straight line: it starts at <M>{t`T = 0`}</M> at height <M>{t`\Delta H`}</M> and has slope <M p=".">{t`-\Delta S`}</M> Where the line lies below the zero line (the field is tinted), the reaction is spontaneous. Try all four rows of the table: the buttons carry the examples of the slide, and the number on the button is the row.</p>
          </>}
        />
        <GibbsExplorer initial="nh3" />
        <Box kind="uebung" src={<Src ex={5} p="9–10" />} title={<T de="Wann ist eine Reaktion spontan?" en="When is a reaction spontaneous?" />}>
          <T
            de={<p>Die Tabelle der Folie in anderer Reihenfolge (die Übung nummeriert die Zeilen ④ ① ③ ②, in der Reihenfolge der Tabelle). Skizze: <M>{t`\Delta G`}</M> gegen <M p=",">T</M> gerade Linien, die bei <M>{t`\Delta H`}</M> auf der senkrechten Achse beginnen. Rote Linien: negative Steigung, <M p=";">{t`\Delta S > 0`}</M> grüne Linien: positive Steigung, <M p=".">{t`\Delta S < 0`}</M> Über der <M>T</M>-Achse (<M p=")">{t`\Delta G > 0`}</M> nicht spontan, darunter (<M p=")">{t`\Delta G < 0`}</M> spontan. Auf der Achse selbst ist <M p=".">{t`\Delta G = 0`}</M> «Die Temperatur, bei der eine spontane Reaktion nicht spontan wird (oder umgekehrt), findet man, indem man <M>{t`\Delta G = 0`}</M> setzt.»</p>}
            en={<p>The table of the slide in another order (the exercise class numbers the rows ④ ① ③ ②, in the order of the table). Sketch: <M>{t`\Delta G`}</M> against <M p=",">T</M> straight lines starting at <M>{t`\Delta H`}</M> on the vertical axis. Red lines: negative slope, <M p=";">{t`\Delta S > 0`}</M> green lines: positive slope, <M p=".">{t`\Delta S < 0`}</M> Above the <M>T</M> axis (<M p=")">{t`\Delta G > 0`}</M> nonspontaneous, below (<M p=")">{t`\Delta G < 0`}</M> spontaneous. On the axis itself <M p=".">{t`\Delta G = 0`}</M> “We can find the temperature at which a spontaneous reaction turns non-spontaneous or vice-versa by setting <M p=".">{t`\Delta G = 0`}</M>”</p>}
          />
          <T
            de={<p>Aufgabe 5 (zusammen): Eis, das zu Wasser schmilzt, ist endotherm, also <M p=".">{t`\Delta H > 0`}</M> <M>{t`\Delta G = \Delta H - T\,\Delta S`}</M> Der Vorgang ist spontan, wenn <M p=",">{t`\Delta G < 0`}</M> also wenn die Temperatur hoch ist.</p>}
            en={<p>Problem 5 (together): ice melting to water is endothermic, so <M p=".">{t`\Delta H > 0`}</M> <M>{t`\Delta G = \Delta H - T\,\Delta S`}</M> The process is spontaneous if <M p=",">{t`\Delta G < 0`}</M> so if the temperature is high.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So findet man die Umschalttemperatur:</b></p>
            <ol>
              <li>An der Grenze ist <M p=".">{t`\Delta G = 0`}</M> Also: <M p=".">{t`\Delta H - T\,\Delta S = 0`}</M></li>
              <li>Bringe <M>{t`T\,\Delta S`}</M> auf die andere Seite: <M p=".">{t`\Delta H = T\,\Delta S`}</M></li>
              <li>Teile durch <M p=":">{t`\Delta S`}</M> <M p=".">{t`T = \Delta H/\Delta S`}</M> Das ist die Stelle, wo die Linie im Bild die Nulllinie schneidet (der rote Punkt <M p=").">{t`T_{\mathrm{c}}`}</M></li>
              <li>Das gibt nur dann eine Temperatur, wenn <M>{t`\Delta H`}</M> und <M>{t`\Delta S`}</M> dasselbe Vorzeichen haben, also in den Zeilen 3 und 4. In den Zeilen 1 und 2 wäre <M>T</M> negativ, und das gibt es bei Kelvin nicht.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to find the switching temperature:</b></p>
            <ol>
              <li>At the boundary <M p=".">{t`\Delta G = 0`}</M> So: <M p=".">{t`\Delta H - T\,\Delta S = 0`}</M></li>
              <li>Move <M>{t`T\,\Delta S`}</M> to the other side: <M p=".">{t`\Delta H = T\,\Delta S`}</M></li>
              <li>Divide by <M p=":">{t`\Delta S`}</M> <M p=".">{t`T = \Delta H/\Delta S`}</M> This is where the line in the figure crosses the zero line (the red dot <M p=").">{t`T_{\mathrm{c}}`}</M></li>
              <li>This gives a temperature only if <M>{t`\Delta H`}</M> and <M>{t`\Delta S`}</M> have the same sign, so in rows 3 and 4. In rows 1 and 2, <M>T</M> would be negative, and that does not exist in kelvin.</li>
            </ol>
          </>}
        />
        <Box kind="uebung" src={<Src ex={5} p="13" />} title={<T de="Aufgabe 7: Umschalttemperatur" en="Problem 7: switching temperature" />}>
          <T
            de={<p>«(a) Berechne aus den Werten für <M>{t`\Delta H^\circ`}</M> und <M>{t`\Delta S^\circ`}</M> die Grösse <M>{t`\Delta G^\circ`}</M> für die folgende Reaktion bei 298 K. (b) Bei welcher Temperatur (falls überhaupt) wird die Reaktion spontan oder nicht spontan?»</p>}
            en={<p>“(a) From the values given for <M>{t`\Delta H^\circ`}</M> and <M p=",">{t`\Delta S^\circ`}</M> calculate <M>{t`\Delta G^\circ`}</M> for the following reaction at 298 K. (b) At what temperature (if any) would the reaction become spontaneous or non-spontaneous?”</p>}
          />
          <CD>{'2 PbS(s) + 3 O2(g) -> 2 PbO(s) + 2 SO2(g)'}</CD>
          <MD>{t`\Delta H^\circ = -844\ \mathrm{kJ}; \qquad \Delta S^\circ = -165\ \mathrm{J/K}`}</MD>
          <MD>{t`\text{(a)}\quad \Delta G^\circ = \Delta H^\circ - T\,\Delta S^\circ = -844\ \mathrm{kJ} + 298\ \mathrm{K}\cdot 0{,}165\ \mathrm{kJ/K} \approx -795\ \mathrm{kJ}`}</MD>
          <MD>{t`\text{(b)}\quad \Delta G^\circ = -844\ \mathrm{kJ} + 0{,}165\ \mathrm{kJ/K}\cdot T \overset{!}{=} 0 \;\Rightarrow\; T = \frac{844}{0{,}165}\ \mathrm{K} = 5115\ \mathrm{K}`}</MD>
          <T
            de={<p>Spontan bei 298 K (<M p=").">{t`\Delta G^\circ < 0`}</M> «Für <M>{t`T > 5115\ \mathrm{K}`}</M> ist die Reaktion nicht spontan.» Skizze: eine ansteigende Gerade, die bei <M>{t`\Delta H`}</M> beginnt, mit Marken bei 298 K und 5115 K.</p>}
            en={<p>Spontaneous at 298 K (<M p=").">{t`\Delta G^\circ < 0`}</M> “For <M>{t`T > 5115\ \mathrm{K}`}</M> the reaction is nonspontaneous.” Sketch: a rising straight line starting at <M p=",">{t`\Delta H`}</M> with marks at 298 K and 5115 K.</p>}
          />
        </Box>
        <T
          de={<p>Diese Aufgabe ist der Knopf «Übung 7» im Bild: ein negatives <M>{t`\Delta H`}</M> und ein negatives <M p=",">{t`\Delta S`}</M> also Zeile 3. Die Linie steigt, weil die Steigung <M>{t`-\Delta S`}</M> positiv ist. Sie kreuzt die Nulllinie erst weit rechts bei 5115 K; das Bild zoomt dazu automatisch heraus.</p>}
          en={<p>This problem is the button “Exercise 7” in the figure: a negative <M>{t`\Delta H`}</M> and a negative <M p=",">{t`\Delta S`}</M> so row 3. The line rises because the slope <M>{t`-\Delta S`}</M> is positive. It crosses the zero line only far to the right, at 5115 K; the figure zooms out automatically for that.</p>}
        />
        <Box kind="supplement" title={<T de="Woher die Zahlen im Bild stammen" en="Where the numbers in the figure come from" />}>
          <T
            de={<>
              <p>Die Folie 29 nennt keine Zahlen für ihre vier Beispiele. Damit die Linien im Bild echte Reaktionen zeigen, haben wir sie nachgerechnet.</p>
              <ul>
                <li><C>{'2 O3(g) -> 3 O2(g)'}</C>: Mit den Tabellenwerten von Anhang C ist <M>{t`\Delta H = -2\cdot 142{,}3 = -284{,}6\ \mathrm{kJ}`}</M> und <M p=".">{t`\Delta S = 3\cdot 205{,}0 - 2\cdot 237{,}6 = +139{,}8\ \mathrm{J/K}`}</M> Beide Zeichen helfen: Zeile 1. Die Rückreaktion <C>{'3 O2(g) -> 2 O3(g)'}</C> hat die umgekehrten Zeichen: Zeile 2.</li>
                <li>Wasser/Eis: Die Schmelzenthalpie von Eis beträgt <M>{t`6{,}01\ \mathrm{kJ\,mol^{-1}}`}</M> bei 273,15 K (Tabellenwert, nicht auf den Folien). Am Schmelzpunkt ist <M>{t`\Delta G = 0`}</M> also <M p=".">{t`\Delta S = 6010/273{,}15 \approx 22{,}0\ \mathrm{J\,mol^{-1}K^{-1}}`}</M> Gefrieren hat die umgekehrten Zeichen (Zeile 3), Schmelzen die Zeichen von oben (Zeile 4), und <M>{t`T = \Delta H/\Delta S`}</M> trifft genau die 273 K, bei denen Eis schmilzt.</li>
                <li><C>{'N2 + 3 H2 -> 2 NH3'}</C>: <M>{t`\Delta H = -92{,}4\ \mathrm{kJ}`}</M> und <M>{t`\Delta S = -199\ \mathrm{J/K}`}</M> von Folie 24. Das ist Zeile 3 mit <M p=".">{t`T_{\mathrm{c}} = 92\,400/199 \approx 464\ \mathrm{K}`}</M> Darum kippt die Entropie-Bilanz aus Abschnitt 2 genau bei dieser Temperatur.</li>
              </ul>
              <p>Alle Linien nehmen an, dass <M>{t`\Delta H`}</M> und <M>{t`\Delta S`}</M> nicht von der Temperatur abhängen. Das stimmt nur näherungsweise, denn die Zahlen gelten bei 298 K. Bei 5115 K (Übung 7) sind die festen Stoffe längst geschmolzen; dort ist die Zahl eine reine Rechenübung.</p>
            </>}
            en={<>
              <p>Slide 29 gives no numbers for its four examples. So that the lines in the figure show real reactions, we worked them out.</p>
              <ul>
                <li><C>{'2 O3(g) -> 3 O2(g)'}</C>: with the Appendix C values, <M>{t`\Delta H = -2\cdot 142.3 = -284.6\ \mathrm{kJ}`}</M> and <M p=".">{t`\Delta S = 3\cdot 205.0 - 2\cdot 237.6 = +139.8\ \mathrm{J/K}`}</M> Both signs help: row 1. The reverse reaction <C>{'3 O2(g) -> 2 O3(g)'}</C> has the opposite signs: row 2.</li>
                <li>Water/ice: the enthalpy of fusion of ice is <M>{t`6.01\ \mathrm{kJ\,mol^{-1}}`}</M> at 273.15 K (table value, not on the slides). At the melting point <M>{t`\Delta G = 0`}</M> so <M p=".">{t`\Delta S = 6010/273.15 \approx 22.0\ \mathrm{J\,mol^{-1}K^{-1}}`}</M> Freezing has the opposite signs (row 3), melting the signs above (row 4), and <M>{t`T = \Delta H/\Delta S`}</M> hits exactly the 273 K at which ice melts.</li>
                <li><C>{'N2 + 3 H2 -> 2 NH3'}</C>: <M>{t`\Delta H = -92.4\ \mathrm{kJ}`}</M> and <M>{t`\Delta S = -199\ \mathrm{J/K}`}</M> from slide 24. That is row 3 with <M p=".">{t`T_{\mathrm{c}} = 92{,}400/199 \approx 464\ \mathrm{K}`}</M> This is why the entropy budget of section 2 tips exactly at this temperature.</li>
              </ul>
              <p>All lines assume that <M>{t`\Delta H`}</M> and <M>{t`\Delta S`}</M> do not depend on temperature. That holds only approximately, since the numbers are valid at 298 K. At 5115 K (exercise 7) the solids have long since melted; there the number is a pure calculation exercise.</p>
            </>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Spontane Reaktionen sind immer exotherm»" en="“Spontaneous reactions are always exothermic”" />}>
          <T
            de={<p>Eis schmilzt über 0 °C von selbst, obwohl es Wärme braucht (<M p=").">{t`\Delta H > 0`}</M> Dort gewinnt die Entropie: Das Wasser ist unordentlicher als das Eis, und bei genug hoher Temperatur zählt <M>{t`-T\,\Delta S`}</M> mehr als <M p=".">{t`\Delta H`}</M></p>}
            en={<p>Ice melts by itself above 0 °C, although it needs heat (<M p=").">{t`\Delta H > 0`}</M> There the entropy wins: water is more disordered than ice, and at a high enough temperature <M>{t`-T\,\Delta S`}</M> counts more than <M p=".">{t`\Delta H`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Umschalttemperatur ist der Schmelzpunkt, immer»" en="“The switching temperature is the melting point, always”" />}>
          <T
            de={<p><M>{t`T = \Delta H/\Delta S`}</M> ist die Temperatur, bei der <M>{t`\Delta G`}</M> das Vorzeichen wechselt – für jede Reaktion, nicht nur für Eis. Beim Eis ist sie zufällig der Schmelzpunkt. Bei der Ammoniak-Synthese sind es 464 K, bei Übung 7 sind es 5115 K.</p>}
            en={<p><M>{t`T = \Delta H/\Delta S`}</M> is the temperature at which <M>{t`\Delta G`}</M> changes sign – for every reaction, not only for ice. For ice it happens to be the melting point. For the ammonia synthesis it is 464 K, for exercise 7 it is 5115 K.</p>}
          />
        </Box>
      </Section>

      <Box kind="key">
        <T
          de={<ul>
            <li>Für jede Reaktion gilt dasselbe Rezept: Produkte minus Edukte, jeder Stoff mal sein Koeffizient. Es gilt für <M p=",">{t`\Delta H^\circ_{\mathrm{f}}`}</M> für <M>{t`S^\circ`}</M> und für <M p=".">{t`\Delta G^\circ_{\mathrm{f}}`}</M></li>
            <li>Allein <M>{t`\Delta S_{\mathrm{sys}}`}</M> entscheidet nicht. Das Universum zählt: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} - \Delta H_{\mathrm{sys}}/T`}</M></li>
            <li>Mal <M>{t`-T`}</M> ergibt die Gibbs-Energie: <M p=".">{t`\Delta G = \Delta H - T\,\Delta S`}</M> Sie betrifft nur das System.</li>
            <li><M p=":">{t`\Delta G < 0`}</M> spontan. <M p=":">{t`\Delta G = 0`}</M> reversibel, Gleichgewicht. <M p=":">{t`\Delta G > 0`}</M> nicht spontan. Spontan sagt nichts über die Geschwindigkeit.</li>
            <li><M>{t`-\Delta G`}</M> ist die maximale Arbeit, die man herausholen kann.</li>
            <li>Vier Vorzeichen-Fälle von <M>{t`\Delta H`}</M> und <M p=":">{t`\Delta S`}</M> immer spontan, nie spontan, tief spontan, hoch spontan. Die Grenze ist <M p=".">{t`T = \Delta H/\Delta S`}</M></li>
            <li>Einheiten: <M>{t`\Delta H`}</M> in Kilojoule, <M>{t`\Delta S`}</M> in Joule pro Kelvin, vor dem Subtrahieren angleichen.</li>
          </ul>}
          en={<ul>
            <li>For any reaction there is the same recipe: products minus reactants, each substance times its coefficient. It works for <M p=",">{t`\Delta H^\circ_{\mathrm{f}}`}</M> for <M>{t`S^\circ`}</M> and for <M p=".">{t`\Delta G^\circ_{\mathrm{f}}`}</M></li>
            <li><M>{t`\Delta S_{\mathrm{sys}}`}</M> alone does not decide. The universe counts: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} - \Delta H_{\mathrm{sys}}/T`}</M></li>
            <li>Times <M>{t`-T`}</M> gives the Gibbs free energy: <M p=".">{t`\Delta G = \Delta H - T\,\Delta S`}</M> It concerns only the system.</li>
            <li><M p=":">{t`\Delta G < 0`}</M> spontaneous. <M p=":">{t`\Delta G = 0`}</M> reversible, equilibrium. <M p=":">{t`\Delta G > 0`}</M> nonspontaneous. Spontaneous says nothing about speed.</li>
            <li><M>{t`-\Delta G`}</M> is the maximum work you can get out.</li>
            <li>Four sign cases of <M>{t`\Delta H`}</M> and <M p=":">{t`\Delta S`}</M> always spontaneous, never spontaneous, spontaneous when cold, spontaneous when hot. The boundary is <M p=".">{t`T = \Delta H/\Delta S`}</M></li>
            <li>Units: <M>{t`\Delta H`}</M> in kilojoules, <M>{t`\Delta S`}</M> in joules per kelvin; make them match before subtracting.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
