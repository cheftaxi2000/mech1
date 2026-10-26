import { describe, expect, it } from 'vitest';
import { moment, power, rotVelocity } from '../../physics/force';
import { add, cross, dot, norm, scale, sub, vecApproxEqual, type Vec3 } from '../../physics/vec';
import { partsWidth } from '../RichLabel';
import { projectPoint } from '../viewCheck';
import {
  DERIVE_STEPS, EXPLORER_CAM, K6, K6_CAMERA, K6_TARGET, REF_CAM_CLOSE, REF_CAM_WIDE, REF_STEPS, boxEdges, deriveFrame, deriveNumbers, refAnimFrame,
  refExplorerFrame, refNumbers, type Frame3,
} from './k6Frames';
import { REF_PRESETS } from './K6Figures3D';

/** 4:3 canvas, vertical field of view 38° (Scene): half extents in units of the focal length */
const HY = Math.tan((19 * Math.PI) / 180), HX = (4 / 3) * HY;
const TS = [0, 0.25, 0.5, 0.75, 1];
const arrow = (f: Frame3, k: string) => f.arrows.find((a) => a.key === k);
const line = (f: Frame3, k: string) => f.lines.find((a) => a.key === k);
const label = (f: Frame3, k: string) => f.labels.find((a) => a.key === k);
const cam = (f: Frame3) => f.cam ?? { pos: K6_CAMERA, target: K6_TARGET };
const scr = (f: Frame3, p: Vec3) => projectPoint(p, cam(f).pos, cam(f).target);

/** every point of the frame (and of the disc rim) lies inside the canvas; labels with a margin */
function expectInView(f: Frame3, what: string, margin = 0.97) {
  const pts: [string, Vec3][] = [];
  for (const a of f.arrows) if ((a.o ?? 1) > 0.05) pts.push([`arrow ${a.key}`, a.from], [`arrow ${a.key} tip`, a.to]);
  for (const l of f.lines) if ((l.o ?? 1) > 0.05 && l.key !== 'mu') for (const p of l.pts) pts.push([`line ${l.key}`, p]);
  for (const d of f.dots) if ((d.o ?? 1) > 0.05) pts.push([`dot ${d.key}`, d.at]);
  for (const l of f.labels) if ((l.o ?? 1) > 0.4) pts.push([`label ${l.key}`, l.at]);
  for (const [k, p] of pts) {
    const [x, y] = scr(f, p);
    expect(Math.abs(x) / HX, `${what}: ${k} x`).toBeLessThan(margin);
    expect(Math.abs(y) / HY, `${what}: ${k} y`).toBeLessThan(margin);
  }
}

/** labels (sprites, ≈ 0.068 of the canvas height tall) must not lie on top of each other in a final frame */
function expectLabelsApart(f: Frame3, what: string, maxOverlap = 0.35) {
  const boxes = f.labels.filter((l) => (l.o ?? 1) > 0.4).map((l) => {
    const [x, y] = scr(f, l.at);
    const w = 0.068 * (0.55 * partsWidth(l.parts) + 0.5), h = 0.068; // in canvas-height units
    return { k: l.key, x0: (x / HX) * 0.5 * (4 / 3) - w / 2, x1: (x / HX) * 0.5 * (4 / 3) + w / 2, y0: (y / HY) * 0.5 - h / 2, y1: (y / HY) * 0.5 + h / 2 };
  });
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
    if (w > 0 && h > 0) expect((w * h) / Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0)), `${what}: ${a.k} / ${b.k}`).toBeLessThan(maxOverlap);
  }
}

describe('derivation of p. 33: numbers of the lesson example', () => {
  const N = deriveNumbers();
  it('v_P = (0; 1,2; 0) ⟂ ω and ⟂ OP, M_O = (0; −0,60; 0,96) ⟂ OP and ⟂ F, P = 0,96 = F·v_P = ω·M_O', () => {
    expect(vecApproxEqual(N.vP, [0, 1.2, 0])).toBe(true);
    expect(dot(N.vP, K6.omega)).toBeCloseTo(0, 12); expect(dot(N.vP, N.OP)).toBeCloseTo(0, 12);
    expect(vecApproxEqual(N.M, [0, -0.6, 0.96])).toBe(true);
    expect(dot(N.M, N.OP)).toBeCloseTo(0, 12); expect(dot(N.M, K6.F)).toBeCloseTo(0, 12);
    expect(N.P).toBeCloseTo(0.96, 12); expect(power(K6.F, N.vP)).toBeCloseTo(dot(K6.omega, N.M), 12);
    expect(N.par).toBeCloseTo(0.8, 12); // the strip along v_P is F_y
  });
  it('the box: both readings give the volume P (base × height)', () => {
    expect(N.base1 * N.h1).toBeCloseTo(N.P, 12); expect(N.base2 * N.h2).toBeCloseTo(N.P, 12);
    expect(N.base1).toBeCloseTo(norm(N.vP), 12); // |ω × OP| = |v_P|
    expect(N.base2).toBeCloseTo(norm(N.M), 12);
    expect(boxEdges(K6.omega, N.OP, K6.F)).toHaveLength(12);
  });
});

describe('derivation animation: every step shows what its caption says', () => {
  const end = Array.from({ length: DERIVE_STEPS }, (_, s) => deriveFrame(s, 1, 'de'));
  const N = deriveNumbers();
  it('step 1: body, axis μ, ω (double head) on the axis, O, P, OP', () => {
    const f = end[0];
    expect(arrow(f, 'omega')?.double).toBe(true); expect(vecApproxEqual(arrow(f, 'omega')!.to, K6.omega)).toBe(true);
    expect(vecApproxEqual(arrow(f, 'OP')!.to, K6.P)).toBe(true);
    for (const k of ['mu', 'O', 'P', 'OP', 'omega']) expect(label(f, k), k).toBeDefined();
    expect(f.arrows.map((a) => a.key).sort()).toEqual(['OP', 'omega']);
  });
  it('step 2: v_P = ω × OP at P, tangent to the circle of P', () => {
    const f = end[1], v = arrow(f, 'vP')!;
    expect(vecApproxEqual(v.from, K6.P)).toBe(true);
    expect(vecApproxEqual(sub(v.to, v.from), rotVelocity(K6.omega, K6.O, K6.P))).toBe(true);
    const circ = line(f, 'circ')!;
    for (const p of circ.pts) expect(norm(p)).toBeCloseTo(norm(K6.P), 9);
    expect(circ.pts).toHaveLength(65); expect(label(f, 'vP')).toBeDefined();
    expect(f.eq).toContain('omega');
  });
  it('step 3: F at P; the strip is the part of F along v_P, the drop line is ⟂ v_P; P = 0,96 W', () => {
    const f = end[2], F = arrow(f, 'F')!, strip = line(f, 'strip')!, drop = line(f, 'drop')!;
    expect(vecApproxEqual(F.from, K6.P)).toBe(true); expect(vecApproxEqual(sub(F.to, F.from), K6.F)).toBe(true);
    expect(vecApproxEqual(strip.pts[0], K6.P)).toBe(true);
    expect(vecApproxEqual(strip.pts[1], add(K6.P, scale(N.par, N.vhat)))).toBe(true);
    expect(strip.col).toBe('plus');
    expect(dot(sub(drop.pts[0], drop.pts[1]), N.vhat)).toBeCloseTo(0, 12);
    expect(vecApproxEqual(drop.pts[0], add(K6.P, K6.F))).toBe(true);
    expect(f.eq).toContain('0{,}96');
    expect(deriveFrame(2, 1, 'en').eq).toContain('0.96');
  });
  it('step 4: the box on (ω, OP, F): 12 edges from O, F as a free copy at O, base (ω, OP) with height line ⟂ the base', () => {
    const f = end[3];
    expect(f.lines.filter((l) => l.key.startsWith('box'))).toHaveLength(12);
    const fc = arrow(f, 'Fc')!;
    expect(vecApproxEqual(fc.from, K6.O)).toBe(true); expect(vecApproxEqual(fc.to, K6.F)).toBe(true);
    const base = f.faces.find((x) => x.key === 'base1')!;
    expect(vecApproxEqual(base.pts[2], add(K6.omega, N.OP))).toBe(true);
    const h = line(f, 'h1')!, d = sub(h.pts[0], h.pts[1]);
    expect(dot(d, K6.omega)).toBeCloseTo(0, 12); expect(dot(d, N.OP)).toBeCloseTo(0, 12); // ⟂ both base edges
    expect(norm(d)).toBeCloseTo(Math.abs(N.h1), 12);
    expect(f.faces.find((x) => x.key === 'base2')).toBeUndefined();
    expect(f.eq).toContain('V');
  });
  it('step 5: the same box on base (OP, F) whose normal is M_O (double head, force colour); height ⟂ that base', () => {
    const f = end[4], m = arrow(f, 'MO')!;
    expect(m.double).toBe(true); expect(m.col).toBe('force');
    expect(vecApproxEqual(m.to, N.M)).toBe(true);
    expect(f.faces.find((x) => x.key === 'base1')).toBeUndefined();
    const base2 = f.faces.find((x) => x.key === 'base2')!;
    expect(vecApproxEqual(base2.pts[2], add(N.OP, K6.F))).toBe(true);
    const h = line(f, 'h2')!, d = sub(h.pts[0], h.pts[1]);
    expect(dot(d, N.OP)).toBeCloseTo(0, 12); expect(dot(d, K6.F)).toBeCloseTo(0, 12);
    expect(norm(d)).toBeCloseTo(Math.abs(N.h2), 12);
    expect(f.data.V1).toBeCloseTo(f.data.V2, 12);
    expect(label(f, 'MO')).toBeDefined();
  });
  it('step 6: the part of M_O along the axis (green on the axis, height M_z = 0,96), P = ω M_z', () => {
    const f = end[5], mz = line(f, 'Mz')!;
    expect(vecApproxEqual(mz.pts[1], [0, 0, N.Mz])).toBe(true); expect(mz.col).toBe('plus');
    expect(vecApproxEqual(line(f, 'Mdrop')!.pts[0], N.M)).toBe(true);
    expect(f.eq).toContain('0{,}96'); expect(label(f, 'Mz')).toBeDefined();
    expect(f.lines.filter((l) => l.key.startsWith('box')).every((l) => (l.o ?? 1) < 0.3)).toBe(true); // the box has faded
  });
  it('every frame is inside the canvas; final frames: labels do not lie on top of each other', () => {
    for (let s = 0; s < DERIVE_STEPS; s++) for (const t of TS) expectInView(deriveFrame(s, t, 'de'), `derive ${s} ${t}`);
    for (let s = 0; s < DERIVE_STEPS; s++) expectLabelsApart(end[s], `derive ${s}`);
  });
  it('the disc rim is inside the canvas from the start view', () => {
    for (let i = 0; i < 72; i++) { const a = (2 * Math.PI * i) / 72; const [x, y] = scr(end[0], [K6.R_DISC * Math.cos(a), K6.R_DISC * Math.sin(a), 0]); expect(Math.abs(x) / HX).toBeLessThan(0.99); expect(Math.abs(y) / HY).toBeLessThan(0.99); }
  });
});

describe('reference-point animation (p. 34)', () => {
  const R = refNumbers(K6.Op[2]);
  const end = Array.from({ length: REF_STEPS }, (_, s) => refAnimFrame(s, 1, 'de'));
  it('numbers: O′ = (0, 0, 1,2): M_O′ = (0,96; 0; 0,96) ≠ M_O = (0; −0,60; 0,96); D = O′O × F = (0,96; 0,60; 0) ⟂ axis; same M_z', () => {
    expect(vecApproxEqual(R.MOp, [0.96, 0, 0.96])).toBe(true); expect(vecApproxEqual(R.D, [0.96, 0.6, 0])).toBe(true);
    expect(R.Mz).toBeCloseTo(R.Mzp, 12); expect(R.P).toBeCloseTo(R.Pp, 12);
    expect(vecApproxEqual(R.MOp, moment(K6.Op, { A: K6.P, F: K6.F }))).toBe(true);
  });
  it('step 1: two different arrows, each from its own point', () => {
    const f = end[0];
    expect(vecApproxEqual(arrow(f, 'MO')!.from, K6.O)).toBe(true); expect(vecApproxEqual(arrow(f, 'MOp')!.from, K6.Op)).toBe(true);
    expect(norm(sub(arrow(f, 'MO')!.to, arrow(f, 'MOp')!.to))).toBeGreaterThan(0.5);
    expect(arrow(f, 'MOp')!.col).not.toBe(arrow(f, 'MO')!.col);
    expect(label(f, 'MO')).toBeDefined(); expect(label(f, 'MOp')).toBeDefined();
  });
  it('step 2: the triangle O′ → O → P (O′O along the axis)', () => {
    const f = end[1], a = arrow(f, 'OpO')!;
    expect(vecApproxEqual(a.from, K6.Op)).toBe(true); expect(vecApproxEqual(a.to, K6.O)).toBe(true);
    expect(label(f, 'OpP')).toBeDefined(); expect(arrow(f, 'MO')).toBeUndefined();
  });
  it('step 3: M_O′ moved to O, D from the tip of M_O closes the triangle: M_O′ = M_O + D', () => {
    const f = end[2], mo = arrow(f, 'MO')!, mp = arrow(f, 'MOp')!, d = arrow(f, 'D')!;
    expect(vecApproxEqual(mp.from, K6.O)).toBe(true);
    expect(vecApproxEqual(d.from, mo.to)).toBe(true); expect(vecApproxEqual(d.to, mp.to)).toBe(true);
    expect(f.eq).toContain('M');
  });
  it('step 4: D is horizontal, ⟂ ω: right-angle mark at O between D and the axis direction', () => {
    const f = end[3], d = arrow(f, 'D')!;
    expect(dot(sub(d.to, d.from), K6.omega)).toBeCloseTo(0, 12);
    const ra = line(f, 'ra')!;
    expect(dot(sub(ra.pts[0], ra.pts[1]), sub(ra.pts[2], ra.pts[1]))).toBeCloseTo(0, 12);
    expect(arrow(f, 'omega')!.o).toBe(1);
  });
  it('step 5: both tips are at the same height M_z; dashed lines to the same point on the axis', () => {
    const f = end[4];
    const tips = [arrow(f, 'MO')!.to, arrow(f, 'MOp')!.to];
    expect(tips[0][2]).toBeCloseTo(tips[1][2], 12);
    expect(vecApproxEqual(line(f, 'dropO')!.pts[1], [0, 0, tips[0][2]])).toBe(true);
    expect(vecApproxEqual(line(f, 'dropOp')!.pts[1], [0, 0, tips[0][2]])).toBe(true);
    expect(f.eq).toContain('0{,}96');
  });
  it('every frame inside the canvas (the camera moves from wide to close in step 3); labels apart in final frames', () => {
    for (let s = 0; s < REF_STEPS; s++) for (const t of TS) expectInView(refAnimFrame(s, t, 'de'), `ref ${s} ${t}`);
    for (let s = 0; s < REF_STEPS; s++) expectLabelsApart(end[s], `ref ${s}`);
    expect(cam(end[0]).pos).toEqual(REF_CAM_WIDE.pos); expect(cam(end[4]).pos).toEqual(REF_CAM_CLOSE.pos);
  });
});

describe('reference-point explorer', () => {
  it('for every O′ and preset: M_z = M_z′ and P the same; D ⟂ axis; the frame is inside the canvas', () => {
    for (const k of Object.keys(REF_PRESETS) as (keyof typeof REF_PRESETS)[]) for (const h of [-1, -0.5, 0, 0.3, 0.6, 1.2, 1.5]) {
      const F = REF_PRESETS[k].F, R = refNumbers(h, F);
      expect(R.Mz).toBeCloseTo(R.Mzp, 12); expect(R.D[2]).toBeCloseTo(0, 12);
      for (const showD of [false, true]) {
        const f = refExplorerFrame({ h, F, showD });
        expectInView(f, `explorer ${k} h=${h}`, 0.98);
      }
    }
    expect(cam(refExplorerFrame({ h: 1, F: K6.F, showD: false })).pos).toEqual(EXPLORER_CAM.pos);
  });
  it('the preset «parallel zur Achse» gives M horizontal and P = 0; «radial» gives M = 0; «tangential» the largest P for |F| = 0,9', () => {
    const axis = refNumbers(0.8, REF_PRESETS.axis.F);
    expect(axis.Mz).toBeCloseTo(0, 12); expect(axis.P).toBeCloseTo(0, 12); expect(norm(axis.MO)).toBeGreaterThan(0.5);
    expect(norm(refNumbers(0.8, REF_PRESETS.radial.F).MO)).toBeCloseTo(0, 12);
    const tang = refNumbers(0.8, REF_PRESETS.tangential.F);
    expect(tang.P).toBeCloseTo(0.9 * 1.2, 12);
    const best = Math.max(...[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (i * Math.PI) / 3; return refNumbers(0, [0.9 * Math.cos(a), 0.9 * Math.sin(a), 0]).P; }));
    expect(tang.P).toBeGreaterThanOrEqual(best - 1e-12);
  });
  it('M = OP × F for the lesson example equals cross(P, F)', () => {
    expect(vecApproxEqual(refNumbers(0).MO, cross(K6.P, K6.F))).toBe(true);
  });
});
