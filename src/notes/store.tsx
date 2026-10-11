import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { parseNote, type Note } from './model';

/**
 * Where notes live.
 * - In the published app (claude.ai artifact): the artifact's `db`, in the viewer's private subtree
 *   `data/users/<id>/<noteId>` — kept across devices and republishes, invisible to anyone else.
 * - Elsewhere (local dev, tests) or if that is not available: localStorage of this browser.
 */
interface Backend {
  kind: 'cloud' | 'local';
  subscribe(cb: (notes: Note[]) => void): () => void;
  save(n: Note): Promise<void>;
  remove(id: string): Promise<void>;
}

const LS_KEY = 'mech1.notes';
let memory: Record<string, unknown> = {}; // when localStorage is unavailable (private mode, previews)
const readLocal = (): Record<string, unknown> => {
  try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : {}; } catch { return memory; }
};
const writeLocal = (all: Record<string, unknown>) => {
  memory = all;
  try { localStorage.setItem(LS_KEY, JSON.stringify(all)); } catch { /* keep in memory */ }
};
const toList = (all: Record<string, unknown>) => Object.entries(all).map(([id, d]) => parseNote(id, d)).filter((n): n is Note => !!n);
const body = (n: Note) => { const { id: _id, ...rest } = n; return rest; };

function localBackend(): Backend {
  const listeners = new Set<(notes: Note[]) => void>();
  const emit = () => { const l = toList(readLocal()); listeners.forEach((cb) => cb(l)); };
  return {
    kind: 'local',
    subscribe(cb) {
      listeners.add(cb); cb(toList(readLocal()));
      const on = (e: StorageEvent) => { if (e.key === LS_KEY) emit(); };
      window.addEventListener('storage', on);
      return () => { listeners.delete(cb); window.removeEventListener('storage', on); };
    },
    async save(n) { const all = readLocal(); all[n.id] = body(n); writeLocal(all); },
    async remove(id) { const all = readLocal(); delete all[id]; writeLocal(all); },
  };
}

/* Minimal typing of the claude.ai runtime surface used here (see artifact capability docs: db, user). */
type DocRef = { set(d: Record<string, unknown>): Promise<void>; delete(): Promise<void> };
type Snap = { docs: { id: string; data(): Record<string, unknown> | undefined }[] };
type Coll = { doc(id: string): DocRef; where(f: string, op: string, v: unknown): { onSnapshot(n: (s: Snap) => void, e?: (err: unknown) => void): () => void } };
type DbNs = { collection(path: string): Coll };
type UserNs = { id(): Promise<string | null> };
type ClaudeRT = { use(name: string): Promise<unknown> };

function cloudBackend(db: DbNs, uid: string): Backend {
  const col = db.collection(`data/users/${uid}`);
  return {
    kind: 'cloud',
    subscribe(cb) {
      return col.where('kind', '==', 'note').onSnapshot(
        (s) => cb(s.docs.map((d) => parseNote(d.id, d.data())).filter((n): n is Note => !!n)),
        () => { /* terminal error: keep what we have */ },
      );
    },
    save: (n) => col.doc(n.id).set(body(n)),
    remove: (id) => col.doc(id).delete(),
  };
}

interface NotesCtx {
  notes: Note[];
  backend: 'cloud' | 'local';
  add(n: Note): void;
  update(id: string, patch: Partial<Note>, opts?: { now?: boolean }): void;
  remove(id: string): void;
  focusId: string | null;
  setFocusId(id: string | null): void;
}
const Ctx = createContext<NotesCtx | null>(null);
export const useNotes = () => { const c = useContext(Ctx); if (!c) throw new Error('NotesProvider missing'); return c; };

export function NotesProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend>(() => localBackend());
  const [notes, setNotes] = useState<Note[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const notesRef = useRef<Note[]>([]); notesRef.current = notes;
  // per-note write queue: one write at a time per document, coalescing typing into one write per pause
  const pending = useRef(new Map<string, { timer: number | null; busy: boolean; dirty: boolean }>());
  const backendRef = useRef(backend); backendRef.current = backend;

  // Upgrade to the artifact database when the page runs inside claude.ai.
  useEffect(() => {
    let alive = true;
    const rt = (window as unknown as { claude?: ClaudeRT }).claude;
    if (!rt?.use) return;
    (async () => {
      const [db, user] = (await Promise.all([rt.use('db'), rt.use('user')])) as [DbNs | null, UserNs | null];
      const uid = user ? await user.id() : null;
      if (!alive || !db || !uid) return;
      const cloud = cloudBackend(db, uid);
      const local = toList(readLocal());
      for (const n of local) { try { await cloud.save(n); await localBackend().remove(n.id); } catch { return; /* cannot write: stay local */ } }
      if (alive) setBackend(cloud);
    })().catch(() => { /* stay local */ });
    return () => { alive = false; };
  }, []);

  useEffect(() => backend.subscribe((list) => {
    // keep local edits that are not written yet (latency compensation for typing)
    const mine = new Map(notesRef.current.filter((n) => pending.current.get(n.id)?.dirty || pending.current.get(n.id)?.busy).map((n) => [n.id, n]));
    setNotes(list.map((n) => mine.get(n.id) ?? n).concat([...mine.values()].filter((m) => !list.some((n) => n.id === m.id))));
  }), [backend]);

  const flush = useCallback(async (id: string) => {
    const q = pending.current.get(id);
    if (!q || q.busy) return;
    const n = notesRef.current.find((x) => x.id === id);
    q.dirty = false; q.timer = null;
    if (!n) return;
    q.busy = true;
    try { await backendRef.current.save(n); }
    catch {
      if (backendRef.current.kind === 'cloud') { const lb = localBackend(); await lb.save(n); setBackend(lb); } // read-only here: keep the note locally
    } finally { q.busy = false; }
    if (q.dirty) flush(id);
  }, []);

  const schedule = useCallback((id: string, now: boolean) => {
    const m = pending.current;
    const q = m.get(id) ?? { timer: null, busy: false, dirty: false };
    m.set(id, q);
    q.dirty = true;
    if (q.timer) window.clearTimeout(q.timer);
    q.timer = window.setTimeout(() => flush(id), now ? 0 : 600);
  }, [flush]);

  const value = useMemo<NotesCtx>(() => ({
    notes, backend: backend.kind, focusId, setFocusId,
    add(n) { setNotes((l) => [...l, n]); notesRef.current = [...notesRef.current, n]; schedule(n.id, true); },
    update(id, patch, opts) {
      const next = notesRef.current.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n));
      notesRef.current = next; setNotes(next); schedule(id, !!opts?.now);
    },
    remove(id) {
      const q = pending.current.get(id); if (q?.timer) window.clearTimeout(q.timer); pending.current.delete(id);
      const next = notesRef.current.filter((n) => n.id !== id); notesRef.current = next; setNotes(next);
      backendRef.current.remove(id).catch(() => { /* already gone */ });
    },
  }), [notes, backend.kind, focusId, schedule]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
