import { Box, Section, Src } from '../components/Blocks';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { ParallelogramDemo } from '../viz/ParallelogramFigures';

const t = String.raw;

export default function L17Parallelogramm() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Vier Stäbe, die ein Parallelogramm bilden, verhalten sich besonders einfach: Gegenüberliegende Stäbe drehen sich gleich schnell. Die Notizen beweisen das, indem sie einmal um das Parallelogramm herumgehen. Das spart bei Fachwerken viel Rechnerei.</p>}
        en={<p className="lede">Four bars forming a parallelogram behave in a particularly simple way: opposite bars turn equally fast. The notes prove this by going once around the parallelogram. In trusses, this saves a lot of work.</p>}
      />
      <Section id="regel" title={<T de="1. Die Regel" en="1. The rule" />}>
        <Box kind="lecture" src={<Src p="HS 2018, 28" fig="Fig. 3.25" />} title={<T de="Parallelogrammregel" en="Parallelogram rule" />} keep>
          <T
            de={<p>Bilden vier Stäbe <M p=",">AB</M> <M p=",">BC</M> <M p=",">DC</M> <M>AD</M> ein Parallelogramm (<M>AB \parallel DC</M> und <M p="),">{t`BC \parallel AD`}</M> so gilt <M>{t`\omega_{AB} = \omega_{DC}`}</M> und <M p=".">{t`\omega_{BC} = \omega_{AD}`}</M></p>}
            en={<p>If four bars <M p=",">AB</M> <M p=",">BC</M> <M p=",">DC</M> <M>AD</M> form a parallelogram (<M>AB \parallel DC</M> and <M p="),">{t`BC \parallel AD`}</M> then <M>{t`\omega_{AB} = \omega_{DC}`}</M> and <M p=".">{t`\omega_{BC} = \omega_{AD}`}</M></p>}
          />
        </Box>
        <T
          de={<p>Im Bild unten kann man die vier Winkelgeschwindigkeiten selbst einstellen. Vom ruhenden Punkt <M>A</M> aus berechnet das Bild die Geschwindigkeit von <M>C</M> auf zwei Wegen: über <M>B</M> und über <M p=".">D</M> Ein starres Parallelogramm kann nur existieren, wenn beide Wege am selben Ergebnis ankommen.</p>}
          en={<p>In the figure below you can set the four angular velocities yourself. Starting from the resting point <M p=",">A</M> the figure computes the velocity of <M>C</M> by two routes: via <M>B</M> and via <M p=".">D</M> A rigid parallelogram can exist only if both routes arrive at the same result.</p>}
        />
        <ParallelogramDemo />
      </Section>

      <Section id="beweis" title={<T de="2. Der Beweis: einmal herumgehen" en="2. The proof: go once around" />}>
        <T
          de={<>
            <p>Idee: Gehe von <M>A</M> nach <M>C</M> auf zwei Wegen. Jeder Schritt über einen Stab addiert eine Geschwindigkeit der Form «Drehung mal Stab». Die Summe muss auf beiden Wegen dieselbe sein.</p>
            <ol className="keep">
              <li>Weg über <M p=":">B</M> <M>{t`\v{v}_C = \v{v}_A + \omega_{AB}\,\v{e}_z \times \overrightarrow{AB} + \omega_{BC}\,\v{e}_z \times \overrightarrow{BC}`}</M></li>
              <li>Weg über <M p=":">D</M> <M>{t`\v{v}_C = \v{v}_A + \omega_{AD}\,\v{e}_z \times \overrightarrow{AD} + \omega_{DC}\,\v{e}_z \times \overrightarrow{DC}`}</M></li>
              <li>Im Parallelogramm ist <M>{t`\overrightarrow{DC} = \overrightarrow{AB}`}</M> und <M p=".">{t`\overrightarrow{AD} = \overrightarrow{BC}`}</M></li>
              <li>Gleichsetzen und umstellen: <M p=".">{t`(\omega_{AB} - \omega_{DC})\,\v{e}_z \times \overrightarrow{AB} + (\omega_{BC} - \omega_{AD})\,\v{e}_z \times \overrightarrow{BC} = \v{0}`}</M></li>
            </ol>
            <p>Die Vektoren <M>{t`\overrightarrow{AB}`}</M> und <M>{t`\overrightarrow{BC}`}</M> zeigen in verschiedene Richtungen (sonst wäre es kein Parallelogramm). Dann kann die Summe nur null sein, wenn <em>beide</em> Klammern null sind. Das ist die Behauptung.</p>
          </>}
          en={<>
            <p>Idea: go from <M>A</M> to <M>C</M> by two routes. Each step along a bar adds a velocity of the form “rotation times bar”. The sum must be the same on both routes.</p>
            <ol className="keep">
              <li>Route via <M p=":">B</M> <M>{t`\v{v}_C = \v{v}_A + \omega_{AB}\,\v{e}_z \times \overrightarrow{AB} + \omega_{BC}\,\v{e}_z \times \overrightarrow{BC}`}</M></li>
              <li>Route via <M p=":">D</M> <M>{t`\v{v}_C = \v{v}_A + \omega_{AD}\,\v{e}_z \times \overrightarrow{AD} + \omega_{DC}\,\v{e}_z \times \overrightarrow{DC}`}</M></li>
              <li>In the parallelogram <M>{t`\overrightarrow{DC} = \overrightarrow{AB}`}</M> and <M p=".">{t`\overrightarrow{AD} = \overrightarrow{BC}`}</M></li>
              <li>Set equal and rearrange: <M p=".">{t`(\omega_{AB} - \omega_{DC})\,\v{e}_z \times \overrightarrow{AB} + (\omega_{BC} - \omega_{AD})\,\v{e}_z \times \overrightarrow{BC} = \v{0}`}</M></li>
            </ol>
            <p>The vectors <M>{t`\overrightarrow{AB}`}</M> and <M>{t`\overrightarrow{BC}`}</M> point in different directions (otherwise it would not be a parallelogram). Then the sum can only vanish if <em>both</em> brackets vanish. That is the claim.</p>
          </>}
        />
        <Box kind="misconception" title={<T de="Wann die Regel versagt" en="When the rule fails" />}>
          <T
            de={<p>Liegen <M>AB</M> und <M>BC</M> auf einer Geraden, ist das Parallelogramm flachgedrückt. Dann sind die beiden Vektoren parallel, und aus der einen Gleichung folgen nicht mehr beide Aussagen einzeln.</p>}
            en={<p>If <M>AB</M> and <M>BC</M> lie on one line, the parallelogram is squashed flat. Then the two vectors are parallel, and the single equation no longer gives both statements separately.</p>}
          />
        </Box>
      </Section>

      <Section id="anwendung" title={<T de="3. Anwendung: die Alternative Methode" en="3. Application: the alternative method" />}>
        <T
          de={<>
            <p>Im Fachwerk der letzten Lektion bilden <M p=",">D</M> <M p=",">E</M> <M p=",">B</M> <M>F</M> ein Parallelogramm. Die Regel sagt sofort <M>{t`\omega_5 = \omega_7`}</M> und <M p=".">{t`\omega_6 = \omega_8`}</M> Mit <M>{t`\omega_7`}</M> aus dem Fachwerk-Beispiel ist also auch <M>{t`\omega_5`}</M> bekannt. Das ist die «Alternative Methode» der Notizen: weniger Zeichnen, dafür eine Idee mehr.</p>
            <p className="keep"><b>Hinweis zur Quelle.</b> In unserem rekonstruierten Fachwerk sind die vier Winkelgeschwindigkeiten durch die Rechnung schon bestimmt. Die Regel ist dort eine Kontrolle, kein Ersatz (R-036).</p>
          </>}
          en={<>
            <p>In the truss of the last lesson, <M p=",">D</M> <M p=",">E</M> <M p=",">B</M> <M>F</M> form a parallelogram. The rule immediately gives <M>{t`\omega_5 = \omega_7`}</M> and <M p=".">{t`\omega_6 = \omega_8`}</M> With <M>{t`\omega_7`}</M> from the truss example, <M>{t`\omega_5`}</M> is known too. This is the “alternative method” of the notes: less drawing, one more idea.</p>
            <p className="keep"><b>Note on the source.</b> In our reconstructed truss the four angular velocities are already fixed by the calculation. There the rule is a check, not a replacement (R-036).</p>
          </>}
        />
        <Box kind="key" keep title={<T de="Merksatz" en="Key point" />}>
          <T
            de={<p>Parallelogramm: gegenüberliegende Stäbe, gleiches <M p=".">\omega</M> Beweis: einmal herumgehen, die Schleife muss sich schliessen.</p>}
            en={<p>Parallelogram: opposite bars, same <M p=".">\omega</M> Proof: go once around; the loop must close.</p>}
          />
        </Box>
      </Section>
    </article>
  );
}
