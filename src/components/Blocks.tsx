import type { ReactNode } from 'react';
import { useLang, useTr } from '../i18n';
import { TOPICS, topicSubject } from '../content/curriculum';

/**
 * Reference to the official material. Mechanik: `p` = printed page number in the Mitschrift.
 * Analysis: `u` = number of the Übung (exercise-class summary, PDF), `p` = page in that PDF.
 */
export function Src({ p, fig, u, slides, vis, lec, ex }: { p?: number | string; fig?: string; u?: number; slides?: boolean; vis?: string; lec?: number; ex?: number }) {
  const tr = useTr();
  const pages = String(p).includes('–');
  // Chemistry: `lec` = lecture number, `p` = slide numbers (PDF pages) of that lecture's slides; `ex` = exercise class, `p` = page of the TA's filled-in slides.
  if (lec !== undefined) return (
    <span className="src" title={tr(`Vorlesungsfolien ${lec} (PDF), Foliennummer`, `Slides of lecture ${lec} (PDF), slide number`)}>
      {tr(`Vorlesung ${lec}, Folie${pages || String(p).includes(',') ? 'n' : ''} ${p}`, `Lecture ${lec}, slide${pages || String(p).includes(',') ? 's' : ''} ${p}`)}{fig ? `, ${fig}` : ''}
    </span>
  );
  if (ex !== undefined) return (
    <span className="src" title={tr(`Ausgefüllte Folien der Übung ${ex} (PDF), Seite`, `Filled-in slides of exercise class ${ex} (PDF), page`)}>
      {tr(`Übung ${ex}, S. ${p}`, `Exercise class ${ex}, ${pages ? 'pp.' : 'p.'} ${p}`)}{fig ? `, ${fig}` : ''}
    </span>
  );
  // Linear algebra: `slides` = slide numbers (PDF pages) of the annotated exercise-class deck; `vis` = the class's interactive visualisation.
  if (u !== undefined && vis) return (
    <span className="src" title={tr(`Interaktive Visualisierung zur Übung ${u}`, `Interactive visualisation for exercise class ${u}`)}>
      {tr(`Übung ${u}, Visualisierung «${vis}»`, `Exercise class ${u}, visualisation “${vis}”`)}
    </span>
  );
  if (u !== undefined && slides) return (
    <span className="src" title={tr(`Annotierte Folien der Übung ${u} (PDF), Foliennummer`, `Annotated slides of exercise class ${u} (PDF), slide number`)}>
      {tr(`Übung ${u}, Folie${pages || String(p).includes(',') ? 'n' : ''} ${p}`, `Exercise class ${u}, slide${pages || String(p).includes(',') ? 's' : ''} ${p}`)}{fig ? `, ${fig}` : ''}
    </span>
  );
  if (u !== undefined) return (
    <span className="src" title={tr(`Übungs-Resümee ${u} (PDF), Seite`, `Summary of exercise class ${u} (PDF), page`)}>
      {tr(`Übung ${u}, S. ${p}`, `Exercise class ${u}, ${pages ? 'pp.' : 'p.'} ${p}`)}{fig ? `, ${fig}` : ''}
    </span>
  );
  return (
    <span className="src" title={tr('Stelle im offiziellen Skript (gedruckte Seitenzahl)', 'Location in the official lecture notes (printed page number)')}>
      {tr(`Vorlesung S. ${p}`, `Lecture notes ${pages ? 'pp.' : 'p.'} ${p}`)}{fig ? `, ${fig}` : ''}
    </span>
  );
}

type Kind = 'lecture' | 'uebung' | 'supplement' | 'misconception' | 'review' | 'key' | 'intuition' | 'tip';
const LABEL: Record<Kind, [string, string]> = {
  lecture: ['Aus der Vorlesung', 'From the lecture'],
  uebung: ['Aus der Übung', 'From the exercise class'],
  supplement: ['Ergänzung – nicht im Skript', 'Supplement – not in the lecture notes'],
  misconception: ['Häufiges Missverständnis', 'Common misconception'],
  review: ['Prüfhinweis', 'Review flag'],
  key: ['Merke', 'Key point'],
  intuition: ['Intuition', 'Intuition'],
  tip: ['Tipp', 'Tip'],
};

/** `keep`: this box stays in the short version although its kind is normally dropped there. */
export function Box({ kind, title, children, src, keep }: { kind: Kind; title?: ReactNode; children: ReactNode; src?: ReactNode; keep?: boolean }) {
  const tr = useTr();
  // In the exercise-class subjects a supplement is "not in the slides / summary", not "not in the lecture notes".
  const topic = typeof window !== 'undefined' ? TOPICS.find((t) => t.id === window.location.hash.replace(/^#\/?/, '')) : undefined;
  const label: [string, string] = kind === 'supplement' && topic && topicSubject(topic) !== 'mech' && topicSubject(topic) !== 'info'
    ? (topicSubject(topic) === 'la' || topicSubject(topic) === 'chem' ? ['Ergänzung – nicht in den Folien', 'Supplement – not in the slides'] : ['Ergänzung – nicht im Resümee', 'Supplement – not in the summary'])
    : LABEL[kind];
  return (
    <aside className={`box box-${kind}${keep ? ' keep' : ''}`}>
      <header>
        <span className="box-kind">{tr(...label)}</span>
        {title && <span className="box-title">{title}</span>}
        {src}
      </header>
      <div className="box-body">{children}</div>
    </aside>
  );
}

/** A step-by-step derivation; open by default (every transition should be visible), collapsible for review. */
export function Derivation({ title, children, open = true }: { title: ReactNode; children: ReactNode; open?: boolean }) {
  const tr = useTr();
  return (
    <details className="derivation" open={open}>
      <summary>{tr('Herleitung', 'Derivation')}: {title}</summary>
      <div>{children}</div>
    </details>
  );
}

/** `long`: the whole section exists only in the full version. */
export function Section({ id, title, children, long }: { id: string; title: ReactNode; children: ReactNode; long?: boolean }) {
  return (
    <section id={id} className={`section${long ? ' long-only' : ''}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** German lecture term. In English mode it is kept verbatim and glossed; in German mode it stands alone. */
export function De({ children, en }: { children: ReactNode; en: string }) {
  const lang = useLang();
  return (
    <span className="de">
      <em lang="de">{children}</em>
      {lang === 'en' && <> <span className="gloss">({en})</span></>}
    </span>
  );
}
