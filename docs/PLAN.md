# Plan — create-tletelieru-app

Los repos publicados repiten el mismo setup. Este proyecto lo saca a un template para que la próxima app parta en minutos.

## Formatos

1. Repo template en GitHub ("Use this template").
2. CLI `npm create tletelieru-app@latest mi-app`.

## Fases

### Fase 1 — Template Vite y CLI local

- [x] `templates/`: React, Vite, TypeScript strict, MUI, en/es, claro/oscuro, header, footer.
- [x] PWA con manifest, íconos desde un SVG y precache solo del shell.
- [x] ESLint flat + Prettier, Husky + lint-staged, Vitest + Testing Library.
- [x] GitHub Actions: lint y tests en PR, deploy a Pages solo desde `main`.
- [x] `base` de Vite derivado del nombre del repo.
- [x] LICENSE MIT, README con badge y link, CLAUDE.md con convenciones.
- [x] CLI: nombre, título, descripción y puerto; copia, reemplaza e instala.
- [x] Validación: generar `amigo-secreto` con el CLI y pasar lint, tests y build.

### Fase 2 — Opciones del CLI

- [x] Escapar comillas en título y descripción al rellenar archivos TS.
- [x] Preguntar MUI sí/no.
- [x] Preguntar idiomas (en, es o ambos).
- [x] Variante Astro.

### Fase 3 — Publicación

- [x] Repo `tletelieru-app-template` en GitHub marcado como template, generado con este CLI (Vite + MUI, en/es).
- [ ] Publicar en npm.
- [ ] Probar `pnpm create tletelieru-app` desde el paquete publicado.
