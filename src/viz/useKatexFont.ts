import { useEffect, useState } from 'react';

/** CSS font shorthand for KaTeX's math italic (the face KaTeX uses for x, M, φ, ρ …). */
export const KATEX_MATH_FONT = (px: number) => `italic 400 ${px}px KaTeX_Math, "Times New Roman", serif`;

/**
 * True once KaTeX_Math (declared by katex.min.css) is loaded. Canvas text drawn before that
 * would silently use the fallback face and never be redrawn, so labels wait for this.
 */
export function useKatexFontReady(): boolean {
  const probe = KATEX_MATH_FONT(32);
  const [ready, setReady] = useState(() => typeof document !== 'undefined' && !!document.fonts?.check(probe, 'φ'));
  useEffect(() => {
    if (ready || typeof document === 'undefined' || !document.fonts) return;
    let alive = true;
    document.fonts.load(probe, 'φ').then(() => alive && setReady(true), () => alive && setReady(true));
    return () => { alive = false; };
  }, [ready, probe]);
  return ready;
}
