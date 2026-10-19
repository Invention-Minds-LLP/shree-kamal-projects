import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { contact, sectors, stages } from '../data/site';
import { Icon } from '../shared/icon';
import { PageBoard } from '../shared/page-board';

type Field = 'name' | 'org' | 'phone' | 'email' | 'sector' | 'stage' | 'message';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBoard, Icon],
  template: `
    <app-page-board title="Start a conversation." photo="/construction/stage-5-closure.jpg"
      lead="Call or email directly, or send the details of your facility below and we will call you back." />

    <section class="wrap grid" aria-label="Contact details and enquiry">
      <div class="board card">
        <dl class="fields">
          <dt>Contact</dt>
          <dd><strong class="who">{{ contact.person }}</strong><br />{{ contact.role }}</dd>
          <dt>Phone</dt>
          <dd class="stack">
            @for (p of contact.phones; track p.tel) {
              <a class="tnum big" [href]="'tel:' + p.tel">{{ p.display }}</a>
            }
          </dd>
          <dt>Email</dt>
          <dd><a [href]="'mailto:' + contact.email">{{ contact.email }}</a></dd>
          <dt>Office</dt>
          <dd>
            @for (line of contact.address; track line) { {{ line }}<br /> }
            <a class="map" [href]="contact.mapUrl" target="_blank" rel="noopener">
              Open in Google Maps <app-icon name="external" />
            </a>
          </dd>
        </dl>
        <div class="acts">
          <a class="btn" [href]="'tel:' + contact.phones[0].tel"><app-icon name="phone" />Call now</a>
          <a class="btn line" [href]="'https://wa.me/' + contact.whatsapp" target="_blank" rel="noopener">
            <app-icon name="chat" />WhatsApp
          </a>
        </div>
      </div>

      <form class="form" novalidate (submit)="send($event)" aria-labelledby="form-h">
        <h2 id="form-h">Project enquiry</h2>
        <p class="how">Sending opens your email app with these details filled in, addressed to {{ contact.email }}.</p>

        <div class="row two">
          <label>
            <span>Your name *</span>
            <input name="name" autocomplete="name" [value]="v().name" (input)="set('name', $event)"
              [attr.aria-invalid]="!!err().name" aria-describedby="e-name" />
            <small id="e-name" class="err">{{ err().name }}</small>
          </label>
          <label>
            <span>Organisation *</span>
            <input name="org" autocomplete="organization" [value]="v().org" (input)="set('org', $event)"
              [attr.aria-invalid]="!!err().org" aria-describedby="e-org" />
            <small id="e-org" class="err">{{ err().org }}</small>
          </label>
        </div>
        <div class="row two">
          <label>
            <span>Phone *</span>
            <input name="phone" type="tel" autocomplete="tel" inputmode="tel" [value]="v().phone"
              (input)="set('phone', $event)" [attr.aria-invalid]="!!err().phone" aria-describedby="e-phone" />
            <small id="e-phone" class="err">{{ err().phone }}</small>
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autocomplete="email" [value]="v().email"
              (input)="set('email', $event)" [attr.aria-invalid]="!!err().email" aria-describedby="e-email" />
            <small id="e-email" class="err">{{ err().email }}</small>
          </label>
        </div>
        <div class="row two">
          <label>
            <span>Sector</span>
            <select name="sector" (change)="set('sector', $event)">
              <option value="">Choose a sector</option>
              @for (s of sectors; track s.id) { <option [value]="s.name">{{ s.name }}</option> }
              <option value="Other industrial">Other industrial</option>
            </select>
          </label>
          <label>
            <span>Where are you?</span>
            <select name="stage" (change)="set('stage', $event)">
              <option value="">Choose a stage</option>
              <option value="Planning a new facility">Planning a new facility</option>
              @for (s of stages; track s.id) { <option [value]="'Need: ' + s.name">Need: {{ s.name }}</option> }
            </select>
          </label>
        </div>
        <label>
          <span>About the project</span>
          <textarea name="message" rows="5" [value]="v().message" (input)="set('message', $event)"
            placeholder="Site location, approximate area, timeline, anything we should know."></textarea>
        </label>

        <button class="btn submit" type="submit"><app-icon name="mail" />Send enquiry</button>
        @if (sent()) {
          <p class="ok" role="status"><app-icon name="check" />Your email app should now be open with the enquiry. If it did not open, call us on {{ contact.phones[0].display }}.</p>
        }
      </form>
    </section>
  `,
  styles: `
    :host { display: block; }
    .grid {
      display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.2fr); gap: clamp(1.5rem, 4vw, 3.5rem);
      padding-block: clamp(2.5rem, 6vw, 4.5rem) clamp(4rem, 9vw, 7rem); align-items: start;
    }
    .card { padding: clamp(1.75rem, 3.5vw, 3rem); }
    .who { font-family: var(--font-display); font-weight: 400; font-size: 1.5rem; }
    .stack { display: grid; gap: 0.2rem; }
    .big { font-family: var(--font-display); font-size: 1.7rem; text-decoration: none; }
    .big:hover { color: var(--lotus-light); }
    .map { display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.5rem; color: var(--lotus-light); font-weight: 600; }
    .map svg { width: 16px; height: 16px; }
    .acts { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }

    .form {
      display: grid; gap: 1.1rem; padding: clamp(1.5rem, 3.5vw, 3rem); background: #fff;
      border-radius: 6px;
      box-shadow: 0 16px 30px -18px rgba(10,20,48,0.45), 0 2px 6px rgba(10,20,48,0.12);
    }
    h2 { font-size: clamp(2.2rem, 4vw, 3.2rem); color: var(--navy-900); }
    .how { color: var(--on-steel-dim); font-size: 0.95rem; margin-top: -0.4rem; }
    .row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
    label { display: grid; gap: 0.35rem; }
    label > span {
      font-stretch: 75%; font-weight: 700; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--navy-900);
    }
    input, select, textarea {
      width: 100%; min-height: 48px; padding: 0.7rem 0.8rem; border: 0; border-radius: 4px 4px 0 0;
      background: var(--steel-100); color: var(--on-steel); font: inherit; font-size: 1rem;
      box-shadow: inset 0 -2px 0 var(--steel-500);
      transition: box-shadow 0.2s var(--ease-out), background-color 0.2s var(--ease-out);
      caret-color: var(--magenta);
    }
    textarea { resize: vertical; min-height: 130px; }
    input::placeholder, textarea::placeholder { color: #5f6773; }
    input:hover, select:hover, textarea:hover { background: var(--steel-200); }
    input:focus, select:focus, textarea:focus { outline: none; background: #fff; box-shadow: inset 0 -3px 0 var(--navy), 0 0 0 2px var(--lotus-light); }
    [aria-invalid='true'] { box-shadow: inset 0 -3px 0 #c0262d; background: #fdf0f0; }
    .err { min-height: 0; color: #b3141c; font-weight: 600; font-size: 0.86rem; }
    .err:empty { display: none; }
    .submit { justify-self: start; margin-top: 0.4rem; }
    .ok { display: flex; gap: 0.5rem; align-items: start; color: var(--navy-900); font-weight: 500; }
    .ok svg { width: 20px; height: 20px; flex: none; color: #1f8a4c; margin-top: 2px; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
    @media (max-width: 560px) { .row.two { grid-template-columns: 1fr; } }
  `,
})
export class Contact {
  protected readonly contact = contact;
  protected readonly sectors = sectors;
  protected readonly stages = stages;

  protected readonly v = signal<Record<Field, string>>({
    name: '', org: '', phone: '', email: '', sector: '', stage: '', message: '',
  });
  protected readonly err = signal<Partial<Record<Field, string>>>({});
  protected readonly sent = signal(false);

  protected set(field: Field, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.v.update((v) => ({ ...v, [field]: value }));
    if (this.err()[field]) this.err.update((x) => ({ ...x, [field]: '' }));
  }

  protected send(e: Event) {
    e.preventDefault();
    const v = this.v();
    const err: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) err.name = 'Enter your name so we know who to ask for.';
    if (!v.org.trim()) err.org = 'Enter your organisation. We work with corporate and industrial clients.';
    if (v.phone.replace(/\D/g, '').length < 10) err.phone = 'Enter a phone number with at least 10 digits.';
    if (v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) err.email = 'Check the email address, or leave it blank.';
    this.err.set(err);
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0];
      (document.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    const body = [
      `Name: ${v.name}`,
      `Organisation: ${v.org}`,
      `Phone: ${v.phone}`,
      v.email && `Email: ${v.email}`,
      v.sector && `Sector: ${v.sector}`,
      v.stage && `Stage: ${v.stage}`,
    ].filter(Boolean).join('\n') + (v.message.trim() ? `\n\n${v.message}` : '');
    const subject = `Project enquiry: ${v.org}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.sent.set(true);
  }
}
