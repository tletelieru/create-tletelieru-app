#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import {
  frameworks,
  isValidName,
  parseLocales,
  scaffold,
  titleFromName,
} from '../lib/scaffold.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    description: { type: 'string' },
    port: { type: 'string' },
    framework: { type: 'string' },
    locales: { type: 'string' },
    mui: { type: 'boolean' },
    'no-mui': { type: 'boolean' },
    'no-install': { type: 'boolean', default: false },
  },
});

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = async (question, fallback) => {
  if (!process.stdin.isTTY) return fallback;
  return (await rl.question(`${question} (${fallback}): `)).trim() || fallback;
};

const name = positionals[0] ?? (await ask('Project name', 'my-app'));
if (!isValidName(name)) {
  console.error(`Invalid name "${name}": use lowercase letters, digits and dashes.`);
  process.exit(1);
}

const title = values.title ?? (await ask('Title', titleFromName(name)));
const description = values.description ?? (await ask('Description', title));
const port = Number(values.port ?? (await ask('Dev port', '5173')));
const framework = (
  values.framework ?? (await ask(`Framework (${frameworks.join('/')})`, 'vite'))
)
  .trim()
  .toLowerCase();
const mui = values['no-mui'] ? false : (values.mui ?? /^y/i.test(await ask('Use MUI? (y/n)', 'y')));
const localeText = values.locales ?? (await ask('Locales (en, es or en,es)', 'en,es'));
rl.close();

const target = resolve(name);
const run = (command) => execSync(command, { cwd: target, stdio: 'inherit' });

try {
  const locales = parseLocales(localeText);
  scaffold({ target, name, title, description, port, framework, mui, locales });
  run('git init -b main');
  if (!values['no-install']) {
    run('pnpm install');
    run('pnpm gen:icons');
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`\nReady: ${target}\n  cd ${name}\n  pnpm dev`);
