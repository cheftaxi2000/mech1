import { Box, De, Section, Src } from '../components/Blocks';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { trussScene } from '../viz/anim/trussScene';

const t = String.raw;

export default function L16Fachwerk() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Brücke, ein Kran, ein Dachstuhl: Alle bestehen aus geraden Stäben, die an den Enden drehbar verbunden sind. Das Skript nennt so etwas ein <b>Fachwerk</b>. Wenn sich ein Punkt bewegt, bewegen sich alle Stäbe mit. Wir bestimmen, wie schnell sich jeder Stab dreht. Das einzige Werkzeug dafür ist das <a href="#ebene-bewegung">Momentanzentrum</a>.</p>}
        en={<p className="lede">A bridge, a crane, a roof frame: all are made of straight bars joined at their ends so that they can turn. The notes call this a <b><De en="truss">Fachwerk</De></b>. When one point moves, all the bars move along. We find how fast each bar turns. The only tool for this is the <a href="#ebene-bewegung">instantaneous centre</a>.</p>}
      />

      <Section id="idee" title={<T de="1. Was ist ein Fachwerk?" en="1. What is a truss?" />}>
        <Box kind="lecture" src={<Src p="HS 2018, 27" fig="3.2" />} title={<T de="3.2 Fachwerk" en={<>3.2 Truss (<span lang="de">Fachwerk</span>)</>} />} keep>
          <T
            de={<ul>
              <li>Ideales ebenes Fachwerk: Die Stäbe sind starr.</li>
              <li>In den Knoten sind die Stäbe frei drehbar verbunden.</li>
              <li>Alle Bahnen liegen in einer Ebene.</li>
            </ul>}
            en={<ul>
              <li>Ideal plane truss: the bars are rigid.</li>
              <li>At the nodes the bars are joined so that they turn freely.</li>
              <li>All paths lie in one plane.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p>Jeder Stab ist ein <b>starrer Körper</b> in ebener Bewegung. Also gilt für jeden Stab das, was wir schon kennen: Er hat ein Momentanzentrum <M>{t`Z_i`}</M> und eine Winkelgeschwindigkeit <M p=".">{t`\omega_i`}</M> Die Geschwindigkeit eines Punktes <M>P</M> auf dem Stab ist dann senkrecht zu <M>{t`Z_iP`}</M> und hat den Betrag <M p=".">{t`\omega_i\,|Z_iP|`}</M></p>
            <p>Neu ist nur: Die Stäbe hängen aneinander. Der Knoten, in dem zwei Stäbe zusammenkommen, gehört zu beiden. Er hat <em>eine</em> Geschwindigkeit, die für beide Stäbe gleich sein muss. So wandert die Information von Stab zu Stab.</p>
          </>}
          en={<>
            <p>Each bar is a <b>rigid body</b> in plane motion. So what we already know applies to each bar: it has a centre <M>{t`Z_i`}</M> and an angular velocity <M p=".">{t`\omega_i`}</M> The velocity of a point <M>P</M> on the bar is then perpendicular to <M>{t`Z_iP`}</M> and has magnitude <M p=".">{t`\omega_i\,|Z_iP|`}</M></p>
            <p>The only new thing: the bars hang on each other. The node where two bars meet belongs to both. It has <em>one</em> velocity, and it must be the same for both bars. That is how information travels from bar to bar.</p>
          </>}
        />
      </Section>

      <Section id="beispiel" title={<T de="2. Das Beispiel: alle Stäbe auf einmal" en="2. The example: all bars at once" />}>
        <Box kind="lecture" src={<Src p="HS 2018, 27" fig="Fig. 3.24" />} title={<T de="Figur 3.24" en="Figure 3.24" />} keep>
          <T
            de={<p>Gegeben: die Geschwindigkeit <M>{t`\v{v}_B`}</M> des Rollenlagers <M p=",">B</M> das sich waagrecht bewegt, und das feste Lager <M p=".">A</M> Gesucht: <M>{t`Z_i`}</M> und <M>{t`\omega_i`}</M> aller Stäbe.</p>}
            en={<p>Given: the velocity <M>{t`\v{v}_B`}</M> of the roller support <M p=",">B</M> which moves horizontally, and the fixed support <M p=".">A</M> Wanted: <M>{t`Z_i`}</M> and <M>{t`\omega_i`}</M> of all bars.</p>}
          />
        </Box>
        <T
          de={<p>Die Skizze zeigt die Stäbe 1 bis 8. Die Stäbe 1 bis 5 bilden zusammen <em>einen</em> starren Körper, der sich um <M>A</M> dreht. Stab 8 hängt an <M>B</M> und an <M p=".">E</M> Die Stäbe 6 und 7 schliessen die Raute <M p=".">DEBF</M> Spielen Sie die sechs Schritte ab.</p>}
          en={<p>The sketch shows bars 1 to 8. Bars 1 to 5 together form <em>one</em> rigid body turning about <M p=".">A</M> Bar 8 hangs on <M>B</M> and on <M p=".">E</M> Bars 6 and 7 close the rhombus <M p=".">DEBF</M> Play the six steps.</p>}
        />
        <StepPlayer
          label="Fig. 3.24"
          steps={[
            { ms: 1600, caption: <T de={<>Gegeben ist nur <M>{t`\v{v}_B`}</M> und dass <M>B</M> auf einer waagrechten Rolle gleitet.</>} en={<>All we are given is <M p=",">{t`\v{v}_B`}</M> and that <M>B</M> slides on a horizontal roller.</>} /> },
            { ms: 2400, caption: <T de={<>Stäbe 1 bis 5 sind ein Körper mit <M p=",">{t`Z_{1\text{-}5} \equiv A`}</M> weil <M>A</M> festgehalten wird. Also steht <M>{t`\v{v}_C`}</M> senkrecht auf <M p=",">AC</M> ebenso <M>{t`\v{v}_D`}</M> und <M>{t`\v{v}_E`}</M> senkrecht auf <M>AD</M> und <M p=".">AE</M> Das sind erst Richtungen.</>} en={<>Bars 1 to 5 are one body with <M p=",">{t`Z_{1\text{-}5} \equiv A`}</M> because <M>A</M> is held fixed. So <M>{t`\v{v}_C`}</M> is perpendicular to <M p=",">AC</M> and likewise <M>{t`\v{v}_D`}</M> and <M>{t`\v{v}_E`}</M> to <M>AD</M> and <M p=".">AE</M> These are directions only.</>} /> },
            { ms: 3000, caption: <T de={<>Stab 8: <M>{t`\v{v}_B`}</M> ist waagrecht, also liegt <M>{t`Z_8`}</M> senkrecht unter <M p=".">B</M> <M>{t`\v{v}_E`}</M> steht senkrecht auf <M p=",">AE</M> also liegt <M>{t`Z_8`}</M> auch auf der Geraden <M p=".">AE</M> Der Schnittpunkt ist <M p=",">{t`Z_8`}</M> und es gilt <M>{t`|Z_8B| = L/2`}</M> und <M p=".">{t`\omega_8 = 2v/L`}</M></>} en={<>Bar 8: <M>{t`\v{v}_B`}</M> is horizontal, so <M>{t`Z_8`}</M> lies straight below <M p=".">B</M> <M>{t`\v{v}_E`}</M> is perpendicular to <M p=",">AE</M> so <M>{t`Z_8`}</M> also lies on the line <M p=".">AE</M> Their intersection is <M p=",">{t`Z_8`}</M> with <M>{t`|Z_8B| = L/2`}</M> and <M p=".">{t`\omega_8 = 2v/L`}</M></>} /> },
            { ms: 3000, caption: <T de={<>Jetzt ist <M>{t`\v{v}_E = \omega_8 \times Z_8E`}</M> bekannt. Der Körper 1 bis 5 dreht sich um <M p=",">A</M> also folgt <M p=".">{t`\omega_{1\text{-}5} = v/L`}</M> Damit sind auch <M>{t`\v{v}_D`}</M> und <M>{t`\v{v}_C`}</M> bekannt.</>} en={<>Now <M>{t`\v{v}_E = \omega_8 \times Z_8E`}</M> is known. Body 1 to 5 turns about <M p=",">A</M> so <M p=".">{t`\omega_{1\text{-}5} = v/L`}</M> With it <M>{t`\v{v}_D`}</M> and <M>{t`\v{v}_C`}</M> are known too.</>} /> },
            { ms: 3000, caption: <T de={<>Stab 6 (<M p="):">DF</M> <M>{t`\v{v}_F`}</M> steht senkrecht zu <M>DF</M> (SdpG, <M>{t`\v{v}_D`}</M> hat dort keinen Anteil), und seine waagrechte Komponente ist die von <M>{t`\v{v}_B`}</M> (SdpG an Stab 7). Also <M p=",">{t`\v{v}_F = (-v, -v)`}</M> <M>{t`Z_6`}</M> ist die Mitte von <M>DF</M> und <M p=".">{t`\omega_6 = 2v/L`}</M></>} en={<>Bar 6 (<M p="):">DF</M> <M>{t`\v{v}_F`}</M> is perpendicular to <M>DF</M> (projected velocities, <M>{t`\v{v}_D`}</M> has no part there), and its horizontal part is that of <M>{t`\v{v}_B`}</M> (projected velocities on bar 7). So <M p=",">{t`\v{v}_F = (-v, -v)`}</M> <M>{t`Z_6`}</M> is the middle of <M>DF</M> and <M p=".">{t`\omega_6 = 2v/L`}</M></>} /> },
            { ms: 2600, caption: <T de={<>Stab 7 (<M p="):">FB</M> <M>{t`Z_7`}</M> liegt im Abstand <M>L</M> unter <M p=",">B</M> und <M p=".">{t`\omega_7 = v/L`}</M> Alle Winkelgeschwindigkeiten sind bekannt.</>} en={<>Bar 7 (<M p="):">FB</M> <M>{t`Z_7`}</M> lies at distance <M>L</M> below <M p=",">B</M> and <M p=".">{t`\omega_7 = v/L`}</M> All angular velocities are known.</>} /> },
          ]}
        >
          {(step, tt) => <AnimFigure build={trussScene} step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p className="keep">Das Rezept: <b>Beginne dort, wo ein Stab festgehalten wird</b> (Gelenk <M p=").">A</M> Zeichne die Senkrechten auf die bekannten oder erlaubten Geschwindigkeitsrichtungen. Wo sich zwei Senkrechte schneiden, liegt ein Momentanzentrum. Danach gib die Geschwindigkeit über den nächsten Knoten an den nächsten Stab weiter.</p>}
          en={<p className="keep">The recipe: <b>start where a bar is held</b> (pin <M p=").">A</M> Draw perpendiculars to the known or allowed velocity directions. Where two perpendiculars cross lies an instantaneous centre. Then pass the velocity on through the next node to the next bar.</p>}
        />
      </Section>

      <Section id="ve" title={<T de={<>3. Drei Wege zu <M>{t`\v{v}_E`}</M></>} en={<>3. Three ways to <M>{t`\v{v}_E`}</M></>} />}>
        <Box kind="lecture" src={<Src p="HS 2018, 28" />} title={<T de="Drei Methoden für die Geschwindigkeit von E" en="Three methods for the velocity of E" />} keep>
          <T
            de={<p>Die Notizen zeigen mehrere Rechnungen für <M p=",">{t`\v{v}_E`}</M> die zum selben Ergebnis führen: (1) über <M>{t`Z_8`}</M> und <M p=",">{t`\omega_8`}</M> (2) über den Körper 1 bis 5 um <M p=",">A</M> (3) über die Hilfspunkte auf Stab 8 mit der Geschwindigkeit <M>{t`\v{v}_B`}</M> als Ausgangspunkt.</p>}
            en={<p>The notes show several calculations of <M>{t`\v{v}_E`}</M> that lead to the same result: (1) through <M>{t`Z_8`}</M> and <M p=",">{t`\omega_8`}</M> (2) through body 1 to 5 about <M p=",">A</M> (3) through helper points on bar 8, starting from the velocity <M p=".">{t`\v{v}_B`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p>Mit <M>{t`v = 1`}</M> und <M>{t`L = 1`}</M> kommt immer <M>{t`\v{v}_E = (1,\,2)`}</M> heraus (und <M p=",">{t`\v{v}_D = (1,\,1)`}</M> <M p=").">{t`\v{v}_C = (0,\,1)`}</M> Das prüft ein Test unabhängig von der Zeichnung. Verschiedene Wege, gleiches Ergebnis: Das ist die beste Kontrolle, die man bei einer solchen Aufgabe hat.</p>
            <p className="keep"><b>Kontrolle mit der SdpG.</b> Entlang jedes Stabes müssen die Projektionen der Geschwindigkeiten seiner beiden Enden gleich sein. Wenn das nicht stimmt, hat man sich verzeichnet.</p>
          </>}
          en={<>
            <p>With <M>{t`v = 1`}</M> and <M>{t`L = 1`}</M> the result is always <M>{t`\v{v}_E = (1,\,2)`}</M> (and <M p=",">{t`\v{v}_D = (1,\,1)`}</M> <M p=").">{t`\v{v}_C = (0,\,1)`}</M> A test checks this independently of the drawing. Different routes, same result: that is the best check you have in a problem like this.</p>
            <p className="keep"><b>Check with projected velocities.</b> Along each bar, the projections of the velocities of its two ends must be equal. If not, the drawing is off.</p>
          </>}
        />
        <Box kind="misconception" title={<T de="Häufiger Fehler" en="Common mistake" />}>
          <T
            de={<p>Alle Stäbe hätten dieselbe Winkelgeschwindigkeit. Falsch: Jeder Stab hat sein eigenes <M p=".">{t`Z_i`}</M> Hier ist <M>{t`\omega_8 = 2v/L`}</M> doppelt so gross wie <M p=".">{t`\omega_{1\text{-}5} = v/L`}</M> Nur in einem Parallelogramm drehen sich gegenüberliegende Stäbe gleich (siehe nächste Lektion).</p>}
            en={<p>All bars would have the same angular velocity. Wrong: every bar has its own <M p=".">{t`Z_i`}</M> Here <M>{t`\omega_8 = 2v/L`}</M> is twice <M p=".">{t`\omega_{1\text{-}5} = v/L`}</M> Only in a parallelogram do opposite bars turn alike (see the next lesson).</p>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Zur Skizze (R-036)" en="About the sketch (R-036)" />}>
          <T
            de={<p>Die Skizze der Notizen ist unscharf. Wir haben die Geometrie aus den handgeschriebenen Zahlen rekonstruiert und alle Werte nachgerechnet: Sie stimmen. Die Stabnummern 7 und 9 und die Hilfspunkte sind dabei nicht sicher lesbar. Das Ergebnis hängt nicht davon ab.</p>}
            en={<p>The sketch in the notes is blurry. We rebuilt the geometry from the handwritten numbers and recomputed every value: they agree. The bar numbers 7 and 9 and the helper points are not reliably legible. The result does not depend on them.</p>}
          />
        </Box>
      </Section>

      <Section id="verbindungen" title={<T de="4. Verbindungen" en="4. Connections" />}>
        <Box kind="key" keep title={<T de="Merksatz" en="Key point" />}>
          <T
            de={<p>Ein Fachwerk wird Stab für Stab gelöst: Jeder Stab hat ein Momentanzentrum. Ein festes Lager ist ein Momentanzentrum. Eine Rolle gibt die Richtung vor, in der sich der Punkt bewegt, also liegt das Zentrum auf der Senkrechten dazu. Der gemeinsame Knoten gibt die Geschwindigkeit weiter.</p>}
            en={<p>A truss is solved bar by bar: each bar has an instantaneous centre. A fixed support is a centre. A roller fixes the direction in which the point moves, so the centre lies on the perpendicular to it. The common node passes the velocity on.</p>}
          />
        </Box>
        <T
          de={<p>Warum wir die Raute <M>DEBF</M> brauchen: Sie ist ein Parallelogramm, und für ein Parallelogramm gibt es eine Abkürzung – die <a href="#parallelogramm">Parallelogrammregel</a>.</p>}
          en={<p>Why the rhombus <M>DEBF</M> matters: it is a parallelogram, and parallelograms have a shortcut – the <a href="#parallelogramm">parallelogram rule</a>.</p>}
        />
      </Section>
    </article>
  );
}
