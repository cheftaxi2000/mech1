import { CHAPTERS, SUBJECTS, TOPICS, chapterSubject, sourceLabel, topicSubject, type Subject } from '../content/curriculum';
import { useTr } from '../i18n';
import { AnaFigure, LaFigure, MechFigure } from './Figures';

const LAST_KEY = 'mech1.lastTopic';
const readLast = () => { try { return localStorage.getItem(LAST_KEY); } catch { return null; } };

export const SUBJECT_ROUTE: Record<Subject, string> = { mech: 'mechanik', ana: 'analysis', la: 'algebra' };
export const routeSubject = (route: string): Subject | null =>
  route === 'mechanik' ? 'mech' : route === 'analysis' ? 'ana' : route === 'algebra' ? 'la' : null;

const lessons = (s: Subject) => TOPICS.filter((t) => topicSubject(t) === s);
const isQuiz = (id: string) => id.startsWith('quiz-');

/** Entry page: choose a subject. */
export function Landing() {
  const tr = useTr();
  const last = TOPICS.find((t) => t.id === readLast());
  const mechN = lessons('mech').filter((t) => !isQuiz(t.id)).length, quizN = lessons('mech').filter((t) => isQuiz(t.id)).length;
  const laN = lessons('la').length, laWeeks = Object.keys(CHAPTERS).filter((c) => chapterSubject(c) === 'la').length;
  const anaN = lessons('ana').length, weeks = Object.keys(CHAPTERS).filter((c) => chapterSubject(c) === 'ana').length;
  return (
    <div className="landing">
      <header className="landing-head">
        <div className="landing-eyebrow">ETH Zürich</div>
        <h1>Learning Lab</h1>
        <p className="landing-sub">{tr('Wähle dein Fach.', 'Choose your subject.')}</p>
      </header>
      <nav className="tiles" aria-label={tr('Fächer', 'Subjects')}>
        <a className="tile tile-mech" href={`#${SUBJECT_ROUTE.mech}`}>
          <div className="tile-fig"><MechFigure /></div>
          <div className="tile-body">
            <h2>{tr(...SUBJECTS.mech)}</h2>
            <p>{tr('Koordinaten, Geschwindigkeit und die Bewegung starrer Körper.', 'Coordinates, velocity and the motion of rigid bodies.')}</p>
            <div className="tile-foot"><span>{tr(`${mechN} Lektionen · ${quizN} Quiz`, `${mechN} lessons · ${quizN} quizzes`)}</span><span className="tile-go">{tr('Öffnen', 'Open')}<i aria-hidden="true">›</i></span></div>
          </div>
        </a>
        <a className="tile tile-ana" href={`#${SUBJECT_ROUTE.ana}`}>
          <div className="tile-fig"><AnaFigure /></div>
          <div className="tile-body">
            <h2>{tr(...SUBJECTS.ana)}</h2>
            <p>{tr('Folgen, Grenzwerte, Ableitungen und komplexe Zahlen.', 'Sequences, limits, derivatives and complex numbers.')}</p>
            <div className="tile-foot"><span>{tr(`${weeks} Wochen · ${anaN} Lektionen`, `${weeks} weeks · ${anaN} lessons`)}</span><span className="tile-go">{tr('Öffnen', 'Open')}<i aria-hidden="true">›</i></span></div>
          </div>
        </a>
        <a className="tile tile-la" href={`#${SUBJECT_ROUTE.la}`}>
          <div className="tile-fig"><LaFigure /></div>
          <div className="tile-body">
            <h2>{tr(...SUBJECTS.la)}</h2>
            <p>{tr('Gleichungssysteme, Gauss-Verfahren und Matrizen als Transformationen.', 'Linear systems, Gaussian elimination and matrices as transformations.')}</p>
            <div className="tile-foot"><span>{tr(`${laWeeks} Wochen · ${laN} Lektionen`, `${laWeeks} weeks · ${laN} lessons`)}</span><span className="tile-go">{tr('Öffnen', 'Open')}<i aria-hidden="true">›</i></span></div>
          </div>
        </a>
      </nav>
      {last && (
        <a className="resume" href={`#${last.id}`}>
          <span className="resume-kind">{tr('Weiterlesen', 'Continue reading')} · {tr(...SUBJECTS[topicSubject(last)])}</span>
          <span className="resume-title">{tr(...last.title)}</span>
          <span className="resume-pages">{tr(sourceLabel(last)[0], sourceLabel(last)[1])} ›</span>
        </a>
      )}
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
