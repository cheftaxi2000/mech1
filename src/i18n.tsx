import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Two complete languages. German uses Swiss orthography (ss, not ß) as at ETH.
 * Every visible text must exist in both: lessons use <T de={…} en={…} />, components use useTr().
 */
export type Lang = 'de' | 'en';
const KEY = 'mech1.lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch { /* storage unavailable: fall through */ }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')) return 'en';
  return 'de';
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; forceEn: (on: boolean) => void }>({ lang: 'de', setLang: () => {}, forceEn: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [chosen, setLangState] = useState<Lang>(initialLang);
  /** Informatik I is taught in English only: while it is open the language is English, the stored choice is kept for the other subjects. */
  const [forced, forceEn] = useState(false);
  const lang: Lang = forced ? 'en' : chosen;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* not persisted; fine */ }
  };
  return <LangContext.Provider value={{ lang, setLang, forceEn }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext).lang;
export const useSetLang = () => useContext(LangContext).setLang;
export const useForceEn = () => useContext(LangContext).forceEn;

/** Translate a pair of strings in components: const tr = useTr(); tr('Prüfen', 'Check'). */
export function useTr() {
  const lang = useLang();
  return <X,>(de: X, en: X): X => (lang === 'de' ? de : en);
}

/** Bilingual content block for lessons. Both languages are required by the type. */
export function T({ de, en }: { de: ReactNode; en: ReactNode }) {
  return <>{useLang() === 'de' ? de : en}</>;
}

/** Number formatting: German uses a decimal comma. `tex` protects the comma from KaTeX's punctuation spacing. */
export function fmtNum(x: number, digits: number, lang: Lang, tex = false): string {
  const s = (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits);
  const d = lang === 'de' ? s.replace('.', tex ? '{,}' : ',') : s;
  return tex ? d : d.replace(/^-/, '\u2212'); // plain text gets a true minus sign, like KaTeX
}

/** Separator between tuple entries: "(1,15; 0,96)" in German avoids clashing with the decimal comma. */
export const tupleSep = (lang: Lang) => (lang === 'de' ? ';\\ ' : ',\\ ');

export function LangToggle() {
  const lang = useLang(), setLang = useSetLang();
  return (
    <div className="lang-toggle" role="group" aria-label="Sprache / Language">
      {(['de', 'en'] as Lang[]).map((l) => (
        <button key={l} aria-pressed={lang === l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>
          {l === 'de' ? 'Deutsch' : 'English'}
        </button>
      ))}
    </div>
  );
}

/**
 * Reading depth. `full` is the complete lesson; `short` keeps lecture boxes, formulas, key points and all figures/animations
 * and drops the explanatory prose (the CSS rules under `html[data-detail="short"]` do the generic part, `<Long>` the rest).
 */
export type Detail = 'full' | 'short';
const DETAIL_KEY = 'mech1.detail';
const DetailContext = createContext<{ detail: Detail; setDetail: (d: Detail) => void }>({ detail: 'full', setDetail: () => {} });

export function DetailProvider({ children }: { children: ReactNode }) {
  const [detail, setDetailState] = useState<Detail>(() => {
    try { return localStorage.getItem(DETAIL_KEY) === 'short' ? 'short' : 'full'; } catch { return 'full'; }
  });
  useEffect(() => { document.documentElement.dataset.detail = detail; }, [detail]);
  const setDetail = (d: Detail) => {
    setDetailState(d);
    try { localStorage.setItem(DETAIL_KEY, d); } catch { /* not persisted; fine */ }
  };
  return <DetailContext.Provider value={{ detail, setDetail }}>{children}</DetailContext.Provider>;
}

export const useDetail = () => useContext(DetailContext).detail;

/** Content that exists only in the full version (explanations, side remarks). */
export function Long({ children }: { children: ReactNode }) {
  return useDetail() === 'full' ? <>{children}</> : null;
}

export function DetailToggle() {
  const { detail, setDetail } = useContext(DetailContext);
  const tr = useTr();
  return (
    <div className="lang-toggle detail-toggle" role="group" aria-label={tr('Umfang', 'Level of detail')}>
      {([['full', 'Ausführlich', 'Full'], ['short', 'Kurz', 'Short']] as const).map(([d, de, en]) => (
        <button key={d} aria-pressed={detail === d} className={detail === d ? 'active' : ''} onClick={() => setDetail(d)}>{tr(de, en)}</button>
      ))}
    </div>
  );
}
