import { messages } from '../i18n/messages';
import { locales } from '../i18n/locales';
import type { Locale } from '../i18n/locales';
import { useMessages } from '../i18n/react';
import type { ColorMode } from '../lib/theme';
import { MoonIcon, SunIcon } from './icons';

type Props = {
  locale: Locale;
  mode: ColorMode;
  onLocale: (locale: Locale) => void;
  onToggleMode: () => void;
};

export default function Header({ locale, mode, onLocale, onToggleMode }: Props) {
  const t = useMessages(messages);
  const modeLabel = mode === 'dark' ? t.toLight : t.toDark;

  return (
    <header className="header">
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
      <p className="brand">{t.appName}</p>
      {locales.length > 1 && (
        <div className="locales" role="group" aria-label={t.language}>
          {locales.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === locale}
              onClick={() => onLocale(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="icon-button"
        aria-label={modeLabel}
        title={modeLabel}
        onClick={onToggleMode}
      >
        {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
