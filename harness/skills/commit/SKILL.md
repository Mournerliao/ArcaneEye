---
name: commit
description: Write Conventional Commits that follow the project's git conventions. Use when the user asks to commit, stage changes, write a commit message, or create a git commit.
---

# Commit Skill

Write Conventional Commits for this project. All commit messages must be in English.

## Format

```
type(scope): subject
```

- `type` — one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- `scope` — required, lowercase, describes the affected area (e.g. `tauri`, `ui`, `hooks`, `services`, `stores`, `components`, `harness`, `repo`)
- `subject` — English only, lowercase start, no period at end, max 100 chars total header

## Workflow

1. Run `git status` and `git diff --staged` to understand the changes
2. If nothing is staged, run `git diff` to review unstaged changes, then stage relevant files with `git add`
3. Determine `type` from the nature of the change:
   - `feat` — new feature or capability
   - `fix` — bug fix
   - `docs` — documentation only
   - `style` — formatting, whitespace, no logic change
   - `refactor` — code restructuring without behavior change
   - `perf` — performance optimization
   - `test` — adding or updating tests
   - `build` — build system or external dependencies
   - `ci` — CI configuration
   - `chore` — tooling, config, dependencies
   - `revert` — revert a previous commit
4. Determine `scope` from the changed files:
   - `src-tauri/` → `tauri`
   - `src/components/` → `components`
   - `src/hooks/` → `hooks`
   - `src/services/` → `services`
   - `src/stores/` → `stores`
   - `src/` (other) → `ui`
   - `harness/` → `harness`
   - config files at root → `repo`
   - `commitlint.config.*`, `lefthook.yml`, `.gitignore` → `repo`
5. Write the subject: describe **what** changed, not why. Use imperative mood ("add", "fix", "update"), not past tense.
6. Directly commit with the generated message using `git commit -m "type(scope): subject"`.
7. Lefthook hooks (`pre-commit`, `commit-msg`) will run automatically and enforce lint, typecheck, tests, and commitlint.

## Rules

- **English only** — no Chinese characters in subject or body
- **Lowercase subject** — do not capitalize the first word of the subject
- **No period** at end of subject
- **Max 100 chars** for the full header (`type(scope): subject`)
- **Scope is required** — never write `type: subject` without scope
- **Imperative mood** — "add feature" not "added feature" or "adds feature"

## Examples

```
feat(tauri): add screenshot capture functionality
fix(hooks): fix hex selection data not updating
docs(harness): update project documentation
chore(repo): update commitlint config and skill
refactor(services): extract API client into shared module
perf(stores): optimize Zustand store subscriptions
test(hooks): add unit tests for useGameData hook
style(components): format champion list with prettier
```

## Multi-commit Strategy

If the user's changes span multiple concerns (e.g. a feature + a config tweak), suggest splitting into separate commits:

1. Stage and commit the first logical unit
2. Stage and commit the second logical unit
3. Each commit should be self-contained and pass CI independently
