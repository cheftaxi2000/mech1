/**
 * Pure scenes of la-spezial (Übung 4, slides 33–36): the transpose as a mirror across the diagonal (step animation)
 * and why an antisymmetric matrix has zeros on its diagonal. Positions are in cell units: x = column, y = row (0-based).
 */
export interface MCell { key: string; tex: string; x: number; y: number; cls: '' | 'diag' | 'move' | 'moved' | 'me' | 'partner' }
export interface MArc { from: [number, number]; to: [number, number]; self?: boolean }
export interface MFrame { n: number; cells: MCell[]; mirror: number; arcs: MArc[]; title: string; eq?: string }

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u));
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));

/** Slide 33: A = (1 2 3; 4 5 6; 7 8 9). */
export const T_A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
/** Which mirror pairs (i < j) move in which step: step 1 swaps row 1 with column 1, step 2 row 2 with column 2. */
const MOVES: [number, number][][] = [[], [[0, 1], [0, 2]], [[1, 2]], []];
export const TRANSPOSE_STEPS = 4;

/**
 * Step 0: A with the mirror line (fades in). Step 1: row 1 becomes column 1 (and column 1 becomes row 1).
 * Step 2: row 2 becomes column 2. Step 3: done, Aᵀ. Every entry travels on a straight line from (i, j) to (j, i); the pairs of a step move one after the other.
 */
export function transposeFrame(step: number, t: number): MFrame {
  const n = 3, u = ease(clamp01(t));
  const done = new Set<string>();
  for (let s = 1; s < Math.min(step, MOVES.length); s++) for (const [i, j] of MOVES[s]) { done.add(`${i}${j}`); }
  // the pairs of a step move one after the other; each partner crosses the diagonal at its own gap between diagonal cells
  const moving = (MOVES[step] ?? []).map(([i, j]) => `${i}${j}`);
  const cells: MCell[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const pair = i < j ? `${i}${j}` : `${j}${i}`;
    let x = j, y = i, cls: MCell['cls'] = i === j ? 'diag' : '';
    const k = moving.indexOf(pair);
    if (i !== j && done.has(pair)) { x = i; y = j; cls = 'moved'; }
    else if (i !== j && k >= 0) {
      const uk = ease(clamp01(clamp01(t) * moving.length - k));
      // straight across the mirror: the two partners pass through each other (that is the swap) and glide over the diagonal;
      // the figure draws moving numbers on top, so they never hide behind a resting one
      x = j + (i - j) * uk; y = i + (j - i) * uk;
      cls = uk > 0 && uk < 1 ? 'move' : uk >= 1 ? 'moved' : '';
    }
    if (step === 3 && i !== j) cls = 'moved';
    cells.push({ key: `${i}${j}`, tex: String(T_A[i][j]), x, y, cls });
  }
  const title = step === 0 ? 'A' : step === 3 ? 'A^T' : String.raw`A \;\to\; A^T`;
  return { n, cells, mirror: step === 0 ? u : 1, arcs: [], title };
}

/** Slide 36 idea with a 3×3 example: S = (0 2 −1; −2 0 3; 1 −3 0). */
export const S_A = [[0, 2, -1], [-2, 0, 3], [1, -3, 0]];
export const ANTI_STEPS = 3;

/**
 * Step 0: mirror partners carry opposite signs (S₁₂ = 2, S₂₁ = −2), arcs between all partner pairs.
 * Step 1: a diagonal entry is its own partner: S₂₂ = −S₂₂ (the entry shows a).
 * Step 2: so 2·S₂₂ = 0, i.e. S₂₂ = 0 (the a turns into 0).
 */
export function antiFrame(step: number, t: number): MFrame {
  const n = 3, u = clamp01(t);
  const cells: MCell[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    let tex = String(S_A[i][j]), cls: MCell['cls'] = i === j ? 'diag' : '';
    if (step === 0 && ((i === 0 && j === 1) || (i === 1 && j === 0))) cls = i === 0 ? 'me' : 'partner';
    if (i === 1 && j === 1) {
      if (step === 1) { tex = 'a'; cls = 'me'; }
      if (step === 2) { tex = u < 0.5 ? 'a' : '0'; cls = 'me'; }
    }
    cells.push({ key: `${i}${j}`, tex, x: j, y: i, cls });
  }
  const arcs: MArc[] = step === 0 ? [[0, 1], [0, 2], [1, 2]].map(([i, j]) => ({ from: [j, i] as [number, number], to: [i, j] as [number, number] })) : [{ from: [1, 1], to: [1, 1], self: true }];
  const eq = step === 0 ? String.raw`S_{12} = 2,\quad S_{21} = -2 = -S_{12}`
    : step === 1 ? String.raw`S_{22} = -S_{22}`
    : String.raw`2\,S_{22} = 0 \;\Rightarrow\; S_{22} = 0`;
  return { n, cells, mirror: 1, arcs, title: 'S', eq };
}
