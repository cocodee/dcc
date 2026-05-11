# Repository Guidelines

## Project Structure & Module Organization

This repository is a TypeScript source snapshot for research and analysis. Application code lives under `src/`. Major areas include `src/commands/` for slash commands, `src/tools/` for agent tools, `src/components/` and `src/hooks/` for Ink/React terminal UI, `src/services/` for integrations, and `src/bridge/`, `src/plugins/`, `src/skills/`, `src/vim/`, and `src/voice/` for feature-specific subsystems. Top-level files such as `src/commands.ts`, `src/Tool.ts`, and `src/QueryEngine.ts` define shared registries and core behavior. No dedicated test, fixture, public asset, or build output directories are currently checked in.

## Build, Test, and Development Commands

This snapshot does not include `package.json`, a lockfile, or project scripts. Do not assume `npm test` or `bun run build` exists until package metadata is restored. Useful repository-local checks are:

```sh
rg "pattern" src
git status --short
git log --oneline -8
```

If you add runnable tooling, document the exact command in the same change, for example `bun test` or `bun run typecheck`.

## Coding Style & Naming Conventions

Use TypeScript and TSX consistently with the existing tree. Prefer ES module imports with `.js` specifiers, matching current source-map output patterns. Keep command modules under `src/commands/<name>/index.ts[x]` when a command has its own folder, and use descriptive camelCase filenames for hooks and utilities such as `useInputBuffer.ts` or `tokenEstimation.ts`. Preserve intentional comments such as `biome-ignore` and feature-flag conditional imports; import ordering may be semantically meaningful in this snapshot.

## Testing Guidelines

No test framework or coverage policy is present in the repository. When adding tests, colocate narrowly scoped tests near the module or introduce a clear `test/` or `tests/` directory with documented conventions. Name tests after behavior, for example `toolPermission.test.ts`, and include regression coverage for command registration, permission checks, and parser/schema changes.

## Commit & Pull Request Guidelines

The local history uses short, informal commit subjects such as `first commit` and `my dcc`; there is no established convention. Use concise imperative subjects going forward, for example `Add bridge config notes`. Pull requests should describe the research or maintenance goal, list touched subsystems, call out generated or recovered source-map content, and include commands run.

## Security & Configuration Tips

This repository mirrors a publicly exposed source snapshot and is not an official upstream project. Do not add secrets, tokens, `.env` files, private package credentials, or proprietary downstream patches. Treat external service code as sensitive research material and avoid executing unknown network paths without review.
