import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { Scene } from '../Scene';
import { Arrow, Axes, C, Curve, Dashed, Dot, Label } from '../primitives';
import { add, norm, scale, sub, type Vec3 } from '../../physics/vec';
import { CF, circFrame } from './circFrame';

const B = 0.5; // drawn length of the basis vectors at M
const VS = 1.7; // arrow length per unit of speed
export const CIRCLE_CAMERA: [number, number, number] = [3.9, -3.9, 3.0];

/**
 * Arrow like primitives' Arrow (same head proportions), with an opacity and a draw order:
 * `onTop` draws it over everything else (no depth test), so e_φ stays visible where v runs along it.
 */
function LayerArrow({ from, to, color, width, opacity = 1, onTop = false }: { from: Vec3; to: Vec3; color: string; width: number; opacity?: number; onTop?: boolean }) {
  const g = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const d = b.clone().sub(a), len = d.length(), u = d.clone().normalize();
    let r = 0.026 + 0.0125 * width, h = 3.1 * r;
    if (h > 0.45 * len) { const k = (0.45 * len) / h; r *= k; h *= k; }
    return {
      len, r, h,
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), u),
      head: b.clone().sub(u.clone().multiplyScalar(h / 2)),
      base: b.clone().sub(u.clone().multiplyScalar(h * 0.92)).toArray() as [number, number, number],
    };
  }, [from, to, width]);
  if (g.len < 1e-6 || opacity < 0.02) return null;
  const order = onTop ? 20 : 0;
  return (
    <group>
      <Line points={[from as [number, number, number], g.base]} color={color} lineWidth={width} transparent={opacity < 1} opacity={opacity} depthTest={!onTop} renderOrder={order} />
      <mesh position={g.head} quaternion={g.quat} renderOrder={order}>
        <coneGeometry args={[g.r, g.h, 20]} />
        <meshBasicMaterial color={color} transparent={opacity < 1} opacity={opacity} depthTest={!onTop} />
      </mesh>
    </group>
  );
}

/** Small right-angle mark at P between the directions u and w (both unit length after normalising). */
function RightAngle({ at, u, w, size = 0.16, color }: { at: Vec3; u: Vec3; w: Vec3; size?: number; color: string }) {
  const a = scale(size / norm(u), u), b = scale(size / norm(w), w);
  return <Line points={[add(at, a), add(add(at, a), b), add(at, b)] as [number, number, number][]} color={color} lineWidth={1.6} />;
}

/** 3D rendering of `circFrame(step, t)` (lesson "kreisbewegung", lecture p. 11). */
export function CircleAnim({ step, t }: { step: number; t: number }) {
  const f = circFrame(step, t);
  const { M, C: Ctr } = f, e = f.vec;
  const at = (v: Vec3, k: number) => add(M, scale(k, v));
  const wTop: Vec3 = [0, 0, CF.OMEGA_LEN * 2.1 * f.omega];
  const ring = (a: number): Vec3 => [0.2 * Math.cos(a), 0.2 * Math.sin(a), 2.05];
  return (
    <Scene height={360} camera={CIRCLE_CAMERA} target={[0.4, 0.1, 0.85]}>
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
      {/* v (faint while the captions are about ω, e_φ and r) */}
      {f.v > 0.02 && <LayerArrow from={M} to={at(e.v, VS * f.v)} color={C.point} width={f.vCross > 0.5 ? 6 : 4} opacity={f.vOpacity} />}
      {f.v > 0.8 && f.vOpacity > 0.5 && <Label at={add(at(e.v, VS + 0.15), [0, 0, 0.08])} color={C.point} vec>v</Label>}
      {/* basis at M; e_φ is drawn on top of v */}
      {f.basis > 0.02 && (<>
        <LayerArrow from={M} to={at(e.eRho, B * f.basis)} color={C.rho} width={3.5} />
        <LayerArrow from={M} to={at([0, 0, 1], B * f.basis)} color={C.z} width={3.5} />
        <LayerArrow from={M} to={at(e.ePhi, B * f.basis)} color={C.angle} width={f.cross > 0.5 ? 6 : 4.5} onTop />
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
      {/* ω × r in the picture: right angles at M between v and the axis direction (ω), and between v and r (back to O) */}
      {f.rightAngles > 0.5 && (<>
        <RightAngle at={M} u={e.v} w={[0, 0, 1]} color={C.angle} />
        <RightAngle at={M} u={e.v} w={sub([0, 0, 0], M)} color={C.r} />
      </>)}
      <Dot at={M} />
      <Label at={add(M, [-0.12, -0.12, -0.22])} color={C.point}>M</Label>
    </Scene>
  );
}
