# create-tletelieru-app

Template and CLI for new personal web apps. Plan in `docs/PLAN.md`.

## Conventions

- Use pnpm.
- No code comments unless explicitly requested.
- The CLI has no runtime dependencies: Node built-ins only.
- `templates/` must keep working with no manual edits after generation. After changing it, generate every framework and MUI combination and run `pnpm lint`, `pnpm test` and `pnpm build` there.
- `// @if` markers are the only comments allowed in templates: generation removes them.
- Fixes found in a generated app go back into the template.
