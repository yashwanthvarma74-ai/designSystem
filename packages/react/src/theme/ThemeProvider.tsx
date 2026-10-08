import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeName = 'light' | 'dark' | 'high-contrast';
export type ThemePreference = ThemeName | 'system';

interface ThemeContextValue {
  /** What the user picked, which may be "system". */
  preference: ThemePreference;
  /** The theme actually applied to the page. */
  theme: ThemeName;
  setTheme: (next: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DEFAULT_STORAGE_KEY = 'meridian-theme';
const THEMES: ThemeName[] = ['light', 'dark', 'high-contrast'];

function readSystemTheme(): ThemeName {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  if (window.matchMedia('(prefers-contrast: more)').matches) return 'high-contrast';
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function readStored(storageKey: string): ThemePreference | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (value === 'system' || THEMES.includes(value as ThemeName)) return value as ThemePreference;
  } catch {
    // storage can be blocked; fall through to the default
  }
  return null;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
  storageKey?: string;
  /** Pass false to skip saving the choice. */
  persist?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = DEFAULT_STORAGE_KEY,
  persist = true,
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ThemeName>('light');

  // Pick up the saved choice after mount so server and client markup match.
  useEffect(() => {
    if (!persist) return;
    const saved = readStored(storageKey);
    if (saved) setPreference(saved);
  }, [persist, storageKey]);

  useEffect(() => {
    setSystemTheme(readSystemTheme());
    const queries = ['(prefers-color-scheme: dark)', '(prefers-contrast: more)'].map((q) =>
      window.matchMedia(q),
    );
    const onChange = () => setSystemTheme(readSystemTheme());
    queries.forEach((q) => q.addEventListener?.('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener?.('change', onChange));
  }, []);

  const theme: ThemeName = preference === 'system' ? systemTheme : preference;

  // The only DOM work a theme change does: flip one attribute. Colours come from CSS variables.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setPreference(next);
      if (!persist) return;
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore blocked storage
      }
    },
    [persist, storageKey],
  );

  const value = useMemo(() => ({ preference, theme, setTheme }), [preference, theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return ctx;
}

/**
 * Inline this in <head> (before first paint) so the saved theme is applied without a flash.
 * Example: <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
 */
export function getThemeInitScript(storageKey: string = DEFAULT_STORAGE_KEY): string {
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)});var m=window.matchMedia;var t=s&&s!=="system"?s:(m("(prefers-contrast: more)").matches?"high-contrast":m("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
}
