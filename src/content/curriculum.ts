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

export interface Topic {
  id: string;
  chapter: string;
  /** [German, English]. The German title follows the lecture's own headings. */
  title: [string, string];
  pages: string;
  status: Status;
  component?: LazyExoticComponent<ComponentType>;
}

export const CHAPTERS: Record<string, [string, string]> = {
  '1': ['1 · Bewegung eines materiellen Punktes', '1 · Motion of a material point'],
  '2': ['2 · Geschwindigkeit', '2 · Velocity'],
  '3': ['3 · Starrer Körper', '3 · Rigid body'],
};

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
];
