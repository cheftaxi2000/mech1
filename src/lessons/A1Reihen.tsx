import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useLang, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { GeoExplorer, SceneFig } from '../viz/ana/Week1Figures';
import { gaussScene, halfScene, harmScene, num } from '../viz/ana/week1Scenes';
import { eFull, eSlide, harmExceed } from '../analysis/reihen';

const t = String.raw;

export default function A1Reihen() {
  const tr = useTr(), lang = useLang();
  const e5 = num(eSlide(5), 4, lang), eLim = num(Math.E - 1, 5, lang), eF = num(eFull(20), 5, lang);
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine <b>Reihe</b> ist eine Folge von Summen: <M p=",">{t`S_n = a_1 + a_2 + \dots + a_n`}</M> die <b>Teilsummen</b>. Die Frage ist, ob <M>{t`S_n`}</M> konvergiert – mit dem Grenzwert-Begriff aus <a href="#ana-folgen">Folgen: beschränkt, monoton, konvergent</a>. Die arithmetische Reihe ist Schulstoff und kurz; Kern sind die geometrische und die harmonische Reihe.</p>}
        en={<p className="lede">A <b>series</b> (<span lang="de">Reihe</span>) is a sequence of sums: <M p=",">{t`S_n = a_1 + a_2 + \dots + a_n`}</M> the <b>partial sums</b>. The question is whether <M>{t`S_n`}</M> converges – with the notion of limit from <a href="#ana-folgen">Sequences: bounded, monotonic, convergent</a>. The arithmetic series is school material and short; the core are the geometric and the harmonic series.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="arithmetisch" title={<T de="1. Arithmetische Folge und Reihe" en="1. Arithmetic sequence and series" />}>
        <Box kind="uebung" src={<Src u={1} p={11} />} title={<T de="Muss man gesehen haben: arithmetische Folge + Reihe" en="Must have seen: arithmetic sequence + series" />}>
          <MD>{t`\text{${tr('Explizit', 'Explicit')}: } a_n = a_1 + d(n-1) \qquad \text{${tr('Rekursiv', 'Recursive')}: } a_n = a_{n-1} + d`}</MD>
          <MD>{t`S_n = \sum_{k=1}^n a_k = \frac12\cdot n\,[a_1 + a_n] \quad \text{${tr('oder', 'or')}} \quad S_n = \frac12\cdot n\,[2a_1 + d(n-1)]`}</MD>
          <MD>{t`\text{${tr('Bsp.', 'Example')}: } 4 + 8 + 12 + 16 + 20 + 24 = \,?\qquad a_n = 4 + (n-1)\cdot 4`}</MD>
          <MD>{t`\sum_{n=1}^6 a_n = \frac62\,[4 + 24] = 3\cdot 28 = 84`}</MD>
        </Box>
        <T
          de={<p>Arithmetisch heisst: Von Glied zu Glied kommt immer dieselbe Zahl <M>d</M> dazu (hier <M p=").">{t`d = 4`}</M> <b>Explizit</b> rechnet <M>{t`a_n`}</M> direkt aus <M>n</M> aus. <b>Rekursiv</b> sagt nur, wie man vom vorigen Glied zum nächsten kommt. Darum betont die Übung 2: «Für die rekursive Darstellung braucht es einen Ankerpunkt/Startwert!» <Src u={2} p={1} /> Ohne <M>{t`a_1 = 4`}</M> beschreibt <M>{t`a_n = a_{n-1} + 4`}</M> auch <M>{t`1, 5, 9, \dots`}</M></p>}
          en={<p>Arithmetic means: from term to term the same number <M>d</M> is added (here <M p=").">{t`d = 4`}</M> The <b>explicit</b> form computes <M>{t`a_n`}</M> directly from <M p=".">n</M> The <b>recursive</b> form only says how to get from one term to the next. That is why exercise class 2 stresses: “<span lang="de">Für die rekursive Darstellung braucht es einen Ankerpunkt/Startwert!</span>” (the recursive form needs an anchor/starting value) <Src u={2} p={1} /> Without <M>{t`a_1 = 4`}</M> the rule <M>{t`a_n = a_{n-1} + 4`}</M> also describes <M p=".">{t`1, 5, 9, \dots`}</M></p>}
        />
        <Derivation title={<T de="Warum die Summenformel stimmt (Gauss)" en="Why the sum formula holds (Gauss)" />}>
          <StepPlayer
            label={tr('Animation: Säulen 4 bis 24 und dieselben Säulen umgedreht ergeben ein Rechteck', 'Animation: columns 4 to 24 and the same columns upside down make a rectangle')}
            steps={[
              { ms: 1600, holdMs: 2500, caption: <T
                de={<>Die sechs Glieder <M>{t`4, 8, \dots, 24`}</M> als Säulen. Ihre Gesamthöhe ist <M p=".">{t`S_6`}</M></>}
                en={<>The six terms <M>{t`4, 8, \dots, 24`}</M> as columns. Their total height is <M p=".">{t`S_6`}</M></>} /> },
              { ms: 2200, holdMs: 3500, caption: <T
                de={<>Dieselben Säulen nochmals, umgedreht obendrauf (magenta). Jede Spalte ist jetzt <M>{t`a_1 + a_n = 4 + 24 = 28`}</M> hoch.</>}
                en={<>The same columns again, upside down on top (magenta). Every column is now <M>{t`a_1 + a_n = 4 + 24 = 28`}</M> high.</>} /> },
              { ms: 1200, caption: <T
                de={<>Sechs Spalten zu je <M>28</M> sind <M>168</M> – zweimal die Summe. Also <M p=".">{t`S_6 = \frac12\cdot 6\cdot 28 = 84`}</M></>}
                en={<>Six columns of <M>28</M> each make <M>168</M> – twice the sum. So <M p=".">{t`S_6 = \frac12\cdot 6\cdot 28 = 84`}</M></>} /> },
            ]}
          >
            {(step, tt) => <SceneFig build={gaussScene} step={step} t={tt} label={tr('Säulen', 'columns')} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Allgemein: <M>n</M> Spalten der Höhe <M>{t`a_1 + a_n`}</M> ergeben <M p=".">{t`2S_n = n\,[a_1 + a_n]`}</M> Setzt man <M>{t`a_n = a_1 + d(n-1)`}</M> ein, kommt die zweite Form. Der Spezialfall <M>{t`a_1 = d = 1`}</M> steht auf dem Blatt eigens <Src u={1} p={12} />:</p>}
          en={<p>In general: <M>n</M> columns of height <M>{t`a_1 + a_n`}</M> give <M p=".">{t`2S_n = n\,[a_1 + a_n]`}</M> Inserting <M>{t`a_n = a_1 + d(n-1)`}</M> gives the second form. The special case <M>{t`a_1 = d = 1`}</M> is on the slide separately <Src u={1} p={12} />:</p>}
        />
        <MD>{t`1 + 2 + 3 + \dots + n = \frac{n(n+1)}{2}`}</MD>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="geometrisch" title={<T de="2. Geometrische Folge und Reihe" en="2. Geometric sequence and series" />}>
        <Box kind="uebung" src={<Src u={1} p={12} />} title={<T de="geometrische Folge + Reihe" en="geometric sequence + series" />}>
          <MD>{t`\text{${tr('Explizit', 'Explicit')}: } a_n = a_1\cdot q^{n-1} \qquad \text{${tr('Rekursiv', 'Recursive')}: } a_n = a_{n-1}\cdot q`}</MD>
          <MD>{t`S_n = \sum_{k=1}^n a_k = a_1(1 + q + q^2 + \dots + q^n) = a_1\cdot\frac{1 - q^n}{1 - q}`}</MD>
          <MD>{t`\text{${tr('Bsp.', 'Example')}: } 3 + 6 + 12 + 24 = 3\,(1 + 2 + 4 + 8) \;\to\; a_1 = 3,\ q = 2,\ n = 4`}</MD>
          <MD>{t`a_1\cdot\frac{1 - q^n}{1 - q} = 3\cdot\frac{1 - 2^4}{1 - 2} = 3\cdot\frac{1 - 16}{-1} = 3\cdot 15 = 45`}</MD>
        </Box>
        <T
          de={<p>Geometrisch heisst: Von Glied zu Glied wird mit derselben Zahl <M>q</M> multipliziert (auf dem Blatt die Bögen «<M p="»">{t`\cdot 2`}</M> zwischen <M p=").">{t`1, 2, 4, 8`}</M> <b>Ein Detail:</b> <M>n</M> Glieder sind <M p=",">{t`q^0, q^1, \dots, q^{n-1}`}</M> die Klammer endet also mit <M p=",">{t`q^{n-1}`}</M> nicht mit <M p=".">{t`q^n`}</M> Im Beispiel endet sie mit <M p=".">{t`8 = 2^3`}</M> Die Formel rechts stimmt.</p>}
          en={<p>Geometric means: from term to term we multiply by the same number <M>q</M> (on the slide the arcs “<M p="”">{t`\cdot 2`}</M> between <M p=").">{t`1, 2, 4, 8`}</M> <b>A detail:</b> <M>n</M> terms are <M p=",">{t`q^0, q^1, \dots, q^{n-1}`}</M> so the bracket ends with <M p=",">{t`q^{n-1}`}</M> not with <M p=".">{t`q^n`}</M> In the example it ends with <M p=".">{t`8 = 2^3`}</M> The formula on the right is correct.</p>}
        />
        <Derivation title={<T de="Woher die Formel kommt" en="Where the formula comes from" />}>
          <MD>{t`S_n = a_1 + a_1q + a_1q^2 + \dots + a_1q^{n-1}`}</MD>
          <MD>{t`q\,S_n = \phantom{a_1 + {}} a_1q + a_1q^2 + \dots + a_1q^{n-1} + a_1q^n`}</MD>
          <MD>{t`S_n - q\,S_n = a_1 - a_1q^n \quad\Rightarrow\quad S_n = a_1\,\frac{1 - q^n}{1 - q}\qquad (q \neq 1)`}</MD>
          <T
            de={<p>So liest man das: Mal <M>q</M> verschiebt jedes Glied um einen Platz nach rechts. Beim Abziehen fällt alles weg ausser dem ersten und dem letzten Glied. Dann durch <M>{t`1 - q`}</M> teilen – erlaubt, solange <M p=".">{t`q \neq 1`}</M></p>}
            en={<p>Read it like this: multiplying by <M>q</M> shifts every term one place to the right. On subtracting, everything cancels except the first and the last term. Then divide by <M>{t`1 - q`}</M> – allowed as long as <M p=".">{t`q \neq 1`}</M></p>}
          />
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="unendlich" title={<T de={<>3. Unendlich viele Glieder: nur für <M>{t`|q| < 1`}</M></>} en={<>3. Infinitely many terms: only for <M>{t`|q| < 1`}</M></>} />}>
        <Box kind="uebung" src={<Src u={1} p={12} />} title={<T de="Unendliche geometrische Reihe" en="Infinite geometric series" />}>
          <MD>{t`S_\infty = \sum_{k=1}^\infty a_k = a_1(1 + q + q^2 + \dots) = a_1\cdot\frac{1}{1 - q},\quad \text{${tr('falls', 'if')} } |q| < 1`}</MD>
          <MD>{t`\text{${tr('Bsp.', 'Example')}: } 3 + \frac32 + \frac34 + \frac38 + \dots = 3\Big(1 + \frac12 + \frac14 + \frac18 + \dots\Big) \;\to\; a_1 = 3,\ q = \frac12`}</MD>
          <MD>{t`\text{${tr('merke/prüfe', 'note/check')} } |q| = \tfrac12 < 1\ \checkmark \qquad 3\cdot\frac{1}{1 - \frac12} = \frac{3}{\frac12} = 3\cdot 2 = 6`}</MD>
        </Box>
        <T
          de={<p>Unendlich viele positive Zahlen und trotzdem eine endliche Summe? Ja – wenn die Glieder schnell genug kleiner werden. Hier füllt jedes Glied genau die halbe Lücke bis <M p=".">6</M></p>}
          en={<p>Infinitely many positive numbers and still a finite sum? Yes – if the terms shrink fast enough. Here every term fills exactly half of the gap up to <M p=".">6</M></p>}
        />
        <Derivation title={<T de={<><M>{t`3 + \frac32 + \frac34 + \dots = 6`}</M></>} en={<><M>{t`3 + \frac32 + \frac34 + \dots = 6`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: ein Balken der Länge 6 wird mit 3, 3/2, 3/4, … gefüllt', 'Animation: a bar of length 6 is filled with 3, 3/2, 3/4, …')}
            steps={[
              { ms: 1400, holdMs: 2200, caption: <T de={<>Das erste Glied <M p=".">3</M> Bis <M>6</M> fehlen noch <M p=".">3</M></>} en={<>The first term <M p=".">3</M> Up to <M p=",">6</M> <M>3</M> is still missing.</>} /> },
              { ms: 1400, holdMs: 2200, caption: <T de={<>Dazu <M p=":">{t`\frac32`}</M> die Hälfte der Lücke. Es fehlen noch <M p=".">{t`1{,}5`}</M></>} en={<>Add <M p=":">{t`\frac32`}</M> half of the gap. Still missing: <M p=".">{t`1.5`}</M></>} /> },
              { ms: 1400, holdMs: 2200, caption: <T de={<>Dazu <M p=":">{t`\frac34`}</M> wieder die halbe Lücke. Es fehlen <M p=".">{t`0{,}75`}</M></>} en={<>Add <M p=":">{t`\frac34`}</M> again half of the gap. Missing: <M p=".">{t`0.75`}</M></>} /> },
              { ms: 1400, holdMs: 2200, caption: <T de={<>Dazu <M p=".">{t`\frac38`}</M> Jedes Glied füllt genau die halbe Lücke – nie mehr.</>} en={<>Add <M p=".">{t`\frac38`}</M> Every term fills exactly half of the gap – never more.</>} /> },
              { ms: 2500, caption: <T
                de={<>Die Lücke halbiert sich bei jedem Glied und geht gegen <M p=".">0</M> Die Teilsummen kommen <M>6</M> beliebig nahe, ohne darüber zu gehen: <M p=".">{t`S_\infty = 6`}</M></>}
                en={<>The gap halves with every term and tends to <M p=".">0</M> The partial sums come arbitrarily close to <M p=",">6</M> never passing it: <M p=".">{t`S_\infty = 6`}</M></>} /> },
            ]}
          >
            {(step, tt) => <SceneFig build={halfScene} step={step} t={tt} label={tr('Balken', 'bar')} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>Warum nur für <M p="?">{t`|q| < 1`}</M></b> In <M>{t`S_n = a_1\frac{1 - q^n}{1 - q}`}</M> hängt nur <M>{t`q^n`}</M> von <M>n</M> ab. Für <M>{t`|q| < 1`}</M> ist <M>{t`q^n`}</M> eine Nullfolge (<M p=").">{t`(\frac12)^{10} \approx 0{,}001`}</M> Dann bleibt <M p=".">{t`S_\infty = \frac{a_1}{1-q}`}</M> Für <M>{t`|q| \ge 1`}</M> geht <M>{t`q^n`}</M> nicht gegen <M>0</M> – die Summe hat keinen Grenzwert. Probiere es:</p>
          </>}
          en={<>
            <p><b>Why only for <M p="?">{t`|q| < 1`}</M></b> In <M>{t`S_n = a_1\frac{1 - q^n}{1 - q}`}</M> only <M>{t`q^n`}</M> depends on <M p=".">n</M> For <M>{t`|q| < 1`}</M> <M>{t`q^n`}</M> is a null sequence (<M p=").">{t`(\frac12)^{10} \approx 0.001`}</M> Then <M>{t`S_\infty = \frac{a_1}{1-q}`}</M> remains. For <M>{t`|q| \ge 1`}</M> <M>{t`q^n`}</M> does not tend to <M>0</M> – the sum has no limit. Try it:</p>
          </>}
        />
        <GeoExplorer />
        <Box kind="misconception" title={<T de={<>«<M>{t`\frac{a_1}{1-q}`}</M> gilt immer»</>} en={<>“<M>{t`\frac{a_1}{1-q}`}</M> always works”</>} />}>
          <T de={<p>Für <M>{t`3 + 6 + 12 + \dots`}</M> (<M p=")">{t`q = 2`}</M> gäbe die Formel <M p=":">{t`\frac{3}{1-2} = -3`}</M> eine negative Summe aus positiven Zahlen – Unsinn. Darum zuerst prüfen: <M p="?">{t`|q| < 1`}</M></p>}
            en={<p>For <M>{t`3 + 6 + 12 + \dots`}</M> (<M p=")">{t`q = 2`}</M> the formula would give <M p=":">{t`\frac{3}{1-2} = -3`}</M> a negative sum of positive numbers – nonsense. So check first: <M p="?">{t`|q| < 1`}</M></p>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="harmonisch" title={<T de="4. Die harmonische Reihe divergiert" en="4. The harmonic series diverges" />}>
        <Box kind="uebung" src={<Src u={2} p={2} />} title={<T de="Harmonische Reihe" en="Harmonic series" />}>
          <MD>{t`S_n = \sum_{n=1}^\infty \frac1n = \frac11 + \frac12 + \frac13 + \frac14 + \frac15 + \dots = \infty`}</MD>
          <MD>{t`\textcolor{#2563eb}{\Big|}\; 1 + \frac12`}</MD>
          <MD>{t`\textcolor{#db2777}{\Big|}\; \frac13 + \frac14 > \frac14 + \frac14 = \frac24 = \frac12`}</MD>
          <MD>{t`\textcolor{#16a34a}{\Big|}\; \frac15 + \frac16 + \frac17 + \frac18 > \frac18 + \frac18 + \frac18 + \frac18 = \frac48 = \frac12`}</MD>
          <MD>{t`1 + \frac12 + \frac12 + \frac12 + \frac12 + \dots = \infty`}</MD>
        </Box>
        <T
          de={<>
            <p><b>Zur Schreibweise.</b> Auf dem Blatt (auch <Src u={1} p={12} />) heisst sowohl die Teilsumme als auch der Laufindex <M p=",">n</M> und links steht <M>{t`S_n`}</M> für eine unendliche Summe. Gemeint ist: Die Teilsummen</p>
          </>}
          en={<>
            <p><b>About the notation.</b> On the slide (also <Src u={1} p={12} />) both the partial sum and the summation index are called <M p=",">n</M> and <M>{t`S_n`}</M> on the left names an infinite sum. What is meant: the partial sums</p>
          </>}
        />
        <MD>{t`S_n = \sum_{k=1}^n \frac1k = 1 + \frac12 + \dots + \frac1n`}</MD>
        <T
          de={<p>wachsen über jede Grenze, <M p=".">{t`S_n \to \infty`}</M> Das ist überraschend: Die Glieder <M>{t`\frac1k`}</M> gehen gegen <M p=".">0</M> Aber sie werden zu langsam kleiner. Die Übung zeigt es mit einem Trick: Man fasst die Glieder in Gruppen zusammen, die jeweils mindestens <M>{t`\frac12`}</M> ergeben.</p>}
          en={<p>grow beyond every bound, <M p=".">{t`S_n \to \infty`}</M> That is surprising: the terms <M>{t`\frac1k`}</M> tend to <M p=".">0</M> But they shrink too slowly. The exercise class shows it with a trick: group the terms so that each group gives at least <M p=".">{t`\frac12`}</M></p>}
        />
        <Derivation title={<T de="Die Gruppen-Abschätzung" en="The grouping estimate" />}>
          <StepPlayer
            label={tr('Animation: die Glieder 1/k als Säulen, in Gruppen auf das kleinste Glied gekürzt', 'Animation: the terms 1/k as columns, cut down group by group to the smallest term')}
            steps={[
              { ms: 1500, holdMs: 3000, caption: <T
                de={<>Die Glieder <M>{t`\frac1k`}</M> als Säulen der Breite <M p=":">1</M> die Fläche ist das Glied. Sie werden immer kleiner. Blau: die ersten beiden, <M p=".">{t`1 + \frac12`}</M></>}
                en={<>The terms <M>{t`\frac1k`}</M> as columns of width <M p=":">1</M> the area is the term. They get ever smaller. Blue: the first two, <M p=".">{t`1 + \frac12`}</M></>} /> },
              { ms: 1600, holdMs: 3000, caption: <T
                de={<>Magenta: <M p=".">{t`\frac13 + \frac14`}</M> Kürzt man <M>{t`\frac13`}</M> auf <M p=",">{t`\frac14`}</M> wird es kleiner: <M p=".">{t`\frac13 + \frac14 > \frac14 + \frac14 = \frac12`}</M></>}
                en={<>Magenta: <M p=".">{t`\frac13 + \frac14`}</M> Cutting <M>{t`\frac13`}</M> down to <M>{t`\frac14`}</M> makes it smaller: <M p=".">{t`\frac13 + \frac14 > \frac14 + \frac14 = \frac12`}</M></>} /> },
              { ms: 1600, holdMs: 3000, caption: <T
                de={<>Grün: <M>{t`\frac15`}</M> bis <M p=",">{t`\frac18`}</M> vier Glieder, jedes mindestens <M p=".">{t`\frac18`}</M> Zusammen mehr als <M p=".">{t`4\cdot\frac18 = \frac12`}</M></>}
                en={<>Green: <M>{t`\frac15`}</M> to <M p=",">{t`\frac18`}</M> four terms, each at least <M p=".">{t`\frac18`}</M> Together more than <M p=".">{t`4\cdot\frac18 = \frac12`}</M></>} /> },
              { ms: 1600, holdMs: 3000, caption: <T
                de={<>Violett: <M>{t`\frac19`}</M> bis <M p=",">{t`\frac1{16}`}</M> acht Glieder, zusammen mehr als <M p=".">{t`8\cdot\frac1{16} = \frac12`}</M> Jede Gruppe ist doppelt so lang wie die vorige.</>}
                en={<>Purple: <M>{t`\frac19`}</M> to <M p=",">{t`\frac1{16}`}</M> eight terms, together more than <M p=".">{t`8\cdot\frac1{16} = \frac12`}</M> Each group is twice as long as the one before.</>} /> },
              { ms: 1500, caption: <T
                de={<>Jede Gruppe bringt mindestens <M p=",">{t`\frac12`}</M> und es gibt unendlich viele Gruppen. Also <M p=":">{t`S_{2^m} \ge 1 + \frac m2 \to \infty`}</M> Die Reihe divergiert.</>}
                en={<>Every group adds at least <M p=",">{t`\frac12`}</M> and there are infinitely many groups. So <M p=":">{t`S_{2^m} \ge 1 + \frac m2 \to \infty`}</M> the series diverges.</>} /> },
            ]}
          >
            {(step, tt) => <SceneFig build={harmScene} step={step} t={tt} label={tr('Säulen 1/k', 'columns 1/k')} />}
          </StepPlayer>
        </Derivation>
        <Box kind="supplement" title={<T de="Wie langsam?" en="How slowly?" />}>
          <T
            de={<p>Sehr langsam: <M>{t`S_n`}</M> wächst etwa wie <M p=".">{t`\ln n + 0{,}577`}</M> Damit <M>{t`S_n > 10`}</M> wird, braucht es <M>{t`n = ${harmExceed(10)}`}</M> Glieder. Darum sieht man die Divergenz beim Ausprobieren mit dem Taschenrechner nicht – man braucht den Beweis.</p>}
            en={<p>Very slowly: <M>{t`S_n`}</M> grows roughly like <M p=".">{t`\ln n + 0.577`}</M> For <M>{t`S_n > 10`}</M> one needs <M>{t`n = ${harmExceed(10)}`}</M> terms. That is why trying it on a calculator does not reveal the divergence – you need the proof.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M p=",">{t`a_k \to 0`}</M> also konvergiert die Reihe»</>} en={<>“<M p=",">{t`a_k \to 0`}</M> so the series converges”</>} />}>
          <T de={<p>Die harmonische Reihe ist das Gegenbeispiel. Richtig ist nur die Umkehrung: Konvergiert die Reihe, dann gilt <M p=".">{t`a_k \to 0`}</M> (Sonst käme bei jedem Schritt ein Stück dazu, das nicht verschwindet.)</p>}
            en={<p>The harmonic series is the counter-example. Only the converse is true: if the series converges, then <M p=".">{t`a_k \to 0`}</M> (Otherwise every step would add a piece that does not vanish.)</p>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="e" title={<T de={<>5. Die Reihe für <M>e</M></>} en={<>5. The series for <M>e</M></>} />}>
        <Box kind="uebung" src={<Src u={1} p={12} />}>
          <MD>{t`S_n = \frac{1}{1!} + \frac{1}{2!} + \dots + \frac{1}{n!};\qquad \lim_{n\to\infty} S_n = e`}</MD>
        </Box>
        <T
          de={<p><M>{t`n! = 1\cdot 2\cdots n`}</M> («<M>n</M> Fakultät») wächst sehr schnell, darum konvergiert die Reihe rasch: <M p=".">{t`S_5 = ${e5}`}</M> Aber Achtung: So wie sie dasteht, beginnt sie bei <M>{t`\frac{1}{1!}`}</M> und geht gegen <M p=".">{t`e - 1 = ${eLim}\dots`}</M> Für <M>e</M> fehlt das Glied <M p=":">{t`\frac{1}{0!} = 1`}</M></p>}
          en={<p><M>{t`n! = 1\cdot 2\cdots n`}</M> (“<M>n</M> factorial”) grows very fast, so the series converges quickly: <M p=".">{t`S_5 = ${e5}`}</M> But careful: as written, it starts at <M>{t`\frac{1}{1!}`}</M> and tends to <M p=".">{t`e - 1 = ${eLim}\dots`}</M> For <M>e</M> the term <M>{t`\frac{1}{0!} = 1`}</M> is missing:</p>}
        />
        <MD>{t`\sum_{k=0}^\infty \frac{1}{k!} = 1 + \frac{1}{1!} + \frac{1}{2!} + \dots = e = ${eF}\dots`}</MD>
        <Box kind="key">
          <T
            de={<ul>
              <li>Arithmetisch: <M p=".">{t`S_n = \frac12 n\,[a_1 + a_n]`}</M> Geometrisch: <M p=",">{t`S_n = a_1\frac{1-q^n}{1-q}`}</M> die Klammer endet mit <M p=".">{t`q^{n-1}`}</M></li>
              <li><M>{t`S_\infty = \frac{a_1}{1-q}`}</M> nur für <M>{t`|q| < 1`}</M> – vorher prüfen.</li>
              <li>Harmonisch: <M p=",">{t`\frac1k \to 0`}</M> trotzdem <M p=".">{t`S_n \to \infty`}</M> Glieder gegen <M>0</M> genügt nicht.</li>
              <li><M p=".">{t`\sum_{k=0}^\infty \frac{1}{k!} = e`}</M></li>
            </ul>}
            en={<ul>
              <li>Arithmetic: <M p=".">{t`S_n = \frac12 n\,[a_1 + a_n]`}</M> Geometric: <M p=",">{t`S_n = a_1\frac{1-q^n}{1-q}`}</M> the bracket ends with <M p=".">{t`q^{n-1}`}</M></li>
              <li><M>{t`S_\infty = \frac{a_1}{1-q}`}</M> only for <M>{t`|q| < 1`}</M> – check first.</li>
              <li>Harmonic: <M p=",">{t`\frac1k \to 0`}</M> yet <M p=".">{t`S_n \to \infty`}</M> Terms tending to <M>0</M> is not enough.</li>
              <li><M p=".">{t`\sum_{k=0}^\infty \frac{1}{k!} = e`}</M></li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
