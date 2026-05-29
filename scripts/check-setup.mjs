#!/usr/bin/env node

/**
 * Verifica se o template foi configurado corretamente.
 * Executado automaticamente no pre-commit via Husky.
 * Bloqueia o commit se o setup ainda não foi feito.
 *
 * Para pular esta verificação (ex: no repo do template em si):
 *   SKIP_SETUP_CHECK=1 git commit ...
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.SKIP_SETUP_CHECK) {
    process.exit(0);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));

const issues = [];

if (pkg.name === 'nodejs-lib-template') {
    issues.push('O campo "name" ainda está com o valor padrão do template.');
}

if (!pkg.description) {
    issues.push('O campo "description" está vazio.');
}

if (!pkg.author) {
    issues.push('O campo "author" está vazio.');
}

if (pkg.repository?.url?.includes('xxx')) {
    issues.push('O campo "repository.url" ainda contém o placeholder (xxx).');
}

if (issues.length > 0) {
    console.error('');
    console.error('  ❌ O template ainda não foi configurado!');
    console.error('');
    issues.forEach((issue) => console.error(`     • ${issue}`));
    console.error('');
    console.error('  Execute o setup antes de commitar:');
    console.error('');
    console.error('     node scripts/setup.mjs');
    console.error('');
    process.exit(1);
}
