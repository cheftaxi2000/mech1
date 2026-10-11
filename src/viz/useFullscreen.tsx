import { useCallback, useEffect, useRef, useState } from 'react';
import { useTr } from '../i18n';

type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };

/**
 * Fullscreen for a figure ("wie bei Netflix"): the browser's Fullscreen API where it is allowed, otherwise
 * (iPhone Safari, an iframe without allowfullscreen) a fixed overlay that covers the whole viewport.
 * Esc leaves both.
 */
export function useFullscreen() {
  const ref = useRef<HTMLElement>(null);
  const [full, setFull] = useState(false);
  const native = useRef(false);
  useEffect(() => {
    const d = document as FsDoc;
    const on = () => {
      const isNative = (d.fullscreenElement ?? d.webkitFullscreenElement) === ref.current && !!ref.current;
      if (native.current && !isNative) { native.current = false; setFull(false); }
    };
    document.addEventListener('fullscreenchange', on);
    document.addEventListener('webkitfullscreenchange', on);
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on); };
  }, []);
  useEffect(() => {
    if (!full || native.current) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', key); };
  }, [full]);
  const toggle = useCallback(async () => {
    const d = document as FsDoc, el = ref.current as FsEl | null;
    if (full) {
      setFull(false);
      if (native.current) { native.current = false; try { await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.()); } catch { /* already left */ } }
      return;
    }
    setFull(true);
    const req = el?.requestFullscreen?.bind(el) ?? el?.webkitRequestFullscreen?.bind(el);
    if (req && (document.fullscreenEnabled ?? true)) {
      try { await req(); native.current = true; } catch { /* not allowed here: the CSS overlay stays */ }
    }
  }, [full]);
  return [ref, full, toggle] as const;
}

/** The ⛶ button in the top right corner of a figure (`.stage` must be position: relative). */
export function FullscreenButton({ full, onClick }: { full: boolean; onClick: () => void }) {
  const tr = useTr();
  return (
    <button type="button" className="fs-btn" onClick={onClick} aria-label={full ? tr('Vollbild beenden', 'Exit fullscreen') : tr('Vollbild', 'Fullscreen')} title={full ? tr('Vollbild beenden (Esc)', 'Exit fullscreen (Esc)') : tr('Vollbild', 'Fullscreen')}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{full
        ? <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
        : <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />}</svg>
    </button>
  );
}
