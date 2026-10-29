import type { ReactNode } from 'react';
import { CHAPTERS, SUBJECTS, TOPICS, chapterSubject, sourceLabel, topicSubject, type Subject } from '../content/curriculum';
import { useTr } from '../i18n';
import { AnaFigure, ChemFigure, InfoFigure, LaFigure, MechFigure } from './Figures';

const LAST_KEY = 'mech1.lastTopic';
const readLast = () => { try { return localStorage.getItem(LAST_KEY); } catch { return null; } };

export const SUBJECT_ROUTE: Record<Subject, string> = { mech: 'mechanik', ana: 'analysis', la: 'algebra', chem: 'chemie', info: 'informatik' };
export const routeSubject = (route: string): Subject | null =>
  route === 'mechanik' ? 'mech' : route === 'analysis' ? 'ana' : route === 'algebra' ? 'la' : route === 'chemie' ? 'chem' : route === 'informatik' ? 'info' : null;

const lessons = (s: Subject) => TOPICS.filter((t) => topicSubject(t) === s);

/** Entry page: choose a subject. */
export function Landing() {
  const tr = useTr();
  const last = TOPICS.find((t) => t.id === readLast());
  const mechN = lessons('mech').length;
  const laN = lessons('la').length, laWeeks = Object.keys(CHAPTERS).filter((c) => chapterSubject(c) === 'la').length;
  const chN = lessons('chem').length, chWeeks = Object.keys(CHAPTERS).filter((c) => chapterSubject(c) === 'chem').length;
  const infN = lessons('info').length, infWeeks = Object.keys(CHAPTERS).filter((c) => chapterSubject(c) === 'info').length;
  const anaN = lessons('ana').length, weeks = Object.keys(CHAPTERS).filter((c) => chapterSubject(c) === 'ana').length;
  const rows: { s: Subject; fig: ReactNode; desc: [string, string]; meta: [string, string] }[] = [
    { s: 'mech', fig: <MechFigure />, desc: ['Koordinaten, Geschwindigkeit und die Bewegung starrer Körper.', 'Coordinates, velocity and the motion of rigid bodies.'], meta: [`${mechN} Lektionen, auch als Kurzfassung`, `${mechN} lessons, also as a short version`] },
    { s: 'ana', fig: <AnaFigure />, desc: ['Folgen, Grenzwerte, Ableitungen und komplexe Zahlen.', 'Sequences, limits, derivatives and complex numbers.'], meta: [`${anaN} Lektionen in ${weeks} Wochen`, `${anaN} lessons in ${weeks} weeks`] },
    { s: 'la', fig: <LaFigure />, desc: ['Gleichungssysteme, Gauss-Verfahren und Matrizen als Transformationen.', 'Linear systems, Gaussian elimination and matrices as transformations.'], meta: [`${laN} Lektionen in ${laWeeks} Wochen`, `${laN} lessons in ${laWeeks} weeks`] },
    { s: 'chem', fig: <ChemFigure />, desc: ['Atome, Gase, Energie und Entropie, bis zu den Orbitalen.', 'Atoms, gases, energy and entropy, up to orbitals.'], meta: [`${chN} Lektionen in ${chWeeks} Wochen`, `${chN} lessons in ${chWeeks} weeks`] },
    { s: 'info', fig: <InfoFigure />, desc: ['C++ und was der Rechner dabei wirklich tut: Schritt für Schritt, mit Speicher und Ablauf vor Augen.', 'C++ and what the computer really does: step by step, with memory and execution in front of your eyes.'], meta: [`${infN} Lektionen in ${infWeeks} Kapiteln`, `${infN} lessons in ${infWeeks} chapters`] },
  ];
  return (
    <div className="landing">
      <header className="landing-head">
                <h1>Learning Lab</h1>
        <p className="landing-sub">D-MAVT · {tr('1. Semester', '1st semester')}</p>
      </header>
      {last && (
        <a className="resume" href={`#${last.id}`}>
          <span className="resume-title">{tr(...last.title)}</span>
        </a>
      )}
      <nav className="tiles" aria-label={tr('Fächer', 'Subjects')}>
        {rows.map((r) => (
          <a key={r.s} className={`tile tile-${r.s}`} href={`#${SUBJECT_ROUTE[r.s]}`}>
            <div className="tile-body">
              <h2>{tr(...SUBJECTS[r.s])}</h2>
            </div>
          </a>
        ))}
      </nav>
      <p className="build-date">{tr('Stand', 'Version')}: {__BUILD_DATE__.split('-').reverse().join('.')}</p>
    </div>
  );
}

/** One subject: short intro, a primary action, and the table of contents. */
export function SubjectPage({ subject }: { subject: Subject }) {
  const tr = useTr();
  const all = lessons(subject);
  const last = all.find((t) => t.id === readLast());
  const go = last ?? all[0];
  const chapters = Object.entries(CHAPTERS).filter(([ch]) => chapterSubject(ch) === subject);
  return (
    <article className={`subject-page subject-${subject}`}>
      <a className="back" href="#">‹ {tr('Alle Fächer', 'All subjects')}</a>
      <header className="subject-top">
        <h1>{tr(...SUBJECTS[subject])}</h1>
        <p className="lede">{subject === 'mech'
          ? tr('Ein interaktiver Begleiter zum Skript der ETH-Vorlesung Mechanik I. Jede Lektion folgt dem Skript Seite für Seite, kennzeichnet klar, was aus der Vorlesung stammt und was Ergänzung ist, und erklärt in ein, zwei Sätzen, wo das Skript eine Lücke oder einen Fehler hat.',
              'An interactive companion to the ETH Mechanics 1 lecture notes. Each lesson follows the notes page by page, marks clearly what comes from the lecture and what is a supplement, and explains in a sentence or two where the notes have a gap or a slip.')
          : subject === 'la'
          ? tr('Ein Kapitel pro Übungsstunde, nach den Folien von Mårten Olofsson und seinen interaktiven Visualisierungen. Das Ziel der Übung gilt hier auch: erst das Bild und die Intuition, dann die Rechnung.',
              'One chapter per exercise class, following the slides of Mårten Olofsson and his interactive visualisations. His aim is ours too: the picture and the intuition first, then the calculation.')
          : subject === 'info'
          ? tr('Ein Kapitel pro Skript-Datei, nach dem Skript der ETH-Vorlesung Informatik. Nicht nur Code, der läuft: Zu jedem Konzept siehst du, was der Rechner dabei tut, und kannst es selbst vorhersagen.',
              'One chapter per file of the lecture notes of the ETH informatics course. Not just code that runs: for every concept you see what the computer does, and you can predict it yourself.')
          : subject === 'chem'
          ? tr('Ein Kapitel pro Vorlesung, nach den Folien von Prof. David Norris, ergänzt durch die ausgefüllten Folien der Übungen. Erst das Bild im Kopf, dann die Formel: Teilchen, die du fliegen siehst, Energie, die du fliessen siehst.',
              'One chapter per lecture, following the slides of Prof. David Norris, completed with the filled-in slides of the exercise classes. The picture in your head first, then the formula: particles you watch fly, energy you watch flow.')
          : tr('Ein Kapitel pro Semesterwoche, jedes folgt dem Resümee der Übungsstunde. Gleiche Idee wie in der Mechanik, aber knapper: Gymnasium-Stoff nur kurz, das Neue gründlich und mit Bildern.',
              "One chapter per week of the semester, each following the summary of that week's exercise class. Same idea as in mechanics, but leaner: high-school material only briefly, the new material thoroughly and with pictures.")}</p>
        <a className="btn" href={`#${go.id}`}>
          {last ? tr('Weiterlesen', 'Continue reading') : tr('Los geht’s', 'Start')}
          <span className="btn-sub">{tr(...go.title)}</span>
        </a>
      </header>
      <div className="toc">
        {chapters.map(([ch, name]) => {
          const [de, en] = name;
          const split = (s: string) => { const i = s.indexOf(' · '); return i < 0 ? ['', s] : [s.slice(0, i), s.slice(i + 3)]; };
          const [numDe, titleDe] = split(de), [numEn, titleEn] = split(en);
          const label = numDe && /^\d+$/.test(numDe) ? tr(`Kapitel ${numDe}`, `Chapter ${numEn}`) : tr(numDe, numEn);
          return (
            <section key={ch} className="toc-ch">
              <div className="toc-head"><span className="toc-label">{label}</span><h2>{tr(titleDe, titleEn)}</h2></div>
              <ul>
                {all.filter((t) => t.chapter === ch).map((t) => (
                  <li key={t.id}><a href={`#${t.id}`}><span className="toc-title">{tr(...t.title)}</span><span className="toc-pages">{tr(sourceLabel(t)[2], sourceLabel(t)[3])}</span></a></li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
