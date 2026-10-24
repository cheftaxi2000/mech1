import { Box, Section, Src } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { chemTex } from '../chem/tex';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { En } from '../viz/chem/En';
import { hydrationScene } from '../viz/chem/hydrationScene';
import { precipScene } from '../viz/chem/mixScene';
import { DilutionFigure, ElectrolyteBeaker, PrecipLab, SolubilityChart } from '../viz/chem/SolFigures';
import '../viz/chem/chem.css';
import '../viz/chem/loes.css';

const t = String.raw;

/** A long reaction on two lines (reactants, then the arrow and products): fits the narrow caption column. */
function Eq2({ left, right }: { left: string; right: string }) {
  return <MD>{String.raw`\begin{gathered} ${chemTex(left)} \\ \longrightarrow\; ${chemTex(right)} \end{gathered}`}</MD>;
}

export default function CH3Loesungen() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die meisten Reaktionen im Labor, im Körper und in der Natur laufen nicht zwischen trockenen Stoffen ab, sondern <b>in Wasser</b>. Diese Lektion zeigt, was eine Lösung ist, warum Kochsalz in Wasser verschwindet, warum zwei klare Lösungen beim Mischen plötzlich trüb werden können – und wie man «wie viel gelöst ist» in einer Zahl sagt.</p>}
        en={<p className="lede">Most reactions in the lab, in the body and in nature do not take place between dry substances but <b>in water</b>. This lesson shows what a solution is, why table salt disappears in water, why two clear solutions can suddenly turn cloudy when mixed – and how to say “how much is dissolved” with one number.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Rühre Zucker in Tee: Er verschwindet, der Tee bleibt klar und schmeckt süss. Rühre Sand hinein: Der sinkt zu Boden. Beides ist «etwas im Wasser», aber nur im ersten Fall ist es <em>gelöst</em>. Und wenn Salz sich löst, passiert noch etwas Besonderes: Es leitet danach den Strom. Zucker nicht. Warum, sehen wir hier.</p>}
          en={<p>Stir sugar into tea: it disappears, the tea stays clear and tastes sweet. Stir in sand: it sinks to the bottom. Both are “something in water”, but only in the first case is it <em>dissolved</em>. And when salt dissolves, something special happens: afterwards it conducts electricity. Sugar does not. We see why here.</p>}
        />
      </Box>

      {/* ---------------------------------------------------------------- 1 */}
      <Section id="loesung" title={<T de="1. Was ist eine Lösung?" en="1. What is a solution?" />}>
        <Box kind="lecture" src={<Src lec={3} p="8" />} title={<T de="Reaktionen in wässrigen Lösungen" en="Reactions in aqueous solutions" />}>
          <T
            de={<>
              <p>Letzte Vorlesung ging es um Gase, heute um Flüssigkeiten. Eine <b>Lösung</b> (<En>solution</En>) ist ein homogenes Gemisch aus zwei oder mehr Stoffen:</p>
              <MD>{t`\text{Lösung} = \text{Lösungsmittel} + \text{gelöste Stoffe}`}</MD>
              <ul>
                <li>Das <b>Lösungsmittel</b> (<En>solvent</En>) ist der Stoff, der in der grössten Menge vorliegt.</li>
                <li>Die <b>gelösten Stoffe</b> (<En>solutes</En>) sind die Stoffe, die darin «gelöst» sind.</li>
                <li>In einer <b>wässrigen Lösung</b> (<En>aqueous solution</En>) ist das Lösungsmittel Wasser, <C p=".">H2O</C></li>
              </ul>
              <p><C>H2O</C> ist in vieler Hinsicht ungewöhnlich (mehr dazu später) und löst besonders gut ionische Feststoffe wie <C p=".">NaCl</C> Randnotizen: Das Lösungsmittel kann auch ein Feststoff sein; Stahl ist Kohlenstoff (gelöst) in festem Eisen. Heute ist es eine Flüssigkeit, nämlich Wasser. Und: Ohne diese Eigenschaft von Wasser gäbe es kein Leben auf der Erde.</p>
            </>}
            en={<>
              <p>The last lecture was about gases, today it is about liquids. A <b>solution</b> is a homogeneous mixture of two or more substances:</p>
              <MD>{t`\text{solution} = \text{solvent} + \text{solutes}`}</MD>
              <ul>
                <li>The <b>solvent</b> is the substance present in the greatest amount.</li>
                <li>The <b>solutes</b> are the substances “dissolved” in the solvent.</li>
                <li>In an <b>aqueous solution</b> the solvent is water, <C p=".">H2O</C></li>
              </ul>
              <p><C>H2O</C> is unusual in many ways (more later) and is particularly good at dissolving ionic solids such as <C p=".">NaCl</C> Side notes: the solvent can also be a solid; steel is carbon (dissolved) in solid iron. Today it is a liquid, namely water. And: without this property of water there would be no life on Earth.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ---------------------------------------------------------------- 2 */}
      <Section id="elektrolyte" title={<T de="2. Elektrolyte und Nichtelektrolyte" en="2. Electrolytes and nonelectrolytes" />}>
        <Box kind="lecture" src={<Src lec={3} p="9, 11" />} title={<T de="Elektrolyt und Nichtelektrolyt" en="Electrolyte and nonelectrolyte" />}>
          <T
            de={<>
              <p><b>Elektrolyt</b> (<En>electrolyte</En>): ein Stoff, der sich in <C>H2O</C> löst, indem er <em>Ionen</em> bildet. Der Ionenfeststoff zerfällt (dissoziiert) in einzelne Kationen und Anionen. Beispiel (Zeichnung der Folie): fester <C>NaCl</C> im Wasser wird zu <C>Na^+</C> und <C p=".">Cl^-</C> Man nennt das eine <i>elektrolytische Lösung</i>.</p>
              <p><b>Nichtelektrolyt</b> (<En>nonelectrolyte</En>): ein Stoff, der sich in <C>H2O</C> löst, <em>ohne</em> Ionen zu bilden. Beispiel: ein Zuckerwürfel (Saccharose, <C p=")">C12H22O11</C> Die einzelnen Moleküle lösen sich im Wasser. Weiteres Beispiel (Randnotiz): Ethanol <C>CH3CH2OH</C> löst sich als Flüssigkeit in Wasser, das gibt Bier.</p>
              <p>Randnotiz zur Leitfähigkeit: Wässrige Lösungen von Elektrolyten leiten Strom. Reines Wasser und wässrige Lösungen von Nichtelektrolyten leiten nicht. Das ist wichtig für Batterien (Vorlesung 14).</p>
            </>}
            en={<>
              <p><b>Electrolyte</b>: a substance that dissolves in <C>H2O</C> by forming <em>ions</em>. The ionic solid dissociates into individual cations and anions. Example (drawing on the slide): solid <C>NaCl</C> in water becomes <C>Na^+</C> and <C p=".">Cl^-</C> This is called an <i>electrolytic solution</i>.</p>
              <p><b>Nonelectrolyte</b>: a substance that dissolves in <C>H2O</C> <em>without</em> forming ions. Example: a sugar cube (sucrose, <C p=")">C12H22O11</C> The individual molecules dissolve in the water. Another example (side note): ethanol <C>CH3CH2OH</C> dissolves as a liquid in water, giving beer.</p>
              <p>Side note on conductivity: aqueous solutions of electrolytes conduct electricity. Pure water and aqueous solutions of nonelectrolytes do not. This is important for batteries (lecture 14).</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das Bild:</b></p>
            <ol>
              <li>Elektrolyt heisst: Es sind <em>geladene Teilchen</em> im Wasser, rote Kationen und blaue Anionen. Die Gesamtladung bleibt null, es gibt gleich viele Plus- wie Minusladungen.</li>
              <li>Strom im Draht sind wandernde Elektronen. Strom in der Lösung sind wandernde <em>Ionen</em>: Die Kationen wandern zur einen Elektrode, die Anionen zur anderen. Ohne bewegliche Ladungen fliesst nichts.</li>
              <li>Darum leuchtet die Lampe nur bei <C>NaCl</C>, <C>HCl</C> und <C>KOH</C> (alle ionisch). Bei Zucker und Ethanol schwimmen ungeladene Moleküle, bei reinem Wasser fast nur Wassermoleküle.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the picture:</b></p>
            <ol>
              <li>Electrolyte means: there are <em>charged particles</em> in the water, red cations and blue anions. The total charge stays zero, there are as many plus as minus charges.</li>
              <li>Current in a wire is moving electrons. Current in the solution is moving <em>ions</em>: the cations move to one electrode, the anions to the other. Without mobile charges nothing flows.</li>
              <li>That is why the lamp lights up only for <C>NaCl</C>, <C>HCl</C> and <C>KOH</C> (all ionic). For sugar and ethanol uncharged molecules float about, for pure water almost only water molecules.</li>
            </ol>
          </>}
        />
        <ElectrolyteBeaker />
        <Box kind="uebung" src={<Src ex={3} p="2" />} title={<T de="Zusammenfassung der Übung" en="Summary from the exercise class" />}>
          <T
            de={<p>Elektrolyte: Art von gelöstem Stoff, der sich in Wasser zu Ionen löst (z. B. <C>NaCl</C>, <C>HCl</C>, <C p=").">KOH</C> Nichtelektrolyte: der gelöste Stoff liegt als einzelne Moleküle vor (z. B. Zucker, Ethanol, Saccharose). Eine <i>elektrolytische Lösung</i> leitet den Strom durch Ionen; reines Wasser und Lösungen von Nichtelektrolyten leiten nicht.</p>}
            en={<p>Electrolytes: a type of solute that dissolves in water to ions (e.g. <C>NaCl</C>, <C>HCl</C>, <C p=").">KOH</C> Nonelectrolytes: the solute is present as individual molecules (e.g. sugar, ethanol, sucrose). An <i>electrolytic solution</i> conducts electricity through ions; pure water and solutions of nonelectrolytes do not.</p>}
          />
        </Box>
      </Section>

      {/* ---------------------------------------------------------------- 3 */}
      <Section id="wasser" title={<T de="3. Warum Wasser Ionen löst" en="3. Why water dissolves ions" />}>
        <T
          de={<p>Ein Salzkristall hält durch die Anziehung von Plus und Minus zusammen. Damit er auseinandergeht, muss etwas diese Anziehung ersetzen. Das tun die Wassermoleküle. Ihr Trick: Sie sind selbst ein wenig geladen, ohne ein Ion zu sein.</p>}
          en={<p>A salt crystal holds together by the attraction of plus and minus. For it to fall apart, something has to replace this attraction. The water molecules do that. Their trick: they are slightly charged themselves, without being an ion.</p>}
        />
        <Box kind="lecture" src={<Src lec={3} p="10" />} title={<T de="Warum ist Wasser ein gutes Lösungsmittel für Ionen?" en="Why is water a good solvent for ions?" />}>
          <T
            de={<p>Ein Wassermolekül ist gewinkelt. Das Sauerstoffatom hat eine <b>partielle negative Ladung</b>, <M p=",">{t`\delta^-`}</M> die beiden Wasserstoffatome je eine <b>partielle positive Ladung</b>, <M p=".">{t`\delta^+`}</M> «Delta» heisst «partielle Ladung», und «partiell» heisst «weniger als <M p="">e</M>». Das Wasser orientiert sich so, dass es die Ladung der Ionen stabilisiert: Um ein Kation drehen sich die Sauerstoffatome (<M p=")">{t`\delta^-`}</M> zum Ion, um ein Anion die Wasserstoffatome (<M p=").">{t`\delta^+`}</M> Randnotiz: Wir kommen in den nächsten Wochen auf diese Ideen zurück.</p>}
            en={<p>A water molecule is bent. The oxygen atom has a <b>partial negative charge</b>, <M p=",">{t`\delta^-`}</M> the two hydrogen atoms each a <b>partial positive charge</b>, <M p=".">{t`\delta^+`}</M> “Delta” means “partial charge”, and “partial” means “less than <M p="">e</M>”. Water orients itself so that it stabilizes the charge of the ions: around a cation the oxygen atoms (<M p=")">{t`\delta^-`}</M> turn towards the ion, around an anion the hydrogen atoms (<M p=").">{t`\delta^+`}</M> Side note: we return to these ideas in the coming weeks.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das Bild:</b></p>
            <ol>
              <li>Gegensätze ziehen sich an. Das negative Ende des Wassers (<C>O</C>) wird vom positiven Ion angezogen, das positive Ende (<C>H</C>) vom negativen Ion.</li>
              <li>Die Wassermoleküle drehen sich also passend. Darum zeigt am Kation die Sauerstoffseite zum Ion, am Anion die Wasserstoffseite.</li>
              <li>Ein Ion, das so von Wasser umhüllt ist, ist «zufrieden» und bleibt gelöst. Man sagt: Es ist <b>hydratisiert</b> (<En>hydrated</En>). Diese Wasserhülle ersetzt die Nachbarn im Kristall.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the picture:</b></p>
            <ol>
              <li>Opposites attract. The negative end of water (<C>O</C>) is attracted to the positive ion, the positive end (<C>H</C>) to the negative ion.</li>
              <li>So the water molecules turn to fit. That is why at a cation the oxygen side points to the ion, at an anion the hydrogen side.</li>
              <li>An ion wrapped in water like this is “content” and stays dissolved. One says it is <b>hydrated</b>. This water shell replaces the neighbours in the crystal.</li>
            </ol>
          </>}
        />
        <StepPlayer
          label="Wasser löst einen Salzkristall"
          steps={[
            { ms: 2500, holdMs: 3500, caption: <T
              de={<>Ein kleiner Kristall aus abwechselnd <C>Na^+</C> (rot, klein) und <C>Cl^-</C> (blau, gross) liegt im Wasser. Die Wassermoleküle sind noch wild verteilt und zeigen in alle Richtungen.</>}
              en={<>A small crystal of alternating <C>Na^+</C> (red, small) and <C>Cl^-</C> (blue, large) lies in the water. The water molecules are still scattered and point in every direction.</>} /> },
            { ms: 4500, holdMs: 4000, caption: <T
              de={<>Am Kristallrand drehen sich die Wassermoleküle: bei <C>Na^+</C> zeigt das <M>{t`\delta^-`}</M>-Ende (der Sauerstoff) zum Ion, bei <C>Cl^-</C> zeigen die <M>{t`\delta^+`}</M>-Enden (die Wasserstoffe) zum Ion.</>}
              en={<>At the edge of the crystal the water molecules turn: at <C>Na^+</C> the <M>{t`\delta^-`}</M> end (the oxygen) points to the ion, at <C>Cl^-</C> the <M>{t`\delta^+`}</M> ends (the hydrogens) point to the ion.</>} /> },
            { ms: 5000, holdMs: 3500, caption: <T
              de={<>Das Wasser zieht die Ionen aus dem Gitter. Jedes Ion trägt jetzt seine eigene Hülle aus drei Wassermolekülen. Der Feststoff ist <em>gelöst</em>: einzelne Kationen und Anionen schwimmen frei.</>}
              en={<>The water pulls the ions out of the lattice. Each ion now carries its own shell of three water molecules. The solid is <em>dissolved</em>: single cations and anions float freely.</>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={hydrationScene} step={step} t={tt} />}
        </StepPlayer>
        <Box kind="lecture" src={<Src lec={3} p="12" />} title={<T de="Warum lösen sich Stoffe in Wasser?" en="Why do substances dissolve in water?" />}>
          <T
            de={<p>Das ist eine komplizierte Frage, und nicht alle Stoffe lösen sich. Welche es tun, entscheidet die <b>Thermodynamik</b> (ab der nächsten Vorlesung). Es gibt energetische und entropische Gründe: Das System (<C>H2O</C> plus gelöster Stoff) senkt dabei seine Energie, und es erhöht seine Unordnung. Für jetzt: akzeptieren, dass sich manche Stoffe in Wasser lösen und andere nicht. «Löslich» (<En>soluble</En>) heisst, es löst sich; «unlöslich» (<En>insoluble</En>), es löst sich nicht.</p>}
            en={<p>This is a complicated question, and not all substances dissolve. Which ones do is decided by <b>thermodynamics</b> (from the next lecture). There are energetic and entropic reasons: the system (<C>H2O</C> plus solute) lowers its energy and increases its disorder. For now: accept that some substances dissolve in water and others do not. “Soluble” means it dissolves; “insoluble” means it does not.</p>}
          />
        </Box>
      </Section>

      {/* ---------------------------------------------------------------- 4 */}
      <Section id="faellung" title={<T de="4. Fällungsreaktionen" en="4. Precipitation reactions" />}>
        <T
          de={<p>Weil sich manche Stoffe lösen und andere nicht, gibt es eine neue Art Reaktion. Man mischt zwei klare Lösungen, und plötzlich fällt ein Feststoff aus.</p>}
          en={<p>Because some substances dissolve and others do not, there is a new kind of reaction. You mix two clear solutions, and suddenly a solid falls out.</p>}
        />
        <Box kind="lecture" src={<Src lec={3} p="13" />} title={<T de="Fällungsreaktionen" en="Precipitation reactions" />}>
          <T
            de={<>
              <p>Ein <b>Niederschlag</b> (<En>precipitate</En>) ist ein unlöslicher Feststoff, der bei einer Reaktion entsteht. Beispiel 1:</p>
              <CD>AgNO3(aq) + KCl(aq) -&gt; AgCl(s) + KNO3(aq)</CD>
              <p>«aq» (<En>aqueous</En>) heisst: in <C>H2O</C> gelöst. «s» heisst: Feststoff, der Niederschlag. <C>AgCl</C> braucht man im Fotofilm (Randnotiz: Licht verwandelt es in <C>Ag</C>). Beispiel 2: Seife ist Natriumstearat, und mit dem Kalk im harten Wasser (die Schweiz hat hartes Wasser) gibt es Seifenschaum-Rückstände:</p>
              <CD>2 Na(C17H35COO)(aq) + CaCl2(aq) -&gt; Ca(C17H35COO)2(s) + 2 NaCl(aq)</CD>
              <p>Allgemein sind das <b>Austauschreaktionen</b> (<En>exchange or metathesis reactions</En>): <M p=".">{t`\mathrm{AX} + \mathrm{BY} \longrightarrow \mathrm{AY} + \mathrm{BX}`}</M> Die Kationen (<M p=",">A</M> <M p=")">B</M> und Anionen (<M p=",">X</M> <M p=")">Y</M> tauschen die Partner.</p>
            </>}
            en={<>
              <p>A <b>precipitate</b> is an insoluble solid formed by a reaction. Example 1:</p>
              <CD>AgNO3(aq) + KCl(aq) -&gt; AgCl(s) + KNO3(aq)</CD>
              <p>“aq” (aqueous) means: dissolved in <C>H2O</C>. “s” means: solid, the precipitate. <C>AgCl</C> is used in photographic film (side note: light turns it into <C>Ag</C>). Example 2: soap is sodium stearate, and with the lime in hard water (Switzerland has hard water) it leaves soap scum:</p>
              <CD>2 Na(C17H35COO)(aq) + CaCl2(aq) -&gt; Ca(C17H35COO)2(s) + 2 NaCl(aq)</CD>
              <p>In general these are <b>exchange (metathesis) reactions</b>: <M p=".">{t`\mathrm{AX} + \mathrm{BY} \longrightarrow \mathrm{AY} + \mathrm{BX}`}</M> The cations (<M p=",">A</M> <M p=")">B</M> and anions (<M p=",">X</M> <M p=")">Y</M> trade partners.</p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={3} p="14–15" />} title={<T de="Vollständige und Netto-Ionengleichung" en="Complete and net ionic equations" />}>
          <T
            de={<>
              <p>Oben steht die <b>molekulare Gleichung</b> (<En>molecular equation</En>), mit allen ionischen Stoffen als ganze Formeln. Aber die Edukte sind ionische Feststoffe, die sich lösen. Schreibt man alle gelösten Ionen einzeln, erhält man die <b>vollständige Ionengleichung</b> (<En>complete ionic equation</En>):</p>
              <CD>Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq) -&gt; AgCl(s) + NO3^-(aq) + K^+(aq)</CD>
              <p><C>AgCl</C> ist nicht gelöst, es ist der Niederschlag. <C>K^+</C> und <C>NO3^-</C> stehen auf beiden Seiten: Sie nehmen nicht an der Reaktion teil und heissen <b>Zuschauer-Ionen</b> (<En>spectator ions</En>). Streicht man sie weg, bleibt die <b>Netto-Ionengleichung</b> (<En>net ionic equation</En>):</p>
              <CD>Ag^+(aq) + Cl^-(aq) -&gt; AgCl(s)</CD>
              <p>Wie weiss man, ob ein Niederschlag entsteht? Man nimmt die Löslichkeitstabelle (nächste Folie). Randnotiz: Als Faustregel gilt ein Stoff mit einer Löslichkeit unter <M>{t`0{,}01\,\mathrm{mol/L}`}</M> als unlöslich.</p>
            </>}
            en={<>
              <p>Above is the <b>molecular equation</b>, with all ionic substances as whole formulae. But the reactants are ionic solids that dissolve. Writing all dissolved ions separately gives the <b>complete ionic equation</b>:</p>
              <CD>Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq) -&gt; AgCl(s) + NO3^-(aq) + K^+(aq)</CD>
              <p><C>AgCl</C> is not dissolved, it is the precipitate. <C>K^+</C> and <C>NO3^-</C> are on both sides: they do not take part in the reaction and are called <b>spectator ions</b>. Cancelling them leaves the <b>net ionic equation</b>:</p>
              <CD>Ag^+(aq) + Cl^-(aq) -&gt; AgCl(s)</CD>
              <p>How do we know whether a precipitate forms? We use the solubility chart (next slide). Side note: as a rule of thumb a substance with a solubility below <M>{t`0.01\,\mathrm{mol/L}`}</M> counts as insoluble.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die drei Gleichungen:</b></p>
            <ol>
              <li><em>Molekular:</em> Man schreibt die Stoffe, wie man sie aus der Flasche kennt. Kurz, aber man sieht nicht, was im Wasser passiert.</li>
              <li><em>Vollständig ionisch:</em> Jeder gelöste Ionenstoff wird in seine Ionen zerlegt. Der Niederschlag bleibt ganz, denn er ist nicht gelöst. Das ist die ehrliche Beschreibung des Bechers.</li>
              <li><em>Netto:</em> Alles, was links und rechts gleich dasteht, streicht man (wie <M>{t`x`}</M> in <M p="">{t`x + 3 = x + 5 + 1`}</M> Es bleibt das, was wirklich passiert: Silber-Ionen und Chlorid-Ionen finden sich.</li>
            </ol>
            <p>Das Bild zeigt es als Film. Beachte die offenen Ringe am Schluss: Das sind die Zuschauer-Ionen.</p>
          </>}
          en={<>
            <p><b>How to read the three equations:</b></p>
            <ol>
              <li><em>Molecular:</em> you write the substances as you know them from the bottle. Short, but you do not see what happens in the water.</li>
              <li><em>Complete ionic:</em> every dissolved ionic substance is split into its ions. The precipitate stays whole, since it is not dissolved. This is the honest description of the beaker.</li>
              <li><em>Net:</em> whatever stands identically on the left and right is cancelled (like <M>{t`x`}</M> in <M p="">{t`x + 3 = x + 5 + 1`}</M> What remains is what really happens: silver ions and chloride ions find each other.</li>
            </ol>
            <p>The figure shows it as a film. Note the open rings at the end: these are the spectator ions.</p>
          </>}
        />
        <StepPlayer
          label="Silbernitrat und Kaliumchlorid werden gemischt"
          steps={[
            { ms: 2000, holdMs: 3000, caption: <T
              de={<>Zwei klare Lösungen. Links <C>AgNO3</C>: die Ionen <C>Ag^+</C> und <C>NO3^-</C>. Rechts <C>KCl</C>: die Ionen <C>K^+</C> und <C p=".">Cl^-</C></>}
              en={<>Two clear solutions. On the left <C>AgNO3</C>: the ions <C>Ag^+</C> and <C>NO3^-</C>. On the right <C>KCl</C>: the ions <C>K^+</C> and <C p=".">Cl^-</C></>} /> },
            { ms: 3500, holdMs: 3500, caption: <T
              de={<>Man giesst zusammen. Jetzt schwimmen alle vier Ionensorten durcheinander: <CD>{'Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq)'}</CD></>}
              en={<>The solutions are poured together. Now all four kinds of ions float about together: <CD>{'Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq)'}</CD></>} /> },
            { ms: 5000, holdMs: 4500, caption: <T
              de={<><C>Ag^+</C> und <C>Cl^-</C> finden sich und bilden den unlöslichen Feststoff <C>AgCl</C>, der zu Boden sinkt. Vollständig: <Eq2 left="Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq)" right="AgCl(s) + NO3^-(aq) + K^+(aq)" /></>}
              en={<><C>Ag^+</C> and <C>Cl^-</C> find each other and form the insoluble solid <C>AgCl</C>, which sinks to the bottom. Complete: <Eq2 left="Ag^+(aq) + NO3^-(aq) + K^+(aq) + Cl^-(aq)" right="AgCl(s) + NO3^-(aq) + K^+(aq)" /></>} /> },
            { ms: 3000, holdMs: 3000, caption: <T
              de={<><C>K^+</C> und <C>NO3^-</C> haben nichts getan: Zuschauer-Ionen (offene Ringe). Streicht man sie, bleibt die Nettogleichung <CD>{'Ag^+(aq) + Cl^-(aq) -> AgCl(s)'}</CD></>}
              en={<><C>K^+</C> and <C>NO3^-</C> did nothing: spectator ions (open rings). Cancelling them leaves the net equation <CD>{'Ag^+(aq) + Cl^-(aq) -> AgCl(s)'}</CD></>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={precipScene} step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ---------------------------------------------------------------- 5 */}
      <Section id="tabelle" title={<T de="5. Die Löslichkeitstabelle" en="5. The solubility chart" />}>
        <Box kind="lecture" src={<Src lec={3} p="16" />} title={<T de="Löslichkeit häufiger ionischer Verbindungen in Wasser (Brown, Tabelle 4.1)" en="Solubility of common ionic compounds in water (Brown, Table 4.1)" />}>
          <T
            de={<>
              <p><b>Lösliche Verbindungen</b> sind solche, die enthalten:</p>
              <ul>
                <li><C>NO3^-</C> und <C p=":">CH3COO^-</C> keine Ausnahmen.</li>
                <li><C>Cl^-</C>, <C>Br^-</C>, <C p=":">I^-</C> Ausnahmen sind die Verbindungen von <C>Ag^+</C>, <C>Hg2^2+</C> und <C p=".">Pb^2+</C></li>
                <li><C p=":">SO4^2-</C> Ausnahmen: Verbindungen von <C>Sr^2+</C>, <C>Ba^2+</C>, <C>Hg2^2+</C> und <C p=".">Pb^2+</C></li>
              </ul>
              <p><b>Unlösliche Verbindungen</b> sind solche, die enthalten:</p>
              <ul>
                <li><C p=":">S^2-</C> Ausnahmen: Verbindungen von <C>NH4^+</C>, den Alkalimetall-Kationen, <C>Ca^2+</C>, <C>Sr^2+</C> und <C p=".">Ba^2+</C></li>
                <li><C>CO3^2-</C> und <C p=":">PO4^3-</C> Ausnahmen: Verbindungen von <C>NH4^+</C> und den Alkalimetall-Kationen.</li>
                <li><C p=":">OH^-</C> Ausnahmen: Verbindungen von <C>NH4^+</C>, den Alkalimetall-Kationen, <C>Ca^2+</C>, <C>Sr^2+</C> und <C p=".">Ba^2+</C></li>
              </ul>
              <p>Alkalimetalle sind (Vorlesung 1) <C>Li</C>, <C>Na</C>, <C>K</C>, <C>Rb</C>, <C>Cs</C>, <C p=".">Fr</C></p>
            </>}
            en={<>
              <p><b>Soluble ionic compounds</b> are those containing:</p>
              <ul>
                <li><C>NO3^-</C> and <C p=":">CH3COO^-</C> no exceptions.</li>
                <li><C>Cl^-</C>, <C>Br^-</C>, <C p=":">I^-</C> exceptions are the compounds of <C>Ag^+</C>, <C>Hg2^2+</C> and <C p=".">Pb^2+</C></li>
                <li><C p=":">SO4^2-</C> exceptions: compounds of <C>Sr^2+</C>, <C>Ba^2+</C>, <C>Hg2^2+</C> and <C p=".">Pb^2+</C></li>
              </ul>
              <p><b>Insoluble ionic compounds</b> are those containing:</p>
              <ul>
                <li><C p=":">S^2-</C> exceptions: compounds of <C>NH4^+</C>, the alkali metal cations, <C>Ca^2+</C>, <C>Sr^2+</C> and <C p=".">Ba^2+</C></li>
                <li><C>CO3^2-</C> and <C p=":">PO4^3-</C> exceptions: compounds of <C>NH4^+</C> and the alkali metal cations.</li>
                <li><C p=":">OH^-</C> exceptions: compounds of <C>NH4^+</C>, the alkali metal cations, <C>Ca^2+</C>, <C>Sr^2+</C> and <C p=".">Ba^2+</C></li>
              </ul>
              <p>The alkali metals are (lecture 1) <C>Li</C>, <C>Na</C>, <C>K</C>, <C>Rb</C>, <C>Cs</C>, <C p=".">Fr</C></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So benutzt man die Tabelle:</b> Man sucht zuerst das <em>Anion</em> der Verbindung in der linken Spalte. Das sagt die Regel («löst sich» oder «löst sich nicht»). Dann prüft man, ob das <em>Kation</em> in der Ausnahmeliste steht. Wenn ja, gilt das Gegenteil. Beispiel: <C>NaCl</C>: Chloride lösen sich, <C>Na^+</C> ist keine Ausnahme, also löslich. <C>AgCl</C>: Chloride lösen sich, aber <C>Ag^+</C> ist Ausnahme, also unlöslich.</p>
            <p>Unten ist die ganze Tabelle als Raster. Jedes Feld ist eine Verbindung: grün löslich, orange unlöslich. Ein doppelter Rand zeigt eine Ausnahme der Regel. Tippe ein Feld an, um die Begründung zu lesen.</p>
          </>}
          en={<>
            <p><b>How to use the chart:</b> First look up the <em>anion</em> of the compound in the left column. It gives the rule (“dissolves” or “does not dissolve”). Then check whether the <em>cation</em> is in the exception list. If so, the opposite holds. Example: <C>NaCl</C>: chlorides dissolve, <C>Na^+</C> is no exception, so soluble. <C>AgCl</C>: chlorides dissolve, but <C>Ag^+</C> is an exception, so insoluble.</p>
            <p>Below is the whole chart as a grid. Each box is a compound: green soluble, orange insoluble. A double rim marks an exception to the rule. Tap a box to read the reason.</p>
          </>}
        />
        <SolubilityChart />
        <Box kind="uebung" src={<Src ex={3} p="5" />} title={<T de="Beispiel 2: löslich oder unlöslich?" en="Example 2: soluble or insoluble?" />}>
          <T
            de={<>
              <p>Sage voraus, ob jede Verbindung in Wasser löslich ist: (a) <C>Hg2SO4</C>, (b) <C>NH4OH</C>, (c) <C>Ni(CH3COO)2</C>, (d) <C>AgNO3</C>, (e) <C p=".">FeCO3</C> Antworten der Übung: a) nein, b) ja, c) ja, d) ja, e) nein.</p>
              <ol type="a">
                <li><C>SO4^2-</C> löst sich, aber <C>Hg2^2+</C> ist Ausnahme: unlöslich.</li>
                <li><C>OH^-</C> löst sich nicht, aber <C>NH4^+</C> ist Ausnahme: löslich.</li>
                <li>Acetate lösen sich ohne Ausnahme: löslich.</li>
                <li>Nitrate lösen sich ohne Ausnahme: löslich.</li>
                <li><C>CO3^2-</C> löst sich nicht, <C>Fe^2+</C> ist keine Ausnahme: unlöslich.</li>
              </ol>
            </>}
            en={<>
              <p>Predict whether each compound is soluble in water: (a) <C>Hg2SO4</C>, (b) <C>NH4OH</C>, (c) <C>Ni(CH3COO)2</C>, (d) <C>AgNO3</C>, (e) <C p=".">FeCO3</C> Answers of the exercise class: a) no, b) yes, c) yes, d) yes, e) no.</p>
              <ol type="a">
                <li><C>SO4^2-</C> dissolves, but <C>Hg2^2+</C> is an exception: insoluble.</li>
                <li><C>OH^-</C> does not dissolve, but <C>NH4^+</C> is an exception: soluble.</li>
                <li>Acetates dissolve without exception: soluble.</li>
                <li>Nitrates dissolve without exception: soluble.</li>
                <li><C>CO3^2-</C> does not dissolve, <C>Fe^2+</C> is no exception: insoluble.</li>
              </ol>
            </>}
          />
        </Box>
        <T
          de={<p><b>Mischen im Labor.</b> Wähle zwei Lösungen. Das Programm tauscht die Partner, prüft mit der Tabelle, ob ein Produkt unlöslich ist, und schreibt alle drei Gleichungen. Die erste Einstellung ist das Beispiel der Folie. Probiere dann die Beispiele der Übung unten.</p>}
          en={<p><b>Mixing in the lab.</b> Choose two solutions. The program swaps the partners, checks with the chart whether a product is insoluble, and writes all three equations. The first setting is the example of the slide. Then try the examples of the exercise class below.</p>}
        />
        <PrecipLab />
        <Box kind="uebung" src={<Src ex={3} p="4–5, 13" />} title={<T de="Beispiel 3 und Bonus: Was passiert beim Mischen?" en="Example 3 and bonus: what happens when mixing?" />}>
          <T
            de={<>
              <p><b>Beispiel 3:</b> Was passiert, wenn man <C>Mg(NO3)2</C> und <C>NaOH</C> in Wasser mischt? Vorgehen der Übung: die Ionen aufschreiben (<C>Mg^2+</C>, <C>NO3^-</C>, <C>Na^+</C>, <C p=")">OH^-</C> die Partner tauschen (Plus zu Minus) und mit der Tabelle prüfen, ob ein Produkt unlöslich ist. <C>NaNO3</C> löst sich (Nitrat). <C>Mg(OH)2</C> löst sich nicht (Hydroxid, <C>Mg^2+</C> keine Ausnahme). Also:</p>
              <CD>Mg(NO3)2(aq) + 2 NaOH(aq) -&gt; Mg(OH)2(s) + 2 NaNO3(aq)</CD>
              <p><C>Mg(OH)2</C> fällt als unlöslicher Feststoff aus. Stelle im Bild oben <C>Mg^2+</C>, <C>NO3^-</C>, <C>Na^+</C>, <C>OH^-</C> ein und vergleiche.</p>
              <p><b>Bonus 2:</b> Welche Kombination bildet einen Niederschlag? (a) <C>KOH</C> und <C>MgSO4</C>, (b) <C>NaOH</C> und <C>KNO3</C>, (c) <C>NH4Cl</C> und <C>Rb2CO3</C> Antwort: (a) <C>Mg(OH)2</C> fällt aus; (b) und (c) nichts, denn alle möglichen Produkte (<C>NaNO3</C>, <C>KOH</C>; <C>NH4</C>-Carbonat, Rubidiumchlorid) lösen sich.</p>
            </>}
            en={<>
              <p><b>Example 3:</b> what happens if <C>Mg(NO3)2</C> and <C>NaOH</C> are mixed in water? Procedure of the exercise class: write down the ions (<C>Mg^2+</C>, <C>NO3^-</C>, <C>Na^+</C>, <C p=")">OH^-</C> swap the partners (plus to minus) and check with the chart whether a product is insoluble. <C>NaNO3</C> dissolves (nitrate). <C>Mg(OH)2</C> does not dissolve (hydroxide, <C>Mg^2+</C> no exception). So:</p>
              <CD>Mg(NO3)2(aq) + 2 NaOH(aq) -&gt; Mg(OH)2(s) + 2 NaNO3(aq)</CD>
              <p><C>Mg(OH)2</C> precipitates as an insoluble solid. Set <C>Mg^2+</C>, <C>NO3^-</C>, <C>Na^+</C>, <C>OH^-</C> in the figure above and compare.</p>
              <p><b>Bonus 2:</b> which combination forms a precipitate? (a) <C>KOH</C> and <C>MgSO4</C>, (b) <C>NaOH</C> and <C>KNO3</C>, (c) <C>NH4Cl</C> and <C>Rb2CO3</C> Answer: (a) <C>Mg(OH)2</C> precipitates; (b) and (c) nothing, because all possible products (<C>NaNO3</C>, <C>KOH</C>; ammonium carbonate, rubidium chloride) dissolve.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ---------------------------------------------------------------- 6 */}
      <Section id="molaritaet" title={<T de="6. Wie konzentriert ist eine Lösung?" en="6. How concentrated is a solution?" />}>
        <T
          de={<p>«Süsser Tee» sagt noch nichts. Ein Löffel Zucker in der Tasse oder im Eimer ist nicht dasselbe. Man braucht eine Zahl, die sagt, <em>wie viel Stoff in wie viel Lösung</em> steckt.</p>}
          en={<p>“Sweet tea” does not say much. One spoonful of sugar in a cup or in a bucket is not the same. We need a number that says <em>how much substance is in how much solution</em>.</p>}
        />
        <Box kind="lecture" src={<Src lec={3} p="29" />} title={<T de="Konzentration: Molarität" en="Concentration: molarity" />}>
          <T
            de={<>
              <MD>{t`\text{Molarität} \equiv \frac{\text{Mol gelöster Stoff}}{\text{Liter Lösung}}`}</MD>
              <p>Beispiel: Eine «1-molare Lösung» heisst <M p=".">{t`\dfrac{1\,\mathrm{mol}}{1\,\mathrm{L}} \equiv 1\,\mathrm{M}`}</M> Randnotiz: Das ist nicht die einzige Art, eine Konzentration anzugeben (mehr in Vorlesung 9). Man muss zwischen <M p=",">M</M> <M>V</M> und <M>n</M> umrechnen können, das ist eine häufige Aufgabenklasse in der Prüfung (Übung auf Problem Set 3).</p>
            </>}
            en={<>
              <MD>{t`\text{molarity} \equiv \frac{\text{moles of solute}}{\text{litres of solution}}`}</MD>
              <p>Example: a “1 molar solution” means <M p=".">{t`\dfrac{1\,\mathrm{mol}}{1\,\mathrm{L}} \equiv 1\,\mathrm{M}`}</M> Side note: this is not the only way to express a concentration (more in lecture 9). You must be able to convert between <M p=",">M</M> <M>V</M> and <M p=",">n</M> a common class of exam problems (practise on problem set 3).</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Im Zähler steht die Stoffmenge <M>n</M> des gelösten Stoffs in Mol, im Nenner das Volumen <M>V</M> der <em>ganzen Lösung</em> (nicht nur des Wassers) in Litern.</li>
              <li>Das Zeichen <M>c</M> oder <M>M</M> steht für die Molarität. Als Einheit schreibt man <M p=",">{t`\mathrm{mol/L}`}</M> kurz <M p=".">{t`\mathrm{M}`}</M></li>
              <li>Eine einzige Gleichung, drei Grössen: <M p=",">{t`c = n/V`}</M> also <M>{t`n = cV`}</M> und <M p=".">{t`V = n/c`}</M></li>
            </ol>
            <p>Im Bild verschiebst du <M>n</M> und <M p=".">V</M> Die violetten Punkte sind das gelöste Teilchen. Mehr Punkte im gleichen Wasser: höhere Konzentration. Gleich viele Punkte in mehr Wasser: <em>verdünnt</em>. Die Stoffmenge ändert sich beim Verdünnen nicht, nur das Volumen.</p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>The numerator is the amount <M>n</M> of the dissolved substance in moles, the denominator the volume <M>V</M> of the <em>whole solution</em> (not just of the water) in litres.</li>
              <li>The symbol <M>c</M> or <M>M</M> stands for the molarity. As unit one writes <M p=",">{t`\mathrm{mol/L}`}</M> in short <M p=".">{t`\mathrm{M}`}</M></li>
              <li>One equation, three quantities: <M p=",">{t`c = n/V`}</M> so <M>{t`n = cV`}</M> and <M p=".">{t`V = n/c`}</M></li>
            </ol>
            <p>In the figure you move <M>n</M> and <M p=".">V</M> The purple dots are the dissolved particles. More dots in the same water: higher concentration. The same number of dots in more water: <em>diluted</em>. The amount does not change when diluting, only the volume.</p>
          </>}
        />
        <DilutionFigure />
        <Box kind="uebung" src={<Src ex={3} p="3" />} title={<T de="Beispiel 1: Alkohol im Blut" en="Example 1: alcohol in blood" />}>
          <T
            de={<>
              <p>Wie gross ist die Konzentration von Ethanol im menschlichen Blut in Molarität, wenn die Blutalkoholkonzentration (BAC) 0,08 beträgt? BAC hat die Einheit g Ethanol pro 100 mL Blut. Die molare Masse von Ethanol ist <M p=".">{t`M = 46\,\mathrm{g/mol}`}</M></p>
              <MD>{t`c = \frac{n}{V} = \frac{0{,}08\,\mathrm{g}}{100\,\mathrm{mL}}\cdot\frac{1\,\mathrm{mol}}{46\,\mathrm{g}}\cdot\frac{1000\,\mathrm{mL}}{1\,\mathrm{L}} = 0{,}02\,\frac{\mathrm{mol}}{\mathrm{L}}`}</MD>
              <p>Genauer ist <M p=".">{t`0{,}0174\,\mathrm{mol/L}`}</M> Die Übung rundet auf eine Stelle, wie die gegebene Zahl <M p=".">{t`0{,}08`}</M> Die Einheiten kürzen sich wie in Lektion 2: Gramm kürzt sich mit Gramm, mL mit mL.</p>
            </>}
            en={<>
              <p>What is the concentration of ethanol in human blood in units of molarity if the blood alcohol concentration (BAC) is 0.08? BAC has units of g ethanol per 100 mL blood. The molar mass of ethanol is <M p=".">{t`M = 46\,\mathrm{g/mol}`}</M></p>
              <MD>{t`c = \frac{n}{V} = \frac{0.08\,\mathrm{g}}{100\,\mathrm{mL}}\cdot\frac{1\,\mathrm{mol}}{46\,\mathrm{g}}\cdot\frac{1000\,\mathrm{mL}}{1\,\mathrm{L}} = 0.02\,\frac{\mathrm{mol}}{\mathrm{L}}`}</MD>
              <p>More precisely it is <M p=".">{t`0.0174\,\mathrm{mol/L}`}</M> The exercise class rounds to one digit, like the given number <M p=".">{t`0.08`}</M> The units cancel as in lesson 2: grams with grams, mL with mL.</p>
            </>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Verdünnen" en="Diluting" />}>
          <T
            de={<p>Gibt man Wasser zu, ändert sich die Stoffmenge <M>n</M> nicht, nur <M>V</M> wächst. Aus <M>{t`n = c_1 V_1 = c_2 V_2`}</M> folgt <M p=".">{t`c_2 = c_1 V_1 / V_2`}</M> Aus <M>{t`0{,}50\,\mathrm{L}`}</M> einer <M>{t`2{,}0\,\mathrm{M}`}</M> Lösung wird mit Wasser auf <M>{t`2{,}0\,\mathrm{L}`}</M> eine Lösung mit <M p=".">{t`c_2 = 2{,}0\cdot 0{,}50/2{,}0 = 0{,}50\,\mathrm{M}`}</M> Das steht nicht auf den Folien, folgt aber unmittelbar aus <M p=".">{t`c = n/V`}</M></p>}
            en={<p>When water is added, the amount <M>n</M> does not change, only <M>V</M> grows. From <M>{t`n = c_1 V_1 = c_2 V_2`}</M> follows <M p=".">{t`c_2 = c_1 V_1 / V_2`}</M> From <M>{t`0.50\,\mathrm{L}`}</M> of a <M>{t`2.0\,\mathrm{M}`}</M> solution, diluting with water to <M>{t`2.0\,\mathrm{L}`}</M> gives a solution with <M p=".">{t`c_2 = 2.0\cdot 0.50/2.0 = 0.50\,\mathrm{M}`}</M> This is not on the slides but follows directly from <M p=".">{t`c = n/V`}</M></p>}
          />
        </Box>
      </Section>

      <Box kind="misconception" title={<T de="«In der Lösung gibt es NaCl-Moleküle»" en="“There are NaCl molecules in the solution”" />}>
        <T
          de={<p>Nein. Im festen Salz sind <C>Na^+</C> und <C>Cl^-</C> Nachbarn in einem Gitter, im Wasser schwimmen sie einzeln und jedes mit seiner Wasserhülle. Es gibt kein «<C>NaCl</C>-Molekül». Die Formel <C>NaCl</C> ist nur das Zählverhältnis 1 : 1.</p>}
          en={<p>No. In solid salt <C>Na^+</C> and <C>Cl^-</C> are neighbours in a lattice; in water they float singly, each with its water shell. There is no “<C>NaCl</C> molecule”. The formula <C>NaCl</C> is just the counting ratio 1 : 1.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Zuschauer-Ionen sind nicht da»" en="“Spectator ions are not there”" />}>
        <T
          de={<p>Doch, sie sind da und bewegen sich frei, nur reagieren sie nicht. Darum leitet die Lösung weiterhin Strom. Man lässt sie in der Netto-Gleichung weg, weil sie sich nicht ändern.</p>}
          en={<p>They are there and move freely; they just do not react. That is why the solution still conducts electricity. One leaves them out of the net equation because they do not change.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Unlöslich heisst: gar nichts löst sich»" en="“Insoluble means: nothing dissolves at all”" />}>
        <T
          de={<p>Die Folie sagt es als Faustregel: Unter <M>{t`0{,}01\,\mathrm{mol/L}`}</M> gilt ein Stoff als unlöslich. Eine winzige Menge löst sich also doch. Für unsere Gleichungen behandeln wir es als vollständig ausgefallen.</p>}
          en={<p>The slide says it as a rule of thumb: below <M>{t`0.01\,\mathrm{mol/L}`}</M> a substance counts as insoluble. So a tiny amount does dissolve. For our equations we treat it as completely precipitated.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Molarität ist Mol pro Liter Wasser»" en="“Molarity is moles per litre of water”" />}>
        <T
          de={<p>Der Nenner ist das Volumen der <em>ganzen Lösung</em>. Löst man Zucker in einem Liter Wasser, wird das Volumen etwas grösser als ein Liter. Man füllt deshalb im Messkolben bis zur Marke auf, nicht einfach einen Liter Wasser ab.</p>}
          en={<p>The denominator is the volume of the <em>whole solution</em>. Dissolving sugar in one litre of water makes the volume a little larger than one litre. That is why you fill up to the mark in a volumetric flask instead of simply measuring out a litre of water.</p>}
        />
      </Box>

      <Box kind="key" title={<T de="Merke" en="Key points" />}>
        <T
          de={<ul>
            <li>Eine Lösung besteht aus Lösungsmittel und gelösten Stoffen; wässrig heisst: das Lösungsmittel ist Wasser.</li>
            <li>Elektrolyte lösen sich als Ionen und leiten den Strom, Nichtelektrolyte als ganze Moleküle und leiten nicht.</li>
            <li>Wasser löst Ionen, weil seine Enden <M>{t`\delta^-`}</M> und <M>{t`\delta^+`}</M> sich zu den Ionen drehen und sie umhüllen.</li>
            <li>Fällungsreaktion: AX + BY geben AY + BX; ein unlöslicher Stoff fällt aus. Mit der Löslichkeitstabelle entscheidet man, welcher.</li>
            <li>Molekulare, vollständige und Netto-Gleichung: Zuschauer-Ionen stehen links und rechts gleich und werden gestrichen.</li>
            <li>Molarität <M p=".">{t`c = n/V`}</M> in <M p=".">{t`\mathrm{mol/L}`}</M> Beim Verdünnen bleibt <M>n</M> gleich.</li>
          </ul>}
          en={<ul>
            <li>A solution consists of solvent and solutes; aqueous means the solvent is water.</li>
            <li>Electrolytes dissolve as ions and conduct electricity, nonelectrolytes as whole molecules and do not.</li>
            <li>Water dissolves ions because its ends <M>{t`\delta^-`}</M> and <M>{t`\delta^+`}</M> turn towards the ions and wrap them.</li>
            <li>Precipitation reaction: AX + BY give AY + BX; one insoluble substance falls out. The solubility chart decides which.</li>
            <li>Molecular, complete and net equation: spectator ions stand identically on the left and right and are cancelled.</li>
            <li>Molarity <M p=".">{t`c = n/V`}</M> in <M p=".">{t`\mathrm{mol/L}`}</M> When diluting, <M>n</M> stays the same.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
