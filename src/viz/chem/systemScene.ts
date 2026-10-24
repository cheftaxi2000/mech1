/**
 * Slide 9 / exercise class 4: open, closed and isolated systems. 400 × 300.
 * open: pot without lid — matter (purple) and energy (red) cross the boundary;
 * closed: cylinder with piston — energy (red heat, amber work) crosses, matter does not;
 * isolated: thermos flask — nothing crosses (blocked arrows).
 */
import type { Lang } from '../../i18n';
import { cbuilder, type CScene } from './cscene';

export type SysKind = 'open' | 'closed' | 'isolated';
export const SYS_FLOWS: Record<SysKind, { matter: boolean; energy: boolean }> = {
  open: { matter: true, energy: true }, closed: { matter: false, energy: true }, isolated: { matter: false, energy: false },
};

const ATOMS: [number, number][] = [[168, 176], [196, 192], [226, 172], [182, 150], [214, 148], [244, 190], [158, 198]];

export function systemScene(kind: SysKind, lang: Lang): CScene {
  const b = cbuilder(400, 300);
  const de = lang === 'de';
  const X0 = 140, X1 = 260, Y0 = 100, Y1 = 230;
  b.label('lab-surr', [10, 10], de ? String.raw`\text{Umgebung}` : String.raw`\text{surroundings}`, 'muted', 1, 'tl');
  const cross = (key: string, x: number, y: number) => { // a blocked arrow: red cross on the wall
    b.line(`${key}-a`, 'th-a-bad', [x - 7, y - 7], [x + 7, y + 7]); b.line(`${key}-b`, 'th-a-bad', [x - 7, y + 7], [x + 7, y - 7]);
  };
  if (kind === 'open') {
    b.rect('liquid', 'th-water', X0 + 3, 150, X1 - X0 - 6, Y1 - 150 - 2, 1, 4);
    b.shape('pot', 'polyline', 'th-wall', [[X0, Y0], [X0, Y1], [X1, Y1], [X1, Y0]]);
    b.line('h-l', 'th-wall', [X0, Y0 + 6], [X0 - 22, Y0 + 6]); b.line('h-r', 'th-wall', [X1, Y0 + 6], [X1 + 22, Y0 + 6]);
    b.arrow('steam-1', 'th-a-n th-flow', [172, 96], [172, 36], 1, 9);
    b.arrow('steam-2', 'th-a-n th-flow', [228, 96], [228, 46], 1, 9);
    b.label('lab-matter', [244, 40], de ? String.raw`\text{Materie}` : String.raw`\text{matter}`, 'n', 1, 'l');
    b.arrow('heat-1', 'th-a-t th-flow', [172, 290], [172, 240], 1, 9);
    b.arrow('heat-2', 'th-a-t th-flow', [228, 290], [228, 240], 1, 9);
    b.label('lab-heat', [250, 268], de ? String.raw`\text{Wärme}` : String.raw`\text{heat}`, 't', 1, 'l');
  } else if (kind === 'closed') {
    b.rect('gas', 'th-gas', X0, 130, X1 - X0, Y1 - 130);
    b.shape('walls', 'polyline', 'th-wall', [[X0, Y0 - 24], [X0, Y1], [X1, Y1], [X1, Y0 - 24]]);
    b.rect('piston', 'th-piston', X0 + 2, 121, X1 - X0 - 4, 9, 1, 2);
    b.line('rod', 'th-wall', [200, 121], [200, 52]); b.line('handle', 'th-wall', [176, 52], [224, 52]);
    b.arrow('work', 'th-a-e', [150, 62], [150, 110], 1, 9);
    b.label('lab-work', [128, 84], de ? String.raw`\text{Arbeit}` : String.raw`\text{work}`, 'e', 1, 'r');
    b.arrow('heat-1', 'th-a-t th-flow', [172, 290], [172, 240], 1, 9);
    b.arrow('heat-2', 'th-a-t th-flow', [228, 290], [228, 240], 1, 9);
    b.label('lab-heat', [250, 268], de ? String.raw`\text{Wärme}` : String.raw`\text{heat}`, 't', 1, 'l');
    cross('nomatter', 276, 150);
    b.label('lab-nomatter', [292, 150], de ? String.raw`\text{keine Materie}` : String.raw`\text{no matter}`, 'n', 1, 'l', { small: true });
  } else {
    b.shape('outer', 'polyline', 'th-wall', [[X0 - 10, Y0 - 12], [X0 - 10, Y1 + 8], [X1 + 10, Y1 + 8], [X1 + 10, Y0 - 12]]);
    b.shape('inner', 'polyline', 'th-wall-thin', [[X0 + 4, Y0 - 12], [X0 + 4, Y1 - 4], [X1 - 4, Y1 - 4], [X1 - 4, Y0 - 12]]);
    b.rect('cap', 'th-piston', X0 - 14, Y0 - 26, X1 - X0 + 28, 14, 1, 4);
    b.rect('gas', 'th-gas', X0 + 5, Y0, X1 - X0 - 10, Y1 - Y0 - 8);
    b.arrow('heat-1', 'th-a-t', [172, 290], [172, 252], 1, 9); cross('x-heat', 172, 244);
    b.label('lab-heat', [196, 274], de ? String.raw`\text{Wärme}` : String.raw`\text{heat}`, 't', 1, 'l');
    b.arrow('m-1', 'th-a-n', [60, 168], [118, 168], 1, 9); cross('x-m', 128, 168);
    b.label('lab-matter', [34, 148], de ? String.raw`\text{Materie}` : String.raw`\text{matter}`, 'n', 1, 'l');
  }
  ATOMS.forEach(([x, y], i) => b.circle(`a${i}`, 'th-atom', [x, y + (kind === 'closed' ? 14 : 0)], 6));
  b.label('lab-sys', [200, Y0 + 30], String.raw`\text{System}`, 'fg', 1, 'c', { small: true });
  return b.finish({ kind: ['open', 'closed', 'isolated'].indexOf(kind) });
}
