import { describe, expect, it } from 'vitest';
import { FS, REST_BLOCK, freeScene, freeState, partialLoop } from './k3FreeScene';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';

const STEPS = 6;
const fin = (s: number) => freeScene(s, 1, 'de');
const has = (s: number, k: string) => !!shape(fin(s), k) && (shape(fin(s), k)!.o ?? 1) > 0.5;

describe('Freischneiden scene: every step ends with what its caption says', () => {
  it('step 0: the whole assembly, only the loads G and Z (dark), no frame, no contact forces', () => {
    expect(has(0, 'G-ld')).toBe(true); expect(has(0, 'Z-ld')).toBe(true);
    expect(shape(fin(0), 'frame-block')).toBeUndefined();
    expect(has(0, 'N1-ld')).toBe(false); expect(has(0, 'N1p-gh')).toBe(false);
    expect(fin(0).data.lift).toBe(0);
  });
  it('step 1: the dashed frame around the Lastkörper is complete; the block has not moved', () => {
    const f = shape(fin(1), 'frame-block')!;
    expect(f.kind).toBe('polyline');
    expect(f.pts.length).toBe(5);                                  // closed loop: 4 corners + back to the first
    expect(f.pts[0]).toEqual(f.pts[4]);
    expect(f.pts[0][0]).toBe(FS.bx0 - FS.margin);
    expect(fin(1).data.lift).toBe(0);
  });
  it('step 2: the block is lifted off the beam by FS.lift, the frame goes with it', () => {
    expect(fin(2).data.lift).toBe(FS.lift);
    const b = shape(fin(2), 'block')!;
    expect(b.pts[2][1]).toBe(FS.beamY0 - FS.lift);                 // bottom edge of the block
    expect(shape(fin(2), 'frame-block')!.pts[0][1]).toBe(FS.beamY0 - FS.lift - FS.bh - FS.margin);
    expect(has(2, 'N1-ld')).toBe(false);
  });
  it('step 3: N₁ N₂ R₁ R₂ on the block (dark) and the reactions on the beam (faint); not yet coloured', () => {
    for (const k of ['N1', 'N2', 'R1', 'R2']) { expect(has(3, `${k}-ld`)).toBe(true); expect(has(3, `${k}p-gh`)).toBe(true); expect(has(3, `${k}-out`)).toBe(false); }
    expect(lab(fin(3), 'N1p')!.tex).toBe('-\\v N_1');
  });
  it('step 4 (= coloured picture 1 of p. 31): the six forces on the Lastkörper are vermilion, the reactions stay faint', () => {
    for (const k of ['G', 'Z', 'N1', 'N2', 'R1', 'R2']) { expect(has(4, `${k}-out`), k).toBe(true); expect(has(4, `${k}-ld`), k).toBe(false); }
    for (const k of ['N1p', 'N2p', 'R1p', 'R2p']) expect(has(4, `${k}-gh`)).toBe(true);
    expect(has(4, 'leg-out')).toBe(true); expect(has(4, 'FA')).toBe(false);
    expect(fin(4).data.lift).toBe(FS.lift);
  });
  it('step 5 (= coloured picture 2): block back on the beam, N, R and the reactions grey, G, Z, F_A, F_B vermilion, frame around both', () => {
    expect(fin(5).data.lift).toBe(0);
    for (const k of ['N1', 'N2', 'R1', 'R2']) { expect(has(5, `${k}-in`)).toBe(true); expect(has(5, `${k}p-in`)).toBe(true); expect(has(5, `${k}-out`)).toBe(false); expect(has(5, `${k}p-gh`)).toBe(false); }
    for (const k of ['G-out', 'Z-out', 'FA', 'FB']) expect(has(5, k), k).toBe(true);
    expect(has(5, 'frame-union0')).toBe(true);
    expect(shape(fin(5), 'frame-block')).toBeUndefined();
    const b = shape(fin(5), 'block')!;
    expect(b.pts[2][1]).toBe(REST_BLOCK.y1);
  });
  it('the frame draws itself during step 1, the block rises during step 2 and sinks back during step 5', () => {
    expect(freeState(1, 0).frameBlock).toBe(0); expect(freeState(1, 0.5).frameBlock).toBe(0.5);
    expect(freeState(2, 0).lift).toBe(0); expect(freeState(2, 0.5).lift).toBeGreaterThan(0); expect(freeState(2, 0.5).lift).toBeLessThan(FS.lift);
    expect(freeState(5, 0).lift).toBe(FS.lift); expect(freeState(5, 0.5).lift).toBeLessThan(FS.lift);
    // continuity across steps
    for (let s = 0; s < STEPS - 1; s++) {
      const a = freeState(s, 1), b = freeState(s + 1, 0);
      expect(b.lift).toBeCloseTo(a.lift, 9); expect(b.outer).toBeCloseTo(a.outer, 9); expect(b.contact).toBeCloseTo(a.contact, 9); expect(b.inner).toBeCloseTo(a.inner, 9);
    }
  });
  it('partialLoop cuts the perimeter', () => {
    const sq: [number, number][] = [[0, 0], [10, 0], [10, 10], [0, 10]];
    expect(partialLoop(sq, 0.125)).toEqual([[0, 0], [5, 0]]);
    expect(partialLoop(sq, 1)).toEqual([[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]);
  });
  it('all shapes and labels stay inside the figure; no overlapping labels in the final frames', () => {
    expectInside(freeScene, STEPS);
    expectNoOverlap(freeScene, STEPS, 0.25);
  });
});
