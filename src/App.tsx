import { Suspense, useEffect, useState } from 'react';
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
          <p>Beginne mit <a href="#koordinaten">Lage &amp; Koordinaten</a>. Lektionen mit dem Status «geplant» sind noch nicht geschrieben.</p>
        </>}
        en={<>
          <p className="lede">
            An interactive companion to the ETH Mechanics 1 lecture notes. Each lesson follows the notes page by page,
            marks clearly what comes <span className="src">from the lecture</span> and what is a supplement, and flags anything in the source that needs checking.
          </p>
          <p>Start with <a href="#koordinaten">Position &amp; coordinates</a>. Lessons marked “planned” have not been written yet.</p>
        </>}
      />
    </article>
  );
}

function TopicPage({ topic }: { topic: Topic }) {
  const lang = useLang(), tr = useTr();
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
      {C ? <Suspense fallback={<p>{tr('Wird geladen …', 'Loading…')}</p>}><C /></Suspense>
        : <p className="placeholder">{tr('Diese Lektion ist noch nicht geschrieben.', 'This lesson has not been written yet.')}</p>}
    </>
  );
}

export function App() {
  const route = useHashRoute();
  const tr = useTr();
  const topic = TOPICS.find((t) => t.id === route);
  return (
    <div className="layout">
      <nav className="sidebar" aria-label={tr('Lektionen', 'Lessons')}>
        <div className="sidebar-top">
          <a href="#" className="brand">Mechanik I Lab</a>
          <LangToggle />
        </div>
        {Object.entries(CHAPTERS).map(([ch, name]) => (
          <div key={ch} className="chapter">
            <div className="chapter-name">{tr(...name)}</div>
            <ul>
              {TOPICS.filter((t) => t.chapter === ch).map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={`${t.id === route ? 'active' : ''} ${t.status === 'planned' ? 'muted' : ''}`}>
                    <span className={`dot dot-${t.status}`} />{tr(...t.title)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <main className="content">{topic ? <TopicPage topic={topic} /> : <Home />}</main>
    </div>
  );
}
