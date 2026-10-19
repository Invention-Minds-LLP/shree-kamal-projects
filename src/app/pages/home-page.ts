import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../theme';
import { Home } from './home';
import { HomeBuild } from './home-build';
import { HomeConstruction } from './home-construction';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Home, HomeBuild, HomeConstruction],
  template: `
    @switch (theme.theme()) {
      @case ('construction') { <app-home-construction /> }
      @case ('build') { <app-home-build /> }
      @default { <app-home /> }
    }
  `,
})
export class HomePage {
  protected readonly theme = inject(ThemeService);
}
