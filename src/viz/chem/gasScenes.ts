/**
 * Pure scenes of the gas lesson (lecture 2, slides 10–22). Each scene function maps (step, t, lang) to a CScene;
 * the final frame (t = 1) of every step shows exactly what its caption says (it is the resting frame).
 *
 *  airColumnScene   slide 11   why the atmosphere presses with ≈ 1 bar          (4 steps)
 *  baroScene        slide 12   the barometer: P = ρ g h                         (5 steps)
 *  iglScene         slides 14–18   Boyle + Charles + Avogadro → PV = nRT        (5 steps)
 *  balloonScene     slide 20   type 3 problem: balloon V_f = V_i (P_i/P_f)(T_f/T_i) (4 steps)
 *  daltonScene      slide 22   P_tot = P_1 + P_2                                (4 steps)
 */
import { fmtNum, type Lang } from '../../i18n';
import { H, W, builder, ease, lerp, lerp2, seg, type CScene, type P2 } from './scene';
import { cToK, roundSig } from '../../chem/gas';

const tx = (lang: Lang, de: string, en: string) => String.raw`\text{${lang === 'de' ? de : en}}`;
const dots = (n: number, seedA = 37, seedB = 91): P2[] => Array.from({ length: n }, (_, k) => [((k * seedA + 13) % 101) / 101, ((k * seedB + 29) % 103) / 103] as P2);

// ---------------------------------------------------------------------------------------------------- air column
export const AIR = { x0: 30, x1: 104, ground: 250, top: 34 };

export function airColumnScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const { x0, x1, ground, top } = AIR;
  const rise = step === 0 ? ease(seg(t, 0, 0.7)) : 1;
  const yTop = ground - (ground - top) * rise;
  sb.rect('ground', 'ground', 0, ground, W, H - ground);
  sb.rect('col', 'i-p soft nostroke', x0, yTop, x1 - x0, ground - yTop);
  sb.line('col-l', 'i-muted dash w1', [x0, ground], [x0, yTop]);
  sb.line('col-r', 'i-muted dash w1', [x1, ground], [x1, yTop]);
  // air molecules: dense at the bottom, sparse at the top (the air above weighs on the air below)
  const N = 26;
  dots(N).forEach((d, k) => {
    const u = (k + 0.5) / N, y = ground - 8 - (ground - top - 16) * Math.pow(u, 2.1);
    if (y >= yTop + 4) sb.dot(`m${k}`, 'atom', [x0 + 7 + d[0] * (x1 - x0 - 14), y], 2.6);
  });
  // footprint of 1 m²
  const foot = step === 0 ? ease(seg(t, 0.6, 1)) : 1;
  sb.line('dim', 'i-fg w1', [x0, ground + 14], [x1, ground + 14], foot);
  sb.line('dim-a', 'i-fg w1', [x0, ground + 9], [x0, ground + 19], foot);
  sb.line('dim-b', 'i-fg w1', [x1, ground + 9], [x1, ground + 19], foot);
  sb.label('lab-A', [(x0 + x1) / 2, ground + 32], String.raw`A=1\,\mathrm{m^2}`, 'fg', foot);
  sb.label('lab-air', [x1 + 14, 52], tx(lang, 'Luftsäule bis ins All', 'column of air up to space'), 'cp', rise, 'l');

  // step 1: mass and gravity
  const o1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.6)) : 1;
  for (const [i, x] of [x0 + 16, (x0 + x1) / 2, x1 - 16].entries()) sb.arrow(`g${i}`, 'i-fg w3', [x, 96], [x, 96 + 40 * o1], o1);
  sb.label('lab-m', [x1 + 14, 112], String.raw`m\approx 10^{4}\,\mathrm{kg}`, 'fg', o1, 'l');
  sb.label('lab-g', [x1 + 14, 140], String.raw`g=${lang === 'de' ? '9{,}8' : '9.8'}\,\mathrm{m/s^2}`, 'muted', o1, 'l');

  // step 2: weight force on the foot
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0, 0.7)) : 1;
  sb.arrow('F', 'i-t w4', [(x0 + x1) / 2, ground - 54], [(x0 + x1) / 2, ground - 54 + 52 * o2], o2, 12);
  sb.label('lab-F', [x1 + 14, 176], String.raw`F=mg\approx 1\cdot 10^{5}\,\mathrm{N}`, 'ct', o2, 'l');

  // step 3: pressure = force per area
  const o3 = step < 3 ? 0 : step === 3 ? ease(seg(t, 0, 0.7)) : 1;
  for (let i = 0; i < 5; i++) { const x = x0 + 8 + i * ((x1 - x0 - 16) / 4); sb.arrow(`p${i}`, 'i-p w3', [x, ground - 22], [x, ground - 22 + 20 * o3], o3, 7); }
  sb.label('lab-P', [x1 + 14, 232], '', 'cp', o3, 'l', { box: true, rows: [{ tex: String.raw`P=\dfrac{F}{A}\approx 10^{5}\,\mathrm{Pa}`, ink: 'cp' }, { tex: String.raw`=100\,\mathrm{kPa}\approx 1\,\mathrm{bar}`, ink: 'cp' }] });
  return sb.finish({ step, rise, o1, o2, o3 });
}

// ---------------------------------------------------------------------------------------------------- barometer
export const BARO = { dishL: 10, dishR: 172, bathTop: 232, bathBot: 280, tubeL: 66, tubeR: 98, tubeTop: 52, hTop: 128 };

export function baroScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const { dishL, dishR, bathTop, bathBot, tubeL, tubeR, tubeTop, hTop } = BARO;
  // dish with mercury bath, tube standing in it
  sb.rect('bath', 'hg', dishL, bathTop, dishR - dishL, bathBot - bathTop);
  sb.poly('dish', 'i-muted w3', [[dishL, bathTop - 10], [dishL, bathBot], [dishR, bathBot], [dishR, bathTop - 10]]);
  sb.rect('hg-col', 'hg', tubeL + 1.5, hTop, tubeR - tubeL - 3, bathTop - hTop);
  sb.poly('tube', 'glass', [[tubeL, tubeTop], [tubeL, bathBot - 12], [tubeR, bathBot - 12], [tubeR, tubeTop]], 1, false);
  sb.line('tube-cap', 'i-muted w3', [tubeL, tubeTop], [tubeR, tubeTop]);
  sb.line('tube-l', 'i-muted w3', [tubeL, tubeTop], [tubeL, bathBot - 12]);
  sb.line('tube-r', 'i-muted w3', [tubeR, tubeTop], [tubeR, bathBot - 12]);
  const cx = (tubeL + tubeR) / 2;
  sb.label('lab-vac', [cx, (tubeTop + hTop) / 2], tx(lang, 'Vakuum', 'vacuum'), 'muted', 1, 'c');
  sb.label('lab-Hg', [dishL + 26, bathBot - 14], String.raw`\mathrm{Hg}`, 'fg');
  // atmosphere pushes on the bath
  for (const [i, x] of [dishL + 14, dishL + 40, dishR - 40, dishR - 14].entries()) sb.arrow(`pa${i}`, 'i-p w3', [x, bathTop - 56], [x, bathTop - 14], 1, 9);
  sb.label('lab-Patm', [dishL + 2, bathTop - 72], String.raw`P_{\mathrm{atm}}`, 'cp', 1, 'l');
  // h
  sb.line('h-top', 'i-v dash w1', [tubeR + 4, hTop], [tubeR + 70, hTop]);
  sb.line('h-bot', 'i-v dash w1', [tubeR + 4, bathTop], [tubeR + 70, bathTop]);
  sb.arrow('h-up', 'i-v w3', [tubeR + 66, bathTop], [tubeR + 66, hTop], 1, 8);
  sb.arrow('h-dn', 'i-v w3', [tubeR + 66, hTop], [tubeR + 66, bathTop], 1, 8);
  sb.label('lab-h', [tubeR + 72, (hTop + bathTop) / 2], 'h', 'cv', 1, 'l');

  // step 1: weight of the column vs push of the atmosphere
  const o1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.6)) : 1;
  sb.arrow('W', 'i-t w4', [cx, hTop + 18], [cx, hTop + 18 + 42 * o1], o1, 11);
  sb.label('lab-W', [tubeR + 6, hTop + 26], String.raw`F=mg`, 'ct', o1, 'l');
  // step 2: cross-section A, V = A h
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0, 0.6)) : 1;
  sb.line('A-line', 'i-n dash w3', [tubeL + 1, bathTop - 22], [tubeR - 1, bathTop - 22], o2);
  sb.label('lab-A', [tubeR + 6, bathTop - 22], 'A', 'cn', o2, 'l');
  sb.rect('V-fill', 'i-v soft nostroke', tubeL + 1.5, hTop, tubeR - tubeL - 3, bathTop - hTop, o2 * 0.5);
  // formulas on the right
  const R = 214;
  sb.label('f1', [R, 40], String.raw`P_{\mathrm{Hg}}=\dfrac{F}{A}=\dfrac{mg}{A}`, 'cp', o1, 'l');
  sb.label('f2', [R, 104], String.raw`m=\rho V=\rho A h`, 'fg', o2, 'l');
  const o3 = step < 3 ? 0 : step === 3 ? ease(seg(t, 0, 0.6)) : 1;
  sb.label('f3', [R, 160], String.raw`P_{\mathrm{Hg}}=\dfrac{\rho A h g}{A}=\rho g h`, 'cp', o3, 'l', { box: step === 3 });
  const o4 = step < 4 ? 0 : ease(seg(t, 0, 0.6));
  sb.label('f4', [R, 218], String.raw`h=760\,\mathrm{mm}`, 'cv', o4, 'l');
  sb.label('f5', [R, 252], String.raw`P_{\mathrm{atm}}=760\,\mathrm{mm\,Hg}`, 'cp', o4, 'l');
  return sb.finish({ step, o1, o2, o3, o4 });
}

// ---------------------------------------------------------------------------------------------------- ideal gas law
/** Relative states at the END of each step (P, T, n); V = nT/P in the units of the start (V = 1 = 90 px). */
export const IGL_STATES: { P: number; T: number; n: number }[] = [
  { P: 2, T: 1, n: 1 }, // 0 Boyle: pressure doubles
  { P: 2, T: 2, n: 1 }, // 1 Charles: temperature doubles
  { P: 2, T: 2, n: 2 }, // 2 Avogadro: twice as many particles
  { P: 2, T: 2, n: 2 }, // 3 combine
  { P: 2, T: 2, n: 2 }, // 4 R
];
const START = { P: 1, T: 1, n: 1 };
export const iglV = (s: { P: number; T: number; n: number }) => (s.n * s.T) / s.P;
export const CYL = { x0: 92, x1: 212, bottom: 268, unit: 90 };

export function iglScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const from = step === 0 ? START : IGL_STATES[step - 1], to = IGL_STATES[step];
  const k = step <= 2 ? ease(seg(t, 0.05, 0.9)) : 1;
  const P = lerp(from.P, to.P, k), T = lerp(from.T, to.T, k), n = lerp(from.n, to.n, k);
  const V = iglV({ P, T, n });
  const { x0, x1, bottom, unit } = CYL;
  const hPx = unit * V, yP = bottom - hPx; // piston plate
  // cylinder and piston
  sb.rect('gas', 'i-p soft nostroke', x0, yP + 8, x1 - x0, hPx - 8, 0.8);
  sb.poly('cyl', 'i-muted w3', [[x0, 40], [x0, bottom], [x1, bottom], [x1, 40]]);
  sb.rect('piston', 'i-fg f', x0 + 1, yP, x1 - x0 - 2, 8);
  // dots: n(t) particles (up to 20), tails ∝ √T
  const base = 10, count = base * n, D = dots(20, 37, 91);
  D.forEach((d, i) => {
    const o = clamp(count - i, 0, 1);
    if (o <= 0) return;
    const x = x0 + 8 + d[0] * (x1 - x0 - 16), y = bottom - 8 - d[1] * (hPx - 24);
    const a = d[0] * 17 + i, len = 6 * Math.sqrt(T);
    sb.line(`tail${i}`, 'i-t w1', [x, y], [x - Math.cos(a) * len, y - Math.sin(a) * len], o * 0.9);
    sb.dot(`d${i}`, 'atom', [x, y], 3.2, o);
  });
  // pressure arrows on the piston (length ∝ P), temperature arrows under the cylinder (∝ T)
  const cxm = (x0 + x1) / 2;
  for (const [i, dx] of [-34, 0, 34].entries()) sb.arrow(`P${i}`, 'i-p w3', [cxm + dx, yP - 8 - 20 * P], [cxm + dx, yP - 1], 1, 9);
  sb.label('lab-P', [cxm + 56, yP - 8 - 10 * P], 'P', 'cp', 1, 'l');
  for (const [i, dx] of [-34, 0, 34].entries()) sb.arrow(`T${i}`, 'i-t w3', [cxm + dx, bottom + 30], [cxm + dx, bottom + 30 - 12 * T], 1, 8);
  sb.label('lab-T', [cxm + 56, bottom + 22], 'T', 'ct', 1, 'l');
  // volume dimension
  sb.arrow('V-up', 'i-v w3', [x0 - 22, bottom], [x0 - 22, yP + 8], 1, 8);
  sb.arrow('V-dn', 'i-v w3', [x0 - 22, yP + 8], [x0 - 22, bottom], 1, 8);
  sb.label('lab-V', [x0 - 30, (bottom + yP) / 2], 'V', 'cv', 1, 'r');
  sb.label('lab-n', [x1 - 6, bottom - 12], 'n', 'cn', n > 1.05 ? 1 : 0.0, 'r');
  // laws on the right
  const R = 250;
  const o0 = step === 0 ? ease(seg(t, 0.5, 1)) : 1;
  sb.label('law0', [R, 56], String.raw`V\propto\dfrac{1}{P}`, 'cv', o0, 'l');
  sb.label('nm0', [R + 78, 56], tx(lang, 'Boyle', 'Boyle'), 'muted', o0, 'l');
  const o1 = step < 1 ? 0 : step === 1 ? ease(seg(t, 0.5, 1)) : 1;
  sb.label('law1', [R, 108], String.raw`V\propto T`, 'cv', o1, 'l');
  sb.label('nm1', [R + 78, 108], tx(lang, 'Charles', 'Charles'), 'muted', o1, 'l');
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.5, 1)) : 1;
  sb.label('law2', [R, 148], String.raw`V\propto n`, 'cv', o2, 'l');
  sb.label('nm2', [R + 78, 148], tx(lang, 'Avogadro', 'Avogadro'), 'muted', o2, 'l');
  const o3 = step < 3 ? 0 : step === 3 ? ease(seg(t, 0, 0.7)) : 0;
  sb.label('law3', [R, 206], String.raw`V\propto\dfrac{nT}{P}`, 'cv', o3, 'l', { box: step === 3 });
  const o4 = step < 4 ? 0 : ease(seg(t, 0, 0.7));
  sb.label('law4', [R, 206], String.raw`V=R\,\dfrac{nT}{P}`, 'cv', o4, 'l', { box: true });
  sb.label('law5', [R, 262], String.raw`PV=nRT`, 'fg', o4, 'l', { box: true });
  return sb.finish({ step, P, T, n, V, hPx });
}
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

// ---------------------------------------------------------------------------------------------------- balloon
export const BALLOON = { Vi: 6.0, Pi: 101.3, Pf: 45.6, Ti: cToK(22), Tf: cToK(-21) };
/** Volume after each step: start, after the pressure drop alone, after cooling as well. */
export const balloonV = [BALLOON.Vi, BALLOON.Vi * (BALLOON.Pi / BALLOON.Pf), BALLOON.Vi * (BALLOON.Pi / BALLOON.Pf) * (BALLOON.Tf / BALLOON.Ti), BALLOON.Vi * (BALLOON.Pi / BALLOON.Pf) * (BALLOON.Tf / BALLOON.Ti)];
const radius = (V: number) => 28 * Math.sqrt(V / BALLOON.Vi);
const alt = [232, 160, 112, 112];

export function balloonScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const num = (v: number, d: number) => fmtNum(v, d, lang, true);
  const a = step === 0 ? 0 : ease(seg(t, 0.0, 0.9)), prev = Math.max(0, step - 1);
  const V = step === 0 ? balloonV[0] : lerp(balloonV[prev], balloonV[step], a);
  const y = step === 0 ? alt[0] : lerp(alt[prev], alt[step], a);
  const cx = 322, r = radius(V);
  // ground, altitude marker
  sb.poly('hill', 'ground', [[0, 300], [0, 268], [90, 262], [200, 276], [300, 270], [400, 280], [400, 300]], 1, true);
  sb.line('alt', 'i-muted dash w1', [cx - 50, 40], [cx - 50, 262]);
  sb.arrow('alt-a', 'i-muted w1', [cx - 50, 250], [cx - 50, 60], 1, 7);
  sb.label('lab-alt', [cx - 56, 56], tx(lang, 'Höhe', 'height'), 'muted', 1, 'r');
  // balloon
  sb.poly('bal-s', 'i-fg w1', [[cx, y + r], [cx, 262]], 1);
  const circ: P2[] = Array.from({ length: 40 }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / 40), y + r * Math.sin((2 * Math.PI * i) / 40)] as P2);
  sb.poly('bal', 'i-v soft w3', circ, 1, true);
  sb.label('lab-Vb', [cx, y], `V`, 'cv', 1, 'c');
  // readouts
  const P = step === 0 ? BALLOON.Pi : lerp(step === 1 ? BALLOON.Pi : BALLOON.Pf, BALLOON.Pf, step === 1 ? a : 1);
  const Tc = step < 2 ? 22 : step === 2 ? lerp(22, -21, a) : -21;
  const Tk = cToK(Tc);
  sb.label('r-P', [14, 40], String.raw`P=${num(P, 1)}\,\mathrm{kPa}`, 'cp', 1, 'l');
  sb.label('r-T', [14, 84], String.raw`T=${num(Tk, 0)}\,\mathrm{K}\;\bigl(${num(Tc, 0)}\,^\circ\mathrm{C}\bigr)`, 'ct', 1, 'l');
  sb.label('r-V', [14, 128], String.raw`V=${num(V, 1)}\,\mathrm{L}`, 'cv', 1, 'l');
  // captions of the factors
  const o1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.6, 1)) : 1;
  sb.label('f1', [14, 176], String.raw`\times\dfrac{P_i}{P_f}=\dfrac{${num(BALLOON.Pi, 1)}}{${num(BALLOON.Pf, 1)}}`, 'cp', o1, 'l');
  const o2 = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.6, 1)) : 1;
  sb.label('f2', [14, 224], String.raw`\times\dfrac{T_f}{T_i}=\dfrac{${num(BALLOON.Tf, 0)}}{${num(BALLOON.Ti, 0)}}`, 'ct', o2, 'l');
  const o3 = step < 3 ? 0 : ease(seg(t, 0, 0.7));
  const Vf = balloonV[3];
  sb.label('res', [cx - 20, 24], String.raw`V_f\approx ${num(roundSig(Vf, 2), 0)}\,\mathrm{L}`, 'cv', o3, 'c', { box: true });
  return sb.finish({ step, V, P, Tc, y, r, Vf, o3 });
}

// ---------------------------------------------------------------------------------------------------- Dalton
export const DALTON = { n1: 5, n2: 3, boxW: 96, boxH: 88, top: 28, ax: 22, bx: 152, cx: 282, base: 268, per: 12 };

export function daltonScene(step: number, t: number, lang: Lang): CScene {
  const sb = builder();
  const { n1, n2, boxW, boxH, top, ax, bx, cx, base, per } = DALTON;
  void lang;
  const boxes: [string, number][] = [['A', ax], ['B', bx], ['C', cx]];
  for (const [id, x] of boxes) {
    const vis = id === 'A' ? 1 : id === 'B' ? (step >= 1 ? 1 : 0) : (step >= 2 ? 1 : 0);
    sb.rect(`box${id}`, 'glass', x, top, boxW, boxH, vis);
  }
  const A = dots(n1, 29, 53), B = dots(n2, 41, 67);
  const at = (x: number, d: P2): P2 => [x + 10 + d[0] * (boxW - 20), top + 10 + d[1] * (boxH - 20)];
  // species 1 (amber) in A, species 2 (teal) in B
  const faded = step >= 2 ? 0.35 : 1;
  A.forEach((d, i) => sb.dot(`a${i}`, 'i-e f nostroke', at(ax, d), 5, faded));
  if (step >= 1) B.forEach((d, i) => sb.dot(`b${i}`, 'i-s f nostroke', at(bx, d), 5, faded * (step === 1 ? ease(seg(t, 0, 0.5)) : 1)));
  // step 2: copies fly into C; in step 3 they rest there
  if (step >= 2) {
    const k = step === 2 ? ease(seg(t, 0.05, 0.85)) : 1;
    // in C the two species share the box: spread them over the whole box using a mixed layout
    const C = dots(n1 + n2, 23, 59);
    A.forEach((d, i) => sb.dot(`ca${i}`, 'i-e f nostroke', lerp2(at(ax, d), at(cx, C[i]), k), 5));
    B.forEach((d, i) => sb.dot(`cb${i}`, 'i-s f nostroke', lerp2(at(bx, d), at(cx, C[n1 + i]), k), 5));
  }
  // symbols between the boxes
  sb.label('plus', [bx - 14, top + boxH / 2], '+', 'fg', step >= 1 ? 1 : 0);
  sb.label('eq', [cx - 14, top + boxH / 2], '=', 'fg', step >= 2 ? 1 : 0);
  // species names above
  sb.label('n1', [ax + boxW / 2, top - 12], String.raw`n_1=${n1}`, 'ce', 1);
  sb.label('n2', [bx + boxW / 2, top - 12], String.raw`n_2=${n2}`, 'cs', step >= 1 ? 1 : 0);
  sb.label('nt', [cx + boxW / 2, top - 12], String.raw`n_{\mathrm{tot}}=${n1 + n2}`, 'fg', step >= 2 ? 1 : 0);
  // pressure bars (height ∝ number of particles at the same V, T)
  const bar = (id: string, x: number, h0: number, h1: number, cls: string, o: number) => sb.rect(id, `${cls} f nostroke`, x, base - h0 - h1, 30, h1, o);
  const hA = per * n1, hB = per * n2;
  const gA = step === 0 ? ease(seg(t, 0.2, 1)) : 1;
  sb.line('base', 'i-muted w1', [ax + 10, base], [cx + boxW - 10, base]);
  bar('barA', ax + 33, 0, hA * gA, 'i-p', 1);
  sb.label('P1', [ax + 33 + 15, base - hA * gA - 12], 'P_1', 'cp', gA);
  const gB = step < 1 ? 0 : step === 1 ? ease(seg(t, 0.4, 1)) : 1;
  bar('barB', bx + 33, 0, hB * gB, 'i-p', gB > 0 ? 1 : 0);
  sb.label('P2', [bx + 33 + 15, base - hB * gB - 12], 'P_2', 'cp', gB);
  const gC = step < 2 ? 0 : step === 2 ? ease(seg(t, 0.8, 1)) : 1;
  bar('barC1', cx + 33, 0, hA * gC, 'i-p', gC > 0 ? 1 : 0);
  bar('barC2', cx + 33, hA * gC, hB * gC, 'i-p soft', gC > 0 ? 1 : 0);
  sb.rect('barC2o', 'i-p w1', cx + 33, base - (hA + hB) * gC, 30, hB * gC, gC > 0 ? 1 : 0);
  sb.label('Ptot', [cx + 33 + 15, base - (hA + hB) * gC - 14], String.raw`P_{\mathrm{tot}}`, 'cp', gC);
  sb.label('P1c', [cx + 33 + 36, base - hA * gC / 2], 'P_1', 'cp', gC, 'l');
  sb.label('P2c', [cx + 33 + 36, base - hA * gC - (hB * gC) / 2], 'P_2', 'cp', gC, 'l');
  const o3 = step < 3 ? 0 : ease(seg(t, 0, 0.7));
  sb.label('law', [bx + boxW / 2 - 4, 168], String.raw`P_{\mathrm{tot}}=P_1+P_2`, 'cp', o3, 'c', { box: true });
  return sb.finish({ step, gA, gB, gC, o3, hA, hB });
}

