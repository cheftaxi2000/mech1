import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { PerspectiveCamera } from 'three';
import { OrbitControls } from '@react-three/drei';
import type { ReactNode } from 'react';
import { useTr } from '../i18n';

const FOV = 38, REF_ASPECT = 1.25;
/** On narrow (portrait) canvases widen the vertical field of view so the horizontal extent stays the same. */
function FitWidth() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const cam = camera as PerspectiveCamera, a = size.width / Math.max(1, size.height);
    const fov = a >= REF_ASPECT ? FOV : (2 * Math.atan(Math.tan((FOV * Math.PI) / 360) * (REF_ASPECT / a)) * 180) / Math.PI;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); invalidate(); }
  }, [camera, size.width, size.height, invalidate]);
  return null;
}

/** Standard z-up scene, viewed like the lecture's Fig. 1.4/1.8: z up, x-axis toward the lower right, y-axis toward the upper right. */
export function Scene({ children, height = 420, camera = [5.7, -5.7, 4.1], target = [0.2, 0.2, 0.2] }: {
  children: ReactNode; height?: number | string;
  /** Camera position and orbit target; the default frames the ±2.4 axes of the coordinate explorer. */
  camera?: [number, number, number]; target?: [number, number, number];
}) {
  const tr = useTr();
  return (
    <div className="scene" style={{ height }}>
      <Canvas
        frameloop="demand"
        camera={{ position: camera, up: [0, 0, 1], fov: FOV }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <FitWidth />
        <OrbitControls makeDefault enablePan={false} target={target} />
        {children}
      </Canvas>
      <div className="scene-hint">{tr('ziehen zum Drehen · scrollen oder zwei Finger zum Zoomen', 'drag to rotate · scroll or pinch to zoom')}</div>
    </div>
  );
}
