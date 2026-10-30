/**
 * Pure 3D scenes of the VSEPR figures (lecture 7, slides 26–32): a central atom with bonded atoms and lone-pair lobes,
 * projected orthographically after a rotation (yaw about the vertical axis, then pitch). Items are painted back to front.
 * - `moleculeScene`: one shape (explorer).
 * - `removeScene`: slide 27 «by removing atoms we obtain other possible shapes» (tetrahedral → trigonal pyramidal → bent).
 * - `processScene`: slide 31 «Process» for NH3 (Lewis structure → count domains → electron-domain geometry → molecular geometry).
 */
import type { Lang } from '../../i18n';
import { DIRS, GEOM_NAME, rotate, shape, type Domains, type GeomId, type Shape, type V3 } from '../../chem/vsepr';
import { ease, seg } from '../anim/geometry';
import type { P2 } from '../anim/geometry';
import { cbuilder, lerp, type CScene } from './cscene';

const t = String.raw;
export const VS = { W: 420, H: 330, L: 108, RC: 22, RA: 16 } as const;
export interface ViewAng { yaw: number; pitch: number }
export const VIEW0: ViewAng = { yaw: 0.45, pitch: 0.32 };

type Item = { z: number; draw: () => void };
const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const mix = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

/** Ellipse polygon for a lone-pair lobe along the projected direction (px, py) of length len. */
function lobe(c: P2, px: number, py: number, len: number, wid: number): P2[] {
  const l = Math.hypot(px, py);
  const ux = l > 1e-6 ? px / l : 0, uy = l > 1e-6 ? py / l : -1;
  const a = Math.max(wid, len / 2), mx = c[0] + ux * a * 0.95, my = c[1] + uy * a * 0.95;
  return Array.from({ length: 28 }, (_, i) => {
    const th = (i / 28) * 2 * Math.PI, ca = Math.cos(th) * a, sb = Math.sin(th) * wid;
    return [mx + ux * ca - uy * sb, my + uy * ca + ux * sb] as P2;
  });
}

export interface DrawOpts {
  view: ViewAng;
  /** per domain: 'atom' | 'pair' | 'none', with an opacity */
  domains: { dir: V3; kind: 'atom' | 'pair'; o: number; tag?: string }[];
  /** dashed outline through the tips of all domain positions (the electron-domain polyhedron) */
  ghost?: { dirs: V3[]; o: number };
  /** angle arc between two bonds, with a label */
  arc?: { a: V3; b: V3; tex: string; o: number };
  cx?: number; cy?: number; scale?: number;
}

/** Draws a central atom with its domains into a builder. Returns the screen positions of the domain tips. */
export function drawMolecule(b: ReturnType<typeof cbuilder>, o: DrawOpts): P2[] {
  const cx = o.cx ?? VS.W / 2, cy = o.cy ?? VS.H / 2 + 6, s = o.scale ?? 1;
  const L = VS.L * s;
  const proj = (v: V3): { p: P2; z: number } => { const r = rotate(v, o.view.yaw, o.view.pitch); return { p: [cx + r[0] * L, cy - r[1] * L], z: r[2] }; };
  const items: Item[] = [];
  const tips: P2[] = [];
  o.domains.forEach((d, i) => {
    const { p, z } = proj(d.dir);
    tips.push(p);
    if (d.o <= 0.01) return;
    if (d.kind === 'atom') {
      items.push({ z: z / 2 - 0.001, draw: () => b.line(`st${i}`, 'vs-stick', [cx, cy], p, d.o) });
      items.push({ z, draw: () => {
        b.circle(`at${i}`, z < -0.2 ? 'vs-outer vs-far' : 'vs-outer', p, VS.RA * s * (1 + 0.1 * z), d.o);
        if (d.tag) b.label(`tag${i}`, p, d.tag, 'fg', d.o, 'c', { small: true });
      } });
    } else {
      const r = rotate(d.dir, o.view.yaw, o.view.pitch);
      // lobes start inside the central atom: always paint them behind it
      items.push({ z: Math.min(z * 0.6, -0.02), draw: () => b.shape(`lp${i}`, 'polygon', z < -0.2 ? 'vs-lobe vs-far' : 'vs-lobe', lobe([cx, cy], r[0] * L * 0.86, -r[1] * L * 0.86, L * 0.86 * Math.hypot(r[0], r[1]), 15 * s), d.o) });
      items.push({ z: Math.min(z * 0.6, -0.02) + 0.001, draw: () => {
        const q: P2 = [cx + r[0] * L * 0.6, cy - r[1] * L * 0.6];
        b.circle(`lpe${i}a`, 'vs-e', [q[0] - 3.4, q[1]], 2.4, d.o);
        b.circle(`lpe${i}b`, 'vs-e', [q[0] + 3.4, q[1]], 2.4, d.o);
      } });
    }
  });
  items.push({ z: 0, draw: () => b.circle('center', 'vs-center', [cx, cy], VS.RC * s) });
  if (o.ghost && o.ghost.o > 0.01) {
    const g = o.ghost.dirs.map((v) => proj(v).p);
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      const ang = Math.acos(Math.max(-1, Math.min(1, o.ghost.dirs[i][0] * o.ghost.dirs[j][0] + o.ghost.dirs[i][1] * o.ghost.dirs[j][1] + o.ghost.dirs[i][2] * o.ghost.dirs[j][2])));
      if (ang < 2.6) b.line(`gh${i}-${j}`, 'vs-ghost', g[i], g[j], o.ghost.o); // edges of the polyhedron (not the long diagonals)
    }
  }
  items.sort((a, c) => a.z - c.z).forEach((it) => it.draw());
  if (o.arc && o.arc.o > 0.01) {
    const pts: P2[] = [];
    for (let k = 0; k <= 16; k++) pts.push(proj(norm(mix(o.arc.a, o.arc.b, k / 16))).p);
    const rr = 0.42;
    const arcPts = pts.map((p) => [cx + (p[0] - cx) * rr, cy + (p[1] - cy) * rr] as P2);
    b.shape('arc', 'polyline', 'vs-arc', arcPts, o.arc.o);
    const m = arcPts[8];
    b.label('arcLab', [cx + (m[0] - cx) * 1.75, cy + (m[1] - cy) * 1.75], o.arc.tex, 'n', o.arc.o, 'c', { small: true });
  }
  return tips;
}

/** Ideal angle between the first two bonds that are closest (for the arc label). */
function arcFor(sh: Shape, lang: Lang): { a: V3; b: V3; tex: string } | undefined {
  if (sh.bonds.length < 2) return undefined;
  let best: [V3, V3, number] | null = null;
  for (let i = 0; i < sh.bonds.length; i++) for (let j = i + 1; j < sh.bonds.length; j++) {
    const a = sh.bonds[i], c = sh.bonds[j];
    const ang = (Math.acos(Math.max(-1, Math.min(1, a[0] * c[0] + a[1] * c[1] + a[2] * c[2]))) * 180) / Math.PI;
    if (!best || ang < best[2] - 0.01) best = [a, c, ang];
  }
  const ang = Math.round(best![2] * 10) / 10;
  return { a: best![0], b: best![1], tex: t`${String(ang).replace('.', lang === 'de' ? '{,}' : '.')}^\circ` };
}

export function moleculeScene(n: Domains, lp: number, view: ViewAng, showGhost: boolean, showArc: boolean, lang: Lang = 'de'): CScene {
  const b = cbuilder(VS.W, VS.H);
  const sh = shape(n, lp);
  const dirs = DIRS[n];
  const pairSet = new Set(sh.pairs.map((p) => p.join(',')));
  drawMolecule(b, {
    view,
    domains: dirs.map((d) => ({ dir: d, kind: pairSet.has(d.join(',')) ? 'pair' : 'atom', o: 1 })),
    ghost: showGhost && n > 2 ? { dirs, o: 0.8 } : undefined,
    arc: showArc ? (() => { const a = arcFor(sh, lang); return a ? { ...a, o: 1 } : undefined; })() : undefined,
  });
  return b.finish({ n, lp, atoms: sh.bonds.length, pairs: sh.pairs.length });
}

const name = (g: GeomId, lang: Lang) => GEOM_NAME[g][lang === 'de' ? 0 : 1];

/* ---------------------------------------------------------------- slide 27: removing atoms */
export const REMOVE_STEPS = 3;
export function removeScene(step: number, tt: number, lang: Lang): CScene {
  const b = cbuilder(VS.W, VS.H);
  const p = (i: number) => (step > i ? 1 : step === i ? ease(seg(tt, 0.1, 0.9)) : 0);
  const r1 = p(1), r2 = p(2);
  const dirs = DIRS[4];
  // slot 0 (top) goes first, then slot 2 (back): exactly the lone-pair slots of vsepr.ts
  const dom = dirs.map((d, i) => {
    const k = i === 0 ? r1 : i === 2 ? r2 : 0;
    return [{ dir: d, kind: 'atom' as const, o: 1 - k }, { dir: d, kind: 'pair' as const, o: k }];
  }).flat();
  drawMolecule(b, { view: { yaw: 0.5, pitch: 0.26 }, domains: dom, ghost: { dirs, o: 0.55 } });
  const g: GeomId = step === 0 ? 'tetrahedral' : step === 1 ? 'trigonal-pyramidal' : 'bent';
  b.label('name', [VS.W / 2, VS.H - 18], t`\text{${name(g, lang)}}`, 'fg', 1, 'c');
  b.label('count', [16, 18], lang === 'de' ? t`\text{${4 - step} Atome, ${step} freie Paare}` : t`\text{${4 - step} atoms, ${step} lone pair${step === 1 ? '' : 's'}}`, 'muted', 1, 'tl', { small: true });
  return b.finish({ step, atoms: 4 - Math.round(r1) - Math.round(r2), pairs: Math.round(r1) + Math.round(r2) });
}

/* ---------------------------------------------------------------- slide 31: the process for NH3 */
export const PROCESS_STEPS = 4;
/** Flat Lewis layout of NH3 as on the slide (H–N–H with one H below, lone pair on top), in the 3D frame (z = 0). */
const FLAT: V3[] = [[0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]];
export function processScene(step: number, tt: number, lang: Lang): CScene {
  const b = cbuilder(VS.W, VS.H);
  const p = (i: number, a = 0.05, z = 0.9) => (step > i ? 1 : step === i ? ease(seg(tt, a, z)) : 0);
  const count = p(1, 0, 0.6), fold = p(2), hide = p(3, 0.1, 0.8);
  const tet = DIRS[4];
  // fold the flat drawing into the tetrahedron: top = lone pair, the three H go to the lower corners
  const order = [0, 1, 2, 3];
  const dirs = order.map((i) => norm(mix(FLAT[i], tet[i], fold)));
  const view = { yaw: lerp(0, 0.5, fold), pitch: lerp(0, 0.26, fold) };
  const tips = drawMolecule(b, {
    view,
    domains: [
      { dir: dirs[0], kind: 'pair', o: 1 - hide * 0.85 },
      { dir: dirs[1], kind: 'atom', o: 1, tag: t`\mathrm{H}` },
      { dir: dirs[2], kind: 'atom', o: 1, tag: t`\mathrm{H}` },
      { dir: dirs[3], kind: 'atom', o: 1, tag: t`\mathrm{H}` },
    ],
    ghost: { dirs, o: fold * (1 - hide) * 0.7 },
  });
  b.label('N', [VS.W / 2, VS.H / 2 + 6], t`\mathrm{N}`, 'fg');
  // step 1: number the four domains
  tips.forEach((q, i) => {
    const c: P2 = i === 0 ? [q[0] + 20, q[1] + 10] : [lerp(VS.W / 2, q[0], 1.34), lerp(VS.H / 2 + 6, q[1], 1.34)];
    b.label(`num${i}`, c, String(i + 1), 'n', count * (1 - fold), 'c', { small: true });
  });
  // the pyramid of the atoms (step 3)
  if (hide > 0) {
    const [a, c, d] = [tips[1], tips[2], tips[3]];
    b.shape('base', 'polygon', 'vs-base', [a, c, d], hide * 0.9);
  }
  const lines = [
    lang === 'de' ? t`1.\ \text{Lewis-Struktur}` : t`1.\ \text{Lewis structure}`,
    lang === 'de' ? t`2.\ \text{4 Elektronendomänen: 3 Bindungen} + 1\ \text{freies Paar}` : t`2.\ \text{4 electron domains: 3 bonds} + 1\ \text{lone pair}`,
    lang === 'de' ? t`3.\ \text{Elektronendomänen-Geometrie: tetraedrisch}` : t`3.\ \text{electron-domain geometry: tetrahedral}`,
    lang === 'de' ? t`4.\ \text{Molekülgeometrie: trigonal-pyramidal}` : t`4.\ \text{molecular geometry: trigonal pyramidal}`,
  ];
  b.label('stepLab', [VS.W / 2, 16], lines[Math.min(step, 3)], 'fg', 1, 'c', { small: true });
  return b.finish({ step, fold, hide });
}
