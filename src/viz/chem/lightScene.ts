/**
 * Pure scene of the lecture's example on slide 11: the electron of a hydrogen atom falls from n = 3 to n = 1.
 * Left the Bohr picture (orbits, electron), right the energy levels; below the bookkeeping.
 *  step 0  the electron sits on orbit 3 (level E₃)
 *  step 1  it falls to orbit 1 and a photon leaves (energy goes out of the atom)
 *  step 2  ΔE = E₁ − E₃ = −2.18·10⁻¹⁸ J (1 − 1/9) = −1.94·10⁻¹⁸ J; the photon carries E_ph = +1.94·10⁻¹⁸ J
 *  step 3  λ = hc/E_ph = 103 nm: deep ultraviolet
 */
import { fmtNum, type Lang } from '../../i18n';
import { levelEnergy, nm, transition } from '../../chem/light';
import { builder, ease, lerp, seg, type CScene, type P2 } from './scene';

export const ATOM = { cx: 98, cy: 108, r: (n: number) => 14 + 31 * (n - 1) };
export const LEVELS = { x0: 232, x1: 322, top: 30, bottom: 192 };
/** y of the energy level n (n = ∞ at the top, E₁ at the bottom): E in units of |E₁| */
export const levelY = (n: number) => LEVELS.top + (-levelEnergy(n) / -levelEnergy(1)) * (LEVELS.bottom - LEVELS.top);
const tx = (lang: Lang, de: string, en: string) => String.raw`\text{${lang === 'de' ? de : en}}`;

const wiggle = (a: P2, b: P2, amp: number, waves: number, n = 40, o = 0): P2[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = i / n, w = Math.sin(2 * Math.PI * waves * s + o) * amp * Math.min(1, s * 6, (1 - s) * 6 + 0.2);
    return [a[0] + dx * s - uy * w, a[1] + dy * s + ux * w] as P2;
  });
};

export function lightScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const f = (x: number, d: number) => fmtNum(x, d, lang, true);
  const { cx, cy, r } = ATOM;
  const circle = (R: number): P2[] => Array.from({ length: 49 }, (_, i) => [cx + R * Math.cos((2 * Math.PI * i) / 48), cy + R * Math.sin((2 * Math.PI * i) / 48)] as P2);
  for (const n of [1, 2, 3]) sb.poly(`orbit${n}`, 'i-p dash w1', circle(r(n)), 1, true);
  sb.dot('nucleus', 'i-t f nostroke', [cx, cy], 5);
  const ang = -0.9; // where the electron sits on its orbit
  const onOrbit = (R: number): P2 => [cx + R * Math.cos(ang), cy + R * Math.sin(ang)];
  // the fall happens in step 1
  const k = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.1, 0.8)) : 1;
  const R = lerp(r(3), r(1), k);
  const e: P2 = onOrbit(R);
  sb.dot('electron', 'i-n f', e, 6);
  sb.label('lab-e', [e[0] + 12, e[1] - 10], String.raw`e^-`, 'cn', 1, 'l');
  for (const n of [1, 2, 3]) sb.label(`on${n}`, [cx - r(n) * 0.72, cy + r(n) * 0.72 + 0], String.raw`n=${n}`, 'muted', 1, 'c');
  // the levels
  sb.line('axis', 'i-muted w1', [LEVELS.x0 - 16, LEVELS.top - 6], [LEVELS.x0 - 16, LEVELS.bottom + 6]);
  sb.line('lv-inf', 'i-muted dash w1', [LEVELS.x0, levelY(Infinity)], [LEVELS.x1, levelY(Infinity)]);
  for (const n of [1, 2, 3, 4, 5]) sb.line(`lv${n}`, 'i-fg w3', [LEVELS.x0, levelY(n)], [LEVELS.x1, levelY(n)]);
  sb.label('E', [LEVELS.x0 - 22, LEVELS.top - 12], 'E', 'fg', 1, 'c');
  sb.label('l-inf', [LEVELS.x1 + 8, levelY(Infinity) - 9], String.raw`n=\infty`, 'muted', 1, 'l');
  sb.label('l1', [LEVELS.x1 + 8, levelY(1)], String.raw`n=1`, 'fg', 1, 'l');
  sb.label('l2', [LEVELS.x1 + 8, levelY(2)], String.raw`n=2`, 'fg', 1, 'l');
  sb.label('l3', [LEVELS.x1 + 8, levelY(3) + 4], String.raw`n=3`, 'fg', 1, 'l');
  sb.label('l0', [LEVELS.x0 - 26, levelY(Infinity) + 8], '0', 'muted', 1, 'r');
  const yE = lerp(levelY(3), levelY(1), k);
  sb.dot('e-level', 'i-n f', [LEVELS.x0 + 14, yE], 5.5);
  // arrow in the level diagram and the photon
  const ax = (LEVELS.x0 + LEVELS.x1) / 2 + 8;
  const arrowEnd: P2 = [ax, lerp(levelY(3), levelY(1), k)];
  if (k > 0.02) sb.arrow('fall', 'i-t w3', [ax, levelY(3)], arrowEnd, 1, 9);
  const ph = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.35, 1)) : 1;
  if (ph > 0.02) {
    sb.poly('photon-l', 'i-el w3', wiggle([ax + 6, levelY(2) - 18], [ax + 6 + 44 * ph, levelY(2) - 18], 5, 2.4 * ph + 0.01, 30), ph);
    sb.poly('photon-a', 'i-el w3', wiggle(onOrbit(r(1) + 8), [onOrbit(r(1) + 8)[0] + 56 * ph, onOrbit(r(1) + 8)[1] - 34 * ph], 4, 3 * ph + 0.01, 30), ph);
  }
  sb.label('lab-ph', [ax + 6 + 22, levelY(2) - 34], String.raw`E_{\mathrm{ph}}`, 'cel', ph, 'c');
  // bookkeeping
  const tr = transition(3, 1);
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0, 0.7)) : 1;
  sb.label('dE', [16, 240], '', 'fg', step === 2 ? o2 : 0, 'l', { box: true, rows: [
    { tex: String.raw`\Delta E=E_1-E_3=-2{,}18\cdot10^{-18}\,\mathrm J\,\Bigl(1-\dfrac19\Bigr)`.replace(/\{,\}/g, lang === 'de' ? '{,}' : '.'), ink: 'fg' },
    { tex: String.raw`\Delta E=${f(tr.dE / 1e-18, 2)}\cdot10^{-18}\,\mathrm J`, ink: 'ct' },
  ] });
  sb.label('Eph', [16, 289], String.raw`E_{\mathrm{ph}}=-\Delta E=+${f(tr.photonE / 1e-18, 2)}\cdot10^{-18}\,\mathrm J`, 'cel', o2, 'l');
  const o3 = step < 3 ? 0 : ease(seg(t, 0, 0.7));
  sb.label('lam', [16, 240], String.raw`\lambda=\dfrac{hc}{E_{\mathrm{ph}}}=${f(Math.round(nm(tr.lambda)), 0)}\,\mathrm{nm}`, 'fg', o3, 'l', { box: true });
  sb.label('uv', [200, 240], tx(lang, 'tiefes Ultraviolett', 'deep ultraviolet'), 'cs', o3, 'l');
  return sb.finish({ step, k, ph, o2, o3, R, lambdaNm: nm(tr.lambda) });
}
