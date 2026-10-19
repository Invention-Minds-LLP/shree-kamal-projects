import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { company, contact, nav, sectors } from '../data/site';
import { Icon } from './icon';

@Component({
  selector: 'app-call-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="band" aria-labelledby="call-band-h">
      <div class="wrap inner">
        <h2 id="call-band-h">Planning a new facility or a refit?</h2>
        <div class="side">
          <p>
            Talk to {{ contact.person }}, {{ contact.role }}, before the layout is fixed.
            Changing a drawing costs far less than changing a wall.
          </p>
          <div class="actions">
            @for (p of contact.phones; track p.tel; let first = $first) {
              <a class="btn" [class.line]="!first" [href]="'tel:' + p.tel">
                <app-icon name="phone" /><span class="tnum">{{ p.display }}</span>
              </a>
            }
            <a class="btn line" [href]="'mailto:' + contact.email">
              <app-icon name="mail" />Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .band { background: var(--petal); color: var(--navy); }
    .inner {
      display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(1.5rem, 4vw, 4rem);
      align-items: end; padding-block: clamp(3.5rem, 8vw, 6.5rem);
    }
    h2 { font-size: clamp(2.6rem, 6.4vw, 5.6rem); }
    p { max-width: 46ch; font-size: 1.12rem; color: var(--on-yellow-dim); font-weight: 500; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.6rem; }
    .btn.line { color: var(--navy); }
    .btn.line:hover { --_bg: rgba(156, 22, 91, 0.07); }
    @media (max-width: 860px) { .inner { grid-template-columns: 1fr; } }
  `,
})
export class CallBand {
  protected readonly contact = contact;
}

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <footer class="foot">
      <div class="wrap grid">
        <div class="brand">
          <a routerLink="/" class="fmark" aria-label="Shri Kamal Projects, home">
            <img src="/brand/lotus.png" alt="" width="72" height="72" loading="lazy" />
            <span class="fname">Shri Kamal Projects</span>
            <span class="ftag">{{ company.tagline }}</span>
          </a>
          <p class="est tnum">Bengaluru · Est. {{ company.established }}</p>
        </div>

        <nav aria-label="Footer">
          <h2 class="h">Site</h2>
          <ul>
            @for (item of nav; track item.path) {
              <li><a [routerLink]="item.path">{{ item.label }}</a></li>
            }
          </ul>
        </nav>

        <div>
          <h2 class="h">Sectors</h2>
          <ul>
            @for (s of sectors; track s.id) {
              <li><a routerLink="/sectors" [fragment]="s.id">{{ s.name }}</a></li>
            }
          </ul>
        </div>

        <address>
          <h2 class="h">Office</h2>
          <p>
            @for (line of contact.address; track line) { {{ line }}<br /> }
          </p>
          <ul class="lines">
            @for (p of contact.phones; track p.tel) {
              <li><a class="tnum" [href]="'tel:' + p.tel"><app-icon name="phone" />{{ p.display }}</a></li>
            }
            <li><a [href]="'mailto:' + contact.email"><app-icon name="mail" />{{ contact.email }}</a></li>
          </ul>
        </address>
      </div>
      <div class="wrap legal">
        <span>© {{ year }} {{ company.name }}</span>
        <span>{{ company.clients }}</span>
      </div>
    </footer>
  `,
  styles: `
    .foot { background: var(--navy-950); color: var(--on-navy-dim); }
    .grid {
      display: grid; grid-template-columns: 1.2fr 0.7fr 0.9fr 1.3fr; gap: 2.5rem;
      padding-block: 4rem 3rem;
    }
    .fmark { display: grid; justify-items: start; gap: 0.2rem; text-decoration: none; }
    .fmark:hover { text-decoration: none; }
    .fmark img { width: 72px; height: 72px; margin-bottom: 0.4rem; }
    .fname { font-family: var(--font-display); font-size: 1.7rem; color: var(--on-navy); line-height: 1.1; }
    .ftag { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lotus-light); }
    .est { margin-top: 1.25rem; font-size: 0.92rem; }
    .h {
      font-size: 1.3rem; color: var(--on-navy); margin-bottom: 1rem;
    }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
    a { text-decoration: none; transition: color 0.2s var(--ease-out); }
    a:hover { color: var(--on-navy); text-decoration: underline; }
    address { font-style: normal; }
    address p { margin-bottom: 1rem; }
    .lines a { display: inline-flex; align-items: center; gap: 0.5rem; }
    .lines svg { width: 16px; height: 16px; color: var(--lotus-light); }
    .legal {
      display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem;
      padding-block: 1.25rem 2rem; border-top: 1px solid var(--rule-navy); font-size: 0.88rem;
    }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class SiteFooter {
  protected readonly company = company;
  protected readonly contact = contact;
  protected readonly nav = nav;
  protected readonly sectors = sectors;
  protected readonly year = new Date().getFullYear();
}
