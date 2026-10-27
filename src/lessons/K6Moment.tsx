import type { ReactNode } from 'react';
import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { LeverFigure, WheelPower } from '../viz/force/K6Figures';
import { DeriveAnim, RefAnim, RefExplorer } from '../viz/force/K6Figures3D';

const t = String.raw;

/** Captions of the derivation animation (p. 33): also shown under the figure in fullscreen. */
const DERIVE_CAPS: ReactNode[] = [
  <T key="1"
    de={<>Eine Scheibe <M>K</M> dreht sich um die senkrechte Achse <M>\mu</M> (türkis). <M>{t`\v\omega`}</M> (violett, zwei Spitzen) liegt auf der Achse. <M>O</M> ist ein Punkt der Achse, <M>P</M> ein Punkt der Scheibe, <M>{t`\v{OP}`}</M> der Pfeil von <M>O</M> nach <M p=".">P</M></>}
    en={<>A disc <M>K</M> turns about the vertical axis <M>\mu</M> (teal). <M>{t`\v\omega`}</M> (purple, two heads) lies on the axis. <M>O</M> is a point of the axis, <M>P</M> a point of the disc, <M>{t`\v{OP}`}</M> the arrow from <M>O</M> to <M p=".">P</M></>} />,
  <T key="2"
    de={<><M>P</M> läuft auf einem Kreis um die Achse. Seine Geschwindigkeit <M>{t`\v v_P = \v\omega\times\v{OP}`}</M> (rosa) steht senkrecht auf <M>{t`\v\omega`}</M> und auf <M p=",">{t`\v{OP}`}</M> also tangential zum Kreis.</>}
    en={<><M>P</M> runs on a circle about the axis. Its velocity <M>{t`\v v_P = \v\omega\times\v{OP}`}</M> (pink) is perpendicular to <M>{t`\v\omega`}</M> and to <M p=",">{t`\v{OP}`}</M> so tangent to the circle.</>} />,
  <T key="3"
    de={<>Jetzt greift die Kraft <M>\v F</M> in <M>P</M> an. Von ihr zählt nur der grüne Streifen längs <M p=":">{t`\v v_P`}</M> <M p=".">{t`P = \v F\cdot\v v_P = 0{,}96\,\text{W}`}</M></>}
    en={<>Now the force <M>\v F</M> acts at <M p=".">P</M> Of it only the green strip along <M>{t`\v v_P`}</M> counts: <M p=".">{t`P = \v F\cdot\v v_P = 0.96\,\text{W}`}</M></>} />,
  <T key="4"
    de={<>Neuer Blick: <M p=",">{t`\v\omega`}</M> <M>{t`\v{OP}`}</M> und <M>\v F</M> (als freier Pfeil nach <M>O</M> verschoben) spannen einen schiefen Quader auf. Seine Grundfläche aus <M>{t`\v\omega`}</M> und <M>{t`\v{OP}`}</M> hat den Inhalt <M p=".">{t`|\v\omega\times\v{OP}| = |\v v_P|`}</M> Volumen gleich Grundfläche mal Höhe: <M p=".">{t`V = (\v\omega\times\v{OP})\cdot\v F`}</M></>}
    en={<>A new look: <M p=",">{t`\v\omega`}</M> <M>{t`\v{OP}`}</M> and <M>\v F</M> (as a free arrow moved to <M p=")">O</M> span a slanted box. Its base from <M>{t`\v\omega`}</M> and <M>{t`\v{OP}`}</M> has area <M p=".">{t`|\v\omega\times\v{OP}| = |\v v_P|`}</M> Volume equals base times height: <M p=".">{t`V = (\v\omega\times\v{OP})\cdot\v F`}</M></>} />,
  <T key="5"
    de={<>Derselbe Quader, anders gelesen: Jetzt ist die Grundfläche aus <M>{t`\v{OP}`}</M> und <M>\v F</M> genommen. Ihre Normale ist <M>{t`\v{OP}\times\v F`}</M> (orange, zwei Spitzen). Das Volumen ist dasselbe: <M p=".">{t`V = \v\omega\cdot(\v{OP}\times\v F)`}</M></>}
    en={<>The same box, read differently: now the base is taken from <M>{t`\v{OP}`}</M> and <M p=".">\v F</M> Its normal is <M>{t`\v{OP}\times\v F`}</M> (orange, two heads). The volume is the same: <M p=".">{t`V = \v\omega\cdot(\v{OP}\times\v F)`}</M></>} />,
  <T key="6"
    de={<>Also ist <M>{t`(\v\omega\times\v{OP})\cdot\v F = \v\omega\cdot(\v{OP}\times\v F)`}</M> Den Pfeil <M>{t`\v{OP}\times\v F`}</M> nennt das Skript <M p=".">{t`\v M_O`}</M> Vom Moment zählt nur der grüne Teil längs der Achse: <M p=".">{t`P = \v\omega\cdot\v M_O = \omega M_z`}</M></>}
    en={<>So <M>{t`(\v\omega\times\v{OP})\cdot\v F = \v\omega\cdot(\v{OP}\times\v F)`}</M> The notes call the arrow <M>{t`\v{OP}\times\v F`}</M> <M p=".">{t`\v M_O`}</M> Of the moment only the green part along the axis counts: <M p=".">{t`P = \v\omega\cdot\v M_O = \omega M_z`}</M></>} />,
];

const REF_CAPS: ReactNode[] = [
  <T key="1"
    de={<>Auf der Achse liegen zwei Bezugspunkte <M>O</M> und <M p=".">{t`O'`}</M> Von jedem aus gibt es ein Moment: <M>{t`\v M_O`}</M> (orange) und <M>{t`\v M_{O'}`}</M> (hell). Es sind zwei <em>verschiedene</em> Pfeile.</>}
    en={<>Two reference points <M>O</M> and <M>{t`O'`}</M> lie on the axis. From each one there is a moment: <M>{t`\v M_O`}</M> (orange) and <M>{t`\v M_{O'}`}</M> (light). They are two <em>different</em> arrows.</>} />,
  <T key="2"
    de={<>Der Pfeil <M>{t`\v{O'P}`}</M> lässt sich in zwei Schritte teilen: erst von <M>{t`O'`}</M> nach <M>O</M> (längs der Achse), dann von <M>O</M> nach <M p=".">P</M> Also <M p=".">{t`\v{O'P} = \v{O'O} + \v{OP}`}</M></>}
    en={<>The arrow <M>{t`\v{O'P}`}</M> can be split into two steps: first from <M>{t`O'`}</M> to <M>O</M> (along the axis), then from <M>O</M> to <M p=".">P</M> So <M p=".">{t`\v{O'P} = \v{O'O} + \v{OP}`}</M></>} />,
  <T key="3"
    de={<>Mit <M>{t`\times\v F`}</M> wird daraus <M p=".">{t`\v M_{O'} = \v{O'O}\times\v F + \v M_O`}</M> Der Pfeil <M>{t`\v M_{O'}`}</M> ist nach <M>O</M> verschoben, und der schwarze Pfeil <M>{t`\v{O'O}\times\v F`}</M> schliesst das Dreieck.</>}
    en={<>Multiplying by <M>{t`\times\v F`}</M> turns this into <M p=".">{t`\v M_{O'} = \v{O'O}\times\v F + \v M_O`}</M> The arrow <M>{t`\v M_{O'}`}</M> is moved to <M p=",">O</M> and the black arrow <M>{t`\v{O'O}\times\v F`}</M> closes the triangle.</>} />,
  <T key="4"
    de={<><M>{t`\v{O'O}`}</M> liegt auf der Achse, ist also parallel zu <M p=".">{t`\v\omega`}</M> Das Kreuzprodukt <M>{t`\v{O'O}\times\v F`}</M> steht senkrecht auf <M p=",">{t`\v{O'O}`}</M> also auch senkrecht zu <M p=".">{t`\v\omega`}</M> Darum ist <M p=".">{t`\v\omega\cdot(\v{O'O}\times\v F) = 0`}</M></>}
    en={<><M>{t`\v{O'O}`}</M> lies on the axis, so it is parallel to <M p=".">{t`\v\omega`}</M> The cross product <M>{t`\v{O'O}\times\v F`}</M> is perpendicular to <M p=",">{t`\v{O'O}`}</M> so also perpendicular to <M p=".">{t`\v\omega`}</M> Hence <M p=".">{t`\v\omega\cdot(\v{O'O}\times\v F) = 0`}</M></>} />,
  <T key="5"
    de={<>Der schwarze Pfeil ist waagrecht, also haben <M>{t`\v M_O`}</M> und <M>{t`\v M_{O'}`}</M> dieselbe Höhe: denselben Teil längs der Achse, <M p=".">{t`M_z = M_z'`}</M> Folglich <M>{t`\v\omega\cdot\v M_{O'} = \v\omega\cdot\v M_O`}</M> und die Leistung ist gleich, <M p=".">{t`P = \omega M_z`}</M></>}
    en={<>The black arrow is horizontal, so <M>{t`\v M_O`}</M> and <M>{t`\v M_{O'}`}</M> have the same height: the same part along the axis, <M p=".">{t`M_z = M_z'`}</M> Hence <M>{t`\v\omega\cdot\v M_{O'} = \v\omega\cdot\v M_O`}</M> and the power is the same, <M p=".">{t`P = \omega M_z`}</M></>} />,
];

export default function K6Moment() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Tür dreht sich um ihre Angeln. Wer sie aufstösst, merkt sofort: Es kommt darauf an, <em>wo</em> und in <em>welche Richtung</em> man drückt. Das Skript fasst das in einem Pfeil zusammen, dem <b>Moment</b> <M p=".">{t`\v M_O = \v{OP}\times\v F`}</M> Mit ihm wird die Leistung bei Rotation ganz einfach: <M p=".">{t`P = \v\omega\cdot\v M_O`}</M></p>}
        en={<p className="lede">A door turns about its hinges. Whoever pushes it open notices at once: it matters <em>where</em> and in <em>which direction</em> you push. The notes sum this up in one arrow, the <b>moment</b> <M p=".">{t`\v M_O = \v{OP}\times\v F`}</M> With it the power in a rotation becomes very simple: <M p=".">{t`P = \v\omega\cdot\v M_O`}</M></p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Du stösst eine Tür auf, immer mit derselben Kraft.</p>
            <ul>
              <li><b>Nahe bei den Angeln</b> brauchst du viel Kraft, <b>weit weg</b> fast keine: Der Abstand zur Angel zählt.</li>
              <li><b>Quer zur Tür</b> drücken bringt sie in Bewegung. In der Richtung der Tür, auf die Angeln zu, drückst du nur die Angeln – es dreht sich nichts.</li>
              <li>Ein Schraubenschlüssel mit langem Griff dreht eine Schraube leichter als ein kurzer: wieder der Abstand.</li>
            </ul>
            <p>Die «Dreh-Wirksamkeit» einer Kraft hängt also von drei Dingen ab: wie stark sie ist, wie weit von der Achse sie angreift und wie quer sie dort steht. Dafür gibt es eine eigene Grösse, das <b>Moment</b> (ein Pfeil: Länge = «wie stark», Richtung = «um welche Achse»). Das Skript <em>definiert</em> das Moment einfach als <M>{t`\v{OP}\times\v F`}</M> und zeigt, dass es in der Leistung auftaucht. Dass es die Dreh-Wirksamkeit misst, ist die Deutung dahinter; sie wird in der Statik wichtig.</p>
          </>}
          en={<>
            <p>You push a door open, always with the same force.</p>
            <ul>
              <li><b>Close to the hinges</b> you need a lot of force, <b>far away</b> almost none: the distance to the hinge matters.</li>
              <li>Pushing <b>across the door</b> sets it moving. Pushing along the door, toward the hinges, you only press on the hinges – nothing turns.</li>
              <li>A wrench with a long handle turns a screw more easily than a short one: again the distance.</li>
            </ul>
            <p>The «turning effectiveness» of a force thus depends on three things: how strong it is, how far from the axis it acts, and how much across it points there. There is a quantity of its own for this, the <b>moment</b> (an arrow: length = «how strong», direction = «about which axis»). The notes simply <em>define</em> the moment as <M>{t`\v{OP}\times\v F`}</M> and show that it appears in the power. That it measures the turning effectiveness is the interpretation behind it; it becomes important in statics.</p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="skript" title={<T de="1. Die Aufgabe im Skript (S. 33)" en="1. The problem in the notes (p. 33)" />}>
        <Box kind="lecture" src={<Src p={33} />} title={<T de="Leistung einer Einzelkraft bei Rotation" en={<><De en="power of a single force in a rotation">Leistung einer Einzelkraft bei Rotation</De></>} />}>
          <T
            de={<p>«Leistung einer Einzelkraft <M>\v F</M> bei Rotation» (handschriftlich: «<M>\v F</M> in <M p="»)">P</M> Die Kraft <M>{t`\{P\,|\,\v F\}`}</M> greift in einem Punkt <M>{t`P\notin\mu`}</M> an, <M>\mu</M> ist die Drehachse. Der Punkt hat die Geschwindigkeit <M>{t`\v v_P = \v\omega\times\v{OP}`}</M> und die Leistung ist (eingerahmt):</p>}
            en={<p>«Power of a single force <M>\v F</M> in a rotation» (handwritten: «<M>\v F</M> in <M p="»)">P</M> The force <M>{t`\{P\,|\,\v F\}`}</M> acts at a point <M p=",">{t`P\notin\mu`}</M> <M>\mu</M> is the axis of rotation. The point has velocity <M>{t`\v v_P = \v\omega\times\v{OP}`}</M> and the power is (boxed):</p>}
          />
          <MD>{t`P = \underbrace{(\v\omega\times\v{OP})}_{\v v_P}\cdot\v F = \v\omega\cdot\underbrace{(\v{OP}\times\v F)}_{\v M_O}`}</MD>
          <T
            de={<>
              <p>Dazu «Leistung von <M>\v F</M> bei Starrkörperrotation»: Figur mit einem Körper, der Achse <M>\mu</M> mit <M p=",">{t`\v\omega`}</M> zwei Punkten <M>O</M> und <M>{t`O'`}</M> auf der Achse, dem Punkt <M>P</M> mit der Kraft <M>\v F</M> und <M>{t`\v e_z`}</M> in Achsenrichtung. Darunter:</p>
              <MD>{t`\begin{aligned} P &= \v F\cdot\v v_P = \v F\cdot(\v\omega\times\v{OP})\\ &= \v\omega\cdot(\v{OP}\times\v F) = \v\omega\cdot\v M_O\\ P &= \v\omega\cdot\v M_O = \v\omega\cdot\v M_{O'}\\ P &= \v\omega\cdot\v M_O = \omega\,\v e_z\cdot\v M_O = \omega\cdot M_z \end{aligned}`}</MD>
            </>}
            en={<>
              <p>Then «Power of <M>\v F</M> in a rigid-body rotation»: a figure with a body, the axis <M>\mu</M> with <M p=",">{t`\v\omega`}</M> two points <M>O</M> and <M>{t`O'`}</M> on the axis, the point <M>P</M> with the force <M>\v F</M> and <M>{t`\v e_z`}</M> along the axis. Below:</p>
              <MD>{t`\begin{aligned} P &= \v F\cdot\v v_P = \v F\cdot(\v\omega\times\v{OP})\\ &= \v\omega\cdot(\v{OP}\times\v F) = \v\omega\cdot\v M_O\\ P &= \v\omega\cdot\v M_O = \v\omega\cdot\v M_{O'}\\ P &= \v\omega\cdot\v M_O = \omega\,\v e_z\cdot\v M_O = \omega\cdot M_z \end{aligned}`}</MD>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Der Körper <M>K</M> dreht sich um die feste Gerade <M p=",">\mu</M> die <a href="#rotation">Drehachse</a>. Der Pfeil <M>{t`\v\omega`}</M> liegt auf der Achse: Seine Länge ist das Drehtempo (in rad/s), seine Richtung gibt die Rechte-Hand-Regel.</li>
              <li><M>O</M> ist irgendein fester Punkt <em>auf der Achse</em> (die Figur zeichnet es so; im Text steht es nicht ausdrücklich). <M>{t`P\notin\mu`}</M> heisst: <M>P</M> liegt nicht auf der Achse. Sonst stünde <M>P</M> still, <M>{t`\v v_P = \v 0`}</M> und die Leistung wäre null.</li>
              <li><M>{t`\v v_P = \v\omega\times\v{OP}`}</M> kennst du aus der <a href="#rotation">Rotation</a> (S. 15): <M>P</M> läuft auf einem Kreis um die Achse, die Geschwindigkeit ist tangential.</li>
              <li>Die Leistung ist <M>{t`P = \v F\cdot\v v_P`}</M> aus der <a href="#leistung">letzten Lektion</a>. Setzt man <M>{t`\v v_P`}</M> ein, steht da <M p=".">{t`(\v\omega\times\v{OP})\cdot\v F`}</M></li>
              <li>Der Trick ist die letzte Umformung: Das Kreuz und der Punkt <em>tauschen die Plätze</em>, <M p=".">{t`(\v\omega\times\v{OP})\cdot\v F = \v\omega\cdot(\v{OP}\times\v F)`}</M> Das Skript merkt dazu auf S. 35 rot an: <M p=".">{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> Warum das stimmt, zeigt die Animation gleich.</li>
              <li>Die Klammer <M>{t`\v{OP}\times\v F`}</M> bekommt einen Namen: <M p=".">{t`\v M_O`}</M> Von der Kraft und dem Punkt <M>O</M> hängt sie ab, nicht vom Körper. Die Leistung ist dann nur noch ein Skalarprodukt: <M p=".">{t`P = \v\omega\cdot\v M_O`}</M></li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>The body <M>K</M> turns about the fixed line <M p=",">\mu</M> the <a href="#rotation">axis of rotation</a>. The arrow <M>{t`\v\omega`}</M> lies on the axis: its length is the turning rate (in rad/s), its direction comes from the right-hand rule.</li>
              <li><M>O</M> is some fixed point <em>on the axis</em> (the figure draws it so; the text does not say it explicitly). <M>{t`P\notin\mu`}</M> means: <M>P</M> is not on the axis. Otherwise <M>P</M> would stand still, <M>{t`\v v_P = \v 0`}</M> and the power would be zero.</li>
              <li><M>{t`\v v_P = \v\omega\times\v{OP}`}</M> you know from <a href="#rotation">rotation</a> (p. 15): <M>P</M> runs on a circle about the axis, the velocity is tangent.</li>
              <li>The power is <M>{t`P = \v F\cdot\v v_P`}</M> from the <a href="#leistung">last lesson</a>. Putting in <M>{t`\v v_P`}</M> gives <M p=".">{t`(\v\omega\times\v{OP})\cdot\v F`}</M></li>
              <li>The trick is the last rewriting: the cross and the dot <em>swap places</em>, <M p=".">{t`(\v\omega\times\v{OP})\cdot\v F = \v\omega\cdot(\v{OP}\times\v F)`}</M> On p. 35 the notes remark in red: <M p=".">{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> Why this is true, the animation shows next.</li>
              <li>The bracket <M>{t`\v{OP}\times\v F`}</M> gets a name: <M p=".">{t`\v M_O`}</M> It depends on the force and on the point <M p=",">O</M> not on the body. The power is then just a dot product: <M p=".">{t`P = \v\omega\cdot\v M_O`}</M></li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="herleitung" title={<T de="2. Warum darf man Kreuz und Punkt tauschen?" en="2. Why may the cross and the dot swap places?" />}>
        <T
          de={<p>Die Animation baut die Rechnung von S. 33 Schritt für Schritt auf. Die Pfeile sind so gezeichnet, dass jede Zahl die Länge 1 pro Einheit hat (<M p=",">{t`1\,\text{m}`}</M> <M p=",">{t`1\,\text{N}`}</M> <M p=",">{t`1\,\text{m/s}`}</M> <M p="):">{t`1\,\text{rad/s}`}</M> Das Volumen im Bild ist darum genau die Zahl <M p=".">P</M> In diesen Bildern tragen <M>{t`\v\omega`}</M> und die Momente zwei Pfeilspitzen – eine Zeichen-Abmachung dieser Lektion, damit man sie von Kraft- und Geschwindigkeitspfeilen unterscheidet. Mit dem Vollbild-Knopf oben rechts im Bild bekommst du es gross.</p>}
          en={<p>The animation builds up the calculation of p. 33 step by step. The arrows are drawn so that every number has length 1 per unit (<M p=",">{t`1\,\text{m}`}</M> <M p=",">{t`1\,\text{N}`}</M> <M p=",">{t`1\,\text{m/s}`}</M> <M p="):">{t`1\,\text{rad/s}`}</M> the volume in the picture is therefore exactly the number <M p=".">P</M> In these pictures <M>{t`\v\omega`}</M> and the moments carry two arrowheads – a drawing convention of this lesson, to tell them apart from force and velocity arrows. The fullscreen button at the top right of the picture makes it large.</p>}
        />
        <StepPlayer
          label={tr('Animation: P = F · v_P = ω · (OP × F)', 'Animation: P = F · v_P = ω · (OP × F)')}
          steps={[2500, 3000, 3500, 4500, 4500, 4500].map((ms, i) => ({ ms, holdMs: 3500, caption: DERIVE_CAPS[i] }))}
        >
          {(step, tt) => <DeriveAnim step={step} t={tt} captions={DERIVE_CAPS} />}
        </StepPlayer>
        <T
          de={<>
            <p><b>So liest man die Animation:</b></p>
            <ol>
              <li>Drei Pfeile <M p=",">{t`\v a`}</M> <M p=",">{t`\v b`}</M> <M>{t`\v c`}</M> von einer Ecke aus spannen einen schiefen Quader (ein <b>Spat</b>) auf. Wie gross ist sein Volumen?</li>
              <li><em>Erste Lesart:</em> Nimm <M>{t`\v a`}</M> und <M>{t`\v b`}</M> als Grundfläche. Ihr Inhalt ist <M>{t`|\v a\times\v b|`}</M> und der Pfeil <M>{t`\v a\times\v b`}</M> steht senkrecht auf der Fläche. Die Höhe ist der Teil von <M>{t`\v c`}</M> längs dieses Pfeils. Volumen: <M p=".">{t`(\v a\times\v b)\cdot\v c`}</M></li>
              <li><em>Zweite Lesart:</em> Nimm <M>{t`\v b`}</M> und <M>{t`\v c`}</M> als Grundfläche. Dann ist die Höhe der Teil von <M>{t`\v a`}</M> längs <M p=",">{t`\v b\times\v c`}</M> und das Volumen <M p=".">{t`\v a\cdot(\v b\times\v c)`}</M></li>
              <li>Der Quader ist derselbe, also ist sein Volumen dasselbe: <M p=".">{t`(\v a\times\v b)\cdot\v c = \v a\cdot(\v b\times\v c)`}</M> Mit <M p=",">{t`\v a = \v\omega`}</M> <M p=",">{t`\v b = \v{OP}`}</M> <M>{t`\v c = \v F`}</M> ist das genau die Umformung von S. 33. Und weil man auch mit <M>{t`\v b`}</M> beginnen kann, gilt <M p=".">{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M></li>
            </ol>
            <details className="more">
              <summary>Dasselbe mit Zahlen (Nachrechnen)</summary>
              <p><M p=",">{t`\v\omega = (0; 0; 1)`}</M> <M p=",">{t`\v{OP} = (1{,}2; 0; 0)`}</M> <M p=":">{t`\v F = (-0{,}5; 0{,}8; 0{,}5)`}</M> <M p=",">{t`\v v_P = \v\omega\times\v{OP} = (0; 1{,}2; 0)`}</M> also <M p=".">{t`P = \v F\cdot\v v_P = 0{,}8\cdot 1{,}2 = 0{,}96`}</M> Andererseits <M>{t`\v M_O = \v{OP}\times\v F = (0; -0{,}60; 0{,}96)`}</M> und <M p=".">{t`\v\omega\cdot\v M_O = 0{,}96`}</M> Beide Wege geben <M>{t`0{,}96\,\text{W}`}</M> – wie das Volumen des Quaders.</p>
            </details>
          </>}
          en={<>
            <p><b>How to read the animation:</b></p>
            <ol>
              <li>Three arrows <M p=",">{t`\v a`}</M> <M p=",">{t`\v b`}</M> <M>{t`\v c`}</M> from one corner span a slanted box (a <b>parallelepiped</b>). How large is its volume?</li>
              <li><em>First reading:</em> take <M>{t`\v a`}</M> and <M>{t`\v b`}</M> as the base. Its area is <M>{t`|\v a\times\v b|`}</M> and the arrow <M>{t`\v a\times\v b`}</M> is perpendicular to it. The height is the part of <M>{t`\v c`}</M> along this arrow. Volume: <M p=".">{t`(\v a\times\v b)\cdot\v c`}</M></li>
              <li><em>Second reading:</em> take <M>{t`\v b`}</M> and <M>{t`\v c`}</M> as the base. Then the height is the part of <M>{t`\v a`}</M> along <M p=",">{t`\v b\times\v c`}</M> and the volume is <M p=".">{t`\v a\cdot(\v b\times\v c)`}</M></li>
              <li>The box is the same, so its volume is the same: <M p=".">{t`(\v a\times\v b)\cdot\v c = \v a\cdot(\v b\times\v c)`}</M> With <M p=",">{t`\v a = \v\omega`}</M> <M p=",">{t`\v b = \v{OP}`}</M> <M>{t`\v c = \v F`}</M> this is exactly the rewriting of p. 33. And since you can also start with <M p=",">{t`\v b`}</M> <M p=".">{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M></li>
            </ol>
            <details className="more">
              <summary>The same with numbers (check)</summary>
              <p><M p=",">{t`\v\omega = (0, 0, 1)`}</M> <M p=",">{t`\v{OP} = (1.2, 0, 0)`}</M> <M p=":">{t`\v F = (-0.5, 0.8, 0.5)`}</M> <M p=",">{t`\v v_P = \v\omega\times\v{OP} = (0, 1.2, 0)`}</M> so <M p=".">{t`P = \v F\cdot\v v_P = 0.8\cdot 1.2 = 0.96`}</M> On the other hand <M>{t`\v M_O = \v{OP}\times\v F = (0, -0.60, 0.96)`}</M> and <M p=".">{t`\v\omega\cdot\v M_O = 0.96`}</M> Both ways give <M>{t`0.96\,\text{W}`}</M> – like the volume of the box.</p>
            </details>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="moment" title={<T de="3. Das Moment: Länge, Richtung, Hebelarm (S. 34–35)" en="3. The moment: length, direction, lever arm (pp. 34–35)" />}>
        <Box kind="lecture" src={<Src p="34–35" />} title={<T de={<>Moment der Kraft bez. <M>O</M></>} en={<><De en="moment">Moment</De> of the force about <M>O</M></>} />}>
          <T
            de={<p><M p=":">{t`\v M_O`}</M> «Moment der Kraft <M>{t`\{P\,|\,\v F\}`}</M> bez. <M p=".">O</M>» Auf S. 35 heisst der Angriffspunkt <M>A</M> statt <M p=".">P</M></p>}
            en={<p><M p=":">{t`\v M_O`}</M> «moment of the force <M>{t`\{P\,|\,\v F\}`}</M> about <M p=".">O</M>» On p. 35 the point of application is called <M>A</M> instead of <M p=".">P</M></p>}
          />
          <MD>{t`\begin{aligned} \v M_O &= \v{OP}\times\v F = \v F\times\v{PO}\\ P &= \v F\cdot\v v_P = \v M_O\cdot\v\omega \end{aligned}`}</MD>
          <T
            de={<p>Figuren auf S. 35: <M>{t`\v M_O = \v{OA}\times\v F`}</M> mit dem Winkel <M>\varphi</M> zwischen <M>{t`\v{OA}`}</M> und <M>\v F</M> und <M>{t`\v M_O`}</M> senkrecht auf beiden; <M>{t`\v M_O = \v{OA}\times\v F = \v F\times\v{AO}`}</M> mit dem Winkel <M p=";">{t`\pi-\varphi`}</M> darunter drei Bilder zur Rechte-Hand-Regel (Spat, Hand, Schraube).</p>}
            en={<p>Figures on p. 35: <M>{t`\v M_O = \v{OA}\times\v F`}</M> with the angle <M>\varphi</M> between <M>{t`\v{OA}`}</M> and <M>\v F</M> and <M>{t`\v M_O`}</M> perpendicular to both; <M>{t`\v M_O = \v{OA}\times\v F = \v F\times\v{AO}`}</M> with the angle <M p=";">{t`\pi-\varphi`}</M> below, three pictures of the right-hand rule (box, hand, screw).</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>Das Moment <M>{t`\v M_O`}</M> ist ein <em>Pfeil</em>. Er gehört zur Kraft <em>und</em> zum Punkt <M p=",">O</M> von dem aus man misst. Ändert man <M p=",">O</M> ändert sich <M p=".">{t`\v M_O`}</M></li>
              <li>Es ist das Kreuzprodukt aus «Arm» <M>{t`\v{OP}`}</M> und Kraft <M p=".">\v F</M> in dieser Reihenfolge.</li>
              <li><b>Länge:</b> <M p=".">{t`|\v M_O| = |\v{OP}|\,|\v F|\sin\varphi`}</M> Gross, wenn der Arm lang ist, die Kraft gross und beide quer zueinander stehen (<M>{t`\varphi = 90^\circ`}</M> gibt den grössten Wert). Null, wenn <M>\v F</M> längs des Arms zeigt.</li>
              <li><b>Richtung:</b> senkrecht auf <M>{t`\v{OP}`}</M> und auf <M p=",">\v F</M> und zwar nach der <b>Rechte-Hand-Regel</b>: Krümme die Finger der rechten Hand von <M>{t`\v{OP}`}</M> nach <M>\v F</M> (den kurzen Weg), dann zeigt der Daumen in Richtung <M p=".">{t`\v M_O`}</M> Kurz gesagt: Dreht die Kraft gegen den Uhrzeigersinn um <M p=",">O</M> zeigt <M>{t`\v M_O`}</M> zu dir hin.</li>
              <li><M>{t`\v F\times\v{PO}`}</M> ist derselbe Pfeil: <M>{t`\v{PO} = -\v{OP}`}</M> ändert ein Vorzeichen, und die Reihenfolge zu vertauschen ändert noch eines. Der Winkel zwischen <M>\v F</M> und <M>{t`\v{PO}`}</M> ist <M p=",">{t`\pi-\varphi`}</M> aber <M>{t`\sin(\pi-\varphi) = \sin\varphi`}</M> gibt dieselbe Länge.</li>
            </ol>
            <p className="keep"><b>Der Hebelarm.</b> Auf der Wirkungslinie (der Geraden, auf der der Kraftpfeil liegt) gibt es einen Punkt, der <M>O</M> am nächsten ist. Seine Entfernung zu <M>O</M> heisst <b>Hebelarm</b> <M p=".">d</M> Im rechtwinkligen Dreieck ist <M>{t`d = |\v{OP}|\sin\varphi`}</M> und deshalb gilt <M p=".">{t`|\v M_O| = |\v F|\,d`}</M> Kraft mal Hebelarm – die Tür aus dem Anfang: weit weg und quer heisst grosser Hebelarm.</p>
            <p className="lp-see"><b>Was du sehen sollst:</b> Der Hebelarm <M>d</M> (gestrichelt, mit Winkelzeichen) ist <em>nicht</em> der Abstand <M>{t`|\v{OP}|`}</M> Schiebst du <M>P</M> entlang der Wirkungslinie, ändert sich <M>{t`|\v{OP}|`}</M> aber nicht <M>d</M> und nicht <M p=".">{t`\v M_O`}</M> Mit dem Umschalter siehst du beide Schreibweisen des Skripts: Winkel <M>\varphi</M> bei <M>{t`\v{OP}\times\v F`}</M> und <M>{t`\pi-\varphi`}</M> bei <M p=".">{t`\v F\times\v{PO}`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li>The moment <M>{t`\v M_O`}</M> is an <em>arrow</em>. It belongs to the force <em>and</em> to the point <M p=",">O</M> from which you measure. If you change <M p=",">O</M> then <M>{t`\v M_O`}</M> changes.</li>
              <li>It is the cross product of the «arm» <M>{t`\v{OP}`}</M> and the force <M p=",">\v F</M> in this order.</li>
              <li><b>Length:</b> <M p=".">{t`|\v M_O| = |\v{OP}|\,|\v F|\sin\varphi`}</M> Large when the arm is long, the force is large and the two are across each other (<M>{t`\varphi = 90^\circ`}</M> gives the largest value). Zero when <M>\v F</M> points along the arm.</li>
              <li><b>Direction:</b> perpendicular to <M>{t`\v{OP}`}</M> and to <M p=",">\v F</M> by the <b>right-hand rule</b>: curl the fingers of your right hand from <M>{t`\v{OP}`}</M> toward <M>\v F</M> (the short way), then the thumb points along <M p=".">{t`\v M_O`}</M> In short: if the force turns counter-clockwise about <M p=",">O</M> then <M>{t`\v M_O`}</M> points toward you.</li>
              <li><M>{t`\v F\times\v{PO}`}</M> is the same arrow: <M>{t`\v{PO} = -\v{OP}`}</M> changes one sign, and swapping the order changes another. The angle between <M>\v F</M> and <M>{t`\v{PO}`}</M> is <M p=",">{t`\pi-\varphi`}</M> but <M>{t`\sin(\pi-\varphi) = \sin\varphi`}</M> gives the same length.</li>
            </ol>
            <p className="keep"><b>The lever arm.</b> On the line of action (the line the force arrow lies on) there is a point closest to <M p=".">O</M> Its distance to <M>O</M> is called the <b>lever arm</b> <M p=".">d</M> In the right triangle <M>{t`d = |\v{OP}|\sin\varphi`}</M> and therefore <M p=".">{t`|\v M_O| = |\v F|\,d`}</M> Force times lever arm – the door from the beginning: far away and across means a large lever arm.</p>
            <p className="lp-see"><b>What you should see:</b> The lever arm <M>d</M> (dashed, with a right-angle mark) is <em>not</em> the distance <M p=".">{t`|\v{OP}|`}</M> If you slide <M>P</M> along the line of action, <M>{t`|\v{OP}|`}</M> changes but neither <M>d</M> nor <M p=".">{t`\v M_O`}</M> The switch shows both ways of writing it in the notes: angle <M>\varphi</M> for <M>{t`\v{OP}\times\v F`}</M> and <M>{t`\pi-\varphi`}</M> for <M p=".">{t`\v F\times\v{PO}`}</M></p>
          </>}
        />
        <LeverFigure />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="rad" title={<T de="4. Die Leistung beim Drehen im Bild" en="4. Power while turning, in a picture" />}>
        <T
          de={<>
            <p>Jetzt verbinden wir beides: die Leistung aus der letzten Lektion (nur der Teil der Kraft längs der Bewegung zählt) und das Moment. Ein Rad dreht sich mit <M p=",">{t`\v\omega`}</M> wir blicken von der Seite darauf, an der <M>{t`\v\omega`}</M> auf uns zeigt (<M p=").">{t`\odot`}</M> Die Kraft <M>\v F</M> in <M>P</M> zerlegen wir in zwei Teile: <M>{t`F_r`}</M> längs der Speiche (zur Nabe hin oder von ihr weg) und <M>{t`F_t`}</M> quer dazu, <em>tangential</em>.</p>
            <p className="lp-see"><b>Was du sehen sollst:</b> Die Geschwindigkeit <M>{t`\v v_P`}</M> zeigt tangential, also nur <M>{t`F_t`}</M> liegt längs von ihr (der dicke Streifen). <M>{t`F_r`}</M> (grau) steht senkrecht auf <M p=":">{t`\v v_P`}</M> leistungslos. Die beiden Rechnungen unten geben immer dieselbe Zahl.</p>
          </>}
          en={<>
            <p>Now we put both together: the power of the last lesson (only the part of the force along the motion counts) and the moment. A wheel turns with <M p=",">{t`\v\omega`}</M> we look at it from the side to which <M>{t`\v\omega`}</M> points (<M p=").">{t`\odot`}</M> We split the force <M>\v F</M> at <M>P</M> into two parts: <M>{t`F_r`}</M> along the spoke (toward the hub or away from it) and <M>{t`F_t`}</M> across it, <em>tangential</em>.</p>
            <p className="lp-see"><b>What you should see:</b> The velocity <M>{t`\v v_P`}</M> is tangential, so only <M>{t`F_t`}</M> lies along it (the thick strip). <M>{t`F_r`}</M> (grey) is perpendicular to <M p=":">{t`\v v_P`}</M> no power. The two calculations below always give the same number.</p>
          </>}
        />
        <WheelPower />
        <Box kind="supplement" title={<T de={<>Warum ist <M p="?">{t`M_z = r\,F_t`}</M></>} en={<>Why is <M p="?">{t`M_z = r\,F_t`}</M></>} />}>
          <T
            de={<>
              <p>Eigene Rechnung, nicht im Skript. In der Ebene ist <M>{t`\v{OP} = (x, y, 0)`}</M> und <M>{t`\v F = (F_x, F_y, 0)`}</M> und das Kreuzprodukt hat nur eine Komponente längs der Achse: <M p=".">{t`M_z = x\,F_y - y\,F_x`}</M> Dreht man die Koordinaten so, dass <M>P</M> auf der <M>x</M>-Achse liegt (<M p=",">{t`x = r`}</M> <M p=")">{t`y = 0`}</M> wird daraus <M>{t`M_z = r\,F_y`}</M> und <M>{t`F_y`}</M> ist genau der tangentiale Teil <M p=".">{t`F_t`}</M> Die Geschwindigkeit ist <M>{t`\v v_P = \omega r\,\v e_y`}</M> also <M p=",">{t`P = \v F\cdot\v v_P = F_t\,\omega r = \omega\,M_z`}</M> in Übereinstimmung mit <M p=".">{t`P = \v\omega\cdot\v M_O`}</M></p>
            </>}
            en={<>
              <p>Our own calculation, not in the notes. In the plane <M>{t`\v{OP} = (x, y, 0)`}</M> and <M>{t`\v F = (F_x, F_y, 0)`}</M> and the cross product has only one component along the axis: <M p=".">{t`M_z = x\,F_y - y\,F_x`}</M> If you rotate the coordinates so that <M>P</M> lies on the <M>x</M>-axis (<M p=",">{t`x = r`}</M> <M p=")">{t`y = 0`}</M> this becomes <M>{t`M_z = r\,F_y`}</M> and <M>{t`F_y`}</M> is exactly the tangential part <M p=".">{t`F_t`}</M> The velocity is <M>{t`\v v_P = \omega r\,\v e_y`}</M> so <M p=",">{t`P = \v F\cdot\v v_P = F_t\,\omega r = \omega\,M_z`}</M> in agreement with <M p=".">{t`P = \v\omega\cdot\v M_O`}</M></p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="bezugspunkt" title={<T de="5. Das Moment hängt vom Bezugspunkt ab, die Leistung nicht (S. 34)" en="5. The moment depends on the reference point, the power does not (p. 34)" />}>
        <Box kind="lecture" src={<Src p={34} />} title={<T de={<>Ein zweiter Punkt <M>{t`O'`}</M> auf der Achse</>} en={<>A second point <M>{t`O'`}</M> on the axis</>} />}>
          <T
            de={<p>Für <M>{t`O'\in\mu`}</M> ist <M>{t`\v M_{O'} = \v{O'P}\times\v F`}</M> mit <M p=".">{t`\v{O'P} = \v{O'O} + \v{OP}`}</M></p>}
            en={<p>For <M>{t`O'\in\mu`}</M> we have <M>{t`\v M_{O'} = \v{O'P}\times\v F`}</M> with <M p=".">{t`\v{O'P} = \v{O'O} + \v{OP}`}</M></p>}
          />
          <MD>{t`\v M_{O'}\cdot\v\omega = \v\omega\cdot\big[(\v{O'O} + \v{OP})\times\v F\big] = \underbrace{\v\omega\cdot(\v{O'O}\times\v F)}_{0} + \underbrace{\v\omega\cdot(\v{OP}\times\v F)}_{\v\omega\cdot\v M_O\ =\ P}`}</MD>
          <MD>{t`P = \v M_O\cdot\v\omega = \v M_{O'}\cdot\v\omega`}</MD>
          <T
            de={<>
              <p>«Merke:» <M p=".">{t`\v M_O = \v{OP}\times\v F \neq \v M_{O'} = \v{O'P}\times\v F`}</M> Mit <M>{t`\mu\equiv z`}</M> (die Achse ist die <M>z</M>-Achse) gilt <M p=",">{t`P = M_z\cdot\omega = M_{z'}\cdot\omega`}</M> «Projektion von <M>{t`\v M`}</M> in <M>z</M>-Richtung». Handschriftlich: <M p=".">{t`P = \omega\,\v e_z\cdot\v M_O = \omega\,\v e_z\cdot\v M_{O'}`}</M> Dann <M p=",">{t`M_{z'} = \v M_{O'}\cdot\v e_z`}</M> <M p=",">{t`M_z = \v M_O\cdot\v e_z`}</M> «<M>{t`M_z = M_z'`}</M>» mit der Probe <M p=".">{t`(\v{OP}\times\v F)\cdot\v e_z \overset{?}{=} ((\v{O'O}+\v{OP})\times\v F)\cdot\v e_z = \underbrace{(\v{O'O}\times\v F)\cdot\v e_z}_{0} + (\v{OP}\times\v F)\cdot\v e_z`}</M></p>
            </>}
            en={<>
              <p>«Note:» <M p=".">{t`\v M_O = \v{OP}\times\v F \neq \v M_{O'} = \v{O'P}\times\v F`}</M> With <M>{t`\mu\equiv z`}</M> (the axis is the <M>z</M>-axis) <M p=",">{t`P = M_z\cdot\omega = M_{z'}\cdot\omega`}</M> «projection of <M>{t`\v M`}</M> in <M>z</M>-direction». Handwritten: <M p=".">{t`P = \omega\,\v e_z\cdot\v M_O = \omega\,\v e_z\cdot\v M_{O'}`}</M> Then <M p=",">{t`M_{z'} = \v M_{O'}\cdot\v e_z`}</M> <M p=",">{t`M_z = \v M_O\cdot\v e_z`}</M> «<M>{t`M_z = M_z'`}</M>» with the check <M p=".">{t`(\v{OP}\times\v F)\cdot\v e_z \overset{?}{=} ((\v{O'O}+\v{OP})\times\v F)\cdot\v e_z = \underbrace{(\v{O'O}\times\v F)\cdot\v e_z}_{0} + (\v{OP}\times\v F)\cdot\v e_z`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep">Das ist wichtig, weil man den Bezugspunkt frei wählen darf. Aber Vorsicht: Das <em>Moment</em> selbst ändert sich mit dem Punkt – nur sein Teil längs der Achse nicht. Probier es aus.</p>
            <p className="lp-see"><b>Was du sehen sollst:</b> Schiebe <M>{t`O'`}</M> auf der Achse. <M>{t`\v M_O`}</M> (orange, an <M p=")">O</M> bleibt, <M>{t`\v M_{O'}`}</M> (hell, an <M p=")">{t`O'`}</M> ändert Richtung und Länge. Die grünen Stücke auf der Achse – der Teil längs der Achse – sind immer gleich lang. Bei <M>{t`O' = O`}</M> fallen die beiden Pfeile zusammen. Die Knöpfe oben wählen die Kraft: «parallel zur Achse» macht <M>{t`\v M`}</M> waagrecht, und <M>{t`P = 0`}</M></p>
          </>}
          en={<>
            <p className="keep">This matters because you may choose the reference point freely. But be careful: the <em>moment</em> itself changes with the point – only its part along the axis does not. Try it.</p>
            <p className="lp-see"><b>What you should see:</b> Slide <M>{t`O'`}</M> along the axis. <M>{t`\v M_O`}</M> (orange, at <M p=")">O</M> stays, <M>{t`\v M_{O'}`}</M> (light, at <M p=")">{t`O'`}</M> changes direction and length. The green pieces on the axis – the part along the axis – are always equally long. At <M>{t`O' = O`}</M> the two arrows coincide. The buttons at the top choose the force: «parallel to the axis» makes <M>{t`\v M`}</M> horizontal, and <M>{t`P = 0`}</M></p>
          </>}
        />
        <RefExplorer />
        <T
          de={<p>Und warum das stimmt, zeigt der Beweis des Skripts, als Bild: Die einzige Zutat ist, dass <M>{t`\v{O'O}`}</M> auf der Achse liegt.</p>}
          en={<p>And why it is true is shown by the proof of the notes, as a picture: the only ingredient is that <M>{t`\v{O'O}`}</M> lies on the axis.</p>}
        />
        <StepPlayer
          label={tr('Animation: Beweis, dass P nicht von O′ abhängt', 'Animation: proof that P does not depend on O′')}
          steps={[3500, 3500, 4500, 3500, 3500].map((ms, i) => ({ ms, holdMs: 3500, caption: REF_CAPS[i] }))}
        >
          {(step, tt) => <RefAnim step={step} t={tt} captions={REF_CAPS} />}
        </StepPlayer>
        <T
          de={<>
            <p><b>So liest man den Beweis:</b></p>
            <ol>
              <li><M>{t`O'\in\mu`}</M> heisst: <M>{t`O'`}</M> ist ein zweiter Punkt auf der Achse.</li>
              <li><M>{t`\v{O'P} = \v{O'O} + \v{OP}`}</M> ist die Pfeil-Addition: Erst von <M>{t`O'`}</M> nach <M p=",">O</M> dann von <M>O</M> nach <M p=".">P</M></li>
              <li>Man setzt das in <M>{t`\v{O'P}\times\v F`}</M> ein und multipliziert aus: Das Kreuzprodukt ist verträglich mit der Summe. Es entsteht <M>{t`\v{O'O}\times\v F`}</M> plus <M>{t`\v{OP}\times\v F = \v M_O`}</M> (die «0» und «<M p="»">{t`\v\omega\cdot\v M_O`}</M> unter den Klammern des Skripts).</li>
              <li>Mit <M>{t`\v\omega`}</M> multipliziert fällt der erste Teil weg, weil <M>{t`\v{O'O}\parallel\v\omega`}</M> ist: Ein Kreuzprodukt steht senkrecht auf seinen Faktoren, und senkrechte Vektoren haben das Skalarprodukt 0. In der Quader-Sprache: Der Quader aus <M p=",">{t`\v\omega`}</M> <M p=",">{t`\v{O'O}`}</M> <M>\v F</M> ist flach, sein Volumen null.</li>
              <li>Übrig bleibt <M>{t`\v\omega\cdot\v M_O`}</M> und das ist <M p=".">P</M> Darum ist <M p=".">{t`P = \v M_O\cdot\v\omega = \v M_{O'}\cdot\v\omega`}</M></li>
            </ol>
            <p><b>Was «<M>{t`\mu\equiv z`}</M>» heisst.</b> Wir dürfen unsere Koordinaten so legen, dass die <M>z</M>-Achse genau die Drehachse ist. Dann ist <M>{t`\v\omega = \omega\,\v e_z`}</M> und <M p=".">{t`\v\omega\cdot\v M_O = \omega\,(\v e_z\cdot\v M_O) = \omega M_z`}</M> Das Skalarprodukt mit dem Einheitsvektor <M>{t`\v e_z`}</M> ist die Komponente (der «Streifen» aus der letzten Lektion): <M>{t`M_z`}</M> ist der Teil von <M>{t`\v M_O`}</M> längs der Achse. Das ist auch die Zahl, die zählt.</p>
          </>}
          en={<>
            <p><b>How to read the proof:</b></p>
            <ol>
              <li><M>{t`O'\in\mu`}</M> means: <M>{t`O'`}</M> is a second point on the axis.</li>
              <li><M>{t`\v{O'P} = \v{O'O} + \v{OP}`}</M> is arrow addition: first from <M>{t`O'`}</M> to <M p=",">O</M> then from <M>O</M> to <M p=".">P</M></li>
              <li>You put this into <M>{t`\v{O'P}\times\v F`}</M> and multiply out: the cross product is compatible with sums. This gives <M>{t`\v{O'O}\times\v F`}</M> plus <M>{t`\v{OP}\times\v F = \v M_O`}</M> (the «0» and «<M p="»">{t`\v\omega\cdot\v M_O`}</M> under the brackets in the notes).</li>
              <li>Multiplied with <M>{t`\v\omega`}</M> the first part drops out, because <M p=":">{t`\v{O'O}\parallel\v\omega`}</M> a cross product is perpendicular to its factors, and perpendicular vectors have dot product 0. In the language of the box: the box of <M p=",">{t`\v\omega`}</M> <M p=",">{t`\v{O'O}`}</M> <M>\v F</M> is flat, its volume zero.</li>
              <li>What remains is <M>{t`\v\omega\cdot\v M_O`}</M> and that is <M p=".">P</M> So <M p=".">{t`P = \v M_O\cdot\v\omega = \v M_{O'}\cdot\v\omega`}</M></li>
            </ol>
            <p><b>What «<M>{t`\mu\equiv z`}</M>» means.</b> We may place our coordinates so that the <M>z</M>-axis is exactly the axis of rotation. Then <M>{t`\v\omega = \omega\,\v e_z`}</M> and <M p=".">{t`\v\omega\cdot\v M_O = \omega\,(\v e_z\cdot\v M_O) = \omega M_z`}</M> The dot product with the unit vector <M>{t`\v e_z`}</M> is the component (the «strip» of the last lesson): <M>{t`M_z`}</M> is the part of <M>{t`\v M_O`}</M> along the axis. That is also the number that counts.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section long id="missverstaendnisse" title={<T de="6. Häufige Missverständnisse" en="6. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Das Moment ist eine Eigenschaft der Kraft allein.»" en="“The moment is a property of the force alone.”" />}>
          <T
            de={<>Nein: <M>{t`\v M_O = \v{OP}\times\v F`}</M> hängt vom Bezugspunkt <M>O</M> ab, und <M>{t`\v M_O \neq \v M_{O'}`}</M> (S. 34, «Merke»). Dieselbe Kraft hat bezüglich verschiedener Punkte verschiedene Momente. Nur der Teil längs der Achse, <M p=",">{t`M_z`}</M> und damit die Leistung <M>{t`P = \omega M_z`}</M> ist für alle Punkte der Achse gleich.</>}
            en={<>No: <M>{t`\v M_O = \v{OP}\times\v F`}</M> depends on the reference point <M p=",">O</M> and <M>{t`\v M_O \neq \v M_{O'}`}</M> (p. 34, «Merke»). The same force has different moments about different points. Only the part along the axis, <M p=",">{t`M_z`}</M> and hence the power <M>{t`P = \omega M_z`}</M> is the same for all points of the axis.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«Der Hebelarm ist der Abstand von <M>O</M> zu <M p="»">P</M></>} en={<>“The lever arm is the distance from <M>O</M> to <M p="”">P</M></>} />}>
          <T
            de={<>Der Hebelarm ist der <em>kürzeste</em> Abstand von <M>O</M> zur <em>Wirkungslinie</em>, also <M p=",">{t`d = |\v{OP}|\sin\varphi`}</M> nicht <M p=".">{t`|\v{OP}|`}</M> Zeigt <M>\v F</M> genau auf <M>O</M> zu, ist <M>d = 0</M> obwohl <M>P</M> weit weg liegt: Wer am Arm entlang zieht, dreht nichts. Der Schieber in der Figur zeigt es.</>}
            en={<>The lever arm is the <em>shortest</em> distance from <M>O</M> to the <em>line of action</em>, so <M p=",">{t`d = |\v{OP}|\sin\varphi`}</M> not <M p=".">{t`|\v{OP}|`}</M> If <M>\v F</M> points exactly toward <M>O</M> then <M>d = 0</M> although <M>P</M> is far away: pulling along the arm turns nothing. The slider in the figure shows it.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«N·m ist dasselbe wie Joule, also ist das Moment eine Energie.»" en="“N·m is the same as joule, so the moment is an energy.”" />}>
          <T
            de={<>Die Einheiten stimmen zufällig überein, die Grössen nicht: Das Moment ist ein <em>Pfeil</em> mit Richtung (Rechte-Hand-Regel), Energie ist eine Zahl ohne Richtung. Die Verbindung steht in der Leistung: Moment mal Drehtempo, <M p=",">{t`\text{N\,m}\cdot\text{s}^{-1} = \text{W}`}</M> wobei «rad» keine Einheit ist, die man mitrechnen muss.</>}
            en={<>The units coincide by chance, the quantities do not: the moment is an <em>arrow</em> with a direction (right-hand rule), energy is a number without direction. The connection is in the power: moment times turning rate, <M p=",">{t`\text{N\,m}\cdot\text{s}^{-1} = \text{W}`}</M> where «rad» is not a unit that has to be carried along.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Das Moment zeigt in die Richtung, in die die Kraft drückt.»" en="“The moment points in the direction in which the force pushes.”" />}>
          <T
            de={<>Nein. <M>{t`\v M_O`}</M> steht senkrecht auf <M>\v F</M> <em>und</em> auf <M p=".">{t`\v{OP}`}</M> Bei einer Tür, die du von oben ansiehst, zeigt <M>{t`\v M_O`}</M> nach oben oder unten, während du waagrecht drückst. Welche der beiden Richtungen, sagt die Rechte-Hand-Regel, nicht «links» oder «rechts»: Gegen den Uhrzeigersinn heisst zum Betrachter hin.</>}
            en={<>No. <M>{t`\v M_O`}</M> is perpendicular to <M>\v F</M> <em>and</em> to <M p=".">{t`\v{OP}`}</M> For a door seen from above, <M>{t`\v M_O`}</M> points up or down while you push horizontally. Which of the two directions is given by the right-hand rule, not by «left» or «right»: counter-clockwise means toward the viewer.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="merke" title={<T de="7. Das Wichtigste" en="7. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=",">{t`\v v_P = \v\omega\times\v{OP}`}</M> <M p=".">{t`P = \v F\cdot\v v_P = (\v\omega\times\v{OP})\cdot\v F = \v\omega\cdot(\v{OP}\times\v F)`}</M></li>
              <li>Moment: <M p=".">{t`\v M_O = \v{OP}\times\v F = \v F\times\v{PO}`}</M> Länge <M p=",">{t`|\v F|\,d`}</M> Hebelarm <M>d</M> = Abstand von <M>O</M> zur Wirkungslinie; Richtung nach der Rechte-Hand-Regel, senkrecht auf <M>{t`\v{OP}`}</M> und <M p=".">\v F</M></li>
              <li><M p=":">{t`P = \v\omega\cdot\v M_O = \omega M_z`}</M> nur der Teil von <M>{t`\v M_O`}</M> längs der Achse zählt.</li>
              <li><M>{t`\v M_O\neq\v M_{O'}`}</M> für zwei Punkte der Achse, aber <M>{t`M_z = M_z'`}</M> und <M>P</M> sind gleich – weil <M>{t`\v{O'O}\parallel\v\omega`}</M> ist.</li>
            </ul>}
            en={<ul>
              <li><M p=",">{t`\v v_P = \v\omega\times\v{OP}`}</M> <M p=".">{t`P = \v F\cdot\v v_P = (\v\omega\times\v{OP})\cdot\v F = \v\omega\cdot(\v{OP}\times\v F)`}</M></li>
              <li>Moment: <M p=".">{t`\v M_O = \v{OP}\times\v F = \v F\times\v{PO}`}</M> Length <M p=",">{t`|\v F|\,d`}</M> lever arm <M>d</M> = distance from <M>O</M> to the line of action; direction by the right-hand rule, perpendicular to <M>{t`\v{OP}`}</M> and <M p=".">\v F</M></li>
              <li><M p=":">{t`P = \v\omega\cdot\v M_O = \omega M_z`}</M> only the part of <M>{t`\v M_O`}</M> along the axis counts.</li>
              <li><M>{t`\v M_O\neq\v M_{O'}`}</M> for two points of the axis, but <M>{t`M_z = M_z'`}</M> and <M>P</M> are the same – because <M>{t`\v{O'O}\parallel\v\omega`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Die Leistung <M>{t`P = \v F\cdot\v v`}</M> kommt aus der <a href="#leistung">letzten Lektion</a>, <M>{t`\v v_P = \v\omega\times\v{OP}`}</M> aus der <a href="#rotation">Rotation</a>, Skalar- und Kreuzprodukt aus den <a href="#vektoren">Vektoren</a>. Im nächsten Schritt wirken <em>mehrere</em> Kräfte auf einen starren Körper, der sich dreht <em>und</em> verschiebt: Dort kommt die Summe aller Momente, <M>{t`\v M_B`}</M> dazu (<a href="#leistung-kraeftegruppe">Leistung einer Kräftegruppe</a>).</p>}
          en={<p className="connections"><b>Connections:</b> the power <M>{t`P = \v F\cdot\v v`}</M> comes from the <a href="#leistung">last lesson</a>, <M>{t`\v v_P = \v\omega\times\v{OP}`}</M> from <a href="#rotation">rotation</a>, dot and cross product from <a href="#vektoren">vectors</a>. In the next step <em>several</em> forces act on a rigid body that turns <em>and</em> shifts: there the sum of all moments, <M>{t`\v M_B`}</M> comes in (<a href="#leistung-kraeftegruppe">power of a group of forces</a>).</p>}
        />
      </Section>
    </article>
  );
}
