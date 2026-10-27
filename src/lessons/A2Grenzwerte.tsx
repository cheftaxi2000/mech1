import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CancelFig, CexFig, LhZoom, LimitProbe, PowerFig, SinCircle, XSinFig } from '../viz/ana/W2Figures';
import { cancelFrame, sinFrame } from '../viz/ana/w2Geom';

const t = String.raw;

export default function A2Grenzwerte() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In <a href="#ana-funktionen">Funktionen, Definitions- und Wertebereich</a> ging es um die Werte einer Funktion. Jetzt die Frage: Welchem Wert kommt <M>{t`f(x)`}</M> immer näher, wenn <M>x</M> einer Stelle <M>a</M> immer näher kommt? Das ist der <b>Grenzwert</b> <M p=".">{t`\lim_{x\to a} f(x)`}</M> Mit ihm sagt man genau, was «ohne Sprung» heisst, und man kann Ausdrücke wie <M>{t`\frac00`}</M> auflösen.</p>}
        en={<p className="lede">In <a href="#ana-funktionen">Functions, domain and range</a> we looked at the values of a function. Now the question: which value does <M>{t`f(x)`}</M> get closer and closer to when <M>x</M> gets closer and closer to a place <M p="?">a</M> That is the <b>limit</b> <M p=".">{t`\lim_{x\to a} f(x)`}</M> With it you can say precisely what “without a jump” means, and you can resolve expressions like <M p=".">{t`\frac00`}</M></p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir eine Brücke über eine Schlucht vor, gebaut von beiden Seiten. Von links läufst du auf die Mitte zu, von rechts auch. Kommen beide Hälften auf derselben Höhe an, kannst du darüber gehen – kein Sprung. Enden sie auf verschiedenen Höhen, ist da eine Stufe. Grenzwerte von links und von rechts sind diese beiden Ankunftshöhen.</p>}
          en={<p>Picture a bridge over a gorge, built from both sides. From the left you walk towards the middle, from the right as well. If both halves arrive at the same height, you can walk across – no jump. If they end at different heights, there is a step. The limits from the left and from the right are these two arrival heights.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="stetigkeit" title={<T de="1. Stetigkeit: anschaulich" en="1. Continuity: the picture" />}>
        <Box kind="uebung" src={<Src u={2} p={4} />} title={<T de="Stetigkeit" en={<>Continuity (<span lang="de">Stetigkeit</span>)</>} />}>
          <T
            de={<>
              <p>Zwei Skizzen: links ein Graph <M p=",">{t`f(x)`}</M> in einem Zug gezeichnet; rechts ein Graph <M>{t`g(x)`}</M> mit einem Sprung bei <M>a</M> und einer glatten Stelle <M>b</M> (pinke gepunktete Linien).</p>
              <p>«Eine Funktion ist stetig, wenn man sie mit einem Strich zeichnen kann. (Kein Sprung)» – <M>{t`f(x)`}</M> ist stetig, <M>{t`g(x)`}</M> ist nicht stetig. <M>{t`g(x)`}</M> ist</p>
              <ul>
                <li>stetig in <M p=":">b</M> <M p=",">{t`\lim_{x\to b^-} g(x) = \lim_{x\to b^+} g(x)`}</M></li>
                <li>nicht stetig in <M p=":">a</M> <M p=".">{t`\lim_{x\to a^-} g(x) \neq \lim_{x\to a^+} g(x)`}</M></li>
              </ul>
            </>}
            en={<>
              <p>Two sketches: on the left a graph <M p=",">{t`f(x)`}</M> drawn in one go; on the right a graph <M>{t`g(x)`}</M> with a jump at <M>a</M> and a smooth place <M>b</M> (pink dotted lines).</p>
              <p>“A function is continuous if you can draw it with one stroke. (No jump)” – <M>{t`f(x)`}</M> is continuous, <M>{t`g(x)`}</M> is not. <M>{t`g(x)`}</M> is</p>
              <ul>
                <li>continuous at <M p=":">b</M> <M p=",">{t`\lim_{x\to b^-} g(x) = \lim_{x\to b^+} g(x)`}</M></li>
                <li>not continuous at <M p=":">a</M> <M p=".">{t`\lim_{x\to a^-} g(x) \neq \lim_{x\to a^+} g(x)`}</M></li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Zeichen:</b></p>
            <ul className="keep">
              <li><M>{t`\lim_{x\to a^-} g(x)`}</M> («Grenzwert von links»): <M>x</M> kommt von <em>links</em> an <M>a</M> heran, also nur mit <M p=".">{t`x < a`}</M> Gemeint ist der Wert, dem <M>{t`g(x)`}</M> dabei immer näher kommt.</li>
              <li><M>{t`\lim_{x\to a^+} g(x)`}</M> («von rechts»): genauso mit <M p=".">{t`x > a`}</M></li>
              <li>Der Wert <M>{t`g(a)`}</M> selbst spielt bei beiden keine Rolle – man schaut nur <em>in die Nähe</em> von <M p=".">a</M></li>
            </ul>
            <p>Im Bild unten laufen zwei Punkte im Abstand <M>h</M> von links und von rechts auf die Stelle zu.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the symbols:</b></p>
            <ul className="keep">
              <li><M>{t`\lim_{x\to a^-} g(x)`}</M> (“limit from the left”): <M>x</M> approaches <M>a</M> from the <em>left</em>, i.e. only with <M p=".">{t`x < a`}</M> It means the value that <M>{t`g(x)`}</M> gets closer and closer to.</li>
              <li><M>{t`\lim_{x\to a^+} g(x)`}</M> (“from the right”): the same with <M p=".">{t`x > a`}</M></li>
              <li>The value <M>{t`g(a)`}</M> itself plays no role in either – you only look <em>near</em> <M p=".">a</M></li>
            </ul>
            <p>In the figure below two points at distance <M>h</M> run towards the place from the left and from the right.</p>
          </>}
        />
        <LimitProbe />
        <T
          de={<p>Bei <M>a</M> laufen die Werte auf zwei verschiedene Höhen zu: ein Sprung. Welcher Ast den Wert <M>{t`g(a)`}</M> besitzt (im Bild der rechte, voller Punkt), zeigt die Folie nicht – es ist auch egal: Kein Wert kann zwei verschiedene Höhen verbinden. Bei <M>b</M> kommen beide Seiten gleich an. Für «stetig in <M p="»">b</M> braucht es genau genommen noch etwas mehr: Der gemeinsame Grenzwert muss auch <em>gleich</em> <M>{t`g(b)`}</M> sein (sonst hätte der Graph dort ein Loch oder einen versetzten Punkt). Das kommt genau in <a href="#ana-stetigkeit">Lücken, Sprünge und Zwischenwertsatz</a>.</p>}
          en={<p>At <M>a</M> the values run towards two different heights: a jump. Which branch owns the value <M>{t`g(a)`}</M> (in the figure the right one, filled dot) the slide does not show – and it does not matter: no single value can join two different heights. At <M>b</M> both sides arrive at the same height. Strictly, “continuous at <M p="”">b</M> needs a little more: the common limit must also <em>equal</em> <M>{t`g(b)`}</M> (otherwise the graph would have a hole or a displaced point there). That comes precisely in <a href="#ana-stetigkeit">Gaps, jumps and the intermediate value theorem</a>.</p>}
        />
        <Box kind="misconception" title={<T de="«Stetig heisst: in einem Strich zeichenbar»" en="“Continuous means: drawable in one stroke”" />}>
          <T
            de={<p>Das ist ein gutes erstes Bild für eine Funktion auf einem Intervall. Aber <M>{t`\frac1x`}</M> kann man nicht in einem Strich zeichnen, und trotzdem ist sie an <em>jeder</em> Stelle ihres Definitionsbereichs stetig – bei <M>{t`x = 0`}</M> ist sie gar nicht definiert. Stetigkeit ist eine Eigenschaft an <em>Stellen</em>, geprüft mit den Grenzwerten.</p>}
            en={<p>That is a good first picture for a function on an interval. But <M>{t`\frac1x`}</M> cannot be drawn in one stroke, and still it is continuous at <em>every</em> point of its domain – at <M>{t`x = 0`}</M> it is not defined at all. Continuity is a property at <em>points</em>, checked with limits.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="betrag" title={<T de="2. Links- und Rechtsgrenzwert mit Betragsstrichen" en="2. Left and right limits with absolute values" />}>
        <Box kind="uebung" src={<Src u={2} p={5} />} title={<T de="Links- & Rechts-Grenzwerte und Betragsstriche" en={<>Left and right limits and absolute values (<span lang="de">Links- & Rechts-Grenzwerte und Betragsstriche</span>)</>} />}>
          <MD>{t`\lim_{x\to 1^+} \frac{x-1}{2|x-1|} = \lim_{x\to 1^+} \frac{x-1}{2(x-1)} = \frac12`}</MD>
          <MD>{t`\lim_{x\to 1^-} \frac{x-1}{2|x-1|} = \lim_{x\to 1^-} \frac{x-1}{2(-1)(x-1)} = -\frac12`}</MD>
          <T de={<p>«Diese Funktion ist unstetig (im Punkt <M p=")».">{t`x = 1`}</M></p>} en={<p>“This function is discontinuous (at the point <M p=")”.">{t`x = 1`}</M></p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Rechnung:</b></p>
            <ol className="keep">
              <li>Der Betrag macht eine Zahl positiv: <M>{t`|x-1| = x-1`}</M> für <M p=",">{t`x > 1`}</M> aber <M>{t`|x-1| = -(x-1)`}</M> für <M p=".">{t`x < 1`}</M> Darum muss man die zwei Seiten getrennt rechnen.</li>
              <li>Von rechts: Zähler und Nenner haben denselben Faktor <M p=".">{t`x-1`}</M> Man darf ihn kürzen, weil <M>{t`x \neq 1`}</M> ist (siehe Abschnitt 3). Übrig bleibt <M p=".">{t`\frac12`}</M></li>
              <li>Von links: im Nenner steht ein zusätzliches <M p=".">{t`(-1)`}</M> Übrig bleibt <M p=".">{t`-\frac12`}</M></li>
            </ol>
            <p>Die Funktion ist also einfach <M>{t`-\frac12`}</M> links von <M>1</M> und <M>{t`\frac12`}</M> rechts davon – wähle im Bild oben den letzten Knopf. Genau genommen ist sie bei <M>{t`x = 1`}</M> gar nicht definiert (Nenner <M p=").">0</M> «Unstetig» meint hier: Die einseitigen Grenzwerte sind verschieden, also könnte <em>kein</em> Wert <M>{t`f(1)`}</M> die Lücke schliessen – ein Sprung.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the calculation:</b></p>
            <ol className="keep">
              <li>The absolute value makes a number positive: <M>{t`|x-1| = x-1`}</M> for <M p=",">{t`x > 1`}</M> but <M>{t`|x-1| = -(x-1)`}</M> for <M p=".">{t`x < 1`}</M> That is why the two sides have to be computed separately.</li>
              <li>From the right: numerator and denominator have the same factor <M p=".">{t`x-1`}</M> You may cancel it because <M>{t`x \neq 1`}</M> (see section 3). What remains is <M p=".">{t`\frac12`}</M></li>
              <li>From the left: the denominator has an extra <M p=".">{t`(-1)`}</M> What remains is <M p=".">{t`-\frac12`}</M></li>
            </ol>
            <p>So the function is simply <M>{t`-\frac12`}</M> left of <M>1</M> and <M>{t`\frac12`}</M> right of it – choose the last button in the figure above. Strictly, it is not defined at <M>{t`x = 1`}</M> at all (denominator <M p=").">0</M> “Discontinuous” means here: the one-sided limits differ, so <em>no</em> value <M>{t`f(1)`}</M> could close the gap – a jump.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="methoden" title={<T de="3. Methoden für Grenzwerte" en="3. Methods for limits" />}>
        <T
          de={<p>Die Folie heisst «eine Auswahl von Methoden». Jede beantwortet dieselbe Frage: Wie kommt man an den Wert, dem <M>{t`f(x)`}</M> nahe bei <M>a</M> immer näher kommt – auch wenn man <M>a</M> nicht einsetzen kann?</p>}
          en={<p>The slide calls it “a selection of methods”. Each answers the same question: how do you get the value that <M>{t`f(x)`}</M> approaches near <M>a</M> – even when you cannot put <M>a</M> in?</p>}
        />
        <h3><T de="Wert einsetzen" en="Substituting the value" /></h3>
        <Box kind="uebung" src={<Src u={2} p={5} />} title={<T de="Wert einsetzen" en={<>Substituting the value (<span lang="de">Wert einsetzen</span>)</>} />}>
          <MD>{t`\lim_{x\to 2}\frac{x^2+1}{x} = \frac{4+1}{2} = \frac52`}</MD>
          <T de={<p>Oft resultieren aber undefinierte Ausdrücke <M p=",">{t`\to \frac00,\ \frac{\infty}{\infty},\ 0\cdot\infty`}</M> …</p>} en={<p>But often undefined expressions result <M p=",">{t`\to \frac00,\ \frac{\infty}{\infty},\ 0\cdot\infty`}</M> …</p>} />
        </Box>
        <T
          de={<p><b>Warum darf man einsetzen?</b> Weil <M>{t`\frac{x^2+1}{x}`}</M> bei <M>2</M> keinen Sprung und kein Loch hat: Zähler und Nenner sind stetig, und der Nenner ist dort nicht <M p=".">0</M> Dann ist der Grenzwert einfach der Funktionswert. <b>Warum ist <M>{t`\frac00`}</M> «undefiniert»?</b> Es ist keine Zahl, sondern ein Warnsignal: Je nach Funktion kann alles herauskommen. <M p=",">{t`\frac{x}{x} \to 1`}</M> <M p=",">{t`\frac{x^2}{x} \to 0`}</M> und <M>{t`\frac{2x}{x} \to 2`}</M> – alle drei sind bei <M>{t`x = 0`}</M> «<M p="».">{t`\frac00`}</M></p>}
          en={<p><b>Why may you substitute?</b> Because <M>{t`\frac{x^2+1}{x}`}</M> has no jump and no hole at <M p=":">2</M> numerator and denominator are continuous, and the denominator is not <M>0</M> there. Then the limit is simply the function value. <b>Why is <M>{t`\frac00`}</M> “undefined”?</b> It is not a number but a warning sign: depending on the function, anything can come out. <M p=",">{t`\frac{x}{x} \to 1`}</M> <M p=",">{t`\frac{x^2}{x} \to 0`}</M> and <M>{t`\frac{2x}{x} \to 2`}</M> – all three are “<M p="”">{t`\frac00`}</M> at <M p=".">{t`x = 0`}</M></p>}
        />

        <h3><T de="Faktorisieren und kürzen" en="Factorising and cancelling" /></h3>
        <Box kind="uebung" src={<Src u={2} p={5} />} title={<T de="Brüche Faktorisieren & Kürzen" en={<>Factorising and cancelling fractions (<span lang="de">Brüche Faktorisieren & Kürzen</span>)</>} />}>
          <MD>{t`\lim_{x\to 2}\frac{x^2-4}{x^2+x-6} = \lim_{x\to 2}\frac{\cancel{(x-2)}(x+2)}{(x+3)\cancel{(x-2)}} = \lim_{x\to 2}\frac{x+2}{x+3} = \frac45`}</MD>
          <T de={<p>Im Kasten daneben: <M p=".">{t`(a-b)(a+b) = a^2-b^2`}</M></p>} en={<p>In the box next to it: <M p=".">{t`(a-b)(a+b) = a^2-b^2`}</M></p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Zeile:</b></p>
            <ol className="keep">
              <li>Einsetzen gibt <M p=":">{t`\frac{4-4}{4+2-6} = \frac00`}</M> Also eine andere Methode.</li>
              <li>Zähler: <M>{t`x^2-4 = (x-2)(x+2)`}</M> (der Kasten mit <M p=").">{t`a = x,\ b = 2`}</M> Nenner: <M>{t`x^2+x-6 = (x+3)(x-2)`}</M> – ausmultiplizieren zeigt es.</li>
              <li><M>{t`(x-2)`}</M> kürzen. <b>Warum erlaubt?</b> Kürzen heisst durch <M>{t`x-2`}</M> teilen. Das geht für jedes <M p=".">{t`x \neq 2`}</M> Und der Grenzwert fragt nie nach <M>{t`x = 2`}</M> selbst, nur nach der Nähe.</li>
              <li><M>{t`\frac{x+2}{x+3}`}</M> hat bei <M>2</M> kein Problem mehr: einsetzen, <M p=".">{t`\frac45`}</M></li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the line:</b></p>
            <ol className="keep">
              <li>Substituting gives <M p=":">{t`\frac{4-4}{4+2-6} = \frac00`}</M> so another method is needed.</li>
              <li>Numerator: <M>{t`x^2-4 = (x-2)(x+2)`}</M> (the box with <M p=").">{t`a = x,\ b = 2`}</M> Denominator: <M>{t`x^2+x-6 = (x+3)(x-2)`}</M> – multiplying out shows it.</li>
              <li>Cancel <M p=".">{t`(x-2)`}</M> <b>Why is this allowed?</b> Cancelling means dividing by <M p=".">{t`x-2`}</M> That works for every <M p=".">{t`x \neq 2`}</M> And the limit never asks about <M>{t`x = 2`}</M> itself, only about its neighbourhood.</li>
              <li><M>{t`\frac{x+2}{x+3}`}</M> has no problem at <M>2</M> any more: substitute, <M p=".">{t`\frac45`}</M></li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Was Kürzen im Bild bedeutet" en="What cancelling means in the picture" />}>
          <StepPlayer
            label={tr('Animation: Graph mit Loch bei x = 2, gekürzte Funktion, Grenzwert vier Fünftel', 'Animation: graph with a hole at x = 2, cancelled function, limit four fifths')}
            steps={[
              { ms: 1200, holdMs: 3000, caption: <T
                de={<>Blau der Graph von <M p=".">{t`\frac{x^2-4}{x^2+x-6}`}</M> Bei <M>{t`x = 2`}</M> gibt Einsetzen <M p=":">{t`\frac00`}</M> Dort ist die Funktion nicht definiert – ein Loch.</>}
                en={<>Blue: the graph of <M p=".">{t`\frac{x^2-4}{x^2+x-6}`}</M> At <M>{t`x = 2`}</M> substituting gives <M p=":">{t`\frac00`}</M> the function is not defined there – a hole.</>} /> },
              { ms: 2600, holdMs: 3000, caption: <T
                de={<>Magenta gestrichelt: <M p=".">{t`\frac{x+2}{x+3}`}</M> Für jedes <M>{t`x \neq 2`}</M> ist es dieselbe Zahl – die Kurven liegen aufeinander. Nur das Loch hat die gekürzte Form nicht.</>}
                en={<>Magenta, dashed: <M p=".">{t`\frac{x+2}{x+3}`}</M> For every <M>{t`x \neq 2`}</M> it is the same number – the curves lie on top of each other. Only the hole is missing in the cancelled form.</>} /> },
              { ms: 3000, holdMs: 3000, caption: <T
                de={<>Zwei Punkte laufen von beiden Seiten auf <M>{t`x = 2`}</M> zu; ihre Werte nähern sich <M p=".">{t`\frac45`}</M> Der Grenzwert schaut nie auf <M>{t`x = 2`}</M> selbst – darum durfte man kürzen.</>}
                en={<>Two points run towards <M>{t`x = 2`}</M> from both sides; their values approach <M p=".">{t`\frac45`}</M> The limit never looks at <M>{t`x = 2`}</M> itself – that is why cancelling was allowed.</>} /> },
            ]}
          >
            {(step, tt) => <CancelFig fr={cancelFrame(step, tt)} />}
          </StepPlayer>
        </Derivation>
        <Box kind="misconception" title={<T de={<>«Die Funktion hat bei <M>2</M> den Wert <M p="»">{t`\frac45`}</M></>} en={<>“The function has the value <M>{t`\frac45`}</M> at <M p="”">2</M></>} />}>
          <T
            de={<p>Nein: <M>{t`\frac{x^2-4}{x^2+x-6}`}</M> ist bei <M>2</M> gar nicht definiert. <M>{t`\frac45`}</M> ist der Grenzwert – der Wert, dem sie <em>nahe</em> bei <M>2</M> immer näher kommt. Gleichheit nach dem Kürzen gilt nur für <M p=".">{t`x \neq 2`}</M></p>}
            en={<p>No: <M>{t`\frac{x^2-4}{x^2+x-6}`}</M> is not defined at <M>2</M> at all. <M>{t`\frac45`}</M> is the limit – the value it gets closer and closer to <em>near</em> <M p=".">2</M> The equality after cancelling only holds for <M p=".">{t`x \neq 2`}</M></p>}
          />
        </Box>

        <h3><T de="Durch die grösste Potenz teilen" en="Dividing by the largest power" /></h3>
        <Box kind="uebung" src={<Src u={2} p={5} />} title={<T de="Brüche mit grösster Potenz kürzen" en={<>Cancelling fractions by the largest power (<span lang="de">Brüche mit grösster Potenz kürzen</span>)</>} />}>
          <MD>{t`\lim_{x\to\infty}\frac{x^2+5x}{2x^2} = \lim_{x\to\infty}\frac{1+\frac5x}{2} = \frac12`}</MD>
          <T de={<p>Über <M>{t`\frac5x`}</M> eine pinke <M p=";">0</M> daneben: «Durch die grösste Potenz teilen».</p>} en={<p>Above <M>{t`\frac5x`}</M> a pink <M p=";">0</M> next to it: «<span lang="de">Durch die grösste Potenz teilen</span>» (divide by the largest power).</p>} />
        </Box>
        <T
          de={<p><b>Warum erlaubt?</b> Zähler und Nenner durch dieselbe Zahl <M>{t`x^2 \neq 0`}</M> teilen ändert den Bruch nicht. Danach ist <M>{t`\frac5x`}</M> ein Stück, das für grosse <M>x</M> gegen <M>0</M> geht (<M>5</M> geteilt durch eine riesige Zahl). Übrig bleibt <M p=".">{t`\frac12`}</M> Kurz: Für grosse <M>x</M> zählen nur die höchsten Potenzen, <M p=".">{t`\frac{x^2}{2x^2}`}</M></p>}
          en={<p><b>Why is this allowed?</b> Dividing numerator and denominator by the same number <M>{t`x^2 \neq 0`}</M> does not change the fraction. Afterwards <M>{t`\frac5x`}</M> is a piece that goes to <M>0</M> for large <M>x</M> (<M>5</M> divided by a huge number). What remains is <M p=".">{t`\frac12`}</M> In short: for large <M>x</M> only the highest powers count, <M p=".">{t`\frac{x^2}{2x^2}`}</M></p>}
        />
        <PowerFig />

        <h3><T de="Wurzeln erweitern" en="Expanding with roots" /></h3>
        <Box kind="uebung" src={<Src u={2} p={6} />} title={<T de="Wurzeln erweitern" en={<>Expanding with roots (<span lang="de">Wurzeln erweitern</span>)</>} />}>
          <MD>{t`\lim_{x\to 0}\frac{\sqrt{x+4}-2}{x} = \lim_{x\to 0}\frac{\sqrt{x+4}-2}{x}\cdot\frac{\sqrt{x+4}+2}{\sqrt{x+4}+2} = \lim_{x\to 0}\frac{(x+4)-4}{x(\sqrt{x+4}+2)}`}</MD>
          <MD>{t`= \lim_{x\to 0}\frac{x}{x(\sqrt{x+4}+2)} = \lim_{x\to 0}\frac{1}{\sqrt{x+4}+2} = \frac{1}{\sqrt4+2} = \frac14`}</MD>
          <T de={<p>Pink über der ersten Zeile: <M>a</M> über <M p=",">{t`\sqrt{x+4}`}</M> <M>b</M> über <M p=";">2</M> im Kasten <M p=".">{t`(a-b)(a+b) = a^2-b^2`}</M></p>} en={<p>Pink above the first line: <M>a</M> above <M p=",">{t`\sqrt{x+4}`}</M> <M>b</M> above <M p=";">2</M> in the box <M p=".">{t`(a-b)(a+b) = a^2-b^2`}</M></p>} />
        </Box>
        <T
          de={<ol className="keep">
            <li>Einsetzen gibt <M p=".">{t`\frac{2-2}{0} = \frac00`}</M></li>
            <li>Mit <M>{t`\frac{\sqrt{x+4}+2}{\sqrt{x+4}+2}`}</M> multiplizieren. Das ist <M p=",">1</M> also ändert sich nichts – erlaubt, weil dieser Nenner nie <M>0</M> ist (er ist mindestens <M p=").">2</M></li>
            <li>Oben steht jetzt <M p=":">{t`(a-b)(a+b) = a^2-b^2 = (x+4)-4 = x`}</M> Die Wurzel ist weg.</li>
            <li><M>x</M> kürzen (erlaubt für <M p=",">{t`x \neq 0`}</M> wie oben) und dann <M>{t`x = 0`}</M> einsetzen: <M p=".">{t`\frac{1}{2+2} = \frac14`}</M></li>
          </ol>}
          en={<ol className="keep">
            <li>Substituting gives <M p=".">{t`\frac{2-2}{0} = \frac00`}</M></li>
            <li>Multiply by <M p=".">{t`\frac{\sqrt{x+4}+2}{\sqrt{x+4}+2}`}</M> That is <M p=",">1</M> so nothing changes – allowed because this denominator is never <M>0</M> (it is at least <M p=").">2</M></li>
            <li>The top is now <M p=":">{t`(a-b)(a+b) = a^2-b^2 = (x+4)-4 = x`}</M> the root is gone.</li>
            <li>Cancel <M>x</M> (allowed for <M p=",">{t`x \neq 0`}</M> as above), then substitute <M p=":">{t`x = 0`}</M> <M p=".">{t`\frac{1}{2+2} = \frac14`}</M></li>
          </ol>}
        />

        <h3><T de="Trigonometrische Funktionen" en="Trigonometric functions" /></h3>
        <Box kind="uebung" src={<Src u={2} p={6} />} title={<T de="Trigonometrische Funktionen" en={<>Trigonometric functions (<span lang="de">Trigonometrische Funktionen</span>)</>} />}>
          <MD>{t`\lim_{x\to 0}\frac{\sin(x)}{x} = \lim_{x\to 0}\frac{x}{\sin(x)} = 1 \qquad\qquad \lim_{x\to 0}\frac{\cos(x)-1}{x} = 0`}</MD>
        </Box>
        <T
          de={<p>Einsetzen gibt beide Male <M p=".">{t`\frac00`}</M> Warum kommt bei <M>{t`\frac{\sin x}{x}`}</M> genau <M>1</M> heraus? Für kleine Winkel ist <M>{t`\sin x`}</M> fast gleich <M>x</M> (im Bogenmass). Die Animation zeigt, warum – mit drei Flächen im Einheitskreis.</p>}
          en={<p>Substituting gives <M>{t`\frac00`}</M> both times. Why does <M>{t`\frac{\sin x}{x}`}</M> give exactly <M p="?">1</M> For small angles <M>{t`\sin x`}</M> is almost equal to <M>x</M> (in radians). The animation shows why – with three areas in the unit circle.</p>}
        />
        <Box kind="supplement" title={<T de={<>Warum <M p="">{t`\frac{\sin x}{x} \to 1`}</M> – das Bild im Einheitskreis</>} en={<>Why <M p="">{t`\frac{\sin x}{x} \to 1`}</M> – the picture in the unit circle</>} />}>
          <StepPlayer
            label={tr('Animation: Einheitskreis, drei Flächen, Einschnürung von x durch sin x', 'Animation: unit circle, three areas, squeezing x over sin x')}
            steps={[
              { ms: 1800, holdMs: 2500, caption: <T
                de={<>Einheitskreis (Radius <M p="),">1</M> Winkel <M>x</M> im Bogenmass. <M>x</M> ist die Länge des violetten Bogens von <M>A</M> nach <M p=".">P</M></>}
                en={<>Unit circle (radius <M p="),">1</M> angle <M>x</M> in radians. <M>x</M> is the length of the purple arc from <M>A</M> to <M p=".">P</M></>} /> },
              { ms: 600, holdMs: 3000, caption: <T
                de={<>Blau das Dreieck <M p=":">{t`OAP`}</M> Grundlinie <M p=",">1</M> Höhe <M p=".">{t`\sin x`}</M> Fläche <M p=".">{t`\tfrac12\sin x`}</M></>}
                en={<>Blue: the triangle <M p=";">{t`OAP`}</M> base <M p=",">1</M> height <M p=".">{t`\sin x`}</M> Area <M p=".">{t`\tfrac12\sin x`}</M></>} /> },
              { ms: 600, holdMs: 3500, caption: <T
                de={<>Türkis der Kreissektor; er enthält das Dreieck. Ein ganzer Kreis (Winkel <M p=")">{t`2\pi`}</M> hat Fläche <M p=",">\pi</M> der Sektor also <M p=".">{t`\tfrac12 x`}</M></>}
                en={<>Teal: the circular sector; it contains the triangle. A whole circle (angle <M p=")">{t`2\pi`}</M> has area <M p=",">\pi</M> so the sector has <M p=".">{t`\tfrac12 x`}</M></>} /> },
              { ms: 600, holdMs: 3500, caption: <T
                de={<>Magenta das Dreieck <M>{t`OAT`}</M> mit Höhe <M p=";">{t`\tan x`}</M> es enthält den Sektor. Also <M p=".">{t`\tfrac12\sin x \le \tfrac12 x \le \tfrac12\tan x`}</M></>}
                en={<>Magenta: the triangle <M>{t`OAT`}</M> with height <M p=";">{t`\tan x`}</M> it contains the sector. So <M p=".">{t`\tfrac12\sin x \le \tfrac12 x \le \tfrac12\tan x`}</M></>} /> },
              { ms: 3500, holdMs: 3000, caption: <T
                de={<>Durch <M>{t`\tfrac12\sin x`}</M> teilen: <M p=".">{t`1 \le \frac{x}{\sin x} \le \frac{1}{\cos x}`}</M> Wird <M>x</M> klein, geht <M>{t`\cos x \to 1`}</M> – <M>{t`\frac{x}{\sin x}`}</M> ist eingeklemmt und geht gegen <M p=".">1</M></>}
                en={<>Divide by <M p=":">{t`\tfrac12\sin x`}</M> <M p=".">{t`1 \le \frac{x}{\sin x} \le \frac{1}{\cos x}`}</M> As <M>x</M> gets small, <M>{t`\cos x \to 1`}</M> – <M>{t`\frac{x}{\sin x}`}</M> is squeezed and tends to <M p=".">1</M></>} /> },
            ]}
          >
            {(step, tt) => <SinCircle fr={sinFrame(step, tt)} />}
          </StepPlayer>
          <T
            de={<p>Dann geht auch der Kehrwert <M>{t`\frac{\sin x}{x} \to 1`}</M> – darum stehen auf der Folie beide Formen. Für <M>{t`x < 0`}</M> gilt dasselbe, weil <M>{t`\frac{\sin(-x)}{-x} = \frac{\sin x}{x}`}</M> ist (eine gerade Funktion). Und <M p=":">{t`\frac{\cos x - 1}{x}`}</M> mit <M>{t`\cos x + 1`}</M> erweitern gibt <M p=",">{t`\frac{\cos^2 x - 1}{x(\cos x + 1)} = -\frac{\sin x}{x}\cdot\frac{\sin x}{\cos x + 1}`}</M> und das geht gegen <M p=".">{t`-1\cdot\frac{0}{2} = 0`}</M></p>}
            en={<p>Then the reciprocal also tends to 1, <M p=",">{t`\frac{\sin x}{x} \to 1`}</M> – that is why the slide has both forms. For <M>{t`x < 0`}</M> the same holds because <M>{t`\frac{\sin(-x)}{-x} = \frac{\sin x}{x}`}</M> (an even function). And expanding <M>{t`\frac{\cos x - 1}{x}`}</M> with <M>{t`\cos x + 1`}</M> gives <M p=",">{t`\frac{\cos^2 x - 1}{x(\cos x + 1)} = -\frac{\sin x}{x}\cdot\frac{\sin x}{\cos x + 1}`}</M> which tends to <M p=".">{t`-1\cdot\frac{0}{2} = 0`}</M></p>}
          />
        </Box>
        <Box kind="uebung" src={<Src u={2} p={6} />} title={<T de="Bsp." en={<>Example (<span lang="de">Bsp.</span>)</>} />}>
          <MD>{t`\lim_{x\to 0}\frac{\tan(5x)}{x} = \lim_{x\to 0}\frac{\sin(5x)}{x\cdot\cos(5x)} \qquad \Rightarrow \text{Substitution: } n = 5x,\ x \to 0;\ \ x = \tfrac n5,\ n \to 0`}</MD>
          <MD>{t`= \lim_{n\to 0}\frac{\sin(n)}{\frac n5\cdot\cos(n)} = \lim_{n\to 0}\frac{5\sin(n)}{n\cdot\cos(n)} = \lim_{n\to 0} 5\cdot\underbrace{\frac{\sin(n)}{n}}_{1}\cdot\underbrace{\frac{1}{\cos(n)}}_{1} = 5`}</MD>
        </Box>
        <T
          de={<ol className="keep">
            <li><M p=".">{t`\tan = \frac{\sin}{\cos}`}</M></li>
            <li>Substitution <M p=":">{t`n = 5x`}</M> ein neuer Name für <M p=".">{t`5x`}</M> <b>Warum erlaubt?</b> <M>{t`x \to 0`}</M> heisst genau dasselbe wie <M p=".">{t`n \to 0`}</M> Und <M>{t`x = \frac n5`}</M> ersetzt das <M>x</M> im Nenner.</li>
            <li>Umordnen, bis die bekannte Form <M>{t`\frac{\sin n}{n}`}</M> dasteht. Sie geht gegen <M p=",">1</M> und <M>{t`\frac{1}{\cos n} \to \frac11 = 1`}</M> (einsetzen geht, <M p=").">{t`\cos 0 = 1 \neq 0`}</M> Ergebnis <M p=".">{t`5\cdot1\cdot1 = 5`}</M></li>
          </ol>}
          en={<ol className="keep">
            <li><M p=".">{t`\tan = \frac{\sin}{\cos}`}</M></li>
            <li>Substitution <M p=":">{t`n = 5x`}</M> a new name for <M p=".">{t`5x`}</M> <b>Why is this allowed?</b> <M>{t`x \to 0`}</M> means exactly the same as <M p=".">{t`n \to 0`}</M> And <M>{t`x = \frac n5`}</M> replaces the <M>x</M> in the denominator.</li>
            <li>Rearrange until the known form <M>{t`\frac{\sin n}{n}`}</M> appears. It tends to <M p=",">1</M> and <M>{t`\frac{1}{\cos n} \to \frac11 = 1`}</M> (substituting works, <M p=").">{t`\cos 0 = 1 \neq 0`}</M> Result <M p=".">{t`5\cdot1\cdot1 = 5`}</M></li>
          </ol>}
        />
        <Box kind="uebung" src={<Src u={2} p={6} />} title={<T de="Bsp." en={<>Example (<span lang="de">Bsp.</span>)</>} />}>
          <MD>{t`\lim_{x\to 0}\frac{x^2\cdot\sin(\frac1x)}{\sin(x)} = \lim_{x\to 0}\underbrace{\frac{x}{\sin(x)}}_{1}\cdot\underbrace{x\cdot\sin(\tfrac1x)}_{A} = 1\cdot A = 1\cdot 0 = 0`}</MD>
          <MD>{t`A = \lim_{x\to 0} x\cdot\sin(\tfrac1x) \qquad \text{Substitution: } u = \tfrac1x,\ x\to 0;\ \ x = \tfrac1u,\ u\to\infty \qquad = \lim_{u\to\infty}\frac{\sin(u)}{u} = 0 = A`}</MD>
        </Box>
        <T
          de={<>
            <ol className="keep">
              <li><M>{t`x^2`}</M> in <M>{t`x\cdot x`}</M> aufteilen: ein Faktor bildet mit <M>{t`\sin x`}</M> die bekannte Form <M p=",">{t`\frac{x}{\sin x} \to 1`}</M> der andere bleibt bei <M p=".">{t`\sin(\frac1x)`}</M></li>
              <li>Ein Grenzwert eines Produkts ist das Produkt der Grenzwerte – <b>wenn beide existieren</b>. Darum muss man <M>A</M> noch ausrechnen.</li>
              <li><M p=":">{t`u = \frac1x`}</M> Geht <M>x</M> gegen <M p=",">0</M> wird <M>u</M> riesig. <M>{t`\sin u`}</M> bleibt zwischen <M>-1</M> und <M p=",">1</M> geteilt durch ein riesiges <M>u</M> gibt das fast <M p=".">0</M></li>
            </ol>
            <p>Ein kleines Detail: Kommt <M>x</M> von links (<M p="),">{t`x < 0`}</M> geht <M>{t`u \to -\infty`}</M> und nicht <M p=".">{t`+\infty`}</M> Das Ergebnis ist dasselbe, <M p=".">{t`\frac{\sin u}{u} \to 0`}</M> Ohne Substitution sieht man es im Bild:</p>
          </>}
          en={<>
            <ol className="keep">
              <li>Split <M>{t`x^2`}</M> into <M p=":">{t`x\cdot x`}</M> one factor forms the known <M>{t`\frac{x}{\sin x} \to 1`}</M> with <M p=",">{t`\sin x`}</M> the other stays with <M p=".">{t`\sin(\frac1x)`}</M></li>
              <li>The limit of a product is the product of the limits – <b>if both exist</b>. That is why <M>A</M> still has to be computed.</li>
              <li><M p=":">{t`u = \frac1x`}</M> as <M>x</M> goes to <M p=",">0</M> <M>u</M> becomes huge. <M>{t`\sin u`}</M> stays between <M>-1</M> and <M p=";">1</M> divided by a huge <M>u</M> that gives almost <M p=".">0</M></li>
            </ol>
            <p>A small detail: if <M>x</M> comes from the left (<M p="),">{t`x < 0`}</M> then <M>{t`u \to -\infty`}</M> and not <M p=".">{t`+\infty`}</M> The result is the same, <M p=".">{t`\frac{\sin u}{u} \to 0`}</M> Without substitution you see it in the picture:</p>
          </>}
        />
        <XSinFig />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="lhopital" title={<T de="4. Bernoulli–L'Hôpital" en="4. Bernoulli–L'Hôpital" />}>
        <Box kind="uebung" src={<Src u={2} p={7} />} title={<T de="Bernoulli L'Hôpital" en="Bernoulli L'Hôpital" />}>
          <MD>{t`\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}`}</MD>
          <T de={<p>falls:</p>} en={<p>if:</p>} />
          <MD>{t`\lim_{x\to a} f(x) = 0 \ \text{${tr('und', 'and')}}\ \lim_{x\to a} g(x) = 0 \qquad \text{${tr('oder', 'or')}} \qquad \lim_{x\to a} f(x) = \pm\infty \ \text{${tr('und', 'and')}}\ \lim_{x\to a} g(x) = \pm\infty`}</MD>
        </Box>
        <T
          de={<p className="keep">In Worten: Steht ein «<M p="»">{t`\frac00`}</M> oder «<M p="»,">{t`\frac\infty\infty`}</M> darf man Zähler und Nenner <em>einzeln</em> ableiten und den neuen Bruch untersuchen. <M>{t`f'(a)`}</M> ist die Steigung der Tangente an den Graphen bei <M>a</M> (genau kommt das in <a href="#ana-ableitung">Woche 4</a>). Auf der Folie steht «BH» über dem Gleichheitszeichen, wo die Regel benutzt wird.</p>}
          en={<p className="keep">In words: if you face a “<M p="”">{t`\frac00`}</M> or a “<M p="”,">{t`\frac\infty\infty`}</M> you may differentiate numerator and denominator <em>separately</em> and study the new fraction. <M>{t`f'(a)`}</M> is the slope of the tangent to the graph at <M>a</M> (precisely in <a href="#ana-ableitung">week 4</a>). On the slide “BH” stands above the equals sign where the rule is used.</p>}
        />
        <T
          de={<p><b>Warum stimmt das? Das Bild.</b> Sind <M>f</M> und <M>g</M> beide <M>0</M> bei <M p=",">a</M> sehen ihre Graphen nahe bei <M>a</M> fast wie ihre Tangenten aus: <M>{t`f(x) \approx f'(a)\,(x-a)`}</M> und <M p=".">{t`g(x) \approx g'(a)\,(x-a)`}</M> Im Bruch kürzt sich <M>{t`(x-a)`}</M> weg, und übrig bleibt <M p=":">{t`\frac{f'(a)}{g'(a)}`}</M> das Verhältnis der Steigungen. Zoome hinein:</p>}
          en={<p><b>Why is it true? The picture.</b> If <M>f</M> and <M>g</M> are both <M>0</M> at <M p=",">a</M> then near <M>a</M> their graphs look almost like their tangents: <M>{t`f(x) \approx f'(a)\,(x-a)`}</M> and <M p=".">{t`g(x) \approx g'(a)\,(x-a)`}</M> In the fraction <M>{t`(x-a)`}</M> cancels, and what remains is <M p=":">{t`\frac{f'(a)}{g'(a)}`}</M> the ratio of the slopes. Zoom in:</p>}
        />
        <LhZoom />
        <T
          de={<p>Das Bild erklärt den einfachsten Fall (<M p=",">{t`\frac00`}</M> <M p=").">{t`g'(a) \neq 0`}</M> Der Beweis der ganzen Regel – auch für <M>{t`\frac\infty\infty`}</M> und wenn <M>{t`\frac{f'}{g'}`}</M> selbst wieder <M>{t`\frac00`}</M> ist – braucht den Mittelwertsatz (<a href="#ana-mws">Woche 5</a>).</p>}
          en={<p>The picture explains the simplest case (<M p=",">{t`\frac00`}</M> <M p=").">{t`g'(a) \neq 0`}</M> The proof of the full rule – also for <M>{t`\frac\infty\infty`}</M> and when <M>{t`\frac{f'}{g'}`}</M> is again <M>{t`\frac00`}</M> – needs the mean value theorem (<a href="#ana-mws">week 5</a>).</p>}
        />
        <Box kind="uebung" src={<Src u={2} p={7} />} title={<T de="Bsp." en={<>Examples (<span lang="de">Bsp.</span>)</>} />}>
          <MD>{t`\lim_{x\to 0}\frac{\sin(x)}{x} \overset{\text{BH}}{=} \lim_{x\to 0}\frac{(\sin(x))'}{(x)'} = \lim_{x\to 0}\frac{\cos(x)}{1} = 1`}</MD>
          <MD>{t`\lim_{x\to 0}\frac{\cos(x)-1}{x} \overset{\text{BH}}{=} \lim_{x\to 0}\frac{(\cos(x)-1)'}{(x)'} = \lim_{x\to 0}\frac{-\sin(x)}{1} = 0`}</MD>
          <MD>{t`\lim_{x\to 0}\frac{\tan(5x)}{x} \overset{\text{BH}}{=} \lim_{x\to 0}\frac{(\tan(5x))'}{(x)'} = \lim_{x\to 0}\frac{5\cdot\frac{1}{\cos^2(5x)}}{1} = \lim_{x\to 0}\frac{5}{\cos^2(5x)} = 5`}</MD>
          <T de={<p>Pink über Zähler und Nenner jeweils eine <M>0</M> (bei <M>{t`\cos(x) - 1`}</M> zuerst <M p=",">1</M> dann <M p=").">0</M> Kasten: <M p=".">{t`\tan(x)' = \frac{1}{\cos^2(x)}`}</M></p>}
            en={<p>Pink above numerator and denominator a <M>0</M> each (for <M>{t`\cos(x) - 1`}</M> first <M p=",">1</M> then <M p=").">0</M> Box: <M p=".">{t`\tan(x)' = \frac{1}{\cos^2(x)}`}</M></p>} />
        </Box>
        <T
          de={<p className="keep"><b>So geht man vor:</b> 1. Prüfen, ob wirklich <M>{t`\frac00`}</M> oder <M>{t`\frac\infty\infty`}</M> dasteht – das sind die pinken Nullen. 2. Zähler und Nenner einzeln ableiten. 3. Den neuen Bruch untersuchen, meist durch Einsetzen. Beim dritten Beispiel gibt die Kettenregel den Faktor <M p=":">5</M> <M p=".">{t`(\tan(5x))' = \frac{1}{\cos^2(5x)}\cdot 5`}</M> Es kommt dasselbe heraus wie mit der Substitution oben.</p>}
          en={<p className="keep"><b>How to proceed:</b> 1. Check that you really have <M>{t`\frac00`}</M> or <M>{t`\frac\infty\infty`}</M> – these are the pink zeros. 2. Differentiate numerator and denominator separately. 3. Study the new fraction, usually by substituting. In the third example the chain rule gives the factor <M p=":">5</M> <M p=".">{t`(\tan(5x))' = \frac{1}{\cos^2(5x)}\cdot 5`}</M> The result is the same as with the substitution above.</p>}
        />
        <T
          de={<p className="keep"><b>Was auf der Folie fehlt:</b> Die Regel gilt nur, wenn der neue Grenzwert <M>{t`\lim \frac{f'(x)}{g'(x)}`}</M> existiert (oder <M>{t`\pm\infty`}</M> ist) und <M>{t`g'(x) \neq 0`}</M> nahe bei <M>a</M> ist. Hat <M>{t`\frac{f'}{g'}`}</M> keinen Grenzwert, sagt die Regel <em>nichts</em> – der ursprüngliche Grenzwert kann trotzdem existieren:</p>}
          en={<p className="keep"><b>What the slide leaves out:</b> the rule only holds if the new limit <M>{t`\lim \frac{f'(x)}{g'(x)}`}</M> exists (or is <M p=")">{t`\pm\infty`}</M> and <M>{t`g'(x) \neq 0`}</M> near <M p=".">a</M> If <M>{t`\frac{f'}{g'}`}</M> has no limit, the rule says <em>nothing</em> – the original limit may still exist:</p>}
        />
        <MD>{t`\lim_{x\to\infty}\frac{x+\sin x}{x} = \lim_{x\to\infty}\Big(1 + \frac{\sin x}{x}\Big) = 1, \qquad \text{${tr('aber', 'but')}}\quad \frac{(x+\sin x)'}{(x)'} = 1+\cos x`}</MD>
        <CexFig />
        <Box kind="misconception" title={<T de="L'Hôpital ohne «0/0»" en="L'Hôpital without “0/0”" />}>
          <T
            de={<p><M>{t`\lim_{x\to 0}\frac{x+1}{x+2} = \frac12`}</M> (einsetzen). Wer trotzdem ableitet, bekommt <M>{t`\frac11 = 1`}</M> – falsch. Immer zuerst prüfen, ob <M>{t`\frac00`}</M> oder <M>{t`\frac\infty\infty`}</M> dasteht.</p>}
            en={<p><M>{t`\lim_{x\to 0}\frac{x+1}{x+2} = \frac12`}</M> (substitute). Anyone who differentiates anyway gets <M>{t`\frac11 = 1`}</M> – wrong. Always check first that you have <M>{t`\frac00`}</M> or <M p=".">{t`\frac\infty\infty`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="Quotientenregel statt einzeln ableiten" en="Quotient rule instead of differentiating separately" />}>
          <T
            de={<p>L'Hôpital leitet Zähler und Nenner <em>getrennt</em> ab: <M p=".">{t`\frac{f'}{g'}`}</M> Das ist nicht die Ableitung des Bruchs <M p=".">{t`\big(\frac fg\big)'`}</M></p>}
            en={<p>L'Hôpital differentiates numerator and denominator <em>separately</em>: <M p=".">{t`\frac{f'}{g'}`}</M> That is not the derivative of the fraction, <M p=".">{t`\big(\frac fg\big)'`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<><M>{t`\frac{\sin x}{x}`}</M> mit L'Hôpital beweisen?</>} en={<>Proving <M>{t`\frac{\sin x}{x}`}</M> with L'Hôpital?</>} />}>
          <T
            de={<p>Als Kontrolle ist das erste Beispiel gut. Als Beweis dreht es sich im Kreis: Um <M>{t`(\sin x)' = \cos x`}</M> zu zeigen, braucht man gerade <M p=".">{t`\frac{\sin x}{x} \to 1`}</M> Der Beweis ist das Bild im Einheitskreis.</p>}
            en={<p>As a check, the first example is fine. As a proof it goes in a circle: to show <M>{t`(\sin x)' = \cos x`}</M> you need exactly <M p=".">{t`\frac{\sin x}{x} \to 1`}</M> The proof is the picture in the unit circle.</p>}
          />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Grenzwert: der Wert, dem <M>{t`f(x)`}</M> nahe bei <M>a</M> immer näher kommt; <M>{t`f(a)`}</M> selbst zählt nicht.</li>
              <li>Links- und Rechtsgrenzwert verschieden → Sprung, nicht stetig.</li>
              <li>Zuerst einsetzen. Bei <M p=":">{t`\frac00`}</M> faktorisieren und kürzen (erlaubt, weil <M p="),">{t`x \neq a`}</M> durch die grösste Potenz teilen, mit der Wurzel erweitern, auf <M>{t`\frac{\sin x}{x} \to 1`}</M> zurückführen.</li>
              <li>L'Hôpital nur bei <M>{t`\frac00`}</M> oder <M p=",">{t`\frac\infty\infty`}</M> und nur, wenn <M>{t`\lim\frac{f'}{g'}`}</M> existiert.</li>
            </ul>}
            en={<ul>
              <li>Limit: the value that <M>{t`f(x)`}</M> gets closer and closer to near <M p=";">a</M> <M>{t`f(a)`}</M> itself does not count.</li>
              <li>Left and right limits differ → jump, not continuous.</li>
              <li>Substitute first. For <M p=":">{t`\frac00`}</M> factorise and cancel (allowed because <M p="),">{t`x \neq a`}</M> divide by the largest power, expand with the root, reduce to <M p=".">{t`\frac{\sin x}{x} \to 1`}</M></li>
              <li>L'Hôpital only for <M>{t`\frac00`}</M> or <M p=",">{t`\frac\infty\infty`}</M> and only if <M>{t`\lim\frac{f'}{g'}`}</M> exists.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
