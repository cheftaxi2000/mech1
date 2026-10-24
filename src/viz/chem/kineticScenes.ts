/**
 * Pure scenes of the kinetic-theory lesson.
 *  kmtScene   slide 25      why P ∝ T:  hotter → faster → harder AND more often → pressure ∝ E_k ∝ T   (3 steps)
 *  vdwScene   slide 30      what a and b mean: attraction lowers the push on the wall, own volume shrinks the room   (3 steps)
 * Every step's final frame (t = 1) shows what its caption says.
 */
import type { Lang } from '../../i18n';
import { builder, ease, lerp, seg, type CScene, type P2 } from './scene';

const tx = (lang: Lang, de: string, en: string) => String.raw`\text{${lang === 'de' ? de : en}}`;
const spots = (n: number, a = 37, b = 91): P2[] => Array.from({ length: n }, (_, k) => [((k * a + 13) % 101) / 101, ((k * b + 29) % 103) / 103] as P2);

// ------------------------------------------------------------------------------------------------ kinetic theory: P ∝ T
export const KMT = { cold: 30, hot: 230, boxW: 140, top: 36, boxH: 100, base: 272, unit: 46, n: 7 };
/** speed arrow length in px: v ∝ √T, so the hot gas (2T) is √2 times faster */
export const KMT_V = { cold: 15, hot: 15 * Math.SQRT2 };

export function kmtScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const { cold, hot, boxW, top, boxH, base, unit, n } = KMT;
  const D = spots(n, 29, 53);
  const dirs = D.map((_, i) => 0.7 + i * 0.9);
  const at = (x0: number, d: P2): P2 => [x0 + 14 + d[0] * (boxW - 28), top + 14 + d[1] * (boxH - 28)];
  const boxes: [string, number, number, 'ct'][] = [['c', cold, KMT_V.cold, 'ct'], ['h', hot, KMT_V.hot, 'ct']];
  for (const [id, x0, vlen] of boxes) {
    sb.rect(`box-${id}`, 'glass', x0, top, boxW, boxH);
    D.forEach((d, i) => {
      const p = at(x0, d);
      const grow = step === 0 && id === 'h' ? ease(seg(t, 0.15, 0.85)) : 1;
      const len = id === 'h' ? lerp(KMT_V.cold, vlen, grow) : vlen;
      sb.arrow(`v-${id}${i}`, 'i-t w3', p, [p[0] + Math.cos(dirs[i]) * len, p[1] + Math.sin(dirs[i]) * len], 1, 5);
      sb.dot(`d-${id}${i}`, 'atom', p, 3.4);
    });
  }
  sb.label('T1', [cold + boxW / 2, top - 20], String.raw`T`, 'ct');
  sb.label('T2', [hot + boxW / 2, top - 20], String.raw`2T`, 'ct');
  sb.label('vlab', [hot + boxW / 2, top + boxH + 16], String.raw`v\cdot\sqrt{2}`, 'ct', step >= 0 ? (step === 0 ? ease(seg(t, 0.6, 1)) : 1) : 0);
  sb.label('vlab1', [cold + boxW / 2, top + boxH + 16], String.raw`v`, 'ct');
  // bars at the outer sides: push per hit and hits per second (step 1), pressure (step 2); heights ∝ speed, product ∝ speed²
  const hb = (id: string, x: number, h: number, cls: string, o: number) => sb.rect(id, `${cls} f nostroke`, x, base - h, 26, h, o);
  const s1 = step < 1 ? 0 : step === 1 ? ease(seg(t, 0, 0.7)) : 1;
  const v = (id: 'c' | 'h') => (id === 'c' ? 1 : Math.SQRT2);
  const xs = { c: { imp: 22, rate: 70, P: 46 }, h: { imp: 300, rate: 348, P: 324 } };
  const o1 = step === 1 ? s1 : step >= 2 ? 1 - ease(seg(step === 2 ? t : 1, 0, 0.5)) : 0;
  const s2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.35, 1)) : 1;
  for (const id of ['c', 'h'] as const) {
    hb(`imp-${id}`, xs[id].imp, unit * v(id) * s1, 'i-e', o1);
    hb(`rate-${id}`, xs[id].rate, unit * v(id) * s1, 'i-s', o1);
    hb(`P-${id}`, xs[id].P, unit * v(id) * v(id) * s2, 'i-p', s2 > 0 ? 1 : 0);
    sb.label(`imp-l-${id}`, [xs[id].imp + 13, base + 13], tx(lang, 'Stoss', 'push'), 'ce', o1, 'c');
    sb.label(`rate-l-${id}`, [xs[id].rate + 13, base + 13], tx(lang, 'pro s', 'per s'), 'cs', o1, 'c');
  }
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.5, 1)) : 1;
  sb.label('P1', [xs.c.P + 13, base + 13], 'P', 'cp', o2, 'c');
  sb.label('P2', [xs.h.P + 13, base + 13], String.raw`2P`, 'cp', o2, 'c');
  sb.label('law', [200, 235], String.raw`P\propto v^2\propto E_k\propto T`, 'fg', o2, 'c', { box: true });
  return sb.finish({ step, vc: KMT_V.cold, vh: KMT_V.hot, hCold: unit, hHot: unit * 2, o2 });
}

// ------------------------------------------------------------------------------------------------ van der Waals
export const VDW = { x0: 30, y0: 40, w: 200, h: 200, n: 9, r0: 3.4, r1: 10 };
export const WALL_L = { ideal: 46, real: 32 };

export function vdwScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const { x0, y0, w, h, n, r0, r1 } = VDW;
  const D = spots(n, 31, 57);
  const P = (d: P2): P2 => [x0 + 22 + d[0] * (w - 44), y0 + 22 + d[1] * (h - 44)];
  sb.rect('box', 'glass', x0, y0, w, h);
  const big = step < 2 ? 0 : step === 2 ? ease(seg(t, 0, 0.6)) : 1;
  const r = lerp(r0, r1, big);
  // step 2: excluded space around the molecules
  D.forEach((d, i) => {
    const c = P(d);
    if (big > 0.01) sb.dot(`ex${i}`, 'i-v soft nostroke', c, r + 5 * big, big * 0.9);
  });
  // step 1: attraction between near neighbours
  const att = step < 1 ? 0 : step === 1 ? ease(seg(t, 0, 0.5)) : 1;
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.hypot(P(D[i])[0] - P(D[j])[0], P(D[i])[1] - P(D[j])[1]) < 70) pairs.push([i, j]);
  pairs.forEach(([i, j], k) => sb.line(`att${k}`, 'i-n dash w1', P(D[i]), P(D[j]), att));
  D.forEach((d, i) => sb.dot(`d${i}`, 'atom', P(d), r));
  // wall pushes: lengths shorten in step 1
  const L = step === 0 ? WALL_L.ideal : step === 1 ? lerp(WALL_L.ideal, WALL_L.real, ease(seg(t, 0.4, 1))) : WALL_L.real;
  const wallx = x0 + w;
  for (const [i, y] of [y0 + 40, y0 + 100, y0 + 160].entries()) sb.arrow(`push${i}`, 'i-p w3', [wallx - 4 - L, y], [wallx - 4, y], 1, 9);
  // the missing part of the push (what the attraction takes away)
  const miss = step === 1 ? ease(seg(t, 0.55, 1)) : step >= 2 ? 1 : 0;
  for (const [i, y] of [y0 + 40, y0 + 100, y0 + 160].entries()) sb.line(`miss${i}`, 'i-n dash w3', [wallx - 4 - WALL_L.ideal, y], [wallx - 4 - L - 2, y], miss);
  const R = wallx + 26;
  sb.label('lab-id', [R, y0 + 30], String.raw`P_{\mathrm{ideal}}=\dfrac{nRT}{V}`, 'fg', step === 0 ? ease(seg(t, 0.4, 1)) : 1, 'l');
  const o1 = step < 1 ? 0 : step === 1 ? ease(seg(t, 0.6, 1)) : 1;
  sb.label('lab-real', [R, y0 + 100], '', 'fg', o1, 'l', { rows: [{ tex: String.raw`P+\dfrac{n^2a}{V^2}=P_{\mathrm{ideal}}`, ink: 'fg' }, { tex: tx(lang, 'Anziehung: Wandstoss schwächer', 'attraction: weaker wall push'), ink: 'cn' }] });
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.5, 1)) : 1;
  sb.label('lab-V', [R, y0 + 168], '', 'fg', o2, 'l', { rows: [{ tex: String.raw`V_{\mathrm{free}}=V-nb`, ink: 'cv' }, { tex: tx(lang, 'Eigenvolumen der Teilchen', 'own volume of the particles'), ink: 'cv' }] });
  const o3 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.7, 1)) : 1;
  sb.label('law', [x0 + w / 2, y0 + h + 28], String.raw`\Bigl(P+\dfrac{n^2a}{V^2}\Bigr)(V-nb)=nRT`, 'fg', o3, 'c', { box: true });
  return sb.finish({ step, r, att, L, miss, o3 });
}
