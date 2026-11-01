# __APP_NAME__

__APP_DESCRIPTION__

## Stack

__STACK__, TypeScript strict, PWA, Vitest + Testing Library, ESLint + Prettier, Husky + lint-staged, GitHub Pages.

## Conventions

- Use pnpm.
- No code comments unless explicitly requested.
- All UI text lives in `src/i18n/messages.ts` (__LOCALE_LIST__). Locale and color mode are kept in localStorage.
<!-- @if mui -->
- Every select goes through `src/components/SelectField.tsx`. A menu never opens on top of its field.
<!-- @endif -->
- The icons come from `public/favicon.svg`: run `pnpm gen:icons` after changing it.
- The `base` comes from `GITHUB_REPOSITORY` in CI and from the project name locally.
- The precache holds only the app shell.
- lint-staged calls tools through `node node_modules/...`: its spawner cannot run Windows `.cmd` shims.
- Check UI changes in a screenshot, mobile included, before reporting them done.
