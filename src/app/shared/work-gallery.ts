import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { work } from '../data/site';

// Real site photographs from the client. Used on every theme's home and on Projects.
@Component({
  selector: 'app-work-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="gallery" [class.tint]="tint()" aria-labelledby="work-gal-h">
      <div class="wrap">
        <div class="head">
          <h2 id="work-gal-h">From our work.</h2>
          <p>
            An analytical laboratory we delivered: instrument benches with power and data at every station,
            extraction over the wet benches, and glazed rooms for the sensitive kit.
          </p>
        </div>
        <ul class="grid">
          @for (w of photos; track w.src; let i = $index) {
            <li [class.big]="i === 0">
              <a [href]="w.src" target="_blank" rel="noopener">
                <img [src]="w.small" [attr.srcset]="w.small + ' 800w, ' + w.src + ' 1600w'"
                  [attr.sizes]="i === 0 ? '(max-width: 760px) 100vw, 66vw' : '(max-width: 760px) 50vw, 33vw'"
                  [alt]="w.alt" width="1600" height="717" loading="lazy" decoding="async" />
                <span class="visually-hidden"> (opens full size)</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .gallery { padding-block: clamp(4.5rem, 10vw, 8rem); }
    .gallery.tint { background: var(--mist); }
    .head {
      display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(1.5rem, 4vw, 4rem);
      align-items: end; margin-bottom: clamp(2rem, 4vw, 3rem);
    }
    h2 { font-size: clamp(2.4rem, 4.6vw, 4rem); color: var(--navy); }
    .head p { max-width: 50ch; color: var(--ink-2); }
    .grid {
      display: grid; grid-template-columns: repeat(6, minmax(0, 1fr));
      grid-auto-rows: clamp(140px, 15vw, 230px); gap: clamp(6px, 0.8vw, 12px);
      margin: 0; padding: 0; list-style: none;
    }
    li { grid-column: span 2; }
    li.big { grid-column: span 4; grid-row: span 2; }
    a { position: relative; display: block; height: 100%; overflow: hidden; border-radius: var(--radius); background: var(--navy-900); }
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--ease-out); }
    a:hover img { transform: scale(1.04); }
    @media (max-width: 760px) {
      .head { grid-template-columns: 1fr; gap: 1rem; }
      .grid { grid-template-columns: 1fr 1fr; grid-auto-rows: clamp(110px, 30vw, 180px); }
      li { grid-column: span 1; }
      li.big { grid-column: span 2; grid-row: span 2; }
      li:last-child:nth-child(even) { grid-column: span 2; }
    }
  `,
})
export class WorkGallery {
  protected readonly photos = work;
  /** Mist ground, for when the section above is white. */
  readonly tint = input(false);
}
