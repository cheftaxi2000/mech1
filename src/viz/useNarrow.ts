import { useEffect, useState } from 'react';

const Q = '(max-width: 600px)';

/**
 * Canvas height for a 3D figure: on phones the canvas is narrow, the scene is scaled to its width (Scene's FitWidth),
 * and a tall canvas would leave empty bands above and below the scene — so phones get a shorter one.
 */
export function useFigureHeight(height: number, phoneHeight = Math.round(height * 0.78)): number {
  const [narrow, setNarrow] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(Q).matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const m = matchMedia(Q), on = () => setNarrow(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return narrow ? phoneHeight : height;
}
