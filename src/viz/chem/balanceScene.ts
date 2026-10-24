/**
 * Slides 26–27 (lecture 1): balancing  H₂ + O₂ → H₂O  step by step, with an atom ledger below the molecules.
 *  step 0  the reaction as first written: H balances, O does not (2 O on the left, 1 on the right)
 *  step 1  unknown coefficients a, b, c: the ledger becomes two equations, 2a = 2c and 2b = c
 *  step 2  choose a = 1: then c = 1 and b = ½ (half an O₂ molecule): both rows of the ledger agree
 *  step 3  multiply everything by 2: 2 H₂ + O₂ → 2 H₂O, whole molecules, ledger still balanced
 * SVG coordinates (400 × 300).
 */
import type { Lang } from '../../i18n';
import { sceneBuilder, type Scene, type SceneLabel } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { chemTex } from '../../chem/tex';
import { disc, ease, seg, INK, type SB } from './sceneKit';

export interface BalState {
  /** molecules drawn: H₂, O₂ (0.5 = half a molecule), H₂O */
  n: [number, number, number];
  /** coefficient labels over the three groups (TeX), null = none */
  coef: [string, string, string] | null;
  /** ledger: atoms of H and O on the left and on the right, or null while the equations are shown */
  ledger: { H: [number, number]; O: [number, number] } | null;
}
export const STATES: BalState[] = [
  { n: [1, 1, 1], coef: null, ledger: { H: [2, 2], O: [2, 1] } },
  { n: [1, 1, 1], coef: ['a', 'b', 'c'], ledger: null },
  { n: [1, 0.5, 1], coef: ['1', String.raw`\tfrac{1}{2}`, '1'], ledger: { H: [2, 2], O: [1, 1] } },
  { n: [2, 1, 2], coef: ['2', '1', '2'], ledger: { H: [4, 4], O: [2, 2] } },
];

const Y = 78, GAP = 5;
const W = [34, 44, 46]; // widths of H2, O2, H2O
const FORMULA = ['H2', 'O2', 'H2O'];

function molecule(sb: SB, kind: number, key: string, c: P2, o: number) {
  if (o <= 0.01) return;
  if (kind === 0) { disc(sb, `${key}-a`, 'cs-aH', [c[0] - 7, c[1]], 10, o); disc(sb, `${key}-b`, 'cs-aH', [c[0] + 7, c[1]], 10, o); }
  else if (kind === 1) { disc(sb, `${key}-a`, 'cs-aO', [c[0] - 10, c[1]], 12, o); disc(sb, `${key}-b`, 'cs-aO', [c[0] + 10, c[1]], 12, o); }
  else { disc(sb, `${key}-a`, 'cs-aH', [c[0] - 14, c[1] + 11], 8, o); disc(sb, `${key}-b`, 'cs-aH', [c[0] + 14, c[1] + 11], 8, o); disc(sb, `${key}-o`, 'cs-aO', [c[0], c[1] - 2], 13, o); }
}

/** Number of molecules drawn in a group during the step: those that already existed stay, new ones fade in with u. */
const shown = (prev: number, cur: number, m: number, u: number): number => (m + 1 <= Math.min(prev, cur) ? 1 : m < cur ? u : m < prev ? 1 - u : 0);

export function balanceScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const cur = STATES[step], prev = STATES[Math.max(0, step - 1)];
  const u = step === 0 ? 1 : ease(seg(t, 0.05, 0.7));
  const uLedger = step === 0 ? 1 : ease(seg(t, 0.4, 0.95));
  // layout of the three groups from the *current* counts (half a molecule takes the room of one)
  const cnt = cur.n.map((x) => Math.max(1, Math.ceil(x)));
  const widths = cnt.map((c, g) => c * W[g] + (c - 1) * GAP);
  const OP = 34; // room for «+» and «→»
  const total = widths[0] + widths[1] + widths[2] + 2 * OP;
  let x = 200 - total / 2;
  const centres: number[] = [];
  const starts: number[] = [];
  for (let g = 0; g < 3; g++) { starts.push(x); centres.push(x + widths[g] / 2); x += widths[g] + OP; }
  for (let g = 0; g < 3; g++) {
    for (let m = 0; m < cnt[g]; m++) {
      const c: P2 = [starts[g] + W[g] / 2 + m * (W[g] + GAP), Y];
      const full = shown(Math.ceil(prev.n[g]), Math.ceil(cur.n[g]), m, u);
      if (g === 1 && cur.n[1] === 0.5) { // half an O2: one O atom and a dashed ghost
        disc(sb, `m${g}${m}-a`, 'cs-aO', [c[0] - 10, c[1]], 12, 1);
        sb.shape({ key: `m${g}${m}-ghost`, kind: 'circle', cls: 'cs-dash', pts: [[c[0] + 10, c[1]]], r: 12, o: 1 });
      } else molecule(sb, g, `m${g}${m}`, c, full);
    }
    // species label
    sb.label(`sp${g}`, [centres[g], Y + 40], chemTex(FORMULA[g]), INK.fg, 1);
    if (cur.coef) sb.label(`coef${g}`, [centres[g], Y - 44], cur.coef[g], INK.n, step === 1 || step === 2 || step === 3 ? Math.max(u, prev.coef ? 1 : 0) : 1);
  }
  sb.label('plus', [starts[1] - OP / 2, Y], '+', INK.fg, 1);
  sb.label('arrow', [starts[2] - OP / 2, Y], String.raw`\longrightarrow`, INK.fg, 1);

  // ledger
  const rows: { sym: 'H' | 'O'; y: number; cls: string }[] = [{ sym: 'H', y: 178, cls: 'cs-aH' }, { sym: 'O', y: 228, cls: 'cs-aO' }];
  sb.shape({ key: 'ledger-rule', kind: 'line', cls: 'cs-dash', pts: [[40, 152], [360, 152]] });
  for (const r of rows) {
    disc(sb, `lg-${r.sym}`, r.cls, [52, r.y], 8);
    sb.label(`lg-${r.sym}-l`, [66, r.y], chemTex(r.sym), INK.fg, 1, 'l');
    if (cur.ledger) {
      const [l, rr] = cur.ledger[r.sym];
      const [pl, pr] = prev.ledger ? prev.ledger[r.sym] : [l, rr];
      const draw = (side: 0 | 1, x0: number, n: number, other: number, pn: number) => {
        for (let i = 0; i < Math.max(n, pn); i++) {
          const appearing = i >= pn ? uLedger : i >= n ? 1 - uLedger : 1;
          const cx = x0 + (i % 6) * 14 + 0, cy = r.y + Math.floor(i / 6) * 0 - 0;
          const ok = i < other;
          sb.shape({ key: `sq-${r.sym}${side}${i}`, kind: 'polygon', cls: ok ? 'cs-bar-ok' : 'cs-bar-bad', pts: [[cx - 6, cy - 7], [cx + 6, cy - 7], [cx + 6, cy + 7], [cx - 6, cy + 7]], o: appearing });
        }
      };
      draw(0, 108, l, rr, pl);
      draw(1, 236, rr, l, pr);
      sb.label(`lg-${r.sym}-eq`, [200, r.y], l === rr ? '=' : String.raw`\neq`, l === rr ? INK.v : INK.e, uLedger);
    } else {
      const eq = r.sym === 'H' ? String.raw`2a = 2c` : String.raw`2b = c`;
      sb.label(`lg-${r.sym}-eqn`, [120, r.y], eq, INK.n, uLedger, 'l', { box: true });
    }
  }
  const data: Record<string, number> = { n0: cur.n[0], n1: cur.n[1], n2: cur.n[2] };
  if (cur.ledger) Object.assign(data, { Hl: cur.ledger.H[0], Hr: cur.ledger.H[1], Ol: cur.ledger.O[0], Or: cur.ledger.O[1] });
  return sb.finish(data);
}
export type { SceneLabel };
