import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import type { AnimStep } from '../viz/anim/StepPlayer';
import { ArrowDiagrams, HorizontalLineTest, MirrorPlayer } from '../viz/ana/W3Figures';
import { MIRROR, texNum, type MirrorId } from '../viz/ana/w3scenes';

const t = String.raw;

/** Point labels of the mirror animation (computed from the figure's point): (a; b) → (b; a), German and English. */
function pts(id: MirrorId): [string, string, string, string] {
  const [a, b] = MIRROR[id].P;
  const de = (x: number, y: number) => `(${texNum(x, 'de')};\\ ${texNum(y, 'de')})`, en = (x: number, y: number) => `(${texNum(x, 'en')}, ${texNum(y, 'en')})`;
  return [de(a, b), de(b, a), en(a, b), en(b, a)];
}

function mirrorSteps(id: MirrorId): AnimStep[] {
  const [pd, qd, pe, qe] = pts(id);
  return [
    { ms: 1200, holdMs: 2200, caption: <T de={<>Der Graph der Funktion (blau) und die Spiegelgerade <M>{t`y = x`}</M> (grau).</>} en={<>The graph of the function (blue) and the mirror line <M>{t`y = x`}</M> (grey).</>} /> },
    { ms: 2500, holdMs: 2800, caption: <T de={<>Ein Punkt <M>{pd}</M> wird zu <M p=":">{qd}</M> <M>x</M> und <M>y</M> tauschen. Die Verbindung steht senkrecht auf <M p=".">{t`y = x`}</M></>} en={<>A point <M>{pe}</M> becomes <M p=":">{qe}</M> <M>x</M> and <M>y</M> swap. The connecting line is perpendicular to <M p=".">{t`y = x`}</M></>} /> },
    { ms: 3500, holdMs: 3000, caption: id === 'bruch'
      ? <T de={<>Das machen alle Punkte gleichzeitig: Es entsteht die Umkehrfunktion (magenta). Auch die Asymptoten werden gespiegelt: <M>{t`x = -2`}</M> wird <M p=",">{t`y = -2`}</M> <M>{t`y = 1`}</M> wird <M p=".">{t`x = 1`}</M></>} en={<>All points do this at once: the inverse function appears (magenta). The asymptotes are mirrored too: <M>{t`x = -2`}</M> becomes <M p=",">{t`y = -2`}</M> <M>{t`y = 1`}</M> becomes <M p=".">{t`x = 1`}</M></>} />
      : <T de="Das machen alle Punkte gleichzeitig: Es entsteht der Graph der Umkehrfunktion (magenta)." en="All points do this at once: the graph of the inverse function appears (magenta)." /> },
    { ms: 3000, caption: <T de={<>Definitions- und Wertebereich tauschen die Rollen. Was auf der <M>y</M>-Achse lag (Werte), liegt jetzt auf der <M>x</M>-Achse (erlaubte Eingaben).</>} en={<>Domain and range swap roles. What lay on the <M>y</M>-axis (values) now lies on the <M>x</M>-axis (allowed inputs).</>} /> },
  ];
}

export default function A3Umkehr() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Funktion rechnet von <M>x</M> nach <M p=".">y</M> Die Umkehrfunktion soll zurückrechnen: Welches <M>x</M> hat diesen <M>y</M>-Wert geliefert? Das geht nur, wenn die Antwort eindeutig ist. Dafür gibt es drei Wörter: injektiv, surjektiv, bijektiv. (Vorher: <a href="#ana-transformationen">Graphen verschieben, strecken, Kehrwert</a>.)</p>}
        en={<p className="lede">A function computes from <M>x</M> to <M p=".">y</M> The inverse function should compute back: which <M>x</M> gave this <M>y</M>-value? That works only if the answer is unique. Three words describe this: injective, surjective, bijective. (Before: <a href="#ana-transformationen">Shifting and stretching graphs, reciprocals</a>.)</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="injektiv" title={<T de="1. Injektiv, surjektiv, bijektiv" en="1. Injective, surjective, bijective" />}>
        <Box kind="uebung" src={<Src u={3} p={5} />} title={<T de={<>Umkehren: Welches <M>x</M> hat diesen <M>y</M>-Wert geliefert?</>} en={<>Inverting: which <M>x</M> gave this <M>y</M>-value?</>} />}>
          <MD>{tr(t`x^2 = 9 \ \Rightarrow\ x = 3 \text{ oder } x = -3`, t`x^2 = 9 \ \Rightarrow\ x = 3 \text{ or } x = -3`)}</MD>
          <T de={<p>Zwei Möglichkeiten. So können wir nicht eindeutig zurückrechnen.</p>} en={<p>Two possibilities. So we cannot compute back uniquely.</p>} />
          <MD>{tr(t`x^3 = 8 \ \Rightarrow\ x = 2 \quad \text{eindeutig!}`, t`x^3 = 8 \ \Rightarrow\ x = 2 \quad \text{unique!}`)}</MD>
        </Box>
        <Box kind="uebung" src={<Src u={3} p={6} />} title={<T de="Injektiv, surjektiv, bijektiv" en={<><span lang="de">Injektiv, surjektiv, bijektiv</span></>} />}>
          <T
            de={<>
              <p><M>D</M> = Definitionsbereich, <M>Z</M> = Zielbereich.</p>
              <p><b>Injektiv:</b> Kein <M>y</M>-Wert wird von zwei verschiedenen <M>x</M> getroffen. <M>{t`f(x) = 2x+1`}</M> injektiv; <M p=":">{t`g(x) = x^2`}</M> <M p=".">{t`g(-2) = g(2) = 4`}</M> <M>{t`x^2`}</M> auf <M>{t`\mathbb R`}</M> ist also nicht injektiv. Graph-Test: Jede waagerechte Linie trifft höchstens einmal. Zum Rechnen: <M p=".">{t`f(x_1) = f(x_2) \Rightarrow x_1 = x_2`}</M></p>
              <p><b>Surjektiv:</b> Jeder Wert im Zielbereich wird getroffen. <M>{t`x^3\colon \mathbb R\to\mathbb R`}</M> surjektiv; <M>{t`e^x\colon \mathbb R\to\mathbb R`}</M> nicht surjektiv. <M>{t`e^x`}</M> ist immer positiv. <M>0</M> und negative Zielwerte werden nie erreicht. Graph-Test: Jede senkrechte Linie trifft mindestens einmal.</p>
              <p><b>Bijektiv:</b> <M p=".">{t`\text{injektiv} + \text{surjektiv} = \text{bijektiv}`}</M> Jeder Zielwert wird genau einmal getroffen. Dann können wir eindeutig zurückrechnen.</p>
            </>}
            en={<>
              <p><M>D</M> = domain (<span lang="de">Definitionsbereich</span>), <M>Z</M> = target set (<span lang="de">Zielbereich</span>).</p>
              <p><b><De en="injective">Injektiv</De>:</b> no <M>y</M>-value is hit by two different values of <M p=".">x</M> <M>{t`f(x) = 2x+1`}</M> injective; <M p=":">{t`g(x) = x^2`}</M> <M p=".">{t`g(-2) = g(2) = 4`}</M> So <M>{t`x^2`}</M> on <M>{t`\mathbb R`}</M> is not injective. Graph test: every horizontal line meets at most once. For computing: <M p=".">{t`f(x_1) = f(x_2) \Rightarrow x_1 = x_2`}</M></p>
              <p><b><De en="surjective">Surjektiv</De>:</b> every value of the target set is hit. <M>{t`x^3\colon \mathbb R\to\mathbb R`}</M> surjective; <M>{t`e^x\colon \mathbb R\to\mathbb R`}</M> not surjective. <M>{t`e^x`}</M> is always positive. <M>0</M> and negative target values are never reached. Graph test: every <em>vertical</em> line meets at least once.</p>
              <p><b><De en="bijective">Bijektiv</De>:</b> <M p=".">{t`\text{injective} + \text{surjective} = \text{bijective}`}</M> Every target value is hit exactly once. Then we can compute back uniquely.</p>
            </>}
          />
        </Box>
        <ArrowDiagrams />
        <T
          de={<p className="keep">Die Pfeilbilder lesen: Jeder Punkt links (<M p=")">D</M> schickt genau einen Pfeil – das macht jede Funktion. <b>Injektiv</b> heisst: rechts kommen nie zwei Pfeile am selben Punkt an. <b>Surjektiv</b> heisst: rechts bleibt kein Punkt ohne Pfeil.</p>}
          en={<p className="keep">Reading the arrow pictures: every point on the left (<M p=")">D</M> sends exactly one arrow – every function does that. <b>Injective</b> means: on the right, two arrows never arrive at the same point. <b>Surjective</b> means: on the right, no point is left without an arrow.</p>}
        />
        <T
          de={<p><b>Ein Satz zum Graph-Test für surjektiv:</b> Auf der Folie steht «senkrechte Linie». Gemeint ist die <b>waagerechte</b>: Jede Linie <M>{t`y = c`}</M> mit <M>c</M> im Zielbereich muss den Graphen mindestens einmal treffen. (Senkrechte Linien prüfen nur, ob überhaupt eine Funktion vorliegt.) Probier es:</p>}
          en={<p><b>One sentence on the graph test for surjective:</b> the slide says “vertical line”. Meant is the <b>horizontal</b> one: every line <M>{t`y = c`}</M> with <M>c</M> in the target set must meet the graph at least once. (Vertical lines only test whether we have a function at all.) Try it:</p>}
        />
        <HorizontalLineTest />
        <T
          de={<>
            <p className="keep"><b>Was die Linie zählt:</b></p>
            <ol className="keep">
              <li>Jeder Schnittpunkt mit <M>{t`y = c`}</M> ist ein <M>x</M> mit <M p=".">{t`f(x) = c`}</M> Zwei Schnittpunkte heissen also: zwei <M>x</M> liefern denselben Wert – nicht injektiv.</li>
              <li>Kein Schnittpunkt, obwohl <M>c</M> im Zielbereich liegt: Dieser Zielwert wird nie erreicht – nicht surjektiv. So bei <M>{t`e^x`}</M> für <M p=".">{t`c \le 0`}</M></li>
              <li>Bei <M>{t`x^2`}</M> hängt alles an den Bereichen. Auf <M>{t`[0, \infty)\to[0, \infty)`}</M> bleibt nur der rechte Ast (blau), und jede Linie im Zielbereich trifft genau einmal: bijektiv.</li>
            </ol>
            <p>Tipp zur Serie 3 (<Src u={3} p={12} />): «Bei injektiv und surjektiv die Bereiche immer mitlesen.» Bild <M>=</M> tatsächlich erreichte Werte. Zielbereich <M>=</M> die Menge rechts vom Pfeil. Surjektiv heisst also: Bild <M>=</M> Zielbereich.</p>
          </>}
          en={<>
            <p className="keep"><b>What the line counts:</b></p>
            <ol className="keep">
              <li>Every intersection with <M>{t`y = c`}</M> is an <M>x</M> with <M p=".">{t`f(x) = c`}</M> Two intersections mean: two values of <M>x</M> give the same value – not injective.</li>
              <li>No intersection although <M>c</M> is in the target set: this target value is never reached – not surjective. As with <M>{t`e^x`}</M> for <M p=".">{t`c \le 0`}</M></li>
              <li>For <M>{t`x^2`}</M> everything depends on the sets. On <M>{t`[0, \infty)\to[0, \infty)`}</M> only the right branch remains (blue), and every line in the target set meets exactly once: bijective.</li>
            </ol>
            <p>Hint for problem set 3 (<Src u={3} p={12} />): “always read the sets as well”. Image (<span lang="de">Bild</span>) <M>=</M> the values actually reached. Target set <M>=</M> the set to the right of the arrow. So surjective means: image <M>=</M> target set.</p>
          </>}
        />
        <T
          de={<p className="keep"><b>«Zum Rechnen» vorgelesen</b>, für <M p=":">{t`f(x) = 2x+1`}</M> Nimm an, <M p=".">{t`f(x_1) = f(x_2)`}</M> Dann ist <M p=".">{t`2x_1 + 1 = 2x_2 + 1`}</M> Minus <M p=",">1</M> durch <M p=":">2</M> <M p=".">{t`x_1 = x_2`}</M> Gleicher Wert erzwingt gleiches <M p=":">x</M> injektiv. Bei <M>{t`x^2`}</M> scheitert das: aus <M>{t`x_1^2 = x_2^2`}</M> folgt nur <M p=".">{t`x_1 = \pm x_2`}</M></p>}
          en={<p className="keep"><b>“For computing” read aloud</b>, for <M p=":">{t`f(x) = 2x+1`}</M> assume <M p=".">{t`f(x_1) = f(x_2)`}</M> Then <M p=".">{t`2x_1 + 1 = 2x_2 + 1`}</M> Subtract <M p=",">1</M> divide by <M p=":">2</M> <M p=".">{t`x_1 = x_2`}</M> Equal values force equal <M p=":">x</M> injective. For <M>{t`x^2`}</M> this fails: <M>{t`x_1^2 = x_2^2`}</M> only gives <M p=".">{t`x_1 = \pm x_2`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="umkehrfunktion" title={<T de="2. Umkehrfunktion bestimmen" en="2. Finding the inverse function" />}>
        <Box kind="uebung" src={<Src u={3} p={7} />} title={<T de="Umkehrfunktion bestimmen" en={<>Finding the inverse function (<span lang="de">Umkehrfunktion bestimmen</span>)</>} />}>
          <T de={<p>Wir gehen rückwärts: Aus dem Output wird wieder der Input.</p>} en={<p>We go backwards: the output becomes the input again.</p>} />
          <MD>{tr(t`y = f(x) \ \longrightarrow\ \text{nach } x \text{ auflösen} \ \longrightarrow\ x, y \text{ tauschen}`, t`y = f(x) \ \longrightarrow\ \text{solve for } x \ \longrightarrow\ \text{swap } x, y`)}</MD>
          <T de={<p><b>Bsp. 1</b> <M p=":">{t`f\colon\mathbb R\to\mathbb R`}</M></p>} en={<p><b>Ex. 1</b> <M p=":">{t`f\colon\mathbb R\to\mathbb R`}</M></p>} />
          <MD>{t`y = 2x+3 \ \Rightarrow\ x = \frac{y-3}{2}, \qquad f^{-1}(x) = \frac{x-3}{2},\ x\in\mathbb R`}</MD>
          <T de={<p><b>Bsp. 2</b> <M p=":">{t`g\colon[0, \infty)\to[0, \infty)`}</M></p>} en={<p><b>Ex. 2</b> <M p=":">{t`g\colon[0, \infty)\to[0, \infty)`}</M></p>} />
          <MD>{t`y = x^2,\ x \ge 0 \ \Rightarrow\ x = \sqrt y, \qquad g^{-1}(x) = \sqrt x,\ x \ge 0`}</MD>
          <T de={<p><b>Bsp. 3</b> <M p=":">{t`h\colon\mathbb R\to(0, \infty)`}</M></p>} en={<p><b>Ex. 3</b> <M p=":">{t`h\colon\mathbb R\to(0, \infty)`}</M></p>} />
          <MD>{t`y = e^x \ \Rightarrow\ x = \ln(y), \qquad h^{-1}(x) = \ln(x),\ x > 0, \qquad h^{-1}\colon(0, \infty)\to\mathbb R`}</MD>
        </Box>
        <T
          de={<p className="keep"><b>Warum «<M p=",">x</M> <M>y</M> tauschen»?</b> Nach dem Auflösen steht die Rückrechnung schon da: <M>{t`x = \frac{y-3}{2}`}</M> sagt, welches <M>x</M> zum Wert <M>y</M> gehört. Man nennt die Eingabe aber gewohnheitsmässig <M p=",">x</M> darum benennt man um. Im Bild heisst Tauschen: Jeder Punkt <M>{t`(a, b)`}</M> wird zu <M p="">{t`(b, a)`}</M> – eine Spiegelung an der Geraden <M p=".">{t`y = x`}</M></p>}
          en={<p className="keep"><b>Why “swap <M>x</M> and <M p="”?">y</M></b> After solving, the way back is already there: <M>{t`x = \frac{y-3}{2}`}</M> says which <M>x</M> belongs to the value <M p=".">y</M> But we habitually call the input <M p=",">x</M> so we rename. In the picture, swapping means: every point <M>{t`(a, b)`}</M> becomes <M p="">{t`(b, a)`}</M> – a reflection in the line <M p=".">{t`y = x`}</M></p>}
        />
        <MirrorPlayer steps={mirrorSteps} />
        <Box kind="uebung" src={<Src u={3} p={8} />} title={<T de="Bsp. 4: Bruchfunktion" en={<>Ex. 4: rational function (<span lang="de">Bruchfunktion</span>)</>} />}>
          <MD>{t`y = \frac{x-1}{x+2}, \qquad y\colon \mathbb R\setminus\{-2\} \to \mathbb R\setminus\{1\}`}</MD>
          <MD>{t`\begin{aligned} y(x+2) &= x - 1 && \times (x+2)\\ yx + 2y &= x - 1 \\ yx - x &= -1 - 2y && \text{${tr('Alle x auf eine Seite.', 'All x to one side.')}}\\ (y-1)x &= -1 - 2y && \text{${tr('x ausklammern.', 'Factor out x.')}}\\ x &= -\frac{2y+1}{y-1} && \div (y-1),\ \text{${tr('also', 'so')}}\ y \neq 1 \end{aligned}`}</MD>
          <MD>{t`y^{-1}(x) = -\frac{2x+1}{x-1},\ x \neq 1, \qquad y^{-1}\colon \mathbb R\setminus\{1\} \to \mathbb R\setminus\{-2\}`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum ist jeder Schritt erlaubt?</b></p>
            <ol className="keep">
              <li><M p=":">{t`\times(x+2)`}</M> erlaubt, weil <M>{t`x \neq -2`}</M> (das steht im Definitionsbereich). Mit <M>0</M> zu multiplizieren würde Information zerstören.</li>
              <li>Ausmultiplizieren, dann alle Terme mit <M>x</M> nach links, den Rest nach rechts: <M>{t`x`}</M> abziehen, <M>{t`2y`}</M> abziehen.</li>
              <li><M p=":">{t`yx - x = (y-1)x`}</M> Jetzt kommt <M>x</M> nur noch einmal vor.</li>
              <li><M p=":">{t`\div(y-1)`}</M> nur für <M p=".">{t`y \neq 1`}</M> Darum fehlt die <M>1</M> im Wertebereich – genau dort hat der Graph die waagerechte Asymptote.</li>
            </ol>
            <p>Das Skript nennt die Funktion selbst <M>y</M> (sonst schreibt man <M p=").">{t`f`}</M> Gemeint ist dasselbe: <M p=".">{t`y^{-1} = f^{-1}`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>Why is each step allowed?</b></p>
            <ol className="keep">
              <li><M p=":">{t`\times(x+2)`}</M> allowed because <M>{t`x \neq -2`}</M> (that is in the domain). Multiplying by <M>0</M> would destroy information.</li>
              <li>Expand, then all terms with <M>x</M> to the left, the rest to the right: subtract <M p=",">{t`x`}</M> subtract <M p=".">{t`2y`}</M></li>
              <li><M p=":">{t`yx - x = (y-1)x`}</M> now <M>x</M> appears only once.</li>
              <li><M p=":">{t`\div(y-1)`}</M> only for <M p=".">{t`y \neq 1`}</M> That is why <M>1</M> is missing from the range – exactly where the graph has its horizontal asymptote.</li>
            </ol>
            <p>The notes call the function itself <M>y</M> (usually one writes <M p=").">{t`f`}</M> It means the same: <M p=".">{t`y^{-1} = f^{-1}`}</M></p>
          </>}
        />
        <Box kind="uebung" src={<Src u={3} p={8} />} title={<T de="Bsp. 5: Sinus" en="Ex. 5: sine" />}>
          <T
            de={<p>Sinus trifft denselben <M>y</M>-Wert mehrmals. Wir nehmen deshalb nur das Stück <M p=".">{t`[-\frac\pi2, \frac\pi2]`}</M></p>}
            en={<p>The sine hits the same <M>y</M>-value several times. So we take only the piece <M p=".">{t`[-\frac\pi2, \frac\pi2]`}</M></p>}
          />
          <MD>{t`\sin\colon \left[-\tfrac\pi2, \tfrac\pi2\right] \to [-1, 1], \qquad \arcsin\colon [-1, 1] \to \left[-\tfrac\pi2, \tfrac\pi2\right]`}</MD>
          <T
            de={<p>Bei der Umkehrfunktion tauschen Definitionsbereich und Wertebereich die Rollen.</p>}
            en={<p>For the inverse function, domain and range swap roles.</p>}
          />
        </Box>
        <T
          de={<p>Im Bsp. 5 der Animation siehst du grau gestrichelt den ganzen Sinus: Eine waagerechte Linie würde ihn oft treffen. Erst das blaue Stück ist injektiv – darum kann man es umkehren.</p>}
          en={<p>In Ex. 5 of the animation the whole sine is drawn dashed grey: a horizontal line would meet it many times. Only the blue piece is injective – that is why it can be inverted.</p>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`x^2`}</M> hat keine Umkehrfunktion»</>} en={<>“<M>{t`x^2`}</M> has no inverse”</>} />}>
          <T
            de={<p>Auf <M>{t`\mathbb R`}</M> nicht, weil <M p=".">{t`(-2)^2 = 2^2`}</M> Auf <M>{t`[0, \infty)\to[0, \infty)`}</M> schon: <M p=".">{t`\sqrt x`}</M> Ob es eine Umkehrfunktion gibt, hängt an <M>D</M> und <M p=",">Z</M> nicht nur an der Formel.</p>}
            en={<p>Not on <M p=",">{t`\mathbb R`}</M> because <M p=".">{t`(-2)^2 = 2^2`}</M> On <M>{t`[0, \infty)\to[0, \infty)`}</M> it does: <M p=".">{t`\sqrt x`}</M> Whether an inverse exists depends on <M>D</M> and <M p=",">Z</M> not only on the formula.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«Umkehrfunktion <M>=</M> an der <M>x</M>-Achse spiegeln»</>} en={<>“Inverse <M>=</M> mirror at the <M>x</M>-axis”</>} />}>
          <T
            de={<p>An der <M>x</M>-Achse spiegeln gibt <M p=".">{t`-f(x)`}</M> Die Umkehrfunktion entsteht durch Spiegeln an der Geraden <M p=",">{t`y = x`}</M> weil <M>x</M> und <M>y</M> tauschen.</p>}
            en={<p>Mirroring at the <M>x</M>-axis gives <M p=".">{t`-f(x)`}</M> The inverse comes from mirroring at the line <M p=",">{t`y = x`}</M> because <M>x</M> and <M>y</M> swap.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Surjektiv prüft man mit senkrechten Linien»" en="“Surjectivity is tested with vertical lines”" />}>
          <T
            de={<p>Mit waagerechten: Jede Höhe <M>c</M> im Zielbereich muss getroffen werden. Bei <M>{t`e^x\colon\mathbb R\to\mathbb R`}</M> trifft jede senkrechte Linie, aber die waagerechte <M>{t`y = -1`}</M> nie.</p>}
            en={<p>With horizontal ones: every height <M>c</M> in the target set must be hit. For <M>{t`e^x\colon\mathbb R\to\mathbb R`}</M> every vertical line meets, but the horizontal line <M>{t`y = -1`}</M> never does.</p>}
          />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Injektiv: jede waagerechte Linie höchstens einmal. Surjektiv: jede waagerechte Linie im Zielbereich mindestens einmal. Bijektiv: genau einmal.</li>
              <li>Umkehrfunktion: nach <M>x</M> auflösen, <M>x</M> und <M>y</M> tauschen. Geht nur bei bijektiv – notfalls den Bereich einschränken.</li>
              <li>Der Graph von <M>{t`f^{-1}`}</M> ist der Graph von <M p=",">f</M> gespiegelt an <M p=".">{t`y = x`}</M> <M>D</M> und <M>W</M> tauschen die Rollen.</li>
            </ul>}
            en={<ul>
              <li>Injective: every horizontal line at most once. Surjective: every horizontal line in the target set at least once. Bijective: exactly once.</li>
              <li>Inverse: solve for <M p=",">x</M> swap <M>x</M> and <M p=".">y</M> Works only if bijective – if necessary, restrict the sets.</li>
              <li>The graph of <M>{t`f^{-1}`}</M> is the graph of <M p=",">f</M> mirrored at <M p=".">{t`y = x`}</M> <M>D</M> and <M>W</M> swap roles.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
