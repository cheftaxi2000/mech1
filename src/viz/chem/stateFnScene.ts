/**
 * Slide 15 / exercise 4: ΔE is a state function, q and w are not. 560 × 300.
 * Left: the hill picture — two paths between the same two heights (E_initial, E_final).
 * Right: for each method the three numbers q, w, ΔE as bars hanging from the zero line; the ΔE bars are always equally long.
 * Numbers (supplement): 2 H₂ + O₂ → 2 H₂O(l) at 298 K, ΔH = −571.6 kJ, Δn_gas = −3 ⇒ ΔE = ΔH − Δn·RT = −564.2 kJ.
 */
import type { Lang } from '../../i18n';
import { dEfromdH } from '../../chem/thermo';
import { cbuilder, type CScene } from './cscene';

export const DH_WATER_L = -571.6; // kJ, from the formation table (2 × −285.8)
export const DE_WATER_L = dEfromdH(DH_WATER_L, -3, 298.15); // kJ ≈ −564.16
export const SF = { W: 560, H: 300, zero: 64, k: 0.32, x0: 292, col: 42, gap: 18 } as const;
export const W_RANGE: [number, number] = [-300, 20];
const y = (E: number) => SF.zero - E * SF.k;
const r0 = (x: number) => (x < 0 ? '\\!-\\!' : x > 0 ? '+' : '') + Math.abs(Math.round(x)).toString();

/** `w2` = work in method 2 (kJ); method 1 has w = 0 (everything leaves as heat). */
export function stateFnScene(w2: number, lang: Lang): CScene {
  const { W, H, x0, col, gap } = SF;
  const dE = DE_WATER_L;
  const b = cbuilder(W, H);
  const de = lang === 'de';
  // ---- hill picture
  const yA = 70, yB = 214, xA = 40, xB = 236;
  b.line('lvl-A', 'th-l-dash', [14, yA], [262, yA]); b.line('lvl-B', 'th-l-dash', [14, yB], [262, yB]);
  b.shape('ground', 'polygon', 'th-f', [[14, 290], [14, 252], [60, 246], [110, 258], [160, 244], [210, 252], [262, 240], [262, 290]]);
  b.shape('path1', 'polyline', 'th-l-fg', Array.from({ length: 21 }, (_, i) => { const u = i / 20; return [xA + (xB - xA) * u, yA + (yB - yA) * (u * u * (3 - 2 * u))] as [number, number]; }));
  b.shape('path2', 'polyline', 'th-l-e', Array.from({ length: 41 }, (_, i) => { const u = i / 40; return [xA + (xB - xA) * u, yA + (yB - yA) * u + 34 * Math.sin(u * Math.PI * 3.2) * (1 - u) - 26 * Math.sin(u * Math.PI)] as [number, number]; }));
  b.circle('pA', 'th-s-t', [xA, yA], 5.5); b.circle('pB', 'th-s-t', [xB, yB], 5.5);
  b.arrow('dE-arrow', 'th-a-fg', [262, yA + 3], [262, yB - 3], 1, 9);
  b.label('lab-A', [xA + 4, yA - 14], String.raw`E_\mathrm{initial}`, 'fg', 1, 'l', { small: true });
  b.label('lab-B', [xB - 6, yB + 16], String.raw`E_\mathrm{final}`, 'fg', 1, 'r', { small: true });
  b.label('lab-dE', [254, (yA + yB) / 2], String.raw`\Delta E`, 'fg', 1, 'r');
  b.label('lab-1', [118, 134], de ? String.raw`\text{Methode 1}` : String.raw`\text{method 1}`, 'fg', 1, 'l', { small: true });
  b.label('lab-2', [92, 80], de ? String.raw`\text{Methode 2}` : String.raw`\text{method 2}`, 'e', 1, 'l', { small: true });
  b.label('lab-hill', [138, 272], de ? String.raw`\text{der Weg ist egal – die Höhe nicht}` : String.raw`\text{the path does not matter, the height does}`, 'muted', 1, 'c', { small: true });
  // ---- ledgers
  const q1 = dE, w1 = 0, q2 = dE - w2;
  const bar = (key: string, i: number, grp: number, Ea: number, Eb: number, cls: string) => {
    const x = x0 + grp * (3 * col + gap) + i * col;
    b.rect(key, cls, x, Math.min(y(Ea), y(Eb)), col * 0.64, Math.max(1.5, Math.abs(y(Ea) - y(Eb))));
    return x + col * 0.32;
  };
  b.line('zero', 'th-axis', [x0 - 10, SF.zero], [W - 8, SF.zero]);
  const grp = (g: number, q: number, w: number, name: string, ink: string) => {
    const a = bar(`q${g}`, 0, g, 0, q, 'th-f-t'), c = bar(`w${g}`, 1, g, q, q + w, 'th-f-e'), d = bar(`d${g}`, 2, g, 0, q + w, 'th-f');
    b.label(`h-q${g}`, [a, 38], 'q', 't', 1, 'c'); b.label(`h-w${g}`, [c, 38], 'w', 'e', 1, 'c'); b.label(`h-d${g}`, [d, 38], String.raw`\Delta E`, 'fg', 1, 'c');
    b.label(`n${g}`, [(a + d) / 2 + 2, 14], name, ink, 1, 'c', { small: true });
    b.label(`v-q${g}`, [a, y(q) + 12], r0(q), 't', 1, 'c', { small: true });
    if (Math.abs(w) >= 1) b.label(`v-w${g}`, [c, Math.min(y(q), y(q + w)) - 11], r0(w), 'e', 1, 'c', { small: true });
    b.label(`v-d${g}`, [d, y(q + w) + 12], r0(q + w), 'fg', 1, 'c', { small: true });
  };
  grp(0, q1, w1, de ? String.raw`\text{Methode 1: Brenner}` : String.raw`\text{method 1: burner}`, 'fg');
  grp(1, q2, w2, de ? String.raw`\text{Methode 2: Kolben}` : String.raw`\text{method 2: piston}`, 'e');
  b.label('unit', [W - 8, 288], String.raw`\text{kJ}`, 'muted', 1, 'br', { small: true });
  return b.finish({ dE, q1, q2, w2, sum1: q1 + w1, sum2: q2 + w2 });
}
