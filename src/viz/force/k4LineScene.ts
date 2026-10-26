/**
 * Pure scene «von der Summe zum Integral» (Skript p. 32, Linienkraftdichte): a beam of length L = 4 m with the load
 * q(x) = 20 + 60 (x/L)² N/m, R = ∫₀ᴸ q dx = 160 N. One step per sentence:
 *  step 0  the load as a row of arrows – their length is the picture of q(x)
 *  step 1  2 pieces: every piece carries about q(x_i)·Δx; the sum is 155 N
 *  step 2  4 pieces: 158.75 N
 *  step 3  8 pieces: 159.6875 N
 *  step 4  16 pieces: 159.921875 N
 *  step 5  infinitely many: the sum becomes the integral, the area under q(x): R = 160 N (an element dx with dF = q dx is marked)
 */
import type { Lang } from '../../i18n';
import { ANIM_R, LINE_L, animQ, sliceSum } from '../../physics/distributed';
import { fmtSig } from './k34Common';
import { ease, type P2 } from '../anim/geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from '../anim/scene';

export const LS = { X0: 40, KX: 76, BASE: 214, KY: 1.5, NS: [2, 4, 8, 16] as const };
const OUT = 'out' as Ink;
export const PIECES = [0, 2, 4, 8, 16, 0];

export function lineScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const e = ease(t);
  const { X0, KX, BASE, KY } = LS;
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1) => { if (o > 0.01) sb.shape({ key, kind, cls, pts, o }); };
  const arrow = (key: string, a: P2, b: P2, o = 1, head = 7) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 3) return;
    S(key, 'line', 'ks-out', [a, b], o); S(`${key}-h`, 'polygon', 'ks-out-h', arrowHead(a, b, head), o);
  };
  const xp = (x: number) => X0 + KX * x;
  const yq = (x: number) => BASE - KY * animQ(x);

  // beam on two supports, x axis
  S('beam', 'polygon', 'ks-body', [[X0 - 22, BASE + 2], [X0 + KX * LINE_L + 22, BASE + 2], [X0 + KX * LINE_L + 22, BASE + 14], [X0 - 22, BASE + 14]]);
  for (const x of [X0 + 6, X0 + KX * LINE_L - 6]) S(`sup${x}`, 'polygon', 'ks-body', [[x, BASE + 14], [x - 16, BASE + 46], [x + 16, BASE + 46]]);
  S('ground', 'line', 'ks-ground', [[X0 - 22, BASE + 46], [X0 + KX * LINE_L + 22, BASE + 46]]);
  for (const x of [xp(0), xp(LINE_L)]) S(`tick${x}`, 'line', 'ks-axis', [[x, BASE + 18], [x, BASE + 26]]);
  sb.label('x0', [xp(0), BASE + 36], '0', 'muted', 1, 'c');
  sb.label('xL', [xp(LINE_L), BASE + 36], 'L', 'muted', 1, 'c');
  S('xarrow', 'line', 'ks-axis', [[xp(LINE_L) + 24, BASE + 26], [xp(LINE_L) + 44, BASE + 26]]);
  S('xarrow-h', 'polygon', 'ks-ld-h', arrowHead([xp(LINE_L) + 24, BASE + 26], [xp(LINE_L) + 44, BASE + 26], 7));
  sb.label('x', [xp(LINE_L) + 40, BASE + 38], 'x', 'muted', 1, 'c');

  // the load curve (always there; draws itself in step 0)
  const m = 60, upto = step === 0 ? e : 1;
  const curve: P2[] = Array.from({ length: Math.floor(m * upto) + 1 }, (_, i) => { const x = (LINE_L * i) / m; return [xp(x), yq(x)] as P2; });
  S('curve', 'polyline', 'ks-curve', curve, 1);
  sb.label('q', [xp(LINE_L) + 6, yq(LINE_L) - 4], '\\v q(x)', OUT, 1, 'l');

  // step 0: arrows
  const a0 = step === 0 ? e : step === 1 ? 1 - e : 0;
  for (let i = 0; i < 8; i++) {
    const x = (i + 0.5) * (LINE_L / 8);
    arrow(`arr0-${i}`, [xp(x), yq(x)], [xp(x), BASE - 1], a0);
  }

  // steps 1–4: n pieces. The current n grows from the curve, the previous one fades.
  const nowN = PIECES[step], prevN = step >= 2 && step <= 4 ? PIECES[step - 1] : step === 5 ? 16 : 0;
  const bars = (n: number, grow: number, o: number, withArrows: boolean) => {
    const dx = LINE_L / n;
    for (let i = 0; i < n; i++) {
      const xm = (i + 0.5) * dx, h = KY * animQ(xm) * grow;
      const x0 = xp(i * dx), x1 = xp((i + 1) * dx);
      S(`bar-${n}-${i}`, 'polygon', 'ks-bar', [[x0, BASE], [x1, BASE], [x1, BASE - h], [x0, BASE - h]], o);
      if (withArrows) arrow(`arr-${n}-${i}`, [(x0 + x1) / 2, BASE - h], [(x0 + x1) / 2, BASE - 1], o, 6);
    }
  };
  if (step >= 1 && step <= 4) {
    bars(nowN, step === 1 ? e : 1, 1, nowN <= 8);
    if (prevN) bars(prevN, 1, 1 - e, prevN <= 8);
  }
  // step 5: the area under the curve
  if (step === 5) {
    bars(16, 1, 1 - e, false);
    const area: P2[] = [[xp(0), BASE], ...Array.from({ length: m + 1 }, (_, i) => { const x = (LINE_L * i) / m; return [xp(x), yq(x)] as P2; }), [xp(LINE_L), BASE]];
    S('area', 'polygon', 'ks-area', area, e);
    // an element dx at x = 2.6 with its force dF = q dx
    const xe = 2.6, w = 6, he = KY * animQ(xe);
    S('elem', 'polygon', 'ks-bar', [[xp(xe) - w / 2, BASE], [xp(xe) + w / 2, BASE], [xp(xe) + w / 2, BASE - he], [xp(xe) - w / 2, BASE - he]], e);
    arrow('dF', [xp(xe), BASE - he - 26 * e], [xp(xe), BASE - he], e, 7);
    sb.label('dF', [xp(xe) - 8, BASE - he - 28], '\\mathrm d\\v F = \\v q\\,\\mathrm dx', OUT, e, 'r');
  }

  // Δx marker and piece labels
  if (step >= 1 && step <= 4) {
    const dx = LINE_L / nowN, h0 = KY * animQ(dx / 2), y = BASE - h0 - 14;
    S('dx', 'line', 'ks-guide', [[xp(0), y], [xp(dx), y]], e);
    S('dx-l', 'line', 'ks-guide', [[xp(0), y - 4], [xp(0), y + 4]], e); S('dx-r', 'line', 'ks-guide', [[xp(dx), y - 4], [xp(dx), y + 4]], e);
    sb.label('dxl', [xp(dx / 2), y - 11], '\\Delta x', 'muted', e, 'c');
  }
  if (step === 1) {
    for (let i = 0; i < 2; i++) {
      const xm = (i + 0.5) * (LINE_L / 2);
      sb.label(`dF${i + 1}`, [xp(xm), BASE - (KY * animQ(xm)) / 2], `\\Delta F_${i + 1}`, OUT, e, 'c');
    }
  }

  // read-out box
  const f = (v: number) => fmtSig(v, 7, lang);
  if (step >= 1 && step <= 4) {
    const s = sliceSum(animQ, nowN);
    sb.label('sum', [14, 12], `\\Delta F_i \\approx q(x_i)\\,\\Delta x`, 'fg', 1, 'tl', { box: true, rows: [{ tex: `n = ${nowN}`, ink: 'muted' }, { tex: `\\sum \\Delta F_i = ${f(s)}\\,\\mathrm N`, ink: OUT }] });
  }
  if (step === 5) {
    sb.label('sum', [14, 12], '', 'fg', e, 'tl', { box: true, rows: [{ tex: `R = \\displaystyle\\int_0^L q\\,\\mathrm dx`, ink: 'fg' }, { tex: `= ${f(ANIM_R)}\\,\\mathrm N`, ink: OUT }] });
  }
  return sb.finish({ step, n: nowN, sum: nowN ? sliceSum(animQ, nowN) : step === 5 ? ANIM_R : 0 });
}
