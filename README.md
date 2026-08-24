# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Environment Variables

This project uses Vite's mode-based env file loading. Env files live in the `environment/` folder (configured via `envDir` in `vite.config.ts`). There are three shared environments, plus per-developer overrides.

> **Canonical reference:** see [`environment/README.md`](./environment/README.md) for the full convention (file categories, mode→file mapping, how to add a variable, how to add a new environment).

### Environments

| Mode      | Shared file                  | Per-developer override       | Committed? | Purpose                              |
|-----------|------------------------------|------------------------------|------------|--------------------------------------|
| `localdev`| `environment/.env.localdev`  | `environment/.env.localdev.local` | Shared / localdev override | Local development with team defaults  |
| `develop` | `environment/.env.develop`   | `environment/.env.develop.local`  | Shared / develop override  | Shared dev/staging baseline          |
| `prod`    | `environment/.env.prod`      | `environment/.env.prod.local`     | Shared / prod override     | Shared production baseline           |

`.env.local` is **always** loaded (every mode) and overrides any per-mode file.

The currently required variable is `VITE_API_BASE_URL`. See `environment/.env.example` for the full template.

### Scripts

| Command                | Mode     | What it does                              |
|------------------------|----------|-------------------------------------------|
| `pnpm dev:local`       | `localdev` | Run dev server using shared `.env.localdev` (+ your `.env.localdev.local` and `.env.local` overrides) |
| `pnpm dev:develop`     | `develop`  | Run dev server using shared `.env.develop` |
| `pnpm build:develop`   | `develop`  | Build for the develop environment         |
| `pnpm build:prod`      | `prod`     | Build for production                      |
| `pnpm preview:develop` | `develop`  | Preview the develop build locally         |
| `pnpm preview:prod`    | `prod`     | Preview the production build locally      |

### Adding a new env variable

1. Add the variable to `environment/.env.example` (with an empty value as the template).
2. Add it to the shared files that should set a value (typically `.env.develop` and `.env.prod`; also `.env.localdev` if it has a useful local-dev default).
3. Add it to `src/config/env.ts` and validate it via `requireEnv(...)` (or make it optional if it has a default).
4. Document it in the table above.

### Per-developer overrides

To override shared values locally without affecting teammates, edit a per-mode `.env.<mode>.local` file (gitignored). For example, to point `pnpm dev:local` at a different API port:

```bash
# environment/.env.localdev.local
VITE_API_BASE_URL=http://localhost:4500/api
```

To override the **same** value across every mode, use `.env.local` (gitignored):

```bash
# environment/.env.local
VITE_API_BASE_URL=http://localhost:4000/api
```

### Typed access

App code should import the typed helper instead of reading `import.meta.env` directly:

```typescript
import { env, isProd } from '@/config/env';

fetch(`${env.apiBaseUrl}/users`).then(...);

if (isProd) {
  console.log('Running in production mode');
}
```
