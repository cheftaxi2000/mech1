import { Box, Section, Src } from '../components/Blocks';
import { C } from '../components/Chem';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { LewisFigure } from '../viz/chem/BondFigures';
import { AngleSqueeze, ProcessFig, RemoveFig, VseprExplorer } from '../viz/chem/VseprFigures';

const t = String.raw;

export default function CH7Vsepr() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Lewis-Struktur sagt, wer an wen gebunden ist, aber nicht, wie das Molekül im Raum aussieht. Dafür genügt eine einzige Idee: Elektronenpaare stossen sich ab und gehen so weit auseinander wie möglich. Aus ihr folgen fünf Grundformen, und aus diesen durch «Wegnehmen» von Atomen alle anderen.</p>}
        en={<p className="lede">A Lewis structure says who is bonded to whom, but not what the molecule looks like in space. One single idea is enough for that: electron pairs repel each other and move as far apart as possible. Five basic shapes follow from it, and from these, by “removing” atoms, all the others.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Binde zwei, drei oder vier Luftballons an ihren Knoten zusammen (Folie 29). Sie drücken sich gegenseitig weg und stellen sich von selbst ein: zwei in einer Linie, drei in einem flachen Dreieck, vier in die Ecken eines Tetraeders. Jeder Ballon ist ein Elektronenpaar um das Zentralatom.</p>}
          en={<p>Tie two, three or four balloons together at their knots (slide 29). They push each other away and settle by themselves: two in a line, three in a flat triangle, four towards the corners of a tetrahedron. Each balloon is an electron pair around the central atom.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="raum" title={<T de="1. Lewis-Strukturen sind flach" en="1. Lewis structures are flat" />}>
        <Box kind="lecture" src={<Src lec={7} p="27" />} title={<T de="Und die Molekülgestalt?" en="What about molecular shape?" />}>
          <T
            de={<>
              <p>3D gegenüber 2D. Lewis-Strukturen sind nützlich, aber zweidimensional. Bsp. Tetrachlormethan (Tetrachlorkohlenstoff) <M p=".">{t`\mathrm{CCl_4}`}</M> Sie zeigen, wer mit wem verbunden ist und wie, aber nicht die Gestalt.</p>
              <p>Wirkliche Gestalt: die vier Cl-Atome in den Ecken eines Tetraeders (alle <M>{t`\mathrm{C{-}Cl}`}</M>-Bindungen 1,78 Å, alle <M>{t`\mathrm{Cl{-}C{-}Cl}`}</M>-Winkel 109,5°). <b>Die Gestalt folgt aus Verknüpfung und Bindungswinkeln, die Grösse aus Gestalt und Bindungslängen.</b> «Wie können wir die Gestalt einfacher Moleküle vorhersagen?»</p>
            </>}
            en={<>
              <p>3D versus 2D. Lewis structures are useful, but two-dimensional. Ex: tetrachloromethane (carbon tetrachloride), <M p=".">{t`\mathrm{CCl_4}`}</M> They show connectivity and bonding, but not shape.</p>
              <p>Actual shape: four Cl atoms at the corners of a tetrahedron (all <M>{t`\mathrm{C{-}Cl}`}</M> bond lengths 1.78 Å, all <M>{t`\mathrm{Cl{-}C{-}Cl}`}</M> angles 109.5°). <b>Shape follows from connectivity plus bond angles, size from shape plus bond lengths.</b> “How can we predict the shape of simple molecules?”</p>
            </>}
          />
        </Box>
        <T
          de={<p>In der flachen Zeichnung stehen die vier Cl im Kreuz, mit 90° zwischen Nachbarn. Das ist nur die Zeichnung. Im Raum können sich vier Bindungen weiter voneinander entfernen: bis 109,5°, in die Ecken eines Tetraeders. Wie das aussieht, zeigt der Explorer in Abschnitt 3.</p>}
          en={<p>In the flat drawing the four Cl stand in a cross, with 90° between neighbours. That is only the drawing. In space four bonds can get farther away from each other: up to 109.5°, towards the corners of a tetrahedron. The explorer in section 3 shows what that looks like.</p>}
        />
        <LewisFigure id="CCl4" caption={<T de={<>Die Lewis-Struktur von <C p=":">CCl4</C> richtig verknüpft, aber flach.</>} en={<>The Lewis structure of <C p=":">CCl4</C> correctly connected, but flat.</>} />} />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="grundformen" title={<T de="2. Fünf Grundformen und das Wegnehmen von Atomen" en="2. Five basic shapes and removing atoms" />}>
        <Box kind="lecture" src={<Src lec={7} p="28" />} title={<T de="Gestalt vorhersagen" en="Predicting shapes" />}>
          <T
            de={<>
              <p>Einfache Moleküle <M p=":">{t`\mathrm{AB}_n`}</M> nur wenige mögliche Gestalten, abhängig von <M p=".">n</M> (<M p=":">{t`n = 2`}</M> <C>CO2</C> linear, <C>SO2</C> gewinkelt; <M p=":">{t`n = 3`}</M> <C>SO3</C> trigonal-planar, <C>NF3</C> trigonal-pyramidal, <C>ClF3</C> T-förmig.)</p>
              <p>Die meisten Moleküle leiten sich von <b>5 Grundformen</b> ab: <M>{t`\mathrm{AB_2}`}</M> linear (180°), <M>{t`\mathrm{AB_3}`}</M> trigonal-planar (120°), <M>{t`\mathrm{AB_4}`}</M> tetraedrisch (109,5°), <M>{t`\mathrm{AB_5}`}</M> trigonal-bipyramidal (90°, 120°), <M>{t`\mathrm{AB_6}`}</M> oktaedrisch (90°).</p>
              <p><b>Durch Wegnehmen von Atomen erhalten wir weitere Formen:</b> tetraedrisch <M>\to</M> (ein Eckatom weg) trigonal-pyramidal <M>\to</M> (ein zweites weg) gewinkelt.</p>
            </>}
            en={<>
              <p>Simple molecules <M p=":">{t`\mathrm{AB}_n`}</M> a limited number of possible shapes, depending on <M p=".">n</M> (<M p=":">{t`n = 2`}</M> <C>CO2</C> linear, <C>SO2</C> bent; <M p=":">{t`n = 3`}</M> <C>SO3</C> trigonal planar, <C>NF3</C> trigonal pyramidal, <C>ClF3</C> T-shaped.)</p>
              <p>Most molecules are derived from <b>5 basic shapes</b>: <M>{t`\mathrm{AB_2}`}</M> linear (180°), <M>{t`\mathrm{AB_3}`}</M> trigonal planar (120°), <M>{t`\mathrm{AB_4}`}</M> tetrahedral (109.5°), <M>{t`\mathrm{AB_5}`}</M> trigonal bipyramidal (90°, 120°), <M>{t`\mathrm{AB_6}`}</M> octahedral (90°).</p>
              <p><b>By removing atoms we obtain other possible shapes:</b> tetrahedral <M>\to</M> (removal of one corner atom) trigonal pyramidal <M>\to</M> (removal of a second corner atom) bent.</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">«Wegnehmen» heisst nicht, dass das Atom einfach verschwindet. An seine Stelle tritt ein freies Elektronenpaar (blaue Keule): Es braucht weiterhin seinen Platz, nur sieht man es nicht, wenn man auf die Atome schaut. Darum bleiben die übrigen Atome, wo sie im Tetraeder waren. Das Gerüst (gestrichelt) bleibt ein Tetraeder, die Gestalt der Atome wird erst eine Pyramide, dann ein Knick.</p>}
          en={<p className="keep">“Removing” does not mean the atom simply vanishes. A lone pair (blue lobe) takes its place: it still needs its room, you just do not see it when you look at the atoms. That is why the other atoms stay where they were in the tetrahedron. The frame (dashed) stays a tetrahedron; the shape of the atoms becomes first a pyramid, then a bend.</p>}
        />
        <StepPlayer
          label={tr('Animation: aus dem Tetraeder werden Pyramide und Knick', 'Animation: the tetrahedron becomes a pyramid and a bend')}
          steps={[
            { ms: 600, holdMs: 2600, caption: <T de={<>Vier Atome um das Zentralatom: tetraedrisch, alle Winkel 109,5°, wie <C p=".">CH4</C></>} en={<>Four atoms around the central atom: tetrahedral, all angles 109.5°, like <C p=".">CH4</C></>} /> },
            { ms: 1600, holdMs: 3000, caption: <T de={<>Das obere Atom wird durch ein freies Paar ersetzt. Die drei Atome bilden eine Pyramide: trigonal-pyramidal, wie <C p=".">NH3</C></>} en={<>The top atom is replaced by a lone pair. The three atoms form a pyramid: trigonal pyramidal, like <C p=".">NH3</C></>} /> },
            { ms: 1600, holdMs: 3000, caption: <T de={<>Ein zweites Atom wird ersetzt. Zwei Atome bleiben übrig: gewinkelt, wie <C p=".">H2O</C></>} en={<>A second atom is replaced. Two atoms remain: bent, like <C p=".">H2O</C></>} /> },
          ]}
        >
          {(step, tt) => <RemoveFig step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="vsepr" title={<T de="3. Das VSEPR-Modell" en="3. The VSEPR model" />}>
        <Box kind="lecture" src={<Src lec={7} p="29–30" />} title={<T de="Warum Atome wegnehmen?" en="Why remove atoms?" />}>
          <T
            de={<>
              <p><b>Valenzschalen-Elektronenpaar-Abstossung</b> (<i>VSEPR</i>): Elektronen stossen sich ab. Elektronenpaare gehen so weit auseinander wie möglich. Das erklärt die 5 Grundformen und ihre Winkel. Ausser den Bindungen zählen wir auch die freien Paare.</p>
              <p><b>Elektronendomänen:</b> Bindungen oder «freie Paare» um das Zentralatom. Die Gestalt wird durch die Zahl der Elektronendomänen um das Zentralatom bestimmt.</p>
              <p><b>Elektronendomänen-Geometrie</b> (enthält Atome <i>und</i> freie Paare) <i>gegenüber</i> <b>Molekülgeometrie</b> (enthält nur die Atome).</p>
              <p>Folie 30: Ballon-Analogie; mögliche Elektronendomänen-Geometrien: 2 linear 180°, 3 trigonal-planar 120°, 4 tetraedrisch 109,5°, 5 trigonal-bipyramidal 120° und 90°, 6 oktaedrisch 90°.</p>
            </>}
            en={<>
              <p><b>Valence-shell electron-pair repulsion</b> (VSEPR) model: electrons repel each other. Electron pairs move as far apart as possible. This explains the 5 basic shapes and bond angles. In addition to bonds, we also count lone pairs.</p>
              <p><b>Electron domains:</b> bonds or “lone pairs” around the central atom. Shape determined by the number of electron domains around the central atom.</p>
              <p><b>Electron-domain geometry</b> (includes atoms <i>and</i> lone pairs) <i>versus</i> <b>molecular geometry</b> (includes just atoms).</p>
              <p>Slide 30: balloon analogy; possible electron-domain geometries: 2 linear 180°, 3 trigonal planar 120°, 4 tetrahedral 109.5°, 5 trigonal bipyramidal 120° and 90°, 6 octahedral 90°.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b></p>
            <ol className="keep">
              <li>Eine <b>Domäne</b> ist eine Richtung, in der Elektronen um das Zentralatom sitzen: eine Bindung oder ein freies Paar. Eine Doppel- oder Dreifachbindung zählt als <b>eine</b> Domäne, denn ihre Elektronen zeigen alle in dieselbe Richtung.</li>
              <li>Die Zahl der Domänen bestimmt das Gerüst (Elektronendomänen-Geometrie). Das ist ein reines Abstands-Problem: <M>n</M> Punkte auf einer Kugel möglichst weit voneinander.</li>
              <li>Die Molekülgeometrie nennt man nach den Atomen allein. Freie Paare gehören zum Gerüst, aber nicht zum Namen.</li>
            </ol>
            <p>Stelle im Explorer Domänen und freie Paare ein und drehe das Molekül mit dem Finger.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b></p>
            <ol className="keep">
              <li>A <b>domain</b> is a direction in which electrons sit around the central atom: a bond or a lone pair. A double or triple bond counts as <b>one</b> domain, because its electrons all point in the same direction.</li>
              <li>The number of domains sets the frame (electron-domain geometry). It is a pure distance problem: <M>n</M> points on a sphere as far from each other as possible.</li>
              <li>The molecular geometry is named after the atoms alone. Lone pairs belong to the frame, but not to the name.</li>
            </ol>
            <p>Set domains and lone pairs in the explorer and turn the molecule with your finger.</p>
          </>}
        />
        <VseprExplorer initial={[4, 0]} />
        <Box kind="uebung" src={<Src ex={7} p="12" />} title={<T de="VSEPR in der Übung" en="VSEPR in the exercise class" />}>
          <T
            de={<p>«Bindende Domänen: Bindungen. Nichtbindende Domänen: freie Paare.» «VSEPR-Modell: eine 3D-Darstellung für ein Zentralatom, umgeben von gleichen Eckatomen.» Die Übung schreibt weiter: «Elektronenpaar-Geometrie: enthält nur die Geometrie» und «Molekülgeometrie: enthält Bindungen und freie Paare». Das ist vertauscht (CH-014): Nach Folie 29 zählt die Elektronendomänen-Geometrie Bindungen <b>und</b> freie Paare, die Molekülgeometrie nur die Atome. In der Tabelle der Übung sind 6 Domänen mit 3 oder 4 freien Paaren als «nicht möglich» durchgestrichen.</p>}
            en={<p>“Bonding domains: bonds. Non-bonding domains: lone pairs.” “VSEPR model: a 3D representation for a central atom surrounded by identical corner atoms.” The exercise class goes on: “electron-pair geometry: only includes the geometry” and “molecular geometry: includes bonds and lone pairs”. That is swapped (CH-014): by slide 29 the electron-domain geometry counts bonds <b>and</b> lone pairs, the molecular geometry only the atoms. In the exercise table, 6 domains with 3 or 4 lone pairs are crossed out as “not possible”.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Wasser ist gewinkelt, also hat es drei Domänen»" en="“Water is bent, so it has three domains”" />}>
          <T
            de={<p>Wasser hat vier Domänen: zwei Bindungen und zwei freie Paare. Das Gerüst ist tetraedrisch; «gewinkelt» beschreibt nur, wo die beiden H sitzen. Auch drei Domänen mit einem freien Paar geben «gewinkelt» (<M p=")">{t`\mathrm{NO_2^-}`}</M> dann aber mit rund 120° statt 109,5°. Darum immer zuerst die Domänen zählen.</p>}
            en={<p>Water has four domains: two bonds and two lone pairs. The frame is tetrahedral; “bent” only describes where the two H sit. Three domains with one lone pair also give “bent” (<M p=")">{t`\mathrm{NO_2^-}`}</M> but then with about 120° instead of 109.5°. So always count the domains first.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="platz" title={<T de="4. Freie Paare und Mehrfachbindungen brauchen mehr Platz" en="4. Lone pairs and multiple bonds take up more space" />}>
        <Box kind="lecture" src={<Src lec={7} p="31" />} title={<T de="Mögliche Molekülgeometrien: Verfeinerungen" en="Possible molecular geometries: refinements" />}>
          <T
            de={<>
              <p><b>Freie Paare brauchen mehr Platz:</b> <C>CH4</C> 109,5°, <C>NH3</C> 107°, <C>H2O</C> 104,5°. <b>Mehrfachbindungen brauchen mehr Platz:</b> Phosgen <M p=":">{t`\mathrm{Cl_2C{=}O}`}</M> <M>{t`\mathrm{Cl{-}C{-}Cl}`}</M> 111,4°, <M>{t`\mathrm{Cl{-}C{=}O}`}</M> 124,3° (handschriftlich: «im Ersten Weltkrieg als Kampfgas eingesetzt, rund 85 000 Tote»).</p>
              <p>Tabelle: 2 Domänen: 2 bindend, 0 nichtbindend <M>\to</M> linear (<M p=").">{t`\mathrm{O{=}C{=}O}`}</M> 3 Domänen: 3/0 trigonal-planar <M p=",">{t`(\mathrm{BF_3})`}</M> 2/1 gewinkelt <M p=".">{t`(\mathrm{NO_2^-})`}</M> 4 Domänen: 4/0 tetraedrisch <M p=",">{t`(\mathrm{CH_4})`}</M> 3/1 trigonal-pyramidal <M p=",">{t`(\mathrm{NH_3})`}</M> 2/2 gewinkelt <M p=".">{t`(\mathrm{H_2O})`}</M></p>
            </>}
            en={<>
              <p><b>Lone pairs take up more space:</b> <C>CH4</C> 109.5°, <C>NH3</C> 107°, <C>H2O</C> 104.5°. <b>Multiple bonds take up more space:</b> phosgene <M p=":">{t`\mathrm{Cl_2C{=}O}`}</M> <M>{t`\mathrm{Cl{-}C{-}Cl}`}</M> 111.4°, <M>{t`\mathrm{Cl{-}C{=}O}`}</M> 124.3° (handwritten: “used as a chemical weapon during World War I, responsible for about 85,000 deaths”).</p>
              <p>Table: 2 domains: 2 bonding, 0 nonbonding <M>\to</M> linear (<M p=").">{t`\mathrm{O{=}C{=}O}`}</M> 3 domains: 3/0 trigonal planar <M p=",">{t`(\mathrm{BF_3})`}</M> 2/1 bent <M p=".">{t`(\mathrm{NO_2^-})`}</M> 4 domains: 4/0 tetrahedral <M p=",">{t`(\mathrm{CH_4})`}</M> 3/1 trigonal pyramidal <M p=",">{t`(\mathrm{NH_3})`}</M> 2/2 bent <M p=".">{t`(\mathrm{H_2O})`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<p>Ein freies Paar gehört nur einem Kern und sitzt nahe an ihm; es breitet sich darum breiter aus als ein Bindungspaar, das zwischen zwei Kernen gespannt ist. Es drückt die Bindungen zusammen, zwei freie Paare noch mehr. Eine Doppelbindung enthält vier Elektronen in einer Richtung und drückt ebenfalls: Bei Phosgen weichen die Cl der <M>{t`\mathrm{C{=}O}`}</M>-Bindung aus (124,3°), untereinander kommen sie sich näher (111,4° statt 120°). Das einfache Modell kennt nur die idealen Winkel; die Verfeinerung sagt, in welche Richtung die echten abweichen.</p>}
          en={<p>A lone pair belongs to only one nucleus and sits close to it; it therefore spreads out more widely than a bonding pair stretched between two nuclei. It pushes the bonds together, two lone pairs even more. A double bond holds four electrons in one direction and pushes as well: in phosgene the Cl atoms move away from the <M>{t`\mathrm{C{=}O}`}</M> bond (124.3°) and come closer to each other (111.4° instead of 120°). The simple model knows only the ideal angles; the refinement tells in which direction the real ones deviate.</p>}
        />
        <AngleSqueeze />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="rezept" title={<T de="5. Das Rezept in vier Schritten" en="5. The recipe in four steps" />}>
        <Box kind="lecture" src={<Src lec={7} p="32" />} title={<T de="Gestalt mit dem VSEPR-Modell vorhersagen" en="Predicting shape with the VSEPR model" />}>
          <T
            de={<>
              <p>Vorgehen: 1. Lewis-Struktur zeichnen. 2. Elektronendomänen zählen. 3. Elektronendomänen-Geometrie bestimmen. 4. Molekülgeometrie aus der Lage der Atome bestimmen. «Wir üben das in der Übung und im Problem Set 7.»</p>
              <p>Bsp. <M p=":">{t`\mathrm{NH_3}`}</M> <M>{t`\mathrm{H{-}N{-}H}`}</M> mit einem H darunter und einem freien Paar auf N <M>\to</M> tetraedrisch <M>\to</M> trigonal-pyramidal.</p>
            </>}
            en={<>
              <p>Process: 1. Draw Lewis structure. 2. Count electron domains. 3. Determine electron-domain geometry. 4. Determine molecular geometry from position of atoms. “We will practice in exercise and problem set #7.”</p>
              <p>Ex: <M p=":">{t`\mathrm{NH_3}`}</M> <M>{t`\mathrm{H{-}N{-}H}`}</M> with one H below and a lone pair on N <M>\to</M> tetrahedral <M>\to</M> trigonal pyramidal.</p>
            </>}
          />
        </Box>
        <StepPlayer
          label={tr('Animation: NH3 in vier Schritten', 'Animation: NH3 in four steps')}
          steps={[
            { ms: 600, holdMs: 2800, caption: <T de={<>1. Die Lewis-Struktur, flach gezeichnet: drei Bindungen zu H und oben das freie Paar von N.</>} en={<>1. The Lewis structure, drawn flat: three bonds to H and the lone pair of N at the top.</>} /> },
            { ms: 900, holdMs: 2800, caption: <T de={<>2. Domänen zählen: drei Bindungen und ein freies Paar, also 4.</>} en={<>2. Count the domains: three bonds and one lone pair, so 4.</>} /> },
            { ms: 1800, holdMs: 3000, caption: <T de={<>3. Vier Domänen gehen auseinander, bis sie in die Ecken eines Tetraeders zeigen: Die Elektronendomänen-Geometrie ist tetraedrisch.</>} en={<>3. Four domains move apart until they point to the corners of a tetrahedron: the electron-domain geometry is tetrahedral.</>} /> },
            { ms: 1300, holdMs: 3200, caption: <T de={<>4. Nur die Atome zählen für den Namen: N oben auf einem Dreieck aus drei H. Die Molekülgeometrie ist trigonal-pyramidal.</>} en={<>4. Only the atoms count for the name: N on top of a triangle of three H. The molecular geometry is trigonal pyramidal.</>} /> },
          ]}
        >
          {(step, tt) => <ProcessFig step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="hypervalent" title={<T de="6. Mehr als vier Elektronenpaare" en="6. More than four electron pairs" />}>
        <Box kind="lecture" src={<Src lec={7} p="33" />} title={<T de="Hypervalente Atome" en="Hypervalent atoms" />}>
          <T
            de={<>
              <p>Atome ab Periode 3 können mehr als 4 Elektronenpaare haben. <b>Freie Paare besetzen die Positionen mit dem meisten Platz.</b></p>
              <p>Tabelle: 5 Domänen (trigonal-bipyramidal): 5/0 trigonal-bipyramidal <M p=",">{t`(\mathrm{PCl_5})`}</M> 4/1 wippenförmig <M p=",">{t`(\mathrm{SF_4})`}</M> 3/2 T-förmig <M p=",">{t`(\mathrm{ClF_3})`}</M> 2/3 linear <M p=".">{t`(\mathrm{XeF_2})`}</M> 6 Domänen (oktaedrisch): 6/0 oktaedrisch <M p=",">{t`(\mathrm{SF_6})`}</M> 5/1 quadratisch-pyramidal <M p=",">{t`(\mathrm{BrF_5})`}</M> 4/2 quadratisch-planar <M p=".">{t`(\mathrm{XeF_4})`}</M></p>
              <p>Handschriftlich: «Nächstes Mal: zwischenmolekulare Kräfte.»</p>
            </>}
            en={<>
              <p>Atoms from period 3 and beyond can have more than 4 electron pairs. <b>Lone pairs occupy positions with most space.</b></p>
              <p>Table: 5 domains (trigonal bipyramidal): 5/0 trigonal bipyramidal <M p=",">{t`(\mathrm{PCl_5})`}</M> 4/1 seesaw <M p=",">{t`(\mathrm{SF_4})`}</M> 3/2 T-shaped <M p=",">{t`(\mathrm{ClF_3})`}</M> 2/3 linear <M p=".">{t`(\mathrm{XeF_2})`}</M> 6 domains (octahedral): 6/0 octahedral <M p=",">{t`(\mathrm{SF_6})`}</M> 5/1 square pyramidal <M p=",">{t`(\mathrm{BrF_5})`}</M> 4/2 square planar <M p=".">{t`(\mathrm{XeF_4})`}</M></p>
              <p>Handwritten: “Next time: intermolecular interactions.”</p>
            </>}
          />
        </Box>
        <T
          de={<p><b>Wo ist «am meisten Platz»?</b> In der trigonalen Bipyramide sind die Plätze nicht gleich. Ein Platz am Äquator hat zwei Nachbarn im 90°-Abstand (oben und unten), ein Platz an der Spitze drei (die drei am Äquator). Freie Paare gehen darum an den Äquator: eines gibt die Wippe, zwei das T, drei lassen nur die zwei Spitzen übrig, also linear. Im Oktaeder sind alle Plätze gleich; das zweite freie Paar geht gegenüber vom ersten, und es bleibt ein Quadrat. Stelle im Explorer oben 5 oder 6 Domänen ein und füge freie Paare hinzu. (Die Begründung mit den 90°-Nachbarn steht nicht auf der Folie.)</p>}
          en={<p><b>Where is “most space”?</b> In the trigonal bipyramid the places are not equal. A place on the equator has two neighbours at 90° (top and bottom), a place at a tip has three (the three on the equator). So lone pairs go to the equator: one gives the seesaw, two the T, three leave only the two tips, so linear. In the octahedron all places are equal; the second lone pair goes opposite the first, and a square remains. Set 5 or 6 domains in the explorer above and add lone pairs. (The reasoning with the 90° neighbours is not on the slide.)</p>}
        />
      </Section>
    </article>
  );
}
