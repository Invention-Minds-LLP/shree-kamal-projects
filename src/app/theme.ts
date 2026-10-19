import { DOCUMENT, Injectable, afterNextRender, inject, signal } from '@angular/core';

export type Theme = 'lotus' | 'construction' | 'build';
const THEMES: Theme[] = ['lotus', 'construction', 'build'];
const KEY = 'skp-theme';
const PREVIEW_KEY = 'skp-preview';

// Complete looks for the client to choose between. Open any page with
// ?theme=construction, ?theme=build (or ?theme=lotus) to preview; the choice and a small
// switcher then persist for the browser session. Without a param the site
// shows the default theme and no switcher.
export const DEFAULT_THEME: Theme = 'lotus';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  /** Server render and hydration always use the default; the stored choice applies after. */
  readonly theme = signal<Theme>(DEFAULT_THEME);
  readonly preview = signal(false);

  constructor() {
    afterNextRender(() => {
      const param = new URLSearchParams(location.search).get('theme') as Theme | null;
      let stored: Theme | null = null;
      try {
        if (param && THEMES.includes(param)) {
          sessionStorage.setItem(KEY, param);
          sessionStorage.setItem(PREVIEW_KEY, '1');
        }
        stored = sessionStorage.getItem(KEY) as Theme | null;
        this.preview.set(sessionStorage.getItem(PREVIEW_KEY) === '1');
      } catch {
        stored = param;
        this.preview.set(!!param);
      }
      this.set(stored && THEMES.includes(stored) ? stored : DEFAULT_THEME, false);
      this.doc.documentElement.classList.add('theme-ready');
    });
  }

  set(theme: Theme, persist = true) {
    this.theme.set(theme);
    this.doc.documentElement.dataset['theme'] = theme;
    if (!persist) return;
    try {
      sessionStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
    const url = new URL(location.href);
    url.searchParams.set('theme', theme);
    history.replaceState(history.state, '', url);
  }
}
