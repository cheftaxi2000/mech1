import { Section } from '../components/Blocks';
import { Choice, NumericAnswer, See } from '../components/Quiz';
import { M } from '../components/Tex';
import { T } from '../i18n';
import { Q5 } from '../content/quizValues';

const t = String.raw;

/** Quiz part, chapters 4 and 5 (lecture pp. 29–36): forces, reaction, systems, distributed forces, power, moment, group of forces. */
export default function Q5Quiz() {
  return (
    <article className="lesson quiz-part">
      <T
        de={<p className="lede">Fragen zu S. 29–36: Kraft und Reaktion, Systemgrenze, verteilte Kräfte, Leistung, Moment und die Leistung einer Kräftegruppe. Jede Antwort hat eine Erklärung und einen Link zur Lektion.</p>}
        en={<p className="lede">Questions on pp. 29–36: force and reaction, system boundary, distributed forces, power, moment and the power of a group of forces. Every answer has an explanation and a link to the lesson.</p>}
      />

      <Section id="kraefte-quiz" title={<T de="Kraft, Reaktion und Systemgrenze" en="Force, reaction and system boundary" />}>
        <Choice
          question={<T de={<>Was legt eine Kraft <M>{t`\{A\,|\,\v F\}`}</M> fest?</>} en={<>What defines a force <M p="?">{t`\{A\,|\,\v F\}`}</M></>} />}
          choices={[
            { text: <T de="nur Richtung und Betrag" en="only direction and magnitude" />, why: <T de={<>Das ist nur der Vektor <M p=".">{t`\v F`}</M> Zur Kraft gehört der Angriffspunkt <M p=".">A</M> <See id="kraft">Kraft</See></>} en={<>That is only the vector <M p=".">{t`\v F`}</M> A force also has its point of application <M p=".">A</M> <See id="kraft">Force</See></>} /> },
            { text: <T de="Richtung, Betrag und Angriffspunkt" en="direction, magnitude and point of application" />, correct: true, why: <T de={<>Darum heisst die Kraft «punktgebundener Vektor» (S. 29). <See id="kraft">Kraft</See></>} en={<>That is why a force is a “point-bound vector” (p. 29). <See id="kraft">Force</See></>} /> },
            { text: <T de="nur der Angriffspunkt" en="only the point of application" />, why: <T de="Der Punkt allein sagt nicht, wohin und wie stark gezogen wird." en="The point alone does not say where and how hard it pulls." /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Vier Kräfte am selben Punkt (unsere Zahlen für Fig. 4.2): <M p=",">{t`\v F_1 = (5; -25)\,\mathrm N`}</M> <M p=",">{t`\v F_2 = (-20; -45)\,\mathrm N`}</M> <M p=",">{t`\v F_3 = (-30; 5)\,\mathrm N`}</M> <M p=".">{t`\v F_4 = (15; 55)\,\mathrm N`}</M> Wie gross muss <M>{t`|\v F_5|`}</M> sein, damit die Resultierende null wird?</>} en={<>Four forces at the same point (our numbers for Fig. 4.2): <M p=",">{t`\v F_1 = (5, -25)\,\mathrm N`}</M> <M p=",">{t`\v F_2 = (-20, -45)\,\mathrm N`}</M> <M p=",">{t`\v F_3 = (-30, 5)\,\mathrm N`}</M> <M p=".">{t`\v F_4 = (15, 55)\,\mathrm N`}</M> How large must <M>{t`|\v F_5|`}</M> be so that the resultant is zero?</>} />}
          value={Q5.f5Equilibrium} unit="N" tol={0.01}
          explain={<T de={<><M p=",">{t`\v F_1 + \dots + \v F_4 = (-30; -10)\,\mathrm N`}</M> also <M p=".">{t`\v F_5 = (30; 10)\,\mathrm N`}</M> Der Betrag ist <M p=".">{t`\sqrt{900 + 100} \approx 31{,}6\,\mathrm N`}</M> Die Pfeilkette schliesst sich dann. <See id="kraft">Kraft</See></>} en={<><M p=",">{t`\v F_1 + \dots + \v F_4 = (-30, -10)\,\mathrm N`}</M> so <M p=".">{t`\v F_5 = (30, 10)\,\mathrm N`}</M> Its magnitude is <M p=".">{t`\sqrt{900 + 100} \approx 31.6\,\mathrm N`}</M> The chain of arrows then closes. <See id="kraft">Force</See></>} />}
        />
        <Choice
          question={<T de="Ein Buch liegt auf dem Tisch. Sind sein Gewicht und die Kraft des Tisches auf das Buch ein Paar «Actio und Reactio»?" en="A book lies on a table. Are its weight and the force of the table on the book an “actio and reactio” pair?" />}
          choices={[
            { text: <T de="Ja, sie sind gleich gross und entgegengesetzt." en="Yes, they are equal and opposite." />, why: <T de="Gleich gross und entgegengesetzt reicht nicht: Beide Kräfte greifen am selben Körper an." en="Equal and opposite is not enough: both forces act on the same body." /> },
            { text: <T de="Nein: Beide wirken auf das Buch. Die Gegenkraft des Gewichts greift an der Erde an." en="No: both act on the book. The counter-force of the weight acts on the Earth." />, correct: true, why: <T de={<>Das Reaktionsprinzip verlangt zwei verschiedene Körper: Zur Kraft <M>{t`\{A_2\,|\,\v F\}`}</M> gehört <M p=".">{t`\{A_1\,|\,-\v F\}`}</M> <See id="reaktionsprinzip">Reaktionsprinzip</See></>} en={<>The reaction principle needs two different bodies: the force <M>{t`\{A_2\,|\,\v F\}`}</M> goes with <M p=".">{t`\{A_1\,|\,-\v F\}`}</M> <See id="reaktionsprinzip">Reaction principle</See></>} /> },
          ]}
        />
        <Choice
          question={<T de={<>Zwei Körper ziehen einander an, ohne sich zu berühren (Fernkraft). <M p=",">{t`A_1 = (0; 0)`}</M> <M p=".">{t`A_2 = (3; 4)`}</M> Welche Kraft auf <M>{t`A_2`}</M> ist nach dem Zusatzpostulat erlaubt?</>} en={<>Two bodies attract each other without touching (distance force). <M p=",">{t`A_1 = (0, 0)`}</M> <M p=".">{t`A_2 = (3, 4)`}</M> Which force on <M>{t`A_2`}</M> does the additional postulate allow?</>} />}
          choices={[
            { text: <M>{t`(6; 8)\,\mathrm N`}</M>, correct: true, why: <T de={<>Die Kraft liegt auf der Geraden durch <M>{t`A_1`}</M> und <M p=".">{t`A_2`}</M> Der Vektor ist ein Vielfaches von <M p=".">{t`(3; 4)`}</M> <See id="reaktionsprinzip">Reaktionsprinzip</See></>} en={<>The force lies on the line through <M>{t`A_1`}</M> and <M p=".">{t`A_2`}</M> The vector is a multiple of <M p=".">{t`(3, 4)`}</M> <See id="reaktionsprinzip">Reaction principle</See></>} /> },
            { text: <M>{t`(8; -6)\,\mathrm N`}</M>, why: <T de={<>Gleich gross wie <M p=",">{t`(6; 8)`}</M> aber senkrecht zur Verbindungsgeraden – das schliesst das Zusatzpostulat aus.</>} en={<>Same size as <M p=",">{t`(6, 8)`}</M> but perpendicular to the connecting line – the additional postulate rules it out.</>} /> },
          ]}
        />
        <Choice
          question={<T de={<>Beim Balken (S. 31): Wie viele äussere Kräfte hat das System «Lastkörper + Träger»?</>} en={<>For the beam (p. 31): how many outer forces does the system “load + beam” have?</>} />}
          choices={[
            { text: <T de={`${Q5.outerBeamLoad}`} en={`${Q5.outerBeamLoad}`} />, why: <T de="Das sind die äusseren Kräfte des Lastkörpers allein. Beim grösseren System werden N und R zu inneren Kräften." en="Those are the outer forces of the load alone. In the larger system N and R become inner forces." /> },
            { text: <T de={`${Q5.outerBeam}`} en={`${Q5.outerBeam}`} />, correct: true, why: <T de={<><M p=",">{t`\v G`}</M> <M p=",">{t`\v Z`}</M> <M>{t`\v F_A`}</M> und <M p=".">{t`\v F_B`}</M> Die Berührkräfte <M>{t`\v N`}</M> und <M>{t`\v R`}</M> liegen im System und treten als Paare auf. <See id="systemabgrenzung">Systemabgrenzung</See></>} en={<><M p=",">{t`\v G`}</M> <M p=",">{t`\v Z`}</M> <M>{t`\v F_A`}</M> and <M p=".">{t`\v F_B`}</M> The contact forces <M>{t`\v N`}</M> and <M>{t`\v R`}</M> lie inside the system and occur as pairs. <See id="systemabgrenzung">System boundary</See></>} /> },
            { text: <T de="2" en="2" />, why: <T de={<>Zu wenig: <M>{t`\v G`}</M> und <M>{t`\v Z`}</M> kommen von aussen, ebenso <M>{t`\v F_A`}</M> und <M p=".">{t`\v F_B`}</M></>} en={<>Too few: <M>{t`\v G`}</M> and <M>{t`\v Z`}</M> come from outside, and so do <M>{t`\v F_A`}</M> and <M p=".">{t`\v F_B`}</M></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Zwei Wagen auf einer Schiene. Eine Hand schiebt Wagen 1 mit <M p=",">{t`70\,\mathrm N`}</M> Wagen 1 drückt Wagen 2 mit <M p=".">{t`42\,\mathrm N`}</M> Wie gross ist die Summe der <em>äusseren</em> Kräfte am System aus beiden Wagen?</>} en={<>Two carts on a rail. A hand pushes cart 1 with <M p=",">{t`70\,\mathrm N`}</M> Cart 1 pushes cart 2 with <M p=".">{t`42\,\mathrm N`}</M> What is the sum of the <em>outer</em> forces on the system of both carts?</>} />}
          value={Q5.cartsOuter} unit="N" tol={0.005}
          explain={<T de={<>Das Paar <M>{t`42\,\mathrm N`}</M> und <M>{t`-42\,\mathrm N`}</M> liegt im System und ist innen: Die inneren Kräfte summieren sich zu null. Von aussen bleibt nur die Hand: <M p=".">{t`70\,\mathrm N`}</M> <See id="systemabgrenzung">Systemabgrenzung</See></>} en={<>The pair <M>{t`42\,\mathrm N`}</M> and <M>{t`-42\,\mathrm N`}</M> lies inside the system and is inner: inner forces add up to zero. From outside only the hand remains: <M p=".">{t`70\,\mathrm N`}</M> <See id="systemabgrenzung">System boundary</See></>} />}
        />
      </Section>

      <Section id="verteilt-quiz" title={<T de="Verteilte Kräfte" en="Distributed forces" />}>
        <Choice
          question={<T de={<>Welche Einheit hat die Raumkraftdichte (im Skript wieder mit <M>{t`\v F`}</M> bezeichnet, R-025)?</>} en={<>What is the unit of the force density per volume (called <M>{t`\v F`}</M> again in the lecture, R-025)?</>} />}
          choices={[
            { text: <M>{t`\mathrm N`}</M>, why: <T de={<>Das wäre die Kraft selbst. Hier steht <M>{t`\v F`}</M> für eine Dichte – dieselbe Buchstabe, andere Grösse.</>} en={<>That would be the force itself. Here <M>{t`\v F`}</M> stands for a density – same letter, different quantity.</>} /> },
            { text: <M>{t`\mathrm{N/m^3}`}</M>, correct: true, why: <T de={<>Kraft pro Volumen. Mit <M>{t`\mathrm{d}\v F = \v F\,\mathrm{d}V`}</M> kommt wieder Newton heraus: <M p=".">{t`\mathrm{N/m^3}\cdot\mathrm{m^3} = \mathrm N`}</M> <See id="verteilte-kraefte">Verteilte Kräfte</See></>} en={<>Force per volume. With <M>{t`\mathrm{d}\v F = \v F\,\mathrm{d}V`}</M> newtons come out again: <M p=".">{t`\mathrm{N/m^3}\cdot\mathrm{m^3} = \mathrm N`}</M> <See id="verteilte-kraefte">Distributed forces</See></>} /> },
            { text: <M>{t`\mathrm{N/m}`}</M>, why: <T de="Das ist die Linienkraftdichte q." en="That is the line force density q." /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Ein Balken der Länge <M>{t`L = 4\,\mathrm m`}</M> trägt die Last <M p=",">{t`q(x) = 60\,\mathrm{N/m}\cdot x/L`}</M> sie wächst linear von <M>{t`0`}</M> auf <M>{t`60\,\mathrm{N/m}`}</M> an. Wie gross ist die Gesamtkraft <M p="?">R</M></>} en={<>A beam of length <M>{t`L = 4\,\mathrm m`}</M> carries the load <M p=",">{t`q(x) = 60\,\mathrm{N/m}\cdot x/L`}</M> growing linearly from <M>{t`0`}</M> to <M p=".">{t`60\,\mathrm{N/m}`}</M> What is the total force <M p="?">R</M></>} />}
          value={Q5.rampR} unit="N" tol={0.005}
          explain={<T de={<><M p=".">{t`R = \int_0^L q\,\mathrm{d}x = \tfrac12\cdot 60\,\mathrm{N/m}\cdot 4\,\mathrm m = 120\,\mathrm N`}</M> Das ist die Fläche des Dreiecks unter der Kurve. Wo <M>{t`\v R`}</M> angreift, sagt diese Seite nicht. <See id="verteilte-kraefte">Verteilte Kräfte</See></>} en={<><M p=".">{t`R = \int_0^L q\,\mathrm{d}x = \tfrac12\cdot 60\,\mathrm{N/m}\cdot 4\,\mathrm m = 120\,\mathrm N`}</M> This is the area of the triangle under the curve. Where <M>{t`\v R`}</M> acts, this page does not say. <See id="verteilte-kraefte">Distributed forces</See></>} />}
        />
        <NumericAnswer
          question={<T de={<>Wie schwer ist ein Betonquader <M>{t`2\,\mathrm m\times 1{,}5\,\mathrm m\times 0{,}5\,\mathrm m`}</M> mit <M p="?">{t`\rho = 2400\,\mathrm{kg/m^3}`}</M> Rechne mit <M>{t`g = 9{,}81\,\mathrm{m/s^2}`}</M> und gib das Gewicht in kN an.</>} en={<>How heavy is a concrete block <M>{t`2\,\mathrm m\times 1.5\,\mathrm m\times 0.5\,\mathrm m`}</M> with <M p="?">{t`\rho = 2400\,\mathrm{kg/m^3}`}</M> Use <M>{t`g = 9.81\,\mathrm{m/s^2}`}</M> and give the weight in kN.</>} />}
          value={Q5.concreteG} unit="kN" tol={0.005}
          explain={<T de={<><M p=",">{t`V = 1{,}5\,\mathrm{m^3}`}</M> also <M p=",">{t`m = \rho V = 3600\,\mathrm{kg}`}</M> und <M p=".">{t`G = m g \approx 35{,}3\,\mathrm{kN}`}</M> Bei konstantem <M>\rho</M> reicht eine Multiplikation statt des Dreifachintegrals. <See id="verteilte-kraefte">Verteilte Kräfte</See></>} en={<><M p=",">{t`V = 1.5\,\mathrm{m^3}`}</M> so <M p=",">{t`m = \rho V = 3600\,\mathrm{kg}`}</M> and <M p=".">{t`G = m g \approx 35.3\,\mathrm{kN}`}</M> For constant <M>\rho</M> one multiplication replaces the triple integral. <See id="verteilte-kraefte">Distributed forces</See></>} />}
        />
      </Section>

      <Section id="leistung-quiz" title={<T de="Leistung, Moment und Kräftegruppe" en="Power, moment and group of forces" />}>
        <NumericAnswer
          question={<T de={<>Eine Kraft <M>{t`\v F = (2{,}6; 1{,}5)\,\mathrm N`}</M> greift an einem Punkt an, der sich mit <M>{t`\v v = (2; 0)\,\mathrm{m/s}`}</M> bewegt. Wie gross ist die Leistung?</>} en={<>A force <M>{t`\v F = (2.6, 1.5)\,\mathrm N`}</M> acts at a point moving with <M p=".">{t`\v v = (2, 0)\,\mathrm{m/s}`}</M> What is the power?</>} />}
          value={Q5.powerPush} unit="W" tol={0.005}
          explain={<T de={<><M p=".">{t`P = \v F\cdot\v v = 2{,}6\cdot 2 + 1{,}5\cdot 0 = 5{,}2\,\mathrm W`}</M> Nur der Teil von <M>{t`\v F`}</M> in Bewegungsrichtung zählt; der senkrechte Teil <M>{t`1{,}5\,\mathrm N`}</M> trägt nichts bei. <See id="leistung">Leistung</See></>} en={<><M p=".">{t`P = \v F\cdot\v v = 2.6\cdot 2 + 1.5\cdot 0 = 5.2\,\mathrm W`}</M> Only the part of <M>{t`\v F`}</M> along the motion counts; the perpendicular part <M>{t`1.5\,\mathrm N`}</M> contributes nothing. <See id="leistung">Power</See></>} />}
        />
        <Choice
          question={<T de="Eine Kraft steht immer senkrecht auf der Geschwindigkeit ihres Angriffspunktes (zum Beispiel die Lorentzkraft). Welche Leistung hat sie?" en="A force is always perpendicular to the velocity of its point of application (for example the Lorentz force). What power does it have?" />}
          choices={[
            { text: <T de="positive Leistung – sie treibt an" en="positive power – it drives" />, why: <T de={<>Dazu bräuchte sie einen Anteil in Bewegungsrichtung: <M p=".">{t`\v F\cdot\v v > 0`}</M></>} en={<>It would need a part along the motion: <M p=".">{t`\v F\cdot\v v > 0`}</M></>} /> },
            { text: <T de="null" en="zero" />, correct: true, why: <T de={<><M p=".">{t`P = \v F\cdot\v v = 0`}</M> Sie lenkt ab, ändert aber nicht die Leistung. <See id="leistung">Leistung</See></>} en={<><M p=".">{t`P = \v F\cdot\v v = 0`}</M> It deflects, but contributes no power. <See id="leistung">Power</See></>} /> },
            { text: <T de="negative Leistung – sie bremst" en="negative power – it brakes" />, why: <T de={<>Bremsen würde einen Anteil <em>gegen</em> die Bewegung bedeuten; hier gibt es keinen.</>} en={<>Braking would mean a part <em>against</em> the motion; there is none here.</>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Eine Kraft <M>{t`\v F = (0{,}2; 1{,}5)\,\mathrm N`}</M> greift am Punkt <M>{t`P = (1{,}3; 0{,}5)\,\mathrm m`}</M> an, der Ursprung ist <M p=".">O</M> Wie gross ist der Betrag des Moments <M>{t`|\v M_O|`}</M> in N·m?</>} en={<>A force <M>{t`\v F = (0.2, 1.5)\,\mathrm N`}</M> acts at the point <M p=";">{t`P = (1.3, 0.5)\,\mathrm m`}</M> the origin is <M p=".">O</M> What is the magnitude of the moment <M>{t`|\v M_O|`}</M> in N·m?</>} />}
          value={Q5.momentO} unit="N·m" tol={0.005}
          explain={<T de={<><M p=".">{t`M_z = x F_y - y F_x = 1{,}3\cdot 1{,}5 - 0{,}5\cdot 0{,}2 = 1{,}85\,\mathrm{N\,m}`}</M> Als Hebelarm: <M p=",">{t`d = M/|\v F| \approx 1{,}22\,\mathrm m`}</M> kürzer als <M p=".">{t`|\v{OP}| \approx 1{,}39\,\mathrm m`}</M> <See id="leistung-rotation">Moment</See></>} en={<><M p=".">{t`M_z = x F_y - y F_x = 1.3\cdot 1.5 - 0.5\cdot 0.2 = 1.85\,\mathrm{N\,m}`}</M> As a lever arm: <M p=",">{t`d = M/|\v F| \approx 1.22\,\mathrm m`}</M> shorter than <M p=".">{t`|\v{OP}| \approx 1.39\,\mathrm m`}</M> <See id="leistung-rotation">Moment</See></>} />}
        />
        <Choice
          question={<T de={<>Die Kraft <M>{t`\v F`}</M> zeigt parallel zur Drehachse. Wie gross ist ihre Leistung bei einer Drehung um diese Achse?</>} en={<>The force <M>{t`\v F`}</M> points parallel to the axis of rotation. What is its power in a rotation about this axis?</>} />}
          choices={[
            { text: <T de="null, weil das Moment um die Achse null ist" en="zero, because its moment about the axis is zero" />, correct: true, why: <T de={<>Die Geschwindigkeit <M>{t`\v\omega\times\v{OP}`}</M> liegt senkrecht zur Achse, <M>{t`\v F`}</M> liegt längs der Achse. Also <M p=",">{t`\v F\cdot\v v = 0`}</M> und <M>{t`M_z = 0`}</M> passt dazu. <See id="leistung-rotation">Moment</See></>} en={<>The velocity <M>{t`\v\omega\times\v{OP}`}</M> is perpendicular to the axis, <M>{t`\v F`}</M> lies along it. So <M p=",">{t`\v F\cdot\v v = 0`}</M> and <M>{t`M_z = 0`}</M> fits. <See id="leistung-rotation">Moment</See></>} /> },
            { text: <T de="gross, weil die Kraft weit von der Achse entfernt angreift" en="large, because the force acts far from the axis" />, why: <T de="Der Abstand allein zählt nicht; entscheidend ist der Anteil der Kraft senkrecht zum Hebelarm." en="Distance alone does not count; what matters is the part of the force perpendicular to the lever arm." /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Ein Rad dreht sich mit <M>{t`\omega = 1\,\mathrm{s^{-1}}`}</M> um seine Achse. Am Punkt <M>{t`(1{,}5; 0)\,\mathrm m`}</M> greift <M>{t`\v F = (0{,}7; 1{,}2)\,\mathrm N`}</M> an. Wie gross ist die Leistung dieser Kraft?</>} en={<>A wheel turns with <M>{t`\omega = 1\,\mathrm{s^{-1}}`}</M> about its axis. At the point <M>{t`(1.5, 0)\,\mathrm m`}</M> the force <M>{t`\v F = (0.7, 1.2)\,\mathrm N`}</M> acts. What is the power of this force?</>} />}
          value={Q5.wheelM} unit="W" tol={0.005}
          explain={<T de={<>Nur die tangentiale Komponente <M>{t`F_t = 1{,}2\,\mathrm N`}</M> zählt: <M p=",">{t`M_z = r F_t = 1{,}8\,\mathrm{N\,m}`}</M> und <M p=".">{t`P = M_z\,\omega = 1{,}8\,\mathrm W`}</M> Die radiale Komponente <M>{t`0{,}7\,\mathrm N`}</M> drückt nur auf die Achse. <See id="leistung-rotation">Moment</See></>} en={<>Only the tangential component <M>{t`F_t = 1.2\,\mathrm N`}</M> counts: <M p=",">{t`M_z = r F_t = 1.8\,\mathrm{N\,m}`}</M> and <M p=".">{t`P = M_z\,\omega = 1.8\,\mathrm W`}</M> The radial component <M>{t`0.7\,\mathrm N`}</M> only presses on the axle. <See id="leistung-rotation">Moment</See></>} />}
        />
        <Choice
          question={<T de={<>Du beschreibst dieselbe Bewegung eines starren Körpers einmal im Bezugspunkt <M>B</M> und einmal in <M p=".">{t`B'`}</M> Welche Grösse ändert sich <em>nicht</em>?</>} en={<>You describe the same motion of a rigid body once at the reference point <M>B</M> and once at <M p=".">{t`B'`}</M> Which quantity does <em>not</em> change?</>} />}
          choices={[
            { text: <M>{t`\v R\cdot\v v_B`}</M>, why: <T de={<>Beim Platten-Beispiel: <M>{t`2{,}5\,\mathrm W`}</M> in <M>B</M> gegen <M>{t`1{,}25\,\mathrm W`}</M> in <M p=".">{t`B'`}</M> Denn <M>{t`\v v_B`}</M> ändert sich.</>} en={<>In the plate example: <M>{t`2.5\,\mathrm W`}</M> at <M>B</M> versus <M>{t`1.25\,\mathrm W`}</M> at <M p=".">{t`B'`}</M> Because <M>{t`\v v_B`}</M> changes.</>} /> },
            { text: <M>{t`\v M_B\cdot\v\omega`}</M>, why: <T de={<>Beim Platten-Beispiel: <M>{t`3{,}0\,\mathrm W`}</M> in <M>B</M> gegen <M>{t`4{,}25\,\mathrm W`}</M> in <M p=".">{t`B'`}</M> Denn <M>{t`\v M_B`}</M> ändert sich.</>} en={<>In the plate example: <M>{t`3.0\,\mathrm W`}</M> at <M>B</M> versus <M>{t`4.25\,\mathrm W`}</M> at <M p=".">{t`B'`}</M> Because <M>{t`\v M_B`}</M> changes.</>} /> },
            { text: <M>{t`\v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M>, correct: true, why: <T de={<>Beide Summanden verschieben sich gegeneinander, die Summe bleibt: <M p=".">{t`5{,}5\,\mathrm W`}</M> Das ist die Leistung der wirklichen Kräfte; sie kann nicht vom Rechenpunkt abhängen. <See id="leistung-kraeftegruppe">Kräftegruppe</See></>} en={<>The two terms shift against each other, the sum stays: <M p=".">{t`5.5\,\mathrm W`}</M> That is the power of the real forces; it cannot depend on the calculation point. <See id="leistung-kraeftegruppe">Group of forces</See></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Leiter der Länge <M>{t`L = 4\,\mathrm m`}</M> (Fig. 5.6): <M p=",">{t`\v v_A = (1; 0; 0)\,\mathrm{m/s}`}</M> <M p=",">{t`\omega = 0{,}5\,\mathrm{s^{-1}}`}</M> <M>{t`|\v F_B| = G = 20\,\mathrm N`}</M> (senkrecht nach unten in <M p="),">B</M> <M>{t`|\v F_C| = W = 15\,\mathrm N`}</M> (senkrecht zur Leiter in der Mitte <M p=").">C</M> Wie gross ist die Gesamtleistung? Negativ heisst: Die Kräfte nehmen der Leiter Leistung weg.</>} en={<>Ladder of length <M>{t`L = 4\,\mathrm m`}</M> (Fig. 5.6): <M p=",">{t`\v v_A = (1, 0, 0)\,\mathrm{m/s}`}</M> <M p=",">{t`\omega = 0.5\,\mathrm{s^{-1}}`}</M> <M>{t`|\v F_B| = G = 20\,\mathrm N`}</M> (straight down at <M p="),">B</M> <M>{t`|\v F_C| = W = 15\,\mathrm N`}</M> (perpendicular to the ladder at the middle <M p=").">C</M> What is the total power? Negative means: the forces take power away from the ladder.</>} />}
          value={Q5.ladderP} unit="W" tol={0.005}
          explain={<T de={<>Weg I: <M>{t`P_B = -\tfrac{\sqrt2}{2}G\omega L \approx -28{,}3\,\mathrm W`}</M> und <M p=",">{t`P_C = W\,(\omega L/2 - \tfrac{\sqrt2}{2}v) \approx 4{,}4\,\mathrm W`}</M> zusammen <M p=".">{t`-23{,}9\,\mathrm W`}</M> Weg II: <M>{t`\v R\cdot\v v_A \approx -10{,}6\,\mathrm W`}</M> plus <M>{t`\v M_A\cdot\v\omega \approx -13{,}3\,\mathrm W`}</M> gibt dasselbe. <See id="leistung-kraeftegruppe">Kräftegruppe</See></>} en={<>Way I: <M>{t`P_B = -\tfrac{\sqrt2}{2}G\omega L \approx -28.3\,\mathrm W`}</M> and <M p=",">{t`P_C = W\,(\omega L/2 - \tfrac{\sqrt2}{2}v) \approx 4.4\,\mathrm W`}</M> together <M p=".">{t`-23.9\,\mathrm W`}</M> Way II: <M>{t`\v R\cdot\v v_A \approx -10.6\,\mathrm W`}</M> plus <M>{t`\v M_A\cdot\v\omega \approx -13.3\,\mathrm W`}</M> gives the same. <See id="leistung-kraeftegruppe">Group of forces</See></>} />}
        />
      </Section>
    </article>
  );
}
