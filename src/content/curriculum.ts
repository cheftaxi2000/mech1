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
export type Subject = 'mech' | 'ana' | 'la' | 'chem' | 'info';
export const SUBJECTS: Record<Subject, [string, string]> = {
  mech: ['Mechanik I', 'Mechanics 1'],
  ana: ['Analysis 1', 'Analysis 1'],
  la: ['Lineare Algebra I', 'Linear Algebra 1'],
  chem: ['Chemie', 'Chemistry'],
  info: ['Informatik I', 'Computer Science 1'],
};
/** Short names for narrow places (drawer switch). */
export const SUBJECT_SHORT: Record<Subject, [string, string]> = {
  mech: ['Mechanik', 'Mechanics'],
  ana: ['Analysis', 'Analysis'],
  la: ['Lin. Algebra', 'Lin. Algebra'],
  chem: ['Chemie', 'Chemistry'],
  info: ['Informatik', 'Comp. Science'],
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
  '4': ['4 · Kräfte', '4 · Forces'],
  '5': ['5 · Leistung', '5 · Power'],
  A1: ['Woche 1 · Folgen und Reihen', 'Week 1 · Sequences and series'],
  A2: ['Woche 2 · Funktionen und Grenzwerte', 'Week 2 · Functions and limits'],
  A3: ['Woche 3 · Stetigkeit, Umkehrfunktion, Asymptoten', 'Week 3 · Continuity, inverse functions, asymptotes'],
  A4: ['Woche 4 · Ableitungen', 'Week 4 · Derivatives'],
  A5: ['Woche 5 · Fehlerrechnung, Mittelwertsatz, komplexe Zahlen', 'Week 5 · Errors, mean value theorem, complex numbers'],
  A6: ['Woche 6 · Komplexe Zahlen', 'Week 6 · Complex numbers'],
  LA1: ['Woche 1 · Einstieg', 'Week 1 · Introduction'],
  LA2: ['Woche 2 · Gleichungssysteme und Gauss', 'Week 2 · Linear systems and Gaussian elimination'],
  LA3: ['Woche 3 · Rang und Spaltenbild', 'Week 3 · Rank and the column picture'],
  LA4: ['Woche 4 · Die Matrix', 'Week 4 · The matrix'],
  LA5: ['Woche 5 · Matrixprodukt', 'Week 5 · Matrix product'],
  CH1: ['Woche 1 · Atome und Reaktionen', 'Week 1 · Atoms and reactions'],
  CH2: ['Woche 2 · Gase', 'Week 2 · Gases'],
  CH3: ['Woche 3 · Lösungen, Säuren und Redox', 'Week 3 · Solutions, acids and redox'],
  CH4: ['Woche 4 · Energie und Enthalpie', 'Week 4 · Energy and enthalpy'],
  CH5: ['Woche 5 · Entropie und freie Enthalpie', 'Week 5 · Entropy and free energy'],
  CH6: ['Woche 6 · Elektronenstruktur', 'Week 6 · Electronic structure'],  I1: ['1 · Algorithmen, Rechner und erstes C++', '1 · Algorithms, computers and first C++'],
  I2: ['2 · Ausdrücke und Grundtypen', '2 · Expressions and fundamental types'],
  I3: ['3 · Kontrollstrukturen', '3 · Control statements'],
};

export const chapterSubject = (ch: string): Subject => (/^I\d/.test(ch) ? 'info' : ch.startsWith('LA') ? 'la' : ch.startsWith('CH') ? 'chem' : ch.startsWith('A') ? 'ana' : 'mech');
export const topicSubject = (t: Topic): Subject => chapterSubject(t.chapter);

/** Where a topic comes from, for the crumbs and lists: [long German, long English, short German, short English]. */
export function sourceLabel(t: Topic): [string, string, string, string] {
  if (topicSubject(t) === 'mech' || topicSubject(t) === 'info') {
    return [`Vorlesung S. ${t.pages}`, `Lecture notes ${t.pages.includes('–') ? 'pp.' : 'p.'} ${t.pages}`, `S. ${t.pages}`, `p. ${t.pages}`];
  }
  if (topicSubject(t) === 'chem') {
    // Chemistry: «V<n>/<slides>» = lecture n (Prof. Norris), slides = PDF page numbers of the lecture slides.
    const [v, pp] = t.pages.slice(1).split('/');
    const many = pp?.includes('–') || pp?.includes(',');
    return pp
      ? [`Vorlesung ${v}, Folie${many ? 'n' : ''} ${pp}`, `Lecture ${v}, slide${many ? 's' : ''} ${pp}`, `Vl. ${v}`, `Lec. ${v}`]
      : [`Vorlesung ${v}`, `Lecture ${v}`, `Vl. ${v}`, `Lec. ${v}`];
  }
  if (topicSubject(t) === 'la') {
    // Linear algebra: «Ü<n>/<slide numbers>» = exercise class n, slides (PDF page numbers) of its annotated slide deck.
    const [u, pp] = t.pages.slice(1).split('/');
    const many = pp?.includes('–') || pp?.includes(',');
    return pp
      ? [`Übung ${u}, Folie${many ? 'n' : ''} ${pp}`, `Exercise class ${u}, slide${many ? 's' : ''} ${pp}`, `Üb. ${u}`, `Ex. ${u}`]
      : [`Übung ${u}`, `Exercise class ${u}`, `Üb. ${u}`, `Ex. ${u}`];
  }
  // Analysis: every week is an Übungs-Resümee (PDF, «Ü<n>/<pages>»).
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
  { id: 'kraft', chapter: '4', title: ['Die Kraft als punktgebundener Vektor', 'Force as a point-bound vector'], pages: '29', status: 'review', component: lazy(() => import('../lessons/K1Kraft')) },
  { id: 'reaktionsprinzip', chapter: '4', title: ['Das Reaktionsprinzip', 'The reaction principle'], pages: '30', status: 'review', component: lazy(() => import('../lessons/K2Reaktion')) },
  { id: 'systemabgrenzung', chapter: '4', title: ['Innere und äussere Kräfte, Systemabgrenzung', 'Inner and outer forces, system boundary'], pages: '30–31', status: 'review', component: lazy(() => import('../lessons/K3System')) },
  { id: 'verteilte-kraefte', chapter: '4', title: ['Verteilte Kräfte und Kraftdichte', 'Distributed forces and force density'], pages: '31–32', status: 'review', component: lazy(() => import('../lessons/K4Verteilt')) },
  { id: 'leistung', chapter: '5', title: ['Leistung einer Kraft', 'Power of a force'], pages: '33', status: 'review', component: lazy(() => import('../lessons/K5Leistung')) },
  { id: 'leistung-rotation', chapter: '5', title: ['Leistung bei Rotation und das Moment', 'Power in rotation and the moment'], pages: '33–35', status: 'review', component: lazy(() => import('../lessons/K6Moment')) },
  { id: 'leistung-kraeftegruppe', chapter: '5', title: ['Leistung einer Kräftegruppe am starren Körper', 'Power of a group of forces on a rigid body'], pages: '34–36', status: 'review', component: lazy(() => import('../lessons/K7Kraeftegruppe')) },
  // Analysis 1 – one chapter per week (D-023). `pages`: «Ü<n>/<pdf pages>» = Übungs-Resümee n, pages of that PDF.
  { id: 'ana-folgen', chapter: 'A1', title: ['Folgen: beschränkt, monoton, konvergent', 'Sequences: bounded, monotonic, convergent'], pages: 'Ü1/10', status: 'review', component: lazy(() => import('../lessons/A1Folgen')) },
  { id: 'ana-grenzwerte-folgen', chapter: 'A1', title: ['Grenzwerte von Folgen', 'Limits of sequences'], pages: 'Ü1/11', status: 'review', component: lazy(() => import('../lessons/A1Grenzwerte')) },
  { id: 'ana-reihen', chapter: 'A1', title: ['Arithmetische, geometrische und harmonische Reihe', 'Arithmetic, geometric and harmonic series'], pages: 'Ü1/11–12', status: 'review', component: lazy(() => import('../lessons/A1Reihen')) },
  { id: 'ana-funktionen', chapter: 'A2', title: ['Funktionen, Definitions- und Wertebereich', 'Functions, domain and range'], pages: 'Ü2/2–4', status: 'review', component: lazy(() => import('../lessons/A2Funktionen')) },
  { id: 'ana-grenzwerte-funktionen', chapter: 'A2', title: ['Stetigkeit und Grenzwerte von Funktionen', 'Continuity and limits of functions'], pages: 'Ü2/4–7', status: 'review', component: lazy(() => import('../lessons/A2Grenzwerte')) },
  { id: 'ana-stetigkeit', chapter: 'A3', title: ['Stetigkeit, Lücken und Zwischenwertsatz', 'Continuity, gaps and the intermediate value theorem'], pages: 'Ü3/1–3', status: 'review', component: lazy(() => import('../lessons/A3Stetigkeit')) },
  { id: 'ana-transformationen', chapter: 'A3', title: ['Graphen verschieben, strecken, Kehrwert', 'Shifting and stretching graphs, reciprocals'], pages: 'Ü3/4–5', status: 'review', component: lazy(() => import('../lessons/A3Transformationen')) },
  { id: 'ana-umkehr', chapter: 'A3', title: ['Injektiv, surjektiv, Umkehrfunktion', 'Injective, surjective, inverse function'], pages: 'Ü3/5–8', status: 'review', component: lazy(() => import('../lessons/A3Umkehr')) },
  { id: 'ana-asymptoten', chapter: 'A3', title: ['Asymptoten', 'Asymptotes'], pages: 'Ü3/9–12', status: 'review', component: lazy(() => import('../lessons/A3Asymptoten')) },
  { id: 'ana-ableitung', chapter: 'A4', title: ['Differenzenquotient und Ableitung', 'Difference quotient and derivative'], pages: 'Ü4/2–3', status: 'review', component: lazy(() => import('../lessons/A4Ableitung')) },
  { id: 'ana-ableitungsregeln', chapter: 'A4', title: ['Ableitungsregeln', 'Rules of differentiation'], pages: 'Ü4/4–7', status: 'review', component: lazy(() => import('../lessons/A4Regeln')) },
  { id: 'ana-tangente', chapter: 'A4', title: ['Tangente und Normale', 'Tangent and normal'], pages: 'Ü4/8–9', status: 'review', component: lazy(() => import('../lessons/A4Tangente')) },
  { id: 'ana-fehler', chapter: 'A5', title: ['Fehlerrechnung', 'Error estimation'], pages: 'Ü5/1–2', status: 'review', component: lazy(() => import('../lessons/A5Fehler')) },
  { id: 'ana-mws', chapter: 'A5', title: ['Mittelwertsatz, Extrema und Wendepunkte', 'Mean value theorem, extrema and inflection points'], pages: 'Ü5/3–6', status: 'review', component: lazy(() => import('../lessons/A5Mittelwertsatz')) },
  { id: 'ana-komplex-rechnen', chapter: 'A5', title: ['Komplexe Zahlen: Rechnen', 'Complex numbers: arithmetic'], pages: 'Ü5/6–8', status: 'review', component: lazy(() => import('../lessons/A5Komplex')) },
  { id: 'ana-komplex', chapter: 'A6', title: ['Polarform und Eulerform', 'Polar form and Euler form'], pages: 'Ü6/1–7', status: 'review', component: lazy(() => import('../lessons/A6Polarform')) },
  { id: 'ana-komplex-potenzen', chapter: 'A6', title: ['Potenzen, Wurzeln und Winkelformeln', 'Powers, roots and angle formulas'], pages: 'Ü6/8–9, 11', status: 'review', component: lazy(() => import('../lessons/A6Potenzen')) },
  { id: 'ana-komplex-bereiche', chapter: 'A6', title: ['Bereiche in der komplexen Ebene', 'Regions in the complex plane'], pages: 'Ü6/10, 12', status: 'review', component: lazy(() => import('../lessons/A6Bereiche')) },
  // Lineare Algebra I – one chapter per exercise class (slides of M. Olofsson; «Ü<n>/<slides>»).
  { id: 'la-einstieg', chapter: 'LA1', title: ['Wozu Lineare Algebra?', 'Why linear algebra?'], pages: 'Ü1/4–14', status: 'review', component: lazy(() => import('../lessons/LA1Einstieg')) },
  { id: 'la-lgs', chapter: 'LA2', title: ['Lineare Gleichungssysteme geometrisch', 'Linear systems, geometrically'], pages: 'Ü2/4–24', status: 'review', component: lazy(() => import('../lessons/LA2Lgs')) },
  { id: 'la-gauss', chapter: 'LA2', title: ['Das Gauss-Verfahren', 'Gaussian elimination'], pages: 'Ü2/25–36', status: 'review', component: lazy(() => import('../lessons/LA2Gauss')) },
  { id: 'la-rang', chapter: 'LA3', title: ['Pivots, freie Variablen und Rang', 'Pivots, free variables and rank'], pages: 'Ü4/5–11', status: 'review', component: lazy(() => import('../lessons/LA3Rang')) },
  { id: 'la-spaltenbild', chapter: 'LA3', title: ['Gleichungssysteme im Spaltenbild', 'Linear systems as a column picture'], pages: 'Ü4/12–13', status: 'review', component: lazy(() => import('../lessons/LA3Spaltenbild')) },
  { id: 'la-transformation', chapter: 'LA4', title: ['Die Matrix als Transformation des Raums', 'The matrix as a transformation of space'], pages: 'Ü4/14–21', status: 'review', component: lazy(() => import('../lessons/LA4Transformation')) },
  { id: 'la-rechnen', chapter: 'LA4', title: ['Matrizen: Notation, Summe, Skalar', 'Matrices: notation, sum, scalar'], pages: 'Ü4/22–25', status: 'review', component: lazy(() => import('../lessons/LA4Rechnen')) },
  { id: 'la-spezial', chapter: 'LA4', title: ['Spezielle Matrizen und Transponieren', 'Special matrices and the transpose'], pages: 'Ü4/31–36', status: 'review', component: lazy(() => import('../lessons/LA4Spezial')) },
  { id: 'la-produkt', chapter: 'LA5', title: ['Das Matrixprodukt', 'The matrix product'], pages: 'Ü4/26–30', status: 'review', component: lazy(() => import('../lessons/LA5Produkt')) },
  // Chemie – one chapter per lecture (slides of Prof. D. J. Norris, HS 2026; «V<n>/<slides>»). Exercise classes 1–6 (TA slides) are woven into the lessons.
  { id: 'ch-atome', chapter: 'CH1', title: ['Atome, Elemente und das Periodensystem', 'Atoms, elements and the periodic table'], pages: 'V1/10–24', status: 'review', component: lazy(() => import('../lessons/CH1Atome')) },
  { id: 'ch-stoechio', chapter: 'CH1', title: ['Reaktionen, Mol und Stöchiometrie', 'Reactions, the mole and stoichiometry'], pages: 'V1/25–31', status: 'review', component: lazy(() => import('../lessons/CH1Stoechio')) },
  { id: 'ch-gase', chapter: 'CH2', title: ['Gase: Druck und die Gasgesetze', 'Gases: pressure and the gas laws'], pages: 'V2/8–23', status: 'review', component: lazy(() => import('../lessons/CH2Gase')) },
  { id: 'ch-kinetik', chapter: 'CH2', title: ['Kinetische Gastheorie und reale Gase', 'Kinetic theory and real gases'], pages: 'V2/24–30', status: 'review', component: lazy(() => import('../lessons/CH2Kinetik')) },
  { id: 'ch-loesungen', chapter: 'CH3', title: ['Lösungen, Ionen und Fällungsreaktionen', 'Solutions, ions and precipitation'], pages: 'V3/8–16', status: 'review', component: lazy(() => import('../lessons/CH3Loesungen')) },
  { id: 'ch-redox', chapter: 'CH3', title: ['Säuren, Basen und Redoxreaktionen', 'Acids, bases and redox reactions'], pages: 'V3/17–29', status: 'review', component: lazy(() => import('../lessons/CH3Redox')) },
  { id: 'ch-energie', chapter: 'CH4', title: ['Energie und der 1. Hauptsatz', 'Energy and the first law'], pages: 'V4/6–15', status: 'review', component: lazy(() => import('../lessons/CH4Energie')) },
  { id: 'ch-enthalpie', chapter: 'CH4', title: ['Enthalpie, Kalorimetrie und der Satz von Hess', 'Enthalpy, calorimetry and Hess’s law'], pages: 'V4/16–30', status: 'review', component: lazy(() => import('../lessons/CH4Enthalpie')) },
  { id: 'ch-entropie', chapter: 'CH5', title: ['Spontane Prozesse und Entropie', 'Spontaneous processes and entropy'], pages: 'V5/7–21', status: 'review', component: lazy(() => import('../lessons/CH5Entropie')) },
  { id: 'ch-gibbs', chapter: 'CH5', title: ['Freie Enthalpie nach Gibbs', 'Gibbs free energy'], pages: 'V5/22–29', status: 'review', component: lazy(() => import('../lessons/CH5Gibbs')) },
  { id: 'ch-licht', chapter: 'CH6', title: ['Licht, Spektren und das Bohr-Modell', 'Light, spectra and the Bohr model'], pages: 'V6/6–12', status: 'review', component: lazy(() => import('../lessons/CH6Licht')) },
  { id: 'ch-orbitale', chapter: 'CH6', title: ['Orbitale, Quantenzahlen und Elektronenkonfiguration', 'Orbitals, quantum numbers and electron configuration'], pages: 'V6/13–27', status: 'review', component: lazy(() => import('../lessons/CH6Orbitale')) },
  { id: 'ch-trends', chapter: 'CH6', title: ['Abschirmung, Atomgrösse und Ionisierungsenergie', 'Screening, atomic size and ionisation energy'], pages: 'V6/28–32', status: 'review', component: lazy(() => import('../lessons/CH6Trends')) },
  // Informatik I – one chapter per lecture-notes file (infln01 … infln07); `pages` are the printed pages of the notes.
  { id: 'i-algorithmus', chapter: 'I1', title: ['Algorithmus und Schachtel-Rechner', 'Algorithm and box computer'], pages: '8–12', status: 'review', component: lazy(() => import('../lessons/I1Algorithmus')) },
  { id: 'i-rechner', chapter: 'I1', title: ['Vom Modell zum Rechner: Turing, von Neumann, Syntax', 'From model to computer: Turing, von Neumann, syntax'], pages: '12–17', status: 'draft', component: lazy(() => import('../lessons/I1Rechner')) },
  { id: 'i-programm', chapter: 'I1', title: ['Das erste Programm: Aufbau und Ausgabe', 'The first program: structure and output'], pages: '18–21', status: 'draft', component: lazy(() => import('../lessons/I1Programm')) },
  { id: 'i-variablen', chapter: 'I1', title: ['Variablen: Deklaration, Zuweisung, Initialisierung', 'Variables: declaration, assignment, initialization'], pages: '21–25', status: 'draft', component: lazy(() => import('../lessons/I1Variablen')) },
  { id: 'i-ausdruecke', chapter: 'I1', title: ['Eingabe, Ausdrücke und Konstanten', 'Input, expressions and constants'], pages: '25–29', status: 'draft', component: lazy(() => import('../lessons/I1Ausdruecke')) },
  { id: 'i-vorrang', chapter: 'I2', title: ['Vorrang und Ausdrucksbäume', 'Precedence and expression trees'], pages: '30–34', status: 'draft', component: lazy(() => import('../lessons/I2Vorrang')) },
  { id: 'i-operatoren', chapter: 'I2', title: ['Operatoren: Zuweisung, Division, ++ und +=', 'Operators: assignment, division, ++ and +='], pages: '34–36', status: 'draft', component: lazy(() => import('../lessons/I2Operatoren')) },
  { id: 'i-ganzzahlen', chapter: 'I2', title: ['Ganze Zahlen: Wertebereich und Überlauf', 'Integers: range and overflow'], pages: '37–40', status: 'draft', component: lazy(() => import('../lessons/I2Ganzzahlen')) },
  { id: 'i-fliesskomma', chapter: 'I2', title: ['Kommazahlen: float und double', 'Floating point numbers: float and double'], pages: '40–43', status: 'draft', component: lazy(() => import('../lessons/I2Fliesskomma')) },
  { id: 'i-wahrheitswerte', chapter: 'I2', title: ['Wahrheitswerte und logische Operatoren', 'Truth values and logical operators'], pages: '43–48', status: 'draft', component: lazy(() => import('../lessons/I2Wahrheitswerte')) },
  { id: 'i-verzweigung', chapter: 'I3', title: ['Verzweigung: if und else', 'Selection: if and else'], pages: '49–50', status: 'draft', component: lazy(() => import('../lessons/I3Verzweigung')) },
  { id: 'i-for', chapter: 'I3', title: ['Die for-Schleife', 'The for loop'], pages: '50–53', status: 'draft', component: lazy(() => import('../lessons/I3For')) },
  { id: 'i-bloecke', chapter: 'I3', title: ['Blöcke und Sichtbarkeit', 'Blocks and visibility'], pages: '53–57', status: 'draft', component: lazy(() => import('../lessons/I3Bloecke')) },
  { id: 'i-while', chapter: 'I3', title: ['while, do-while, break und continue', 'while, do-while, break and continue'], pages: '57–64', status: 'draft', component: lazy(() => import('../lessons/I3While')) },
  { id: 'i-kontrollfluss', chapter: 'I3', title: ['Kontrollfluss und switch', 'Control flow and switch'], pages: '64–70', status: 'draft', component: lazy(() => import('../lessons/I3Kontrollfluss')) },
];
