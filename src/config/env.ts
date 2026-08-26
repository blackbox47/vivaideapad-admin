/**
 * Typed environment configuration.
 *
 * - Validates required env vars at startup (fails fast with a clear error).
 * - Exposes a single `env` object — never read `import.meta.env` directly elsewhere.
 * - Exposes the current `mode` for runtime environment checks.
 */

type AppMode = 'local' | 'develop' | 'prod';

interface Env {
  apiBaseUrl: string;
  mode: AppMode;
  useMockApi: boolean;
}

function readMode(): AppMode {
  const raw = import.meta.env.MODE;
  if (raw === 'develop' || raw === 'prod') {
    return raw;
  }
  // Covers the `localdev` mode and plain `vite` runs: Vite reserves the bare
  // `local` mode name because of the `.env.local` postfix.
  return 'local';
}

function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (value === undefined || value === null || value === '') {
    throw new Error(
      `[env] Missing required environment variable: ${name}\n` +
        `Make sure the appropriate .env.* file is loaded for the current mode.\n` +
        `Current mode: ${import.meta.env.MODE}`,
    );
  }
  return value;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = import.meta.env[name];
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return value === 'true';
}

const mode = readMode();

export const env: Env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  mode,
  useMockApi: readBoolean('VITE_USE_MOCK_API', mode !== 'prod'),
};

export const isProd = env.mode === 'prod';
export const isDevelop = env.mode === 'develop';
export const isLocal = env.mode === 'local';
