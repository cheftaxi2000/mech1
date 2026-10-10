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

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'de', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* not persisted; fine */ }
  };
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext).lang;
export const useSetLang = () => useContext(LangContext).setLang;

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
