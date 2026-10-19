import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Project, sectorName, stageName } from '../data/site';

@Component({
  selector: 'app-project-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="board pb">
      <div class="photo">
        @if (p().photo) {
          <img [src]="p().photo" [alt]="p().title" loading="lazy" />
        } @else {
          <div class="slot" role="img" aria-label="Project photograph to be supplied">
            <img src="/brand/lotus.png" alt="" width="64" height="64" />
            <span>Photograph to be supplied</span>
          </div>
        }
        @if (p().sample) {
          <span class="sample-stamp stamp">Sample entry</span>
        }
      </div>
      <div class="body">
        <h3>{{ p().title }}</h3>
        <dl class="fields">
          <dt>Sector</dt><dd>{{ sector() }}</dd>
          <dt>Scope</dt><dd>{{ scope() }}</dd>
          <dt>Location</dt><dd>{{ p().location }}</dd>
          <dt>Status</dt>
          <dd><span class="status" [attr.data-s]="p().status">{{ p().status }}</span></dd>
        </dl>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; }
    .pb { display: grid; grid-template-rows: auto 1fr; height: 100%; }
    .pb { overflow: hidden; }
    .photo { position: relative; aspect-ratio: 16 / 10; background: var(--mist); overflow: hidden; }
    .photo > img { width: 100%; height: 100%; object-fit: cover; }
    .slot {
      position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 0.6rem;
      background: radial-gradient(70% 80% at 50% 45%, var(--petal), var(--mist));
    }
    .slot img { width: 64px; height: 64px; opacity: 0.55; }
    .slot span { font-size: 0.9rem; color: var(--ink-3); }
    .stamp { position: absolute; top: 14px; right: 14px; }
    .body { padding: 1.4rem 1.5rem 1.9rem; }
    h3 { font-size: 1.85rem; margin-bottom: 1rem; }
    .fields { grid-template-columns: 5.5rem 1fr; }
    .fields > dd { font-size: 0.95rem; }
    .status { display: inline-flex; align-items: center; gap: 0.45rem; }
    .status::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: var(--lotus-light); }
    .status[data-s='Handed over']::before { background: #7fd1a3; }
    .status[data-s='Under maintenance']::before { background: var(--on-navy-dim); }
  `,
})
export class ProjectBoard {
  readonly p = input.required<Project>();
  protected readonly sector = computed(() => sectorName(this.p().sector));
  protected readonly scope = computed(() => this.p().scope.map(stageName).join(' · '));
}
