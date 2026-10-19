import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { Scene } from '../Scene';
import { Arrow, C, Label } from '../primitives';
import { CameraRig, DrawFrame } from '../screwDraw';
import { type Vec3, scale } from '../../physics/vec';
import { CS_CAM, CS_VERTS, cubeScrewFrame } from './cubeScrewFrame';

type P3 = [number, number, number];
const AX = 1.55;
/** 12 edges of a cube whose vertices are indexed x·4 + y·2 + z. */
const edgesOf = (v: Vec3[]): P3[] => {
  const segs: P3[] = [];
  for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) segs.push(v[i] as P3, v[i | bit] as P3);
  return segs;
};

/** Faces of the cube as a translucent mesh through its 8 (moved) corners. */
function CubeFaces({ verts, opacity }: { verts: Vec3[]; opacity: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts.flatMap((v) => [...v]), 3));
    // two triangles per face; vertex index = x·4 + y·2 + z
    g.setIndex([0, 1, 3, 0, 3, 2, 4, 6, 7, 4, 7, 5, 0, 4, 5, 0, 5, 1, 2, 3, 7, 2, 7, 6, 0, 2, 6, 0, 6, 4, 1, 5, 7, 1, 7, 3]);
    return g;
  }, [verts]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color="#94a3b8" transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** 3D rendering of `cubeScrewFrame(step, t)`: Problem Fig. 3.30 (lecture p. 25 and the handwritten solution). */
export function CubeScrewAnim({ step, t }: { step: number; t: number }) {
  const f = cubeScrewFrame(step, t);
  return (
    <Scene height={380} camera={CS_CAM.pos as P3} target={CS_CAM.target as P3}>
      {/* axes as in Fig. 3.30: B at the origin, x toward the viewer, y to the right, z up */}
      {([[AX, 0, 0], [0, AX, 0], [0, 0, 1.32]] as Vec3[]).map((p, i) => (
        <group key={i}>
          <Arrow to={p} color={C.axis} width={1.2} />
          <Label at={scale(1.08, p)} color={C.axis}>{'xyz'[i]}</Label>
        </group>
      ))}
      {f.ghost && <Line points={edgesOf(CS_VERTS)} segments color={C.construct} lineWidth={1} dashed dashSize={0.05} gapSize={0.04} />}
      <CubeFaces verts={f.verts} opacity={0.13} />
      <Line points={edgesOf(f.verts)} segments color={C.r} lineWidth={1.8} />
      <DrawFrame f={f} />
      <CameraRig pos={f.cam.pos} target={f.cam.target} />
    </Scene>
  );
}
