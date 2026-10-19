import { ChangeDetectionStrategy, Component } from '@angular/core';
import { stages } from '../data/site';
import { PageBoard } from '../shared/page-board';
import { LotusBuild } from '../shared/lotus-build';


@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBoard, LotusBuild],
  template: `
    <app-page-board title="Layout to maintenance."
      lead="Six stages, one contractor. We can take the whole job or pick it up at the stage you need, but we are built to own it end to end." />


    <section class="wrap schedule-wrap" aria-labelledby="sched-h">
      <h2 id="sched-h" class="sched-title">Schedule of works</h2>
      <div class="board">
      <ol class="schedule">
        @for (s of stages; track s.id; let i = $index) {
          <li class="item" [id]="s.id">
            <div class="code" aria-hidden="true"><span class="n">{{ i + 1 }}</span><app-lotus-build class="mini" [t]="frozen[i]" [still]="true" /></div>
            <div class="head">
              <h3>{{ s.name }}</h3>
              <p class="short">{{ s.short }}</p>
            </div>
            <div class="body">
              <p>{{ s.detail }}</p>
              <ul>
                @for (x of s.includes; track x) { <li>{{ x }}</li> }
              </ul>
            </div>
          </li>
        }
      </ol>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .schedule-wrap { padding-block: clamp(3.5rem, 8vw, 6rem); }
    .sched-title { font-size: clamp(2.5rem, 5.4vw, 4.6rem); color: var(--navy-900); margin-bottom: 2rem; }
    .schedule { margin: 0; padding: clamp(1rem, 3vw, 2.5rem) clamp(1.25rem, 4vw, 3.5rem); list-style: none; }
    .item {
      display: grid; grid-template-columns: 8rem minmax(0, 1fr) minmax(0, 1.3fr);
      gap: clamp(1rem, 3vw, 2.5rem); padding-block: clamp(1.75rem, 3vw, 2.5rem);
      border-bottom: 1px solid var(--rule-navy); scroll-margin-top: 110px;
    }
    .item:last-child { border-bottom: 0; }
    .code {
      display: grid; gap: 0.75rem; align-content: start;
    }
    .n { font-family: var(--font-display); font-size: 4rem; line-height: 0.8; color: var(--lotus-light); }
    .mini { width: 100%; max-width: 120px; }
    h3 { font-size: clamp(1.9rem, 3.4vw, 2.8rem); }
    .short { margin-top: 0.6rem; color: var(--on-navy-dim); font-weight: 500; }
    .body p { color: var(--on-navy); max-width: 62ch; }
    ul { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 1rem 0 0; padding: 0; list-style: none; }
    ul li {
      padding: 0.3rem 0.65rem; border: 1px solid var(--rule-navy); font-size: 0.9rem;
      color: var(--on-navy-dim); border-radius: 999px;
    }
    @media (max-width: 860px) {
      .item { grid-template-columns: 5rem 1fr; } .n { font-size: 3rem; }
      .body { grid-column: 2; }
    }
  `,
})
export class Services {
  protected readonly stages = stages;
  protected readonly frozen = stages.map((_, i) => stages.map((_, j) => (j <= i ? 1 : 0)));
}
