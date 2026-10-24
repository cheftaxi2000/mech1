/**
 * The full periodic table as on lecture-1 slide 18 (118 elements): grid position, class (metal / metalloid / nonmetal,
 * the slide's tan / purple / green) and the common family names of slide 19. The elements of `elements.ts` supply the
 * masses, names and positions that the course uses elsewhere; the heavier ones are added here (mass number of the
 * longest-lived isotope for the radioactive ones).
 */
import { ELEMENTS, type Element } from './elements';

export type EClass = 'metal' | 'metalloid' | 'nonmetal';
export type Family = 'alkali' | 'alkaline' | 'transition' | 'lanthanide' | 'actinide' | 'chalcogen' | 'halogen' | 'noble' | 'other';

export interface PCell extends Element {
  /** grid row (1–7 main table, 9 lanthanides, 10 actinides) and column (1–18) */
  row: number;
  col: number;
  /** null for the f-block elements 57–70 and 89–102 */
  group: number;
  cls: EClass;
  family: Family;
}

// Z symbol de en mass (elements not in elements.ts)
const EXTRA = `57 La Lanthan Lanthanum 138.91
58 Ce Cer Cerium 140.12
59 Pr Praseodym Praseodymium 140.91
60 Nd Neodym Neodymium 144.24
61 Pm Promethium Promethium 145
62 Sm Samarium Samarium 150.36
63 Eu Europium Europium 151.96
64 Gd Gadolinium Gadolinium 157.25
65 Tb Terbium Terbium 158.93
66 Dy Dysprosium Dysprosium 162.50
67 Ho Holmium Holmium 164.93
68 Er Erbium Erbium 167.26
69 Tm Thulium Thulium 168.93
70 Yb Ytterbium Ytterbium 173.05
71 Lu Lutetium Lutetium 174.97
72 Hf Hafnium Hafnium 178.49
73 Ta Tantal Tantalum 180.95
74 W Wolfram Tungsten 183.84
75 Re Rhenium Rhenium 186.21
76 Os Osmium Osmium 190.23
77 Ir Iridium Iridium 192.22
78 Pt Platin Platinum 195.08
81 Tl Thallium Thallium 204.38
83 Bi Bismut Bismuth 208.98
84 Po Polonium Polonium 209
85 At Astat Astatine 210
86 Rn Radon Radon 222
87 Fr Francium Francium 223
88 Ra Radium Radium 226
89 Ac Actinium Actinium 227
90 Th Thorium Thorium 232.04
91 Pa Protactinium Protactinium 231.04
92 U Uran Uranium 238.03
93 Np Neptunium Neptunium 237
94 Pu Plutonium Plutonium 244
95 Am Americium Americium 243
96 Cm Curium Curium 247
97 Bk Berkelium Berkelium 247
98 Cf Californium Californium 251
99 Es Einsteinium Einsteinium 252
100 Fm Fermium Fermium 257
101 Md Mendelevium Mendelevium 258
102 No Nobelium Nobelium 259
103 Lr Lawrencium Lawrencium 266
104 Rf Rutherfordium Rutherfordium 267
105 Db Dubnium Dubnium 268
106 Sg Seaborgium Seaborgium 269
107 Bh Bohrium Bohrium 270
108 Hs Hassium Hassium 277
109 Mt Meitnerium Meitnerium 278
110 Ds Darmstadtium Darmstadtium 281
111 Rg Roentgenium Roentgenium 282
112 Cn Copernicium Copernicium 285
113 Nh Nihonium Nihonium 286
114 Fl Flerovium Flerovium 289
115 Mc Moscovium Moscovium 290
116 Lv Livermorium Livermorium 293
117 Ts Tenness Tennessine 294
118 Og Oganesson Oganesson 294`;

const period = (Z: number) => (Z <= 2 ? 1 : Z <= 10 ? 2 : Z <= 18 ? 3 : Z <= 36 ? 4 : Z <= 54 ? 5 : Z <= 86 ? 6 : 7);

/** Group 1–18 of the main table; null for the f-block rows. Lu and Lr sit under Y in group 3 (as on the slide). */
function groupOf(Z: number): number | null {
  if ((Z >= 57 && Z <= 70) || (Z >= 89 && Z <= 102)) return null;
  if (Z === 71 || Z === 103) return 3;
  if (Z === 1) return 1;
  if (Z === 2) return 18;
  const first = [3, 11, 19, 37, 55, 87];
  const start = first.filter((f) => f <= Z).pop()!;
  const n = Z - start; // index in the period
  const p = period(Z);
  if (p <= 3) return n < 2 ? n + 1 : n + 11;
  if (p <= 5) return n + 1;
  // periods 6 and 7: skip the 14 f-block elements
  if (n < 2) return n + 1;
  if (Z <= 86 && Z >= 72) return Z - 72 + 4;
  return Z - 104 + 4;
}

const METALLOIDS = new Set(['B', 'Si', 'Ge', 'As', 'Sb', 'Te']);
const NONMETALS = new Set(['H', 'C', 'N', 'O', 'F', 'P', 'S', 'Cl', 'Se', 'Br', 'I', 'At', 'He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']);
const classOf = (s: string): EClass => (METALLOIDS.has(s) ? 'metalloid' : NONMETALS.has(s) ? 'nonmetal' : 'metal');

function familyOf(Z: number, s: string, g: number | null): Family {
  if (Z >= 57 && Z <= 71) return 'lanthanide';
  if (Z >= 89 && Z <= 103) return 'actinide';
  if (g === 1 && Z !== 1) return 'alkali';
  if (g === 2) return 'alkaline';
  if (g !== null && g >= 3 && g <= 12) return 'transition';
  if (['O', 'S', 'Se', 'Te', 'Po'].includes(s)) return 'chalcogen';
  if (['F', 'Cl', 'Br', 'I', 'At'].includes(s)) return 'halogen';
  if (['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'].includes(s)) return 'noble';
  return 'other';
}

const extra: Element[] = EXTRA.split('\n').map((l) => {
  const t = l.split(' ');
  return { Z: Number(t[0]), symbol: t[1], de: t[2], en: t[3], mass: Number(t[4]), period: period(Number(t[0])), group: groupOf(Number(t[0])) ?? 0 };
});

/** All 118 elements in the order of atomic number. */
export const PERIODIC: PCell[] = [...ELEMENTS, ...extra]
  .sort((a, b) => a.Z - b.Z)
  .map((e) => {
    const g = groupOf(e.Z);
    const f = (e.Z >= 57 && e.Z <= 70) || (e.Z >= 89 && e.Z <= 102);
    const row = f ? (e.Z <= 70 ? 9 : 10) : period(e.Z);
    const col = f ? 3 + (e.Z <= 70 ? e.Z - 57 : e.Z - 89) : g!;
    return { ...e, period: period(e.Z), group: g ?? 0, row, col, cls: classOf(e.symbol), family: familyOf(e.Z, e.symbol, g) };
  });

export const cellBySymbol = (s: string): PCell => {
  const c = PERIODIC.find((e) => e.symbol === s);
  if (!c) throw new Error(`unknown element «${s}»`);
  return c;
};
export const cellByZ = (Z: number): PCell | undefined => PERIODIC.find((e) => e.Z === Z);

/** The families named on slide 19 (group, English name, members). */
export const FAMILY_NAMES: Record<Family, [string, string]> = {
  alkali: ['Alkalimetalle', 'Alkali metals'],
  alkaline: ['Erdalkalimetalle', 'Alkaline earth metals'],
  transition: ['Übergangsmetalle', 'Transition metals'],
  lanthanide: ['Lanthanoide', 'Lanthanides'],
  actinide: ['Actinoide', 'Actinides'],
  chalcogen: ['Chalkogene', 'Chalcogens'],
  halogen: ['Halogene', 'Halogens'],
  noble: ['Edelgase', 'Noble gases'],
  other: ['übrige Elemente', 'other elements'],
};
