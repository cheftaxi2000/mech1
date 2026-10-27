import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { SceneFig, SlideKinds, StripExplorer } from '../viz/ana/Week1Figures';
import { kbScene, mbScene } from '../viz/ana/week1Scenes';

const t = String.raw;

export default function A1Folgen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine <b>Folge</b> ist eine unendlich lange Liste von Zahlen <M p=",">{t`a_1, a_2, a_3, \dots`}</M> zum Beispiel der Kilometerstand deines Autos jeden Abend. Diese Lektion klärt drei Wörter – <b>beschränkt</b>, <b>monoton</b>, <b>konvergent</b> – und was aus was folgt.</p>}
        en={<p className="lede">A <b>sequence</b> (<span lang="de">Folge</span>) is an endless list of numbers <M p=",">{t`a_1, a_2, a_3, \dots`}</M> for example the reading of your car's odometer every evening. This lesson explains three words – <b>bounded</b>, <b>monotonic</b>, <b>convergent</b> – and what follows from what.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="arten" title={<T de="1. Drei Arten von Folgen" en="1. Three kinds of sequences" />}>
        <Box kind="uebung" src={<Src u={1} p={10} />} title={<T de={<>Folgen <M>{t`a_n`}</M></>} en={<>Sequences <M>{t`a_n`}</M> (<span lang="de">Folgen</span>)</>} />}>
          <T
            de={<p>Ein Bild mit den Achsen <M>n</M> (nach rechts) und <M>{t`a_n`}</M> (nach oben) und drei Sorten Punkten: blaue Quadrate «divergent», grüne Kreuze «konvergent & beschränkt», magenta Kreise «divergent & beschränkt».</p>}
            en={<p>A picture with the axes <M>n</M> (to the right) and <M>{t`a_n`}</M> (upwards) and three kinds of points: blue squares “<span lang="de">divergent</span>”, green crosses “<span lang="de">konvergent & beschränkt</span>” (convergent and bounded), magenta circles “<span lang="de">divergent & beschränkt</span>” (divergent and bounded).</p>}
          />
        </Box>
        <SlideKinds />
        <T
          de={<p>Man zeichnet eine Folge als Punkte: über der Platznummer <M>n</M> steht der Wert <M p=".">{t`a_n`}</M> <M>{t`a_n`}</M> heisst das <M>n</M>-te <b>Glied</b>. Blau wächst ohne Ende. Grün pendelt sich auf einer Höhe ein. Magenta bleibt in einem schmalen Band, kommt aber nie zur Ruhe.</p>}
          en={<p>A sequence is drawn as points: above the position number <M>n</M> stands the value <M p=".">{t`a_n`}</M> <M>{t`a_n`}</M> is called the <M>n</M>-th <b>term</b> (<span lang="de">Glied</span>). Blue grows without end. Green settles at one height. Magenta stays in a narrow band but never comes to rest.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="beschraenkt" title={<T de="2. Beschränkt und monoton" en="2. Bounded and monotonic" />}>
        <Box kind="uebung" src={<Src u={1} p={10} />} title={<T de="Beschränkt · Monoton wachsend/fallend" en={<>Bounded · monotonically increasing/decreasing (<span lang="de">Beschränkt · Monoton wachsend/fallend</span>)</>} />}>
          <T
            de={<p>Beschränkt: Alle Glieder sind in einem endlich breiten, waagerechten Parallelstreifen enthalten.</p>}
            en={<p>Bounded: all terms are contained in a horizontal parallel strip of finite width (<span lang="de">«Alle Glieder sind in einem endlich breiten, waagerechten Parallelstreifen enthalten.»</span>).</p>}
          />
          <MD>{t`\text{${tr('wachsend', 'increasing')}}\quad a_{n+1} \ge a_n \qquad (\text{${tr('strikt', 'strictly')}: } a_{n+1} > a_n)`}</MD>
          <MD>{t`\text{${tr('fallend', 'decreasing')}}\quad a_{n+1} \le a_n \qquad (\text{${tr('strikt', 'strictly')}: } a_{n+1} < a_n)`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>Beschränkt</b> heisst: Es gibt eine untere Zahl <M>s</M> und eine obere Zahl <M>S</M> mit <M>{t`s \le a_n \le S`}</M> für <em>alle</em> <M p=".">n</M> Das ist der Streifen zwischen den Höhen <M>s</M> und <M p=".">S</M> Kein einziges Glied darf herausragen.</p>
            <p className="keep"><b>Monoton wachsend</b> heisst: Jedes Glied ist mindestens so gross wie das vorige – die Folge geht nie nach unten, wie ein Kilometerzähler. «Strikt» heisst: Sie bleibt auch nie stehen.</p>
          </>}
          en={<>
            <p className="keep"><b>Bounded</b> means: there is a lower number <M>s</M> and an upper number <M>S</M> with <M>{t`s \le a_n \le S`}</M> for <em>every</em> <M p=".">n</M> That is the strip between the heights <M>s</M> and <M p=".">S</M> Not a single term may stick out.</p>
            <p className="keep"><b>Monotonically increasing</b> means: every term is at least as large as the one before – the sequence never goes down, like an odometer. “Strictly” means: it never stands still either.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="konvergent" title={<T de="3. Konvergent: was heisst das genau?" en="3. Convergent: what exactly does it mean?" />}>
        <Box kind="uebung" src={<Src u={1} p={10} />} title={<T de="Konvergent/Divergent · Nullfolge" en={<>Convergent/divergent · null sequence (<span lang="de">Nullfolge</span>)</>} />}>
          <T
            de={<ul>
              <li>Konvergent <M>{t`\Rightarrow`}</M> besitzt einen Grenzwert <M>{t`\Rightarrow`}</M> Beschränkt</li>
              <li>Beschränkt & Monoton steigend/fallend <M>{t`\Rightarrow`}</M> Konvergent</li>
              <li>Divergent falls nicht konvergent oder Nicht beschränkt <M>{t`\Rightarrow`}</M> Divergent</li>
              <li>Nullfolge: Folge konvergiert gegen <M p=".">0</M></li>
            </ul>}
            en={<ul>
              <li>Convergent <M>{t`\Rightarrow`}</M> has a limit <M>{t`\Rightarrow`}</M> bounded</li>
              <li>Bounded & monotonically increasing/decreasing <M>{t`\Rightarrow`}</M> convergent</li>
              <li>Divergent if not convergent, or not bounded <M>{t`\Rightarrow`}</M> divergent</li>
              <li><De en="null sequence">Nullfolge</De>: the sequence converges to <M p=".">0</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="keep">In Worten: Eine Folge <b>konvergiert</b> gegen den <b>Grenzwert</b> <M p=",">L</M> wenn ihre Glieder <M>L</M> beliebig nahe kommen und dort bleiben – wie ein Pendel, das ausschwingt. Man schreibt <M p=".">{t`\lim_{n\to\infty} a_n = L`}</M> Sonst heisst sie <b>divergent</b>. Eine <b>Nullfolge</b> hat den Grenzwert <M p=",">0</M> zum Beispiel <M p=".">{t`a_n = \frac1n`}</M></p>}
          en={<p className="keep">In words: a sequence <b>converges</b> to the <b>limit</b> <M>L</M> if its terms come arbitrarily close to <M>L</M> and stay there – like a pendulum that dies out. One writes <M p=".">{t`\lim_{n\to\infty} a_n = L`}</M> Otherwise it is called <b>divergent</b>. A <b>null sequence</b> has the limit <M p=",">0</M> for example <M p=".">{t`a_n = \frac1n`}</M></p>}
        />
        <Box keep kind="supplement" title={<T de={<>Der <M>\varepsilon</M>-Streifen</>} en={<>The <M>\varepsilon</M>-strip</>} />}>
          <T
            de={<p>«Beliebig nahe und dort bleiben» heisst genau:</p>}
            en={<p>“Arbitrarily close and staying there” means precisely:</p>}
          />
          <MD>{t`\text{${tr('Für jedes', 'For every')} } \varepsilon > 0 \text{ ${tr('gibt es ein', 'there is an')} } N \text{ ${tr('mit', 'with')} } |a_n - L| < \varepsilon \text{ ${tr('für alle', 'for all')} } n \ge N.`}</MD>
          <T
            de={<p>So liest man das: Gib mir eine noch so kleine Toleranz <M>\varepsilon</M> (griechisch «Epsilon»). Dann nenne ich dir eine Platznummer <M p=",">N</M> ab der <em>alle</em> Glieder höchstens <M>\varepsilon</M> von <M>L</M> entfernt sind. Im Bild ist das ein Streifen der Höhe <M>{t`2\varepsilon`}</M> um <M p=".">L</M> Davor dürfen beliebig viele – aber nur endlich viele – Glieder draussen liegen.</p>}
            en={<p>Read it like this: give me a tolerance <M>\varepsilon</M> (Greek “epsilon”), as small as you like. Then I name a position <M p=",">N</M> from which on <em>every</em> term is at most <M>\varepsilon</M> away from <M p=".">L</M> In the picture this is a strip of height <M>{t`2\varepsilon`}</M> about <M p=".">L</M> Before <M>N</M> any number of terms – but only finitely many – may lie outside.</p>}
          />
        </Box>
        <T
          de={<p>Probiere beide Streifen aus. Der <b>Parallelstreifen</b> vom Blatt (beschränkt) ist <em>ein</em> Streifen, so breit wie nötig, der alle Glieder enthält. Der <M>\varepsilon</M>-Streifen (konvergent) ist viel strenger: <em>jeder</em> noch so schmale Streifen um <M>L</M> muss ab einem <M>N</M> alles enthalten.</p>}
          en={<p>Try both strips. The <b>parallel strip</b> of the slide (bounded) is <em>one</em> strip, as wide as needed, that holds every term. The <M>\varepsilon</M>-strip (convergent) is much stricter: <em>every</em> strip about <M p=",">L</M> however narrow, must hold everything from some <M>N</M> on.</p>}
        />
        <StripExplorer />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="folgerungen" title={<T de="4. Was folgt woraus?" en="4. What follows from what?" />}>
        <Box kind="uebung" src={<Src u={2} p={1} />} title={<T de="Recap (Übung 2)" en="Recap (exercise class 2)" />}>
          <MD>{t`\text{${tr('konvergent', 'convergent')}} \;\Rightarrow\; \text{${tr('besitzt einen Grenzwert', 'has a limit')}} \;\Rightarrow\; \text{${tr('beschränkt', 'bounded')}}`}</MD>
          <MD>{t`\text{${tr('konvergent', 'convergent')}} \;\Rightarrow\; \text{${tr('beschränkt', 'bounded')}} \;\not\Rightarrow\; \text{${tr('divergent/konvergent', 'divergent/convergent')}}`}</MD>
          <MD>{t`\text{${tr('konvergent', 'convergent')}} \;\not\Rightarrow\; \text{${tr('monoton wachsend/fallend', 'monotonically increasing/decreasing')}}`}</MD>
          <T
            de={<p>Die Pfeile <M>{t`\not\Rightarrow`}</M> sind auf dem Blatt von Hand durchgestrichen. Und: «divergent falls nicht konvergent».</p>}
            en={<p>The arrows <M>{t`\not\Rightarrow`}</M> are crossed out by hand on the slide. And: “divergent if not convergent”.</p>}
          />
        </Box>
        <T
          de={<p><M>{t`A \Rightarrow B`}</M> heisst: Immer wenn <M>A</M> gilt, gilt auch <M p=".">B</M> <M>{t`A \not\Rightarrow B`}</M> heisst: Es gibt ein Gegenbeispiel – <M>A</M> gilt, <M>B</M> nicht. Ein einziges Gegenbeispiel genügt.</p>}
          en={<p><M>{t`A \Rightarrow B`}</M> means: whenever <M>A</M> holds, <M>B</M> holds too. <M>{t`A \not\Rightarrow B`}</M> means: there is a counter-example – <M>A</M> holds, <M>B</M> does not. One single counter-example is enough.</p>}
        />

        <h3><T de={<>Konvergent <M>{t`\Rightarrow`}</M> beschränkt</>} en={<>Convergent <M>{t`\Rightarrow`}</M> bounded</>} /></h3>
        <T
          de={<p>Warum? Ab einem <M>N</M> sitzen alle Glieder im <M>\varepsilon</M>-Streifen. Davor gibt es nur endlich viele – und endlich viele Zahlen passen immer in einen Streifen.</p>}
          en={<p>Why? From some <M>N</M> on, all terms sit in the <M>\varepsilon</M>-strip. Before that there are only finitely many – and finitely many numbers always fit into a strip.</p>}
        />
        <Derivation title={<T de={<>Konvergent <M>{t`\Rightarrow`}</M> beschränkt</>} en={<>Convergent <M>{t`\Rightarrow`}</M> bounded</>} />}>
          <StepPlayer
            label={tr('Animation: aus dem Epsilon-Streifen und den endlich vielen Gliedern davor wird ein Parallelstreifen', 'Animation: the epsilon-strip and the finitely many terms before it give a parallel strip')}
            steps={[
              { ms: 2500, holdMs: 2500, caption: <T
                de={<>Die Folge <M>{t`a_n = 1 + \frac{(-1)^n}{n}`}</M> springt um <M>{t`L = 1`}</M> herum und kommt immer näher. Sie konvergiert gegen <M p=".">1</M></>}
                en={<>The sequence <M>{t`a_n = 1 + \frac{(-1)^n}{n}`}</M> jumps around <M>{t`L = 1`}</M> and comes ever closer. It converges to <M p=".">1</M></>} /> },
              { ms: 2000, holdMs: 3000, caption: <T
                de={<>Ein Streifen mit <M>{t`\varepsilon = 0{,}3`}</M> um <M>L</M> (türkis). Ab <M>{t`N = 4`}</M> liegen alle Glieder darin (blau), davor nur drei (rot).</>}
                en={<>A strip with <M>{t`\varepsilon = 0.3`}</M> about <M>L</M> (teal). From <M>{t`N = 4`}</M> on, every term lies inside (blue); before that only three (red).</>} /> },
              { ms: 1600, holdMs: 3000, caption: <T
                de={<>Vor <M>N</M> liegen nur endlich viele Glieder: <M p=".">{t`a_1, a_2, a_3`}</M> Unter endlich vielen Zahlen gibt es immer eine grösste und eine kleinste.</>}
                en={<>Before <M>N</M> there are only finitely many terms: <M p=".">{t`a_1, a_2, a_3`}</M> Among finitely many numbers there is always a largest and a smallest.</>} /> },
              { ms: 2000, caption: <T
                de={<>Die magenta Linien fassen beides ein: den Streifen und die Glieder davor. Also <M>{t`0 \le a_n \le 1{,}5`}</M> für alle <M>n</M> – beschränkt.</>}
                en={<>The magenta lines enclose both: the strip and the terms before it. So <M>{t`0 \le a_n \le 1.5`}</M> for every <M>n</M> – bounded.</>} /> },
            ]}
          >
            {(step, tt) => <SceneFig build={kbScene} step={step} t={tt} label={tr('Folge mit Streifen', 'sequence with strips')} />}
          </StepPlayer>
        </Derivation>

        <h3><T de={<>Beschränkt <M>{t`\not\Rightarrow`}</M> konvergent, konvergent <M>{t`\not\Rightarrow`}</M> monoton</>} en={<>Bounded <M>{t`\not\Rightarrow`}</M> convergent, convergent <M>{t`\not\Rightarrow`}</M> monotonic</>} /></h3>
        <T
          de={<p>Die Gegenbeispiele stehen oben im Streifen-Bild. <M>{t`a_n = (-1)^n`}</M> springt zwischen <M>-1</M> und <M p=":">1</M> beschränkt, aber kein Grenzwert. <M>{t`a_n = 1 + \frac{(-1)^n}{n}`}</M> konvergiert gegen <M p=",">1</M> geht aber abwechselnd hoch und runter – nicht monoton.</p>}
          en={<p>The counter-examples are in the strip figure above. <M>{t`a_n = (-1)^n`}</M> jumps between <M>-1</M> and <M p=":">1</M> bounded, but no limit. <M>{t`a_n = 1 + \frac{(-1)^n}{n}`}</M> converges to <M p=",">1</M> but goes up and down in turn – not monotonic.</p>}
        />

        <h3><T de={<>Beschränkt und monoton <M>{t`\Rightarrow`}</M> konvergent</>} en={<>Bounded and monotonic <M>{t`\Rightarrow`}</M> convergent</>} /></h3>
        <T
          de={<p>Stell dir einen Ballon vor, der nur steigen darf, unter einer Decke. Er kann nicht ewig weiter steigen, ohne die Decke zu erreichen – also kommt er einer Höhe immer näher. Das zeigt die Animation.</p>}
          en={<p>Picture a balloon that may only rise, under a ceiling. It cannot keep rising for ever without reaching the ceiling – so it comes ever closer to one height. The animation shows this.</p>}
        />
        <Derivation title={<T de={<>Monoton wachsend und beschränkt <M>{t`\Rightarrow`}</M> konvergent</>} en={<>Increasing and bounded <M>{t`\Rightarrow`}</M> convergent</>} />}>
          <StepPlayer
            label={tr('Animation: die kleinste obere Schranke S ist der Grenzwert einer wachsenden Folge', 'Animation: the least upper bound S is the limit of an increasing sequence')}
            steps={[
              { ms: 2500, holdMs: 2500, caption: <T
                de={<>Die Folge <M>{t`a_n = 1 - \frac1n`}</M> wächst monoton. Sie ist beschränkt: Alle Glieder liegen unter <M>{t`1{,}6`}</M> (magenta).</>}
                en={<>The sequence <M>{t`a_n = 1 - \frac1n`}</M> is increasing. It is bounded: every term lies below <M>{t`1.6`}</M> (magenta).</>} /> },
              { ms: 2200, holdMs: 3000, caption: <T
                de={<>Schiebe die Schranke so tief wie möglich: bis <M p=".">{t`S = 1`}</M> Jede tiefere Linie würde von einem Glied durchstossen.</>}
                en={<>Push the bound down as far as possible: to <M p=".">{t`S = 1`}</M> Any lower line would be pierced by a term.</>} /> },
              { ms: 1800, holdMs: 3000, caption: <T
                de={<>Ein Streifen der Breite <M>{t`\varepsilon = 0{,}15`}</M> unter <M p=".">S</M> <M>{t`S - \varepsilon`}</M> ist keine Schranke mehr, also liegt ein Glied darüber: <M p=".">{t`a_N = a_7`}</M></>}
                en={<>A strip of width <M>{t`\varepsilon = 0.15`}</M> below <M p=".">S</M> <M>{t`S - \varepsilon`}</M> is no bound any more, so some term lies above it: <M p=".">{t`a_N = a_7`}</M></>} /> },
              { ms: 1800, caption: <T
                de={<>Die Folge wächst: Alle späteren Glieder liegen über <M>{t`a_N`}</M> und unter <M>S</M> – im Streifen. Das klappt für jedes <M p=":">\varepsilon</M> <M p=".">{t`a_n \to S`}</M></>}
                en={<>The sequence increases: every later term lies above <M>{t`a_N`}</M> and below <M>S</M> – in the strip. This works for every <M p=":">\varepsilon</M> <M p=".">{t`a_n \to S`}</M></>} /> },
            ]}
          >
            {(step, tt) => <SceneFig build={mbScene} step={step} t={tt} label={tr('wachsende Folge unter einer Schranke', 'increasing sequence below a bound')} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Für fallende Folgen gilt dasselbe gespiegelt: Sie konvergieren gegen ihre grösste untere Schranke. Dass es die kleinste obere Schranke <M>S</M> immer gibt, ist eine Grundeigenschaft der reellen Zahlen (die <b>Vollständigkeit</b>: Die Zahlengerade hat keine Löcher).</p>}
          en={<p>For decreasing sequences the same holds mirrored: they converge to their greatest lower bound. That the least upper bound <M>S</M> always exists is a basic property of the real numbers (<b>completeness</b>: the number line has no holes).</p>}
        />

        <h3 className="keep"><T de="Divergent" en="Divergent" /></h3>
        <T
          de={<p className="keep">Divergent heisst einfach: nicht konvergent. «Nicht beschränkt» ist ein Sonderfall davon – wer unbeschränkt ist, kann nach «konvergent <M>{t`\Rightarrow`}</M> beschränkt» nicht konvergieren. Darum genügt die Zeile der Übung 2: «divergent falls nicht konvergent».</p>}
          en={<p className="keep">Divergent simply means: not convergent. “Not bounded” is a special case of it – an unbounded sequence cannot converge, by “convergent <M>{t`\Rightarrow`}</M> bounded”. That is why the line of exercise class 2 is enough: “divergent if not convergent”.</p>}
        />

        <Box kind="misconception" title={<T de="«Beschränkt heisst konvergent»" en="“Bounded means convergent”" />}>
          <T de={<p className="keep">Nein: <M>{t`(-1)^n`}</M> bleibt zwischen <M>-1</M> und <M p=",">1</M> hat aber keinen Grenzwert. Beschränkt <em>und monoton</em> reicht.</p>}
            en={<p>No: <M>{t`(-1)^n`}</M> stays between <M>-1</M> and <M p=",">1</M> but has no limit. Bounded <em>and monotonic</em> is enough.</p>} />
        </Box>
        <Box kind="misconception" title={<T de="«Monoton heisst konvergent»" en="“Monotonic means convergent”" />}>
          <T de={<p>Nein: <M>{t`a_n = \frac{n}{10}`}</M> wächst monoton, aber über jede Grenze. Ohne Schranke keine Konvergenz.</p>}
            en={<p>No: <M>{t`a_n = \frac{n}{10}`}</M> increases monotonically, but beyond every bound. No bound, no convergence.</p>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Die Glieder kommen <M>L</M> immer näher – also ist <M>L</M> der Grenzwert»</>} en={<>“The terms come ever closer to <M>L</M> – so <M>L</M> is the limit”</>} />}>
          <T de={<p><M>{t`\frac1n`}</M> kommt auch <M>-1</M> immer näher, und trotzdem ist der Grenzwert <M p=".">0</M> Es kommt auf <em>beliebig</em> nahe an: Jedes <M>\varepsilon</M> muss irgendwann unterschritten werden.</p>}
            en={<p><M>{t`\frac1n`}</M> also comes ever closer to <M p=",">-1</M> and yet the limit is <M p=".">0</M> What counts is <em>arbitrarily</em> close: every <M>\varepsilon</M> must be undercut eventually.</p>} />
        </Box>
        <Box kind="misconception" title={<T de="«Eine konvergente Folge erreicht ihren Grenzwert»" en="“A convergent sequence reaches its limit”" />}>
          <T de={<p>Muss sie nicht: <M>{t`\frac{n}{n+1}`}</M> ist nie gleich <M p=",">1</M> kommt <M>1</M> aber beliebig nahe.</p>}
            en={<p>It need not: <M>{t`\frac{n}{n+1}`}</M> never equals <M p=",">1</M> but comes arbitrarily close to <M p=".">1</M></p>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Beschränkt: ein Streifen enthält alle Glieder. Konvergent gegen <M p=":">L</M> jeder <M>\varepsilon</M>-Streifen um <M>L</M> enthält alle Glieder ab einem <M p=".">N</M></li>
              <li>konvergent <M>{t`\Rightarrow`}</M> beschränkt; beschränkt + monoton <M>{t`\Rightarrow`}</M> konvergent.</li>
              <li>beschränkt <M>{t`\not\Rightarrow`}</M> konvergent (<M p=");">{t`(-1)^n`}</M> konvergent <M>{t`\not\Rightarrow`}</M> monoton (<M p=").">{t`1 + \frac{(-1)^n}{n}`}</M></li>
            </ul>}
            en={<ul>
              <li>Bounded: one strip holds every term. Convergent to <M p=":">L</M> every <M>\varepsilon</M>-strip about <M>L</M> holds every term from some <M>N</M> on.</li>
              <li>convergent <M>{t`\Rightarrow`}</M> bounded; bounded + monotonic <M>{t`\Rightarrow`}</M> convergent.</li>
              <li>bounded <M>{t`\not\Rightarrow`}</M> convergent (<M p=");">{t`(-1)^n`}</M> convergent <M>{t`\not\Rightarrow`}</M> monotonic (<M p=").">{t`1 + \frac{(-1)^n}{n}`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Weiter: Wie man Grenzwerte ausrechnet, ohne <M>\varepsilon</M> – in <a href="#ana-grenzwerte-folgen">Grenzwerte von Folgen</a>.</p>}
          en={<p>Next: how to compute limits without <M>\varepsilon</M> – in <a href="#ana-grenzwerte-folgen">Limits of sequences</a>.</p>}
        />
      </Section>
    </article>
  );
}
