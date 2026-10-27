import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I7Bitfolgen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Fakultät und grösster gemeinsamer Teiler gehen genauso gut mit einer Schleife. Wozu dann Rekursion? Dieses Beispiel ist die Antwort: Alle Bitfolgen der Länge <K>n</K> aufzuzählen ist mit Rekursion eine Handvoll Zeilen und ohne sie ein Kopfzerbrechen. Wichtiger als die Lösung ist hier die <em>Frage</em>, die man stellen lernt: «Welche Teilprobleme gibt es, bei denen die Lösung einfach würde, wenn ich sie schon hätte?»</p>}
        en={<p className="lede">Factorial and greatest common divisor work just as well with a loop. So why recursion? This example is the answer: enumerating all bit strings of length <K>n</K> is a handful of lines with recursion and a headache without. More important than the solution is the <em>question</em> one learns to ask: “Which subproblems exist such that the solution would become easy if I already had them?”</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="problem" title={<T de="1. Das Problem" en="1. The problem" />}>
        <Box kind="lecture" src={<Src p="123" />} title={<T de="Alle Bitfolgen der Länge n" en="All bit strings of length n" />}>
          <T
            de={<>
              <p>Bisher haben wir zwei Probleme mit Rekursion gelöst (Fakultät und Euklid). Beide haben auch eine einfache <b>iterative</b> Lösung (mit einer Schleife statt Rekursion). Was soll Rekursion dann? Sie kann einfache Probleme (wie die Fakultät) tatsächlich verkomplizieren. Es gibt aber zahlreiche Probleme mit intuitiver und eleganter rekursiver Lösung, für die keine einfache nicht-rekursive Lösung zu existieren scheint. Ein Beispiel ist das Erzeugen aller Bitfolgen der Länge <M>n</M> (Beispiel 10.1, hier <M p="):">{t`n = 6`}</M> <K>000000</K>, <K>000001</K>, <K>000010</K>, <K>000011</K>, …, <K>111110</K>, <K>111111</K>.</p>
              <p>Nebenbemerkung (nicht prüfungsrelevant): Es gibt eine einfache iterative Lösung, nämlich von 0 bis <M>{t`2^n - 1`}</M> zu zählen und nach jedem Schritt die Binärdarstellung des <K>int</K> abzulesen:</p>
              <Code code={'#include <bitset>\nfor (int x = 0; x < 64; ++x)\n    std::cout << std::bitset<6>(x) << "\\n";'} />
              <p>Nehmen wir aber an, dieses «Mogeln» durch Zugriff auf das Bitmuster einer Ganzzahl sei nicht erlaubt!</p>
            </>}
            en={<>
              <p>So far, we have seen two problems (factorial and Euclid’s algorithm for the greatest common divisor) solved with recursion. Both problems also admit an easy <b>iterative</b> (i.e., non-recursive, using a loop instead of recursion) solution. So what is even the point of recursion? Offering a more complicated solution to a simple problem? It turns out that while recursion indeed might overcomplicate easy problems (such as factorial), there are numerous problems that offer an intuitive and elegant recursive solution while no simple non-recursive solution seems to exist. One example is the problem of generating all bit strings of length <M>n</M> (Example 10.1, here <M p="):">{t`n = 6`}</M> <K>000000</K>, <K>000001</K>, <K>000010</K>, <K>000011</K>, …, <K>111110</K>, <K>111111</K>.</p>
              <p>As a side remark (not exam-relevant), there is an easy iterative solution: we can count from 0 to <M>{t`2^n - 1`}</M> and read the binary representation of the <K>int</K> after every step:</p>
              <Code code={'#include <bitset>\nfor (int x = 0; x < 64; ++x)\n    std::cout << std::bitset<6>(x) << "\\n";'} />
              <p>But let us suppose that this kind of cheating by accessing the bit pattern of an integer is not allowed!</p>
            </>}
          />
        </Box>
        <T
          de={<p>(Der Test in diesem Projekt führt beide Wege mit g++ aus und prüft, dass sie für <K>n = 6</K> dieselben 64 Zeilen ausgeben.) Wie geht man vor, wenn man die Bits nicht abliest? Man zählt <em>nicht</em>, man <em>entscheidet</em>.</p>}
          en={<p>(This project’s test runs both ways with g++ and checks that they print the same 64 lines for <K>n = 6</K>.) How does one proceed if one does not read off the bits? One does <em>not</em> count, one <em>decides</em>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="idee" title={<T de="2. Die Idee: Bit für Bit entscheiden" en="2. The idea: deciding bit by bit" />}>
        <Box kind="lecture" src={<Src p="123–125" />} title={<T de="Zwei Fragen für jedes rekursive Problem" en="Two questions for every recursive problem" />}>
          <T
            de={<>
              <p>Wie gehen wir das Problem systematisch an? Wir können mit der leeren Folge beginnen und in jedem Schritt entweder ein Bit 0 oder ein Bit 1 anhängen, bis die gewünschte Länge erreicht ist (Abbildung 10.2). Iterativ, mit Schleifen, wäre das mühsam: Wir müssten alle getroffenen Entscheidungen nachhalten (wurde 0 oder 1 angehängt, was kommt als Nächstes?), um irgendwie über alle Bitfolgen zu iterieren.</p>
              <p>Mit Rekursion wird die Aufgabe dagegen deutlich leichter. Beim Entwurf eines rekursiven Algorithmus ist es immer lehrreich, die folgende Frage zu stellen: <b>«Welche Teilprobleme gibt es, bei denen die Gesamtlösung einfach würde, wenn wir die Lösungen dieser Teilprobleme hätten?»</b></p>
              <p>Bei der Fakultät: Hätten wir die Lösung des Teilproblems «Fakultät von <M>{t`n-1`}</M>», wäre das Gesamtproblem einfach (eine Multiplikation mit <M p=").">n</M> Woher kennen wir die Fakultät von <M p="?">{t`n-1`}</M> Würden wir die von <M>{t`n-2`}</M> kennen, kennten wir die von <M p=".">{t`n-1`}</M> Und so weiter.</p>
              <p>Bei den Bitfolgen: Wüssten wir, wie man alle Bitfolgen der Länge <M>n</M> erzeugt, die mit 0 beginnen, und alle, die mit 1 beginnen, könnten wir alle Bitfolgen der Länge <M>n</M> erzeugen. Wie erzeugt man alle, die mit 0 beginnen? Wüssten wir, wie man alle erzeugt, die mit 00 beginnen, und alle, die mit 01 beginnen, wüssten wir es. Und so weiter.</p>
              <p>Die nächste Frage: <b>«Welches Teilproblem ist trivial, oder anders gesagt: Wann hört die Rekursion auf?»</b> Bei der Fakultät ist es einfach, die Fakultät einer Zahl <M>{t`\le 1`}</M> zu berechnen: immer 1. Bei den Bitfolgen ist es einfach, alle Bitfolgen der Länge <M>n</M> zu erzeugen, die mit einer Bitfolge der Länge <M>n</M> «beginnen»: Es ist genau diese Bitfolge. Das wird unser Basisfall.</p>
            </>}
            en={<>
              <p>How would we approach this problem in a systematic way? We could start with an empty string, and in each step we can either append a bit 0 or a bit 1. We repeat this until we have reached <M>n</M> bits (Figure 10.2). If we want to implement this iteratively (i.e., with loops), this will be tough! We have to keep track of all decisions made (did we add 0 or 1, what do we have to add next?) to somehow iterate over all bit strings.</p>
              <p>With recursion, however, the task arguably gets significantly easier. When designing a recursive algorithm, it is always instructive to ask the following question: <b>“What subproblems do exist such that if we had the solutions for these subproblems, the overall solution would become easy?”</b></p>
              <p>For instance, for factorial, if we had the solution to the subproblem of computing the factorial of <M p=",">{t`n-1`}</M> the overall solution to the problem of computing the factorial of <M>n</M> becomes easy (a simple multiplication with <M p=").">n</M> How do we know the factorial of <M p="?">{t`n-1`}</M> If we knew the factorial of <M p=",">{t`n-2`}</M> then we would know the factorial of <M p=".">{t`n-1`}</M> And so on!</p>
              <p>For the problem of enumerating all bit strings of length <M p=",">n</M> this could look as follows: if we knew how to generate all bit strings of length <M>n</M> starting with a 0 and all bit strings of length <M>n</M> starting with a 1, then we could generate all bit strings of length <M p=".">n</M> How do we generate all bit strings of length <M>n</M> starting with 0? Well, if we knew how to generate all bit strings of length <M>n</M> starting with 00 and all bit strings starting with 01, then we would know how to do it. And so on!</p>
              <p>The next question to ask is: <b>“What subproblem is trivial/easy or, in other words, when does the recursion stop?”</b> For factorial, computing the factorial of a number <M>{t`\le 1`}</M> is easy: the result is always 1. For bit strings, enumerating all bit strings of length <M>n</M> “starting” with a bit string of length <M>n</M> is easy: it is just this bit string. This will be our base case!</p>
            </>}
          />
        </Box>
        <T
          de={<p><b>Das Bild dazu:</b> ein Entscheidungsbaum. Man beginnt oben mit der leeren Folge und verzweigt bei jedem Bit nach links (0) oder rechts (1). Jedes Blatt in der Tiefe <M>n</M> ist eine Bitfolge, und es gibt <M>{t`2^n`}</M> davon. Das Programm läuft diesen Baum <em>von links nach rechts</em> ab. Den Baum zeichnet der Ablauf weiter unten selbst.</p>}
          en={<p><b>The picture for this:</b> a decision tree. One starts at the top with the empty string and branches at every bit to the left (0) or to the right (1). Each leaf at depth <M>n</M> is a bit string, and there are <M>{t`2^n`}</M> of them. The program walks this tree <em>from left to right</em>. The run further below draws the tree itself.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="code" title={<T de="3. Die Funktion" en="3. The function" />}>
        <Box kind="lecture" src={<Src p="125" />} title={<T de="all_bit_strings(n, prefix)" en="all_bit_strings(n, prefix)" />}>
          <T
            de={<>
              <p>In C++ schreiben wir eine Funktion <K>void all_bit_strings(int n, std::string prefix)</K>, die als Argumente die Länge <K>n</K> der aufzuzählenden Bitfolgen und eine zu vervollständigende Bitfolge <K>prefix</K> bekommt und alle möglichen Bitfolgen der Länge <K>n</K> mit <K>prefix</K> als Anfang ausgibt. Zu Beginn rufen wir sie mit der leeren Folge als <K>prefix</K> auf, damit werden alle Bitfolgen der Länge <K>n</K> ausgegeben. Der Basisfall: Hat <K>prefix</K> schon die Länge <K>n</K>, geben wir sie einfach aus. Sonst muss jede Bitfolge mit <K>prefix</K> als Anfang mit <K>prefix + "0"</K> oder <K>prefix + "1"</K> beginnen. So entsteht dieser Code:</p>
              <Code code={'void all_bit_strings(int n, std::string prefix) {\n    if (std::ssize(prefix) == n) {\n        std::cout << prefix << "\\n";\n    } else {\n        all_bit_strings(n, prefix + "0");\n        all_bit_strings(n, prefix + "1");\n    }\n}'} />
              <p>Tatsächlich erzeugt der Aufruf <K>all_bit_strings(6, "")</K> alle Bitfolgen der Länge 6.</p>
            </>}
            en={<>
              <p>In C++, we write a function <K>void all_bit_strings(int n, std::string prefix)</K> that takes as arguments the length <K>n</K> of the to-be-enumerated bit strings as well as a to-be-completed bit string <K>prefix</K> and outputs all possible bit strings of length <K>n</K> with <K>prefix</K> as prefix. Initially, we call this function with <K>prefix</K> being the empty string, so this will lead to all bit strings of length <K>n</K> being output. Let us start with the base case: if <K>prefix</K> has length <K>n</K> already, we just have to output that bit string. Otherwise, all bit strings with <K>prefix</K> as prefix must either have <K>prefix + "0"</K> or <K>prefix + "1"</K> as prefix. This results in the following code:</p>
              <Code code={'void all_bit_strings(int n, std::string prefix) {\n    if (std::ssize(prefix) == n) {\n        std::cout << prefix << "\\n";\n    } else {\n        all_bit_strings(n, prefix + "0");\n        all_bit_strings(n, prefix + "1");\n    }\n}'} />
              <p>Indeed, calling <K>all_bit_strings(6, "")</K> generates all bit strings of length 6, as desired!</p>
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.bitStrings} label={tr('all_bit_strings(3, ""): der Entscheidungsbaum entsteht', 'all_bit_strings(3, ""): the decision tree appears')} />
        <T
          de={<>
            <p><b>Mitverfolgen, Schritt für Schritt.</b> Der Baum unter dem Code ist der Entscheidungsbaum aus der Idee oben, jetzt von der Maschine gezeichnet. Jeder Knoten zeigt den Aufruf mit seinen Argumenten: <K>(3, "")</K>, dann <K>(3, "0")</K>, <K>(3, "00")</K>, <K>(3, "000")</K>. Das Programm folgt immer zuerst dem <em>linken</em> Ast, bis es nicht tiefer kann. In <K>(3, "000")</K> ist der Basisfall erreicht: Es wird <K>000</K> ausgegeben (die Konsole rechts füllt sich). Dieser Aufruf endet, und der Aufruf davor, <K>(3, "00")</K>, ist wieder dran: Er macht den <em>zweiten</em> Aufruf, <K>(3, "001")</K>, und der gibt <K>001</K> aus. So geht es weiter: die acht Blätter von links nach rechts ergeben die Ausgabe in der Reihenfolge <K>000, 001, 010, 011, 100, 101, 110, 111</K>.</p>
            <p>Wie das Skript sagt: Man folgt den linken Pfeilen nach oben (bei uns: unten), bis es keine mehr gibt, geht dann zurück und folgt erneut dem am weitesten links liegenden verbleibenden Pfeil.</p>
            <p><b>Warum es funktioniert.</b> Jeder Aufruf hat sein <em>eigenes</em> <K>prefix</K>. Der Aufruf <K>(3, "00")</K> weiss nichts davon, was seine Kinder mit dem Text tun: Er hat <K>"00"</K>, hängt <K>"0"</K> an und gibt das <em>Ergebnis dieser Rechnung</em> als neuen <K>prefix</K> an das Kind. Sein eigener <K>prefix</K> bleibt unverändert, darum kann er danach <K>"1"</K> anhängen.</p>
          </>}
          en={<>
            <p><b>Follow along, step by step.</b> The tree under the code is the decision tree from the idea above, now drawn by the machine. Each node shows the call with its arguments: <K>(3, "")</K>, then <K>(3, "0")</K>, <K>(3, "00")</K>, <K>(3, "000")</K>. The program always follows the <em>left</em> branch first, until it cannot go deeper. In <K>(3, "000")</K> the base case is reached: <K>000</K> is output (the console on the right fills). This call ends, and the call before it, <K>(3, "00")</K>, is on again: it makes its <em>second</em> call, <K>(3, "001")</K>, and that outputs <K>001</K>. It goes on like this: the eight leaves from left to right give the output in the order <K>000, 001, 010, 011, 100, 101, 110, 111</K>.</p>
            <p>As the notes say: you follow the left-most upward arrows until there are none left, then follow the downward arrow back and again follow the left-most (remaining) upward arrows as before.</p>
            <p><b>Why it works.</b> Every call has its <em>own</em> <K>prefix</K>. The call <K>(3, "00")</K> knows nothing about what its children do with the text: it has <K>"00"</K>, appends <K>"0"</K> and passes the <em>result of this calculation</em> as the new <K>prefix</K> to the child. Its own <K>prefix</K> stays unchanged, which is why it can append <K>"1"</K> afterwards.</p>
          </>}
        />
        <Predict
          prompt={<T de={<>Wie viele Aufrufe von <K>all_bit_strings</K> macht <K>all_bit_strings(3, "")</K> insgesamt?</>} en={<>How many calls of <K>all_bit_strings</K> does <K>all_bit_strings(3, "")</K> make in total?</>} />}
          answer={<T de={<>15: In jeder Tiefe verdoppelt sich die Zahl der Aufrufe (1, 2, 4, 8). Die Summe ist <M p=".">{t`1 + 2 + 4 + 8 = 15 = 2^4 - 1`}</M> Für Länge <M>n</M> sind es <M>{t`2^{n+1} - 1`}</M> Aufrufe, davon <M>{t`2^n`}</M> Blätter, die etwas ausgeben. Das ist unvermeidlich, weil es <M>{t`2^n`}</M> Bitfolgen gibt. Die Rekursion hat also keinen vermeidbaren Mehraufwand, ausser dem der Aufrufe selbst.</>} en={<>15: at each depth the number of calls doubles (1, 2, 4, 8). The sum is <M p=".">{t`1 + 2 + 4 + 8 = 15 = 2^4 - 1`}</M> For length <M>n</M> there are <M>{t`2^{n+1} - 1`}</M> calls, of which <M>{t`2^n`}</M> are leaves that output something. That is unavoidable, since there are <M>{t`2^n`}</M> bit strings. So the recursion has no avoidable overhead except that of the calls themselves.</>} />}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="ref" title={<T de="4. Platz sparen: ein einziger String" en="4. Saving space: a single string" />}>
        <Box kind="lecture" src={<Src p="126–127" />} title={<T de="Der Stapel läuft über" en="The stack runs out" />}>
          <T
            de={<>
              <p>Unser Code funktioniert! Es gibt nur ein Problem: Denkt man an den Aufrufstapel, wird bei jedem Funktionsaufruf eine neue Kopie von <K>prefix</K> (und von <K>n</K>) erzeugt. Nach den ersten drei Aufrufen von <K>all_bit_strings(3, "")</K> liegen zum Beispiel vier Strings und vier <K>n</K> auf dem Stapel (Abbildung 10.4). Bei längeren Bitfolgen braucht das viel Platz und kann dazu führen, dass der Stapel keinen Platz mehr hat. Das nennt man <b>Stapelüberlauf</b>; er führt zu undefiniertem Verhalten, meist einem Segmentation Fault.</p>
              <p>Damit nicht zu viele Strings auf dem Stapel liegen, können wir mit <em>einem einzigen</em> String arbeiten, der per Referenz übergeben wird: Alle Funktionsaufrufe arbeiten dann auf demselben String <K>bit_string</K> der Länge <K>n</K>. Das Argument <K>n</K> brauchen wir nicht mehr (die Länge ergibt sich aus dem String). Stattdessen merken wir uns, wie lang der gültige Anfang von <K>bit_string</K> ist, mit einem Argument <K>i</K>: dem am weitesten links liegenden noch zu ändernden Bitindex. Unser Ziel ist eine Funktion <K>void all_bit_strings(std::string&amp; bit_string, int i)</K>, die alle Bitfolgen ausgibt, die die ersten <K>i</K> Bits von <K>bit_string</K> als Anfang haben. Der Basisfall ist erreicht, wenn <K>i</K> gleich <K>std::ssize(bit_string)</K> ist:</p>
              <Code code={'void all_bit_strings(std::string& bit_string, int i) {\n    if (i == std::ssize(bit_string)) {\n        std::cout << bit_string << "\\n";\n    }\n    else {\n        bit_string[i] = \'0\';\n        all_bit_strings(bit_string, i+1);\n        bit_string[i] = \'1\';\n        all_bit_strings(bit_string, i+1);\n    }\n}'} />
              <p>Ein Aufruf sieht so aus: <K>std::string bit_string = std::string(3, '*'); all_bit_strings(bit_string, 0)</K>, wobei das Zeichen <K>'*'</K> ein anfänglicher Platzhalter ist. Die Folge der Aufrufe ist genau dieselbe wie vorher, der einzige Unterschied: Es gibt nur <em>einen</em> String, was platzsparender ist (Abbildung 10.5).</p>
            </>}
            en={<>
              <p>Our code works! There is only one issue. When thinking about the call stack, for every function call, a new copy of a <K>prefix</K> string (and of the variable <K>n</K>) is generated. For instance, after the first 3 calls when calling <K>all_bit_strings(3, "")</K>, four strings and four <K>n</K> lie on the stack (Figure 10.4). For larger bit strings, this will take a lot of space on the stack and might lead to the stack running out of space. This is called <b>stack overflow</b> and leads to undefined behavior, usually resulting in a segmentation fault.</p>
              <p>To avoid having too many strings on the call stack, we can work with <em>one single</em> string passed by reference, resulting in all function calls working on the same string <K>bit_string</K> of length <K>n</K>. We then do not need the function argument <K>n</K> anymore (since we can deduce the length from the given string). Instead, we need to keep track of how long the valid prefix of <K>bit_string</K> is: we can do that by having an argument <K>i</K> telling us about the left-most to-be-modified bit index. Our goal thus is to write a function <K>void all_bit_strings(std::string&amp; bit_string, int i)</K> that outputs all bit strings with the first <K>i</K> bits of <K>bit_string</K> as prefix. The base case is reached when <K>i</K> is equal to <K>std::ssize(bit_string)</K>:</p>
              <Code code={'void all_bit_strings(std::string& bit_string, int i) {\n    if (i == std::ssize(bit_string)) {\n        std::cout << bit_string << "\\n";\n    }\n    else {\n        bit_string[i] = \'0\';\n        all_bit_strings(bit_string, i+1);\n        bit_string[i] = \'1\';\n        all_bit_strings(bit_string, i+1);\n    }\n}'} />
              <p>And a call of the function would look like this: <K>std::string bit_string = std::string(3, '*'); all_bit_strings(bit_string, 0)</K>, where the character <K>'*'</K> is an initial placeholder. The sequence of calls is exactly the same as before, the only difference is that there is only one single bit string, which is more space-efficient (Figure 10.5).</p>
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.bitStringsRef} label={tr('Mit einem einzigen String per Referenz', 'With one single string by reference')} />
        <T
          de={<>
            <p>Beobachte jetzt die Kästen: Es gibt <em>einen</em> String <K>bit_string</K> in <K>main</K>, und in jedem Aufruf trägt der Parameter die Marke «Alias»: Er ist derselbe String unter einem zweiten Namen (Lektion über Referenzen). Statt vieler Kopien von <K>prefix</K> hat der Stapel jetzt nur noch eine Zahl <K>i</K> pro Kasten. Der String ändert sich im Lauf: <K>"***"</K> → <K>"0**"</K> → <K>"00*"</K> → <K>"000"</K> (Ausgabe) → <K>"001"</K> (Ausgabe) → <K>"01*"</K> …</p>
            <p><b>Der Preis der Ersparnis.</b> Weil alle Aufrufe <em>denselben</em> String bearbeiten, muss jeder Aufruf sein Bit selbst setzen, <em>bevor</em> er das Kind ruft (<K>bit_string[i] = '0'</K>, dann <K>'1'</K>). Die Aufrufe teilen sich den Zustand. Das ist effizienter, aber fehleranfälliger: Der Aufruf <K>i</K> darf nur das Bit <K>i</K> ändern und nichts hinter <K>i</K> voraussetzen. Das ist eine kleine Vorbedingung: «alle Bits <em>ab</em> <K>i</K> werden überschrieben».</p>
          </>}
          en={<>
            <p>Now watch the boxes: there is <em>one</em> string <K>bit_string</K> in <K>main</K>, and in every call the parameter carries the mark “alias”: it is the same string under a second name (lesson on references). Instead of many copies of <K>prefix</K> the stack now has only one number <K>i</K> per box. The string changes during the run: <K>"***"</K> → <K>"0**"</K> → <K>"00*"</K> → <K>"000"</K> (output) → <K>"001"</K> (output) → <K>"01*"</K> …</p>
            <p><b>The price of the saving.</b> Because all calls work on the <em>same</em> string, every call must set its bit itself <em>before</em> it calls the child (<K>bit_string[i] = '0'</K>, then <K>'1'</K>). The calls share state. That is more efficient but more error-prone: call <K>i</K> may change only bit <K>i</K> and must assume nothing behind <K>i</K>. That is a small precondition: “all bits <em>from</em> <K>i</K> on are overwritten”.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Rekursive Aufzählungen sicher schreiben" en="Writing recursive enumerations safely" />}>
          <T
            de={<ul>
              <li><b>Übergib den Zwischenstand im Argument</b> (<K>prefix + "0"</K>), wenn du das Verhalten einfach halten willst: Jeder Aufruf hat seine eigene Kopie, und es kann nichts schiefgehen. Das kostet Platz (und Zeit für das Kopieren).</li>
              <li><b>Teile einen Zustand per Referenz</b> nur, wenn du vor jedem Kind-Aufruf den Zustand setzt und danach nichts davon abhängt, was das Kind übrig lässt.</li>
              <li><b>Teste mit kleinem n.</b> Mit <K>n = 3</K> kannst du alle 8 Ausgaben von Hand prüfen. Erst dann <K>n = 20</K> (über eine Million Zeilen!).</li>
              <li>Die Anzahl der Ausgaben wächst als <M p=":">{t`2^n`}</M> Jedes zusätzliche Bit verdoppelt die Arbeit. Das ist keine Schwäche der Rekursion, sondern der Aufgabe.</li>
            </ul>}
            en={<ul>
              <li><b>Pass the intermediate state in the argument</b> (<K>prefix + "0"</K>) if you want to keep the behavior simple: every call has its own copy, and nothing can go wrong. That costs space (and time for copying).</li>
              <li><b>Share a state by reference</b> only if you set the state before every child call and nothing afterwards depends on what the child leaves behind.</li>
              <li><b>Test with small n.</b> With <K>n = 3</K> you can check all 8 outputs by hand. Only then <K>n = 20</K> (over a million lines!).</li>
              <li>The number of outputs grows as <M p=":">{t`2^n`}</M> every additional bit doubles the work. That is no weakness of recursion but of the task.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Wie viele Zeichen enthält die Ausgabe von <K>all_bit_strings(4, "")</K>, Zeilenumbrüche mitgezählt?</>} en={<>How many characters does the output of <K>all_bit_strings(4, "")</K> contain, counting line breaks?</>} />}
          choices={[
            { text: <K>80</K>, correct: true, why: <T de={<>Richtig: <M>{t`2^4 = 16`}</M> Bitfolgen mit je 4 Zeichen plus einem Zeilenumbruch, also <M p=".">{t`16 \cdot 5 = 80`}</M></>} en={<>Correct: <M>{t`2^4 = 16`}</M> bit strings with 4 characters each plus a line break, so <M p=".">{t`16 \cdot 5 = 80`}</M></>} /> },
            { text: <K>64</K>, why: <T de={<>Das wäre <M>{t`16 \cdot 4`}</M> ohne Zeilenumbrüche.</>} en={<>That would be <M>{t`16 \cdot 4`}</M> without the line breaks.</>} /> },
            { text: <K>20</K>, why: <T de={<>Das wäre <M p=":">{t`4 \cdot 5`}</M> Die Zahl der Bitfolgen wächst nicht linear, sondern verdoppelt sich mit jedem Bit.</>} en={<>That would be <M p=":">{t`4 \cdot 5`}</M> the number of bit strings does not grow linearly but doubles with every bit.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Zwei Fragen beim Entwurf: Welche <em>Teilprobleme</em> gibt es, bei denen die Gesamtlösung einfach würde? Welches Teilproblem ist <em>trivial</em> (Basisfall)?</li>
              <li>Bitfolgen: Prefix übergeben; Basisfall «Länge erreicht» (ausgeben); sonst <K>prefix + "0"</K> und <K>prefix + "1"</K>.</li>
              <li>Die Aufrufe bilden einen Baum; das Programm durchläuft ihn von links nach rechts.</li>
              <li>Platz sparen: einen String per Referenz teilen und den Index mitführen (<K>all_bit_strings(bit_string, i)</K>). Das ist effizienter, setzt aber sorgfältiges Überschreiben voraus.</li>
            </ul>}
            en={<ul>
              <li>Two questions in design: which <em>subproblems</em> exist such that the overall solution would become easy? Which subproblem is <em>trivial</em> (base case)?</li>
              <li>Bit strings: pass the prefix; base case “length reached” (output); otherwise <K>prefix + "0"</K> and <K>prefix + "1"</K>.</li>
              <li>The calls form a tree; the program walks through it from left to right.</li>
              <li>Saving space: share one string by reference and carry the index along (<K>all_bit_strings(bit_string, i)</K>). That is more efficient but requires careful overwriting.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Welche Probleme eignen sich noch für Rekursion, und gibt es allgemeine Strategien? Zwei davon lernen wir am Beispiel der Summe eines Vektors kennen (Skript S. 127–131).</p>}
          en={<p className="connections"><b>Next:</b> which other problems suit recursion, and are there general strategies? We get to know two of them using the sum of a vector as the example (notes pp. 127–131).</p>}
        />
      </Section>
    </article>
  );
}
