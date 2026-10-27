import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { P } from '../info/cpp/programs';
import { ExprTree } from '../viz/info/ExprTree';
import { Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I2Vorrang() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wie liest C++ eine Zeile wie <K>32 + 9 * celsius / 5</K>? Die Antwort besteht aus vier Regeln, die jeden Ausdruck zu einem Baum machen. Dieser Baum legt fest, <em>was</em> berechnet wird, aber nicht ganz, <em>in welcher Reihenfolge</em>. Genau diese Lücke führt zu den heimtückischsten Fehlern der Sprache.</p>}
        en={<p className="lede">How does C++ read a line like <K>32 + 9 * celsius / 5</K>? The answer consists of four rules that turn every expression into a tree. That tree fixes <em>what</em> is computed, but not entirely <em>in which order</em>. Exactly this gap leads to the most treacherous errors of the language.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="programm" title={<T de="1. Ein Programm mit einem Ausdruck" en="1. A program with an expression" />}>
        <Box kind="lecture" src={<Src p="30–31" fig="Code 3.1" />} title={<T de="Celsius nach Fahrenheit" en="Celsius to Fahrenheit" />}>
          <T
            de={<ul>
              <li>Code 3.1 rechnet eine Temperatur von Grad Celsius in Grad Fahrenheit um. Für die Eingabe 15 erscheint <K>15 degrees Celsius are 59 degrees Fahrenheit</K>. Tatsächlich ist <M p=".">{t`32 + 9\cdot 15/5 = 32 + 27 = 59`}</M></li>
              <li>C++ wertet den Ausdruck also mathematisch sinnvoll aus. Das ist nicht selbstverständlich: Ein sehr alter Taschenrechner, der strikt von links nach rechts rechnet, ergäbe etwas anderes.</li>
              <li>Der Ausdruck <K>32 + 9 * celsius / 5</K> enthält drei Literale (32, 9, 5), eine Variable (<K>celsius</K>) und drei Operatoren (<K>+</K>, <K>*</K>, <K>/</K>). Welche Klammerung ist gemeint? Das beantworten <b>Vorrang</b> und <b>Assoziativität</b>.</li>
            </ul>}
            en={<ul>
              <li>Code 3.1 converts a temperature from degrees Celsius to degrees Fahrenheit. For the input 15 it prints <K>15 degrees Celsius are 59 degrees Fahrenheit</K>. Indeed <M p=".">{t`32 + 9\cdot 15/5 = 32 + 27 = 59`}</M></li>
              <li>So C++ evaluates the expression in a mathematically sensible way. That is not obvious: a very old pocket calculator that computes strictly from left to right would give something else.</li>
              <li>The expression <K>32 + 9 * celsius / 5</K> contains three literals (32, 9, 5), a variable (<K>celsius</K>) and three operators (<K>+</K>, <K>*</K>, <K>/</K>). Which parenthesization is meant? <b>Precedence</b> and <b>associativity</b> answer that.</li>
            </ul>}
          />
        </Box>
        <Tracer prog={P.fahrenheit} inputs={['15\n', '0\n', '-40\n']} label="Code 3.1" />
        <T
          de={<p>Die alte Rechnung «von links nach rechts» wäre <M p=",">{t`((32+9)\cdot 15)/5 = 123`}</M> also weit daneben (I-004). Dass C++ stattdessen 59 liefert, liegt an den Regeln unten, nicht an einem besonderen Trick des Rechners.</p>}
          en={<p>The old “left to right” computation would be <M p=",">{t`((32+9)\cdot 15)/5 = 123`}</M> far off (I-004). That C++ yields 59 instead is due to the rules below, not to a special trick of the computer.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="regeln" title={<T de="2. Die vier Regeln" en="2. The four rules" />}>
        <Box kind="lecture" src={<Src p="31–32" />} title={<T de="Vorrang, Assoziativität, Stelligkeit, Klammern" en="Precedence, associativity, arity, parentheses" />}>
          <T
            de={<ol>
              <li><b>Vorrang.</b> Multiplikative Operatoren (<K>*</K>, <K>/</K>, <K>%</K>) binden stärker als additive (<K>+</K>, <K>-</K>). Also ist <K>32 + 9 * celsius / 5</K> dasselbe wie <K>32 + (9 * celsius / 5)</K>.</li>
              <li><b>Assoziativität.</b> Die arithmetischen Operatoren (<K>*</K>, <K>/</K>, <K>%</K>, <K>+</K>, <K>-</K>) sind <b>linksassoziativ</b>: Bei gleichem Vorrang wird von links nach rechts ausgewertet. Also <K>32 + ((9 * celsius) / 5)</K>.</li>
              <li><b>Stelligkeit.</b> Die unären Operatoren <K>+</K>, <K>-</K> binden stärker als die binären. <K>-3 - 4</K> ist <K>(-3) - 4</K>, nicht <K>-(3 - 4)</K>.</li>
              <li><b>Klammern</b> überschreiben alles: Sie sind stärker als Vorrang und Assoziativität.</li>
            </ol>}
            en={<ol>
              <li><b>Precedence.</b> Multiplicative operators (<K>*</K>, <K>/</K>, <K>%</K>) bind more strongly than additive ones (<K>+</K>, <K>-</K>). So <K>32 + 9 * celsius / 5</K> is the same as <K>32 + (9 * celsius / 5)</K>.</li>
              <li><b>Associativity.</b> The arithmetic operators (<K>*</K>, <K>/</K>, <K>%</K>, <K>+</K>, <K>-</K>) are <b>left associative</b>: operators of the same precedence are evaluated from left to right. So <K>32 + ((9 * celsius) / 5)</K>.</li>
              <li><b>Arity.</b> The unary operators <K>+</K>, <K>-</K> bind more strongly than the binary ones. <K>-3 - 4</K> is <K>(-3) - 4</K>, not <K>-(3 - 4)</K>.</li>
              <li><b>Parentheses</b> override everything: they are stronger than precedence and associativity.</li>
            </ol>}
          />
        </Box>
        <T
          de={<p>Aus diesen vier Regeln folgt: <b>Jeder Ausdruck lässt sich eindeutig vollständig klammern.</b> Probiere es unten aus. Das Feld «Der Compiler liest» zeigt die Klammerung, die C++ intern verwendet; sie wird aus dem Ausdruck berechnet. Beachte, dass C++ keine Gesetze wie Assoziativität der Addition «kennt»: <K>a - b - c</K> ist <em>immer</em> <K>(a - b) - c</K>, egal ob das Ergebnis gleich wäre.</p>}
          en={<p>From these four rules it follows: <b>every expression can be fully parenthesized unambiguously.</b> Try it below. The line “The compiler reads” shows the parenthesization C++ uses internally; it is computed from the expression. Note that C++ does not “know” laws like associativity of addition: <K>a - b - c</K> is <em>always</em> <K>(a - b) - c</K>, whether or not the result would be the same.</p>}
        />
        <ExprTree presets={[
          { src: '32 + 9 * celsius / 5', vars: { celsius: 15 } },
          { src: '10 - 4 - 3', vars: {} },
          { src: '-3 - 4', vars: {} },
          { src: '(32 + 9) * celsius', vars: { celsius: 15 } },
          { src: '2 * 3 % 4', vars: {} },
        ]} />
        <Predict
          prompt={<T de={<>Wie klammert C++ <K>100 / 10 / 5</K>, und was kommt heraus? Und was bei <K>100 / (10 / 5)</K>?</>} en={<>How does C++ parenthesize <K>100 / 10 / 5</K>, and what is the result? And for <K>100 / (10 / 5)</K>?</>} />}
          answer={<T
            de={<>Linksassoziativ: <K>(100 / 10) / 5</K>, also <K>10 / 5 = 2</K>. Mit der Klammer rechts dagegen <K>100 / 2 = 50</K>. Die Division ist weder kommutativ noch assoziativ, deshalb muss die Regel genau festgelegt sein, und deshalb darfst du dich darauf verlassen.</>}
            en={<>Left associative: <K>(100 / 10) / 5</K>, so <K>10 / 5 = 2</K>. With the parenthesis on the right instead <K>100 / 2 = 50</K>. Division is neither commutative nor associative, which is why the rule has to be fixed exactly, and why you can rely on it.</>}
          />}
        />
        <Box kind="tip" title={<T de="Im Zweifel klammern" en="When in doubt, parenthesize" />}>
          <T
            de={<ul>
              <li><b>Überzählige Klammern kosten nichts.</b> Der Compiler erzeugt denselben Code. Sie sind eine Information für den Leser: <K>(a * b) + c</K> sagt «ich habe darüber nachgedacht».</li>
              <li><b>Lesen mit dem Baum im Kopf:</b> Zuerst den Operator mit dem <em>schwächsten</em> Vorrang suchen (er steht an der Wurzel), dann links und rechts davon dasselbe wiederholen.</li>
              <li><b>Bei gleichem Vorrang von links.</b> <K>a - b + c</K> ist <K>(a - b) + c</K>, was bei <K>a - (b + c)</K> sofort anders wäre.</li>
            </ul>}
            en={<ul>
              <li><b>Extra parentheses cost nothing.</b> The compiler generates the same code. They are information for the reader: <K>(a * b) + c</K> says “I thought about this”.</li>
              <li><b>Reading with the tree in mind:</b> first find the operator with the <em>weakest</em> precedence (it sits at the root), then repeat the same left and right of it.</li>
              <li><b>Equal precedence from the left.</b> <K>a - b + c</K> is <K>(a - b) + c</K>, which would be different at once for <K>a - (b + c)</K>.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="baum" title={<T de="3. Ausdrucksbaum und Auswertungsreihenfolge" en="3. Expression tree and evaluation order" />}>
        <Box kind="lecture" src={<Src p="32–34" fig="Fig. 3.1–3.4" />} title={<T de="Ausdrucksbäume" en="Expression trees" />}>
          <T
            de={<ul>
              <li>Ein <b>Ausdrucksbaum</b> bildet die Klammerung ab: Die zwei Operanden eines Operators hängen am Operator-Knoten. Er zeigt: Das Ergebnis einer Operation kann erst berechnet werden, wenn ihre Operanden ausgewertet sind.</li>
              <li>In der Informatik zeichnet man Bäume «hängend», die Wurzel oben. Jeder Knoten hat null oder mehr Kinder, jeder Knoten ausser der Wurzel genau einen Elternknoten.</li>
              <li>Eine Auswertungsreihenfolge ist <b>gültig</b>, wenn jeder Knoten nach seinen Kindern ausgewertet wird. Weitere Regeln gibt es nicht: Die Reihenfolge ist <b>nicht eindeutig</b> bestimmt. In <K>(a+b) * (a-b)</K> ist nicht festgelegt, ob zuerst <K>a+b</K> oder <K>a-b</K> berechnet wird.</li>
              <li>Ein Ausdruck ist <b>«gut»</b>, wenn jede gültige Reihenfolge dasselbe Ergebnis liefert. <K>a * (a = 2)</K> ist «schlecht»: Mit <K>a = 1</K> ergibt sich 4, wenn zuerst die Zuweisung läuft, und 2, wenn zuerst <K>a</K> gelesen wird.</li>
              <li><b>Richtlinie:</b> Ändere keine Variable, die im selben Ausdruck mehr als einmal vorkommt.</li>
            </ul>}
            en={<ul>
              <li>An <b>expression tree</b> reflects the parenthesization: the two operands of an operator hang on the operator node. It shows: the result of an operation can only be computed once its operands have been evaluated.</li>
              <li>In computer science trees are drawn “hanging”, the root on top. Every node has zero or more children, every node except the root exactly one parent.</li>
              <li>An evaluation order is <b>valid</b> if every node is evaluated after its children. There are no further rules: the order is <b>not uniquely</b> determined. In <K>(a+b) * (a-b)</K> it is not fixed whether <K>a+b</K> or <K>a-b</K> is computed first.</li>
              <li>An expression is <b>“good”</b> if every valid order gives the same result. <K>a * (a = 2)</K> is “bad”: with <K>a = 1</K> it gives 4 if the assignment runs first, and 2 if <K>a</K> is read first.</li>
              <li><b>Guideline:</b> do not modify a variable that appears more than once in the same expression.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Hier kannst du selbst auswerten. Hervorgehobene Knoten sind <em>bereit</em>: Alle ihre Operanden haben schon einen Wert. Klicke sie in beliebiger gültiger Reihenfolge an. Beim guten Ausdruck <K>(a + b) * (a - b)</K> kommt immer dasselbe heraus; beim schlechten <K>a * (a = 2)</K> hängt es von deinen Klicks ab, und die Zeile unter dem Baum nennt alle möglichen Ergebnisse.</p>}
          en={<p>Here you can evaluate yourself. Highlighted nodes are <em>ready</em>: all their operands already have a value. Click them in any valid order. With the good expression <K>(a + b) * (a - b)</K> the same comes out every time; with the bad one <K>a * (a = 2)</K> it depends on your clicks, and the line under the tree names all possible results.</p>}
        />
        <ExprTree showParens={false} presets={[
          { src: '(a + b) * (a - b)', vars: { a: 5, b: 3 } },
          { src: 'a * (a = 2)', vars: { a: 1 } },
          { src: '32 + 9 * celsius / 5', vars: { celsius: 15 } },
        ]} />
        <T
          de={<p>Warum «gut» in der Mathematik selbstverständlich ist und in C++ nicht? Ein mathematischer Term hat nur einen Wert und keine Nebenwirkung. In C++ kann ein Teilausdruck eine Variable <em>verändern</em> (<K>a = 2</K>), und ein anderer Teilausdruck liest sie. Welcher zuerst drankommt, hat der Standard bewusst offengelassen: Der Compiler darf die schnellere Reihenfolge wählen. Verlass dich nie darauf, was ein bestimmter Compiler heute tut.</p>}
          en={<p>Why “good” is obvious in mathematics and not in C++? A mathematical term has only a value and no side effect. In C++ a subexpression can <em>modify</em> a variable (<K>a = 2</K>) while another subexpression reads it. Which one goes first, the standard deliberately left open: the compiler may choose the faster order. Never rely on what a particular compiler does today.</p>}
        />
        <Box kind="supplement" title={<T de="Die Baumordnung ist der Maschinencode" en="The tree order is the machine code" />}>
          <T
            de={<p>Eine gültige Reihenfolge ist die «Nachordnung» des Baums: Kinder zuerst, dann der Knoten. Für <K>32 + 9 * celsius / 5</K> ergibt das <K>9, celsius, *, 5, /, 32, +</K>. Genau so arbeitet eine einfache Maschine: Operanden holen, verknüpfen, Zwischenergebnis merken. Der Baum ist also nicht nur eine Zeichnung, sondern der Plan für die Befehlsfolge im Prozessor, wie beim Schachtel-Rechner aus der ersten Lektion.</p>}
            en={<p>A valid order is the “postorder” of the tree: children first, then the node. For <K>32 + 9 * celsius / 5</K> that gives <K>9, celsius, *, 5, /, 32, +</K>. A simple machine works exactly like that: fetch operands, combine them, remember the intermediate result. The tree is thus not just a drawing but the plan for the sequence of instructions in the processor, like the box computer of the first lesson.</p>}
          />
        </Box>
        <Choice
          question={<T de={<>Welche dieser Ausdrücke sind «gut» im Sinne der Richtlinie (jede gültige Reihenfolge, gleiches Ergebnis)?</>} en={<>Which of these expressions are “good” in the sense of the guideline (every valid order, same result)?</>} />}
          choices={[
            { text: <code>(a + b) * (a - b)</code>, correct: true, why: <T de={<>Ja: Die Teilausdrücke lesen <K>a</K> und <K>b</K> nur, keiner verändert etwas. Die Reihenfolge ist egal.</>} en={<>Yes: the subexpressions only read <K>a</K> and <K>b</K>, none modifies anything. The order does not matter.</>} /> },
            { text: <code>a * (a = 2)</code>, why: <T de={<>Nein: Die Zuweisung ändert <K>a</K>, und <K>a</K> wird im selben Ausdruck auch gelesen. Das Ergebnis hängt von der Reihenfolge ab (2 oder 4).</>} en={<>No: the assignment modifies <K>a</K>, and <K>a</K> is also read in the same expression. The result depends on the order (2 or 4).</>} /> },
            { text: <code>a + a * a</code>, correct: true, why: <T de={<>Ja: Auch wenn <K>a</K> dreimal vorkommt, wird es nur gelesen. Die Richtlinie verbietet das <em>Ändern</em>, nicht das mehrfache Lesen.</>} en={<>Yes: even though <K>a</K> appears three times, it is only read. The guideline forbids <em>modifying</em>, not reading several times.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Typische Missverständnisse" en="4. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de="«C++ rechnet von links nach rechts.»" en="“C++ computes from left to right.”" />}>
          <T
            de={<>Nur bei <em>gleichem</em> Vorrang. Zuerst entscheidet der Vorrang (<K>*</K> vor <K>+</K>), erst dann die Assoziativität. <K>1 + 2 * 3</K> ist 7, nicht 9.</>}
            en={<>Only for <em>equal</em> precedence. Precedence decides first (<K>*</K> before <K>+</K>), only then associativity. <K>1 + 2 * 3</K> is 7, not 9.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Weil der Baum eindeutig ist, ist auch die Reihenfolge eindeutig.»" en="“Since the tree is unambiguous, so is the order.”" />}>
          <T
            de={<>Der Baum legt fest, <em>was</em> womit verknüpft wird, nicht, <em>wann</em> die Teile ausgewertet werden. Zwei Geschwister-Teilbäume dürfen in beliebiger Reihenfolge laufen. Ob das einen Unterschied macht, hängt von Nebenwirkungen ab.</>}
            en={<>The tree fixes <em>what</em> is combined with what, not <em>when</em> the parts are evaluated. Two sibling subtrees may run in any order. Whether that makes a difference depends on side effects.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Gesetze der Mathematik (Assoziativität) gelten in C++ automatisch.»" en="“The laws of mathematics (associativity) hold in C++ automatically.”" />}>
          <T
            de={<>C++ wertet nach Vorrang und Assoziativitätsregel aus und kennt keine Umformungsgesetze. Das wird später wichtig: Schon bei Kommazahlen und beim Überlauf von <K>int</K> liefern mathematisch gleiche Umformungen verschiedene Ergebnisse.</>}
            en={<>C++ evaluates by the precedence and associativity rules and knows no transformation laws. That matters later: already for floating point numbers and <K>int</K> overflow, mathematically equal rearrangements give different results.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Vier Regeln legen die Klammerung fest: Punkt vor Strich, linksassoziativ bei gleichem Vorrang, unär vor binär, Klammern über allem.</li>
              <li>Der Ausdrucksbaum zeigt die Klammerung. Jede Reihenfolge, bei der Kinder vor Eltern kommen, ist gültig, und es gibt meist mehrere.</li>
              <li>Ein Ausdruck ist gut, wenn alle gültigen Reihenfolgen dasselbe ergeben. Ändere nie eine Variable, die im selben Ausdruck noch einmal vorkommt.</li>
              <li>Im Zweifel klammern: Das kostet nichts und hilft dem Leser.</li>
            </ul>}
            en={<ul>
              <li>Four rules fix the parenthesization: multiplication before addition, left associative for equal precedence, unary before binary, parentheses above all.</li>
              <li>The expression tree shows the parenthesization. Every order in which children come before parents is valid, and there are usually several.</li>
              <li>An expression is good if all valid orders give the same result. Never modify a variable that appears again in the same expression.</li>
              <li>When in doubt, parenthesize: it costs nothing and helps the reader.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Die Operatoren im Einzelnen: die rechtsassoziative Zuweisung, die ganzzahlige Division mit Rest, <K>++</K> und <K>+=</K> (Skript S. 34–36).</p>}
          en={<p className="connections"><b>Next:</b> the operators in detail: the right associative assignment, integer division with remainder, <K>++</K> and <K>+=</K> (notes pp. 34–36).</p>}
        />
      </Section>
    </article>
  );
}
