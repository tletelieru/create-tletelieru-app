import { Box, Container, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { messages } from './i18n/messages';
import { pickLocale, preferredLocaleKey } from './i18n/locales';
import type { Locale } from './i18n/locales';
import { LocaleProvider } from './i18n/react';
import { colorModeKey, createAppTheme, pickColorMode } from './lib/theme';
import type { ColorMode } from './lib/theme';

const prefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

export default function App() {
  const [locale, setLocale] = useState<Locale>(() =>
    pickLocale(localStorage.getItem(preferredLocaleKey), navigator.languages),
  );
  const [mode, setMode] = useState<ColorMode>(() =>
    pickColorMode(localStorage.getItem(colorModeKey), prefersDark()),
  );
  const theme = useMemo(() => createAppTheme(mode), [mode]);
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocaleProvider locale={locale}>
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
          <Stack spacing={3}>
            <Header
              locale={locale}
              mode={mode}
              onLocale={setLocale}
              onToggleMode={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            />
            <Box component="main">
              <Typography variant="h4" component="h1">
                {t.hero.title}
              </Typography>
              <Typography color="text.secondary">{t.hero.subtitle}</Typography>
            </Box>
            <Footer />
          </Stack>
        </Container>
      </LocaleProvider>
    </ThemeProvider>
  );
}
