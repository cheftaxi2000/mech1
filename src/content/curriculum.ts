import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * The curriculum, in lecture order. `pages` are PRINTED page numbers of the Mitschrift.
 * Status semantics (see docs/PROGRESS.md for the full completion checklist):
 *   planned     – not started; no lesson component
 *   draft       – lesson exists but the completion checklist is not satisfied
 *   review      – checklist satisfied by Claude; awaiting the student's review
 *   complete    – student has worked through it and signed off
 */
export type Status = 'planned' | 'draft' | 'review' | 'complete';

/** The two courses ("Rubriken"). Each chapter belongs to one; navigation and prev/next stay inside a subject. */
export type Subject = 'mech' | 'ana';
export const SUBJECTS: Record<Subject, [string, string]> = {
  mech: ['Mechanik I', 'Mechanics 1'],
  ana: ['Analysis 1', 'Analysis 1'],
};

export interface Topic {
  id: string;
  chapter: string;
  /** [German, English]. The German title follows the lecture's own headings. */
  title: [string, string];
  /** Mechanik: printed pages of the Mitschrift. Analysis: the source document (see `sourceLabel`). */
  pages: string;
  status: Status;
  component?: LazyExoticComponent<ComponentType>;
}

export const CHAPTERS: Record<string, [string, string]> = {
  '1': ['1 · Bewegung eines materiellen Punktes', '1 · Motion of a material point'],
  '2': ['2 · Geschwindigkeit', '2 · Velocity'],
  '3': ['3 · Starrer Körper', '3 · Rigid body'],
  Q: ['Quiz', 'Quiz'],
  A1: ['Woche 1 · Folgen und Reihen', 'Week 1 · Sequences and series'],
  A2: ['Woche 2 · Funktionen und Grenzwerte', 'Week 2 · Functions and limits'],
  A3: ['Woche 3 · Stetigkeit, Umkehrfunktion, Asymptoten', 'Week 3 · Continuity, inverse functions, asymptotes'],
  A4: ['Woche 4 · Ableitungen', 'Week 4 · Derivatives'],
  A5: ['Woche 5 · Fehlerrechnung, Mittelwertsatz, komplexe Zahlen', 'Week 5 · Errors, mean value theorem, complex numbers'],
  A6: ['Woche 6 · Komplexe Zahlen', 'Week 6 · Complex numbers'],
};

export const chapterSubject = (ch: string): Subject => (ch.startsWith('A') ? 'ana' : 'mech');
export const topicSubject = (t: Topic): Subject => chapterSubject(t.chapter);

/** Where a topic comes from, for the crumbs and lists: [long German, long English, short German, short English]. */
export function sourceLabel(t: Topic): [string, string, string, string] {
  if (topicSubject(t) === 'mech') {
    return [`Vorlesung S. ${t.pages}`, `Lecture notes ${t.pages.includes('–') ? 'pp.' : 'p.'} ${t.pages}`, `S. ${t.pages}`, `p. ${t.pages}`];
  }
  // Analysis: weeks 1–5 are the Übungs-Resümees (PDF, «Ü<n>/<pages>»), week 6 the online script of the ETH.
  if (!t.pages.startsWith('Ü')) return ['Online-Skript', 'Online notes', 'Skript', 'notes'];
  const [u, pp] = t.pages.slice(1).split('/');
  const many = pp?.includes('–');
  return pp
    ? [`Übung ${u}, S. ${pp}`, `Exercise class ${u}, ${many ? 'pp.' : 'p.'} ${pp}`, `Üb. ${u}`, `Ex. ${u}`]
    : [`Übung ${u}`, `Exercise class ${u}`, `Üb. ${u}`, `Ex. ${u}`];
}

export const TOPICS: Topic[] = [
  { id: 'koordinaten', chapter: '1', title: ['Lage & Koordinaten', 'Position & coordinates'], pages: '3–4', status: 'complete', component: lazy(() => import('../lessons/L01Coordinates')) },
  { id: 'vektoren', chapter: '1', title: ['Vektoren, Skalar- & Kreuzprodukt', 'Vectors, dot and cross product'], pages: '5', status: 'complete', component: lazy(() => import('../lessons/L02Vectors')) },
  { id: 'basen', chapter: '1', title: ['Kartesische, zylindrische, sphärische Basis', 'Cartesian, cylindrical, spherical basis'], pages: '6–7', status: 'complete', component: lazy(() => import('../lessons/L03Bases')) },
  { id: 'geschwindigkeit', chapter: '2', title: ['Geschwindigkeitsvektor & Schnelligkeit', 'Velocity vector and speed'], pages: '8–9', status: 'complete', component: lazy(() => import('../lessons/L04Velocity')) },
  { id: 'v-krummlinig', chapter: '2', title: ['Geschwindigkeit in Zylinder- und Kugelkoordinaten', 'Velocity in cylindrical and spherical coordinates'], pages: '10', status: 'complete', component: lazy(() => import('../lessons/L05CurvVelocity')) },
  { id: 'kreisbewegung', chapter: '2', title: ['Kreisbewegung & Winkelgeschwindigkeit', 'Circular motion & angular velocity'], pages: '11', status: 'complete', component: lazy(() => import('../lessons/L06Circle')) },
  { id: 'sdpg', chapter: '3', title: ['Starrer Körper & SdpG', 'Rigid body & projected velocities'], pages: '12–13', status: 'complete', component: lazy(() => import('../lessons/L07Rigid')) },
  { id: 'translation', chapter: '3', title: ['Translation', 'Translation'], pages: '13–14', status: 'complete', component: lazy(() => import('../lessons/L08Translation')) },
  { id: 'rotation', chapter: '3', title: ['Rotation', 'Rotation'], pages: '15–19', status: 'complete', component: lazy(() => import('../lessons/L09Rotation')) },
  { id: 'rollen', chapter: '3', title: ['Rollen & Gleiten', 'Rolling and sliding'], pages: '20', status: 'complete', component: lazy(() => import('../lessons/L10Rolling')) },
  { id: 'kreiselung', chapter: '3', title: ['Kreiselung', 'Spinning motion (Kreiselung)'], pages: '20–21', status: 'review', component: lazy(() => import('../lessons/L11Kreiselung')) },
  { id: 'allgemein', chapter: '3', title: ['Allgemeine Bewegung', 'General rigid-body motion'], pages: '22–23', status: 'review', component: lazy(() => import('../lessons/L12General')) },
  { id: 'zentralachse', chapter: '3', title: ['Kinemate, Zentralachse & Schraube', 'Kinemate, central axis and screw'], pages: '24–25', status: 'review', component: lazy(() => import('../lessons/L13Screw')) },
  { id: 'ebene-bewegung', chapter: '3', title: ['Ebene Bewegung & Momentanzentrum', 'Plane motion and instantaneous centre'], pages: '26–27', status: 'review', component: lazy(() => import('../lessons/L14Plane')) },
  { id: 'planetengetriebe', chapter: '3', title: ['Planetengetriebe', 'Planetary gear'], pages: '28', status: 'review', component: lazy(() => import('../lessons/L15Planetary')) },
  { id: 'quiz-1', chapter: 'Q', title: ['Quiz 1 · Lage & Vektoren', 'Quiz 1 · Position & vectors'], pages: '3–7', status: 'review', component: lazy(() => import('../lessons/Q1Quiz')) },
  { id: 'quiz-2', chapter: 'Q', title: ['Quiz 2 · Geschwindigkeit', 'Quiz 2 · Velocity'], pages: '8–11', status: 'review', component: lazy(() => import('../lessons/Q2Quiz')) },
  { id: 'quiz-3', chapter: 'Q', title: ['Quiz 3 · Starrer Körper', 'Quiz 3 · Rigid body'], pages: '12–23', status: 'review', component: lazy(() => import('../lessons/Q3Quiz')) },
  { id: 'quiz-4', chapter: 'Q', title: ['Quiz 4 · Schraube, ebene Bewegung', 'Quiz 4 · Screw, plane motion'], pages: '24–28', status: 'review', component: lazy(() => import('../lessons/Q4Quiz')) },
  // Analysis 1 – one chapter per week (D-023). `pages`: «Ü<n>/<pdf pages>» = Übungs-Resümee n, pages of that PDF.
  { id: 'ana-folgen', chapter: 'A1', title: ['Folgen: beschränkt, monoton, konvergent', 'Sequences: bounded, monotonic, convergent'], pages: 'Ü1/10', status: 'planned' },
  { id: 'ana-grenzwerte-folgen', chapter: 'A1', title: ['Grenzwerte von Folgen', 'Limits of sequences'], pages: 'Ü1/11', status: 'planned' },
  { id: 'ana-reihen', chapter: 'A1', title: ['Arithmetische, geometrische und harmonische Reihe', 'Arithmetic, geometric and harmonic series'], pages: 'Ü1/11–12', status: 'planned' },
  { id: 'ana-funktionen', chapter: 'A2', title: ['Funktionen, Definitions- und Wertebereich', 'Functions, domain and range'], pages: 'Ü2/2–4', status: 'planned' },
  { id: 'ana-grenzwerte-funktionen', chapter: 'A2', title: ['Stetigkeit und Grenzwerte von Funktionen', 'Continuity and limits of functions'], pages: 'Ü2/4–7', status: 'planned' },
  { id: 'ana-stetigkeit', chapter: 'A3', title: ['Stetigkeit, Lücken und Zwischenwertsatz', 'Continuity, gaps and the intermediate value theorem'], pages: 'Ü3/1–3', status: 'review', component: lazy(() => import('../lessons/A3Stetigkeit')) },
  { id: 'ana-transformationen', chapter: 'A3', title: ['Graphen verschieben, strecken, Kehrwert', 'Shifting and stretching graphs, reciprocals'], pages: 'Ü3/4–5', status: 'review', component: lazy(() => import('../lessons/A3Transformationen')) },
  { id: 'ana-umkehr', chapter: 'A3', title: ['Injektiv, surjektiv, Umkehrfunktion', 'Injective, surjective, inverse function'], pages: 'Ü3/5–8', status: 'review', component: lazy(() => import('../lessons/A3Umkehr')) },
  { id: 'ana-asymptoten', chapter: 'A3', title: ['Asymptoten', 'Asymptotes'], pages: 'Ü3/9–12', status: 'review', component: lazy(() => import('../lessons/A3Asymptoten')) },
  { id: 'ana-ableitung', chapter: 'A4', title: ['Differenzenquotient und Ableitung', 'Difference quotient and derivative'], pages: 'Ü4/2–3', status: 'planned' },
  { id: 'ana-ableitungsregeln', chapter: 'A4', title: ['Ableitungsregeln', 'Rules of differentiation'], pages: 'Ü4/4–7', status: 'planned' },
  { id: 'ana-tangente', chapter: 'A4', title: ['Tangente und Normale', 'Tangent and normal'], pages: 'Ü4/8–9', status: 'planned' },
  { id: 'ana-fehler', chapter: 'A5', title: ['Fehlerrechnung', 'Error estimation'], pages: 'Ü5/1–2', status: 'planned' },
  { id: 'ana-mws', chapter: 'A5', title: ['Mittelwertsatz, Extrema und Wendepunkte', 'Mean value theorem, extrema and inflection points'], pages: 'Ü5/3–6', status: 'planned' },
  { id: 'ana-komplex-rechnen', chapter: 'A5', title: ['Komplexe Zahlen: Rechnen', 'Complex numbers: arithmetic'], pages: 'Ü5/6–8', status: 'planned' },
  { id: 'ana-komplex', chapter: 'A6', title: ['Die komplexe Ebene', 'The complex plane'], pages: 'web', status: 'planned' },
];
