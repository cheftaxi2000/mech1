/**
 * Pure scenes of the lesson «Atome, Elemente und das Periodensystem» (lecture 1, slides 10–24). 400 × 300 viewBox.
 *  zoomScene      slide 14: how big are the electron cloud and the nucleus?
 *  atomScene      slides 15–16, 21: nucleus (p, n) and electron cloud of ^A_Z X^q
 *  isoScene       slide 17: isotope masses and abundances, weighted mean = atomic weight
 *  boxesScene     exercise 1, ex. 7: six particle pictures
 *  molScene       slide 20: structural formula, ball-and-stick, space-filling
 *  ionicScene     slide 22: charge balance, Mg²⁺ + N³⁻ → Mg₃N₂
 */
import { fmtNum, type Lang } from '../../i18n';
import { chemTex } from '../../chem/tex';
import { ISOTOPES, atomicWeight, counts } from '../../chem/atoms';
import { ionicFormula, ionStr, type Ion } from '../../chem/ions';
import { cellByZ } from '../../chem/periodic';
import { sceneBuilder, type Scene } from '../anim/scene';
import type { P2 } from '../anim/geometry';
import { disc, rect, sign, INK, rng } from './sceneKit';

// ---------------------------------------------------------------- zoom (slide 14)
export const CLOUD_R_M = 1.5e-10, NUC_R_M = 0.5e-14;
/** Field of view 10^k metres across the whole picture: radii in pixels. */
export function zoomRadii(k: number): { cloud: number; nucleus: number } {
  const px = 400 / 10 ** k;
  return { cloud: CLOUD_R_M * px, nucleus: NUC_R_M * px };
}
export function zoomScene(k: number): Scene {
  const sb = sceneBuilder();
  const r = zoomRadii(k);
  const c: P2 = [200, 130];
  const cloud = Math.min(r.cloud, 900);
  if (r.cloud > 3) sb.shape({ key: 'cloud', kind: 'circle', cls: 'cs-cloud', pts: [c], r: cloud, o: 1 });
  else disc(sb, 'cloud', 'cs-cloud', c, Math.max(r.cloud, 3));
  const nr = Math.max(r.nucleus, 1.5);
  disc(sb, 'nucleus', 'cs-nucleus', c, Math.min(nr, 900));
  if (r.nucleus < 4) sb.shape({ key: 'nuc-ring', kind: 'circle', cls: 'cs-dash', pts: [c], r: 10 });
  // the picture is 10^k metres wide
  sb.shape({ key: 'bar', kind: 'line', cls: 'cs-link', pts: [[8, 272], [392, 272]] });
  sb.shape({ key: 'bar-l', kind: 'line', cls: 'cs-link', pts: [[8, 264], [8, 280]] });
  sb.shape({ key: 'bar-r', kind: 'line', cls: 'cs-link', pts: [[392, 264], [392, 280]] });
  sb.label('bar-t', [200, 286], String.raw`10^{${k.toFixed(1).replace('-', '−')}}\,\mathrm{m}`, INK.fg, 1);
  return sb.finish({ cloud: r.cloud, nucleus: r.nucleus, k });
}

// ---------------------------------------------------------------- atom (slides 15, 16, 21)
export interface AtomSpec { Z: number; N: number; q: number }
const R_NUC = 4.6;
export function nucleonPositions(n: number): P2[] {
  const out: P2[] = [];
  for (let i = 0; i < n; i++) { const a = i * 2.39996323, r = 1.9 * R_NUC * Math.sqrt(i + 0.5); out.push([Math.cos(a) * r, Math.sin(a) * r]); }
  return out;
}
export function electronPositions(n: number, q: number): P2[] {
  const out: P2[] = [];
  const rc = cloudRadius(q);
  for (let i = 0; i < n; i++) { const a = i * 2.39996323 + 0.7, r = rc * (0.55 + 0.4 * ((i * 0.618) % 1)); out.push([Math.cos(a) * r, Math.sin(a) * r]); }
  return out;
}
export const cloudRadius = (q: number) => 76 - 7 * Math.max(-3, Math.min(3, q));

export function atomScene({ Z, N, q }: AtomSpec): Scene {
  const sb = sceneBuilder();
  const cnt = counts(Z, Z + N, q);
  const c: P2 = [200, 128];
  const rc = cloudRadius(q);
  disc(sb, 'cloud', q > 0 ? 'cs-cloud-cat' : q < 0 ? 'cs-cloud-an' : 'cs-cloud', c, rc);
  electronPositions(cnt.electrons, q).forEach((p, i) => disc(sb, `e${i}`, 'cs-electron', [c[0] + p[0], c[1] + p[1]], 4.2));
  const nuc = nucleonPositions(Z + N);
  // protons and neutrons mixed in a fixed pattern
  const rand = rng(Z * 131 + N);
  const order = Array.from({ length: Z + N }, (_, i) => i).sort(() => rand() - 0.5);
  nuc.forEach((p, i) => disc(sb, `n${i}`, order[i] < Z ? 'cs-proton' : 'cs-neutron', [c[0] + p[0], c[1] + p[1]], R_NUC));
  const sym = cellByZ(Z)!.symbol;
  sb.label('notation', [60, 262], String.raw`{}^{${Z + N}}_{${Z}}\mathrm{${sym}}${q === 0 ? '' : `^{${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '−'}}`}`, INK.fg, 1, 'l', { box: true });
  sb.label('rows', [372, 262], '', INK.fg, 1, 'r', { rows: [
    { tex: String.raw`${cnt.protons}\,\mathrm{p}^{+}\ \cdot\ ${cnt.neutrons}\,\mathrm{n}`, ink: INK.cat },
    { tex: String.raw`${cnt.electrons}\,\mathrm{e}^{-}`, ink: INK.el }] });
  return sb.finish({ p: cnt.protons, n: cnt.neutrons, e: cnt.electrons, A: cnt.massNumber, q });
}

// ---------------------------------------------------------------- isotopes (slide 17)
export function isoScene(symbol: string, heavyPct: number | null, lang: Lang): Scene {
  const sb = sceneBuilder();
  const iso = ISOTOPES[symbol];
  const ab = heavyPct === null ? iso.map((i) => i.abundance) : [1 - heavyPct / 100, heavyPct / 100];
  const mean = atomicWeight(iso, ab);
  const lo = iso[0].mass - 1.2, hi = iso[iso.length - 1].mass + 1.2;
  const X = (m: number) => 30 + ((m - lo) / (hi - lo)) * 340;
  const base = 215, top = 62;
  sb.shape({ key: 'axis', kind: 'line', cls: 'cs-link', pts: [[22, base], [378, base]] });
  iso.forEach((i, k) => {
    const h = Math.max(1.5, ab[k] * (base - top));
    const x = X(i.mass);
    sb.shape({ key: `bar${k}`, kind: 'polygon', cls: 'cs-bar-iso', pts: rect(x - 15, base - h, x + 15, base) });
    sb.label(`pct${k}`, [x, base - h - 12], String.raw`${fmtNum(ab[k] * 100, ab[k] < 0.1 ? 2 : 1, lang, true)}\,\%`, INK.fg, 1);
    sb.label(`nm${k}`, [x, base + 18], String.raw`{}^{${i.A}}\mathrm{${symbol}}`, INK.fg, 1);
    sb.label(`ms${k}`, [x, base + 40], String.raw`${fmtNum(i.mass, 3, lang, true)}\,\mathrm{u}`, INK.muted, 1);
  });
  const xm = X(mean);
  sb.shape({ key: 'mean', kind: 'line', cls: 'cs-mean', pts: [[xm, top - 10], [xm, base]] });
  sb.label('mean-l', [Math.min(Math.max(xm, 90), 310), 30], String.raw`\bar{m}=${fmtNum(mean, 3, lang, true)}\,\mathrm{u}`, INK.e, 1, 'c', { box: true });
  return sb.finish({ mean, xm });
}

// ---------------------------------------------------------------- six boxes (exercise 1, example 7)
export type Sp = 'A' | 'B' | 'A2' | 'AB';
export const BOXES: Sp[][] = [
  ['A2', 'A2', 'A2', 'A2'],
  ['A2', 'A2', 'A2', 'AB', 'AB'],
  ['A', 'A', 'A', 'AB', 'AB', 'AB'],
  ['AB', 'AB', 'AB', 'AB'],
  ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'],
  ['A', 'A', 'A', 'B', 'B', 'B'],
];
export type Cat = 'a' | 'b' | 'c' | 'd';
const isElemental = (s: Sp) => s !== 'AB';
/** (a) pure element, (b) mixture of two elements, (c) pure compound, (d) mixture of an element and a compound. */
export function classify(box: Sp[]): Cat[] {
  const kinds = [...new Set(box)];
  const out: Cat[] = [];
  if (kinds.length === 1 && isElemental(kinds[0])) out.push('a');
  if (kinds.length >= 2 && kinds.every(isElemental)) out.push('b');
  if (kinds.length === 1 && kinds[0] === 'AB') out.push('c');
  if (kinds.includes('AB') && kinds.some(isElemental)) out.push('d');
  return out;
}
export function boxesScene(sel: Cat | null): Scene {
  const sb = sceneBuilder();
  BOXES.forEach((box, b) => {
    const x0 = 14 + (b % 3) * 128, y0 = 22 + Math.floor(b / 3) * 128;
    const on = sel === null || classify(box).includes(sel);
    const o = on ? 1 : 0.28;
    sb.shape({ key: `box${b}`, kind: 'polygon', cls: sel !== null && on ? 'cs-box cs-box-sel' : 'cs-box', pts: rect(x0, y0, x0 + 118, y0 + 110), o: 1 });
    const rand = rng(40 + b);
    const placed: P2[] = [];
    box.forEach((sp, i) => {
      let p: P2 = [0, 0];
      for (let n = 0; n < 200; n++) { p = [x0 + 22 + rand() * 74, y0 + 26 + rand() * 66]; if (placed.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 27)) break; }
      placed.push(p);
      const atom = (k: string, c: P2, cls: string) => disc(sb, `b${b}-${i}${k}`, cls, c, 8, o);
      if (sp === 'A') atom('', p, 'cs-atomA');
      else if (sp === 'B') atom('', p, 'cs-atomB');
      else if (sp === 'A2') { atom('a', [p[0] - 7, p[1]], 'cs-atomA'); atom('b', [p[0] + 7, p[1]], 'cs-atomA'); }
      else { atom('a', [p[0] - 7, p[1]], 'cs-atomA'); atom('b', [p[0] + 7, p[1]], 'cs-atomB'); }
    });
    sb.label(`no${b}`, [x0 + 9, y0 + 11], String(b + 1), INK.fg, 1, 'tl');
  });
  return sb.finish({ sel: sel === null ? -1 : sel.charCodeAt(0) });
}

// ---------------------------------------------------------------- molecules (slide 20)
export type Rep = 'structural' | 'ballstick' | 'space';
interface Atom { s: 'H' | 'C' | 'O'; p: [number, number, number] }
interface Mol { tex: string; atoms: Atom[]; bonds: [number, number, number][]; flat?: P2[] }
const T = 1.09 / Math.sqrt(3);
export const MOLS: Record<string, Mol> = {
  H2: { tex: 'H2', atoms: [{ s: 'H', p: [-0.5, 0, 0] }, { s: 'H', p: [0.5, 0, 0] }], bonds: [[0, 1, 1]] },
  O2: { tex: 'O2', atoms: [{ s: 'O', p: [-0.6, 0, 0] }, { s: 'O', p: [0.6, 0, 0] }], bonds: [[0, 1, 2]] },
  CO2: { tex: 'CO2', atoms: [{ s: 'O', p: [-1.16, 0, 0] }, { s: 'C', p: [0, 0, 0] }, { s: 'O', p: [1.16, 0, 0] }], bonds: [[0, 1, 2], [1, 2, 2]] },
  H2O: { tex: 'H2O', atoms: [{ s: 'O', p: [0, -0.3, 0] }, { s: 'H', p: [-0.76, 0.3, 0] }, { s: 'H', p: [0.76, 0.3, 0] }], bonds: [[0, 1, 1], [0, 2, 1]] },
  H2O2: { tex: 'H2O2', atoms: [{ s: 'O', p: [-0.74, 0, 0] }, { s: 'O', p: [0.74, 0, 0] }, { s: 'H', p: [-1.1, 0.85, 0.3] }, { s: 'H', p: [1.1, -0.85, -0.3] }], bonds: [[0, 1, 1], [0, 2, 1], [1, 3, 1]] },
  CH4: { tex: 'CH4', atoms: [{ s: 'C', p: [0, 0, 0] }, { s: 'H', p: [0, 1.09, 0.1] }, { s: 'H', p: [-0.95, -0.4, 0.2] }, { s: 'H', p: [0.95, -0.4, 0.2] }, { s: 'H', p: [0.1, -1.0, 0.95] }], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
    flat: [[0, 0], [0, -1.1], [-1.1, 0], [1.1, 0], [0, 1.1]] },
};
void T;
const VDW = { H: 1.2, C: 1.7, O: 1.52 }, COVR = { H: 0.32, C: 0.5, O: 0.48 };
export function molScene(name: string, rep: Rep): Scene {
  const sb = sceneBuilder();
  const m = MOLS[name];
  const c: P2 = [200, 128];
  const scale = rep === 'space' ? 54 : 62;
  const pos = (i: number): P2 => {
    const f = rep === 'structural' && m.flat ? m.flat[i] : [m.atoms[i].p[0], -m.atoms[i].p[1]];
    return [c[0] + f[0] * scale * (rep === 'structural' ? 0.95 : 1), c[1] + f[1] * scale * (rep === 'structural' ? 0.95 : 1)];
  };
  const order = m.atoms.map((_, i) => i).sort((a, b) => m.atoms[a].p[2] - m.atoms[b].p[2]);
  const cls = { H: 'cs-aH', C: 'cs-aC', O: 'cs-aO' };
  const symInk = (s: string) => (s === 'H' ? INK.fg : INK.fg);
  // bonds
  m.bonds.forEach(([a, b, n], k) => {
    const pa = pos(a), pb = pos(b);
    const dx = pb[0] - pa[0], dy = pb[1] - pa[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const gap = rep === 'structural' ? 15 : 0;
    const off = n === 2 ? 3.2 : 0;
    for (let j = 0; j < n; j++) {
      const o = n === 2 ? (j === 0 ? -off : off) : 0;
      sb.shape({ key: `bond${k}-${j}`, kind: 'line', cls: rep === 'structural' ? 'cs-link' : 'cs-stick', pts: [[pa[0] + ux * gap - uy * o, pa[1] + uy * gap + ux * o], [pb[0] - ux * gap - uy * o, pb[1] - uy * gap + ux * o]], o: rep === 'space' ? 0 : 1 });
    }
  });
  if (rep !== 'structural') {
    for (const i of order) {
      const a = m.atoms[i];
      const r = rep === 'space' ? VDW[a.s] * scale * 0.78 : COVR[a.s] * scale * 0.82 + 5;
      disc(sb, `a${i}`, cls[a.s], pos(i), r);
    }
  }
  for (const i of order) sb.label(`sym${i}`, pos(i), chemTex(m.atoms[i].s), symInk(m.atoms[i].s), 1);
  sb.label('formula', [200, 262], chemTex(m.tex), INK.fg, 1, 'c', { box: true });
  return sb.finish({ atoms: m.atoms.length });
}

// ---------------------------------------------------------------- ionic compound (slide 22)
export function ionicScene(cat: Ion, an: Ion): Scene {
  const sb = sceneBuilder();
  const { formula, nCation, nAnion } = ionicFormula(cat, an);
  const row = (n: number, y: number, ion: Ion, key: string) => {
    const r = ion.z > 0 ? 17 : 20;
    for (let i = 0; i < n; i++) {
      const p: P2 = [110 + (i - (n - 1) / 2) * 52, y];
      disc(sb, `${key}${i}`, ion.z > 0 ? 'cs-ion-cat' : 'cs-ion-an', p, r);
      sign(sb, `${key}${i}s`, p, ion.z > 0, r);
    }
    const tot = n * ion.z;
    sb.label(`${key}-sum`, [388, y], String.raw`${n}\cdot(${ion.z > 0 ? '+' : '−'}${Math.abs(ion.z)})=${tot > 0 ? '+' : '−'}${Math.abs(tot)}`, ion.z > 0 ? INK.cat : INK.an, 1, 'r');
    sb.label(`${key}-name`, [14, y - 36], chemTex(ionStr(ion)), ion.z > 0 ? INK.cat : INK.an, 1, 'l');
  };
  row(nCation, 100, cat, 'c');
  row(nAnion, 192, an, 'a');
  sb.label('formula', [200, 262], chemTex(formula), INK.fg, 1, 'c', { box: true });
  return sb.finish({ nCation, nAnion, charge: nCation * cat.z + nAnion * an.z });
}
