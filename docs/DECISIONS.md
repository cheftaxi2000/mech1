# Decisions

| ID | Date | Decision | Why |
|---|---|---|---|
| D-001 | 2026-10-10 | Vite + React 19 + TypeScript, KaTeX, three.js via @react-three/fiber/drei, Vitest, Playwright. Static site, no backend. | Fast, typed, testable; KaTeX renders synchronously (testable, no flicker); r3f makes 3D figures declarative; static output can be hosted anywhere. |
| D-002 | 2026-10-10 | Explanations in English; German lecture terms kept verbatim and glossed. | Student wrote in English; the exam and notes are German, so the German vocabulary must stay visible. **Revisit if the student prefers German.** |
| D-003 | 2026-10-10 | The lecture PDF is **not committed** (`source/*.pdf` is gitignored). `docs/SOURCE_MAP.md` transcribes it page by page instead. | Lecture material may not be redistributable and repo visibility is unknown. **Student to decide**; if the repo is private they may want it committed under `source/`. |
| D-004 | 2026-10-10 | 3D text labels are canvas-texture sprites (`viz/primitives.tsx Label`), not drei `<Html>`. | The first drei `<Html>` per scene rendered empty with React 19 (reproduced in e2e, not StrictMode-related). Sprites are part of the WebGL image and always render. |
| D-005 | 2026-10-10 | Inverse coordinate maps use atan2 / arccos; the lecture's arctan forms are shown and explained (R-001). | Correctness without silently changing the lecture. |
| D-006 | 2026-10-10 | Derivations are expanded by default. | "Explain every meaningful mathematical transition" — collapsing hides steps. Collapsible for revision. |
| D-007 | 2026-10-10 | Every worked example from the notes gets a numeric test in `src/physics/*.test.ts` *before* it is taught. | That is how R-003, R-004, R-007 were found/confirmed. |
