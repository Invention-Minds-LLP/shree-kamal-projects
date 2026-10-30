import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { company, contact, projects, sectors, stages } from '../data/site';
import { Icon } from '../shared/icon';
import { LotusBuild } from '../shared/lotus-build';
import { ProjectBoard } from '../shared/project-board';
import { WorkGallery } from '../shared/work-gallery';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, LotusBuild, ProjectBoard, WorkGallery],
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
  private readonly narrow = signal(false);
  protected readonly active = computed(() => {
    // On phones a stage only takes over once its heading is well on screen.
    const threshold = this.narrow() ? 0.45 : 0.02;
    let a = -1;
    this.t().forEach((v, i) => {
      if (v > threshold) a = i;
    });
    return a;
  });

  private readonly steps = viewChildren<ElementRef<HTMLElement>>('step');
  private readonly visual = viewChild<ElementRef<HTMLElement>>('visual');

  private bandBottom() {
    return this.visual()?.nativeElement.getBoundingClientRect().bottom ?? 0;
  }

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      const narrow = window.matchMedia('(max-width: 900px)');
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
        const clamp = (v: number) => Math.min(1, Math.max(0, v));
        let next: number[];
        this.narrow.set(narrow.matches);
        if (narrow.matches) {
          // Phone: the lotus band is pinned at the top, so a stage builds while its
          // heading travels from the bottom of the screen up to just under the band.
          const end = this.bandBottom() + 12;
          const start = vh * 0.98;
          next = this.steps().map(({ nativeElement: el }) =>
            clamp((start - el.getBoundingClientRect().top) / Math.max(1, start - end)),
          );
        } else {
          const line = vh * 0.62;
          next = this.steps().map(({ nativeElement: el }) => {
            const r = el.getBoundingClientRect();
            return clamp((line - r.top) / (r.height * 0.75));
          });
        }
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
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = this.narrow()
      ? top - this.bandBottom() - 8
      : top - window.innerHeight * 0.62 + el.offsetHeight * 0.78;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
