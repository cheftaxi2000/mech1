/**
 * Slides 9–10 (lecture 3) and exercise class 3, p. 2: why water dissolves ionic solids.
 *  step 0  a small NaCl crystal in water; the water molecules tumble about in every direction
 *  step 1  next to the crystal the molecules turn: O (δ⁻) towards the cations, H (δ⁺) towards the anions
 *  step 2  the ions leave the crystal, each one wrapped in its own shell of water molecules (hydration)
 * SVG coordinates (400 × 300). A water molecule is drawn by `water()`; θ is the direction of its O end.
 */
import type { Lang } from '../../i18n';
import { sceneBuilder, type Scene } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { beaker, disc, ease, lerp2, lerpAngle, rng, seg, sign, water, waterAtoms, INK } from './sceneKit';

export const R_CAT = 9, R_AN = 12;
const X0 = 14, X1 = 386, TOP = 30, BOTTOM = 266, WATER_TOP = 52;

export interface IonSpot { k: number; col: number; row: number; cat: boolean; crystal: P2; free: P2 }
export const IONS: IonSpot[] = Array.from({ length: 8 }, (_, k) => {
  const col = k % 4, row = k >> 2;
  // dissolved positions keep the chequerboard order but spread over the beaker
  const free: P2 = [62 + col * 92 + (row ? 24 : 0), 108 + row * 96];
  return { k, col, row, cat: (col + row) % 2 === 0, crystal: [155 + 30 * col, 168 + 30 * row], free };
});

const dist = (cat: boolean) => (cat ? R_CAT + 10 : R_AN + 10);
/** θ for a water molecule at `w` next to the ion at `c` (cation: O end towards the ion; anion: H end towards the ion). */
export function orient(w: P2, c: P2, cat: boolean): number {
  const toIon = Math.atan2(c[1] - w[1], c[0] - w[0]);
  return cat ? toIon : toIon + Math.PI;
}

interface Pose { c: P2; th: number }
const rand = rng(11);
const SCATTER: Pose[] = (() => {
  const out: Pose[] = [];
  let guard = 0;
  while (out.length < 24 && guard++ < 5000) {
    const c: P2 = [34 + rand() * 332, 78 + rand() * 176];
    const inCrystal = c[0] > 118 && c[0] < 282 && c[1] > 128 && c[1] < 236;
    if (inCrystal || out.some((p) => Math.hypot(p.c[0] - c[0], p.c[1] - c[1]) < 30)) continue;
    out.push({ c, th: rand() * Math.PI * 2 });
  }
  return out;
})();

/** Poses at the end of step 1: the waters beside the crystal face the ions. Others keep their scattered pose. */
const AT_CRYSTAL: Pose[] = SCATTER.map((p) => ({ ...p }));
const DIRS: P2[][] = IONS.map((ion) => {
  const d: P2[] = [ion.row === 0 ? [0, -1] : [0, 1]];
  if (ion.col === 0) d.push([-1, 0]); else if (ion.col === 3) d.push([1, 0]);
  return d;
});
IONS.forEach((ion, k) => DIRS[k].forEach((d, j) => {
  const c: P2 = [ion.crystal[0] + d[0] * dist(ion.cat), ion.crystal[1] + d[1] * dist(ion.cat)];
  AT_CRYSTAL[3 * k + j] = { c, th: orient(c, ion.crystal, ion.cat) };
}));

/** Poses at the end of step 2: three waters in a shell around each free ion. */
const SHELL: Pose[] = SCATTER.map((p) => ({ ...p }));
IONS.forEach((ion, k) => {
  const phi = ((k * 137.5) % 360) * (Math.PI / 180);
  for (let j = 0; j < 3; j++) {
    const a = phi + (j * 2 * Math.PI) / 3;
    const c: P2 = [ion.free[0] + Math.cos(a) * dist(ion.cat), ion.free[1] + Math.sin(a) * dist(ion.cat)];
    SHELL[3 * k + j] = { c, th: orient(c, ion.free, ion.cat) };
  }
});

export const nearCrystal = (k: number, j: number) => j < DIRS[k].length;

export function hydrationScene(step: number, t: number, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  beaker(sb, X0, TOP, X1, BOTTOM, WATER_TOP);
  const u1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.05, 0.9)) : 1; // waters turn to the crystal
  const u2 = step < 2 ? 0 : ease(seg(t, 0.05, 0.9)); // ions leave, shells form
  const ionPos = (ion: IonSpot): P2 => lerp2(ion.crystal, ion.free, u2);
  // waters (drawn first so the ions lie on top)
  for (let i = 0; i < 24; i++) {
    const a = lerp2(SCATTER[i].c, AT_CRYSTAL[i].c, u1), b = SHELL[i].c;
    const c = lerp2(a, b, u2);
    const th = lerpAngle(lerpAngle(SCATTER[i].th, AT_CRYSTAL[i].th, u1), SHELL[i].th, u2);
    water(sb, `w${i}`, c, th);
  }
  for (const ion of IONS) {
    const p = ionPos(ion);
    disc(sb, `ion${ion.k}`, ion.cat ? 'cs-ion-cat' : 'cs-ion-an', p, ion.cat ? R_CAT : R_AN);
    sign(sb, `s${ion.k}`, p, ion.cat, ion.cat ? R_CAT : R_AN);
  }
  // legend: Na⁺, Cl⁻, and one water molecule with its partial charges
  disc(sb, 'leg-cat', 'cs-ion-cat', [30, 284], R_CAT - 1);
  sign(sb, 'leg-cat-s', [30, 284], true, R_CAT - 1);
  sb.label('leg-cat-l', [43, 284], String.raw`\mathrm{Na}^{+}`, INK.cat, 1, 'l');
  disc(sb, 'leg-an', 'cs-ion-an', [104, 284], R_AN - 2);
  sign(sb, 'leg-an-s', [104, 284], false, R_AN - 2);
  sb.label('leg-an-l', [118, 284], String.raw`\mathrm{Cl}^{-}`, INK.an, 1, 'l');
  const wc: P2 = [320, 284];
  water(sb, 'leg-w', wc, 0);
  const { H1, H2 } = waterAtoms(wc, 0);
  sb.label('leg-dm', [wc[0] + 14, 284], String.raw`\delta^{-}`, INK.an, 1, 'l');
  sb.label('leg-dp', [Math.min(H1[0], H2[0]) - 8, 284], String.raw`\delta^{+}`, INK.cat, 1, 'r');
  return sb.finish({ u1, u2 });
}

/** The water poses of a frame (for tests): index → {c, th}. */
export function waterPoses(step: number, t: number): Pose[] {
  const u1 = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.05, 0.9)) : 1;
  const u2 = step < 2 ? 0 : ease(seg(t, 0.05, 0.9));
  return SCATTER.map((_, i) => ({
    c: lerp2(lerp2(SCATTER[i].c, AT_CRYSTAL[i].c, u1), SHELL[i].c, u2),
    th: lerpAngle(lerpAngle(SCATTER[i].th, AT_CRYSTAL[i].th, u1), SHELL[i].th, u2),
  }));
}
