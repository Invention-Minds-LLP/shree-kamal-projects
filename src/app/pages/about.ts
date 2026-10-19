import { ChangeDetectionStrategy, Component } from '@angular/core';
import { company, contact } from '../data/site';
import { PageBoard } from '../shared/page-board';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBoard],
  template: `
    <app-page-board title="About us." photo="/construction/stage-2-electrical.jpg"
      lead="A Bengaluru engineering and construction firm for technical buildings: the ones that make medicine, run tests and treat patients.">
      <dl class="fields">
        <dt>Established</dt><dd class="tnum">{{ company.established }}</dd>
        <dt>Team</dt><dd class="tnum">About {{ company.team }} people</dd>
        <dt>Delivered</dt><dd class="tnum">{{ company.projects }} projects</dd>
        <dt>Based in</dt><dd>RT Nagar, Bengaluru</dd>
        <dt>Clients</dt><dd>{{ company.clients }}</dd>
      </dl>
    </app-page-board>

    <section class="wrap story" aria-labelledby="story-h">
      <div class="lotus">
        <span class="logo-plate"><img src="/brand/logo-card-crop.png" alt="Shri Kamal Projects logo" width="290" height="295" loading="lazy" /></span>
        <p class="cap">Kamal is the lotus. It grows clean out of a working site.</p>
      </div>
      <div class="text">
        <h2 id="story-h">Electrical, building construction, and everything they depend on.</h2>
        <p>
          Shri Kamal Projects was set up in {{ company.established }} to give pharma, research and healthcare
          organisations one accountable contractor for their facilities. We take a project from the layout
          drawing through electrical and building construction and the associated works a technical building
          depends on, to final closure. Then we stay on to maintain it.
        </p>
        <p>
          We work only with corporate and industrial clients. That focus is deliberate: the rooms we build have
          equipment, processes and inspections behind them, and they need a team that thinks that way from the
          first drawing.
        </p>

        <h3>How we work</h3>
        <dl class="ways">
          <dt>One point of accountability</dt>
          <dd>Design, electrical, civil and dependent works run under one programme and one site team.</dd>
          <dt>Built around your process</dt>
          <dd>Layouts follow how your people, materials, samples or patients actually move.</dd>
          <dt>We stay after handover</dt>
          <dd>Maintenance comes from the team that built it and knows where every cable runs.</dd>
        </dl>

        <div class="person board">

          <p class="nm">{{ contact.person }}</p>
          <p class="lbl">{{ contact.role }}</p>
          <p class="ph tnum">
            @for (p of contact.phones; track p.tel; let last = $last) {
              <a [href]="'tel:' + p.tel">{{ p.display }}</a>@if (!last) { <span aria-hidden="true"> · </span> }
            }
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .story {
      display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr); gap: clamp(2rem, 6vw, 6rem);
      padding-block: clamp(3.5rem, 8vw, 6.5rem);
    }
    .lotus { align-self: start; position: sticky; top: 120px; }
    .logo-plate { display: block; padding: clamp(1rem, 3vw, 2.5rem); background: #fff; box-shadow: 0 16px 30px -18px rgba(10,20,48,0.45); }
    .logo-plate img { width: 100%; height: auto; max-width: 340px; margin-inline: auto; }
    .cap { margin-top: 1rem; font-size: 0.95rem; color: var(--on-steel-dim); max-width: 32ch; }
    .text { max-width: 68ch; }
    h2 { font-size: clamp(2.3rem, 4.6vw, 3.8rem); color: var(--navy-900); margin-bottom: 1.5rem; }
    .text > p { margin-bottom: 1.1rem; font-size: 1.1rem; color: var(--on-steel); }
    h3 { font-size: 2rem; color: var(--navy-900); margin: 2.5rem 0 1rem; }
    .ways { margin: 0; border-top: 2px solid var(--navy-900); }
    .ways dt {
      padding-top: 1rem; font-family: var(--font-display); font-size: 1.45rem;
      color: var(--navy);
    }
    .ways dd { margin: 0.25rem 0 0; padding-bottom: 1rem; border-bottom: 1px solid var(--rule-ink); color: var(--on-steel-dim); }
    .person { margin-top: 2.5rem; padding: 1.5rem 1.75rem; }
    .lbl { font-weight: 550; font-size: 0.95rem; color: var(--on-navy-label); margin-bottom: 0.6rem; }
    .nm { font-family: var(--font-display); font-size: 2.2rem; line-height: 1.1; }
    .ph a { color: var(--on-navy-dim); text-decoration: none; }
    .ph a:hover { color: var(--on-navy); text-decoration: underline; }
    @media (max-width: 860px) {
      .story { grid-template-columns: 1fr; }
      .lotus { position: static; max-width: 280px; }
    }
  `,
})
export class About {
  protected readonly company = company;
  protected readonly contact = contact;
}
