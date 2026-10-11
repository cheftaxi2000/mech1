import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import '@fontsource/caveat/latin-500.css';
import '@fontsource/caveat/latin-700.css';
import { useTr } from '../i18n';
import { NOTE_COLORS, NOTE_W, anchorAt, newId, positionOf, tiltOf, type Note, type NoteColor, type Rect } from './model';
import { useNotes } from './store';

const rectOf = (el: Element): Rect => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
const noteWidth = () => (typeof window !== 'undefined' && window.innerWidth < 520 ? 172 : NOTE_W);

/** The section under a viewport point (ignoring the placing overlay and notes). */
function sectionAt(x: number, y: number, wrap: HTMLElement): HTMLElement | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (!wrap.contains(el) || el.closest('.notes-overlay, .sticky')) continue;
    return (el.closest('section[id]') as HTMLElement | null);
  }
  return null;
}

/**
 * Sticky notes for one lesson: the "pin a note" button, the placing mode (tap where the note should go),
 * and the notes themselves, anchored to the section they were placed in.
 */
export function NotesLayer({ topic, wrapRef }: { topic: string; wrapRef: RefObject<HTMLDivElement | null> }) {
  const tr = useTr();
  const { notes, add, update, remove, focusId, setFocusId } = useNotes();
  const [placing, setPlacing] = useState(false);
  const [, setTick] = useState(0); // re-layout when the lesson reflows
  const [undo, setUndo] = useState<Note | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const mine = notes.filter((n) => n.topic === topic);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setTick((k) => k + 1));
    ro.observe(el);
    const on = () => setTick((k) => k + 1);
    window.addEventListener('resize', on);
    return () => { ro.disconnect(); window.removeEventListener('resize', on); };
  }, [wrapRef]);

  useEffect(() => {
    if (!placing) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setPlacing(false); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [placing]);

  useEffect(() => { if (!undo) return; const id = window.setTimeout(() => setUndo(null), 6000); return () => window.clearTimeout(id); }, [undo]);

  // bring a note from the chapter list into view
  useEffect(() => {
    if (!focusId) return;
    const id = window.setTimeout(() => {
      const el = document.querySelector(`[data-note="${focusId}"]`);
      if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.add('flash'); window.setTimeout(() => el.classList.remove('flash'), 1600); }
      setFocusId(null);
    }, 350);
    return () => window.clearTimeout(id);
  }, [focusId, setFocusId, mine.length]);

  const place = (e: React.PointerEvent) => {
    e.preventDefault(); // no compatibility mousedown: focus must stay in the new note
    const wrap = wrapRef.current;
    if (!wrap) return;
    const sec = sectionAt(e.clientX, e.clientY, wrap);
    const w = noteWidth();
    const a = anchorAt(e.clientX - w / 2, e.clientY - 18, rectOf(wrap), sec ? rectOf(sec) : null, w);
    const n: Note = { id: newId(), kind: 'note', topic, section: sec?.id ?? '', fx: a.fx, fy: a.fy, text: '', color: 'yellow', folded: false, createdAt: Date.now(), updatedAt: Date.now() };
    add(n); setEditing(n.id); setPlacing(false);
  };

  const del = (n: Note) => { remove(n.id); setUndo(n); };

  const wrap = wrapRef.current;
  return (
    <>
      {placing && <div className="notes-overlay" onPointerDown={place} aria-hidden="true" />}
      {wrap && mine.map((n) => {
        const sec = n.section ? wrap.querySelector<HTMLElement>(`section#${CSS.escape(n.section)}`) : null;
        const pos = positionOf(n, rectOf(wrap), sec ? rectOf(sec) : null, noteWidth());
        return <StickyNote key={n.id} note={n} pos={pos} wrap={wrap} autoFocus={editing === n.id} onDone={() => setEditing(null)}
          onChange={(patch, now) => update(n.id, patch, { now })} onDelete={(silent) => (silent ? remove(n.id) : del(n))} />;
      })}
      {placing && <div className="notes-hint" role="status"><span>{tr('Tippe dorthin, wo die Notiz hin soll', 'Tap where the note should go')}</span><button type="button" onClick={() => setPlacing(false)}>{tr('Abbrechen', 'Cancel')}</button></div>}
      {undo && <div className="notes-hint undo" role="status"><span>{tr('Notiz gelöscht', 'Note deleted')}</span><button type="button" onClick={() => { add(undo); setUndo(null); }}>{tr('Rückgängig', 'Undo')}</button></div>}
      <button type="button" className={`note-fab${placing ? ' active' : ''}`} onClick={() => setPlacing((p) => !p)}
        aria-pressed={placing} aria-label={placing ? tr('Abbrechen', 'Cancel') : tr('Notiz anheften', 'Pin a note')} title={tr('Notiz anheften', 'Pin a note')}>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {placing
            ? <path d="M10 10l12 12M22 10L10 22" className="fab-x" />
            : (<>
              <path d="M6 5h20v14l-8 8H6z" className="fab-paper" />
              <path d="M18 27v-8h8" className="fab-fold" />
              <path d="M12 11v8M8 15h8" className="fab-plus" />
            </>)}
        </svg>
        <span className="note-fab-label">{placing ? tr('Abbrechen', 'Cancel') : tr('Notiz', 'Note')}</span>
      </button>
    </>
  );
}

function StickyNote({ note, pos, wrap, autoFocus, onDone, onChange, onDelete }: {
  note: Note; pos: { left: number; top: number }; wrap: HTMLElement; autoFocus: boolean; onDone(): void;
  onChange(patch: Partial<Note>, now?: boolean): void; onDelete(silent?: boolean): void;
}) {
  const tr = useTr();
  const ta = useRef<HTMLTextAreaElement>(null);
  const [drag, setDrag] = useState<{ dx: number; dy: number; x: number; y: number } | null>(null);
  const [text, setText] = useState(note.text);
  useEffect(() => { if (document.activeElement !== ta.current) setText(note.text); }, [note.text]);

  const grow = useCallback(() => { const el = ta.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; }, []);
  useLayoutEffect(grow, [text, note.folded, grow]);
  useEffect(() => { if (autoFocus && ta.current) { ta.current.focus(); onDone(); } }, [autoFocus, onDone]);

  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, textarea')) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ dx: 0, dy: 0, x: e.clientX, y: e.clientY });
  };
  const moveDrag = (e: React.PointerEvent) => { if (drag) setDrag({ ...drag, dx: e.clientX - drag.x, dy: e.clientY - drag.y }); };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag) return;
    const moved = Math.hypot(drag.dx, drag.dy) > 4;
    setDrag(null);
    if (!moved) { if (note.folded) onChange({ folded: false }, true); return; }
    const w = rectOf(wrap);
    const left = pos.left + drag.dx + w.left, top = pos.top + drag.dy + w.top; // new top-left corner in viewport coordinates
    const sec = sectionAt(Math.min(w.left + w.width - 1, left + 20), Math.max(top, 0) + 4, wrap);
    const a = anchorAt(left, top, w, sec ? rectOf(sec) : null, note.folded ? 52 : noteWidth());
    onChange({ section: sec?.id ?? '', fx: a.fx, fy: a.fy }, true);
    e.stopPropagation();
  };

  const style = {
    left: pos.left + (drag?.dx ?? 0), top: pos.top + (drag?.dy ?? 0),
    ['--tilt' as string]: `${drag ? 0 : tiltOf(note.id)}deg`,
  };
  const label = text.trim().split('\n')[0].slice(0, 40);
  if (note.folded) {
    return (
      <div className={`sticky folded c-${note.color}${drag ? ' dragging' : ''}`} style={style} data-note={note.id}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag}>
        <button type="button" className="sticky-unfold" onClick={() => onChange({ folded: false }, true)} aria-label={tr(`Notiz öffnen: ${label}`, `Open note: ${label}`)} title={label}>
          <span aria-hidden="true">{label ? label[0] : '✎'}</span>
        </button>
      </div>
    );
  }
  return (
    <div className={`sticky c-${note.color}${drag ? ' dragging' : ''}`} style={style} data-note={note.id}
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag}>
      <div className="sticky-tape" aria-hidden="true" />
      <textarea ref={ta} value={text} rows={2} placeholder={tr('Notiz schreiben …', 'Write a note …')} aria-label={tr('Notiz', 'Note')}
        onChange={(e) => { setText(e.target.value); onChange({ text: e.target.value }); }}
        onBlur={() => { if (!text.trim()) { if (Date.now() - note.createdAt > 600) onDelete(true); else ta.current?.focus(); } else if (text !== note.text) onChange({ text }, true); }} />
      <div className="sticky-tools">
        <div className="sticky-colors" role="group" aria-label={tr('Farbe', 'Colour')}>
          {NOTE_COLORS.map((c: NoteColor) => (
            <button key={c} type="button" className={`dot c-${c}${note.color === c ? ' on' : ''}`} aria-pressed={note.color === c}
              aria-label={tr({ yellow: 'Gelb', pink: 'Rosa', green: 'Grün', blue: 'Blau' }[c], c)}
              onPointerDown={(e) => e.preventDefault()} onClick={() => onChange({ color: c }, true)} />
          ))}
        </div>
        <button type="button" className="sticky-btn" onPointerDown={(e) => e.preventDefault()} onClick={() => onChange({ folded: true }, true)} aria-label={tr('Zusammenklappen', 'Fold')} title={tr('Zusammenklappen', 'Fold')}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 12l5-5 5 5" /></svg>
        </button>
        <button type="button" className="sticky-btn" onPointerDown={(e) => e.preventDefault()} onClick={() => onDelete()} aria-label={tr('Löschen', 'Delete')} title={tr('Löschen', 'Delete')}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" /></svg>
        </button>
      </div>
    </div>
  );
}
