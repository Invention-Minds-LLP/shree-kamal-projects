import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../theme';
import { sectors } from '../data/site';
import { PageBoard } from '../shared/page-board';

@Component({
  selector: 'app-sectors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBoard],
  template: `
    <app-page-board title="Who we build for." photo="/construction/sector-labs.jpg"
      lead="Corporate and industrial clients only. Five sectors where the building is part of the process, and getting it wrong shows up in an audit, an outage or a patient's day.">
      <ul class="jump">
        @for (s of sectors; track s.id) {
          <li><a [href]="'#' + s.id">{{ s.name }}</a></li>
        }
      </ul>
    </app-page-board>

    <div class="bands">
      @for (s of sectors; track s.id) {
        <section class="band" [id]="s.id" [attr.data-tone]="s.tone" [attr.aria-labelledby]="'h-' + s.id">
          <div class="wrap inner">
            <div class="lead-col">
              <h2 [id]="'h-' + s.id" class="word">{{ s.board }}</h2>
              @if (construction()) {
                <img class="shot" [src]="s.photo" alt="" width="1536" height="1024" loading="lazy" />
              }
            </div>
            <div class="body">
              <p class="line">{{ s.line }}</p>
              <dl class="need">
                <dt>What the building needs</dt>
                @for (n of s.needs; track n) { <dd>{{ n }}</dd> }
              </dl>
              <p class="scope">
                We cover layout design, electrical, building construction, associated services,
                final closure and maintenance for {{ s.name }} facilities.
              </p>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .jump { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
    .jump a {
      display: inline-flex; min-height: 44px; align-items: center; padding: 0.4rem 0.9rem;
      border: 1px solid var(--rule-navy); text-decoration: none;
      font-weight: 600; font-size: 0.95rem; border-radius: var(--pill);
      transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
    }
    .jump a:hover { background: var(--lotus); color: #fff; border-color: var(--lotus); }

    .band {
      --bg: var(--navy); --fg: var(--on-navy); --dim: var(--on-navy-dim); --rule: var(--rule-navy);
      background: var(--bg); color: var(--fg); scroll-margin-top: 84px;
    }
    .band[data-tone='yellow'] { --bg: var(--petal); --fg: var(--navy); --dim: var(--ink-2); --rule: rgba(156,22,91,0.18); }
    .band[data-tone='steel'] { --bg: var(--steel-100); --fg: var(--on-steel); --dim: var(--on-steel-dim); --rule: var(--rule-ink); }
    .band[data-tone='white'] { --bg: #fff; --fg: var(--navy-900); --dim: var(--on-steel-dim); --rule: var(--rule-ink); }
    .band[data-tone='ink'] { --bg: var(--ink); --fg: var(--paper); --dim: var(--ink-dim); --rule: rgba(244,245,242,0.18); }
    .inner {
      display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: clamp(1.5rem, 5vw, 5rem);
      padding-block: clamp(3.5rem, 8vw, 6.5rem);
    }
    .word { font-size: clamp(3.2rem, 8vw, 5.6rem); line-height: 1; hyphens: manual; }
    .lead-col { display: grid; gap: 1.5rem; align-content: start; }
    .shot { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }
    .body { display: grid; gap: 1.5rem; align-content: start; }
    .line { font-size: clamp(1.15rem, 1.8vw, 1.35rem); font-weight: 500; max-width: 40ch; }
    .need { margin: 0; border-top: 1px solid var(--rule); }
    .need dt {
      padding: 0.9rem 0 0.5rem; font-family: var(--font-display); font-size: 1.1rem;
      color: var(--dim);
    }
    .need dd {
      margin: 0; padding: 0.6rem 0; border-top: 1px solid var(--rule);
      font-family: var(--font-display); font-size: 1.45rem;
    }
    .scope { color: var(--dim); max-width: 52ch; }
    @media (max-width: 860px) { .inner { grid-template-columns: 1fr; } }
  `,
})
export class Sectors {
  protected readonly sectors = sectors;
  private readonly theme = inject(ThemeService);
  protected construction() {
    return this.theme.theme() === 'construction';
  }
}
