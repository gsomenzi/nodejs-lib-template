#!/usr/bin/env node

/**
 * Script de setup inicial do template.
 * Execute uma vez após criar o repositório a partir do template:
 *
 *   node scripts/setup.mjs
 *
 * Atualiza package.json, limpa arquivos de exemplo e se auto-remove.
 */

import { createInterface } from 'node:readline/promises';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const rl = createInterface({ input: process.stdin, output: process.stdout });

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data) {
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function success(msg) {
    console.log(`  ✅ ${msg}`);
}

function error(msg) {
    console.error(`  ❌ ${msg}`);
}

function info(msg) {
    console.log(`  ℹ️  ${msg}`);
}

// ─── Validações ─────────────────────────────────────────────────────────────

function validatePackageName(name) {
    if (!name || name.trim().length === 0) {
        return 'Nome é obrigatório.';
    }

    const scopedRegex = /^@[a-z0-9-]+\/[a-z0-9._-]+$/;
    const unscopedRegex = /^[a-z0-9._-]+$/;

    if (!scopedRegex.test(name) && !unscopedRegex.test(name)) {
        return 'Nome inválido. Use o formato @org/nome ou nome-simples (lowercase, sem espaços).';
    }

    return null;
}

function validateRepoUrl(url) {
    if (!url || url.trim().length === 0) {
        return 'URL do repositório é obrigatória.';
    }

    const githubRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/;
    if (!githubRegex.test(url)) {
        return 'URL inválida. Use o formato https://github.com/org/repo.git';
    }

    return null;
}

function validateNotEmpty(value, field) {
    if (!value || value.trim().length === 0) {
        return `${field} é obrigatório(a).`;
    }
    return null;
}

// ─── Prompts com validação ──────────────────────────────────────────────────

async function ask(question, validator) {
    const MAX_ATTEMPTS = 3;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
        const answer = (await rl.question(`  ${question}`)).trim();
        const err = validator ? validator(answer) : null;

        if (!err) return answer;

        error(err);
        attempts++;
    }

    error('Número máximo de tentativas atingido.');
    process.exit(1);
}

async function askOptional(question, defaultValue = '') {
    const suffix = defaultValue ? ` (${defaultValue})` : ' (opcional)';
    const answer = (await rl.question(`  ${question}${suffix}: `)).trim();
    return answer || defaultValue;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
    console.log('');
    console.log('  🚀 Setup do template de lib Node.js');
    console.log('  ────────────────────────────────────');
    console.log('');

    // Verifica se já foi configurado
    const pkg = readJson(resolve(ROOT, 'package.json'));
    if (pkg.name !== 'nodejs-lib-template') {
        info('Este projeto já foi configurado (package.json name != "nodejs-lib-template").');
        const proceed = await askOptional('Deseja reconfigurar? (s/N)', 'N');
        if (proceed.toLowerCase() !== 's') {
            console.log('  Abortado.');
            process.exit(0);
        }
    }

    // Coleta dados
    const name = await ask('Nome da lib (ex: @minha-org/minha-lib): ', validatePackageName);
    const description = await askOptional('Descrição');
    const repoUrl = await ask('URL do repositório (ex: https://github.com/org/repo.git): ', validateRepoUrl);
    const author = await ask('Autor (ex: Nome <email>): ', (v) => validateNotEmpty(v, 'Autor'));

    // Confirmação
    console.log('');
    console.log('  📋 Resumo:');
    console.log(`     Nome:        ${name}`);
    console.log(`     Descrição:   ${description || '(vazio)'}`);
    console.log(`     Repositório: ${repoUrl}`);
    console.log(`     Autor:       ${author}`);
    console.log('');

    const confirm = await askOptional('Confirma? (S/n)', 'S');
    if (confirm.toLowerCase() === 'n') {
        console.log('  Abortado.');
        process.exit(0);
    }

    // Atualiza package.json
    pkg.name = name;
    pkg.version = '0.1.0';
    pkg.description = description || '';
    pkg.repository.url = repoUrl;
    pkg.author = author;

    writeJson(resolve(ROOT, 'package.json'), pkg);
    success('package.json atualizado.');

    // Remove este script
    const selfPath = resolve(__dirname, 'setup.mjs');
    if (existsSync(selfPath)) {
        unlinkSync(selfPath);
        success('Script de setup removido.');
    }

    console.log('');
    console.log('  🎉 Setup concluído! Próximos passos:');
    console.log('');
    console.log('     1. yarn install');
    console.log('     2. Renomeie .github/workflows/cd.yml.example → cd.yml');
    console.log('     3. Configure o secret GH_PAT no repositório');
    console.log('     4. Comece a desenvolver em src/index.ts');
    console.log('');

    rl.close();
}

main().catch((err) => {
    error(err.message);
    process.exit(1);
});
