import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { PerspectiveCamera } from 'three';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
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

/**
 * Touch: inside the page a vertical swipe over a figure scrolls the page (touch-action: pan-y; OrbitControls
 * would otherwise claim every touch), a sideways drag turns the figure. In fullscreen every gesture belongs to
 * the figure. OrbitControls sets touch-action: none on its element when it connects, so it is reset here.
 */
function TouchPolicy({ full }: { full: boolean }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const apply = () => { el.style.touchAction = full ? 'none' : 'pan-y'; };
    apply();
    const id = window.setTimeout(apply, 0); // after OrbitControls has connected
    return () => window.clearTimeout(id);
  }, [gl, full]);
  return null;
}

/** Standard z-up scene, viewed like the lecture's Fig. 1.4/1.8: z up, x-axis toward the lower right, y-axis toward the upper right.
 * `height="100%"` means the figure is in fullscreen: then the wheel / pinch zooms; inside the page the wheel scrolls the page.
 * The ↺ button brings the view back to the start (the lecture's orientation). */
export function Scene({ children, height = 420, camera = [5.7, -5.7, 4.1], target = [0.2, 0.2, 0.2] }: {
  children: ReactNode; height?: number | string;
  /** Camera position and orbit target; the default frames the ±2.4 axes of the coordinate explorer. */
  camera?: [number, number, number]; target?: [number, number, number];
}) {
  const tr = useTr();
  const full = height === '100%';
  const controls = useRef<OrbitControlsImpl>(null);
  return (
    <div className="scene" style={{ height }}>
      <Canvas
        frameloop="demand"
        camera={{ position: camera, up: [0, 0, 1], fov: FOV }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <FitWidth />
        <TouchPolicy full={full} />
        <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom={full} target={target} />
        {children}
      </Canvas>
      <button type="button" className="view-reset" onClick={() => controls.current?.reset()}
        aria-label={tr('Ansicht zurücksetzen', 'Reset view')} title={tr('Startansicht', 'Start view')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5" /></svg>
      </button>
      <div className="scene-hint">{full
        ? tr('ziehen zum Drehen · zwei Finger oder Mausrad zum Zoomen', 'drag to rotate · pinch or scroll to zoom')
        : tr('seitlich ziehen zum Drehen · Vollbild zum Zoomen', 'drag sideways to rotate · fullscreen to zoom')}</div>
    </div>
  );
}
