import type { ReactNode } from 'react';
import { De } from '../../components/Blocks';
import { TOPICS } from '../../content/curriculum';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import './l12.css';

/**
 * «Der Kursplan» (Übung 1, slide 11): the roadmap L1 … L14 → Linear Algebra II as a timeline.
 * Weeks that exist on this site (chapters LA1 – LA5) link to their lessons, the rest is greyed out.
 */
interface Node { n: number; de: ReactNode; en: ReactNode; topicsDe: string; topicsEn: string; chapter?: string }
const NODES: Node[] = [
  { n: 1, de: 'MATLAB und Einstieg', en: 'MATLAB and introduction', topicsDe: '', topicsEn: '', chapter: 'LA1' },
  { n: 2, de: 'LGS und Gauss', en: 'Linear systems and Gauss', topicsDe: 'Pivot · Linearität · Notation · geometrische Deutung', topicsEn: 'pivot · linearity · notation · geometric view', chapter: 'LA2' },
  { n: 3, de: 'LGS mit Matrix', en: 'Linear systems with a matrix', topicsDe: 'Rang · homogene LGS · Vektoren · LGS aus Sicht der Spalten', topicsEn: 'rank · homogeneous systems · vectors · the column view', chapter: 'LA3' },
  { n: 4, de: 'Die Matrix', en: 'The matrix', topicsDe: 'Transponierte · Summe · Skalar · «Was ist das wirklich?»', topicsEn: 'transpose · sum · scalar · “what is it really?”', chapter: 'LA4' },
  { n: 5, de: 'Mehr Matrizen', en: 'More matrices', topicsDe: 'das Matrixprodukt', topicsEn: 'the matrix product', chapter: 'LA5' },
  { n: 6, de: 'Inverse', en: 'Inverse', topicsDe: 'orthogonale Matrix · Gauss-Jordan', topicsEn: 'orthogonal matrix · Gauss-Jordan' },
  { n: 7, de: 'LR-Zerlegung', en: 'LR decomposition', topicsDe: '', topicsEn: '' },
  { n: 8, de: 'LR und Determinante (Einstieg)', en: 'LR and determinant (intro)', topicsDe: '', topicsEn: '' },
  { n: 9, de: 'Coole Eigenschaften der Determinante', en: 'Cool features of the determinant', topicsDe: '', topicsEn: '' },
  { n: 10, de: 'Lineare Unabhängigkeit, Span und Übung', en: 'Linear independence, span and practice', topicsDe: '', topicsEn: '' },
  { n: 11, de: 'Vektorraum und Unterräume', en: 'Vector space and subspaces', topicsDe: 'alles wird abstrakter', topicsEn: 'things get more abstract' },
  { n: 12, de: 'Koordinatensysteme', en: 'Coordinate systems', topicsDe: '', topicsEn: '' },
  { n: 13, de: <>Lernkontrolle</>, en: <De en="learning check">Lernkontrolle</De>, topicsDe: '', topicsEn: '' },
  { n: 14, de: 'Rückblick', en: 'Recap', topicsDe: '', topicsEn: '' },
];

/** Curriculum titles are plain strings; a formula inside ("Ax = b") is typeset by KaTeX. */
const titleNode = (s: string): ReactNode => s.split(/(Ax = b)/).map((part, i) => (part === 'Ax = b' ? <M key={i}>{'A x = b'}</M> : part));

export function CourseRoadmap({ current = 'la-einstieg' }: { current?: string }) {
  const tr = useTr();
  const lessons = (ch?: string) => (ch ? TOPICS.filter((t) => t.chapter === ch) : []);
  return (
    <ol className="l12-road" aria-label={tr('Kursplan L1 bis L14', 'Course roadmap L1 to L14')}>
      {NODES.map((nd) => {
        const ls = lessons(nd.chapter);
        const here = ls.length > 0;
        return (
          <li key={nd.n} className={here ? 'on' : 'off'}>
            <span className="l12-road-dot" aria-hidden="true">L{nd.n}</span>
            <div className="l12-road-card">
              <strong>{tr(nd.de, nd.en)}</strong>
              {(tr(nd.topicsDe, nd.topicsEn)) && <span className="l12-road-sub">{tr(nd.topicsDe, nd.topicsEn)}</span>}
              {here && (
                <span className="l12-road-links">
                  {ls.map((t) => t.id === current
                    ? <span key={t.id} className="here" aria-current="page">{titleNode(tr(t.title[0], t.title[1]))}</span>
                    : <a key={t.id} href={`#${t.id}`}>{titleNode(tr(t.title[0], t.title[1]))}</a>)}
                </span>
              )}
            </div>
          </li>
        );
      })}
      <li className="off end">
        <span className="l12-road-dot" aria-hidden="true">II</span>
        <div className="l12-road-card"><strong>{tr('Lineare Algebra II', 'Linear Algebra II')}</strong><span className="l12-road-sub">{tr('Jetzt wird es ernst …', 'things get real …')}</span></div>
      </li>
    </ol>
  );
}
