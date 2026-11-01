import { messages } from '../i18n/messages';
import { useMessages } from '../i18n/react';
import { GitHubIcon } from './icons';

const GITHUB_URL = 'https://github.com/tletelieru';
const SITE_URL = 'https://tletelieru.github.io/tletelieru/';

export default function Footer() {
  const t = useMessages(messages).footer;

  return (
    <footer className="footer">
      <p>
        <span>
          {t.developedBy}{' '}
          <a href={SITE_URL} target="_blank" rel="noreferrer">
            tletelieru
          </a>
        </span>
        <a
          className="icon-button"
          aria-label="GitHub"
          title="GitHub"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon />
        </a>
      </p>
      <small>© {new Date().getFullYear()} tletelieru</small>
    </footer>
  );
}
