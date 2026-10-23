/**
 * Elements used in the chemistry lessons: atomic number, symbol, names, standard atomic weight (u), period and group.
 * Atomic weights are the rounded standard values (IUPAC); the lecture's periodic table is the reference for what is shown.
 * Technetium has no stable isotope: its entry is the mass number of its longest-lived isotope.
 */
export interface Element {
  Z: number;
  symbol: string;
  de: string;
  en: string;
  /** atomic weight in u (g/mol) */
  mass: number;
  period: number;
  /** IUPAC group 1–18 (lanthanides/actinides are not in the table) */
  group: number;
}

// Z symbol de en mass [period group for the few entries that do not follow the rule]
const RAW = `1 H Wasserstoff Hydrogen 1.008
2 He Helium Helium 4.0026
3 Li Lithium Lithium 6.94
4 Be Beryllium Beryllium 9.0122
5 B Bor Boron 10.81
6 C Kohlenstoff Carbon 12.011
7 N Stickstoff Nitrogen 14.007
8 O Sauerstoff Oxygen 15.999
9 F Fluor Fluorine 18.998
10 Ne Neon Neon 20.180
11 Na Natrium Sodium 22.990
12 Mg Magnesium Magnesium 24.305
13 Al Aluminium Aluminium 26.982
14 Si Silicium Silicon 28.085
15 P Phosphor Phosphorus 30.974
16 S Schwefel Sulfur 32.06
17 Cl Chlor Chlorine 35.45
18 Ar Argon Argon 39.948
19 K Kalium Potassium 39.098
20 Ca Calcium Calcium 40.078
21 Sc Scandium Scandium 44.956
22 Ti Titan Titanium 47.867
23 V Vanadium Vanadium 50.942
24 Cr Chrom Chromium 51.996
25 Mn Mangan Manganese 54.938
26 Fe Eisen Iron 55.845
27 Co Cobalt Cobalt 58.933
28 Ni Nickel Nickel 58.693
29 Cu Kupfer Copper 63.546
30 Zn Zink Zinc 65.38
31 Ga Gallium Gallium 69.723
32 Ge Germanium Germanium 72.630
33 As Arsen Arsenic 74.922
34 Se Selen Selenium 78.971
35 Br Brom Bromine 79.904
36 Kr Krypton Krypton 83.798
37 Rb Rubidium Rubidium 85.468
38 Sr Strontium Strontium 87.62
39 Y Yttrium Yttrium 88.906
40 Zr Zirkonium Zirconium 91.224
41 Nb Niob Niobium 92.906
42 Mo Molybdän Molybdenum 95.95
43 Tc Technetium Technetium 98
44 Ru Ruthenium Ruthenium 101.07
45 Rh Rhodium Rhodium 102.91
46 Pd Palladium Palladium 106.42
47 Ag Silber Silver 107.87
48 Cd Cadmium Cadmium 112.41
49 In Indium Indium 114.82
50 Sn Zinn Tin 118.71
51 Sb Antimon Antimony 121.76
52 Te Tellur Tellurium 127.60
53 I Iod Iodine 126.90
54 Xe Xenon Xenon 131.29
55 Cs Caesium Cesium 132.91 6 1
56 Ba Barium Barium 137.33 6 2
79 Au Gold Gold 196.97 6 11
80 Hg Quecksilber Mercury 200.59 6 12
82 Pb Blei Lead 207.2 6 14`;

/** period and group by the shape of the periodic table (valid for Z ≤ 54) */
function position(Z: number): [number, number] {
  if (Z === 1) return [1, 1];
  if (Z === 2) return [1, 18];
  const rows: [number, number, number][] = [[3, 10, 2], [11, 18, 3], [19, 36, 4], [37, 54, 5]]; // first Z, last Z, period
  for (const [a, b, p] of rows) {
    if (Z < a || Z > b) continue;
    const n = Z - a; // index in the period
    if (p <= 3) return [p, n < 2 ? n + 1 : n + 11]; // s block: 1, 2; p block: 13–18
    return [p, n + 1];
  }
  throw new Error(`no position for Z=${Z}`);
}

export const ELEMENTS: Element[] = RAW.split('\n').map((line) => {
  const t = line.split(' ');
  const Z = Number(t[0]);
  const [period, group] = t.length > 5 ? [Number(t[5]), Number(t[6])] : position(Z);
  return { Z, symbol: t[1], de: t[2], en: t[3], mass: Number(t[4]), period, group };
});

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));
const BY_Z = new Map(ELEMENTS.map((e) => [e.Z, e]));
export const bySymbol = (s: string): Element => {
  const e = BY_SYMBOL.get(s);
  if (!e) throw new Error(`unknown element «${s}»`);
  return e;
};
export const byZ = (Z: number): Element | undefined => BY_Z.get(Z);
