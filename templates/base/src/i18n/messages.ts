import { defineMessages } from './react';

type Strings = {
  appName: string;
  toLight: string;
  toDark: string;
  language: string;
  hero: { title: string; subtitle: string };
  footer: { developedBy: string };
};

export const messages = defineMessages<Strings>({
  // @if en
  en: {
    appName: '__APP_TITLE__',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    language: 'Language',
    hero: { title: '__APP_TITLE__', subtitle: '__APP_DESCRIPTION__' },
    footer: { developedBy: 'Developed by' },
  },
  // @endif
  // @if es
  es: {
    appName: '__APP_TITLE__',
    toLight: 'Cambiar a modo claro',
    toDark: 'Cambiar a modo oscuro',
    language: 'Idioma',
    hero: { title: '__APP_TITLE__', subtitle: '__APP_DESCRIPTION__' },
    footer: { developedBy: 'Desarrollado por' },
  },
  // @endif
});
