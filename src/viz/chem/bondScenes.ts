/**
 * Pure scenes of the bonding figures (lecture 7, exercise class 7): Lewis structures with optional electron bookkeeping,
 * the electron transfer Na → Cl (slide 7), two atoms sharing a pair (slide 9), the five rules for HCN (slide 17).
 * Shapes and KaTeX labels in viewBox units (cscene); every frame is unit-tested in bondScenes.test.ts.
 */
import type { Lang } from '../../i18n';
import {
  STRUCTS, bondsOf, electronDirs, electronsAround, en, formalCharge, oxidationNumber, type LStruct,
} from '../../chem/bonding';
import { ease, seg } from '../anim/geometry';
import type { P2 } from '../anim/geometry';
import { cbuilder, lerp, type CScene } from './cscene';

const t = String.raw;
export const ASSIGN_INK = ['p', 't', 'v', 'n', 's', 'e'] as const;
const sym = (el: string) => t`\mathrm{${el}}`;
/** Signed integer as TeX: +1, −2, 0. */
export const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `-${-n}` : '0');
const inkOf = (n: number) => (n > 0 ? 't' : n < 0 ? 'p' : 'muted');

export type Bookkeeping = 'none' | 'dots' | 'fc' | 'ox';
export interface LewisOpts {
  /** pixel length of one bond */
  unit?: number;
  /** draw the shared electrons as dots on the bonds and colour every electron by the atom it is assigned to */
  book?: Bookkeeping;
  /** number labels above the atoms: formal charges or oxidation numbers */
  numbers?: Bookkeeping;
  /** dashed ring around each atom with its electron count (octet check) */
  octet?: boolean;
  w?: number; h?: number;
}

/** Radius from the atom centre at which lone-pair dots sit, and the dot radius. */
export const LP_R = 17, DOT_R = 2.7, PAIR_GAP = 4.6;
const halfWidth = (el: string) => (el.length > 1 ? 15 : 11);

/** Centre the structure in a w × h frame. */
function layout(s: LStruct, unit: number, w: number, h: number) {
  const xs = s.atoms.map((a) => a.x), ys = s.atoms.map((a) => a.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  return s.atoms.map((a) => [w / 2 + (a.x - cx) * unit, h / 2 + (a.y - cy) * unit + 4] as P2);
}

/** A Lewis structure (slides 9–23): symbols, bonds as lines (or dots), lone pairs, unpaired electrons, brackets and charge. */
export function lewisScene(s: LStruct, opts: LewisOpts = {}): CScene {
  const unit = opts.unit ?? 74, w = opts.w ?? 360, h = opts.h ?? 210;
  const b = cbuilder(w, h);
  const P = layout(s, unit, w, h);
  const book = opts.book ?? 'none';
  const colour = book === 'fc' || book === 'ox';
  const assignInk = (i: number) => (colour ? ASSIGN_INK[i % ASSIGN_INK.length] : 'fg');
  const dotCls = (i: number) => (colour ? `bd-e bd-c${i % ASSIGN_INK.length}` : 'bd-e');
  let electrons = 0;
  // bonds
  s.bonds.forEach((bd, k) => {
    const A = P[bd.a], B = P[bd.b];
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L, nx = -uy, ny = ux;
    const sa = halfWidth(s.atoms[bd.a].el) + 2, sb = halfWidth(s.atoms[bd.b].el) + 2;
    const offs = bd.order === 1 ? [0] : bd.order === 2 ? [-3.6, 3.6] : [-6, 0, 6];
    offs.forEach((o, j) => {
      const a: P2 = [A[0] + ux * sa + nx * o, A[1] + uy * sa + ny * o], c: P2 = [B[0] - ux * sb + nx * o, B[1] - uy * sb + ny * o];
      if (book === 'none') b.line(`b${k}-${j}`, 'bd-bond', a, c);
      else {
        b.line(`b${k}-${j}`, 'bd-bond-faint', a, c);
        const m: P2 = [(A[0] + B[0]) / 2 + nx * o * 1.6, (A[1] + B[1]) / 2 + ny * o * 1.6];
        // who gets the two electrons of this pair
        let ia = bd.a, ib = bd.b;
        if (book === 'ox') {
          const d = en(s.atoms[bd.a].el) - en(s.atoms[bd.b].el);
          if (d > 1e-9) ib = bd.a; else if (d < -1e-9) ia = bd.b;
        }
        b.circle(`be${k}-${j}a`, dotCls(ia), [m[0] - ux * PAIR_GAP, m[1] - uy * PAIR_GAP], DOT_R);
        b.circle(`be${k}-${j}b`, dotCls(ib), [m[0] + ux * PAIR_GAP, m[1] + uy * PAIR_GAP], DOT_R);
      }
      electrons += 2;
    });
  });
  // atoms, lone pairs, unpaired electrons
  s.atoms.forEach((a, i) => {
    const [x, y] = P[i];
    b.label(`a${i}`, [x, y], sym(a.el), assignInk(i), 1, 'c');
    const dirs = electronDirs(s, i);
    dirs.forEach((deg, k) => {
      const r = (deg * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r);
      const R = LP_R + (a.el.length > 1 && Math.abs(ux) > 0.7 ? 4 : 0);
      const c: P2 = [x + ux * R, y + uy * R];
      if (k < a.lp) {
        b.circle(`lp${i}-${k}a`, dotCls(i), [c[0] - uy * PAIR_GAP, c[1] + ux * PAIR_GAP], DOT_R);
        b.circle(`lp${i}-${k}b`, dotCls(i), [c[0] + uy * PAIR_GAP, c[1] - ux * PAIR_GAP], DOT_R);
        electrons += 2;
      } else { b.circle(`rad${i}-${k}`, dotCls(i), c, DOT_R); electrons += 1; }
    });
    if (opts.octet) {
      const n = electronsAround(s, i), want = a.el === 'H' ? 2 : 8;
      b.circle(`ring${i}`, n === want ? 'bd-ring' : 'bd-ring bd-ring-off', [x, y], 27);
      b.label(`cnt${i}`, [x + 22, y + 24], String(n), n === want ? 'v' : 'e', 1, 'l', { small: true });
    }
    if (opts.numbers && opts.numbers !== 'none') {
      const v = opts.numbers === 'fc' ? formalCharge(s, i) : oxidationNumber(s, i);
      // the free direction farthest from bonds and electron pairs (up and down preferred, then the diagonals)
      const used = [...dirs, ...bondsOf(s, i).map((bd) => { const o = P[bd.a === i ? bd.b : bd.a]; return (Math.atan2(o[1] - y, o[0] - x) * 180) / Math.PI; })];
      const gap = (u: number, w: number) => Math.abs((((u - w) % 360) + 540) % 360 - 180);
      let best = 270, score = -1;
      for (const c of [270, 90, 315, 225, 45, 135, 0, 180]) { const sc = used.length ? Math.min(...used.map((d) => gap(c, d))) : 360; if (sc > score + 1e-9) { score = sc; best = c; } }
      const r = (best * Math.PI) / 180, R = best % 90 === 0 ? 31 : 30;
      b.label(`n${i}`, [x + Math.cos(r) * R * (best % 180 === 0 ? 1.15 : 1), y + Math.sin(r) * R], signed(v), inkOf(v), 1, 'c', { small: true });
    }
  });
  // brackets and charge of an ion
  if (s.charge !== 0) {
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    const x0 = Math.min(...xs) - 30, x1 = Math.max(...xs) + 30, y0 = Math.min(...ys) - 26, y1 = Math.max(...ys) + 26;
    b.shape('brL', 'polyline', 'bd-bracket', [[x0 + 6, y0], [x0, y0], [x0, y1], [x0 + 6, y1]]);
    b.shape('brR', 'polyline', 'bd-bracket', [[x1 - 6, y0], [x1, y0], [x1, y1], [x1 - 6, y1]]);
    b.label('charge', [x1 + 4, y0 + 2], s.charge === -1 ? '-' : s.charge === 1 ? '+' : `${Math.abs(s.charge)}${s.charge < 0 ? '-' : '+'}`, 'fg', 1, 'l', { small: true });
  }
  return b.finish({ electrons, atoms: s.atoms.length });
}

/* ================================================================ Na· + ·Cl: → Na⁺ [:Cl:]⁻ → NaCl(s)  (slide 7) */

export const NACL = { W: 520, H: 250 } as const;
const NA_R0 = 46, CL_R0 = 30, NA_R1 = 32, CL_R1 = 42; // drawn radii ∝ atomic / ionic radii (166, 102 → 116, 167 pm)
export const NACL_STEPS = 5;
/** 0 = atoms with valence electrons, 1 = the electron jumps, 2 = ions (size change, charges), 3 = attraction, 4 = lattice. */
export function naclScene(step: number, tt: number, lang: Lang): CScene {
  const b = cbuilder(NACL.W, NACL.H);
  const de = lang === 'de';
  const p = (i: number, a = 0, z = 1) => (step > i ? 1 : step === i ? ease(seg(tt, a, z)) : 0);
  const jump = p(1, 0.1, 0.85), ions = p(2, 0, 0.7), attract = p(3, 0, 0.8), lattice = p(4, 0, 0.9);
  const cy = 118;
  const naX = lerp(150, 206, attract), clX = lerp(370, 206 + NA_R1 + CL_R1 + 16, attract);
  const rNa = lerp(NA_R0, NA_R1, ions), rCl = lerp(CL_R0, CL_R1, ions);
  const fade = 1 - lattice;
  b.circle('na', 'bd-na', [naX, cy], rNa, fade + lattice * 0);
  b.circle('cl', 'bd-cl', [clX, cy], rCl, fade);
  b.label('naSym', [naX, cy], ions > 0.5 ? t`\mathrm{Na}^+` : t`\mathrm{Na}`, 'fg', fade);
  b.label('clSym', [clX, cy], ions > 0.5 ? t`\mathrm{Cl}^-` : t`\mathrm{Cl}`, 'fg', fade);
  // Cl: seven valence electrons on its rim (three pairs + one single at the left), Na: one at the right
  const rimCl = rCl + 7;
  const clDots: [number, number][] = [[90, 1], [270, 1], [0, 1]]; // pairs: bottom, top, right
  clDots.forEach(([deg], k) => {
    const r = (deg * Math.PI) / 180, c: P2 = [clX + Math.cos(r) * rimCl, cy + Math.sin(r) * rimCl];
    const nx = -Math.sin(r), ny = Math.cos(r);
    b.circle(`cle${k}a`, 'bd-e', [c[0] + nx * PAIR_GAP, c[1] + ny * PAIR_GAP], DOT_R + 0.4, fade);
    b.circle(`cle${k}b`, 'bd-e', [c[0] - nx * PAIR_GAP, c[1] - ny * PAIR_GAP], DOT_R + 0.4, fade);
  });
  const clLeft: P2 = [clX - rimCl, cy];
  b.circle('clSingle', 'bd-e', [clLeft[0], clLeft[1] - (jump > 0.98 ? PAIR_GAP : 0)], DOT_R + 0.4, fade);
  // the jumping electron: from Na's rim to Cl's free place, along an arc
  const start: P2 = [naX + NA_R0 + 7, cy], end: P2 = [clLeft[0], clLeft[1] + PAIR_GAP];
  const ex = lerp(start[0], end[0], jump), ey = lerp(start[1], end[1], jump) - Math.sin(Math.PI * jump) * 46;
  b.circle('jump', jump > 0 && jump < 1 ? 'bd-e-move' : 'bd-e', [ex, ey], DOT_R + 0.9, fade);
  if (step === 1 && jump > 0 && jump < 1) b.label('eLab', [ex, ey - 14], t`e^-`, 'e', 1, 'c', { small: true });
  // noble-gas configurations
  const cfg = ions * fade;
  b.label('naCfg', [naX, cy + 78], t`[\mathrm{Ne}]`, 'muted', cfg * (1 - attract), 'c', { small: true });
  b.label('clCfg', [clX, cy + 78], t`[\mathrm{Ar}]`, 'muted', cfg * (1 - attract), 'c', { small: true });
  // attraction arrows
  if (step === 3 || (step > 3 && lattice < 0.3)) {
    const o = Math.min(1 - Math.abs(attract - 0.5) * 1.2, 1) * fade;
    b.arrow('fNa', 'bd-a-pull', [naX - rNa - 26, cy - 58], [naX - rNa + 4, cy - 58], o);
    b.arrow('fCl', 'bd-a-pull', [clX + rCl + 26, cy - 58], [clX + rCl - 4, cy - 58], o);
    b.label('pull', [(naX + clX) / 2, cy - 76], de ? t`\text{Plus und Minus ziehen sich an}` : t`\text{opposite charges attract}`, 'fg', o, 'c', { small: true });
  }
  // lattice: alternating ions in a 6 × 3 block
  if (lattice > 0) {
    const r = 17, x0 = NACL.W / 2 - 5 * r * 1.06, y0 = cy - 2 * r * 1.06;
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) {
      const na = (i + j) % 2 === 0;
      const c: P2 = [x0 + i * 2.12 * r, y0 + j * 2.12 * r];
      b.circle(`l${i}-${j}`, na ? 'bd-na' : 'bd-cl', c, na ? r * 0.8 : r, lattice);
      b.label(`ll${i}-${j}`, c, na ? '+' : '-', 'fg', lattice, 'c', { small: true });
    }
    b.label('latName', [NACL.W / 2, cy + 82], t`\mathrm{Na^+Cl^-}(s)`, 'fg', lattice, 'c');
  }
  // step title on top
  const title = [
    de ? t`\mathrm{Na}\cdot\ +\ \cdot\mathrm{Cl}` : t`\mathrm{Na}\cdot\ +\ \cdot\mathrm{Cl}`,
    t`\mathrm{Na}\ \longrightarrow\ \mathrm{Na}^+ + e^-,\quad \mathrm{Cl} + e^-\ \longrightarrow\ \mathrm{Cl}^-`,
    t`\mathrm{Na}^+\ +\ [\mathrm{Cl}]^-`,
    t`\mathrm{Na}^+ \cdots \mathrm{Cl}^-`,
    de ? t`\text{Ionenkristall}` : t`\text{ionic crystal}`,
  ][Math.min(step, 4)];
  b.label('title', [NACL.W / 2, 18], title, 'muted', 1, 'c', { small: true });
  return b.finish({ step, jump, ions, attract, lattice, ex, ey, endX: end[0], endY: end[1] });
}

/* ================================================================ two atoms share a pair (slide 9, exercise 7 p. 4) */

export const COV = { W: 520, H: 240 } as const;
export type CovMol = 'H2' | 'Cl2';
export const COV_STEPS = 4;
/** 0 = two atoms with their single electrons, 1 = they approach, the clouds overlap, 2 = the pair is shared (octet rings), 3 = the pair as a line. */
export function covalentScene(mol: CovMol, step: number, tt: number, lang: Lang): CScene {
  const b = cbuilder(COV.W, COV.H);
  const de = lang === 'de';
  const p = (i: number, a = 0, z = 1) => (step > i ? 1 : step === i ? ease(seg(tt, a, z)) : 0);
  const near = p(1, 0, 0.8), share = p(2, 0, 0.7), line = p(3, 0, 0.7);
  const cy = 124, R = mol === 'H2' ? 34 : 40;
  const d = lerp(190, mol === 'H2' ? 64 : 84, near);
  const xa = COV.W / 2 - d / 2, xb = COV.W / 2 + d / 2;
  const el = mol === 'H2' ? 'H' : 'Cl';
  b.circle('cloudA', 'bd-cloud', [xa, cy], R);
  b.circle('cloudB', 'bd-cloud', [xb, cy], R);
  b.label('symA', [xa, cy], sym(el), 'fg');
  b.label('symB', [xb, cy], sym(el), 'fg');
  // the two electrons that become the shared pair
  const e0: P2 = [xa + 20, cy], e1: P2 = [xb - 20, cy];
  const mid = COV.W / 2;
  const pa: P2 = [lerp(e0[0], mid, share), lerp(e0[1], cy - PAIR_GAP * 1.2, share)];
  const pb: P2 = [lerp(e1[0], mid, share), lerp(e1[1], cy + PAIR_GAP * 1.2, share)];
  b.circle('ea', 'bd-e-move', pa, DOT_R + 0.6, 1 - line);
  b.circle('eb', 'bd-e-move', pb, DOT_R + 0.6, 1 - line);
  if (line > 0) b.line('bond', 'bd-bond', [xa + 13, cy], [xb - 13, cy], line);
  // Cl: three lone pairs each
  if (mol === 'Cl2') {
    [[xa, 180], [xa, 270], [xa, 90], [xb, 0], [xb, 270], [xb, 90]].forEach(([x, deg], k) => {
      const r = (deg * Math.PI) / 180, c: P2 = [x + Math.cos(r) * 20, cy + Math.sin(r) * 20];
      b.circle(`lp${k}a`, 'bd-e', [c[0] - Math.sin(r) * PAIR_GAP, c[1] + Math.cos(r) * PAIR_GAP], DOT_R);
      b.circle(`lp${k}b`, 'bd-e', [c[0] + Math.sin(r) * PAIR_GAP, c[1] - Math.cos(r) * PAIR_GAP], DOT_R);
    });
  }
  // octet / duet rings (exercise 7 p. 4: «each atom now has noble-gas configuration»)
  const ring = share * (1 - line * 0.6);
  const want = mol === 'H2' ? 2 : 8;
  b.circle('ringA', 'bd-ring', [xa, cy], R + 8, ring);
  b.circle('ringB', 'bd-ring', [xb, cy], R + 8, ring);
  b.label('cntA', [xa, cy + R + 24], de ? t`${want}\ e^-` : t`${want}\ e^-`, 'v', ring, 'c', { small: true });
  b.label('cntB', [xb, cy + R + 24], t`${want}\ e^-`, 'v', ring, 'c', { small: true });
  b.label('noble', [COV.W / 2, 22], mol === 'H2' ? (de ? t`\text{jedes H hat 2 Elektronen wie He}` : t`\text{each H has 2 electrons, like He}`) : (de ? t`\text{jedes Cl hat 8 Elektronen wie Ar}` : t`\text{each Cl has 8 electrons, like Ar}`), 'v', share, 'c', { small: true });
  if (line > 0.5) b.label('lineLab', [COV.W / 2, cy - (mol === 'H2' ? 52 : 62)], de ? t`\text{Bindungspaar} = \text{Strich}` : t`\text{bonding pair} = \text{line}`, 'muted', line, 'c', { small: true });
  return b.finish({ step, d, share, line, pairX: (pa[0] + pb[0]) / 2 });
}

/* ================================================================ the five rules, Ex: HCN (slide 17) */

export const HCN = { W: 520, H: 250 } as const;
export const HCN_STEPS = 6;
const HCN_POS: P2[] = [[150, 140], [260, 140], [370, 140]];
/** Electrons of HCN in the bank (top) and where they go. 0 = atoms, 1 = sum 1 + 4 + 5 = 10, 2 = single bonds, 3 = octet on N, 4 = none left (C has 4), 5 = triple bond. */
export function hcnScene(step: number, tt: number, lang: Lang): CScene {
  const b = cbuilder(HCN.W, HCN.H);
  const de = lang === 'de';
  const p = (i: number, a = 0, z = 1) => (step > i ? 1 : step === i ? ease(seg(tt, a, z)) : 0);
  const sumP = p(1, 0, 0.8), bondP = p(2, 0, 0.8), octP = p(3, 0, 0.8), checkP = p(4, 0, 0.6), tripleP = p(5, 0, 0.8);
  const [H, C, N] = HCN_POS;
  ['H', 'C', 'N'].forEach((el, i) => b.label(`s${i}`, HCN_POS[i], sym(el), 'fg'));
  // valence numbers under the atoms
  [1, 4, 5].forEach((v, i) => b.label(`v${i}`, [HCN_POS[i][0], 196], String(v), 'e', sumP * (1 - tripleP * 0.4), 'c', { small: true }));
  b.label('sum', [HCN.W / 2, 224], t`1 + 4 + 5 = 10\ \text{${de ? 'Valenzelektronen' : 'valence electrons'}}`, 'e', sumP, 'c', { small: true });
  // bank of 10 electrons at the top: used ones leave
  const used = Math.round(4 * bondP + 6 * octP);
  for (let k = 0; k < 10; k++) {
    const c: P2 = [HCN.W / 2 - 4.5 * 13 + k * 13, 34];
    b.circle(`bank${k}`, k < 10 - used ? 'bd-e-move' : 'bd-e-ghost', c, DOT_R + 0.6, sumP);
  }
  b.label('bankLab', [HCN.W / 2 + 80, 34], t`${10 - used}`, 'e', sumP, 'l', { small: true });
  // single bonds H–C, C–N (each takes 2 electrons)
  b.line('hc', 'bd-bond', [H[0] + 13, H[1]], [C[0] - 13, C[1]], bondP);
  b.line('cn', 'bd-bond', [C[0] + 13, C[1]], [N[0] - 13, N[1]], bondP);
  // lone pairs on N: three after rule 3; two of them move into the C–N bond at rule 5
  const lpDeg = [0, 270, 90];
  lpDeg.forEach((deg, k) => {
    const r = (deg * Math.PI) / 180;
    let c: P2 = [N[0] + Math.cos(r) * LP_R, N[1] + Math.sin(r) * LP_R];
    let o = octP;
    if (k > 0) { // top and bottom pairs become the 2nd and 3rd bond
      const target: P2 = [(C[0] + N[0]) / 2, C[1] + (k === 1 ? -6 : 6)];
      c = [lerp(c[0], target[0], tripleP), lerp(c[1], target[1], tripleP)];
      o = octP * (1 - Math.max(0, tripleP - 0.85) / 0.15);
    }
    const nx = -Math.sin(r), ny = Math.cos(r);
    b.circle(`lp${k}a`, 'bd-e', [c[0] + nx * PAIR_GAP, c[1] + ny * PAIR_GAP], DOT_R, o);
    b.circle(`lp${k}b`, 'bd-e', [c[0] - nx * PAIR_GAP, c[1] - ny * PAIR_GAP], DOT_R, o);
  });
  if (tripleP > 0.85) {
    const o = (tripleP - 0.85) / 0.15;
    b.line('cn2', 'bd-bond', [C[0] + 13, C[1] - 6], [N[0] - 13, N[1] - 6], o);
    b.line('cn3', 'bd-bond', [C[0] + 13, C[1] + 6], [N[0] - 13, N[1] + 6], o);
  }
  // electron counts around C (and N) at rules 4 and 5
  const cCount = tripleP > 0.85 ? 8 : 4;
  const ringO = checkP;
  b.circle('ringC', cCount === 8 ? 'bd-ring' : 'bd-ring bd-ring-off', C, 30, ringO);
  b.label('cntC', [C[0], C[1] - 44], t`\mathrm{C}{:}\ ${cCount}\ e^-`, cCount === 8 ? 'v' : 'e', ringO, 'c', { small: true });
  b.circle('ringN', 'bd-ring', N, 30, step >= 5 ? tripleP : 0);
  b.label('cntN', [N[0], N[1] - 44], t`\mathrm{N}{:}\ 8\ e^-`, 'v', step >= 5 ? tripleP : 0, 'c', { small: true });
  b.label('cntH', [H[0], H[1] - 44], t`\mathrm{H}{:}\ 2\ e^-`, 'v', step >= 5 ? tripleP : 0, 'c', { small: true });
  return b.finish({ step, used, cCount, triple: tripleP > 0.99 ? 1 : 0 });
}

/** The structures available in the Lewis figures (re-exported for the components). */
export { STRUCTS };
