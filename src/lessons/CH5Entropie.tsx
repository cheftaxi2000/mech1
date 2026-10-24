import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { EntropyStaircase } from '../viz/chem/EntropyStaircase';
import { ExpansionFigure } from '../viz/chem/ExpansionFigure';
import { HeatFlowFigure } from '../viz/chem/HeatFlowFigure';
import { LatticeFigure } from '../viz/chem/LatticeFigure';
import { UniverseBalanceFigure } from '../viz/chem/UniverseBalanceFigure';

const t = String.raw;

export default function CH5Entropie() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eis schmilzt in deiner Hand, obwohl es dafür Energie braucht. Ein Ball rollt von selbst den Hügel hinunter, nie hinauf. Welche Grösse sagt uns, in welche Richtung ein Vorgang von selbst läuft? Die Energie allein ist es nicht. Die gesuchte Grösse heisst Entropie, und sie hat mit dem Abzählen von Möglichkeiten zu tun.</p>}
        en={<p className="lede">Ice melts in your hand although that takes energy. A ball rolls down a hill by itself, never up. Which quantity tells us in which direction a process runs by itself? Energy alone does not. The quantity we are looking for is called entropy, and it has to do with counting possibilities.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir ein sauber aufgeräumtes Zimmer vor und ein Zimmer nach einer Party. Es gibt nur ganz wenige Arten, wie alles ordentlich liegt, aber unzählige Arten, wie es unordentlich liegt. Wenn nichts nachhilft, landet das Zimmer fast sicher in einer der vielen unordentlichen Anordnungen. Entropie zählt genau das: auf wie viele Arten kann das Gleiche aussehen?</p>}
          en={<p>Picture a tidy room and a room after a party. There are only very few ways in which everything lies in order, but countless ways in which it lies in a mess. If nothing helps, the room ends up almost certainly in one of the many messy arrangements. Entropy counts exactly that: in how many ways can the same thing look?</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="spontan" title={<T de="1. Spontan oder nicht spontan?" en="1. Spontaneous or not?" />}>
        <Box kind="lecture" src={<Src lec={5} p="7–8" />} title={<T de="Spontane Prozesse" en="Spontaneous processes" />}>
          <T
            de={<>
              <p>Letztes Mal: Energieerhaltung. Heute: Welche Prozesse laufen «spontan» ab?</p>
              <ul>
                <li><b>Spontaner Prozess</b> (<i>spontaneous process</i>): ein Prozess, der ohne Nachhilfe abläuft (Rand: «gestützt auf unsere Erfahrung»).</li>
                <li>Kriterium? Spontane Prozesse scheinen ihre Energie zu senken. Beispiel: bei konstantem <M>P</M> spontan, wenn <M>{t`\Delta H < 0`}</M> (exotherm)?</li>
                <li><b>Kann nicht die ganze Antwort sein:</b> Viele spontane Prozesse haben <M>{t`\Delta H < 0`}</M> (Rand: Verbrennung von <C>H2</C>). Andere haben <M>{t`\Delta H > 0`}</M> (endotherm). Beispiel: Eis schmilzt spontan, <M p=".">{t`\Delta H = +6{,}0\,\mathrm{kJ\,mol^{-1}}`}</M></li>
                <li>«Etwas fehlt in unserer Beschreibung … Was?»</li>
              </ul>
              <p>Folie 8 ergänzt Eigenschaften spontaner Prozesse: Ist ein Prozess spontan, ist der umgekehrte nicht spontan (ein Ball rollt nicht von selbst den Hügel hinauf). Die Versuchsbedingungen (<M p=",">T</M> <M p=")">P</M> zählen: Eis schmilzt bei <M p=",">{t`+1\,^\circ\mathrm{C}`}</M> aber nicht bei <M p=".">{t`-1\,^\circ\mathrm{C}`}</M> <b>Spontan heisst nicht schnell!</b> Es heisst nur, dass der Prozess abläuft (wie schnell: Kinetik, Vorlesungen 10–11). <b>Nicht spontan heisst nicht unmöglich!</b> Mit zugeführter Energie kann es gehen; es läuft nur nicht ohne unsere Hilfe.</p>
            </>}
            en={<>
              <p>Last time: conservation of energy. Today: which processes occur «spontaneously»?</p>
              <ul>
                <li><b>Spontaneous process</b>: a process that occurs without assistance (margin: «based on our experiences»).</li>
                <li>Criterion? Spontaneous processes seem to favour lowering their energy. Example: at constant <M p=",">P</M> spontaneous if <M>{t`\Delta H < 0`}</M> (exothermic)?</li>
                <li><b>Cannot be the complete answer:</b> many spontaneous processes do have <M>{t`\Delta H < 0`}</M> (margin: <C>H2</C> combustion). Others have <M>{t`\Delta H > 0`}</M> (endothermic). Example: ice melting is spontaneous, <M p=".">{t`\Delta H = +6.0\,\mathrm{kJ\,mol^{-1}}`}</M></li>
                <li>«Something is missing in our description … What?»</li>
              </ul>
              <p>Slide 8 adds characteristics of spontaneous processes: if a process is spontaneous, the reverse process is nonspontaneous (a ball does not roll up the hill by itself). The experimental conditions (<M p=",">T</M> <M p=")">P</M> matter: ice melts at <M p=",">{t`+1\,^\circ\mathrm{C}`}</M> but not at <M p=".">{t`-1\,^\circ\mathrm{C}`}</M> <b>Spontaneous does not mean fast!</b> It just means that the process will occur (how fast: kinetics, lectures 10–11). <b>Nonspontaneous does not mean impossible!</b> It may work if we add energy; it just will not occur without our help.</p>
            </>}
          />
        </Box>
        <Box kind="uebung" src={<Src ex={5} p="3" />} title={<T de="Merkblatt der Übung" en="The exercise class summary" />}>
          <T
            de={<p>Spontan: ein Prozess, der ohne Hilfe abläuft; nicht spontan: einer, der nur mit Hilfe abläuft. Die Umkehrung eines spontanen Prozesses ist nicht spontan, und nicht spontane Prozesse sind möglich, wenn man Energie zuführt. Spontan heisst nicht schnell. Die offenen Fragen der Übung: Systeme wollen ihre Energie senken (<M p="),">{t`\Delta H < 0`}</M> aber manchmal wird sie grösser – warum? Endotherme Reaktionen (<M p=")">{t`\Delta H > 0`}</M> können spontan sein – wie? Manche Prozesse laufen bei <M>{t`T_2`}</M> spontan, aber nicht bei <M>{t`T_1`}</M> – warum? Die Antworten stehen im Rest dieser Lektion.</p>}
            en={<p>Spontaneous: a process that occurs without assistance; nonspontaneous: one that only happens with assistance. The reversal of a spontaneous process is nonspontaneous, and nonspontaneous processes are possible when adding energy. Spontaneous does not mean fast. The open questions of the exercise class: systems want to lower their energy (<M p="),">{t`\Delta H < 0`}</M> but sometimes it becomes larger – why? Endothermic reactions (<M p=")">{t`\Delta H > 0`}</M> can be spontaneous – how? Some processes are spontaneous at <M>{t`T_2`}</M> but not at <M>{t`T_1`}</M> – why? The answers are in the rest of this lesson.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="reversibel" title={<T de="2. Umkehrbar oder nicht umkehrbar?" en="2. Reversible or irreversible?" />}>
        <Box kind="lecture" src={<Src lec={5} p="9–12" />} title={<T de="Reversible und irreversible Prozesse" en="Reversible and irreversible processes" />}>
          <T
            de={<>
              <ul>
                <li><b>Reversibler Prozess</b>: kann ohne Änderung der Umgebung umgekehrt werden. «Umgekehrt» heisst: das System kehrt in seinen Anfangszustand zurück.</li>
                <li><b>Irreversibler Prozess</b>: Die Umgebung ist verändert, wenn man den Prozess umkehrt.</li>
              </ul>
              <p><b>Beispiel Wärmeübertragung</b> (Folie 10): Wärme fliesst spontan von heiss nach kalt, nie von selbst von kalt nach heiss: «Energie breitet sich von konzentriert zu weniger konzentriert aus». Der Idealfall ist die reversible Wärmeübertragung: <M p=",">{t`T_\mathrm{hot} = T + \delta T`}</M> <M p=",">{t`T_\mathrm{cold} = T`}</M> mit <M>{t`\delta T`}</M> als unendlich kleinem Temperaturunterschied. Um den Prozess umzukehren, ändert man <M p=";">{t`T_\mathrm{hot} \to T - \delta T`}</M> die Wärme fliesst zurück, ohne dass sich die Umgebung ändert. Reversibel heisst also: der Prozess kehrt seine Richtung nach einer unendlich kleinen Änderung einer Eigenschaft des Systems um.</p>
              <p><b>Beispiel isotherme Expansion</b> (Folie 11): ein ideales Gas dehnt sich bei konstanter Temperatur ins Vakuum aus (Trennwand entfernt, <M p=").">{t`w = 0`}</M> Das ist spontan und irreversibel: Um das System in den Anfangszustand zu bringen, muss die Umgebung Arbeit am Gas leisten, um es zu komprimieren. Also hat sich die Umgebung geändert. Alternative: das Gas dehnt sich gegen einen Kolben aus, dessen Druck unendlich wenig kleiner ist (<M p=");">{t`P - \delta P`}</M> erhöht man den Druck zu irgendeinem Zeitpunkt auf <M p=",">{t`P + \delta P`}</M> kehrt sich der Prozess um: spontan und reversibel. Der reversible Prozess ist ein idealisierter Prozess.</p>
              <p><b>Reale Prozesse</b> (Folie 12): Idealisierte reversible Prozesse erreicht man in der Praxis nie. Alle realen Prozesse sind irreversibel; alle spontanen Prozesse sind reale Prozesse; <b>also sind alle spontanen Prozesse irreversibel</b>. Um das System zurückzubringen, braucht man Arbeit (<M p=").">{t`w > 0`}</M> Während <M>E</M> bei einem spontanen Prozess erhalten bleibt, neigt <M>E</M> dazu, sich auszubreiten und weniger nützlich zu werden (1. Hauptsatz: die Ausbreitung der Energie macht einen Teil davon für Arbeit unverfügbar).</p>
            </>}
            en={<>
              <ul>
                <li><b>Reversible process</b>: can be reversed with no change to the surroundings. «Reversed» means the system is returned to its initial state.</li>
                <li><b>Irreversible process</b>: the surroundings are changed when the process is reversed.</li>
              </ul>
              <p><b>Example heat transfer</b> (slide 10): heat flows spontaneously from hot to cold, never by itself from cold to hot: «energy tends to spread from concentrated to less concentrated». The ideal case is reversible heat transfer: <M p=",">{t`T_\mathrm{hot} = T + \delta T`}</M> <M p=",">{t`T_\mathrm{cold} = T`}</M> with <M>{t`\delta T`}</M> an infinitesimal temperature difference. To reverse the process one changes <M p=";">{t`T_\mathrm{hot} \to T - \delta T`}</M> the heat flows back without changing the surroundings. So reversible means: the process reverses its direction after an infinitesimal change of a property of the system.</p>
              <p><b>Example isothermal expansion</b> (slide 11): an ideal gas expands into vacuum at constant temperature (partition removed, <M p=").">{t`w = 0`}</M> This is spontaneous and irreversible: to return the system to its initial state, the surroundings have to do work on the gas to compress it. So the surroundings have changed. Alternative: the gas expands against a piston whose pressure is infinitesimally lower (<M p=");">{t`P - \delta P`}</M> if we increase the pressure to <M>{t`P + \delta P`}</M> at any time, the process is reversed: spontaneous and reversible. The reversible process is an idealised process.</p>
              <p><b>Real processes</b> (slide 12): idealised reversible processes can never be achieved in practice. All real processes are irreversible; all spontaneous processes are real processes; <b>therefore all spontaneous processes are irreversible</b>. Returning the system to its initial state requires work (<M p=").">{t`w > 0`}</M> While <M>E</M> is conserved during a spontaneous process, <M>E</M> tends to spread out and become less useful (1st law: the spreading of energy makes some of it unavailable to do work).</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Ein Film läuft rückwärts. Sieht das aus wie etwas Mögliches? Ein Ball, der von selbst hochspringt, nicht. Das ist das Merkmal eines irreversiblen (spontanen) Vorgangs.</li>
              <li>Reversibel ist der Grenzfall, in dem alles so langsam und so fein abgestimmt geschieht, dass der Film vorwärts und rückwärts gleich möglich aussieht. Dafür darf die treibende Kraft (<M>{t`\delta T`}</M> oder <M p=")">{t`\delta P`}</M> nur unendlich klein sein.</li>
              <li>Ausprobieren: Unten fliesst Wärme zwischen zwei Blöcken. Ziehe <M>{t`\Delta T`}</M> gegen null, und die Kurve rechts wird flach: Dann kostet das Hin- und Herschieben von Wärme keine Entropie mehr.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>A film runs backwards. Does it look like something possible? A ball that jumps up by itself does not. That is the mark of an irreversible (spontaneous) process.</li>
              <li>Reversible is the limit in which everything happens so slowly and so finely balanced that the film looks equally possible forwards and backwards. For that the driving force (<M>{t`\delta T`}</M> or <M p=")">{t`\delta P`}</M> may only be infinitesimal.</li>
              <li>Try it: below, heat flows between two blocks. Pull <M>{t`\Delta T`}</M> towards zero and the curve on the right becomes flat: moving heat back and forth then costs no entropy any more.</li>
            </ol>
          </>}
        />
        <ExpansionFigure />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="entropie" title={<T de={<>3. Entropie <M>S</M></>} en={<>3. Entropy <M>S</M></>} />}>
        <Box kind="lecture" src={<Src lec={5} p="13–14" />} title={<T de={<>Entropie und <M>{t`\Delta S`}</M> bei Phasenübergängen</>} en={<>Entropy and <M>{t`\Delta S`}</M> for phase changes</>} />}>
          <T
            de={<>
              <p><b>Entropie</b> <M p=":">S</M> ein Mass für die Tendenz der Energie, sich auszubreiten, was die Fähigkeit des Systems verringert, Arbeit zu leisten. Auch verwandt mit der Zufälligkeit oder Unordnung im System. <M>S</M> ist eine weitere Zustandsfunktion, <M>{t`\Delta S = S_\mathrm{final} - S_\mathrm{initial}`}</M> (des Systems; der Weg ist egal).</p>
              <p>Für einen <b>isothermen</b> Prozess (konstantes <M p="):">T</M></p>
              <MD>{t`\Delta S = \frac{q_\mathrm{rev}}{T}`}</MD>
              <p>mit <M>{t`q_\mathrm{rev}`}</M> der Wärme, die bei einem reversiblen Prozess fliesst, und <M>T</M> der absoluten Temperatur. Rand: Mit <M>{t`q_\mathrm{rev}`}</M> ist nur ein einziger Weg verbunden, es ist eindeutig. Auch wenn der Prozess irreversibel ist, kann man, weil <M>S</M> eine Zustandsfunktion ist, einen idealisierten reversiblen Prozess verwenden, um <M>{t`\Delta S`}</M> zu bestimmen.</p>
              <p><b>Beispiel Phasenübergang</b> (Folie 14): Wie gross ist <M p=",">{t`\Delta S`}</M> wenn Eis bei <M>{t`T = 0\,^\circ\mathrm{C}`}</M> und <M>{t`P = 101{,}3\,\mathrm{kPa}`}</M> schmilzt? <M p=",">{t`\Delta H_\mathrm{fus} = 6{,}0\times 10^{3}\,\mathrm{J\,mol^{-1}}`}</M> und <M>{t`q = \Delta H_\mathrm{fus}`}</M> bei konstantem <M p=".">P</M> Man stelle sich langsames Schmelzen bei <M>{t`T_\mathrm{surr} = 0\,^\circ\mathrm{C} + \delta T`}</M> vor: Der Prozess ist reversibel, <M>{t`q_\mathrm{rev} = \Delta H_\mathrm{fus}`}</M> (endotherm).</p>
              <MD>{t`\Delta S = \frac{q_\mathrm{rev}}{T} = \frac{6{,}0\times 10^{3}}{273}\,\mathrm{J\,mol^{-1}\,K^{-1}} = +22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</MD>
              <p>Hinweis der Folie: man muss die absolute Temperatur verwenden.</p>
            </>}
            en={<>
              <p><b>Entropy</b> <M p=":">S</M> a measure of the tendency for <M>E</M> to spread, which reduces the system’s ability to do work. Also related to randomness or disorder in the system. <M>S</M> is another state function, <M>{t`\Delta S = S_\mathrm{final} - S_\mathrm{initial}`}</M> (of the system; the path does not matter).</p>
              <p>For an <b>isothermal</b> process (constant <M p="):">T</M></p>
              <MD>{t`\Delta S = \frac{q_\mathrm{rev}}{T}`}</MD>
              <p>with <M>{t`q_\mathrm{rev}`}</M> the heat flow for a reversible process and <M>T</M> the absolute temperature. Margin: only one path is associated with <M p=",">{t`q_\mathrm{rev}`}</M> so it is unique. Even if the process is irreversible, because <M>S</M> is a state function, we can use an idealised reversible process to determine <M p=".">{t`\Delta S`}</M></p>
              <p><b>Example phase change</b> (slide 14): what is <M>{t`\Delta S`}</M> if ice melts at <M>{t`T = 0\,^\circ\mathrm{C}`}</M> and <M p="?">{t`P = 101.3\,\mathrm{kPa}`}</M> <M p=",">{t`\Delta H_\mathrm{fus} = 6.0\times 10^{3}\,\mathrm{J\,mol^{-1}}`}</M> and <M>{t`q = \Delta H_\mathrm{fus}`}</M> at constant <M p=".">P</M> Imagine melting slowly at <M p=":">{t`T_\mathrm{surr} = 0\,^\circ\mathrm{C} + \delta T`}</M> the process is reversible, <M>{t`q_\mathrm{rev} = \Delta H_\mathrm{fus}`}</M> (endothermic).</p>
              <MD>{t`\Delta S = \frac{q_\mathrm{rev}}{T} = \frac{6.0\times 10^{3}}{273}\,\mathrm{J\,mol^{-1}\,K^{-1}} = +22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</MD>
              <p>Note on the slide: one has to use the absolute temperature.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>{t`q_\mathrm{rev}`}</M> ist die Wärme, die ein Vorgang <em>im reversiblen Idealfall</em> aufnimmt. Beim Schmelzen von Eis ist das einfach <M p=":">{t`\Delta H_\mathrm{fus}`}</M> Die Wärme geht in das Auseinanderlösen des Eisgitters, nicht in eine Temperaturerhöhung. Darum bleibt <M>T</M> während des Schmelzens konstant, und die Formel <M>{t`q/T`}</M> darf direkt benutzt werden.</li>
              <li>Durch <M>T</M> teilen heisst: Dieselbe Wärme macht bei <em>tiefer</em> Temperatur mehr Entropie als bei hoher. Ein Tropfen Tinte in einem ruhigen Glas verändert die Lage stärker als in einem schon aufgewühlten.</li>
              <li><M>{t`+22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> heisst: Pro Mol Eis, das schmilzt, nimmt die Entropie des Wassers um 22 Joule pro Kelvin zu. Das System wird «unordentlicher»: Moleküle, die im Gitter festsitzen, können sich nun frei bewegen.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li><M>{t`q_\mathrm{rev}`}</M> is the heat a process takes up <em>in the reversible ideal case</em>. When ice melts that is simply <M p=":">{t`\Delta H_\mathrm{fus}`}</M> the heat goes into loosening the ice lattice, not into raising the temperature. That is why <M>T</M> stays constant during melting, and the formula <M>{t`q/T`}</M> may be used directly.</li>
              <li>Dividing by <M>T</M> means: the same heat creates more entropy at <em>low</em> temperature than at high. A drop of ink in a calm glass changes the picture more than in one that is already stirred up.</li>
              <li><M>{t`+22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> means: for every mole of ice that melts, the entropy of the water rises by 22 joules per kelvin. The system becomes «messier»: molecules that sat fixed in the lattice can now move freely.</li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="zweiter-hauptsatz" title={<T de="4. Der 2. Hauptsatz: die Entropie des Universums" en="4. The 2nd law: the entropy of the universe" />}>
        <Box kind="lecture" src={<Src lec={5} p="15–16" />} title={<T de="Entropie ist nicht erhalten" en="Entropy is not conserved" />}>
          <T
            de={<>
              <p>Rand: «Also ist <M>S</M> eine Zustandsfunktion wie <M p=",">E</M> aber ist sie erhalten wie <M p="?">E</M> Was ist das Gegenstück zum 1. Hauptsatz?» Betrachte einen Eiswürfel, der in deiner Hand schmilzt: Der Prozess ist irreversibel! Eiswürfel (<M p=")">{t`0\,^\circ\mathrm{C}`}</M> = System; Hand (<M p=")">{t`37\,^\circ\mathrm{C}`}</M> = Umgebung.</p>
              <MD>{t`\Delta S_\mathrm{sys} = \frac{q_\mathrm{rev}}{T} = \frac{6{,}0\times 10^{3}}{273}\,\mathrm{J\,mol^{-1}\,K^{-1}} = +22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</MD>
              <MD>{t`\Delta S_\mathrm{surr} = \frac{-6{,}0\times 10^{3}}{310}\,\mathrm{J\,mol^{-1}\,K^{-1}} = -19\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</MD>
              <p>Also für das Universum durch diesen irreversiblen Prozess: <M p=",">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} = +3{,}0\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> «<M>{t`\Delta S_\mathrm{univ}`}</M> hat zugenommen!» (Rand: Wäre <M>{t`T_\mathrm{surr} = 273\,\mathrm{K} + \delta T`}</M> und der Prozess reversibel, wäre <M p=".)">{t`\Delta S_\mathrm{univ} = 0`}</M></p>
              <p><b>2. Hauptsatz:</b> Die Entropie ist im Allgemeinen nicht erhalten.</p>
              <ul>
                <li>Reversibler Prozess: <M p=".">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} = 0`}</M></li>
                <li>Irreversibler Prozess: <M p=".">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} > 0`}</M></li>
              </ul>
              <p>Beides zusammen ist das <b>Kriterium für Spontaneität</b>. Weil alle realen Prozesse irreversibel sind: <b>Die Entropie des Universums nimmt bei jedem spontanen Prozess zu.</b> Schreibweise: <M p=",">{t`\Delta S_\mathrm{sys} \to \Delta S`}</M> weil uns <M>{t`\Delta S_\mathrm{sys}`}</M> interessiert.</p>
            </>}
            en={<>
              <p>Margin: «So <M>S</M> is a state function like <M p=",">E</M> but is it conserved like <M p="?">E</M> What is the 1st-law equivalent for <M p="?">S</M>» Consider an ice cube melting in your hand: the process is irreversible! Ice cube (<M p=")">{t`0\,^\circ\mathrm{C}`}</M> = system; hand (<M p=")">{t`37\,^\circ\mathrm{C}`}</M> = surroundings.</p>
              <MD>{t`\Delta S_\mathrm{sys} = \frac{q_\mathrm{rev}}{T} = \frac{6.0\times 10^{3}}{273}\,\mathrm{J\,mol^{-1}\,K^{-1}} = +22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</MD>
              <MD>{t`\Delta S_\mathrm{surr} = \frac{-6.0\times 10^{3}}{310}\,\mathrm{J\,mol^{-1}\,K^{-1}} = -19\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</MD>
              <p>Thus the total for the universe due to this irreversible process: <M p=",">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} = +3.0\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> «<M>{t`\Delta S_\mathrm{univ}`}</M> has increased!» (Margin: if <M>{t`T_\mathrm{surr} = 273\,\mathrm{K} + \delta T`}</M> and the process were reversible, <M p=".)">{t`\Delta S_\mathrm{univ} = 0`}</M></p>
              <p><b>2nd law:</b> entropy is not conserved in general.</p>
              <ul>
                <li>Reversible process: <M p=".">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} = 0`}</M></li>
                <li>Irreversible process: <M p=".">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} > 0`}</M></li>
              </ul>
              <p>Both together are the <b>criterion for spontaneity</b>. Since all real processes are irreversible: <b>the entropy of the universe increases for any spontaneous process.</b> Notation: <M p=",">{t`\Delta S_\mathrm{sys} \to \Delta S`}</M> because we care about <M p=".">{t`\Delta S_\mathrm{sys}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p>Zur Zahl <M p=":">{t`+3{,}0`}</M> Die Folie zieht die auf ganze Zahlen gerundeten Werte <M>22</M> und <M>19</M> ab. Rechnet man genau, ist <M>{t`6000/273 = 21{,}98`}</M> und <M p=",">{t`6000/310 = 19{,}35`}</M> also <M>{t`\Delta S_\mathrm{univ} = +2{,}6\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> (CH-003). Die Aussage bleibt: positiv.</p>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Betrachte immer <em>beide</em> Konten: das System (Eis) und die Umgebung (Hand). Das Eis gewinnt Entropie (<M>{t`q`}</M> fliesst hinein, geteilt durch die tiefe Temperatur <M p=").">{t`273\,\mathrm{K}`}</M> Die Hand verliert Entropie (dieselbe Wärme fliesst hinaus, geteilt durch die höhere <M p=").">{t`310\,\mathrm{K}`}</M></li>
              <li>Dieselbe Wärme zählt bei tiefer Temperatur mehr. Darum gewinnt das kalte Eis mehr, als die warme Hand verliert, und die Summe ist positiv.</li>
              <li>Schiebe unten die Temperatur der Umgebung nach unten: Bei <M>{t`273\,\mathrm{K}`}</M> wird die Summe null (reversibel), darunter negativ – dann schmilzt das Eis nicht mehr von selbst (Folie 8: «bei <M>{t`-1\,^\circ\mathrm{C}`}</M> nicht»).</li>
            </ol>
          </>}
          en={<>
            <p>On the number <M p=":">{t`+3.0`}</M> the slide subtracts the values <M>22</M> and <M>19</M> rounded to whole numbers. Calculated exactly, <M>{t`6000/273 = 21.98`}</M> and <M p=",">{t`6000/310 = 19.35`}</M> so <M>{t`\Delta S_\mathrm{univ} = +2.6\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> (CH-003). The statement stays: positive.</p>
            <p><b>How to read this:</b></p>
            <ol>
              <li>Always look at <em>both</em> accounts: the system (ice) and the surroundings (hand). The ice gains entropy (<M>{t`q`}</M> flows in, divided by the low temperature <M p=").">{t`273\,\mathrm{K}`}</M> The hand loses entropy (the same heat flows out, divided by the higher <M p=").">{t`310\,\mathrm{K}`}</M></li>
              <li>The same heat counts more at low temperature. So the cold ice gains more than the warm hand loses, and the sum is positive.</li>
              <li>Below, push the temperature of the surroundings down: at <M>{t`273\,\mathrm{K}`}</M> the sum becomes zero (reversible), below it negative – then the ice no longer melts by itself (slide 8: «not at <M>{t`-1\,^\circ\mathrm{C}`}</M>»).</li>
            </ol>
          </>}
        />
        <UniverseBalanceFigure />
        <T
          de={<p>Zwei Blöcke zeigen dasselbe in einem anderen Bild. Fliesst Wärme von heiss nach kalt, steigt die Entropie des Universums; die Kurve rechts hat bei gleicher Temperatur ihr Maximum. Fliesst Wärme von kalt nach heiss, wäre <M p=":">{t`\Delta S_\mathrm{univ} < 0`}</M> das passiert nicht von selbst.</p>}
          en={<p>Two blocks show the same in a different picture. If heat flows from hot to cold, the entropy of the universe rises; the curve on the right has its maximum at equal temperature. If heat were to flow from cold to hot, <M>{t`\Delta S_\mathrm{univ} < 0`}</M> would hold: that does not happen by itself.</p>}
        />
        <HeatFlowFigure />
        <Box kind="lecture" src={<Src lec={5} p="20" />} title={<T de="Ingenieure: Entropie-Krieger" en="Engineers: entropy warriors" />}>
          <T
            de={<p>Ingenieure geben grosse Mengen an Energie aus, um gegen den 2. Hauptsatz zu kämpfen. Wir stellen hochgeordnete, nützliche Materialien her. Sonst nimmt die Unordnung im Universum zu. Während wir unseren kleinen Teil des Universums ordnen, müssen wir die Unordnung irgendwo anders um mehr erhöhen!</p>}
            en={<p>Engineers spend large amounts of energy to fight the 2nd law of thermodynamics. We make highly ordered, useful materials. Otherwise the universe increases in disorder. While ordering our small part of the universe, we must increase disorder somewhere else by more!</p>}
          />
        </Box>
        <T
          de={<p>Du kannst das oben nachstellen: Wähle «Gefrierfach <M>{t`-10\,^\circ\mathrm{C}`}</M>». Das Wasser wird geordneter (<M p="),">{t`\Delta S_\mathrm{sys} < 0`}</M> aber das Gefrierfach wirft die Wärme an die Küche ab und gewinnt mehr Entropie, als das Wasser verliert. Insgesamt bleibt <M p=".">{t`\Delta S_\mathrm{univ} > 0`}</M> Dafür braucht der Kühlschrank elektrische Energie.</p>}
          en={<p>You can replay this above: choose «freezer <M>{t`-10\,^\circ\mathrm{C}`}</M>». The water becomes more ordered (<M p="),">{t`\Delta S_\mathrm{sys} < 0`}</M> but the freezer throws the heat out into the kitchen and gains more entropy than the water loses. In total <M>{t`\Delta S_\mathrm{univ} > 0`}</M> remains. For that the refrigerator needs electrical energy.</p>}
        />
        <Box kind="uebung" src={<Src ex={5} p="7" />} title={<T de="Aufgabe 4 mit Lösung (wahr oder falsch)" en="Exercise 4 with solution (true or false)" />}>
          <T
            de={<ul>
              <li>a) «<M>{t`\Delta S_\mathrm{sys}`}</M> hängt davon ab, ob der Prozess reversibel oder irreversibel ist.» <b>Falsch</b>: <M>{t`\Delta S_\mathrm{sys}`}</M> hängt von den Mikrozuständen ab, <M>S</M> ist eine Zustandsfunktion.</li>
              <li>b) «Bei einer spontanen, irreversiblen Änderung steigt die Entropie des Universums.» <b>Wahr</b> (2. Hauptsatz).</li>
              <li>c) «Ist <M p=",">{t`\Delta S_\mathrm{sys} = -\Delta S_\mathrm{surr}`}</M> ist der Prozess reversibel.» <b>Wahr</b>, denn dann ist <M p=".">{t`\Delta S_\mathrm{univ} = 0`}</M></li>
              <li>d) «Ist <M p=",">{t`\Delta S_\mathrm{sys} = 0`}</M> ist der Prozess reversibel.» <b>Falsch</b>: <M>{t`\Delta S_\mathrm{univ} = 0 + \Delta S_\mathrm{surr}`}</M> ist nicht geklärt, solange man <M>{t`\Delta S_\mathrm{surr}`}</M> nicht kennt.</li>
            </ul>}
            en={<ul>
              <li>a) «<M>{t`\Delta S_\mathrm{sys}`}</M> depends on whether the process is reversible or irreversible.» <b>False</b>: <M>{t`\Delta S_\mathrm{sys}`}</M> depends on the microstates, <M>S</M> is a state function.</li>
              <li>b) «If a system undergoes a spontaneous, irreversible change, the entropy of the universe increases.» <b>True</b> (2nd law).</li>
              <li>c) «If <M p=",">{t`\Delta S_\mathrm{sys} = -\Delta S_\mathrm{surr}`}</M> the process is reversible.» <b>True</b>, because then <M p=".">{t`\Delta S_\mathrm{univ} = 0`}</M></li>
              <li>d) «If <M p=",">{t`\Delta S_\mathrm{sys} = 0`}</M> the process is reversible.» <b>False</b>: <M>{t`\Delta S_\mathrm{univ} = 0 + \Delta S_\mathrm{surr}`}</M> is not settled as long as <M>{t`\Delta S_\mathrm{surr}`}</M> is unknown.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="molekuelbild" title={<T de="5. Entropie als Zahl der Anordnungen" en="5. Entropy as the number of arrangements" />}>
        <Box kind="lecture" src={<Src lec={5} p="17–18" />} title={<T de="Molekulare Interpretation und Boltzmann-Gleichung" en="Molecular interpretation and Boltzmann’s equation" />}>
          <T
            de={<>
              <p>Rand: Hat man 1 Mol Moleküle (<M p="),">{t`6\times 10^{23}`}</M> sind viele mögliche Anordnungen (<b>Mikrozustände</b>) mit dem makroskopischen Zustand des Systems verträglich. Das führt zu einer mikroskopischen (molekularen) Beschreibung der Entropie.</p>
              <p>Kinetisch-molekulare Gastheorie (Vorlesung 2): Moleküle bewegen sich mit einer statistischen Verteilung; das erklärt die spontane Ausdehnung eines Gases ins Vakuum. <b>Statistische Thermodynamik</b> verbindet den makroskopischen Zustand des Systems (beschrieben durch <M p=",">V</M> <M p=",">T</M> …) mit der mikroskopischen Anordnung der Moleküle. Ein <b>Mikrozustand</b> (<i>microstate</i>) ist eine bestimmte Anordnung der Moleküle (Rand: Positionen, Geschwindigkeiten und Richtungen aller Moleküle im System).</p>
              <p><b>Boltzmann-Gleichung</b> (Ludwig Boltzmann, österreichischer Physiker, 1844–1906):</p>
              <MD>{t`S = k_\mathrm{B}\ln W`}</MD>
              <p><M>{t`\ln`}</M> ist der natürliche Logarithmus; <M>W</M> ist die Zahl der Mikrozustände, die mit einem bestimmten makroskopischen Zustand verträglich sind; <M>{t`k_\mathrm{B} = 1{,}38\times 10^{-23}\,\mathrm{J/K}`}</M> ist die Boltzmann-Konstante. Die Entropie misst die Zahl der Mikrozustände und wächst mit ihr. Damit</p>
              <MD>{t`\Delta S = k_\mathrm{B}\ln W_\mathrm{final} - k_\mathrm{B}\ln W_\mathrm{initial} = k_\mathrm{B}\ln\frac{W_\mathrm{final}}{W_\mathrm{initial}}`}</MD>
              <p>(Rand: Logarithmusregel <M p=".">{t`\ln A - \ln B = \ln(A/B)`}</M> Und: die Gaskonstante <M>R</M> aus <M>{t`PV = nRT`}</M> hängt mit <M>{t`k_\mathrm{B}`}</M> zusammen, <M p=";">{t`R = k_\mathrm{B}\cdot N_\mathrm{A} = 1{,}38\times 10^{-23}\,\mathrm{J\,K^{-1}}\cdot 6{,}02\times 10^{23}\,\mathrm{mol^{-1}} = 8{,}31\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> <M>{t`k_\mathrm{B}`}</M> ist Energie pro Molekül und Kelvin, <M>R</M> Energie pro Mol und Kelvin.)</p>
            </>}
            en={<>
              <p>Margin: if we have 1 mol of molecules (<M p="),">{t`6\times 10^{23}`}</M> many possible arrangements (<b>microstates</b>) consistent with the macroscopic state of the system exist. This leads to a microscopic (molecular) description of entropy.</p>
              <p>Kinetic-molecular theory of gases (lecture 2): molecules move with a statistical distribution; this explains the spontaneous expansion of a gas into vacuum. <b>Statistical thermodynamics</b> connects the macroscopic state of the system (described by <M p=",">V</M> <M p=",">T</M> …) to the microscopic arrangement of the molecules. A <b>microstate</b> is one particular arrangement of the molecules (margin: the positions, velocities and directions of all molecules in the system).</p>
              <p><b>Boltzmann’s equation</b> (Ludwig Boltzmann, Austrian physicist, 1844–1906):</p>
              <MD>{t`S = k_\mathrm{B}\ln W`}</MD>
              <p><M>{t`\ln`}</M> is the natural logarithm; <M>W</M> is the number of microstates consistent with a specific macroscopic state; <M>{t`k_\mathrm{B} = 1.38\times 10^{-23}\,\mathrm{J/K}`}</M> is the Boltzmann constant. Entropy measures the number of microstates and increases with it. Hence</p>
              <MD>{t`\Delta S = k_\mathrm{B}\ln W_\mathrm{final} - k_\mathrm{B}\ln W_\mathrm{initial} = k_\mathrm{B}\ln\frac{W_\mathrm{final}}{W_\mathrm{initial}}`}</MD>
              <p>(Margin: logarithm rule <M p=".">{t`\ln A - \ln B = \ln(A/B)`}</M> And: the gas constant <M>R</M> from <M>{t`PV = nRT`}</M> is related to <M p=",">{t`k_\mathrm{B}`}</M> <M p=";">{t`R = k_\mathrm{B}\cdot N_\mathrm{A} = 1.38\times 10^{-23}\,\mathrm{J\,K^{-1}}\cdot 6.02\times 10^{23}\,\mathrm{mol^{-1}} = 8.31\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> <M>{t`k_\mathrm{B}`}</M> is energy per molecule per kelvin, <M>R</M> energy per mole per kelvin.)</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Ein <em>Makrozustand</em> ist das, was man von aussen sieht (Druck, Volumen, «alle Teilchen links»). Ein <em>Mikrozustand</em> ist, welches Teilchen genau wo sitzt. <M>W</M> zählt, wie viele Mikrozustände zum selben Makrozustand gehören.</li>
              <li>Der Logarithmus macht aus dem Produkt «Möglichkeiten mal Möglichkeiten» eine Summe «Entropie plus Entropie». Darum addieren sich die Entropien zweier unabhängiger Systeme, während sich ihre <M>W</M> multiplizieren.</li>
              <li><M p=":">{t`\Delta S = k_\mathrm{B}\ln(W_\mathrm{final}/W_\mathrm{initial})`}</M> Entscheidend ist, um welchen <em>Faktor</em> die Zahl der Anordnungen wächst.</li>
            </ol>
            <p>Im Bild unten kannst du <M>W</M> wirklich abzählen. Die Plätze sind Kästchen, die Teilchen violett. Mit geschlossener Trennwand sitzen alle <M>N</M> Teilchen links: <M>{t`W = \binom{10}{N}`}</M> Anordnungen. Öffnest du, dürfen sie überall sitzen: <M p=".">{t`W = \binom{20}{N}`}</M> Die Teilchen springen laufend in zufällige der erlaubten Anordnungen. Die Säulen darunter zählen, wie viele Anordnungen zu «<M>k</M> Teilchen links» gehören. «Fast alle links» gibt es nur selten; «halb–halb» fast immer. Darum geht das Gas von selbst auseinander und nie von selbst zurück. Ein Kristall bei <M>{t`T = 0`}</M> hat nur eine Anordnung: Knopf «Kristall».</p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>A <em>macrostate</em> is what you see from outside (pressure, volume, «all particles on the left»). A <em>microstate</em> is which particle sits exactly where. <M>W</M> counts how many microstates belong to the same macrostate.</li>
              <li>The logarithm turns the product «possibilities times possibilities» into a sum «entropy plus entropy». That is why the entropies of two independent systems add, while their <M>W</M> multiply.</li>
              <li><M p=":">{t`\Delta S = k_\mathrm{B}\ln(W_\mathrm{final}/W_\mathrm{initial})`}</M> what matters is by which <em>factor</em> the number of arrangements grows.</li>
            </ol>
            <p>In the figure below you can really count <M p=".">W</M> The sites are little boxes, the particles are purple. With the partition closed all <M>N</M> particles sit on the left: <M>{t`W = \binom{10}{N}`}</M> arrangements. Open it and they may sit anywhere: <M p=".">{t`W = \binom{20}{N}`}</M> The particles keep jumping into random allowed arrangements. The bars below count how many arrangements belong to «<M>k</M> particles on the left». «Almost all on the left» is rare; «half and half» is nearly always the case. That is why the gas spreads out by itself and never goes back by itself. A crystal at <M>{t`T = 0`}</M> has only one arrangement: button «crystal».</p>
          </>}
        />
        <LatticeFigure />
        <Box kind="supplement" title={<T de="Ein Mol Gas: der Faktor 2 hoch Teilchenzahl" en="One mole of gas: the factor 2 to the power of the particle number" />}>
          <T
            de={<p>Verdoppelt man das Volumen eines verdünnten Gases mit <M>N</M> Teilchen, hat jedes Teilchen doppelt so viele Plätze: <M p=".">{t`W_\mathrm{final}/W_\mathrm{initial} \approx 2^{N}`}</M> Dann ist <M p=".">{t`\Delta S = N k_\mathrm{B}\ln 2`}</M> Für 1 Mol ist das <M p=".">{t`R\ln 2 = 5{,}76\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> Die Zahl <M>{t`2^{6\times 10^{23}}`}</M> ist so gross, dass «alle Teilchen wieder links» praktisch nie vorkommt. Die Folie stellt das nur qualitativ dar; diese Rechnung ist eine Ergänzung.</p>}
            en={<p>If you double the volume of a dilute gas with <M>N</M> particles, every particle has twice as many places: <M p=".">{t`W_\mathrm{final}/W_\mathrm{initial} \approx 2^{N}`}</M> Then <M p=".">{t`\Delta S = N k_\mathrm{B}\ln 2`}</M> For 1 mol that is <M p=".">{t`R\ln 2 = 5.76\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M> The number <M>{t`2^{6\times 10^{23}}`}</M> is so large that «all particles on the left again» practically never happens. The slide shows this only qualitatively; this calculation is a supplement.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="folgerungen" title={<T de="6. Was die Entropie grösser macht – und der 3. Hauptsatz" en="6. What raises entropy – and the 3rd law" />}>
        <Box kind="lecture" src={<Src lec={5} p="19, 21" />} title={<T de="Folgerungen und 3. Hauptsatz" en="Implications and 3rd law" />}>
          <T
            de={<>
              <p>Allgemein nehmen <M>W</M> und <M>S</M> zu mit: dem Volumen <M>V</M> des Systems; seiner Temperatur <M p=";">T</M> der Zahl der Moleküle; der Komplexität der Moleküle; und ausserdem beim Schmelzen von Festkörpern und beim Verdampfen von Flüssigkeiten. <b>Entropie: Mass für die Ausbreitung der Energie oder die Zufälligkeit/Unordnung im System.</b> (Rand: Die Ausbreitung der Energie erhöht die Möglichkeiten, die Energie auf die Moleküle zu verteilen. Komplexere Moleküle haben mehr «Freiheitsgrade», also Bewegungsformen je Molekül, und mehr Freiheitsgrade heisst mehr Mikrozustände.)</p>
              <p><b>3. Hauptsatz:</b> Kühlt man ein System ab, hat es weniger Energie, weniger Freiheitsgrade und weniger Mikrozustände. Eine reine, perfekte kristalline Festsubstanz bei <M>{t`T = 0\,\mathrm{K}`}</M> hat <M p=".">{t`S = 0`}</M> Sie hat nur einen Mikrozustand, also <M p=".">{t`W = 1`}</M></p>
            </>}
            en={<>
              <p>In general, <M>W</M> and <M>S</M> increase with: the volume <M>V</M> of the system; its temperature <M p=";">T</M> the number of molecules; the complexity of molecules; and also with melting of solids and vaporizing of liquids. <b>Entropy: a measure of spread in energy or randomness/disorder in the system.</b> (Margin: spread in energy increases the ways that energy can be distributed among the molecules in the system. More complex molecules have more «degrees of freedom», that is forms of motion per molecule, and more degrees of freedom means more microstates.)</p>
              <p><b>3rd law:</b> as we cool any system, it has less energy, fewer degrees of freedom and fewer microstates. A pure, perfect crystalline solid substance at <M>{t`T = 0\,\mathrm{K}`}</M> has <M p=".">{t`S = 0`}</M> It has only one microstate, i.e. <M p=".">{t`W = 1`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> Jede Stelle der Liste ist dasselbe Prinzip: mehr Platz (<M p="),">V</M> mehr Bewegungsenergie (<M p="),">T</M> mehr Teilchen oder mehr Bewegungsformen schaffen mehr Möglichkeiten. Beim Schmelzen und Verdampfen können sich die Teilchen freier bewegen. Am absoluten Nullpunkt ist nichts mehr in Bewegung, es bleibt eine einzige Anordnung: <M>{t`S = k_\mathrm{B}\ln 1 = 0`}</M> (Aufgabe 1 der Übung).</p>
            <p>Das Bild zeigt die Entropie von Wasser gegen die Temperatur (die Zahlen sind eine Ergänzung): Sie steigt mit <M p=",">T</M> und sie springt beim Schmelzen und stärker beim Sieden. Genau das hat die Tutorin skizziert.</p>
          </>}
          en={<>
            <p><b>How to read this:</b> every item of the list is the same principle: more room (<M p="),">V</M> more motional energy (<M p="),">T</M> more particles or more forms of motion create more possibilities. When melting and boiling, the particles can move more freely. At absolute zero nothing is moving any more, a single arrangement remains: <M>{t`S = k_\mathrm{B}\ln 1 = 0`}</M> (exercise 1 of the class).</p>
            <p>The figure shows the entropy of water against temperature (the numbers are a supplement): it rises with <M p=",">T</M> and it jumps at melting and more strongly at boiling. That is exactly what the teaching assistant sketched.</p>
          </>}
        />
        <EntropyStaircase />
        <Box kind="uebung" src={<Src ex={5} p="5" />} title={<T de="Aufgaben 2 und 3 mit Lösung" en="Exercises 2 and 3 with solution" />}>
          <T
            de={<>
              <p>Faustregel: Wo die Zahl der Gasteilchen steigt, steigt <M p=";">S</M> wo sie sinkt, sinkt <M p=".">S</M></p>
              <div className="th-tablewrap"><table className="th-table">
                <thead><tr><th>Vorgang</th><th>Änderung</th><th><M>{t`\Delta S`}</M></th></tr></thead>
                <tbody>
                  <tr><td>a) Feststoff schmilzt</td><td>geordnet → freier</td><td><M>{t`> 0`}</M></td></tr>
                  <tr><td>b) Gas verflüssigt sich</td><td>freier → geordnet</td><td><M>{t`< 0`}</M></td></tr>
                  <tr><td>c) Feststoff sublimiert</td><td>fest → gasförmig</td><td><M>{t`> 0`}</M></td></tr>
                  <tr><td>d) <C>{'CaO(s) + CO2(g) -> CaCO3(s)'}</C></td><td><M>{t`\Delta n_\mathrm{gas} = -1`}</M></td><td><M>{t`< 0`}</M></td></tr>
                  <tr><td>e) <C>{'2 SO2(g) + O2(g) -> 2 SO3(g)'}</C></td><td><M>{t`\Delta n_\mathrm{gas} = -1`}</M></td><td><M>{t`< 0`}</M></td></tr>
                  <tr><td>f) Wasser von <M>{t`25\,^\circ\mathrm{C}`}</M> auf <M>{t`35\,^\circ\mathrm{C}`}</M></td><td><M>{t`\Delta T > 0`}</M></td><td><M>{t`> 0`}</M></td></tr>
                  <tr><td>g) Druck um einen Ballon steigt</td><td><M>{t`\Delta V < 0`}</M></td><td><M>{t`< 0`}</M></td></tr>
                </tbody>
              </table></div>
              <p>Aufgabe 2 (zusammen): Zwei Bilder mit <M>{t`n = 5`}</M> und <M>{t`n = 10`}</M> Teilchen: <M p=",">{t`\Delta n > 0`}</M> also <M p=".">{t`\Delta S > 0`}</M></p>
            </>}
            en={<>
              <p>Rule of thumb: where the number of gas particles rises, <M>S</M> rises; where it falls, <M>S</M> falls.</p>
              <div className="th-tablewrap"><table className="th-table">
                <thead><tr><th>Process</th><th>Change</th><th><M>{t`\Delta S`}</M></th></tr></thead>
                <tbody>
                  <tr><td>a) solid melts</td><td>ordered → freer</td><td><M>{t`> 0`}</M></td></tr>
                  <tr><td>b) gas liquefies</td><td>freer → ordered</td><td><M>{t`< 0`}</M></td></tr>
                  <tr><td>c) solid sublimes</td><td>solid → gas</td><td><M>{t`> 0`}</M></td></tr>
                  <tr><td>d) <C>{'CaO(s) + CO2(g) -> CaCO3(s)'}</C></td><td><M>{t`\Delta n_\mathrm{gas} = -1`}</M></td><td><M>{t`< 0`}</M></td></tr>
                  <tr><td>e) <C>{'2 SO2(g) + O2(g) -> 2 SO3(g)'}</C></td><td><M>{t`\Delta n_\mathrm{gas} = -1`}</M></td><td><M>{t`< 0`}</M></td></tr>
                  <tr><td>f) water from <M>{t`25\,^\circ\mathrm{C}`}</M> to <M>{t`35\,^\circ\mathrm{C}`}</M></td><td><M>{t`\Delta T > 0`}</M></td><td><M>{t`> 0`}</M></td></tr>
                  <tr><td>g) the pressure around a balloon rises</td><td><M>{t`\Delta V < 0`}</M></td><td><M>{t`< 0`}</M></td></tr>
                </tbody>
              </table></div>
              <p>Exercise 2 (together): two pictures with <M>{t`n = 5`}</M> and <M>{t`n = 10`}</M> particles: <M p=",">{t`\Delta n > 0`}</M> so <M p=".">{t`\Delta S > 0`}</M></p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Spontan heisst schnell»" en="«Spontaneous means fast»" />}>
        <T
          de={<p>Nein. Diamant verwandelt sich spontan in Graphit, aber so langsam, dass man es nie sieht. «Spontan» sagt nur, in welche Richtung etwas von selbst läuft, nicht, wie schnell (das ist Kinetik, Vorlesungen 10–11).</p>}
          en={<p>No. Diamond turns into graphite spontaneously, but so slowly that you never see it. «Spontaneous» only says in which direction something runs by itself, not how fast (that is kinetics, lectures 10–11).</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>{t`\Delta S < 0`}</M> ist verboten»</>} en={<>«<M>{t`\Delta S < 0`}</M> is forbidden»</>} />}>
        <T
          de={<p>Verboten ist nur <M p=".">{t`\Delta S_\mathrm{univ} < 0`}</M> Das System allein darf Entropie verlieren (Wasser gefriert, ein Kristall wächst), solange die Umgebung mehr gewinnt. Genau so arbeitet jeder Kühlschrank.</p>}
          en={<p>Only <M>{t`\Delta S_\mathrm{univ} < 0`}</M> is forbidden. The system alone may lose entropy (water freezes, a crystal grows) as long as the surroundings gain more. This is exactly how every refrigerator works.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Entropie ist erhalten wie Energie»" en="«Entropy is conserved like energy»" />}>
        <T
          de={<p>Die Energie des Universums bleibt konstant (1. Hauptsatz). Die Entropie des Universums bleibt nur bei reversiblen Prozessen konstant; bei jedem realen Prozess wächst sie.</p>}
          en={<p>The energy of the universe stays constant (1st law). The entropy of the universe only stays constant for reversible processes; in every real process it grows.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Entropie bedeutet nur Unordnung»" en="«Entropy just means disorder»" />}>
        <T
          de={<p>«Unordnung» ist ein Bild, das manchmal in die Irre führt. Genauer: Entropie zählt die Mikrozustände, die zu demselben Makrozustand gehören. Mehr Platz, mehr Energie oder mehr Teilchen heisst mehr Möglichkeiten.</p>}
          en={<p>«Disorder» is a picture that can mislead. More precisely: entropy counts the microstates belonging to the same macrostate. More room, more energy or more particles means more possibilities.</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Spontan heisst: läuft ohne Hilfe ab; nicht schnell, nicht «Energie sinkt» als einziges Kriterium. Alle spontanen Prozesse sind irreversibel.</li>
            <li><M>{t`\Delta S = q_\mathrm{rev}/T`}</M> (isotherm, absolute Temperatur); <M>S</M> ist eine Zustandsfunktion. Beispiel Eis: <M p=".">{t`+22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M></li>
            <li>2. Hauptsatz: <M p=",">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} \geq 0`}</M> bei spontanen Prozessen <M p=".">{t`> 0`}</M></li>
            <li><M p=",">{t`S = k_\mathrm{B}\ln W`}</M> <M p=";">{t`\Delta S = k_\mathrm{B}\ln(W_\mathrm{final}/W_\mathrm{initial})`}</M> <M>S</M> wächst mit <M p=",">V</M> <M p=",">T</M> Teilchenzahl, Komplexität, beim Schmelzen und Verdampfen.</li>
            <li>3. Hauptsatz: perfekter Kristall bei <M p=":">{t`0\,\mathrm{K}`}</M> <M p=",">{t`W = 1`}</M> <M p=".">{t`S = 0`}</M></li>
          </ul>}
          en={<ul>
            <li>Spontaneous means: happens without assistance; not fast, and «energy decreases» is not the only criterion. All spontaneous processes are irreversible.</li>
            <li><M>{t`\Delta S = q_\mathrm{rev}/T`}</M> (isothermal, absolute temperature); <M>S</M> is a state function. Example ice: <M p=".">{t`+22\,\mathrm{J\,mol^{-1}\,K^{-1}}`}</M></li>
            <li>2nd law: <M p=",">{t`\Delta S_\mathrm{univ} = \Delta S_\mathrm{sys} + \Delta S_\mathrm{surr} \geq 0`}</M> for spontaneous processes <M p=".">{t`> 0`}</M></li>
            <li><M p=",">{t`S = k_\mathrm{B}\ln W`}</M> <M p=";">{t`\Delta S = k_\mathrm{B}\ln(W_\mathrm{final}/W_\mathrm{initial})`}</M> <M>S</M> grows with <M p=",">V</M> <M p=",">T</M> particle number, complexity, on melting and vaporizing.</li>
            <li>3rd law: a perfect crystal at <M p=":">{t`0\,\mathrm{K}`}</M> <M p=",">{t`W = 1`}</M> <M p=".">{t`S = 0`}</M></li>
          </ul>}
        />
      </Box>
      <T de={<p className="th-note">Weiter geht es mit der <a href="#ch-gibbs">freien Enthalpie nach Gibbs</a>: Sie fasst <M>{t`\Delta H`}</M> und <M>{t`\Delta S`}</M> in einem einzigen Kriterium zusammen.</p>} en={<p className="th-note">Next comes <a href="#ch-gibbs">Gibbs free energy</a>: it combines <M>{t`\Delta H`}</M> and <M>{t`\Delta S`}</M> in a single criterion.</p>} />
    </article>
  );
}
