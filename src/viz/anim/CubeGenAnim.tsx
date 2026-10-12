import { Line } from '@react-three/drei';
import { Scene } from '../Scene';
import { Arrow, C, Dot, Label } from '../primitives';
import { type Vec3, add, normalize, scale, sub } from '../../physics/vec';
import { CG, G1, G2, G3, GB, G_M_INDEX, G_OMEGA, G_OTHERS, G_VERTS, cubeGenFrame } from './cubeGenFrame';

const AX = 2.2;
type P3 = [number, number, number];
/** 12 edges of a cube whose vertices are indexed x·4 + y·2 + z. */
const EDGES: P3[] = (() => {
  const segs: P3[] = [];
  for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) segs.push(G_VERTS[i] as P3, G_VERTS[i | bit] as P3);
  return segs;
})();
const { L } = CG;
const MID: Vec3 = [L / 2, L / 2, L / 2];
const WDIR = normalize(G_OMEGA);
const OM0 = add(G3, scale(0.12, sub(G1, G3))), OMLEN = 0.85;

/** 3D rendering of `cubeGenFrame(step, t)` (lesson «allgemeine Bewegung», lecture p. 23). */
export function CubeGenAnim({ step, t }: { step: number; t: number }) {
  const f = cubeGenFrame(step, t);
  const tip = (P: Vec3, v: Vec3, k = 1) => add(P, scale(k, v));
  return (
    <Scene height={380} camera={[5.0, 2.8, 4.8]} target={[0.75, 0.75, 0.6]}>
      {/* axes as in the lecture's figure: B at the origin, x toward the viewer, y to the right, z up */}
      {([[AX, 0, 0], [0, AX, 0], [0, 0, AX]] as Vec3[]).map((p, i) => (
        <group key={i}>
          <Arrow to={p} color={C.axis} width={1.2} />
          <Label at={scale(1.07, p)} color={C.axis}>{'xyz'[i]}</Label>
        </group>
      ))}
      <mesh position={MID as P3}>
        <boxGeometry args={[L, L, L]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <Line points={EDGES} segments color={C.r} lineWidth={1.8} />
      {/* step 1: the space diagonal P₁P₃ — ω is parallel to it */}
      {f.diag > 0.01 && <Line points={[G1 as P3, add(G1, scale(f.diag, sub(G3, G1))) as P3]} color={C.angle} lineWidth={2} dashed dashSize={0.08} gapSize={0.06} />}
      {/* step 2: the edge P₃P₂ and v₂ − v₃ */}
      {f.edge32 > 0.01 && <Arrow from={G3} to={add(G3, scale(f.edge32, sub(G2, G3)))} color={C.r} width={3} />}
      {/* v₂ = v₃ + ω × P₃P₂: at P₂ the copy of v₃ (grey), then ω × P₃P₂ = (v, 0, v) from its tip to the tip of v₂ */}
      {f.copy32 > 0.01 && <Arrow from={G2} to={tip(G2, f.v3, f.copy32)} color={C.axis} width={2.2} />}
      {f.copy32 > 0.9 && <Label at={add(tip(G2, f.v3), [0, -0.05, -0.2])} color={C.axis} vec sub="3">v</Label>}
      {f.diff > 0.01 && <Arrow from={tip(G2, f.v3)} to={tip(tip(G2, f.v3), f.diffVec, f.diff)} color={C.angle} width={3.5} />}
      {/* ω (a free vector, drawn on the upper part of the diagonal P₃P₁, pointing toward P₁) */}
      {f.omega > 0.01 && <Arrow from={OM0} to={add(OM0, scale(f.omega * OMLEN, WDIR))} color={C.angle} width={6} />}
      {f.omega > 0.9 && <Label at={add(add(OM0, scale(0.5 * OMLEN, WDIR)), [0, 0.22, 0.1])} color={C.angle} vec>ω</Label>}
      {/* step 3: P₃B and v_B */}
      {f.edge3B > 0.01 && <Arrow from={G3} to={add(G3, scale(f.edge3B, sub(GB, G3)))} color={C.r} width={3} />}
      {f.vB > 0.01 && <Arrow from={GB} to={tip(GB, f.vBd, f.vB)} color={C.point} width={3.5} />}
      {f.vB > 0.9 ? <Label at={add(tip(GB, f.vBd), [0.05, 0.05, -0.2])} color={C.point} vec sub="B">v</Label> : <Label at={[0.3, -0.1, -0.28]} color={C.point}>?</Label>}
      {/* the given velocities */}
      <Arrow from={G1} to={tip(G1, f.v1)} color={C.point} width={3.5} />
      <Arrow from={G2} to={tip(G2, f.v2)} color={C.point} width={3.5} />
      <Arrow from={G3} to={tip(G3, f.v3)} color={C.point} width={3.5} />
      <Label at={add(tip(G1, f.v1), [0, 0.1, 0.2])} color={C.point} vec sub="1">v</Label>
      <Label at={add(tip(G2, f.v2), [0, 0.15, 0.08])} color={C.point} vec sub="2">v</Label>
      <Label at={add(tip(G3, f.v3), [0, 0.18, 0.12])} color={C.point} vec sub="3">v</Label>
      {/* step 4: the other corners */}
      {f.others > 0.01 && G_OTHERS.map((P, i) => <Arrow key={i} from={P} to={tip(P, f.othersV[i], f.others)} color={C.point} width={2} />)}
      {/* one corner named as an example: v_M = v_B + ω × BM = (0, −v, 0) */}
      {f.others > 0.9 && <>
        <Dot at={G_OTHERS[G_M_INDEX]} r={0.05} />
        <Label at={add(G_OTHERS[G_M_INDEX], [0.1, 0.12, 0.2])} color={C.point}>M</Label>
        <Label at={add(tip(G_OTHERS[G_M_INDEX], f.othersV[G_M_INDEX]), [0, -0.12, 0.17])} color={C.point} vec sub="M">v</Label>
      </>}
      {/* points */}
      {([GB, G1, G2, G3] as Vec3[]).map((p, i) => <Dot key={i} at={p} r={0.06} />)}
      <Label at={[0.05, -0.26, -0.08]} color={C.point}>B</Label>
      <Label at={add(G1, [0.12, 0.12, -0.24])} color={C.point} sub="1">P</Label>
      <Label at={add(G2, [0, 0.3, -0.05])} color={C.point} sub="2">P</Label>
      <Label at={add(G3, [0, -0.3, 0])} color={C.point} sub="3">P</Label>
    </Scene>
  );
}
