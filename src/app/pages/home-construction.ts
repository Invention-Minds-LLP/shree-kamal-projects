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
import { ProjectBoard } from '../shared/project-board';

// Construction theme home. Signature: one facility photographed through all six
// stages; scrolling the stage list advances the progress photo like a time-lapse.
@Component({
  selector: 'app-home-construction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ProjectBoard],
  templateUrl: './home-construction.html',
  styleUrl: './home-construction.scss',
})
export class HomeConstruction {
  protected readonly company = company;
  protected readonly contact = contact;
  protected readonly sectors = sectors;
  protected readonly stages = stages;
  protected readonly projects = projects.slice(0, 3);

  protected readonly t = signal<number[]>([0, 0, 0, 0, 0, 0]);
  private readonly narrow = signal(false);
  protected readonly active = computed(() => {
    const threshold = this.narrow() ? 0.45 : 0.02;
    let a = 0;
    this.t().forEach((v, i) => {
      if (v > threshold) a = i;
    });
    return a;
  });

  private readonly steps = viewChildren<ElementRef<HTMLElement>>('step');
  private readonly frame = viewChild<ElementRef<HTMLElement>>('frame');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      const narrow = window.matchMedia('(max-width: 900px)');
      let raf = 0;
      const clamp = (v: number) => Math.min(1, Math.max(0, v));

      const update = () => {
        raf = 0;
        this.narrow.set(narrow.matches);
        const vh = window.innerHeight;
        let next: number[];
        if (narrow.matches) {
          const end = this.bandBottom() + 12;
          const start = vh * 0.98;
          next = this.steps().map(({ nativeElement: el }) =>
            clamp((start - el.getBoundingClientRect().top) / Math.max(1, start - end)),
          );
        } else {
          const line = vh * 0.6;
          next = this.steps().map(({ nativeElement: el }) => {
            const r = el.getBoundingClientRect();
            return clamp((line - r.top) / (r.height * 0.6));
          });
        }
        // Reduced motion: photos switch whole, no crossfade.
        if (reduce.matches) next = next.map((v) => (v > 0.5 ? 1 : 0));
        const cur = this.t();
        if (next.some((v, i) => Math.abs(v - cur[i]) > 0.001)) this.t.set(next);
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        cancelAnimationFrame(raf);
      });
    });
  }

  /** Photo i fades in over the one before it as its stage progresses. */
  protected photoOpacity(i: number) {
    return i === 0 ? 1 : this.t()[i];
  }

  private bandBottom() {
    return this.frame()?.nativeElement.getBoundingClientRect().bottom ?? 0;
  }

  protected jump(i: number) {
    const el = this.steps()[i]?.nativeElement;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = this.narrow()
      ? top - this.bandBottom() - 8
      : top - window.innerHeight * 0.6 + el.offsetHeight * 0.62;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
