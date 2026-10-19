import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { company, contact, projects, sectors, stages } from '../data/site';
import { Icon } from '../shared/icon';
import { LotusBuild } from '../shared/lotus-build';
import { ProjectBoard } from '../shared/project-board';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, LotusBuild, ProjectBoard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly company = company;
  protected readonly contact = contact;
  protected readonly sectors = sectors;
  protected readonly stages = stages;
  protected readonly projects = projects.slice(0, 3);

  /** Per-stage build progress, 0..1, driven by scroll. Server render shows the seed. */
  protected readonly t = signal<number[]>([0, 0, 0, 0, 0, 0]);
  protected readonly still = signal(false);
  protected readonly active = computed(() => {
    const t = this.t();
    let a = -1;
    t.forEach((v, i) => {
      if (v > 0.02) a = i;
    });
    return a;
  });

  private readonly steps = viewChildren<ElementRef<HTMLElement>>('step');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      let frame = 0;

      const update = () => {
        frame = 0;
        if (reduce.matches) {
          this.still.set(true);
          this.t.set([1, 1, 1, 1, 1, 1]);
          return;
        }
        this.still.set(false);
        const vh = window.innerHeight;
        const line = vh * 0.62;
        const next = this.steps().map(({ nativeElement: el }) => {
          const r = el.getBoundingClientRect();
          return Math.min(1, Math.max(0, (line - r.top) / (r.height * 0.75)));
        });
        const cur = this.t();
        if (next.some((v, i) => Math.abs(v - cur[i]) > 0.001)) this.t.set(next);
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };

      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      reduce.addEventListener('change', update);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        reduce.removeEventListener('change', update);
        cancelAnimationFrame(frame);
      });
    });
  }

  protected jump(i: number) {
    const el = this.steps()[i]?.nativeElement;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.62 + el.offsetHeight * 0.78;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
