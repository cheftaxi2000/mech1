import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ReactNode } from 'react';

/** Standard z-up scene with the lecture's oblique-ish default view (x toward the viewer, y right, z up). */
export function Scene({ children, height = 420 }: { children: ReactNode; height?: number }) {
  return (
    <div className="scene" style={{ height }}>
      <Canvas
        camera={{ position: [7.2, 4.0, 3.6], up: [0, 0, 1], fov: 38 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <OrbitControls makeDefault enablePan={false} target={[0, 0.2, 0]} />
        {children}
      </Canvas>
      <div className="scene-hint">drag to rotate · scroll to zoom</div>
    </div>
  );
}
