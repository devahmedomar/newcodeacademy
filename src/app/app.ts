import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button, Tooltip, FormsModule, Dialog, FloatLabel, InputText, Message],
  styleUrl: './app.css',
  templateUrl: './app.html',
  animations: [
    trigger('routeAnim', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('260ms cubic-bezier(0.2, 0, 0, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class App {
  constructor(public auth: AuthService, public theme: ThemeService, private router: Router) {}

  i18n = inject(I18nService);

  routeState = '';
  private pending = '';

  showPassDialog = false;
  passCurrent = '';
  passNew = '';
  passMsg = '';
  passErr = '';
  changing = false;

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.routeState = this.pending || e.urlAfterRedirects;
    });
  }

  onActivate(instance: unknown) {
    this.pending = (instance as { constructor: { name?: string } })?.constructor?.name ?? '';
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  openPassDialog() {
    this.passCurrent = '';
    this.passNew = '';
    this.passMsg = '';
    this.passErr = '';
    this.showPassDialog = true;
  }

  async changePassword() {
    this.changing = true;
    this.passErr = '';
    this.passMsg = '';
    try {
      await this.auth.changePassword(this.passCurrent, this.passNew);
      this.passCurrent = '';
      this.passNew = '';
      this.passMsg = this.i18n.t('app.passChanged');
    } catch (e) {
      this.passErr = e instanceof Error ? e.message : this.i18n.t('app.passFailed');
    } finally {
      this.changing = false;
    }
  }

  langToggleLabel() {
    return this.i18n.lang() === 'ar' ? 'EN' : 'العربية';
  }
}