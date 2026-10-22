import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { RecipPlot, ReciprocalFigure, TransformExplorer } from '../viz/ana/W3Figures';

const t = String.raw;

export default function A3Transformationen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Nach <a href="#ana-stetigkeit">Stetigkeit, Lücken und Zwischenwertsatz</a> ein Werkzeug fürs Skizzieren: Kennt man einen Graphen, bekommt man viele weitere fast gratis – verschieben, strecken, spiegeln, Kehrwert.</p>}
        en={<p className="lede">After <a href="#ana-stetigkeit">Continuity, gaps and the intermediate value theorem</a> a tool for sketching: if you know one graph, you get many more almost for free – shift, stretch, mirror, reciprocal.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="verschieben" title={<T de="1. Graphen verschieben und strecken" en="1. Shifting and stretching graphs" />}>
        <Box kind="uebung" src={<Src u={3} p={4} />} title={<T de={<>Graphen verschieben und strecken, Bsp. <M>{t`p(x) = 2x^3-3x^2-6x+6`}</M></>} en={<>Shifting and stretching graphs, example <M>{t`p(x) = 2x^3-3x^2-6x+6`}</M></>} />}>
          <T
            de={<ul>
              <li>In <M>x</M>-Richtung verschieben: <M p=".">{t`f(x-a)`}</M> <M p=":">{t`a > 0`}</M> rechts, <M p=":">{t`a < 0`}</M> links. <M p=":">{t`p(x+2)`}</M> 2 nach links.</li>
              <li>In <M>y</M>-Richtung verschieben: <M p=".">{t`f(x)+b`}</M> <M p=":">{t`b > 0`}</M> oben, <M p=":">{t`b < 0`}</M> unten. <M p=":">{t`p(x)+4`}</M> 4 nach oben.</li>
              <li>In <M>x</M>-Richtung strecken/stauchen: <M p=".">{t`f(cx),\ c \neq 0`}</M> Breite <M p=".">{t`\times 1/|c|`}</M> Für <M>{t`c < 0`}</M> zusätzlich an der <M>y</M>-Achse spiegeln. <M p=":">{t`p(2x)`}</M> halb so breit.</li>
              <li>In <M>y</M>-Richtung strecken/stauchen: <M p=".">{t`d\cdot f(x)`}</M> Höhe <M p=".">{t`\times |d|`}</M> Für <M>{t`d < 0`}</M> zusätzlich an der <M>x</M>-Achse spiegeln. <M p=":">{t`2p(x)`}</M> doppelt so hoch.</li>
            </ul>}
            en={<ul>
              <li>Shift in the <M>x</M>-direction: <M p=".">{t`f(x-a)`}</M> <M p=":">{t`a > 0`}</M> right, <M p=":">{t`a < 0`}</M> left. <M p=":">{t`p(x+2)`}</M> 2 to the left.</li>
              <li>Shift in the <M>y</M>-direction: <M p=".">{t`f(x)+b`}</M> <M p=":">{t`b > 0`}</M> up, <M p=":">{t`b < 0`}</M> down. <M p=":">{t`p(x)+4`}</M> 4 up.</li>
              <li>Stretch/compress in the <M>x</M>-direction: <M p=".">{t`f(cx),\ c \neq 0`}</M> Width <M p=".">{t`\times 1/|c|`}</M> For <M>{t`c < 0`}</M> also mirror at the <M>y</M>-axis. <M p=":">{t`p(2x)`}</M> half as wide.</li>
              <li>Stretch/compress in the <M>y</M>-direction: <M p=".">{t`d\cdot f(x)`}</M> Height <M p=".">{t`\times |d|`}</M> For <M>{t`d < 0`}</M> also mirror at the <M>x</M>-axis. <M p=":">{t`2p(x)`}</M> twice as high.</li>
            </ul>}
          />
          <T
            de={<p>Tipp zur Serie 3 (<Src u={3} p={12} />): Änderung im Argument <M>\to</M> <M>x</M>-Richtung. Änderung ausserhalb von <M>f</M> <M>\to</M> <M>y</M>-Richtung.</p>}
            en={<p>Hint for problem set 3 (<Src u={3} p={12} />): a change in the argument <M>\to</M> <M>x</M>-direction. A change outside <M>f</M> <M>\to</M> <M>y</M>-direction.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>Warum geht <M>{t`f(x-a)`}</M> nach rechts, obwohl dort ein Minus steht?</b> Stell dir einen Zug vor, der denselben Fahrplan fährt, aber <M>a</M> Minuten später abfährt. Er ist überall <M>a</M> Minuten <em>später</em> – auf der Zeitachse also weiter rechts.</p>
            <p>Genauso hier. Der alte Graph hat bei <M>{t`x_0`}</M> den Wert <M p=".">{t`p(x_0)`}</M> Der neue Graph <M>{t`p(x-a)`}</M> hat diesen Wert dort, wo <M>{t`x - a = x_0`}</M> ist, also bei <M p=".">{t`x = x_0 + a`}</M> Jeder Wert kommt <M>a</M> später: Verschiebung nach rechts.</p>
            <p>Bei <M>{t`p(cx)`}</M> ebenso: Der Wert <M>{t`p(x_0)`}</M> kommt bei <M p=",">{t`cx = x_0`}</M> also bei <M p=".">{t`x = x_0/c`}</M> Für <M>{t`c = 2`}</M> ist alles halb so weit von der <M>y</M>-Achse weg: halb so breit.</p>
          </>}
          en={<>
            <p><b>Why does <M>{t`f(x-a)`}</M> move to the right, although there is a minus?</b> Think of a train that runs the same timetable but leaves <M>a</M> minutes later. It is <M>a</M> minutes <em>later</em> everywhere – further right on the time axis.</p>
            <p>The same here. The old graph has the value <M>{t`p(x_0)`}</M> at <M p=".">{t`x_0`}</M> The new graph <M>{t`p(x-a)`}</M> has this value where <M p=",">{t`x - a = x_0`}</M> so at <M p=".">{t`x = x_0 + a`}</M> Every value comes <M>a</M> later: a shift to the right.</p>
            <p>Likewise for <M p=":">{t`p(cx)`}</M> the value <M>{t`p(x_0)`}</M> comes where <M p=",">{t`cx = x_0`}</M> at <M p=".">{t`x = x_0/c`}</M> For <M>{t`c = 2`}</M> everything is half as far from the <M>y</M>-axis: half as wide.</p>
          </>}
        />
        <T
          de={<p>Probier es aus. Gestrichelt grau ist <M p=",">p</M> magenta der veränderte Graph. Der Pfeil zeigt, wohin der Hochpunkt wandert.</p>}
          en={<p>Try it. Dashed grey is <M p=",">p</M> magenta the transformed graph. The arrow shows where the maximum goes.</p>}
        />
        <TransformExplorer />
        <Box kind="misconception" title={<T de={<>«<M>{t`p(2x+2)`}</M> ist um 2 nach links verschoben»</>} en={<>“<M>{t`p(2x+2)`}</M> is shifted 2 to the left”</>} />}>
          <T
            de={<p>Erst ausklammern: <M p=".">{t`p(2x+2) = p(2(x+1))`}</M> Das ist <M>{t`p(2x)`}</M> um <b>1</b> nach links (<M p=",">{t`c = 2`}</M> <M p=").">{t`a = -1`}</M> Im Regler: <M>{t`a = -1`}</M> und <M p=".">{t`c = 2`}</M></p>}
            en={<p>Factor first: <M p=".">{t`p(2x+2) = p(2(x+1))`}</M> That is <M>{t`p(2x)`}</M> shifted <b>1</b> to the left (<M p=",">{t`c = 2`}</M> <M p=").">{t`a = -1`}</M> In the explorer: <M>{t`a = -1`}</M> and <M p=".">{t`c = 2`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`p(2x)`}</M> ist doppelt so breit»</>} en={<>“<M>{t`p(2x)`}</M> is twice as wide”</>} />}>
          <T
            de={<p>Umgekehrt: Das Argument läuft doppelt so schnell, also ist alles nach der halben Strecke erreicht. <M>{t`p(2x)`}</M> ist halb so breit. Doppelt so <em>hoch</em> ist <M p=".">{t`2p(x)`}</M></p>}
            en={<p>The other way round: the argument runs twice as fast, so everything is reached after half the distance. <M>{t`p(2x)`}</M> is half as wide. Twice as <em>high</em> is <M p=".">{t`2p(x)`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="kehrwert" title={<T de={<>2. Kehrwert: in <M>y</M> oder in <M>x</M></>} en={<>2. Reciprocal: in <M>y</M> or in <M>x</M></>} />}>
        <Box kind="uebung" src={<Src u={3} p={5} />} title={<T de="Kehrwert und Umkehrfunktion" en={<>Reciprocal and inverse function (<span lang="de">Kehrwert und Umkehrfunktion</span>)</>} />}>
          <T
            de={<ul>
              <li><b>Kehrwert der <M>y</M>-Werte</b> <M p=":">{t`\frac{1}{f(x)}`}</M> Jeder <M>y</M>-Wert wird zu <M p=".">{t`1/y`}</M> Nur möglich, wenn <M p=".">{t`f(x) \neq 0`}</M> Bsp. <M p=".">{t`1/p(x)`}</M></li>
              <li><b>Kehrwert im <M>x</M> einsetzen</b> <M p=":">{t`f\left(\frac1x\right)`}</M> Erst <M>{t`1/x`}</M> rechnen, dann <M>f</M> anwenden. <M>{t`x \neq 0`}</M> und <M>{t`1/x`}</M> muss in <M>D</M> liegen. Bsp. <M p=".">{t`p(1/x)`}</M></li>
            </ul>}
            en={<ul>
              <li><b>Reciprocal of the <M>y</M>-values</b> <M p=":">{t`\frac{1}{f(x)}`}</M> every <M>y</M>-value becomes <M p=".">{t`1/y`}</M> Only possible if <M p=".">{t`f(x) \neq 0`}</M> Example <M p=".">{t`1/p(x)`}</M></li>
              <li><b>Reciprocal put into <M>x</M></b> <M p=":">{t`f\left(\frac1x\right)`}</M> first compute <M p=",">{t`1/x`}</M> then apply <M p=".">f</M> <M>{t`x \neq 0`}</M> and <M>{t`1/x`}</M> must lie in <M p=".">D</M> Example <M p=".">{t`p(1/x)`}</M></li>
            </ul>}
          />
          <MD>{tr(t`f^{-1}(x) \neq \frac{1}{f(x)} \quad \text{im Allgemeinen}`, t`f^{-1}(x) \neq \frac{1}{f(x)} \quad \text{in general}`)}</MD>
        </Box>
        <ReciprocalFigure />
        <T
          de={<>
            <p><b>Was man im Bild sieht:</b></p>
            <ol>
              <li><M p=":">{t`1/p`}</M> Wo <M>p</M> null ist (bei etwa <M p="),">{t`-1{,}6;\ 0{,}85;\ 2{,}25`}</M> wird der Kehrwert riesig: drei Polstellen. Wo <M>p</M> gross ist, ist <M>{t`1/p`}</M> fast <M p=".">0</M> Das Vorzeichen bleibt.</li>
              <li><M p=":">{t`p(1/x)`}</M> Für grosse <M>{t`|x|`}</M> ist <M>{t`1/x`}</M> fast <M p=",">0</M> also <M p=".">{t`p(1/x) \to p(0) = 6`}</M> Bei <M>{t`x = 0`}</M> ist nichts definiert.</li>
            </ol>
          </>}
          en={<>
            <p><b>What you see in the picture:</b></p>
            <ol>
              <li><M p=":">{t`1/p`}</M> where <M>p</M> is zero (at about <M p="),">{t`-1.6,\ 0.85,\ 2.25`}</M> the reciprocal becomes huge: three poles. Where <M>p</M> is large, <M>{t`1/p`}</M> is almost <M p=".">0</M> The sign stays.</li>
              <li><M p=":">{t`p(1/x)`}</M> for large <M>{t`|x|`}</M> the value <M>{t`1/x`}</M> is almost <M p=",">0</M> so <M p=".">{t`p(1/x) \to p(0) = 6`}</M> At <M>{t`x = 0`}</M> nothing is defined.</li>
            </ol>
          </>}
        />
        <Box kind="uebung" src={<Src u={4} p={1} />} title={<T de="Aufgabe 2d: Warum wird aus dem Maximum ein Minimum?" en="Problem 2d: why does the maximum become a minimum?" />}>
          <T
            de={<p>Gegeben ist ein positives lokales Maximum von <M>{t`f_5`}</M> bei <M p=".">{t`t = -\frac12`}</M> Wir zeigen: <M>{t`\tilde f_5`}</M> hat bei <M>{t`x = -2`}</M> ein positives lokales Minimum. Dafür brauchen wir keine Ableitungen.</p>}
            en={<p>Given: a positive local maximum of <M>{t`f_5`}</M> at <M p=".">{t`t = -\frac12`}</M> We show: <M>{t`\tilde f_5`}</M> has a positive local minimum at <M p=".">{t`x = -2`}</M> We need no derivatives for this.</p>}
          />
          <MD>{t`f_5(t) = |\tan(t^2+t)|, \qquad \tilde f_5(x) = \frac{1}{f_5\left(\frac1x\right)}`}</MD>
          <MD>{t`0 < f_5(t) \le f_5\left(-\tfrac12\right) \ \Rightarrow\ \frac{1}{f_5(t)} \ge \frac{1}{f_5\left(-\frac12\right)}`}</MD>
          <MD>{t`\frac1x = -\frac12 \ \Rightarrow\ x = -2`}</MD>
        </Box>
        <StepPlayer
          label={tr('Animation: aus dem Maximum von f5 wird ein Minimum, die Stelle wandert nach x = −2', 'Animation: the maximum of f5 becomes a minimum, the place moves to x = −2')}
          steps={[
            { ms: 1500, holdMs: 2500, caption: <T de={<><M>{t`f_5(t) = |\tan(t^2+t)|`}</M> hat bei <M>{t`t = -\frac12`}</M> ein positives lokales Maximum. Sein Wert ist <M p=".">{t`\tan\frac14 \approx 0{,}255`}</M></>} en={<><M>{t`f_5(t) = |\tan(t^2+t)|`}</M> has a positive local maximum at <M p=".">{t`t = -\frac12`}</M> Its value is <M p=".">{t`\tan\frac14 \approx 0.255`}</M></>} /> },
            { ms: 4000, holdMs: 3000, caption: <T de={<>Kehrwert: Jeder Wert wird <M p=".">{t`1/y`}</M> Grosse Werte werden klein, kleine gross. Aus dem höchsten Punkt wird der tiefste: Minimum <M p=".">{t`1/\tan\frac14 \approx 3{,}92`}</M></>} en={<>Reciprocal: every value becomes <M p=".">{t`1/y`}</M> Large values become small, small ones large. The highest point becomes the lowest: minimum <M p=".">{t`1/\tan\frac14 \approx 3.92`}</M></>} /> },
            { ms: 4000, caption: <T de={<><M>{t`1/x`}</M> einsetzen: Der Wert, der bei <M>t</M> stand, steht jetzt bei <M p=".">{t`x = 1/t`}</M> Aus <M>{t`t = -\frac12`}</M> wird <M p=".">{t`x = -2`}</M> Die Höhe bleibt.</>} en={<>Put in <M p=":">{t`1/x`}</M> the value that stood at <M>t</M> now stands at <M p=".">{t`x = 1/t`}</M> <M>{t`t = -\frac12`}</M> becomes <M p=".">{t`x = -2`}</M> The height stays.</>} /> },
          ]}
        >
          {(s, tt) => <RecipPlot step={s} t={tt} />}
        </StepPlayer>
        <T
          de={<>
            <p><b>So liest man das Argument:</b></p>
            <ol>
              <li>Nahe bei <M>{t`-\frac12`}</M> ist <M>{t`f_5(t)`}</M> nirgends grösser als am Maximum. Weil <M>{t`f_5`}</M> dort stetig und positiv ist, bleibt sie in der Nähe positiv.</li>
              <li>Bei positiven Zahlen gilt: je grösser der Nenner, desto kleiner der Bruch (<M p=",">{t`2 < 4`}</M> aber <M p=").">{t`\frac12 > \frac14`}</M> Darum dreht sich das <M>\le</M> zu <M p=".">\ge</M> Der Kehrwert ist genau dort am kleinsten.</li>
              <li>Ist <M>x</M> nahe bei <M p=",">-2</M> dann ist <M>{t`\frac1x`}</M> nahe bei <M p=".">{t`-\frac12`}</M> Also gilt <M>{t`\tilde f_5(x) \ge \tilde f_5(-2) > 0`}</M> für alle <M>x</M> in der Nähe: ein positives lokales Minimum.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the argument:</b></p>
            <ol>
              <li>Near <M>{t`-\frac12`}</M> the value <M>{t`f_5(t)`}</M> is nowhere larger than at the maximum. Since <M>{t`f_5`}</M> is continuous and positive there, it stays positive nearby.</li>
              <li>For positive numbers: the larger the denominator, the smaller the fraction (<M p=",">{t`2 < 4`}</M> but <M p=").">{t`\frac12 > \frac14`}</M> That is why <M>\le</M> turns into <M p=".">\ge</M> The reciprocal is smallest exactly there.</li>
              <li>If <M>x</M> is near <M p=",">-2</M> then <M>{t`\frac1x`}</M> is near <M p=".">{t`-\frac12`}</M> So <M>{t`\tilde f_5(x) \ge \tilde f_5(-2) > 0`}</M> for all <M>x</M> nearby: a positive local minimum.</li>
            </ol>
          </>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`f^{-1}`}</M> ist dasselbe wie <M>{t`\frac1f`}</M>»</>} en={<>“<M>{t`f^{-1}`}</M> is the same as <M>{t`\frac1f`}</M>”</>} />}>
          <T
            de={<p>Die hochgestellte <M>-1</M> heisst hier «rückwärts», nicht «Kehrwert». Für <M>{t`f(x) = 2x+3`}</M> ist <M p=",">{t`\frac{1}{f(1)} = \frac15 = 0{,}2`}</M> aber <M p=".">{t`f^{-1}(1) = \frac{1-3}{2} = -1`}</M> Die Umkehrfunktion kommt in der nächsten Lektion: <a href="#ana-umkehr">Injektiv, surjektiv, Umkehrfunktion</a>.</p>}
            en={<p>The raised <M>-1</M> means “backwards” here, not “reciprocal”. For <M>{t`f(x) = 2x+3`}</M> we get <M p=",">{t`\frac{1}{f(1)} = \frac15 = 0.2`}</M> but <M p=".">{t`f^{-1}(1) = \frac{1-3}{2} = -1`}</M> The inverse function comes in the next lesson: <a href="#ana-umkehr">Injective, surjective, inverse function</a>.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«Bei <M>{t`1/f`}</M> bleiben die Hochpunkte Hochpunkte»</>} en={<>“With <M>{t`1/f`}</M> maxima stay maxima”</>} />}>
          <T
            de={<p>Bei positiven Werten nicht: Der Kehrwert dreht die Reihenfolge um. Ein positives Maximum wird ein Minimum, wie oben bei <M p=".">{t`f_5`}</M> Die Stelle bleibt dieselbe – erst <M>{t`1/x`}</M> im Argument verschiebt sie.</p>}
            en={<p>Not for positive values: the reciprocal reverses the order. A positive maximum becomes a minimum, as with <M>{t`f_5`}</M> above. The place stays the same – only <M>{t`1/x`}</M> in the argument moves it.</p>}
          />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Im Argument (<M p=",">{t`f(x-a)`}</M> <M p=")">{t`f(cx)`}</M> <M>\to</M> <M>x</M>-Richtung, und «verkehrt»: <M>{t`x-a`}</M> geht nach rechts, <M>{t`cx`}</M> macht schmaler.</li>
              <li>Ausserhalb (<M p=",">{t`f(x)+b`}</M> <M p=")">{t`d\cdot f(x)`}</M> <M>\to</M> <M>y</M>-Richtung, so wie es dasteht.</li>
              <li><M p=":">{t`1/f`}</M> gleiche Stelle, Wert <M p=".">{t`1/y`}</M> <M p=":">{t`f(1/x)`}</M> gleicher Wert, Stelle <M p=".">{t`1/x`}</M> Und <M p=".">{t`f^{-1} \neq 1/f`}</M></li>
            </ul>}
            en={<ul>
              <li>In the argument (<M p=",">{t`f(x-a)`}</M> <M p=")">{t`f(cx)`}</M> <M>\to</M> <M>x</M>-direction, and “reversed”: <M>{t`x-a`}</M> moves right, <M>{t`cx`}</M> makes it narrower.</li>
              <li>Outside (<M p=",">{t`f(x)+b`}</M> <M p=")">{t`d\cdot f(x)`}</M> <M>\to</M> <M>y</M>-direction, just as written.</li>
              <li><M p=":">{t`1/f`}</M> same place, value <M p=".">{t`1/y`}</M> <M p=":">{t`f(1/x)`}</M> same value, place <M p=".">{t`1/x`}</M> And <M p=".">{t`f^{-1} \neq 1/f`}</M></li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
