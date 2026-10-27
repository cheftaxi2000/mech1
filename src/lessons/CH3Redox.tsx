import { Box, Section, Src } from '../components/Blocks';
import { C, CD } from '../components/Chem';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { En } from '../viz/chem/En';
import { neutralScene } from '../viz/chem/mixScene';
import { redoxScene } from '../viz/chem/redoxScenes';
import { AcidStrength, ActivityLab, NeutralLab, OxNumCalc } from '../viz/chem/RedoxFigures';
import '../viz/chem/chem.css';
import '../viz/chem/loes.css';

const t = String.raw;

export default function CH3Redox() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In Wasser passieren drei grosse Sorten von Reaktionen. Bei der ersten tauschen Ionen die Partner (Fällung, letzte Lektion). Bei der zweiten wandert ein <b>Proton</b>, <C>H^+</C> (Säuren und Basen). Bei der dritten wandert ein <b>Elektron</b> (Redoxreaktionen). Auch für Maschinenbauer sind alle drei wichtig: Rost, Batterien, Korrosion und Brennstoffzellen sind Redox, Kalkentfernung ist Säure-Base.</p>}
        en={<p className="lede">Three big kinds of reactions happen in water. In the first, ions swap partners (precipitation, last lesson). In the second, a <b>proton</b>, <C>H^+</C>, moves (acids and bases). In the third, an <b>electron</b> moves (redox reactions). All three matter for mechanical engineers too: rust, batteries, corrosion and fuel cells are redox, descaling is acid–base.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir einen Ball vor, der weitergegeben wird. Bei Säure und Base ist der Ball das <C>H^+</C>: Die Säure wirft ihn, die Base fängt ihn. Bei Redox ist der Ball ein Elektron: Wer es abgibt, wird <em>oxidiert</em>, wer es fängt, wird <em>reduziert</em>. Es gibt immer beide zugleich, so wie ein Wurf immer einen Fänger braucht.</p>}
          en={<p>Picture a ball being passed on. In acid and base the ball is the <C>H^+</C>: the acid throws it, the base catches it. In redox the ball is an electron: whoever gives it away is <em>oxidised</em>, whoever catches it is <em>reduced</em>. There are always both at once, just as a throw always needs a catcher.</p>}
        />
      </Box>

      {/* ---------------------------------------------------------------- 1 */}
      <Section id="saeuren" title={<T de="1. Säuren und Basen" en="1. Acids and bases" />}>
        <Box kind="lecture" src={<Src lec={3} p="17" />} title={<T de="Säuren" en="Acids" />}>
          <T
            de={<>
              <p>Randnotiz zum Thema: Viele Ingenieure schrecken vor Säure-Base-Chemie zurück, man muss es nicht. Heute eine erste Einführung, mehr in Vorlesung 13.</p>
              <p><b>Säuren</b> (<En>acids</En>) sind Stoffe, die in <C>H2O</C> ionisieren und dabei Wasserstoff-Kationen <C>H^+</C> bilden. Das <C>H^+</C> nennt man auch <b>Proton</b>, denn das ist ein <C>H^+</C>: ein Wasserstoffatom ohne Elektron, also nur ein Proton. Säuren heissen deshalb auch «Protonendonatoren» (<En>proton donors</En>). Häufige Säuren:</p>
              <CD>HCl(aq) -&gt; H^+(aq) + Cl^-(aq)</CD>
              <CD>HNO3(aq) -&gt; H^+(aq) + NO3^-(aq)</CD>
              <p>Salzsäure (<En>hydrochloric acid</En>) und Salpetersäure (<En>nitric acid</En>) sind <b>einprotonige Säuren</b> (<En>monoprotic</En>): pro Molekül ein <C p=".">H^+</C> Schwefelsäure (<En>sulfuric acid</En>) ist <b>zweiprotonig</b> (<En>diprotic</En>), sie gibt zwei <C>H^+</C> in zwei Schritten ab:</p>
              <CD>H2SO4(aq) -&gt; H^+(aq) + HSO4^-(aq)</CD>
              <CD>HSO4^-(aq) -&gt; H^+(aq) + SO4^2-(aq)</CD>
              <p>Randnotiz: Das zweite <C>H^+</C> geht schwerer ab, der zweite Pfeil müsste eigentlich ein Doppelpfeil <M>{t`\rightleftharpoons`}</M> sein (ein Gleichgewicht, das erst in den Vorlesungen 12 und 13 Sinn ergibt).</p>
            </>}
            en={<>
              <p>Side note: many engineers are intimidated by acid–base chemistry; there is no need to be. Today a first introduction, more in lecture 13.</p>
              <p><b>Acids</b> are substances that ionize in <C>H2O</C> and form hydrogen cations <C>H^+</C>. The <C>H^+</C> is also called a <b>proton</b>, because that is what it is: a hydrogen atom without its electron, i.e. just a proton. Acids are therefore also known as “proton donors”. Common acids:</p>
              <CD>HCl(aq) -&gt; H^+(aq) + Cl^-(aq)</CD>
              <CD>HNO3(aq) -&gt; H^+(aq) + NO3^-(aq)</CD>
              <p>Hydrochloric acid and nitric acid are <b>monoprotic acids</b>: one <C p=".">H^+</C> per molecule. Sulfuric acid is <b>diprotic</b>; it gives away two <C>H^+</C> in two steps:</p>
              <CD>H2SO4(aq) -&gt; H^+(aq) + HSO4^-(aq)</CD>
              <CD>HSO4^-(aq) -&gt; H^+(aq) + SO4^2-(aq)</CD>
              <p>Side note: the second <C>H^+</C> comes off less easily; the second arrow should really be a double arrow <M>{t`\rightleftharpoons`}</M> (an equilibrium that only makes sense after lectures 12 and 13).</p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={3} p="18" />} title={<T de="Basen" en="Bases" />}>
          <T
            de={<>
              <p><b>Basen</b> (<En>bases</En>) sind Stoffe, die Wasserstoff-Kationen aufnehmen (mit ihnen reagieren). Viele bilden in <C>H2O</C> Hydroxid-Ionen <C p=".">OH^-</C> Häufige Basen:</p>
              <CD>NaOH(aq) -&gt; Na^+(aq) + OH^-(aq)</CD>
              <CD>Ca(OH)2(aq) -&gt; Ca^2+(aq) + 2 OH^-(aq)</CD>
              <CD>NH3(aq) + H2O(l) -&gt; NH4^+(aq) + OH^-(aq)</CD>
              <p>Natriumhydroxid, Calciumhydroxid und Ammoniak (<En>ammonia</En>). Randnotiz: Hydroxide sind die häufigsten Basen. Eine Base muss aber kein Hydroxid sein: Ammoniak <C>NH3</C> ist das Standardbeispiel.</p>
            </>}
            en={<>
              <p><b>Bases</b> are substances that accept (react with) hydrogen cations. Many form hydroxide ions <C p=".">OH^-</C> in <C>H2O</C>. Common bases:</p>
              <CD>NaOH(aq) -&gt; Na^+(aq) + OH^-(aq)</CD>
              <CD>Ca(OH)2(aq) -&gt; Ca^2+(aq) + 2 OH^-(aq)</CD>
              <CD>NH3(aq) + H2O(l) -&gt; NH4^+(aq) + OH^-(aq)</CD>
              <p>Sodium hydroxide, calcium hydroxide and ammonia. Side note: hydroxides are the most common bases. But a base does not have to be a hydroxide: ammonia <C>NH3</C> is the standard example.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Zeilen:</b></p>
            <ol className="keep">
              <li>Der Pfeil in «<C>HCl</C> gibt <C>H^+</C> und <C>Cl^-</C>» heisst: Das <C>H</C> geht <em>ohne sein Elektron</em> weg, das Elektron bleibt beim <C p=".">Cl</C> Darum wird aus <C>Cl</C> ein <C p=",">Cl^-</C> und das <C>H</C> bleibt als nacktes <C p=".">H^+</C></li>
              <li>Bei <C>Ca(OH)2</C> steht die Zahl 2 vor <C p=",">OH^-</C> weil die Formel zwei <C>OH</C> enthält: ein <C>Ca^2+</C> braucht zwei <C p=".">OH^-</C> (Ladung ausgleichen, wie in Lektion 1).</li>
              <li>Bei <C>NH3</C> kommt kein <C>OH^-</C> in der Formel vor. Es entsteht trotzdem, weil <C>NH3</C> dem Wasser ein <C>H^+</C> wegnimmt: Aus <C>H2O</C> wird <C p=",">OH^-</C> aus <C>NH3</C> wird <C p=".">NH4^+</C> So «nimmt» die Base das Proton.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the lines:</b></p>
            <ol className="keep">
              <li>The arrow in “<C>HCl</C> gives <C>H^+</C> and <C>Cl^-</C>” means: the <C>H</C> leaves <em>without its electron</em>, the electron stays with the <C p=".">Cl</C> So <C>Cl</C> becomes <C p=",">Cl^-</C> and the <C>H</C> remains as a bare <C p=".">H^+</C></li>
              <li>For <C>Ca(OH)2</C> there is the number 2 in front of <C p=",">OH^-</C> because the formula contains two <C>OH</C>: one <C>Ca^2+</C> needs two <C p=".">OH^-</C> (balance the charge, as in lesson 1).</li>
              <li>For <C>NH3</C> no <C>OH^-</C> appears in the formula. It forms anyway, because <C>NH3</C> takes a <C>H^+</C> away from water: <C>H2O</C> becomes <C p=",">OH^-</C> and <C>NH3</C> becomes <C p=".">NH4^+</C> This is how the base “accepts” the proton.</li>
            </ol>
          </>}
        />
        <Box kind="lecture" src={<Src lec={3} p="19" />} title={<T de="Stärke von Säuren und Basen" en="Strength of acids and bases" />}>
          <T
            de={<p>Die Stärke hängt davon ab, wie viel <C>H^+</C> beziehungsweise <C>OH^-</C> entsteht. Gemessen wird sie mit der pH-Skala (Vorlesung 13). Aber die Wirkung einer Säure hängt nicht nur von der Menge <C>H^+</C> ab, sondern auch vom <em>Anion</em>. Beispiel Flusssäure <CD>HF(aq) -&gt; H^+(aq) + F^-(aq)</CD> eine schwache Säure, aber trotzdem gefährlich wegen <C p=".">F^-</C> Sie ist sehr reaktiv und sehr ätzend. Randnotiz: Ingenieure benutzen <C>HF</C>, um Glas oder Elektronik zu reinigen oder zu ätzen (zum Beispiel im Reinraum der ETH). Vorsicht: <C>HF</C> geht in die Knochen; bei Hautkontakt sofort Hilfe holen!</p>}
            en={<p>The strength depends on how much <C>H^+</C> or <C>OH^-</C> is produced. It is measured by the pH scale (lecture 13). But the reactivity of an acid does not depend only on the amount of <C>H^+</C>; it also depends on the <em>anion</em>. Example hydrofluoric acid <CD>HF(aq) -&gt; H^+(aq) + F^-(aq)</CD> a weak acid, but still nasty because of <C p=".">F^-</C> It is very reactive and very corrosive. Side note: engineers use <C>HF</C> to clean or etch glass or electronics (for example in ETH’s clean room). Be careful: <C>HF</C> is a “bone seeker”; in case of skin contact get help immediately!</p>}
          />
        </Box>
        <T
          de={<p>«Stark» und «schwach» meint also <em>wie viele Moleküle ihr <C>H^+</C> abgeben</em>, nicht wie gefährlich der Stoff ist. Das Bild zeigt zehn Säuremoleküle <C>HA</C> (<C>H</C> an einem Rest <C p=")">A</C> Bei einer starken Säure sind alle gespalten, bei einer schwachen nur wenige.</p>}
          en={<p>“Strong” and “weak” therefore mean <em>how many molecules release their <C>H^+</C></em>, not how dangerous the substance is. The picture shows ten acid molecules <C>HA</C> (<C>H</C> on a remainder <C p=")">A</C> In a strong acid all are split, in a weak acid only a few.</p>}
        />
        <AcidStrength />
      </Section>

      {/* ---------------------------------------------------------------- 2 */}
      <Section id="neutral" title={<T de="2. Neutralisation" en="2. Neutralisation" />}>
        <Box kind="lecture" src={<Src lec={3} p="20" />} title={<T de="Neutralisationsreaktion" en="Neutralisation reaction" />}>
          <T
            de={<>
              <p>Säure plus Base gibt Salz plus Wasser. Randnotiz: Mit «Salz» ist allgemein eine ionische Verbindung gemeint, deren Kation von der Base und deren Anion von der Säure stammt. Beispiel:</p>
              <p><b>Molekulare Gleichung:</b> <C>HCl(aq)</C> (Säure) + <C>NaOH(aq)</C> (Base) gibt <C>H2O(l)</C> + <C p="">NaCl(aq)</C> (Salz).</p>
              <CD>HCl(aq) + NaOH(aq) -&gt; H2O(l) + NaCl(aq)</CD>
              <p><b>Vollständige Ionengleichung:</b></p>
              <CD>H^+(aq) + Cl^-(aq) + Na^+(aq) + OH^-(aq) -&gt; H2O(l) + Na^+(aq) + Cl^-(aq)</CD>
              <p><b>Netto-Ionengleichung:</b></p>
              <CD>H^+(aq) + OH^-(aq) -&gt; H2O(l)</CD>
              <p>Bei der Neutralisation verbinden sich <C>H^+</C> und <C>OH^-</C> zu <C p=".">H2O</C></p>
            </>}
            en={<>
              <p>Acid plus base gives salt plus water. Side note: “salt” generally means an ionic compound whose cation comes from the base and whose anion comes from the acid. Example:</p>
              <p><b>Molecular equation:</b> <C>HCl(aq)</C> (acid) + <C>NaOH(aq)</C> (base) gives <C>H2O(l)</C> + <C p="">NaCl(aq)</C> (salt).</p>
              <CD>HCl(aq) + NaOH(aq) -&gt; H2O(l) + NaCl(aq)</CD>
              <p><b>Complete ionic equation:</b></p>
              <CD>H^+(aq) + Cl^-(aq) + Na^+(aq) + OH^-(aq) -&gt; H2O(l) + Na^+(aq) + Cl^-(aq)</CD>
              <p><b>Net ionic equation:</b></p>
              <CD>H^+(aq) + OH^-(aq) -&gt; H2O(l)</CD>
              <p>In a neutralisation, <C>H^+</C> and <C>OH^-</C> combine to form <C p=".">H2O</C></p>
            </>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> Das ist dieselbe Dreiteilung wie bei der Fällung. Die Spektator-Ionen <C>Na^+</C> und <C>Cl^-</C> stehen links und rechts, sie bleiben gelöst und werden gestrichen. Übrig bleibt die eigentliche Reaktion: das Proton der Säure trifft das <C>OH^-</C> der Base, und beide werden zu Wasser. Das Wasser ist hier das «Produkt», das verhindert, dass die Ionen sich wieder trennen. Im Film unten wird das gezeigt.</p>}
          en={<p><b>How to read this:</b> This is the same three-part scheme as for precipitation. The spectator ions <C>Na^+</C> and <C>Cl^-</C> stand on the left and right, stay dissolved and are cancelled. What remains is the real reaction: the proton of the acid meets the <C>OH^-</C> of the base, and both become water. The water is the “product” that stops the ions from separating again. The film below shows it.</p>}
        />
        <StepPlayer
          label="Salzsäure und Natronlauge neutralisieren sich"
          steps={[
            { ms: 2000, holdMs: 3000, caption: <T de={<>Links die Säure <C>HCl</C> als <C>H^+</C> und <C>Cl^-</C>, rechts die Base <C>NaOH</C> als <C>Na^+</C> und <C p=".">OH^-</C></>} en={<>On the left the acid <C>HCl</C> as <C>H^+</C> and <C>Cl^-</C>, on the right the base <C>NaOH</C> as <C>Na^+</C> and <C p=".">OH^-</C></>} /> },
            { ms: 3500, holdMs: 3000, caption: <T de={<>Gemischt: Alle vier Ionensorten schwimmen im Wasser.</>} en={<>Mixed: all four kinds of ions float in the water.</>} /> },
            { ms: 5000, holdMs: 4000, caption: <T de={<><C>H^+</C> und <C>OH^-</C> finden sich und werden zu Wasser, <C p=".">H2O</C> Die Netto-Gleichung ist <CD>{'H^+(aq) + OH^-(aq) -> H2O(l)'}</CD></>} en={<><C>H^+</C> and <C>OH^-</C> find each other and become water, <C p=".">H2O</C> The net equation is <CD>{'H^+(aq) + OH^-(aq) -> H2O(l)'}</CD></>} /> },
            { ms: 3000, holdMs: 3000, caption: <T de={<><C>Na^+</C> und <C>Cl^-</C> sind unverändert: Zuschauer-Ionen (offene Ringe). Zusammen bleiben sie als gelöstes Salz <C p=".">NaCl</C></>} en={<><C>Na^+</C> and <C>Cl^-</C> are unchanged: spectator ions (open rings). Together they remain as dissolved salt <C p=".">NaCl</C></>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={neutralScene} step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p>Probiere im Labor andere Paare. Der Ablauf ist immer gleich: Säure und Base in Ionen zerlegen (soweit sie sich lösen), das Salz aus Kation der Base und Anion der Säure zusammensetzen, Wasser dazu, ausgleichen. Das Programm tut genau das.</p>}
          en={<p>Try other pairs in the lab. The procedure is always the same: split acid and base into ions (as far as they dissolve), build the salt from the cation of the base and the anion of the acid, add water, balance. The program does exactly this.</p>}
        />
        <NeutralLab />
        <Box kind="uebung" src={<Src ex={3} p="6–7" />} title={<T de="Beispiel 4: Salzsäure und Aluminiumhydroxid" en="Example 4: hydrochloric acid and aluminium hydroxide" />}>
          <T
            de={<>
              <p>Die Übung: <C>HCl</C> und <C>Al(OH)3</C> reagieren. Schreibe die molekulare Gleichung und die Netto-Ionengleichung. Antwort der Übung:</p>
              <CD>3 HCl + Al(OH)3 -&gt; 3 H2O + AlCl3</CD>
              <CD>3 H^+ + 3 OH^- -&gt; 3 H2O</CD>
              <p>Die Netto-Gleichung der Übung behandelt <C>Al(OH)3</C> als gelöst. Nach der Löslichkeitstabelle (Hydroxide sind unlöslich, ausser mit <C>NH4^+</C>, Alkalimetallen, <C>Ca^2+</C>, <C>Sr^2+</C>, <C p=")">Ba^2+</C> ist es ein Feststoff, und der steht in der Netto-Gleichung ganz, so wie <C>CaCO3(s)</C> auf der Folie 21. Streng richtig ist also (Quellenhinweis CH-001):</p>
              <CD>3 H^+(aq) + Al(OH)3(s) -&gt; Al^3+(aq) + 3 H2O(l)</CD>
              <p>Probiere im Bild oben <C>HCl</C> mit <C p=".">Al(OH)3</C></p>
            </>}
            en={<>
              <p>The exercise class: <C>HCl</C> and <C>Al(OH)3</C> react. Write the molecular equation and the net ionic equation. Answer of the exercise class:</p>
              <CD>3 HCl + Al(OH)3 -&gt; 3 H2O + AlCl3</CD>
              <CD>3 H^+ + 3 OH^- -&gt; 3 H2O</CD>
              <p>The exercise class’s net equation treats <C>Al(OH)3</C> as dissolved. According to the solubility chart (hydroxides are insoluble, except with <C>NH4^+</C>, alkali metals, <C>Ca^2+</C>, <C>Sr^2+</C>, <C p=")">Ba^2+</C> it is a solid, and a solid stays whole in the net equation, like <C>CaCO3(s)</C> on slide 21. Strictly correct is therefore (source note CH-001):</p>
              <CD>3 H^+(aq) + Al(OH)3(s) -&gt; Al^3+(aq) + 3 H2O(l)</CD>
              <p>Try <C>HCl</C> with <C p=".">Al(OH)3</C> in the figure above.</p>
            </>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={3} p="6" />} title={<T de="Schwefelsäure und Calciumhydroxid" en="Sulfuric acid and calcium hydroxide" />}>
          <T
            de={<p>Die Übung rechnet vor: <CD>H2SO4 + Ca(OH)2 -&gt; CaSO4 + 2 H2O</CD> Vollständig ionisch: <CD>2 H^+ + SO4^2- + Ca^2+ + 2 OH^- -&gt; 2 H2O + Ca^2+ + SO4^2-</CD> netto <C p=".">2 H^+ + 2 OH^- -&gt; 2 H2O</C> Es zählen «nur die Ionen und Moleküle, die sich ändern». (Nach der Tabelle löst sich <C>CaSO4</C>; die Zuschauer sind hier <C>Ca^2+</C> und <C p=".">SO4^2-</C></p>}
            en={<p>The exercise class computes: <CD>H2SO4 + Ca(OH)2 -&gt; CaSO4 + 2 H2O</CD> Complete ionic: <CD>2 H^+ + SO4^2- + Ca^2+ + 2 OH^- -&gt; 2 H2O + Ca^2+ + SO4^2-</CD> net <C p=".">2 H^+ + 2 OH^- -&gt; 2 H2O</C> Only “the ions and molecules that change” count. (According to the chart <C>CaSO4</C> dissolves; the spectators here are <C>Ca^2+</C> and <C p=".">SO4^2-</C></p>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={3} p="21" />} title={<T de="Kalk entfernen" en="Cleaning limescale" />}>
          <T
            de={<>
              <p>Wir benutzen Neutralisation, um das Bad zu putzen. Kalk aus hartem Wasser ist meist <C p=".">CaCO3</C> Es entsteht durch eine Fällungsreaktion:</p>
              <CD>Ca^2+(aq) + CO3^2-(aq) -&gt; CaCO3(s)</CD>
              <p>Zum Entfernen nimmt man Essig (Essigsäure) und hat eine Neutralisation:</p>
              <CD>CaCO3(s) + 2 CH3COOH(aq) -&gt; H2O(l) + Ca(CH3COO)2(aq) + CO2(g)</CD>
              <p>Die Folie beschriftet: <C>CaCO3</C> ist die unlösliche Base, <C>CH3COOH</C> die Säure, <C>H2O</C> das Produkt der Neutralisation, <C>Ca(CH3COO)2</C> das Salz (Calciumacetat), <C>CO2</C> Kohlendioxid. Die Essigsäure gibt <C>H^+</C> ab (<C>CH3COOH</C> wird zu <C>CH3COO^-</C> und <C p=")">H^+</C> Randnotizen: Die Blasen beim Entkalken sind <C p=".">CO2</C> Die Reaktion ist in Wirklichkeit etwas komplizierter, aber für die harte Schweizer Wasserqualität wichtig. Auch als Magen-Antazidum wird <C>CaCO3</C> verwendet (in der Schweiz «Rennie»); dabei entsteht ebenfalls <C p=".">CO2</C></p>
            </>}
            en={<>
              <p>We use neutralisation to clean our bathrooms. Limescale from hard water is typically <C p=".">CaCO3</C> It forms by a precipitation reaction:</p>
              <CD>Ca^2+(aq) + CO3^2-(aq) -&gt; CaCO3(s)</CD>
              <p>To remove it one uses vinegar (acetic acid), which is a neutralisation:</p>
              <CD>CaCO3(s) + 2 CH3COOH(aq) -&gt; H2O(l) + Ca(CH3COO)2(aq) + CO2(g)</CD>
              <p>The slide labels: <C>CaCO3</C> is the insoluble base, <C>CH3COOH</C> the acid, <C>H2O</C> the product of neutralisation, <C>Ca(CH3COO)2</C> the salt (calcium acetate), <C>CO2</C> carbon dioxide. The acetic acid releases <C>H^+</C> (<C>CH3COOH</C> becomes <C>CH3COO^-</C> and <C p=")">H^+</C> Side notes: the bubbles when descaling are <C p=".">CO2</C> The reaction is actually a little more complicated, but it matters for the hard Swiss water. <C>CaCO3</C> is also used as a stomach antacid (in Switzerland “Rennie”); this also produces <C p=".">CO2</C></p>
            </>}
          />
        </Box>
        <T
          de={<p><b>So liest man die Gleichung:</b> Links der Kalk (fest) und zwei Moleküle Essigsäure. Die zwei Essigsäuren geben zwei <C>H^+</C> ab, und diese beiden verbinden sich mit dem <C>CO3^2-</C> des Kalks zu <C>H2O</C> und <C p=".">CO2</C> Das Gas <C>CO2</C> steigt als Blasen auf. Übrig bleibt <C>Ca^2+</C> mit zwei Acetat-Ionen als lösliches Salz, und der Kalk ist weg.</p>}
          en={<p><b>How to read the equation:</b> On the left the limescale (solid) and two molecules of acetic acid. The two acetic acids release two <C>H^+</C>, and these two combine with the <C>CO3^2-</C> of the limescale to form <C>H2O</C> and <C p=".">CO2</C> The gas <C>CO2</C> rises as bubbles. What remains is <C>Ca^2+</C> with two acetate ions as a soluble salt, and the limescale is gone.</p>}
        />
      </Section>

      {/* ---------------------------------------------------------------- 3 */}
      <Section id="redox" title={<T de="3. Oxidation und Reduktion" en="3. Oxidation and reduction" />}>
        <Box kind="lecture" src={<Src lec={3} p="22" />} title={<T de="Oxidations-Reduktions-Reaktionen («Redox»)" en="Oxidation–reduction (“redox”) reactions" />}>
          <T
            de={<>
              <p>Bisher: Fällung (Kationen und Anionen tauschen Partner), dann Säure-Base (ein Proton wird übertragen). Jetzt die dritte Klasse: Ein <b>Elektron</b> wird zwischen den Reaktanden übertragen. Klassisches Beispiel ist die <b>Korrosion</b>: eine Reaktion zwischen einem Metall und seiner Umgebung.</p>
              <ul>
                <li>Rost: <C>Fe</C> gibt Elektronen an <C>O2</C> in der Luft ab und wird zu <C>Fe2O3</C> (und anderen Eisenoxiden).</li>
                <li>Anlaufen von Silber: <C>Ag</C> gibt Elektronen an <C>H2S</C> ab und wird zu <C p=".">Ag2S</C></li>
              </ul>
              <p>Randnotiz: Redoxreaktionen sind für Ingenieure entscheidend: Batterien, Korrosion, Brennstoffzellen, Galvanisieren. Mehr in Vorlesung 14.</p>
            </>}
            en={<>
              <p>So far: precipitation (cations and anions trade partners), then acid–base (a proton is transferred). Now the third class: an <b>electron</b> is transferred between the reactants. The classic example is <b>corrosion</b>: a reaction between a metal and its environment.</p>
              <ul>
                <li>Rust: <C>Fe</C> gives electrons to <C>O2</C> in the air and becomes <C>Fe2O3</C> (and other iron oxides).</li>
                <li>Tarnish: <C>Ag</C> gives electrons to <C>H2S</C> and becomes <C p=".">Ag2S</C></li>
              </ul>
              <p>Side note: redox reactions are critical for engineers: batteries, corrosion, fuel cells, electroplating. More in lecture 14.</p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src lec={3} p="23–24" />} title={<T de="Oxidation und Reduktion gehören zusammen" en="Oxidation and reduction go together" />}>
          <T
            de={<>
              <p><b>Oxidation</b> (<En>oxidation</En>): Ein Atom, Ion oder Molekül <em>verliert Elektronen</em> und wird positiver geladen. <b>Reduktion</b> (<En>reduction</En>): Es <em>nimmt Elektronen auf</em>. Beispiel:</p>
              <CD>2 Ca(s) + O2(g) -&gt; 2 CaO(s)</CD>
              <p>Jedes Calciumatom startet neutral und wird zu <C>Ca^2+</C> (oxidiert). Jedes Sauerstoffatom startet neutral und wird zu <C>O^2-</C> (reduziert). Randnotiz: Der Name «Oxidation» kommt daher, dass die ersten untersuchten Reaktionen dieser Art ein Metall waren, das seine Elektronen an Sauerstoff abgab und ein Metalloxid wie Rost bildete.</p>
              <p>Eine Spezies gibt Elektronen ab, die andere nimmt sie auf. Zum Merken: <b>«<En>LEO the lion says GER</En>»</b>: <En><b>L</b>osing <b>e</b>lectrons is <b>o</b>xidation</En> (Elektronen verlieren heisst oxidiert), <En><b>G</b>aining <b>e</b>lectrons is <b>r</b>eduction</En> (Elektronen aufnehmen heisst reduziert). Offene Frage der Folie: ein Buchhaltungssystem, um die übertragenen Elektronen zu zählen.</p>
            </>}
            en={<>
              <p><b>Oxidation</b>: an atom, ion or molecule <em>loses electrons</em> and becomes more positively charged. <b>Reduction</b>: it <em>accepts electrons</em>. Example:</p>
              <CD>2 Ca(s) + O2(g) -&gt; 2 CaO(s)</CD>
              <p>Each calcium atom starts neutral and becomes <C>Ca^2+</C> (oxidised). Each oxygen atom starts neutral and becomes <C>O^2-</C> (reduced). Side note: the name “oxidation” comes from the fact that the first reactions of this kind that were studied involved a metal giving its electrons to oxygen, forming a metal oxide like rust.</p>
              <p>One species gives up electrons, the other accepts them. To remember: <b>“LEO the lion says GER”</b>: <b>L</b>osing <b>e</b>lectrons is <b>o</b>xidation, <b>G</b>aining <b>e</b>lectrons is <b>r</b>eduction. Open question of the slide: a book-keeping system to keep track of the transferred electrons.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das Beispiel:</b></p>
            <ol className="keep">
              <li>Ein neutrales <C>Ca</C> hat gleich viele Protonen wie Elektronen. Es gibt zwei Elektronen ab und hat jetzt zwei <em>Plus</em> mehr als Minus: <C p=".">Ca^2+</C> Es hat Elektronen verloren: oxidiert.</li>
              <li>Ein <C>O2</C>-Molekül hat vier Elektronen aufgenommen, zwei für jedes seiner Atome: <C p=".">2 O^2-</C> Es hat Elektronen gewonnen: reduziert.</li>
              <li>Die Elektronen verschwinden nicht: Zwei <C>Ca</C> geben vier Elektronen ab, ein <C>O2</C> nimmt vier auf. Die Zahlen gehen auf.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the example:</b></p>
            <ol className="keep">
              <li>A neutral <C>Ca</C> has as many protons as electrons. It gives away two electrons and now has two <em>plus</em> more than minus: <C p=".">Ca^2+</C> It lost electrons: oxidised.</li>
              <li>An <C>O2</C> molecule took up four electrons, two for each of its atoms: <C p=".">2 O^2-</C> It gained electrons: reduced.</li>
              <li>The electrons do not disappear: two <C>Ca</C> give away four electrons, one <C>O2</C> takes up four. The numbers add up.</li>
            </ol>
          </>}
        />
      </Section>

      {/* ---------------------------------------------------------------- 4 */}
      <Section id="oxzahl" title={<T de="4. Oxidationszahlen: die Buchhaltung der Elektronen" en="4. Oxidation numbers: book-keeping for electrons" />}>
        <Box kind="lecture" src={<Src lec={3} p="25–26" />} title={<T de="Oxidationszahlen (Oxidationsstufen)" en="Oxidation numbers (oxidation states)" />}>
          <T
            de={<>
              <p>Jedem Atom in einem neutralen Stoff oder Ion wird eine <b>Oxidationszahl</b> (<En>oxidation number</En>) zugeordnet. Bei einatomigen Ionen ist sie gleich der Ladung. Bei neutralen Molekülen oder mehratomigen Ionen ist sie die <em>hypothetische Ladung</em> jedes Atoms (Randnotiz: wir verteilen die Elektronen künstlich auf alle Atome des Moleküls). Randnotiz zur Schreibweise: Echte Ladungen schreibt man erst Zahl, dann Vorzeichen (<C>Ca^2+</C>), Oxidationszahlen erst Vorzeichen, dann Zahl (<M p=").">{t`+2`}</M></p>
              <p><b>Regeln</b> (Randnotiz: Die Oxidationszahl ist im Allgemeinen nicht die elektrische Ladung des Atoms. Sie verfolgt nur den Elektronenfluss):</p>
              <ul>
                <li>Atome in elementarer Form: <M p=".">0</M></li>
                <li>Einatomige Ionen: die Ionenladung.</li>
                <li>Nichtmetalle in ionischen oder molekularen Verbindungen haben negative Oxidationszahlen: Sauerstoff <M>{t`-2`}</M> (ausser im Peroxid-Ion <C p=",">O2^2-</C> dort <M p=")">{t`-1`}</M> Wasserstoff <M>{t`+1`}</M> (ausser an ein Metall gebunden, dann <M p=";">{t`-1`}</M> Beispiel <C p=")">NaH</C> Fluor immer <M p=";">{t`-1`}</M> Chlor, Brom, Iod <M>{t`-1`}</M> (ausser positiv, wenn an Sauerstoff gebunden).</li>
                <li>Die Summe aller Oxidationszahlen in einer Verbindung ist die Gesamtladung. (Randnotiz: Damit prüft man oder bestimmt das letzte Atom.)</li>
              </ul>
              <p>Beispiel: <CD>Mg(s) + 2 HCl(aq) -&gt; MgCl2(aq) + H2(g)</CD> Oxidationszahlen: <M>{t`0`}</M> für <C>Mg</C>; <M>{t`+1`}</M> für <C>H</C> und <M>{t`-1`}</M> für <C>Cl</C> in <C p=";">HCl</C> <M>{t`+2`}</M> für <C>Mg</C> und <M>{t`-1`}</M> für <C>Cl</C> in <C p=";">MgCl2</C> <M>{t`0`}</M> für <C>H</C> in <C p=".">H2</C> <b><C>Mg</C> wird oxidiert, <C>Mg</C> reduziert <C>H</C>: <C>Mg</C> ist das Reduktionsmittel (<En>reductant, reducing agent</En>). <C>H</C> wird reduziert, <C>H</C> oxidiert <C>Mg</C>: <C>H</C> ist das Oxidationsmittel (<En>oxidiser, oxidising agent</En>).</b> Randnotiz: Solche Reaktionen zwischen Metall und Säure (oder Salz) heissen Verdrängungsreaktionen: <M p=".">{t`\mathrm{A} + \mathrm{BX} \to \mathrm{AX} + \mathrm{B}`}</M></p>
            </>}
            en={<>
              <p>Each atom in a neutral substance or ion is assigned an <b>oxidation number</b>. For monatomic ions it equals the charge. For neutral molecules or polyatomic ions it is the <em>hypothetical charge</em> of each atom (side note: we artificially distribute the electrons among all atoms of the molecule). Side note on notation: actual charges are written number first, then sign (<C>Ca^2+</C>), oxidation numbers sign first, then number (<M p=").">{t`+2`}</M></p>
              <p><b>Rules</b> (side note: in general the oxidation number is not the electrical charge on the atom. It just tracks electron flow):</p>
              <ul>
                <li>Atoms in elemental form: <M p=".">0</M></li>
                <li>Monatomic ions: the ionic charge.</li>
                <li>Nonmetals in ionic or molecular compounds have negative oxidation numbers: oxygen <M>{t`-2`}</M> (except in the peroxide ion <C p=",">O2^2-</C> where it is <M p=")">{t`-1`}</M> hydrogen <M>{t`+1`}</M> (except when bonded to a metal, then <M p=";">{t`-1`}</M> example <C p=")">NaH</C> fluorine always <M p=";">{t`-1`}</M> chlorine, bromine, iodine <M>{t`-1`}</M> (except positive when bonded to oxygen).</li>
                <li>The sum of the oxidation numbers of all atoms in a compound equals its net charge. (Side note: use it to check, or to find the last atom.)</li>
              </ul>
              <p>Example: <CD>Mg(s) + 2 HCl(aq) -&gt; MgCl2(aq) + H2(g)</CD> Oxidation numbers: <M>{t`0`}</M> for <C>Mg</C>; <M>{t`+1`}</M> for <C>H</C> and <M>{t`-1`}</M> for <C>Cl</C> in <C p=";">HCl</C> <M>{t`+2`}</M> for <C>Mg</C> and <M>{t`-1`}</M> for <C>Cl</C> in <C p=";">MgCl2</C> <M>{t`0`}</M> for <C>H</C> in <C p=".">H2</C> <b><C>Mg</C> is oxidised, <C>Mg</C> reduces <C>H</C>: <C>Mg</C> is the reductant (reducing agent). <C>H</C> is reduced, <C>H</C> oxidises <C>Mg</C>: <C>H</C> is the oxidiser (oxidising agent).</b> Side note: such reactions between a metal and an acid (or salt) are called displacement reactions: <M p=".">{t`\mathrm{A} + \mathrm{BX} \to \mathrm{AX} + \mathrm{B}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Regeln:</b></p>
            <ol className="keep">
              <li>Man tut so, als wären alle Bindungen rein ionisch: Das <em>elektronegativere</em> Atom bekommt die gemeinsamen Elektronen ganz. Im Wasser <C>H2O</C> «gehört» das Elektronenpaar dem <C>O</C>. Darum <C>O</C> negativ, <C>H</C> positiv.</li>
              <li>Fluor ist immer <M p=",">{t`-1`}</M> Sauerstoff fast immer <M p=".">{t`-2`}</M> Das sind die sicheren «Anker».</li>
              <li>Für den Rest rechnet man: Summe der Zahlen gleich Gesamtladung. In <C>H2SO4</C> (neutral): <M>{t`2\cdot(+1) + x + 4\cdot(-2) = 0`}</M> gibt <M p=".">{t`x = +6`}</M> für <C p=".">S</C></li>
              <li>Eine Oxidation <em>erhöht</em> die Oxidationszahl (Elektronen weg), eine Reduktion <em>senkt</em> sie. Die Zahl zeigt, wer Elektronen gegeben und wer sie genommen hat.</li>
            </ol>
            <p>Im Rechner unten kannst du beliebige Formeln eingeben. Er wendet dieselben Regeln an und zeigt zu jedem Element, welche Regel gegriffen hat.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the rules:</b></p>
            <ol className="keep">
              <li>You pretend all bonds are purely ionic: the <em>more electronegative</em> atom gets the shared electrons entirely. In water <C>H2O</C> the electron pair “belongs” to <C>O</C>. So <C>O</C> is negative, <C>H</C> positive.</li>
              <li>Fluorine is always <M p=",">{t`-1`}</M> oxygen almost always <M p=".">{t`-2`}</M> These are the safe “anchors”.</li>
              <li>For the rest you compute: sum of the numbers equals the net charge. In <C>H2SO4</C> (neutral): <M>{t`2\cdot(+1) + x + 4\cdot(-2) = 0`}</M> gives <M p=".">{t`x = +6`}</M> for <C p=".">S</C></li>
              <li>An oxidation <em>raises</em> the oxidation number (electrons gone), a reduction <em>lowers</em> it. The number shows who gave electrons and who took them.</li>
            </ol>
            <p>In the calculator below you can enter any formula. It applies the same rules and shows for each element which rule applied.</p>
          </>}
        />
        <OxNumCalc />
        <Box kind="uebung" src={<Src ex={3} p="8, 13" />} title={<T de="Beispiele 5 und 6, Bonus 1" en="Examples 5 and 6, bonus 1" />}>
          <T
            de={<>
              <p><b>Beispiel 5:</b> Setze die Oxidationszahlen unter jedes Atom: <C>H2O</C>: <M p=",">{t`+1`}</M> <M p=";">{t`-2`}</M> <C>O2</C>: <M p=";">0</M> <C>Na^+</C>: <M p=";">{t`+1`}</M> <C>MgCl2</C>: <M p=",">{t`+2`}</M> <M p=";">{t`-1`}</M> <C>CO2</C>: <M p=",">{t`+4`}</M> <M p=".">{t`-2`}</M></p>
              <p><b>Beispiel 6:</b> Welches Element wird oxidiert, welches reduziert? (a) <CD>N2(g) + 3 H2(g) -&gt; 2 NH3(g)</CD> Oxidationszahlen <M p=",">0</M> <M>0</M> werden zu <M p=",">{t`-3`}</M> <M p=".">{t`+1`}</M> <C>N</C> nimmt Elektronen auf: reduziert. <C>H</C> gibt Elektronen ab: oxidiert. (b) <CD>3 Fe(NO3)2(aq) + 2 Al(s) -&gt; 3 Fe(s) + 2 Al(NO3)3(aq)</CD> <C>Fe</C> geht von <M>{t`+2`}</M> auf <M p=":">0</M> reduziert. <C>Al</C> geht von <M>0</M> auf <M p=":">{t`+3`}</M> oxidiert. (<C>NO3^-</C> bleibt gleich: Zuschauer.)</p>
              <p><b>Bonus 1:</b> Oxidationszahl von Schwefel in (a) <C p=",">H2S</C> (b) <C p=",">S8</C> (c) <C p=",">SCl2</C> (d) <C p=",">Na2SO3</C> (e) <C p="">SO4^2-</C> Antworten der Übung: <M p=",">{t`-2`}</M> <M p=",">0</M> <M p=",">{t`+2`}</M> <M p=",">{t`+4`}</M> <M p=".">{t`+6`}</M> (Kontrolle: <C>SO4^2-</C>: <M p=".">{t`x + 4\cdot(-2) = -2`}</M> also <M p=".">{t`x = +6`}</M></p>
            </>}
            en={<>
              <p><b>Example 5:</b> put the oxidation numbers under each atom: <C>H2O</C>: <M p=",">{t`+1`}</M> <M p=";">{t`-2`}</M> <C>O2</C>: <M p=";">0</M> <C>Na^+</C>: <M p=";">{t`+1`}</M> <C>MgCl2</C>: <M p=",">{t`+2`}</M> <M p=";">{t`-1`}</M> <C>CO2</C>: <M p=",">{t`+4`}</M> <M p=".">{t`-2`}</M></p>
              <p><b>Example 6:</b> which element is oxidised and which is reduced? (a) <CD>N2(g) + 3 H2(g) -&gt; 2 NH3(g)</CD> Oxidation numbers <M p=",">0</M> <M>0</M> become <M p=",">{t`-3`}</M> <M p=".">{t`+1`}</M> <C>N</C> gains electrons: reduced. <C>H</C> loses electrons: oxidised. (b) <CD>3 Fe(NO3)2(aq) + 2 Al(s) -&gt; 3 Fe(s) + 2 Al(NO3)3(aq)</CD> <C>Fe</C> goes from <M>{t`+2`}</M> to <M p=":">0</M> reduced. <C>Al</C> goes from <M>0</M> to <M p=":">{t`+3`}</M> oxidised. (<C>NO3^-</C> stays the same: spectator.)</p>
              <p><b>Bonus 1:</b> oxidation number of sulfur in (a) <C p=",">H2S</C> (b) <C p=",">S8</C> (c) <C p=",">SCl2</C> (d) <C p=",">Na2SO3</C> (e) <C p="">SO4^2-</C> Answers of the exercise class: <M p=",">{t`-2`}</M> <M p=",">0</M> <M p=",">{t`+2`}</M> <M p=",">{t`+4`}</M> <M p=".">{t`+6`}</M> (check: <C>SO4^2-</C>: <M p=".">{t`x + 4\cdot(-2) = -2`}</M> so <M p=".">{t`x = +6`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<p>Jetzt dasselbe Beispiel der Folie als Film. Man sieht die Elektronen wandern und die Oxidationszahlen sich ändern. Die Zahl unter jedem Atom ist die Buchhaltung: <C>Mg</C> von <M>0</M> auf <M p=",">{t`+2`}</M> jedes <C>H</C> von <M>{t`+1`}</M> auf <M p=",">0</M> das <C>Cl</C> bleibt bei <M p=".">{t`-1`}</M></p>}
          en={<p>Now the slide’s example as a film. You see the electrons move and the oxidation numbers change. The number under each atom is the book-keeping: <C>Mg</C> from <M>0</M> to <M p=",">{t`+2`}</M> each <C>H</C> from <M>{t`+1`}</M> to <M p=",">0</M> the <C>Cl</C> stays at <M p=".">{t`-1`}</M></p>}
        />
        <StepPlayer
          label="Magnesium und Salzsäure: Elektronen und Oxidationszahlen"
          steps={[
            { ms: 2000, holdMs: 3500, caption: <T de={<>Magnesium und zwei Salzsäure-Moleküle. Unter jedem Atom steht die Oxidationszahl: <M>0</M> bei <C p=",">Mg</C> <M>{t`+1`}</M> bei jedem <C p=",">H</C> <M>{t`-1`}</M> bei jedem <C p=".">Cl</C></>} en={<>Magnesium and two hydrochloric acid molecules. Under each atom is its oxidation number: <M>0</M> for <C p=",">Mg</C> <M>{t`+1`}</M> for each <C p=",">H</C> <M>{t`-1`}</M> for each <C p=".">Cl</C></>} /> },
            { ms: 4500, holdMs: 4000, caption: <T de={<>Zwei Elektronen (gold) wandern von <C>Mg</C> zu den beiden <C p=".">H</C> <C>Mg</C> steht nun bei <M p=",">{t`+2`}</M> jedes <C>H</C> bei <M p=".">0</M> Das <C>Cl</C> bleibt bei <M p=".">{t`-1`}</M></>} en={<>Two electrons (gold) move from <C>Mg</C> to the two <C p=".">H</C> <C>Mg</C> is now at <M p=",">{t`+2`}</M> each <C>H</C> at <M p=".">0</M> The <C>Cl</C> stays at <M p=".">{t`-1`}</M></>} /> },
            { ms: 3000, holdMs: 3500, caption: <T de={<><C>Mg</C> gibt zwei Elektronen ab: oxidiert (Oxidationszahl steigt, Reduktionsmittel). <C>H</C> nimmt je eins auf: reduziert (Zahl sinkt, Oxidationsmittel). <C>Cl</C> ändert sich nicht. Die abgegebenen und aufgenommenen Elektronen sind gleich viele.</>} en={<><C>Mg</C> gives away two electrons: oxidised (number rises, reductant). Each <C>H</C> takes one: reduced (number falls, oxidiser). <C>Cl</C> does not change. The electrons given and taken are equal in number.</>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={redoxScene} step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ---------------------------------------------------------------- 5 */}
      <Section id="reihe" title={<T de="5. Die Aktivitätsreihe der Metalle" en="5. The activity series of metals" />}>
        <T
          de={<p>Welche Metalle geben Elektronen leicht ab? Gold glänzt im Schaufenster seit Jahren, Eisen rostet nach wenigen Monaten, Natrium reagiert schon mit Wasser. Die <b>Aktivitätsreihe</b> ordnet die Metalle nach genau dieser Neigung.</p>}
          en={<p>Which metals give away electrons easily? Gold stays shiny in a shop window for years, iron rusts within months, sodium reacts even with water. The <b>activity series</b> sorts the metals by exactly this tendency.</p>}
        />
        <Box kind="lecture" src={<Src lec={3} p="27–28" />} title={<T de="Aktivitätsreihe und ihre Anwendung" en="Activity series and how to use it" />}>
          <T
            de={<>
              <p>Wie sagt man voraus, welches Metall oxidiert wird? Die <b>Aktivitätsreihe</b> (<En>activity series</En>) listet Metalle nach der Leichtigkeit der Oxidation: oben Lithium (<C p=")">{'Li(s) -> Li^+(aq) + e^-'}</C> am leichtesten, über Eisen (<CD>{'Fe(s) -> Fe^2+(aq) + 2 e^-'}</CD> bis unten Gold (<CD>{'Au(s) -> Au^3+(aq) + 3 e^-'}</CD> am schwersten. Randnotiz: Edelmetalle stehen unten, sind also wenig reaktiv. Gold korrodiert kaum und dient darum als stabile Währung. Die vollständige Liste ist Tabelle 4.5 bei Brown (unten im Bild). Es ist auch nicht überraschend, dass Lithium in Lithium-Ionen-Akkus steckt (Vorlesung 14).</p>
              <p>Mit der Reihe sagt man voraus, ob ein Metall mit einem anderen Metall-Kation oder mit einer Säure reagiert (Randnotiz: wichtig für die Elektrochemie):</p>
              <ul>
                <li><b>Jedes Metall kann von den Metall-Kationen <em>unter</em> ihm in der Reihe oxidiert werden.</b> Beispiel (Silber steht unter Kupfer): <CD>{'Cu(s) + 2 Ag^+(aq) -> Cu^2+(aq) + 2 Ag(s)'}</CD></li>
                <li><b>Jedes Metall <em>über</em> Wasserstoff in der Reihe kann mit Säure zu <C>H2</C> reagieren.</b> Beispiel (Nickel steht über <C>H2</C>): <CD>{'Ni(s) + 2 HCl(aq) -> NiCl2(aq) + H2(g)'}</CD></li>
              </ul>
            </>}
            en={<>
              <p>How do we predict which metal will be oxidised? The <b>activity series</b> lists metals by the ease of oxidation: at the top lithium (<C p=")">{'Li(s) -> Li^+(aq) + e^-'}</C> easiest, via iron (<CD>{'Fe(s) -> Fe^2+(aq) + 2 e^-'}</CD> down to gold (<CD>{'Au(s) -> Au^3+(aq) + 3 e^-'}</CD> hardest. Side note: noble metals are near the bottom, so not reactive. Gold hardly corrodes and is therefore used as a stable currency. The complete list is Table 4.5 in Brown (at the bottom of the figure). It is also not surprising that lithium is used in lithium-ion batteries (lecture 14).</p>
              <p>With the series you predict whether a metal reacts with another metal cation or with an acid (side note: important for electrochemistry):</p>
              <ul>
                <li><b>Any metal can be oxidised by the metal cations <em>below</em> it in the series.</b> Example (silver is below copper): <CD>{'Cu(s) + 2 Ag^+(aq) -> Cu^2+(aq) + 2 Ag(s)'}</CD></li>
                <li><b>Any metal <em>above</em> hydrogen in the series can react with acid to form <C>H2</C>.</b> Example (nickel is above <C>H2</C>): <CD>{'Ni(s) + 2 HCl(aq) -> NiCl2(aq) + H2(g)'}</CD></li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Regel:</b></p>
            <ol className="keep">
              <li>Ein Metall weiter <em>oben</em> gibt seine Elektronen lieber ab. Ein Kation weiter <em>unten</em> nimmt Elektronen lieber auf (das Metall darunter hält seine Elektronen lieber fest).</li>
              <li>Taucht man Kupfer in eine Lösung mit <C>Ag^+</C> ein, nehmen zwei Silber-Ionen die zwei Elektronen eines Kupferatoms auf (eines pro Ion): <C>Cu</C> wird zu <C>Cu^2+</C> und löst sich auf, das Silber setzt sich als Metall auf dem Kupfer ab. Umgekehrt (Silber in <C>Cu^2+</C>) passiert nichts: Silber gibt seine Elektronen nicht her.</li>
              <li>Die Zahl der Elektronen muss aufgehen: Kupfer gibt zwei ab, jedes <C>Ag^+</C> nimmt eins auf. Darum die Koeffizienten <M>2</M> bei <C>Ag^+</C> und <C p=".">Ag</C></li>
              <li>Wasserstoff steht mitten in der Reihe, weil <C>H^+</C> in Säure Elektronen aufnehmen kann: <CD>{'2 H^+(aq) + 2 e^- -> H2(g)'}</CD> Metalle oberhalb schenken ihm Elektronen, unterhalb nicht: Kupfer löst sich nicht in Salzsäure.</li>
            </ol>
            <p>Im Bild stellst du ein Metall in eine Lösung. Die Reihe zeigt, wer oben steht. Links ist der Zustand vorher, rechts nachher.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the rule:</b></p>
            <ol className="keep">
              <li>A metal further <em>up</em> gives away its electrons more readily. A cation further <em>down</em> takes up electrons more readily (the metal below holds on to its electrons more tightly).</li>
              <li>If you dip copper into a solution with <C>Ag^+</C>, two silver ions take up the two electrons of one copper atom (one per ion): <C>Cu</C> becomes <C>Cu^2+</C> and dissolves, and the silver deposits as metal on the copper. The other way round (silver in <C>Cu^2+</C>) nothing happens: silver does not give up its electrons.</li>
              <li>The number of electrons must add up: copper gives two, each <C>Ag^+</C> takes one. Hence the coefficients <M>2</M> at <C>Ag^+</C> and <C p=".">Ag</C></li>
              <li>Hydrogen is in the middle of the series because <C>H^+</C> in acid can take up electrons: <CD>{'2 H^+(aq) + 2 e^- -> H2(g)'}</CD> Metals above give it electrons, metals below do not: copper does not dissolve in hydrochloric acid.</li>
            </ol>
            <p>In the picture you put a metal into a solution. The series shows who is on top. On the left is the state before, on the right after.</p>
          </>}
        />
        <ActivityLab />
        <Box kind="uebung" src={<Src ex={3} p="9–10" />} title={<T de="Beispiele 7 und 8" en="Examples 7 and 8" />}>
          <T
            de={<>
              <p><b>Beispiel 7:</b> Welche Kombination aus Metall und Metall-Ion reagiert? (a) <C>Ca(s)</C> und <C>K^+(aq)</C>, (b) <C>Fe(s)</C> und <C>Al^3+(aq)</C>, (c) <C>Ag(s)</C> und <C>Cu^2+(aq)</C>, (d) <C>Fe(s)</C> und <C>Pb^2+(aq)</C> Antwort der Übung: nur (d). In (a), (b), (c) steht das Metall <em>unter</em> dem Kation (<C>K</C> steht über <C>Ca</C>, <C>Al</C> über <C>Fe</C>, <C>Cu</C> über <C>Ag</C>). Nur <C>Pb</C> steht unter <C>Fe</C>.</p>
              <p><b>Beispiel 8:</b> Schreibe ausgeglichene Gleichungen (keine Reaktion: NR). (a) Eisen in Kupfer(II)-nitrat: <CD>{'Fe(s) + Cu(NO3)2(aq) -> Fe(NO3)2(aq) + Cu(s)'}</CD> Die Übung zählt zwei übertragene Elektronen. (b) Zink in Magnesiumsulfat: <C>Zn</C> steht unter <C p=",">Mg</C> also NR. (c) Bromwasserstoffsäure auf Zinn: <CD>{'2 HBr(aq) + Sn(s) -> SnBr2(aq) + H2(g)'}</CD> <C>Sn</C> steht über <C p=",">H2</C> zwei Elektronen werden übertragen. Alle Fälle kannst du im Bild oben nachstellen.</p>
            </>}
            en={<>
              <p><b>Example 7:</b> which combination of metal and metal ion reacts? (a) <C>Ca(s)</C> and <C>K^+(aq)</C>, (b) <C>Fe(s)</C> and <C>Al^3+(aq)</C>, (c) <C>Ag(s)</C> and <C>Cu^2+(aq)</C>, (d) <C>Fe(s)</C> and <C>Pb^2+(aq)</C> Answer of the exercise class: only (d). In (a), (b), (c) the metal is <em>below</em> the cation (<C>K</C> is above <C>Ca</C>, <C>Al</C> above <C>Fe</C>, <C>Cu</C> above <C>Ag</C>). Only <C>Pb</C> is below <C>Fe</C>.</p>
              <p><b>Example 8:</b> write balanced equations (no reaction: NR). (a) iron in copper(II) nitrate: <CD>{'Fe(s) + Cu(NO3)2(aq) -> Fe(NO3)2(aq) + Cu(s)'}</CD> The exercise class counts two electrons transferred. (b) zinc in magnesium sulfate: <C>Zn</C> is below <C p=",">Mg</C> so NR. (c) hydrobromic acid on tin: <CD>{'2 HBr(aq) + Sn(s) -> SnBr2(aq) + H2(g)'}</CD> <C>Sn</C> is above <C p=",">H2</C> two electrons are transferred. You can set up all cases in the picture above.</p>
            </>}
          />
        </Box>
      </Section>

      <Box kind="misconception" title={<T de="«Oxidation heisst: es reagiert mit Sauerstoff»" en="“Oxidation means: it reacts with oxygen”" />}>
        <T
          de={<p>Der Name stammt daher, aber die Definition ist allgemeiner: Oxidation ist <em>Elektronenverlust</em>. Im Beispiel <C>Mg</C> mit <C>HCl</C> kommt kein Sauerstoff vor, und <C>Mg</C> wird trotzdem oxidiert.</p>}
          en={<p>The name comes from there, but the definition is more general: oxidation is <em>loss of electrons</em>. In the example <C>Mg</C> with <C>HCl</C> there is no oxygen, and <C>Mg</C> is oxidised all the same.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die Oxidationszahl ist die Ladung des Atoms»" en="“The oxidation number is the charge of the atom”" />}>
        <T
          de={<p>Nur bei einatomigen Ionen. In <C>H2O</C> trägt <C>O</C> keine echte Ladung von <M p=";">{t`-2`}</M> die Zahl ist ein Rechenmittel, um Elektronen zu verfolgen. Darum wird sie mit dem Vorzeichen zuerst geschrieben (<M p=")">{t`-2`}</M> echte Ladungen mit der Zahl zuerst (<C p=")">O^2-</C></p>}
          en={<p>Only for monatomic ions. In <C>H2O</C> the <C>O</C> does not carry a real charge of <M p=";">{t`-2`}</M> the number is a bookkeeping tool for following electrons. That is why it is written sign first (<M p=")">{t`-2`}</M> real charges number first (<C p=")">O^2-</C></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Eine starke Säure ist immer gefährlicher»" en="“A strong acid is always more dangerous”" />}>
        <T
          de={<p>Stark heisst nur, dass viele Moleküle ihr <C>H^+</C> abgeben. Flusssäure <C>HF</C> ist eine <em>schwache</em> Säure und trotzdem sehr gefährlich, wegen des <C p=".">F^-</C> (Folie 19).</p>}
          en={<p>Strong only means that many molecules release their <C>H^+</C>. Hydrofluoric acid <C>HF</C> is a <em>weak</em> acid and still very dangerous, because of the <C p=".">F^-</C> (slide 19).</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Weil Gold unten steht, ist es ‹schwach›»" en="“Because gold is at the bottom, it is ‘weak’”" />}>
        <T
          de={<p>Unten in der Reihe heisst: Das Metall gibt seine Elektronen <em>ungern</em> ab. Das macht es beständig, nicht schwach. Darum rostet Gold nicht und ist als Währung geeignet.</p>}
          en={<p>Low in the series means: the metal gives up its electrons <em>reluctantly</em>. That makes it durable, not weak. This is why gold does not rust and suits as a currency.</p>}
        />
      </Box>

      <Box kind="key" title={<T de="Merke" en="Key points" />}>
        <T
          de={<ul>
            <li>Säure gibt <C>H^+</C> ab, Base nimmt es auf. Stark heisst: viele Moleküle geben ihr <C>H^+</C> ab.</li>
            <li>Neutralisation: Säure und Base geben Salz und Wasser; netto verbinden sich <C>H^+</C> und <C>OH^-</C> zu <C p=".">H2O</C></li>
            <li>Redox: Oxidation ist Elektronen verlieren, Reduktion ist Elektronen aufnehmen (Merkspruch: «<En>LEO the lion says GER</En>»). Beides geschieht gleichzeitig.</li>
            <li>Oxidationszahlen verfolgen die Elektronen: Oxidation erhöht sie, Reduktion senkt sie. Die Summe ist die Gesamtladung.</li>
            <li>Aktivitätsreihe: Ein Metall wird von den Kationen unter ihm oxidiert; ein Metall über <C>H2</C> löst sich in Säure unter <C>H2</C>-Bildung.</li>
          </ul>}
          en={<ul>
            <li>An acid releases <C>H^+</C>, a base accepts it. Strong means: many molecules release their <C>H^+</C>.</li>
            <li>Neutralisation: acid and base give salt and water; net, <C>H^+</C> and <C>OH^-</C> combine to <C p=".">H2O</C></li>
            <li>Redox: oxidation is losing electrons, reduction is gaining electrons. “LEO the lion says GER”. Both happen at the same time.</li>
            <li>Oxidation numbers track the electrons: oxidation raises them, reduction lowers them. The sum is the net charge.</li>
            <li>Activity series: a metal is oxidised by the cations below it; a metal above <C>H2</C> dissolves in acid with formation of <C>H2</C>.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
