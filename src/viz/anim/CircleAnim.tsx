import { Scene } from '../Scene';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from '../primitives';
import { add, scale, type Vec3 } from '../../physics/vec';
import { CF, circFrame } from './circFrame';

const B = 0.5; // drawn length of the basis vectors at M
const VS = 1.7; // arrow length per unit of speed

/** 3D rendering of `circFrame(step, t)` (lesson "kreisbewegung", lecture p. 11). */
export function CircleAnim({ step, t }: { step: number; t: number }) {
  const f = circFrame(step, t);
  const { M, C: Ctr } = f, e = f.vec;
  const at = (v: Vec3, k: number) => add(M, scale(k, v));
  const wTop: Vec3 = [0, 0, CF.OMEGA_LEN * 2.1 * f.omega];
  const ring = (a: number): Vec3 => [0.2 * Math.cos(a), 0.2 * Math.sin(a), 2.05];
  return (
    <Scene height={360} camera={[3.9, -3.9, 3.0]} target={[0.4, 0.1, 0.85]}>
      <Axes size={2.5} />
      {/* trajectory: the circle ρ = R at height z0 */}
      {f.circle > 0.01 && <Curve f={(a) => [CF.R * Math.cos(a), CF.R * Math.sin(a), CF.Z0]} t0={CF.PHI0} t1={CF.PHI0 + 2 * Math.PI * f.circle} color={C.path} width={2.4} />}
      <Dot at={Ctr} color={C.axis} r={0.03} />
      {f.decomp < 0.5 && <Dashed pts={[Ctr, M]} />}
      {/* ω on the axis, with the sense of rotation */}
      {f.omega > 0.02 && <Arrow to={wTop} color={C.angle} width={5} />}
      {f.omega > 0.8 && (<>
        <Label at={[-0.3, 0.3, 1.85]} color={C.angle} vec>ω</Label>
        <Curve f={ring} t0={-0.6} t1={3.6} color={C.angle} width={2} />
        <Arrow from={ring(3.3)} to={ring(3.6)} color={C.angle} width={2} />
      </>)}
      {/* basis at M */}
      {f.basis > 0.02 && (<>
        <Arrow from={M} to={at(e.eRho, B * f.basis)} color={C.rho} width={3.5} />
        <Arrow from={M} to={at([0, 0, 1], B * f.basis)} color={C.z} width={3.5} />
        <Arrow from={M} to={at(e.ePhi, B * f.basis)} color={C.angle} width={f.cross > 0.5 ? 6 : 3.5} />
        {f.basis > 0.8 && (<>
          <Label at={at(e.eRho, B + 0.2)} color={C.rho} vec sub="ρ">e</Label>
          <Label at={add(at([0, 0, 1], B + 0.12), [0.05, 0.05, 0])} color={C.z} vec sub="z">e</Label>
          <Label at={add(at(e.ePhi, B * 0.6), [0, 0, 0.22])} color={C.angle} vec sub="φ">e</Label>
        </>)}
      </>)}
      {/* e_φ = e_z × e_ρ: quarter turn from e_ρ to e_φ around e_z */}
      {f.cross > 0.02 && <Curve f={(a) => add(M, [0.32 * Math.cos(f.phi + a), 0.32 * Math.sin(f.phi + a), 0])} t0={0} t1={(Math.PI / 2) * f.cross} color={C.angle} width={2} />}
      {/* r and its split */}
      {f.r > 0.02 && <Arrow to={scale(f.r, M)} color={C.r} width={2.6} />}
      {f.r > 0.9 && <Label at={add(scale(0.5, M), [-0.12, -0.12, 0.2])} color={C.r} vec>r</Label>}
      {f.decomp > 0.02 && (<>
        <Arrow to={[0, 0, CF.Z0 * f.decomp]} color={C.z} width={5} />
        <Arrow from={Ctr} to={add(Ctr, scale(CF.R * f.decomp, e.eRho))} color={C.rho} width={5} />
      </>)}
      {/* v */}
      {f.v > 0.02 && <Arrow from={M} to={at(e.v, VS * f.v)} color={C.point} width={f.vCross > 0.5 ? 6 : 4} />}
      {f.v > 0.8 && <Label at={add(at(e.v, VS + 0.15), [0, 0, 0.08])} color={C.point} vec>v</Label>}
      <Dot at={M} />
      <Label at={add(M, [-0.12, -0.12, -0.22])} color={C.point}>M</Label>
    </Scene>
  );
}
