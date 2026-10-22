import { useState } from 'react';
import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer, type AnimStep } from '../viz/anim/StepPlayer';
import { DenominatorCheck, DivisionTable, GapFigure } from '../viz/ana/W3Figures';

const t = String.raw;

type DId = 'd1' | 'd2';
const DIV: Record<DId, { num: number[]; den: number[] }> = { d1: { num: [1, 0, 0], den: [1, 1] }, d2: { num: [1, 0, -3, 5], den: [1, -1] } };

function divSteps(id: DId): AnimStep[] {
  if (id === 'd1') return [
    { ms: 800, holdMs: 2200, caption: <T de={<>Aufstellen: <M p=".">{t`x^2 : (x+1)`}</M> Man teilt immer nur die höchsten Potenzen.</>} en={<>Set up: <M p=".">{t`x^2 : (x+1)`}</M> One always divides only the highest powers.</>} /> },
    { ms: 3000, holdMs: 3000, caption: <T de={<><M p=".">{t`x^2 : x = x`}</M> Zurückmultiplizieren: <M p=".">{t`x(x+1) = x^2 + x`}</M> Abziehen: bleibt <M p=".">{t`-x`}</M></>} en={<><M p=".">{t`x^2 : x = x`}</M> Multiply back: <M p=".">{t`x(x+1) = x^2 + x`}</M> Subtract: <M>{t`-x`}</M> remains.</>} /> },
    { ms: 3000, holdMs: 3000, caption: <T de={<><M p=".">{t`-x : x = -1`}</M> <M p=".">{t`-1\cdot(x+1) = -x - 1`}</M> Abziehen: bleibt <M p=".">1</M></>} en={<><M p=".">{t`-x : x = -1`}</M> <M p=".">{t`-1\cdot(x+1) = -x - 1`}</M> Subtract: <M>1</M> remains.</>} /> },
    { ms: 1500, caption: <T de={<>Rest <M p=":">1</M> kleinerer Grad als <M p=",">{t`x+1`}</M> also fertig. Der Restbruch <M>{t`\frac{1}{x+1}`}</M> geht gegen <M p=",">0</M> darum <M p=".">{t`g(x) = x - 1`}</M></>} en={<>Remainder <M p=":">1</M> lower degree than <M p=",">{t`x+1`}</M> so we are done. The remainder fraction <M>{t`\frac{1}{x+1}`}</M> tends to <M p=",">0</M> hence <M p=".">{t`g(x) = x - 1`}</M></>} /> },
  ];
  return [
    { ms: 800, holdMs: 2200, caption: <T de={<>Aufstellen: <M p=".">{t`(x^3 - 3x + 5) : (x-1)`}</M> Es gibt kein <M p=":">{t`x^2`}</M> seine Spalte bleibt leer.</>} en={<>Set up: <M p=".">{t`(x^3 - 3x + 5) : (x-1)`}</M> There is no <M p=":">{t`x^2`}</M> its column stays empty.</>} /> },
    { ms: 3000, holdMs: 3000, caption: <T de={<><M p=".">{t`x^3 : x = x^2`}</M> Mal <M p=":">{t`(x-1)`}</M> <M p=".">{t`x^3 - x^2`}</M> Abziehen und <M>{t`-3x`}</M> herunterholen: <M p=".">{t`x^2 - 3x`}</M></>} en={<><M p=".">{t`x^3 : x = x^2`}</M> Times <M p=":">{t`(x-1)`}</M> <M p=".">{t`x^3 - x^2`}</M> Subtract and bring down <M p=":">{t`-3x`}</M> <M p=".">{t`x^2 - 3x`}</M></>} /> },
    { ms: 3000, holdMs: 3000, caption: <T de={<><M p=".">{t`x^2 : x = x`}</M> Mal <M p=":">{t`(x-1)`}</M> <M p=".">{t`x^2 - x`}</M> Abziehen und <M>{t`+5`}</M> herunterholen: <M p=".">{t`-2x + 5`}</M></>} en={<><M p=".">{t`x^2 : x = x`}</M> Times <M p=":">{t`(x-1)`}</M> <M p=".">{t`x^2 - x`}</M> Subtract and bring down <M p=":">{t`+5`}</M> <M p=".">{t`-2x + 5`}</M></>} /> },
    { ms: 3000, holdMs: 3000, caption: <T de={<><M p=".">{t`-2x : x = -2`}</M> Mal <M p=":">{t`(x-1)`}</M> <M p=".">{t`-2x + 2`}</M> Abziehen: bleibt <M p=".">3</M></>} en={<><M p=".">{t`-2x : x = -2`}</M> Times <M p=":">{t`(x-1)`}</M> <M p=".">{t`-2x + 2`}</M> Subtract: <M>3</M> remains.</>} /> },
    { ms: 1500, caption: <T de={<>Rest <M p=":">3</M> Restbruch <M>{t`\frac{3}{x-1} \to 0`}</M> (Tipp: <M>{t`f - g \to 0`}</M> prüfen). Die Asymptote ist die Parabel <M p=".">{t`g(x) = x^2 + x - 2`}</M></>} en={<>Remainder <M p=":">3</M> remainder fraction <M>{t`\frac{3}{x-1} \to 0`}</M> (hint: check <M p=")">{t`f - g \to 0`}</M> The asymptote is the parabola <M p=".">{t`g(x) = x^2 + x - 2`}</M></>} /> },
  ];
}

function DivisionPlayer() {
  const tr = useTr();
  const [id, setId] = useState<DId>('d1');
  return (
    <div className="w3-mirror">
      <div className="v-presets">
        <button type="button" aria-pressed={id === 'd1'} onClick={() => setId('d1')}>{tr('Bsp. 1', 'Ex. 1')}</button>
        <button type="button" aria-pressed={id === 'd2'} onClick={() => setId('d2')}>{tr('Bsp. 2', 'Ex. 2')}</button>
      </div>
      <StepPlayer key={id} steps={divSteps(id)} label={tr('Animation: Polynomdivision Schritt für Schritt', 'Animation: polynomial long division step by step')}>
        {(s, tt) => <DivisionTable num={DIV[id].num} den={DIV[id].den} step={s} t={tt} />}
      </StepPlayer>
    </div>
  );
}

export default function A3Asymptoten() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Weit draussen sieht ein komplizierter Graph oft aus wie etwas Einfaches: eine Gerade, eine Parabel. Dieses Einfache heisst <b>Asymptote</b>. (Vorher: <a href="#ana-umkehr">Injektiv, surjektiv, Umkehrfunktion</a>.)</p>}
        en={<p className="lede">Far out, a complicated graph often looks like something simple: a line, a parabola. This simple thing is called an <b>asymptote</b>. (Before: <a href="#ana-umkehr">Injective, surjective, inverse function</a>.)</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="definition" title={<T de="1. Was ist eine Asymptote?" en="1. What is an asymptote?" />}>
        <Box kind="uebung" src={<Src u={3} p={9} />} title={<T de="Asymptoten" en={<>Asymptotes (<span lang="de">Asymptoten</span>)</>} />}>
          <T de={<p>Die Asymptote <M>{t`g(x)`}</M> zur Funktion <M>{t`f(x)`}</M> erfüllt folgende Bedingung:</p>} en={<p>The asymptote <M>{t`g(x)`}</M> of the function <M>{t`f(x)`}</M> satisfies the following condition:</p>} />
          <MD>{t`\lim_{x\to\infty} \bigl(f(x) - g(x)\bigr) = 0`}</MD>
        </Box>
        <T
          de={<p>In Worten: Der <b>Abstand</b> <M>{t`f(x) - g(x)`}</M> wird so klein, wie man will – wie zwei Eisenbahnschienen, die man von weit oben anschaut. Die Folie schreibt nur <M p=";">{t`x\to\infty`}</M> dasselbe gilt für <M>{t`x\to-\infty`}</M> (das braucht Bsp. 2 unten). Unten im Bild ist der Abstand selbst als Graph gezeichnet: Er läuft auf beiden Seiten gegen <M p=".">0</M></p>}
          en={<p>In words: the <b>gap</b> <M>{t`f(x) - g(x)`}</M> becomes as small as you like – like two railway tracks seen from high above. The slide writes only <M p=";">{t`x\to\infty`}</M> the same holds for <M>{t`x\to-\infty`}</M> (Ex. 2 below needs that). At the bottom of the picture the gap itself is drawn as a graph: it runs to <M>0</M> on both sides.</p>}
        />
        <GapFigure />
        <T
          de={<p>Tipp zur Serie 3 (<Src u={3} p={12} />): «Asymptote gefunden? Den Abstand prüfen: <M p="».">{t`f(x) - g(x) \longrightarrow 0`}</M></p>}
          en={<p>Hint for problem set 3 (<Src u={3} p={12} />): “Found an asymptote? Check the gap: <M p="”.">{t`f(x) - g(x) \longrightarrow 0`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="waagerecht" title={<T de="2. Waagerechte Asymptote" en="2. Horizontal asymptote" />}>
        <Box kind="uebung" src={<Src u={3} p={9} />} title={<T de="Waagerechte Asymptote" en={<>Horizontal asymptote (<span lang="de">waagerechte Asymptote</span>)</>} />}>
          <T de={<p>Geht <M>{t`f(x)`}</M> gegen die Zahl <M p=",">b</M> ist <M>{t`g(x) = b`}</M> die Asymptote.</p>} en={<p>If <M>{t`f(x)`}</M> tends to the number <M p=",">b</M> then <M>{t`g(x) = b`}</M> is the asymptote.</p>} />
          <MD>{t`\text{Bsp. 1:}\quad f(x) = \frac{2x}{x+1} = 2 - \frac{2}{x+1} \ \Rightarrow\ g(x) = 2`}</MD>
          <T de={<p>Der Bruch rechts geht gegen <M p=".">0</M></p>} en={<p>The fraction on the right tends to <M p=".">0</M></p>} />
          <MD>{t`\text{Bsp. 2:}\quad \frac{4x^2+3}{2x^2-1} = \frac{4 + 3/x^2}{2 - 1/x^2} \longrightarrow \frac42 = 2`}</MD>
          <T
            de={<p>Für grosse <M>{t`|x|`}</M> (also <M p=").">{t`x \neq 0`}</M> Durch die grösste Potenz teilen: hier <M p=".">{t`x^2`}</M> Für <M>{t`+\infty`}</M> und <M>{t`-\infty`}</M> kommt wieder <M>{t`g = 2`}</M> heraus.</p>}
            en={<p>For large <M>{t`|x|`}</M> (so <M p=").">{t`x \neq 0`}</M> Divide by the highest power: here <M p=".">{t`x^2`}</M> For <M>{t`+\infty`}</M> and <M>{t`-\infty`}</M> again <M>{t`g = 2`}</M> comes out.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>Warum gelten die Umformungen?</b></p>
            <ol>
              <li>Bsp. 1: <M p=",">{t`2x = 2(x+1) - 2`}</M> also <M p=".">{t`\frac{2x}{x+1} = \frac{2(x+1)}{x+1} - \frac{2}{x+1} = 2 - \frac{2}{x+1}`}</M> Für grosse <M>{t`|x|`}</M> wird der Nenner riesig, der Bruch winzig.</li>
              <li>Bsp. 2: Zähler und Nenner durch <M>{t`x^2`}</M> teilen ändert den Bruch nicht (wie <M p=")">{t`\frac{6}{4} = \frac{3}{2}`}</M> – erlaubt, solange <M p=".">{t`x \neq 0`}</M> Dann gehen <M>{t`3/x^2`}</M> und <M>{t`1/x^2`}</M> gegen <M p=".">0</M></li>
            </ol>
            <p>Im Bild: Preset «waagerecht» zeigt Bsp. 1 mit dem Abstand <M p=".">{t`-\frac{2}{x+1}`}</M></p>
          </>}
          en={<>
            <p><b>Why do the rewritings hold?</b></p>
            <ol>
              <li>Ex. 1: <M p=",">{t`2x = 2(x+1) - 2`}</M> so <M p=".">{t`\frac{2x}{x+1} = \frac{2(x+1)}{x+1} - \frac{2}{x+1} = 2 - \frac{2}{x+1}`}</M> For large <M>{t`|x|`}</M> the denominator becomes huge, the fraction tiny.</li>
              <li>Ex. 2: dividing numerator and denominator by <M>{t`x^2`}</M> does not change the fraction (like <M p=")">{t`\frac{6}{4} = \frac{3}{2}`}</M> – allowed as long as <M p=".">{t`x \neq 0`}</M> Then <M>{t`3/x^2`}</M> and <M>{t`1/x^2`}</M> tend to <M p=".">0</M></li>
            </ol>
            <p>In the picture: the preset “horizontal” shows Ex. 1 with the gap <M p=".">{t`-\frac{2}{x+1}`}</M></p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="senkrecht" title={<T de="3. Senkrechte Asymptote" en="3. Vertical asymptote" />}>
        <Box kind="uebung" src={<Src u={3} p={10} />} title={<T de="Senkrechte Asymptote" en={<>Vertical asymptote (<span lang="de">senkrechte Asymptote</span>)</>} />}>
          <T
            de={<p>Wenn <M>{t`f(x)`}</M> bei <M>{t`x = a`}</M> nach <M>{t`+\infty`}</M> oder <M>{t`-\infty`}</M> läuft, ist <M>{t`x = a`}</M> eine senkrechte Asymptote. Eine Seite genügt.</p>}
            en={<p>If <M>{t`f(x)`}</M> runs to <M>{t`+\infty`}</M> or <M>{t`-\infty`}</M> at <M p=",">{t`x = a`}</M> then <M>{t`x = a`}</M> is a vertical asymptote. One side is enough.</p>}
          />
          <MD>{t`\text{Bsp. 1:}\quad f(x) = \frac{1}{x-2},\quad x\to2^-\colon f\to-\infty,\quad x\to2^+\colon f\to+\infty`}</MD>
          <MD>{t`\text{Bsp. 2:}\quad g(x) = \frac{2x+1}{x-1} = 2 + \frac{3}{x-1},\quad x\to1^\mp\colon g\to\mp\infty`}</MD>
          <T
            de={<p><b>WICHTIG:</b> Nenner <M p="">= 0</M> reicht nicht! Erst Kürzen prüfen. Sonst kann es auch nur ein Loch sein (wie auf Seite 2).</p>}
            en={<p><b>IMPORTANT:</b> denominator <M p="">= 0</M> is not enough! Check cancelling first. Otherwise it may just be a hole (as on page 2).</p>}
          />
        </Box>
        <T
          de={<p>Beide Brüche unten haben den Nenner <M p=",">{t`x - 1`}</M> beide sind bei <M>1</M> nicht definiert. Links lässt sich <M>{t`x-1`}</M> wegkürzen: Es bleibt die Gerade <M>{t`x+1`}</M> mit einem Loch (<a href="#ana-stetigkeit">hebbare Lücke</a>). Rechts bleibt der Nenner stehen: Der Bruch wird bei <M>1</M> beliebig gross – ein Pol.</p>}
          en={<p>Both fractions below have the denominator <M p=",">{t`x - 1`}</M> both are undefined at <M p=".">1</M> On the left, <M>{t`x-1`}</M> cancels: what remains is the line <M>{t`x+1`}</M> with a hole (<a href="#ana-stetigkeit">removable gap</a>). On the right the denominator stays: the fraction becomes arbitrarily large near <M>1</M> – a pole.</p>}
        />
        <DenominatorCheck />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="schief" title={<T de="4. Schiefe Asymptote: Polynomdivision" en="4. Oblique asymptote: polynomial division" />}>
        <Box kind="uebung" src={<Src u={3} p={11} />} title={<T de="Schiefe Asymptote" en={<>Oblique asymptote (<span lang="de">schiefe Asymptote</span>)</>} />}>
          <T
            de={<p>Bei Brüchen hilft Polynomdivision. Der Restbruch soll gegen <M>0</M> gehen. <M>{t`\text{Zählergrad} = \text{Nennergrad} + 1 \to`}</M> schiefe Gerade.</p>}
            en={<p>For fractions, polynomial division helps. The remainder fraction should tend to <M p=".">0</M> <M>{t`\text{degree of numerator} = \text{degree of denominator} + 1 \to`}</M> oblique line.</p>}
          />
          <MD>{t`\text{Bsp. 1:}\quad f(x) = \frac{x^2}{x+1} = x - 1 + \frac{1}{x+1}, \qquad g(x) = x - 1`}</MD>
          <MD>{t`\text{Bsp. 2:}\quad f(x) = \frac{x^3-3x+5}{x-1} = x^2 + x - 2 + \frac{3}{x-1}, \qquad g(x) = x^2 + x - 2`}</MD>
          <T de={<p>Bsp. 2: Auch eine Parabel geht. Rest <M>{t`= 3 \to`}</M> Restbruch geht gegen <M p=".">0</M></p>} en={<p>Ex. 2: a parabola works too. Remainder <M>{t`= 3 \to`}</M> the remainder fraction tends to <M p=".">0</M></p>} />
        </Box>
        <T
          de={<p><De en="polynomial long division">Polynomdivision</De> geht wie schriftliches Dividieren in der Schule: höchste Potenz teilen, zurückmultiplizieren, abziehen, wiederholen – bis der Rest einen kleineren Grad hat als der Nenner.</p>}
          en={<p><De en="polynomial long division">Polynomdivision</De> works like long division at school: divide the highest powers, multiply back, subtract, repeat – until the remainder has a lower degree than the denominator.</p>}
        />
        <DivisionPlayer />
        <T
          de={<p><b>Warum geht der Restbruch gegen <M p="?">0</M></b> Der Rest hat kleineren Grad als der Nenner. Bei <M>{t`\frac{1}{x+1}`}</M> steht oben eine Zahl, unten wächst <M p=".">x</M> Darum ist <M>{t`f - g`}</M> genau der Restbruch, und er verschwindet für <M p=".">{t`x\to\pm\infty`}</M> Im <a href="#definition">Bild oben</a> (Presets «schief» und «Parabel») siehst du den Abstand schrumpfen.</p>}
          en={<p><b>Why does the remainder fraction tend to <M p="?">0</M></b> The remainder has a lower degree than the denominator. In <M>{t`\frac{1}{x+1}`}</M> there is a number on top while <M>x</M> grows below. So <M>{t`f - g`}</M> is exactly the remainder fraction, and it vanishes for <M p=".">{t`x\to\pm\infty`}</M> In the <a href="#definition">picture above</a> (presets “oblique” and “parabola”) you see the gap shrink.</p>}
        />
        <Box kind="misconception" title={<T de="«Nenner null heisst immer Asymptote»" en="“Denominator zero always means an asymptote”" />}>
          <T
            de={<p>Erst kürzen. <M>{t`\frac{x^2-1}{x-1}`}</M> hat bei <M>1</M> nur ein Loch, weil sich <M>{t`x - 1`}</M> wegkürzt. Ein Pol bleibt nur, wenn nach dem Kürzen der Nenner dort immer noch null ist.</p>}
            en={<p>Cancel first. <M>{t`\frac{x^2-1}{x-1}`}</M> has only a hole at <M p=",">1</M> because <M>{t`x - 1`}</M> cancels. A pole remains only if the denominator is still zero there after cancelling.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Der Graph berührt seine Asymptote nie»" en="“The graph never touches its asymptote”" />}>
          <T
            de={<p>Die Definition verlangt nur <M>{t`f - g \to 0`}</M> weit draussen. Dazwischen darf <M>f</M> die Asymptote schneiden: <M>{t`\frac{x}{x^2+1}`}</M> hat die Asymptote <M>{t`y = 0`}</M> und ist bei <M>{t`x = 0`}</M> genau <M p=".">0</M></p>}
            en={<p>The definition only asks for <M>{t`f - g \to 0`}</M> far out. In between, <M>f</M> may cross the asymptote: <M>{t`\frac{x}{x^2+1}`}</M> has the asymptote <M>{t`y = 0`}</M> and equals <M>0</M> at <M p=".">{t`x = 0`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Asymptoten gibt es nur nach rechts»" en="“Asymptotes only exist to the right”" />}>
          <T
            de={<p>Die Bedingung gilt genauso für <M p=".">{t`x \to -\infty`}</M> Bei den Brüchen hier ist die Asymptote auf beiden Seiten dieselbe – im Bild mit «nach links» prüfen.</p>}
            en={<p>The condition works just the same for <M p=".">{t`x \to -\infty`}</M> For the fractions here the asymptote is the same on both sides – check it in the picture with “to the left”.</p>}
          />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Asymptote: <M>{t`f(x) - g(x) \to 0`}</M> für <M>{t`x\to\infty`}</M> (oder <M p=").">{t`-\infty`}</M></li>
              <li>Waagerecht: <M>{t`f \to b`}</M> (durch die grösste Potenz teilen). Senkrecht: <M>f</M> läuft bei <M>a</M> weg – erst kürzen!</li>
              <li>Schief: Polynomdivision, der ganze Teil ist <M p=",">g</M> der Restbruch geht gegen <M p=".">0</M></li>
            </ul>}
            en={<ul>
              <li>Asymptote: <M>{t`f(x) - g(x) \to 0`}</M> for <M>{t`x\to\infty`}</M> (or <M p=").">{t`-\infty`}</M></li>
              <li>Horizontal: <M>{t`f \to b`}</M> (divide by the highest power). Vertical: <M>f</M> runs away at <M>a</M> – cancel first!</li>
              <li>Oblique: polynomial division, the whole part is <M p=",">g</M> the remainder fraction tends to <M p=".">0</M></li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
