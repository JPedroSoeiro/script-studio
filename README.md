# Script Studio

Web-IDE interativa no estilo CodeSandbox, rodando 100% no navegador. Escreva, edite e execute código React/TypeScript sem nenhum backend — editor, sistema de arquivos, bundler e preview funcionam inteiramente no cliente.

## Funcionalidades

- **Editor Monaco** (`@monaco-editor/react`) com um modelo por arquivo (histórico de undo preservado ao trocar de aba) e IntelliSense real para React/ReactDOM via `.d.ts` estáticos.
- **Sistema de arquivos virtual em memória** (Zustand): criar, renomear, excluir e abrir arquivos/pastas pelo explorador lateral, com abas de edição.
- **Bundler no navegador** (`esbuild-wasm`, self-hosted): resolve imports relativos contra o FS virtual e bare imports (`react`, `react-dom/client`, etc.) via import map apontando para o [esm.sh](https://esm.sh).
- **Preview isolado**: build injetado em um `<iframe sandbox>`, atualizado automaticamente a cada alteração. Se um build falhar, o último preview válido é mantido na tela.
- **Terminal integrado** (Xterm.js): mostra logs de build em tempo real (início, duração, tamanho, erros e avisos formatados `arquivo:linha:coluna`).
- **Tema claro/escuro** e layout com painéis redimensionáveis (`react-resizable-panels` + shadcn/ui).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (Base UI)
- Zustand (estado do FS virtual e da runtime)
- Monaco Editor, esbuild-wasm, Xterm.js

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Arquitetura

O motor de build vive atrás de uma interface única (`src/lib/runtime/types.ts`, `RuntimeEngine`), hoje implementada com `esbuild-wasm`. Isso permite no futuro adicionar um motor baseado em [WebContainers](https://webcontainers.io) (Node.js real via WASM, com `npm install` e shell de verdade) sem alterar o editor, o FS virtual ou o terminal — só é preciso trocar a implementação da interface.

### Limitação conhecida (MVP)

Como o `esbuild-wasm` não roda um Node.js real, não há `npm install` de verdade: pacotes "instalados" (declarados em um `package.json` virtual no projeto) são resolvidos em tempo de execução via CDN (`esm.sh`) dentro do iframe de preview, não pelo bundler. IntelliSense de bibliotecas de terceiros também é limitado às definições de tipo incluídas em `public/types/`.

## Estrutura do projeto

```
src/
  app/                    # rota raiz (App Router)
  components/
    ide/                  # shell da IDE, editor, explorador, terminal, preview
    ui/                   # componentes shadcn/ui
  lib/
    fs/                   # tipos e projeto padrão do sistema de arquivos virtual
    stores/                # stores Zustand (fs-store, runtime-store)
    runtime/               # motor de build (esbuild-wasm) e plugin de resolução
    monaco/                # configuração de IntelliSense do Monaco
```
