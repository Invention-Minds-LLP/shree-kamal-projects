import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../theme';

// Preview-only control: appears once a page was opened with ?theme=…
@Component({
  selector: 'app-theme-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (svc.preview()) {
      <div class="switch" role="group" aria-label="Preview theme">
        <span class="lbl">Preview</span>
        @for (o of options; track o.id) {
          <button type="button" [class.on]="svc.theme() === o.id" [attr.aria-pressed]="svc.theme() === o.id"
            (click)="svc.set(o.id)">{{ o.label }}</button>
        }
      </div>
    }
  `,
  styles: `
    .switch {
      position: fixed; right: 16px; bottom: 88px; z-index: 90;
      display: flex; align-items: center; gap: 4px; padding: 5px;
      background: #111418; color: #e9ebee; border-radius: 999px;
      box-shadow: 0 16px 32px -12px rgba(0, 0, 0, 0.55);
      font-size: 0.85rem;
    }
    .lbl { padding: 0 0.6rem 0 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.68rem; color: #9aa1ab; }
    button {
      min-height: 36px; padding: 0.35rem 0.9rem; border: 0; border-radius: 999px; cursor: pointer;
      background: transparent; color: inherit; font-weight: 600;
      transition: background-color 0.2s, color 0.2s;
    }
    button:hover { background: rgba(255, 255, 255, 0.08); }
    button.on { background: #fff; color: #111418; }
    @media (max-width: 600px) {
      .switch { right: 10px; bottom: 76px; font-size: 0.78rem; }
      .lbl { display: none; }
      button { min-height: 32px; padding: 0.3rem 0.7rem; }
    }
  `,
})
export class ThemeSwitch {
  protected readonly svc = inject(ThemeService);
  protected readonly options: { id: Theme; label: string }[] = [
    { id: 'lotus', label: 'Lotus' },
    { id: 'construction', label: 'Construction' },
    { id: 'build', label: 'Build' },
  ];
}
