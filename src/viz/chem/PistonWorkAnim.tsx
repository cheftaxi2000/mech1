import { M } from '../../components/Tex';
import { T, useLang, useTr } from '../../i18n';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { SceneFig } from './ChemFig';
import { pistonScene } from './pistonScene';

const t = String.raw;

/** Derivation of slides 16–17: pressure–volume work and ΔH = q_p, one animation step per derivation step. */
export function PistonWorkAnim() {
  const tr = useTr(), lang = useLang();
  const steps: AnimStep[] = [
    { ms: 600, holdMs: 2600, caption: <T
      de={<>Ein Gas im Zylinder, der Kolben hat die Fläche <M>A</M>. Von aussen drückt der gleichbleibende Druck <M>P</M> (blaue Pfeile) auf den Kolben.</>}
      en={<>A gas in a cylinder, the piston has area <M>A</M>. From outside the constant pressure <M>P</M> (blue arrows) presses on the piston.</>} /> },
    { ms: 2400, holdMs: 2200, caption: <T
      de={<>Das Gas dehnt sich aus und schiebt den Kolben um <M>{t`\Delta x`}</M> nach oben. Wie viel Arbeit steckt darin?</>}
      en={<>The gas expands and pushes the piston up by <M>{t`\Delta x`}</M>. How much work is that?</>} /> },
    { ms: 1800, holdMs: 3200, caption: <T
      de={<>Arbeit ist Kraft mal Weg. Die Kraft ist Druck mal Fläche: <M p=".">{t`F = P\,A`}</M> Das Gas gibt die Arbeit ab, darum steht ein Minus: <M p=".">{t`w = -F\,\Delta x`}</M></>}
      en={<>Work is force times distance. The force is pressure times area: <M p=".">{t`F = P\,A`}</M> The gas gives the work away, so there is a minus: <M p=".">{t`w = -F\,\Delta x`}</M></>} /> },
    { ms: 1800, holdMs: 3200, caption: <T
      de={<><M>{t`A\,\Delta x`}</M> ist das Volumen, das der Kolben überstrichen hat (grün): <M p=".">{t`\Delta V = A\,\Delta x`}</M> Also ist <M p=",">{t`w = -P\,\Delta V`}</M> die Druck-Volumen-Arbeit.</>}
      en={<><M>{t`A\,\Delta x`}</M> is the volume the piston has swept (green): <M p=".">{t`\Delta V = A\,\Delta x`}</M> So <M p=",">{t`w = -P\,\Delta V`}</M> is the pressure–volume work.</>} /> },
    { ms: 2400, holdMs: 3200, caption: <T
      de={<>Die Energiebuchhaltung: Wärme <M>{t`q_p`}</M> kommt hinein (rot), Arbeit <M>w</M> geht hinaus (gelb). Übrig bleibt <M p=".">{t`\Delta E = q_p + w`}</M> Die Zahlen sind nur ein Beispiel.</>}
      en={<>The energy ledger: heat <M>{t`q_p`}</M> comes in (red), work <M>w</M> goes out (amber). What is left is <M p=".">{t`\Delta E = q_p + w`}</M> The numbers are just an example.</>} /> },
    { ms: 2800, holdMs: 3600, caption: <T
      de={<>Nun <M p=":">{t`\Delta H = \Delta E + P\Delta V`}</M> Der Term <M>{t`P\Delta V`}</M> ist genau <M p=",">{t`-w`}</M> der gelbe Balken hebt den von <M>w</M> auf. Es bleibt <M p=".">{t`\Delta H = q_p`}</M></>}
      en={<>Now <M p=":">{t`\Delta H = \Delta E + P\Delta V`}</M> The term <M>{t`P\Delta V`}</M> is exactly <M p=",">{t`-w`}</M> the amber bar cancels that of <M>w</M>. What remains is <M p=".">{t`\Delta H = q_p`}</M></>} /> },
  ];
  return (
    <StepPlayer steps={steps} label={tr('Ein Gas schiebt einen Kolben nach oben; danach die Energiebalken für ΔE und ΔH', 'A gas pushes a piston up; then the energy bars for ΔE and ΔH')}>
      {(step, tt) => <SceneFig scene={pistonScene(step, tt, lang)} label={tr('Zylinder mit Kolben und Energiebalken', 'Cylinder with piston and energy bars')} />}
    </StepPlayer>
  );
}
