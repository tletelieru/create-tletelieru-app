import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { defaultLocale } from './i18n/locales';
import { messages } from './i18n/messages';

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('preferred-lang', defaultLocale);
  localStorage.setItem('color-mode', 'light');
});

afterEach(cleanup);

describe('App', () => {
  it('credits the developer in the footer', () => {
    render(<App />);
    const footer = within(screen.getByRole('contentinfo'));
    expect(footer.getByRole('link', { name: 'tletelieru' })).toBeTruthy();
  });

  // @if both
  it('switches language and remembers it', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'ES' }));
    expect(localStorage.getItem('preferred-lang')).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });
  // @endif

  it('toggles color mode and remembers it', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: messages[defaultLocale].toDark }));
    expect(localStorage.getItem('color-mode')).toBe('dark');
  });
});
