/**
 * Two solutions are mixed (lecture 3, slides 13–15 precipitation and 18 neutralisation). Four kinds of ions, four of each:
 * left solution = cation A + anion X, right solution = cation B + anion Y. A and Y find each other; X and B are the spectators.
 *  step 0  two solutions, side by side
 *  step 1  they are mixed: all ions move about the whole beaker
 *  step 2  A and Y meet: they form a solid that sinks (precipitation) or water molecules (neutralisation)
 *  step 3  the ions that took no part (X and B) are drawn as open rings: the spectator ions
 * SVG coordinates (400 × 300).
 */
import type { Lang } from '../../i18n';
import { sceneBuilder, type Scene } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { beaker, disc, ease, lerp2, rng, seg, sign, water, INK } from './sceneKit';

export type Kind = 'A' | 'X' | 'B' | 'Y';
export interface KindCfg { tex: string; r: number; cat: boolean }
export interface MixCfg {
  /** A = left cation (reacts), X = left anion, B = right cation, Y = right anion (reacts) */
  kinds: Record<Kind, KindCfg>;
  product: 'solid' | 'water';
  /** product label, TeX */
  productTex: string;
  seed: number;
}

export const PRECIP: MixCfg = {
  kinds: {
    A: { tex: String.raw`\mathrm{Ag}^{+}`, r: 9, cat: true }, X: { tex: String.raw`\mathrm{NO_3}^{-}`, r: 13, cat: false },
    B: { tex: String.raw`\mathrm{K}^{+}`, r: 11, cat: true }, Y: { tex: String.raw`\mathrm{Cl}^{-}`, r: 11, cat: false },
  },
  product: 'solid', productTex: String.raw`\mathrm{AgCl}(s)`, seed: 3,
};
export const NEUTRAL: MixCfg = {
  kinds: {
    A: { tex: String.raw`\mathrm{H}^{+}`, r: 7, cat: true }, X: { tex: String.raw`\mathrm{Cl}^{-}`, r: 12, cat: false },
    B: { tex: String.raw`\mathrm{Na}^{+}`, r: 10, cat: true }, Y: { tex: String.raw`\mathrm{OH}^{-}`, r: 11, cat: false },
  },
  product: 'water', productTex: String.raw`\mathrm{H_2O}(l)`, seed: 5,
};

export const N_EACH = 4;
const X0 = 14, X1 = 386, TOP = 30, BOTTOM = 266, WATER_TOP = 52;
export const MID = 200;
const KINDS: Kind[] = ['A', 'X', 'B', 'Y'];
export interface Particle { kind: Kind; i: number; p0: P2; p1: P2; p2: P2 }

/** Positions of the four-times-four ions in the three stages (deterministic). */
export function layout(cfg: MixCfg): Particle[] {
  const rand = rng(cfg.seed);
  const placed: P2[] = [];
  const free = (p: P2, d = 27) => placed.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) >= d);
  const pick = (x0: number, x1: number, y0: number, y1: number, d = 27): P2 => {
    for (let n = 0; n < 400; n++) {
      const p: P2 = [x0 + rand() * (x1 - x0), y0 + rand() * (y1 - y0)];
      if (free(p, d)) { placed.push(p); return p; }
    }
    const p: P2 = [x0 + rand() * (x1 - x0), y0 + rand() * (y1 - y0)];
    placed.push(p);
    return p;
  };
  // stage 0: solutions apart (A, X left; B, Y right)
  const p0: Record<string, P2[]> = { A: [], X: [], B: [], Y: [] };
  for (const k of KINDS) for (let i = 0; i < N_EACH; i++) p0[k].push(k === 'A' || k === 'X' ? pick(34, 178, 84, 226) : pick(222, 366, 84, 226));
  // stage 1: mixed. Reacting pairs sit next to each other around a meeting point so that stage 2 is a short walk.
  placed.length = 0;
  const p1: Record<string, P2[]> = { A: [], X: [], B: [], Y: [] };
  const meet: P2[] = [];
  for (let i = 0; i < N_EACH; i++) meet.push(pick(60, 340, 100, 214, 66));
  for (let i = 0; i < N_EACH; i++) {
    const a = rand() * Math.PI * 2, d = 30;
    p1.A.push([meet[i][0] + d * Math.cos(a), meet[i][1] + d * Math.sin(a)]);
    p1.Y.push([meet[i][0] - d * Math.cos(a), meet[i][1] - d * Math.sin(a)]);
  }
  placed.length = 0;
  for (const m of [...p1.A, ...p1.Y]) placed.push(m);
  for (const k of ['X', 'B'] as Kind[]) for (let i = 0; i < N_EACH; i++) p1[k].push(pick(34, 366, 90, 224, 30));
  // stage 2: products
  const p2: Record<string, P2[]> = { A: [], X: p1.X, B: p1.B, Y: [] };
  for (let i = 0; i < N_EACH; i++) {
    if (cfg.product === 'solid') { p2.A.push([100 + 44 * i, 246]); p2.Y.push([122 + 44 * i, 246]); }
    else { p2.A.push(meet[i]); p2.Y.push(meet[i]); }
  }
  return KINDS.flatMap((k) => p0[k].map((p, i) => ({ kind: k, i, p0: p, p1: p1[k][i], p2: p2[k][i] })));
}

const LAYOUTS = new Map<MixCfg, Particle[]>();
const get = (cfg: MixCfg) => { let l = LAYOUTS.get(cfg); if (!l) { l = layout(cfg); LAYOUTS.set(cfg, l); } return l; };

export interface MixState { mix: number; react: number; spect: number; divider: number }
export function mixState(step: number, t: number): MixState {
  return {
    mix: step === 0 ? 0 : step === 1 ? ease(seg(t, 0.05, 0.95)) : 1,
    react: step < 2 ? 0 : step === 2 ? ease(seg(t, 0.05, 0.9)) : 1,
    spect: step < 3 ? 0 : ease(seg(t, 0.1, 0.8)),
    divider: step === 0 ? 1 : step === 1 ? 1 - seg(t, 0, 0.3) : 0,
  };
}

export function makeMixScene(cfg: MixCfg) {
  return function mixScene(step: number, t: number, lang: Lang): Scene {
    void lang;
    const sb = sceneBuilder();
    const st = mixState(step, t);
    beaker(sb, X0, TOP, X1, BOTTOM, WATER_TOP);
    if (st.divider > 0.01) sb.shape({ key: 'divider', kind: 'line', cls: 'cs-div', pts: [[MID, TOP + 4], [MID, BOTTOM]], o: st.divider });
    const parts = get(cfg);
    const waterIcons: P2[] = [];
    for (const q of parts) {
      const reacting = q.kind === 'A' || q.kind === 'Y';
      const k = cfg.kinds[q.kind];
      const mixed = lerp2(q.p0, q.p1, st.mix);
      const pos = reacting ? lerp2(mixed, q.p2, st.react) : mixed;
      // neutralisation: the pair turns into one water molecule; the ions fade out
      const fade = reacting && cfg.product === 'water' ? 1 - seg(st.react, 0.7, 1) : 1;
      const key = `${q.kind}${q.i}`;
      const filled = reacting ? 1 : 1 - st.spect;
      disc(sb, key, k.cat ? 'cs-ion-cat' : 'cs-ion-an', pos, k.r, fade * filled);
      sign(sb, `${key}-s`, pos, k.cat, k.r, fade * filled);
      if (!reacting && st.spect > 0.01) {
        disc(sb, `${key}-ring`, k.cat ? 'cs-ring-cat' : 'cs-ring-an', pos, k.r, st.spect);
        sign(sb, `${key}-rs`, pos, k.cat, k.r, st.spect);
      }
      if (q.kind === 'A' && cfg.product === 'water') waterIcons.push(pos);
    }
    if (cfg.product === 'water') waterIcons.forEach((c, i) => water(sb, `h2o${i}`, c, 0.7 + i * 1.3, seg(st.react, 0.7, 1)));
    // product label
    if (st.react > 0.9) {
      if (cfg.product === 'solid') sb.label('prod', [292, 246], cfg.productTex, INK.fg, seg(st.react, 0.9, 1), 'l');
    }
    // legend
    const xs = [20, 88, 190, 270];
    KINDS.forEach((kd, n) => {
      const k = cfg.kinds[kd];
      disc(sb, `leg-${kd}`, k.cat ? 'cs-ion-cat' : 'cs-ion-an', [xs[n], 284], k.r - 2);
      sign(sb, `leg-${kd}-s`, [xs[n], 284], k.cat, k.r - 2);
      sb.label(`leg-${kd}-l`, [xs[n] + k.r + 2, 284], k.tex, k.cat ? INK.cat : INK.an, 1, 'l');
    });
    return sb.finish({ mix: st.mix, react: st.react, spect: st.spect });
  };
}

export const precipScene = makeMixScene(PRECIP);
export const neutralScene = makeMixScene(NEUTRAL);
