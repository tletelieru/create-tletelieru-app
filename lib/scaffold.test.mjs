import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  applyConditions,
  escapeFor,
  isValidName,
  parseLocales,
  scaffold,
  titleFromName,
} from './scaffold.mjs';

const options = { name: 'my-app', title: 'My App', description: 'Does things', port: 5999 };
const fresh = () => join(mkdtempSync(join(tmpdir(), 'scaffold-')), 'app');

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

test('validates names', () => {
  assert.equal(isValidName('my-app2'), true);
  assert.equal(isValidName('My App'), false);
  assert.equal(isValidName('-app'), false);
  assert.equal(isValidName('../app'), false);
});

test('derives a title from the name', () => {
  assert.equal(titleFromName('amigo-secreto'), 'Amigo Secreto');
});

test('fills every placeholder', () => {
  const target = fresh();
  scaffold({ ...options, target });
  for (const file of walk(target)) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /__[A-Z_]+__/, file);
  }
  assert.equal(JSON.parse(readFileSync(join(target, 'package.json'))).name, 'my-app');
  assert.match(readFileSync(join(target, 'vite.config.ts'), 'utf8'), /port: 5999/);
});

test('restores the gitignore', () => {
  const target = fresh();
  scaffold({ ...options, target });
  assert.equal(existsSync(join(target, '.gitignore')), true);
  assert.equal(existsSync(join(target, '_gitignore')), false);
});

test('refuses a non-empty target', () => {
  const target = fresh();
  mkdirSync(target);
  writeFileSync(join(target, 'keep.txt'), 'x');
  assert.throws(() => scaffold({ ...options, target }), /not empty/);
});

test('rejects a bad port', () => {
  assert.throws(() => scaffold({ ...options, port: 80, target: fresh() }), /Invalid port/);
});

const read = (target, file) => readFileSync(join(target, file), 'utf8');

for (const framework of ['vite', 'astro']) {
  for (const mui of [true, false]) {
    for (const locales of [['en', 'es'], ['en'], ['es']]) {
      test(`generates ${framework}, mui ${mui}, ${locales}`, () => {
        const target = fresh();
        scaffold({ ...options, target, framework, mui, locales });
        for (const file of walk(target)) {
          const text = readFileSync(file, 'utf8');
          assert.doesNotMatch(text, /__[A-Z_]+__/, file);
          assert.doesNotMatch(text, /@(if|endif)\b/, file);
        }
        assert.equal(existsSync(join(target, 'package.fragment.json')), false);
        assert.equal(existsSync(join(target, 'src/components/SelectField.tsx')), mui);
        const pkg = JSON.parse(read(target, 'package.json'));
        assert.equal('@mui/material' in pkg.dependencies, mui);
        assert.equal('astro' in pkg.dependencies, framework === 'astro');
        assert.equal(pkg.scripts.dev, framework === 'astro' ? 'astro dev' : 'vite');
        const messages = read(target, 'src/i18n/messages.ts');
        assert.equal(messages.includes('  en: {'), locales.includes('en'));
        assert.equal(messages.includes('  es: {'), locales.includes('es'));
      });
    }
  }
}

test('keeps quotes valid in code and markup', () => {
  const target = fresh();
  scaffold({ ...options, target, title: "Bob's <App>" });
  assert.ok(read(target, 'vite.config.ts').includes("name: 'Bob\\'s <App>'"));
  assert.ok(read(target, 'index.html').includes("<title>Bob's &lt;App&gt;</title>"));
});

test('escapes by file type', () => {
  assert.equal(escapeFor('.ts', "it's"), "it\\'s");
  assert.equal(escapeFor('.astro', 'a&b'), 'a&amp;b');
  assert.equal(escapeFor('.md', "it's"), "it's");
});

test('rejects a multi-line title', () => {
  assert.throws(() => scaffold({ ...options, title: 'a\nb', target: fresh() }), /single line/);
});

test('rejects an unknown framework', () => {
  assert.throws(() => scaffold({ ...options, framework: 'next', target: fresh() }), /framework/);
});

test('parses locales', () => {
  assert.deepEqual(parseLocales('es, en'), ['en', 'es']);
  assert.deepEqual(parseLocales('es'), ['es']);
  assert.throws(() => parseLocales('fr'), /Invalid locales/);
  assert.throws(() => parseLocales(''), /Invalid locales/);
});

test('removes inactive blocks and every marker', () => {
  const text = 'a\n// @if x\nb\n// @endif\n<!-- @if y -->\nc\n<!-- @endif -->\nd';
  assert.equal(applyConditions(text, new Set(['y'])), 'a\nc\nd');
});
