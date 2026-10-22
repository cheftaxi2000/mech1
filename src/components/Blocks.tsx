import type { ReactNode } from 'react';
import { useLang, useTr } from '../i18n';

/**
 * Reference to the official material. Mechanik: `p` = printed page number in the Mitschrift.
 * Analysis: `u` = number of the Übung (exercise-class summary, PDF), `p` = page in that PDF.
 */
export function Src({ p, fig, u }: { p: number | string; fig?: string; u?: number }) {
  const tr = useTr();
  const pages = String(p).includes('–');
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

type Kind = 'lecture' | 'uebung' | 'supplement' | 'misconception' | 'review' | 'key' | 'intuition';
const LABEL: Record<Kind, [string, string]> = {
  lecture: ['Aus der Vorlesung', 'From the lecture'],
  uebung: ['Aus der Übung', 'From the exercise class'],
  supplement: ['Ergänzung – nicht im Skript', 'Supplement – not in the lecture notes'],
  misconception: ['Häufiges Missverständnis', 'Common misconception'],
  review: ['Prüfhinweis', 'Review flag'],
  key: ['Merke', 'Key point'],
  intuition: ['Intuition', 'Intuition'],
};

export function Box({ kind, title, children, src }: { kind: Kind; title?: ReactNode; children: ReactNode; src?: ReactNode }) {
  const tr = useTr();
  return (
    <aside className={`box box-${kind}`}>
      <header>
        <span className="box-kind">{tr(...LABEL[kind])}</span>
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

export function Section({ id, title, children }: { id: string; title: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="section">
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
