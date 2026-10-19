import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../Scene';
import { Arrow, C, Dashed, Dot, Label } from '../primitives';
import { type Vec3, add, scale, sub } from '../../physics/vec';
import { CE, CUBE, OMEGA, VERTS, cubeFrame, muEnds } from './cubeFrame';

const AX = 2.2;
/** The teal SdpG projections lie on the edge AB (= the x-axis); they are drawn this far below it. */
const PROJ_DROP: Vec3 = [0, 0, -0.16];
/** Camera as in the lecture's figure on p. 19: x to the right, y receding to the upper right, z up. */
export const CUBE_CAMERA: { position: [number, number, number]; target: [number, number, number] } = {
  target: [1.05, 0.95, 0.72],
  position: [1.05 + 1.6, 0.95 - 5.15, 0.72 + 1.98],
};
type P3 = [number, number, number];
/** 12 edges of a cube whose vertices are indexed x·4 + y·2 + z. */
const edgesOf = (v: Vec3[]): P3[] => {
  const segs: P3[] = [];
  for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) segs.push(v[i] as P3, v[i | bit] as P3);
  return segs;
};

/** 3D rendering of `cubeFrame(step, t)` (lesson "rotation", lecture p. 19). */
export function CubeAnim({ step, t }: { step: number; t: number }) {
  const f = cubeFrame(step, t);
  const { a, KV, KW } = CUBE;
  const { A, B, C: Cc, E } = f.P;
  // the translucent box: turned about its centre (which itself turned about μ)
  const box = useMemo(() => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(...OMEGA).normalize(), f.turn), [f.turn]);
  const mid = scale(0.5, add(f.verts[0], f.verts[7]));
  const [m0, m1] = muEnds(f.mu);
  const w = scale(KW * a, OMEGA); // ω as drawn at E
  const wx: Vec3 = [w[0], 0, 0], wz: Vec3 = [0, 0, w[2]];
  return (
    <Scene height={380} camera={CUBE_CAMERA.position} target={CUBE_CAMERA.target}>
      {/* axes as in the lecture's figure (O ≡ A) */}
      {/* y recedes into the picture and passes through E: it runs on beyond E so its label is clear of E and ω */}
      {([[AX, 0, 0], [0, 1.6 * AX, 0], [0, 0, AX]] as Vec3[]).map((p, i) => (
        <group key={i}>
          <Arrow to={p} color={C.axis} width={1.2} />
          <Label at={scale(1.08, p)} color={C.axis}>{'xyz'[i]}</Label>
        </group>
      ))}
      {f.ghost && <Line points={edgesOf(VERTS)} segments color={C.construct} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} />}
      <mesh position={mid as P3} quaternion={box}>
        <boxGeometry args={[a, a, a]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <Line points={edgesOf(f.verts)} segments color={C.r} lineWidth={1.8} />
      {/* SdpG along AB: the x-parts of v_A and v_B (teal), drawn just below the edge AB with short witness lines */}
      {f.proj > 0.01 && (<>
        <Dashed pts={[add([-0.35, 0, 0], PROJ_DROP), add([a + 0.95, 0, 0], PROJ_DROP)]} color={C.rho} />
        <Line points={[A as P3, add(A, PROJ_DROP) as P3]} color={C.rho} lineWidth={1} />
        <Line points={[add(A, PROJ_DROP) as P3, add(add(A, PROJ_DROP), [KV * CUBE.v * f.proj, 0, 0]) as P3]} color={C.rho} lineWidth={7} transparent opacity={0.8} />
        {f.vBx > 0.01 && (<>
          <Line points={[B as P3, add(B, PROJ_DROP) as P3]} color={C.rho} lineWidth={1} />
          <Line points={[add(B, PROJ_DROP) as P3, add(add(B, PROJ_DROP), [KV * f.vBx * f.proj, 0, 0]) as P3]} color={C.rho} lineWidth={7} transparent opacity={0.8} />
        </>)}
      </>)}
      {/* EA, EB */}
      {f.EA > 0.01 && (<><Arrow from={E} to={add(E, scale(f.EA, sub(A, E)))} color={C.r} width={2.5} />{f.EA > 0.9 && <Label at={add(scale(0.5, add(E, A)), [0.34, 0, -0.02])} color={C.r} vec>EA</Label>}</>)}
      {f.EB > 0.01 && (<><Arrow from={E} to={add(E, scale(f.EB, sub(B, E)))} color={C.r} width={2.5} />{f.EB > 0.9 && <Label at={add(scale(0.5, add(E, B)), [0.12, 0, 0.16])} color={C.r} vec>EB</Label>}</>)}
      {/* the components of ω found so far, at E (where the lecture draws its local basis) */}
      {f.comps > 0.01 && (<>
        <Arrow from={E} to={add(E, scale(f.comps, wx))} color={C.x} width={4} />
        <Arrow from={E} to={add(E, scale(f.comps, wz))} color={C.z} width={4} />
        {f.comps > 0.9 && step === 2 && (<>
          <Label at={add(E, add(wx, [0.12, 0, -0.1]))} color={C.x} sub="x">ω</Label>
          <Label at={add(E, add(wz, [-0.16, 0, 0.06]))} color={C.z} sub="z">ω</Label>
        </>)}
        {f.omega > 0.01 && (<>
          <Dashed pts={[add(E, wx), add(E, w)]} color={C.angle} />
          <Dashed pts={[add(E, wz), add(E, w)]} color={C.angle} />
        </>)}
      </>)}
      {f.wy > 0.01 && (<>
        <Arrow from={E} to={add(E, [0, 0.55 * f.wy, 0])} color={C.y} width={4} />
        {f.wy > 0.5 && (<><Label at={add(E, [0.1, 0.55 * f.wy, 0.14])} color={C.y} sub="y">ω</Label><Label at={add(E, [0.36, 0.55 * f.wy, 0.14])} color={C.y}>?</Label></>)}
      </>)}
      {f.wyZero > 0.01 && (<><Label at={add(E, [-0.78, 0, 0.34])} color={C.y} sub="y">ω</Label><Label at={add(E, [-0.35, 0, 0.34])} color={C.y}>= 0</Label></>)}
      {/* velocities */}
      <Arrow from={A} to={add(A, f.vA)} color={C.point} width={3.5} />
      <Label at={add(add(A, f.vA), [-0.2, 0, -0.1])} color={C.point} vec sub="A">v</Label>
      {f.vBknown
        ? <Arrow from={B} to={add(B, f.vB)} color={C.point} width={3.5} />
        : <Dashed pts={[B, add(B, f.vB)]} color={C.point} />}
      <Label at={add(add(B, f.vB), [0.2, 0, -0.08])} color={C.point} vec sub="B">v</Label>
      {!f.vBknown && <Label at={add(add(B, f.vB), [0.12, 0, 0.2])} color={C.point}>?</Label>}
      {/* ω and the axis μ */}
      {f.mu > 0.01 && <Line points={[m0 as P3, m1 as P3]} color={C.r} lineWidth={2} />}
      {f.mu > 0.9 && <Label at={add(m1, [0.12, 0, 0.1])} color={C.r}>μ</Label>}
      {f.omega > 0.01 && <Arrow from={CE} to={add(CE, scale(f.omega, w))} color={C.angle} width={6} />}
      {f.omega > 0.9 && <Label at={add(add(CE, w), [0.24, 0, -0.06])} color={C.angle} vec>ω</Label>}
      {/* points */}
      {([['A', A], ['B', B], ['C', Cc], ['E', E]] as const).map(([n, p]) => <Dot key={n} at={p} r={n === 'E' || (n === 'C' && f.mu > 0.9) ? 0.07 : 0.055} />)}
      <Label at={add(A, [-0.22, 0, -0.14])} color={C.point}>A</Label>
      <Label at={add(B, [-0.2, 0, -0.22])} color={C.point}>B</Label>
      <Label at={add(Cc, [0.1, 0, 0.2])} color={C.point}>C</Label>
      <Label at={add(E, [-0.24, 0, -0.06])} color={C.point}>E</Label>
    </Scene>
  );
}
