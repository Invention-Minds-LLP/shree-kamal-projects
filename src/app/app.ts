import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CallBand, SiteFooter } from './shared/site-footer';
import { SiteHeader } from './shared/site-header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SiteHeader, SiteFooter, CallBand],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-site-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    @if (showCallBand()) {
      <app-call-band />
    }
    <app-site-footer />
  `,
  styles: `main:focus { outline: none; }`,
})
export class App {
  protected readonly showCallBand = signal(true);

  constructor() {
    const router = inject(Router);
    const route = inject(ActivatedRoute);
    const meta = inject(Meta);
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe((e) => {
        let r = route;
        while (r.firstChild) r = r.firstChild;
        const description = r.snapshot.data['description'];
        if (description) meta.updateTag({ name: 'description', content: description });
        this.showCallBand.set(!(e as NavigationEnd).urlAfterRedirects.startsWith('/contact'));
      });
  }
}
