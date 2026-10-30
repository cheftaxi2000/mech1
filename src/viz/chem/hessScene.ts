/**
 * Pure scene of an enthalpy diagram (slides 25 and 28): the levels of a Hess route, one step per arrow, then the direct arrow ΔH_rxn.
 * 560 × 300. Level labels stand in a column on the left (with the arrow value underneath); the levels themselves form a
 * staircase to the right, so that no arrow crosses another level's line. Arrow lengths are only roughly proportional to |ΔH|
 * (every step gets at least 36 units, so that the labels stay readable), the numbers are exact.
 * Steps: 0 = start level, 1 … n−1 = one arrow each, n = the direct arrow (n = number of arrows of the route).
 */
import type { Lang } from '../../i18n';
import type { HessRoute } from '../../chem/hess';
import { ease, seg } from '../anim/geometry';
import { cbuilder, lerp, type CScene } from './cscene';

export const HS = { W: 520, H: 290, labelX: 262, xa0: 292, dx: 24, top: 28, bottom: 262, minGap: 36, maxGap: 66 } as const;

/** KJ with up to two decimals, TeX decimal comma in German, explicit sign. */
export function kj(x: number, lang: Lang): string {
  const s = String(Number(Math.abs(x).toFixed(2)));
  return (x > 0.004 ? '+' : x < -0.004 ? '-' : '') + (lang === 'de' ? s.replace('.', '{,}') : s);
}

export function hessLayout(route: HessRoute) {
  const n = route.steps.length;
  const maxAbs = Math.max(...route.steps.map((s) => Math.abs(s.dH)), 1e-9);
  const gap = (dH: number) => HS.minGap + (HS.maxGap - HS.minGap) * (Math.abs(dH) / maxAbs);
  let ys = [0];
  route.steps.forEach((s) => ys.push(ys[ys.length - 1] - Math.sign(s.dH || 1) * gap(s.dH)));
  const lo = Math.min(...ys), hi = Math.max(...ys), span = hi - lo;
  const avail = HS.bottom - HS.top, f = Math.min(1, avail / Math.max(span, 1));
  ys = ys.map((y) => HS.top + (y - lo) * f + (avail - span * f) / 2);
  // levels that are close in H must still be far enough apart for their labels: spread them (the order stays)
  const order = ys.map((_, i) => i).sort((a, b) => ys[a] - ys[b] || a - b);
  const MIN = 36;
  for (let k = 1; k < order.length; k++) ys[order[k]] = Math.max(ys[order[k]], ys[order[k - 1]] + MIN);
  const over = Math.max(...ys) - HS.bottom;
  if (over > 0) { const top = Math.min(...ys), sc = (HS.bottom - top) / (Math.max(...ys) - top); ys = ys.map((y) => top + (y - top) * sc); }
  const xa = Array.from({ length: n + 1 }, (_, i) => HS.xa0 + HS.dx * (i - 1)); // xa[i] = x of arrow i (1-based)
  const xNet = xa[n] + 44;
  return { n, ys, xa, xNet };
}

export function hessScene(route: HessRoute, step: number, t: number, lang: Lang): CScene {
  const b = cbuilder(HS.W, HS.H);
  const { n, ys, xa, xNet } = hessLayout(route);
  const std = route.steps[0].kind !== 'step';
  const lvlO = (i: number) => (step > i ? 1 : step === i ? ease(seg(t, i === 0 ? 0 : 0.6, i === 0 ? 0.7 : 1)) : 0);
  for (let i = 0; i <= n; i++) {
    if (i === n) break;
    const o = lvlO(i);
    const x0 = i === 0 ? xa[1] - 12 : xa[i] - 18, x1 = i === n - 1 ? xa[n] + 30 : xa[i + 1] + 18;
    const x0f = i === 0 ? xa[1] - 12 : x0, x1f = i === 0 ? xa[1] + 18 : x1;
    b.line(`lv${i}`, i === 0 || i === n ? 'th-level' : 'th-level', [x0f, ys[i]], [x1f, ys[i]], o);
    b.line(`ld${i}`, 'th-l-dash', [HS.labelX + 6, ys[i]], [x0f - 2, ys[i]], o * 0.7);
    b.label(`name${i}`, [HS.labelX, ys[i] - (i === 0 ? 0 : 9)], route.levels[i].tex, 'fg', o, 'r', { small: true });
    if (i >= 1) b.label(`val${i}`, [HS.labelX, ys[i] + 9], String.raw`${route.steps[i - 1].tex ?? String.raw`\Delta H_{${i}}`} = ${kj(route.steps[i - 1].dH, lang)}\,\text{kJ}`, 'e', o, 'r', { small: true });
  }
  // the last level is stored under index n−1+1 = n in `levels`: draw it (levels has n+1 entries)
  {
    const i = n, o = lvlO(i);
    const x0 = xa[n] - 18, x1 = xa[n] + 30;
    b.line(`lv${i}`, 'th-level', [x0, ys[i]], [x1, ys[i]], o);
    b.line(`ld${i}`, 'th-l-dash', [HS.labelX + 6, ys[i]], [x0 - 2, ys[i]], o * 0.7);
    b.label(`name${i}`, [HS.labelX, ys[i] - 9], route.levels[i].tex, 'fg', o, 'r', { small: true });
    b.label(`val${i}`, [HS.labelX, ys[i] + 9], String.raw`${route.steps[i - 1].tex ?? String.raw`\Delta H_{${i}}`} = ${kj(route.steps[i - 1].dH, lang)}\,\text{kJ}`, 'e', o, 'r', { small: true });
  }
  // step arrows 1..n, arrow i belongs to animation step i
  for (let i = 1; i <= n; i++) {
    const p = step > i ? 1 : step === i ? ease(seg(t, 0, 0.62)) : 0;
    if (p <= 0) continue;
    const yTip = lerp(ys[i - 1], ys[i], p);
    b.arrow(`ar${i}`, 'th-a-e', [xa[i], ys[i - 1]], [xa[i], yTip], 1, 9);
    if (p > 0.95) b.label(`tag${i}`, [xa[i] + 11, (ys[i - 1] + ys[i]) / 2], String(i), 'e', 1, 'l', { small: true });
  }
  // the direct arrow (last step n+1)
  const pn = step > n ? 1 : step === n + 1 ? ease(seg(t, 0, 0.7)) : 0;
  if (pn > 0) {
    const yTip = lerp(ys[0], ys[n], pn);
    b.line('g0', 'th-l-dash', [xa[1] + 20, ys[0]], [xNet, ys[0]], Math.min(1, pn * 3));
    b.line('gN', 'th-l-dash', [xa[n] + 32, ys[n]], [xNet, ys[n]], Math.min(1, pn * 3));
    b.arrow('net', 'th-a-fg', [xNet, ys[0]], [xNet, yTip], 1, 10);
    const o = ease(seg(step === n + 1 ? t : 1, 0.6, 1));
    const mid = (ys[0] + ys[n]) / 2;
    b.label('net-name', [xNet + 9, mid - 10], route.netTex ?? (std ? String.raw`\Delta H^\circ_\mathrm{rxn}` : String.raw`\Delta H_\mathrm{rxn}`), 'fg', o, 'l');
    b.label('net-val', [xNet + 9, mid + 10], String.raw`${kj(route.total, lang)}\,\text{kJ}`, 'fg', o, 'l', { small: true });
  }
  b.label('axis', [12, 12], 'H', 'muted', 1, 'tl');
  b.arrow('axis-a', 'th-a-muted', [18, 50], [18, 24], 1, 7);
  return b.finish({ step, n, total: route.total, yTop: Math.min(...ys), yBottom: Math.max(...ys) });
}
export const hessSteps = (route: HessRoute) => route.steps.length + 2;
