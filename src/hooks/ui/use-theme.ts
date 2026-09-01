import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'ideapad_theme_preference';

export default function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'system';
  });

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    const isDark =
      mode === 'dark' ||
      (mode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    return undefined;
  }, [theme]);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Ignore storage errors
    }
    applyTheme(nextTheme);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  };
}
