import { Scene } from '../Scene';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from '../primitives';
import { cylToCart } from '../../physics/coords';
import { add, scale, type Vec3 } from '../../physics/vec';
import { CB, CB_CAMERA, CB_TARGET, cylBasisFrame } from './cylBasisFrame';

const L_RHO = 2.5, Z0 = -0.5, Z1 = 2.3;

/** 3D rendering of `cylBasisFrame(step, t)` (lesson "basen", lecture p. 6). */
export function CylBasisAnim({ step, t }: { step: number; t: number }) {
  const f = cylBasisFrame(step, t);
  const { M, phi } = f;
  const tip = (e: Vec3, k = 1) => add(M, scale(f.basisLen * k, e));
  const Mxy: Vec3 = [M[0], M[1], 0];
  return (
    <Scene height={360} camera={CB_CAMERA} target={CB_TARGET}>
      <Axes size={2.2} />
      {/* coordinate lines through M */}
      {f.lines.rho > 0.01 && <Curve f={(s) => cylToCart({ rho: s, phi, z: CB.Z })} t0={0} t1={L_RHO * f.lines.rho} n={2} color={C.rho} width={2} />}
      {f.lines.phi > 0.01 && <Curve f={(s) => cylToCart({ rho: CB.RHO, phi: phi + s, z: CB.Z })} t0={0} t1={2 * Math.PI * f.lines.phi} color={C.angle} width={2} />}
      {f.lines.z > 0.01 && <Curve f={(s) => [M[0], M[1], s]} t0={Z0} t1={Z0 + (Z1 - Z0) * f.lines.z} n={2} color={C.z} width={2} />}
      <Dashed pts={[[0, 0, 0], Mxy]} />
      <Curve f={(s) => [0.42 * Math.cos(s), 0.42 * Math.sin(s), 0]} t0={0} t1={phi} color={C.angle} width={2} />
      {phi > 0.25 && <Label at={[0.66 * Math.cos(phi / 2), 0.66 * Math.sin(phi / 2), 0]} color={C.angle}>φ</Label>}
      {/* faint basis at the start position */}
      {f.ghost && (<>
        <Arrow from={f.ghost.at} to={add(f.ghost.at, f.ghost.eRho)} color={C.construct} width={2} />
        <Arrow from={f.ghost.at} to={add(f.ghost.at, f.ghost.ePhi)} color={C.construct} width={2} />
        <Dot at={f.ghost.at} color={C.construct} r={0.035} />
      </>)}
      {f.showEx && (<><Arrow to={[1, 0, 0]} color={C.x} width={4} /><Label at={[1.02, -0.26, -0.06]} color={C.x} vec sub="x">e</Label></>)}
      {/* r = ρ e_ρ + z e_z */}
      {f.decomp.rho > 0.01 && <Arrow to={scale(CB.RHO * f.decomp.rho, f.basis.eRho)} color={C.rho} width={5} />}
      {f.decomp.rho > 0.6 && <Label at={add(scale(CB.RHO * 0.72, f.basis.eRho), scale(-0.24, f.basis.ePhi))} color={C.rho}>ρ</Label>}
      {f.decomp.z > 0.01 && <Arrow from={Mxy} to={[M[0], M[1], CB.Z * f.decomp.z]} color={C.z} width={5} />}
      {f.decomp.z > 0.6 && <Label at={add([M[0], M[1], CB.Z * 0.42], scale(0.22, f.basis.eRho))} color={C.z}>z</Label>}
      {f.decomp.r && (<><Arrow to={M} color={C.r} width={3} /><Label at={[M[0] * 0.5 - 0.12, M[1] * 0.5 - 0.12, M[2] * 0.5 + 0.2]} color={C.r} vec>r</Label></>)}
      {/* basis at M */}
      {f.basisLen > 0.02 && (<>
        <Arrow from={M} to={tip(f.basis.eRho)} color={C.rho} width={4} />
        <Arrow from={M} to={tip(f.basis.ePhi)} color={C.angle} width={4} />
        <Arrow from={M} to={tip(f.basis.eZ)} color={C.z} width={4} />
        {f.basisLen > 0.8 && (<>
          <Label at={tip(f.basis.eRho, 1.22)} color={C.rho} vec sub="ρ">e</Label>
          <Label at={tip(f.basis.ePhi, 1.22)} color={C.angle} vec sub="φ">e</Label>
          <Label at={add(tip(f.basis.eZ, 1.12), [0, 0, 0.06])} color={C.z} vec sub="z">e</Label>
        </>)}
      </>)}
      <Dot at={M} />
      <Label at={add(M, [-0.18 * f.basis.ePhi[0], -0.18 * f.basis.ePhi[1], -0.2])} color={C.point}>M</Label>
    </Scene>
  );
}
