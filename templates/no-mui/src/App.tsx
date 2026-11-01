import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { messages } from './i18n/messages';
import { pickLocale, preferredLocaleKey } from './i18n/locales';
import type { Locale } from './i18n/locales';
import { LocaleProvider } from './i18n/react';
import { colorModeKey, pickColorMode } from './lib/theme';
import type { ColorMode } from './lib/theme';
import './styles.css';

const prefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

export default function App() {
  const [locale, setLocale] = useState<Locale>(() =>
    pickLocale(localStorage.getItem(preferredLocaleKey), navigator.languages),
  );
  const [mode, setMode] = useState<ColorMode>(() =>
    pickColorMode(localStorage.getItem(colorModeKey), prefersDark()),
  );
  const t = messages[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.appName;
    localStorage.setItem(preferredLocaleKey, locale);
  }, [locale, t.appName]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(colorModeKey, mode);
  }, [mode]);

  return (
    <LocaleProvider locale={locale}>
      <div className="page">
        <Header
          locale={locale}
          mode={mode}
          onLocale={setLocale}
          onToggleMode={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        />
        <main>
          <h1>{t.hero.title}</h1>
          <p className="muted">{t.hero.subtitle}</p>
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
