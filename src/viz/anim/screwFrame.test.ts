import { describe, expect, it } from 'vitest';
import { rigidVelocity } from '../../physics/rigid';
import { distanceToAxis, screwPosition, velocityOnG } from '../../physics/screw';
import { type Vec3, add, cross, dot, norm, scale, sub, vecApproxEqual } from '../../physics/vec';
import { partsWidth } from '../RichLabel';
import { SG, SG_AXIS, SG_G, SG_VERTS, SG_VPERP, SG_VW, SG_XZ } from '../screwGeom';
import { projectPoint, screenAngle, visibleFraction } from '../viewCheck';
import { SA_CAMERA, SA_TARGET, SCREW_STEPS, TRACKED, T_TURN, X_BSTAR, X_P, onG, screwFrame, type ScrewFrame } from './screwFrame';

const TS = Array.from({ length: 21 }, (_, i) => i / 20);
const P = (p: Vec3, f?: ScrewFrame) => projectPoint(p, f ? f.cam.pos : SA_CAMERA, f ? f.cam.target : SA_TARGET);
/** 4:3 canvas, vertical field of view 38° (Scene): half extents in units of the focal length */
const HY = Math.tan((19 * Math.PI) / 180), HX = (4 / 3) * HY;
const arrow = (f: ScrewFrame, k: string) => f.arrows.find((a) => a.key === k);
const label = (f: ScrewFrame, k: string) => f.labels.find((a) => a.key === k);

describe('screw animation (Fig. 3.16): geometry of the lesson body', () => {
  it('ζ is the vertical line through Z = (0, 0, 0); |BZ| = v_B^⊥/ω = 0.75; g = (0, −1, 0), e^⊥ = (−1, 0, 0)', () => {
    expect(vecApproxEqual(SG_AXIS.point, [0, 0, 0])).toBe(true);
    expect(vecApproxEqual(SG_AXIS.dir, [0, 0, 1])).toBe(true);
    expect(SG_XZ).toBeCloseTo(0.75, 12);
    expect(vecApproxEqual(SG_G.dir, [0, -1, 0])).toBe(true);
    expect(vecApproxEqual(SG_G.ePerp, [-1, 0, 0])).toBe(true);
    expect(vecApproxEqual(onG(SG_XZ), SG_AXIS.point)).toBe(true);
    expect(norm(SG_VW) / norm(SG_VPERP)).toBeCloseTo(1 / 3, 12); // v_ω : v_B^⊥ = p : |BZ|
  });
});

describe('screw animation: every step shows what its caption says', () => {
  const end = Array.from({ length: SCREW_STEPS }, (_, s) => screwFrame(s, 1));
  it('step 1: only the Kinemate {v_B, ω} in B', () => {
    const f = end[0];
    expect(f.arrows.map((a) => a.key).sort()).toEqual(['omega', 'vB']);
    expect(vecApproxEqual(sub(arrow(f, 'vB')!.to, SG.B), scale(SG.KV, SG.vB))).toBe(true);
    expect(norm(cross(sub(arrow(f, 'omega')!.to, arrow(f, 'omega')!.from), SG.omega))).toBeCloseTo(0, 12);
  });
  it('step 2: v_B = v_ω + v_B^⊥ (blue ∥ ω, orange ⊥ ω), drawn from B', () => {
    const f = end[1], w = arrow(f, 'vwB')!, p = arrow(f, 'vpB')!;
    expect(vecApproxEqual(add(sub(w.to, w.from), sub(p.to, p.from)), scale(SG.KV, SG.vB))).toBe(true);
    expect(norm(cross(sub(w.to, w.from), SG.omega))).toBeCloseTo(0, 12);
    expect(dot(sub(p.to, p.from), SG.omega)).toBeCloseTo(0, 12);
  });
  it('step 3: at P (distance x on g): v_P = v_ω + (v_B^⊥ − ω x) e^⊥; ω × BP points against v_B^⊥', () => {
    const f = end[2];
    expect(f.x).toBeCloseTo(X_P, 12);
    const Pp = onG(X_P);
    const vP = arrow(f, 'vP')!, rot = arrow(f, 'rotP')!, copy = arrow(f, 'copyP')!, vw = arrow(f, 'vwP')!;
    expect(vecApproxEqual(vP.from, Pp)).toBe(true);
    expect(vecApproxEqual(sub(vP.to, vP.from), scale(SG.KV, velocityOnG(SG.vB, SG.omega, X_P)))).toBe(true);
    expect(vecApproxEqual(sub(vP.to, vP.from), add(add(sub(copy.to, copy.from), sub(rot.to, rot.from)), sub(vw.to, vw.from)))).toBe(true);
    expect(dot(sub(rot.to, rot.from), SG_G.ePerp)).toBeLessThan(0);
    expect(norm(sub(rot.to, rot.from))).toBeCloseTo(SG.KV * norm(SG.omega) * X_P, 12); // grows linearly with x
    expect(label(f, 'x')).toBeDefined(); expect(label(f, 'P')).toBeDefined();
  });
  it('the fan along g (steps 3–5): the tips of all velocity arrows lie on one straight line (v depends linearly on x)', () => {
    const f = end[4];
    const tips = [arrow(f, 'vB')!.to, ...f.arrows.filter((a) => a.key.startsWith('comb')).map((a) => a.to), arrow(f, 'vP')!.to];
    expect(tips.length).toBeGreaterThanOrEqual(3);
    const d0 = sub(tips[tips.length - 1], tips[0]);
    for (const q of tips.slice(1)) expect(norm(cross(d0, sub(q, tips[0])))).toBeCloseTo(0, 12);
    const line = f.lines.find((l) => l.key === 'tips')!;
    expect(vecApproxEqual(line.pts[0], tips[0])).toBe(true);
    expect(vecApproxEqual(line.pts[1], tips[tips.length - 1])).toBe(true);
  });
  it('step 4: at Z the perpendicular part is zero (v_Z = v_ω); ζ ∥ ω through Z; Z′ on ζ also has v_ω', () => {
    const f = end[3];
    expect(f.x).toBeCloseTo(SG_XZ, 12);
    expect(arrow(f, 'vP')).toBeUndefined();
    expect(vecApproxEqual(rigidVelocity(SG.vB, SG.omega, SG.B, SG_AXIS.point), SG_VW)).toBe(true);
    // when P arrives at Z the copy of v_B^⊥ and ω × BZ cancel; then they fade out, so the final frame shows only v_Z = v_ω
    const mid = screwFrame(3, 0.36), copy = arrow(mid, 'copyP')!, rot = arrow(mid, 'rotP')!;
    expect(mid.x).toBeCloseTo(SG_XZ, 12);
    expect(vecApproxEqual(add(sub(copy.to, copy.from), sub(rot.to, rot.from)), [0, 0, 0])).toBe(true);
    expect(arrow(f, 'copyP')).toBeUndefined(); expect(arrow(f, 'rotP')).toBeUndefined();
    expect(f.arrows.filter((a) => vecApproxEqual(a.from, SG_AXIS.point)).map((a) => a.key)).toEqual(['vZ']);
    const z = f.lines.find((l) => l.key === 'zeta')!;
    expect(norm(cross(sub(z.pts[1], z.pts[0]), SG.omega))).toBeCloseTo(0, 12);
    expect(distanceToAxis(SG_AXIS, z.pts[0])).toBeCloseTo(0, 12);
    const vz = arrow(f, "vZ'")!;
    expect(vecApproxEqual(sub(vz.to, vz.from), scale(SG.KV, rigidVelocity(SG.vB, SG.omega, SG.B, vz.from)))).toBe(true);
    for (const k of ['Z', 'zeta', "Z'", 'vZ']) expect(label(f, k), k).toBeDefined();
  });
  it('step 5: beyond Z (B*) the perpendicular part points the other way: ω × BP is now longer than v_B^⊥', () => {
    const f = end[4];
    expect(f.x).toBeCloseTo(X_BSTAR, 12);
    const vBs = rigidVelocity(SG.vB, SG.omega, SG.B, onG(X_BSTAR));
    expect(dot(vBs, SG_G.ePerp)).toBeLessThan(0);
    const copy = arrow(f, 'copyP')!, rot = arrow(f, 'rotP')!;
    expect(norm(sub(rot.to, rot.from))).toBeGreaterThan(norm(sub(copy.to, copy.from)));
    expect(vecApproxEqual(sub(arrow(f, 'vP')!.to, arrow(f, 'vP')!.from), scale(SG.KV, vBs))).toBe(true);
    for (const k of ['Bs', 'vBs']) expect(label(f, k), k).toBeDefined();
  });
  it('step 6: all perpendicular parts are a turning about ζ: on the circle through B they are ω × ZP (tangential)', () => {
    const f = end[5];
    expect(arrow(f, 'rotP')).toBeUndefined(); // the walk has faded out
    expect(f.arrows.filter((a) => a.key.startsWith('comb'))).toHaveLength(0);
    const ring = f.arrows.filter((a) => a.key.startsWith('ring'));
    expect(ring).toHaveLength(7);
    for (const a of ring) {
      const r = sub(a.from, SG_AXIS.point), d = sub(a.to, a.from);
      expect(dot(r, d)).toBeCloseTo(0, 12); // tangential
      expect(norm(d)).toBeCloseTo(SG.KV * norm(SG.omega) * norm(r), 12);
      expect(vecApproxEqual(add(scale(1 / SG.KV, d), SG_VW), rigidVelocity(SG.vB, SG.omega, SG.B, a.from))).toBe(true);
    }
    expect(label(f, 'ringLab')).toBeDefined();
  });
  it('step 7: one full turn about ζ while sliding 2π p along it; B on a helix, Z straight along ζ', () => {
    const f = end[6];
    expect(f.angle).toBeCloseTo(2 * Math.PI, 9);
    expect(vecApproxEqual(f.shift, scale(T_TURN, SG_VW), 1e-9)).toBe(true);
    const tb = f.lines.find((l) => l.key === 'trailB')!;
    for (const p of tb.pts) expect(distanceToAxis(SG_AXIS, p)).toBeCloseTo(SG_XZ, 9);
    const tz = f.lines.find((l) => l.key === 'trailZ')!;
    for (const p of tz.pts) expect(distanceToAxis(SG_AXIS, p)).toBeCloseTo(0, 9);
    // mid-turn: the drawn body pose and the physics agree for every tracked point
    const m = screwFrame(6, 0.5);
    for (const tr of TRACKED) {
      const time = (m.angle / norm(SG.omega));
      const posed = add(add(SG_AXIS.point, m.shift), rotZ(m.angle, sub(tr.p, SG_AXIS.point)));
      expect(vecApproxEqual(posed, screwPosition(SG.B, SG.vB, SG.omega, tr.p, time), 1e-9)).toBe(true);
    }
  });
});

const rotZ = (a: number, p: Vec3): Vec3 => [Math.cos(a) * p[0] - Math.sin(a) * p[1], Math.sin(a) * p[0] + Math.cos(a) * p[1], p[2]];

describe('screw animation: the view', () => {
  it('every label stays inside the 4:3 frame in every frame', () => {
    for (let s = 0; s < SCREW_STEPS; s++) for (const t of TS) for (const l of screwFrame(s, t).labels) { const f = screwFrame(s, t);
      const [x, y] = P(l.at, f);
      expect(Math.abs(x), `step ${s + 1} t ${t} ${l.key} x`).toBeLessThan(HX - 0.04);
      expect(Math.abs(y), `step ${s + 1} t ${t} ${l.key} y`).toBeLessThan(HY - 0.03);
    }
  });
  it('arrows, lines and dots stay inside the frame', () => {
    for (let s = 0; s < SCREW_STEPS; s++) for (const t of TS) {
      const f = screwFrame(s, t);
      const body = SG_VERTS.map((v) => add(add(SG_AXIS.point, f.shift), rotZ(f.angle, sub(v, SG_AXIS.point))));
      const pts = [...f.arrows.flatMap((a) => [a.from, a.to]), ...f.lines.flatMap((l) => l.pts), ...f.dots.map((d) => d.at), ...body];
      for (const p of pts) {
        const [x, y] = P(p, f);
        expect(Math.abs(x), `step ${s + 1} t ${t} x`).toBeLessThan(HX - 0.01);
        expect(Math.abs(y), `step ${s + 1} t ${t} y`).toBeLessThan(HY - 0.01);
      }
    }
  });
  it('in every final frame no two labels sit on each other', () => {
    for (let s = 0; s < SCREW_STEPS; s++) {
      const fr = screwFrame(s, 1), ls = fr.labels;
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) {
        const a = P(ls[i].at, fr), b = P(ls[j].at, fr);
        const wx = 0.0105 * (partsWidth(ls[i].parts) + partsWidth(ls[j].parts)) + 0.012; // ≈ half widths
        const apart = Math.abs(a[0] - b[0]) > wx || Math.abs(a[1] - b[1]) > 0.03;
        expect(apart, `step ${s + 1}: ${ls[i].key} / ${ls[j].key}`).toBe(true);
      }
    }
  });
  it('the vectors the captions talk about are seen clearly (not pointing at the camera)', () => {
    const B = SG.B;
    expect(visibleFraction(B, SG.vB, SA_CAMERA, SA_TARGET)).toBeGreaterThan(0.6);
    expect(visibleFraction(B, SG_VPERP, SA_CAMERA, SA_TARGET)).toBeGreaterThan(0.6);
    expect(visibleFraction(B, SG.omega, SA_CAMERA, SA_TARGET)).toBeGreaterThan(0.6);
    expect(visibleFraction(B, SG_G.dir, SA_CAMERA, SA_TARGET)).toBeGreaterThan(0.6); // g
    // v_B^⊥ and g are apart on the screen (they are perpendicular in space)
    expect(screenAngle(B, SG_VPERP, B, SG_G.dir, SA_CAMERA, SA_TARGET)).toBeGreaterThan(35);
    // ω × BP (+x) is seen too
    expect(visibleFraction(onG(X_P), cross(SG.omega, sub(onG(X_P), B)), SA_CAMERA, SA_TARGET)).toBeGreaterThan(0.5);
  });
});
