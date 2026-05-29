# Node.js Library Template

Template pronto para criação de bibliotecas Node.js com TypeScript, incluindo tooling moderno para lint, formatação, testes, build e publicação no GitHub Packages.

## Funcionalidades

- **TypeScript** com build via [tsup](https://tsup.egoist.dev/) (output CJS + ESM + declarações de tipo)
- **Biome.js** para lint e formatação de código
- **Jest** para testes unitários
- **Commitlint** com Conventional Commits
- **Husky** com git hooks para validação automática
- **GitHub Actions** com pipelines de CI e CD
- **Publicação** no GitHub Packages (npm registry)
- **Scripts de versionamento** para bump semântico

## Estrutura do Projeto

```
├── .github/workflows/
│   ├── ci.yml              # Pipeline de integração contínua
│   └── cd.yml.example      # Pipeline de deploy (renomear para ativar)
├── .husky/
│   ├── pre-commit          # Executa validação antes do commit
│   └── commit-msg          # Valida mensagem de commit
├── scripts/
│   ├── bump-version.sh     # Bump de versão semântica
│   └── check-version-bump.sh  # Verifica se houve bump (usado no CD)
├── src/
│   └── index.ts            # Entry point da lib
├── tests/
│   └── index.spec.ts       # Testes unitários
├── biome.json              # Configuração do Biome.js
├── commitlint.config.ts    # Configuração do Commitlint
├── jest.config.ts          # Configuração do Jest
├── tsconfig.json           # Configuração do TypeScript
├── tsconfig.test.json      # Configuração do TypeScript para testes
├── tsup.config.ts          # Configuração do build (tsup)
└── package.json
```

## Pré-requisitos

- Node.js >= 22
- Yarn

## Início Rápido

1. Crie um novo repositório usando este template (botão "Use this template" no GitHub)
2. Clone o repositório criado
3. Execute o script de setup:

```bash
node scripts/setup.mjs
```

O script vai pedir o nome da lib, descrição, URL do repositório e autor — com validação de formato — atualizar o `package.json` e se auto-remover.

4. Instale as dependências:

```bash
yarn install
```

5. Comece a desenvolver em `src/index.ts`

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `yarn dev` | Executa `src/index.ts` com tsx (hot reload) |
| `yarn build` | Gera o build de produção (CJS + ESM) |
| `yarn start` | Executa o build compilado |
| `yarn test` | Roda os testes |
| `yarn test:watch` | Roda os testes em modo watch |
| `yarn typecheck` | Verifica tipos sem emitir arquivos |
| `yarn lint` | Executa o linter (Biome) |
| `yarn format` | Formata o código (Biome) |
| `yarn check` | Lint + format com auto-fix (Biome) |
| `yarn validate` | Typecheck + lint + testes (usado no pre-commit) |

## Biome.js

O template usa [Biome.js](https://biomejs.dev/) como linter e formatter unificado, substituindo ESLint + Prettier.

### Configurações principais

- **Indentação:** espaços (4)
- **Largura de linha:** 140 caracteres
- **Aspas:** simples
- **Semicolons:** sempre
- **Trailing commas:** sempre
- **Nomes de arquivo:** kebab-case obrigatório

### Convenções de nomenclatura

| Tipo | Formato |
|------|---------|
| Classes, Interfaces, Types, Enums | `PascalCase` |
| Enum members | `CONSTANT_CASE` ou `PascalCase` |
| Funções | `camelCase` ou `PascalCase` |
| Variáveis | `camelCase`, `CONSTANT_CASE` ou `PascalCase` |

### Regras destacadas

- `noUnusedImports`: erro
- `noUnusedVariables`: warning
- `noExplicitAny`: warning
- `noConsole`: warning
- `useNodejsImportProtocol`: erro (usar `node:fs` ao invés de `fs`)
- `noExcessiveCognitiveComplexity`: warning (máx. 15)

> Em arquivos de teste (`*.spec.ts`, `*.test.ts`), `noExplicitAny` e `noConsole` são desabilitados.

## Commitlint

Mensagens de commit devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
chore: tarefas de manutenção
refactor: refatoração sem mudança de comportamento
test: adiciona ou corrige testes
```

O hook `commit-msg` do Husky valida automaticamente a mensagem antes de cada commit.

## Git Hooks (Husky)

| Hook | Ação |
|------|------|
| `pre-commit` | Executa `yarn validate` (typecheck + lint + testes) |
| `commit-msg` | Valida a mensagem de commit com commitlint |

## Build

O build é feito com [tsup](https://tsup.egoist.dev/) e gera:

- `dist/index.js` — CommonJS
- `dist/index.mjs` — ES Modules
- `dist/index.d.ts` — Declarações de tipo (CJS)
- `dist/index.d.mts` — Declarações de tipo (ESM)
- Source maps incluídos

O `package.json` já está configurado com `exports` para suportar tanto `import` quanto `require`.

## CI/CD

### CI (`.github/workflows/ci.yml`)

Executa automaticamente em push e pull requests na branch `main`:

1. Instala dependências (`yarn install --frozen-lockfile`)
2. Lint (`yarn lint`)
3. Typecheck (`yarn typecheck`)
4. Testes (`yarn test`)
5. Build (`yarn build`)

### CD (`.github/workflows/cd.yml.example`)

Pipeline de publicação no GitHub Packages. Para ativar:

1. Renomeie `cd.yml.example` para `cd.yml`
2. Configure o secret `GH_PAT` no repositório (Personal Access Token com permissão `write:packages`)

O pipeline:

1. Verifica se houve bump de versão (`scripts/check-version-bump.sh`)
2. Instala dependências
3. Faz o build
4. Publica no GitHub Packages

> O CD só publica se a versão no `package.json` for diferente do commit anterior. Isso evita publicações duplicadas.

## Versionamento

Use o script de bump para atualizar a versão antes de fazer merge na `main`:

```bash
# Patch: 0.1.0 → 0.1.1
bash scripts/bump-version.sh patch

# Minor: 0.1.0 → 0.2.0
bash scripts/bump-version.sh minor

# Major: 0.1.0 → 1.0.0
bash scripts/bump-version.sh major
```

O script atualiza o `package.json` sem criar tags git, permitindo que você inclua o bump no mesmo commit da feature.

## Publicação no GitHub Packages

### Configuração do repositório

O `package.json` já está configurado para publicar no GitHub Packages:

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### Consumindo a lib

Para instalar a lib em outro projeto, configure o registry do escopo no `.npmrc`:

```
@seu-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PAT}
```

Depois instale normalmente:

```bash
yarn add @seu-org/sua-lib
```

## Licença

MIT
