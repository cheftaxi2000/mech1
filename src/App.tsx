import { Suspense, useEffect, useRef, useState } from 'react';
import { NotesLayer } from './notes/StickyNotes';
import { NotesProvider, useNotes } from './notes/store';
import { CHAPTERS, SUBJECTS, SUBJECT_SHORT, TOPICS, chapterSubject, sourceLabel, topicSubject, type Status, type Subject, type Topic } from './content/curriculum';
import { DetailToggle, LangToggle, useLang, useTr } from './i18n';
import { Landing, SUBJECT_ROUTE, SubjectPage, routeSubject } from './home/Pages';

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

const LAST_KEY = 'mech1.lastTopic';

function TopicPage({ topic }: { topic: Topic }) {
  const lang = useLang(), tr = useTr();
  const wrapRef = useRef<HTMLDivElement>(null);
  const C = topic.component;
  return (
    <>
      <header className="lesson-head">
        <div className="crumbs">{tr(...SUBJECTS[topicSubject(topic)])} · {tr(...CHAPTERS[topic.chapter])} · {tr(sourceLabel(topic)[0], sourceLabel(topic)[1])}</div>
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
      <LessonPager topic={topic} />
    </>
  );
}

/** Previous / next lesson at the end of every page, so the course can be read straight through. */
function LessonPager({ topic }: { topic: Topic }) {
  const tr = useTr();
  const list = TOPICS.filter((t) => topicSubject(t) === topicSubject(topic));
  const i = list.indexOf(topic);
  const prev = list[i - 1], next = list[i + 1];
  return (
    <nav className="lesson-pager" aria-label={tr('Weitere Lektionen', 'More lessons')}>
      {prev ? <a className="pager-prev" href={`#${prev.id}`} rel="prev"><span className="pager-dir">‹ {tr('Zurück', 'Previous')}</span><span className="pager-title">{tr(...prev.title)}</span></a> : <span />}
      {next ? <a className="pager-next" href={`#${next.id}`} rel="next"><span className="pager-dir">{tr('Weiter', 'Next')} ›</span><span className="pager-title">{tr(...next.title)}</span></a> : <span />}
    </nav>
  );
}

/** All chapters and lessons; used in the drawer and on the home page. */
function ChapterList({ route, onPick, subject }: { route: string; onPick?: () => void; subject?: Subject }) {
  const tr = useTr();
  return (
    <>
      {Object.entries(CHAPTERS).filter(([ch]) => !subject || chapterSubject(ch) === subject).map(([ch, name]) => (
        <div key={ch} className="chapter">
          <div className="chapter-name">{tr(...name)}</div>
          <ul>
            {TOPICS.filter((t) => t.chapter === ch).map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} onClick={onPick} aria-current={t.id === route ? 'page' : undefined}
                  className={`${t.id === route ? 'active' : ''} ${t.status === 'planned' ? 'muted' : ''}`}>
                  <span className={`dot dot-${t.status}`} /><span className="li-title">{tr(...t.title)}</span><span className="li-pages">{tr(sourceLabel(t)[2], sourceLabel(t)[3])}</span>
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

/** Thin reading-progress thread under the top bar (lessons only). */
function ReadProgress({ route }: { route: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const upd = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty('--p', String(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0));
    };
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    return () => { window.removeEventListener('scroll', upd); window.removeEventListener('resize', upd); };
  }, [route]);
  return <div className="read-progress" ref={ref} aria-hidden="true"><i /></div>;
}

export function App() {
  const route = useHashRoute();
  const tr = useTr();
  const topic = TOPICS.find((t) => t.id === route);
  const subject: Subject | null = topic ? topicSubject(topic) : routeSubject(route);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [menu]);
  useEffect(() => setMenu(false), [route]);
  useEffect(() => { if (topic) { try { localStorage.setItem(LAST_KEY, topic.id); } catch { /* not remembered; fine */ } } }, [topic]);
  useEffect(() => {
    if (subject) document.documentElement.dataset.subject = subject; else delete document.documentElement.dataset.subject;
  }, [subject]);
  const shown = (Object.keys(SUBJECTS) as Subject[]).filter((s) => !subject || s === subject);
  return (
    <NotesProvider>
    <div className="layout">
      <header className={`topbar${subject ? ' has-subject' : ''}`}>
        <button type="button" className="burger" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="chapters"
          aria-label={menu ? tr('Kapitel schliessen', 'Close chapters') : tr('Kapitel', 'Chapters')}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
        <a href="#" className="brand">Learning Lab</a>
        {subject && <a href={`#${SUBJECT_ROUTE[subject]}`} className="topbar-subject">{tr(...SUBJECTS[subject])}</a>}
        {topic && <span className="topbar-topic">{tr(...topic.title)}</span>}
        {subject === 'mech' && <DetailToggle />}
        <LangToggle />
        <ReadProgress route={route} />
      </header>
      <div className={`drawer-backdrop${menu ? ' open' : ''}`} onClick={() => setMenu(false)} aria-hidden="true" />
      <nav id="chapters" className={`drawer${menu ? ' open' : ''}`} aria-label={tr('Kapitel', 'Chapters')} inert={!menu}>
        <a className="drawer-all" href="#" onClick={() => setMenu(false)}>‹ {tr('Alle Fächer', 'All subjects')}</a>
        <div className="seg" role="group" aria-label={tr('Fach', 'Subject')}>
          {(Object.keys(SUBJECTS) as Subject[]).map((s) => (
            <a key={s} href={`#${SUBJECT_ROUTE[s]}`} className={subject === s ? 'active' : ''} aria-current={subject === s ? 'true' : undefined} onClick={() => setMenu(false)}>{tr(...SUBJECT_SHORT[s])}</a>
          ))}
        </div>
        {shown.map((s) => (
          <div key={s} className="drawer-subject">
            {!subject && <div className="subject-name">{tr(...SUBJECTS[s])}</div>}
            <ChapterList route={route} onPick={() => setMenu(false)} subject={s} />
          </div>
        ))}
        <NotesList onPick={() => setMenu(false)} />
      </nav>
      <main className="content">{topic ? <TopicPage topic={topic} /> : subject ? <SubjectPage subject={subject} /> : <Landing />}</main>
    </div>
    </NotesProvider>
  );
}
