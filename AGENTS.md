# Repository Guidelines

## Project Structure & Module Organization
- Keep production code in `src/` with domain-oriented modules; shared utilities live under `src/common/` or `src/lib/`.
- Mirror code with `tests/` using the same relative paths (e.g., `src/user/profile.ts` → `tests/user/profile.test.ts`).
- Place helper tooling in `scripts/`, longer docs in `docs/`, and fixtures/assets in `assets/`. Add a short README in any non-obvious folder.

## Build, Test, and Development Commands
- Prefer reproducible entrypoints via `make` or `./scripts/*.sh`; add targets as you introduce tooling.
- Typical flow: `make deps` to install dependencies, `make lint` to run formatters/linters, `make fmt` to apply fixes, and `make test` for the full suite (scope with `TARGET=path` when supported).
- For apps/services, expose a local runner (`make dev`, `npm run dev`, or `python -m <module>`); document required env vars beside the command.
- When adding a new stack, document the exact install/run commands here and wire them into `make`.

## Coding Style & Naming Conventions
- Enforce auto-formatting (Prettier for JS/TS, Black for Python, gofmt for Go) before committing.
- Use 2-space indentation for web code and 4-space for Python. Favor camelCase for variables/functions, PascalCase for exported types/classes, and kebab-case filenames unless the language dictates otherwise.
- Keep modules small and focused; prefer dependency injection over globals. Add brief comments only when behavior is non-obvious.

## Testing Guidelines
- Co-locate tests in `tests/` with clear names: `<unit>.test.<ext>` for unit and `<feature>.spec.<ext>` for integration/e2e.
- Target ≥80% coverage on new code; every bug fix should ship with a regression test.
- Avoid external network calls in tests; use fixtures under `assets/fixtures/` and mock dependencies at boundaries.

## Commit & Pull Request Guidelines
- Write commits in the imperative mood (`add profile validation`, `fix cache busting`) and group logical changes; avoid mixed refactors + features.
- PRs should include a concise summary, linked issues, before/after notes or screenshots for UI changes, and a checklist of tests/linters run.
- Keep PRs small; flag risky areas or follow-up work explicitly and tag reviewers when shared interfaces change.

## Security & Configuration Tips
- Never commit secrets; use environment variables and provide sample values in `.env.example`.
- Document required configuration in `docs/configuration.md` (create if missing) and keep bootstrap steps in `scripts/bootstrap.sh`.
- Validate inputs at module boundaries and log errors with enough context to trace issues without leaking sensitive data.
