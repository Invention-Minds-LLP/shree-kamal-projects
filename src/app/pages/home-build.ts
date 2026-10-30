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
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { company, contact, projects, sectors, stages } from '../data/site';
import { Icon } from '../shared/icon';
import { ProjectBoard } from '../shared/project-board';
import { WorkGallery } from '../shared/work-gallery';

// One plot, one fixed drone camera, twelve progress frames (illustrative).
// `stage` is the index into `stages` that each frame belongs to.
const FRAMES = [
  { stage: 0, cap: 'Day one: the plot cleared and pegged.' },
  { stage: 0, cap: 'Footprint and column grid set out in lime.' },
  { stage: 1, cap: 'Footings dug, cable trenches run to the power yard.' },
  { stage: 1, cap: 'Foundations cast, earthing and conduits laid.' },
  { stage: 2, cap: 'Ground-floor columns going up.' },
  { stage: 2, cap: 'The concrete frame, both floors.' },
  { stage: 2, cap: 'Walls going in.' },
  { stage: 3, cap: 'Services rough-in: plant lifted to the roof.' },
  { stage: 3, cap: 'Façade, glazing and the transformer yard.' },
  { stage: 4, cap: 'Scaffolding down, paving and planting in.' },
  { stage: 4, cap: 'Handed over, ready for your team.' },
  { stage: 5, cap: 'Months later, still in our care.' },
].map((f, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { ...f, src: `/build/frame-${n}.webp`, srcset: `/build/frame-${n}-960.webp 960w, /build/frame-${n}.webp 1536w` };
});

const N = FRAMES.length;
/** Scroll units (one unit = one frame change) held on the hero before frame 2, and on the last frame. */
const HOLD_START = 0.8;
const HOLD_END = 1.2;
const UNITS = HOLD_START + (N - 1) + HOLD_END;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

// Build theme home. Signature: a pinned drone view of one facility that is
// built frame by frame as the visitor scrolls, from empty plot to dusk.
@Component({
  selector: 'app-home-build',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ProjectBoard, WorkGallery],
  templateUrl: './home-build.html',
  styleUrls: ['./home.scss', './home-build.scss'],
})
export class HomeBuild {
  protected readonly company = company;
  protected readonly contact = contact;
  protected readonly sectors = sectors;
  protected readonly stages = stages;
  protected readonly projects = projects.slice(0, 3);
  protected readonly frames = FRAMES;
  protected readonly units = UNITS;

  /** Scroll position through the pinned section, in frame units (0 to UNITS). */
  private readonly u = signal(0);
  private readonly snap = signal(false);

  /** Continuous frame position: 0 = frame 1, N - 1 = last frame. Negative while the hero holds. */
  private readonly g = computed(() => this.u() - HOLD_START);
  private readonly blend = computed(() => {
    const fc = clamp(this.g(), 0, N - 1);
    const k = Math.min(Math.floor(fc), N - 2);
    const e = smooth(clamp((fc - k - 0.2) / 0.6));
    return { k, e: this.snap() ? Math.round(e) : e };
  });
  protected readonly frame = computed(() => {
    const { k, e } = this.blend();
    return e > 0.5 ? k + 1 : k;
  });
  protected readonly stage = computed(() => FRAMES[this.frame()].stage);
  protected readonly heroOp = computed(() => 1 - clamp((this.u() - 0.2) / 0.45));
  protected readonly panelOp = computed(() => clamp((this.u() - 0.55) / 0.35));
  protected readonly zoom = computed(() => (this.snap() ? 1 : 1 + 0.045 * clamp(this.g() / (N - 1))));

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      let raf = 0;
      const update = () => {
        raf = 0;
        this.snap.set(reduce.matches);
        const t = this.track().nativeElement.getBoundingClientRect();
        const p = this.pin().nativeElement.getBoundingClientRect();
        const max = t.height - p.height;
        this.u.set(max > 0 ? clamp((p.top - t.top) / max) * UNITS : 0);
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

  /** Only the current frame and the one fading in over it are painted. */
  protected opacity(i: number) {
    const { k, e } = this.blend();
    return i === k ? 1 : i === k + 1 ? e : 0;
  }

  /** How far the build has got through stage i, 0 to 1, for the rail. */
  protected fill(i: number) {
    const first = FRAMES.findIndex((f) => f.stage === i);
    const count = FRAMES.filter((f) => f.stage === i).length;
    return clamp((this.g() - first + 0.5) / count);
  }

  protected jump(i: number) {
    const track = this.track().nativeElement;
    const pin = this.pin().nativeElement;
    const max = track.offsetHeight - pin.offsetHeight;
    const first = FRAMES.findIndex((f) => f.stage === i);
    const top = track.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(pin).top);
    window.scrollTo({ top: top + ((HOLD_START + first) / UNITS) * max + 1, behavior: 'smooth' });
  }
}
