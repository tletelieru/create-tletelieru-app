import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const templatesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates');

export const frameworks = ['vite', 'astro'];
export const knownLocales = ['en', 'es'];

const MUI_ONLY_DEPENDENCIES = ['@emotion/react', '@emotion/styled', '@mui/material'];
const MUI_ONLY_FILES = ['src/components/SelectField.tsx', 'src/lib/menu.ts', 'src/lib/menu.test.ts'];
const CODE_FILES = new Set(['.ts', '.tsx', '.js', '.mjs']);
const MARKUP_FILES = new Set(['.html', '.astro']);

export function isValidName(name) {
  return /^[a-z0-9][a-z0-9-]*$/.test(name);
}

export function titleFromName(name) {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function parseLocales(text) {
  const parsed = text.split(',').map((locale) => locale.trim().toLowerCase());
  const unique = knownLocales.filter((locale) => parsed.includes(locale));
  if (unique.length === 0 || parsed.some((locale) => !knownLocales.includes(locale))) {
    throw new Error(`Invalid locales: ${text}. Use en, es or en,es.`);
  }
  return unique;
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

export function escapeFor(extension, value) {
  if (CODE_FILES.has(extension)) return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  if (MARKUP_FILES.has(extension)) {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
  return value;
}

function fill(text, values, extension) {
  return Object.entries(values).reduce(
    (out, [key, value]) => out.replaceAll(key, () => escapeFor(extension, value)),
    text,
  );
}

const IF_LINE = /^\s*(?:\/\/|<!--)\s*@if\s+(\w+)\s*(?:-->)?\s*$/;
const END_LINE = /^\s*(?:\/\/|<!--)\s*@endif\s*(?:-->)?\s*$/;

export function applyConditions(text, flags) {
  let skipping = false;
  const kept = [];
  for (const line of text.split('\n')) {
    const opened = IF_LINE.exec(line);
    if (opened) {
      skipping = !flags.has(opened[1]);
    } else if (END_LINE.test(line)) {
      skipping = false;
    } else if (!skipping) {
      kept.push(line);
    }
  }
  return kept.join('\n');
}

function sorted(record) {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}

function mergePackage(target, mui) {
  const pkgPath = join(target, 'package.json');
  const fragmentPath = join(target, 'package.fragment.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const fragment = JSON.parse(readFileSync(fragmentPath, 'utf8'));
  for (const field of ['scripts', 'dependencies', 'devDependencies']) {
    pkg[field] = sorted({ ...pkg[field], ...fragment[field] });
  }
  if (!mui) {
    for (const name of MUI_ONLY_DEPENDENCIES) delete pkg.dependencies[name];
  }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  rmSync(fragmentPath);
}

export function scaffold({
  target,
  name,
  title,
  description,
  port,
  framework = 'vite',
  mui = true,
  locales = knownLocales,
  year = new Date().getFullYear(),
}) {
  if (!isValidName(name)) throw new Error(`Invalid name: ${name}`);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`Invalid port: ${port}`);
  }
  if (!frameworks.includes(framework)) throw new Error(`Invalid framework: ${framework}`);
  if (/[\r\n]/.test(title + description)) {
    throw new Error('Title and description must be a single line');
  }
  if (existsSync(target) && readdirSync(target).length > 0) {
    throw new Error(`${target} already exists and is not empty`);
  }

  mkdirSync(target, { recursive: true });
  const layers = ['base', framework, ...(mui ? [] : ['no-mui'])];
  for (const layer of layers) {
    cpSync(join(templatesDir, layer), target, { recursive: true });
  }
  renameSync(join(target, '_gitignore'), join(target, '.gitignore'));
  mergePackage(target, mui);
  if (!mui) {
    for (const file of MUI_ONLY_FILES) rmSync(join(target, file));
  }

  const flags = new Set([...locales, mui ? 'mui' : 'nomui']);
  if (locales.length > 1) flags.add('both');
  const stack = [framework === 'astro' ? 'Astro + React' : 'React + Vite', ...(mui ? ['MUI'] : [])];
  const values = {
    __APP_NAME__: name,
    __APP_TITLE__: title,
    __APP_DESCRIPTION__: description,
    __PORT__: String(port),
    __YEAR__: String(year),
    __DEFAULT_LOCALE__: locales[0],
    __LOCALE_LIST__: locales.join(' and '),
    __STACK__: stack.join(', '),
  };
  const localeList = locales.map((locale) => `'${locale}'`).join(', ');

  for (const file of walk(target)) {
    const text = readFileSync(file, 'utf8');
    const conditioned = applyConditions(text, flags).replaceAll('__LOCALES__', localeList);
    const filled = fill(conditioned, values, extname(file));
    if (filled !== text) writeFileSync(file, filled);
  }
}
