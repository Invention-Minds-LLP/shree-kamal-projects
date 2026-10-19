import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { company, contact, nav } from '../data/site';
import { Icon } from './icon';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <header class="bar" [class.open]="open()">
      <div class="inner wrap">
        <a routerLink="/" class="mark" aria-label="Shri Kamal Projects, home">
          <img src="/brand/lotus.png" alt="" width="48" height="48" />
          <span class="words">
            <span class="name">Shri Kamal Projects</span>
            <span class="tag">{{ company.tagline }}</span>
          </span>
        </a>

        <nav id="site-nav" class="nav" aria-label="Main">
          <ul>
            @for (item of nav; track item.path) {
              <li>
                <a [routerLink]="item.path" routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.path === '/' }"
                  ariaCurrentWhenActive="page">{{ item.label }}</a>
              </li>
            }
          </ul>
          <a class="btn call" [href]="'tel:' + phone.tel">
            <app-icon name="phone" />
            <span class="tnum">{{ phone.display }}</span>
          </a>
        </nav>

        <button type="button" class="toggle" (click)="open.set(!open())"
          [attr.aria-expanded]="open()" aria-controls="site-nav">
          <app-icon [name]="open() ? 'close' : 'menu'" size="26px" />
          <span class="visually-hidden">{{ open() ? 'Close menu' : 'Open menu' }}</span>
        </button>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; position: sticky; top: 0; z-index: 50; }
    .bar {
      background: #fff; color: var(--ink);
      border-bottom: 1px solid var(--rule-ink);
    }
    .inner { display: flex; align-items: center; gap: 1.5rem; min-height: var(--header-h); }

    .mark { display: flex; align-items: center; gap: 0.7rem; text-decoration: none; flex: none; }
    .mark img { width: 48px; height: 48px; }
    .words { display: grid; line-height: 1.1; }
    .name { font-family: var(--font-display); font-size: 1.35rem; color: var(--brand-blue); letter-spacing: 0.01em; }
    .tag { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lotus-deep); }

    .nav { display: flex; align-items: center; gap: 1.25rem; margin-left: auto; }
    .nav ul { display: flex; gap: 0.1rem; margin: 0; padding: 0; list-style: none; }
    .nav ul a {
      position: relative; display: block; padding: 0.7rem 0.75rem; text-decoration: none;
      font-weight: 550; font-size: 0.98rem; color: var(--ink-2); transition: color 0.2s var(--ease-out);
    }
    .nav ul a:hover { color: var(--ink); }
    .nav ul a::after {
      content: ''; position: absolute; left: 50%; bottom: 0.25rem; width: 6px; height: 6px; margin-left: -3px;
      border-radius: 50%; background: var(--lotus); transform: scale(0); transition: transform 0.3s var(--ease-out);
    }
    .nav ul a.active { color: var(--ink); }
    .nav ul a.active::after { transform: scale(1); }

    .call { min-height: 44px; padding: 0.55rem 1.1rem; font-size: 0.95rem; }
    .toggle {
      display: none; margin-left: auto; width: 48px; height: 48px; border: 0; border-radius: 50%;
      background: transparent; color: var(--ink); cursor: pointer;
    }

    @media (max-width: 1120px) { .tag { display: none; } .nav ul a { padding-inline: 0.55rem; } }
    @media (max-width: 960px) {
      .toggle { display: grid; place-items: center; }
      .nav {
        position: absolute; top: 100%; left: 0; right: 0; margin: 0;
        flex-direction: column; align-items: stretch; gap: 1.25rem;
        padding: 0.5rem var(--gutter) 1.5rem; background: #fff;
        border-bottom: 1px solid var(--rule-ink);
        box-shadow: 0 24px 40px -24px rgba(11, 20, 48, 0.35);
        visibility: hidden; opacity: 0; transform: translateY(-8px);
        transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out), visibility 0s 0.25s;
      }
      .open .nav { visibility: visible; opacity: 1; transform: none; transition-delay: 0s; }
      .nav ul { flex-direction: column; }
      .nav ul a { padding: 0.9rem 0; font-family: var(--font-display); font-size: 1.5rem; border-bottom: 1px solid var(--rule-ink); }
      .nav ul a::after { left: auto; right: 0; bottom: 50%; margin: 0 0 -3px; }
    }
    @media (max-width: 400px) { .name { font-size: 1.15rem; } }
  `,
})
export class SiteHeader {
  protected readonly nav = nav;
  protected readonly company = company;
  protected readonly phone = contact.phones[0];
  protected readonly open = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.open.set(false));
  }
}
