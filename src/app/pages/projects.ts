import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { company, projects, sectors } from '../data/site';
import { PageBoard } from '../shared/page-board';
import { ProjectBoard } from '../shared/project-board';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBoard, ProjectBoard],
  template: `
    <app-page-board title="Our projects." photo="/construction/hero-site.jpg"
      [lead]="company.projects + ' projects delivered since ' + company.established + ' across pharma, research, healthcare and diagnostics, from first layout to handover and beyond.'" />

    <section class="wrap list" aria-labelledby="list-h">
      <div class="bar">
        <h2 id="list-h" class="visually-hidden">Projects</h2>
        <div class="filters" role="group" aria-label="Filter by sector">
          <button type="button" [class.on]="filter() === 'all'" [attr.aria-pressed]="filter() === 'all'"
            (click)="filter.set('all')">All</button>
          @for (s of sectors; track s.id) {
            <button type="button" [class.on]="filter() === s.id" [attr.aria-pressed]="filter() === s.id"
              (click)="filter.set(s.id)">{{ s.name }}</button>
          }
        </div>
        <span class="count tnum" aria-live="polite">{{ shown().length }} shown</span>
      </div>

      @if (shown().length) {
        <div class="grid">
          @for (p of shown(); track p.id) {
            <app-project-board [p]="p" />
          }
        </div>
      } @else {
        <div class="empty board">
          <p>No {{ filterName() }} projects on the board yet. Ask us about our {{ filterName() }} work directly.</p>
        </div>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    .list { padding-block: clamp(2.5rem, 6vw, 4.5rem) clamp(4rem, 9vw, 7rem); }
    .bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
    .filters { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .filters button {
      min-height: 44px; padding: 0.5rem 1.1rem; border: 0; border-radius: var(--pill); cursor: pointer;
      background: #fff; color: var(--navy-900); box-shadow: inset 0 0 0 1px var(--rule-ink);
      font-weight: 600; font-size: 0.95rem;
      transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
    }
    .filters button:hover { background: var(--steel-100); }
    .filters button.on { background: var(--navy); color: var(--on-navy); box-shadow: none; }
    .count { font-size: 0.92rem; color: var(--ink-3); }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1rem, 2vw, 1.5rem); }
    .empty { padding: 3rem 2rem; }
    @media (max-width: 1000px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Projects {
  protected readonly company = company;
  protected readonly sectors = sectors;
  protected readonly filter = signal<string>('all');
  protected readonly shown = computed(() =>
    this.filter() === 'all' ? projects : projects.filter((p) => p.sector === this.filter()),
  );
  protected readonly filterName = computed(
    () => sectors.find((s) => s.id === this.filter())?.name.toLowerCase() ?? '',
  );
}
