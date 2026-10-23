import { ease } from '../anim/geometry';

/**
 * Übung 2, slide 25 («Notations»): the same twelve numbers in four layouts, and the tokens glide from one to the next.
 *   layout 0  standard form      3x₁ + 2x₂ − x₃ = 2 …
 *   layout 1  matrix form        A · x = b           (three brackets)
 *   layout 2  augmented matrix   with the headers x₁ x₂ x₃ | 1
 *   layout 3  the headers dropped («can be simplified»)
 * Positions are percentages of a stage 100 wide and 100·STAGE_ASPECT tall; (x, y) is the CENTRE of a token.
 */
export const STAGE_ASPECT = 0.46;
export const SYSTEM = [[3, 2, -1, 2], [1, -2, -2, 0], [-2, 1, 1, 3]] as const;
export const ROW_Y = [36, 58, 80] as const;
const HEAD_Y = 14;
const BR_Y = 58, BR_H = 66;

export type TokKind = 'tok' | 'brL' | 'brR' | 'bar';
interface St { x: number; y: number; h?: number }
interface Def { id: string; tex: string; kind: TokKind; at: [St | null, St | null, St | null, St | null]; role?: 'var' | 'num' | 'op' }
export interface Tok { id: string; tex: string; kind: TokKind; x: number; y: number; o: number; h: number; role: 'var' | 'num' | 'op' }

const P = (x: number, y: number, h?: number): St => ({ x, y, h });
// column positions per layout
const L0 = { c: [25, 39, 53], v: [28.8, 42.8, 56.8], op: [34, 48], eq: 65, rhs: 72 }; // standard form, centred
const L1 = { a: [14, 25, 36], x: 55, eq: 67, b: 79, brA: [7, 42], brX: [48.5, 61.5], brB: [73, 85.5] };
const L2 = { a: [30, 42, 54], bar: 62, b: 71, br: [22, 79] };

function defs(): Def[] {
  const out: Def[] = [];
  const sys = SYSTEM;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const v = sys[r][c], y = ROW_Y[r];
      const m1 = P(L1.a[c], y), m2 = P(L2.a[c], y);
      if ((c === 0 || v > 0) && Math.abs(v) > 1) out.push({ id: `a${r}${c}`, tex: String(v), kind: 'tok', role: 'num', at: [P(L0.c[c] - (v < 0 ? 1.2 : 0), y), m1, m2, m2] });
      else {
        // 1 and negative numbers behind a sign: layout 0 shows the magnitude (not for 1) and a separate sign token; the matrices show the signed number
        if (Math.abs(v) > 1) out.push({ id: `a${r}${c}-abs`, tex: String(Math.abs(v)), kind: 'tok', role: 'num', at: [P(L0.c[c], y), m1, null, null] });
        out.push({ id: `a${r}${c}`, tex: String(v), kind: 'tok', role: 'num', at: [null, m1, m2, m2] });
      }
      // the unknown behind the coefficient: row 0 travels on (to the x column, then to the header), the others fade out
      if (r === 0) out.push({ id: `v${c}`, tex: `x_${c + 1}`, kind: 'tok', role: 'var', at: [P(L0.v[c], y), P(L1.x, ROW_Y[c]), P(L2.a[c], HEAD_Y), null] });
      else out.push({ id: `v${r}${c}`, tex: `x_${c + 1}`, kind: 'tok', role: 'var', at: [P(L0.v[c], y), null, null, null] });
      if (c > 0) out.push({ id: `s${r}${c}`, tex: v < 0 ? '-' : '+', kind: 'tok', role: 'op', at: [P(L0.op[c - 1], y), null, null, null] });
    }
    out.push({ id: `eq${r}`, tex: '=', kind: 'tok', role: 'op', at: [P(L0.eq, ROW_Y[r]), P(L1.eq, ROW_Y[r]), null, null] });
    out.push({ id: `b${r}`, tex: String(sys[r][3]), kind: 'tok', role: 'num', at: [P(L0.rhs, ROW_Y[r]), P(L1.b, ROW_Y[r]), P(L2.b, ROW_Y[r]), P(L2.b, ROW_Y[r])] });
  }
  out.push({ id: 'head-b', tex: '1', kind: 'tok', role: 'num', at: [null, null, P(L2.b, HEAD_Y), null] });
  // brackets: A, x, b in layout 1; one big pair around the augmented matrix in layouts 2 and 3
  out.push({ id: 'brA-L', tex: '', kind: 'brL', at: [null, P(L1.brA[0], BR_Y, BR_H), P(L2.br[0], BR_Y, BR_H + 8), P(L2.br[0], BR_Y, BR_H)] });
  out.push({ id: 'brA-R', tex: '', kind: 'brR', at: [null, P(L1.brA[1], BR_Y, BR_H), P(L2.br[1], BR_Y, BR_H + 8), P(L2.br[1], BR_Y, BR_H)] });
  out.push({ id: 'brX-L', tex: '', kind: 'brL', at: [null, P(L1.brX[0], BR_Y, BR_H), null, null] });
  out.push({ id: 'brX-R', tex: '', kind: 'brR', at: [null, P(L1.brX[1], BR_Y, BR_H), null, null] });
  out.push({ id: 'brB-L', tex: '', kind: 'brL', at: [null, P(L1.brB[0], BR_Y, BR_H), null, null] });
  out.push({ id: 'brB-R', tex: '', kind: 'brR', at: [null, P(L1.brB[1], BR_Y, BR_H), null, null] });
  out.push({ id: 'bar', tex: '', kind: 'bar', at: [null, null, P(L2.bar, BR_Y + 4, BR_H + 8), P(L2.bar, BR_Y, BR_H)] });
  return out;
}
const DEFS = defs();
export const TOKEN_IDS = DEFS.map((d) => d.id);

/** Nearest keyframe that has a position (so a token fades in/out in place). */
function anchor(d: Def, k: number): St {
  for (let off = 0; off < 4; off++) for (const j of [k - off, k + off]) if (j >= 0 && j < 4 && d.at[j]) return d.at[j]!;
  return P(50, 50);
}
const stateAt = (d: Def, k: number): { s: St; o: number } => (d.at[k] ? { s: d.at[k]!, o: 1 } : { s: anchor(d, k), o: 0 });

/** All tokens at (step, t): the step glides from layout step−1 to layout `step` (step 0 fades layout 0 in). */
export function notationScene(step: number, t: number): Tok[] {
  const k = ease(t);
  return DEFS.map((d) => {
    const to = stateAt(d, step);
    const from = step === 0 ? { s: to.s, o: 0 } : stateAt(d, step - 1);
    const lerp = (a: number, b: number) => a + (b - a) * k;
    // a token that exists in both layouts moves; one that appears/disappears stays in place of the layout that has it
    const keep = from.o > 0 && to.o > 0;
    const a = keep || from.o > 0 ? from.s : to.s, b = keep || to.o > 0 ? to.s : from.s;
    return {
      id: d.id, tex: d.tex, kind: d.kind, role: d.role ?? 'num',
      x: lerp(a.x, b.x), y: lerp(a.y, b.y), h: lerp(a.h ?? 0, b.h ?? 0),
      o: lerp(from.o, to.o),
    };
  });
}
