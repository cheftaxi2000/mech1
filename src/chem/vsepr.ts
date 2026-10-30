/**
 * Molecular shapes and the VSEPR model (lecture 7, slides 26–32; exercise class 7 p. 13).
 * Electron domains = bonds or lone pairs around the central atom (a multiple bond is one domain). They move as far apart
 * as possible: 2 → linear, 3 → trigonal planar, 4 → tetrahedral, 5 → trigonal bipyramidal, 6 → octahedral.
 * Lone pairs sit where they have the most room (slide 32): the equatorial positions of the bipyramid, and opposite
 * each other in the octahedron. Molecular geometry = the positions of the atoms only.
 *
 * Coordinates: x right, y up, z towards the viewer (right-handed), unit vectors.
 */
export type V3 = [number, number, number];
export type Domains = 2 | 3 | 4 | 5 | 6;

const r3 = Math.sqrt(3) / 2;
const tet = (az: number): V3 => { const s = Math.sqrt(8) / 3; return [s * Math.sin(az), -1 / 3, s * Math.cos(az)]; };
const eq = (az: number): V3 => [Math.sin(az), 0, Math.cos(az)];

/** Positions of the electron domains; the order matters: lone pairs take the first `lpSlots` entries. */
export const DIRS: Record<Domains, V3[]> = {
  2: [[1, 0, 0], [-1, 0, 0]],
  3: [[0, 1, 0], [-r3, -0.5, 0], [r3, -0.5, 0]],
  4: [[0, 1, 0], tet(Math.PI / 3), tet(Math.PI), tet(-Math.PI / 3)],
  5: [eq(Math.PI), eq(Math.PI / 3), eq(-Math.PI / 3), [0, 1, 0], [0, -1, 0]],
  6: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]],
};

/** Which domain slots the lone pairs occupy, for every possible number of lone pairs (slides 30, 32). */
const LP_SLOTS: Record<Domains, number[][]> = {
  2: [[]],
  3: [[], [0]],
  4: [[], [0], [0, 2]],
  5: [[], [0], [0, 1], [0, 1, 2]],
  6: [[], [0], [0, 1]],
};
export const maxLonePairs = (n: Domains) => LP_SLOTS[n].length - 1;
export const lonePairSlots = (n: Domains, lp: number) => {
  const s = LP_SLOTS[n][lp];
  if (!s) throw new Error(`${lp} lone pairs not possible with ${n} domains`);
  return s;
};

export type GeomId = 'linear' | 'trigonal-planar' | 'bent' | 'tetrahedral' | 'trigonal-pyramidal' | 'trigonal-bipyramidal'
  | 'seesaw' | 't-shaped' | 'octahedral' | 'square-pyramidal' | 'square-planar';
export const GEOM_NAME: Record<GeomId, [string, string]> = {
  linear: ['linear', 'linear'],
  'trigonal-planar': ['trigonal-planar', 'trigonal planar'],
  bent: ['gewinkelt', 'bent'],
  tetrahedral: ['tetraedrisch', 'tetrahedral'],
  'trigonal-pyramidal': ['trigonal-pyramidal', 'trigonal pyramidal'],
  'trigonal-bipyramidal': ['trigonal-bipyramidal', 'trigonal bipyramidal'],
  seesaw: ['wippenförmig', 'seesaw'],
  't-shaped': ['T-förmig', 'T-shaped'],
  octahedral: ['oktaedrisch', 'octahedral'],
  'square-pyramidal': ['quadratisch-pyramidal', 'square pyramidal'],
  'square-planar': ['quadratisch-planar', 'square planar'],
};
const DOMAIN_GEOM: Record<Domains, GeomId> = { 2: 'linear', 3: 'trigonal-planar', 4: 'tetrahedral', 5: 'trigonal-bipyramidal', 6: 'octahedral' };
const MOL_GEOM: Record<Domains, GeomId[]> = {
  2: ['linear'],
  3: ['trigonal-planar', 'bent'],
  4: ['tetrahedral', 'trigonal-pyramidal', 'bent'],
  5: ['trigonal-bipyramidal', 'seesaw', 't-shaped', 'linear'],
  6: ['octahedral', 'square-pyramidal', 'square-planar'],
};
/** Predicted bond angles of the electron-domain geometry (slide 29). */
export const domainAngles = (n: Domains, lang: 'de' | 'en') => ({ 2: '180^\\circ', 3: '120^\\circ', 4: lang === 'de' ? '109{,}5^\\circ' : '109.5^\\circ', 5: '90^\\circ\\ \\text{und}\\ 120^\\circ'.replace('und', lang === 'de' ? 'und' : 'and'), 6: '90^\\circ' })[n];
/** Examples from the tables of slides 30 and 32. */
export const EXAMPLE: Record<string, string> = {
  '2/0': 'CO2', '3/0': 'BF3', '3/1': 'NO2^-', '4/0': 'CH4', '4/1': 'NH3', '4/2': 'H2O',
  '5/0': 'PCl5', '5/1': 'SF4', '5/2': 'ClF3', '5/3': 'XeF2', '6/0': 'SF6', '6/1': 'BrF5', '6/2': 'XeF4',
};

export interface Shape { n: Domains; lp: number; bonds: V3[]; pairs: V3[]; domainGeom: GeomId; molGeom: GeomId; example: string }
export function shape(n: Domains, lp: number): Shape {
  const slots = lonePairSlots(n, lp);
  const dirs = DIRS[n];
  return {
    n, lp,
    pairs: slots.map((i) => dirs[i]),
    bonds: dirs.filter((_, i) => !slots.includes(i)),
    domainGeom: DOMAIN_GEOM[n],
    molGeom: MOL_GEOM[n][lp],
    example: EXAMPLE[`${n}/${lp}`],
  };
}

export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const angleDeg = (a: V3, b: V3) => (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b))))) * 180) / Math.PI;
/** All distinct bond–bond angles (rounded to 0.1°). */
export function bondAngles(s: Shape): number[] {
  const out = new Set<number>();
  for (let i = 0; i < s.bonds.length; i++) for (let j = i + 1; j < s.bonds.length; j++) out.add(Math.round(angleDeg(s.bonds[i], s.bonds[j]) * 10) / 10);
  return [...out].sort((a, b) => a - b);
}

/** Measured angles of slide 30: lone pairs and multiple bonds take up more space. */
export const REAL_ANGLES = { CH4: 109.5, NH3: 107, H2O: 104.5, phosgeneClCCl: 111.4, phosgeneClCO: 124.3 } as const;

/** Rotate a vector: first about y by `yaw`, then about x by `pitch` (radians). */
export function rotate(v: V3, yaw: number, pitch: number): V3 {
  const [x, y, z] = v;
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw), z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, y2, z2];
}
