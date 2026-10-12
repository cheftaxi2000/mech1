import { Suspense, useEffect, useRef, useState } from 'react';
import { NotesLayer } from './notes/StickyNotes';
import { NotesProvider, useNotes } from './notes/store';
import { CHAPTERS, TOPICS, type Status, type Topic } from './content/curriculum';
import { LangToggle, T, useLang, useTr } from './i18n';

const useHashRoute = () => {
  // Plain `#topic` anchors (no slash): the claude.ai artifact viewer only passes bare tokens through. Old `#/topic` links still work.
  const read = () => window.location.hash.replace(/^#\/?/, '');
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
};

const STATUS_LABEL: Record<Status, [string, string]> = {
  planned: ['geplant', 'planned'],
  draft: ['Entwurf', 'draft'],
  review: ['bereit zur Durchsicht', 'ready for review'],
  complete: ['abgeschlossen', 'complete'],
};

function Home() {
  return (
    <article className="lesson">
      <h1>Mechanik I – Learning Lab</h1>
      <T
        de={<>
          <p className="lede">
            Ein interaktiver Begleiter zum Skript der ETH-Vorlesung Mechanik I. Jede Lektion folgt dem Skript Seite für Seite,
            kennzeichnet klar, was <span className="src">aus der Vorlesung</span> stammt und was Ergänzung ist, und markiert alles im Skript, was geprüft werden muss.
          </p>
          <p>Beginne mit <a href="#koordinaten">Lage &amp; Koordinaten</a>. Alle zwölf Lektionen folgen dem Skript bis S. 23; am Schluss gibt es drei <a href="#quiz-1">Quiz-Seiten</a> zum Üben. Alle Kapitel findest du auch jederzeit im Menü oben links.</p>
        </>}
        en={<>
          <p className="lede">
            An interactive companion to the ETH Mechanics 1 lecture notes. Each lesson follows the notes page by page,
            marks clearly what comes <span className="src">from the lecture</span> and what is a supplement, and flags anything in the source that needs checking.
          </p>
          <p>Start with <a href="#koordinaten">Position &amp; coordinates</a>. All twelve lessons follow the notes up to p. 23; at the end there are three <a href="#quiz-1">quiz pages</a> for practice. All chapters are also in the menu at the top left.</p>
        </>}
      />
      <nav className="home-chapters"><ChapterList route="" /></nav>
    </article>
  );
}

function TopicPage({ topic }: { topic: Topic }) {
  const lang = useLang(), tr = useTr();
  const wrapRef = useRef<HTMLDivElement>(null);
  const C = topic.component;
  return (
    <>
      <header className="lesson-head">
        <div className="crumbs">{tr(...CHAPTERS[topic.chapter])} · {tr(`Vorlesung S. ${topic.pages}`, `Lecture notes ${topic.pages.includes("–") ? "pp." : "p."} ${topic.pages}`)}</div>
        <h1>{tr(...topic.title)}</h1>
        <div className="sub">
          {lang === 'en' && <span lang="de"><em>{topic.title[0]}</em></span>}
          <span className={`status status-${topic.status}`}>{tr(...STATUS_LABEL[topic.status])}</span>
        </div>
      </header>
      <div className="lesson-wrap" ref={wrapRef}>
        {C ? <Suspense fallback={<p>{tr('Wird geladen …', 'Loading…')}</p>}><C /></Suspense>
          : <p className="placeholder">{tr('Diese Lektion ist noch nicht geschrieben.', 'This lesson has not been written yet.')}</p>}
        {C && <NotesLayer topic={topic.id} wrapRef={wrapRef} />}
      </div>
    </>
  );
}

/** All chapters and lessons; used in the drawer and on the home page. */
function ChapterList({ route, onPick }: { route: string; onPick?: () => void }) {
  const tr = useTr();
  return (
    <>
      {Object.entries(CHAPTERS).map(([ch, name]) => (
        <div key={ch} className="chapter">
          <div className="chapter-name">{tr(...name)}</div>
          <ul>
            {TOPICS.filter((t) => t.chapter === ch).map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} onClick={onPick} aria-current={t.id === route ? 'page' : undefined}
                  className={`${t.id === route ? 'active' : ''} ${t.status === 'planned' ? 'muted' : ''}`}>
                  <span className={`dot dot-${t.status}`} />{tr(...t.title)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

/** All pinned notes, grouped by lesson; a click opens the lesson and brings the note into view. */
function NotesList({ onPick }: { onPick: () => void }) {
  const tr = useTr();
  const { notes, setFocusId, backend } = useNotes();
  const withText = notes.filter((n) => n.text.trim() || n.title.trim());
  return (
    <div className="chapter notes-list">
      <div className="chapter-name">{tr('Meine Notizen', 'My notes')} ({withText.length})</div>
      {withText.length === 0
        ? <p className="notes-empty">{tr('Noch keine Notizen. In jeder Lektion unten rechts auf «Notiz» tippen.', 'No notes yet. In any lesson, tap “Note” at the bottom right.')}</p>
        : <ul>
          {TOPICS.filter((t) => withText.some((n) => n.topic === t.id)).map((t) => withText.filter((n) => n.topic === t.id).sort((a, b) => a.createdAt - b.createdAt).map((n) => (
            <li key={n.id}>
              <a href={`#${t.id}`} onClick={() => { setFocusId(n.id); onPick(); }}>
                <span className={`note-swatch c-${n.color}`} />
                <span className="note-snippet"><b>{tr(...t.title)}</b><strong>{n.title.trim() || n.text.trim().split('\n')[0].slice(0, 60)}</strong>{n.title.trim() && n.text.trim() ? <span>{n.text.trim().split('\n')[0].slice(0, 60)}</span> : null}</span>
              </a>
            </li>
          )))}
        </ul>}
      <p className="notes-where">{backend === 'cloud' ? tr('Privat gespeichert – nur du siehst deine Notizen.', 'Saved privately – only you see your notes.') : tr('In diesem Browser gespeichert.', 'Saved in this browser.')}</p>
    </div>
  );
}

export function App() {
  const route = useHashRoute();
  const tr = useTr();
  const topic = TOPICS.find((t) => t.id === route);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [menu]);
  useEffect(() => setMenu(false), [route]);
  return (
    <NotesProvider>
    <div className="layout">
      <header className="topbar">
        <button type="button" className="burger" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="chapters"
          aria-label={menu ? tr('Kapitel schliessen', 'Close chapters') : tr('Kapitel', 'Chapters')}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
        <a href="#" className="brand">Mechanik I Lab</a>
        {topic && <span className="topbar-topic">{tr(...topic.title)}</span>}
        <LangToggle />
      </header>
      <div className={`drawer-backdrop${menu ? ' open' : ''}`} onClick={() => setMenu(false)} aria-hidden="true" />
      <nav id="chapters" className={`drawer${menu ? ' open' : ''}`} aria-label={tr('Kapitel', 'Chapters')} inert={!menu}>
        <ChapterList route={route} onPick={() => setMenu(false)} />
        <NotesList onPick={() => setMenu(false)} />
      </nav>
      <main className="content">{topic ? <TopicPage topic={topic} /> : <Home />}</main>
    </div>
    </NotesProvider>
  );
}
