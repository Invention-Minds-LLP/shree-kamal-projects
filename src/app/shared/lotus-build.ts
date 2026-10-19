import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// The Shri Kamal lotus, built the way a facility is built.
// `t` holds six 0..1 progress values, one per lifecycle stage:
// 0 layout (blueprint guides) · 1 electrical (current traces the outline)
// 2 construction (petals rise floor by floor) · 3 associated services (inner detail, figure)
// 4 closure (scaffold comes away) · 5 maintenance (bloom, water ripples)

interface Petal {
  d: string;
  fill: string;
  tier: 0 | 1 | 2 | 3; // base leaves, outer, inner, centre
  side: -1 | 0 | 1;
}

const PETALS: Petal[] = [
  { d: 'M200 302C160 318 100 315 40 285C100 270 165 280 200 302Z', fill: 'var(--lotus-deep)', tier: 0, side: -1 },
  { d: 'M200 302C240 318 300 315 360 285C300 270 235 280 200 302Z', fill: 'var(--lotus-deep)', tier: 0, side: 1 },
  { d: 'M200 300C150 300 85 270 60 205C115 205 175 245 200 300Z', fill: 'var(--lotus-mid)', tier: 1, side: -1 },
  { d: 'M200 300C250 300 315 270 340 205C285 205 225 245 200 300Z', fill: 'var(--lotus-mid)', tier: 1, side: 1 },
  { d: 'M200 300C160 280 120 220 125 150C165 175 195 230 200 300Z', fill: 'var(--lotus)', tier: 2, side: -1 },
  { d: 'M200 300C240 280 280 220 275 150C235 175 205 230 200 300Z', fill: 'var(--lotus)', tier: 2, side: 1 },
  { d: 'M200 300C168 250 166 168 200 104C234 168 232 250 200 300Z', fill: 'var(--lotus-light)', tier: 3, side: 0 },
];

let uid = 0;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

@Component({
  selector: 'app-lotus-build',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.bloom]': 'bloom()', '[class.still]': 'still()' },
  template: `
    <svg viewBox="0 0 400 400" role="img" [attr.aria-label]="label()">
      <defs>
        <pattern [attr.id]="id + '-grid'" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width="0.5" />
        </pattern>
        <radialGradient [attr.id]="id + '-fade'" cx="50%" cy="58%" r="50%">
          <stop offset="0.55" stop-color="#fff" />
          <stop offset="1" stop-color="#000" />
        </radialGradient>
        <mask [attr.id]="id + '-mask'"><circle cx="200" cy="225" r="175" [attr.fill]="'url(#' + id + '-fade)'" /></mask>
        <clipPath [attr.id]="id + '-rise'"><rect x="0" [attr.y]="riseY()" width="400" height="420" /></clipPath>
        <filter [attr.id]="id + '-glow'" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <!-- Water and ground -->
      <g class="water">
        <ellipse class="ripple r1" cx="200" cy="308" rx="150" ry="18" />
        <ellipse class="ripple r2" cx="200" cy="308" rx="150" ry="18" />
        <ellipse class="ripple r3" cx="200" cy="308" rx="150" ry="18" />
      </g>
      <line class="ground" x1="30" y1="308" x2="370" y2="308" />

      <!-- Ghost of the finished mark: the shape the visitor is about to build -->
      <g class="ghost" [style.opacity]="0.32 * (1 - g(2, 0, 0.6))">
        @for (p of petals; track $index) { <path [attr.d]="p.d" /> }
      </g>

      <!-- The seed: a closed bud on the ground line, waiting for the first drawing -->
      <g class="seed" [style.opacity]="1 - g(2, 0, 0.35)">
        <ellipse class="seed-glow" cx="200" cy="292" rx="34" ry="34" />
        <path d="M200 304C186 292 186 270 200 252C214 270 214 292 200 304Z" />
      </g>

      <!-- Stage 1: layout. Grid, axes, setting-out circles, dashed petal outlines -->
      <g class="blueprint" [style.opacity]="scaffold()">
        <rect width="400" height="400" [attr.fill]="'url(#' + id + '-grid)'" [attr.mask]="'url(#' + id + '-mask)'" class="grid"
          [style.opacity]="0.38 + g(0, 0, 0.5) * 0.25" />
        <line x1="200" y1="70" x2="200" y2="330" pathLength="1" [style.stroke-dashoffset]="1 - g(0, 0.1, 0.5)" />
        <circle cx="200" cy="300" r="160" pathLength="1" [style.stroke-dashoffset]="1 - g(0, 0.2, 0.7)" />
        <circle cx="200" cy="300" r="100" pathLength="1" [style.stroke-dashoffset]="1 - g(0, 0.3, 0.8)" />
        <circle cx="200" cy="150" r="46" pathLength="1" [style.stroke-dashoffset]="1 - g(0, 0.4, 0.9)" />
        @for (p of petals; track $index) {
          <path class="setout" [attr.d]="p.d" pathLength="1"
            [style.stroke-dashoffset]="1 - g(0, 0.35 + $index * 0.08, 0.75 + $index * 0.04)" />
        }
        <text x="206" y="82" class="dim" [style.opacity]="g(0, 0.4, 0.9)">⌀ 320</text>
        <text x="36" y="300" class="dim" [style.opacity]="g(0, 0.2, 0.6)">±0.00</text>
      </g>

      <!-- Stage 3: construction. Petals revealed bottom-up inside a rising clip -->
      <g class="petals" [attr.clip-path]="'url(#' + id + '-rise)'">
        @for (p of petals; track $index) {
          <path [attr.d]="p.d" [style.fill]="p.fill" class="petal" [attr.data-tier]="p.tier"
            [style.transform]="open(p)" />
        }
      </g>
      <!-- Floor courses during construction -->
      <g class="courses" [style.opacity]="courses()">
        @for (y of floors; track y) {
          <line x1="40" [attr.y1]="y" x2="360" [attr.y2]="y" [style.opacity]="riseY() <= y ? 1 : 0" />
        }
        <line class="level" x1="30" [attr.y1]="riseY()" x2="370" [attr.y2]="riseY()" />
      </g>

      <!-- Stage 2: electrical. Current traces every outline -->
      <g class="current" [attr.filter]="'url(#' + id + '-glow)'" [style.opacity]="currentFade()">
        @for (p of petals; track $index) {
          <path [attr.d]="p.d" pathLength="1"
            [style.stroke-dashoffset]="1 - g(1, $index * 0.07, 0.55 + $index * 0.06)"
            [style.transform]="open(p)" />
        }
        @for (n of nodes; track $index) {
          <circle [attr.cx]="n[0]" [attr.cy]="n[1]" r="3.2" [style.opacity]="g(1, 0.5 + $index * 0.05, 0.7 + $index * 0.05)" />
        }
      </g>

      <!-- Stage 4: associated services. Inner veins and the figure -->
      <g class="detail" [style.transform]="open(petals[6])">
        <path class="vein" d="M200 292C188 260 186 200 200 128" pathLength="1" [style.stroke-dashoffset]="1 - g(3, 0, 0.5)" />
        <path class="vein" d="M196 290C170 260 146 214 140 168" pathLength="1" [style.stroke-dashoffset]="1 - g(3, 0.1, 0.6)" />
        <path class="vein" d="M204 290C230 260 254 214 260 168" pathLength="1" [style.stroke-dashoffset]="1 - g(3, 0.1, 0.6)" />
        <circle class="head" cx="200" cy="150" r="11" [style.opacity]="g(3, 0.3, 0.7)"
          [style.transform]="'scale(' + (0.4 + 0.6 * g(3, 0.3, 0.7)) + ')'" />
        <path class="figure" d="M200 168C178 186 180 210 200 222C220 234 222 258 200 278" pathLength="1"
          [style.stroke-dashoffset]="1 - g(3, 0.4, 1)" />
      </g>
      <path class="curl" d="M108 130C94 142 92 164 106 178" pathLength="1" [style.stroke-dashoffset]="1 - g(3, 0.5, 1)" />
      <path class="curl" d="M292 130C306 142 308 164 294 178" pathLength="1" [style.stroke-dashoffset]="1 - g(3, 0.5, 1)" />
    </svg>
  `,
  styles: `
    :host { display: block; color: var(--blueprint); }
    svg { width: 100%; height: auto; overflow: visible; }
    line, circle, path { vector-effect: non-scaling-stroke; }
    [pathLength] { stroke-dasharray: 1; }

    .ground { stroke: var(--blueprint); stroke-width: 1.5; stroke-opacity: 0.8; }
    .ghost path { fill: none; stroke: var(--blueprint-bright); stroke-width: 1; stroke-dasharray: 3 5; }
    .seed path { fill: var(--lotus); }
    .seed-glow { fill: var(--lotus); opacity: 0.18; filter: blur(14px); transform-box: fill-box; transform-origin: center; }
    :host(:not(.still)) .seed-glow { animation: breathe 3.6s ease-in-out infinite; }
    @keyframes breathe { 50% { opacity: 0.32; transform: scale(1.25); } }
    .blueprint { transition: opacity 0.4s linear; }
    .blueprint line, .blueprint circle { fill: none; stroke: var(--blueprint); stroke-width: 1; }
    .blueprint circle { stroke-opacity: 0.7; }
    .blueprint .grid { color: var(--blueprint); }
    .setout { fill: none; stroke: var(--blueprint-bright); stroke-width: 1.2; }
    .dim { fill: var(--blueprint); font: 600 9px var(--font); letter-spacing: 0.06em; opacity: 0.85; }

    .petal { transform-box: view-box; transform-origin: 200px 302px; transition: transform 1.2s var(--ease-out); }
    .courses line { stroke: rgba(255, 255, 255, 0.28); stroke-width: 0.8; transition: opacity 0.3s; }
    .courses .level { stroke: var(--spark); stroke-width: 1.6; }

    .current path { fill: none; stroke: var(--spark); stroke-width: 1.6; transform-box: view-box; transform-origin: 200px 302px; }
    .current circle { fill: var(--spark); }

    .detail { transform-box: view-box; transform-origin: 200px 302px; transition: transform 1.2s var(--ease-out); }
    .vein { fill: none; stroke: rgba(255, 255, 255, 0.55); stroke-width: 1; }
    .head { fill: #fff; transform-box: fill-box; transform-origin: center; }
    .figure { fill: none; stroke: #fff; stroke-width: 3.2; stroke-linecap: round; }
    .curl { fill: none; stroke: var(--lotus-light); stroke-width: 2.4; stroke-linecap: round; }

    .ripple { fill: none; stroke: var(--lotus-light); stroke-width: 1.6; opacity: 0; transform-box: fill-box; transform-origin: center; }
    :host(.bloom) .ripple { animation: ripple 4.8s var(--ease-out) infinite; }
    :host(.bloom) .r2 { animation-delay: 1.6s; }
    :host(.bloom) .r3 { animation-delay: 3.2s; }
    @keyframes ripple {
      0% { opacity: 0.85; transform: scale(0.75); }
      100% { opacity: 0; transform: scale(1.5); }
    }
    :host(.still) .ripple { animation: none; }
  `,
})
export class LotusBuild {
  /** Six stage progress values, each 0..1. */
  readonly t = input<number[]>([1, 1, 1, 1, 1, 1]);
  readonly still = input(false);

  protected readonly id = 'lb' + ++uid;
  protected readonly petals = PETALS;
  protected readonly floors = [290, 270, 250, 230, 210, 190, 170, 150, 130, 110];
  protected readonly nodes: [number, number][] = [
    [200, 104], [125, 150], [275, 150], [60, 205], [340, 205], [40, 285], [360, 285], [200, 302],
  ];

  // Petals rise from the ground line (y 312) to the crown (y 96).
  protected readonly riseY = computed(() => 312 - 216 * this.ease(this.stage(2)));
  protected readonly courses = computed(() => {
    const c = this.stage(2);
    return c <= 0 ? 0 : c >= 1 ? 1 - this.stage(4) : 1;
  });
  protected readonly scaffold = computed(() => 1 - 0.85 * this.stage(4));
  protected readonly currentFade = computed(() => 1 - 0.75 * this.stage(4));
  protected readonly bloom = computed(() => this.stage(5) > 0.5);
  protected readonly label = computed(() => {
    const done = this.t().filter((v) => v >= 1).length;
    return `Shri Kamal lotus, ${done} of 6 stages built`;
  });

  /** Local progress of stage `i` between fractions a..b of that stage. */
  protected g(i: number, a: number, b: number) {
    return clamp((this.stage(i) - a) / Math.max(0.001, b - a));
  }

  protected open(p: Petal) {
    const m = this.ease(this.stage(5));
    if (!m) return null;
    const deg = [10, 9, 5, 0][p.tier] * p.side * m;
    const s = 1 + 0.04 * m;
    return `rotate(${deg}deg) scale(${s})`;
  }

  private stage(i: number) {
    return clamp(this.t()[i] ?? 0);
  }
  private ease(x: number) {
    return 1 - Math.pow(1 - x, 3);
  }
}
