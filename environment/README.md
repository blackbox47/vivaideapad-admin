# Environment files

This folder holds every `.env*` file the admin app loads. `vite.config.ts` sets
`envDir` to this folder, so Vite reads `.env*` files from here rather than the
project root.

App code should consume env vars through the typed helper at `src/config/env.ts`
— never read `import.meta.env` directly.

## File categories

There are three kinds of files here. They have very different rules:

| Kind                      | Example                       | Committed? | Purpose                              |
|---------------------------|-------------------------------|------------|--------------------------------------|
| **Shared baseline**       | `.env.develop`, `.env.prod`   | Yes        | Team-wide defaults for a mode        |
| **Shared local baseline** | `.env.localdev`               | Yes        | Local-dev values shared with the team (e.g. the default local API URL) |
| **Per-developer override**| `.env.local`, `.env.localdev.local` | No   | Your personal overrides — gitignored |
| **Template**              | `.env.example`                | Yes        | Documents every variable and is the starting point for new ones |

`.env.local` is **always** loaded (for every mode) and overrides any shared
file. `.env.<mode>` is loaded for its matching mode. `.env.<mode>.local` is
loaded for its matching mode and overrides `.env.<mode>`.

## Modes and the files they load

| pnpm script              | Vite mode   | Files loaded (in increasing priority)                       |
|--------------------------|-------------|------------------------------------------------------------|
| `pnpm dev:local`         | `localdev`  | `.env.localdev` → `.env.localdev.local` → `.env.local`     |
| `pnpm dev:develop`       | `develop`   | `.env.develop` → `.env.develop.local` → `.env.local`       |
| `pnpm build:develop`     | `develop`   | `.env.develop` → `.env.develop.local` → `.env.local`       |
| `pnpm preview:develop`   | `develop`   | `.env.develop` → `.env.develop.local` → `.env.local`       |
| `pnpm build:prod`        | `prod`      | `.env.prod` → `.env.prod.local` → `.env.local`             |
| `pnpm preview:prod`      | `prod`      | `.env.prod` → `.env.prod.local` → `.env.local`             |

## Adding a new variable

1. Add the variable to `.env.example` (with an empty value as the template).
2. Add it to every shared file that should set a value (at minimum `.env.develop` and `.env.prod`; add it to `.env.localdev` if it has a useful local-dev default).
3. Add it to `src/config/env.ts` — call `requireEnv(...)` for required vars, or `readBoolean(..., default)` for optional booleans.
4. Document it briefly in the table at the top of this README.

## Adding a new environment (e.g. `staging`)

1. Create `environment/.env.staging` with the shared baseline.
2. Add scripts to `package.json` (`"dev:staging": "vite --mode staging"`, `"build:staging": "tsc -b && vite build --mode staging"`, `"preview:staging": "vite preview --mode staging"`).
3. Add a whitelist line to `.gitignore` so the new file is tracked: `!environment/.env.staging`.
4. Add a row to the modes table above.

## Per-developer overrides — quick recipe

To point `pnpm dev:local` at a different API port without touching the committed `.env.localdev`:

```bash
# environment/.env.localdev.local  (gitignored)
VITE_API_BASE_URL=http://localhost:4500/api
```

To point **every** mode at the same local backend (overrides everything):

```bash
# environment/.env.local  (gitignored)
VITE_API_BASE_URL=http://localhost:4000/api
```
