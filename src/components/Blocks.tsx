import type { ReactNode } from 'react';

/** Reference to the official material. `p` = printed page number in the Mitschrift. */
export function Src({ p, fig }: { p: number | string; fig?: string }) {
  return (
    <span className="src" title="Location in the official lecture notes (printed page number)">
      Vorlesung S. {p}{fig ? `, ${fig}` : ''}
    </span>
  );
}

type Kind = 'lecture' | 'supplement' | 'misconception' | 'review' | 'key' | 'intuition';
const LABEL: Record<Kind, string> = {
  lecture: 'From the lecture',
  supplement: 'Supplement — not in the lecture notes',
  misconception: 'Common misconception',
  review: 'Review flag',
  key: 'Key result',
  intuition: 'Intuition',
};

export function Box({ kind, title, children, src }: { kind: Kind; title?: string; children: ReactNode; src?: ReactNode }) {
  return (
    <aside className={`box box-${kind}`}>
      <header>
        <span className="box-kind">{LABEL[kind]}</span>
        {title && <span className="box-title">{title}</span>}
        {src}
      </header>
      <div className="box-body">{children}</div>
    </aside>
  );
}

/** A step-by-step derivation; open by default (every transition should be visible), collapsible for review. */
export function Derivation({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="derivation" open={open}>
      <summary>Derivation: {title}</summary>
      <div>{children}</div>
    </details>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** German lecture term with English gloss. */
export function De({ children, en }: { children: ReactNode; en: string }) {
  return <span className="de" title={en}><em>{children}</em> <span className="gloss">({en})</span></span>;
}
