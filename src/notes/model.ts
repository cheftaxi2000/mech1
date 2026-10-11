/**
 * Sticky notes ("Haftnotizen"): data model and pure placement maths.
 * A note is anchored to a lesson section, so it stays next to the same text when the layout reflows
 * (phone ↔ iPad, German ↔ English): `fx` = left edge as a fraction of the lesson width,
 * `fy` = top edge as a fraction of the section height.
 */
export type NoteColor = 'yellow' | 'pink' | 'green' | 'blue';
export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'green', 'blue'];

export interface Note {
  id: string;
  kind: 'note';
  topic: string; // lesson id, e.g. "koordinaten"
  section: string; // section element id ('' = top of the lesson)
  fx: number;
  fy: number;
  text: string;
  color: NoteColor;
  folded: boolean;
  createdAt: number;
  updatedAt: number;
}

export const NOTE_W = 210; // px, unfolded width (phone: CSS shrinks it)

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Small stable tilt in degrees (−2.5 … 2.5) derived from the id, like a note stuck on by hand. */
export function tiltOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 51) - 25) / 10;
}

export interface Rect { left: number; top: number; width: number; height: number }

/** Anchor for a point (clientX, clientY): fractions relative to the lesson box and the section box. */
export function anchorAt(x: number, y: number, wrap: Rect, sec: Rect | null, noteW = NOTE_W): { fx: number; fy: number } {
  const maxFx = wrap.width > noteW ? (wrap.width - noteW) / wrap.width : 0;
  const fx = Math.min(maxFx, clamp01((x - wrap.left) / wrap.width));
  const s = sec ?? wrap;
  return { fx, fy: clamp01((y - s.top) / Math.max(1, s.height)) };
}

/** Pixel position of a note inside the lesson box. */
export function positionOf(n: Pick<Note, 'fx' | 'fy'>, wrap: Rect, sec: Rect | null, noteW = NOTE_W): { left: number; top: number } {
  const s = sec ?? wrap;
  const left = Math.max(0, Math.min(wrap.width - noteW, n.fx * wrap.width));
  return { left, top: s.top - wrap.top + n.fy * s.height };
}

export const newId = () => `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Accepts only well-formed notes (data read from storage is untrusted). */
export function parseNote(id: string, d: unknown): Note | null {
  if (!d || typeof d !== 'object') return null;
  const o = d as Record<string, unknown>;
  if (o.kind !== 'note' || typeof o.topic !== 'string' || typeof o.text !== 'string') return null;
  const num = (v: unknown, dflt: number) => (typeof v === 'number' && Number.isFinite(v) ? v : dflt);
  return {
    id, kind: 'note', topic: o.topic, section: typeof o.section === 'string' ? o.section : '',
    fx: clamp01(num(o.fx, 0.1)), fy: clamp01(num(o.fy, 0)), text: o.text.slice(0, 4000),
    color: NOTE_COLORS.includes(o.color as NoteColor) ? (o.color as NoteColor) : 'yellow',
    folded: o.folded === true, createdAt: num(o.createdAt, 0), updatedAt: num(o.updatedAt, 0),
  };
}
