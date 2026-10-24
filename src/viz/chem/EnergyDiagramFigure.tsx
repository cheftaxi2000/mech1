import { useState } from 'react';
import { chemTex } from '../../chem/tex';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import { SceneFig, ThChips } from './ChemFig';
import { cbuilder, type CScene } from './cscene';

const t = String.raw;
export type Dir = 'fwd' | 'rev';

/** Slide 11: energy diagram of 2 H₂ + O₂ → 2 H₂O(l). `rev` = the reverse reaction (ΔE > 0). 400 × 300. */
export function energyDiagScene(dir: Dir, lang: Lang): CScene {
  const b = cbuilder(400, 300);
  const de = lang === 'de';
  const R = chemTex('2 H2(g) + O2(g)'), P = chemTex('2 H2O(l)');
  const yR = dir === 'fwd' ? 80 : 210, yP = dir === 'fwd' ? 210 : 80; // initial / final level
  b.arrow('axis', 'th-a-muted', [40, 280], [40, 24], 1, 8);
  b.label('lab-E', [52, 26], 'E', 'muted', 1, 'l');
  b.line('lv-i', 'th-level', [90, yR], [210, yR]); b.line('lv-f', 'th-level', [90, yP], [210, yP]);
  b.label('n-i', [150, yR + (dir === 'fwd' ? -16 : 18)], dir === 'fwd' ? R : P, 'fg', 1, 'c', { small: true });
  b.label('n-f', [150, yP + (dir === 'fwd' ? 18 : -16)], dir === 'fwd' ? P : R, 'fg', 1, 'c', { small: true });
  b.label('l-i', [96, yR + (dir === 'fwd' ? 16 : -14)], String.raw`E_\mathrm{initial}`, 'muted', 1, 'l', { small: true });
  b.label('l-f', [96, yP + (dir === 'fwd' ? -14 : 16)], String.raw`E_\mathrm{final}`, 'muted', 1, 'l', { small: true });
  b.arrow('dE', dir === 'fwd' ? 'th-a-t' : 'th-a-p', [150, yR + (dir === 'fwd' ? 4 : -4)], [150, yP - (dir === 'fwd' ? 4 : -4)], 1, 10);
  b.label('lab-dE', [160, (yR + yP) / 2], dir === 'fwd' ? String.raw`\Delta E < 0` : String.raw`\Delta E > 0`, dir === 'fwd' ? 't' : 'p', 1, 'l');
  // energy flow to / from the surroundings
  const sx = 262;
  if (dir === 'fwd') { b.arrow('flow', 'th-a-e th-flow', [sx, 150], [sx + 90, 150], 1, 10); b.label('lab-flow', [sx + 45, 126], de ? String.raw`\text{an die Umgebung}` : String.raw`\text{to surroundings}`, 'e', 1, 'c', { small: true }); }
  else { b.arrow('flow', 'th-a-e th-flow', [sx + 90, 150], [sx, 150], 1, 10); b.label('lab-flow', [sx + 45, 126], de ? String.raw`\text{aus der Umgebung}` : String.raw`\text{from surroundings}`, 'e', 1, 'c', { small: true }); }
  return b.finish({ dir: dir === 'fwd' ? 0 : 1, dE: dir === 'fwd' ? -1 : 1 });
}

export function EnergyDiagramFigure() {
  const tr = useTr(), lang = useLang();
  const [dir, setDir] = useState<Dir>('fwd');
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={energyDiagScene(dir, lang)} label={tr('Energiediagramm: die Stufe der Ausgangsstoffe und die der Produkte; der Pfeil zeigt die Richtung der Reaktion', 'Energy diagram: the level of the reactants and of the products; the arrow shows the direction of the reaction')} />
      <figcaption>
        <ThChips label={tr('Richtung', 'Direction')} value={dir} onPick={setDir} items={[
          { id: 'fwd', label: <T de="Knallgas brennt" en="oxyhydrogen burns" /> },
          { id: 'rev', label: <T de="Wasser wird zerlegt" en="water is split" /> },
        ]} />
        <div className="th-read" aria-live="polite">
          {dir === 'fwd'
            ? <T de={<><M>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial} < 0`}</M> Das System hat Energie verloren, sie ging an die Umgebung.</>} en={<><M>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial} < 0`}</M> The system lost energy; it went to the surroundings.</>} />
            : <T de={<><M>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial} > 0`}</M> Das System hat Energie gewonnen, sie kam aus der Umgebung.</>} en={<><M>{t`\Delta E = E_\mathrm{final} - E_\mathrm{initial} > 0`}</M> The system gained energy; it came from the surroundings.</>} />}
        </div>
      </figcaption>
    </figure>
  );
}
