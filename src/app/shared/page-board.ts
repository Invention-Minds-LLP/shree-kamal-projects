import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LotusBuild } from './lotus-build';

// Opening band for inner pages: title, lead, optional projected detail,
// with the finished lotus standing quietly behind.
@Component({
  selector: 'app-page-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LotusBuild],
  template: `
    <header class="band">
      <app-lotus-build class="mark" [still]="true" aria-hidden="true" />
      <div class="wrap pg">
        <div class="text">
          <h1>{{ title() }}</h1>
          <p class="lead">{{ lead() }}</p>
        </div>
        <div class="extra"><ng-content /></div>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; }
    .band {
      position: relative; overflow: hidden;
      background:
        radial-gradient(90% 90% at 85% 20%, rgba(59, 82, 160, 0.35), transparent 60%),
        var(--navy-900);
      color: var(--on-navy);
    }
    .mark {
      position: absolute; right: -4%; bottom: -16%; width: min(620px, 60vw);
      opacity: 0.16; pointer-events: none;
    }
    .pg {
      position: relative;
      display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: clamp(1.5rem, 5vw, 5rem);
      align-items: end; padding-block: clamp(4rem, 9vw, 7.5rem) clamp(3rem, 6vw, 5rem);
    }
    h1 { font-size: clamp(3rem, 7vw, 5.6rem); max-width: 14ch; }
    .lead { margin-top: 1.4rem; max-width: 52ch; font-size: 1.15rem; color: var(--on-navy-dim); }
    .extra:empty { display: none; }
    @media (max-width: 860px) { .pg { grid-template-columns: 1fr; } .mark { width: 90vw; bottom: -6%; } }
  `,
})
export class PageBoard {
  readonly number = input('');
  readonly title = input.required<string>();
  readonly lead = input('');
}
