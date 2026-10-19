import { Line } from '@react-three/drei';
import { Scene } from '../Scene';
import { CameraRig, DrawFrame } from '../screwDraw';
import { SG_AXIS, SG_CENTER, SG_EDGES, SG_SIZE, SG_VERTS } from '../screwGeom';
import { SA_CAMERA, SA_TARGET, screwFrame } from './screwFrame';

type P3 = [number, number, number];
const EDGE_PTS = SG_EDGES.flatMap(([i, j]) => [SG_VERTS[i] as P3, SG_VERTS[j] as P3]);

/**
 * The slab-shaped body, turned by `angle` about ζ (the vertical line through Z) and shifted by `shift`.
 * `ghost`: a faint copy (where the body was a quarter turn ago, …).
 */
export function ScrewBody({ angle, shift, ghost = false }: { angle: number; shift: readonly [number, number, number]; ghost?: boolean }) {
  const Z = SG_AXIS.point;
  return (
    <group position={[Z[0] + shift[0], Z[1] + shift[1], Z[2] + shift[2]]} rotation={[0, 0, angle]}>
      <group position={[-Z[0], -Z[1], -Z[2]]}>
        <mesh position={SG_CENTER as P3}>
          <boxGeometry args={SG_SIZE} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={ghost ? 0.07 : 0.18} depthWrite={false} />
        </mesh>
        <Line points={EDGE_PTS} segments color={ghost ? '#94a3b8' : '#475569'} lineWidth={ghost ? 1 : 1.5} transparent={ghost} opacity={ghost ? 0.7 : 1} />
      </group>
    </group>
  );
}

/** 3D rendering of `screwFrame(step, t)`: Fig. 3.16 «Zentralachse und Schraube» (lecture p. 24). */
export function ScrewAnim({ step, t }: { step: number; t: number }) {
  const f = screwFrame(step, t);
  return (
    <Scene height={380} camera={SA_CAMERA as P3} target={SA_TARGET as P3}>
      {f.ghosts.map((g, i) => <ScrewBody key={i} angle={g.angle} shift={g.shift} ghost />)}
      <ScrewBody angle={f.angle} shift={f.shift} />
      <DrawFrame f={f} />
      <CameraRig pos={f.cam.pos} target={f.cam.target} />
    </Scene>
  );
}
