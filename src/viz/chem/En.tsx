import type { ReactNode } from 'react';

/** English course term inside German text: «Atomgewicht (<En>atomic weight</En>)». The e2e language check skips `[lang="en"]`. */
export function En({ children }: { children: ReactNode }) {
  return <em lang="en" className="en-term">{children}</em>;
}
