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
  title: string;
  titleEn: string;
  pages: string;
  status: Status;
  component?: LazyExoticComponent<ComponentType>;
}

export const CHAPTERS = {
  '1': '1 · Bewegung eines materiellen Punktes',
  '2': '2 · Geschwindigkeit',
  '3': '3 · Starrer Körper',
} as const;

export const TOPICS: Topic[] = [
  { id: 'koordinaten', chapter: '1', title: 'Lage & Koordinaten', titleEn: 'Position, reference body, coordinate systems', pages: '3–4', status: 'review', component: lazy(() => import('../lessons/L01Coordinates')) },
  { id: 'vektoren', chapter: '1', title: 'Vektoren, Skalar- & Kreuzprodukt', titleEn: 'Vectors, dot and cross product', pages: '5', status: 'planned' },
  { id: 'basen', chapter: '1', title: 'Kartesische, zylindrische, sphärische Basis', titleEn: 'Local bases', pages: '5–7', status: 'planned' },
  { id: 'geschwindigkeit', chapter: '2', title: 'Geschwindigkeitsvektor & Schnelligkeit', titleEn: 'Velocity vector and speed', pages: '8–9', status: 'planned' },
  { id: 'v-krummlinig', chapter: '2', title: 'Geschwindigkeit in Zylinder-/Kugelkoordinaten', titleEn: 'Velocity in curvilinear bases', pages: '10', status: 'planned' },
  { id: 'kreisbewegung', chapter: '2', title: 'Kreisbewegung & Winkelgeschwindigkeit', titleEn: 'Circular motion, ω × r', pages: '11 + slides', status: 'planned' },
  { id: 'sdpg', chapter: '3', title: 'Starrer Körper & SdpG', titleEn: 'Rigid body, projected velocities', pages: '12–13', status: 'planned' },
  { id: 'translation', chapter: '3', title: 'Translation', titleEn: 'Translation', pages: '13–14', status: 'planned' },
  { id: 'rotation', chapter: '3', title: 'Rotation', titleEn: 'Rotation about a fixed axis', pages: '15–19', status: 'planned' },
  { id: 'rollen', chapter: '3', title: 'Rollen & Gleiten', titleEn: 'Rolling and sliding', pages: '20', status: 'planned' },
  { id: 'kreiselung', chapter: '3', title: 'Kreiselung', titleEn: 'Motion about a fixed point', pages: '20–21', status: 'planned' },
  { id: 'allgemein', chapter: '3', title: 'Allgemeine Bewegung', titleEn: 'General rigid-body motion', pages: '22–23', status: 'planned' },
];
