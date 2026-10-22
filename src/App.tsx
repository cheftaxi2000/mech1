import { Suspense, useEffect, useRef, useState } from 'react';
import { NotesLayer } from './notes/StickyNotes';
import { NotesProvider, useNotes } from './notes/store';
import { CHAPTERS, SUBJECTS, TOPICS, chapterSubject, sourceLabel, topicSubject, type Status, type Subject, type Topic } from './content/curriculum';
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

const LAST_KEY = 'mech1.lastTopic';
const readLast = () => { try { return localStorage.getItem(LAST_KEY); } catch { return null; } };

function Home() {
  const tr = useTr();
  const last = TOPICS.find((t) => t.id === readLast());
  return (
    <article className="lesson">
      <h1>Learning Lab · Mechanik I &amp; Analysis 1</h1>
      {last && (
        <a className="resume" href={`#${last.id}`}>
          <span className="resume-kind">{tr('Weiterlesen', 'Continue reading')} · {tr(...SUBJECTS[topicSubject(last)])}</span>
          <span className="resume-title">{tr(...last.title)}</span>
          <span className="resume-pages">{tr(sourceLabel(last)[0], sourceLabel(last)[1])} ›</span>
        </a>
      )}
      <h2 className="subject-head" id="mechanik">{tr(...SUBJECTS.mech)}</h2>
      <T
        de={<>
          <p className="lede">
            Ein interaktiver Begleiter zum Skript der ETH-Vorlesung Mechanik I. Jede Lektion folgt dem Skript Seite für Seite,
            kennzeichnet klar, was <span className="src">aus der Vorlesung</span> stammt und was Ergänzung ist, und erklärt in ein, zwei Sätzen, wo das Skript eine Lücke oder einen Fehler hat.
          </p>
          <p>Beginne mit <a href="#koordinaten">Lage &amp; Koordinaten</a>. Alle fünfzehn Lektionen folgen dem Skript bis S. 28; am Schluss gibt es vier <a href="#quiz-1">Quiz-Seiten</a> zum Üben. Alle Kapitel findest du auch jederzeit im Menü oben links.</p>
        </>}
        en={<>
          <p className="lede">
            An interactive companion to the ETH Mechanics 1 lecture notes. Each lesson follows the notes page by page,
            marks clearly what comes <span className="src">from the lecture</span> and what is a supplement, and explains in a sentence or two where the notes have a gap or a slip.
          </p>
          <p>Start with <a href="#koordinaten">Position &amp; coordinates</a>. All fifteen lessons follow the notes up to p. 28; at the end there are four <a href="#quiz-1">quiz pages</a> for practice. All chapters are also in the menu at the top left.</p>
        </>}
      />
      <nav className="home-chapters" aria-label={tr('Kapitel Mechanik I', 'Chapters Mechanics 1')}><ChapterList route="" subject="mech" /></nav>
      <h2 className="subject-head" id="analysis">{tr(...SUBJECTS.ana)}</h2>
      <T
        de={<p className="lede">
          Ein Kapitel pro Semesterwoche: Wochen 1–5 folgen den Übungs-Resümees, Woche 6 dem Online-Skript zu den komplexen Zahlen.
          Gleiche Idee wie in der Mechanik, aber knapper: Gymnasium-Stoff nur kurz, das Neue gründlich und mit Bildern.
        </p>}
        en={<p className="lede">
          One chapter per week of the semester: weeks 1–5 follow the summaries of the exercise classes, week 6 the online notes on complex numbers.
          Same idea as in mechanics, but leaner: high-school material only briefly, the new material thoroughly and with pictures.
        </p>}
      />
      <nav className="home-chapters" aria-label={tr('Kapitel Analysis 1', 'Chapters Analysis 1')}><ChapterList route="" subject="ana" /></nav>
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
  useEffect(() => { if (topic) { try { localStorage.setItem(LAST_KEY, topic.id); } catch { /* not remembered; fine */ } } }, [topic]);
  return (
    <NotesProvider>
    <div className="layout">
      <header className="topbar">
        <button type="button" className="burger" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="chapters"
          aria-label={menu ? tr('Kapitel schliessen', 'Close chapters') : tr('Kapitel', 'Chapters')}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
        <a href="#" className="brand">{topic ? `${tr(...SUBJECTS[topicSubject(topic)])} Lab` : 'Learning Lab'}</a>
        {topic && <span className="topbar-topic">{tr(...topic.title)}</span>}
        <LangToggle />
      </header>
      <div className={`drawer-backdrop${menu ? ' open' : ''}`} onClick={() => setMenu(false)} aria-hidden="true" />
      <nav id="chapters" className={`drawer${menu ? ' open' : ''}`} aria-label={tr('Kapitel', 'Chapters')} inert={!menu}>
        {(Object.keys(SUBJECTS) as Subject[]).map((s) => (
          <div key={s} className="drawer-subject">
            <div className="subject-name">{tr(...SUBJECTS[s])}</div>
            <ChapterList route={route} onPick={() => setMenu(false)} subject={s} />
          </div>
        ))}
        <NotesList onPick={() => setMenu(false)} />
      </nav>
      <main className="content">{topic ? <TopicPage topic={topic} /> : <Home />}</main>
    </div>
    </NotesProvider>
  );
}
