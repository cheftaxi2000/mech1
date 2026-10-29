import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'katex/dist/katex.min.css';
import './styles.css';
import './roles.css';
import './viz/info/info.css';
import './theme.css';
import { App } from './App';
import { DetailProvider, LangProvider } from './i18n';

// Opening the app always starts at the home menu (subject choice), even if the browser restored an old #lesson anchor.
// A manual reload keeps the current page; automated browsers (e2e) keep their deep links.
try {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!navigator.webdriver && nav?.type !== 'reload' && window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
} catch { /* keep whatever the URL says */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <DetailProvider>
        <App />
      </DetailProvider>
    </LangProvider>
  </StrictMode>,
);
