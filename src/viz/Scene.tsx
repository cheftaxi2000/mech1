import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ReactNode } from 'react';
import { useTr } from '../i18n';

/** Standard z-up scene, viewed like the lecture's Fig. 1.4/1.8: z up, x-axis toward the lower right, y-axis toward the upper right. */
export function Scene({ children, height = 420 }: { children: ReactNode; height?: number }) {
  const tr = useTr();
  return (
    <div className="scene" style={{ height }}>
      <Canvas
        camera={{ position: [5.7, -5.7, 4.1], up: [0, 0, 1], fov: 38 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <OrbitControls makeDefault enablePan={false} target={[0.2, 0.2, 0.2]} />
        {children}
      </Canvas>
      <div className="scene-hint">{tr('ziehen zum Drehen · scrollen oder zwei Finger zum Zoomen', 'drag to rotate · scroll or pinch to zoom')}</div>
    </div>
  );
}
