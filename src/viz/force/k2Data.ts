/**
 * «Wo ist die Gegenkraft?» (p. 30: «Es existiert keine Kraft ohne Reaktion») — four everyday scenes as data.
 * Every force of a scene belongs to a PAIR {B | F̲} on one body and {A | −F̲} on the other body (Reaktionsprinzip).
 * SVG coordinates (y down) in a 480 × 300 frame. `A` = point of application on the body `on`, `B` on the body `by`.
 * Contact forces: A = B (the two points coincide, p. 30); forces at a distance: the force lies on the line through A and B (Zusatzpostulat).
 */
export type V = readonly [number, number];
export interface KBody { id: string; de: string; en: string; box: readonly [number, number, number, number]; /** where the name is written (screen px); omitted = not written */ lab?: V }
export interface KPair {
  id: string;
  /** TeX name of the force on the body `on` (the reaction is called −name) */
  sym: string;
  on: string; by: string;
  A: V; B: V;
  /** unit direction of the force ON `on` (screen coordinates, y down) */
  dir: V;
  /** arrow length in px (equal for both members of the pair) */
  len: number;
  fern: boolean;
  de: { force: string; counter: string }; en: { force: string; counter: string };
  /** extra remark for this pair; $…$ is TeX */
  note?: { de: string; en: string };
}
export interface KScene { id: string; de: string; en: string; bodies: KBody[]; pairs: KPair[] }

export const K2_SCENES: KScene[] = [
  {
    id: 'book', de: 'Buch auf Tisch', en: 'Book on a table',
    bodies: [
      { id: 'book', de: 'Buch', en: 'book', box: [200, 128, 280, 170], lab: [310, 148] },
      { id: 'table', de: 'Tisch', en: 'table', box: [110, 170, 370, 262], lab: [420, 177] },
      { id: 'earth', de: 'Erde', en: 'Earth', box: [0, 262, 480, 300], lab: [44, 282] },
    ],
    pairs: [
      { id: 'G', sym: String.raw`\v G`, on: 'book', by: 'earth', A: [240, 149], B: [240, 282], dir: [0, 1], len: 52, fern: true,
        de: { force: 'Die Erde zieht am Buch (Gewicht).', counter: 'Das Buch zieht an der Erde.' },
        en: { force: 'The Earth pulls on the book (its weight).', counter: 'The book pulls on the Earth.' },
        note: { de: 'Fernkraft: Die beiden Pfeile liegen auf der Geraden durch Buch und Erde. Die Gegenkraft von $\\v G$ ist NICHT die Kraft $\\v N$ des Tisches.', en: 'Force at a distance: both arrows lie on the line through book and Earth. The counter-force of $\\v G$ is NOT the force $\\v N$ of the table.' } },
      { id: 'N', sym: String.raw`\v N`, on: 'book', by: 'table', A: [214, 170], B: [214, 170], dir: [0, -1], len: 52, fern: false,
        de: { force: 'Der Tisch drückt das Buch nach oben.', counter: 'Das Buch drückt auf den Tisch.' },
        en: { force: 'The table pushes the book up.', counter: 'The book presses on the table.' },
        note: { de: 'Kontaktkraft: Beide Angriffspunkte fallen zusammen. In Wahrheit drückt der Tisch auf die ganze Auflagefläche; wir zeichnen einen Pfeil.', en: 'Contact force: both points of application coincide. In reality the table pushes on the whole contact area; we draw one arrow.' } },
    ],
  },
  {
    id: 'wall', de: 'Hand an der Wand', en: 'Hand on a wall',
    bodies: [
      { id: 'person', de: 'Person', en: 'person', box: [110, 56, 332, 266], lab: [168, 96] },
      { id: 'wall', de: 'Wand', en: 'wall', box: [330, 30, 392, 262], lab: [361, 70] },
      { id: 'floor', de: 'Boden', en: 'floor', box: [0, 262, 480, 300], lab: [44, 282] },
    ],
    pairs: [
      { id: 'F', sym: String.raw`\v F`, on: 'wall', by: 'person', A: [331, 146], B: [331, 146], dir: [1, 0], len: 56, fern: false,
        de: { force: 'Deine Hand drückt gegen die Wand.', counter: 'Die Wand drückt gegen deine Hand.' },
        en: { force: 'Your hand pushes on the wall.', counter: 'The wall pushes on your hand.' },
        note: { de: 'Du spürst die Wand, weil sie zurückdrückt – ohne Gegenkraft gäbe es nichts zu spüren.', en: 'You feel the wall because it pushes back – without a counter-force there would be nothing to feel.' } },
      { id: 'R', sym: String.raw`\v R`, on: 'person', by: 'floor', A: [140, 262], B: [140, 262], dir: [1, 0], len: 40, fern: false,
        de: { force: 'Der Boden schiebt deinen Fuss nach vorn (Reibung).', counter: 'Dein Fuss schiebt den Boden nach hinten.' },
        en: { force: 'The floor pushes your foot forwards (friction).', counter: 'Your foot pushes the floor backwards.' },
        note: { de: 'Auch das ist ein Paar: Damit du nicht wegrutschst, muss der Boden an deinem Fuss mitdrücken.', en: 'This is a pair too: so that you do not slide away, the floor has to push on your foot.' } },
    ],
  },
  {
    id: 'ladder', de: 'Leiter an der Wand', en: 'Ladder against a wall',
    bodies: [
      { id: 'ladder', de: 'Leiter', en: 'ladder', box: [186, 96, 424, 262], lab: [262, 150] },
      { id: 'wall', de: 'Wand', en: 'wall', box: [420, 20, 480, 262], lab: [450, 60] },
      { id: 'earth', de: 'Boden / Erde', en: 'floor / Earth', box: [0, 260, 480, 300], lab: [60, 282] },
    ],
    pairs: [
      { id: 'W', sym: String.raw`\v W`, on: 'ladder', by: 'wall', A: [421, 104], B: [421, 104], dir: [-1, 0], len: 44, fern: false,
        de: { force: 'Die Wand drückt die Leiter von sich weg.', counter: 'Die Leiter drückt gegen die Wand.' },
        en: { force: 'The wall pushes the ladder away from itself.', counter: 'The ladder pushes against the wall.' } },
      { id: 'N', sym: String.raw`\v N`, on: 'ladder', by: 'earth', A: [190, 261], B: [190, 261], dir: [0, -1], len: 64, fern: false,
        de: { force: 'Der Boden drückt den Leiterfuss nach oben.', counter: 'Der Leiterfuss drückt auf den Boden.' },
        en: { force: 'The floor pushes the foot of the ladder up.', counter: 'The foot of the ladder presses on the floor.' } },
      { id: 'H', sym: String.raw`\v H`, on: 'ladder', by: 'earth', A: [190, 261], B: [190, 261], dir: [1, 0], len: 44, fern: false,
        de: { force: 'Die Reibung am Boden hält den Fuss zurück.', counter: 'Der Leiterfuss zieht den Boden mit.' },
        en: { force: 'Friction at the floor holds the foot back.', counter: 'The foot of the ladder drags the floor along.' } },
      { id: 'G', sym: String.raw`\v G`, on: 'ladder', by: 'earth', A: [305, 180], B: [305, 284], dir: [0, 1], len: 64, fern: true,
        de: { force: 'Die Erde zieht an der Leiter (Gewicht).', counter: 'Die Leiter zieht an der Erde.' },
        en: { force: 'The Earth pulls on the ladder (its weight).', counter: 'The ladder pulls on the Earth.' },
        note: { de: 'Fernkraft: wieder auf der Geraden durch die beiden Körper.', en: 'Force at a distance: again on the line through the two bodies.' } },
    ],
  },
  {
    id: 'magnet', de: 'Zwei Magnete', en: 'Two magnets',
    bodies: [
      { id: 'm1', de: 'Magnet 1', en: 'magnet 1', box: [70, 118, 190, 162], lab: [130, 184] },
      { id: 'm2', de: 'Magnet 2', en: 'magnet 2', box: [290, 118, 410, 162], lab: [350, 184] },
    ],
    pairs: [
      { id: 'F', sym: String.raw`\v F`, on: 'm2', by: 'm1', A: [350, 140], B: [130, 140], dir: [-1, 0], len: 70, fern: true,
        de: { force: 'Magnet 1 zieht an Magnet 2.', counter: 'Magnet 2 zieht an Magnet 1.' },
        en: { force: 'Magnet 1 pulls on magnet 2.', counter: 'Magnet 2 pulls on magnet 1.' },
        note: { de: 'Fernkraft: Kraft und Gegenkraft liegen auf der Verbindungsgeraden (gestrichelt) – das Zusatzpostulat.', en: 'Force at a distance: force and counter-force lie on the connecting line (dashed) – the additional postulate.' } },
    ],
  },
];
