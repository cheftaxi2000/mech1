import { Suspense, useEffect, useState } from 'react';
import { CHAPTERS, TOPICS, type Topic } from './content/curriculum';

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

const STATUS_LABEL = { planned: 'planned', draft: 'draft', review: 'ready for review', complete: 'complete' } as const;

function Home() {
  return (
    <article className="lesson">
      <h1>Mechanik I — Learning Lab</h1>
      <p className="lede">
        An interactive companion to the ETH Mechanics 1 lecture notes. Each lesson follows the notes page by page,
        marks clearly what comes <span className="src">from the lecture</span> and what is a supplement, and flags anything in the source that needs checking.
      </p>
      <p>Start with <a href="#koordinaten">Lage &amp; Koordinaten</a>. Lessons marked “planned” have not been written yet.</p>
    </article>
  );
}

function TopicPage({ topic }: { topic: Topic }) {
  const C = topic.component;
  return (
    <>
      <header className="lesson-head">
        <div className="crumbs">{CHAPTERS[topic.chapter as keyof typeof CHAPTERS]} · Vorlesung S. {topic.pages}</div>
        <h1>{topic.title}</h1>
        <div className="sub">{topic.titleEn} <span className={`status status-${topic.status}`}>{STATUS_LABEL[topic.status]}</span></div>
      </header>
      {C ? <Suspense fallback={<p>Loading…</p>}><C /></Suspense> : <p className="placeholder">This lesson has not been written yet.</p>}
    </>
  );
}

export function App() {
  const route = useHashRoute();
  const topic = TOPICS.find((t) => t.id === route);
  return (
    <div className="layout">
      <nav className="sidebar" aria-label="Lessons">
        <a href="#" className="brand">Mechanik I Lab</a>
        {Object.entries(CHAPTERS).map(([ch, name]) => (
          <div key={ch} className="chapter">
            <div className="chapter-name">{name}</div>
            <ul>
              {TOPICS.filter((t) => t.chapter === ch).map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={`${t.id === route ? 'active' : ''} ${t.status === 'planned' ? 'muted' : ''}`}>
                    <span className={`dot dot-${t.status}`} />{t.title}
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
