import { M, MD } from './Tex';
import { chemTex } from '../chem/tex';

/** Inline chemical formula or reaction: `<C>H2O</C>`, `<C p=",">{'2 H2 + O2 -> 2 H2O'}</C>`; see `chem/tex.ts` for the notation. */
export function C({ children, p }: { children: string; p?: string }) {
  return <M p={p}>{chemTex(children)}</M>;
}

/** Display-mode reaction equation. */
export function CD({ children, tag }: { children: string; tag?: string }) {
  return <MD tag={tag}>{chemTex(children)}</MD>;
}
