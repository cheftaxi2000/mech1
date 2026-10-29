/**
 * Pure scenes of «Säuren, Basen und Redoxreaktionen» (lecture 3, slides 17–28). 400 × 300 viewBox.
 *  acidScene      slides 17, 19: how many acid molecules split into H⁺ and an anion (strong / weak, qualitative)
 *  redoxScene     slides 23–26: Mg + 2 HCl → MgCl₂ + H₂ with oxidation numbers and the moving electrons
 *  dispScene      slides 27–28: a metal in a solution of another metal's cations, before and after
 */
import type { Lang } from '../../i18n';
import { chemTex } from '../../chem/tex';
import { displacement, acidNet, metal, reducesCation, reactsWithAcid } from '../../chem/activity';
import { sceneBuilder, arrowHead, type Scene } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { beaker, disc, ease, lerp, lerp2, rng, seg, sign, rect, INK } from './sceneKit';

// ---------------------------------------------------------------- acids: strong and weak
export const N_ACID = 10;
/** `split` of the 10 acid molecules HA have released their H⁺ (slide 19: strength = how much H⁺ is produced). */
export function acidScene(split: number): Scene {
  const sb = sceneBuilder();
  beaker(sb, 30, 40, 370, 250, 62);
  const rand = rng(31);
  const placed: P2[] = [];
  const spot = (): P2 => {
    for (let n = 0; n < 400; n++) { const p: P2 = [60 + rand() * 280, 90 + rand() * 140]; if (placed.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 44)) { placed.push(p); return p; } }
    const p: P2 = [60 + rand() * 280, 90 + rand() * 140]; placed.push(p); return p;
  };
  for (let i = 0; i < N_ACID; i++) {
    const p = spot();
    if (i < split) {
      // H⁺ and A⁻ apart
      disc(sb, `h${i}`, 'cs-ion-cat', [p[0] - 14, p[1] - 5], 8); sign(sb, `h${i}s`, [p[0] - 14, p[1] - 5], true, 8);
      disc(sb, `a${i}`, 'cs-ion-an', [p[0] + 14, p[1] + 5], 12); sign(sb, `a${i}s`, [p[0] + 14, p[1] + 5], false, 12);
    } else {
      // intact molecule HA: small H stuck to the big A
      disc(sb, `a${i}`, 'cs-aX', [p[0] + 4, p[1]], 12);
      disc(sb, `h${i}`, 'cs-aH', [p[0] - 10, p[1] - 6], 7);
    }
  }
  sb.label('l-ha', [60, 270], String.raw`\mathrm{HA}`, INK.muted, 1, 'l');
  disc(sb, 'sw-h', 'cs-ion-cat', [150, 270], 7); sb.label('l-h', [162, 270], String.raw`\mathrm{H}^{+}`, INK.cat, 1, 'l');
  disc(sb, 'sw-a', 'cs-ion-an', [230, 270], 9); sb.label('l-a', [244, 270], String.raw`\mathrm{A}^{-}`, INK.an, 1, 'l');
  return sb.finish({ split, intact: N_ACID - split });
}

// ---------------------------------------------------------------- redox: Mg + 2 HCl (slides 23–26)
export const OX = {
  mg: [60, 105] as P2, h1: [160, 105] as P2, cl1: [196, 105] as P2, h2: [262, 105] as P2, cl2: [298, 105] as P2,
};
const R = { mg: 24, mgIon: 17, h: 11, cl: 16 };

export interface RedoxState { u: number; num: { mg: number; h: number; cl: number }; names: number }
export function redoxState(step: number, t: number): RedoxState {
  const u = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.1, 0.85)) : 1;
  return { u, num: { mg: u >= 1 ? 2 : 0, h: u >= 1 ? 0 : 1, cl: -1 }, names: step < 2 ? 0 : ease(seg(t, 0.1, 0.7)) };
}
const sgn = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `-${n * -1}` : '0');

export function redoxScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const s = redoxState(step, t);
  const de = lang === 'de';
  const Y = OX.mg[1];
  // atoms
  disc(sb, 'mg-a', 'cs-cloud', OX.mg, lerp(R.mg, R.mgIon, s.u), 1 - s.u);
  disc(sb, 'mg-i', 'cs-cloud-cat', OX.mg, lerp(R.mg, R.mgIon, s.u), s.u);
  sb.label('mg-n', OX.mg, String.raw`\text{Mg}`, INK.fg, 1);
  for (const [k, hp, cp] of [['1', OX.h1, OX.cl1], ['2', OX.h2, OX.cl2]] as [string, P2, P2][]) {
    disc(sb, `cl${k}`, 'cs-aCl', cp, R.cl);
    disc(sb, `h${k}`, 'cs-aH', hp, R.h);
    sb.label(`cl${k}-n`, cp, String.raw`\text{Cl}`, INK.fg, 1);
    sb.label(`h${k}-n`, hp, String.raw`\text{H}`, INK.fg, 1);
  }
  // oxidation numbers under every atom (the number changes where the electrons went)
  const numTex = (n: number) => sgn(n).replace('-', '-');
  const numLab = (key: string, at: P2, before: number, after: number, ink: typeof INK.fg) => {
    sb.label(`${key}-0`, at, numTex(before), ink, 1 - s.u);
    sb.label(`${key}-1`, at, numTex(after), ink, s.u);
  };
  numLab('on-mg', [OX.mg[0], Y + 40], 0, 2, INK.cat);
  numLab('on-h1', [OX.h1[0], Y + 40], 1, 0, INK.an);
  numLab('on-h2', [OX.h2[0], Y + 40], 1, 0, INK.an);
  numLab('on-cl1', [OX.cl1[0] + 6, Y + 40], -1, -1, INK.muted);
  numLab('on-cl2', [OX.cl2[0] + 6, Y + 40], -1, -1, INK.muted);
  // the electrons: from Mg to each H
  if (s.u > 0 || step === 1) for (const [k, hp, dy] of [['1', OX.h1, -50], ['2', OX.h2, -80]] as [string, P2, number][]) {
    const from: P2 = [OX.mg[0] + 8, Y - 10], to: P2 = [hp[0] - 4, Y - 12];
    const p = lerp2(from, to, s.u);
    disc(sb, `e${k}`, 'cs-electron', [p[0], p[1] + dy * Math.sin(Math.PI * s.u)], 5.5);
  }
  // explanation under the atoms
  if (s.names > 0.01) {
    const o = s.names;
    sb.label('x-mg', [OX.mg[0], 190], String.raw`0\to +2`, INK.cat, o);
    sb.label('x-h', [(OX.h1[0] + OX.h2[0]) / 2, 190], String.raw`+1\to 0`, INK.an, o);
    sb.label('x-cl', [(OX.cl1[0] + OX.cl2[0]) / 2 + 70, 190], String.raw`-1\to -1`, INK.muted, o);
    sb.label('w-mg', [OX.mg[0], 222], String.raw`\text{${de ? 'oxidiert' : 'oxidised'}}`, INK.cat, o, 'c', { box: true });
    sb.label('w-h', [(OX.h1[0] + OX.h2[0]) / 2, 222], String.raw`\text{${de ? 'reduziert' : 'reduced'}}`, INK.an, o, 'c', { box: true });
    sb.label('w-cl', [(OX.cl1[0] + OX.cl2[0]) / 2 + 70, 222], String.raw`\text{${de ? 'unverändert' : 'unchanged'}}`, INK.muted, o, 'c', { box: true });
    sb.label('e-mg', [OX.mg[0], 252], String.raw`-2\,\mathrm{e}^{-}`, INK.el, o);
    sb.label('e-h', [(OX.h1[0] + OX.h2[0]) / 2, 252], String.raw`+2\,\mathrm{e}^{-}`, INK.el, o);
  }
  sb.label('eq', [200, 36], chemTex('Mg + 2 HCl -> MgCl2 + H2'), INK.fg, 1);
  return sb.finish({ u: s.u, mg: s.num.mg, h: s.num.h, cl: s.num.cl, names: s.names });
}

// ---------------------------------------------------------------- displacement: a metal in a solution (slides 27–28)
/** Left: before (metal strip + cations in solution). Right: after, if the activity series allows the reaction. `c` is a metal symbol or `H` for an acid. */
export function dispScene(m: string, c: string, lang: Lang): Scene {
  void lang;
  const sb = sceneBuilder();
  const A = metal(m), B = metal(c);
  const reacts = c === 'H' ? reactsWithAcid(m) : reducesCation(m, c);
  const eq = c === 'H' ? acidNet(m) : displacement(m, c);
  const nB = Math.min(4, eq ? eq.coefRed : 2), nA = Math.min(4, eq ? eq.coefOx : 1);
  const cationTex = (x: typeof A) => String.raw`\mathrm{${x.symbol}}^{${x.z === 1 ? '' : x.z}+}`;
  for (const side of [0, 1]) {
    const x0 = 14 + side * 196;
    beaker(sb, x0, 40, x0 + 176, 236, 62, 1, String(side));
    sb.shape({ key: `strip${side}`, kind: 'polygon', cls: 'cs-strip', pts: rect(x0 + 24, 50, x0 + 52, 224) });
    sb.label(`strip${side}-l`, [x0 + 38, 252], String.raw`\mathrm{${A.symbol}}(${A.liquid ? 'l' : 's'})`, INK.fg, 1);
    // ions in solution: before = cations of B; after = cations of A (if the reaction takes place) or the same as before
    const after = side === 1 && reacts;
    const ions = after ? nA : nB;
    const ion = after ? A : B;
    const kind = c === 'H' && !after ? 'H' : ion.symbol;
    for (let i = 0; i < (after ? Math.max(ions, 1) : ions); i++) {
      const p: P2 = [x0 + 90 + (i % 2) * 44, 100 + Math.floor(i / 2) * 44 + (i % 2) * 14];
      disc(sb, `ion${side}-${i}`, 'cs-ion-cat', p, 10); sign(sb, `ion${side}-${i}s`, p, true, 10);
    }
    sb.label(`ion${side}-l`, [x0 + 150, 252], kind === 'H' ? String.raw`\mathrm{H}^{+}` : cationTex(ion), INK.cat, 1);
    if (after) {
      if (c === 'H') for (let i = 0; i < 3; i++) disc(sb, `bub${i}`, 'cs-bubble', [x0 + 70 + i * 36, 150 - i * 30], 6 + i);
      else for (let i = 0; i < nB; i++) disc(sb, `dep${i}`, 'cs-aX', [x0 + 60, 70 + i * 36], 6);
    }
  }
  const p0: P2 = [194, 140], p1: P2 = [208, 140];
  sb.shape({ key: 'arrow', kind: 'line', cls: 'cs-pull', pts: [p0, p1] });
  sb.shape({ key: 'arrow-h', kind: 'polygon', cls: 'cs-pull-head', pts: arrowHead(p0, p1, 7) });
  sb.label('verdict', [304, 24], reacts ? String.raw`\text{${lang === 'de' ? 'Reaktion' : 'reaction'}}` : String.raw`\mathrm{NR}`, reacts ? INK.v : INK.e, 1);
  return sb.finish({ reacts: reacts ? 1 : 0, nB, nA });
}
