import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { Vec3 } from '../../physics/vec';
import { C } from '../primitives';
import { RichLabel } from '../RichLabel';
import { CameraRig } from '../screwDraw';
import { Scene } from '../Scene';
import { K6, K6_CAMERA, K6_TARGET, type Col, type Frame3 } from './k6Frames';

type P3 = [number, number, number];

/** 3D colours of the force chapter (the scene background is light in both themes): force/moment vermilion, velocity rose, ω and angles purple, axis μ teal. */
export const K_COL: Record<Col, string> = {
  force: '#ea580c', force2: '#f2a477', vel: C.point, omega: C.angle, axis: C.rho, dark: C.r, muted: C.construct, plus: '#16a34a', minus: '#d97706', point: C.point,
};

/** Arrow with a cone head (line + cone like primitives' Arrow); `double` adds the second head of an axial vector (ω̲, M̲); `o` = opacity. */
export function KArrow({ from, to, color, width = 2, o = 1, double = false }: { from: Vec3; to: Vec3; color: string; width?: number; o?: number; double?: boolean }) {
  const g = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const d = b.clone().sub(a), len = d.length();
    if (len < 1e-6) return null;
    const u = d.clone().normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), u);
    let r = 0.026 + 0.0125 * width, h = 3.1 * r;
    const maxH = (double ? 0.3 : 0.45) * len;
    if (h > maxH) { const k = maxH / h; r *= k; h *= k; }
    const gap = double ? 0.85 * h : 0;
    const base = b.clone().sub(u.clone().multiplyScalar(h * 0.92 + gap)).toArray() as P3;
    const head = (back: number) => b.clone().sub(u.clone().multiplyScalar(back + h / 2));
    return { quat, base, r, h, heads: double ? [head(0), head(gap)] : [head(0)] };
  }, [from, to, width, double]);
  if (!g || o <= 0.01) return null;
  const fade = o < 0.999;
  return (
    <group>
      <Line points={[from as P3, g.base]} color={color} lineWidth={width} transparent={fade} opacity={o} />
      {g.heads.map((p, i) => (
        <mesh key={i} position={p} quaternion={g.quat}>
          <coneGeometry args={[g.r, g.h, 20]} />
          <meshBasicMaterial color={color} transparent={fade} opacity={o} />
        </mesh>
      ))}
    </group>
  );
}

/** A flat translucent polygon (the base of the parallelepiped): fan of triangles from the first corner. */
function Face({ pts, color, o }: { pts: Vec3[]; color: string; o: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const v: number[] = [];
    for (let i = 1; i < pts.length - 1; i++) v.push(...pts[0], ...pts[i], ...pts[i + 1]);
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    return g;
  }, [pts]);
  if (o <= 0.01) return null;
  return <mesh geometry={geo}><meshBasicMaterial color={color} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} /></mesh>;
}

/** The body K: a disc in the plane z = 0 about the axis (translucent, with its rim). */
function Disc({ o }: { o: number }) {
  const rim = useMemo(() => Array.from({ length: 73 }, (_, i) => [K6.R_DISC * Math.cos((2 * Math.PI * i) / 72), K6.R_DISC * Math.sin((2 * Math.PI * i) / 72), 0] as P3), []);
  if (o <= 0.01) return null;
  return (
    <group>
      <mesh rotation={[0, 0, 0]}>
        <circleGeometry args={[K6.R_DISC, 64]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.16 * o} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Line points={rim} color="#64748b" lineWidth={1.6} transparent opacity={0.8 * o} />
    </group>
  );
}

/** Draws a frame: the body, translucent faces, lines, arrows, dots, labels (on top). */
export function FrameDraw({ f }: { f: Frame3 }) {
  return (
    <>
      <Disc o={f.disc} />
      {f.faces.map((x) => <Face key={x.key} pts={x.pts} color={K_COL[x.col]} o={x.o} />)}
      {f.lines.map((l) => (l.pts.length > 1 && (l.o ?? 1) > 0.01 ? (
        <Line key={l.key} points={l.pts as P3[]} color={K_COL[l.col]} lineWidth={l.w} transparent={(l.o ?? 1) < 0.999} opacity={l.o ?? 1}
          {...(l.dashed ? { dashed: true, dashSize: 0.06, gapSize: 0.05 } : {})} />
      ) : null))}
      {f.arrows.map((a) => <KArrow key={a.key} from={a.from} to={a.to} color={K_COL[a.col]} width={a.w} o={a.o ?? 1} double={a.double} />)}
      {f.dots.map((d) => (d.o ?? 1) > 0.01 ? (
        <mesh key={d.key} position={d.at as P3}>
          <sphereGeometry args={[d.r, 20, 20]} />
          <meshBasicMaterial color={K_COL[d.col]} />
        </mesh>
      ) : null)}
      {f.labels.map((l) => (l.o ?? 1) > 0.4 ? <RichLabel key={l.key} at={l.at} parts={l.parts} color={K_COL[l.col]} /> : null)}
    </>
  );
}

/** A 3D canvas showing one frame, in the lesson's start view (x toward the lower right, y toward the upper right, z up). */
export function FrameScene({ f, height = 420 }: { f: Frame3; height?: number | string }) {
  const camera = f.cam?.pos ?? K6_CAMERA, target = f.cam?.target ?? K6_TARGET;
  return (
    <Scene height={height} camera={camera as P3} target={target as P3}>
      <FrameDraw f={f} />
      <CameraRig pos={camera} target={target} />
    </Scene>
  );
}
